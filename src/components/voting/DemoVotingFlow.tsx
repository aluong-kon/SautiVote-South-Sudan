import React, { useState } from 'react';
import { 
  Vote, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldCheck, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  Download, 
  Copy, 
  Check, 
  Lock, 
  Sparkles,
  ExternalLink,
  Shield
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Candidate, Election, BallotReceipt, ActiveTab } from '../../types';
import { formatDate, formatDateTime } from '../../lib/utils';

interface DemoVotingFlowProps {
  election: Election;
  candidates: Candidate[];
  setActiveTab: (tab: ActiveTab) => void;
  openAuthModal: (mode: 'login' | 'signup') => void;
  preSelectedCandidateId?: string | null;
}

export const DemoVotingFlow: React.FC<DemoVotingFlowProps> = ({
  election,
  candidates,
  setActiveTab,
  openAuthModal,
  preSelectedCandidateId,
}) => {
  const { user, verification, submitBallotVote } = useAuth();

  // Stages: 'ballot' | 'review' | 'submitted'
  const [stage, setStage] = useState<'ballot' | 'review' | 'submitted'>('ballot');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(
    preSelectedCandidateId || ''
  );
  const [submitting, setSubmitting] = useState(false);
  const [receipt, setReceipt] = useState<BallotReceipt | null>(null);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Find candidate object
  const selectedCandidate = candidates.find(c => c.id === selectedCandidateId);

  // If user not signed in
  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-900 flex items-center justify-center mb-4">
          <Vote className="w-7 h-7" />
        </div>
        <div className="inline-block px-2.5 py-0.5 rounded text-[11px] font-bold bg-amber-500/20 text-amber-900 border border-amber-300 uppercase tracking-wider mb-2">
          Demo Mode
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Simulated Ballot Portal
        </h2>
        <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
          Please register or sign in as a voter to generate an anonymous voting token and test the simulated ballot workflow.
        </p>
        <button
          onClick={() => openAuthModal('signup')}
          className="px-6 py-3 rounded-lg font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm cursor-pointer"
        >
          Sign In or Create Demo Account
        </button>
      </div>
    );
  }

  // Handle stage 1 -> stage 2
  const handleProceedToReview = () => {
    if (!selectedCandidateId) {
      setErrorMessage('Please select one candidate to continue to the ballot review.');
      return;
    }
    setErrorMessage('');
    setStage('review');
  };

  // Handle stage 2 -> stage 3
  const handleConfirmVote = async () => {
    if (!selectedCandidate) return;
    setSubmitting(true);
    setErrorMessage('');

    try {
      const generatedReceipt = await submitBallotVote(
        selectedCandidate.id,
        selectedCandidate.full_name,
        election.name
      );
      setReceipt(generatedReceipt);
      setStage('submitted');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Something went wrong. Your demo vote was not submitted. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCopyHash = () => {
    if (!receipt) return;
    navigator.clipboard.writeText(receipt.confirmation_hash);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadReceipt = () => {
    if (!receipt) return;
    const content = `===============================================================
SAUTIVOTE SOUTH SUDAN — SIMULATED DEMO BALLOT RECEIPT
===============================================================
VOTE ID:        ${receipt.receipt_code}
CONFIRMATION:   ${receipt.confirmation_hash}
TIMESTAMP:      ${receipt.timestamp}
ELECTION:       ${receipt.election_name}
MODE:           DEMO MODE / SIMULATED VOTE (NON-LEGAL)
AUTHORITY REF:  Decoupled Cryptographic Architecture Exploration

IMPORTANT CIVIC NOTICE:
This receipt confirms only that this prototype recorded a simulated 
interaction. It is not proof of a legally valid vote. Election procedures 
are determined solely by the National Elections Commission (NEC).
===============================================================`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${receipt.receipt_code}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">

      {/* STAGE 1: DEMO PRESIDENTIAL BALLOT */}
      {stage === 'ballot' && (
        <div className="space-y-6">
          
          {/* Header Title */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                Demo
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Stage 1 of 3: Selection
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Demo Presidential Ballot
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              {election.name} • Scheduled: 22 December 2026
            </p>
          </div>

          {/* Section 9 Required Banner */}
          <div className="p-4 rounded-xl bg-amber-500 text-slate-950 font-bold border border-amber-600 shadow-xs flex items-center gap-3">
            <AlertTriangle className="w-6 h-6 shrink-0" />
            <div className="text-sm tracking-wide">
              DEMO MODE — THIS IS NOT A LEGALLY VALID VOTE
            </div>
          </div>

          {/* Instruction */}
          <div className="p-4 rounded-lg bg-white border border-slate-200 text-sm text-slate-700">
            <strong>Instruction:</strong> “Select one candidate to simulate the voting experience.”
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
              {errorMessage}
            </div>
          )}

          {/* Radio Candidate Cards Grid */}
          <div className="space-y-3">
            {candidates.map((cand) => {
              const isSelected = selectedCandidateId === cand.id;
              return (
                <label
                  key={cand.id}
                  className={`block p-4 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500 shadow-xs'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    {/* Radio Button */}
                    <input
                      type="radio"
                      name="presidential_candidate"
                      value={cand.id}
                      checked={isSelected}
                      onChange={() => setSelectedCandidateId(cand.id)}
                      className="w-5 h-5 text-amber-600 border-slate-300 focus:ring-amber-500"
                    />

                    {/* Candidate Photograph */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-lg bg-slate-200 overflow-hidden border border-slate-300 shrink-0">
                      <img
                        src={cand.photo_url}
                        alt={cand.full_name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name & Party */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-base truncate">
                        {cand.full_name}
                      </h3>
                      <p className="text-xs font-semibold text-slate-700 truncate">
                        {cand.party_name}
                      </p>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Status: {cand.candidacy_status}
                      </p>
                    </div>
                  </div>
                </label>
              );
            })}
          </div>

          {/* Button: Continue to Review */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-200">
            <button
              onClick={() => setActiveTab('dashboard')}
              className="text-xs text-slate-600 hover:text-slate-900 font-medium"
            >
              ← Cancel and Return to Dashboard
            </button>

            <button
              onClick={handleProceedToReview}
              className="px-6 py-3 rounded-lg font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              Continue to Review
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      )}

      {/* STAGE 2: BALLOT REVIEW */}
      {stage === 'review' && selectedCandidate && (
        <div className="space-y-6">
          
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500 text-slate-950 uppercase tracking-wider">
                Demo
              </span>
              <span className="text-xs font-semibold text-slate-500">
                Stage 2 of 3: Verification & Ballot Secrecy
              </span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Review Your Selection
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Please double check your candidate choice prior to issuing cryptographic ballot submission.
            </p>
          </div>

          {/* Review Card */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 block">
              Selected Candidate:
            </span>

            <div className="flex items-center gap-4 p-4 rounded-lg bg-slate-50 border border-slate-200">
              <div className="w-16 h-16 rounded-lg bg-slate-200 overflow-hidden shrink-0 border border-slate-300">
                <img
                  src={selectedCandidate.photo_url}
                  alt={selectedCandidate.full_name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-950">
                  {selectedCandidate.full_name}
                </h3>
                <p className="text-sm font-semibold text-slate-700">
                  {selectedCandidate.party_name}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  South Sudan General Election 2026 • Presidential Contest
                </p>
              </div>
            </div>
          </div>

          {/* Section 10 Mandatory Disclosure */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-300 text-xs text-slate-800 space-y-1">
            <div className="font-bold text-slate-950 flex items-center gap-1.5 uppercase tracking-wide text-[11px]">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Pre-Confirmation Legal Disclosure
            </div>
            <p className="leading-relaxed">
              “This prototype simulates the voting workflow. Your selection will not be transmitted to an election authority and does not constitute a legal vote.”
            </p>
          </div>

          {/* Privacy Architecture Notice */}
          <div className="p-4 rounded-xl bg-slate-900 text-slate-300 text-xs space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" />
              Decoupled Anonymous Token Mechanism
            </div>
            <p className="text-slate-400 leading-relaxed">
              When you confirm, your verified identity will be decoupled. The ballot record stores only an anonymized ballot ID, candidate selection, and cryptographic hash — with zero administrative database linkage back to your name or voter record.
            </p>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-50 text-red-700 text-xs border border-red-200">
              {errorMessage}
            </div>
          )}

          {/* Action Buttons: Change Selection / Confirm Demo Vote */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-slate-200">
            <button
              onClick={() => setStage('ballot')}
              disabled={submitting}
              className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Change Selection
            </button>

            <button
              onClick={handleConfirmVote}
              disabled={submitting}
              className="w-full sm:w-auto px-7 py-3 rounded-lg text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <ShieldCheck className="w-5 h-5 text-slate-950" />
              {submitting ? 'Generating Cryptographic Receipt...' : 'Confirm Demo Vote'}
            </button>
          </div>

        </div>
      )}

      {/* STAGE 3: DEMO VOTE SUBMISSION & RECEIPT */}
      {stage === 'submitted' && receipt && (
        <div className="space-y-6">
          
          {/* Success Banner */}
          <div className="text-center py-4 space-y-2">
            <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shadow-xs">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
              Demo Vote Submitted
            </h1>
            <p className="text-base text-slate-600 font-medium">
              “You have completed the simulated voting process.”
            </p>
          </div>

          {/* The Demo Receipt Card (Section 11) */}
          <div className="bg-white rounded-xl border-2 border-slate-300 shadow-md overflow-hidden">
            
            {/* Receipt Top Band */}
            <div className="bg-[#0B1B3D] text-white p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold text-lg">★</span>
                <div>
                  <h3 className="font-serif-civic font-bold text-lg text-white">
                    Demo Receipt
                  </h3>
                  <p className="text-[11px] text-amber-300">
                    SautiVote South Sudan Cryptographic Verifiable Ledger
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold text-xs uppercase tracking-wider">
                Simulated
              </span>
            </div>

            {/* Receipt Body */}
            <div className="p-6 space-y-5">
              
              {/* Vote ID */}
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
                  Vote ID:
                </span>
                <div className="font-mono-code font-bold text-xl sm:text-2xl text-slate-950 bg-slate-50 p-3 rounded-lg border border-slate-200">
                  {receipt.receipt_code}
                </div>
              </div>

              {/* Confirmation Hash */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Confirmation Hash (SHA-256):
                  </span>
                  <button
                    onClick={handleCopyHash}
                    className="text-xs text-amber-800 hover:text-amber-950 flex items-center gap-1 font-semibold cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? 'Copied' : 'Copy Hash'}
                  </button>
                </div>
                <div className="font-mono-code text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 break-all">
                  {receipt.confirmation_hash}
                </div>
              </div>

              {/* Timestamp & Election ID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Timestamp:</span>
                  <span className="font-semibold text-slate-900">{formatDateTime(receipt.timestamp)}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                  <span className="text-slate-500 block mb-0.5">Election Identifier:</span>
                  <span className="font-semibold text-slate-900">{election.name}</span>
                </div>
              </div>

              {/* Mandatory Section 11 Notice */}
              <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-xs text-slate-800 space-y-1">
                <span className="font-bold text-slate-950 block uppercase text-[11px]">
                  Important Civic Notice:
                </span>
                <p className="leading-relaxed">
                  “This receipt confirms only that this prototype recorded a simulated interaction. It is not proof of a legally valid vote.”
                </p>
              </div>

            </div>

            {/* Buttons: Download Demo Receipt / Return to Dashboard */}
            <div className="p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <button
                onClick={handleDownloadReceipt}
                className="w-full sm:w-auto px-5 py-2.5 rounded-lg text-sm font-semibold bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                <Download className="w-4 h-4 text-slate-600" />
                Download Demo Receipt
              </button>

              <button
                onClick={() => setActiveTab('dashboard')}
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
              >
                Return to Dashboard
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

          <div className="text-center pt-2">
            <button
              onClick={() => setActiveTab('receipt-checker')}
              className="text-xs font-semibold text-amber-800 hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              Verify this Receipt in the Public Verifier Tool →
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
