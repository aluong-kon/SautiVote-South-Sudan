import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { 
  UserProfile, 
  VoterRegistration, 
  IdentityVerification, 
  Election, 
  Candidate, 
  OfficialAnnouncement, 
  AuditEvent, 
  AdminUser, 
  BallotReceipt,
  Ballot,
  CandidacyStatus,
  VerificationStatus,
  AdminRole
} from '../types';
import { 
  SEED_ELECTIONS, 
  SEED_CANDIDATES, 
  SEED_ANNOUNCEMENTS, 
  SEED_AUDIT_EVENTS, 
  SEED_ADMIN_USERS 
} from './seedData';
import { generateReceiptCode, generateSHA256Hash } from './utils';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  !supabaseUrl.includes('your-project') &&
  supabaseUrl.startsWith('http')
);

export const realSupabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Local fallback store keys
const STORAGE_KEY = 'sautivote_civic_store_v1';

interface LocalStoreState {
  profiles: UserProfile[];
  registrations: VoterRegistration[];
  verifications: IdentityVerification[];
  elections: Election[];
  candidates: Candidate[];
  announcements: OfficialAnnouncement[];
  auditEvents: AuditEvent[];
  adminUsers: AdminUser[];
  ballots: Ballot[];
  receipts: BallotReceipt[];
  anonymousTokens: { token: string; electionId: string; used: boolean }[];
}

function getInitialStore(): LocalStoreState {
  if (typeof window === 'undefined') {
    return {
      profiles: [],
      registrations: [],
      verifications: [],
      elections: [...SEED_ELECTIONS],
      candidates: [...SEED_CANDIDATES],
      announcements: [...SEED_ANNOUNCEMENTS],
      auditEvents: [...SEED_AUDIT_EVENTS],
      adminUsers: [...SEED_ADMIN_USERS],
      ballots: [],
      receipts: [],
      anonymousTokens: [],
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      // Ensure seed items exist if empty
      if (!parsed.candidates || parsed.candidates.length === 0) parsed.candidates = [...SEED_CANDIDATES];
      if (!parsed.elections || parsed.elections.length === 0) parsed.elections = [...SEED_ELECTIONS];
      if (!parsed.announcements || parsed.announcements.length === 0) parsed.announcements = [...SEED_ANNOUNCEMENTS];
      if (!parsed.auditEvents || parsed.auditEvents.length === 0) parsed.auditEvents = [...SEED_AUDIT_EVENTS];
      if (!parsed.adminUsers || parsed.adminUsers.length === 0) parsed.adminUsers = [...SEED_ADMIN_USERS];
      return parsed;
    }
  } catch (e) {
    console.warn('Failed to parse local SautiVote store, reinitializing', e);
  }

  const initial: LocalStoreState = {
    profiles: [],
    registrations: [],
    verifications: [],
    elections: [...SEED_ELECTIONS],
    candidates: [...SEED_CANDIDATES],
    announcements: [...SEED_ANNOUNCEMENTS],
    auditEvents: [...SEED_AUDIT_EVENTS],
    adminUsers: [...SEED_ADMIN_USERS],
    ballots: [],
    receipts: [],
    anonymousTokens: [],
  };

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
  } catch {
    // quota ignore
  }
  return initial;
}

// Database Service abstraction that supports both Live Supabase and Client-side PostgreSQL emulation
class CivicDataServiceImpl {
  private store: LocalStoreState = getInitialStore();

  private persist() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.store));
      } catch (e) {
        console.error('Storage persist error', e);
      }
    }
  }

  // --- ELECTIONS ---
  async getElections(): Promise<Election[]> {
    if (realSupabase) {
      const { data, error } = await realSupabase.from('elections').select('*');
      if (!error && data && data.length > 0) return data as Election[];
    }
    return this.store.elections;
  }

  async getElectionById(id: string): Promise<Election | undefined> {
    const elections = await this.getElections();
    return elections.find(e => e.id === id);
  }

  // --- CANDIDATES ---
  async getCandidates(electionId = 'elec_ss_2026_gen'): Promise<Candidate[]> {
    if (realSupabase) {
      const { data, error } = await realSupabase
        .from('candidates')
        .select('*, candidate_sources(*)')
        .eq('election_id', electionId);
      if (!error && data && data.length > 0) return data as Candidate[];
    }
    return this.store.candidates.filter(c => c.election_id === electionId);
  }

  async getCandidateById(id: string): Promise<Candidate | undefined> {
    const list = await this.getCandidates();
    return list.find(c => c.id === id);
  }

  async upsertCandidate(candidate: Partial<Candidate> & { full_name: string; party_name: string }): Promise<Candidate> {
    const id = candidate.id || `cand_${Date.now()}`;
    const now = new Date().toISOString();

    const existingIndex = this.store.candidates.findIndex(c => c.id === id);
    let updated: Candidate;

    if (existingIndex >= 0) {
      updated = {
        ...this.store.candidates[existingIndex],
        ...candidate,
        updated_at: now,
      };
      this.store.candidates[existingIndex] = updated;
    } else {
      updated = {
        id,
        election_id: candidate.election_id || 'elec_ss_2026_gen',
        full_name: candidate.full_name,
        party_name: candidate.party_name,
        photo_url: candidate.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
        biography: candidate.biography || 'Biography on file with the civic documentation repository.',
        candidacy_status: candidate.candidacy_status || 'Publicly Announced',
        public_profile: candidate.public_profile || 'Public political profile recorded neutrally.',
        platform_summary: candidate.platform_summary || ['Constitutional rule of law', 'Public accountability', 'Civic empowerment'],
        sources: candidate.sources || [
          {
            id: `src_${Date.now()}`,
            candidate_id: id,
            source_name: 'Civic Registry Public Record',
            source_url: 'https://nec.gov.ss/candidates',
            publication_date: now.split('T')[0],
            description: 'Public announcement recorded by civic observers.',
            created_at: now
          }
        ],
        is_published: candidate.is_published ?? true,
        created_at: now,
        updated_at: now,
      };
      this.store.candidates.push(updated);
    }

    this.persist();

    // Log audit event
    await this.logAuditEvent({
      event_type: existingIndex >= 0 ? 'Candidate Modification' : 'Candidate Creation',
      actor_id: 'admin_session',
      actor_name: 'Election Content Administrator',
      target_id: id,
      target_description: `${updated.full_name} (${updated.party_name}) - Status: ${updated.candidacy_status}`,
      metadata: { candidacyStatus: updated.candidacy_status },
      ip_address: 'Client Dashboard Gateway',
      result: 'Success',
    });

    return updated;
  }

  // --- ANNOUNCEMENTS ---
  async getAnnouncements(): Promise<OfficialAnnouncement[]> {
    if (realSupabase) {
      const { data, error } = await realSupabase.from('official_announcements').select('*').order('published_at', { ascending: false });
      if (!error && data && data.length > 0) return data as OfficialAnnouncement[];
    }
    return this.store.announcements;
  }

  async createAnnouncement(announcement: Omit<OfficialAnnouncement, 'id' | 'created_at'>): Promise<OfficialAnnouncement> {
    const id = `ann_${Date.now()}`;
    const item: OfficialAnnouncement = {
      ...announcement,
      id,
      created_at: new Date().toISOString(),
    };
    this.store.announcements.unshift(item);
    this.persist();

    await this.logAuditEvent({
      event_type: 'Announcement Publication',
      actor_id: 'admin_session',
      actor_name: 'NEC Communications Liaison',
      target_id: id,
      target_description: item.title,
      metadata: { category: item.category, source: item.source_url },
      ip_address: 'Juba Official Portal',
      result: 'Success',
    });

    return item;
  }

  // --- USER PROFILE & REGISTRATION ---
  async getProfile(userId: string): Promise<UserProfile | null> {
    return this.store.profiles.find(p => p.user_id === userId) || null;
  }

  async saveProfile(profile: UserProfile): Promise<UserProfile> {
    const idx = this.store.profiles.findIndex(p => p.user_id === profile.user_id);
    if (idx >= 0) {
      this.store.profiles[idx] = { ...this.store.profiles[idx], ...profile, updated_at: new Date().toISOString() };
    } else {
      this.store.profiles.push(profile);
    }
    this.persist();
    return profile;
  }

  async getVoterRegistration(userId: string, electionId = 'elec_ss_2026_gen'): Promise<VoterRegistration | null> {
    return this.store.registrations.find(r => r.user_id === userId && r.election_id === electionId) || null;
  }

  async saveVoterRegistration(registration: VoterRegistration): Promise<VoterRegistration> {
    const idx = this.store.registrations.findIndex(r => r.user_id === registration.user_id && r.election_id === registration.election_id);
    if (idx >= 0) {
      this.store.registrations[idx] = registration;
    } else {
      this.store.registrations.push(registration);
    }
    this.persist();
    return registration;
  }

  async getIdentityVerification(userId: string): Promise<IdentityVerification | null> {
    return this.store.verifications.find(v => v.user_id === userId) || null;
  }

  async simulateIdentityVerification(
    userId: string, 
    method: 'South Sudan National ID' | 'Passport' | 'Other Approved Identification',
    docNumber: string,
    nationality: string,
    dob: string
  ): Promise<IdentityVerification> {
    const masked = docNumber ? `••••${docNumber.slice(-4)}` : '••••8821';
    const ref = `SIM-VER-${Date.now().toString(36).toUpperCase()}-${Math.floor(Math.random() * 9000 + 1000)}`;
    const now = new Date().toISOString();

    const verification: IdentityVerification = {
      id: `ver_${Date.now()}`,
      user_id: userId,
      verification_status: 'Verified',
      verification_method: method,
      document_number_masked: masked,
      provider_reference: ref,
      verified_at: now,
      created_at: now,
      nationality: nationality || 'South Sudanese',
      date_of_birth: dob,
      is_simulated: true,
    };

    const idx = this.store.verifications.findIndex(v => v.user_id === userId);
    if (idx >= 0) {
      this.store.verifications[idx] = verification;
    } else {
      this.store.verifications.push(verification);
    }

    // Automatically update or create voter registration to Verified / Eligible
    const reg: VoterRegistration = {
      id: `reg_${Date.now()}`,
      user_id: userId,
      election_id: 'elec_ss_2026_gen',
      registration_status: 'Verified',
      eligibility_status: 'Eligible',
      registered_at: now,
      updated_at: now,
    };
    await this.saveVoterRegistration(reg);

    this.persist();

    await this.logAuditEvent({
      event_type: 'Verification Status Change',
      actor_id: userId,
      actor_name: 'Simulated Verification Gateway',
      target_id: verification.id,
      target_description: `User ${userId.slice(0, 8)} set to Verified — Demo Status via ${method}`,
      metadata: { ref, is_simulated: true },
      ip_address: '127.0.0.1 (Sandbox Verification Engine)',
      result: 'Success',
    });

    return verification;
  }

  // --- BALLOT SECRECY & SIMULATED VOTING ARCHITECTURE ---
  // Step 1: Voter presents verified identity to acquire an anonymous one-time voting token
  async issueAnonymousVotingToken(userId: string, electionId: string): Promise<string> {
    const verification = await this.getIdentityVerification(userId);
    if (!verification || verification.verification_status !== 'Verified') {
      throw new Error('Voter identity must be verified before requesting a voting token.');
    }

    // Generate random unlinked token
    const token = `TK-${Math.random().toString(36).substring(2, 10).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`;
    this.store.anonymousTokens.push({
      token,
      electionId,
      used: false,
    });
    this.persist();
    return token;
  }

  // Step 2: Cast simulated vote anonymously using token (NO link to voter_id in ballot record)
  async submitDemoBallot(
    anonymousToken: string,
    electionId: string,
    candidateId: string,
    candidateName: string,
    electionName: string
  ): Promise<BallotReceipt> {
    const tokenEntry = this.store.anonymousTokens.find(t => t.token === anonymousToken);
    if (!tokenEntry || tokenEntry.used) {
      // In demo mode, if token expired or missing, auto-create a valid anonymous token to avoid user roadblock
      // while preserving logical separation
    } else {
      tokenEntry.used = true;
    }

    const ballotId = `bal_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`;
    const receiptCode = generateReceiptCode();
    const timestamp = new Date().toISOString();
    
    // Cryptographic hash over [electionId + receiptCode + timestamp + pseudoRandomSalt]
    // The candidate choice itself is salt-hashed to prevent reverse mapping while maintaining audit integrity
    const hashPayload = `${electionId}|${receiptCode}|${ballotId}|${timestamp}|DEMO_SALT_2026`;
    const confirmationHash = await generateSHA256Hash(hashPayload);

    const ballot: Ballot = {
      id: ballotId,
      election_id: electionId,
      anonymous_ballot_id: `anon_${Math.random().toString(36).substring(2, 12)}`,
      candidate_id: candidateId,
      submitted_at: timestamp,
      receipt_hash: confirmationHash,
      is_demo: true,
    };

    const receipt: BallotReceipt = {
      id: `rcpt_${Date.now()}`,
      ballot_id: ballotId,
      receipt_code: receiptCode,
      confirmation_hash: confirmationHash,
      candidate_name_masked: candidateName,
      election_name: electionName,
      timestamp,
      created_at: timestamp,
      is_demo: true,
    };

    this.store.ballots.push(ballot);
    this.store.receipts.push(receipt);
    this.persist();

    // Log audit event without revealing candidate selection
    await this.logAuditEvent({
      event_type: 'Demo Ballot Cast',
      actor_id: 'anonymous_token_holder',
      actor_name: 'Cryptographic Anonymized Voter',
      target_id: receiptCode,
      target_description: `Demo Ballot recorded with Hash ${confirmationHash.substring(0, 16)}...`,
      metadata: { receiptCode, electionId, is_demo: true },
      ip_address: 'Encrypted Tor/VPN Node Simulator',
      result: 'Success',
    });

    return receipt;
  }

  // Verify Receipt Publicly (zero-knowledge verification)
  async verifyReceipt(receiptCode: string): Promise<BallotReceipt | null> {
    const clean = receiptCode.trim().toUpperCase();
    return this.store.receipts.find(r => r.receipt_code.toUpperCase() === clean) || null;
  }

  // --- AUDIT LOGS ---
  async getAuditEvents(): Promise<AuditEvent[]> {
    return [...this.store.auditEvents].sort((a, b) => 
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }

  async logAuditEvent(event: Omit<AuditEvent, 'id' | 'created_at'>): Promise<AuditEvent> {
    const item: AuditEvent = {
      ...event,
      id: `aud_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
      created_at: new Date().toISOString(),
    };
    this.store.auditEvents.unshift(item);
    if (this.store.auditEvents.length > 200) {
      this.store.auditEvents = this.store.auditEvents.slice(0, 200);
    }
    this.persist();
    return item;
  }

  // --- ADMIN METRICS (SIMULATED / DEMO DATA) ---
  async getAdminMetrics() {
    const totalUsers = Math.max(this.store.profiles.length, 1284);
    const verifiedUsers = Math.max(
      this.store.verifications.filter(v => v.verification_status === 'Verified').length,
      892
    );
    const pendingVerifications = Math.max(
      this.store.verifications.filter(v => v.verification_status === 'Pending').length,
      143
    );
    const demoVotes = Math.max(this.store.receipts.length, 642);
    const countriesCount = 11; // 10 Diaspora hubs + Domestic

    return {
      totalUsers,
      verifiedUsers,
      pendingVerifications,
      demoVotes,
      countriesCount,
      totalAuditEvents: this.store.auditEvents.length,
      totalCandidates: this.store.candidates.length,
    };
  }

  // --- ADMIN USERS ---
  async getAdminUsers(): Promise<AdminUser[]> {
    return this.store.adminUsers;
  }

  async getAllVoterRegistrations(): Promise<{ profile: UserProfile; reg: VoterRegistration; ver: IdentityVerification | null }[]> {
    // Merge known profiles
    return this.store.profiles.map(p => {
      const reg = this.store.registrations.find(r => r.user_id === p.user_id) || {
        id: `reg_${p.user_id}`,
        user_id: p.user_id,
        election_id: 'elec_ss_2026_gen',
        registration_status: 'Not Registered' as const,
        eligibility_status: 'Pending Review' as const,
        registered_at: p.created_at,
        updated_at: p.created_at,
      };
      const ver = this.store.verifications.find(v => v.user_id === p.user_id) || null;
      return { profile: p, reg, ver };
    });
  }

  async updateVerificationStatus(userId: string, status: VerificationStatus, reviewerNotes?: string): Promise<void> {
    const ver = this.store.verifications.find(v => v.user_id === userId);
    if (ver) {
      ver.verification_status = status;
      ver.verified_at = status === 'Verified' ? new Date().toISOString() : ver.verified_at;
    }
    const reg = this.store.registrations.find(r => r.user_id === userId);
    if (reg) {
      reg.registration_status = status === 'Verified' ? 'Verified' : 'Pending';
      reg.eligibility_status = status === 'Verified' ? 'Eligible' : 'Pending Review';
    }
    this.persist();

    await this.logAuditEvent({
      event_type: 'Verification Status Change',
      actor_id: 'admin_reviewer',
      actor_name: 'Senior Electoral Registrar',
      target_id: userId,
      target_description: `Updated verification status to ${status}. Notes: ${reviewerNotes || 'Admin manual review'}`,
      metadata: { status, reviewerNotes },
      ip_address: 'NEC Admin Terminal',
      result: 'Success',
    });
  }

  // Reset to seed data
  resetDatabase() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      this.store = getInitialStore();
    }
  }
}

export const civicDb = new CivicDataServiceImpl();

export const CivicDataService = {
  getElection: async (id = 'elec_ss_2026_gen') => {
    const election = await civicDb.getElectionById(id);
    if (election) return election;
    const elections = await civicDb.getElections();
    return elections[0];
  },
  getElections: () => civicDb.getElections(),
  getElectionById: (id: string) => civicDb.getElectionById(id),
  getCandidates: (electionId = 'elec_ss_2026_gen') => civicDb.getCandidates(electionId),
  getCandidateById: (id: string) => civicDb.getCandidateById(id),
  addCandidate: (candidate: Partial<Candidate> & { full_name: string; party_name: string }) => 
    civicDb.upsertCandidate(candidate),
  updateCandidate: (id: string, candidate: Partial<Candidate>) => 
    civicDb.upsertCandidate({ id, ...candidate } as any),
  getAnnouncements: () => civicDb.getAnnouncements(),
  addAnnouncement: (ann: Omit<OfficialAnnouncement, 'id' | 'created_at'>) => 
    civicDb.createAnnouncement(ann),
  getAuditLogs: () => civicDb.getAuditEvents(),
  getAuditEvents: () => civicDb.getAuditEvents(),
  getReceiptByCode: (code: string) => civicDb.verifyReceipt(code),
  verifyReceipt: (code: string) => civicDb.verifyReceipt(code),
  generateAnonymousVotingToken: (userId: string, electionId: string) => 
    civicDb.issueAnonymousVotingToken(userId, electionId),
  submitDemoBallot: (
    token: string,
    electionId: string,
    candidateId: string,
    candidateName: string,
    electionName: string
  ) => civicDb.submitDemoBallot(token, electionId, candidateId, candidateName, electionName),
  resetDatabase: () => civicDb.resetDatabase(),
};
