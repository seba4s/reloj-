#!/bin/bash
export FLASK_APP=app.main:app
export FLASK_ENV=development
../.venv/bin/flask run --host=0.0.0.0 --port=5000
