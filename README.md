# AI-Talent-Match
AI Talent Match is an AI-powered platform that streamlines recruitment by intelligently matching candidates to job roles using NLP and ML. It automates resume screening, improves match accuracy, and reduces hiring time through a smart, data-driven approach.

## Installation and Running Guide
**Prerequisites**
- Python 3.8+
- Node.js 14+ and npm
- Git
 
### Initial Setup 
**Clone the Repository**
```sh
git clone https://github.com/Nirmaltnk/AI-Talent-Match.git 
cd AI-Talent-Match
```
**Install Node Dependencies**
```sh
npm install # in the root directory
```
 
### Backend Setup (Flask)**
**Create a Virtual Environment**
```sh 
cd backend
python -m venv venv 
source venv/bin/activate 
# On Windows: venv\Scripts\activate.bat
```
 
**Install Python Dependencies**
```sh
pip install -r backend/requirements.txt
```
**Go back to root directory**
```sh
cd ..
```
### Frontend Setup (React)
**Navigate to client Directory**
```sh 
cd client
```
 
**Install Node Dependencies**
```sh  
npm install
```
 
**Run the React App and backend server together**
```sh 
cd .. # Navigate back to root directory
npm start
```
 
The React app will start on: http://localhost:5173 and the backend server start in http://localhost:5000
