from fastapi import Depends, APIRouter, HTTPException, UploadFile, File, Form
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from db import schemas, crud
from db.database import SessionLocal

import shutil
from datetime import date
import os

router = APIRouter()

def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()


@router.get("/download/{id}")
async def download_file(id: int, db: Session = Depends(get_db)):
    db_file = crud.get_file_by_id(db, id=id)
    # Check if the file exists
    if not db_file or db_file.is_folder:
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(path=db_file.abs_path, filename=db_file.name)

@router.get("/file/{id}", response_model=schemas.FileInfo)
async def download_file(id: int, db: Session = Depends(get_db)):
    db_file = crud.get_file_by_id(db, id=id)
    # Check if the file exists
    if not db_file or db_file.is_folder:
        raise HTTPException(status_code=404, detail="File not found")
    return db_file

@router.post("/upload", response_model=List[schemas.FileInfo])
async def upload_file(created_by: int = Form(...), parent: int = Form(...), files: List[UploadFile] = File(...), db: Session = Depends(get_db)):
    db_folder = crud.get_folder_by_id(db, parent)
    
    # Check if the parent folder exists
    if not db_folder:
        raise HTTPException(status_code=404, detail="Folder not found")

    # Check that the user is actually the creator of the folder
    if db_folder.created_by != created_by:
        raise HTTPException(status_code=401, detail="Unauthorized to upload files to this folder")
    
    response_files = []
    for f in files:
        # Check if file with same name exists in the parent folder. If yes, then append a string to rename the newly uploaded file
        existing_file = crud.get_file_by_name_in_parent(db, f.filename, parent)
        if existing_file:
            f.filename = "new_" + f.filename

        # Save the file to disk
        abs_path = os.path.join(db_folder.abs_path, f.filename)
        with open(abs_path, "wb") as buffer:
            shutil.copyfileobj(f.file, buffer)

        # Create an entry in the database as well
        new_file = schemas.FileCreate(
            name=f.filename,
            abs_path=abs_path,
            is_folder=False,
            parent=parent,
            created_by=created_by,
            created_on=date.today(),
            size=os.path.getsize(abs_path),
            file_type=os.path.splitext(abs_path)[1][1:]
        )
        response_files.append(crud.create_file(db=db, f=new_file))
    
    return response_files

@router.patch("/rename", response_model=schemas.FileInfo)
def rename_file(file: schemas.FileRename, db: Session = Depends(get_db)):
    db_file = crud.get_file_by_id(db, id=file.id)
    # Check if the file exists
    if not db_file or db_file.is_folder:
        raise HTTPException(status_code=404, detail="File not found")
    
    # Check that the user is actually the creator of the file
    if db_file.created_by != file.created_by:
        raise HTTPException(status_code=401, detail="Unauthorized to rename File")
    
    # Rename the file in the database
    new_abs_path = db_file.abs_path.replace(db_file.name, file.new_name)
    os.rename(db_file.abs_path, new_abs_path)
    db_file = crud.update_file_name(db, file)
    return db_file