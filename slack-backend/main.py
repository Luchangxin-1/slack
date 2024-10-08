from fastapi import FastAPI, Depends, HTTPException, Request
import os
from sqlalchemy.orm import Session
# from ..app import crud ,models , schemas
import bcrypt
from app import crud, models, schemas
from fastapi.responses import JSONResponse
from app.database import SessionLocal, engine
from fastapi.middleware.cors import CORSMiddleware
models.Base.metadata.create_all(bind=engine)


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


@app.post("/signUp/", response_model=schemas.User)
async def SignUp(
    request: Request, user: schemas.UserCreate, db: Session = Depends(get_db)
):
    exist_user = crud.get_user_email(db, email=user.email)
    if exist_user:
        return JSONResponse(status_code=400, content={'message':"Email already registered"})
    print(user, "this is user")
    crud.create_user(db=db, user=user)

    return JSONResponse(status_code=200,content={'message':'Create user successfully!'})

@app.post('/login/')
async def Login(
    request: Request, user: schemas.UserLogin, db: Session = Depends(get_db)
):  
    print(user)
    exist_user=crud.get_user_email(db,email=user.email)
    if not exist_user:
        return JSONResponse(content={"success":False,'message':"Email has not registered!","error":{"code":400,"details":"The email address you entered is not registered."}})

    password:str=exist_user.hash_password
    if bcrypt.checkpw(user.password.encode('utf-8'),password.encode('utf-8')):
        return JSONResponse(content={"success":True,'message':"login successfully!","data":{"user":{"email":exist_user.email,"name":exist_user.name}}})
    else:
        return JSONResponse(content={"success":False,'message':"Error password!","error":{"code":401,"details":"The email password is not right."}})
        
        

@app.get("/")
def index():
    return "hello"