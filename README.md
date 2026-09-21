# 🇸🇸 SautiVote South Sudan

### Your Voice. Your Vote. Wherever You Are.

SautiVote South Sudan is an independent **civic-tech prototype** exploring how South Sudanese citizens, including members of the diaspora, could access election information, verify eligibility, and experience digital election participation from wherever they are.

> ⚠️ **IMPORTANT: SautiVote is currently a prototype. It is NOT an official South Sudanese election platform, and its voting functionality is simulated. No vote cast through this prototype is legally valid.**

---

## 🌍 Why SautiVote?

Millions of people live away from their places of origin for different reasons, including work, education, displacement, and migration.

SautiVote explores one question:

> **What could a secure and accessible digital election experience look like for South Sudanese citizens around the world?**

The project focuses on technology, accessibility, identity verification, voter eligibility, ballot privacy, transparency, and security.

---

## 🚀 What the Prototype Includes

### 👤 Citizen Portal

Users can:

* Create an account
* Manage their profile
* Select their country of residence
* Complete simulated identity verification
* Check simulated eligibility
* Access election information
* Explore candidate profiles
* Experience a simulated voting process
* Receive a simulated vote receipt

### 🗳️ Digital Ballot Demo

The prototype demonstrates a possible voting journey:

```text
Create Account
      ↓
Verify Identity
      ↓
Check Eligibility
      ↓
View Election Information
      ↓
Review Candidates
      ↓
Access Demo Ballot
      ↓
Review Selection
      ↓
Submit Demo Vote
      ↓
Receive Demo Receipt
```

### 🏛️ Administration Portal

The prototype includes an administration interface for managing:

* Elections
* Candidates
* Candidate information
* Election announcements
* Verification records
* System activity
* Audit events

---

## 🔐 Security Principles

SautiVote is designed around several core security principles:

* 🔒 Secure authentication
* 🪪 Identity verification
* ✅ Eligibility verification
* 🗳️ Ballot secrecy
* 🔑 Role-based authorization
* 📋 Audit logging
* 🛡️ Fraud-prevention concepts
* 🔐 Separation of voter identity and ballot information
* 📊 Transparent election information

A production election system would require substantially more than a web application, including independent cybersecurity audits, penetration testing, cryptographic review, legal authorization, operational controls, and election-authority infrastructure.

---

## 🧩 Technology Stack

### Frontend

* React
* TypeScript
* Tailwind CSS
* shadcn/ui

### Backend

* Supabase
* PostgreSQL
* Supabase Authentication
* Row Level Security

### Architecture

```text
User
 │
 ▼
SautiVote Web App
 │
 ├── Authentication
 ├── Voter Profile
 ├── Verification
 ├── Election Information
 ├── Candidate Directory
 └── Demo Voting
        │
        ▼
     Supabase
        │
        ├── PostgreSQL
        ├── Authentication
        ├── Row Level Security
        └── Audit Records
```

---

## 🗄️ Core Database Structure

The prototype uses concepts such as:

```text
profiles
voter_registrations
identity_verifications
elections
candidates
candidate_sources
voting_sessions
ballots
ballot_receipts
official_announcements
audit_events
admin_users
```

A key architectural principle is to avoid unnecessarily creating a direct relationship between a person's identity and their ballot selection.

---

## 🌍 Diaspora Concept

SautiVote explores a potential digital participation experience for eligible South Sudanese citizens living outside the country.

Example flow:

```text
Select Country
      ↓
Create Account
      ↓
Identity Verification
      ↓
Eligibility Check
      ↓
Voting Authorization
      ↓
Digital Ballot
      ↓
Vote
      ↓
Receipt
```

However, whether South Sudanese citizens can vote digitally from abroad—and under what procedures—is ultimately a matter for applicable law and the competent election authorities.

---

## 👥 Candidate Information

The candidate section is designed to present political information neutrally.

Candidate profiles can contain:

* Name
* Political party
* Biography
* Publicly stated platform
* Candidacy status
* Sources
* Date information was updated

SautiVote does **not**:

* Rank candidates
* Recommend candidates
* Score candidates
* Predict election results
* Promote a political party
* Tell voters who to support

Candidate information should be verified against authoritative or reputable sources before being presented as official.

---

## ⚠️ Legal & Civic Disclaimer

SautiVote South Sudan is an independent technology prototype.

It is **not operated by, affiliated with, or endorsed by the South Sudan National Elections Commission unless explicitly stated by that authority.**

The prototype does not:

* Register voters for an official election
* Determine legal voter eligibility
* Certify candidates
* Conduct a legally valid election
* Submit votes to an election authority
* Replace official election procedures

The simulated voting functionality exists solely to demonstrate the potential user experience and technical architecture.

---

## 🎯 Project Goals

SautiVote aims to explore how technology could potentially improve:

* Accessibility
* Civic participation
* Election information access
* Voter education
* Identity verification
* Transparency
* Digital inclusion
* Diaspora engagement

The project is intended to encourage discussion among technologists, researchers, civic organizations, policymakers, election professionals, and citizens.

---

## 🛣️ Future Development

Potential future areas include:

* Official election-authority integration
* Stronger identity verification
* Cryptographic ballot architecture
* End-to-end verifiability
* Independent security audits
* Accessibility improvements
* Multilingual support
* Low-bandwidth mode
* SMS/USSD integration
* Diaspora registration workflows
* Election monitoring tools
* Public election-information APIs

These features would only be appropriate for real electoral use following the necessary legal, institutional, technical, and security approvals.

---

## 🤝 Contributing

Contributions are welcome from developers, designers, cybersecurity researchers, civic-tech practitioners, data analysts, election experts, and researchers.

Potential contribution areas:

* UI/UX
* Accessibility
* Cybersecurity
* Database architecture
* Election technology research
* Data visualization
* Mobile development
* Documentation
* Localization

Before submitting major changes, please open an issue describing the proposed contribution.

---

## 📌 Project Status

**Status:** 🚧 Prototype / MVP

**Voting:** 🧪 Simulated

**Production election use:** ❌ Not authorized

**Purpose:** Civic-tech research and demonstration

---

## 📜 License

Add the project's chosen open-source license here before publishing the repository.

---

## 🇸🇸 SautiVote

**Technology can connect people to information.
Democracy requires trusted institutions, secure systems, and informed citizens.**

**Your Voice. Your Vote. Wherever You Are.**
