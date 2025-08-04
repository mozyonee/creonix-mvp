import os

from dotenv import load_dotenv, find_dotenv
from aiogram import Bot, Dispatcher

from bot.handlers import router

load_dotenv(find_dotenv())

BOT_TOKEN = os.getenv('BOT_TOKEN')

bot = Bot(token=BOT_TOKEN)

dp = Dispatcher()
dp.include_router(router)

async def start_bot():
    try:
        print("Starting bot...")
        await dp.start_polling(bot)
    except (KeyboardInterrupt, SystemExit):
        await bot.delete_webhook()
        await bot.close()