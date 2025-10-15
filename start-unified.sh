#!/bin/bash
# Script unificado - Backend sirve Frontend
# Todo corre en http://localhost:5000

echo "=========================================="
echo "Iniciando Reloj Web (Servidor Unificado)"
echo "=========================================="

# Activar entorno virtual
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
else
    echo "Error: Entorno virtual no encontrado. Ejecuta setup.bat primero."
    exit 1
fi

# Configurar variables de Flask
export FLASK_APP=app.main:app
export FLASK_ENV=development

echo "Servidor unificado iniciando..."
echo "Frontend + Backend en: http://localhost:5000/"
echo "API endpoints en: http://localhost:5000/api/"
echo ""
echo "Presiona Ctrl+C para detener"

# Cambiar al directorio backend e iniciar Flask
cd backend
flask run --host=0.0.0.0 --port=5000