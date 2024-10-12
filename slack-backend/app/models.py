from sqlalchemy import Boolean, Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import CHAR
import uuid
from .database import Base


class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    hash_password=Column(String(255))
    avatarUrl=Column(String(255),nullable=True)
    is_active = Column(Boolean, default=False)

    workspaces = relationship("Workspace", back_populates="user")

class Workspace(Base):
    __tablename__ = "workspace"
    workSpaceId = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(255), nullable=False)
    
    userId = Column(Integer, ForeignKey("users.id"), nullable=False)
    
    user = relationship("User", back_populates="workspaces")