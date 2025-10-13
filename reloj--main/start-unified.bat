@echo off
REM Script batch unificado - Backend sirve Frontend
REM Todo corre en http://localhost:5000

echo ==========================================
echo Iniciando Reloj Web (Servidor Unificado)
echo ==========================================

REM Verificar entorno virtual
if not exist ".venv" (
    echo Error: Entorno virtual no encontrado.
    echo Ejecuta setup.bat primero.
    pause
    exit /b 1
)

REM Activar entorno virtual
echo Activando entorno virtual...
call .venv\Scripts\activate.bat

REM Verificar dependencias
echo Verificando dependencias...
pip install -r backend\requirements.txt -q

REM Configurar variables de Flask
set FLASK_APP=app.main:app
set FLASK_ENV=development

echo.
echo ========================================
echo Servidor unificado iniciando...
echo Frontend + Backend en: http://localhost:5000/
echo API endpoints en: http://localhost:5000/api/
echo ========================================
echo.
echo Presiona Ctrl+C para detener

REM Cambiar al directorio backend e iniciar Flask
cd backend
flask run --host=0.0.0.0 --port=5000

cd ..