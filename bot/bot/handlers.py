from aiogram import Router, F, types
from aiogram.filters import CommandStart
from bot.http_util import get_http_session

router = Router()

@router.message(CommandStart())
async def start_command_handler(message: types.Message):
    user_id = message.from_user.id
    
    # Test Redis connection
    redis_status = await test_redis_connection()
    status_text = "✅ Connected" if redis_status else "❌ Failed"
    
    await message.answer(
        f"Bot started!\n"
        f"Your ID: {user_id}\n"
        f"Redis: {status_text}"
    )

