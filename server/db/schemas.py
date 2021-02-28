from typing import Optional
from datetime import date
from pydantic import BaseModel

###########################################
########### User-related Schemas ##########
###########################################

class UserInfoBase(BaseModel):
    email_id: str

class UserLogin(UserInfoBase):
    passwd_hashed: str

class UserRegister(UserLogin):
    name: str
    op_co: str
    contact_no: Optional[str] = None

class UserPasswdUpdate(UserInfoBase):
    old_passwd_hashed: str
    new_passwd_hashed: str

class UserInfo(UserInfoBase):
    id: int
    name: str
    op_co: str
    contact_no: Optional[str] = None

    class Config:
        orm_mode =  True

#############################################
########### Folder-related Schemas ##########
#############################################

class FolderBase(BaseModel):
    name: str
    created_by: Optional[int] = None
    parent: Optional[int] = None
    
class FolderCreate(FolderBase):
    abs_path: Optional[str]
    is_folder: bool = True
    created_on: Optional[date]

class FolderDelete(FolderBase):
    in_trash: bool
    delete_on: Optional[date]

class FolderInfo(FolderCreate):
    id: int
    class Config:
        orm_mode =  True



###########################################
########### File-related Schemas ##########
###########################################

