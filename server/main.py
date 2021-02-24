import uvicorn
from sqlalchemy.orm import Session
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import models
from database import engine, SessionLocal

from dotenv import load_dotenv

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

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


app = FastAPI()

@app.get("/")
async def root():
    return "This is the API root of Danaher's Knowledge Management Repository (KMR)"

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)