from sqlalchemy.orm import Session
import bcrypt
from . import models, schemas


def get_user_by_id(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hash_password=bcrypt.hashpw(user.password.encode('utf-8'),bcrypt.gensalt(10))
    db_user = models.User(email=user.email, name=user.name,hash_password=hash_password,avatarUrl=user.avatarUrl)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def create_workspace(db:Session,workspace:schemas.WorkspaceCreate):
    db_workspace=models.Workspace(name=workspace.name,userId=workspace.userId)
    db.add(db_workspace)
    db.commit()
    db.refresh(db_workspace)
    return db_workspace
def get_workspace(db:Session,name:str,userId:str):
    return db.query(models.Workspace).filter(models.Workspace.name==name,models.Workspace.userId==userId).first()


def get_hash_password_login(password:str):
    hash_password=bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt(10))
    return hash_password

def get_workspace_by_userId(db:Session,userId:str):
    return db.query(models.Workspace).filter(models.Workspace.userId==userId).all()