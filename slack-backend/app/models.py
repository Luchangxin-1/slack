from sqlalchemy import Boolean, Column, ForeignKey, Integer, String,JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.mysql import CHAR
import uuid
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()  #之后所有的模型类都继承这个类

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), index=True)
    email = Column(String(255), unique=True, index=True)
    hash_password=Column(String(255))
    avatarUrl=Column(String(255),nullable=True)
    is_active = Column(Boolean, default=False)
    Message=relationship('Message',back_populates='user')
    workspaces = relationship("Workspace", back_populates="user")


class Channel(Base):
    __tablename__='channel'
    channelId = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(255), nullable=False)
    workspaceId = Column(CHAR(36), ForeignKey("workspace.workspaceId"))
    
    workspace = relationship("Workspace", back_populates="channels")
    messages =relationship('Message',back_populates='channel')
class Message(Base):
    __tablename__ = 'message'
    
    messageId = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    images = Column(String(100000))  
    userId = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="Message")

    body = Column(String(255), nullable=False)  
    channelId = Column(CHAR(36), ForeignKey("channel.channelId"))

    channel = relationship("Channel", back_populates="messages")

    parentId = Column(CHAR(36), ForeignKey("message.messageId"))  
    parent = relationship("Message", remote_side=[messageId], back_populates="replies", 
                          foreign_keys=[parentId])  

    replies = relationship("Message", back_populates="parent", foreign_keys=[parentId]) 
class Workspace(Base):
    __tablename__ = "workspace"
    workspaceId = Column(CHAR(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(255), nullable=False)
    users=Column(JSON)
    userId = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="workspaces")
    channels=relationship("Channel",back_populates='workspace',cascade="all,delete-orphan")



