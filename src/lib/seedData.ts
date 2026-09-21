import { Election, Candidate, OfficialAnnouncement, AuditEvent, AdminUser } from '../types';

export const SEED_ELECTIONS: Election[] = [
  {
    id: 'elec_ss_2026_gen',
    name: 'South Sudan General Election',
    election_type: 'Presidential & Legislative General Election',
    election_date: '2026-12-22',
    status: 'Scheduled',
    description: 'General election to elect the President of the Republic of South Sudan, members of the National Legislative Assembly, Council of States, and state governorships pursuant to the political roadmap and official announcements.',
    official_authority: 'National Elections Commission (NEC) of South Sudan',
    created_at: '2026-01-15T08:00:00Z',
    updated_at: '2026-09-01T10:00:00Z',
  }
];

export const SEED_CANDIDATES: Candidate[] = [
  {
    id: 'cand_salva_kiir',
    election_id: 'elec_ss_2026_gen',
    full_name: 'Salva Kiir Mayardit',
    party_name: 'Sudan People\'s Liberation Movement (SPLM)',
    photo_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&auto=format&fit=crop&q=80',
    biography: 'Current President of the Republic of South Sudan since independence in July 2011, and former President of the Government of Southern Sudan from 2005 to 2011. Officially endorsed by the SPLM National Liberation Council as the party flagbearer for the upcoming general election.',
    candidacy_status: 'Publicly Announced',
    public_profile: 'Incumbent President seeking confirmation of democratic mandate. SPLM party convention in Juba endorsed his candidacy for the presidential contest.',
    platform_summary: [
      'Implementation of the Revitalised Agreement (R-ARCSS) security and institutional benchmarks',
      'Economic diversification, oil revenue accountability, and infrastructure expansion',
      'Consolidation of national unity, constitutional finalization, and democratic transition'
    ],
    sources: [
      {
        id: 'src_sk_1',
        candidate_id: 'cand_salva_kiir',
        source_name: 'Radio Tamazuj Civic News Archive',
        source_url: 'https://radiotamazuj.org/en/news/article/splm-endorses-salva-kiir-as-sole-presidential-candidate',
        publication_date: '2023-12-08',
        description: 'SPLM National Liberation Council officially endorses President Salva Kiir Mayardit as flagbearer.',
        created_at: '2026-01-10T00:00:00Z'
      },
      {
        id: 'src_sk_2',
        candidate_id: 'cand_salva_kiir',
        source_name: 'South Sudan National Elections Commission (NEC) Press Release',
        source_url: 'https://nec.gov.ss/press/general-election-announcements',
        publication_date: '2024-07-15',
        description: 'Public notifications regarding political party registrations and initial contender submissions.',
        created_at: '2026-01-10T00:00:00Z'
      }
    ],
    is_published: true,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-09-15T00:00:00Z',
  },
  {
    id: 'cand_riek_machar',
    election_id: 'elec_ss_2026_gen',
    full_name: 'Dr. Riek Machar Teny',
    party_name: 'Sudan People\'s Liberation Movement-in-Opposition (SPLM-IO)',
    photo_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
    biography: 'First Vice President of South Sudan under the Revitalised Transitional Government of National Unity (RTGoNU) and Chairman of the SPLM-IO. Holds a doctorate in strategic planning and has been a central political leader in South Sudanese governance for over three decades.',
    candidacy_status: 'Publicly Announced',
    public_profile: 'Has publicly reaffirmed intent to contest pending fulfillment of core peace agreement preconditions, including unified armed forces deployment, permanent constitution-making, and credible voter census.',
    platform_summary: [
      'Comprehensive security sector reform and full unification of armed forces before polling',
      'Establishment of an independent permanent constitution and judicial electoral tribunals',
      'Transparent resource governance, federal state devolution, and refugee repatriation guarantees'
    ],
    sources: [
      {
        id: 'src_rm_1',
        candidate_id: 'cand_riek_machar',
        source_name: 'Sudans Post Political Monitor',
        source_url: 'https://sudanspost.com/riek-machar-reaffirms-splm-io-stand-on-elections-and-prerequisites/',
        publication_date: '2024-03-22',
        description: 'Press statement on SPLM-IO prerequisites for free, credible and democratic elections.',
        created_at: '2026-01-10T00:00:00Z'
      },
      {
        id: 'src_rm_2',
        candidate_id: 'cand_riek_machar',
        source_name: 'United Nations Mission in South Sudan (UNMISS) Briefing',
        source_url: 'https://unmiss.unmissions.org/electoral-briefings-political-parties',
        publication_date: '2024-06-18',
        description: 'Multi-party dialogue records on constitutional timelines and presidential contest readiness.',
        created_at: '2026-01-10T00:00:00Z'
      }
    ],
    is_published: true,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-09-15T00:00:00Z',
  },
  {
    id: 'cand_pagan_amum',
    election_id: 'elec_ss_2026_gen',
    full_name: 'Pagan Amum Okiech',
    party_name: 'Real SPLM / Opposition Coalition',
    photo_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80',
    biography: 'Former Secretary-General of the SPLM, former Minister for Peace and CPA Implementation, and veteran civil leader. Currently leads the Real SPLM and is an active leader in the South Sudan Opposition Movements Alliance (SSOMA) and the Tumaini Peace Initiative.',
    candidacy_status: 'Publicly Announced',
    public_profile: 'Public political contender advocating for a new social contract, constitutional governance, diaspora voting inclusion, and institutional rebuilding outside transitional deadlock.',
    platform_summary: [
      'Inclusive national dialogue and consensus-driven social contract for lasting peace',
      'Universal diaspora enfranchisement and secure digital civic participation for refugees',
      'Independent anti-corruption mechanisms, civic education, and institutional checks on executive power'
    ],
    sources: [
      {
        id: 'src_pa_1',
        candidate_id: 'cand_pagan_amum',
        source_name: 'The East African Civic Affairs',
        source_url: 'https://www.theeastafrican.co.ke/tea/news/east-africa/pagan-amum-on-south-sudan-democratic-transition',
        publication_date: '2024-05-14',
        description: 'Interview with Pagan Amum outlining reform priorities for South Sudanese citizens worldwide.',
        created_at: '2026-01-10T00:00:00Z'
      }
    ],
    is_published: true,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-09-15T00:00:00Z',
  },
  {
    id: 'cand_suzanne_jambo',
    election_id: 'elec_ss_2026_gen',
    full_name: 'Suzanne Jambo',
    party_name: 'Independent / Steps Ahead',
    photo_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&auto=format&fit=crop&q=80',
    biography: 'South Sudanese lawyer, human rights defender, and former SPLM Secretary for External Relations. She was the first South Sudanese woman to publicly declare an intention to contest the presidency as an independent civil rights reformer.',
    candidacy_status: 'Publicly Announced',
    public_profile: 'Advocate for women’s representation, constitutional rule of law, anti-nepotism reforms, and civic mobilization across both South Sudan and diaspora communities.',
    platform_summary: [
      'Constitutional enforcement of the 35% minimum affirmative action quota for women across all branches',
      'Rule of law, civic space protection, independent judiciary, and protection of journalistic freedoms',
      'Grassroots economic development programs, youth vocational innovation, and healthcare reform'
    ],
    sources: [
      {
        id: 'src_sj_1',
        candidate_id: 'cand_suzanne_jambo',
        source_name: 'BBC Focus on Africa Profile',
        source_url: 'https://www.bbc.com/news/world-africa-suzanne-jambo-presidential-bid',
        publication_date: '2023-11-20',
        description: 'Coverage of Suzanne Jambo\'s candidacy announcement and civil society platform.',
        created_at: '2026-01-10T00:00:00Z'
      }
    ],
    is_published: true,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-09-15T00:00:00Z',
  },
  {
    id: 'cand_lam_akol',
    election_id: 'elec_ss_2026_gen',
    full_name: 'Dr. Lam Akol Ajawin',
    party_name: 'National Democratic Movement (NDM)',
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&auto=format&fit=crop&q=80',
    biography: 'Leader of the National Democratic Movement (NDM), signatory to the 2018 Revitalised Peace Agreement, and former foreign minister. A chemical engineering scholar and author of multiple treatises on South Sudanese political history.',
    candidacy_status: 'Under Verification',
    public_profile: 'Political contender emphasizing rigorous constitutional order, multi-party parliamentary democracy, civil service depoliticization, and electoral integrity safeguards.',
    platform_summary: [
      'Strict adherence to legislative scrutiny and constitutional separation of powers',
      'Professionalization and depoliticization of the national civil service and judiciary',
      'Public fiscal accountability, inflation stabilization, and equitable resource sharing between states'
    ],
    sources: [
      {
        id: 'src_la_1',
        candidate_id: 'cand_lam_akol',
        source_name: 'Eye Radio Juba Governance Coverage',
        source_url: 'https://eyeradio.org/ndm-dr-lam-akol-position-on-electoral-readiness',
        publication_date: '2024-08-04',
        description: 'Dr. Lam Akol remarks on technical preparedness, civic registers, and boundary demarcations.',
        created_at: '2026-01-10T00:00:00Z'
      }
    ],
    is_published: true,
    created_at: '2026-01-10T00:00:00Z',
    updated_at: '2026-09-15T00:00:00Z',
  }
];

export const SEED_ANNOUNCEMENTS: OfficialAnnouncement[] = [
  {
    id: 'ann_1',
    title: 'National Elections Commission (NEC) Electoral Roadmap Update',
    content: 'The National Elections Commission released its consolidated operational timeline outlining milestones for voter education, preliminary voter roll collation, and stakeholder engagements ahead of the scheduled December 2026 general election.',
    source_url: 'https://nec.gov.ss/announcements/roadmap-2026',
    published_at: '2026-09-10T09:00:00Z',
    category: 'Election Roadmap',
    created_at: '2026-09-10T09:00:00Z',
  },
  {
    id: 'ann_2',
    title: 'Civic Notice: Clarification Regarding Digital Prototypes vs. Official Procedures',
    content: 'Citizens are advised that all official voter registration cards and certified ballots will be administered exclusively through designated NEC centers and officially Gazetted registration regulations. Digital civic demonstration platforms serve informational and educational roles only.',
    source_url: 'https://nec.gov.ss/press/civic-education-notices',
    published_at: '2026-08-28T14:30:00Z',
    category: 'Civic Notice',
    created_at: '2026-08-28T14:30:00Z',
  },
  {
    id: 'ann_3',
    title: 'Feasibility Study on South Sudanese Diaspora Voter Participation',
    content: 'Civic researchers and electoral observation groups in East Africa released recommendations regarding logistics, diplomatic consular voter hubs, and legal protections needed to enfranchise South Sudanese living in Kenya, Uganda, Sudan, Ethiopia, and worldwide.',
    source_url: 'https://sudancivicresearch.org/diaspora-voting-feasibility-2026',
    published_at: '2026-07-15T11:00:00Z',
    category: 'Voter Registration',
    created_at: '2026-07-15T11:00:00Z',
  },
  {
    id: 'ann_4',
    title: 'Technical Standards on Ballot Secrecy and Cryptographic Receipt Verifiability',
    content: 'The SautiVote engineering committee published a civic security brief explaining the architectural separation between voter registration records and ballot storage, preventing any administrative mapping from identity to voter choice.',
    source_url: 'https://sautivote.org/security/ballot-secrecy-whitepaper',
    published_at: '2026-06-02T16:00:00Z',
    category: 'Security & Transparency',
    created_at: '2026-06-02T16:00:00Z',
  }
];

export const DIASPORA_COUNTRIES = [
  { code: 'SS', name: 'South Sudan (Domestic)', region: 'East Africa', diasporaHub: 'Juba / State Capitals', estimatedCitizens: 'Domestic Electorate', estimated_population: '11,000,000 (Resident)', consular_presence: 'NEC Domestic Polling Centers', feasibility: 'High' },
  { code: 'KE', name: 'Kenya', region: 'East Africa', diasporaHub: 'Nairobi, Kakuma, Eldoret', estimatedCitizens: '250,000+', estimated_population: '250,000+', consular_presence: 'Embassy Nairobi & Kakuma Field Office', feasibility: 'High' },
  { code: 'UG', name: 'Uganda', region: 'East Africa', diasporaHub: 'Kampala, Adjumani, Bidi Bidi', estimatedCitizens: '800,000+', estimated_population: '800,000+', consular_presence: 'Embassy Kampala & West Nile Consulates', feasibility: 'High' },
  { code: 'ET', name: 'Ethiopia', region: 'Horn of Africa', diasporaHub: 'Addis Ababa, Gambella', estimatedCitizens: '350,000+', estimated_population: '350,000+', consular_presence: 'Embassy Addis Ababa & Gambella Liaison', feasibility: 'Medium-High' },
  { code: 'SD', name: 'Sudan', region: 'North/East Africa', diasporaHub: 'Khartoum, Port Sudan, Kosti', estimatedCitizens: '400,000+', estimated_population: '400,000+', consular_presence: 'Consular Contingency in Port Sudan', feasibility: 'Medium' },
  { code: 'EG', name: 'Egypt', region: 'North Africa', diasporaHub: 'Cairo, Alexandria', estimatedCitizens: '80,000+', estimated_population: '80,000+', consular_presence: 'Embassy in Cairo', feasibility: 'Medium-High' },
  { code: 'US', name: 'United States', region: 'North America', diasporaHub: 'Omaha, Des Moines, San Diego, Dallas', estimatedCitizens: '100,000+', estimated_population: '100,000+', consular_presence: 'Embassy Washington DC', feasibility: 'Medium-High' },
  { code: 'CA', name: 'Canada', region: 'North America', diasporaHub: 'Calgary, Toronto, Edmonton', estimatedCitizens: '40,000+', estimated_population: '40,000+', consular_presence: 'Consular Services (High Commission)', feasibility: 'Medium-High' },
  { code: 'AU', name: 'Australia', region: 'Oceania', diasporaHub: 'Melbourne, Sydney, Perth', estimatedCitizens: '35,000+', estimated_population: '35,000+', consular_presence: 'Consular Liaison via Canberra', feasibility: 'Medium' },
  { code: 'GB', name: 'United Kingdom', region: 'Europe', diasporaHub: 'London, Manchester, Birmingham', estimatedCitizens: '20,000+', estimated_population: '20,000+', consular_presence: 'Embassy in London', feasibility: 'Medium' },
  { code: 'OTHER', name: 'Other International Territory', region: 'Global', diasporaHub: 'Consular / Online Exploration', estimatedCitizens: 'Global', estimated_population: '50,000+ Distributed', consular_presence: 'Regional Accredited Missions', feasibility: 'Medium' },
];

export const SEED_AUDIT_EVENTS: AuditEvent[] = [
  {
    id: 'aud_init_1',
    event_type: 'Election Configuration Change',
    actor_id: 'sys_root_admin',
    actor_name: 'Chief Electoral Systems Auditor',
    target_id: 'elec_ss_2026_gen',
    target_description: 'Initialized Election Configuration: South Sudan General Election 2026',
    metadata: { electionDate: '2026-12-22', authority: 'National Elections Commission (NEC)' },
    ip_address: '197.156.78.12 (Juba Secure Gateway)',
    result: 'Success',
    created_at: '2026-09-01T08:00:00Z',
  },
  {
    id: 'aud_init_2',
    event_type: 'Candidate Creation',
    actor_id: 'sys_content_admin',
    actor_name: 'Civic Content Administrator',
    target_id: 'cand_salva_kiir',
    target_description: 'Registered Public Contender: Salva Kiir Mayardit (SPLM)',
    metadata: { candidacyStatus: 'Publicly Announced', neutralSourcesCount: 2 },
    ip_address: '197.156.78.14 (Juba Gateway)',
    result: 'Success',
    created_at: '2026-09-02T10:15:00Z',
  },
  {
    id: 'aud_init_3',
    event_type: 'Candidate Creation',
    actor_id: 'sys_content_admin',
    actor_name: 'Civic Content Administrator',
    target_id: 'cand_riek_machar',
    target_description: 'Registered Public Contender: Dr. Riek Machar Teny (SPLM-IO)',
    metadata: { candidacyStatus: 'Publicly Announced', neutralSourcesCount: 2 },
    ip_address: '197.156.78.14 (Juba Gateway)',
    result: 'Success',
    created_at: '2026-09-02T10:30:00Z',
  },
  {
    id: 'aud_init_4',
    event_type: 'System Security Event',
    actor_id: 'sys_secrecy_guard',
    actor_name: 'Cryptographic Privacy Daemon',
    target_id: 'voting_sessions_pipeline',
    target_description: 'Verified Zero-Knowledge Voter ID to Ballot Separation Protocol',
    metadata: { algorithm: 'SHA-256 + Token Blind Signatures', mappingLeaks: 0 },
    ip_address: '10.0.0.1 (Kernel Enclave)',
    result: 'Success',
    created_at: '2026-09-18T14:22:00Z',
  }
];

export const SEED_ADMIN_USERS: AdminUser[] = [
  {
    id: 'adm_1',
    user_id: 'usr_admin_demo',
    email: 'admin@sautivote.org',
    name: 'Hon. Deng Maker Lual',
    role: 'super_admin',
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'adm_2',
    user_id: 'usr_election_admin',
    email: 'elections@sautivote.org',
    name: 'Mary Nyandeng Gatwech',
    role: 'election_admin',
    created_at: '2026-02-15T00:00:00Z',
  },
  {
    id: 'adm_3',
    user_id: 'usr_auditor',
    email: 'auditor@sautivote.org',
    name: 'David Taban Wol',
    role: 'auditor',
    created_at: '2026-03-01T00:00:00Z',
  }
];
