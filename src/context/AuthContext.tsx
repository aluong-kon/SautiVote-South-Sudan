import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, IdentityVerification, VoterRegistration, BallotReceipt, AdminRole } from '../types';
import { civicDb, realSupabase, isSupabaseConfigured } from '../lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  verification: IdentityVerification | null;
  registration: VoterRegistration | null;
  isAdmin: boolean;
  adminRole?: AdminRole;
  role?: AdminRole;
  isLoading: boolean;
  hasVoted: boolean;
  lastReceipt: BallotReceipt | null;
  signUp: (data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    dateOfBirth: string;
  }) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  simulateVerification: (data: {
    method: 'South Sudan National ID' | 'Passport' | 'Other Approved Identification';
    docNumber: string;
    nationality: string;
    dob: string;
  }) => Promise<{ success: boolean; error?: string }>;
  submitBallotVote: (candidateId: string, candidateName: string, electionName: string) => Promise<BallotReceipt>;
  refreshUserData: () => Promise<void>;
  loginAsDemoVoter: () => Promise<void>;
  loginAsAdmin: (role?: AdminRole) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'sautivote_session_user_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [verification, setVerification] = useState<IdentityVerification | null>(null);
  const [registration, setRegistration] = useState<VoterRegistration | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [lastReceipt, setLastReceipt] = useState<BallotReceipt | null>(null);

  // Initialize session on mount
  useEffect(() => {
    async function initAuth() {
      setIsLoading(true);
      try {
        if (isSupabaseConfigured && realSupabase) {
          const { data } = await realSupabase.auth.getSession();
          if (data?.session?.user) {
            const uid = data.session.user.id;
            const profile = await civicDb.getProfile(uid);
            if (profile) {
              setUser(profile);
              await loadAssociatedData(profile.user_id);
              setIsLoading(false);
              return;
            }
          }
        }

        // Check local storage session
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
        if (storedUser) {
          const parsed = JSON.parse(storedUser) as UserProfile;
          setUser(parsed);
          await loadAssociatedData(parsed.user_id);
        } else {
          // Default initial state: user can browse public pages or click quick demo
        }
      } catch (err) {
        console.error('Auth initialization error', err);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  async function loadAssociatedData(userId: string) {
    const [ver, reg] = await Promise.all([
      civicDb.getIdentityVerification(userId),
      civicDb.getVoterRegistration(userId),
    ]);
    setVerification(ver);
    setRegistration(reg);

    // Check if receipt saved in local storage for this session
    const receiptKey = `sv_receipt_${userId}`;
    const storedReceipt = localStorage.getItem(receiptKey);
    if (storedReceipt) {
      try {
        setLastReceipt(JSON.parse(storedReceipt));
      } catch {
        // ignore
      }
    }
  }

  async function refreshUserData() {
    if (!user) return;
    await loadAssociatedData(user.user_id);
  }

  async function signUp(data: {
    fullName: string;
    email: string;
    phone: string;
    password: string;
    country: string;
    dateOfBirth: string;
  }) {
    setIsLoading(true);
    try {
      let userId = `usr_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

      if (isSupabaseConfigured && realSupabase) {
        const { data: authData, error: authError } = await realSupabase.auth.signUp({
          email: data.email,
          password: data.password,
          options: {
            data: {
              full_name: data.fullName,
              country: data.country,
              phone: data.phone,
            }
          }
        });

        if (authError) {
          return { success: false, error: authError.message };
        }
        if (authData.user) {
          userId = authData.user.id;
        }
      }

      const newProfile: UserProfile = {
        id: `prof_${Date.now()}`,
        user_id: userId,
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        country: data.country,
        date_of_birth: data.dateOfBirth,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_admin: false,
      };

      await civicDb.saveProfile(newProfile);

      // Initial pending voter registration
      const initialReg: VoterRegistration = {
        id: `reg_${Date.now()}`,
        user_id: userId,
        election_id: 'elec_ss_2026_gen',
        registration_status: 'Not Registered',
        eligibility_status: 'Pending Review',
        registered_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      await civicDb.saveVoterRegistration(initialReg);

      setUser(newProfile);
      setRegistration(initialReg);
      setVerification(null);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(newProfile));

      // Audit log
      await civicDb.logAuditEvent({
        event_type: 'System Security Event',
        actor_id: userId,
        actor_name: data.fullName,
        target_id: userId,
        target_description: `New citizen registration: ${data.fullName} (${data.country})`,
        metadata: { country: data.country, email: data.email },
        ip_address: 'Citizen Onboarding Interface',
        result: 'Success',
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Failed to create account. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  }

  async function signIn(email: string, password?: string) {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && realSupabase && password) {
        const { data, error } = await realSupabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) {
          return { success: false, error: error.message };
        }
        if (data.user) {
          const profile = await civicDb.getProfile(data.user.id);
          if (profile) {
            setUser(profile);
            await loadAssociatedData(profile.user_id);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));
            return { success: true };
          }
        }
      }

      // Check if existing profile matches email
      let profile = (await civicDb.getAllVoterRegistrations())
        .map(i => i.profile)
        .find(p => p.email.toLowerCase() === email.toLowerCase());

      if (!profile) {
        // Create demo account for this email on the fly
        const uid = `usr_${Date.now()}`;
        profile = {
          id: `prof_${Date.now()}`,
          user_id: uid,
          full_name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'South Sudanese Citizen',
          email,
          phone: '+211 920 000 000',
          country: 'South Sudan (Domestic)',
          date_of_birth: '1995-07-09',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          is_admin: email.includes('admin'),
          admin_role: email.includes('admin') ? 'election_admin' : undefined,
        };
        await civicDb.saveProfile(profile);
      }

      setUser(profile);
      await loadAssociatedData(profile.user_id);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(profile));

      await civicDb.logAuditEvent({
        event_type: profile.is_admin ? 'Admin Login' : 'System Security Event',
        actor_id: profile.user_id,
        actor_name: profile.full_name,
        target_id: profile.user_id,
        target_description: `User authenticated session (${profile.email})`,
        metadata: { role: profile.admin_role || 'citizen' },
        ip_address: 'Auth Gateway',
        result: 'Success',
      });

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'Email or password is incorrect.' };
    } finally {
      setIsLoading(false);
    }
  }

  async function signOut() {
    setIsLoading(true);
    try {
      if (isSupabaseConfigured && realSupabase) {
        await realSupabase.auth.signOut();
      }
      localStorage.removeItem(AUTH_STORAGE_KEY);
      setUser(null);
      setVerification(null);
      setRegistration(null);
      setLastReceipt(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function simulateVerification(data: {
    method: 'South Sudan National ID' | 'Passport' | 'Other Approved Identification';
    docNumber: string;
    nationality: string;
    dob: string;
  }) {
    if (!user) return { success: false, error: 'User must be signed in to verify identity.' };
    setIsLoading(true);
    try {
      const ver = await civicDb.simulateIdentityVerification(
        user.user_id,
        data.method,
        data.docNumber,
        data.nationality,
        data.dob
      );
      const reg = await civicDb.getVoterRegistration(user.user_id);
      setVerification(ver);
      setRegistration(reg);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || 'We could not complete demo verification. Please check your information.' };
    } finally {
      setIsLoading(false);
    }
  }

  async function submitBallotVote(candidateId: string, candidateName: string, electionName: string): Promise<BallotReceipt> {
    if (!user) throw new Error('You must be logged in to cast a simulated ballot.');
    
    // Step 1: Issue token
    const token = await civicDb.issueAnonymousVotingToken(user.user_id, 'elec_ss_2026_gen');
    
    // Step 2: Submit demo ballot
    const receipt = await civicDb.submitDemoBallot(
      token,
      'elec_ss_2026_gen',
      candidateId,
      candidateName,
      electionName
    );

    setLastReceipt(receipt);
    localStorage.setItem(`sv_receipt_${user.user_id}`, JSON.stringify(receipt));
    return receipt;
  }

  async function loginAsDemoVoter() {
    setIsLoading(true);
    try {
      const demoUser: UserProfile = {
        id: 'prof_demo_voter',
        user_id: 'usr_demo_voter_nairobi',
        full_name: 'Achai Deng Garang',
        email: 'achai.deng@diaspora.sautivote.org',
        phone: '+254 712 345 678',
        country: 'Kenya',
        date_of_birth: '1998-04-16',
        created_at: '2026-02-10T10:00:00Z',
        updated_at: new Date().toISOString(),
        is_admin: false,
      };
      await civicDb.saveProfile(demoUser);

      // Pre-seed with verified status for convenient demo walkthrough
      const now = new Date().toISOString();
      await civicDb.simulateIdentityVerification(
        demoUser.user_id,
        'Passport',
        'SSD-9844201',
        'South Sudanese',
        '1998-04-16'
      );

      setUser(demoUser);
      await loadAssociatedData(demoUser.user_id);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(demoUser));
    } finally {
      setIsLoading(false);
    }
  }

  async function loginAsAdmin(role: AdminRole = 'election_admin') {
    setIsLoading(true);
    try {
      const adminProfile: UserProfile = {
        id: 'prof_admin_super',
        user_id: 'usr_admin_demo',
        full_name: 'Hon. Deng Maker Lual',
        email: 'admin@sautivote.org',
        phone: '+211 912 000 111',
        country: 'South Sudan (Domestic)',
        date_of_birth: '1975-01-01',
        created_at: '2026-01-01T00:00:00Z',
        updated_at: new Date().toISOString(),
        is_admin: true,
        admin_role: role,
      };
      await civicDb.saveProfile(adminProfile);
      setUser(adminProfile);
      await loadAssociatedData(adminProfile.user_id);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(adminProfile));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        verification,
        registration,
        isAdmin: Boolean(user?.is_admin),
        adminRole: user?.admin_role,
        role: user?.admin_role,
        isLoading,
        hasVoted: Boolean(lastReceipt),
        lastReceipt,
        signUp,
        signIn,
        signOut,
        simulateVerification,
        submitBallotVote,
        refreshUserData,
        loginAsDemoVoter,
        loginAsAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
