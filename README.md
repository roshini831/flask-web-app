# Flask Web App

A simple Flask web application with a REST API endpoint and interactive UI.

## Features

- **REST API Endpoint**: `/api/data` - Returns JSON data
- **Web Interface**: Interactive HTML page with a button to fetch data
- **Debug Mode**: Enabled for development

## Installation

1. Clone the repository:
```bash
git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
cd YOUR-REPO-NAME
```

2. Create a virtual environment:
```bash
python3 -m venv venv
source venv/bin/activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

## Running the Application

```bash
python3 index.py
```

The application will be available at `http://localhost:5001`

## API Endpoints

- `GET /` - Returns the HTML home page
- `GET /api/data` - Returns JSON data with a message

## Usage

1. Open your browser and navigate to `http://localhost:5001`
2. Click the "Fetch Data" button to fetch data from the API
3. The response will be displayed on the page

## Development

This is a development server. For production deployment, use a production WSGI server like Gunicorn.

## License

MIT
