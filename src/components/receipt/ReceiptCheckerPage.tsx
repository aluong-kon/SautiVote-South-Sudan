import React, { useState } from 'react';
import { 
  FileCheck, 
  Search, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Copy, 
  Check, 
  Lock, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BallotReceipt, ActiveTab } from '../../types';
import { formatDateTime } from '../../lib/utils';
import { CivicDataService } from '../../lib/supabase';

interface ReceiptCheckerPageProps {
  setActiveTab: (tab: ActiveTab) => void;
}

export const ReceiptCheckerPage: React.FC<ReceiptCheckerPageProps> = ({ setActiveTab }) => {
  const { lastReceipt } = useAuth();
  const [searchCode, setSearchCode] = useState(lastReceipt?.receipt_code || '');
  const [isSearching, setIsSearching] = useState(false);
  const [foundReceipt, setFoundReceipt] = useState<BallotReceipt | null>(lastReceipt);
  const [notFound, setNotFound] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchCode.trim()) return;

    setIsSearching(true);
    setNotFound(false);

    try {
      const res = await CivicDataService.getReceiptByCode(searchCode.trim());
      if (res) {
        setFoundReceipt(res);
        setNotFound(false);
      } else {
        setFoundReceipt(null);
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      
      <div>
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
          <FileCheck className="w-3.5 h-3.5 text-amber-600" />
          Independent Civic Verification
        </div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
          Verify Demo Receipt Code
        </h1>
        <p className="mt-2 text-sm text-slate-600 max-w-2xl leading-relaxed">
          Verify that an anonymized demo vote was cryptographically registered in the prototype ledger without revealing or compromising voter ballot secrecy.
        </p>
      </div>

      {/* Lookup Form */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs">
        <form onSubmit={handleSearch} className="space-y-3">
          <label className="block text-xs font-semibold text-slate-700">
            Enter Demo Receipt Code (Format: SV-DEMO-XXXXXXXX)
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                placeholder="e.g. SV-DEMO-8A7B6C5D"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                className="w-full pl-10 pr-4 py-2.5 text-sm font-mono border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 uppercase"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-2.5 rounded-lg text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors shrink-0 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSearching ? 'Verifying...' : 'Verify Receipt'}
            </button>
          </div>
        </form>

        {lastReceipt && (
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 flex items-center justify-between">
            <span>Your current session receipt:</span>
            <button
              type="button"
              onClick={() => {
                setSearchCode(lastReceipt.receipt_code);
                setFoundReceipt(lastReceipt);
                setNotFound(false);
              }}
              className="font-mono font-bold text-amber-800 hover:underline"
            >
              {lastReceipt.receipt_code}
            </button>
          </div>
        )}
      </div>

      {notFound && (
        <div className="p-5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm mb-1">Receipt Not Found</span>
            <p>
              The receipt code “{searchCode}” was not found in the current prototype records. Please confirm the code or submit a simulated vote first.
            </p>
          </div>
        </div>
      )}

      {/* Found Receipt Presentation */}
      {foundReceipt && (
        <div className="bg-white rounded-xl border border-slate-300 shadow-md overflow-hidden space-y-0">
          
          <div className="bg-[#0B1B3D] text-white p-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="font-serif-civic font-bold text-lg text-white">
                  Receipt Verified
                </h3>
                <p className="text-[11px] text-emerald-300">
                  Cryptographically Recorded in Simulated Ledger
                </p>
              </div>
            </div>
            <span className="px-2.5 py-1 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-semibold">
              Valid Demo Entry
            </span>
          </div>

          <div className="p-6 space-y-5 text-slate-800">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                  Receipt Identifier:
                </span>
                <span className="font-mono text-base font-bold text-slate-950">
                  {foundReceipt.receipt_code}
                </span>
              </div>

              <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200">
                <span className="text-slate-500 uppercase tracking-wider text-[10px] block mb-1">
                  Timestamp Logged:
                </span>
                <span className="font-semibold text-slate-900 text-sm">
                  {formatDateTime(foundReceipt.timestamp)}
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="text-slate-500 uppercase tracking-wider text-[10px] font-semibold">
                  Cryptographic Hash (SHA-256):
                </span>
                <button
                  onClick={() => handleCopy(foundReceipt.confirmation_hash)}
                  className="text-amber-800 hover:underline flex items-center gap-1 font-semibold"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="font-mono text-xs text-slate-800 bg-slate-50 p-3 rounded-lg border border-slate-200 break-all">
                {foundReceipt.confirmation_hash}
              </div>
            </div>

            <div className="p-4 rounded-lg bg-slate-50 border border-slate-200 text-xs space-y-1">
              <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                Ballot Privacy Guarantee
              </div>
              <p className="text-slate-600 leading-relaxed">
                Notice that this receipt does <strong>not</strong> display the candidate or party you selected. In a genuine secret-ballot election system, public receipts confirm inclusion in the count without allowing vote-buying or coercion.
              </p>
            </div>

            <div className="p-3.5 rounded-lg bg-amber-50 border border-amber-200 text-[11px] text-amber-900">
              <strong>Civic Disclaimer:</strong> “This receipt confirms only that this prototype recorded a simulated interaction. It is not proof of a legally valid vote.”
            </div>

          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
            <button
              onClick={() => setActiveTab('voting')}
              className="text-amber-800 hover:underline font-semibold"
            >
              ← Cast Another Simulated Ballot
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="px-4 py-2 rounded-md bg-slate-900 hover:bg-slate-800 text-white font-semibold transition-colors"
            >
              Return to Dashboard
            </button>
          </div>

        </div>
      )}

    </div>
  );
};
