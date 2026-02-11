'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Sparkles, RefreshCw, Copy, Check, GraduationCap, Leaf, Bug, FlaskConical,
  Microscope, ChevronDown, ChevronUp, Star, Trash2, FileText, Search,
  DollarSign, BookOpen, Beaker, ShieldCheck, AlertCircle, X
} from 'lucide-react';

// ─── Constants ───
const FOCUS_AREAS = [
  { id: 'plant', label: 'Plant-Based Antimicrobials', icon: '🌿' },
  { id: 'amr', label: 'Antimicrobial Resistance', icon: '🦠' },
  { id: 'food', label: 'Food & Environmental', icon: '🍽️' },
  { id: 'clinical', label: 'Clinical Isolates', icon: '🏥' },
];

const BACTERIA = [
  { id: 'staph', name: 'S. aureus', full: 'Staphylococcus aureus', anaerobe: false },
  { id: 'ecoli', name: 'E. coli', full: 'Escherichia coli', anaerobe: false },
  { id: 'kleb', name: 'Klebsiella', full: 'Klebsiella pneumoniae', anaerobe: false },
  { id: 'pseudo', name: 'Pseudomonas', full: 'Pseudomonas aeruginosa', anaerobe: false },
  { id: 'entero', name: 'Enterococcus', full: 'Enterococcus species', anaerobe: false },
  { id: 'acineto', name: 'Acinetobacter', full: 'Acinetobacter baumannii', anaerobe: false },
  { id: 'proteus', name: 'Proteus', full: 'Proteus mirabilis', anaerobe: false },
  { id: 'salm', name: 'Salmonella', full: 'Salmonella species', anaerobe: false },
  { id: 'strep', name: 'Streptococcus', full: 'Streptococcus species', anaerobe: false },
  { id: 'candida', name: 'Candida', full: 'Candida species', anaerobe: false },
  { id: 'clostridium', name: 'Clostridium', full: 'Clostridium species', anaerobe: true },
  { id: 'bacteroides', name: 'Bacteroides', full: 'Bacteroides fragilis', anaerobe: true },
  { id: 'prevotella', name: 'Prevotella', full: 'Prevotella species', anaerobe: true },
  { id: 'peptostrep', name: 'Peptostrep', full: 'Peptostreptococcus', anaerobe: true },
  { id: 'fuso', name: 'Fusobacterium', full: 'Fusobacterium species', anaerobe: true },
];

const DEMOGRAPHICS = [
  { id: 'general', label: 'General Population' },
  { id: 'pediatric', label: 'Pediatric' },
  { id: 'maternal', label: 'Maternal' },
  { id: 'elderly', label: 'Elderly' },
  { id: 'immunocomp', label: 'Immunocompromised' },
  { id: 'neonatal', label: 'Neonatal' },
];

const RESOURCE_LEVELS = [
  { id: 'basic', label: 'Basic Lab', desc: 'Culture, Gram stain, biochemical tests' },
  { id: 'intermediate', label: 'Well-Equipped', desc: 'PCR, spectrophotometer, ELISA' },
  { id: 'advanced', label: 'Advanced', desc: 'Sequencing, mass spec' },
];

const BUDGET_CAPS = [
  { value: 'any', label: 'Any budget' },
  { value: '300000', label: 'Under ₦300K' },
  { value: '500000', label: 'Under ₦500K' },
  { value: '800000', label: 'Under ₦800K' },
];

const SUPPLIERS = [
  {
    name: 'Finlab Nigeria Limited',
    specialty: 'Full range — reagents, media, equipment, glassware',
    address: '4, Alhaji Adejumo Avenue, Ilupeju Industrial Scheme, Off Anthony-Oshodi Expressway, Lagos',
    phone: '+234 813 575 1930, +234 807 979 2386',
    email: 'sales@finlabnigeria.com',
    website: 'https://finlabnigeria.com',
    notes: 'Established 1981. Major stockist for universities. Has Abuja & Owerri branches.',
  },
  {
    name: 'Koeman Integrated Services',
    specialty: 'Culture media, chemicals, reagents, medical consumables',
    address: '587, Agege Motor Road, Shogunle, Ikeja, Lagos',
    phone: '+234 708 431 8797',
    email: 'info@koemanits.com',
    website: 'https://koemanits.com',
    notes: 'ISO 9001 Certified. Thermo Fisher partner. Good for Oxoid/Biolab media.',
  },
  {
    name: 'Allschoolabs Scientific',
    specialty: 'Lab equipment, glassware, reagents, chemical analysis',
    address: '104 Western Avenue, Ojuelegba, Lagos',
    phone: '+234 816 338 3206, +234 901 770 5105',
    email: 'Contact via website',
    website: 'https://allschoolabs.com',
    notes: 'Also does equipment maintenance and lab renovations.',
  },
  {
    name: 'Pascal Scientific Limited',
    specialty: 'Scientific equipment, reagents, lab installation',
    address: 'Lagos (multiple locations)',
    phone: 'Contact via website',
    website: 'https://pascalscientific.com',
    notes: 'Also known as Delson Pascal. Shimadzu, Thermo Fisher authorized distributor.',
  },
  {
    name: 'Regino Medicals',
    specialty: 'HiMedia products — culture media & antibiotic discs',
    address: 'Lagos',
    phone: 'Contact via website',
    notes: 'HiMedia products are more affordable than imported Oxoid/Abtek discs.',
  },
];

const SERVICES = [
  {
    name: 'NIMR Central Research Laboratory',
    description: 'Nigerian Institute of Medical Research offers molecular services including sequencing and HPLC analysis at institutional rates.',
    address: '6, Edmond Crescent, Off Murtala Mohammed Way, Yaba, Lagos',
    phone: '+234 803 381 0466',
    email: 'centralresearchlab@nimr.gov.ng',
    pricing: 'Sequencing ~₦6,000/primer, HPLC ~₦3,000-20,000/sample depending on reagents.',
  },
];

const GRANTS = [
  { name: 'TETFund', type: 'Nigerian', desc: 'Tertiary Education Trust Fund — institution-based research grants', url: 'https://tetfund.gov.ng' },
  { name: 'NRF', type: 'Nigerian', desc: 'National Research Fund — competitive grants for Nigerian researchers', url: 'https://nrf.gov.ng' },
  { name: 'PTDF', type: 'Nigerian', desc: 'Petroleum Technology Development Fund — postgraduate research', url: 'https://ptdf.gov.ng' },
  { name: 'Wellcome Trust', type: 'International', desc: 'African-based researchers eligible for various fellowship programs', url: 'https://wellcome.org' },
  { name: 'NIH Fogarty', type: 'International', desc: 'Fogarty International Center — training and research in LMICs', url: 'https://www.fic.nih.gov' },
  { name: 'EDCTP', type: 'International', desc: 'European & Developing Countries Clinical Trials Partnership', url: 'https://www.edctp.org' },
  { name: 'Grand Challenges Africa', type: 'International', desc: 'Innovation grants for African health challenges', url: 'https://gcafrica.org' },
  { name: 'GARDP', type: 'AMR-specific', desc: 'Global Antibiotic R&D Partnership — AMR-focused funding', url: 'https://gardp.org' },
];

const STORAGE_KEY = 'microbio-research-gen-v2';

// ─── Helper to persist state ───
function usePersistedState(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(key);
      if (saved) setValue(JSON.parse(saved));
    } catch {}
    setLoaded(true);
  }, [key]);

  useEffect(() => {
    if (loaded) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
    }
  }, [key, value, loaded]);

  return [value, setValue, loaded];
}

// ─── Main Component ───
export default function ResearchTopicGenerator() {
  // Filters
  const [selectedAreas, setSelectedAreas] = useState(['plant', 'amr']);
  const [selectedBacteria, setSelectedBacteria] = useState([]);
  const [selectedDemographic, setSelectedDemographic] = useState('general');
  const [resourceLevel, setResourceLevel] = useState('basic');
  const [numTopics, setNumTopics] = useState(5);
  const [maxBudget, setMaxBudget] = useState('any');
  const [customNotes, setCustomNotes] = useState('');
  const [customFocusArea, setCustomFocusArea] = useState('');
  const [customBacteria, setCustomBacteria] = useState('');
  const [showBacteriaFilter, setShowBacteriaFilter] = useState(false);

  // Generated & approved
  const [topics, setTopics] = useState([]);
  const [approvedTopics, setApprovedTopics, approvedLoaded] = usePersistedState(`${STORAGE_KEY}-approved`, []);
  const [topicHistory, setTopicHistory, historyLoaded] = usePersistedState(`${STORAGE_KEY}-history`, []);

  // UI state
  const [activeTab, setActiveTab] = useState('generate');
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState('');
  const [error, setError] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState(null);
  const [checkingUniqueness, setCheckingUniqueness] = useState(null);
  const [generatingProposal, setGeneratingProposal] = useState(null);
  const [proposalModal, setProposalModal] = useState(null);

  // Budget tab
  const [selectedBudgetProjects, setSelectedBudgetProjects] = useState([]);
  const [budgetFilter, setBudgetFilter] = useState({ costLevel: 'all', molecular: 'all', bacteria: 'all' });

  // ─── API Calls ───
  const generateTopics = async () => {
    if (selectedAreas.length === 0) {
      setError('Please select at least one focus area');
      return;
    }
    setLoading(true);
    setError(null);
    setTopics([]);

    try {
      const batchSize = 5;
      const batches = Math.ceil(numTopics / batchSize);
      let allTopics = [];

      for (let i = 0; i < batches; i++) {
        const remaining = numTopics - allTopics.length;
        const count = Math.min(batchSize, remaining);
        setLoadingProgress(`Generating topics ${allTopics.length + 1}–${allTopics.length + count} of ${numTopics}...`);

        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selectedAreas,
            selectedBacteria,
            selectedDemographic,
            resourceLevel,
            numTopics: count,
            maxBudget,
            customNotes,
            customFocusArea,
            customBacteria,
            existingTitles: allTopics.map(t => t.title),
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Generation failed');

        allTopics = [...allTopics, ...(data.topics || [])];
        setTopics([...allTopics]);
      }

      // Save to history
      setTopicHistory(prev => [
        { date: new Date().toISOString(), count: allTopics.length, areas: [...selectedAreas] },
        ...prev.slice(0, 49),
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
      setLoadingProgress('');
    }
  };

  const regenerateTopic = async (index) => {
    setRegeneratingIndex(index);
    try {
      const current = topics[index];
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentTitle: current.title,
          focusArea: current.focusArea,
          resourceLevel,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTopics(prev => { const u = [...prev]; u[index] = data; return u; });
    } catch (err) {
      setError(err.message);
    } finally {
      setRegeneratingIndex(null);
    }
  };

  const checkUniqueness = async (index, isApproved = false) => {
    setCheckingUniqueness(index);
    try {
      const list = isApproved ? approvedTopics : topics;
      const topic = list[index];
      const res = await fetch('/api/uniqueness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: topic.title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      const updater = (prev) => {
        const u = [...prev];
        u[index] = { ...u[index], uniquenessCheck: data };
        return u;
      };
      if (isApproved) setApprovedTopics(updater);
      else setTopics(updater);
    } catch (err) {
      setError(err.message);
    } finally {
      setCheckingUniqueness(null);
    }
  };

  const generateProposal = async (topic) => {
    setGeneratingProposal(topic.title);
    try {
      const res = await fetch('/api/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProposalModal({ title: topic.title, text: data.proposal });
    } catch (err) {
      setError(err.message);
    } finally {
      setGeneratingProposal(null);
    }
  };

  const approveTopic = (index) => {
    const topic = topics[index];
    setApprovedTopics(prev => [...prev, { ...topic, approvedAt: new Date().toISOString() }]);
    setTopics(prev => prev.filter((_, i) => i !== index));
  };

  const removeApproved = (index) => {
    setApprovedTopics(prev => prev.filter((_, i) => i !== index));
  };

  const copyTopic = (topic, index) => {
    const text = `${topic.title}\n\n${topic.description}\n\nObjectives:\n${(topic.objectives || []).map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nMethodology: ${topic.methodology}\n\nSample: ${topic.sampleType} from ${topic.sampleSource}, n=${topic.sampleSize}\n\nKeywords: ${(topic.keywords || []).join(', ')}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // ─── Budget Analysis ───
  const getAnalysisProjects = useCallback(() => {
    let projects = approvedTopics.filter(t => t.estimatedCost);
    if (budgetFilter.costLevel !== 'all') projects = projects.filter(t => t.estimatedCost?.costLevel === budgetFilter.costLevel);
    if (budgetFilter.molecular !== 'all') projects = projects.filter(t => budgetFilter.molecular === 'yes' ? t.estimatedCost?.hasMolecular : !t.estimatedCost?.hasMolecular);
    if (budgetFilter.bacteria !== 'all') projects = projects.filter(t => t.bacteria?.toLowerCase().includes(budgetFilter.bacteria.toLowerCase()));

    if (selectedBudgetProjects.length > 0) {
      projects = projects.filter((_, i) => selectedBudgetProjects.includes(i));
    }
    return projects;
  }, [approvedTopics, budgetFilter, selectedBudgetProjects]);

  const parseCostRange = (str) => {
    if (!str) return [0, 0];
    const nums = str.replace(/[₦,]/g, '').match(/\d+/g);
    if (!nums) return [0, 0];
    return nums.length >= 2 ? [parseInt(nums[0]), parseInt(nums[1])] : [parseInt(nums[0]), parseInt(nums[0])];
  };

  // ─── Render Helpers ───
  const DifficultyBadge = ({ level }) => {
    const colors = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800',
    };
    return <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[level] || 'bg-gray-100 text-gray-600'}`}>{level}</span>;
  };

  const CostBadge = ({ cost }) => {
    if (!cost) return null;
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };
    return (
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${colors[cost.costLevel] || 'bg-gray-100'}`}>
        {cost.total} {cost.hasMolecular && '🧬'}
      </span>
    );
  };

  // ─── Topic Card ───
  const TopicCard = ({ topic, index, isApproved = false, onApprove, onRemove }) => {
    const isExpanded = expandedTopic === `${isApproved ? 'a' : 'g'}-${index}`;
    const expandKey = `${isApproved ? 'a' : 'g'}-${index}`;

    return (
      <div className="border rounded-lg overflow-hidden mb-3 transition-all" style={{ borderColor: '#e0d5c7', background: '#fff' }}>
        {/* Header */}
        <div
          className="p-4 cursor-pointer hover:bg-opacity-50 transition-colors"
          style={{ background: isExpanded ? '#faf8f5' : 'transparent' }}
          onClick={() => setExpandedTopic(isExpanded ? null : expandKey)}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm leading-snug mb-1" style={{ color: '#433422' }}>
                {topic.title}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: '#6b5d4d' }}>{topic.description}</p>
            </div>
            <div className="flex items-center gap-1.5 flex-shrink-0">
              <DifficultyBadge level={topic.difficulty} />
              <CostBadge cost={topic.estimatedCost} />
              {isExpanded ? <ChevronUp size={16} className="text-bark-muted" /> : <ChevronDown size={16} className="text-bark-muted" />}
            </div>
          </div>
          {/* Tags row */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {topic.focusArea && (
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#f5f0e8', color: '#8b7355' }}>
                {FOCUS_AREAS.find(a => a.id === topic.focusArea)?.label || topic.focusArea}
              </span>
            )}
            {topic.bacteria && (
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: '#fef3c7', color: '#92400e' }}>
                {topic.bacteria}
              </span>
            )}
            {topic.uniquenessScore && (
              <span className="text-xs px-2 py-0.5 rounded" style={{ background: topic.uniquenessScore >= 7 ? '#dbeafe' : '#fef3c7', color: topic.uniquenessScore >= 7 ? '#1d4ed8' : '#92400e' }}>
                Uniqueness: {topic.uniquenessScore}/10
              </span>
            )}
          </div>
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="border-t px-4 py-4 space-y-4" style={{ borderColor: '#e0d5c7', background: '#faf8f5' }}>
            {/* Background */}
            {topic.background && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#8b7355' }}>Background</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#6b5d4d' }}>{topic.background}</p>
              </div>
            )}

            {/* Objectives */}
            {topic.objectives?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#8b7355' }}>Objectives</h4>
                <ol className="list-decimal list-inside text-sm space-y-1" style={{ color: '#6b5d4d' }}>
                  {topic.objectives.map((o, i) => <li key={i}>{o}</li>)}
                </ol>
              </div>
            )}

            {/* Methodology */}
            {topic.methodology && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#8b7355' }}>Methodology</h4>
                <p className="text-sm leading-relaxed" style={{ color: '#6b5d4d' }}>{topic.methodology}</p>
              </div>
            )}

            {/* Sample Info */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {topic.sampleSource && (
                <div className="p-3 rounded" style={{ background: '#f5f0e8' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#8b7355' }}>Source</div>
                  <div className="text-sm" style={{ color: '#6b5d4d' }}>{topic.sampleSource}</div>
                </div>
              )}
              {topic.sampleType && (
                <div className="p-3 rounded" style={{ background: '#f5f0e8' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#8b7355' }}>Sample Type</div>
                  <div className="text-sm" style={{ color: '#6b5d4d' }}>{topic.sampleType}</div>
                </div>
              )}
              {topic.sampleSize && (
                <div className="p-3 rounded" style={{ background: '#f5f0e8' }}>
                  <div className="text-xs font-semibold uppercase tracking-wider mb-0.5" style={{ color: '#8b7355' }}>Sample Size</div>
                  <div className="text-sm" style={{ color: '#6b5d4d' }}>{topic.sampleSize}</div>
                </div>
              )}
            </div>

            {/* Materials & Equipment */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {topic.materials?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#8b7355' }}>Materials</h4>
                  <ul className="text-xs space-y-0.5" style={{ color: '#6b5d4d' }}>
                    {topic.materials.map((m, i) => <li key={i}>• {m}</li>)}
                  </ul>
                </div>
              )}
              {topic.equipment?.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#8b7355' }}>Equipment</h4>
                  <ul className="text-xs space-y-0.5" style={{ color: '#6b5d4d' }}>
                    {topic.equipment.map((e, i) => <li key={i}>• {e}</li>)}
                  </ul>
                </div>
              )}
            </div>

            {/* Cost Breakdown */}
            {topic.estimatedCost?.breakdown?.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#8b7355' }}>Cost Breakdown</h4>
                <div className="rounded overflow-hidden border" style={{ borderColor: '#e0d5c7' }}>
                  {topic.estimatedCost.breakdown.map((item, i) => (
                    <div key={i} className="flex justify-between items-center px-3 py-1.5 text-xs" style={{ background: i % 2 === 0 ? '#fff' : '#faf8f5', color: '#6b5d4d' }}>
                      <span>{item.item}</span>
                      <span className="font-medium" style={{ color: '#433422' }}>{item.cost}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-3 py-2 text-sm font-semibold" style={{ background: '#f5f0e8', color: '#433422', borderTop: '1px solid #e0d5c7' }}>
                    <span>Total Estimate</span>
                    <span>{topic.estimatedCost.total}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Statistical Analysis */}
            {topic.statisticalAnalysis && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#8b7355' }}>Statistical Analysis</h4>
                <div className="text-xs space-y-1" style={{ color: '#6b5d4d' }}>
                  <p><strong>Design:</strong> {topic.statisticalAnalysis.studyDesign}</p>
                  <p><strong>Sample Size Calc:</strong> {topic.statisticalAnalysis.sampleSizeCalculation}</p>
                  <p><strong>Tests:</strong> {(topic.statisticalAnalysis.tests || []).join(', ')}</p>
                  <p><strong>Software:</strong> {topic.statisticalAnalysis.software}</p>
                </div>
              </div>
            )}

            {/* Interview Questions */}
            {topic.interviewRequired && topic.interviewQuestions && (
              <div>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#8b7355' }}>Interview Questions</h4>
                {topic.interviewQuestions.consentQuestions?.length > 0 && (
                  <div className="mb-2">
                    <div className="text-xs font-medium mb-0.5" style={{ color: '#6b5d4d' }}>Consent:</div>
                    <ul className="text-xs space-y-0.5 ml-3" style={{ color: '#a89880' }}>
                      {topic.interviewQuestions.consentQuestions.map((q, i) => <li key={i}>• {q}</li>)}
                    </ul>
                  </div>
                )}
                {topic.interviewQuestions.methodologyQuestions?.length > 0 && (
                  <div>
                    <div className="text-xs font-medium mb-0.5" style={{ color: '#6b5d4d' }}>Methodology:</div>
                    <ul className="text-xs space-y-0.5 ml-3" style={{ color: '#a89880' }}>
                      {topic.interviewQuestions.methodologyQuestions.map((q, i) => <li key={i}>• {q}</li>)}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Ethical + Supervisor Notes */}
            {(topic.ethicalConsiderations || topic.supervisorNotes) && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {topic.ethicalConsiderations && (
                  <div className="p-3 rounded" style={{ background: '#fef3c7' }}>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: '#92400e' }}>⚠️ Ethical Considerations</div>
                    <p className="text-xs" style={{ color: '#78350f' }}>{topic.ethicalConsiderations}</p>
                  </div>
                )}
                {topic.supervisorNotes && (
                  <div className="p-3 rounded" style={{ background: '#dbeafe' }}>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: '#1d4ed8' }}>📋 Supervisor Notes</div>
                    <p className="text-xs" style={{ color: '#1e3a5f' }}>{topic.supervisorNotes}</p>
                  </div>
                )}
              </div>
            )}

            {/* Uniqueness Check Result */}
            {topic.uniquenessCheck && (
              <div className="p-3 rounded" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                <div className="text-xs font-semibold mb-1" style={{ color: '#166534' }}>
                  🔍 Uniqueness Check: {topic.uniquenessCheck.score}/10
                </div>
                <p className="text-xs mb-1" style={{ color: '#15803d' }}>{topic.uniquenessCheck.reason}</p>
                {topic.uniquenessCheck.suggestions && (
                  <p className="text-xs italic" style={{ color: '#16a34a' }}>💡 {topic.uniquenessCheck.suggestions}</p>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-2 pt-2 border-t" style={{ borderColor: '#e0d5c7' }}>
              {!isApproved && (
                <>
                  <button onClick={() => approveTopic(index)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors" style={{ background: '#166534', color: '#fff' }}>
                    <Star size={12} /> Approve
                  </button>
                  <button onClick={() => regenerateTopic(index)} disabled={regeneratingIndex !== null} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors" style={{ background: '#f5f0e8', color: '#8b7355' }}>
                    <RefreshCw size={12} className={regeneratingIndex === index ? 'animate-spin' : ''} />
                    {regeneratingIndex === index ? 'Regenerating...' : 'Regenerate'}
                  </button>
                </>
              )}
              <button onClick={() => checkUniqueness(index, isApproved)} disabled={checkingUniqueness !== null} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors" style={{ background: '#f5f0e8', color: '#8b7355' }}>
                <Search size={12} className={checkingUniqueness === index ? 'animate-spin' : ''} />
                {checkingUniqueness === index ? 'Checking...' : 'Check Uniqueness'}
              </button>
              <button onClick={() => generateProposal(topic)} disabled={generatingProposal !== null} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors" style={{ background: '#f5f0e8', color: '#8b7355' }}>
                <FileText size={12} className={generatingProposal === topic.title ? 'animate-spin' : ''} />
                {generatingProposal === topic.title ? 'Writing...' : 'Generate Proposal'}
              </button>
              <button onClick={() => copyTopic(topic, `${isApproved ? 'a' : 'g'}-${index}`)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors" style={{ background: '#f5f0e8', color: '#8b7355' }}>
                {copiedIndex === `${isApproved ? 'a' : 'g'}-${index}` ? <Check size={12} /> : <Copy size={12} />}
                {copiedIndex === `${isApproved ? 'a' : 'g'}-${index}` ? 'Copied!' : 'Copy'}
              </button>
              {isApproved && (
                <button onClick={() => removeApproved(index)} className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-medium transition-colors ml-auto" style={{ background: '#fef2f2', color: '#dc2626' }}>
                  <Trash2 size={12} /> Remove
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ─── Render ───
  const TABS = [
    { id: 'generate', label: 'Generate' },
    { id: 'approved', label: 'Approved', count: approvedTopics.length },
    { id: 'budget', label: 'Budget' },
    { id: 'suppliers', label: 'Suppliers' },
    { id: 'grants', label: 'Grants' },
    { id: 'labplan', label: 'Lab Planning' },
  ];

  return (
    <div className="min-h-screen" style={{ background: '#faf8f5' }}>
      {/* Header */}
      <header className="border-b sticky top-0 z-30" style={{ background: '#faf8f5', borderColor: '#e0d5c7' }}>
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#8b7355' }}>
              <Microscope size={20} color="#faf8f5" />
            </div>
            <div>
              <h1 className="text-lg font-bold" style={{ color: '#433422', fontFamily: '"Source Serif 4", Georgia, serif' }}>
                Research Topic Generator
              </h1>
              <p className="text-xs" style={{ color: '#a89880' }}>Medical Microbiology — Lagos, Nigeria</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 overflow-x-auto">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
              >
                {tab.label}
                {tab.count > 0 && (
                  <span className="ml-1.5 text-xs px-1.5 py-0.5 rounded" style={{ background: '#c4a77d', color: '#fff' }}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6">
        {/* Error Banner */}
        {error && (
          <div className="mb-4 p-3 rounded-lg flex items-start gap-2" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
            <AlertCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 flex-1">{error}</p>
            <button onClick={() => setError(null)}><X size={14} className="text-red-400" /></button>
          </div>
        )}

        {/* ═══ GENERATE TAB ═══ */}
        {activeTab === 'generate' && (
          <section className="space-y-5">
            {/* Focus Areas */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: '#8b7355' }}>Focus Areas</label>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map(area => (
                  <button
                    key={area.id}
                    onClick={() => setSelectedAreas(prev => prev.includes(area.id) ? prev.filter(a => a !== area.id) : [...prev, area.id])}
                    className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                    style={{
                      background: selectedAreas.includes(area.id) ? '#433422' : '#f5f0e8',
                      color: selectedAreas.includes(area.id) ? '#faf8f5' : '#6b5d4d',
                      border: `1px solid ${selectedAreas.includes(area.id) ? '#433422' : '#e0d5c7'}`,
                    }}
                  >
                    {area.icon} {area.label}
                  </button>
                ))}
              </div>
              {/* Custom focus area */}
              <input
                type="text"
                value={customFocusArea}
                onChange={e => setCustomFocusArea(e.target.value)}
                placeholder="Add custom focus area..."
                className="mt-2 w-full px-3 py-2 rounded-lg text-sm"
                style={{ background: '#f5f0e8', border: '1px solid #e0d5c7', color: '#433422', outline: 'none' }}
              />
            </div>

            {/* Bacteria Filter */}
            <div>
              <button
                onClick={() => setShowBacteriaFilter(!showBacteriaFilter)}
                className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider"
                style={{ color: '#8b7355' }}
              >
                Bacteria Filter {selectedBacteria.length > 0 && `(${selectedBacteria.length})`}
                {showBacteriaFilter ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showBacteriaFilter && (
                <div className="mt-2 p-3 rounded-lg space-y-2" style={{ background: '#f5f0e8', border: '1px solid #e0d5c7' }}>
                  <div className="text-xs font-medium mb-1" style={{ color: '#6b5d4d' }}>Aerobes</div>
                  <div className="flex flex-wrap gap-1.5">
                    {BACTERIA.filter(b => !b.anaerobe).map(b => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBacteria(prev => prev.includes(b.id) ? prev.filter(x => x !== b.id) : [...prev, b.id])}
                        className="px-2 py-1 rounded text-xs transition-all"
                        style={{
                          background: selectedBacteria.includes(b.id) ? '#433422' : '#fff',
                          color: selectedBacteria.includes(b.id) ? '#faf8f5' : '#6b5d4d',
                          border: `1px solid ${selectedBacteria.includes(b.id) ? '#433422' : '#e0d5c7'}`,
                        }}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                  <div className="text-xs font-medium mb-1 mt-2" style={{ color: '#6b5d4d' }}>Anaerobes</div>
                  <div className="flex flex-wrap gap-1.5">
                    {BACTERIA.filter(b => b.anaerobe).map(b => (
                      <button
                        key={b.id}
                        onClick={() => setSelectedBacteria(prev => prev.includes(b.id) ? prev.filter(x => x !== b.id) : [...prev, b.id])}
                        className="px-2 py-1 rounded text-xs transition-all"
                        style={{
                          background: selectedBacteria.includes(b.id) ? '#433422' : '#fff',
                          color: selectedBacteria.includes(b.id) ? '#faf8f5' : '#6b5d4d',
                          border: `1px solid ${selectedBacteria.includes(b.id) ? '#433422' : '#e0d5c7'}`,
                        }}
                      >
                        {b.name}
                      </button>
                    ))}
                  </div>
                  <input
                    type="text"
                    value={customBacteria}
                    onChange={e => setCustomBacteria(e.target.value)}
                    placeholder="Add custom bacteria..."
                    className="mt-2 w-full px-2 py-1.5 rounded text-xs"
                    style={{ background: '#fff', border: '1px solid #e0d5c7', color: '#433422', outline: 'none' }}
                  />
                </div>
              )}
            </div>

            {/* Settings Row */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#8b7355' }}>Demographic</label>
                <select
                  value={selectedDemographic}
                  onChange={e => setSelectedDemographic(e.target.value)}
                  className="w-full px-2 py-2 rounded-lg text-sm"
                  style={{ background: '#f5f0e8', border: '1px solid #e0d5c7', color: '#433422' }}
                >
                  {DEMOGRAPHICS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#8b7355' }}>Resources</label>
                <select
                  value={resourceLevel}
                  onChange={e => setResourceLevel(e.target.value)}
                  className="w-full px-2 py-2 rounded-lg text-sm"
                  style={{ background: '#f5f0e8', border: '1px solid #e0d5c7', color: '#433422' }}
                >
                  {RESOURCE_LEVELS.map(r => <option key={r.id} value={r.id}>{r.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#8b7355' }}>Budget Cap</label>
                <select
                  value={maxBudget}
                  onChange={e => setMaxBudget(e.target.value)}
                  className="w-full px-2 py-2 rounded-lg text-sm"
                  style={{ background: '#f5f0e8', border: '1px solid #e0d5c7', color: '#433422' }}
                >
                  {BUDGET_CAPS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#8b7355' }}>Topics</label>
                <select
                  value={numTopics}
                  onChange={e => setNumTopics(parseInt(e.target.value))}
                  className="w-full px-2 py-2 rounded-lg text-sm"
                  style={{ background: '#f5f0e8', border: '1px solid #e0d5c7', color: '#433422' }}
                >
                  {[3, 5, 8, 10, 15].map(n => <option key={n} value={n}>{n} topics</option>)}
                </select>
              </div>
            </div>

            {/* Custom Notes */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: '#8b7355' }}>Professor's Notes (optional)</label>
              <textarea
                value={customNotes}
                onChange={e => setCustomNotes(e.target.value)}
                placeholder="Any specific instructions or constraints..."
                rows={2}
                className="w-full px-3 py-2 rounded-lg text-sm resize-none"
                style={{ background: '#f5f0e8', border: '1px solid #e0d5c7', color: '#433422', outline: 'none' }}
              />
            </div>

            {/* Generate Button */}
            <button
              onClick={generateTopics}
              disabled={loading || selectedAreas.length === 0}
              className="w-full py-3 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{
                background: loading ? '#a89880' : '#433422',
                color: '#faf8f5',
                opacity: selectedAreas.length === 0 ? 0.5 : 1,
              }}
            >
              {loading ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  {loadingProgress || 'Generating...'}
                </>
              ) : (
                <>
                  <Sparkles size={16} />
                  Generate {numTopics} Topics
                </>
              )}
            </button>

            {/* Results */}
            {topics.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold" style={{ color: '#433422' }}>
                    Generated Topics ({topics.length})
                  </h2>
                </div>
                {topics.map((topic, i) => (
                  <TopicCard key={i} topic={topic} index={i} onApprove={() => approveTopic(i)} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* ═══ APPROVED TAB ═══ */}
        {activeTab === 'approved' && (
          <section>
            {approvedTopics.length === 0 ? (
              <div className="text-center py-12" style={{ color: '#a89880' }}>
                <Star size={40} className="mx-auto mb-3 opacity-30" />
                <p className="text-sm">No approved topics yet.</p>
                <p className="text-xs mt-1">Generate topics and click "Approve" to save them here.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold" style={{ color: '#433422' }}>
                    Approved Topics ({approvedTopics.length})
                  </h2>
                </div>
                {approvedTopics.map((topic, i) => (
                  <TopicCard key={i} topic={topic} index={i} isApproved onRemove={() => removeApproved(i)} />
                ))}
              </>
            )}
          </section>
        )}

        {/* ═══ BUDGET TAB ═══ */}
        {activeTab === 'budget' && (
          <section>
            {(() => {
              const projectsWithCost = approvedTopics.filter(t => t.estimatedCost);
              if (projectsWithCost.length === 0) {
                return (
                  <div className="text-center py-12" style={{ color: '#a89880' }}>
                    <DollarSign size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No approved projects with cost data.</p>
                    <p className="text-xs mt-1">Generate new topics (they include cost estimates) and approve them.</p>
                  </div>
                );
              }

              const analysis = getAnalysisProjects();
              const totalRange = analysis.reduce((acc, t) => {
                const [lo, hi] = parseCostRange(t.estimatedCost?.total);
                return [acc[0] + lo, acc[1] + hi];
              }, [0, 0]);

              const phenoCount = analysis.filter(t => !t.estimatedCost?.hasMolecular).length;
              const molCount = analysis.filter(t => t.estimatedCost?.hasMolecular).length;

              // Get unique bacteria from projects
              const allBacteria = [...new Set(projectsWithCost.map(t => t.bacteria).filter(Boolean))];

              return (
                <>
                  {/* Filters */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <select value={budgetFilter.costLevel} onChange={e => setBudgetFilter(prev => ({ ...prev, costLevel: e.target.value }))} className="px-2 py-2 rounded text-xs" style={{ background: '#f5f0e8', border: '1px solid #e0d5c7', color: '#433422' }}>
                      <option value="all">All Cost Levels</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                    <select value={budgetFilter.molecular} onChange={e => setBudgetFilter(prev => ({ ...prev, molecular: e.target.value }))} className="px-2 py-2 rounded text-xs" style={{ background: '#f5f0e8', border: '1px solid #e0d5c7', color: '#433422' }}>
                      <option value="all">All Analysis Types</option>
                      <option value="yes">Molecular Only</option>
                      <option value="no">Phenotypic Only</option>
                    </select>
                    <select value={budgetFilter.bacteria} onChange={e => setBudgetFilter(prev => ({ ...prev, bacteria: e.target.value }))} className="px-2 py-2 rounded text-xs" style={{ background: '#f5f0e8', border: '1px solid #e0d5c7', color: '#433422' }}>
                      <option value="all">All Bacteria</option>
                      {allBacteria.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  {/* Project Selection */}
                  <div className="mb-4 p-3 rounded-lg" style={{ background: '#f5f0e8', border: '1px solid #e0d5c7' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: '#8b7355' }}>Select Projects to Analyze</span>
                      <div className="flex gap-2">
                        <button onClick={() => setSelectedBudgetProjects(projectsWithCost.map((_, i) => i))} className="text-xs underline" style={{ color: '#8b7355' }}>Select All</button>
                        <button onClick={() => setSelectedBudgetProjects([])} className="text-xs underline" style={{ color: '#8b7355' }}>Clear</button>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {projectsWithCost.map((t, i) => (
                        <label key={i} className="flex items-start gap-2 text-xs cursor-pointer" style={{ color: '#6b5d4d' }}>
                          <input
                            type="checkbox"
                            checked={selectedBudgetProjects.includes(i)}
                            onChange={() => setSelectedBudgetProjects(prev => prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i])}
                            className="mt-0.5"
                          />
                          <span className="flex-1">{t.title}</span>
                          <CostBadge cost={t.estimatedCost} />
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  {analysis.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                      <div className="p-3 rounded-lg text-center" style={{ background: '#f5f0e8' }}>
                        <div className="text-xs" style={{ color: '#a89880' }}>Total Range</div>
                        <div className="text-sm font-bold" style={{ color: '#433422' }}>₦{totalRange[0].toLocaleString()} – ₦{totalRange[1].toLocaleString()}</div>
                      </div>
                      <div className="p-3 rounded-lg text-center" style={{ background: '#f5f0e8' }}>
                        <div className="text-xs" style={{ color: '#a89880' }}>Avg/Project</div>
                        <div className="text-sm font-bold" style={{ color: '#433422' }}>₦{Math.round(totalRange[0] / analysis.length).toLocaleString()} – ₦{Math.round(totalRange[1] / analysis.length).toLocaleString()}</div>
                      </div>
                      <div className="p-3 rounded-lg text-center" style={{ background: '#f0fdf4' }}>
                        <div className="text-xs" style={{ color: '#166534' }}>Phenotypic</div>
                        <div className="text-sm font-bold" style={{ color: '#166534' }}>{phenoCount}</div>
                      </div>
                      <div className="p-3 rounded-lg text-center" style={{ background: '#dbeafe' }}>
                        <div className="text-xs" style={{ color: '#1d4ed8' }}>Molecular 🧬</div>
                        <div className="text-sm font-bold" style={{ color: '#1d4ed8' }}>{molCount}</div>
                      </div>
                    </div>
                  )}

                  {/* Bulk Savings */}
                  {analysis.length > 1 && (
                    <div className="p-4 rounded-lg" style={{ background: '#f0f7ed', border: '1px solid #c5d4bc' }}>
                      <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#4a5d44' }}>💰 Bulk Purchase Savings Estimate</h3>
                      <div className="text-xs space-y-1" style={{ color: '#5a7a52' }}>
                        {molCount > 1 && <p>• <strong>PCR reagents:</strong> {molCount} projects can share master mix, ladder, primers (save ~₦100,000-200,000)</p>}
                        {phenoCount > 1 && <p>• <strong>Culture media:</strong> {phenoCount} projects could share Mueller Hinton/Nutrient Agar bottles (save ~₦50,000-100,000)</p>}
                        <p>• <strong>Consumables:</strong> Buy petri dish cartons (500) instead of packs (20) — {Math.round(analysis.length * 60 / 500) || 1} carton(s) for {analysis.length} projects</p>
                        <p>• <strong>Antibiotic discs:</strong> Bulk order for {analysis.length} projects (10-15% discount typical)</p>
                      </div>
                      <p className="text-xs mt-3 pt-2 font-medium" style={{ borderTop: '1px solid #c5d4bc', color: '#4a5d44' }}>
                        Estimated savings: ₦{(analysis.length * 30000).toLocaleString()} – ₦{(analysis.length * 80000).toLocaleString()} total
                      </p>
                    </div>
                  )}
                </>
              );
            })()}
          </section>
        )}

        {/* ═══ SUPPLIERS TAB ═══ */}
        {activeTab === 'suppliers' && (
          <section>
            <div className="p-4 mb-6 rounded-lg" style={{ background: '#f0f7ed', border: '1px solid #c5d4bc' }}>
              <p className="text-sm" style={{ color: '#4a5d44' }}>
                <strong>💡 Tip:</strong> Call ahead to confirm stock and prices. Bulk orders often get 10-20% discount. Ask about student/institutional pricing.
              </p>
            </div>

            <h2 className="text-xs uppercase tracking-widest mb-3" style={{ color: '#a89880' }}>Major Laboratory Suppliers in Lagos</h2>
            <div className="space-y-4 mb-8">
              {SUPPLIERS.map((s, i) => (
                <div key={i} className="p-4 rounded-lg" style={{ background: '#fff', border: '1px solid #e0d5c7' }}>
                  <h3 className="font-semibold mb-1" style={{ color: '#433422' }}>{s.name}</h3>
                  <p className="text-sm mb-2" style={{ color: '#6b5d4d' }}>{s.specialty}</p>
                  <div className="text-xs space-y-0.5" style={{ color: '#6b5d4d' }}>
                    <p>📍 {s.address}</p>
                    <p>📞 {s.phone}</p>
                    {s.email && <p>✉️ {s.email}</p>}
                    {s.website && <p>🌐 <a href={s.website} target="_blank" rel="noopener noreferrer" className="underline">{s.website}</a></p>}
                  </div>
                  <p className="text-xs mt-2" style={{ color: '#a89880' }}>{s.notes}</p>
                </div>
              ))}
            </div>

            <h2 className="text-xs uppercase tracking-widest mb-3" style={{ color: '#a89880' }}>Services</h2>
            {SERVICES.map((s, i) => (
              <div key={i} className="p-4 rounded-lg" style={{ background: '#fff', border: '1px solid #e0d5c7' }}>
                <h3 className="font-semibold mb-1" style={{ color: '#433422' }}>{s.name}</h3>
                <p className="text-sm mb-2" style={{ color: '#6b5d4d' }}>{s.description}</p>
                <div className="text-xs space-y-0.5" style={{ color: '#6b5d4d' }}>
                  <p>📍 {s.address}</p>
                  <p>📞 {s.phone}</p>
                  {s.email && <p>✉️ {s.email}</p>}
                </div>
                <p className="text-xs mt-2" style={{ color: '#a89880' }}>{s.pricing}</p>
              </div>
            ))}
          </section>
        )}

        {/* ═══ GRANTS TAB ═══ */}
        {activeTab === 'grants' && (
          <section>
            {['Nigerian', 'International', 'AMR-specific'].map(type => {
              const items = GRANTS.filter(g => g.type === type);
              if (items.length === 0) return null;
              return (
                <div key={type} className="mb-6">
                  <h2 className="text-xs uppercase tracking-widest mb-3" style={{ color: '#a89880' }}>{type} Funding</h2>
                  <div className="space-y-3">
                    {items.map((g, i) => (
                      <div key={i} className="p-4 rounded-lg" style={{ background: '#fff', border: '1px solid #e0d5c7' }}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-sm" style={{ color: '#433422' }}>{g.name}</h3>
                            <p className="text-xs mt-0.5" style={{ color: '#6b5d4d' }}>{g.desc}</p>
                          </div>
                          <a href={g.url} target="_blank" rel="noopener noreferrer" className="text-xs px-2 py-1 rounded" style={{ background: '#f5f0e8', color: '#8b7355' }}>
                            Visit →
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <div className="p-4 rounded-lg" style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
              <p className="text-xs" style={{ color: '#92400e' }}>
                <strong>Application Tips:</strong> Check deadlines early — TETFund calls are institutional. For Wellcome & Fogarty, you typically need a lead PI with a host institution. GARDP specifically funds AMR projects. Always check for co-funding opportunities.
              </p>
            </div>
          </section>
        )}

        {/* ═══ LAB PLANNING TAB ═══ */}
        {activeTab === 'labplan' && (
          <section>
            {(() => {
              const molecularProjects = approvedTopics.filter(t => t.estimatedCost?.hasMolecular);
              if (molecularProjects.length === 0) {
                return (
                  <div className="text-center py-12" style={{ color: '#a89880' }}>
                    <Beaker size={40} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No approved projects needing molecular analysis yet.</p>
                  </div>
                );
              }

              return (
                <>
                  <h2 className="text-xs uppercase tracking-widest mb-3" style={{ color: '#a89880' }}>
                    Projects Requiring Molecular Analysis ({molecularProjects.length})
                  </h2>
                  <div className="space-y-3 mb-6">
                    {molecularProjects.map((t, i) => (
                      <div key={i} className="p-3 rounded-lg" style={{ background: '#fff', border: '1px solid #e0d5c7' }}>
                        <h3 className="text-sm font-medium" style={{ color: '#433422' }}>{t.title}</h3>
                        <p className="text-xs mt-1" style={{ color: '#a89880' }}>{t.bacteria || 'Various organisms'}</p>
                      </div>
                    ))}
                  </div>

                  {/* Gel Layout */}
                  <div className="p-4 rounded-lg mb-4" style={{ background: '#dbeafe', border: '1px solid #93c5fd' }}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#1d4ed8' }}>🧬 Gel Layout Optimizer</h3>
                    <p className="text-xs mb-3" style={{ color: '#1e40af' }}>
                      Standard gel = 15 wells. Reserve well 1 & 8 for DNA ladders. That gives 13 sample wells per gel.
                    </p>
                    <div className="text-xs space-y-1" style={{ color: '#1e3a5f' }}>
                      <p>Projects needing gels: {molecularProjects.length}</p>
                      <p>Estimated samples per project: ~20-50</p>
                      <p>Gels needed (estimate): {Math.ceil(molecularProjects.length * 35 / 13)}</p>
                      <p>Consider batching projects with similar primer sets for efficiency.</p>
                    </div>
                  </div>

                  {/* Cost Tips */}
                  <div className="p-4 rounded-lg" style={{ background: '#f0f7ed', border: '1px solid #c5d4bc' }}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: '#4a5d44' }}>💡 Cost-Saving Tips</h3>
                    <div className="text-xs space-y-1" style={{ color: '#5a7a52' }}>
                      <p>• Share PCR master mix across projects — buy the 500-rxn kit if 3+ projects need it.</p>
                      <p>• Pool primer orders to meet minimum order quantities.</p>
                      <p>• Book NIMR sequencing as a batch for better rates.</p>
                      <p>• Time gel runs back-to-back to share buffer and minimize setup.</p>
                    </div>
                  </div>
                </>
              );
            })()}
          </section>
        )}
      </main>

      {/* Proposal Modal */}
      {proposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-2xl">
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-bold" style={{ color: '#433422', fontFamily: '"Source Serif 4", serif' }}>Research Proposal</h2>
              <button onClick={() => setProposalModal(null)} className="p-1"><X size={20} style={{ color: '#a89880' }} /></button>
            </div>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-sm leading-relaxed" style={{ color: '#6b5d4d' }}>
              {proposalModal.text}
            </div>
            <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: '1px solid #e0d5c7' }}>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(proposalModal.text);
                }}
                className="px-4 py-2 rounded text-sm font-medium"
                style={{ background: '#433422', color: '#faf8f5' }}
              >
                Copy to Clipboard
              </button>
              <button onClick={() => setProposalModal(null)} className="px-4 py-2 rounded text-sm" style={{ background: '#f5f0e8', color: '#8b7355' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
