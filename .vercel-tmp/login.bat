@echo off
set PATH=C:\Program Files\nodejs;C:\Users\Administrator\AppData\Roaming\npm;%PATH%
cd /d "e:\Quest\what-to-eat\frontend"
echo === Starting Vercel Login ===
vercel login
echo === Login Exit Code: %ERRORLEVEL% ===
echo === Checking whoami ===
vercel whoami
echo === Done ===
