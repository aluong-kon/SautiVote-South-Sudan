export type VerificationStatus = 'Not Started' | 'Pending' | 'Verified' | 'Rejected' | 'Requires Review';

export type RegistrationStatus = 'Not Registered' | 'Pending' | 'Verified' | 'Suspended';

export type CandidacyStatus = 
  | 'Publicly Announced' 
  | 'Under Verification' 
  | 'Officially Certified' 
  | 'Withdrawn' 
  | 'Not Confirmed';

export type AdminRole = 
  | 'super_admin' 
  | 'election_admin' 
  | 'content_admin' 
  | 'verification_admin' 
  | 'auditor';

export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone: string;
  country: string;
  date_of_birth: string;
  created_at: string;
  updated_at: string;
  is_admin?: boolean;
  admin_role?: AdminRole;
}

export interface VoterRegistration {
  id: string;
  user_id: string;
  election_id: string;
  registration_status: RegistrationStatus;
  eligibility_status: 'Eligible' | 'Ineligible' | 'Pending Review';
  registered_at: string;
  updated_at: string;
}

export interface IdentityVerification {
  id: string;
  user_id: string;
  verification_status: VerificationStatus;
  verification_method: 'South Sudan National ID' | 'Passport' | 'Other Approved Identification';
  document_number_masked: string;
  provider_reference: string;
  verified_at: string | null;
  created_at: string;
  nationality: string;
  date_of_birth: string;
  is_simulated: boolean;
}

export interface Election {
  id: string;
  name: string;
  election_type: string;
  election_date: string;
  status: 'Scheduled' | 'Registration Open' | 'Voting Open' | 'Concluded';
  description: string;
  official_authority: string;
  created_at: string;
  updated_at: string;
}

export interface CandidateSource {
  id: string;
  candidate_id: string;
  source_name: string;
  source_url: string;
  publication_date: string;
  description: string;
  created_at: string;
}

export interface Candidate {
  id: string;
  election_id: string;
  full_name: string;
  party_name: string;
  photo_url: string;
  biography: string;
  candidacy_status: CandidacyStatus;
  public_profile: string;
  platform_summary?: string[];
  sources: CandidateSource[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface VotingSession {
  id: string;
  election_id: string;
  anonymous_token: string;
  status: 'Issued' | 'Used' | 'Expired';
  issued_at: string;
  used_at: string | null;
}

export interface Ballot {
  id: string;
  election_id: string;
  anonymous_ballot_id: string;
  candidate_id: string;
  submitted_at: string;
  receipt_hash: string;
  is_demo: boolean;
}

export interface BallotReceipt {
  id: string;
  ballot_id: string;
  receipt_code: string;
  confirmation_hash: string;
  candidate_name_masked?: string;
  election_name: string;
  timestamp: string;
  created_at: string;
  is_demo: boolean;
}

export interface OfficialAnnouncement {
  id: string;
  title: string;
  content: string;
  source_url: string;
  published_at: string;
  category: 'Election Roadmap' | 'Voter Registration' | 'Civic Notice' | 'Security & Transparency';
  created_at: string;
}

export interface AuditEvent {
  id: string;
  event_type: 
    | 'Admin Login' 
    | 'Candidate Creation' 
    | 'Candidate Modification' 
    | 'Announcement Publication' 
    | 'Verification Status Change' 
    | 'Election Configuration Change' 
    | 'Demo Ballot Cast' 
    | 'System Security Event';
  actor_id: string;
  actor_name: string;
  target_id: string;
  target_description: string;
  metadata: Record<string, any>;
  ip_address: string;
  result: 'Success' | 'Failed' | 'Blocked';
  created_at: string;
}

export type AuditLogEvent = AuditEvent;

export interface AdminUser {
  id: string;
  user_id: string;
  email: string;
  name: string;
  role: AdminRole;
  created_at: string;
}

export type ActiveTab = 
  | 'home' 
  | 'election' 
  | 'candidates' 
  | 'candidate-detail'
  | 'how-it-works' 
  | 'security' 
  | 'diaspora' 
  | 'dashboard' 
  | 'verification' 
  | 'voting' 
  | 'receipt' 
  | 'receipt-checker'
  | 'admin';
