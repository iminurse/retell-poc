@echo off
echo 🚀 Retell POC - Cloud Deployment Helper
echo ======================================

REM Check if we're in the right directory
if not exist "backend" (
    echo ❌ Error: Please run this script from the retell-poc root directory
    pause
    exit /b 1
)
if not exist "frontend" (
    echo ❌ Error: Please run this script from the retell-poc root directory
    pause
    exit /b 1
)

echo.
echo 📋 Pre-deployment Checklist:
echo 1. ✅ Render account created and connected to GitHub
echo 2. ✅ Vercel account created and connected to GitHub
echo 3. ✅ Repository pushed to GitHub
echo 4. ✅ Retell API credentials ready
echo.

set /p checklist="Have you completed all the above steps? (y/n): "
if /i not "%checklist%"=="y" (
    echo Please complete the checklist first, then run this script again.
    pause
    exit /b 1
)

echo.
echo 🔧 Step 1: Backend Deployment (Render)
echo ======================================
echo 1. Go to https://render.com
echo 2. Click 'New +' → 'Web Service'
echo 3. Connect your repository
echo 4. Use these settings:
echo    - Name: retell-poc-backend
echo    - Root Directory: retell-poc/backend
echo    - Build Command: pip install -r requirements.txt
echo    - Start Command: uvicorn app.main:app --host 0.0.0.0 --port $PORT
echo.
echo 5. Add these environment variables:
echo    RETELL_API_KEY=your_api_key
echo    RETELL_FROM_NUMBER=+1234567890
echo    RETELL_AGENT_ID=your_agent_id
echo    RETELL_BASE_URL=https://api.retellai.com
echo    RETELL_WEBHOOK_VERIFY_KEY=your_api_key
echo    TODAY_DATE=19 December 2025
echo.

pause

echo.
set /p BACKEND_URL="Enter your Render backend URL (e.g., https://retell-poc-backend.onrender.com): "

REM Update frontend environment
echo VITE_API_BASE_URL=%BACKEND_URL% > frontend\.env

echo.
echo 🌐 Step 2: Frontend Deployment (Vercel)
echo ======================================
echo 1. Go to https://vercel.com
echo 2. Click 'New Project'
echo 3. Import your repository
echo 4. Use these settings:
echo    - Framework Preset: Vite
echo    - Root Directory: retell-poc/frontend
echo    - Build Command: npm run build
echo    - Output Directory: dist
echo.
echo 5. Add environment variable:
echo    VITE_API_BASE_URL=%BACKEND_URL%
echo.

pause

echo.
set /p FRONTEND_URL="Enter your Vercel frontend URL (e.g., https://retell-poc.vercel.app): "

echo.
echo 🔄 Step 3: Update CORS Configuration
echo ==================================
echo Update your backend CORS to include: %FRONTEND_URL%
echo Then redeploy your backend service on Render.
echo.

pause

echo.
echo 🎉 Deployment Complete!
echo ======================
echo Frontend URL: %FRONTEND_URL%
echo Backend URL: %BACKEND_URL%
echo.
echo 🧪 Test your deployment:
echo 1. Visit: %FRONTEND_URL%
echo 2. Click 'Refresh' to load call history
echo 3. Create a test call with: +919840626580
echo.
echo 📋 Next Steps:
echo - Share the frontend URL with your manager
echo - Configure Retell webhooks (optional): %BACKEND_URL%/api/webhooks/retell
echo.
echo ✅ Your Retell POC is now live and accessible from anywhere!
pause