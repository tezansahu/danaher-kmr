import uvicorn
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, HTTPException
from starlette.middleware.cors import CORSMiddleware
from fastapi.openapi.utils import get_openapi
from typing import List

from db import models, schemas, crud
from db.database import engine, SessionLocal, Base
from routers import users, folders, files, trash
from utils import utils

from argparse import ArgumentParser
from dotenv import load_dotenv


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
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def reset_db():
    if args.init_db:
        db = SessionLocal()
        try:
            utils.init_db(db, args)

        finally:
            db.close()


@app.get("/")
async def root():
    return "This is the API root of Danaher's Knowledge Management Repository (KMR)"

@app.get("/search", response_model=List[schemas.FileInfo])
async def search_file_and_folders(keyword: str, username: str = None, file_type: str = None, db: Session = Depends(utils.get_db)):
    return crud.search_drive(db, keyword, username, file_type)
    

app.include_router(
    users.router,
    prefix="/users",
    tags=["Users"],
)

app.include_router(
    folders.router,
    prefix="/folders",
    tags=["Folders"],
)

app.include_router(
    files.router,
    prefix="/files",
    tags=["Files"],
)

app.include_router(
    trash.router,
    prefix="/trash",
    tags=["Trash"],
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
    uvicorn.run("main:app", host="localhost", port=8000, reload=args.reload)