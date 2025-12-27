'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4 selection:bg-[#ccff00] selection:text-black">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group mb-8">
            <div className="w-2 h-2 bg-[#ccff00]"></div>
            <span className="font-mono font-bold tracking-tighter text-white text-xl">
              ZEROGRID<span className="text-[#ccff00]">_</span>
            </span>
          </Link>
          <h1 className="text-2xl font-mono font-bold text-white uppercase tracking-tight mt-6">
            Password Recovery
          </h1>
          <p className="text-gray-500 font-mono text-xs mt-2 uppercase tracking-wider">
            Reset_Protocol_Initiated
          </p>
        </div>

        <div className="border border-white/10 bg-[#0a0a0a] p-1 relative">
          <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ccff00]"></div>
          <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ccff00]"></div>
          <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ccff00]"></div>
          <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ccff00]"></div>

          <div className="bg-[#050505] p-8">
            {success ? (
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-6 border border-[#ccff00] flex items-center justify-center">
                  <svg className="w-8 h-8 text-[#ccff00]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h2 className="text-lg font-mono font-bold text-white mb-4 uppercase">
                  Check_Your_Email
                </h2>
                <p className="text-gray-400 font-mono text-xs mb-6">
                  If an account exists with <span className="text-[#ccff00]">{email}</span>, 
                  you will receive a password reset link shortly.
                </p>
                <p className="text-gray-600 font-mono text-[10px] mb-6 uppercase">
                  Link expires in 1 hour
                </p>
                <Link
                  href="/login"
                  className="inline-block bg-white/10 text-white px-6 py-3 font-mono text-xs uppercase hover:bg-white/20 transition-colors"
                >
                  Return_To_Login
                </Link>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <p className="text-gray-400 font-mono text-xs mb-6">
                  Enter your email address and we'll send you a link to reset your password.
                </p>

                {error && (
                  <div className="p-3 border border-red-500 bg-red-500/10 text-red-400 font-mono text-xs">
                    ERROR: {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-white/20 text-white font-mono text-sm focus:border-[#ccff00] focus:ring-0 outline-none transition-colors"
                    placeholder="operative@domain.com"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ccff00] text-black px-6 py-3 font-mono text-xs font-bold uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'PROCESSING...' : 'Send_Reset_Link'}
                </button>

                <div className="text-center pt-4 border-t border-white/10">
                  <Link
                    href="/login"
                    className="text-gray-500 hover:text-white font-mono text-xs uppercase transition-colors"
                  >
                    ← Back_To_Login
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}