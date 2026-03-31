import React, { useState, useEffect } from 'react';
import { Shield, Users, FileText, AlertTriangle, TrendingUp, Award, Settings } from 'lucide-react';
import toast from 'react-hot-toast';
import { adminService } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await adminService.getDashboardStats();
        if (response.data.success) {
          setStats(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to fetch dashboard stats', {
          duration: 4000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-white mx-auto mb-4"></div>
          <p className="text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-pink-400" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2">System Administration</h1>
          <p className="text-gray-300 text-lg">
            Manage the CertLedger blockchain system
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="glass-morphism rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Total Certificates</h3>
                <FileText className="h-6 w-6 text-green-400" />
              </div>
              <p className="text-3xl font-bold text-green-300">{stats.overview.totalCertificates}</p>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Total Users</h3>
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-blue-300">{stats.overview.totalUsers}</p>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Active Users</h3>
                <TrendingUp className="h-6 w-6 text-purple-400" />
              </div>
              <p className="text-3xl font-bold text-purple-300">{stats.overview.activeUsers}</p>
            </div>

            <div className="glass-morphism rounded-xl p-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-white">Anomalies</h3>
                <AlertTriangle className="h-6 w-6 text-red-400" />
              </div>
              <p className="text-3xl font-bold text-red-300">{stats.overview.recentAnomalies}</p>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center mb-4">
              <Users className="h-8 w-8 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Manage Users</h3>
            <p className="text-gray-300">View and manage all system users</p>
          </div>

          <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center mb-4">
              <Award className="h-8 w-8 text-green-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">Issue Certificates</h3>
            <p className="text-gray-300">Issue new academic certificates</p>
          </div>

          <div className="glass-morphism rounded-xl p-6 hover:scale-105 transition-transform cursor-pointer">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-8 w-8 text-yellow-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">View Anomalies</h3>
            <p className="text-gray-300">Monitor system anomalies</p>
          </div>
        </div>

        {/* User Statistics */}
        {stats && (
          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <Users className="h-6 w-6 mr-2 text-blue-400" />
                User Statistics
              </h2>
              <div className="space-y-4">
                {Object.entries(stats.userStats).map(([role, count]) => (
                  <div key={role} className="flex justify-between items-center p-3 bg-white/5 rounded-lg">
                    <span className="text-gray-300 capitalize">
                      {role.replace('_', ' ')}
                    </span>
                    <span className="text-2xl font-bold text-white">{count}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-morphism rounded-2xl p-8">
              <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
                <AlertTriangle className="h-6 w-6 mr-2 text-red-400" />
                Anomaly Statistics
              </h2>
              <div className="space-y-4">
                {Object.entries(stats.anomalyStats).map(([type, count]) => (
                  <div key={type} className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg">
                    <span className="text-gray-300 capitalize">
                      {type.replace('_', ' ')}
                    </span>
                    <span className="text-2xl font-bold text-red-300">{count}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* System Settings */}
        <div className="glass-morphism rounded-2xl p-8">
          <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
            <Settings className="h-6 w-6 mr-2 text-gray-400" />
            System Settings
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">Blockchain Configuration</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Contract Address:</span>
                  <span className="text-indigo-300 font-mono text-xs break-all">
                    0xd9145CCE52D386f254917e481eB44e9943F39138
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Network:</span>
                  <span className="text-indigo-300">Sepolia Testnet</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-green-300">Connected</span>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white mb-3">System Information</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Version:</span>
                  <span className="text-white">1.0.0</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Environment:</span>
                  <span className="text-white">Development</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Last Backup:</span>
                  <span className="text-white">Never</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
