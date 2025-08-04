import os
from dotenv import load_dotenv
import redis.asyncio as redis

load_dotenv()

redis_pool = None

async def init_redis_pool():
    global redis_pool
    if redis_pool is None:
        password = os.getenv('REDIS_PASS')
        host = os.getenv('REDIS_HOST', 'localhost')
        
        if password:
            redis_pool = redis.ConnectionPool.from_url(f'redis://:{password}@{host}:6379/2')
        else:
            redis_pool = redis.ConnectionPool.from_url(f'redis://{host}:6379/2')

async def close_redis_pool():
    global redis_pool
    if redis_pool is not None:
        await redis_pool.disconnect()
        redis_pool = None

async def test_redis_connection():
    try:
        async with redis.Redis(connection_pool=redis_pool) as r:
            await r.ping()
            return True
    except Exception:
        return False