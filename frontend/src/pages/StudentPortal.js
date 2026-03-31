import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Award, FileText, Calendar, User, Key, Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { certificateService } from '../services/api';

const StudentPortal = () => {
  const { id } = useParams();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await certificateService.getDetails(id);
        if (response.data.success) {
          setCertificates([response.data.data]);
        }
      } catch (error) {
        toast.error('Failed to fetch certificates', {
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, [id]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Award className="h-12 w-12 text-purple-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">Student Portal</h1>
          <p className="text-gray-300 text-lg">
            Welcome, {id}! View your academic certificates
          </p>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white mx-auto"></div>
            <p className="text-gray-300 mt-4">Loading your certificates...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {certificates.map((cert, index) => (
              <div key={index} className="glass-morphism rounded-2xl p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-semibold text-white flex items-center">
                    <FileText className="h-6 w-6 mr-2 text-indigo-400" />
                    Academic Certificate
                  </h2>
                  <div className="flex space-x-2">
                    <button
                      className="btn-secondary"
                      onClick={() => {
                        toast.info('Download feature coming soon!', {
                          duration: 3000,
                        });
                      }}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Certificate Details */}
                  <div className="space-y-4">
                    <div className="bg-white/5 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-3">Certificate Information</h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Student Name:</span>
                          <span className="text-white font-medium">{cert.studentName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Student ID:</span>
                          <span className="text-white font-medium">{cert.studentId}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Institution:</span>
                          <span className="text-white font-medium">{cert.institution}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Qualification:</span>
                          <span className="text-white font-medium">{cert.qualification}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Grade:</span>
                          <span className="text-white font-medium">{cert.grade}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Issue Date:</span>
                          <span className="text-white font-medium">
                            {new Date(cert.issueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Blockchain Info */}
                  <div className="space-y-4">
                    <div className="bg-indigo-500/20 rounded-lg p-4">
                      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
                        <Key className="h-5 w-5 mr-2 text-indigo-400" />
                        Blockchain Verification
                      </h3>
                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Status:</span>
                          <span className="text-green-300 font-medium">Verified</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Transaction Hash:</span>
                          <span className="text-indigo-300 font-mono text-xs break-all">
                            {cert.transactionHash}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Block Number:</span>
                          <span className="text-indigo-300 font-medium">{cert.blockNumber}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Issued On:</span>
                          <span className="text-indigo-300 font-medium">
                            {new Date(cert.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-4 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                      <div className="flex items-center">
                        <User className="h-5 w-5 mr-2 text-yellow-400" />
                        <div>
                          <p className="text-yellow-300 font-medium">First-time login?</p>
                          <p className="text-yellow-300 text-sm">
                            Change your password for better security
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentPortal;
