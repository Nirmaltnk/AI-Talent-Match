from flask import Flask
from .config import Config
from .routes.api import api_bp
from .utils.logging import setup_logging

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    setup_logging()
    app.register_blueprint(api_bp, url_prefix="/api")
    return app