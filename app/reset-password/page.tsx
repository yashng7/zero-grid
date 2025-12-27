'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [verifying, setVerifying] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyToken = async () => {
      if (!token) {
        setVerifying(false);
        return;
      }

      try {
        const res = await fetch(`/api/auth/reset-password?token=${token}`);
        const data = await res.json();
        setTokenValid(data.data?.valid || false);
      } catch (err) {
        setTokenValid(false);
      } finally {
        setVerifying(false);
      }
    };

    verifyToken();
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password, confirmPassword }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setLoading(false);
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push('/login'), 3000);
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (verifying) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="font-mono text-xs text-[#ccff00] animate-pulse">
          VERIFYING_TOKEN...
        </div>
      </div>
    );
  }

  if (!token || !tokenValid) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center px-4">
        <div className="w-full max-w-md text-center">
          <div className="w-16 h-16 mx-auto mb-6 border border-red-500 flex items-center justify-center">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
          <h1 className="text-xl font-mono font-bold text-white mb-4 uppercase">
            Invalid_Or_Expired_Token
          </h1>
          <p className="text-gray-400 font-mono text-xs mb-6">
            This password reset link is invalid or has expired.
          </p>
          <Link
            href="/forgot-password"
            className="inline-block bg-[#ccff00] text-black px-6 py-3 font-mono text-xs font-bold uppercase hover:bg-white transition-colors"
          >
            Request_New_Link
          </Link>
        </div>
      </div>
    );
  }

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
            Reset Password
          </h1>
          <p className="text-gray-500 font-mono text-xs mt-2 uppercase tracking-wider">
            Set_New_Credentials
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
                  Password_Updated
                </h2>
                <p className="text-gray-400 font-mono text-xs mb-6">
                  Your password has been reset successfully. Redirecting to login...
                </p>
                <div className="animate-pulse text-[#ccff00] font-mono text-xs uppercase">
                  Redirecting...
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-3 border border-red-500 bg-red-500/10 text-red-400 font-mono text-xs">
                    ERROR: {error}
                  </div>
                )}

                <div>
                  <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-white/20 text-white font-mono text-sm focus:border-[#ccff00] focus:ring-0 outline-none transition-colors"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <p className="text-gray-600 font-mono text-[10px] mt-1">
                    Minimum 6 characters
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-black border border-white/20 text-white font-mono text-sm focus:border-[#ccff00] focus:ring-0 outline-none transition-colors"
                    placeholder="••••••••"
                    minLength={6}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#ccff00] text-black px-6 py-3 font-mono text-xs font-bold uppercase hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'PROCESSING...' : 'Reset_Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="font-mono text-xs text-[#ccff00] animate-pulse">
          LOADING...
        </div>
      </div>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}