import os
import re
from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential
from ..config import Config


class DocumentIntelligenceService:
    def __init__(self):
        self.client = DocumentAnalysisClient(
            endpoint=Config.AZUREDOCINTELLIGENCE_ENDPOINT,
            credential=AzureKeyCredential(Config.AZUREDOCINTELLIGENCE_API_KEY)
        )

    def extract_text_from_pdf(self, pdf_path):
        try:
            with open(pdf_path, "rb") as f:
                poller = self.client.begin_analyze_document(
                    "prebuilt-layout", document=f)
                result = poller.result()
                text = ""
                for page in result.pages:
                    for line in page.lines:
                        text += line.content + " "
                return text
        except Exception as e:
            raise Exception(f"Failed to extract text from PDF: {str(e)}")

    def clean_text(self, text):
        text = re.sub(r'\s+', ' ', text)
        text = re.sub(r'[^a-zA-Z0-9\s]', '', text)
        return text
