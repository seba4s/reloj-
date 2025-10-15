from flask import Blueprint, jsonify, request
import time

bp = Blueprint('timer', __name__, url_prefix='/api/timer')

# Estado simple en memoria
state = {'running': False, 'start': None, 'duration': 0, 'remaining': 0}

@bp.route('/', methods=['GET'])
def get_state():
    if state['running']:
        elapsed = time.time() - state['start']
        remaining = max(0, state['duration'] - elapsed)
        if remaining == 0:
            state['running'] = False
        state['remaining'] = remaining
    return jsonify({'running': state['running'], 'remaining': state['remaining']})

@bp.route('/start', methods=['POST'])
def start():
    data = request.json
    duration = data.get('duration', 0)
    if duration > 0:
        state['duration'] = duration
        state['start'] = time.time()
        state['running'] = True
        state['remaining'] = duration
    return get_state()

@bp.route('/stop', methods=['POST'])
def stop():
    if state['running']:
        elapsed = time.time() - state['start']
        state['remaining'] = max(0, state['duration'] - elapsed)
        state['running'] = False
    return get_state()

@bp.route('/reset', methods=['POST'])
def reset():
    state['running'] = False
    state['start'] = None
    state['duration'] = 0
    state['remaining'] = 0
    return get_state()
