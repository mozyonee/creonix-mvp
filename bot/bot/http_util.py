from aiohttp import ClientSession

_session: ClientSession | None = None

def get_http_session() -> ClientSession:
    global _session
    if _session is None or _session.closed:
        _session = ClientSession()
    return _session

async def close_http_session() -> None:
    global _session
    if _session and not _session.closed:
        await _session.close()
        _session = None
