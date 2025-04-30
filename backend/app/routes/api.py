from flask import Blueprint, request, jsonify
from ..services.document_intelligence import DocumentIntelligenceService
from ..services.openai_service import OpenAIService
from ..services.sql_service import SQLService
from ..utils.chunking import split_text_into_token_chunks
import os
import uuid
from ..config import Config
import logging
import re
 
api_bp = Blueprint('api', __name__)
 
 
@api_bp.route("/upload_resume", methods=["POST"])
def upload_resume():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
 
        files = request.files.getlist('file')
        if not files or all(file.filename == '' for file in files):
            return jsonify({"error": "No files selected"}), 400
 
        doc_service = DocumentIntelligenceService()
        openai_service = OpenAIService()
        sql_service = SQLService()
        results = []
 
        for file in files:
            if file and file.filename.endswith('.pdf'):
                try:
                    filename = file.filename
                    file_path = os.path.join(Config.UPLOAD_FOLDER, filename)
                    file.save(file_path)
 
                    # Extract and clean text
                    text = doc_service.extract_text_from_pdf(file_path)
                    cleaned_text = doc_service.clean_text(text)
 
                    # Store entire text as one row
                    chunk_id = f"{filename}_{uuid.uuid4()}"
                    embedding = openai_service.get_embedding(cleaned_text)
                    sql_service.insert_embedding(
                        chunk_id, filename, cleaned_text, embedding)
 
                    results.append({"filename": filename, "status": "success"})
                    os.remove(file_path)
                except Exception as e:
                    logging.error(f"Error processing {filename}: {str(e)}")
                    results.append(
                        {"filename": filename, "status": "failed", "error": str(e)})
            else:
                results.append(
                    {"filename": file.filename, "status": "failed", "error": "Invalid file format"})
 
        return jsonify({"message": "Processing complete", "results": results}), 200
    except Exception as e:
        logging.error(f"Error processing resumes: {str(e)}")
        return jsonify({"error": f"Failed to process resumes: {str(e)}"}), 500
 
 
@api_bp.route("/analyze", methods=["POST"])
def search():
    try:
        data = request.get_json()
        query = data.get("query")
        num_results = data.get("num_results", 3)
 
        if not query:
            return jsonify({"error": "Query is required"}), 400
 
        openai_service = OpenAIService()
        sql_service = SQLService()
 
        # Check if there are any documents in the database
        if not sql_service.has_documents():
            return jsonify({
                "error": "No resumes found in the database. Please upload resumes first."
            }), 404
 
        query_embedding = openai_service.get_embedding(query)
        search_results = sql_service.vector_search(
            query_embedding, num_results)
 
        # Generate formatted text response using Azure OpenAI
        response_text = openai_service.generate_completion(
            search_results, query)
 
        results = []
        overall_summary = ""
 
        # Regex pattern to match each candidate
        candidate_pattern = re.compile(
            r"\d+\.\s*\*\*Candidate from (.+?)\*\*\n"
            r"\s*-\s*\*\*File:\*\*\s*(.+?)\n"
            r"\s*-\s*\*\*Chunk ID:\*\*\s*(.+?)\n"
            r"\s*-\s*\*\*Similarity Score:\*\*\s*([\d.]+)\n"
            r"\s*-\s*\*\*Snippet:\*\*\s*\"(.+?)\"\n"
            r"\s*-\s*\*\*Summary:\*\*\s*((?:.|\n)+?)(?=\n\d+\.|\n### Overall Summary:|\Z)",
            re.DOTALL
        )
 
        # Regex to extract the overall summary
        summary_pattern = re.compile(
            r"### Overall Summary:\n(.+?)(?=\n\n|\Z)", re.DOTALL
        )
 
        # Parse candidate data
        for match in candidate_pattern.finditer(response_text):
            results.append({
                "filename": match.group(2).strip(),
                "chunk_id": match.group(3).strip(),
                "similarity_score": float(match.group(4)),
                "snippet": match.group(5).strip(),
                "summary": match.group(6).strip()
            })
 
        # Parse overall summary
        summary_match = summary_pattern.search(response_text)
        if summary_match:
            overall_summary = summary_match.group(1).strip()
 
        # Final structured JSON response
        json_response = {
            "results": results,
            "overall_summary": overall_summary
        }
 
        return jsonify(json_response), 200
 
    except Exception as e:
        logging.error(f"Error searching resumes: {str(e)}")
        return jsonify({"error": f"Failed to search resumes: {str(e)}"}), 500
    