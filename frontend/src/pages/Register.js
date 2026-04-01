import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'university_admin',
    institution: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generatePassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let pass = '';
    for (let i = 0; i < 4; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    pass += '-';
    for (let i = 0; i < 4; i++) pass += chars.charAt(Math.floor(Math.random() * chars.length));
    setFormData({ ...formData, password: pass });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await authService.register(formData);
      if (response.data.success) {
        toast.success('Account provisioned successfully on the ledger!');
        navigate('/admin');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to provision account. Check admin permissions.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col pt-20">
      {/* Header Execution - Simplified from design for standalone page */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 h-20 bg-slate-900 shadow-xl shadow-slate-900/20 z-50">
        <div className="flex items-center gap-8">
          <span className="text-xl font-bold tracking-tighter text-white uppercase">Certificate Verification System</span>
          <nav className="hidden md:flex gap-6">
            <button className="text-sm font-medium text-slate-300 hover:text-white transition-colors" onClick={() => navigate('/admin')}>Dashboard</button>
            <button className="text-sm font-medium text-amber-400 border-b-2 border-amber-400 pb-1">Register User</button>
          </nav>
        </div>
        <div className="flex items-center gap-4 text-amber-500">
          <button className="p-2 hover:bg-slate-800 transition-all duration-200 rounded-lg">
            <span className="material-symbols-outlined">notifications</span>
          </button>
          <button className="p-2 hover:bg-slate-800 transition-all duration-200 rounded-lg">
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="flex-1 bg-surface-container-low p-8 md:p-16 flex flex-col items-center">
        <div className="w-full max-w-2xl">
          {/* Header Section */}
          <div className="mb-12">
            <nav className="flex items-center gap-2 text-on-surface-variant text-sm mb-4">
              <span className="hover:text-primary cursor-pointer" onClick={() => navigate('/admin')}>Admin Dashboard</span>
              <span className="material-symbols-outlined text-xs">chevron_right</span>
              <span className="text-primary font-semibold">User Management</span>
            </nav>
            <h1 className="text-4xl font-extrabold tracking-tight text-primary mb-2">Provision New Account</h1>
            <p className="text-on-surface-variant max-w-lg">Provision new access credentials for institutional partners or students within the blockchain ledger network.</p>
          </div>

          {/* Form Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-xl shadow-slate-900/5 p-10 border-0">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Identity Group */}
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-on-surface-variant font-semibold text-sm">Institution Name</label>
                    <input 
                      className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-surface-tint transition-all text-on-surface placeholder:text-outline" 
                      placeholder="e.g. University of Ghana" 
                      type="text"
                      name="institution"
                      value={formData.institution}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-on-surface-variant font-semibold text-sm">Account Role</label>
                    <select 
                      className="w-full bg-surface-container-highest border-none rounded-lg px-4 py-3 focus:ring-2 focus:ring-surface-tint transition-all text-on-surface"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                    >
                      <option value="university_admin">University Admin</option>
                      <option value="student">Student</option>
                      <option value="system_admin">System Admin</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-on-surface-variant font-semibold text-sm">Username</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">public</span>
                      <input 
                        className="w-full bg-surface-container-highest border-none rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-surface-tint transition-all text-on-surface placeholder:text-outline" 
                        placeholder="username123" 
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-on-surface-variant font-semibold text-sm">Email Address</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline text-lg">alternate_email</span>
                      <input 
                        className="w-full bg-surface-container-highest border-none rounded-lg pl-12 pr-4 py-3 focus:ring-2 focus:ring-surface-tint transition-all text-on-surface placeholder:text-outline" 
                        placeholder="admin@institution.edu" 
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="pt-6 border-t border-surface-container-high">
                <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-amber-600">security</span>
                  Security Protocol
                </h3>
                <div className="bg-surface-container-low rounded-lg p-6 space-y-4">
                  <label className="text-on-surface-variant font-semibold text-sm">Temporary System Password</label>
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="flex-1 bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-6 py-3 font-mono text-lg tracking-widest text-primary flex justify-between items-center w-full">
                      <span>{formData.password || '••••-••••'}</span>
                      <button 
                        className="text-on-surface-variant hover:text-primary transition-colors focus:outline-none" 
                        type="button"
                        onClick={() => {
                          if (formData.password) {
                            navigator.clipboard.writeText(formData.password);
                            toast.success('Password copied!');
                          }
                        }}
                      >
                        <span className="material-symbols-outlined text-xl">content_copy</span>
                      </button>
                    </div>
                    <button 
                      className="whitespace-nowrap px-6 py-3 border border-primary text-primary font-bold rounded-lg hover:bg-slate-900 hover:text-white transition-all active:scale-95 focus:outline-none" 
                      type="button"
                      onClick={generatePassword}
                    >
                      Generate New
                    </button>
                  </div>
                  <div className="flex items-start gap-2 mt-2">
                    <span className="material-symbols-outlined text-amber-600 text-sm mt-0.5">info</span>
                    <p className="text-xs text-on-surface-variant leading-relaxed">The user will be prompted to establish a permanent cryptographic key upon their first entry into the protocol.</p>
                  </div>
                </div>
              </div>

              {/* Form Actions */}
              <div className="pt-8 flex flex-col-reverse sm:flex-row items-center justify-end gap-4">
                <button 
                  className="w-full sm:w-auto px-8 py-3 text-on-surface-variant font-semibold hover:text-primary transition-colors focus:outline-none" 
                  type="button"
                  onClick={() => navigate('/admin')}
                >
                  Cancel
                </button>
                <button 
                  className="w-full sm:w-auto bg-secondary text-on-secondary px-10 py-3 rounded-lg font-bold shadow-lg shadow-secondary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-70 focus:outline-none flex items-center justify-center gap-2" 
                  type="submit"
                  disabled={isLoading || !formData.password}
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-on-secondary"></div>
                      <span>Provisioning...</span>
                    </>
                  ) : (
                    <span>Create Account</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </main>

      {/* Footer Execution */}
      <footer className="w-full py-10 mt-auto bg-slate-50 border-t border-slate-200">
        <div className="flex flex-col items-center justify-center gap-4 w-full px-8">
          <p className="text-[10px] font-medium uppercase tracking-tighter text-slate-500">
            © 2024 Academic Ledger Technologies. Ghanaian Institutional Integrity Protocol.
          </p>
          <div className="flex gap-8">
            <span className="text-[10px] font-medium uppercase tracking-tighter text-slate-500 hover:text-amber-600 transition-colors cursor-pointer">Privacy Policy</span>
            <span className="text-[10px] font-medium uppercase tracking-tighter text-slate-500 hover:text-amber-600 transition-colors cursor-pointer">Terms of Service</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;
