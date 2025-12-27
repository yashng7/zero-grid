'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'REGISTRATION_FAILED: Protocol mismatch');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
    } catch (err) {
      setError('SYSTEM_ERROR: Network unreachable');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 relative overflow-hidden selection:bg-[#ccff00] selection:text-black">
      
      {/* --- ATMOSPHERE --- */}
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#232323_1px,transparent_1px),linear-gradient(to_bottom,#232323_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-40 pointer-events-none"></div>
      
      {/* Scanline Effect */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-50 bg-[length:100%_2px,3px_100%]"></div>

      <div className="max-w-md w-full relative z-10">
        
        {/* --- HEADER --- */}
        <div className="text-center mb-10">
          <Link href="/" className="inline-block group">
             <div className="flex items-center justify-center gap-2">
                <div className="w-3 h-3 bg-[#ccff00] group-hover:animate-pulse"></div>
                <h1 className="text-3xl font-mono font-bold text-white tracking-tighter group-hover:text-[#ccff00] transition-colors">
                  ZEROGRID<span className="opacity-50">_</span>
                </h1>
             </div>
          </Link>
          <div className="mt-4 flex justify-center">
            <span className="px-2 py-1 bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] text-xs font-mono tracking-widest uppercase">
              New Operative Registry
            </span>
          </div>
        </div>

        {/* --- REGISTER TERMINAL --- */}
        <div className="bg-[#0a0a0a] border border-white/10 p-1 relative group">
          
          {/* Decorative Corner Markers */}
          <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 border-[#ccff00] opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 border-[#ccff00] opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 border-[#ccff00] opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 border-[#ccff00] opacity-50 group-hover:opacity-100 transition-opacity"></div>

          <div className="bg-[#050505] p-8 border border-white/5">
            <h2 className="text-xl font-mono font-bold text-white mb-6 flex items-center border-b border-white/10 pb-4">
              <span className="text-[#ccff00] mr-2">::</span> 
              ESTABLISH_CREDENTIALS
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-500/10 border-l-2 border-red-500 text-red-500 px-4 py-3 font-mono text-sm flex items-start gap-2 animate-pulse">
                  <span>[!]</span>
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="name" className="block text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
                  Full Designation
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/20 text-white font-mono text-sm focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] focus:outline-none transition-all placeholder:text-gray-700"
                  placeholder="JOHN DOE"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
                  Comms Channel (Email)
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/20 text-white font-mono text-sm focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] focus:outline-none transition-all placeholder:text-gray-700"
                  placeholder="operative@zerogrid.com"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
                  Security Phrase
                </label>
                <input
                  id="password"
                  type="password"
                  required
                  minLength={6}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full px-4 py-3 bg-[#0a0a0a] border border-white/20 text-white font-mono text-sm focus:border-[#ccff00] focus:ring-1 focus:ring-[#ccff00] focus:outline-none transition-all placeholder:text-gray-700"
                  placeholder="••••••••••••"
                />
                <p className="text-[10px] font-mono text-gray-600 flex items-center gap-1 mt-1">
                  <span className="text-[#ccff00]">*</span> MINIMUM 6 CHARACTERS REQUIRED FOR ENCRYPTION
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-white text-black py-4 font-mono font-bold uppercase tracking-widest hover:bg-[#ccff00] hover:shadow-[0_0_15px_rgba(204,255,0,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-8 border-2 border-transparent relative overflow-hidden group"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-2 h-2 bg-black animate-spin rounded-full"></span>
                    ENCRYPTING...
                  </span>
                ) : (
                  <>
                    <span className="relative z-10">AUTHORIZE_ENTRY</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/10 flex justify-center items-center text-xs font-mono">
              <span className="text-gray-600 mr-2">EXISTING OPERATIVE?</span>
              <Link href="/login" className="text-[#ccff00] hover:text-white hover:underline transition-colors decoration-[#ccff00] underline-offset-4">
                :: ACCESS TERMINAL
              </Link>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-between text-[10px] font-mono text-gray-600 uppercase">
           <span>Sys_Ver: 4.2.0</span>
           <span>Latency: 12ms</span>
        </div>
      </div>
    </div>
  );
}