import uvicorn
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from db import models, schemas, crud
from db.database import engine, SessionLocal
from routers import users, folders, trash

import os
import shutil
import datetime
import time
from argparse import ArgumentParser
from dotenv import load_dotenv
from faker import Faker

parser = ArgumentParser()
parser.add_argument("--init_db", action='store_true', help="initialize database with dummy data")
parser.add_argument("--num_users", type=int, default=5, help="number of users to initialize the database")
parser.add_argument("--reload", action='store_true', help="enable hot reloading")
args = parser.parse_args()

# Load the .env file
load_dotenv()

models.Base.metadata.create_all(bind=engine)

origins = [
    "*",
]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app = FastAPI()

@app.on_event("startup")
async def reset_db():
    if args.init_db:
        try:
            # Initialize the database with dummy values
            db = SessionLocal()
            print("Deleting all folders, files and users")
            db.query(models.User).delete()
            db.query(models.File).delete()
            if os.path.exists(os.path.join(os.path.dirname(os.path.abspath(__file__)), "kmr_storage")):
                shutil.rmtree(os.path.join(os.path.dirname(os.path.abspath(__file__)), "kmr_storage"))
            user = None

            print("Populating dummy users...")
            fake = Faker("en_IN")
            for i in range(args.num_users):
                firstname = fake.unique.first_name()
                lastname = fake.unique.last_name()
                user = crud.create_user(
                    db=db, 
                    user=schemas.UserRegister(
                        name=f"{firstname} {lastname}",
                        passwd_hashed=f"fake_hash#{i+1}",
                        op_co=f"Operating Company {i+1}",
                        email_id=f"{firstname.lower()}.{lastname.lower()}@danaher.com",
                        contact_no=fake.unique.phone_number()
                    )
                )
                print(user.__dict__)
            db.commit()

            # Populate `files` table with 1 root folder & 1 event folder created by `user`
            print("Creating dummy standard parent folder...")
            abs_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "kmr_storage", "2021-February")
            if not os.path.exists(abs_path):
                os.makedirs(abs_path)

            parent = crud.create_file(
                db=db, 
                f=schemas.FileCreate(
                    name="2021-February",
                    abs_path=abs_path,
                    is_folder=True,
                    created_on=datetime.date(2021, 2, 20)
                )
            )
            db.commit()

            print("Creating dummy event folder...")
            abs_path = os.path.join(abs_path, "Event_1")
            if not os.path.exists(abs_path):
                os.makedirs(abs_path)
            folder = crud.create_file(
                db=db, 
                f=schemas.FileCreate(
                    name="Event_1",
                    abs_path=abs_path,
                    is_folder=True,
                    parent=parent.id,
                    created_by=user.id,
                    created_on=datetime.date(2021, 2, 20)
                )
            )
            db.commit()

            print("Creating dummy file in event folder...")
            abs_path = os.path.join(abs_path, "Event_1", "test_file.txt")
            with open(abs_path, "w") as f:
                f.write("This is a dummy file for testing")
            
            file = crud.create_file(
                db=db, 
                f=schemas.FileCreate(
                    name="test_file.txt",
                    abs_path=abs_path,
                    is_folder=False,
                    parent=folder.id,
                    created_by=user.id,
                    created_on=datetime.date(2021, 2, 20)
                )
            )
            db.commit()

        finally:
            db.close()


@app.get("/")
async def root():
    return "This is the API root of Danaher's Knowledge Management Repository (KMR)"

app.include_router(
    users.router,
    prefix="/users",
    tags=["Users"],
    responses={404: {"description": "User not found"}},
)

app.include_router(
    folders.router,
    prefix="/folders",
    tags=["Folders"],
    responses={404: {"description": "Folder not found"}},
)

app.include_router(
    trash.router,
    prefix="/trash",
    tags=["Trash"],
    responses={404: {"description": "Not found in Trash"}},
)

def custom_openapi():
    if app.openapi_schema:
        return app.openapi_schema
    openapi_schema = get_openapi(
        title="Danaher KMR",
        version="0.1.0",
        description="Knowledge Management Repository for Danaher [Submission for CorpComp (Techfest 2020-21)]",
        routes=app.routes,
    )
    openapi_schema["info"]["x-logo"] = {
        "url": "https://i.pinimg.com/originals/7e/3d/fb/7e3dfb44f1e55357a579c94bce8d930d.png"
    }
    app.openapi_schema = openapi_schema
    return app.openapi_schema


app.openapi = custom_openapi

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=args.reload)