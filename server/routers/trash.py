from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List

from db import schemas, crud
from db.database import SessionLocal
from utils import utils

from datetime import date
import os
import shutil

router = APIRouter()


class TrashStatus(BaseModel):
    id: int
    status: str


@router.get("/", response_model=List[schemas.FileInfo])
def get_trash_for_user(user_id: int, db: Session = Depends(utils.get_db)):
    db_user = crud.get_user_by_id(db, id=user_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return crud.get_trash_for_user(db, user_id)


@router.patch("/add", response_model=TrashStatus)
def add_to_trash(f: schemas.FileEditBase, db: Session = Depends(utils.get_db)):
    db_f = crud.get_file_by_id(db, id=f.id)
    if not db_f or db_f.in_trash:
         raise HTTPException(status_code=404, detail="File/Folder not found")
    
    if db_f.created_by != f.created_by:
        raise HTTPException(status_code=401, detail="Unauthorized to add this file/folder to trash")
    
    if db_f.is_folder:
        return crud.add_folder_to_trash(db, f.id)
    else:
        return crud.add_file_to_trash(db, f.id)


@router.patch("/restore", response_model=TrashStatus)
def restore_from_trash(f: schemas.FileEditBase, db: Session = Depends(utils.get_db)):
    db_f = crud.get_file_by_id(db, id=f.id)
    if not db_f or not db_f.in_trash:
         raise HTTPException(status_code=404, detail="File/Folder not found in trash")
    
    if db_f.created_by != f.created_by:
        raise HTTPException(status_code=401, detail="Unauthorized to restore this file/folder from trash")
    
    parent_folder = crud.get_file_by_id(db, db_f.parent)
    if parent_folder.in_trash:
        raise HTTPException(status_code=400, detail="Unable to restore file/folder. Parent has been deleted")

    if db_f.is_folder:
        return crud.restore_folder_from_trash(db, f.id)
    else:
        return crud.restore_file_from_trash(db, f.id)


@router.delete("/delete", response_model=TrashStatus)
def delete_from_trash(f: schemas.FileEditBase, db: Session = Depends(utils.get_db)):
    db_f = crud.get_file_by_id(db, id=f.id)
    if not db_f or not db_f.in_trash:
         raise HTTPException(status_code=404, detail="File/Folder not found")
    
    if db_f.created_by != f.created_by:
        raise HTTPException(status_code=401, detail="Unauthorized to delete this file/folder from trash")

    if db_f.is_folder:
        shutil.rmtree(db_f.abs_path)
        return crud.delete_folder_from_trash(db, f.id)
    else:
        os.remove(db_f.abs_path)
        return crud.delete_file_from_trash(db, f.id)