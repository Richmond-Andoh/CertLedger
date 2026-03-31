import React from 'react';
import { Home, FileText, Award, TrendingUp } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Welcome to CertLedger</h1>
          <p className="text-gray-300 text-lg">
            Choose an option below to get started
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Verify Certificate */}
          <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex justify-center mb-4">
              <FileText className="h-12 w-12 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Verify Certificate</h3>
            <p className="text-gray-300">
              Check the authenticity of any academic certificate
            </p>
          </div>

          {/* Issue Certificate */}
          <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex justify-center mb-4">
              <Award className="h-12 w-12 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Issue Certificate</h3>
            <p className="text-gray-300">
              For authorized institutions only
            </p>
          </div>

          {/* Student Portal */}
          <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex justify-center mb-4">
              <TrendingUp className="h-12 w-12 text-purple-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Student Portal</h3>
            <p className="text-gray-300">
              View and manage your certificates
            </p>
          </div>

          {/* Admin Panel */}
          <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex justify-center mb-4">
              <Home className="h-12 w-12 text-pink-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Admin Panel</h3>
            <p className="text-gray-300">
              System administration
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
