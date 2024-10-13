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
        {'workspaceId':workspace.workspaceId,'workspaceName':workspace.name,'userId'
         :workspace.userId}
         for workspace in exist_workspace]
    if exist_workspace:
        return JSONResponse(content={"success":'true','message':'Query workspace successfully!',"data":{"workspace":{"userId":userId,"workspace":workspaceList}}})
    return JSONResponse(content={"success":'false','message':'Do not have a workspace!',"data":{"workspace":{"userId":userId}}})

@app.get("/")
def index(token:str=Depends(oauth2_scheme)):
    email=verify_token(token)
    return email