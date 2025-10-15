
from flask import Blueprint, request, jsonify
from ..storage import get_alarms, add_alarm, update_alarm, delete_alarm
import time

bp = Blueprint('alarms', __name__, url_prefix='/api/alarms')

@bp.route('/', methods=['GET'])
def list_alarms():
    return jsonify(get_alarms())

@bp.route('/', methods=['POST'])
def create_alarm():
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
    data = request.json
    alarm = update_alarm(alarm_id, data)
    if alarm:
        return jsonify(alarm)
    return jsonify({'error': 'No encontrada'}), 404

@bp.route('/<int:alarm_id>', methods=['DELETE'])
def remove_alarm(alarm_id):
    delete_alarm(alarm_id)
    return '', 204
