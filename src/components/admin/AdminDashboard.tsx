import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Users, 
  Vote, 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertCircle, 
  BarChart3, 
  Database, 
  RefreshCw,
  Clock,
  Sparkles,
  ExternalLink,
  Shield,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Candidate, Election, OfficialAnnouncement, AuditLogEvent, ActiveTab } from '../../types';
import { formatDate, formatDateTime } from '../../lib/utils';
import { CivicDataService } from '../../lib/supabase';

interface AdminDashboardProps {
  election: Election;
  candidates: Candidate[];
  announcements: OfficialAnnouncement[];
  auditLogs: AuditLogEvent[];
  onRefreshData: () => Promise<void>;
  setActiveTab: (tab: ActiveTab) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  election,
  candidates,
  announcements,
  auditLogs,
  onRefreshData,
  setActiveTab,
}) => {
  const { user, role, loginAsAdmin } = useAuth();

  const [activeAdminTab, setActiveAdminTab] = useState<'stats' | 'candidates' | 'announcements' | 'audit' | 'system'>('stats');
  
  // State for adding / editing candidate
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [isCandidateModalOpen, setIsCandidateModalOpen] = useState(false);
  const [candidateForm, setCandidateForm] = useState({
    full_name: '',
    party_name: '',
    photo_url: '',
    biography: '',
    public_profile: '',
    candidacy_status: 'Publicly Announced',
    sourceName: '',
    sourceUrl: '',
  });

  // State for announcement
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({
    title: '',
    category: 'Voter Registration',
    content: '',
    source_url: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // If user is not admin
  if (role !== 'super_admin' && role !== 'election_admin' && role !== 'auditor') {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">
            Administrative & Audit Access
          </h2>
          <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto">
            This console is restricted to certified electoral administrators and independent observers. In this demonstration environment, you can activate the demo admin role with 1-click.
          </p>
        </div>

        <button
          onClick={async () => {
            await loginAsAdmin('election_admin');
          }}
          className="px-6 py-3 rounded-lg font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-colors inline-flex items-center gap-2 cursor-pointer"
        >
          <Sparkles className="w-4 h-4 text-slate-950" />
          Authenticate as Demo Election Admin
        </button>
      </div>
    );
  }

  // Simulated metrics
  const totalDemoVoters = 1420;
  const verifiedCount = 1180;
  const ballotsCastCount = 892;

  // Open modal for new candidate
  const handleOpenAddCandidate = () => {
    setEditingCandidate(null);
    setCandidateForm({
      full_name: '',
      party_name: '',
      photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=60',
      biography: '',
      public_profile: '',
      candidacy_status: 'Publicly Announced',
      sourceName: '',
      sourceUrl: '',
    });
    setIsCandidateModalOpen(true);
  };

  // Open modal for edit candidate
  const handleOpenEditCandidate = (cand: Candidate) => {
    setEditingCandidate(cand);
    setCandidateForm({
      full_name: cand.full_name,
      party_name: cand.party_name,
      photo_url: cand.photo_url,
      biography: cand.biography,
      public_profile: cand.public_profile,
      candidacy_status: cand.candidacy_status,
      sourceName: cand.sources[0]?.source_name || '',
      sourceUrl: cand.sources[0]?.source_url || '',
    });
    setIsCandidateModalOpen(true);
  };

  const handleSaveCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setActionError('');
    setActionSuccess('');

    try {
      if (editingCandidate) {
        // Update
        const updated = await CivicDataService.updateCandidate(editingCandidate.id, {
          full_name: candidateForm.full_name,
          party_name: candidateForm.party_name,
          photo_url: candidateForm.photo_url,
          biography: candidateForm.biography,
          public_profile: candidateForm.public_profile,
          candidacy_status: candidateForm.candidacy_status as any,
        });
        setActionSuccess(`Candidate "${updated.full_name}" updated successfully.`);
      } else {
        // Add
        const nowStr = new Date().toISOString();
        const candId = `cand_${Date.now()}`;
        const newCand = await CivicDataService.addCandidate({
          id: candId,
          full_name: candidateForm.full_name,
          party_name: candidateForm.party_name,
          photo_url: candidateForm.photo_url,
          biography: candidateForm.biography,
          public_profile: candidateForm.public_profile,
          candidacy_status: candidateForm.candidacy_status as any,
          sources: [
            {
              id: `src_${Date.now()}`,
              candidate_id: candId,
              source_name: candidateForm.sourceName || 'Public Gazette',
              source_url: candidateForm.sourceUrl || '',
              publication_date: nowStr.split('T')[0],
              description: 'Official candidate statement and press coverage',
              created_at: nowStr,
            }
          ]
        });
        setActionSuccess(`Contender "${newCand.full_name}" added to neutral directory.`);
      }

      await onRefreshData();
      setIsCandidateModalOpen(false);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to save candidate.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSaveAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setActionError('');
    setActionSuccess('');

    try {
      await CivicDataService.addAnnouncement({
        title: announcementForm.title,
        category: announcementForm.category as any,
        content: announcementForm.content,
        source_url: announcementForm.source_url,
        published_at: new Date().toISOString(),
      });

      setActionSuccess(`Official announcement published.`);
      await onRefreshData();
      setIsAnnouncementModalOpen(false);
      setAnnouncementForm({
        title: '',
        category: 'Voter Registration',
        content: '',
        source_url: '',
      });
    } catch (err: any) {
      setActionError(err?.message || 'Failed to publish announcement.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-amber-500 text-slate-950">
              Role: {role}
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Audit Token Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Electoral Administration & Observer Console
          </h1>
          <p className="text-xs text-slate-600 mt-0.5">
            Manage candidates, publish certified announcements, inspect audit logs, and observe participation metrics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={async () => {
              await onRefreshData();
              setActionSuccess('Records refreshed from database.');
              setTimeout(() => setActionSuccess(''), 3000);
            }}
            className="px-3.5 py-2 rounded-lg text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 flex items-center gap-1.5 cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
            Refresh Data
          </button>
        </div>
      </div>

      {actionSuccess && (
        <div className="p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-900 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Admin Navigation Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-xs sm:text-sm font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveAdminTab('stats')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'stats'
              ? 'border-amber-500 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Participation Statistics
        </button>
        <button
          onClick={() => setActiveAdminTab('candidates')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'candidates'
              ? 'border-amber-500 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Candidate Directory ({candidates.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('announcements')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'announcements'
              ? 'border-amber-500 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Announcements ({announcements.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('audit')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'audit'
              ? 'border-amber-500 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Audit Ledger ({auditLogs.length})
        </button>
        <button
          onClick={() => setActiveAdminTab('system')}
          className={`pb-3 border-b-2 transition-colors whitespace-nowrap cursor-pointer ${
            activeAdminTab === 'system'
              ? 'border-amber-500 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          System Health & Safeguards
        </button>
      </div>

      {/* TAB 1: PARTICIPATION STATISTICS */}
      {activeAdminTab === 'stats' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold uppercase">Total Simulated Registrations</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{totalDemoVoters.toLocaleString()}</div>
              <p className="text-[11px] text-emerald-600 mt-1">Active demo participants</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold uppercase">Accredited / Verified</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{verifiedCount.toLocaleString()}</div>
              <p className="text-[11px] text-slate-500 mt-1">{((verifiedCount / totalDemoVoters) * 100).toFixed(1)}% verification rate</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold uppercase">Demo Ballots Cast</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">{ballotsCastCount.toLocaleString()}</div>
              <p className="text-[11px] text-amber-800 mt-1">Decoupled anonymous ledger tokens</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
              <span className="text-xs text-slate-500 font-semibold uppercase">Diaspora Participation</span>
              <div className="text-2xl font-bold text-slate-900 mt-1">42.4%</div>
              <p className="text-[11px] text-slate-500 mt-1">Kenya, Uganda, Sudan, US, Australia</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-slate-800 flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-slate-950 uppercase text-[11px]">
                Integrity Boundary Enforced
              </span>
              <p>
                In strict compliance with Section 15 guidelines: There are no "Declare Winner" or "Fix Election" controls. Live vote distributions remain cryptographically sealed until official tallies are completed by the designated returning officer.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CANDIDATE DIRECTORY MANAGEMENT */}
      {activeAdminTab === 'candidates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Candidate Directory</h3>
            <button
              onClick={handleOpenAddCandidate}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              Add Contender Profile
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Candidate</th>
                    <th className="p-3.5">Party / Affiliation</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Sources</th>
                    <th className="p-3.5">Last Updated</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {candidates.map((cand) => (
                    <tr key={cand.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 flex items-center gap-3">
                        <img 
                          src={cand.photo_url} 
                          alt="" 
                          referrerPolicy="no-referrer"
                          className="w-8 h-8 rounded-full object-cover border border-slate-300"
                        />
                        <span className="font-bold text-slate-900">{cand.full_name}</span>
                      </td>
                      <td className="p-3.5 font-medium text-slate-700">{cand.party_name}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                          {cand.candidacy_status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-600">{cand.sources.length} citation(s)</td>
                      <td className="p-3.5 text-slate-500">{formatDate(cand.updated_at)}</td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleOpenEditCandidate(cand)}
                          className="p-1.5 text-amber-800 hover:text-amber-950 hover:bg-amber-50 rounded cursor-pointer"
                          title="Edit candidate"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ANNOUNCEMENTS */}
      {activeAdminTab === 'announcements' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-slate-900">Official NEC Announcements</h3>
            <button
              onClick={() => setIsAnnouncementModalOpen(true)}
              className="px-4 py-2 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
            >
              <Plus className="w-4 h-4" />
              Publish Announcement
            </button>
          </div>

          <div className="space-y-3">
            {announcements.map((ann) => (
              <div key={ann.id} className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-900">
                      {ann.category}
                    </span>
                    <span className="text-[11px] text-slate-400">
                      {formatDate(ann.published_at)}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{ann.title}</h4>
                  <p className="text-xs text-slate-600">{ann.content}</p>
                </div>
                {ann.source_url && (
                  <a
                    href={ann.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-400 hover:text-slate-600"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AUDIT LEDGER */}
      {activeAdminTab === 'audit' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Immutable Audit Log Register</h3>
              <p className="text-xs text-slate-600">
                Time-stamped audit events captured for independent electoral observers.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Timestamp</th>
                    <th className="p-3.5">Event Type</th>
                    <th className="p-3.5">Initiator / Role</th>
                    <th className="p-3.5">Target Entity</th>
                    <th className="p-3.5">Cryptographic Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {auditLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/50">
                      <td className="p-3.5 text-slate-500">{formatDateTime(log.created_at)}</td>
                      <td className="p-3.5 font-bold text-slate-900">{log.event_type}</td>
                      <td className="p-3.5 text-slate-700 font-sans">{log.actor_name} <span className="text-slate-400 text-[10px]">({log.actor_id})</span></td>
                      <td className="p-3.5 text-slate-600 truncate max-w-xs">{log.target_description || log.target_id}</td>
                      <td className="p-3.5 text-slate-400 text-[10px] truncate max-w-xs font-mono">{log.metadata?.confirmationHash || log.metadata?.receiptCode || `SHA256:${log.id}`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM SAFEGUARDS */}
      {activeAdminTab === 'system' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Database Status</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="font-bold text-slate-900 text-lg">PostgreSQL / Supabase</div>
              <p className="text-xs text-slate-500">Row Level Security active on 6 tables.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Ballot Decoupling</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              </div>
              <div className="font-bold text-slate-900 text-lg">Strict Two-Layer Isolation</div>
              <p className="text-xs text-slate-500">No foreign keys between users and ballots.</p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase">Environment</span>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              </div>
              <div className="font-bold text-slate-900 text-lg">Prototype Sandbox</div>
              <p className="text-xs text-slate-500">Simulated non-binding testing node.</p>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Modal */}
      {isCandidateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
            <div className="bg-[#0B1B3D] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                {editingCandidate ? 'Edit Candidate Profile' : 'Add New Candidate'}
              </h3>
              <button
                onClick={() => setIsCandidateModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCandidate} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={candidateForm.full_name}
                  onChange={(e) => setCandidateForm({ ...candidateForm, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Political Party</label>
                  <input
                    type="text"
                    required
                    value={candidateForm.party_name}
                    onChange={(e) => setCandidateForm({ ...candidateForm, party_name: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Candidacy Status</label>
                  <select
                    value={candidateForm.candidacy_status}
                    onChange={(e) => setCandidateForm({ ...candidateForm, candidacy_status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 bg-white"
                  >
                    <option value="Publicly Announced">Publicly Announced</option>
                    <option value="Reported Intent to Contest">Reported Intent to Contest</option>
                    <option value="Party Nominee">Party Nominee</option>
                    <option value="Independent Contender">Independent Contender</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Photograph URL</label>
                <input
                  type="url"
                  value={candidateForm.photo_url}
                  onChange={(e) => setCandidateForm({ ...candidateForm, photo_url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Neutral Factual Biography</label>
                <textarea
                  rows={3}
                  required
                  value={candidateForm.biography}
                  onChange={(e) => setCandidateForm({ ...candidateForm, biography: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Public Political Information</label>
                <textarea
                  rows={2}
                  value={candidateForm.public_profile}
                  onChange={(e) => setCandidateForm({ ...candidateForm, public_profile: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sudan Tribune"
                    value={candidateForm.sourceName}
                    onChange={(e) => setCandidateForm({ ...candidateForm, sourceName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Source Citation URL</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={candidateForm.sourceUrl}
                    onChange={(e) => setCandidateForm({ ...candidateForm, sourceUrl: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCandidateModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-50"
                >
                  {isProcessing ? 'Saving...' : 'Save Contender'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Announcement Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-xl shadow-2xl border border-slate-200 w-full max-w-lg overflow-hidden my-8">
            <div className="bg-[#0B1B3D] text-white p-5 flex items-center justify-between">
              <h3 className="font-bold text-base">
                Publish Official Electoral Announcement
              </h3>
              <button
                onClick={() => setIsAnnouncementModalOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAnnouncement} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Announcement Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NEC Voter Roll Accreditation Notice"
                  value={announcementForm.title}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category</label>
                <select
                  value={announcementForm.category}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="Voter Registration">Voter Registration</option>
                  <option value="Election Calendar">Election Calendar</option>
                  <option value="Diaspora Notice">Diaspora Notice</option>
                  <option value="Candidate Information">Candidate Information</option>
                  <option value="Civic Education">Civic Education</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Gazette / Announcement Body</label>
                <textarea
                  rows={4}
                  required
                  value={announcementForm.content}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, content: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Source URL Citation</label>
                <input
                  type="url"
                  placeholder="https://nec.gov.ss/announcements/..."
                  value={announcementForm.source_url}
                  onChange={(e) => setAnnouncementForm({ ...announcementForm, source_url: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 font-mono text-[11px]"
                />
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className="px-4 py-2 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="px-5 py-2 rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold disabled:opacity-50"
                >
                  {isProcessing ? 'Publishing...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
