from fastapi import Depends, APIRouter, HTTPException
from sqlalchemy.orm import Session

from db import schemas, crud
from db.database import SessionLocal

router = APIRouter()

def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

@router.get("/user", response_model=schemas.UserInfo)
async def get_user(email_id: str, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email_id=email_id)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    return db_user
    