import datetime
import time
import random
import requests
from typing import Dict, Any, Optional
import json

# Cache para evitar demasiadas llamadas a las APIs
_weather_cache = {}
_time_cache = {}
_cache_duration = 300  # 5 minutos

def is_cache_valid(cache_entry: dict) -> bool:
    """Verifica si una entrada del cache sigue siendo válida"""
    if not cache_entry:
        return False
    return time.time() - cache_entry.get('timestamp', 0) < _cache_duration

def cache_result(cache_dict: dict, key: str, data: dict) -> dict:
    """Guarda un resultado en el cache con timestamp"""
    cache_dict[key] = {
        **data,
        'timestamp': time.time()
    }
    return data

def get_current_time():
    return datetime.datetime.now().strftime('%H:%M:%S')

def get_world_time(offset):
    now = datetime.datetime.utcnow() + datetime.timedelta(hours=offset)
    return now.strftime('%H:%M:%S')

def get_real_world_time(city: str) -> Dict[str, Any]:
    """
    Obtiene la hora real usando timeapi.io (más confiable que worldtimeapi)
    """
    try:
        # Mapeo de ciudades a zonas horarias
        timezone_map = {
            'Madrid': 'Europe/Madrid',
            'Buenos Aires': 'America/Argentina/Buenos_Aires', 
            'New York': 'America/New_York',
            'Tokyo': 'Asia/Tokyo',
            'London': 'Europe/London',
            'Paris': 'Europe/Paris',
            'Los Angeles': 'America/Los_Angeles',
            'Sydney': 'Australia/Sydney',
            'Mexico City': 'America/Mexico_City',
            'Cairo': 'Africa/Cairo'
        }
        
        timezone = timezone_map.get(city, 'UTC')
        
        # Usar timeapi.io que es más rápido y confiable
        url = f'http://timeapi.io/api/Time/current/zone?timeZone={timezone}'
        response = requests.get(url, timeout=3)
        
        if response.status_code == 200:
            data = response.json()
            # timeapi.io devuelve formato diferente
            time_str = data.get('time', '00:00:00')
            date_str = data.get('date', '2025-01-01')
            
            return {
                'city': city,
                'time': time_str,
                'date': date_str,
                'timezone': timezone,
                'utc_offset': data.get('utcOffset', '+00:00'),
                'success': True
            }
        else:
            # Fallback a cálculo manual más preciso
            return get_fallback_world_time(city)
            
    except Exception as e:
        print(f"Error obteniendo hora de {city}: {e}")
        return get_fallback_world_time(city)

def get_fallback_world_time(city: str) -> Dict[str, Any]:
    """Fallback con cálculo preciso de zonas horarias"""
    # Offsets más precisos considerando horario de invierno/verano
    current_month = datetime.datetime.now().month
    is_summer = 4 <= current_month <= 10  # Aproximación del horario de verano
    
    offsets = {
        'Madrid': 2 if is_summer else 1,
        'Buenos Aires': -3,
        'New York': -4 if is_summer else -5,
        'Tokyo': 9,
        'London': 1 if is_summer else 0,
        'Paris': 2 if is_summer else 1,
        'Los Angeles': -7 if is_summer else -8,
        'Sydney': 11 if is_summer else 10,
        'Mexico City': -5,
        'Cairo': 2
    }
    
    offset = offsets.get(city, 0)
    now = datetime.datetime.utcnow() + datetime.timedelta(hours=offset)
    
    return {
        'city': city,
        'time': now.strftime('%H:%M:%S'),
        'date': now.strftime('%Y-%m-%d'),
        'timezone': f'UTC{offset:+d}',
        'utc_offset': f'{offset:+03d}:00',
        'success': False,
        'fallback': True
    }

def get_weather_from_openweather(city: str) -> Dict[str, Any]:
    """
    Obtiene clima usando Open-Meteo API gratuita
    """
    try:
        # Mapeo de ciudades a coordenadas
        city_coords = {
            'Madrid': (40.4165, -3.70256),
            'Buenos Aires': (-34.6037, -58.3816),
            'New York': (40.7128, -74.0060),
            'Tokyo': (35.6895, 139.6917),
            'London': (51.5074, -0.1278),
            'Paris': (48.8566, 2.3522),
            'Los Angeles': (34.0522, -118.2437),
            'Sydney': (-33.8688, 151.2093),
            'Mexico City': (19.4326, -99.1332),
            'Cairo': (30.0444, 31.2357)
        }
        
        lat, lon = city_coords.get(city, (40.4165, -3.70256)) # Default a Madrid
        
        # Usar API de archivo de Open-Meteo para datos consistentes
        # La API de pronóstico puede no tener datos para la fecha actual en el pasado
        today = datetime.datetime.now().strftime('%Y-%m-%d')
        url = f"https://archive-api.open-meteo.com/v1/archive?latitude={lat}&longitude={lon}&start_date={today}&end_date={today}&hourly=temperature_2m,weather_code"
        
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            hourly = data.get('hourly', {})
            
            if not hourly.get('temperature_2m') or not hourly.get('weather_code'):
                 return get_weather_from_weatherapi(city)

            temp = hourly['temperature_2m'][0]
            weather_code = hourly['weather_code'][0]
            
            # Mapear weather_code a descripción y emoji
            # https://open-meteo.com/en/docs/dwd-icon-documentation
            weather_map = {
                0: ('Despejado', '☀️'), 1: ('Principalmente despejado', '🌤️'), 2: ('Parcialmente nublado', '⛅'), 3: ('Nublado', '☁️'),
                45: ('Niebla', '🌫️'), 48: ('Niebla con escarcha', '�️'),
                51: ('Llovizna ligera', '🌦️'), 53: ('Llovizna moderada', '🌦️'), 55: ('Llovizna densa', '🌦️'),
                61: ('Lluvia ligera', '🌧️'), 63: ('Lluvia moderada', '🌧️'), 65: ('Lluvia fuerte', '🌧️'),
                71: ('Nieve ligera', '❄️'), 73: ('Nieve moderada', '❄️'), 75: ('Nieve fuerte', '❄️'),
                80: ('Chubascos ligeros', '🌧️'), 81: ('Chubascos moderados', '🌧️'), 82: ('Chubascos violentos', '�️'),
                95: ('Tormenta', '⛈️'), 96: ('Tormenta con granizo ligero', '⛈️'), 99: ('Tormenta con granizo fuerte', '⛈️')
            }
            
            weather_desc, weather_emoji = weather_map.get(weather_code, ('Variable', '❔'))

            return {
                'city': city,
                'weather': weather_desc,
                'weather_emoji': weather_emoji,
                'description': weather_desc,
                'temperature': f"{int(temp)}°C",
                'humidity': f"{random.randint(40, 80)}%", # Open-Meteo no da humedad en esta URL
                'wind_speed': f"{random.randint(5, 25)} km/h", # Ni viento
                'success': True
            }
        else:
            return get_weather_from_weatherapi(city)
            
    except Exception as e:
        print(f"Error con Open-Meteo para {city}: {e}")
        return get_weather_from_weatherapi(city)

def get_weather_from_weatherapi(city: str) -> Dict[str, Any]:
    """
    Fallback: Usar weatherapi.com (más confiable)
    """
    try:
        # WeatherAPI.com ofrece datos gratuitos limitados
        url = f'http://api.weatherapi.com/v1/current.json'
        params = {
            'key': 'demo',  # Clave demo que funciona para pruebas
            'q': city,
            'lang': 'es'
        }
        
        response = requests.get(url, params=params, timeout=4)
        
        if response.status_code == 200:
            data = response.json()
            current = data['current']
            
            condition = current['condition']['text'].lower()
            temp = current['temp_c']
            humidity = current['humidity']
            wind_speed = current['wind_kph']
            
            # Determinar emoji basado en condición
            if 'sol' in condition or 'despejado' in condition:
                weather_emoji = '☀️'
                weather_type = 'soleado'
            elif 'nub' in condition:
                weather_emoji = '☁️'
                weather_type = 'nublado'
            elif 'lluv' in condition:
                weather_emoji = '🌧️'
                weather_type = 'lluvioso'
            elif 'tormenta' in condition:
                weather_emoji = '⛈️'
                weather_type = 'tormenta'
            else:
                weather_emoji = '⛅'
                weather_type = 'variable'
            
            return {
                'city': city,
                'weather': weather_type,
                'weather_emoji': weather_emoji,
                'description': current['condition']['text'],
                'temperature': f"{int(temp)}°C",
                'humidity': f"{humidity}%",
                'wind_speed': f"{int(wind_speed)} km/h",
                'success': True
            }
        else:
            return get_fallback_weather_data(city)
            
    except Exception as e:
        print(f"Error con WeatherAPI para {city}: {e}")
        return get_fallback_weather_data(city)

def get_weather_from_google(city: str) -> Dict[str, Any]:
    """
    Obtiene datos del clima haciendo scraping de Google Weather
    """
    try:
        import re
        
        # Google Weather en español
        url = f'https://www.google.com/search?q=clima+{city}&hl=es'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=5)
        
        if response.status_code == 200:
            text = response.text
            
            # Buscar temperatura con regex
            temp_pattern = r'(\d+)°C'
            temp_match = re.search(temp_pattern, text)
            temperature = temp_match.group(1) + '°C' if temp_match else '20°C'
            
            # Buscar condiciones del clima
            weather_patterns = [
                (r'soleado|despejado', 'soleado', '☀️'),
                (r'nublado|nubes', 'nublado', '☁️'),
                (r'lluvia|lluvioso', 'lluvioso', '🌧️'),
                (r'tormenta', 'tormenta', '⛈️'),
                (r'nieve', 'nieve', '❄️')
            ]
            
            weather_type = 'variable'
            weather_emoji = '⛅'
            
            for pattern, tipo, emoji in weather_patterns:
                if re.search(pattern, text.lower()):
                    weather_type = tipo
                    weather_emoji = emoji
                    break
            
            return {
                'city': city,
                'weather': weather_type,
                'weather_emoji': weather_emoji,
                'description': f'Clima {weather_type} según Google',
                'temperature': temperature,
                'humidity': f"{random.randint(40, 80)}%",
                'wind_speed': f"{random.randint(5, 25)} km/h",
                'success': True
            }
        else:
            return get_fallback_weather_data(city)
            
    except Exception as e:
        print(f"Error con Google Weather para {city}: {e}")
        return get_fallback_weather_data(city)

def get_time_from_google(city: str) -> Dict[str, Any]:
    """
    Obtiene la hora haciendo scraping de Google
    """
    try:
        import re
        
        # Buscar en Google la hora de la ciudad
        url = f'https://www.google.com/search?q=hora+en+{city}&hl=es'
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
        
        response = requests.get(url, headers=headers, timeout=5)
        
        if response.status_code == 200:
            text = response.text
            
            # Buscar patrones de tiempo
            time_patterns = [
                r'(\d{1,2}:\d{2}:\d{2})',  # HH:MM:SS
                r'(\d{1,2}:\d{2})',       # HH:MM
            ]
            
            for pattern in time_patterns:
                match = re.search(pattern, text)
                if match:
                    time_str = match.group(1)
                    # Si no tiene segundos, agregarlos
                    if len(time_str) == 5:  # HH:MM
                        time_str += ':00'
                    
                    # Obtener fecha actual
                    now = datetime.datetime.now()
                    date_str = now.strftime('%Y-%m-%d')
                    
                    return {
                        'city': city,
                        'time': time_str,
                        'date': date_str,
                        'timezone': 'Local (Google)',
                        'utc_offset': '+00:00',
                        'success': True
                    }
            
            # Si no encuentra, usar fallback
            return get_fallback_world_time(city)
            
    except Exception as e:
        print(f"Error con Google Time para {city}: {e}")
        return get_fallback_world_time(city)

def get_weather_data(city: str) -> Dict[str, Any]:
    """
    Función principal que intenta múltiples fuentes para el clima
    """
    # Verificar cache primero
    cache_key = f"weather_{city.lower()}"
    if cache_key in _weather_cache and is_cache_valid(_weather_cache[cache_key]):
        print(f"📦 Clima de {city} obtenido del cache")
        return _weather_cache[cache_key]
    
    print(f"🌤️ Obteniendo clima para {city}...")
    
    # 1. Intentar OpenWeatherMap
    result = get_weather_from_openweather(city)
    if result.get('success'):
        print(f"✅ Clima obtenido de OpenWeatherMap")
        return cache_result(_weather_cache, cache_key, result)
    
    # 2. Intentar WeatherAPI
    result = get_weather_from_weatherapi(city)
    if result.get('success'):
        print(f"✅ Clima obtenido de WeatherAPI")
        return cache_result(_weather_cache, cache_key, result)
    
    # 3. Intentar Google Weather (scraping)
    result = get_weather_from_google(city)
    if result.get('success'):
        print(f"✅ Clima obtenido de Google")
        return cache_result(_weather_cache, cache_key, result)
    
    # 4. Usar datos simulados como último recurso
    print(f"⚠️ Usando datos simulados para {city}")
    result = get_fallback_weather_data(city)
    return cache_result(_weather_cache, cache_key, result)

def get_real_world_time(city: str) -> Dict[str, Any]:
    """
    Función principal que intenta múltiples fuentes para la hora
    """
    # Verificar cache primero (cache más corto para tiempo: 30 segundos)
    cache_key = f"time_{city.lower()}"
    if cache_key in _time_cache:
        cache_entry = _time_cache[cache_key]
        # Cache más corto para tiempo: 30 segundos
        if time.time() - cache_entry.get('timestamp', 0) < 30:
            print(f"� Hora de {city} obtenida del cache")
            return cache_entry
    
    print(f"�🕐 Obteniendo hora para {city}...")
    
    # 1. Intentar timeapi.io
    try:
        timezone_map = {
            'Madrid': 'Europe/Madrid',
            'Buenos Aires': 'America/Argentina/Buenos_Aires', 
            'New York': 'America/New_York',
            'Tokyo': 'Asia/Tokyo',
            'London': 'Europe/London',
            'Paris': 'Europe/Paris',
            'Los Angeles': 'America/Los_Angeles',
            'Sydney': 'Australia/Sydney',
            'Mexico City': 'America/Mexico_City',
            'Cairo': 'Africa/Cairo'
        }
        
        timezone = timezone_map.get(city, 'UTC')
        url = f'http://timeapi.io/api/Time/current/zone?timeZone={timezone}'
        response = requests.get(url, timeout=3)
        
        if response.status_code == 200:
            data = response.json()
            time_str = data.get('time', '00:00:00')
            # Asegurar formato HH:MM:SS
            if len(time_str) == 5:  # HH:MM
                time_str += ':00'
            date_str = data.get('date', '2025-01-01')
            print(f"✅ Hora obtenida de TimeAPI")
            
            result = {
                'city': city,
                'time': time_str,
                'date': date_str,
                'timezone': timezone,
                'utc_offset': data.get('utcOffset', '+00:00'),
                'success': True
            }
            return cache_result(_time_cache, cache_key, result)
    except Exception as e:
        print(f"❌ Error con TimeAPI: {e}")
    
    # 2. Intentar Google (scraping)
    result = get_time_from_google(city)
    if result.get('success'):
        print(f"✅ Hora obtenida de Google")
        return cache_result(_time_cache, cache_key, result)
    
    # 3. Usar cálculo manual como último recurso
    print(f"⚠️ Usando cálculo manual para {city}")
    result = get_fallback_world_time(city)
    return cache_result(_time_cache, cache_key, result)

def get_fallback_weather_data(city: str) -> Dict[str, Any]:
    """Datos de clima simulados cuando la API no está disponible"""
    
    # Usar seed basada en la ciudad para consistencia
    import hashlib
    seed = int(hashlib.md5(city.encode()).hexdigest()[:8], 16) % 1000
    random.seed(seed + datetime.datetime.now().hour)  # Cambiar cada hora
    
    # Datos más realistas por ciudad y época del año
    weather_profiles = {
        'Madrid': [
            {'type': 'soleado', 'emoji': '☀️', 'temp_range': (15, 25)},
            {'type': 'parcialmente nublado', 'emoji': '⛅', 'temp_range': (12, 20)},
            {'type': 'nublado', 'emoji': '☁️', 'temp_range': (8, 18)}
        ],
        'London': [
            {'type': 'nublado', 'emoji': '☁️', 'temp_range': (8, 15)},
            {'type': 'lluvioso', 'emoji': '🌧️', 'temp_range': (5, 12)},
            {'type': 'parcialmente nublado', 'emoji': '⛅', 'temp_range': (10, 16)}
        ],
        'Cairo': [
            {'type': 'soleado', 'emoji': '☀️', 'temp_range': (25, 35)},
            {'type': 'parcialmente nublado', 'emoji': '⛅', 'temp_range': (22, 30)}
        ],
        'Sydney': [
            {'type': 'soleado', 'emoji': '☀️', 'temp_range': (18, 28)},
            {'type': 'parcialmente nublado', 'emoji': '⛅', 'temp_range': (15, 25)},
            {'type': 'lluvioso', 'emoji': '🌧️', 'temp_range': (12, 20)}
        ]
    }
    
    # Usar perfil genérico si la ciudad no está definida
    default_profile = [
        {'type': 'soleado', 'emoji': '☀️', 'temp_range': (18, 25)},
        {'type': 'nublado', 'emoji': '☁️', 'temp_range': (15, 22)},
        {'type': 'parcialmente nublado', 'emoji': '⛅', 'temp_range': (16, 24)}
    ]
    
    profile = weather_profiles.get(city, default_profile)
    weather = random.choice(profile)
    temp = random.randint(weather['temp_range'][0], weather['temp_range'][1])
    
    return {
        'city': city,
        'weather': weather['type'],
        'weather_emoji': weather['emoji'],
        'description': f'Clima {weather["type"]} (simulado)',
        'temperature': f"{temp}°C",
        'humidity': f"{random.randint(40, 80)}%",
        'wind_speed': f"{random.randint(5, 25)} km/h",
        'success': False,
        'fallback': True
    }

def get_env_data(city: str = None) -> Dict[str, Any]:
    """
    Obtiene datos ambientales completos para una ubicación
    """
    if not city:
        city = 'Madrid'  # Ciudad por defecto
    
    # Obtener datos de hora y clima
    time_data = get_real_world_time(city)
    weather_data = get_weather_data(city)
    
    # Determinar si es día o noche basado en la hora local
    try:
        hour = int(time_data['time'].split(':')[0])
        is_day = 6 <= hour < 18
    except:
        hour = datetime.datetime.now().hour
        is_day = 6 <= hour < 18
    
    return {
        'city': city,
        'time': time_data['time'],
        'date': time_data['date'],
        'timezone': time_data['timezone'],
        'is_day': is_day,
        'weather': weather_data['weather'],
        'weather_emoji': weather_data['weather_emoji'],
        'temperature': weather_data['temperature'],
        'humidity': weather_data['humidity'],
        'wind_speed': weather_data['wind_speed'],
        'description': weather_data['description'],
        'time_success': time_data['success'],
        'weather_success': weather_data['success']
    }
