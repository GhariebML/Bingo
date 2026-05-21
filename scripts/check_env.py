from pathlib import Path
for path in ['.env.example', 'frontend/.env.example', 'backend/.env.example']:
    print(f'{path}: {Path(path).exists()}')
