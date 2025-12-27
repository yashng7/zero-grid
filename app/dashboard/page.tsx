'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  email: string;
  name: string;
}

interface Issue {
  id: string;
  type: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  status: string;
  createdAt: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [filteredIssues, setFilteredIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [editingIssue, setEditingIssue] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState({
    priority: 'medium',
    status: 'open',
  });
  
  const [formData, setFormData] = useState({
    type: 'cloud-security',
    title: '',
    description: '',
    priority: 'medium',
  });

  useEffect(() => {
    const init = async () => {
      await fetchUser();
      await fetchIssues();
      setLoading(false);
    };
    init();
  }, []);

  useEffect(() => {
    if (filterType === 'all') {
      setFilteredIssues(issues);
    } else {
      setFilteredIssues(issues.filter(issue => issue.type === filterType));
    }
  }, [filterType, issues]);

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/auth/me', {
        credentials: 'include',
      });
      if (!res.ok) {
        router.push('/login');
        return;
      }
      const data = await res.json();
      setUser(data.data);
    } catch (error) {
      console.error('Auth failed:', error);
      router.push('/login');
    }
  };

  const fetchIssues = async () => {
    try {
      const res = await fetch('/api/issues', {
        credentials: 'include',
      });
      if (!res.ok) {
        console.error('Failed to fetch issues');
        return;
      }
      const data = await res.json();
      setIssues(data.data || []);
      setFilteredIssues(data.data || []);
    } catch (error) {
      console.error('Failed to fetch issues:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { 
        method: 'POST',
        credentials: 'include',
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push('/');
  };

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCreating(true);

    try {
      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to create issue');
        setCreating(false);
        return;
      }

      setFormData({ type: 'cloud-security', title: '', description: '', priority: 'medium' });
      setShowCreateForm(false);
      await fetchIssues();
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleEditIssue = (issue: Issue) => {
    setEditingIssue(issue.id);
    setEditFormData({
      priority: issue.priority,
      status: issue.status,
    });
  };

  const handleUpdateIssue = async (issueId: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(editFormData),
      });

      if (res.ok) {
        setEditingIssue(null);
        await fetchIssues();
      }
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleDeleteIssue = async (id: string) => {
    if (!confirm('CONFIRM_DELETION: This action cannot be undone.')) return;
    
    try {
      const res = await fetch(`/api/issues/${id}`, { 
        method: 'DELETE',
        credentials: 'include',
      });
      
      if (res.ok) {
        await fetchIssues();
      }
    } catch (error) {
      console.error('Delete failed:', error);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'cloud-security': 'CLOUD_SEC',
      'reteam-assessment': 'RED_TEAM',
      'vapt': 'VAPT_OPS',
    };
    return labels[type] || type.toUpperCase();
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 border-red-500 bg-red-500/10';
      case 'medium': return 'text-yellow-500 border-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-blue-400 border-blue-400 bg-blue-400/10';
      default: return 'text-gray-400 border-gray-400';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <div className="font-mono text-xs text-[#ccff00] animate-pulse">
          INITIALIZING_DASHBOARD...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#e0e0e0] pb-20 selection:bg-[#ccff00] selection:text-black">
      
      <div className="fixed inset-0 z-0 pointer-events-none bg-[#050505]">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a1a1a_1px,transparent_1px),linear-gradient(to_bottom,#1a1a1a_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20"></div>
      </div>

      <nav className="sticky top-0 z-50 border-b border-white/10 bg-[#050505]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-2 h-2 bg-[#ccff00]"></div>
              <span className="font-mono font-bold tracking-tighter text-white">
                ZEROGRID<span className="text-[#ccff00]">_</span>
              </span>
            </Link>
            
            <div className="flex items-center gap-6 font-mono text-xs">
              <div className="hidden md:flex items-center gap-2 text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                LIVE_CONNECTION
              </div>
              <div className="h-4 w-[1px] bg-white/10 hidden md:block"></div>
              <Link href="/profile" className="text-gray-400 hover:text-white uppercase transition-colors">
                Config
              </Link>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-400 uppercase transition-colors"
              >
                Terminate_Session
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-white/10 pb-6">
          <div>
            <p className="font-mono text-xs text-[#ccff00] mb-2 uppercase tracking-widest">
              Operative_Designation
            </p>
            <h1 className="text-3xl font-mono font-bold text-white uppercase tracking-tight">
              {user?.name || 'UNKNOWN_OPERATIVE'}
            </h1>
          </div>
          <div className="flex gap-4 mt-4 md:mt-0">
             <div className="text-right">
                <span className="block text-[10px] font-mono text-gray-500 uppercase">Active Vectors</span>
                <span className="block text-xl font-mono text-white">{issues.length}</span>
             </div>
             <div className="w-[1px] bg-white/10"></div>
             <div className="text-right">
                <span className="block text-[10px] font-mono text-gray-500 uppercase">Clearance</span>
                <span className="block text-xl font-mono text-white">LVL_3</span>
             </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
          
          <div className="flex flex-wrap gap-1">
            {[
              { id: 'all', label: 'ALL_TRAFFIC' },
              { id: 'cloud-security', label: 'CLOUD' },
              { id: 'vapt', label: 'VAPT' },
              { id: 'reteam-assessment', label: 'RED_TEAM' }
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                className={`
                  px-4 py-2 font-mono text-xs uppercase tracking-wider border transition-all duration-200
                  ${filterType === filter.id 
                    ? 'border-[#ccff00] text-black bg-[#ccff00]' 
                    : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white bg-black'}
                `}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className={`
              flex items-center gap-2 px-6 py-2 font-mono text-xs font-bold uppercase tracking-wider border transition-all
              ${showCreateForm ? 'bg-white text-black border-white' : 'bg-transparent text-[#ccff00] border-[#ccff00] hover:bg-[#ccff00] hover:text-black'}
            `}
          >
            {showCreateForm ? 'CANCEL_PROTOCOL' : '+ REPORT_INCIDENT'}
          </button>
        </div>

        {showCreateForm && (
          <div className="mb-12 border border-white/10 bg-[#0a0a0a] p-1 relative animate-fadeIn">
             <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ccff00]"></div>
             <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ccff00]"></div>
             <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ccff00]"></div>
             <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ccff00]"></div>

             <div className="bg-[#050505] p-6 md:p-8">
              <h2 className="text-lg font-mono font-bold text-white mb-6 border-b border-white/10 pb-2">
                NEW_INCIDENT_REPORT
              </h2>
              
              {error && (
                <div className="mb-4 p-3 border border-red-500 bg-red-500/10 text-red-400 font-mono text-xs">
                  ERROR: {error}
                </div>
              )}
              
              <form onSubmit={handleCreateIssue} className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">Vector Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/20 text-white font-mono text-xs focus:border-[#ccff00] focus:ring-0 outline-none uppercase"
                  >
                    <option value="cloud-security">Cloud Security</option>
                    <option value="reteam-assessment">Reteam Assessment</option>
                    <option value="vapt">VAPT</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">Threat Level</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/20 text-white font-mono text-xs focus:border-[#ccff00] focus:ring-0 outline-none uppercase"
                  >
                    <option value="low">Low - Monitoring</option>
                    <option value="medium">Medium - Investigation</option>
                    <option value="high">High - Immediate Action</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">Incident Title</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/20 text-white font-mono text-xs focus:border-[#ccff00] focus:ring-0 outline-none"
                    placeholder="E.g., UNUSUAL_OUTBOUND_TRAFFIC"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-xs font-mono font-bold text-gray-500 uppercase mb-2">Technical Details</label>
                  <textarea
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-3 bg-black border border-white/20 text-white font-mono text-xs focus:border-[#ccff00] focus:ring-0 outline-none"
                    placeholder="Log details..."
                  />
                </div>

                <div className="md:col-span-2 flex justify-end">
                  <button
                    type="submit"
                    disabled={creating}
                    className="bg-[#ccff00] text-black px-8 py-3 font-mono text-xs font-bold uppercase hover:bg-white transition-colors disabled:opacity-50"
                  >
                    {creating ? 'PROCESSING...' : 'Submit_Report'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-2 text-[10px] font-mono text-gray-500 uppercase tracking-widest border-b border-white/10">
            <div className="col-span-2">Type</div>
            <div className="col-span-4">Incident / Vector</div>
            <div className="col-span-2">Priority</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="border border-dashed border-white/10 p-12 text-center">
              <p className="font-mono text-gray-500 text-sm">NO_ACTIVE_VECTORS_DETECTED</p>
            </div>
          ) : (
            filteredIssues.map((issue) => (
              <div
                key={issue.id}
                className="group relative bg-[#0a0a0a] border border-white/5 hover:border-white/20 transition-colors"
              >
                {editingIssue === issue.id ? (
                  <div className="p-6 space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Priority</label>
                        <select
                          value={editFormData.priority}
                          onChange={(e) => setEditFormData({ ...editFormData, priority: e.target.value })}
                          className="w-full px-4 py-2 bg-black border border-white/20 text-white font-mono text-xs focus:border-[#ccff00] outline-none"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-mono text-gray-500 uppercase mb-2">Status</label>
                        <select
                          value={editFormData.status}
                          onChange={(e) => setEditFormData({ ...editFormData, status: e.target.value })}
                          className="w-full px-4 py-2 bg-black border border-white/20 text-white font-mono text-xs focus:border-[#ccff00] outline-none"
                        >
                          <option value="open">Open</option>
                          <option value="in-progress">In Progress</option>
                          <option value="closed">Closed</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-2 justify-end">
                      <button
                        onClick={() => handleUpdateIssue(issue.id)}
                        className="bg-[#ccff00] text-black px-6 py-2 font-mono text-xs uppercase hover:bg-white"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIssue(null)}
                        className="bg-white/10 text-white px-6 py-2 font-mono text-xs uppercase hover:bg-white/20"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="md:grid md:grid-cols-12 gap-4 p-4 md:p-6 items-center">
                    
                    <div className="col-span-2 mb-2 md:mb-0">
                      <span className="inline-block px-2 py-1 bg-white/5 text-[10px] font-mono text-gray-400 border border-white/10 uppercase">
                        {getTypeLabel(issue.type)}
                      </span>
                    </div>

                    <div className="col-span-4 mb-4 md:mb-0">
                      <h3 className="text-sm font-bold text-white font-mono uppercase mb-1">{issue.title}</h3>
                      <p className="text-xs text-gray-500 font-sans line-clamp-1">{issue.description}</p>
                    </div>

                    <div className="col-span-2 mb-2 md:mb-0">
                      <div className={`inline-flex items-center gap-2 px-2 py-1 border text-[10px] font-mono uppercase tracking-wider ${getPriorityColor(issue.priority)}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${issue.priority === 'high' ? 'bg-red-500' : issue.priority === 'medium' ? 'bg-yellow-500' : 'bg-blue-400'}`}></span>
                        {issue.priority}
                      </div>
                    </div>

                    <div className="col-span-2 mb-2 md:mb-0">
                      <span className="text-[10px] font-mono text-gray-400 uppercase">
                        {issue.status.replace('-', '_')}
                      </span>
                    </div>

                    <div className="col-span-2 flex gap-2 justify-end">
                      <button
                        onClick={() => handleEditIssue(issue)}
                        className="text-gray-600 hover:text-[#ccff00] transition-colors"
                        title="Edit Vector"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>
                      </button>
                      <button
                        onClick={() => handleDeleteIssue(issue.id)}
                        className="text-gray-600 hover:text-red-500 transition-colors"
                        title="Delete Vector"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="square" strokeWidth="1.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#ccff00] group-hover:w-full transition-all duration-300"></div>
              </div>
            ))
          )}
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
}