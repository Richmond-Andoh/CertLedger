import React, { useState } from 'react';
import { FileText, Calendar, Award, User, Building, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { certificateService } from '../services/api';

const IssueCertificate = () => {
  const [formData, setFormData] = useState({
    studentName: '',
    studentId: '',
    institution: '',
    qualification: '',
    issueDate: '',
    grade: 'First Class'
  });
  const [isIssuing, setIsIssuing] = useState(false);
  const [issuedCertificate, setIssuedCertificate] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsIssuing(true);

    try {
      const response = await certificateService.issue(formData);
      
      if (response.data.success) {
        setIssuedCertificate({
          ...formData,
          transactionHash: response.data.transactionHash,
          blockNumber: response.data.blockNumber,
          studentCredentials: response.data.studentCredentials
        });

        toast.success('Certificate issued successfully!', {
          duration: 5000,
          style: {
            background: 'rgba(34, 197, 94, 0.8)',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(10px)',
          },
        });
      } else {
        toast.error(response.data.message || 'Failed to issue certificate', {
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
      toast.error(error.response?.data?.message || 'Failed to issue certificate', {
        duration: 4000,
        style: {
          background: 'rgba(239, 68, 68, 0.8)',
          color: '#fff',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        },
      });
    } finally {
      setIsIssuing(false);
    }
  };

  const resetForm = () => {
    setFormData({
      studentName: '',
      studentId: '',
      institution: '',
      qualification: '',
      issueDate: '',
      grade: 'First Class'
    });
    setIssuedCertificate(null);
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
            <FileText className="h-12 w-12 text-green-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Issue Certificate</h1>
          <p className="text-gray-300 text-lg">
            Issue new academic certificates on the blockchain
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Certificate Form */}
          <div className="glass-morphism rounded-2xl p-8">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
              <Award className="h-6 w-6 mr-2 text-green-400" />
              Certificate Information
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Name */}
              <div className="space-y-2">
                <label htmlFor="studentName" className="block text-sm font-medium text-gray-200 mb-2">
                  Student Name *
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="studentName"
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleChange}
                    className="input-glass pl-10"
                    placeholder="Enter student's full name"
                    required
                  />
                </div>
              </div>

              {/* Student ID */}
              <div className="space-y-2">
                <label htmlFor="studentId" className="block text-sm font-medium text-gray-200 mb-2">
                  Student ID *
                </label>
                <input
                  type="text"
                  id="studentId"
                  name="studentId"
                  value={formData.studentId}
                  onChange={handleChange}
                  className="input-glass"
                  placeholder="Enter unique student ID"
                  required
                />
              </div>

              {/* Institution */}
              <div className="space-y-2">
                <label htmlFor="institution" className="block text-sm font-medium text-gray-200 mb-2">
                  Institution *
                </label>
                <div className="relative">
                  <Building className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className="input-glass pl-10"
                    placeholder="Enter institution name"
                    required
                  />
                </div>
              </div>

              {/* Qualification */}
              <div className="space-y-2">
                <label htmlFor="qualification" className="block text-sm font-medium text-gray-200 mb-2">
                  Qualification *
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
                  Issue Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="date"
                    id="issueDate"
                    name="issueDate"
                    value={formData.issueDate}
                    onChange={handleChange}
                    className="input-glass pl-10"
                    required
                  />
                </div>
              </div>

              {/* Grade */}
              <div className="space-y-2">
                <label htmlFor="grade" className="block text-sm font-medium text-gray-200 mb-2">
                  Grade *
                </label>
                <select
                  id="grade"
                  name="grade"
                  value={formData.grade}
                  onChange={handleChange}
                  className="input-glass"
                  required
                >
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
                  disabled={isIssuing}
                  className="btn-primary flex-1 flex items-center justify-center"
                >
                  {isIssuing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Issuing...</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      <span>Issue Certificate</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={resetForm}
                  className="btn-secondary"
                >
                  Clear Form
                </button>
              </div>
            </form>
          </div>

          {/* Success Result */}
          {issuedCertificate && (
            <div className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-400" />
                Certificate Issued Successfully
              </h2>

              <div className="bg-green-500/20 border border-green-500/30 rounded-lg p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-green-300 mb-2">Certificate Details</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-400">Student:</span>
                        <p className="text-white font-medium">{issuedCertificate.studentName}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">ID:</span>
                        <p className="text-white font-medium">{issuedCertificate.studentId}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Institution:</span>
                        <p className="text-white font-medium">{issuedCertificate.institution}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Qualification:</span>
                        <p className="text-white font-medium">{issuedCertificate.qualification}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Grade:</span>
                        <p className="text-white font-medium">{issuedCertificate.grade}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Issue Date:</span>
                        <p className="text-white font-medium">{issuedCertificate.issueDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-green-500/30 pt-4">
                    <h3 className="text-lg font-semibold text-green-300 mb-2">Blockchain Information</h3>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-gray-400">Transaction Hash:</span>
                        <p className="text-white font-mono text-xs break-all">{issuedCertificate.transactionHash}</p>
                      </div>
                      <div>
                        <span className="text-gray-400">Block Number:</span>
                        <p className="text-white font-medium">{issuedCertificate.blockNumber}</p>
                      </div>
                    </div>
                  </div>

                  {issuedCertificate.studentCredentials && (
                    <div className="border-t border-green-500/30 pt-4">
                      <h3 className="text-lg font-semibold text-green-300 mb-2">Student Account Created</h3>
                      <div className="bg-yellow-500/20 border border-yellow-500/30 rounded-lg p-4">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-400">Username:</span>
                            <p className="text-white font-medium">{issuedCertificate.studentCredentials.username}</p>
                          </div>
                          <div>
                            <span className="text-gray-400">Temporary Password:</span>
                            <p className="text-white font-medium">{issuedCertificate.studentCredentials.temporaryPassword}</p>
                          </div>
                          <div className="text-yellow-300 text-xs mt-2">
                            <strong>Important:</strong> Student should change password on first login
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-6">
                  <button
                    onClick={resetForm}
                    className="btn-secondary"
                  >
                    Issue Another Certificate
                  </button>
                  
                  <button
                    className="btn-primary"
                    onClick={() => {
                      toast.info('Print feature coming soon!', {
                        duration: 3000,
                        style: {
                          background: 'rgba(34, 197, 94, 0.8)',
                          color: '#fff',
                          border: '1px solid rgba(255, 255, 255, 0.2)',
                          backdropFilter: 'blur(10px)',
                        },
                      });
                    }}
                  >
                    Print Certificate
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default IssueCertificate;
