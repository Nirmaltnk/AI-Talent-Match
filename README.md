# AI-Talent-Match
AI Talent Match is an AI-powered platform that streamlines recruitment by intelligently matching candidates to job roles using NLP and ML. It automates resume screening, improves match accuracy, and reduces hiring time through a smart, data-driven approach.

## Installation and Running Guide
**Prerequisites**
   Python 3.8+
   Node.js 14+ and npm
   Git
**Backend Setup (Flask)**
Clone the Repository
bash git clone https://github.com/your-username/your-repo-name.git cd your-repo-name

Create a Virtual Environment
bash python -m venv venv source venv/bin/activate # On Windows: venv\Scripts\activate

Install Python Dependencies
bash pip install -r backend/requirements.txt

Run the Flask Server
bash cd backend flask run # or python app.py depending on your setup

By default, the Flask API will run at: http://127.0.0.1:5000

🌐 Frontend Setup (React)
Navigate to Frontend Directory
bash cd frontend

Install Node Dependencies
bash npm install

Run the React App
bash npm start

The React app will start on: http://localhost:3000

🔁 API Proxy (Optional)
To connect React with Flask during development, ensure this line exists in your frontend/package.json:

"proxy": "http://localhost:5000"
This allows React to proxy API requests to Flask without CORS issues.
