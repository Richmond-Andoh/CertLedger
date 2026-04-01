import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { adminService } from '../../services/api';

const StudentAccounts = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await adminService.getUsers({ role: 'student' });
        if (response.data.success) {
          setStudents(response.data.data);
        }
      } catch (error) {
        toast.error('Failed to retrieve student registry.');
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleResetPassword = async (studentId) => {
    try {
      // In a real app, this would prompt for a new password or generate one
      const response = await adminService.resetStudentPassword({ studentId });
      if (response.data.success) {
        toast.success('Blockchain session terminated. Temporary key provisioned.');
      }
    } catch (error) {
      toast.error('Security Protocol Violation: Unauthorized reset attempt.');
    }
  };

  const filteredStudents = students.filter(student => 
    student.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (student.institution && student.institution.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-secondary mb-4"></div>
        <p className="text-on-surface-variant font-medium text-xs uppercase tracking-widest">Accessing Student Ledger...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Page Header Area */}
      <div className="flex flex-col lg:flex-row justify-between items-end gap-8 mb-16">
        <div className="max-w-xl">
          <h1 className="text-4xl font-black font-headline text-on-surface mb-4 tracking-tight uppercase">Student Accounts</h1>
          <p className="text-on-surface-variant text-lg leading-relaxed">Manage institutional access, review linked credentials, and maintain sovereign student identity records across the blockchain ledger.</p>
        </div>
        
        {/* Search Bar */}
        <div className="w-full max-w-md">
          <div className="relative group">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant group-focus-within:text-secondary transition-colors">search</span>
            <input 
              className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-sm font-medium focus:ring-2 focus:ring-surface-tint focus:bg-white transition-all placeholder:text-on-surface-variant/40 shadow-sm" 
              placeholder="Search by Name, ID or Institution..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-12 gap-6 mb-12">
        <div className="col-span-12 md:col-span-8 bg-surface-container-lowest p-8 rounded-xl shadow-xl shadow-black/5 border border-outline-variant/20 flex flex-col md:flex-row justify-between items-center">
          <div>
            <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-[0.2em] mb-4">Verification Velocity</p>
            <h3 className="text-6xl font-black font-headline text-primary tracking-tighter">{students.length.toLocaleString()}</h3>
            <p className="text-sm text-on-surface-variant mt-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600 text-lg bg-emerald-50 rounded-full p-1 border border-emerald-100">trending_up</span>
              <span className="font-bold text-emerald-600">Active</span> Node engagement per semester
            </p>
          </div>
          <div className="w-48 h-32 bg-surface-container-high/30 rounded-lg p-2 flex items-end gap-1.5 border border-outline-variant/10 mt-6 md:mt-0">
            <div className="w-1/4 bg-primary-container/20 h-[40%] rounded-t-sm"></div>
            <div className="w-1/4 bg-primary-container/40 h-[60%] rounded-t-sm"></div>
            <div className="w-1/4 bg-primary-container/60 h-[90%] rounded-t-sm"></div>
            <div className="w-1/4 bg-secondary h-[75%] rounded-t-sm animate-pulse"></div>
          </div>
        </div>
        <div className="col-span-12 md:col-span-4 bg-primary-container p-8 rounded-xl flex flex-col justify-between text-white shadow-2xl shadow-blue-900/40 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 transform translate-x-1/4 -translate-y-1/4 opacity-10 group-hover:scale-150 transition-transform duration-1000">
             <span className="material-symbols-outlined text-[120px]">verified</span>
          </div>
          <span className="material-symbols-outlined text-secondary text-5xl relative z-10" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
          <div className="relative z-10">
            <h4 className="text-2xl font-black font-headline mb-2 tracking-tight">Audit Ready</h4>
            <p className="text-on-primary-container/70 text-xs leading-relaxed font-medium">System protocols compliant with Ghanaian Institutional Integrity standards for the current academic year.</p>
          </div>
        </div>
      </div>

      {/* Info Alert */}
      <div className="mb-8 hidden md:block">
        <div className="bg-white p-5 rounded-xl flex items-center justify-between border-l-4 border-secondary shadow-lg shadow-amber-900/5">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-secondary/10 rounded-lg">
              <span className="material-symbols-outlined text-secondary">info</span>
            </div>
            <p className="text-sm font-bold text-on-surface tracking-tight uppercase">Administrative Tip: <span className="font-medium normal-case text-on-surface-variant">Resetting a password will log the student out of all active blockchain sessions for security compliance.</span></p>
          </div>
          <button className="text-on-surface-variant hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>
      </div>

      {/* Student Accounts Table */}
      <div className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-2xl shadow-black/5 border border-outline-variant/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-900 text-white">
              <tr>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Student Name</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Node ID</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Institution</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest">Registry Date</th>
                <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-right">Security Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-container-low">
              {filteredStudents.map((student, index) => (
                <tr key={student._id} className={`${index % 2 === 1 ? 'bg-primary-fixed/5' : 'bg-white'} hover:bg-surface-container-low transition-colors group`}>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center text-[10px] font-black text-secondary uppercase border border-outline-variant/30">
                        {student.username.substring(0, 2)}
                       </div>
                       <span className="font-bold text-sm text-on-surface">{student.username}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-xs text-on-surface-variant font-bold tracking-tighter uppercase">{student.username.replace('@', '_')}</td>
                  <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">{student.institution || 'Access Limited'}</td>
                  <td className="px-8 py-6 text-sm text-on-surface-variant font-medium">
                    {new Date(student.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      className="px-6 py-2.5 border-2 border-slate-900 text-slate-900 text-[10px] font-black uppercase tracking-[0.15em] rounded-lg hover:bg-slate-900 hover:text-white transition-all shadow-md active:scale-95"
                      onClick={() => handleResetPassword(student._id)}
                    >
                      Reset Credentials
                    </button>
                  </td>
                </tr>
              ))}
              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-12 text-center text-on-surface-variant font-black uppercase text-xs tracking-widest">
                    No matching student records found on this network node.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Shell */}
        <div className="px-8 py-6 flex justify-between items-center bg-slate-50 border-t border-surface-container-high">
          <p className="text-[10px] font-black text-on-surface-variant uppercase tracking-widest">
            Showing {filteredStudents.length} of {students.length.toLocaleString()} records
          </p>
          <div className="flex gap-2">
            <button className="p-2.5 rounded-lg bg-white border border-outline-variant/30 text-on-surface-variant hover:bg-slate-100 transition-colors shadow-sm disabled:opacity-30">
              <span className="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button className="p-2.5 rounded-lg bg-slate-900 text-white border border-slate-900 shadow-xl active:scale-90 transition-transform">
              <span className="material-symbols-outlined text-lg">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentAccounts;
