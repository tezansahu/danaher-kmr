from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from typing import List

from db import schemas, crud
from db.database import SessionLocal
from utils import utils

from datetime import date
import os

router = APIRouter()


@router.get("/", response_model=List[schemas.FileInfo])
async def get_folders_by_user(user_id: int = None, db: Session = Depends(utils.get_db)):
    return crud.get_folders_by_creator(db, user_id)


@router.get("/folder/{id}", response_model=schemas.FolderInfo)
async def get_folder_details(id: int, db: Session = Depends(utils.get_db)):
    db_folder = crud.get_folder_by_id(db, id=id)
    if not db_folder:
        raise HTTPException(status_code=404, detail="Folder not found")
    return db_folder

@router.post("/create", response_model=schemas.FileInfo)
async def create_folder(folder: schemas.FileBase, db: Session = Depends(utils.get_db)):
    root_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "kmr_storage")

    if folder.parent:
        # Check if folder with same name already exists in the parent folder
        db_folder = crud.get_folder_by_name_in_parent(db, name=folder.name, parent=folder.parent)
        if db_folder:
            raise HTTPException(status_code=400, detail="Folder with same name already exists")
        # Get details of parent folder for the folder to be created
        parent_folder = crud.get_file_by_id(db, folder.parent)
        parent_abs_path = parent_folder.abs_path
    else:
        # If folder doesn't have parent, use the standard parent folder
        curr_date = date.today()
        parent_name = f"{curr_date.strftime('%Y')}-{curr_date.strftime('%B')}"
        
        # First check if the standard parent folder for this month exists
        parent_folder = crud.get_folder_by_name_in_parent(db, name=parent_name, parent=None)
        if not parent_folder:
            # Create the standard parent folder for this month on disk
            parent_abs_path = os.path.join(root_path, parent_name)
            os.makedirs(parent_abs_path)

            # Add an entry to the database
            std_parent = schemas.FolderCreate(
                name=parent_name,
                abs_path=parent_abs_path,
                is_folder=True,
                parent=None,
                created_by=None,
                created_on=curr_date
            )
            parent_folder = crud.create_folder(db=db, f=std_parent)
            folder.parent = parent_folder.id
        else:
            # If the standerd parent folder exists, get its details
            folder.parent = parent_folder.id
            parent_abs_path = parent_folder.abs_path

    # Check if the user is authorized to edit the parent folder. To be eligible, following hold:
    #   1. The parent folder is a standard parent folder of the format <month>-<year>, for which `created_by` is NULL
    #   2. The parent folder was acreated by the same user trying to create this folder
    if not (parent_folder.created_by == None or parent_folder.created_by == folder.created_by):
        raise HTTPException(status_code=401, detail="Unauthorized to create this folder")
    
    # Create the folder on disk
    abs_path = os.path.join(parent_abs_path, folder.name)
    os.makedirs(abs_path)

    # Add the new details & create the database entry for the folder
    new_folder = schemas.FolderCreate(
        name=folder.name,
        abs_path=abs_path,
        is_folder=True,
        parent=folder.parent,
        created_by=folder.created_by,
        created_on=date.today()
    )
    return crud.create_folder(db=db, f=new_folder)


@router.patch("/rename", response_model=schemas.FileInfo)
def rename_folder(folder: schemas.FileRename, db: Session = Depends(utils.get_db)):
    db_folder = crud.get_file_by_id(db, id=folder.id)
    # Check if the folder exists
    if not db_folder or db_folder.is_folder != True:
        raise HTTPException(status_code=404, detail="Folder not found")
    
    # Check that the user is actually the creator of the folder
    if db_folder.created_by != folder.created_by:
        raise HTTPException(status_code=401, detail="Unauthorized to rename folder")
    
    # Rename the folder in the database
    new_abs_path = db_folder.abs_path.replace(db_folder.name, folder.new_name)
    os.rename(db_folder.abs_path, new_abs_path)
    db_folder = crud.update_folder_name(db, folder)
    return db_folder