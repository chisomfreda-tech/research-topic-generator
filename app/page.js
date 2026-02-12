'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Sparkles, RefreshCw, Copy, Check, Star, Trash2, FileText, Search,
  ChevronDown, ChevronUp, X, Microscope, FlaskConical, Beaker,
  ExternalLink, AlertCircle, HelpCircle, Zap, Download, Users,
  Mail, Upload, Clock, ArrowRight, ArrowLeft, Eye, EyeOff
} from 'lucide-react';

// ═══════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════

const FOCUS_AREAS = [
  { id: 'plant', label: 'Plant-Based Antimicrobials', icon: '🌿', color: 'var(--sage)' },
  { id: 'amr', label: 'Antimicrobial Resistance', icon: '🦠', color: 'var(--accent)' },
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

const EQUIPMENT_LIST = [
  { id: 'autoclave', name: 'Autoclave', hint: 'Sterilization', tier: 'basic' },
  { id: 'incubator', name: 'Incubator', hint: '37°C culture', tier: 'basic' },
  { id: 'microscope', name: 'Microscope', hint: 'Gram stain viewing', tier: 'basic' },
  { id: 'colony_counter', name: 'Colony Counter', hint: 'CFU counting', tier: 'basic' },
  { id: 'bunsen', name: 'Bunsen Burner', hint: 'Aseptic technique', tier: 'basic' },
  { id: 'water_bath', name: 'Water Bath', hint: 'Temp-controlled', tier: 'basic' },
  { id: 'centrifuge', name: 'Centrifuge', hint: 'Sample separation', tier: 'intermediate' },
  { id: 'pcr', name: 'PCR Thermocycler', hint: 'DNA amplification', tier: 'intermediate' },
  { id: 'gel', name: 'Gel Electrophoresis', hint: 'DNA separation', tier: 'intermediate' },
  { id: 'spectro', name: 'Spectrophotometer', hint: 'OD readings, MIC', tier: 'intermediate' },
  { id: 'elisa', name: 'ELISA Reader', hint: 'Immunoassays', tier: 'intermediate' },
  { id: 'vortex', name: 'Vortex Mixer', hint: 'Sample mixing', tier: 'intermediate' },
  { id: 'sequencer', name: 'DNA Sequencer', hint: '16S rRNA / WGS', tier: 'advanced' },
  { id: 'hplc', name: 'HPLC', hint: 'Compound analysis', tier: 'advanced' },
  { id: 'mass_spec', name: 'Mass Spectrometer', hint: 'MALDI-TOF', tier: 'advanced' },
  { id: 'rtpcr', name: 'Real-Time PCR', hint: 'qPCR quantification', tier: 'advanced' },
  { id: 'flow', name: 'Flow Cytometer', hint: 'Cell analysis', tier: 'advanced' },
];

const TIMELINES = [
  { value: '1', label: '1 month' },
  { value: '3', label: '3 months' },
  { value: '6', label: '6 months' },
  { value: '8', label: '8 months' },
  { value: '12', label: '12 months' },
];

const BUDGET_CAPS = [
  { value: 'any', label: 'Any budget' },
  { value: '300000', label: 'Under ₦300K' },
  { value: '500000', label: 'Under ₦500K' },
  { value: '800000', label: 'Under ₦800K' },
];

const SUPPLIERS = [
  { name: 'Finlab Nigeria Limited', specialty: 'Full range — reagents, media, equipment, glassware', address: '4, Alhaji Adejumo Ave, Ilupeju, Lagos', phone: '+234 813 575 1930', email: 'sales@finlabnigeria.com', website: 'https://finlabnigeria.com', notes: 'Est. 1981. Major university stockist.', tag: 'Most Popular' },
  { name: 'Koeman Integrated Services', specialty: 'Culture media, chemicals, reagents', address: '587, Agege Motor Road, Shogunle, Ikeja, Lagos', phone: '+234 708 431 8797', email: 'info@koemanits.com', website: 'https://koemanits.com', notes: 'ISO 9001. Thermo Fisher partner.', tag: 'Thermo Fisher' },
  { name: 'Allschoolabs Scientific', specialty: 'Lab equipment, glassware, reagents', address: '104 Western Avenue, Ojuelegba, Lagos', phone: '+234 816 338 3206', website: 'https://allschoolabs.com', notes: 'Also does equipment maintenance.' },
  { name: 'Pascal Scientific', specialty: 'Equipment, reagents, lab installation', address: 'Lagos (multiple locations)', website: 'https://pascalscientific.com', notes: 'Shimadzu & Thermo Fisher authorized.' },
  { name: 'Regino Medicals', specialty: 'HiMedia products — culture media & antibiotic discs', address: 'Lagos', notes: 'More affordable than Oxoid. Good for student projects.', tag: 'Budget' },
];

const NIMR = { name: 'NIMR Central Research Laboratory', desc: 'Molecular services — sequencing, HPLC at institutional rates', address: '6, Edmond Crescent, Off Murtala Mohammed Way, Yaba, Lagos', phone: '+234 803 381 0466', email: 'centralresearchlab@nimr.gov.ng', pricing: 'Sequencing ~₦6,000/primer · HPLC ~₦3,000–20,000/sample' };

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
  { msg: "Designing experiments around your lab equipment...", time: 0 },
  { msg: "Checking sample collection feasibility in Lagos...", time: 4000 },
  { msg: "Calculating realistic Naira budgets...", time: 8000 },
  { msg: "Cross-referencing existing literature...", time: 12000 },
  { msg: "Building statistical analysis frameworks...", time: 16000 },
  { msg: "Compiling materials lists from Lagos suppliers...", time: 20000 },
  { msg: "Almost there — polishing methodology details...", time: 25000 },
  { msg: "This is a lot of science — hang tight... ☕", time: 32000 },
  { msg: "Still working. Good topics take time!", time: 40000 },
];

const WALKTHROUGH_STEPS = [
  { target: 'focus-areas', text: 'Select which areas of microbiology you want topics in', position: 'below' },
  { target: 'equipment', text: 'Check the equipment your lab actually has — or use a preset', position: 'below' },
  { target: 'timeline', text: 'How long do students have? This shapes what experiments are feasible', position: 'below' },
  { target: 'generate-btn', text: 'Hit generate and the AI designs full experiments with costs and methodology', position: 'above' },
  { target: 'tabs', text: 'After generating, approve topics, plan budgets, and assign to students', position: 'below' },
];

const SK = 'rtg-v3'; // localStorage prefix

// ═══════════════════════════════════════
// HOOKS
// ═══════════════════════════════════════

function usePersistedState(key, def) {
  const [val, setVal] = useState(def);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { try { const s = localStorage.getItem(key); if (s) setVal(JSON.parse(s)); } catch {} setLoaded(true); }, [key]);
  useEffect(() => { if (loaded) try { localStorage.setItem(key, JSON.stringify(val)); } catch {} }, [key, val, loaded]);
  return [val, setVal, loaded];
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const show = (message, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, message, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  };
  return { toasts, show };
}

// ═══════════════════════════════════════
// MAIN
// ═══════════════════════════════════════

export default function App() {
  // ─── State ───
  const [activeTab, setActiveTab] = useState('generate');
  const [selectedAreas, setSelectedAreas] = useState(['plant', 'amr']);
  const [selectedBacteria, setSelectedBacteria] = useState([]);
  const [selectedDemographic, setSelectedDemographic] = useState('general');
  const [equipment, setEquipment] = usePersistedState(`${SK}-equip`, EQUIPMENT_LIST.filter(e => e.tier === 'basic').map(e => e.id));
  const [timeline, setTimeline] = useState('8');
  const [numTopics, setNumTopics] = useState(5);
  const [maxBudget, setMaxBudget] = useState('any');
  const [customNotes, setCustomNotes] = useState('');
  const [customFocusArea, setCustomFocusArea] = useState('');
  const [customBacteria, setCustomBacteria] = useState('');

  const [topics, setTopics] = useState([]);
  const [approvedTopics, setApprovedTopics] = usePersistedState(`${SK}-approved`, []);
  const [students, setStudents] = usePersistedState(`${SK}-students`, []);
  const [assignments, setAssignments] = usePersistedState(`${SK}-assign`, {});

  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState('');
  const [error, setError] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [regeneratingIdx, setRegeneratingIdx] = useState(null);
  const [checkingUniq, setCheckingUniq] = useState(null);
  const [genProposal, setGenProposal] = useState(null);
  const [proposalModal, setProposalModal] = useState(null);
  const [budgetFilter, setBudgetFilter] = useState({ costLevel: 'all', molecular: 'all' });
  const [selectedBudgetProjects, setSelectedBudgetProjects] = useState([]);

  // Collapsible sections (all open by default)
  const [sections, setSections] = useState({ guide: true, focus: true, bacteria: false, equipment: true, settings: true });
  const toggleSection = (k) => setSections(p => ({ ...p, [k]: !p[k] }));

  // Walkthrough
  const [showWalkthrough, setShowWalkthrough] = usePersistedState(`${SK}-walkthrough`, true);
  const [walkthroughStep, setWalkthroughStep] = useState(0);

  const { toasts, show: showToast } = useToast();

  // Loading messages rotation
  useEffect(() => {
    if (!loading) return;
    setLoadingMsg(LOADING_MESSAGES[0].msg);
    const timers = LOADING_MESSAGES.slice(1).map(({ msg, time }) => setTimeout(() => setLoadingMsg(msg), time));
    return () => timers.forEach(clearTimeout);
  }, [loading]);

  // Equipment presets
  const applyPreset = (tier) => {
    const tiers = { basic: ['basic'], intermediate: ['basic', 'intermediate'], advanced: ['basic', 'intermediate', 'advanced'] };
    setEquipment(EQUIPMENT_LIST.filter(e => tiers[tier].includes(e.tier)).map(e => e.id));
  };
  const activePreset = (() => {
    const ids = new Set(equipment);
    const basic = EQUIPMENT_LIST.filter(e => e.tier === 'basic').every(e => ids.has(e.id));
    const inter = EQUIPMENT_LIST.filter(e => e.tier === 'intermediate').every(e => ids.has(e.id));
    const adv = EQUIPMENT_LIST.filter(e => e.tier === 'advanced').every(e => ids.has(e.id));
    if (basic && inter && adv) return 'advanced';
    if (basic && inter && !adv) return 'intermediate';
    if (basic && !inter) return 'basic';
    return null;
  })();

  const toggleEquip = (id) => setEquipment(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  // ─── API Calls ───
  const generateTopics = async () => {
    if (selectedAreas.length === 0) { setError('Select at least one focus area'); return; }
    if (equipment.length === 0) { setError('Select at least one piece of equipment'); return; }
    setLoading(true); setError(null); setTopics([]);
    try {
      const batchSize = 5;
      const batches = Math.ceil(numTopics / batchSize);
      let all = [];
      for (let i = 0; i < batches; i++) {
        const count = Math.min(batchSize, numTopics - all.length);
        const res = await fetch('/api/generate', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedAreas, selectedBacteria, selectedDemographic, equipment, timeline, numTopics: count, maxBudget, customNotes, customFocusArea, customBacteria, existingTitles: all.map(t => t.title) }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Generation failed');
        all = [...all, ...(data.topics || [])];
        setTopics([...all]);
      }
    } catch (err) { setError(err.message); } finally { setLoading(false); }
  };

  const regenerateTopic = async (idx) => {
    setRegeneratingIdx(idx);
    try {
      const t = topics[idx];
      const res = await fetch('/api/regenerate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentTitle: t.title, focusArea: t.focusArea, equipment, timeline }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setTopics(p => { const u = [...p]; u[idx] = data; return u; });
      showToast('Topic regenerated');
    } catch (err) { setError(err.message); } finally { setRegeneratingIdx(null); }
  };

  const checkUniqueness = async (idx, isApproved = false) => {
    const key = `${isApproved ? 'a' : 'g'}-${idx}`;
    setCheckingUniq(key);
    try {
      const list = isApproved ? approvedTopics : topics;
      const res = await fetch('/api/uniqueness', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: list[idx].title }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      const up = p => { const u = [...p]; u[idx] = { ...u[idx], uniquenessCheck: data }; return u; };
      isApproved ? setApprovedTopics(up) : setTopics(up);
      showToast(`Uniqueness: ${data.score}/10`);
    } catch (err) { setError(err.message); } finally { setCheckingUniq(null); }
  };

  const generateProposal = async (topic) => {
    setGenProposal(topic.title);
    try {
      const res = await fetch('/api/proposal', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProposalModal({ title: topic.title, text: data.proposal });
    } catch (err) { setError(err.message); } finally { setGenProposal(null); }
  };

  const approveTopic = (idx) => {
    setApprovedTopics(p => [...p, { ...topics[idx], approvedAt: new Date().toISOString() }]);
    setTopics(p => p.filter((_, i) => i !== idx));
    showToast('Topic approved! ⭐');
  };

  const removeApproved = (idx) => {
    setApprovedTopics(p => p.filter((_, i) => i !== idx));
    showToast('Topic removed', 'info');
  };

  const copyTopic = (topic) => {
    const text = `${topic.title}\n\n${topic.description}\n\nObjectives:\n${(topic.objectives || []).map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nMethodology: ${topic.methodology}\n\nSample: ${topic.sampleType} from ${topic.sampleSource}, n=${topic.sampleSize}\n\nEstimated Cost: ${topic.estimatedCost?.total || 'N/A'}\n\nKeywords: ${(topic.keywords || []).join(', ')}`;
    navigator.clipboard.writeText(text);
    showToast('Copied to clipboard');
  };

  const exportApproved = () => {
    const text = approvedTopics.map((t, i) => `─────────────────────────────\nTOPIC ${i + 1}: ${t.title}\n─────────────────────────────\n${t.description}\n\nFocus: ${FOCUS_AREAS.find(a => a.id === t.focusArea)?.label || t.focusArea}\nBacteria: ${t.bacteria || 'Various'}\nDifficulty: ${t.difficulty}\nCost: ${t.estimatedCost?.total || 'N/A'}\nDuration: ${t.estimatedDuration || 'N/A'}\n\nObjectives:\n${(t.objectives || []).map((o, j) => `  ${j + 1}. ${o}`).join('\n')}\n\nMethodology:\n  ${t.methodology}\n\nSample: ${t.sampleType} from ${t.sampleSource}, n=${t.sampleSize}\n`).join('\n\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'approved-topics.txt'; a.click();
    showToast('Exported!');
  };

  // ─── Student management ───
  const handleCSVUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target.result;
      const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
      const newStudents = [];
      for (const line of lines) {
        const parts = line.split(',').map(p => p.trim().replace(/^"|"$/g, ''));
        if (parts.length >= 2 && parts[1].includes('@')) {
          newStudents.push({ name: parts[0], email: parts[1] });
        } else if (parts.length === 1 && parts[0].includes('@')) {
          newStudents.push({ name: parts[0].split('@')[0], email: parts[0] });
        } else if (parts.length >= 1 && !parts[0].toLowerCase().includes('name')) {
          newStudents.push({ name: parts[0], email: parts[1] || '' });
        }
      }
      if (newStudents.length > 0) {
        setStudents(p => [...p, ...newStudents]);
        showToast(`Added ${newStudents.length} students`);
      } else {
        setError('Could not parse CSV. Use format: Name, Email');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const assignTopic = (studentIdx, topicIdx) => {
    setAssignments(p => ({ ...p, [studentIdx]: topicIdx }));
    showToast('Topic assigned');
  };

  const openEmail = (student, topic) => {
    const subject = encodeURIComponent(`Research Topic Assignment: ${topic.title}`);
    const body = encodeURIComponent(`Dear ${student.name},\n\nYou have been assigned the following research topic:\n\nTitle: ${topic.title}\n\nDescription:\n${topic.description}\n\nObjectives:\n${(topic.objectives || []).map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\nMethodology:\n${topic.methodology}\n\nSample: ${topic.sampleType} from ${topic.sampleSource}, n=${topic.sampleSize}\n\nEstimated Cost: ${topic.estimatedCost?.total || 'N/A'}\nTimeline: ${topic.estimatedDuration || timeline + ' months'}\n\nPlease review this topic and prepare your research proposal. Let me know if you have any questions.\n\nBest regards`);
    window.open(`mailto:${student.email}?subject=${subject}&body=${body}`);
  };

  // ─── Budget helpers ───
  const parseCostRange = (str) => {
    if (!str) return [0, 0];
    const nums = str.replace(/[₦,]/g, '').match(/\d+/g);
    if (!nums) return [0, 0];
    return nums.length >= 2 ? [parseInt(nums[0]), parseInt(nums[1])] : [parseInt(nums[0]), parseInt(nums[0])];
  };

  // ═══════════════════════════════════════
  // SUB-COMPONENTS
  // ═══════════════════════════════════════

  const CollapsibleSection = ({ id, title, badge, children }) => (
    <div className="mb-4">
      <div className="collapsible-header" onClick={() => toggleSection(id)}>
        <div className="flex items-center gap-2">
          <span className="section-label">{title}</span>
          {badge && <span className="badge badge-medium" style={{ fontSize: '0.55rem' }}>{badge}</span>}
        </div>
        <ChevronDown size={14} className={`collapse-icon ${sections[id] ? 'open' : ''}`} />
      </div>
      {sections[id] && <div>{children}</div>}
    </div>
  );

  const WalkthroughTip = ({ step }) => {
    if (!showWalkthrough || walkthroughStep !== step) return null;
    const s = WALKTHROUGH_STEPS[step];
    return (
      <div className="walkthrough-tip" style={s.position === 'above' ? { bottom: -8, top: 'auto', transform: 'translateY(100%)' } : {}}>
        {s.position === 'above' && <style>{`.walkthrough-tip::after { bottom: auto; top: -6px; border-top: none; border-bottom: 6px solid var(--accent); }`}</style>}
        <span className="tip-num">{step + 1}</span>
        {s.text}
        <div className="tip-nav">
          {step > 0 && <button onClick={(e) => { e.stopPropagation(); setWalkthroughStep(step - 1); }}>← Back</button>}
          {step < WALKTHROUGH_STEPS.length - 1 ? (
            <button className="next" onClick={(e) => { e.stopPropagation(); setWalkthroughStep(step + 1); }}>Next →</button>
          ) : (
            <button className="next" onClick={(e) => { e.stopPropagation(); setShowWalkthrough(false); }}>Done ✓</button>
          )}
          <button onClick={(e) => { e.stopPropagation(); setShowWalkthrough(false); }} style={{ marginLeft: 'auto', opacity: 0.6 }}>Skip</button>
        </div>
      </div>
    );
  };

  const TopicCard = ({ topic, index, isApproved = false }) => {
    const key = `${isApproved ? 'a' : 'g'}-${index}`;
    const isOpen = expandedTopic === key;
    const isRegen = regeneratingIdx === index && !isApproved;
    const isUniq = checkingUniq === key;
    const isProp = genProposal === topic.title;
    const areaColor = FOCUS_AREAS.find(a => a.id === topic.focusArea)?.color || 'var(--border)';

    return (
      <div className="topic-card fade-in" style={{ animationDelay: `${index * 0.06}s` }}>
        <div className="flex">
          <div style={{ width: 4, borderRadius: '2px 0 0 2px', background: areaColor, flexShrink: 0 }} />
          <div className="flex-1">
            {/* ── Collapsed header ── */}
            <div className="p-4 cursor-pointer" onClick={() => setExpandedTopic(isOpen ? null : key)}>
              <div className="flex items-start justify-between gap-3">
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, lineHeight: 1.4, color: 'var(--text)', fontFamily: "'Literata', serif" }}>{topic.title}</h3>
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {topic.difficulty && <span className={`badge badge-${topic.difficulty}`}>{topic.difficulty}</span>}
                  {topic.estimatedCost?.costLevel && <span className={`badge badge-${topic.estimatedCost.costLevel}`}>{topic.estimatedCost.total}</span>}
                  {topic.estimatedCost?.hasMolecular && <span className="badge badge-molecular">🧬 PCR</span>}
                  {isOpen ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
                </div>
              </div>
              {/* Layman language */}
              {topic.layman && (
                <p style={{ fontSize: '0.82rem', color: 'var(--accent)', marginTop: '0.4rem', lineHeight: 1.5, fontStyle: 'italic' }}>
                  In plain language: {topic.layman}
                </p>
              )}
              <p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', marginTop: '0.3rem', lineHeight: 1.55 }}>{topic.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {topic.bacteria && <span className="badge badge-bacteria">{topic.bacteria}</span>}
                {topic.estimatedDuration && <span className="badge" style={{ background: 'var(--bg-input)', color: 'var(--text-muted)' }}>{topic.estimatedDuration}</span>}
                {topic.uniquenessCheck && <span className="badge" style={{ background: topic.uniquenessCheck.score >= 7 ? 'var(--sage-dim)' : 'var(--amber-dim)', color: topic.uniquenessCheck.score >= 7 ? 'var(--sage)' : 'var(--amber)' }}>Uniqueness {topic.uniquenessCheck.score}/10</span>}
              </div>
            </div>

            {/* ── Expanded content ── */}
            {isOpen && (
              <div className="px-4 pb-4 space-y-5" style={{ borderTop: '1.5px solid var(--border)' }}>
                <div className="pt-4" />

                {/* Background */}
                {topic.background && (
                  <div className="p-4 rounded-lg" style={{ background: 'var(--bg-hover)', borderLeft: '3px solid var(--blue)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--blue)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      📖 Background
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.65 }}>{topic.background}</p>
                  </div>
                )}

                {/* Objectives */}
                {topic.objectives?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--sage)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      🎯 Objectives
                    </div>
                    <div className="space-y-2">
                      {topic.objectives.map((o, i) => (
                        <div key={i} className="flex gap-3 items-start">
                          <span style={{ width: 22, height: 22, borderRadius: 6, background: i === 0 ? 'var(--accent-dim)' : 'var(--bg-input)', color: i === 0 ? 'var(--accent)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', fontWeight: 800, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{o}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Methodology */}
                {topic.methodology && (
                  <div className="p-4 rounded-lg" style={{ background: 'var(--bg-hover)', borderLeft: '3px solid var(--sage)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--sage)', marginBottom: '0.4rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      🔬 Methodology
                    </div>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.65 }}>{topic.methodology}</p>
                  </div>
                )}

                {/* Sample info — visual cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {topic.sampleSource && <InfoCard icon="📍" label="Sample Source" value={topic.sampleSource} />}
                  {topic.sampleType && <InfoCard icon="🧫" label="Sample Type" value={topic.sampleType} />}
                  {topic.sampleSize && <InfoCard icon="📊" label="Sample Size" value={topic.sampleSize} />}
                </div>

                {/* Materials & Equipment — side by side with distinct styling */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {topic.materials?.length > 0 && (
                    <div className="p-3 rounded-lg" style={{ background: 'var(--amber-dim)', border: '1px solid var(--amber-border)' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--amber)', marginBottom: '0.4rem' }}>🧪 Materials</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {topic.materials.map((item, i) => <div key={i}>• {item}</div>)}
                      </div>
                    </div>
                  )}
                  {topic.equipment?.length > 0 && (
                    <div className="p-3 rounded-lg" style={{ background: 'var(--blue-dim)', border: '1px solid var(--blue-border)' }}>
                      <div style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--blue)', marginBottom: '0.4rem' }}>⚙️ Equipment</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        {topic.equipment.map((item, i) => <div key={i}>• {item}</div>)}
                      </div>
                    </div>
                  )}
                </div>

                {/* Cost Breakdown */}
                {topic.estimatedCost?.breakdown?.length > 0 && (
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--sage)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      💰 Cost Breakdown
                    </div>
                    <div style={{ border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                      {topic.estimatedCost.breakdown.map((item, i) => (
                        <div key={i} className="flex justify-between px-4 py-2" style={{ fontSize: '0.8rem', background: i % 2 === 0 ? 'var(--bg-card)' : 'var(--bg-hover)', color: 'var(--text-secondary)' }}>
                          <span>{item.item}</span>
                          <span className="mono" style={{ fontWeight: 600, color: 'var(--text)' }}>{item.cost}</span>
                        </div>
                      ))}
                      <div className="flex justify-between px-4 py-3" style={{ fontSize: '0.88rem', fontWeight: 700, background: 'var(--sage-dim)', color: 'var(--sage)', borderTop: '1.5px solid var(--border)' }}>
                        <span>Total</span><span>{topic.estimatedCost.total}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Statistical Analysis */}
                {topic.statisticalAnalysis && (
                  <div className="p-4 rounded-lg" style={{ background: 'var(--bg-hover)', borderLeft: '3px solid var(--purple)' }}>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--purple)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      📈 Statistical Analysis
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2" style={{ fontSize: '0.8rem' }}>
                      <div><span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.68rem' }}>Design</span><br /><span style={{ color: 'var(--text)' }}>{topic.statisticalAnalysis.studyDesign}</span></div>
                      <div><span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.68rem' }}>Software</span><br /><span style={{ color: 'var(--text)' }}>{topic.statisticalAnalysis.software}</span></div>
                      <div style={{ gridColumn: 'span 2' }}><span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.68rem' }}>Sample Calculation</span><br /><span className="mono" style={{ color: 'var(--text)', fontSize: '0.76rem' }}>{topic.statisticalAnalysis.sampleSizeCalculation}</span></div>
                      <div style={{ gridColumn: 'span 2' }}><span style={{ fontWeight: 600, color: 'var(--text-muted)', fontSize: '0.68rem' }}>Tests</span><br /><span style={{ color: 'var(--text)' }}>{(topic.statisticalAnalysis.tests || []).join(' · ')}</span></div>
                    </div>
                  </div>
                )}

                {/* Interview Questions */}
                {topic.interviewRequired && topic.interviewQuestions && (
                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      🗣️ Interview Questions
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {topic.interviewQuestions.consentQuestions?.length > 0 && (
                        <div className="p-3 rounded-lg" style={{ background: 'var(--amber-dim)', border: '1px solid var(--amber-border)' }}>
                          <div style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--amber)', marginBottom: '0.3rem' }}>Consent</div>
                          {topic.interviewQuestions.consentQuestions.map((q, i) => <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.2rem' }}>• {q}</div>)}
                        </div>
                      )}
                      {topic.interviewQuestions.methodologyQuestions?.length > 0 && (
                        <div className="p-3 rounded-lg" style={{ background: 'var(--blue-dim)', border: '1px solid var(--blue-border)' }}>
                          <div style={{ fontSize: '0.66rem', fontWeight: 700, color: 'var(--blue)', marginBottom: '0.3rem' }}>Methodology</div>
                          {topic.interviewQuestions.methodologyQuestions.map((q, i) => <div key={i} style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '0.2rem' }}>• {q}</div>)}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Callouts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {topic.ethicalConsiderations && <Callout color="amber" icon="⚠️" title="Ethical Considerations" text={topic.ethicalConsiderations} />}
                  {topic.supervisorNotes && <Callout color="blue" icon="📋" title="Supervisor Notes" text={topic.supervisorNotes} />}
                </div>

                {/* Uniqueness */}
                {topic.uniquenessCheck && <Callout color="sage" icon="🔍" title={`Uniqueness: ${topic.uniquenessCheck.score}/10`} text={`${topic.uniquenessCheck.reason}${topic.uniquenessCheck.suggestions ? `\n\n💡 ${topic.uniquenessCheck.suggestions}` : ''}`} />}

                {/* Actions */}
                <div className="flex flex-wrap gap-2 pt-3" style={{ borderTop: '1.5px solid var(--border)' }}>
                  {!isApproved && (
                    <>
                      <button onClick={(e) => { e.stopPropagation(); approveTopic(index); }} className="act-btn primary"><Star size={12} /> Approve</button>
                      <button onClick={(e) => { e.stopPropagation(); regenerateTopic(index); }} disabled={regeneratingIdx !== null} className="act-btn"><RefreshCw size={12} className={isRegen ? 'spinning' : ''} /> {isRegen ? 'Regenerating...' : 'Regenerate'}</button>
                    </>
                  )}
                  <button onClick={(e) => { e.stopPropagation(); checkUniqueness(index, isApproved); }} disabled={checkingUniq !== null} className="act-btn"><Search size={12} className={isUniq ? 'spinning' : ''} /> {isUniq ? 'Checking...' : 'Uniqueness'}</button>
                  <button onClick={(e) => { e.stopPropagation(); generateProposal(topic); }} disabled={genProposal !== null} className="act-btn"><FileText size={12} className={isProp ? 'spinning' : ''} /> {isProp ? 'Writing...' : 'Proposal'}</button>
                  <button onClick={(e) => { e.stopPropagation(); copyTopic(topic); }} className="act-btn"><Copy size={12} /> Copy</button>
                  {isApproved && <button onClick={(e) => { e.stopPropagation(); removeApproved(index); }} className="act-btn danger" style={{ marginLeft: 'auto' }}><Trash2 size={12} /> Remove</button>}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // ═══════════════════════════════════════
  // TABS
  // ═══════════════════════════════════════

  const TABS = [
    { id: 'generate', label: 'Generate', icon: <Sparkles size={13} /> },
    { id: 'approved', label: 'Approved', icon: <Star size={13} />, count: approvedTopics.length },
    { id: 'students', label: 'Students', icon: <Users size={13} />, count: students.length },
    { id: 'budget', label: 'Budget', icon: <Zap size={13} /> },
    { id: 'suppliers', label: 'Suppliers', icon: <ExternalLink size={13} /> },
    { id: 'grants', label: 'Grants', icon: <FlaskConical size={13} /> },
    { id: 'labplan', label: 'Lab Plan', icon: <Beaker size={13} /> },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      {/* ═══ HEADER ═══ */}
      <header className="sticky top-0 z-30" style={{ background: 'rgba(247, 243, 237, 0.9)', backdropFilter: 'blur(12px)', borderBottom: '1.5px solid var(--border)' }}>
        <div className="max-w-4xl mx-auto px-4 py-3">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
              <Microscope size={18} style={{ color: 'var(--accent)' }} />
            </div>
            <div>
              <h1 style={{ fontFamily: "'Literata', serif", fontSize: '1.15rem', fontWeight: 700, color: 'var(--text)' }}>Research Topic Generator</h1>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Medical Microbiology · Lagos, Nigeria</p>
            </div>
            <button onClick={() => { setShowWalkthrough(true); setWalkthroughStep(0); }} className="ml-auto p-2 rounded-lg" style={{ color: showWalkthrough ? 'var(--accent)' : 'var(--text-muted)', background: showWalkthrough ? 'var(--accent-dim)' : 'transparent' }}>
              <HelpCircle size={16} />
            </button>
          </div>
          <div id="tabs" className="flex gap-0.5 overflow-x-auto pb-1" style={{ borderBottom: '1px solid var(--border)' }}>
            <WalkthroughTip step={4} />
            {TABS.map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)} className={`nav-btn ${activeTab === t.id ? 'active' : ''}`}>
                <span className="flex items-center gap-1.5">
                  {t.icon} {t.label}
                  {t.count > 0 && <span style={{ fontSize: '0.58rem', fontWeight: 700, background: 'var(--accent)', color: '#fff', padding: '0.1rem 0.35rem', borderRadius: 99 }}>{t.count}</span>}
                </span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-5">
        {/* Error */}
        {error && (
          <div className="mb-4 p-3 rounded-lg flex items-start gap-2" style={{ background: 'var(--red-dim)', border: '1px solid var(--red-border)' }}>
            <AlertCircle size={16} style={{ color: 'var(--red)' }} className="flex-shrink-0 mt-0.5" />
            <p style={{ fontSize: '0.8rem', color: 'var(--red)', flex: 1 }}>{error}</p>
            <button onClick={() => setError(null)}><X size={14} style={{ color: 'var(--red)' }} /></button>
          </div>
        )}

        {/* ═══ GENERATE TAB ═══ */}
        {activeTab === 'generate' && (
          <section className="space-y-1">
            {/* Guide */}
            <CollapsibleSection id="guide" title="👋 How This Works">
              <div className="p-5 rounded-xl mb-4" style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)' }}>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { n: 1, c: '--accent', t: 'Configure', d: 'Pick focus areas and check the equipment available in your lab.' },
                    { n: 2, c: '--sage', t: 'Generate & Review', d: 'AI creates topics with full methodology, costs, and statistics.' },
                    { n: 3, c: '--blue', t: 'Assign to Students', d: 'Approve favorites, assign topics, and email students directly.' },
                  ].map(s => (
                    <div key={s.n} className="flex gap-3" style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center" style={{ fontSize: '0.62rem', fontWeight: 800, background: `var(${s.c}-dim)`, color: `var(${s.c})` }}>{s.n}</div>
                      <div><strong style={{ color: 'var(--text)' }}>{s.t}</strong><br />{s.d}</div>
                    </div>
                  ))}
                </div>
              </div>
            </CollapsibleSection>

            {/* Focus Areas */}
            <div className="tooltip-anchor" id="focus-areas">
              <WalkthroughTip step={0} />
              <CollapsibleSection id="focus" title="Focus Areas">
                <div className="flex flex-wrap gap-2 mb-2">
                  {FOCUS_AREAS.map(a => (
                    <button key={a.id} onClick={() => setSelectedAreas(p => p.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id])} className={`chip ${selectedAreas.includes(a.id) ? 'on' : ''}`}>
                      {a.icon} {a.label}
                    </button>
                  ))}
                </div>
                <input type="text" value={customFocusArea} onChange={e => setCustomFocusArea(e.target.value)} placeholder="+ Custom focus area..." style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, fontSize: '0.78rem', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)' }} />
              </CollapsibleSection>
            </div>

            {/* Bacteria */}
            <CollapsibleSection id="bacteria" title="Bacteria Filter" badge={selectedBacteria.length > 0 ? `${selectedBacteria.length} selected` : null}>
              <div className="p-4 rounded-xl mb-2" style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)' }}>
                <div className="mb-3">
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Aerobes</div>
                  <div className="flex flex-wrap gap-1.5">
                    {BACTERIA.filter(b => !b.anaerobe).map(b => (
                      <button key={b.id} onClick={() => setSelectedBacteria(p => p.includes(b.id) ? p.filter(x => x !== b.id) : [...p, b.id])} className={`chip ${selectedBacteria.includes(b.id) ? 'on' : ''}`} style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace" }}>
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="mb-3">
                  <div style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.4rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Anaerobes</div>
                  <div className="flex flex-wrap gap-1.5">
                    {BACTERIA.filter(b => b.anaerobe).map(b => (
                      <button key={b.id} onClick={() => setSelectedBacteria(p => p.includes(b.id) ? p.filter(x => x !== b.id) : [...p, b.id])} className={`chip ${selectedBacteria.includes(b.id) ? 'on' : ''}`} style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', fontFamily: "'JetBrains Mono', monospace" }}>
                        {b.name}
                      </button>
                    ))}
                  </div>
                </div>
                <input type="text" value={customBacteria} onChange={e => setCustomBacteria(e.target.value)} placeholder="+ Custom organism..." style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, fontSize: '0.76rem', border: '1.5px solid var(--border)', background: 'var(--bg-hover)', color: 'var(--text)' }} />
              </div>
            </CollapsibleSection>

            {/* Equipment */}
            <div className="tooltip-anchor" id="equipment">
              <WalkthroughTip step={1} />
              <CollapsibleSection id="equipment" title="Lab Equipment">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex gap-1.5">
                    {['basic', 'intermediate', 'advanced'].map(t => (
                      <button key={t} onClick={() => applyPreset(t)} className={`preset-btn ${activePreset === t ? 'on' : ''}`}>
                        {t === 'basic' ? 'Basic Lab' : t === 'intermediate' ? 'Well-Equipped' : 'Advanced'}
                      </button>
                    ))}
                  </div>
                  <button onClick={() => setEquipment([])} style={{ fontSize: '0.68rem', color: 'var(--accent)', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}>Clear All</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-2">
                  {EQUIPMENT_LIST.map(e => (
                    <div key={e.id} className={`eq-item ${equipment.includes(e.id) ? 'on' : ''}`} onClick={() => toggleEquip(e.id)}>
                      <div className="eq-check">
                        {equipment.includes(e.id) && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>}
                      </div>
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 500, color: 'var(--text)' }}>{e.name}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{e.hint}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleSection>
            </div>

            {/* Settings row */}
            <div className="tooltip-anchor" id="timeline">
              <WalkthroughTip step={2} />
              <CollapsibleSection id="settings" title="Settings">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-3">
                  <div>
                    <div className="section-label mb-1">Timeline</div>
                    <select value={timeline} onChange={e => setTimeline(e.target.value)}>
                      {TIMELINES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="section-label mb-1">Demographic</div>
                    <select value={selectedDemographic} onChange={e => setSelectedDemographic(e.target.value)}>
                      {DEMOGRAPHICS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="section-label mb-1">Budget Cap</div>
                    <select value={maxBudget} onChange={e => setMaxBudget(e.target.value)}>
                      {BUDGET_CAPS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <div className="section-label mb-1">Topics</div>
                    <select value={numTopics} onChange={e => setNumTopics(parseInt(e.target.value))}>
                      {[3, 5, 8, 10, 15, 20].map(n => <option key={n} value={n}>{n} topics</option>)}
                    </select>
                  </div>
                </div>
                <textarea value={customNotes} onChange={e => setCustomNotes(e.target.value)} placeholder="Any specific instructions for the AI (e.g., 'focus on food handlers in Surulere markets', 'include biofilm studies')..." rows={2} style={{ width: '100%', padding: '0.5rem 0.75rem', borderRadius: 8, fontSize: '0.78rem', border: '1.5px solid var(--border)', background: 'var(--bg-card)', color: 'var(--text)', resize: 'none' }} />
              </CollapsibleSection>
            </div>

            {/* Generate button */}
            <div className="tooltip-anchor" id="generate-btn">
              <WalkthroughTip step={3} />
              <button onClick={generateTopics} disabled={loading || selectedAreas.length === 0} className="gen-btn mt-2 flex items-center justify-center gap-2">
                {loading ? <><RefreshCw size={16} className="spinning" /> Generating...</> : <><Sparkles size={16} /> Generate {numTopics} Topics</>}
              </button>
            </div>

            {/* Loading */}
            {loading && (
              <div className="p-8 rounded-xl text-center space-y-5 mt-4" style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)' }}>
                <div className="flex justify-center gap-3">
                  {['var(--accent)', 'var(--sage)', 'var(--blue)', 'var(--amber)', 'var(--purple)'].map((c, i) => (
                    <div key={i} className="loading-dot" style={{ background: c, animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
                <div>
                  <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text)' }}>{loadingMsg}</p>
                  <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                    Each topic includes methodology, costs, materials, stats, and more.<br />
                    Usually takes 30–90 seconds. Good time for a coffee! ☕
                  </p>
                </div>
                <div className="space-y-2 max-w-md mx-auto">
                  {[1, 2, 3].map(i => <div key={i} className="shimmer-bar" style={{ width: `${100 - i * 15}%`, margin: '0 auto' }} />)}
                </div>
              </div>
            )}

            {/* Results */}
            {!loading && topics.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="section-label">Generated Topics ({topics.length})</span>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Click to expand details</span>
                </div>
                <div className="space-y-2">
                  {topics.map((t, i) => <TopicCard key={i} topic={t} index={i} />)}
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
                  <span className="section-label">Approved ({approvedTopics.length})</span>
                  <button onClick={exportApproved} className="act-btn primary"><Download size={12} /> Export All</button>
                </div>
                <div className="space-y-2">
                  {approvedTopics.map((t, i) => <TopicCard key={i} topic={t} index={i} isApproved />)}
                </div>
              </>
            )}
          </section>
        )}

        {/* ═══ STUDENTS TAB ═══ */}
        {activeTab === 'students' && (
          <section className="space-y-5">
            {/* Upload */}
            <div className="p-5 rounded-xl" style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)' }}>
              <div className="flex items-center justify-between mb-3">
                <span className="section-label">Student List</span>
                <label className="act-btn primary cursor-pointer">
                  <Upload size={12} /> Upload CSV
                  <input type="file" accept=".csv,.txt" onChange={handleCSVUpload} className="hidden" />
                </label>
              </div>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                Upload a CSV with columns: Name, Email. Or add students manually below.
              </p>
              {/* Manual add */}
              <div className="flex gap-2">
                <input type="text" id="student-name" placeholder="Student name" style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: 8, fontSize: '0.78rem', border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                <input type="text" id="student-email" placeholder="Email" style={{ flex: 1, padding: '0.5rem 0.75rem', borderRadius: 8, fontSize: '0.78rem', border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)' }} />
                <button onClick={() => {
                  const name = document.getElementById('student-name').value.trim();
                  const email = document.getElementById('student-email').value.trim();
                  if (name) {
                    setStudents(p => [...p, { name, email }]);
                    document.getElementById('student-name').value = '';
                    document.getElementById('student-email').value = '';
                    showToast('Student added');
                  }
                }} className="act-btn primary">Add</button>
              </div>
            </div>

            {/* Student list with assignments */}
            {students.length === 0 ? (
              <EmptyState icon={<Users size={36} />} title="No students yet" desc="Upload a CSV or add students manually above." />
            ) : (
              <div className="space-y-2">
                {students.map((s, i) => {
                  const assignedIdx = assignments[i];
                  const assignedTopic = assignedIdx !== undefined ? approvedTopics[assignedIdx] : null;
                  return (
                    <div key={i} className="student-row fade-in" style={{ animationDelay: `${i * 0.04}s` }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'var(--accent-dim)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--accent)', flexShrink: 0 }}>
                        {s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{s.name}</div>
                        <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{s.email || 'No email'}</div>
                      </div>
                      {assignedTopic ? (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div className="text-right" style={{ maxWidth: 200 }}>
                            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--sage)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{assignedTopic.title}</div>
                            <div className="mono" style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{assignedTopic.estimatedCost?.total}</div>
                          </div>
                          {s.email && (
                            <button onClick={() => openEmail(s, assignedTopic)} className="act-btn"><Mail size={11} /> Email</button>
                          )}
                          <button onClick={() => setAssignments(p => { const n = { ...p }; delete n[i]; return n; })} className="act-btn danger"><X size={11} /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {approvedTopics.length > 0 ? (
                            <select onChange={e => { if (e.target.value !== '') assignTopic(i, parseInt(e.target.value)); }} value="" style={{ padding: '0.35rem 0.6rem', borderRadius: 6, fontSize: '0.7rem', border: '1.5px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', maxWidth: 250 }}>
                              <option value="">Assign topic...</option>
                              {approvedTopics.map((t, j) => (
                                <option key={j} value={j}>{t.title.slice(0, 60)}...</option>
                              ))}
                            </select>
                          ) : (
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>No approved topics</span>
                          )}
                          <button onClick={() => { setStudents(p => p.filter((_, j) => j !== i)); setAssignments(p => { const n = { ...p }; delete n[i]; return n; }); }} className="act-btn danger"><Trash2 size={11} /></button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}

            {/* Bulk email */}
            {students.length > 0 && Object.keys(assignments).length > 0 && (
              <div className="p-4 rounded-xl" style={{ background: 'var(--sage-dim)', border: '1px solid var(--sage-border)' }}>
                <div style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--sage)', marginBottom: '0.35rem' }}>
                  📧 {Object.keys(assignments).length} of {students.length} students assigned
                </div>
                <p style={{ fontSize: '0.7rem', color: 'rgba(90, 122, 82, 0.7)' }}>
                  Click "Email" next to each student to open a pre-filled email with their topic details.
                </p>
              </div>
            )}
          </section>
        )}

        {/* ═══ BUDGET TAB ═══ */}
        {activeTab === 'budget' && (
          <section>
            {(() => {
              const withCost = approvedTopics.filter(t => t.estimatedCost);
              if (withCost.length === 0) return <EmptyState icon={<Zap size={36} />} title="No cost data yet" desc="Approve topics to see budget analysis." />;
              const total = withCost.reduce((a, t) => { const [lo, hi] = parseCostRange(t.estimatedCost?.total); return [a[0] + lo, a[1] + hi]; }, [0, 0]);
              const pheno = withCost.filter(t => !t.estimatedCost?.hasMolecular).length;
              const mol = withCost.filter(t => t.estimatedCost?.hasMolecular).length;
              return (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    <StatCard label="Total Range" value={`₦${total[0].toLocaleString()} – ₦${total[1].toLocaleString()}`} color="accent" />
                    <StatCard label="Avg / Project" value={`₦${Math.round(total[0] / withCost.length).toLocaleString()}`} color="blue" />
                    <StatCard label="Phenotypic" value={pheno.toString()} color="sage" />
                    <StatCard label="Molecular 🧬" value={mol.toString()} color="purple" />
                  </div>
                  {/* Project list */}
                  <div className="space-y-1.5">
                    {withCost.map((t, i) => (
                      <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)' }}>
                        <div className="flex-1 min-w-0 mr-3">
                          <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t.bacteria || 'Various'} · {t.difficulty}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {t.estimatedCost?.hasMolecular && <span className="badge badge-molecular">🧬</span>}
                          <span className={`badge badge-${t.estimatedCost?.costLevel || 'low'}`}>{t.estimatedCost?.total}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  {withCost.length > 1 && (
                    <Callout color="sage" icon="💰" title="Bulk Savings Estimate" text={`${mol > 1 ? `• PCR reagents: ${mol} projects can share master mix (save ~₦100K–200K)\n` : ''}${pheno > 1 ? `• Culture media: ${pheno} projects share agar bottles (save ~₦50K–100K)\n` : ''}• Consumables: Buy cartons of 500 petri dishes vs packs of 20\n• Antibiotic discs: Bulk = 10-15% discount\n\nEst. savings: ₦${(withCost.length * 30000).toLocaleString()} – ₦${(withCost.length * 80000).toLocaleString()}`} />
                  )}
                </div>
              );
            })()}
          </section>
        )}

        {/* ═══ SUPPLIERS TAB ═══ */}
        {activeTab === 'suppliers' && (
          <section className="space-y-4">
            <Callout color="sage" icon="💡" title="Pro Tip" text="Call ahead to confirm stock and prices. Bulk orders get 10-20% off. Always ask for institutional pricing." />
            <div className="section-label mb-2">Laboratory Suppliers — Lagos</div>
            <div className="space-y-3">
              {SUPPLIERS.map((s, i) => (
                <div key={i} className="supplier-card fade-in" style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>{s.name}</span>
                        {s.tag && <span className="badge badge-medium">{s.tag}</span>}
                      </div>
                      <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{s.specialty}</p>
                    </div>
                    {s.website && <a href={s.website} target="_blank" rel="noopener noreferrer" className="act-btn flex-shrink-0"><ExternalLink size={11} /> Visit</a>}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="space-y-0.5">
                    <p>📍 {s.address}</p>
                    {s.phone && <p>📞 {s.phone}</p>}
                    {s.email && <p>✉️ {s.email}</p>}
                  </div>
                  <p style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.5rem' }}>{s.notes}</p>
                </div>
              ))}
            </div>
            <div className="section-label mt-4 mb-2">Molecular Services</div>
            <div className="supplier-card">
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text)' }}>{NIMR.name}</span>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '0.15rem', marginBottom: '0.5rem' }}>{NIMR.desc}</p>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }} className="space-y-0.5">
                <p>📍 {NIMR.address}</p>
                <p>📞 {NIMR.phone}</p>
                <p>✉️ {NIMR.email}</p>
              </div>
              <p className="mono" style={{ fontSize: '0.72rem', color: 'var(--amber)', marginTop: '0.5rem', fontWeight: 500 }}>{NIMR.pricing}</p>
            </div>
          </section>
        )}

        {/* ═══ GRANTS TAB ═══ */}
        {activeTab === 'grants' && (
          <section className="space-y-5">
            {['Nigerian', 'International', 'AMR'].map(type => {
              const items = GRANTS.filter(g => g.type === type);
              if (!items.length) return null;
              return (
                <div key={type}>
                  <div className="section-label mb-2">{type === 'AMR' ? '🦠 AMR-Specific' : type === 'Nigerian' ? '🇳🇬 Nigerian' : '🌍 International'} Funding</div>
                  <div className="space-y-2">
                    {items.map((g, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-xl fade-in" style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', animationDelay: `${i * 0.06}s` }}>
                        <div>
                          <div className="flex items-center gap-2">
                            <span>{g.emoji}</span>
                            <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text)' }}>{g.name}</span>
                          </div>
                          <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>{g.desc}</p>
                        </div>
                        <a href={g.url} target="_blank" rel="noopener noreferrer" className="act-btn flex-shrink-0"><ExternalLink size={11} /> Apply</a>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
            <Callout color="amber" icon="📝" title="Application Tips" text="TETFund calls are institutional — check with your university admin. Wellcome & Fogarty need a lead PI with host institution. GARDP specifically funds AMR. Always look for co-funding." />
          </section>
        )}

        {/* ═══ LAB PLAN TAB ═══ */}
        {activeTab === 'labplan' && (
          <section>
            {(() => {
              const mol = approvedTopics.filter(t => t.estimatedCost?.hasMolecular);
              if (!mol.length) return <EmptyState icon={<Beaker size={36} />} title="No molecular projects yet" desc="Approve topics with PCR/molecular work to see gel layout planning." />;
              return (
                <div className="space-y-4">
                  <div className="section-label mb-2">Molecular Projects ({mol.length})</div>
                  <div className="space-y-2">
                    {mol.map((t, i) => (
                      <div key={i} className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)' }}>
                        <span className="badge badge-molecular">🧬</span>
                        <div className="flex-1 min-w-0">
                          <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.title}</div>
                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{t.bacteria || 'Various organisms'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Callout color="blue" icon="🧬" title="Gel Layout Optimizer" text={`Standard gel = 15 wells. Wells 1 & 8 for DNA ladders → 13 sample wells/gel.\nProjects: ${mol.length} · Est. samples/project: ~20–50\nGels needed: ~${Math.ceil(mol.length * 35 / 13)}\nBatch projects with similar primer sets for max efficiency.`} />
                  <Callout color="sage" icon="💡" title="Cost-Saving Tips" text={`• Share PCR master mix across projects — buy 500-rxn kit if 3+ need it\n• Pool primer orders for minimum qty discounts\n• Book NIMR sequencing as a batch\n• Run gels back-to-back to share buffer`} />
                </div>
              );
            })()}
          </section>
        )}
      </main>

      {/* ═══ PROPOSAL MODAL ═══ */}
      {proposalModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={() => setProposalModal(null)}>
          <div className="rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6" style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)' }} onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 style={{ fontFamily: "'Literata', serif", fontWeight: 700, fontSize: '1rem', color: 'var(--text)' }}>Research Proposal</h2>
              <button onClick={() => setProposalModal(null)}><X size={18} style={{ color: 'var(--text-muted)' }} /></button>
            </div>
            <pre style={{ whiteSpace: 'pre-wrap', fontSize: '0.78rem', lineHeight: 1.65, color: 'var(--text-secondary)', fontFamily: "'Nunito Sans', sans-serif" }}>{proposalModal.text}</pre>
            <div className="flex gap-2 mt-4 pt-4" style={{ borderTop: '1.5px solid var(--border)' }}>
              <button onClick={() => { navigator.clipboard.writeText(proposalModal.text); showToast('Copied!'); }} className="act-btn primary"><Copy size={12} /> Copy</button>
              <button onClick={() => setProposalModal(null)} className="act-btn">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ TOASTS ═══ */}
      <div className="fixed bottom-6 right-6 z-50 space-y-2">
        {toasts.map(t => (
          <div key={t.id} className="toast px-4 py-2.5 rounded-lg shadow-lg" style={{ fontSize: '0.82rem', fontWeight: 600, background: t.type === 'info' ? 'var(--bg-card)' : 'var(--sage)', color: t.type === 'info' ? 'var(--text)' : '#fff', border: t.type === 'info' ? '1.5px solid var(--border)' : 'none' }}>
            {t.message}
          </div>
        ))}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════
// SHARED COMPONENTS
// ═══════════════════════════════════════

function DetailLabel({ children }) {
  return <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{children}</div>;
}

function DetailSection({ title, text }) {
  return <div><DetailLabel>{title}</DetailLabel><p style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>{text}</p></div>;
}

function InfoBox({ label, value }) {
  return (
    <div className="info-box">
      <div style={{ fontSize: '0.58rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{label}</div>
      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)' }}>{value}</div>
    </div>
  );
}

function InfoCard({ icon, label, value }) {
  return (
    <div className="p-3 rounded-lg" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border)' }}>
      <div style={{ fontSize: '0.62rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-muted)', marginBottom: '0.3rem' }}>{icon} {label}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text)', lineHeight: 1.5 }}>{value}</div>
    </div>
  );
}

function ListBox({ title, items }) {
  return (
    <div><DetailLabel>{title}</DetailLabel>
      <div style={{ fontSize: '0.74rem', color: 'var(--text-secondary)' }}>
        {items.map((item, i) => <div key={i} style={{ display: 'flex', gap: '0.35rem' }}><span style={{ color: 'var(--text-muted)' }}>•</span>{item}</div>)}
      </div>
    </div>
  );
}

function Callout({ color, icon, title, text }) {
  const colors = {
    sage: { bg: 'var(--sage-dim)', border: 'var(--sage-border)', title: 'var(--sage)', text: 'rgba(90, 122, 82, 0.75)' },
    amber: { bg: 'var(--amber-dim)', border: 'var(--amber-border)', title: 'var(--amber)', text: 'rgba(184, 134, 11, 0.75)' },
    blue: { bg: 'var(--blue-dim)', border: 'var(--blue-border)', title: 'var(--blue)', text: 'rgba(74, 111, 165, 0.75)' },
    accent: { bg: 'var(--accent-dim)', border: 'var(--accent-border)', title: 'var(--accent)', text: 'rgba(196, 88, 42, 0.75)' },
  };
  const c = colors[color] || colors.sage;
  return (
    <div className="callout" style={{ background: c.bg, border: `1px solid ${c.border}` }}>
      <div style={{ fontSize: '0.74rem', fontWeight: 700, color: c.title, marginBottom: '0.25rem' }}>{icon} {title}</div>
      <p style={{ fontSize: '0.72rem', color: c.text, whiteSpace: 'pre-line', lineHeight: 1.55 }}>{text}</p>
    </div>
  );
}

function EmptyState({ icon, title, desc }) {
  return (
    <div className="text-center py-16">
      <div style={{ color: 'var(--text-muted)', opacity: 0.3, display: 'inline-flex', marginBottom: '1rem' }}>{icon}</div>
      <p style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</p>
      <p style={{ fontSize: '0.76rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{desc}</p>
    </div>
  );
}

function StatCard({ label, value, color }) {
  return (
    <div className="p-3 rounded-xl text-center" style={{ background: `var(--${color}-dim)` }}>
      <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>{label}</div>
      <div className="mono" style={{ fontSize: '0.72rem', fontWeight: 700, color: `var(--${color})` }}>{value}</div>
    </div>
  );
}
