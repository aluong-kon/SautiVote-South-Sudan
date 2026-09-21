import React from 'react';
import { 
  CheckCircle2, 
  Vote, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  FileText, 
  Lock, 
  Globe, 
  Cpu, 
  ExternalLink 
} from 'lucide-react';
import { ActiveTab } from '../../types';

interface RoadmapPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  openAuthModal: (mode: 'login' | 'signup') => void;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({ setActiveTab, openAuthModal }) => {
  const steps = [
    {
      step: '1',
      title: 'Create an Account',
      tagline: 'Voter profile creation',
      description: 'The citizen registers their name, contact details, date of birth, and declared country of residence. In an official system, credentials are tied to secure biometric two-factor authentication.',
    },
    {
      step: '2',
      title: 'Verify Identity',
      tagline: 'Accreditation against civil registry',
      description: 'Documentation (National ID, Passport, or consular credential) is matched against the Directorate of Civil Registry & Passports database. For this demo, simulated document verification is executed locally.',
    },
    {
      step: '3',
      title: 'Check Eligibility',
      tagline: 'Constitutional qualification',
      description: 'System validates that the citizen meets statutory thresholds: at least 18 years old, verified South Sudanese citizenship, and mapped to either a domestic constituency or out-of-country voting (OCV) hub.',
    },
    {
      step: '4',
      title: 'Review Election Information',
      tagline: 'Neutral civic education',
      description: 'Access official NEC schedules, polling directives, voting hours, legal gazettes, and constitutional roadmaps without political filter or party bias.',
    },
    {
      step: '5',
      title: 'Review Candidates Neutrally',
      tagline: 'Factual profiles & references',
      description: 'Explore standardized dossiers for publicly announced presidential contenders, complete with verifiable external news citations, policy platforms, and party affiliations.',
    },
    {
      step: '6',
      title: 'Cast a Simulated Ballot',
      tagline: 'Decoupled cryptographic issuance',
      description: 'The voter receives a single-use anonymous ballot token. The ballot is cast without recording identity linkage, permanently safeguarding constitutional ballot secrecy.',
    },
    {
      step: '7',
      title: 'Receive a Demo Receipt',
      tagline: 'Independent verification code',
      description: 'The user receives an anonymized verification code (SV-DEMO-XXXXXXXX) with a SHA-256 confirmation hash, allowing independent auditing of ballot inclusion without compromising secrecy.',
    },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
          <Cpu className="w-3.5 h-3.5 text-amber-600" />
          Civic Technology Architecture
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          How It Works & Technical Roadmap
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-2xl leading-relaxed">
          Detailed overview of the 7-step civic workflow and the architectural blueprint designed for potential integration with officially authorized South Sudanese election authorities.
        </p>
      </div>

      {/* 7-Step Interactive Flow */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          The 7-Step Civic Participation Workflow
        </h2>
        <div className="space-y-3">
          {steps.map((item) => (
            <div 
              key={item.step}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center gap-4 hover:border-amber-300 transition-colors"
            >
              <div className="w-10 h-10 rounded-lg bg-[#0B1B3D] text-amber-400 font-bold flex items-center justify-center shrink-0">
                {item.step}
              </div>
              <div className="flex-1 space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-base">{item.title}</h3>
                  <span className="text-[11px] font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {item.tagline}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison: Prototype Sandbox vs. Production Certification */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Prototype Sandbox vs. Certified National Deployment
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Understanding the distinction between this technology exploration and an officially accredited election infrastructure.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3.5">Component</th>
                <th className="p-3.5">SautiVote Prototype (Current)</th>
                <th className="p-3.5">Production NEC Deployment (Future)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Legal Validity</td>
                <td className="p-3.5 text-amber-900 bg-amber-50/50 font-semibold">Simulated demonstration only</td>
                <td className="p-3.5 text-slate-800">Legally binding votes certified by NEC</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Identity Verification</td>
                <td className="p-3.5 text-slate-600">Simulated check with masked numbers</td>
                <td className="p-3.5 text-slate-800">Biometric match against National Civil Registry</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Ballot Secrecy</td>
                <td className="p-3.5 text-slate-600">Decoupled tables & anonymous tokens</td>
                <td className="p-3.5 text-slate-800">Decoupled HSM hardware crypto tokens + Zero-Knowledge Proofs</td>
              </tr>
              <tr>
                <td className="p-3.5 font-bold text-slate-900">Observer Auditing</td>
                <td className="p-3.5 text-slate-600">Console audit log viewable in Admin portal</td>
                <td className="p-3.5 text-slate-800">Observer nodes (AU, UN, domestic civil society)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Final Action */}
      <div className="p-6 rounded-2xl bg-[#0B1B3D] text-white flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold">Ready to experience the prototype?</h3>
          <p className="text-xs text-slate-300 mt-0.5">
            Test the simulated voting journey or examine the public receipt verifier.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setActiveTab('voting')}
            className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer shadow-xs"
          >
            Launch Demo Ballot
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className="px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            Security Center
          </button>
        </div>
      </div>

    </div>
  );
};
