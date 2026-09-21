export const SUPABASE_SQL_SCHEMA = `-- ==============================================================================
-- SautiVote South Sudan — Civic Election Technology Prototype Schema
-- PostgreSQL & Supabase Database Definition with Row Level Security (RLS)
-- ==============================================================================

-- 1. Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    country TEXT NOT NULL,
    date_of_birth DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Elections Table
CREATE TABLE IF NOT EXISTS public.elections (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    election_type TEXT NOT NULL,
    election_date DATE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('Scheduled', 'Registration Open', 'Voting Open', 'Concluded')),
    description TEXT,
    official_authority TEXT NOT NULL DEFAULT 'National Elections Commission (NEC) of South Sudan',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Voter Registrations Table
CREATE TABLE IF NOT EXISTS public.voter_registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    election_id TEXT NOT NULL REFERENCES public.elections(id) ON DELETE RESTRICT,
    registration_status TEXT NOT NULL DEFAULT 'Not Registered' CHECK (registration_status IN ('Not Registered', 'Pending', 'Verified', 'Suspended')),
    eligibility_status TEXT NOT NULL DEFAULT 'Pending Review' CHECK (eligibility_status IN ('Eligible', 'Ineligible', 'Pending Review')),
    registered_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_user_election_reg UNIQUE(user_id, election_id)
);

-- 4. Identity Verifications Table
CREATE TABLE IF NOT EXISTS public.identity_verifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    verification_status TEXT NOT NULL DEFAULT 'Not Started' CHECK (verification_status IN ('Not Started', 'Pending', 'Verified', 'Rejected', 'Requires Review')),
    verification_method TEXT NOT NULL CHECK (verification_method IN ('South Sudan National ID', 'Passport', 'Other Approved Identification')),
    provider_reference TEXT,
    nationality TEXT DEFAULT 'South Sudanese',
    date_of_birth DATE,
    verified_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    is_simulated BOOLEAN NOT NULL DEFAULT TRUE
);

-- 5. Candidates Table (Neutral, Non-partisan)
CREATE TABLE IF NOT EXISTS public.candidates (
    id TEXT PRIMARY KEY,
    election_id TEXT NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    party_name TEXT NOT NULL,
    photo_url TEXT,
    biography TEXT NOT NULL,
    candidacy_status TEXT NOT NULL DEFAULT 'Publicly Announced' CHECK (candidacy_status IN ('Publicly Announced', 'Under Verification', 'Officially Certified', 'Withdrawn', 'Not Confirmed')),
    public_profile TEXT NOT NULL,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Candidate Sources Table (Factual citations)
CREATE TABLE IF NOT EXISTS public.candidate_sources (
    id TEXT PRIMARY KEY,
    candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE CASCADE,
    source_name TEXT NOT NULL,
    source_url TEXT NOT NULL,
    publication_date DATE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Voting Sessions Table (Ballot Secrecy decoupling)
CREATE TABLE IF NOT EXISTS public.voting_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id TEXT NOT NULL REFERENCES public.elections(id) ON DELETE CASCADE,
    anonymous_token TEXT NOT NULL UNIQUE,
    status TEXT NOT NULL DEFAULT 'Issued' CHECK (status IN ('Issued', 'Used', 'Expired')),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    used_at TIMESTAMPTZ
);

-- 8. Ballots Table (ANONYMIZED - No link to user_id)
CREATE TABLE IF NOT EXISTS public.ballots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    election_id TEXT NOT NULL REFERENCES public.elections(id) ON DELETE RESTRICT,
    anonymous_ballot_id TEXT NOT NULL UNIQUE,
    candidate_id TEXT NOT NULL REFERENCES public.candidates(id) ON DELETE RESTRICT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    receipt_hash TEXT NOT NULL,
    is_demo BOOLEAN NOT NULL DEFAULT TRUE
);

-- 9. Ballot Receipts Table (Cryptographic proof of participation)
CREATE TABLE IF NOT EXISTS public.ballot_receipts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ballot_id UUID NOT NULL REFERENCES public.ballots(id) ON DELETE CASCADE,
    receipt_code TEXT NOT NULL UNIQUE,
    confirmation_hash TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 10. Official Announcements Table
CREATE TABLE IF NOT EXISTS public.official_announcements (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    source_url TEXT,
    category TEXT NOT NULL DEFAULT 'Civic Notice',
    published_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 11. Audit Events Table (Immutable log)
CREATE TABLE IF NOT EXISTS public.audit_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type TEXT NOT NULL,
    actor_id TEXT NOT NULL,
    target_id TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 12. Admin Users Table (Role-based access control)
CREATE TABLE IF NOT EXISTS public.admin_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'election_admin', 'content_admin', 'verification_admin', 'auditor')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT unique_admin_user UNIQUE(user_id)
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voter_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.identity_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.elections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.candidate_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.voting_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ballot_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.official_announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Profiles: Users view and edit their own profile
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Registrations & Verifications: User isolation
CREATE POLICY "Users can view own voter registration"
    ON public.voter_registrations FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view own identity verification"
    ON public.identity_verifications FOR SELECT
    USING (auth.uid() = user_id);

-- Public readable tables (Civic transparency)
CREATE POLICY "Elections are publicly viewable"
    ON public.elections FOR SELECT
    USING (TRUE);

CREATE POLICY "Candidates are publicly viewable"
    ON public.candidates FOR SELECT
    USING (is_published = TRUE);

CREATE POLICY "Candidate sources are publicly viewable"
    ON public.candidate_sources FOR SELECT
    USING (TRUE);

CREATE POLICY "Official announcements are publicly viewable"
    ON public.official_announcements FOR SELECT
    USING (TRUE);

CREATE POLICY "Receipt codes are verifiable by anyone holding code"
    ON public.ballot_receipts FOR SELECT
    USING (TRUE);

-- Strict ballot secrecy: Direct ballot table select is RESTRICTED
-- Ballots must only be inserted via atomic RPC / server function with verified anonymous token
CREATE POLICY "Restrict direct ballot reading"
    ON public.ballots FOR SELECT
    USING (FALSE);

-- Admin tables: Only authenticated users with matching admin_users row
CREATE POLICY "Admins can view audit events"
    ON public.audit_events FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));

CREATE POLICY "Admins can view all registrations"
    ON public.voter_registrations FOR SELECT
    USING (EXISTS (SELECT 1 FROM public.admin_users WHERE user_id = auth.uid()));
`;

export const SUPABASE_SCHEMA_SQL = SUPABASE_SQL_SCHEMA;
