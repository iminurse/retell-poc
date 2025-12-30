@echo off
echo Setting up Retell POC project...

REM Backend setup
echo Setting up backend...
cd backend

REM Create virtual environment
python -m venv venv

REM Activate virtual environment (Windows)
call venv\Scripts\activate.bat

REM Install Python dependencies
pip install -r requirements.txt

REM Copy environment file
if not exist .env (
    copy .env.example .env
    echo Created .env file. Please edit it with your Retell credentials.
)

cd ..

REM Frontend setup
echo Setting up frontend...
cd frontend

REM Install Node.js dependencies
npm install

cd ..

echo Setup complete!
echo.
echo Next steps:
echo 1. Edit backend\.env with your Retell credentials
echo 2. Start the backend: cd backend ^&^& uvicorn app.main:app --reload
echo 3. Start the frontend: cd frontend ^&^& npm run dev
echo 4. Expose webhook with ngrok: ngrok http 8000

pause