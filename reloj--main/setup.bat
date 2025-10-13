@echo off
REM Script de configuracion inicial

echo ========================================
echo Configuracion inicial del proyecto Reloj
echo ========================================

REM Verificar si Python esta instalado
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python no esta instalado o no esta en PATH
    echo Por favor instala Python desde https://python.org
    pause
    exit /b 1
)

echo Python encontrado correctamente.

REM Crear entorno virtual si no existe
if not exist ".venv" (
    echo Creando entorno virtual...
    python -m venv .venv
    if errorlevel 1 (
        echo ERROR: No se pudo crear el entorno virtual
        pause
        exit /b 1
    )
    echo Entorno virtual creado correctamente.
) else (
    echo Entorno virtual ya existe.
)

REM Activar entorno virtual
echo Activando entorno virtual...
call .venv\Scripts\activate.bat

REM Actualizar pip
echo Actualizando pip...
python -m pip install --upgrade pip

REM Instalar dependencias
echo Instalando dependencias del backend...
pip install -r backend\requirements.txt
if errorlevel 1 (
    echo ERROR: No se pudieron instalar las dependencias
    pause
    exit /b 1
)

echo.
echo ========================================
echo Configuracion completada exitosamente!
echo ========================================
echo.
echo Para iniciar la aplicacion, ejecuta:
echo   start.bat    (version simple)
echo   start.ps1    (version PowerShell, mas robusta)
echo.
echo O usa las tareas de VS Code:
echo   Ctrl+Shift+P -> Tasks: Run Task -> "Iniciar Todo"
echo.
pause