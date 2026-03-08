@echo off
setlocal
set "PATH=C:\Program Files\nodejs;C:\Users\Administrator\AppData\Roaming\npm;%PATH%"
cd /d "e:\Quest\what-to-eat\frontend"

if "%~1"=="" (
    echo.
    echo ============================================
    echo   "吃什么" 一键部署到 Vercel
    echo ============================================
    echo.
    echo 用法: deploy.bat 你的Token
    echo.
    echo 获取 Token 步骤:
    echo   1. 打开 https://vercel.com/account/tokens
    echo   2. 点击 "Create" 创建一个新 Token
    echo   3. 复制 Token, 运行: deploy.bat 你的Token
    echo.
    exit /b 1
)

set "VERCEL_TOKEN=%~1"

echo.
echo [1/3] 安装依赖...
call npm install --silent 2>nul

echo [2/3] 构建项目...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo 构建失败！
    exit /b 1
)

echo [3/3] 部署到 Vercel...
call vercel deploy --yes --prod --token=%VERCEL_TOKEN%

echo.
echo 部署完成！请查看上方的 URL 链接。
endlocal
