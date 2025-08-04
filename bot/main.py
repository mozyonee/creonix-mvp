import asyncio

from api.api_main import start_api
from bot.bot_main import start_bot
from bot.http_util import close_http_session
from redis_cache import init_redis_pool, close_redis_pool


async def main():
    await init_redis_pool()

    api_task = asyncio.create_task(start_api())
    bot_task = asyncio.create_task(start_bot())

    done, pending = await asyncio.wait(
        [api_task, bot_task],
        return_when=asyncio.FIRST_COMPLETED
    )

    for task in pending:
        task.cancel()

    await close_http_session()
    await close_redis_pool()


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except (KeyboardInterrupt, SystemExit):
        print("Shutting down...")