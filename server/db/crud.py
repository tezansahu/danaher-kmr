from sqlalchemy.orm import Session

from . import models, schemas

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
    db_user = db.query(models.User).filter(models.User.email_id == email_id).first()
    db_user.passwd_hashed = new_passwd_hashed
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def update_user_info(db: Session, user: schemas.UserInfo):
    db_user = db.query(models.User).filter(models.User.id == user.id).first()
     
    # Only Operating Company & Contact Number of a user can be updated
    db_user.op_co = user.op_co
    db_user.contact_no = user.contact_no
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user