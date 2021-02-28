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

@router.put("/add")
def add_to_trash(f: schemas.FileEditBase, db: Session = Depends(get_db)):
    db_f = crud.get_file_by_id(db, id=f.id)
    if not db_f or db_f.in_trash:
         raise HTTPException(status_code=404, detail="File/Folder not found")
    
    if db_f.created_by != f.created_by:
        raise HTTPException(status_code=401, detail="Unauthorized to add this file/folder to trash")
    
    if db_f.is_folder:
        return crud.add_folder_to_trash(db, f.id)
    else:
        return crud.add_file_to_trash(db, f.id)

@router.put("/restore")
def restore_from_trash(f: schemas.FileEditBase, db: Session = Depends(get_db)):
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