from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load the .env file
load_dotenv()

host = os.getenv("MYSQL_HOST")
username = os.getenv("MYSQL_USERNAME")
passwd = os.getenv("MYSQL_PASSWD")
db = os.getenv("MYSQL_DB")


SQLALCHEMY_DATABASE_URL = f"mysql+mysqlconnector://{username}:{passwd}@{host}/{db}"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()