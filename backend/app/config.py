import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    AZUREDOCINTELLIGENCE_ENDPOINT = os.getenv("AZUREDOCINTELLIGENCE_ENDPOINT")
    AZUREDOCINTELLIGENCE_API_KEY = os.getenv("AZUREDOCINTELLIGENCE_API_KEY")
    AZURE_OPENAI_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT")
    AZURE_OPENAI_API_KEY = os.getenv("AZURE_OPENAI_API_KEY")
    SQL_CONNECTION_STRING = os.getenv("SQL_CONNECTION_STRING")
    OPENAI_EMBEDDING_MODEL = "text-embedding-3-small"
    OPENAI_CHAT_MODEL = "gpt-4o-mini"
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "./uploads")
    FRONTEND_URL = os.getenv("FRONTEND_URL")
