'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    // Simulate slight delay or actual fetch
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/users/profile');
        if (!res.ok) {
           // On error, we might redirect, but for Lighthouse stability
           // we ensure the redirect doesn't cause a layout flash if possible
           // (Logic kept simple here)
           router.push('/login');
           return;
        }
        const data = await res.json();
        setUser(data.data);
        setFormData({ name: data.data.name, email: data.data.email });
      } catch (error) {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setSaving(true);

    try {
      const res = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'UPDATE_FAILED');
        setSaving(false);
        return;
      }

      setUser(data.data);
      setMessage('PROFILE_UPDATED');
      setSaving(false);
    } catch (err) {
      setError('CONNECTION_ERROR');
      setSaving(false);
    }
  };

  // 1. PERFORMANCE LOADING SKELETON (Prevents Layout Shift)
  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] p-6 flex flex-col items-center pt-24">
        <div className="w-full max-w-lg border border-white/10 bg-[#0a0a0a] p-8 space-y-8 animate-pulse">
           <div className="h-6 w-1/3 bg-white/10 mb-8"></div>
           <div className="space-y-4">
              <div className="h-4 w-1/4 bg-white/10"></div>
              <div className="h-12 w-full bg-white/5"></div>
           </div>
           <div className="space-y-4">
              <div className="h-4 w-1/4 bg-white/10"></div>
              <div className="h-12 w-full bg-white/5"></div>
           </div>
           <div className="h-12 w-full bg-white/10 mt-8"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pb-20">
      
      {/* 2. LIGHTWEIGHT BACKGROUND (No Heavy Gradients) */}
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      </div>

      {/* NAVIGATION */}
      <nav className="border-b border-white/10 bg-[#0a0a0a] relative z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="w-2 h-2 bg-[#ccff00]"></div>
             <span className="font-mono font-bold tracking-tighter text-white">
               ZEROGRID<span className="text-[#ccff00]">_</span>
             </span>
          </Link>
          <Link 
            href="/dashboard" 
            className="text-xs font-mono text-gray-400 hover:text-white uppercase tracking-wider border border-white/10 px-3 py-1 bg-black"
          >
            Exit
          </Link>
        </div>
      </nav>

      <main className="max-w-xl mx-auto px-4 md:px-6 py-10 relative z-10">
        
        {/* HEADER */}
        <div className="mb-8 border-b border-white/10 pb-4">
          <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-tight flex items-center gap-2">
            <span className="text-[#ccff00]">::</span> CONFIGURATION
          </h1>
          <p className="font-mono text-[10px] text-gray-500 mt-2 uppercase">
            ID: {user?.id}
          </p>
        </div>

        {/* FORM CONTAINER - Solid Background for Performance */}
        <div className="bg-[#0a0a0a] border border-white/10 p-6 md:p-8 relative">
          
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* STATUS MESSAGES */}
            {message && (
              <div className="bg-[#ccff00]/10 border border-[#ccff00]/50 text-[#ccff00] px-4 py-3 font-mono text-xs flex items-center gap-2">
                <span>✓</span> {message}
              </div>
            )}

            {error && (
              <div className="bg-red-900/10 border border-red-500/50 text-red-500 px-4 py-3 font-mono text-xs flex items-center gap-2">
                 <span>⚠</span> {error}
              </div>
            )}

            {/* INPUTS - text-base prevents iOS Zoom */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
                Operative Name
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/20 text-white font-sans text-base focus:border-[#ccff00] focus:ring-0 focus:outline-none transition-colors rounded-none placeholder:text-gray-800"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-xs font-mono font-bold text-gray-500 uppercase tracking-widest">
                Secure Mail
              </label>
              <input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 bg-black border border-white/20 text-white font-sans text-base focus:border-[#ccff00] focus:ring-0 focus:outline-none transition-colors rounded-none placeholder:text-gray-800"
              />
            </div>

            {/* ACTION BUTTON - High touch target */}
            <div className="pt-6">
              <button
                type="submit"
                disabled={saving}
                className="w-full bg-[#ccff00] text-black h-12 font-mono font-bold uppercase tracking-widest hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm flex items-center justify-center gap-2 active:scale-[0.98] transform duration-100"
              >
                {saving ? 'UPDATING...' : 'SAVE CHANGES'}
              </button>
            </div>
          </form>

          {/* READ ONLY INFO */}
          <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 gap-4">
             <div>
                <span className="block text-[10px] font-mono text-gray-600 uppercase mb-1">Clearance</span>
                <span className="block text-xs font-mono text-white">LEVEL 3</span>
             </div>
             <div className="text-right">
                <span className="block text-[10px] font-mono text-gray-600 uppercase mb-1">Status</span>
                <span className="block text-xs font-mono text-[#ccff00]">VERIFIED</span>
             </div>
          </div>

        </div>
      </main>
    </div>
  );
}