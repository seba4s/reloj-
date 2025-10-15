from flask import Blueprint, jsonify, request
from datetime import datetime
from zoneinfo import ZoneInfo

bp = Blueprint('world_clock', __name__, url_prefix='/api/worldclock')

# Ciudades disponibles con sus zonas horarias
CITY_TIMEZONES = {
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

AVAILABLE_CITIES = list(CITY_TIMEZONES.keys())

def format_utc_offset(offset):
    """Formatea un desplazamiento UTC como ±HH:MM"""
    if offset is None:
        return '+00:00'
    total_minutes = int(offset.total_seconds() // 60)
    hours, minutes = divmod(abs(total_minutes), 60)
    sign = '+' if total_minutes >= 0 else '-'
    return f"{sign}{hours:02d}:{minutes:02d}"

def get_city_time_fast(city):
    """Obtiene la hora de una ciudad usando zoneinfo (rápido y offline)"""
    try:
        timezone_name = CITY_TIMEZONES.get(city, 'UTC')
        timezone = ZoneInfo(timezone_name)
        now = datetime.now(timezone)
        
        return {
            'city': city,
            'time': now.strftime('%H:%M:%S'),
            'date': now.strftime('%m/%d/%Y'),
            'timezone': timezone_name,
            'utc_offset': format_utc_offset(now.utcoffset()),
            'success': True
        }
    except Exception as e:
        # Fallback con hora local
        now = datetime.now()
        return {
            'city': city,
            'time': now.strftime('%H:%M:%S'),
            'date': now.strftime('%m/%d/%Y'),
            'timezone': 'Local',
            'utc_offset': '+00:00',
            'success': False,
            'error': str(e)
        }

@bp.route('/', methods=['GET'])
def get_times():
    """Obtiene las horas de todas las ciudades disponibles"""
    result = {}
    
    for city in AVAILABLE_CITIES:
        time_data = get_city_time_fast(city)
        result[city] = {
            'time': time_data['time'],
            'date': time_data['date'],
            'timezone': time_data['timezone'],
            'utc_offset': time_data['utc_offset']
        }
    
    return jsonify(result)

@bp.route('/cities', methods=['GET'])
def get_cities():
    """Obtiene la lista de ciudades disponibles"""
    return jsonify({'cities': AVAILABLE_CITIES})

@bp.route('/<city>', methods=['GET'])
def get_city_time(city):
    """Obtiene la hora de una ciudad específica"""
    if city not in AVAILABLE_CITIES:
        return jsonify({'error': f'Ciudad {city} no disponible'}), 404
    
    time_data = get_city_time_fast(city)
    return jsonify(time_data)
