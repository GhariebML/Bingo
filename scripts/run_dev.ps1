$ErrorActionPreference = 'Stop'
Write-Host 'Starting Bingo backend and frontend...'
Start-Process powershell -ArgumentList '-NoExit','-Command','cd backend; python -m uvicorn app.main:app --reload --port 8000'
Start-Process powershell -ArgumentList '-NoExit','-Command','cd frontend; npm run dev'
