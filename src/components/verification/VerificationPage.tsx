import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  FileText, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  ArrowRight, 
  Sparkles, 
  Lock, 
  Globe,
  Info
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab, VerificationStatus } from '../../types';
import { formatDate, formatDateTime, maskDocumentNumber } from '../../lib/utils';

interface VerificationPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  openAuthModal: (mode: 'login' | 'signup') => void;
}

export const VerificationPage: React.FC<VerificationPageProps> = ({ setActiveTab, openAuthModal }) => {
  const { user, verification, simulateVerification, isLoading } = useAuth();

  const [documentType, setDocumentType] = useState<'South Sudan National ID' | 'Passport' | 'Other Approved Identification'>('South Sudan National ID');
  const [documentNumber, setDocumentNumber] = useState('');
  const [nationality, setNationality] = useState('South Sudanese');
  const [dateOfBirth, setDateOfBirth] = useState(user?.date_of_birth || '1996-07-09');
  const [simulating, setSimulating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-14 h-14 mx-auto rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-4">
          <UserCheck className="w-7 h-7" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">
          Voter Identity Verification
        </h2>
        <p className="text-sm text-slate-600 mb-6 max-w-md mx-auto">
          Please create an account or sign in to verify your identity and check voter eligibility.
        </p>
        <button
          onClick={() => openAuthModal('signup')}
          className="px-6 py-3 rounded-lg font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm"
        >
          Register to Begin Verification
        </button>
      </div>
    );
  }

  const currentStatus: VerificationStatus = verification?.verification_status || 'Not Started';

  const handleSimulate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);
    setSimulating(true);

    try {
      const res = await simulateVerification({
        method: documentType,
        docNumber: documentNumber || 'SSD-8849102',
        nationality,
        dob: dateOfBirth,
      });

      if (res.success) {
        setFeedback({
          type: 'success',
          message: 'Simulation completed successfully! Your demo status is now Verified — Demo Status.',
        });
      } else {
        setFeedback({
          type: 'error',
          message: res.error || 'We could not complete demo verification. Please check your information.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: 'Something went wrong during simulated verification. Please try again.',
      });
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      
      {/* Page Heading */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-2">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
          Voter Eligibility & Accreditation
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Identity Verification
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-3xl leading-relaxed">
          “To participate in an officially authorized election system, your identity and eligibility would need to be verified using documentation and procedures approved by the relevant election authority.”
        </p>
      </div>

      {/* Current Status Banner */}
      <div className="mb-8 p-5 rounded-xl border bg-white shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
              currentStatus === 'Verified' ? 'bg-emerald-100 text-emerald-800' :
              currentStatus === 'Pending' ? 'bg-amber-100 text-amber-800' :
              currentStatus === 'Requires Review' ? 'bg-orange-100 text-orange-800' :
              'bg-slate-100 text-slate-700'
            }`}>
              {currentStatus === 'Verified' ? <CheckCircle2 className="w-5 h-5" /> :
               currentStatus === 'Pending' ? <Clock className="w-5 h-5" /> :
               <AlertTriangle className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Current Verification State:
                </span>
                <span className={`px-2.5 py-0.5 rounded text-xs font-bold ${
                  currentStatus === 'Verified' ? 'bg-emerald-100 text-emerald-900 border border-emerald-300' :
                  currentStatus === 'Pending' ? 'bg-amber-100 text-amber-900 border border-amber-300' :
                  'bg-slate-100 text-slate-800 border border-slate-300'
                }`}>
                  {currentStatus === 'Verified' ? 'Verified — Demo Status' : currentStatus}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {currentStatus === 'Verified'
                  ? 'Identity accreditation verified in demo sandbox. You are eligible to cast a simulated ballot.'
                  : 'Submit your document details below or click Simulate Verification to test the workflow.'}
              </p>
            </div>
          </div>

          {currentStatus === 'Verified' && (
            <button
              onClick={() => setActiveTab('voting')}
              className="px-4 py-2 rounded-lg font-bold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer shadow-xs"
            >
              Proceed to Demo Ballot
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>

        {verification && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <span className="text-slate-500 block">Method:</span>
              <span className="font-semibold text-slate-900">{verification.verification_method}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Masked ID:</span>
              <span className="font-mono text-slate-900 font-semibold">{verification.document_number_masked}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Provider Ref:</span>
              <span className="font-mono text-slate-900">{verification.provider_reference}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Timestamp:</span>
              <span className="text-slate-900">{formatDate(verification.verified_at || verification.created_at)}</span>
            </div>
          </div>
        )}
      </div>

      {feedback && (
        <div className={`mb-6 p-4 rounded-lg text-xs flex items-start gap-2.5 ${
          feedback.type === 'success' 
            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' 
            : 'bg-red-50 text-red-900 border border-red-200'
        }`}>
          {feedback.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" /> : <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />}
          <div>
            <p className="font-semibold">{feedback.type === 'success' ? 'Verification Updated' : 'Notice'}</p>
            <p>{feedback.message}</p>
          </div>
        </div>
      )}

      {/* Main Verification Form Card */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        
        {/* Card Header */}
        <div className="bg-slate-50 p-5 border-b border-slate-200">
          <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
            <FileText className="w-5 h-5 text-amber-600" />
            Document & Credentials Form
          </div>
          <p className="text-xs text-slate-600 mt-1">
            Fill in the document specifications below to simulate standard civic identity verification.
          </p>
        </div>

        <form onSubmit={handleSimulate} className="p-6 space-y-5">
          
          {/* Document Type Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Select Document Type <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { id: 'South Sudan National ID', label: 'South Sudan National ID', sub: 'Ministry of Interior' },
                { id: 'Passport', label: 'South Sudan Passport', sub: 'Directorate of Civil Registry' },
                { id: 'Other Approved Identification', label: 'Other Approved ID', sub: 'Consular / UN Refugee Card' }
              ].map((opt) => (
                <button
                  type="button"
                  key={opt.id}
                  onClick={() => setDocumentType(opt.id as any)}
                  className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                    documentType === opt.id
                      ? 'border-amber-500 bg-amber-50/50 ring-1 ring-amber-500 text-slate-950'
                      : 'border-slate-200 hover:border-slate-300 text-slate-700'
                  }`}
                >
                  <div className="font-semibold text-xs">{opt.label}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">{opt.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Document Number (Sample) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. SSD-09284910"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500"
              />
              <span className="text-[10px] text-slate-500 mt-1 block">
                For the prototype: Actual ID images are NOT stored. Only the masked record is preserved.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nationality
              </label>
              <input
                type="text"
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Country of Residence
              </label>
              <input
                type="text"
                disabled
                value={user.country}
                className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-200 bg-slate-50 text-slate-600 rounded-md"
              />
            </div>
          </div>

          {/* Privacy & Prototype Notice */}
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-1">
            <div className="font-semibold text-slate-900 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-amber-600" />
              Prototype Data Handling Protocol
            </div>
            <p>
              In accordance with Section 4 of the civic specifications, this demonstration system does not upload or persist physical identity document scans. It records the verification status, cryptographic provider reference, and verification timestamp.
            </p>
          </div>

          {/* Action Button: Simulate Verification */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={simulating}
              className="w-full sm:w-auto px-6 py-3 rounded-lg font-bold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-slate-950" />
              {simulating ? 'Processing Simulation...' : 'Simulate Verification'}
            </button>

            <span className="text-xs text-slate-500">
              Changes status immediately to <strong className="text-slate-900">Verified — Demo Status</strong>
            </span>
          </div>

        </form>
      </div>

      {/* Navigation Footnote */}
      <div className="mt-8 flex items-center justify-between text-xs text-slate-600">
        <button
          onClick={() => setActiveTab('dashboard')}
          className="hover:underline text-slate-900 font-medium cursor-pointer"
        >
          ← Return to Voter Dashboard
        </button>
        <button
          onClick={() => setActiveTab('election')}
          className="hover:underline text-slate-900 font-medium cursor-pointer"
        >
          View Election Timelines →
        </button>
      </div>

    </div>
  );
};
