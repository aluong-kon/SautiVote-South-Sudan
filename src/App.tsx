import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ActiveTab, Candidate, Election, OfficialAnnouncement, AuditLogEvent } from './types';
import { CivicDataService } from './lib/supabase';
import { PrototypeBanner } from './components/common/PrototypeBanner';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { AuthModal } from './components/auth/AuthModal';

// Pages
import { LandingPage } from './components/landing/LandingPage';
import { VoterDashboard } from './components/dashboard/VoterDashboard';
import { VerificationPage } from './components/verification/VerificationPage';
import { ElectionInfoPage } from './components/election/ElectionInfoPage';
import { CandidatesPage } from './components/candidates/CandidatesPage';
import { DemoVotingFlow } from './components/voting/DemoVotingFlow';
import { ReceiptCheckerPage } from './components/receipt/ReceiptCheckerPage';
import { SecurityCenterPage } from './components/security/SecurityCenterPage';
import { DiasporaPage } from './components/diaspora/DiasporaPage';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { RoadmapPage } from './components/roadmap/RoadmapPage';

function AppContent() {
  const { user, lastReceipt } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'signup'>('signup');
  const [preSelectedCandidateId, setPreSelectedCandidateId] = useState<string | null>(null);

  // Core Data loaded from CivicDataService
  const [election, setElection] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [announcements, setAnnouncements] = useState<OfficialAnnouncement[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLogEvent[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const loadAllData = async () => {
    try {
      const [elecData, candData, annData, logsData] = await Promise.all([
        CivicDataService.getElection(),
        CivicDataService.getCandidates(),
        CivicDataService.getAnnouncements(),
        CivicDataService.getAuditLogs(),
      ]);

      setElection(elecData);
      setCandidates(candData);
      setAnnouncements(annData);
      setAuditLogs(logsData);
    } catch (err) {
      console.error('Error loading civic data:', err);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    loadAllData();
  }, []);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  // Scroll to top upon tab switch
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-slate-900 selection:bg-amber-300 selection:text-slate-950 font-sans">
      
      {/* Global Prototype Warning Banner */}
      <PrototypeBanner />

      {/* Main Header */}
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        openAuthModal={openAuth} 
      />

      {/* Main View Router */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <LandingPage
            setActiveTab={setActiveTab}
            openAuthModal={openAuth}
            candidates={candidates}
            announcements={announcements}
          />
        )}

        {activeTab === 'dashboard' && (
          <VoterDashboard
            setActiveTab={setActiveTab}
            announcements={announcements}
          />
        )}

        {activeTab === 'verification' && (
          <VerificationPage
            setActiveTab={setActiveTab}
            openAuthModal={openAuth}
          />
        )}

        {activeTab === 'election' && election && (
          <ElectionInfoPage
            election={election}
            announcements={announcements}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'candidates' && (
          <CandidatesPage
            candidates={candidates}
            setActiveTab={setActiveTab}
            onSelectCandidateForBallot={(id) => {
              setPreSelectedCandidateId(id);
              setActiveTab('voting');
            }}
          />
        )}

        {activeTab === 'voting' && election && (
          <DemoVotingFlow
            election={election}
            candidates={candidates}
            setActiveTab={setActiveTab}
            openAuthModal={openAuth}
            preSelectedCandidateId={preSelectedCandidateId}
          />
        )}

        {(activeTab === 'receipt' || activeTab === 'receipt-checker') && (
          <ReceiptCheckerPage setActiveTab={setActiveTab} />
        )}

        {activeTab === 'security' && (
          <SecurityCenterPage />
        )}

        {activeTab === 'diaspora' && (
          <DiasporaPage
            setActiveTab={setActiveTab}
            openAuthModal={openAuth}
          />
        )}

        {activeTab === 'admin' && election && (
          <AdminDashboard
            election={election}
            candidates={candidates}
            announcements={announcements}
            auditLogs={auditLogs}
            onRefreshData={loadAllData}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === 'how-it-works' && (
          <RoadmapPage
            setActiveTab={setActiveTab}
            openAuthModal={openAuth}
          />
        )}
      </main>

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authModalMode}
        onSuccessRedirect={() => {
          if (activeTab === 'home') {
            setActiveTab('dashboard');
          }
        }}
      />

    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
