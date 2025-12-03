"""Main application entry point."""
import os
from dotenv import load_dotenv
load_dotenv()

from app import create_app
from app.models import db

# Create Flask application
app = create_app(os.environ.get('FLASK_ENV', 'development'))


@app.shell_context_processor
def make_shell_context():
    """Provide shell context for Flask CLI."""
    return {'db': db}


if __name__ == '__main__':
    # Development server
    port = int(os.environ.get('PORT', 5001))
    app.run(
        host='0.0.0.0',
        port=port,
        debug=os.environ.get('FLASK_ENV') == 'development'
    )