from pydantic import BaseModel
from typing import Literal

from sqlalchemy import Null

class TodoBase(BaseModel):
    title: str
    description: str | None = None


class TodoCreate(TodoBase):
    pass


class Todo(TodoBase):
    id: int
    owner_id: int

    class Config:
        from_attributes = True


class UserBase(BaseModel):
    email: str
    name: str



class UserCreate(UserBase):
    password:str
    avatarUrl:str

class UserLogin(BaseModel):
    password:str
    email:str

class User(UserBase):
    id: int
    is_active: bool
    role: Literal['ADMIN', 'USER'] = 'USER' 
    hash_password:str 
    avatarUrl:str 


class WorkspaceCreate(BaseModel):
    name:str
    userId:str
class WorkspaceJoin(BaseModel):
    userId:str
    workspaceId:str
    class Config:
        from_attributes = True