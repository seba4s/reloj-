from flask import Blueprint, jsonify, request
import time

bp = Blueprint('stopwatch', __name__, url_prefix='/api/stopwatch')

# Estado simple en memoria
state = {'running': False, 'start': None, 'elapsed': 0}

@bp.route('/', methods=['GET'])
def get_state():
    if state['running']:
        elapsed = state['elapsed'] + (time.time() - state['start'])
    else:
        elapsed = state['elapsed']
    return jsonify({'running': state['running'], 'elapsed': elapsed})

@bp.route('/start', methods=['POST'])
def start():
    if not state['running']:
        state['start'] = time.time()
        state['running'] = True
    return get_state()

@bp.route('/stop', methods=['POST'])
def stop():
    if state['running']:
        state['elapsed'] += time.time() - state['start']
        state['running'] = False
    return get_state()

@bp.route('/reset', methods=['POST'])
def reset():
    state['running'] = False
    state['start'] = None
    state['elapsed'] = 0
    return get_state()
