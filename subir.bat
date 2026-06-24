@echo off
REM ===== Tianguis Digital MX — subir cambios a GitHub (auto-deploy en Vercel) =====
cd /d "%~dp0"
echo Subiendo cambios de Tianguis Digital MX...
echo.
git add .
git commit -m "Actualizacion Tianguis %date% %time%"
git push
echo.
echo Listo. Vercel desplegara automaticamente en 1-2 minutos.
pause
