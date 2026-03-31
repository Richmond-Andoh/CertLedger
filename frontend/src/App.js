import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';

// Import components
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CertificateVerification from './pages/CertificateVerification';
import IssueCertificate from './pages/IssueCertificate';
import StudentPortal from './pages/StudentPortal';
import AdminDashboard from './pages/AdminDashboard';

// Import styles
import './index.css';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/verify" element={<CertificateVerification />} />
            <Route path="/issue" element={<IssueCertificate />} />
            <Route path="/student/:id" element={<StudentPortal />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.8)',
              color: '#fff',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              backdropFilter: 'blur(10px)',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App;
