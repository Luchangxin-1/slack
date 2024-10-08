from sqlalchemy.orm import Session
import bcrypt
from . import models, schemas


def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()


def get_user_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()


def create_user(db: Session, user: schemas.UserCreate):
    hash_password=bcrypt.hashpw(user.password.encode('utf-8'),bcrypt.gensalt(10))
    db_user = models.User(email=user.email, name=user.name,hash_password=hash_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


def get_hash_password_login(password:str):
    hash_password=bcrypt.hashpw(password.encode('utf-8'),bcrypt.gensalt(10))
    return hash_password
