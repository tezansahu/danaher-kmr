import uvicorn
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi

from db import models, schemas, crud
from db.database import engine, SessionLocal
from routers import users

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
            print("deleting all items and users")
            db.query(models.User).delete()
            db.query(models.File).delete()

            user = None

            print("Populating users...")
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

            # [TODO] Populate `files` table with 1 root folder & 1 event folder created by `user`
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