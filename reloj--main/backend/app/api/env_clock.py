from flask import Blueprint, jsonify, request
from ..utils import get_env_data

bp = Blueprint('env_clock', __name__, url_prefix='/api/envclock')

@bp.route('/', methods=['GET'])
def get_env():
    """Obtiene datos ambientales de la ciudad por defecto (Madrid)"""
    return jsonify(get_env_data())

@bp.route('/<city>', methods=['GET'])
def get_env_by_city(city):
    """Obtiene datos ambientales de una ciudad específica"""
    return jsonify(get_env_data(city))

@bp.route('/set', methods=['POST'])
def set_city():
    """Permite establecer una ciudad para el reloj ambiental"""
    data = request.get_json()
    city = data.get('city', 'Madrid')
    
    env_data = get_env_data(city)
    return jsonify(env_data)
