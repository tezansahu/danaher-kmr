from fastapi import Depends, APIRouter, HTTPException, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from typing import List

from db import schemas, crud
from db.database import SessionLocal

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


@router.get("/file/{id}")
async def download_file(id: int, db: Session = Depends(get_db)):
    db_file = crud.get_file_by_id(db, id=id)
    # Check if the file exists
    if not db_file or db_file.is_folder:
        raise HTTPException(status_code=404, detail="File not found")
    
    return FileResponse(path=db_file.abs_path, filename=db_file.name)


@router.post("/upload", response_model=schemas.FileInfo)
async def upload_file(file: UploadFile = File(...), db: Session = Depends(get_db)):
    pass


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