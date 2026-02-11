'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Sparkles, RefreshCw, Copy, Check, Star, Trash2, FileText, Search,
  ChevronDown, ChevronUp, X, Microscope, FlaskConical, Beaker,
  ExternalLink, AlertCircle, HelpCircle, Zap, ArrowRight, Download
} from 'lucide-react';

// ═══════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════

const FOCUS_AREAS = [
  { id: 'plant', label: 'Plant-Based Antimicrobials', icon: '🌿', color: 'var(--teal)' },
  { id: 'amr', label: 'Antimicrobial Resistance', icon: '🦠', color: 'var(--coral)' },
  { id: 'food', label: 'Food & Environmental', icon: '🍽️', color: 'var(--amber)' },
  { id: 'clinical', label: 'Clinical Isolates', icon: '🏥', color: 'var(--blue)' },
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
  {
    id: 'basic', label: 'Basic Lab', emoji: '🔬',
    equipment: ['Autoclave', 'Incubator', 'Microscope', 'Bunsen burner', 'Colony counter'],
    techniques: ['Gram staining', 'Culture & sensitivity', 'Biochemical tests (catalase, coagulase)', 'Zone of inhibition (Kirby-Bauer)', 'Serial dilution'],
    costRange: '₦150K – ₦400K',
  },
  {
    id: 'intermediate', label: 'Well-Equipped', emoji: '🧬',
    equipment: ['Everything in Basic +', 'PCR thermocycler', 'Gel electrophoresis', 'Spectrophotometer', 'ELISA reader', 'Centrifuge'],
    techniques: ['All basic techniques +', 'PCR amplification', 'Gel documentation', 'MIC/MBC determination', 'ELISA assays', 'Biofilm quantification'],
    costRange: '₦400K – ₦800K',
  },
  {
    id: 'advanced', label: 'Advanced', emoji: '🧪',
    equipment: ['Everything in Well-Equipped +', 'DNA sequencer', 'Mass spectrometer', 'HPLC', 'Flow cytometer', 'Real-time PCR'],
    techniques: ['All intermediate techniques +', '16S rRNA sequencing', 'MALDI-TOF', 'WGS analysis', 'Proteomics', 'Gene expression'],
    costRange: '₦800K+',
  },
];

const BUDGET_CAPS = [
  { value: 'any', label: 'Any budget' },
  { value: '300000', label: 'Under ₦300K' },
  { value: '500000', label: 'Under ₦500K' },
  { value: '800000', label: 'Under ₦800K' },
];

const SUPPLIERS = [
  { name: 'Finlab Nigeria Limited', specialty: 'Full range — reagents, media, equipment, glassware', address: '4, Alhaji Adejumo Ave, Ilupeju, Lagos', phone: '+234 813 575 1930', email: 'sales@finlabnigeria.com', website: 'https://finlabnigeria.com', notes: 'Est. 1981. Major university stockist. Abuja & Owerri branches.', tag: 'Most Popular' },
  { name: 'Koeman Integrated Services', specialty: 'Culture media, chemicals, reagents', address: '587, Agege Motor Road, Shogunle, Ikeja, Lagos', phone: '+234 708 431 8797', email: 'info@koemanits.com', website: 'https://koemanits.com', notes: 'ISO 9001. Thermo Fisher partner. Great for Oxoid/Biolab media.', tag: 'Thermo Fisher' },
  { name: 'Allschoolabs Scientific', specialty: 'Lab equipment, glassware, reagents', address: '104 Western Avenue, Ojuelegba, Lagos', phone: '+234 816 338 3206', email: 'via website', website: 'https://allschoolabs.com', notes: 'Also does equipment maintenance and lab renovations.' },
  { name: 'Pascal Scientific', specialty: 'Equipment, reagents, lab installation', address: 'Lagos (multiple locations)', phone: 'via website', website: 'https://pascalscientific.com', notes: 'Shimadzu & Thermo Fisher authorized distributor.' },
  { name: 'Regino Medicals', specialty: 'HiMedia products — culture media & antibiotic discs', address: 'Lagos', phone: 'via website', notes: 'More affordable than imported Oxoid/Abtek. Good for student projects.', tag: 'Budget' },
];

const NIMR = {
  name: 'NIMR Central Research Laboratory',
  desc: 'Molecular services — sequencing, HPLC at institutional rates',
  address: '6, Edmond Crescent, Off Murtala Mohammed Way, Yaba, Lagos',
  phone: '+234 803 381 0466', email: 'centralresearchlab@nimr.gov.ng',
  pricing: 'Sequencing ~₦6,000/primer · HPLC ~₦3,000–20,000/sample',
};

const GRANTS = [
  { name: 'TETFund', type: 'Nigerian', desc: 'Tertiary Education Trust Fund — institution-based grants', url: 'https://tetfund.gov.ng', emoji: '🇳🇬' },
  { name: 'NRF', type: 'Nigerian', desc: 'National Research Fund — competitive grants', url: 'https://nrf.gov.ng', emoji: '🇳🇬' },
  { name: 'PTDF', type: 'Nigerian', desc: 'Petroleum Technology Dev Fund — postgrad research', url: 'https://ptdf.gov.ng', emoji: '🇳🇬' },
  { name: 'Wellcome Trust', type: 'International', desc: 'Fellowship programs for African researchers', url: 'https://wellcome.org', emoji: '🌍' },
  { name: 'NIH Fogarty', type: 'International', desc: 'Training & research in LMICs', url: 'https://www.fic.nih.gov', emoji: '🌍' },
  { name: 'EDCTP', type: 'International', desc: 'EU & Developing Countries Clinical Trials', url: 'https://www.edctp.org', emoji: '🌍' },
  { name: 'Grand Challenges Africa', type: 'International', desc: 'Innovation grants for African health', url: 'https://gcafrica.org', emoji: '🌍' },
  { name: 'GARDP', type: 'AMR', desc: 'Global Antibiotic R&D Partnership — AMR funding', url: 'https://gardp.org', emoji: '🦠' },
];

const LOADING_MESSAGES = [
  { msg: "Designing experiments around Lagos hospital resources...", time: 0 },
  { msg: "Checking sample collection feasibility...", time: 4000 },
  { msg: "Calculating realistic Nigerian Naira budgets...", time: 8000 },
  { msg: "Cross-referencing with existing literature...", time: 12000 },
  { msg: "Adding statistical analysis frameworks...", time: 16000 },
  { msg: "Compiling materials lists from Lagos suppliers...", time: 20000 },
  { msg: "Almost there — polishing methodology details...", time: 25000 },
  { msg: "This is a lot of science — hang tight...", time: 32000 },
  { msg: "Still working. Good topics take time!", time: 40000 },
];

const STORAGE_KEY = 'microbio-gen-v3';

// ═══════════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════════

function usePersistedState(key, defaultValue) {
  const [value, setValue] = useState(defaultValue);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try { const s = localStorage.getItem(key); if (s) setValue(JSON.parse(s)); } catch {}
    setLoaded(true);
  }, [key]);
  useEffect(() => { if (loaded) { try { localStorage.setItem(key, JSON.stringify(value)); } catch {} } }, [key, value, loaded]);
  return [value, setValue, loaded];
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  return { toasts, show };
}

// ═══════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════

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
  const [showGuide, setShowGuide] = usePersistedState(`${STORAGE_KEY}-guide`, true);

  // Data
  const [topics, setTopics] = useState([]);
  const [approvedTopics, setApprovedTopics] = usePersistedState(`${STORAGE_KEY}-approved`, []);

  // UI
  const [activeTab, setActiveTab] = useState('generate');
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [loadingStartTime, setLoadingStartTime] = useState(null);
  const [error, setError] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [regeneratingIndex, setRegeneratingIndex] = useState(null);
  const [checkingUniqueness, setCheckingUniqueness] = useState(null);
  const [generatingProposal, setGeneratingProposal] = useState(null);
  const [proposalModal, setProposalModal] = useState(null);
  const [selectedBudgetProjects, setSelectedBudgetProjects] = useState([]);
  const [budgetFilter, setBudgetFilter] = useState({ costLevel: 'all', molecular: 'all', bacteria: 'all' });
  const { toasts, show: showToast } = useToast();
  const loadingTimerRef = useRef(null);

  // Loading message rotation
  useEffect(() => {
    if (loading) {
      setLoadingStartTime(Date.now());
      setLoadingMsg(LOADING_MESSAGES[0].msg);
      const timers = LOADING_MESSAGES.slice(1).map(({ msg, time }) =>
        setTimeout(() => setLoadingMsg(msg), time)
      );
      return () => timers.forEach(clearTimeout);
    }
  }, [loading]);

  // ─── API CALLS ───
  const generateTopics = async () => {
    if (selectedAreas.length === 0) { setError('Select at least one focus area'); return; }
    setLoading(true);
    setError(null);
    setTopics([]);

    try {
      const batchSize = 5;
      const batches = Math.ceil(numTopics / batchSize);
      let allTopics = [];

      for (let i = 0; i < batches; i++) {
        const count = Math.min(batchSize, numTopics - allTopics.length);
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selectedAreas, selectedBacteria, selectedDemographic, resourceLevel,
            numTopics: count, maxBudget, customNotes, customFocusArea, customBacteria,
            existingTitles: allTopics.map(t => t.title),
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Generation failed');
        allTopics = [...allTopics, ...(data.topics || [])];
        setTopics([...allTopics]);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const regenerateTopic = async (index) => {
    setRegeneratingIndex(index);
    try {
      const current = topics[index];
      const res = await fetch('/api/regenerate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentTitle: current.title, focusArea: current.focusArea, resourceLevel }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTopics(prev => { const u = [...prev]; u[index] = data; return u; });
      showToast('Topic regenerated');
    } catch (err) { setError(err.message); } finally { setRegeneratingIndex(null); }
  };

  const checkUniqueness = async (index, isApproved = false) => {
    setCheckingUniqueness(`${isApproved ? 'a' : 'g'}-${index}`);
    try {
      const list = isApproved ? approvedTopics : topics;
      const res = await fetch('/api/uniqueness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: list[index].title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const updater = prev => { const u = [...prev]; u[index] = { ...u[index], uniquenessCheck: data }; return u; };
      if (isApproved) setApprovedTopics(updater); else setTopics(updater);
      showToast(`Uniqueness: ${data.score}/10`);
    } catch (err) { setError(err.message); } finally { setCheckingUniqueness(null); }
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
    } catch (err) { setError(err.message); } finally { setGeneratingProposal(null); }
  };

  const approveTopic = (index) => {
    const topic = topics[index];
    setApprovedTopics(prev => [...prev, { ...topic, approvedAt: new Date().toISOString() }]);
    setTopics(prev => prev.filter((_, i) => i !== index));
    showToast('Topic approved! ⭐');
  };

  const removeApproved = (index) => {
    setApprovedTopics(prev => prev.filter((_, i) => i !== index));
    showToast('Topic removed', 'info');
  };

  const copyTopic = (topic, key) => {
    const text = `${topic.title}\n\n${topic.description}\n\nObjectives:\n${(topic.objectives || []).map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nMethodology: ${topic.methodology}\n\nSample: ${topic.sampleType} from ${topic.sampleSource}, n=${topic.sampleSize}\n\nEstimated Cost: ${topic.estimatedCost?.total || 'N/A'}\n\nKeywords: ${(topic.keywords || []).join(', ')}`;
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  };

  const exportApproved = () => {
    const text = approvedTopics.map((t, i) => `─────────────────────────────\nTOPIC ${i + 1}: ${t.title}\n─────────────────────────────\n${t.description}\n\nFocus: ${FOCUS_AREAS.find(a => a.id === t.focusArea)?.label || t.focusArea}\nBacteria: ${t.bacteria || 'Various'}\nDifficulty: ${t.difficulty}\nCost: ${t.estimatedCost?.total || 'N/A'}\nDuration: ${t.estimatedDuration || 'N/A'}\n\nObjectives:\n${(t.objectives || []).map((o, j) => `  ${j + 1}. ${o}`).join('\n')}\n\nMethodology:\n  ${t.methodology}\n\nSample: ${t.sampleType} from ${t.sampleSource}, n=${t.sampleSize}\n`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'approved-research-topics.txt'; a.click();
    URL.revokeObjectURL(url);
    showToast('Exported!');
  };

  // Budget helpers
  const parseCostRange = (str) => {
    if (!str) return [0, 0];
    const nums = str.replace(/[₦,]/g, '').match(/\d+/g);
    if (!nums) return [0, 0];
    return nums.length >= 2 ? [parseInt(nums[0]), parseInt(nums[1])] : [parseInt(nums[0]), parseInt(nums[0])];
  };

  const getAnalysisProjects = useCallback(() => {
    let projects = approvedTopics.filter(t => t.estimatedCost);
    if (budgetFilter.costLevel !== 'all') projects = projects.filter(t => t.estimatedCost?.costLevel === budgetFilter.costLevel);
    if (budgetFilter.molecular !== 'all') projects = projects.filter(t => budgetFilter.molecular === 'yes' ? t.estimatedCost?.hasMolecular : !t.estimatedCost?.hasMolecular);
    if (budgetFilter.bacteria !== 'all') projects = projects.filter(t => t.bacteria?.toLowerCase().includes(budgetFilter.bacteria.toLowerCase()));
    if (selectedBudgetProjects.length > 0) projects = projects.filter((_, i) => selectedBudgetProjects.includes(i));
    return projects;
  }, [approvedTopics, budgetFilter, selectedBudgetProjects]);

  // ═══ SUBCOMPONENTS ═══

  const FocusIndicator = ({ area }) => {
    const found = FOCUS_AREAS.find(a => a.id === area);
    return <div style={{ width: 4, borderRadius: 2, alignSelf: 'stretch', flexShrink: 0, background: found?.color || 'var(--border)' }} />;
  };

  const TopicCard = ({ topic, index, isApproved = false }) => {
    const key = `${isApproved ? 'a' : 'g'}-${index}`;
    const isExpanded = expandedTopic === key;
    const isRegen = regeneratingIndex === index && !isApproved;
    const isUniq = checkingUniqueness === key;
    const isProp = generatingProposal === topic.title;

    return (
      <div className="topic-card stagger-in" style={{ animationDelay: `${index * 0.06}s` }}>
        <div className="flex">
          <FocusIndicator area={topic.focusArea} />
          <div className="flex-1">
            {/* Header */}
            <div className="p-4 cursor-pointer" onClick={() => setExpandedTopic(isExpanded ? null : key)}>
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-semibold text-sm leading-snug flex-1" style={{ color: 'var(--text)' }}>{topic.title}</h3>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {topic.difficulty && <span className={`badge badge-${topic.difficulty}`}>{topic.difficulty}</span>}
                  {topic.estimatedCost?.costLevel && <span className={`badge badge-${topic.estimatedCost.costLevel}`}>{topic.estimatedCost.total}</span>}
                  {topic.estimatedCost?.hasMolecular && <span className="badge badge-advanced">🧬 PCR</span>}
                  {isExpanded ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
                </div>
              </div>
              <p className="text-xs mt-1.5 leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{topic.description}</p>
              {/* Mini tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {topic.bacteria && <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--amber-dim)', color: 'var(--amber)', fontSize: '0.65rem', fontFamily: "'JetBrains Mono', monospace" }}>{topic.bacteria}</span>}
                {topic.uniquenessScore && <span className="text-xs px-2 py-0.5 rounded" style={{ background: topic.uniquenessScore >= 7 ? 'var(--teal-dim)' : 'var(--amber-dim)', color: topic.uniquenessScore >= 7 ? 'var(--teal)' : 'var(--amber)', fontSize: '0.65rem' }}>Uniqueness {topic.uniquenessScore}/10</span>}
                {topic.estimatedDuration && <span className="text-xs px-2 py-0.5 rounded" style={{ background: 'var(--bg-elevated)', color: 'var(--text-muted)', fontSize: '0.65rem' }}>{topic.estimatedDuration}</span>}
              </div>
            </div>

            {/* Expanded */}
            {isExpanded && (
              <div className="px-4 pb-4 space-y-4" style={{ borderTop: '1px solid var(--border)' }}>
                <div className="pt-4" />

                {topic.background && <Section title="Background" text={topic.background} />}

                {topic.objectives?.length > 0 && (
                  <div>
                    <SectionTitle>Objectives</SectionTitle>
                    <ol className="list-decimal list-inside text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      {topic.objectives.map((o, i) => <li key={i}>{o}</li>)}
                    </ol>
                  </div>
                )}

                {topic.methodology && <Section title="Methodology" text={topic.methodology} />}

                {/* Sample grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {topic.sampleSource && <InfoBox label="Source" value={topic.sampleSource} />}
                  {topic.sampleType && <InfoBox label="Sample Type" value={topic.sampleType} />}
                  {topic.sampleSize && <InfoBox label="Sample Size" value={topic.sampleSize} />}
                </div>

                {/* Materials & Equipment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {topic.materials?.length > 0 && <ListBox title="Materials" items={topic.materials} />}
                  {topic.equipment?.length > 0 && <ListBox title="Equipment" items={topic.equipment} />}
                </div>

                {/* Cost Breakdown */}
                {topic.estimatedCost?.breakdown?.length > 0 && (
                  <div>
                    <SectionTitle>Cost Breakdown</SectionTitle>
                    <div className="rounded-lg overflow-hidden" style={{ border: '1px solid var(--border)' }}>
                      {topic.estimatedCost.breakdown.map((item, i) => (
                        <div key={i} className="flex justify-between px-3 py-1.5 text-xs" style={{ background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-elevated)', color: 'var(--text-secondary)' }}>
                          <span>{item.item}</span>
                          <span style={{ color: 'var(--text)', fontFamily: "'JetBrains Mono', monospace", fontSize: '0.65rem' }}>{item.cost}</span>
                        </div>
                      ))}
                      <div className="flex justify-between px-3 py-2 text-sm font-semibold" style={{ background: 'var(--teal-dim)', color: 'var(--teal)', borderTop: '1px solid var(--border)' }}>
                        <span>Total</span>
                        <span>{topic.estimatedCost.total}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Stats */}
                {topic.statisticalAnalysis && (
                  <div>
                    <SectionTitle>Statistical Analysis</SectionTitle>
                    <div className="text-xs space-y-1" style={{ color: 'var(--text-secondary)' }}>
                      <p><strong style={{ color: 'var(--text-muted)' }}>Design:</strong> {topic.statisticalAnalysis.studyDesign}</p>
                      <p><strong style={{ color: 'var(--text-muted)' }}>Sample Calc:</strong> {topic.statisticalAnalysis.sampleSizeCalculation}</p>
                      <p><strong style={{ color: 'var(--text-muted)' }}>Tests:</strong> {(topic.statisticalAnalysis.tests || []).join(', ')}</p>
                      <p><strong style={{ color: 'var(--text-muted)' }}>Software:</strong> {topic.statisticalAnalysis.software}</p>
                    </div>
                  </div>
                )}

                {/* Interview */}
                {topic.interviewRequired && topic.interviewQuestions && (
                  <div>
                    <SectionTitle>Interview Questions</SectionTitle>
                    {topic.interviewQuestions.consentQuestions?.length > 0 && (
                      <div className="mb-2">
                        <div className="text-xs font-medium mb-1" style={{ color: 'var(--amber)' }}>Consent</div>
                        <ul className="text-xs space-y-0.5 ml-3" style={{ color: 'var(--text-secondary)' }}>
                          {topic.interviewQuestions.consentQuestions.map((q, i) => <li key={i}>• {q}</li>)}
                        </ul>
                      </div>
                    )}
                    {topic.interviewQuestions.methodologyQuestions?.length > 0 && (
                      <div>
                        <div className="text-xs font-medium mb-1" style={{ color: 'var(--blue)' }}>Methodology</div>
                        <ul className="text-xs space-y-0.5 ml-3" style={{ color: 'var(--text-secondary)' }}>
                          {topic.interviewQuestions.methodologyQuestions.map((q, i) => <li key={i}>• {q}</li>)}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Callouts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topic.ethicalConsiderations && <Callout color="amber" icon="⚠️" title="Ethical Considerations" text={topic.ethicalConsiderations} />}
                  {topic.supervisorNotes && <Callout color="blue" icon="📋" title="Supervisor Notes" text={topic.supervisorNotes} />}
                </div>

                {/* Uniqueness result */}
                {topic.uniquenessCheck && (
                  <Callout color="teal" icon="🔍" title={`Uniqueness: ${topic.uniquenessCheck.score}/10`} text={`${topic.uniquenessCheck.reason}${topic.uniquenessCheck.suggestions ? `\n\n💡 ${topic.uniquenessCheck.suggestions}` : ''}`} />
                )}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: '1px solid var(--border)' }}>
                  {!isApproved && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); approveTopic(index); }} className="action-btn primary"><Star size={12} /> Approve</button>
                      <button onClick={(e) => { e.stopPropagation(); regenerateTopic(index); }} disabled={regeneratingIndex !== null} className="action-btn">
                        <RefreshCw size={12} className={isRegen ? 'animate-spin' : ''} /> {isRegen ? 'Regenerating...' : 'Regenerate'}
                      </button>
                    </>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); checkUniqueness(index, isApproved); }} disabled={checkingUniqueness !== null} className="action-btn">
                    <Search size={12} className={isUniq ? 'animate-spin' : ''} /> {isUniq ? 'Checking...' : 'Uniqueness'}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); generateProposal(topic); }} disabled={generatingProposal !== null} className="action-btn">
                    <FileText size={12} className={isProp ? 'animate-spin' : ''} /> {isProp ? 'Writing...' : 'Proposal'}
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); copyTopic(topic, key); }} className="action-btn"><Copy size={12} /> Copy</button>
                  {isApproved && <button onClick={(e) => { e.stopPropagation(); removeApproved(index); }} className="action-btn danger ml-auto"><Trash2 size={12} /> Remove</button>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ═══ RENDER ═══
  const TABS = [
    { id: 'generate', label: 'Generate', icon: <Sparkles size={13} /> },
    { id: 'approved', label: 'Approved', icon: <Star size={13} />, count: approvedTopics.length },
    { id: 'budget', label: 'Budget', icon: <Zap size={13} /> },
    { id: 'suppliers', label: 'Suppliers', icon: <ExternalLink size={13} /> },
    { id: 'grants', label: 'Grants', icon: <FlaskConical size={13} /> },
    { id: 'labplan', label: 'Lab Plan', icon: <Beaker size={13} /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-deep)' }}>
      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-30 backdrop-blur-lg" style={{ background: 'rgba(12, 17, 23, 0.85)', borderBottom: '1px solid var(--border)' }}>
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center pulse-glow" style={{ background: 'var(--teal-dim)', border: '1px solid var(--teal-border)' }}>
              <Microscope size={18} style={{ color: 'var(--teal)' }} />
            </div>
            <div>
              <h1 className="text-base font-bold" style={{ fontFamily: "'Fraunces', serif", color: 'var(--text)' }}>Research Topic Generator</h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Medical Microbiology · Lagos, Nigeria</p>
            </div>
            <button onClick={() => setShowGuide(prev => !prev)} className="ml-auto p-2 rounded-lg" style={{ color: 'var(--text-muted)', background: showGuide ? 'var(--teal-dim)' : 'transparent' }}>
              <HelpCircle size={16} />
            </button>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`tab-pill ${activeTab === tab.id ? 'active' : ''}`}>
                <span className="flex items-center gap-1.5">
                  {tab.icon} {tab.label}
                  {tab.count > 0 && <span className="text-xs px-1.5 py-0.5 rounded-full" style={{ background: 'var(--teal)', color: 'var(--bg-deep)', fontSize: '0.6rem', fontWeight: 700 }}>{tab.count}</span>}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6">
        {/* ═══ GUIDE ═══ */}
        {showGuide && activeTab === 'generate' && (
          <div className="mb-6 p-5 rounded-xl stagger-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
            <div className="flex items-start justify-between mb-3">
              <h2 className="text-sm font-semibold" style={{ color: 'var(--teal)' }}>👋 How This Works</h2>
              <button onClick={() => setShowGuide(false)}><X size={14} style={{ color: 'var(--text-muted)' }} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs" style={{ color: 'var(--text-secondary)' }}>
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--teal-dim)', color: 'var(--teal)' }}>1</span>
                <div><strong style={{ color: 'var(--text)' }}>Configure</strong><br />Pick focus areas, bacteria, demographics, lab level, and budget cap. The more specific, the better the topics.</div>
              </div>
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--amber-dim)', color: 'var(--amber)' }}>2</span>
                <div><strong style={{ color: 'var(--text)' }}>Generate & Review</strong><br />AI creates experimental topics with full methodology, costs, and stats. Approve the ones you like, regenerate the rest.</div>
              </div>
              <div className="flex gap-2">
                <span className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--blue-dim)', color: 'var(--blue)' }}>3</span>
                <div><strong style={{ color: 'var(--text)' }}>Assign & Plan</strong><br />Use the Budget tab to plan purchases, Suppliers tab to find Lagos vendors, and export the final list for students.</div>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg flex items-start gap-2" style={{ background: 'var(--coral-dim)', border: '1px solid var(--coral-border)' }}>
            <AlertCircle size={16} style={{ color: 'var(--coral)' }} className="flex-shrink-0 mt-0.5" />
            <p className="text-sm flex-1" style={{ color: 'var(--coral)' }}>{error}</p>
            <button onClick={() => setError(null)}><X size={14} style={{ color: 'var(--coral)' }} /></button>
          </div>
        )}

        {/* ═══ GENERATE TAB ═══ */}
        {activeTab === 'generate' && (
          <section className="space-y-6">
            {/* Focus Areas */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Focus Areas</label>
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map(area => (
                  <button key={area.id} onClick={() => setSelectedAreas(prev => prev.includes(area.id) ? prev.filter(a => a !== area.id) : [...prev, area.id])} className={`chip ${selectedAreas.includes(area.id) ? 'selected' : ''}`} style={selectedAreas.includes(area.id) ? { borderColor: area.color.replace(')', ', 0.4)').replace('var(', 'rgba(').replace('--', ''), background: area.color.replace(')', ', 0.1)').replace('var(', 'rgba(') } : {}}>
                    <span>{area.icon} {area.label}</span>
                  </button>
                ))}
              </div>
              <input type="text" value={customFocusArea} onChange={e => setCustomFocusArea(e.target.value)} placeholder="+ Add custom focus area..." className="mt-2 w-full px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }} />
            </div>

            {/* Bacteria */}
            <div>
              <button onClick={() => setShowBacteriaFilter(!showBacteriaFilter)} className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>
                Bacteria Filter {selectedBacteria.length > 0 && <span className="badge badge-medium">{selectedBacteria.length} selected</span>}
                {showBacteriaFilter ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              {showBacteriaFilter && (
                <div className="mt-2 p-4 rounded-xl space-y-3" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                  <div>
                    <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Aerobes</div>
                    <div className="flex flex-wrap gap-1.5">
                      {BACTERIA.filter(b => !b.anaerobe).map(b => (
                        <button key={b.id} onClick={() => setSelectedBacteria(prev => prev.includes(b.id) ? prev.filter(x => x !== b.id) : [...prev, b.id])} className={`chip chip-bacteria ${selectedBacteria.includes(b.id) ? 'selected' : ''}`}>
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-xs font-medium mb-1.5" style={{ color: 'var(--text-muted)' }}>Anaerobes</div>
                    <div className="flex flex-wrap gap-1.5">
                      {BACTERIA.filter(b => b.anaerobe).map(b => (
                        <button key={b.id} onClick={() => setSelectedBacteria(prev => prev.includes(b.id) ? prev.filter(x => x !== b.id) : [...prev, b.id])} className={`chip chip-bacteria ${selectedBacteria.includes(b.id) ? 'selected' : ''}`}>
                          {b.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  <input type="text" value={customBacteria} onChange={e => setCustomBacteria(e.target.value)} placeholder="+ Custom organism..." className="w-full px-3 py-2 rounded-lg text-xs" style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }} />
                </div>
              )}
            </div>

            {/* Resource Level — Visual Picker */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider block mb-2" style={{ color: 'var(--text-muted)', letterSpacing: '0.1em' }}>Lab Resource Level</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {RESOURCE_LEVELS.map(r => (
                  <div key={r.id} className={`resource-option ${resourceLevel === r.id ? 'selected' : ''}`} onClick={() => setResourceLevel(r.id)}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">{r.emoji}</span>
                      <div>
                        <div className="text-sm font-semibold" style={{ color: resourceLevel === r.id ? 'var(--teal)' : 'var(--text)' }}>{r.label}</div>
                        <div className="text-xs" style={{ color: 'var(--text-muted)', fontFamily: "'JetBrains Mono', monospace" }}>{r.costRange}</div>
                      </div>
                    </div>
                    <div className="text-xs space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
                      <div className="font-medium mb-1" style={{ color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Equipment</div>
                      {r.equipment.slice(0, 3).map((e, i) => <div key={i}>• {e}</div>)}
                      {r.equipment.length > 3 && <div style={{ color: 'var(--text-muted)' }}>+ {r.equipment.length - 3} more</div>}
                      <div className="font-medium mb-1 mt-2" style={{ color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Techniques</div>
                      {r.techniques.slice(0, 3).map((t, i) => <div key={i}>• {t}</div>)}
                      {r.techniques.length > 3 && <div style={{ color: 'var(--text-muted)' }}>+ {r.techniques.length - 3} more</div>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Settings Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Demographic</label>
                <select value={selectedDemographic} onChange={e => setSelectedDemographic(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {DEMOGRAPHICS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Budget Cap</label>
                <select value={maxBudget} onChange={e => setMaxBudget(e.target.value)} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {BUDGET_CAPS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wider block mb-1" style={{ color: 'var(--text-muted)' }}>Topics</label>
                <select value={numTopics} onChange={e => setNumTopics(parseInt(e.target.value))} className="w-full px-3 py-2 rounded-lg text-sm" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                  {[3, 5, 8, 10, 15].map(n => <option key={n} value={n}>{n} topics</option>)}
                </select>
              </div>
            </div>

            {/* Notes */}
            <textarea value={customNotes} onChange={e => setCustomNotes(e.target.value)} placeholder="Any specific instructions or constraints for the AI..." rows={2} className="w-full px-3 py-2 rounded-lg text-sm resize-none" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)', outline: 'none' }} />

            {/* Generate Button */}
            <button onClick={generateTopics} disabled={loading || selectedAreas.length === 0} className="w-full py-3.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all" style={{ background: loading ? 'var(--bg-elevated)' : 'var(--teal)', color: loading ? 'var(--text-muted)' : 'var(--bg-deep)', opacity: selectedAreas.length === 0 ? 0.4 : 1, cursor: loading || selectedAreas.length === 0 ? 'not-allowed' : 'pointer' }}>
              {loading ? <><RefreshCw size={16} className="animate-spin" /> Generating...</> : <><Sparkles size={16} /> Generate {numTopics} Topics</>}
            </button>

            {/* ═══ LOADING SCREEN ═══ */}
            {loading && (
              <div className="p-8 rounded-xl text-center space-y-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                <div className="flex justify-center gap-3">
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                  <div className="loading-dot" />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{loadingMsg}</p>
                  <p className="text-xs mt-2" style={{ color: 'var(--text-muted)' }}>
                    Each topic gets: methodology, sample sizes, materials lists, cost breakdowns, statistical plans, and interview questions.
                    <br />This usually takes 30–90 seconds. Good time for a coffee! ☕
                  </p>
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  {[1, 2, 3].map(i => <div key={i} className="shimmer-bar" style={{ width: `${100 - i * 15}%`, marginLeft: 'auto', marginRight: 'auto' }} />)}
                </div>
              </div>
            )}

            {/* Results */}
            {!loading && topics.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Generated Topics ({topics.length})</h2>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>Click a topic to expand details</span>
                </div>
                <div className="space-y-3">
                  {topics.map((topic, i) => <TopicCard key={i} topic={topic} index={i} />)}
                </div>
              </div>
            )}
          </section>
        )}

        {/* ═══ APPROVED TAB ═══ */}
        {activeTab === 'approved' && (
          <section>
            {approvedTopics.length === 0 ? (
              <EmptyState icon={<Star size={36} />} title="No approved topics yet" desc="Generate topics and click Approve to save them here." />
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Approved ({approvedTopics.length})</h2>
                  <button onClick={exportApproved} className="action-btn primary"><Download size={12} /> Export All</button>
                </div>
                <div className="space-y-3">
                  {approvedTopics.map((topic, i) => <TopicCard key={i} topic={topic} index={i} isApproved />)}
                </div>
              </>
            )}
          </section>
        )}

        {/* ═══ BUDGET TAB ═══ */}
        {activeTab === 'budget' && (
          <section>
            {(() => {
              const withCost = approvedTopics.filter(t => t.estimatedCost);
              if (withCost.length === 0) return <EmptyState icon={<Zap size={36} />} title="No cost data yet" desc="Generate new topics (they include cost estimates) and approve them to see budget analysis." />;

              const analysis = getAnalysisProjects();
              const total = analysis.reduce((a, t) => { const [lo, hi] = parseCostRange(t.estimatedCost?.total); return [a[0] + lo, a[1] + hi]; }, [0, 0]);
              const pheno = analysis.filter(t => !t.estimatedCost?.hasMolecular).length;
              const mol = analysis.filter(t => t.estimatedCost?.hasMolecular).length;
              const allBacteria = [...new Set(withCost.map(t => t.bacteria).filter(Boolean))];

              return (
                <div className="space-y-4">
                  {/* Filters */}
                  <div className="grid grid-cols-3 gap-2">
                    <select value={budgetFilter.costLevel} onChange={e => setBudgetFilter(p => ({ ...p, costLevel: e.target.value }))} className="px-2 py-2 rounded-lg text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                      <option value="all">All Costs</option><option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option>
                    </select>
                    <select value={budgetFilter.molecular} onChange={e => setBudgetFilter(p => ({ ...p, molecular: e.target.value }))} className="px-2 py-2 rounded-lg text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                      <option value="all">All Types</option><option value="yes">Molecular</option><option value="no">Phenotypic</option>
                    </select>
                    <select value={budgetFilter.bacteria} onChange={e => setBudgetFilter(p => ({ ...p, bacteria: e.target.value }))} className="px-2 py-2 rounded-lg text-xs" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', color: 'var(--text)' }}>
                      <option value="all">All Bacteria</option>
                      {allBacteria.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  {/* Project selector */}
                  <div className="p-4 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Select Projects</span>
                      <div className="flex gap-3">
                        <button onClick={() => setSelectedBudgetProjects(withCost.map((_, i) => i))} className="text-xs underline" style={{ color: 'var(--teal)' }}>All</button>
                        <button onClick={() => setSelectedBudgetProjects([])} className="text-xs underline" style={{ color: 'var(--text-muted)' }}>Clear</button>
                      </div>
                    </div>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {withCost.map((t, i) => (
                        <label key={i} className="flex items-center gap-2 text-xs cursor-pointer py-1 px-2 rounded-lg transition-colors" style={{ color: 'var(--text-secondary)', background: selectedBudgetProjects.includes(i) ? 'var(--teal-dim)' : 'transparent' }}>
                          <input type="checkbox" checked={selectedBudgetProjects.includes(i)} onChange={() => setSelectedBudgetProjects(p => p.includes(i) ? p.filter(x => x !== i) : [...p, i])} className="accent-teal-400" />
                          <span className="flex-1 truncate">{t.title}</span>
                          <span className={`badge badge-${t.estimatedCost?.costLevel || 'low'}`}>{t.estimatedCost?.total}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Summary */}
                  {analysis.length > 0 && (
                    <>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatCard label="Total Range" value={`₦${total[0].toLocaleString()} – ₦${total[1].toLocaleString()}`} color="teal" />
                        <StatCard label="Avg / Project" value={`₦${Math.round(total[0] / analysis.length).toLocaleString()} – ₦${Math.round(total[1] / analysis.length).toLocaleString()}`} color="blue" />
                        <StatCard label="Phenotypic" value={pheno.toString()} color="teal" />
                        <StatCard label="Molecular 🧬" value={mol.toString()} color="purple" />
                      </div>

                      {analysis.length > 1 && (
                        <div className="p-4 rounded-xl" style={{ background: 'var(--teal-dim)', border: '1px solid var(--teal-border)' }}>
                          <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--teal)' }}>💰 Bulk Savings Estimate</h3>
                          <div className="text-xs space-y-1" style={{ color: 'rgba(45, 212, 168, 0.8)' }}>
                            {mol > 1 && <p>• PCR reagents: {mol} projects can share (save ~₦100,000–200,000)</p>}
                            {pheno > 1 && <p>• Culture media: {pheno} projects share agar bottles (save ~₦50,000–100,000)</p>}
                            <p>• Consumables: Buy cartons of 500 petri dishes vs packs of 20</p>
                            <p>• Antibiotic discs: Bulk = 10-15% discount</p>
                          </div>
                          <p className="text-xs mt-3 pt-2 font-semibold" style={{ borderTop: '1px solid var(--teal-border)', color: 'var(--teal)' }}>
                            Est. savings: ₦{(analysis.length * 30000).toLocaleString()} – ₦{(analysis.length * 80000).toLocaleString()}
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              );
            })()}
          </section>
        )}

        {/* ═══ SUPPLIERS TAB ═══ */}
        {activeTab === 'suppliers' && (
          <section className="space-y-4">
            <Callout color="teal" icon="💡" title="Pro Tip" text="Call ahead to confirm stock and prices. Bulk orders usually get 10-20% off. Always ask for student/institutional pricing." />
            <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Laboratory Suppliers — Lagos</h2>
            <div className="space-y-3">
              {SUPPLIERS.map((s, i) => (
                <div key={i} className="supplier-card stagger-in" style={{ animationDelay: `${i * 0.08}s` }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{s.name}</h3>
                        {s.tag && <span className="badge badge-medium">{s.tag}</span>}
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{s.specialty}</p>
                    </div>
                    {s.website && <a href={s.website} target="_blank" rel="noopener noreferrer" className="action-btn" style={{ flexShrink: 0 }}><ExternalLink size={11} /> Visit</a>}
                  </div>
                  <div className="text-xs space-y-0.5" style={{ color: 'var(--text-muted)' }}>
                    <p>📍 {s.address}</p>
                    <p>📞 {s.phone}</p>
                    {s.email !== 'via website' && <p>✉️ {s.email}</p>}
                  </div>
                  <p className="text-xs mt-2 italic" style={{ color: 'var(--text-muted)' }}>{s.notes}</p>
                </div>
              ))}
            </div>

            <h2 className="text-xs font-semibold uppercase tracking-wider pt-4" style={{ color: 'var(--text-muted)' }}>Molecular Services</h2>
            <div className="supplier-card">
              <h3 className="font-semibold text-sm mb-1" style={{ color: 'var(--text)' }}>{NIMR.name}</h3>
              <p className="text-xs mb-2" style={{ color: 'var(--text-secondary)' }}>{NIMR.desc}</p>
              <div className="text-xs space-y-0.5" style={{ color: 'var(--text-muted)' }}>
                <p>📍 {NIMR.address}</p>
                <p>📞 {NIMR.phone}</p>
                <p>✉️ {NIMR.email}</p>
              </div>
              <p className="text-xs mt-2 font-medium" style={{ color: 'var(--amber)', fontFamily: "'JetBrains Mono', monospace" }}>{NIMR.pricing}</p>
            </div>
          </section>
        )}

        {/* ═══ GRANTS TAB ═══ */}
        {activeTab === 'grants' && (
          <section className="space-y-6">
            {['Nigerian', 'International', 'AMR'].map(type => {
              const items = GRANTS.filter(g => g.type === type);
              if (!items.length) return null;
              return (
                <div key={type}>
                  <h2 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--text-muted)' }}>
                    {type === 'AMR' ? '🦠 AMR-Specific' : type === 'Nigerian' ? '🇳🇬 Nigerian' : '🌍 International'} Funding
                  </h2>
                  <div className="space-y-2">
                    {items.map((g, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl stagger-in" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', animationDelay: `${i * 0.06}s` }}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span>{g.emoji}</span>
                            <h3 className="font-semibold text-sm" style={{ color: 'var(--text)' }}>{g.name}</h3>
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--text-secondary)' }}>{g.desc}</p>
                        </div>
                        <a href={g.url} target="_blank" rel="noopener noreferrer" className="action-btn"><ExternalLink size={11} /> Apply</a>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <Callout color="amber" icon="📝" title="Application Tips" text="TETFund calls are institutional — check with your university admin. Wellcome & Fogarty need a lead PI with host institution. GARDP specifically funds AMR. Always look for co-funding opportunities." />
          </section>
        )}

        {/* ═══ LAB PLAN TAB ═══ */}
        {activeTab === 'labplan' && (
          <section>
            {(() => {
              const mol = approvedTopics.filter(t => t.estimatedCost?.hasMolecular);
              if (!mol.length) return <EmptyState icon={<Beaker size={36} />} title="No molecular projects yet" desc="Approve topics with PCR/molecular work to see gel layout planning and shared reagent tracking." />;

              return (
                <div className="space-y-4">
                  <h2 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--text-muted)' }}>Molecular Projects ({mol.length})</h2>
                  <div className="space-y-2">
                    {mol.map((t, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }}>
                        <span className="badge badge-advanced">🧬</span>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium truncate" style={{ color: 'var(--text)' }}>{t.title}</div>
                          <div className="text-xs" style={{ color: 'var(--text-muted)' }}>{t.bacteria || 'Various organisms'}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl" style={{ background: 'var(--blue-dim)', border: '1px solid var(--blue-border)' }}>
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-2" style={{ color: 'var(--blue)' }}>🧬 Gel Layout Optimizer</h3>
                    <div className="text-xs space-y-1" style={{ color: 'rgba(91, 156, 246, 0.8)' }}>
                      <p>Standard gel = 15 wells. Wells 1 & 8 for DNA ladders → 13 sample wells/gel.</p>
                      <p>Projects: {mol.length} · Est. samples/project: ~20–50</p>
                      <p>Gels needed: ~{Math.ceil(mol.length * 35 / 13)}</p>
                      <p>Batch projects with similar primer sets for max efficiency.</p>
                    </div>
                  </div>

                  <Callout color="teal" icon="💡" title="Cost-Saving Tips" text={`• Share PCR master mix across projects — buy 500-rxn kit if 3+ need it\n• Pool primer orders for minimum qty discounts\n• Book NIMR sequencing as a batch\n• Run gels back-to-back to share buffer`} />
                </div>
              );
            })()}
          </section>
        )}
      </main>

      {/* ═══ PROPOSAL MODAL ═══ */}
      {proposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)' }} onClick={() => setProposalModal(null)}>
          <div className="rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" style={{ background: 'var(--bg-card)', border: '1px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-bold text-base" style={{ fontFamily: "'Fraunces', serif", color: 'var(--text)' }}>Research Proposal</h2>
              <button onClick={() => setProposalModal(null)} className="p-1"><X size={18} style={{ color: 'var(--text-muted)' }} /></button>
            </div>
            <pre className="whitespace-pre-wrap text-xs leading-relaxed" style={{ color: 'var(--text-secondary)', fontFamily: "'Outfit', sans-serif" }}>{proposalModal.text}</pre>
            <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: '1px solid var(--border)' }}>
              <button onClick={() => { navigator.clipboard.writeText(proposalModal.text); showToast('Proposal copied!'); }} className="action-btn primary"><Copy size={12} /> Copy</button>
              <button onClick={() => setProposalModal(null)} className="action-btn">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TOASTS ═══ */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className="toast px-4 py-2.5 rounded-lg text-sm font-medium shadow-xl" style={{ background: t.type === 'info' ? 'var(--bg-elevated)' : 'var(--teal)', color: t.type === 'info' ? 'var(--text)' : 'var(--bg-deep)' }}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// SHARED MINI COMPONENTS
// ═══════════════════════════════════════════

function SectionTitle({ children }) {
  return <h4 className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--text-muted)', letterSpacing: '0.08em' }}>{children}</h4>;
}

function Section({ title, text }) {
  return <div><SectionTitle>{title}</SectionTitle><p className="text-xs leading-relaxed" style={{ color: 'var(--text-secondary)' }}>{text}</p></div>;
}

function InfoBox({ label, value }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: 'var(--bg-elevated)' }}>
      <div className="text-xs font-medium mb-0.5" style={{ color: 'var(--text-muted)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{label}</div>
      <div className="text-xs" style={{ color: 'var(--text-secondary)' }}>{value}</div>
    </div>
  );
}

function ListBox({ title, items }) {
  return (
    <div>
      <SectionTitle>{title}</SectionTitle>
      <ul className="text-xs space-y-0.5" style={{ color: 'var(--text-secondary)' }}>
        {items.map((item, i) => <li key={i} className="flex gap-1.5"><span style={{ color: 'var(--text-muted)' }}>•</span>{item}</li>)}
      </ul>
    </div>
  );
}

function Callout({ color, icon, title, text }) {
  const c = {
    teal: { bg: 'var(--teal-dim)', border: 'var(--teal-border)', title: 'var(--teal)', text: 'rgba(45, 212, 168, 0.7)' },
    amber: { bg: 'var(--amber-dim)', border: 'var(--amber-border)', title: 'var(--amber)', text: 'rgba(240, 180, 41, 0.7)' },
    coral: { bg: 'var(--coral-dim)', border: 'var(--coral-border)', title: 'var(--coral)', text: 'rgba(240, 106, 106, 0.7)' },
    blue: { bg: 'var(--blue-dim)', border: 'var(--blue-border)', title: 'var(--blue)', text: 'rgba(91, 156, 246, 0.7)' },
  }[color] || c.teal;

  return (
    <div className="p-4 rounded-xl" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
      <div className="text-xs font-semibold mb-1" style={{ color: c.title }}>{icon} {title}</div>
      <p className="text-xs whitespace-pre-line leading-relaxed" style={{ color: c.text }}>{text}</p>
    </div>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex mb-4" style={{ color: 'var(--text-muted)', opacity: 0.3 }}>{icon}</div>
      <p className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>{title}</p>
      <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{desc}</p>
    </div>
  );
}

function StatCard({ label, value, color }) {
  const bg = `var(--${color}-dim)`;
  const fg = `var(--${color})`;
  return (
    <div className="p-3 rounded-xl text-center" style={{ background: bg }}>
      <div className="text-xs mb-0.5" style={{ color: 'var(--text-muted)' }}>{label}</div>
      <div className="text-xs font-bold" style={{ color: fg, fontFamily: "'JetBrains Mono', monospace" }}>{value}</div>
    </div>
  );
}
