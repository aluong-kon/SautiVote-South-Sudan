import React, { useState } from 'react';
import { 
  Users, 
  ExternalLink, 
  FileText, 
  AlertTriangle, 
  Search, 
  Info, 
  Vote, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Candidate, ActiveTab } from '../../types';
import { CandidateProfileModal } from './CandidateProfileModal';
import { formatDate } from '../../lib/utils';

interface CandidatesPageProps {
  candidates: Candidate[];
  setActiveTab: (tab: ActiveTab) => void;
  onSelectCandidateForBallot?: (candidateId: string) => void;
}

export const CandidatesPage: React.FC<CandidatesPageProps> = ({ 
  candidates, 
  setActiveTab,
  onSelectCandidateForBallot 
}) => {
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterParty, setFilterParty] = useState('All');

  const parties = ['All', ...Array.from(new Set(candidates.map(c => c.party_name)))];

  const filteredCandidates = candidates.filter((c) => {
    const matchesSearch = c.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.party_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.biography.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesParty = filterParty === 'All' || c.party_name === filterParty;
    return matchesSearch && matchesParty;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
          <Users className="w-3.5 h-3.5 text-amber-600" />
          Neutral Public Contender Repository
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Presidential Candidates / Publicly Announced Contenders
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          A neutral civic directory providing factual biographies, public statements, and reference citations for figures who have announced presidential candidacies.
        </p>
      </div>

      {/* Mandatory Section 7 Civic Disclaimer */}
      <div className="p-5 rounded-xl bg-amber-50 border border-amber-300 text-slate-900 shadow-xs">
        <div className="flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs sm:text-sm">
            <h3 className="font-bold text-slate-950 uppercase tracking-wide text-xs">
              Important Electoral Disclaimer
            </h3>
            <p className="text-slate-800 leading-relaxed font-medium">
              “The names displayed here represent publicly announced presidential contenders and/or political figures reported as intending to contest. This prototype does not represent a final certified ballot. Candidate certification is determined by the competent election authority.”
            </p>
          </div>
        </div>
      </div>

      {/* Neutral Search and Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Search contender name or party..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500 font-medium">Affiliation:</span>
          <select
            value={filterParty}
            onChange={(e) => setFilterParty(e.target.value)}
            className="px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md bg-white focus:ring-2 focus:ring-amber-500"
          >
            {parties.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Candidate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredCandidates.map((candidate) => (
          <div
            key={candidate.id}
            className="bg-white rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all overflow-hidden flex flex-col justify-between"
          >
            <div>
              {/* Photo & Status Banner */}
              <div className="h-48 bg-slate-100 relative overflow-hidden">
                <img
                  src={candidate.photo_url}
                  alt={candidate.full_name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[20%] hover:grayscale-0 transition-all duration-300"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 rounded text-[11px] font-semibold bg-slate-900/85 text-white backdrop-blur-xs border border-white/10">
                    {candidate.candidacy_status}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-3">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">
                    {candidate.full_name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-700 mt-0.5">
                    {candidate.party_name}
                  </p>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {candidate.biography}
                </p>

                {/* Sources Section on Card */}
                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    Public Reference Sources:
                  </span>
                  <div className="space-y-1">
                    {candidate.sources.slice(0, 2).map((s) => (
                      <div key={s.id} className="text-[11px] text-slate-600 truncate flex items-center gap-1">
                        <span className="text-slate-400">•</span>
                        <span className="truncate">{s.source_name}</span>
                        {s.source_url && (
                          <a
                            href={s.source_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-800 hover:text-amber-950 shrink-0"
                            title="External Source Citation"
                          >
                            <ExternalLink className="w-2.5 h-2.5 inline ml-0.5" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Card Actions */}
            <div className="p-5 pt-0 flex items-center justify-between gap-2">
              <button
                onClick={() => setSelectedCandidate(candidate)}
                className="w-full py-2.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors text-center cursor-pointer"
              >
                View Profile & Platforms
              </button>

              <button
                onClick={() => {
                  if (onSelectCandidateForBallot) {
                    onSelectCandidateForBallot(candidate.id);
                  }
                  setActiveTab('voting');
                }}
                title="Select on simulated ballot"
                className="py-2.5 px-3 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center gap-1 cursor-pointer shadow-2xs shrink-0"
              >
                <Vote className="w-3.5 h-3.5" />
                Simulate
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredCandidates.length === 0 && (
        <div className="p-12 text-center bg-white rounded-xl border border-slate-200">
          <p className="text-sm text-slate-500">
            No candidates matched your search criteria.
          </p>
        </div>
      )}

      {/* Candidate Profile Modal */}
      {selectedCandidate && (
        <CandidateProfileModal
          candidate={selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
          onSelectForVote={(cand) => {
            if (onSelectCandidateForBallot) {
              onSelectCandidateForBallot(cand.id);
            }
            setActiveTab('voting');
          }}
        />
      )}

    </div>
  );
};
