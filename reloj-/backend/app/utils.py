import datetime
import time
import random

def get_current_time():
    return datetime.datetime.now().strftime('%H:%M:%S')

def get_world_time(offset):
    now = datetime.datetime.utcnow() + datetime.timedelta(hours=offset)
    return now.strftime('%H:%M:%S')

def get_env_data():
    # Simula datos ambientales (día/noche, clima aleatorio)
    hour = datetime.datetime.now().hour
    is_day = 6 <= hour < 18
    weather = random.choice(['soleado', 'nublado', 'lluvioso', 'tormenta'])
    return {'is_day': is_day, 'weather': weather}
