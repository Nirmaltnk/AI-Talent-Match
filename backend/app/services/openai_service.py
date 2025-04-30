import requests
import json
from ..config import Config
from openai import AzureOpenAI


class OpenAIService:
    def __init__(self):
        self.embedding_url = f"{Config.AZURE_OPENAI_ENDPOINT}/openai/deployments/{Config.OPENAI_EMBEDDING_MODEL}/embeddings?api-version=2023-05-15"
        self.api_key = Config.AZURE_OPENAI_API_KEY
        self.client = AzureOpenAI(
            api_key=self.api_key,
            api_version="2023-05-15",
            azure_endpoint=Config.AZURE_OPENAI_ENDPOINT
        )

    def get_embedding(self, text):
        try:
            response = requests.post(
                self.embedding_url,
                headers={"api-key": self.api_key,
                         "Content-Type": "application/json"},
                json={"input": text}  # Send text as a string, not [text]
            )
            response.raise_for_status()
            return response.json()['data'][0]['embedding']
        except Exception as e:
            raise Exception(f"Failed to generate embedding: {str(e)}")

    def generate_completion(self, search_results, user_input):
        system_prompt = '''
You are an intelligent & insightful assistant helping recruiters assess resumes based on search results.

For each result, return the following format exactly:

1. **Candidate from <filename>**
   - **File:** <filename>
   - **Chunk ID:** <chunkid>
   - **Similarity Score:** <similarity_score>
   - **Snippet:** "<a short and relevant quote or extract from the chunktext>"
   - **Summary:** <Summary: In 1–2 lines, state if they seems suitable for the role based on skills. Mention specific relevant skills and whether they may be a good fit. If they lack critical experience, say: "May need to validate in interview.">     
        
After listing the top 5 candidates, end with:

### Overall Summary:
<Add a summary about why the candidate maybe a goodfit even if exact skills and the role being hired for are not matching , at the end of the recommendations. Ensure you call out which skills match the description and which ones are missing. If the candidate doesnt have prior experience for the hiring role which we may need to pay extra attention to during the interview process.>

Stick to the formatting exactly, as it will be parsed using regex.
'''
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "system", "content": str(search_results)},
            {"role": "user", "content": user_input}
        ]
        try:
            response = self.client.chat.completions.create(
                model=Config.OPENAI_CHAT_MODEL,
                messages=messages,
                temperature=0
            )
            return response.choices[0].message.content
        except Exception as e:
            raise Exception(f"Failed to generate completion: {str(e)}")
