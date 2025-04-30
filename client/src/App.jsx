import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import ResumeUploadScreen from './components/ResumeUploadScreen';
import ResumeAnalyzeScreen from './components/ResumeAnalyzeScreen';

const App = () => {

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<ResumeUploadScreen />} />
            <Route path="/analyze" element={<ResumeAnalyzeScreen />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const NavBar = () => {
  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-xl font-bold text-gray-900">
          AI Talent Match
          </Link>
          <div className="flex space-x-4">
            <Link
              to="/"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-blue-50"
            >
              Upload
            </Link>
            <Link
              to="/analyze"
              className="px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-blue-50"
            >
              Analyze
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default App;