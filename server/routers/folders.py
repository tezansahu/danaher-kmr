from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session

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

@router.get("/{id}", response_model=schemas.FolderInfo)
async def get_folder_details(id: str, db: Session = Depends(get_db)):
    db_folder = crud.get_folder_by_id(db, id=id)
    if not db_folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    return db_folder

@router.post("/create", response_model=schemas.FolderInfo)
async def create_folder(folder: schemas.FolderCreate, db: Session = Depends(get_db)):
    root_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "kmr_storage")

    if folder.parent:
        # Check if folder with same name already exists in the parent folder
        db_folder = crud.get_folder_by_name_in_parent(db, name=folder.name, parent=folder.parent)
        if db_folder:
            raise HTTPException(status_code=400, detail="Folder with same name already exists")
        parent_folder = crud.get_folder_by_id(db, folder.parent)
        parent_abs_path = parent_folder.abs_path
    else:
        # If folder doesn't have parent, first create the standard parent folder
        curr_date = date.today()
        parent_name = f"{curr_date.strftime('%Y')}-{curr_date.strftime('%B')}"
        
        parent_folder = crud.get_folder_by_name_in_parent(db, name=parent_name, parent=None)
        if not parent_folder:
            parent_abs_path = os.join(root_path, parent_name)
            os.makedirs(parent_abs_path)

            std_parent = schemas.FolderCreate(
                name=parent_name,
                abs_path=parent_abs_path,
                is_folder=True,
                parent=None,
                created_by=None,
                created_on=curr_date
            )
            std_parent = crud.create_folder(db=db, folder=std_parent)
            folder.parent = std_parent.id
        else:
            folder.parent = parent_folder.id
            parent_abs_path = parent_folder.abs_path

    # Create the folder on disk
    abs_path = os.path.join(parent_abs_path, folder.name)
    os.makedirs(abs_path)

    # Add the new details & create the database entry for the folder
    folder.abs_path = abs_path
    folder.is_folder=True
    folder.created_on = date.today()
    return crud.create_folder(db=db, folder=folder)



