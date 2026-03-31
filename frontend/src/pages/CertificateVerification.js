import React, { useState } from 'react';
import { Search, Shield, CheckCircle, XCircle, AlertCircle, FileText } from 'lucide-react';
import toast from 'react-hot-toast';
import { certificateService } from '../services/api';

const CertificateVerification = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    institution: '',
    qualification: '',
    issueDate: '',
    grade: ''
  });
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setShowResult(false);

    try {
      const response = await certificateService.verify(formData);
      
      setVerificationResult(response.data);
      setShowResult(true);

      if (response.data.isValid) {
        toast.success('Certificate verified successfully!', {
          duration: 5000,
          style: {
            background: 'rgba(34, 197, 94, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        });
      } else {
        toast.error('Certificate verification failed', {
          duration: 4000,
          style: {
            background: 'rgba(239, 68, 68, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Verification failed. Please try again.', {
        duration: 4000,
        style: {
          background: 'rgba(239, 68, 68, 0.8)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        },
      });
      
      setVerificationResult({
        isValid: false,
        message: 'Network error occurred during verification',
        timestamp: new Date().toISOString()
      });
      setShowResult(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      studentId: '',
      institution: '',
      qualification: '',
      issueDate: '',
      grade: ''
    });
    setVerificationResult(null);
    setShowResult(false);
  };

  const getGradeOptions = () => [
    'First Class',
    'Second Class Upper',
    'Second Class Lower',
    'Third Class',
    'Pass',
    'Distinction',
    'Merit'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-indigo-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Certificate Verification</h1>
          <p className="text-gray-300 text-lg">
            Verify the authenticity of academic certificates on the blockchain
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Verification Form */}
          <div className="glass-morphism rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Search className="h-6 w-6 mr-2 text-indigo-400" />
              Enter Certificate Details
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Name */}
              <div className="space-y-2">
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-200 mb-2">
                  Student Name
                </label>
                <input
                  type="text"
                  id="studentName"
                  name="studentName"
                  value={formData.studentName}
                  onChange={handleChange}
                  className="input-glass"
                  placeholder="Enter student's full name"
                  required
                />
              </div>

              {/* Student ID */}
              <div className="space-y-2">
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-200 mb-2">
                  Student ID
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="input-glass"
                  placeholder="Enter student ID number"
                  required
                />
              </div>

              {/* Institution */}
              <div className="space-y-2">
                <label htmlFor="institution" className="block text-sm font-medium text-gray-200 mb-2">
                  Institution
                </label>
                <input
                  type="text"
                  id="institution"
                  name="institution"
                  value={formData.institution}
                  onChange={handleChange}
                  className="input-glass"
                  placeholder="Enter institution name"
                  required
                />
              </div>

              {/* Qualification */}
              <div className="space-y-2">
                <label htmlFor="qualification" className="block text-sm font-medium text-gray-200 mb-2">
                  Qualification
                </label>
                <input
                  type="text"
                  id="qualification"
                  name="qualification"
                  value={formData.qualification}
                  onChange={handleChange}
                  className="input-glass"
                  placeholder="Enter qualification title"
                  required
                />
              </div>

              {/* Issue Date */}
              <div className="space-y-2">
                <label htmlFor="issueDate" className="block text-sm font-medium text-gray-200 mb-2">
                  Issue Date
                </label>
                <input
                  type="date"
                  id="issueDate"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleChange}
                  className="input-glass"
                  required
                />
              </div>

              {/* Grade */}
              <div className="space-y-2">
                <label htmlFor="grade" className="block text-sm font-medium text-gray-200 mb-2">
                  Grade
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="input-glass"
                  required
                >
                  <option value="">Select grade</option>
                  {getGradeOptions().map((grade) => (
                    <option key={grade} value={grade}>
                      {grade}
                    </option>
                  ))}
                </select>
              </div>

              {/* Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  {isVerifying ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Verifying...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Verify Certificate</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary flex items-center justify-center"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  <span>Clear Form</span>
                </button>
              </div>
            </form>
          </div>

          {/* Verification Result */}
          {showResult && verificationResult && (
            <div className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                {verificationResult.isValid ? (
                  <CheckCircle className="h-6 w-6 mr-2 text-green-400" />
                ) : (
                  <XCircle className="h-6 w-6 mr-2 text-red-400" />
                )}
                Verification Result
              </h2>

              <div className={`p-6 rounded-lg ${
                verificationResult.isValid 
                  ? 'bg-green-500/20 border border-green-500/30' 
                  : 'bg-red-500/20 border border-red-500/30'
              }`}>
                <div className="flex items-center mb-4">
                  {verificationResult.isValid ? (
                    <CheckCircle className="h-8 w-8 text-green-400 mr-3" />
                  ) : (
                    <XCircle className="h-8 w-8 text-red-400 mr-3" />
                  )}
                  <div>
                    <h3 className={`text-xl font-semibold mb-2 ${
                      verificationResult.isValid ? 'text-green-300' : 'text-red-300'
                    }`}>
                      {verificationResult.isValid ? 'Certificate Valid' : 'Certificate Invalid'}
                    </h3>
                    <p className="text-gray-300">
                      {verificationResult.message}
                    </p>
                  </div>
                </div>

                {verificationResult.timestamp && (
                  <div className="text-sm text-gray-400">
                    <strong>Verified on:</strong> {new Date(verificationResult.timestamp).toLocaleString()}
                  </div>
                )}

                {verificationResult.institution && (
                  <div className="text-sm text-gray-400">
                    <strong>Institution:</strong> {verificationResult.institution}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 mt-6">
                <button
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Verify Another Certificate
                </button>
                
                {verificationResult.isValid && (
                  <button
                    className="btn-primary"
                    onClick={() => {
                      toast.info('Download feature coming soon!', {
                        duration: 3000,
                        style: {
                          background: 'rgba(99, 102, 241, 0.8)',
                          color: '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                        },
                      });
                    }}
                  >
                    Download Certificate
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-12 text-sm text-gray-400">
        <p>Powered by blockchain technology for tamper-proof verification</p>
      </div>
    </div>
  );
};

export default CertificateVerification;
