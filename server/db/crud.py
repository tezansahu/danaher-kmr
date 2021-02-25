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