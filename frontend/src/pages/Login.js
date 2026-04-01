import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/api';

const Login = () => {
  const [formData, setFormData] = useState({
    identity: '', // Email or Username 
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Backend expects { username, password }
      // The design uses "identity" for either.
      const response = await authService.login({
        username: formData.identity,
        password: formData.password
      });

      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        
        toast.success(`Welcome back, ${response.data.user.username}!`);

        // Navigate based on role
        switch (response.data.user.role) {
          case 'system_admin':
            navigate('/admin');
            break;
          case 'university_admin':
            navigate('/issue');
            break;
          case 'student':
            navigate(`/student/${response.data.user.username}`);
            break;
          default:
            navigate('/dashboard');
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-primary-container min-h-screen flex flex-col items-center justify-center p-6 selection:bg-secondary-fixed selection:text-on-secondary-fixed relative overflow-hidden">
      {/* Abstract Background Texture */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none opacity-20">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-secondary rounded-full blur-[120px]"></div>
        <div className="absolute -bottom-[10%] -right-[10%] w-[50%] h-[50%] bg-surface-tint rounded-full blur-[150px]"></div>
      </div>

      {/* Login Container */}
      <main className="relative z-10 w-full max-w-md flex flex-col items-center">
        {/* Branding Header */}
        <div className="mb-10 text-center">
          <div className="mb-6 flex justify-center">
            <div className="w-20 h-20 bg-surface-container-lowest rounded-xl flex items-center justify-center shadow-2xl shadow-black/40">
              <span className="material-symbols-outlined text-secondary text-5xl">account_balance</span>
            </div>
          </div>
          <h1 className="text-secondary text-3xl font-extrabold tracking-tighter uppercase mb-1">
            Certificate Verification System
          </h1>
          <p className="text-on-primary-container font-medium tracking-wide text-sm">
            Powered by Blockchain
          </p>
        </div>

        {/* Login Card */}
        <section className="w-full bg-surface-container-lowest rounded-xl p-10 shadow-2xl shadow-black/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Identity Field */}
            <div>
              <label 
                className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2 px-1" 
                htmlFor="identity"
              >
                Institutional Identity
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-xl group-focus-within:text-secondary transition-colors">
                    alternate_email
                  </span>
                </div>
                <input 
                  className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-surface-tint focus:bg-white transition-all text-sm font-medium" 
                  id="identity" 
                  name="identity" 
                  placeholder="Email or Username" 
                  type="text"
                  value={formData.identity}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label 
                className="block text-[10px] font-semibold text-on-surface-variant uppercase tracking-widest mb-2 px-1" 
                htmlFor="password"
              >
                Security Credential
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline text-xl group-focus-within:text-secondary transition-colors">
                    lock
                  </span>
                </div>
                <input 
                  className="block w-full pl-11 pr-4 py-3.5 bg-surface-container-highest border-none rounded-lg text-on-surface placeholder:text-outline focus:ring-2 focus:ring-surface-tint focus:bg-white transition-all text-sm font-medium" 
                  id="password" 
                  name="password" 
                  placeholder="••••••••" 
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <button 
                className="w-full bg-secondary text-on-secondary font-bold py-4 rounded-lg flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all duration-200 shadow-lg shadow-secondary/20 group disabled:opacity-70 disabled:cursor-not-allowed" 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-on-secondary"></div>
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Log In</span>
                    <span className="material-symbols-outlined text-xl group-hover:translate-x-1 transition-transform">
                      login
                    </span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Role Indicator */}
          <div className="mt-8 pt-8 border-t border-surface-container-highest">
            <div className="flex justify-between items-center px-2">
              <div className="flex items-center gap-2 opacity-60">
                <span className="material-symbols-outlined text-sm">shield_person</span>
                <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">Admin Access</span>
              </div>
              <div className="flex items-center gap-2 opacity-60">
                <span className="material-symbols-outlined text-sm">school</span>
                <span className="text-[10px] font-bold uppercase tracking-tight text-on-surface-variant">Student Portal</span>
              </div>
            </div>
          </div>
        </section>

        {/* Employer Redirect */}
        <footer className="mt-10 w-full">
          <button 
            className="w-full group flex items-center justify-center gap-2 py-4 px-6 rounded-xl glass-effect hover:bg-surface-container-lowest/20 transition-all duration-300" 
            onClick={() => navigate('/verify')}
          >
            <span className="text-on-primary-container text-xs font-semibold tracking-wide">
              Employer? <span className="text-secondary-fixed">Verify a certificate here</span>
            </span>
            <span className="material-symbols-outlined text-secondary-fixed text-lg group-hover:translate-x-2 transition-transform">
              arrow_forward
            </span>
          </button>
        </footer>

        {/* Bottom Legal Text */}
        <div className="mt-12 text-center space-y-2 opacity-40">
          <p className="text-[10px] font-medium text-on-primary-container uppercase tracking-widest leading-relaxed">
            © 2024 Academic Ledger Technologies.<br/>
            Ghanaian Institutional Integrity Protocol.
          </p>
        </div>
      </main>

      {/* Visual Anchor: Secure Seal */}
      <div className="fixed bottom-8 right-8 hidden lg:block">
        <div className="flex flex-col items-end">
          <div className="bg-secondary p-4 rounded-full shadow-2xl shadow-black/50 mb-2">
            <span className="material-symbols-outlined text-on-secondary text-3xl">verified</span>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-black text-secondary uppercase tracking-[0.2em]">Validated Node</p>
            <p className="text-[8px] font-medium text-on-primary-container opacity-50 font-mono">GH-SYS-8821-X</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
