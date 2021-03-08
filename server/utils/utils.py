from db import models, schemas, crud
from db.database import engine, SessionLocal, Base

import os
import shutil
import datetime
import time
from faker import Faker

def get_db():
    db = None
    try:
        db = SessionLocal()
        yield db
    finally:
        db.close()

def init_db(db, args):
    # Initialize the database with dummy values
    print("Deleting all folders, files and users")
    Base.metadata.drop_all(bind=engine, tables=[models.File.__table__, models.User.__table__])
    models.Base.metadata.create_all(bind=engine)

    if os.path.exists(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "kmr_storage")):
        shutil.rmtree(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "kmr_storage"))
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
    db.commit()

    # Populate `files` table with 1 root folder & 1 event folder created by `user`
    print("Creating dummy standard parent folder...")
    abs_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "kmr_storage", "2021-February")
    if not os.path.exists(abs_path):
        os.makedirs(abs_path)

    parent = crud.create_folder(
        db=db, 
        f=schemas.FolderCreate(
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
    folder = crud.create_folder(
        db=db, 
        f=schemas.FolderCreate(
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
    abs_path = os.path.join(abs_path, "test_file.txt")
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
            created_on=datetime.date(2021, 2, 20),
            size=os.path.getsize(abs_path),
            file_type=os.path.splitext(abs_path)[1][1:]
        )
    )
    db.commit()