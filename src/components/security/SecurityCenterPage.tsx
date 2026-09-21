import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Database, 
  FileText, 
  Eye, 
  ShieldAlert, 
  Cpu, 
  CheckCircle2, 
  Key, 
  AlertTriangle, 
  Terminal, 
  Copy, 
  Check 
} from 'lucide-react';
import { SUPABASE_SCHEMA_SQL } from '../../lib/schemaSql';

export const SecurityCenterPage: React.FC = () => {
  const [copiedSql, setCopiedSql] = useState(false);
  const [activeTab, setActiveTab] = useState<'architecture' | 'rls' | 'threats'>('architecture');

  const copySql = () => {
    navigator.clipboard.writeText(SUPABASE_SCHEMA_SQL);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const threatMatrix = [
    {
      threat: 'Ballot Correlation / Privacy Leak',
      risk: 'High',
      mitigation: 'Decoupled Anonymous Tokens',
      desc: 'No foreign key connects voters to ballots. The voting endpoint consumes a single-use token and invalidates it in an isolated transaction.',
    },
    {
      threat: 'Double Voting / Ballot Stuffing',
      risk: 'Critical',
      mitigation: 'One-Person / One-Vote Token Invalidation',
      desc: 'Voter registry flags has_voted = true and immediately burns the active cryptographic ballot token upon first submission.',
    },
    {
      threat: 'Unauthorized Database Modifications',
      risk: 'High',
      mitigation: 'Supabase PostgreSQL RLS',
      desc: 'Row Level Security enforces that public users cannot write to candidate directories, modify announcements, or alter audit trails.',
    },
    {
      threat: 'Administrator Tampering / Coercion',
      risk: 'High',
      mitigation: 'Append-Only Audit Logging',
      desc: 'All admin actions, status alterations, and candidate updates produce immutable audit log entries with client IPs and timestamps.',
    },
    {
      threat: 'Identity Impersonation',
      risk: 'High',
      mitigation: 'Multi-Tier Identity Verification',
      desc: 'Verification requires document cross-checking against official civil registries with masked document references.',
    },
    {
      threat: 'Electoral Disinformation',
      risk: 'Medium',
      mitigation: 'Source Citation & Authority Notice',
      desc: 'Neutral candidate profiles must link to verifiable public citations. Mandatory banners remind users of official NEC jurisdiction.',
    },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-10">
      
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          Integrity & Cryptographic Assurance
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
          Security Center & Trust Architecture
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          How SautiVote South Sudan explores institutional-grade digital election security, decoupled ballot secrecy, Row Level Security (RLS), and zero-knowledge independent receipt verification.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 space-x-6 text-sm font-semibold">
        <button
          onClick={() => setActiveTab('architecture')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'architecture'
              ? 'border-amber-500 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Ballot Secrecy Architecture
        </button>
        <button
          onClick={() => setActiveTab('rls')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'rls'
              ? 'border-amber-500 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          PostgreSQL Row Level Security (RLS)
        </button>
        <button
          onClick={() => setActiveTab('threats')}
          className={`pb-3 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'threats'
              ? 'border-amber-500 text-amber-900'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          Threat Modeling & Defenses
        </button>
      </div>

      {/* TAB 1: ARCHITECTURE */}
      {activeTab === 'architecture' && (
        <div className="space-y-8">
          
          {/* Visual Architecture Diagram */}
          <div className="bg-[#0B1B3D] text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2 font-serif-civic">
              <Lock className="w-5 h-5 text-amber-400" />
              Decoupled Two-Layer Voting Architecture
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mb-8 max-w-2xl leading-relaxed">
              To guarantee constitutional ballot secrecy, an electronic election platform must physically and logically isolate <em>who voted</em> from <em>how they voted</em>.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
              
              {/* Box 1: Identity & Eligibility */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-amber-400">LAYER 1</span>
                  <Database className="w-4 h-4 text-slate-400" />
                </div>
                <h4 className="font-bold text-white text-base">Identity & Voter Roll</h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                  <li>Full Name & Contact</li>
                  <li>South Sudan ID / Passport (Masked)</li>
                  <li>Accreditation Status: <span className="text-emerald-400">Verified</span></li>
                  <li>Flag: <code>has_voted: boolean</code></li>
                </ul>
                <div className="pt-2 text-[11px] text-amber-300/80 border-t border-slate-800">
                  Protected by strict Row Level Security. Never contains ballot data.
                </div>
              </div>

              {/* Box 2: Decoupling Cryptographic Bridge */}
              <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/40 space-y-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-amber-400">BRIDGE</span>
                    <Key className="w-4 h-4 text-amber-400" />
                  </div>
                  <h4 className="font-bold text-amber-300 text-base mt-1">Single-Use Token Generator</h4>
                  <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                    Once eligibility is confirmed, a cryptographic single-use token is minted. Identity links are permanently severed upon ballot injection.
                  </p>
                </div>
                <div className="p-2 rounded bg-slate-900/80 border border-amber-500/30 text-[10px] font-mono text-amber-300 text-center">
                  TOKEN HASH: SHA-256 (Ephemeral)
                </div>
              </div>

              {/* Box 3: Anonymous Ballot Ledger */}
              <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-700/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-emerald-400">LAYER 2</span>
                  <FileText className="w-4 h-4 text-emerald-400" />
                </div>
                <h4 className="font-bold text-white text-base">Anonymous Ballot Box</h4>
                <ul className="text-xs text-slate-300 space-y-1.5 list-disc pl-4">
                  <li>Ballot Receipt ID (<code>SV-DEMO-XXXX</code>)</li>
                  <li>Candidate Choice (Zero User Link)</li>
                  <li>Cryptographic Confirmation Hash</li>
                  <li>Timestamp recorded</li>
                </ul>
                <div className="pt-2 text-[11px] text-emerald-300/80 border-t border-slate-800">
                  Zero foreign key reference back to user tables. Mathematically untraceable.
                </div>
              </div>

            </div>
          </div>

          {/* Key Principles Checklist */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Cryptographic Hash Verification
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Every cast ballot produces a SHA-256 fingerprint generated from the ballot token, election identifier, and timestamp. The voter receives this receipt code to confirm their ballot is present in the tally without disclosing who they voted for.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-white border border-slate-200 shadow-xs space-y-2">
              <h4 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Non-Repudiation & Audit Trail
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Administrative events, candidate updates, and system configuration modifications are logged to an append-only audit register. Electoral observers can independently verify ledger continuity.
              </p>
            </div>
          </div>

        </div>
      )}

      {/* TAB 2: POSTGRESQL RLS */}
      {activeTab === 'rls' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                PostgreSQL Row Level Security (RLS) Policies
              </h3>
              <p className="text-xs text-slate-600 mt-0.5">
                Inspect the actual database migration schema implemented for Supabase / PostgreSQL.
              </p>
            </div>
            <button
              onClick={copySql}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              {copiedSql ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copiedSql ? 'Copied SQL' : 'Copy Schema SQL'}
            </button>
          </div>

          <div className="bg-slate-950 text-slate-200 p-5 rounded-xl border border-slate-800 overflow-x-auto font-mono text-xs max-h-[500px]">
            <pre className="text-emerald-400 leading-relaxed">
              {SUPABASE_SCHEMA_SQL}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 3: THREATS */}
      {activeTab === 'threats' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-900">
              Civic Threat Matrix & Protective Safeguards
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Analysis of cyber, political, and operational vectors evaluated in this prototype.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Threat Scenario</th>
                    <th className="p-3.5">Severity</th>
                    <th className="p-3.5">Architectural Mitigation</th>
                    <th className="p-3.5">Technical Implementation</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {threatMatrix.map((item, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="p-3.5 font-bold text-slate-900">{item.threat}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.risk === 'Critical' ? 'bg-red-100 text-red-900' :
                          item.risk === 'High' ? 'bg-amber-100 text-amber-900' :
                          'bg-blue-100 text-blue-900'
                        }`}>
                          {item.risk}
                        </span>
                      </td>
                      <td className="p-3.5 font-semibold text-slate-800">{item.mitigation}</td>
                      <td className="p-3.5 text-slate-600">{item.desc}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Future Official Certification Path */}
      <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
        <h3 className="font-bold text-slate-900 text-base">
          Future Official Certification & NEC Integration Path
        </h3>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          Should the National Elections Commission (NEC) of South Sudan commission an official electronic election system, this architecture is designed to transition smoothly to:
        </p>
        <ul className="text-xs sm:text-sm text-slate-700 space-y-1.5 list-disc pl-5">
          <li>Hardware Security Module (HSM) root-of-trust key management</li>
          <li>Integration with the Directorate of Civil Registry & Passports biometric database</li>
          <li>Accredited international observer nodes (African Union, UN, Carter Center)</li>
          <li>Independent end-to-end cryptographic audit audits prior to production deployment</li>
        </ul>
      </div>

    </div>
  );
};
