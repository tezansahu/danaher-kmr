from sqlalchemy.orm import Session
import os
import datetime
from . import models, schemas

#####################################
############ User-related ###########
#####################################

def get_user_by_email(db: Session, email_id: str):
    return db.query(models.User).filter(models.User.email_id == email_id).first()

def get_user_by_id(db: Session, id: int):
    return db.query(models.User).filter(models.User.id == id).first()

def create_user(db: Session, user: schemas.UserRegister):
    db_user = models.User(
        name=user.name, 
        passwd_hashed=user.passwd_hashed, 
        op_co=user.op_co,
        email_id=user.email_id,
        contact_no=user.contact_no
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_passwd(db: Session, email_id: str, new_passwd_hashed: str):
    db.query(models.User).filter(models.User.email_id==email_id).update({models.User.passwd_hashwd: new_passwd_hashed})
    db.commit()
    db_user = db.query(models.User).filter(models.User.email_id == email_id).first()
    return db_user

def update_user_info(db: Session, user: schemas.UserInfo):
    db.query(models.User).filter(models.User.id==user.id).update({models.User.op_co: user.op_co, models.User.contact_no: user.contact_no})
    db.commit()
    db_user = db.query(models.User).filter(models.User.id==user.id).first()
    return db_user


#####################################
########### Folder-related ##########
#####################################

def get_folder_by_id(db: Session, id: str):
    return db.query(models.File).filter(models.File.id == id, models.File.is_folder == True).first()

def get_folder_by_name_in_parent(db: Session, name: str, parent: str):
    return db.query(models.File).filter(models.File.name == name, models.File.is_folder == True, models.File.parent == parent, models.File.in_trash == False).first()

def get_folders_by_creator(db: Session, created_by: str):
    return db.query(models.File).filter(models.File.created_by == created_by, models.File.in_trash == False).all()

def create_folder(db: Session, folder: schemas.FolderCreate):
    db_folder = models.File(
        name=folder.name,
        abs_path=folder.abs_path,
        is_folder=folder.is_folder,
        parent=folder.parent,
        created_by=folder.created_by,
        created_on=folder.created_on
    )
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder

def update_folder_name(db: Session, folder_id: int, folder_name_new: str):
    db.query(models.File).filter(models.File.id==folder_id, models.File.is_folder==True, models.File.in_trash==False).update({models.File.name: folder_new_name})
    db.commit()
    db_user = db.query(models.File).filter(models.File.id==folder_id).first()
    return db_user

def add_folder_to_trash(db: Session, folder_id: int):
    to_be_deleted_on = datetime.date.today()+datetime.timedelta(days=10)
    # Add folder with specified id to trash
    db.query(models.File).filter(models.File.id==folder_id, models.File.is_folder==True, models.File.in_trash==False).update({models.File.in_trash: True, models.File.delete_on: to_be_deleted_on})
    db.commit()

    # Add cotents of folder with specified id to trash
    db.query(models.File).filter(models.File.parent==folder_id, models.File.in_trash==False).update({models.File.in_trash: True, models.File.delete_on: to_be_deleted_on})
    db.commit()
    return True

def remove_folder_from_trash(db: Session, folder_id: int):
    # Remove folder with specified id from trash
    db.query(models.File).filter(models.File.id==folder_id, models.File.is_folder==True, models.File.in_trash==True).update({models.File.in_trash: False, models.File.delete_on: None})
    db.commit()

    # Remove cotents of folder with specified id from trash
    db.query(models.File).filter(models.File.parent==folder_id, models.File.in_trash==True).update({models.File.in_trash: False, models.File.delete_on: None})
    db.commit()
    return True