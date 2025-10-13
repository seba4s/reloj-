
from flask import Flask, send_from_directory, send_file
import os
import sys
from pathlib import Path

# Agregar el directorio backend al path de Python
backend_dir = Path(__file__).parent.parent.absolute()
sys.path.insert(0, str(backend_dir))

from app.config import Config
from app.api import alarms, stopwatch, timer, env_clock

# Configurar Flask para servir archivos estáticos del frontend
frontend_folder = backend_dir.parent / 'frontend' / 'public'
app = Flask(__name__, static_folder=str(frontend_folder), static_url_path='')
app.config.from_object(Config)

# Registrar blueprints
app.register_blueprint(alarms.bp)
app.register_blueprint(stopwatch.bp)
app.register_blueprint(timer.bp)
app.register_blueprint(env_clock.bp)

@app.route('/')
def index():
    """Servir la página principal del frontend"""
    return send_file(str(frontend_folder / 'index.html'))

@app.route('/<path:path>')
def serve_static_files(path):
    """Servir archivos estáticos del frontend"""
    try:
        return send_from_directory(str(frontend_folder), path)
    except:
        # Si el archivo no existe, servir index.html (para SPA routing)
        return send_file(str(frontend_folder / 'index.html'))

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
