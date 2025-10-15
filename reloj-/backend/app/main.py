
from flask import Flask
from app.config import Config
from app.api import alarms, stopwatch, timer, world_clock, env_clock

app = Flask(__name__)
app.config.from_object(Config)

# Registrar blueprints
app.register_blueprint(alarms.bp)
app.register_blueprint(stopwatch.bp)
app.register_blueprint(timer.bp)
app.register_blueprint(world_clock.bp)
app.register_blueprint(env_clock.bp)

@app.route('/')

def index():
    return {'message': 'API de Reloj funcionando'}

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
