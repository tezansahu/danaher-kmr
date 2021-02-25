from typing import Optional
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

class UserInfo(UserInfoBase):
    id: int
    name: str
    op_co: str
    contact_no: Optional[str] = None

    class Config:
        orm_mode =  True

class UserPasswdUpdate(UserInfoBase):
    old_passwd_hashed: str
    new_passwd_hashed: str

###########################################
########### File-related Schemas ##########
###########################################

# [TODO] File-related schemas