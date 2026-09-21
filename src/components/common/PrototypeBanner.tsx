import React, { useState } from 'react';
import { AlertTriangle, ShieldCheck, ChevronDown, ChevronUp, ExternalLink, Info } from 'lucide-react';

export const PrototypeBanner: React.FC = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <aside aria-label="Prototype Banner" className="bg-amber-500/15 border-b border-amber-500/30 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded font-semibold text-xs bg-amber-600 text-white tracking-wide uppercase shadow-xs">
              <AlertTriangle className="w-3.5 h-3.5" />
              Prototype / Demo
            </span>
            <p className="font-medium text-slate-800">
              This platform is a technology demonstration. <strong className="font-semibold text-slate-900">It does not currently cast a legally valid vote.</strong>
            </p>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-amber-900 hover:text-amber-950 underline underline-offset-2 transition-colors cursor-pointer"
            >
              <Info className="w-3.5 h-3.5" />
              Civic Scope & Architecture
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-2.5 pt-2.5 border-t border-amber-500/20 text-xs text-slate-700 leading-relaxed grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-white/80 p-2.5 rounded-md border border-amber-200">
              <span className="font-semibold text-slate-900 block mb-1">Civil & Legal Mandate</span>
              Official election dates, voter rolls, candidate certification, and polling procedures are governed strictly by the National Elections Commission (NEC) under South Sudanese law.
            </div>
            <div className="bg-white/80 p-2.5 rounded-md border border-amber-200">
              <span className="font-semibold text-slate-900 block mb-1">Demonstration Scope</span>
              All voting interactions, receipt generation, and candidate rosters represent non-partisan, simulated technological explorations for digital civic participation and diaspora inclusion.
            </div>
            <div className="bg-white/80 p-2.5 rounded-md border border-amber-200">
              <span className="font-semibold text-slate-900 block mb-1">Ballot Secrecy Standard</span>
              Engineered with decoupling between voter authentication and ballot storage so administrators cannot map voter identities to choices.
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
