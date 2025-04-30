import pyodbc
import json
from ..config import Config
import logging
import numpy as np
 
 
class SQLService:
    def __init__(self):
        self.conn_str = Config.SQL_CONNECTION_STRING
 
    def get_connection(self):
        try:
            conn = pyodbc.connect(self.conn_str)
            return conn
        except Exception as e:
            logging.error(f"Failed to connect to SQL DB: {str(e)}")
            raise
 
    def insert_embedding(self, chunkid, filename, chunk, embedding):
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            query = """
            INSERT INTO resumedocs (chunkid, filename, chunk, embedding)
            VALUES (?, ?, ?, ?)
            """
            cursor.execute(query, chunkid, filename,
                           chunk, json.dumps(embedding))
            conn.commit()
        except Exception as e:
            logging.error(f"Failed to insert embedding: {str(e)}")
            raise
        finally:
            conn.close()
 
    def vector_search(self, query_embedding, num_results=3):
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            query = """
            SELECT TOP(?) filename, chunkid, chunk, embedding
            FROM dbo.resumedocs
            ORDER BY chunk
            """
            cursor.execute(query, num_results)
            results = cursor.fetchall()
            query_embedding = np.array(query_embedding)
            search_results = []
            for r in results:
                embedding = json.loads(r[3])
                embedding = np.array(embedding)
                similarity = np.dot(query_embedding, embedding) / (
                    np.linalg.norm(query_embedding) * np.linalg.norm(embedding)
                )
                search_results.append({
                    "filename": r[0],
                    "chunkid": r[1],
                    "similarity_score": float(similarity)
                })
            return sorted(search_results, key=lambda x: x["similarity_score"], reverse=True)[:num_results]
        except Exception as e:
            logging.error(f"Vector search failed: {str(e)}")
            raise
        finally:
            conn.close()
 
    def has_documents(self):
        conn = self.get_connection()
        cursor = conn.cursor()
        try:
            query = "SELECT COUNT(*) FROM resumedocs"
            cursor.execute(query)
            count = cursor.fetchone()[0]
            return count > 0
        except Exception as e:
            logging.error(f"Failed to check for documents: {str(e)}")
            raise
        finally:
            conn.close()