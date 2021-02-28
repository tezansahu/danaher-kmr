from sqlalchemy import Column, Integer, String, Boolean, Date, ARRAY, ForeignKey
from sqlalchemy.schema import Sequence
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    name = Column(String(100), nullable=False, index=True)
    passwd_hashed = Column(String(200), nullable=False, index=True)
    op_co = Column(String(100), index=True)
    email_id = Column(String(50), unique=True, nullable=False, index=True)
    contact_no = Column(String(15))

class File(Base):
    __tablename__ = "files"

    id = Column(Integer, autoincrement=True, primary_key=True, index=True)
    name = Column(String(500), nullable=False, index=True)
    abs_path = Column(String(1000), nullable=False)
    file_type = Column(String(10), index=True, default=None)
    size = Column(Integer, default=None)
    is_folder = Column(Boolean, index=True, default=False)
    parent = Column(Integer, ForeignKey('files.id'), index=True)
    created_by = Column(Integer, ForeignKey('users.id'), index=True)
    created_on = Column(Date, index=True, nullable=False)
    in_trash = Column(Boolean, index=True, default=False)
    delete_on = Column(Date, index=True, default=None)
