import React from 'react';
import { 
  Vote, 
  Calendar, 
  Globe, 
  CheckCircle2, 
  Clock, 
  FileText, 
  ShieldCheck, 
  HelpCircle, 
  Users, 
  ExternalLink, 
  AlertTriangle, 
  UserCheck, 
  Sparkles, 
  Lock,
  ArrowRight,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab, OfficialAnnouncement } from '../../types';
import { formatDate } from '../../lib/utils';

interface VoterDashboardProps {
  setActiveTab: (tab: ActiveTab) => void;
  announcements: OfficialAnnouncement[];
}

export const VoterDashboard: React.FC<VoterDashboardProps> = ({ setActiveTab, announcements }) => {
  const { user, verification, registration, lastReceipt } = useAuth();

  if (!user) return null;

  const firstName = user.full_name.split(' ')[0] || user.full_name;
  const regStatus = registration?.registration_status || (verification?.verification_status === 'Verified' ? 'Verified' : 'Not Registered');
  const hasVoted = Boolean(lastReceipt);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
            <span>★</span>
            Civic Participant Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Welcome, {firstName}
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Track your voter accreditation status, review certified announcements, and explore the simulated polling workflow.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center gap-3">
          {regStatus !== 'Verified' ? (
            <button
              onClick={() => setActiveTab('verification')}
              className="px-4 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <UserCheck className="w-4 h-4" />
              Complete Verification
            </button>
          ) : (
            <button
              onClick={() => setActiveTab('voting')}
              className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Vote className="w-4 h-4" />
              {hasVoted ? 'Cast Another Demo Vote' : 'Vote Demo (Simulated)'}
            </button>
          )}
        </div>
      </div>

      {/* 5 Core Metric Cards specified in Section 5 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Election */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Election</span>
            <Vote className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-bold text-slate-900 text-base leading-tight">
            South Sudan General Election
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Presidential & Legislative
          </p>
        </div>

        {/* Card 2: Election Date */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Election Date</span>
            <Calendar className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-bold text-slate-900 text-base leading-tight">
            22 December 2026
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            Official Roadmap Date
          </p>
        </div>

        {/* Card 3: Registration Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Registration Status</span>
            {regStatus === 'Verified' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            ) : (
              <Clock className="w-4 h-4 text-amber-600" />
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <span className={`inline-block w-2 h-2 rounded-full ${
              regStatus === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500'
            }`}></span>
            <div className="font-bold text-slate-900 text-base leading-tight">
              {regStatus}
            </div>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {regStatus === 'Verified' ? 'Demo Sandbox Status' : 'Pending Verification'}
          </p>
        </div>

        {/* Card 4: Voting Status */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Voting Status</span>
            <ShieldCheck className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-bold text-slate-900 text-base leading-tight">
            {hasVoted ? 'Demo Ballot Cast' : 'Not Yet Voted'}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {hasVoted ? (
              <button 
                onClick={() => setActiveTab('receipt')}
                className="text-amber-800 font-semibold hover:underline"
              >
                View Demo Receipt →
              </button>
            ) : (
              'Simulated ballot ready'
            )}
          </p>
        </div>

        {/* Card 5: Country */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Country</span>
            <Globe className="w-4 h-4 text-amber-600" />
          </div>
          <div className="font-bold text-slate-900 text-base leading-tight truncate">
            {user.country}
          </div>
          <p className="text-[11px] text-slate-500 mt-1">
            {user.country.includes('South Sudan') ? 'Domestic Constituency' : 'Diaspora Constituency'}
          </p>
        </div>

      </div>

      {/* Mandatory Section 5 Security Notice */}
      <div className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <span className="font-semibold text-white text-xs uppercase tracking-wider block">
              Civic Security Notice
            </span>
            <p className="text-xs text-slate-300 leading-relaxed mt-0.5">
              “Your identity information and ballot choices should be handled separately in any real election system to protect ballot secrecy.”
            </p>
          </div>
        </div>
        <button
          onClick={() => setActiveTab('security')}
          className="text-xs font-semibold text-amber-400 hover:text-amber-300 underline shrink-0 cursor-pointer"
        >
          View Cryptographic Protocol →
        </button>
      </div>

      {/* Dashboard Quick Action Buttons (Section 5) */}
      <div>
        <h3 className="text-base font-bold text-slate-900 mb-3">
          Voter Services & Quick Actions
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          
          <button
            onClick={() => setActiveTab('election')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <Calendar className="w-5 h-5 text-amber-600 mb-3" />
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">Election Information</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Roadmap & Rules</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('candidates')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <Users className="w-5 h-5 text-amber-600 mb-3" />
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">Candidates</div>
              <div className="text-[11px] text-slate-500 mt-0.5">Neutral Directory</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('verification')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <UserCheck className="w-5 h-5 text-amber-600 mb-3" />
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">My Verification</div>
              <div className="text-[11px] text-slate-500 mt-0.5">{regStatus}</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('voting')}
            className="p-4 rounded-xl bg-amber-500/10 border border-amber-300 hover:bg-amber-500/20 hover:shadow-xs transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <Vote className="w-5 h-5 text-amber-800 mb-3" />
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-950 flex items-center gap-1">
                Vote Demo
                <span className="text-[9px] uppercase tracking-wider px-1 bg-amber-400 rounded font-bold">
                  Demo
                </span>
              </div>
              <div className="text-[11px] text-amber-900/80 mt-0.5">Simulate Ballot</div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab(lastReceipt ? 'receipt' : 'receipt-checker')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <FileText className="w-5 h-5 text-amber-600 mb-3" />
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">My Receipt</div>
              <div className="text-[11px] text-slate-500 mt-0.5">
                {lastReceipt ? lastReceipt.receipt_code : 'Check or Lookup'}
              </div>
            </div>
          </button>

          <button
            onClick={() => setActiveTab('how-it-works')}
            className="p-4 rounded-xl bg-white border border-slate-200 hover:border-amber-400 hover:shadow-xs transition-all text-left flex flex-col justify-between cursor-pointer"
          >
            <HelpCircle className="w-5 h-5 text-amber-600 mb-3" />
            <div>
              <div className="font-bold text-xs sm:text-sm text-slate-900">Help</div>
              <div className="text-[11px] text-slate-500 mt-0.5">FAQ & Guidance</div>
            </div>
          </button>

        </div>
      </div>

      {/* Official Announcements Feed */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold text-slate-900 text-base">
              Official NEC Announcements & Updates
            </h3>
          </div>
          <button
            onClick={() => setActiveTab('election')}
            className="text-xs font-semibold text-amber-800 hover:underline"
          >
            All Updates →
          </button>
        </div>

        <div className="divide-y divide-slate-100">
          {announcements.slice(0, 3).map((ann) => (
            <div key={ann.id} className="py-3.5 first:pt-0 last:pb-0">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                  {ann.category}
                </span>
                <span>{formatDate(ann.published_at)}</span>
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">
                {ann.title}
              </h4>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {ann.content}
              </p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
