@echo off
echo 🚀 Pushing Retell POC to GitHub
echo ===============================

set /p username="Enter your GitHub username: "

echo.
echo Adding GitHub remote...
git remote add origin https://github.com/%username%/retell-poc.git

echo.
echo Renaming branch to main...
git branch -M main

echo.
echo Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Success! Your repository is now on GitHub:
echo https://github.com/%username%/retell-poc
echo.
echo 📋 Next Steps:
echo 1. Visit the URL above to verify your code is uploaded
echo 2. Follow DEPLOYMENT_GUIDE.md to deploy to Render + Vercel
echo 3. Share the final Vercel URL with your manager
echo.
pause