from flask import Flask, jsonify, render_template_string

app = Flask(__name__)

# Sample REST API endpoint
@app.route('/api/data', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello, World!"})

# HTML template with a button
html_template = '''
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Sample Web App</title>
    <script>
        function fetchData() {
            fetch('/api/data')
                .then(response => response.json())
                .then(data => {
                    document.getElementById('result').innerText = data.message;
                });
        }
    </script>
</head>
<body>
    <h1>Sample Web App</h1>
    <button onclick="fetchData()">Fetch Data</button>
    <p id="result"></p>
</body>
</html>
'''

@app.route('/')
def home():
    return render_template_string(html_template)

if __name__ == '__main__':
    app.run(debug=True, port=5001)