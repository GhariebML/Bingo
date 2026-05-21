import time
from collections import defaultdict, deque
from collections.abc import Awaitable, Callable

from fastapi import Request, Response
from starlette.responses import JSONResponse

from app.config import settings

_requests: dict[str, deque[float]] = defaultdict(deque)


async def rate_limit_middleware(request: Request, call_next: Callable[[Request], Awaitable[Response]]) -> Response:
    if request.url.path == '/health':
        return await call_next(request)

    now = time.time()
    window_start = now - 60
    client = request.client.host if request.client else 'unknown'
    key = f'{client}:{request.url.path}'
    bucket = _requests[key]
    while bucket and bucket[0] < window_start:
        bucket.popleft()
    if len(bucket) >= settings.rate_limit_per_minute:
        return JSONResponse(status_code=429, content={'detail': 'Too many requests. Please slow down and try again.'})
    bucket.append(now)
    return await call_next(request)
