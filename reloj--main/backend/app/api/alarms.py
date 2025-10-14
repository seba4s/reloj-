

from flask import Blueprint, request, jsonify
from ..storage import (
    get_alarms, add_alarm, update_alarm, delete_alarm,
    next_alarm, prev_alarm, get_current_alarm, reset_alarm_navigation,
    get_alarms_count, display_alarms_structure
)
import time

bp = Blueprint('alarms', __name__, url_prefix='/api/alarms')

@bp.route('/', methods=['GET'])
def list_alarms():
    """Retorna todas las alarmas en la lista circular"""
    return jsonify(get_alarms())

@bp.route('/', methods=['POST'])
def create_alarm():
    """Crea una nueva alarma y la añade a la lista circular"""
    data = request.json
    alarm = {
        'id': int(time.time() * 1000),
        'time': data.get('time'),
        'label': data.get('label', ''),
        'active': True
    }
    add_alarm(alarm)
    return jsonify(alarm), 201

@bp.route('/<int:alarm_id>', methods=['PUT'])
def edit_alarm(alarm_id):
    """Actualiza una alarma existente en la lista circular"""
    data = request.json
    alarm = update_alarm(alarm_id, data)
    if alarm:
        return jsonify(alarm)
    return jsonify({'error': 'No encontrada'}), 404

@bp.route('/<int:alarm_id>', methods=['DELETE'])
def remove_alarm(alarm_id):
    """Elimina una alarma de la lista circular"""
    success = delete_alarm(alarm_id)
    if success:
        return '', 204
    return jsonify({'error': 'No encontrada'}), 404

# ========== NUEVOS ENDPOINTS PARA NAVEGACIÓN CIRCULAR ==========

@bp.route('/next', methods=['GET'])
def get_next_alarm():
    """
    Navega a la siguiente alarma de forma circular.
    Si estás en la última alarma, vuelve a la primera.
    """
    alarm = next_alarm()
    if alarm:
        return jsonify(alarm)
    return jsonify({'message': 'No hay alarmas'}), 404

@bp.route('/prev', methods=['GET'])
def get_prev_alarm():
    """
    Navega a la alarma anterior de forma circular.
    Si estás en la primera alarma, va a la última.
    """
    alarm = prev_alarm()
    if alarm:
        return jsonify(alarm)
    return jsonify({'message': 'No hay alarmas'}), 404

@bp.route('/current', methods=['GET'])
def get_current():
    """
    Retorna la alarma actual sin mover el puntero de navegación.
    """
    alarm = get_current_alarm()
    if alarm:
        return jsonify(alarm)
    return jsonify({'message': 'No hay alarmas o puntero no inicializado'}), 404

@bp.route('/reset', methods=['POST'])
def reset_navigation():
    """
    Reinicia el puntero de navegación a la primera alarma.
    """
    alarm = reset_alarm_navigation()
    if alarm:
        return jsonify({'message': 'Navegación reiniciada', 'current': alarm})
    return jsonify({'message': 'No hay alarmas'}), 404

@bp.route('/count', methods=['GET'])
def get_count():
    """
    Retorna el número total de alarmas en la lista circular.
    """
    return jsonify({'count': get_alarms_count()})

@bp.route('/structure', methods=['GET'])
def get_structure():
    """
    Retorna una representación visual de la estructura circular.
    Útil para debugging y demostrar la implementación de lista circular doble.
    """
    return jsonify(display_alarms_structure())

