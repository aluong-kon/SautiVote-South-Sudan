import React from 'react';
import { X, ExternalLink, ShieldAlert, FileText, Calendar, Building, CheckCircle } from 'lucide-react';
import { Candidate } from '../../types';
import { formatDate } from '../../lib/utils';

interface CandidateProfileModalProps {
  candidate: Candidate | null;
  onClose: () => void;
  onSelectForVote?: (candidate: Candidate) => void;
}

export const CandidateProfileModal: React.FC<CandidateProfileModalProps> = ({ 
  candidate, 
  onClose,
  onSelectForVote 
}) => {
  if (!candidate) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Top Bar */}
        <div className="bg-[#0B1B3D] text-white p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div>
            <span className="text-[11px] font-mono uppercase tracking-wider text-amber-300">
              Neutral Contender Dossier
            </span>
            <h2 className="font-bold text-lg text-white">
              Candidate Information Profile
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-800">
          
          {/* Header Card: Candidate, Party, Status */}
          <div className="flex flex-col sm:flex-row gap-5 items-start">
            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-lg bg-slate-200 overflow-hidden border border-slate-300 shrink-0 shadow-xs">
              <img
                src={candidate.photo_url}
                alt={candidate.full_name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Candidate
                </span>
                <h3 className="text-2xl font-bold text-slate-950">
                  {candidate.full_name}
                </h3>
              </div>

              <div>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                  Political Party / Affiliation
                </span>
                <p className="text-sm font-semibold text-slate-800">
                  {candidate.party_name}
                </p>
              </div>

              <div className="pt-1">
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-0.5">
                  Publicly Stated Status
                </span>
                <span className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-300">
                  {candidate.candidacy_status}
                </span>
              </div>
            </div>
          </div>

          {/* Official Neutrality Disclaimer */}
          <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-xs text-slate-800">
            <strong>Civic Notice:</strong> This profile reflects publicly available news, party releases, and civic announcements. It does not imply that this candidate has been officially certified unless confirmed by the National Elections Commission (NEC).
          </div>

          {/* Biography */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-amber-600" />
              Neutral Biography
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {candidate.biography}
            </p>
          </div>

          {/* Public Political Information */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5 flex items-center gap-1.5">
              <Building className="w-3.5 h-3.5 text-amber-600" />
              Public Political Information
            </h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-lg border border-slate-200">
              {candidate.public_profile}
            </p>
          </div>

          {/* Published Policy / Platform Summary */}
          {candidate.platform_summary && candidate.platform_summary.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-1.5">
                Published Policy & Platform Highlights
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm">
                {candidate.platform_summary.map((point, i) => (
                  <li key={i} className="flex items-start gap-2 text-slate-700">
                    <span className="text-amber-600 font-bold mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Sources and References */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-2">
              Verified Sources & Reference Archive
            </h4>
            <div className="space-y-2">
              {candidate.sources.map((src) => (
                <div key={src.id} className="p-3 rounded-lg border border-slate-200 text-xs bg-white">
                  <div className="flex items-center justify-between font-semibold text-slate-900">
                    <span>{src.source_name}</span>
                    <span className="text-[10px] text-slate-400">{formatDate(src.publication_date)}</span>
                  </div>
                  <p className="text-slate-600 mt-1">{src.description}</p>
                  {src.source_url && (
                    <a
                      href={src.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-amber-800 hover:underline mt-1.5 font-medium"
                    >
                      External Source Citation
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Last Updated Timestamp */}
          <div className="pt-2 border-t border-slate-200 text-[11px] text-slate-400 flex items-center justify-between">
            <span>Date information was last updated: {formatDate(candidate.updated_at)}</span>
            <span>Recorded in database</span>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md text-xs font-semibold bg-slate-200 hover:bg-slate-300 text-slate-800 transition-colors"
          >
            Close Profile
          </button>

          {onSelectForVote && (
            <button
              onClick={() => {
                onSelectForVote(candidate);
                onClose();
              }}
              className="px-5 py-2 rounded-md text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs transition-colors cursor-pointer"
            >
              Select for Demo Ballot →
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
