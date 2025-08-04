import uvicorn
from fastapi import FastAPI, Depends, status, Path, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from aiogram.utils.deep_linking import create_start_link
from redis_cache import init_redis_pool, test_redis_connection
from api.schemas import SendMessageRequest
from api.security import verify_auth
from bot.bot_main import bot
import re

app = FastAPI(root_path='/adaptrix')

app.add_middleware(
	CORSMiddleware,
	allow_origins=["http://localhost:3000"],
	allow_credentials=True,
	allow_methods=["GET", "POST", "OPTIONS"],
	allow_headers=["Authorization", "Content-Type"],
)

@app.post("/send-message")
async def send_message(request: SendMessageRequest):
    try:
        await bot.send_message(chat_id=request.user_id, text=request.message)
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "detail": str(e)}

@app.get("/redis-status")
async def redis_status():
    connected = await test_redis_connection()
    return {"connected": connected}

async def start_api():
	print("Starting API server...")
	config = uvicorn.Config(app, host="0.0.0.0", port=8966, log_level='info')
	server = uvicorn.Server(config)
	await server.serve()