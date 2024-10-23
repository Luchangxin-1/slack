import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv

load_dotenv()

DB_URL = os.getenv("DB_URL")

if not DB_URL:
    raise ValueError("No DB_URL found in environment variables")

connect_args = {}
if "sqlite" in DB_URL:
    connect_args = {"check_same_thread": False} #多线程共享

engine = create_engine(DB_URL, connect_args=connect_args, echo=True)   #echo=True 打开日志记录  

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)  #手动提交 禁止自动刷新 以便控制啥时候手动提交

Base = declarative_base()  #之后所有的模型类都继承这个类