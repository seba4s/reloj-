from flask import Blueprint, jsonify
from ..utils import get_env_data

bp = Blueprint('env_clock', __name__, url_prefix='/api/envclock')

@bp.route('/', methods=['GET'])
def get_env():
    return jsonify(get_env_data())
