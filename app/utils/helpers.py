"""Utility functions for the application."""
import functools
from flask import jsonify


def handle_errors(f):
    """Decorator to handle common errors."""
    @functools.wraps(f)
    def decorated(*args, **kwargs):
        try:
            return f(*args, **kwargs)
        except ValueError as e:
            return jsonify({'error': str(e)}), 400
        except Exception as e:
            return jsonify({'error': 'Internal server error', 'details': str(e)}), 500
    return decorated
