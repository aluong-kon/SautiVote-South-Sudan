import React, { useState } from 'react';
import { 
  Globe, 
  MapPin, 
  FileText, 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink, 
  Users, 
  Building, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { DIASPORA_COUNTRIES } from '../../lib/seedData';
import { ActiveTab } from '../../types';

interface DiasporaPageProps {
  setActiveTab: (tab: ActiveTab) => void;
  openAuthModal: (mode: 'login' | 'signup') => void;
}

export const DiasporaPage: React.FC<DiasporaPageProps> = ({ setActiveTab, openAuthModal }) => {
  // Simulator State
  const [selectedCountry, setSelectedCountry] = useState('Kenya');
  const [selectedIdType, setSelectedIdType] = useState('South Sudan Passport');
  const [currentRegStatus, setCurrentRegStatus] = useState('Never Registered');
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const countryData = DIASPORA_COUNTRIES.find(c => c.name === selectedCountry) || DIASPORA_COUNTRIES[0];

  const handleSimulate = (e: React.FormEvent) => {
    e.preventDefault();

    let readiness = 'High Potential';
    let recommendations: string[] = [];
    let consular = countryData.consular_presence || 'Liaison via Regional Embassy';

    if (selectedIdType === 'South Sudan Passport') {
      readiness = 'Eligible for Consular In-Person or Remote Pilot';
      recommendations = [
        'Valid machine-readable passport qualifies for biometric voter roll verification.',
        `Contact Embassy/Consulate in ${countryData.name} during official NEC accreditation window.`,
        'Keep registration receipt safe for polling day issuance.',
      ];
    } else if (selectedIdType === 'National ID') {
      readiness = 'Eligible with Physical Document Inspection';
      recommendations = [
        'National ID card can be validated at recognized South Sudan consular centers.',
        'Ensure ID photo and personal details match the national civil registry database.',
        'Monitor NEC diaspora roll announcements for station locations.',
      ];
    } else if (selectedIdType === 'UNHCR / Refugee Document') {
      readiness = 'Requires Cross-Agency Verification Protocol';
      recommendations = [
        'Participation requires special bilateral protocols between NEC, host government, and UNHCR.',
        'Supplementary affidavit or community elder testimony may be required under special electoral guidelines.',
        'Check with local camp leadership or South Sudan liaison mission.',
      ];
    } else {
      readiness = 'Documentation Renewal Required';
      recommendations = [
        'Apply for emergency passport or consular certificate at the nearest embassy.',
        'Obtain civil registry confirmation from the Directorate of Civil Registry in Juba.',
      ];
    }

    setSimulationResult({
      readiness,
      recommendations,
      consular,
      country: selectedCountry,
      idType: selectedIdType,
      regStatus: currentRegStatus,
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-12">
      
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-800 text-xs font-semibold mb-3 border border-slate-200">
          <Globe className="w-3.5 h-3.5 text-amber-600" />
          Cross-Border Civic Participation
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight font-sans">
          Voting From Anywhere: The South Sudanese Diaspora
        </h1>
        <p className="mt-2 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
          An exploration of the technological, legal, and operational frameworks necessary to enfranchise the millions of South Sudanese citizens living in East Africa, North America, Europe, Australia, and worldwide.
        </p>
      </div>

      {/* Section 1: Why Diaspora Voting Matters */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Why Diaspora Voting Matters
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-600">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900">Constitutional Franchise</h3>
            <p>
              Under democratic constitutional principles, every citizen retains the right to participate in national governance regardless of physical location.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900">Economic & Social Contribution</h3>
            <p>
              The South Sudanese diaspora contributes vital remittances, intellectual capital, and civic advocacy to nation-building and post-conflict reconciliation.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <h3 className="font-bold text-slate-900">Broad Electoral Legitimacy</h3>
            <p>
              Including cross-border voters strengthens peace agreements, guarantees widespread stakeholder consensus, and fosters unity across historical dividing lines.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Interactive Tool
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Diaspora Eligibility Simulator
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Test how different identification documents and country contexts would translate into voting readiness under an official NEC diaspora framework.
          </p>
        </div>

        <form onSubmit={handleSimulate} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Country of Residence
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
            >
              {DIASPORA_COUNTRIES.map((c) => (
                <option key={c.code} value={c.name}>
                  {c.name} ({c.region})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Type of ID Held
            </label>
            <select
              value={selectedIdType}
              onChange={(e) => setSelectedIdType(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
            >
              <option value="South Sudan Passport">South Sudan Passport</option>
              <option value="National ID">South Sudan National ID</option>
              <option value="UNHCR / Refugee Document">UNHCR / Refugee Document</option>
              <option value="Expired / Foreign Document Only">Expired or Foreign ID Only</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Prior Voter Registration
            </label>
            <select
              value={currentRegStatus}
              onChange={(e) => setCurrentRegStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500"
            >
              <option value="Never Registered">Never Registered</option>
              <option value="Registered in South Sudan (2010/2011)">Registered in South Sudan (2010/2011)</option>
              <option value="Registered at Consulate">Registered at Consular Mission</option>
            </select>
          </div>

          <div className="sm:col-span-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-lg text-xs sm:text-sm font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs transition-colors cursor-pointer"
            >
              Run Feasibility Simulation
            </button>
          </div>
        </form>

        {simulationResult && (
          <div className="p-5 rounded-xl bg-slate-50 border border-slate-300 space-y-4 text-xs sm:text-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-200">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Preliminary Readiness:
                </span>
                <div className="font-bold text-base text-slate-900 mt-0.5">
                  {simulationResult.readiness}
                </div>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Jurisdiction Hub:
                </span>
                <div className="font-semibold text-slate-800">
                  {simulationResult.country} • {simulationResult.consular}
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-2">
                Recommended Next Steps for Official Rollout:
              </h4>
              <ul className="space-y-1.5 list-disc pl-4 text-slate-700">
                {simulationResult.recommendations.map((rec: string, i: number) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {/* Section 3: Country Feasibility Analysis */}
      <div className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Regional & Global Diaspora Hubs
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {DIASPORA_COUNTRIES.map((country) => (
            <div
              key={country.code}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 text-base">{country.name}</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                  {country.region}
                </span>
              </div>
              <div className="text-xs text-slate-600 space-y-1">
                <div>
                  <span className="text-slate-400">Estimated Population:</span>{' '}
                  <span className="font-semibold text-slate-800">{country.estimated_population}</span>
                </div>
                <div>
                  <span className="text-slate-400">Consular Hub:</span>{' '}
                  <span className="font-medium text-slate-800">{country.consular_presence}</span>
                </div>
                <div className="pt-1">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${
                    country.feasibility === 'High' ? 'bg-emerald-100 text-emerald-900' :
                    country.feasibility === 'Medium-High' ? 'bg-blue-100 text-blue-900' :
                    'bg-amber-100 text-amber-900'
                  }`}>
                    Feasibility: {country.feasibility}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 4: Legal & Technical Requirements */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          What Would Be Required for an Official Rollout?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm text-slate-700">
          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Building className="w-4 h-4 text-amber-600" />
              1. Statutory & Legal Mandate
            </h3>
            <p className="leading-relaxed">
              The National Elections Act must explicitly empower the NEC to conduct out-of-country voting (OCV). Regulations must govern voter eligibility, registration appeals, and dispute resolution for external polling centers.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-amber-600" />
              2. Host-Country Diplomatic Clearance
            </h3>
            <p className="leading-relaxed">
              Host nations (such as Kenya, Uganda, the US, and Australia) must grant official diplomatic permission for foreign polling stations to operate on their soil, including consular polling and digital participation hubs.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              3. Secure Identity Verification
            </h3>
            <p className="leading-relaxed">
              Consular missions need secure digital terminals connected to the South Sudan civil registry to authenticate biometric passports, national IDs, and certified identity affidavits without paper fraud.
            </p>
          </div>

          <div className="space-y-2">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-600" />
              4. Independent Observer Accreditation
            </h3>
            <p className="leading-relaxed">
              International and domestic observation bodies (e.g., Carter Center, African Union, East African Community) must have unhindered access to inspect digital tally aggregation, cryptographic hash chains, and physical voting centers abroad.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
