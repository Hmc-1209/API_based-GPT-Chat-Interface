from fastapi import FastAPI
import Router
from database import db
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.include_router(Router.token)
app.include_router(Router.user)
app.include_router(Router.chatRecord)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://chat.dh1209.com"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup():
    await db.connect()


@app.on_event("shutdown")
async def shutdown():
    await db.disconnect()
