from sqlalchemy.orm import Session, aliased
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
    db.query(models.User).filter(models.User.email_id==email_id).update({models.User.passwd_hashed: new_passwd_hashed})
    db.commit()
    db_user = db.query(models.User).filter(models.User.email_id == email_id).first()
    return db_user

def update_user_info(db: Session, user: schemas.UserInfo):
    db.query(models.User).filter(models.User.id==user.id).update({models.User.op_co: user.op_co, models.User.contact_no: user.contact_no})
    db.commit()
    db_user = db.query(models.User).filter(models.User.id==user.id).first()
    return db_user


############################################
########### Folder & file-related ##########
############################################

def get_file_by_id(db: Session, id: str):
    return db.query(models.File).filter(models.File.id == id).first()


def get_folder_by_id(db: Session, id: str):
    folder = db.query(models.File).filter(models.File.id == id, models.File.is_folder == True).first()
    if not folder or folder.in_trash:
        return None
    else:
        response = schemas.FolderInfo(
            id=folder.id,
            name=folder.name,
            created_by=folder.created_by,
            created_on=folder.created_on,
            parent=folder.parent,
            is_folder=folder.is_folder,
            abs_path=folder.abs_path,
            contents=db.query(models.File).filter(models.File.parent == id, models.File.in_trash == False).all()
        )
        return response


def get_file_by_name_in_parent(db: Session, name: str, parent: int):
    return db.query(models.File).filter(models.File.name == name, models.File.is_folder == False, models.File.parent == parent, models.File.in_trash == False).first()


def get_folder_by_name_in_parent(db: Session, name: str, parent: int):
    return db.query(models.File).filter(models.File.name == name, models.File.is_folder == True, models.File.parent == parent, models.File.in_trash == False).first()


def get_folders_by_creator(db: Session, created_by: int):
    folders = []
    if created_by:
        # Return the event folders created by a user that are present directly inside any standard root folder (<month>-<year>)
        ParentFile = aliased(models.File, name='parent_device')
        for f, _ in db.query(models.File, ParentFile).filter(
            models.File.created_by == created_by,
            models.File.is_folder == True,
            models.File.in_trash == False, 
            models.File.parent == ParentFile.id,
            ParentFile.created_by == None
        ).all():
            folders.append(f)
        return folders
    else:
        # Return all standard root folders (<month>-<year>)
        return db.query(models.File).filter(models.File.created_by == created_by, models.File.is_folder == True, models.File.in_trash == False).all()


def create_file(db: Session, f: schemas.FileCreate):
    db_file = models.File(
        name=f.name,
        abs_path=f.abs_path,
        size=f.size,
        file_type=f.file_type,
        is_folder=f.is_folder,
        parent=f.parent,
        created_by=f.created_by,
        created_on=f.created_on
    )
    db.add(db_file)
    db.commit()
    db.refresh(db_file)
    return db_file

def create_folder(db: Session, f: schemas.FolderCreate):
    db_folder = models.File(
        name=f.name,
        abs_path=f.abs_path,
        is_folder=f.is_folder,
        parent=f.parent,
        created_by=f.created_by,
        created_on=f.created_on
    )
    db.add(db_folder)
    db.commit()
    db.refresh(db_folder)
    return db_folder

def update_folder_name(db: Session, folder: schemas.FileRename):
    original_folder = db.query(models.File).filter(models.File.id==folder.id, models.File.is_folder==True, models.File.in_trash==False).first()
    original_name = original_folder.name
    new_abs_path = original_folder.abs_path.replace(f"/{original_name}", f"/{folder.new_name}")
    new_abs_path = new_abs_path.replace(f"\\{original_name}", f"\\{folder.new_name}")
    print(new_abs_path)
    db.query(models.File).filter(models.File.id==folder.id, models.File.is_folder==True, models.File.in_trash==False).update({models.File.name: folder.new_name, models.File.abs_path: new_abs_path})
    db.commit()

    # Update the absolute paths of all children & sub-children of the folder
    parents_to_check = [folder.id]
    while parents_to_check:
        parent_id = parents_to_check.pop(0)
        children_folder_ids = db.query(models.File.id).filter(models.File.parent==parent_id, models.File.is_folder==True).all()
        parents_to_check.extend([id for id, in children_folder_ids])
        for f in db.query(models.File).filter(models.File.parent==parent_id).all():
            new_abs_path = f.abs_path.replace(f"/{original_name}/", f"/{folder.new_name}/")
            new_abs_path = new_abs_path.replace(f"\\{original_name}", f"\\{folder.new_name}")
            print(f.id, f.name, new_abs_path)
            db.query(models.File).filter(models.File.parent==parent_id).update({models.File.abs_path: new_abs_path})
            db.commit()

    db_folder = db.query(models.File).filter(models.File.id==folder.id).first()
    return db_folder

def update_file_name(db: Session, f: schemas.FileRename):
    original_file = db.query(models.File).filter(models.File.id==f.id, models.File.is_folder==False, models.File.in_trash==False).first()
    original_name = original_file.name
    new_abs_path = original_file.abs_path.replace(f"/{original_name}", f"/{f.new_name}")
    new_abs_path = original_file.abs_path.replace(f"\\{original_name}", f"\\{f.new_name}")
    db.query(models.File).filter(models.File.id==f.id, models.File.is_folder==False, models.File.in_trash==False).update({models.File.name: f.new_name, models.File.abs_path: new_abs_path})
    db.commit()

    db_file = db.query(models.File).filter(models.File.id==f.id).first()
    return db_file

def get_trash_for_user(db: Session, user_id: int):
    trash = []
    # Append the files & folders created by a user whose parents are not in trash
    ParentFile = aliased(models.File, name='parent_device')
    for f, _ in db.query(models.File, ParentFile).filter(
        models.File.created_by == user_id,
        # models.File.is_folder == True,
        models.File.in_trash == True, 
        models.File.parent == ParentFile.id,
        ParentFile.in_trash == False
    ).all():
        trash.append(f)
    return trash

def add_file_to_trash(db: Session, id: int):
    to_be_deleted_on = datetime.date.today()+datetime.timedelta(days=10)
    # Add file with specified id to trash
    db.query(models.File).filter(models.File.id==id, models.File.is_folder==False, models.File.in_trash==False).update({models.File.in_trash: True, models.File.delete_on: to_be_deleted_on})
    db.commit()
    return {"id": id, "status": "added to trash"}


def add_folder_to_trash(db: Session, id: int):
    to_be_deleted_on = datetime.date.today()+datetime.timedelta(days=10)
    # Add folder with specified id to trash
    db.query(models.File).filter(models.File.id==id, models.File.is_folder==True, models.File.in_trash==False).update({models.File.in_trash: True, models.File.delete_on: to_be_deleted_on})
    db.commit()

    # Add contents of folder with specified id to trash
    parents_to_check = [id]
    while parents_to_check:
        parent_id = parents_to_check.pop(0)
        children_folder_ids = db.query(models.File.id).filter(models.File.parent==parent_id, models.File.is_folder==True, models.File.in_trash==False).all()
        parents_to_check.extend([id for id, in children_folder_ids])
        db.query(models.File).filter(models.File.parent==parent_id, models.File.in_trash==False).update({models.File.in_trash: True, models.File.delete_on: to_be_deleted_on})
        db.commit()
    return {"id": id, "status": "added to trash"}


def restore_file_from_trash(db: Session, id: int):
    # Restore folder with specified id from trash
    db.query(models.File).filter(models.File.id==id, models.File.is_folder==False, models.File.in_trash==True).update({models.File.in_trash: False, models.File.delete_on: None})
    db.commit()
    return {"id": id, "status": "removed from trash"}


def restore_folder_from_trash(db: Session, id: int):
    # Restore folder with specified id from trash
    db.query(models.File).filter(models.File.id==id, models.File.is_folder==True, models.File.in_trash==True).update({models.File.in_trash: False, models.File.delete_on: None})
    db.commit()

    # Restore contents of folder with specified id from trash
    parents_to_check = [id]
    while parents_to_check:
        parent_id = parents_to_check.pop(0)
        children_folder_ids = db.query(models.File.id).filter(models.File.parent==parent_id, models.File.is_folder==True, models.File.in_trash==True).all()
        parents_to_check.extend([id for id, in children_folder_ids])
        db.query(models.File).filter(models.File.parent==parent_id, models.File.in_trash==True).update({models.File.in_trash: False, models.File.delete_on: None})
        db.commit()
    return {"id": id, "status": "restored from trash"}


def delete_file_from_trash(db: Session, id: int):
    db.query(models.File).filter(models.File.id == id).delete()
    db.commit()
    return {"id": id, "status": "deleted forever"}

def delete_folder_from_trash(db: Session, id: int):
    to_delete = [id]
    queue = [id]
    while queue:
        id_to_check = queue.pop(0)
        children_ids = db.query(models.File.id).filter(models.File.parent==id_to_check, models.File.in_trash==True).all()
        queue.extend([id for id, in children_ids])
        to_delete.extend([id for id, in children_ids])
    
    for f_id in to_delete[::-1]:
        db.query(models.File).filter(models.File.id==f_id, models.File.in_trash==True).delete()
        db.commit()

    return {"id": id, "status": "deleted forever"}

def search_drive(db: Session, keyword: str, username: str = "", file_type: str = ""):
    response = []

    if file_type == "":
        # Query for folders as well
        filtered = db.query(models.File, models.User).filter(
            models.File.created_by == models.User.id, 
            models.File.name.like("%{}%".format(keyword)),
            models.User.name.like("%{}%".format(username)),
            models.File.is_folder == True
        ).all()
        for f, _ in filtered:
            response.append(f)

    filtered = db.query(models.File, models.User).filter(
        models.File.created_by == models.User.id, 
        models.File.name.like("%{}%".format(keyword)),
        models.User.name.like("%{}%".format(username)),
        models.File.file_type.like("%{}%".format(file_type))
    ).all()
    
    for f, _ in filtered:
        response.append(f)

    return response