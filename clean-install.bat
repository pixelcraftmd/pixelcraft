@echo off
REM Clean installation script for Windows

echo.
echo 🧹 Cleaning npm cache...
call npm cache clean --force

echo.
echo 🗑️  Removing node_modules and lock files...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json

echo.
echo 📦 Installing fresh dependencies...
call npm install

echo.
echo ✅ Installation complete!
echo Run: npm run build
echo Run: npm run start
echo.
pause
