import React, { useState } from 'react';
import { FiSearch, FiInfo } from 'react-icons/fi';
import { BsStars, BsLightningCharge } from 'react-icons/bs';
import { MdContentCopy, MdDone } from 'react-icons/md';
import { ClipLoader, RingLoader } from 'react-spinners';
import axios from 'axios';

const ResumeAnalyzeScreen = () => {
  const [jobDescription, setJobDescription] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      setError('Please enter a job description.');
      return;
    }

    try {
      setIsAnalyzing(true);
      setError('');
      
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/analyze`, {
        query: jobDescription,
        num_results: 5
      });

      setSearchResults(response.data);
    } catch (err) {
      
      if(err.response?.status != 404){
        setError(`Analysis failed: ${err.response?.data?.message || err.message}`);
      }else{
        setWarning(`Analysis failed: ${err.response?.data?.error || err.message}`);
      }
      
    } finally {
      setIsAnalyzing(false);
    }
  };

  const copyToClipboard = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <BsStars className="mr-2" />
        AI-Based Talent Matching Solution
      </h1>

      {/* Job Description Input */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center">
          <FiSearch className="mr-2 text-blue-600" />
          Specify the Job Description
        </h2>
        <textarea
          className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          rows={8}
          placeholder="Describe the job role to find the perfect match..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing}
          className={`mt-4 w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
            isAnalyzing
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isAnalyzing ? (
            <>
              <ClipLoader size={18} color="#ffffff" className="mr-2" />
              Finding Your Talent...
            </>
          ) : (
            <>
              <BsLightningCharge className="mr-2" />
              Find the Talent
            </>
          )}
        </button>
        {error && (
          <div className="mt-4 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center">
            <FiInfo className="mr-2" />
            {error}
          </div>
        )}
        {warning && (
          <div className="mt-4 p-3 bg-yellow-50 text-yellow-700 rounded-md text-sm flex items-center">
            <FiInfo className="mr-2" />
            {warning}
          </div>
        )}
      </div>

      {/* Results Section */}
      {isAnalyzing ? (
        <div className="flex flex-col items-center justify-center h-64 bg-white rounded-xl shadow-sm border border-gray-200">
          <RingLoader size={60} color="#3B82F6" />
          <p className="mt-6 text-gray-600">Screening resumes for job fit...</p>
          <p className="text-sm text-gray-500">Just a moment while we process your request.</p>
        </div>
      ) : searchResults ? (
        <div className="space-y-6">
          {/* Overall Summary */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4 flex items-center">
              <BsStars className="mr-2 text-blue-600" />
              AI Analysis Summary
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700">{searchResults.overall_summary}</p>
            </div>
          </div>

          {/* Top Candidates */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Top Matching Resumes</h2>
            <div className="space-y-4">
              {searchResults.results.map((result, index) => (
                <div key={result.chunk_id} className="border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-50 px-4 py-3 flex justify-between items-center border-b border-gray-200">
                    <div className="flex items-center">
                      <span className="font-medium">{result.filename}</span>
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        Match: {(result.similarity_score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <button
                      onClick={() => copyToClipboard(result.summary, result.chunk_id)}
                      className="text-gray-400 hover:text-blue-600 p-1"
                    >
                      {copiedId === result.chunk_id ? (
                        <MdDone className="text-green-500" />
                      ) : (
                        <MdContentCopy />
                      )}
                    </button>
                  </div>
                  <div className="p-4">
                    <div className="mb-3">
                      <h4 className="text-sm font-medium text-gray-500 mb-1">Relevant Excerpt:</h4>
                      <p className="text-gray-700 italic">"{result.snippet}"</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-500 mb-1">AI Analysis:</h4>
                      <p className="text-gray-700">{result.summary}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : !warning && (
        <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-200 flex flex-col items-center justify-center text-center">
          <BsStars className="text-4xl text-blue-200 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Ready for Analysis !</h3>
          <p className="text-gray-500 max-w-md">
          Provide the job description above to find the best talent.
          </p>
        </div>
      )}
    </div>
  );
};

export default ResumeAnalyzeScreen;