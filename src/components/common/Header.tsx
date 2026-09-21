import React, { useState } from 'react';
import { 
  Vote, 
  Shield, 
  Globe, 
  UserCheck, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Sliders, 
  ExternalLink,
  ChevronDown,
  Sparkles,
  FileText
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { ActiveTab } from '../../types';

interface HeaderProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  openAuthModal: (mode: 'login' | 'signup') => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, openAuthModal }) => {
  const { user, isAdmin, signOut, loginAsDemoVoter, loginAsAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const navItems = [
    { id: 'home' as ActiveTab, label: 'Home' },
    { id: 'election' as ActiveTab, label: 'Election' },
    { id: 'candidates' as ActiveTab, label: 'Candidates' },
    { id: 'how-it-works' as ActiveTab, label: 'How It Works' },
    { id: 'security' as ActiveTab, label: 'Security' },
    { id: 'diaspora' as ActiveTab, label: 'Diaspora' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0B1B3D] text-white border-b border-slate-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-slate-950 font-bold shadow-md ring-1 ring-amber-300/50 group-hover:scale-105 transition-transform">
              <span className="text-xl">★</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif-civic font-bold text-xl tracking-wide text-white">
                  SautiVote
                </span>
                <span className="text-xs px-1.5 py-0.5 rounded font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase tracking-wider">
                  South Sudan
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-tight">
                Civic Election Technology Prototype
              </p>
            </div>
          </div>

          {/* Desktop Navigation Menu */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === item.id
                    ? 'bg-white/10 text-amber-300 font-semibold ring-1 ring-white/10'
                    : 'text-slate-200 hover:text-white hover:bg-white/5'
                }`}
              >
                {item.label}
              </button>
            ))}

            {user && (
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'dashboard'
                    ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                    : 'text-amber-300 hover:bg-white/5 border border-amber-400/30'
                }`}
              >
                <UserCheck className="w-4 h-4" />
                My Dashboard
              </button>
            )}

            {user && (
              <button
                onClick={() => setActiveTab('voting')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'voting'
                    ? 'bg-amber-400 text-slate-950 font-bold shadow-xs'
                    : 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/40'
                }`}
              >
                <Vote className="w-4 h-4" />
                Vote Demo
                <span className="text-[10px] uppercase tracking-wider px-1 py-0.2 bg-amber-400 text-slate-950 font-bold rounded">
                  DEMO
                </span>
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => setActiveTab('admin')}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                  activeTab === 'admin'
                    ? 'bg-rose-900/60 text-rose-200 ring-1 ring-rose-400'
                    : 'text-slate-300 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Sliders className="w-4 h-4" />
                Admin
              </button>
            )}
          </nav>

          {/* Right actions / Auth buttons */}
          <div className="hidden sm:flex items-center gap-2.5">
            {!user ? (
              <>
                {/* Fast reviewer demo launcher */}
                <button
                  onClick={() => loginAsDemoVoter()}
                  title="Explore instantly as a verified South Sudanese diaspora voter"
                  className="px-2.5 py-1 rounded text-xs font-semibold text-amber-300 bg-amber-500/15 border border-amber-400/30 hover:bg-amber-500/25 transition-colors cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Quick Demo Voter
                </button>
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-3.5 py-1.5 rounded-md text-sm font-medium text-slate-200 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('signup')}
                  className="px-4 py-1.5 rounded-md text-sm font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-sm cursor-pointer"
                >
                  Register
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 hover:bg-white/15 transition-colors cursor-pointer text-left border border-white/10"
                >
                  <div className="w-7 h-7 rounded-full bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center">
                    {user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-xs font-semibold text-white leading-tight">{user.full_name}</p>
                    <p className="text-[10px] text-amber-300/90 leading-tight">
                      {user.country}
                    </p>
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </button>

                {userDropdownOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 rounded-lg bg-slate-900 border border-slate-700 shadow-xl py-1 text-sm text-slate-200 z-50 animate-in fade-in-50"
                    onClick={() => setUserDropdownOpen(false)}
                  >
                    <div className="px-4 py-2 border-b border-slate-800">
                      <p className="font-semibold text-white truncate">{user.full_name}</p>
                      <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      {isAdmin && (
                        <span className="inline-block mt-1 text-[10px] font-bold px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase">
                          {user.admin_role || 'Admin'}
                        </span>
                      )}
                    </div>
                    
                    <button
                      onClick={() => setActiveTab('dashboard')}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-slate-400" />
                      My Voter Dashboard
                    </button>
                    <button
                      onClick={() => setActiveTab('verification')}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2"
                    >
                      <UserCheck className="w-4 h-4 text-slate-400" />
                      Identity Verification
                    </button>
                    <button
                      onClick={() => setActiveTab('voting')}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2 text-amber-300 font-medium"
                    >
                      <Vote className="w-4 h-4 text-amber-400" />
                      Simulated Ballot
                    </button>
                    <button
                      onClick={() => setActiveTab('receipt')}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2"
                    >
                      <FileText className="w-4 h-4 text-slate-400" />
                      My Demo Receipt
                    </button>

                    <div className="border-t border-slate-800 my-1"></div>

                    {isAdmin ? (
                      <button
                        onClick={() => setActiveTab('admin')}
                        className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2 text-rose-300"
                      >
                        <Sliders className="w-4 h-4" />
                        Admin Panel
                      </button>
                    ) : (
                      <button
                        onClick={() => loginAsAdmin('election_admin')}
                        className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2 text-slate-400 text-xs"
                      >
                        <Sliders className="w-4 h-4" />
                        Switch to Demo Admin
                      </button>
                    )}

                    <button
                      onClick={() => signOut()}
                      className="w-full text-left px-4 py-2 hover:bg-white/10 flex items-center gap-2 text-red-400"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile hamburger menu button */}
          <div className="flex lg:hidden items-center gap-2">
            {!user && (
              <button
                onClick={() => loginAsDemoVoter()}
                className="px-2 py-1 rounded text-xs font-semibold text-amber-300 bg-amber-500/20 border border-amber-400/40"
              >
                Demo
              </button>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-slate-300 hover:text-white hover:bg-white/10"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#0B1B3D] px-4 pt-2 pb-6 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-md text-sm font-medium ${
                activeTab === item.id ? 'bg-amber-500/20 text-amber-300 font-semibold' : 'text-slate-200'
              }`}
            >
              {item.label}
            </button>
          ))}

          {user && (
            <>
              <div className="border-t border-slate-800 pt-2"></div>
              <button
                onClick={() => {
                  setActiveTab('dashboard');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-amber-300 flex items-center gap-2"
              >
                <UserCheck className="w-4 h-4" />
                My Voter Dashboard
              </button>
              <button
                onClick={() => {
                  setActiveTab('voting');
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2.5 rounded-md text-sm font-semibold text-amber-400 flex items-center gap-2"
              >
                <Vote className="w-4 h-4" />
                Cast Simulated Ballot (Demo)
              </button>
            </>
          )}

          {isAdmin && (
            <button
              onClick={() => {
                setActiveTab('admin');
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-md text-sm font-medium text-rose-300 flex items-center gap-2"
            >
              <Sliders className="w-4 h-4" />
              Admin Dashboard
            </button>
          )}

          <div className="border-t border-slate-800 pt-3">
            {!user ? (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-md text-sm font-medium text-center border border-white/20 text-white"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('signup');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 rounded-md text-sm font-semibold text-center bg-amber-500 text-slate-950"
                >
                  Register
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  signOut();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2 rounded-md text-sm font-medium text-red-400 text-left px-3 flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out ({user.email})
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
