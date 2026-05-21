from fastapi import APIRouter
from app.api.v1 import account_routes, auth_routes, chat_routes, dashboard_routes, exercise_routes, journal_routes, mood_routes, safety_routes, settings_routes

router = APIRouter()
router.include_router(auth_routes.router, prefix='/auth', tags=['auth'])
router.include_router(chat_routes.router, prefix='/chat', tags=['chat'])
router.include_router(mood_routes.router, prefix='/mood', tags=['mood'])
router.include_router(journal_routes.router, prefix='/journal', tags=['journal'])
router.include_router(exercise_routes.router, prefix='/exercises', tags=['exercises'])
router.include_router(safety_routes.router, prefix='/safety', tags=['safety'])
router.include_router(settings_routes.router, prefix='/settings', tags=['settings'])
router.include_router(account_routes.router, prefix='/account', tags=['account'])
router.include_router(dashboard_routes.router, prefix='/dashboard', tags=['dashboard'])
