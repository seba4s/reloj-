#!/bin/bash
# Inicia backend y frontend (servidor estático simple)


# Iniciar backend
cd backend && ../.venv/bin/flask --app app.main run --host=0.0.0.0 --port=5000 &
BACK_PID=$!
cd ..


# Iniciar servidor estático para frontend
python3 -m http.server 8000 --directory frontend/public &
FRONT_PID=$!

echo "Backend en http://localhost:5000/"
echo "Frontend en http://localhost:8000/"
echo "Presiona Ctrl+C para detener ambos."

# Esperar a que ambos procesos terminen
wait $BACK_PID $FRONT_PID
