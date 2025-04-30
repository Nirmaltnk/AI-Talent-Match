from flask import Flask
from flask_cors import CORS
from app.routes.api import api_bp
from app.config import Config

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": Config.FRONTEND_URL}})
app.register_blueprint(api_bp, url_prefix='/api')

if __name__ == '__main__':
    app.run(debug=True)
