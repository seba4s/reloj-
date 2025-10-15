from flask import Blueprint, jsonify, request
from ..utils import get_world_time

bp = Blueprint('world_clock', __name__, url_prefix='/api/worldclock')

# Ejemplo de zonas horarias
ZONES = {
    'UTC': 0,
    'Madrid': 2,
    'Buenos Aires': -3,
    'New York': -4,
    'Tokyo': 9
}

@bp.route('/', methods=['GET'])
def get_times():
    result = {city: get_world_time(offset) for city, offset in ZONES.items()}
    return jsonify(result)
