from sqlalchemy.orm import Session
import bcrypt
from . import models, schemas
from sqlalchemy.orm.attributes import flag_modified

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
    db_workspace=models.Workspace(name=workspace.name,userId=workspace.userId,users=[workspace.userId])
    db.add(db_workspace)
    db.commit()
    db.refresh(db_workspace)
    return db_workspace
def get_workspace_by_workspaceId(db:Session,workspaceId:str):
    return db.query(models.Workspace).filter(models.Workspace.workspaceId==workspaceId).first()
def get_workspace(db:Session,name:str,userId:str):
    return db.query(models.Workspace).filter(models.Workspace.name==name,models.Workspace.userId==userId).first()
def join_workspace(db:Session,data:schemas.WorkspaceJoin):
    db_workspace=get_workspace_by_workspaceId(db=db,workspaceId=data.workspaceId)
    db_workspace.users.append(data.userId)
    db_user=get_user_by_id(db=db,user_id=data.userId)

    flag_modified(db_workspace, "users")
    db.commit()
    db.refresh(db_workspace)
    return db_workspace

def get_hash_password_login(password:str):
    hash_password=bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt(10))
    return hash_password

def get_workspace_by_userId(db:Session,userId:str):
    return db.query(models.Workspace).filter(models.Workspace.userId==userId).all()

def get_other_users(db:Session,userId:str):
    return db.query(models.User).filter(models.User.id!=int(userId)).all()

def get_users_in_workspace(db:Session,workspaceId:str):
    db_workspace=get_workspace_by_workspaceId(db=db,workspaceId=workspaceId)
    userId_list=db_workspace.users
    users=[]
    for id in userId_list:
        user=get_user_by_id(db=db,user_id=id)
        if(user):
            users.append(user)
    return users
