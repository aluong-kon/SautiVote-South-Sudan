import React from 'react';
import { 
  ShieldCheck, 
  Vote, 
  Users, 
  FileText, 
  Lock, 
  Globe, 
  CheckCircle2, 
  ArrowRight, 
  UserCheck, 
  Search, 
  ShieldAlert, 
  Cpu, 
  ChevronRight,
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { ActiveTab, Candidate, OfficialAnnouncement } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../lib/utils';

interface LandingPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  openAuthModal: (mode: 'login' | 'signup') => void;
  candidates: Candidate[];
  announcements: OfficialAnnouncement[];
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  setActiveTab, 
  openAuthModal, 
  candidates, 
  announcements 
}) => {
  const { user, loginAsDemoVoter } = useAuth();

  const steps = [
    { number: '1', title: 'Create an account', desc: 'Register with your name, contact information, date of birth, and country of residence.' },
    { number: '2', title: 'Verify identity', desc: 'Demonstrate identity verification using South Sudan National ID, Passport, or consular documents.' },
    { number: '3', title: 'Check eligibility', desc: 'Confirm registration criteria based on constitutional age, citizenship, and electoral districting.' },
    { number: '4', title: 'Review election info', desc: 'Read official roadmaps, dates, legal mandates, and civic announcements from the NEC.' },
    { number: '5', title: 'Review candidates', desc: 'Browse neutral, factual profiles of publicly announced presidential contenders without bias.' },
    { number: '6', title: 'Cast a simulated ballot', desc: 'Experience the one-person/one-vote flow with a cryptographically decoupled voting token.' },
    { number: '7', title: 'Receive a demo receipt', desc: 'Obtain an anonymized cryptographic receipt code (SV-DEMO-XXXXXXXX) to verify inclusion.' },
  ];

  const securityPrinciples = [
    { title: 'Identity Verification', desc: 'Verification of authorized citizens prior to issuing cryptographic voting credentials.', icon: UserCheck },
    { title: 'Eligibility Checks', desc: 'Constitutional checks ensuring adherence to age, residency, and qualification rules.', icon: CheckCircle2 },
    { title: 'One-Person / One-Vote', desc: 'Single-use cryptographic token issuance prevents ballot duplication.', icon: Vote },
    { title: 'Ballot Secrecy', desc: 'Strict architectural decoupling separating voter identities from cast ballot selections.', icon: Lock },
    { title: 'Audit Logging', desc: 'Immutable, time-stamped system event tracking for electoral observation.', icon: FileText },
    { title: 'Fraud Prevention', desc: 'Row-level database security policies, token invalidation, and rate controls.', icon: ShieldAlert },
    { title: 'Administrative Controls', desc: 'Role-based access separating content liaisons, registrars, and auditors.', icon: Cpu },
    { title: 'Independent Verification', desc: 'Zero-knowledge receipt validation allowing voters to independently verify simulated records.', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#0B1B3D] via-[#0F244C] to-[#162A5A] text-white pt-14 pb-20 sm:pt-20 sm:pb-28">
        {/* Subtle geometric civic background accents */}
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-amber-400 blur-3xl"></div>
          <div className="absolute bottom-0 -left-24 w-80 h-80 rounded-full bg-blue-500 blur-3xl"></div>
          <div className="absolute inset-0 bg-[radial-gradient(#d4af37_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-3xl">
            
            {/* Top Prototype Chip */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-semibold mb-6 shadow-xs">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
              Civic Technology Research Prototype
            </div>

            {/* Title & Tagline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-sans">
              SautiVote <span className="font-serif-civic text-amber-400">South Sudan</span>
            </h1>

            <p className="mt-3 text-xl sm:text-2xl font-semibold text-amber-300 tracking-tight">
              “Your voice. Your vote. Wherever you are.”
            </p>

            <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
              A prototype platform exploring how South Sudanese citizens could securely access election information, verify eligibility and participate digitally from wherever they are.
            </p>

            {/* Primary Action Buttons */}
            <div className="mt-8 sm:mt-10 flex flex-wrap items-center gap-3 sm:gap-4">
              <button
                onClick={() => {
                  if (user) {
                    setActiveTab('verification');
                  } else {
                    openAuthModal('signup');
                  }
                }}
                className="px-6 py-3.5 rounded-lg text-sm sm:text-base font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md transition-all flex items-center gap-2 cursor-pointer hover:scale-[1.01]"
              >
                <UserCheck className="w-5 h-5 text-slate-950" />
                Check My Eligibility
              </button>

              <button
                onClick={() => setActiveTab('election')}
                className="px-5 py-3.5 rounded-lg text-sm sm:text-base font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Vote className="w-5 h-5 text-amber-400" />
                Explore Election
              </button>

              <button
                onClick={() => setActiveTab('candidates')}
                className="px-5 py-3.5 rounded-lg text-sm sm:text-base font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Users className="w-5 h-5 text-amber-400" />
                View Candidates
              </button>
            </div>

            {/* Secondary Link */}
            <div className="mt-6 flex items-center gap-4 text-xs sm:text-sm text-slate-400">
              <button
                onClick={() => setActiveTab('how-it-works')}
                className="text-amber-300 hover:text-white underline underline-offset-4 flex items-center gap-1 font-medium cursor-pointer"
              >
                About the Project & Technical Roadmap
                <ChevronRight className="w-4 h-4" />
              </button>
              <span>•</span>
              <button
                onClick={() => setActiveTab('diaspora')}
                className="hover:text-slate-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5" />
                Diaspora Voting Feasibility
              </button>
            </div>

            {/* Key Civic Notice Card */}
            <div className="mt-8 p-4 rounded-xl bg-slate-900/80 border border-amber-500/40 text-xs text-slate-300 flex items-start gap-3">
              <div className="p-1.5 rounded bg-amber-500/20 text-amber-400 shrink-0">
                ★
              </div>
              <div className="space-y-1">
                <span className="font-semibold text-white block">
                  Simulated Demonstration Architecture
                </span>
                <p>
                  This system is an independent digital civic prototype designed to model what a trustworthy digital voting experience could resemble. It is not affiliated with political campaigns or commercial AI suites. All voting workflows generate simulated demo receipts.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works (7 Steps) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
            Civic Participation Architecture
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            How It Works
          </h2>
          <p className="mt-2 text-sm text-slate-600">
            A comprehensive, transparent 7-step journey modeling how citizens both in South Sudan and abroad could interact with digital election infrastructure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {steps.slice(0, 4).map((step) => (
            <div 
              key={step.number}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0B1B3D] text-amber-400 font-bold flex items-center justify-center text-sm mb-3 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                {step.number}
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {steps.slice(4).map((step) => (
            <div 
              key={step.number}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-amber-300 transition-all group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0B1B3D] text-amber-400 font-bold flex items-center justify-center text-sm mb-3 group-hover:bg-amber-500 group-hover:text-slate-950 transition-colors">
                {step.number}
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                {step.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {step.desc}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              if (user) setActiveTab('voting');
              else openAuthModal('signup');
            }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg text-sm font-semibold bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors cursor-pointer"
          >
            Experience the 7-Step Workflow
            <ArrowRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>
      </section>

      {/* Security Principles (8 Pillars) */}
      <section className="bg-slate-100/80 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-slate-800 text-xs font-semibold mb-3 border border-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Institutional Trust
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              Security Principles
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Rigorous electoral integrity standards designed to ensure transparency, one-person/one-vote guarantees, and strict voter privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityPrinciples.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div 
                  key={idx}
                  className="bg-white p-5 rounded-xl border border-slate-200/80 shadow-2xs space-y-2 hover:shadow-xs transition-shadow"
                >
                  <div className="w-9 h-9 rounded-lg bg-amber-500/15 text-amber-800 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-sm">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>

          <div className="mt-8 p-4 rounded-xl bg-white border border-slate-300 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-slate-700">
                <strong>Zero Identity-to-Ballot Mapping:</strong> Our architectural specifications guarantee that voter credentials and ballot storage run on isolated database layers.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('security')}
              className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline shrink-0 cursor-pointer"
            >
              Read Full Security Architecture & RLS →
            </button>
          </div>
        </div>
      </section>

      {/* Neutral Candidates Section Preview */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Non-Partisan Civic Directory
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
              Publicly Announced Contenders
            </h2>
            <p className="text-xs text-slate-600 mt-1 max-w-xl">
              Presented strictly neutrally in random or alphabetical order. No endorsements, candidate scores, or ranking indicators.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('candidates')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-900 hover:text-amber-700 transition-colors"
          >
            View All Contenders & Citations
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {candidates.slice(0, 3).map((candidate) => (
            <div
              key={candidate.id}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs hover:border-slate-300 transition-all flex flex-col"
            >
              <div className="h-44 bg-slate-200 relative overflow-hidden">
                <img 
                  src={candidate.photo_url} 
                  alt={candidate.full_name} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[30%] hover:grayscale-0 transition-all"
                />
                <div className="absolute top-3 right-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-900/80 text-white backdrop-blur-xs">
                    {candidate.candidacy_status}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 text-lg leading-snug">
                    {candidate.full_name}
                  </h3>
                  <p className="text-xs font-semibold text-slate-600 mt-0.5 mb-2">
                    {candidate.party_name}
                  </p>
                  <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                    {candidate.biography}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] text-slate-500">
                    {candidate.sources.length} public reference(s)
                  </span>
                  <button
                    onClick={() => setActiveTab('candidates')}
                    className="text-xs font-semibold text-amber-800 hover:text-amber-950 underline cursor-pointer"
                  >
                    View Neutral Profile →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Diaspora Spotlight Callout */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="rounded-2xl bg-gradient-to-r from-[#0B1B3D] to-[#162A5A] text-white p-8 sm:p-12 relative overflow-hidden shadow-lg border border-slate-800">
          <div className="relative max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold">
              <Globe className="w-3.5 h-3.5" />
              Global South Sudanese Diaspora
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Voting From Anywhere in the World
            </h3>
            <p className="text-sm text-slate-300 leading-relaxed">
              Hundreds of thousands of South Sudanese live in Kenya, Uganda, Ethiopia, Sudan, the United States, Australia, and across the globe. Explore the technical and legal feasibility requirements for diaspora voter inclusion.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('diaspora')}
                className="px-5 py-2.5 rounded-md font-semibold text-xs sm:text-sm bg-amber-500 hover:bg-amber-400 text-slate-950 transition-colors cursor-pointer"
              >
                Explore Country Hubs & Legal Requirements
              </button>
              <button
                onClick={() => setActiveTab('election')}
                className="px-4 py-2.5 rounded-md font-medium text-xs sm:text-sm bg-white/10 hover:bg-white/15 text-white transition-colors cursor-pointer"
              >
                General Election Roadmap
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Announcements Stream */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900">
              Civic & Electoral Announcements
            </h3>
            <p className="text-xs text-slate-600 mt-1">
              Factual notifications collated from the National Elections Commission (NEC) and civic monitoring observers.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {announcements.slice(0, 4).map((ann) => (
            <div 
              key={ann.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px]">
                    {ann.category}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {formatDate(ann.published_at)}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm mb-2 leading-snug">
                  {ann.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {ann.content}
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500">Official Gazetted Context</span>
                {ann.source_url && (
                  <a 
                    href={ann.source_url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-amber-800 hover:underline flex items-center gap-1 font-medium"
                  >
                    Source Document
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
