import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUpload, FiX, FiCheck, FiAlertCircle } from 'react-icons/fi';
import { ClipLoader } from 'react-spinners';
import axios from 'axios';

const ResumeUploadScreen = () => {
  const [resumes, setResumes] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('');
  const [error, setError] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    if (acceptedFiles.length === 0) {
      setError('Please upload only PDF files.');
      return;
    }

    const newResumes = acceptedFiles.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      status: 'pending',
      file
    }));

    setResumes((prev) => [...prev, ...newResumes]);

    const formData = new FormData();
    acceptedFiles.forEach((file) => formData.append('file', file));

    try {
      setIsUploading(true);
      setUploadStatus('Uploading and processing resumes...');
      setError('');
      setUploadSuccess(false);
      
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/upload_resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setUploadStatus('');
      setUploadSuccess(true);
      setResumes((prev) =>
        prev.map((resume) =>
          newResumes.some((newResume) => newResume.id === resume.id)
            ? { ...resume, status: 'uploaded' }
            : resume
        )
      );
      
      // Clear success message after 3 seconds
      setTimeout(() => setUploadSuccess(false), 3000);
    } catch (err) {
      setError(`Upload failed: ${err.response?.data?.message || err.message}`);
      setUploadStatus('');
      setUploadSuccess(false);
      setResumes((prev) => prev.filter(r => !newResumes.some(nr => nr.id === r.id)));
    } finally {
      setIsUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx']
    },
    multiple: true,
    maxFiles: 10
  });

  const removeResume = (idToRemove) => {
    setResumes(resumes.filter((resume) => resume.id !== idToRemove));
  };

  const navigateToAnalyze = () => {
    navigate('/analyze');
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 flex items-center">
        <FiUpload className="mr-2" />
        Upload Resumes
      </h1>

      {/* Upload Area */}
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-all mb-6 ${
          isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center space-y-2">
          <FiUpload className="text-3xl text-gray-400" />
          <p className="text-sm text-gray-600">
            {isDragActive ? (
              <span className="text-blue-600">Drop files here</span>
            ) : (
              <>
                Drag & drop PDF resumes here, or <span className="text-blue-600">click to browse</span>
              </>
            )}
          </p>
          <p className="text-xs text-gray-500">Max 10 files at a time</p>
        </div>
      </div>

      {isUploading && (
        <div className="mb-6 flex items-center justify-center">
          <ClipLoader size={20} color="#3B82F6" />
          <span className="ml-2 text-sm text-gray-600">{uploadStatus}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="mb-6 p-3 bg-green-50 text-green-700 rounded-md text-sm flex items-center">
          <FiCheck className="mr-2" />
          Files uploaded successfully! You can analyze them now or upload more.
        </div>
      )}

      {error && (
        <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-md text-sm flex items-center">
          <FiAlertCircle className="mr-2" />
          {error}
        </div>
      )}

      {/* Uploaded Files List */}
      {resumes.length > 0 && (
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-6">
          <h2 className="text-lg font-semibold mb-4">
            Uploaded Resumes ({resumes.filter(r => r.status === 'uploaded').length}/{resumes.length})
          </h2>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {resumes.map((resume) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md hover:bg-gray-100"
                >
                  <div className="flex items-center truncate">
                    <span className="mr-2 text-gray-500">
                      {resume.status === 'uploaded' ? (
                        <FiCheck className="text-green-500" />
                      ) : (
                        <ClipLoader size={14} color="#9CA3AF" />
                      )}
                    </span>
                    <span className="truncate">{resume.name}</span>
                  </div>
                  <button
                    onClick={() => removeResume(resume.id)}
                    className="text-gray-400 hover:text-red-500 p-1"
                  >
                    <FiX />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Analyze Button (only shown when there are uploaded resumes) */}
      {resumes.some(r => r.status === 'uploaded') && (
        <button
          onClick={navigateToAnalyze}
          className="w-full py-3 px-4 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 flex items-center justify-center"
        >
          Analyze Uploaded Resumes
        </button>
      )}
    </div>
  );
};

export default ResumeUploadScreen;