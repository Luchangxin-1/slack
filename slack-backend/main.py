from fastapi import FastAPI, Depends, HTTPException, Request,status
import os
from sqlalchemy.orm import Session
# from ..app import crud ,models , schemas
import bcrypt
from app import crud, models, schemas
from fastapi.responses import JSONResponse
from app.database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from datetime import datetime, timedelta, timezone
from fastapi.security import OAuth2PasswordBearer
import jwt
from pydantic import BaseModel
models.Base.metadata.create_all(bind=engine)
load_dotenv()
SECRET_KEY=os.getenv('SECRET_KEY')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 86400 
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")
class TokenData(BaseModel):
    email: str | None = None
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

origins = [
    "http://localhost:3000",  
]


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins, 
    allow_credentials=True,  
    allow_methods=["*"], 
    allow_headers=["*"],  
)
class TokenData(BaseModel):
    email: str | None = None

# method
def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
def verify_token(token: str):
    try:
        # 使用 PyJWT 解码 JWT
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token",
                headers={"WWW-Authenticate": "Bearer"},
            )
        return email
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
@app.post("/signUp/", response_model=schemas.User)
async def SignUp(
    request: Request, user: schemas.UserCreate, db: Session = Depends(get_db)
):
    exist_user = crud.get_user_email(db, email=user.email)
    print('exist_user:',exist_user)
    print('user:',user)


    if exist_user:
        return JSONResponse(content={"success":'false','message':"Email already registered","error":{"code":400,"details":"The email address you entered has been registered."}})
    print(user, "this is user")
    crud.create_user(db=db, user=user)

    return JSONResponse(content={"success":'true','message':'Create user successfully!',"data":{"user":{"email":user.email,"name":user.name}}})

@app.post('/login/')
async def Login(
    request: Request, user: schemas.UserLogin, db: Session = Depends(get_db)
):  
    print(user)
    exist_user=crud.get_user_email(db,email=user.email)
    if not exist_user:
        return JSONResponse(content={"success":'false','message':"Email has not registered!","error":{"code":400,"details":"The email address you entered is not registered."}})

    password:str=exist_user.hash_password
    if bcrypt.checkpw(user.password.encode('utf-8'),password.encode('utf-8')):
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
        return JSONResponse(content={"success":'true','message':"login successfully!","data":{"user":{"email":exist_user.email,"name":exist_user.name,"token":access_token}}})
    
    else:
        return JSONResponse(content={"success":'false','message':"Error password!","error":{"code":401,"details":"The email password is not right."}})
        
        
@app.post('/workspace/create_workspace')
async def Create_workspace(request:Request,workspace:schemas.WorkspaceCreate,db:Session=Depends(get_db)):
    print(workspace)
    exist_workspace=crud.get_workspace(db,name=workspace.name,userId=workspace.userId)
    exist_user=crud.get_user_by_id(db=db,user_id=workspace.userId)

    if exist_workspace:
        return JSONResponse(content={"success":'false','message':"Workspace already here","error":{"code":400,"details":"This workspace  you entered has been registered."}})
    new_workspace=crud.create_workspace(db=db,workspace=workspace)
    return JSONResponse(content={"success":'true','message':'Create user successfully!',"data":{"workspace":{"userId":workspace.userId,"workspaceId":new_workspace.workspaceId}}})
@app.get('/workspace/get_workspace_by_userId')
async def get_workspace_by_userId(userId:str,db:Session=Depends(get_db),token:str=Depends(oauth2_scheme)):
    print(userId)
    verify_token(token)
    exist_workspace=crud.get_workspace_by_userId(db,userId=userId)
    workspaceList=[
        {'workspaceId':workspace.workspaceId,'name':workspace.name,'userId'
         :workspace.userId}
         for workspace in exist_workspace]
    if exist_workspace:
        return JSONResponse(content={"success":'true','message':'Query workspace successfully!',"data":{"workspace":{"userId":userId,"workspace":workspaceList}}})
    return JSONResponse(content={"success":'false','message':'Do not have a workspace!',"data":{"workspace":{"userId":userId}}})
@app.get('/workspace/get_workspace_by_workspaceId')
async def get_workspace_by_workspaceId(workspaceId:str,db:Session=Depends(get_db),token:str=Depends(oauth2_scheme)):
    verify_token(token)
    return crud.get_workspace_by_workspaceId(db=db,workspaceId=workspaceId)
@app.post('/workspace/join_workspace')
async def join_workspace(data:schemas.WorkspaceJoin,db:Session=Depends(get_db),token:str=Depends(oauth2_scheme)):
    verify_token(token)
    exist_workspace=crud.get_workspace_by_workspaceId(db=db,workspaceId=data.workspaceId)
    exist_user=crud.get_user_by_id(db=db,user_id=data.userId)
    if data.userId in exist_workspace.users:
        return {
            "status": "error",
            "message": f"member with name '{exist_user.name}' is aleardy here.",
            "data": None
        }

    new_workspace=crud.join_workspace(db=db,data=data)
    if new_workspace is None:
        return {
            "status": "error",
            "message": f"member with id '{data.userId}' not  right.",
            "data": None
        }
    if exist_user is None:
        return {
            "status": "error",
            "message": f"member with id '{data.userId}' not  register.",
            "data": None
        }
    
    return {
        "status": "success",
        "message": "Member invite successfully.",
        "data": new_workspace
    }

@app.get('/get_other_users')
async def get_other_users(userId:str,db:Session=Depends(get_db),token:str=Depends(oauth2_scheme)):
    verify_token(token)
    other_users=crud.get_other_users(db=db,userId=userId)
    return other_users
@app.get('/get_users_in_workspace')
async def get_users_in_workspace(workspaceId:str,db:Session=Depends(get_db),token:str=Depends(oauth2_scheme)):
    verify_token(token)
    users=crud.get_users_in_workspace(db=db,workspaceId=workspaceId)
    return users
@app.delete('/workspace/delect_workspace_by_workspaceId')
async def delect_workspace_by_workspaceId(workspaceId:str,db:Session=Depends(get_db),token:str=Depends(oauth2_scheme)):
    verify_token(token)
    return crud.delete_workspace_by_workspceId(db=db,workspaceId=workspaceId)
@app.post('/workspace/update_workspace_name')
async def update_workspace_name(data:schemas.WorkspaceRename,db:Session=Depends(get_db),token:str=Depends(oauth2_scheme)):
    verify_token(token)
    return crud.update_workspace_by_workspaceId(db=db,data=data)
@app.post('/workspace/create_channel')
async def create_channel(data:schemas.ChannelCreate,db:Session=Depends(get_db)):
    created_channel=crud.create_channel(db=db,data=data)
    if created_channel is None:
        return {
            "status": "error",
            "message": f"Channel with name '{data.name}' already exists.",
            "data": None
        }
    return {
        "status": "success",
        "message": "Channel created successfully.",
        "data": created_channel
    }

@app.get('/workspace/get_channel_by_channelId')
async def get_channel_by_channelId(channelId:str,db:Session=Depends(get_db),token:str=Depends(oauth2_scheme)):
    verify_token(token)
    channel=crud.get_channel_by_channelId(db=db,channelId=channelId)
    if channel is None:
        return {
            "status": "error",
            "message": f"channel with id '{channelId}' not  created.",
            "data": None
        }
    return {
        "status": "success",
        "message": "query channel successfully!",
        "data": channel
    }
@app.delete('/workspace/delect_channel_by_channelId')
async def delect_channel_by_channelId(channelId:str,workspaceId:str,db:Session=Depends(get_db),token:str=Depends(oauth2_scheme)):
    verify_token(token)
    workspace= crud.delete_channel_by_channelId(db=db,channelId=channelId,workspaceId=workspaceId)
    if workspace is None:
        return {
            "status": "error",
            "message": f"channel with id '{channelId}' not  created.",
            "data": None
        }
    return {
        "status": "success",
        "message": "delete channel successfully!",
        "data": workspace
    }
@app.post('/workspace/update_channel_name')
async def update_workspace_name(data:schemas.ChanneleRename,db:Session=Depends(get_db),token:str=Depends(oauth2_scheme)):
    verify_token(token)
    channel= crud.update_channel_by_channelId(db=db,data=data)
    if channel is None:
        return {
            "status": "error",
            "message": f"channel with id '{data.channelId}' not  created.",
            "data": None
        }
    return {
        "status": "success",
        "message": "update channel successfully!",
        "data": channel
    }

@app.post('/channel/create_message')
async def create_message(data:schemas.MessageCreate,db:Session=Depends(get_db)):

    message= crud.create_message(data=data,db=db)
    if message is None:
        return {
            "status": "error",
            "message": f"message with id '{data.channelId}' not  created.",
            "data": None
        }
    return {
        "status": "success",
        "message": "create  message successfully!",
        "data": message
    }

@app.get('/channel/get_message_by_messageId')
async def get_message_by_messageId(messageId:str,db:Session=Depends(get_db)):
    return crud.get_message_by_messageId(messageId=messageId,db=db)

@app.get("/")
def index(token:str=Depends(oauth2_scheme)):
    email=verify_token(token)
    return email