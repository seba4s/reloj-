#!/usr/bin/env python3
"""
Servidor unificado que sirve frontend y backend en el mismo puerto
"""
import os
import sys
from pathlib import Path

# Agregar el directorio backend al path
current_dir = Path(__file__).parent.absolute()
backend_dir = current_dir / 'backend'
sys.path.insert(0, str(backend_dir))

# Verificar que el directorio backend existe
if not backend_dir.exists():
    print(f"❌ Error: No se encuentra el directorio backend en {backend_dir}")
    sys.exit(1)

# Importar y ejecutar la aplicación Flask
if __name__ == '__main__':
    try:
        from app.main import app

        print("=" * 50)
        print("🚀 Servidor Unificado - Reloj Web")
        print("=" * 50)
        print(f"📱 Frontend + Backend: http://localhost:5000/")
        print(f"🔧 API endpoints: http://localhost:5000/api/")
        print("=" * 50)
        print("Presiona Ctrl+C para detener")
        print()
        
        app.run(host='0.0.0.0', port=5000, debug=True)
    except ImportError as e:
        print(f"❌ Error al importar la aplicación: {e}")
        print(f"📂 Directorio actual: {current_dir}")
        print(f"📂 Directorio backend: {backend_dir}")
        print(f"📂 Archivos en backend: {list(backend_dir.iterdir()) if backend_dir.exists() else 'No existe'}")
        sys.exit(1)
    except Exception as e:
        print(f"❌ Error inesperado: {e}")
        sys.exit(1)