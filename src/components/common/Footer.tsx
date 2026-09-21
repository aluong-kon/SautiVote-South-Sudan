import React from 'react';
import { Shield, Lock, FileCheck, ExternalLink, Globe, AlertCircle } from 'lucide-react';
import { ActiveTab } from '../../types';

interface FooterProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#0B1B3D] text-slate-300 border-t border-slate-800 pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Main Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand & Purpose */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-xs">
                <span>★</span>
              </div>
              <span className="font-serif-civic font-bold text-lg text-white">SautiVote</span>
            </div>
            <p className="text-sm text-amber-300/90 font-medium italic">
              “Your voice. Your vote. Wherever you are.”
            </p>
            <p className="text-xs text-slate-400 leading-relaxed">
              A prototype platform exploring how South Sudanese citizens and diaspora voters could securely access election information, verify eligibility, and participate digitally.
            </p>
            <div className="pt-1 flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>Civic Demonstration Environment</span>
            </div>
          </div>

          {/* Civic Exploration */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Civic Exploration
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => setActiveTab('election')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  South Sudan General Election 2026
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('candidates')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Neutral Candidate Directory
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('diaspora')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  Voting From Anywhere (Diaspora)
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('how-it-works')}
                  className="hover:text-amber-300 transition-colors text-left"
                >
                  7-Step Participation Journey
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('receipt-checker')}
                  className="hover:text-amber-300 transition-colors text-left text-amber-300/90 font-medium"
                >
                  Verify Demo Receipt Code
                </button>
              </li>
            </ul>
          </div>

          {/* Security & Standards */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Integrity & Trust
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button 
                  onClick={() => setActiveTab('security')}
                  className="hover:text-amber-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5 text-amber-400" />
                  Ballot Secrecy Architecture
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('security')}
                  className="hover:text-amber-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <Shield className="w-3.5 h-3.5 text-amber-400" />
                  Row Level Security & PostgreSQL
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setActiveTab('security')}
                  className="hover:text-amber-300 transition-colors text-left flex items-center gap-1.5"
                >
                  <FileCheck className="w-3.5 h-3.5 text-amber-400" />
                  Cryptographic Audit Trail
                </button>
              </li>
              <li>
                <span className="text-slate-400 block pt-1">
                  Zero Partisan Endorsements
                </span>
              </li>
            </ul>
          </div>

          {/* Official Authority Notice */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              Electoral Authority Notice
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed mb-3">
              Official South Sudan election information is administered strictly by the National Elections Commission (NEC).
            </p>
            <a 
              href="https://nec.gov.ss" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-amber-300 hover:text-amber-200 font-medium underline underline-offset-2"
            >
              National Elections Commission (NEC)
              <ExternalLink className="w-3 h-3" />
            </a>
            <p className="text-[11px] text-slate-400 mt-2 italic">
              When production systems are officially authorized, integration with NEC registries will be required.
            </p>
          </div>
        </div>

        {/* Section 25 Mandatory Civic / Legal Disclaimer */}
        <div className="mt-8 p-4 rounded-lg bg-slate-900/90 border border-amber-500/30">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300 leading-relaxed space-y-1">
              <p className="font-semibold text-white tracking-wide uppercase text-[11px]">
                Important Legal & Civic Disclaimer
              </p>
              <p className="text-slate-300">
                “SautiVote South Sudan is an independent technology prototype for exploring digital election participation. It is not an official election platform and does not currently conduct legally valid elections or cast legally recognized votes. Election procedures, voter registration, candidate certification and voting methods are determined by the competent South Sudanese election authorities.”
              </p>
            </div>
          </div>
        </div>

        {/* Copyright & Independence Note */}
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <p>© {new Date().getFullYear()} SautiVote South Sudan Prototype. Independent Civic Technology Research.</p>
          <p className="text-center sm:text-right">
            Non-partisan exploration • Designed for open civic transparency
          </p>
        </div>

      </div>
    </footer>
  );
};
