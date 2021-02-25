from typing import Optional
from pydantic import BaseModel

###########################################
########### User-related Schemas ##########
###########################################

class UserInfoBase(BaseModel):
    email_id: str
    name: str

class UserLogin(UserInfoBase):
    passwd_hashed: str

class UserRegister(UserLogin):
    op_co: str
    contact_no: Optional[str] = None

class UserInfo(UserInfoBase):
    id: int
    op_co: str
    contact_no: Optional[str] = None

    class Config:
        orm_mode =  True

###########################################
########### File-related Schemas ##########
###########################################

# [TODO] File-related schemas