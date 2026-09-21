import React from 'react';
import { 
  Calendar, 
  Vote, 
  Building2, 
  ShieldCheck, 
  AlertTriangle, 
  ExternalLink, 
  FileText, 
  CheckCircle2, 
  Users, 
  Clock, 
  Globe 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab, Election, OfficialAnnouncement } from '../../types';
import { formatDate } from '../../lib/utils';

interface ElectionInfoPageProps {
  election: Election;
  announcements: OfficialAnnouncement[];
  setActiveTab: (tab: ActiveTab) => void;
}

export const ElectionInfoPage: React.FC<ElectionInfoPageProps> = ({ 
  election, 
  announcements, 
  setActiveTab 
}) => {
  const { user, registration, verification } = useAuth();

  const regStatus = registration?.registration_status || (verification?.verification_status === 'Verified' ? 'Verified' : 'Not Registered');

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
          <span>★</span>
          Official Civic Roadmap & Guidance
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-sans">
          South Sudan General Election
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          Comprehensive informational briefing regarding the scheduled presidential, legislative, and regional elections in accordance with the Revitalised Agreement (R-ARCSS) and official notices.
        </p>
      </div>

      {/* Mandatory Section 6 Important Notice */}
      <div className="p-5 rounded-xl bg-amber-50 border border-amber-300 text-slate-900 shadow-xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h3 className="font-bold text-slate-950 uppercase tracking-wide text-xs">
              Important Authority Notice
            </h3>
            <p className="text-slate-800 leading-relaxed font-medium">
              “Election dates, registration procedures, candidate certification and voting procedures are determined by the competent election authority. This prototype does not replace official election processes.”
            </p>
            <div className="pt-2">
              <a
                href="https://nec.gov.ss"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-amber-600 hover:bg-amber-500 text-white text-xs font-semibold shadow-2xs transition-colors"
              >
                Official NEC Information
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Key Election Specifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <Vote className="w-4 h-4 text-amber-600" />
            Election Type
          </div>
          <div className="font-bold text-slate-900 text-base">
            {election.election_type || 'Presidential / General Election'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Executive, Legislative & States
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <Calendar className="w-4 h-4 text-amber-600" />
            Scheduled Date
          </div>
          <div className="font-bold text-slate-900 text-base">
            22 December 2026
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Status: {election.status}
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4 text-amber-600" />
            Election Authority
          </div>
          <div className="font-bold text-slate-900 text-base">
            National Elections Commission (NEC)
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Republic of South Sudan
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShieldCheck className="w-4 h-4 text-amber-600" />
            Your Registration Status
          </div>
          <div className="flex items-center gap-1.5 font-bold text-slate-900 text-base">
            <span className={`w-2 h-2 rounded-full ${regStatus === 'Verified' ? 'bg-emerald-500' : 'bg-amber-500'}`}></span>
            {user ? regStatus : 'Sign In to Check'}
          </div>
          <p className="text-xs text-slate-500 mt-1">
            {user ? (
              <button 
                onClick={() => setActiveTab('verification')}
                className="text-amber-800 font-semibold hover:underline"
              >
                Manage Accreditation →
              </button>
            ) : (
              'Guest Session'
            )}
          </p>
        </div>

      </div>

      {/* Voter Eligibility Information Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl font-bold text-slate-900">
            Voter Eligibility Criteria
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            In accordance with the National Elections Act and constitutional standards:
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              1. Citizenship
            </div>
            <p className="text-slate-600 leading-relaxed">
              Must be a South Sudanese citizen by birth, descent, or lawful naturalization documented by civil registry.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              2. Minimum Age
            </div>
            <p className="text-slate-600 leading-relaxed">
              Must be at least 18 years of age on or before election polling day.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 space-y-1.5">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              3. Legal Capacity & Roll
            </div>
            <p className="text-slate-600 leading-relaxed">
              Must be of sound mind, not barred by final court order, and accredited on the certified voter register.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-lg bg-slate-100 text-xs text-slate-700 leading-relaxed">
          <strong>Diaspora Provisions:</strong> Section 20 of this prototype models options for South Sudanese voters residing in Kenya, Uganda, Ethiopia, Sudan, the United States, Australia, and worldwide to register and participate from designated consular hubs or secure channels if authorized by the NEC.
        </div>
      </div>

      {/* Official Announcements Section */}
      <div className="bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Important Announcements & Legal Gazettes
            </h2>
            <p className="text-xs text-slate-600 mt-1">
              Public communications from the electoral commission and observation bodies.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {announcements.map((ann) => (
            <div key={ann.id} className="p-4 rounded-lg border border-slate-200 hover:border-slate-300 transition-colors">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 mb-1.5">
                <span className="font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px]">
                  {ann.category}
                </span>
                <span>Published: {formatDate(ann.published_at)}</span>
              </div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                {ann.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                {ann.content}
              </p>
              {ann.source_url && (
                <div className="mt-3 pt-2 border-t border-slate-100">
                  <a
                    href={ann.source_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-amber-800 hover:underline inline-flex items-center gap-1 font-medium"
                  >
                    View Source Document & Citations
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
