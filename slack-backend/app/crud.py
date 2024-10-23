from sqlalchemy.orm import Session,joinedload
import bcrypt
from . import models, schemas
from sqlalchemy.orm.attributes import flag_modified
from .models import Workspace
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
    return db.query(models.Workspace).options(joinedload(Workspace.channels)).filter(models.Workspace.workspaceId==workspaceId).first()
def get_workspace(db:Session,name:str,userId:str):
    return db.query(models.Workspace).filter(models.Workspace.name==name,models.Workspace.userId==userId).first()
def join_workspace(db:Session,data:schemas.WorkspaceJoin):
    db_workspace=get_workspace_by_workspaceId(db=db,workspaceId=data.workspaceId)
    db_workspace.users.append(data.userId)
    db_user=get_user_by_id(db=db,user_id=data.userId)
    if not db_user:
        return 
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
def delete_workspace_by_workspceId(db:Session,workspaceId:str):
    db_workspace=get_workspace_by_workspaceId(db=db,workspaceId=workspaceId)
    db.delete(db_workspace)
    db.commit()
    return get_workspace_by_userId(db=db,userId=db_workspace.userId)

def update_workspace_by_workspaceId(db:Session,data:schemas.WorkspaceRename):
    db_workspace=get_workspace_by_workspaceId(db=db,workspaceId=data.workspaceId)
    db_workspace.name=data.name
    db.commit()
    db.refresh(db_workspace)
    return db_workspace

def create_channel(db:Session,data:schemas.ChannelCreate):
    db_workspace=get_workspace_by_workspaceId(db=db,workspaceId=data.workspaceId)
    for channel in db_workspace.channels:
        if data.name==channel.name:
            return 
    db_channel=models.Channel(name=data.name,workspaceId=data.workspaceId)

    db.add(db_channel)
    db.commit()
    db.refresh(db_channel)
    return db_channel
def get_channel_by_channelId(db:Session,channelId:str):
    return db.query(models.Channel).filter(models.Channel.channelId==channelId).first()
def delete_channel_by_channelId(db:Session,channelId:str,workspaceId:str):
    db_channel=get_channel_by_channelId(db=db,channelId=channelId)
    if db_channel is  None:
        return
    db.delete(db_channel)
    db.commit()
    return get_workspace_by_workspaceId(db=db,workspaceId=workspaceId)
def create_message(db:Session,data:schemas.MessageCreate):
    db_channel=get_channel_by_channelId(db=db,channelId=data.channelId)
    if db_channel is None:
        return
    db_message=None
    if data.parentId =='':
        db_message=models.Message(channelId=data.channelId,images=data.images,body=data.body,userId=data.userId)
        db.add(db_message)
        db.commit()
        db.refresh(db_message)
    else:
        db_channel=get_message_by_messageId(db=db,messageId=data.parentId)
        if db_channel:
            db_message=models.Message(channelId=data.channelId,images=data.images,body=data.body,parentId=data.parentId,userId=data.userId)
            db.add(db_message)
            db.commit()
            db.refresh(db_message)
        else:
            return

    return db_message
def get_message_by_messageId(db:Session,messageId:str):
    return db.query(models.Message).filter(models.Message.messageId==messageId).first()
def get_message_by_channelId(db:Session,channelId:str):
    return db.query(models.Message).filter(models.Message.channelId==channelId)
def update_channel_by_channelId(db:Session,data:schemas.ChanneleRename):
    db_channel=get_channel_by_channelId(db=db,channelId=data.channelId)
    if db_channel is  None:
        return
    db_channel.name=data.name
    db.commit()
    db.refresh(db_channel)
    return db_channel
