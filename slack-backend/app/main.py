from fastapi import FastAPI, Depends, HTTPException, Request

from sqlalchemy.orm import Session
# from ..app import crud ,models , schemas
from app import crud, models, schemas

from .database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()


@app.post("/create_user/", response_model=schemas.User)
async def create_user(
    request: Request, user: schemas.UserCreate, db: Session = Depends(get_db)
):
    exist_user = crud.get_user_email(db, email=user.email)
    if exist_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    print(user, "this is user")
    return crud.create_user(db=db, user=user)


@app.get("/")
def index():
    return "hello"