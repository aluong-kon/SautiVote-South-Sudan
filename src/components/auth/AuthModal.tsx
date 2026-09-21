import React, { useState } from 'react';
import { X, Lock, Mail, Phone, Calendar, Globe, User, Shield, AlertCircle, CheckCircle2, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DIASPORA_COUNTRIES } from '../../lib/seedData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
  onSuccessRedirect?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose, 
  initialMode = 'signup',
  onSuccessRedirect
}) => {
  const { signUp, signIn, loginAsDemoVoter, loginAsAdmin } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('South Sudan (Domestic)');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [confirmedAccurate, setConfirmedAccurate] = useState(false);
  
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [forgotPasswordSent, setForgotPasswordSent] = useState(false);

  if (!isOpen) return null;

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName || !email || !password || !country) {
      setErrorMessage('Please fill in all required registration fields.');
      return;
    }

    if (!confirmedAccurate) {
      setErrorMessage('Please confirm that the information you provide is accurate.');
      return;
    }

    setIsSubmitting(true);
    const result = await signUp({
      fullName,
      email,
      phone: phone || '+211 000 000 000',
      password,
      country,
      dateOfBirth: dateOfBirth || '1996-01-01',
    });

    setIsSubmitting(false);

    if (result.success) {
      onClose();
      if (onSuccessRedirect) onSuccessRedirect();
    } else {
      setErrorMessage(result.error || 'Failed to create account. Please try again.');
    }
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!email) {
      setErrorMessage('Please enter your registered email address.');
      return;
    }

    setIsSubmitting(true);
    const result = await signIn(email, password);
    setIsSubmitting(false);

    if (result.success) {
      onClose();
      if (onSuccessRedirect) onSuccessRedirect();
    } else {
      setErrorMessage(result.error || 'Email or password is incorrect.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative w-full max-w-md bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden my-8"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="bg-[#0B1B3D] text-white p-5 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                ★
              </div>
              <div>
                <h3 className="font-serif-civic font-bold text-lg text-white">
                  {mode === 'signup' ? 'Civic Registration' : 'Voter Portal Access'}
                </h3>
                <p className="text-xs text-amber-300/90 font-medium">
                  SautiVote South Sudan Prototype
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Mode Tabs */}
          <div className="grid grid-cols-2 gap-1 mt-4 p-1 bg-slate-900/60 rounded-lg text-xs font-semibold">
            <button
              onClick={() => { setMode('signup'); setErrorMessage(''); }}
              className={`py-1.5 rounded-md transition-all ${
                mode === 'signup' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Sign Up
            </button>
            <button
              onClick={() => { setMode('login'); setErrorMessage(''); }}
              className={`py-1.5 rounded-md transition-all ${
                mode === 'login' 
                  ? 'bg-amber-500 text-slate-950 shadow-xs' 
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Login
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {/* Quick Demo Fillers for Instant Review */}
          <div className="mb-5 p-3 rounded-lg bg-amber-50 border border-amber-200">
            <div className="flex items-center justify-between text-xs text-amber-900 font-semibold mb-2">
              <span className="flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                Quick Reviewer Access:
              </span>
              <span className="text-[10px] uppercase tracking-wider text-amber-700 bg-amber-200/60 px-1.5 py-0.5 rounded">
                1-Click Demo
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={async () => {
                  await loginAsDemoVoter();
                  onClose();
                  if (onSuccessRedirect) onSuccessRedirect();
                }}
                className="p-2 bg-white rounded border border-amber-300 hover:border-amber-500 text-slate-800 text-left font-medium shadow-2xs hover:bg-amber-50/50 transition-colors"
              >
                <div className="font-semibold text-slate-900">Diaspora Voter</div>
                <div className="text-[10px] text-slate-500">Achai Deng (Kenya)</div>
              </button>
              <button
                type="button"
                onClick={async () => {
                  await loginAsAdmin('election_admin');
                  onClose();
                  if (onSuccessRedirect) onSuccessRedirect();
                }}
                className="p-2 bg-white rounded border border-amber-300 hover:border-amber-500 text-slate-800 text-left font-medium shadow-2xs hover:bg-amber-50/50 transition-colors"
              >
                <div className="font-semibold text-slate-900">Election Admin</div>
                <div className="text-[10px] text-slate-500">Hon. Deng Maker</div>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {forgotPasswordSent && (
            <div className="mb-4 p-3 rounded-md bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <span>Prototype password recovery reset link generated for this session.</span>
            </div>
          )}

          {mode === 'signup' ? (
            /* Sign Up Form */
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mary Nyandeng Gatwech"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      placeholder="+211 / +254..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="date"
                      value={dateOfBirth}
                      onChange={(e) => setDateOfBirth(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Country of Residence <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-white"
                  >
                    {DIASPORA_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.name}>
                        {c.name} {c.code !== 'SS' ? `(${c.region})` : ''}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
                <p className="text-[10px] text-slate-500 mt-1">
                  Protected with Supabase Auth cryptographic hashing. Never stored directly.
                </p>
              </div>

              {/* Checkbox: I confirm that the information I provide is accurate. */}
              <div className="pt-1">
                <label className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={confirmedAccurate}
                    onChange={(e) => setConfirmedAccurate(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-amber-600 focus:ring-amber-500"
                  />
                  <span>
                    “I confirm that the information I provide is accurate.”
                  </span>
                </label>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-md font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Creating Account...' : 'Create Account'}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2 rounded-md font-medium text-xs bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                >
                  Continue with email
                </button>
              </div>
            </form>
          ) : (
            /* Login Form */
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold text-slate-700">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setForgotPasswordSent(true)}
                    className="text-[11px] text-amber-700 hover:underline cursor-pointer"
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-md focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-2.5 rounded-md font-semibold text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-sm transition-all disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Authenticating...' : 'Login'}
                </button>
              </div>
            </form>
          )}

          <div className="mt-4 text-center text-xs text-slate-500">
            {mode === 'signup' ? (
              <span>
                Already registered?{' '}
                <button
                  onClick={() => { setMode('login'); setErrorMessage(''); }}
                  className="font-semibold text-amber-700 hover:underline"
                >
                  Log in here
                </button>
              </span>
            ) : (
              <span>
                Don't have an account yet?{' '}
                <button
                  onClick={() => { setMode('signup'); setErrorMessage(''); }}
                  className="font-semibold text-amber-700 hover:underline"
                >
                  Create voter account
                </button>
              </span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
