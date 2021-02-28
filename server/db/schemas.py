from typing import Optional, List
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

##################################################
########### File/Folder-related Schemas ##########
##################################################

class FileBase(BaseModel):
    name: str
    created_by: Optional[int] = None
    parent: Optional[int] = None

class FileCreate(FileBase):
    abs_path: Optional[str]
    is_folder: bool = False
    created_on: Optional[date]

class FileEditBase(BaseModel):
    id: int
    created_by: int

class FileRename(FileEditBase):
    new_name: str

class FileInfo(BaseModel):
    id: int
    name: str
    created_by: Optional[int] = None
    created_on: Optional[date] = None
    parent: Optional[int] = None
    is_folder: bool
    class Config:
        orm_mode =  True

class FolderInfo(FileInfo):
    contents: List[FileInfo]
