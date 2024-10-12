from pydantic import BaseModel


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
class WorkspaceCreate(BaseModel):
    name:str
    userId:str

    class Config:
        from_attributes = True