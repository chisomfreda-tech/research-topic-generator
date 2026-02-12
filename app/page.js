'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Star, RefreshCw, Search, FileText, Copy, Trash2, ChevronDown, ChevronUp, X, Upload, Mail, Check, MapPin, Phone, ExternalLink, FlaskConical, Microscope, Users, DollarSign, Package, Award, Wrench, AlertTriangle } from 'lucide-react';

// ─── Constants ───
const FOCUS_AREAS = [
  { id: 'plant', label: 'Plant-Based Antimicrobials', color: '#1a7a6d' },
  { id: 'amr', label: 'Antimicrobial Resistance', color: '#b8860b' },
  { id: 'food', label: 'Food & Environmental', color: '#6b5b95' },
  { id: 'clinical', label: 'Clinical Isolates', color: '#b54a28' },
];

const BACTERIA = {
  aerobes: [
    { id: 'ecoli', name: 'E. coli' }, { id: 'saureus', name: 'S. aureus' },
    { id: 'kpneum', name: 'K. pneumoniae' }, { id: 'paerug', name: 'P. aeruginosa' },
    { id: 'senterica', name: 'Salmonella enterica' }, { id: 'spyog', name: 'S. pyogenes' },
    { id: 'efaecalis', name: 'E. faecalis' }, { id: 'abaum', name: 'A. baumannii' },
    { id: 'spneum', name: 'S. pneumoniae' },
  ],
  anaerobes: [
    { id: 'cdiff', name: 'C. difficile' }, { id: 'bfragilis', name: 'B. fragilis' },
    { id: 'cperf', name: 'C. perfringens' }, { id: 'pgingivalis', name: 'P. gingivalis' },
    { id: 'facnes', name: 'C. acnes' }, { id: 'prevotella', name: 'Prevotella spp.' },
  ],
};

const DEMOGRAPHICS = [
  { id: 'general', label: 'General Population' }, { id: 'pediatric', label: 'Pediatric' },
  { id: 'adult', label: 'Adult' }, { id: 'elderly', label: 'Elderly' },
  { id: 'pregnant', label: 'Pregnant Women' }, { id: 'immunocomp', label: 'Immunocompromised' },
];

const EQUIPMENT_LIST = [
  { id: 'autoclave', name: 'Autoclave', hint: 'Sterilization', tier: 'basic' },
  { id: 'incubator', name: 'Incubator', hint: '37°C culture', tier: 'basic' },
  { id: 'microscope', name: 'Microscope', hint: 'Gram stain', tier: 'basic' },
  { id: 'colony_counter', name: 'Colony Counter', hint: 'CFU counting', tier: 'basic' },
  { id: 'centrifuge', name: 'Centrifuge', hint: 'Sample processing', tier: 'basic' },
  { id: 'water_bath', name: 'Water Bath', hint: 'Temperature control', tier: 'basic' },
  { id: 'ph_meter', name: 'pH Meter', hint: 'Media preparation', tier: 'basic' },
  { id: 'pcr', name: 'PCR Thermocycler', hint: 'DNA amplification', tier: 'equipped' },
  { id: 'gel_electrophoresis', name: 'Gel Electrophoresis', hint: 'DNA separation', tier: 'equipped' },
  { id: 'spectrophotometer', name: 'Spectrophotometer', hint: 'OD readings', tier: 'equipped' },
  { id: 'elisa_reader', name: 'ELISA Reader', hint: 'Immunoassays', tier: 'equipped' },
  { id: 'biosafety_cabinet', name: 'Biosafety Cabinet', hint: 'Pathogen safety', tier: 'equipped' },
  { id: 'uv_transilluminator', name: 'UV Transilluminator', hint: 'Gel imaging', tier: 'equipped' },
  { id: 'dna_sequencer', name: 'DNA Sequencer', hint: 'Genotyping', tier: 'advanced' },
  { id: 'hplc', name: 'HPLC', hint: 'Compound analysis', tier: 'advanced' },
  { id: 'flow_cytometer', name: 'Flow Cytometer', hint: 'Cell sorting', tier: 'advanced' },
  { id: 'mass_spec', name: 'Mass Spectrometer', hint: 'Protein ID', tier: 'advanced' },
];

const TIMELINES = [
  { value: '1', label: '1 month' }, { value: '3', label: '3 months' },
  { value: '6', label: '6 months' }, { value: '8', label: '8 months' }, { value: '12', label: '12 months' },
];

const BUDGET_CAPS = [
  { value: 'any', label: 'Any budget' }, { value: '200000', label: 'Under ₦200K' },
  { value: '300000', label: 'Under ₦300K' }, { value: '500000', label: 'Under ₦500K' },
  { value: '750000', label: 'Under ₦750K' }, { value: '1000000', label: 'Under ₦1M' },
];

const SUPPLIERS = [
  { name: 'Finlab Nigeria', address: 'Surulere, Lagos', phone: '+234 802 310 1234', email: 'sales@finlabnigeria.com', website: 'finlabnigeria.com', notes: 'Largest lab supplier in Lagos. Good bulk discounts.', tags: ['Media', 'Reagents', 'Equipment'] },
  { name: 'Koeman Integrated', address: 'Mushin, Lagos', phone: '+234 803 400 5678', email: 'info@koemanlab.com', website: 'koemanlab.com', notes: 'Competitive pricing on culture media. Fast delivery.', tags: ['Culture Media', 'Staining Kits'] },
  { name: 'Allschoolabs', address: 'Yaba, Lagos', phone: '+234 812 555 9012', email: 'orders@allschoolabs.com', website: 'allschoolabs.com', notes: 'Good for consumables and glassware. Student discounts available.', tags: ['Consumables', 'Glassware'] },
  { name: 'Pascal Scientific', address: 'Ikeja, Lagos', phone: '+234 807 600 3456', email: 'pascal@pascalscientific.com', website: 'pascalscientific.com', notes: 'Molecular biology reagents. PCR supplies.', tags: ['PCR', 'Molecular', 'Primers'] },
  { name: 'Regino Enterprises', address: 'Ojota, Lagos', phone: '+234 809 700 7890', email: 'sales@reginoenterprises.com', website: 'reginoenterprises.com', notes: 'Equipment maintenance and calibration services.', tags: ['Equipment', 'Maintenance'] },
];

const GRANTS = [
  { name: 'TETFund Research Grant', org: 'Tertiary Education Trust Fund', amount: '₦2M – ₦10M', cycle: 'Annual', focus: 'All research areas', tip: 'Apply through your institution' },
  { name: 'NRF Grant', org: 'National Research Fund', amount: '₦5M – ₦20M', cycle: 'Biannual', focus: 'Health sciences priority', tip: 'Collaborative proposals preferred' },
  { name: 'PTDF Scholarship', org: 'Petroleum Technology Dev. Fund', amount: 'Full funding', cycle: 'Annual', focus: 'Science & engineering', tip: 'For postgraduate students' },
  { name: 'Wellcome Trust', org: 'International', amount: '$50K – $300K', cycle: 'Rolling', focus: 'AMR, infectious disease', tip: 'Strong Nigerian institution partnerships' },
  { name: 'NIH Fogarty', org: 'National Institutes of Health', amount: '$50K – $150K', cycle: 'Annual', focus: 'Global health research', tip: 'Requires US co-investigator' },
  { name: 'EDCTP', org: 'European & Developing Countries', amount: '€100K – €500K', cycle: 'Periodic calls', focus: 'Clinical trials, diagnostics', tip: 'Sub-Saharan Africa focus' },
  { name: 'Grand Challenges Africa', org: 'AAS / Bill & Melinda Gates', amount: '$100K', cycle: 'Annual', focus: 'Innovation in health', tip: 'Seed grants for bold ideas' },
  { name: 'GARDP', org: 'Global Antibiotic R&D Partnership', amount: 'Varies', cycle: 'Open calls', focus: 'AMR specifically', tip: 'AMR-focused proposals only' },
];

const LOADING_MESSAGES = [
  'Designing experiments around your lab equipment...',
  'Calculating sample sizes for Lagos populations...',
  'Checking reagent availability from local suppliers...',
  'Building methodology pipelines...',
  'Estimating costs in Nigerian Naira...',
  'Reviewing ethical considerations...',
  'Cross-referencing with recent literature...',
  'Optimizing for your timeline and budget...',
  'Generating detailed materials lists...',
];

const TABS = [
  { id: 'generate', label: 'Generate', icon: Sparkles, group: 'create' },
  { id: 'approved', label: 'Approved', icon: Star, group: 'create' },
  { id: 'students', label: 'Students', icon: Users, group: 'create' },
  { id: 'budget', label: 'Budget', icon: DollarSign, group: 'plan' },
  { id: 'suppliers', label: 'Suppliers', icon: Package, group: 'plan' },
  { id: 'grants', label: 'Grants', icon: Award, group: 'plan' },
  { id: 'labplan', label: 'Lab Plan', icon: Wrench, group: 'plan' },
];

// ─── Hooks ───
function usePersistedState(key, initial) {
  const [state, setState] = useState(initial);
  useEffect(() => {
    try {
      const s = localStorage.getItem('rtg-v4-' + key);
      if (s) {
        const parsed = JSON.parse(s);
        // Ensure type matches: if initial is array, parsed must be array
        if (Array.isArray(initial) && !Array.isArray(parsed)) return;
        if (parsed !== null && parsed !== undefined) setState(parsed);
      }
    } catch {}
  }, [key]);
  useEffect(() => { try { localStorage.setItem('rtg-v4-' + key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState];
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000);
  }, []);
  return { toasts, add };
}

// ─── Main Component ───
export default function ResearchTopicGenerator() {
  // Config state
  const [selectedAreas, setSelectedAreas] = useState(['plant', 'amr']);
  const [selectedBacteria, setSelectedBacteria] = useState([]);
  const [selectedDemographic, setSelectedDemographic] = useState('general');
  const [equipment, setEquipment] = usePersistedState('equip', ['autoclave', 'incubator', 'microscope', 'colony_counter', 'centrifuge']);
  const [timeline, setTimeline] = useState('8');
  const [numTopics, setNumTopics] = useState(5);
  const [maxBudget, setMaxBudget] = useState('any');
  const [customNotes, setCustomNotes] = useState('');
  const [customFocusArea, setCustomFocusArea] = useState('');
  const [customBacteria, setCustomBacteria] = useState('');

  // Data state
  const [topics, setTopics] = useState([]);
  const [approvedTopics, setApprovedTopics] = usePersistedState('approved', []);
  const [students, setStudents] = usePersistedState('students', []);
  const [assignments, setAssignments] = usePersistedState('assign', {});

  // UI state
  const [activeTab, setActiveTab] = useState('generate');
  const [loading, setLoading] = useState(false);
  const [loadingCount, setLoadingCount] = useState(0);
  const [error, setError] = useState(null);
  const [expandedTopic, setExpandedTopic] = useState(null);
  const [regeneratingIdx, setRegeneratingIdx] = useState(null);
  const [checkingUniq, setCheckingUniq] = useState(null);
  const [genProposal, setGenProposal] = useState(null);
  const [proposalModal, setProposalModal] = useState(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [sections, setSections] = useState({ focus: true, bacteria: false, equipment: true, settings: true });

  const { toasts, add: addToast } = useToast();
  const loadingInterval = useRef(null);

  // Equipment presets
  const PRESETS = { basic: ['autoclave','incubator','microscope','colony_counter','centrifuge','water_bath','ph_meter'], equipped: [...['autoclave','incubator','microscope','colony_counter','centrifuge','water_bath','ph_meter'],'pcr','gel_electrophoresis','spectrophotometer','elisa_reader','biosafety_cabinet','uv_transilluminator'], advanced: EQUIPMENT_LIST.map(e => e.id) };
  const activePreset = Object.entries(PRESETS).find(([,ids]) => ids.length === equipment.length && ids.every(id => equipment.includes(id)))?.[0] || null;

  const toggleArea = id => setSelectedAreas(p => p.includes(id) ? p.filter(a => a !== id) : [...p, id]);
  const toggleBacteria = id => setSelectedBacteria(p => p.includes(id) ? p.filter(b => b !== id) : [...p, id]);
  const toggleEquip = id => setEquipment(p => p.includes(id) ? p.filter(e => e !== id) : [...p, id]);
  const toggleSection = key => setSections(p => ({ ...p, [key]: !p[key] }));

  // ─── API calls ───
  async function generateTopics() {
    if (selectedAreas.length === 0 || equipment.length === 0) { setError('Select at least one focus area and one piece of equipment.'); return; }
    setError(null); setLoading(true); setTopics([]); setLoadingCount(0); setLoadingMsgIdx(0);
    loadingInterval.current = setInterval(() => setLoadingMsgIdx(p => (p + 1) % LOADING_MESSAGES.length), 4000);

    const generated = [];
    for (let i = 0; i < numTopics; i++) {
      try {
        const res = await fetch('/api/generate-one', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            selectedAreas, selectedBacteria, selectedDemographic: selectedDemographic,
            equipment, timeline, numTopics: 1, maxBudget, customNotes, customFocusArea, customBacteria,
            existingTitles: generated.map(t => t.title),
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          // If one fails, keep going with what we have
          console.error(`Topic ${i + 1} failed:`, errData.error);
          continue;
        }
        const data = await res.json();
        if (data.topic) {
          generated.push(data.topic);
          setTopics([...generated]);
          setLoadingCount(generated.length);
        }
      } catch (e) {
        console.error(`Topic ${i + 1} error:`, e.message);
        continue;
      }
    }
    clearInterval(loadingInterval.current);
    setLoading(false);
    if (generated.length === 0) setError('All topics failed to generate. Try again.');
  }

  async function regenerateTopic(idx) {
    const topic = topics[idx]; if (!topic) return;
    setRegeneratingIdx(idx);
    try {
      const res = await fetch('/api/regenerate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, areas: selectedAreas, bacteria: selectedBacteria, equipment, timeline, customNotes }),
      });
      if (!res.ok) throw new Error('Regeneration failed');
      const data = await res.json();
      if (data.topic) { setTopics(p => p.map((t, i) => i === idx ? data.topic : t)); addToast('Topic regenerated'); }
    } catch (e) { setError(e.message); }
    setRegeneratingIdx(null);
  }

  async function checkUniqueness(idx, isApproved) {
    const key = `${isApproved ? 'a' : 'g'}-${idx}`;
    const topic = isApproved ? approvedTopics[idx] : topics[idx]; if (!topic) return;
    setCheckingUniq(key);
    try {
      const res = await fetch('/api/uniqueness', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) throw new Error('Uniqueness check failed');
      const data = await res.json();
      const updated = { ...topic, uniquenessCheck: data };
      if (isApproved) { setApprovedTopics(p => p.map((t, i) => i === idx ? updated : t)); }
      else { setTopics(p => p.map((t, i) => i === idx ? updated : t)); }
      addToast(`Uniqueness: ${data.score}/10`);
    } catch (e) { setError(e.message); }
    setCheckingUniq(null);
  }

  async function generateProposal(topic) {
    setGenProposal(topic.title);
    try {
      const res = await fetch('/api/proposal', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });
      if (!res.ok) throw new Error('Proposal generation failed');
      const data = await res.json();
      setProposalModal({ title: topic.title, content: data.proposal });
    } catch (e) { setError(e.message); }
    setGenProposal(null);
  }

  function approveTopic(idx) {
    const topic = topics[idx];
    setApprovedTopics(p => [...p, { ...topic, approvedAt: new Date().toISOString() }]);
    addToast('Topic approved');
  }

  function removeApproved(idx) {
    setApprovedTopics(p => p.filter((_, i) => i !== idx));
    addToast('Topic removed', 'info');
  }

  function copyTopic(topic) {
    const lines = [
      topic.title, '',
      topic.layman ? `In plain language: ${topic.layman}` : '',
      topic.description, '',
      `Background: ${topic.background || ''}`, '',
      'Objectives:', ...(topic.objectives || []).map((o, i) => `${i + 1}. ${o}`), '',
      `Methodology: ${topic.methodology || ''}`, '',
      `Estimated Cost: ${topic.estimatedCost?.total || 'N/A'}`,
    ];
    if (topic.abstractTemplate) {
      lines.push('', '--- ABSTRACT TEMPLATE ---', '');
      if (topic.abstractTemplate.background) lines.push(`Background: ${topic.abstractTemplate.background}`);
      if (topic.abstractTemplate.objective) lines.push(`Objective: ${topic.abstractTemplate.objective}`);
      if (topic.abstractTemplate.methods) lines.push(`Methods: ${topic.abstractTemplate.methods}`);
      if (topic.abstractTemplate.resultsTemplate) lines.push(`Results (fill in your data): ${topic.abstractTemplate.resultsTemplate}`);
      if (topic.abstractTemplate.conclusionTemplate) lines.push(`Conclusion (fill in your findings): ${topic.abstractTemplate.conclusionTemplate}`);
      if (topic.abstractTemplate.formatNotes) lines.push('', `Notes: ${topic.abstractTemplate.formatNotes}`);
    }
    navigator.clipboard.writeText(lines.join('\n'));
    addToast('Copied to clipboard');
  }

  function exportApproved() {
    const text = approvedTopics.map((t, i) => {
      let out = `=== Topic ${i + 1} ===\n${t.title}\n${t.layman ? `In plain language: ${t.layman}\n` : ''}${t.description}\nCost: ${t.estimatedCost?.total || 'N/A'}\n`;
      if (t.abstractTemplate) {
        out += `\n--- Abstract Template ---\nBackground: ${t.abstractTemplate.background || ''}\nObjective: ${t.abstractTemplate.objective || ''}\nMethods: ${t.abstractTemplate.methods || ''}\nResults (fill in): ${t.abstractTemplate.resultsTemplate || ''}\nConclusion (fill in): ${t.abstractTemplate.conclusionTemplate || ''}\n${t.abstractTemplate.formatNotes ? `Notes: ${t.abstractTemplate.formatNotes}\n` : ''}`;
      }
      return out;
    }).join('\n');
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'approved-topics.txt'; a.click();
    URL.revokeObjectURL(url);
    addToast('Exported approved topics');
  }

  // Student CSV
  function handleCSVUpload(e) {
    const file = e.target.files[0]; if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const lines = ev.target.result.split('\n').map(l => l.trim()).filter(Boolean);
      const newStudents = [];
      for (const line of lines) {
        if (line.toLowerCase().startsWith('name') || line.toLowerCase().startsWith('student')) continue;
        const parts = line.split(',').map(s => s.replace(/"/g, '').trim());
        if (parts.length >= 2 && parts[1].includes('@')) newStudents.push({ name: parts[0], email: parts[1] });
        else if (parts[0].includes('@')) newStudents.push({ name: parts[0].split('@')[0], email: parts[0] });
      }
      if (newStudents.length > 0) { setStudents(p => [...p, ...newStudents]); addToast(`Added ${newStudents.length} students`); }
    };
    reader.readAsText(file);
    e.target.value = '';
  }

  function addStudentManual(name, email) {
    if (!name || !email) return;
    setStudents(p => [...p, { name, email }]);
    addToast('Student added');
  }

  function removeStudent(idx) {
    setStudents(p => p.filter((_, i) => i !== idx));
    const newAssign = { ...assignments }; delete newAssign[idx]; setAssignments(newAssign);
  }

  function assignTopic(studentIdx, topicIdx) {
    setAssignments(p => ({ ...p, [studentIdx]: topicIdx }));
    addToast('Topic assigned');
  }

  function emailStudent(student, topic) {
    const subject = encodeURIComponent(`Research Topic Assignment: ${topic.title}`);
    const absSection = topic.abstractTemplate ? `\n\n--- ABSTRACT TEMPLATE ---\nUse this as your starting point. Fill in the [___] blanks with your actual results.\n\nBackground: ${topic.abstractTemplate.background || ''}\nObjective: ${topic.abstractTemplate.objective || ''}\nMethods: ${topic.abstractTemplate.methods || ''}\nResults: ${topic.abstractTemplate.resultsTemplate || ''}\nConclusion: ${topic.abstractTemplate.conclusionTemplate || ''}\n\n${topic.abstractTemplate.formatNotes || ''}` : '';
    const body = encodeURIComponent(`Dear ${student.name},\n\nYou have been assigned the following research topic:\n\nTitle: ${topic.title}\n${topic.layman ? `\nIn plain language: ${topic.layman}\n` : ''}\nDescription: ${topic.description}\n\nMethodology: ${topic.methodology || 'See attached details'}\n\nEstimated Cost: ${topic.estimatedCost?.total || 'TBD'}${absSection}\n\nPlease review and reach out with any questions.\n\nBest regards`);
    window.open(`mailto:${student.email}?subject=${subject}&body=${body}`);
  }

  // ─── Shared components ───
  const Callout = ({ color, title, text }) => (
    <div className={`callout ${color}`}>
      <div className="callout-title">{title}</div>
      <p>{text}</p>
    </div>
  );

  const CollapseHeader = ({ label, sectionKey }) => (
    <div className="collapse-header" onClick={() => toggleSection(sectionKey)}>
      <div className="section-label" style={{ marginBottom: 0 }}>{label}</div>
      <ChevronDown size={14} className={`collapse-icon ${sections[sectionKey] ? 'open' : ''}`} />
    </div>
  );

  // ─── Topic Card ───
  const TopicCard = ({ topic: rawTopic, index, isApproved = false }) => {
    // Safety: ensure all array/object fields have defaults
    const topic = {
      ...rawTopic,
      objectives: rawTopic.objectives || [],
      materials: rawTopic.materials || [],
      equipment: rawTopic.equipment || [],
      keywords: rawTopic.keywords || [],
      estimatedCost: rawTopic.estimatedCost || {},
      statisticalAnalysis: rawTopic.statisticalAnalysis || null,
      interviewQuestions: rawTopic.interviewQuestions || null,
      abstractTemplate: rawTopic.abstractTemplate || null,
      gelSharing: rawTopic.gelSharing || null,
    };
    if (topic.estimatedCost && !topic.estimatedCost.breakdown) topic.estimatedCost.breakdown = [];
    if (topic.interviewQuestions) {
      topic.interviewQuestions.consentQuestions = topic.interviewQuestions.consentQuestions || [];
      topic.interviewQuestions.methodologyQuestions = topic.interviewQuestions.methodologyQuestions || [];
    }
    const key = `${isApproved ? 'a' : 'g'}-${index}`;
    const isOpen = expandedTopic === key;
    const isRegen = regeneratingIdx === index && !isApproved;
    const isUniq = checkingUniq === key;
    const isProp = genProposal === topic.title;
    const areaColor = FOCUS_AREAS.find(a => a.id === topic.focusArea)?.color || 'var(--border)';

    return (
      <div className="topic-card fade-in" style={{ animationDelay: `${index * 0.06}s` }}>
        <div style={{ display: 'flex' }}>
          <div className="card-stripe" style={{ background: areaColor }} />
          <div style={{ flex: 1 }}>
            {/* Header */}
            <div style={{ padding: '1.15rem 1.35rem', cursor: 'pointer' }} onClick={() => setExpandedTopic(isOpen ? null : key)}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.75rem' }}>
                <h3 className="card-title">{topic.title}</h3>
                {isOpen ? <ChevronUp size={14} style={{ color: 'var(--text-3)', flexShrink: 0, marginTop: 3 }} /> : <ChevronDown size={14} style={{ color: 'var(--text-3)', flexShrink: 0, marginTop: 3 }} />}
              </div>
              {topic.layman && <p className="card-layman">{topic.layman}</p>}
              <div className="card-meta">
                {topic.estimatedCost?.total && <span className="cost">{topic.estimatedCost.total}</span>}
                {topic.estimatedDuration && <span>{topic.estimatedDuration}</span>}
                {topic.bacteria && <span style={{ fontStyle: 'italic' }}>{topic.bacteria}</span>}
                {topic.difficulty && <span className={`badge badge-${topic.difficulty}`}>{topic.difficulty}</span>}
                {topic.estimatedCost?.hasMolecular && <span className="badge badge-molecular">PCR</span>}
              </div>
            </div>

            {/* Expanded body */}
            {isOpen && (
              <div className="card-body">
                {topic.background && (
                  <div className="card-sec">
                    <div className="card-sec-title">Background</div>
                    <p>{topic.background}</p>
                  </div>
                )}
                {Array.isArray(topic.objectives) && topic.objectives.length > 0 && (
                  <div className="card-sec">
                    <div className="card-sec-title">Objectives</div>
                    <ol className="obj-list">
                      {topic.objectives.map((o, i) => <li key={i}><span className="obj-num">{i + 1}</span>{o}</li>)}
                    </ol>
                  </div>
                )}
                {topic.methodology && (
                  <div className="card-sec">
                    <div className="card-sec-title">Methodology</div>
                    <p>{topic.methodology}</p>
                  </div>
                )}
                {(topic.sampleSource || topic.sampleType || topic.sampleSize) && (
                  <div className="card-sec" style={{ padding: 0 }}>
                    <div className="sample-row">
                      {topic.sampleSource && <div className="sample-cell"><div className="sample-label">Source</div><div className="sample-value">{topic.sampleSource}</div></div>}
                      {topic.sampleType && <div className="sample-cell"><div className="sample-label">Sample Type</div><div className="sample-value">{topic.sampleType}</div></div>}
                      {topic.sampleSize && <div className="sample-cell"><div className="sample-label">Sample Size</div><div className="sample-value mono" style={{ fontSize: '0.78rem' }}>{topic.sampleSize}</div></div>}
                    </div>
                  </div>
                )}
                {(topic.materials?.length > 0 || topic.equipment?.length > 0) && (
                  <div className="card-sec">
                    <div className="mat-eq-grid">
                      {topic.materials?.length > 0 && (
                        <div className="mat-box materials">
                          <div className="mat-box-title">Materials</div>
                          <ul>{topic.materials.map((m, i) => <li key={i}>{m}</li>)}</ul>
                        </div>
                      )}
                      {topic.equipment?.length > 0 && (
                        <div className="mat-box equipment">
                          <div className="mat-box-title">Equipment</div>
                          <ul>{topic.equipment.map((e, i) => <li key={i}>{e}</li>)}</ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {topic.estimatedCost?.breakdown?.length > 0 && (
                  <div className="card-sec">
                    <div className="card-sec-title">Cost Breakdown</div>
                    {topic.estimatedCost.breakdown.map((item, i) => (
                      <div key={i} className="cost-row"><span className="cost-label">{item.item}</span><span className="cost-val">{item.cost}</span></div>
                    ))}
                    <div className="cost-total"><span>Total</span><span>{topic.estimatedCost.total}</span></div>
                  </div>
                )}
                {topic.statisticalAnalysis && (
                  <div className="card-sec">
                    <div className="card-sec-title">Statistical Analysis</div>
                    <div className="stats-grid">
                      <div><div className="stat-l">Design</div><div className="stat-v">{topic.statisticalAnalysis.studyDesign}</div></div>
                      <div><div className="stat-l">Software</div><div className="stat-v">{topic.statisticalAnalysis.software}</div></div>
                      {topic.statisticalAnalysis.sampleSizeCalculation && <div style={{ gridColumn: 'span 2' }}><div className="stat-l">Sample Calculation</div><div className="stat-v mono" style={{ fontSize: '0.78rem' }}>{topic.statisticalAnalysis.sampleSizeCalculation}</div></div>}
                      {topic.statisticalAnalysis.tests?.length > 0 && <div style={{ gridColumn: 'span 2' }}><div className="stat-l">Tests</div><div className="stat-v">{topic.statisticalAnalysis.tests.join(' · ')}</div></div>}
                    </div>
                  </div>
                )}
                {topic.interviewRequired && topic.interviewQuestions && (
                  <div className="card-sec">
                    <div className="card-sec-title">Interview Questions</div>
                    <div className="interview-grid">
                      {topic.interviewQuestions.consentQuestions?.length > 0 && (
                        <div className="interview-box consent"><div className="ib-title">Consent</div><ul>{topic.interviewQuestions.consentQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul></div>
                      )}
                      {topic.interviewQuestions.methodologyQuestions?.length > 0 && (
                        <div className="interview-box method"><div className="ib-title">Methodology</div><ul>{topic.interviewQuestions.methodologyQuestions.map((q, i) => <li key={i}>{q}</li>)}</ul></div>
                      )}
                    </div>
                  </div>
                )}
                {(topic.ethicalConsiderations || topic.supervisorNotes) && (
                  <div className="notes-pair" style={{ borderTop: '1px solid var(--bg-input)' }}>
                    {topic.ethicalConsiderations && <div className="note-block caution"><div className="note-title">Ethical Considerations</div><p>{topic.ethicalConsiderations}</p></div>}
                    {topic.supervisorNotes && <div className="note-block info"><div className="note-title">Supervisor Notes</div><p>{topic.supervisorNotes}</p></div>}
                  </div>
                )}
                {topic.uniquenessCheck && (
                  <div className="card-sec">
                    <Callout color="sage" title={`Uniqueness: ${topic.uniquenessCheck.score}/10`} text={`${topic.uniquenessCheck.reason}${topic.uniquenessCheck.suggestions ? `\n\n${topic.uniquenessCheck.suggestions}` : ''}`} />
                  </div>
                )}
                {/* Abstract Template */}
                {topic.abstractTemplate && (
                  <div className="card-sec">
                    <div className="card-sec-title">Abstract Template</div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                      Fill in the [___] blanks with your actual results. This teaches you the correct academic format.
                    </p>
                    <div style={{ background: 'var(--bg)', border: '1.5px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
                      {topic.abstractTemplate.background && (
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--bg-input)' }}>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '0.25rem' }}>Background</div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.65 }}>{topic.abstractTemplate.background}</p>
                        </div>
                      )}
                      {topic.abstractTemplate.objective && (
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--bg-input)' }}>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '0.25rem' }}>Objective</div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.65 }}>{topic.abstractTemplate.objective}</p>
                        </div>
                      )}
                      {topic.abstractTemplate.methods && (
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--bg-input)' }}>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '0.25rem' }}>Methods</div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.65 }}>{topic.abstractTemplate.methods}</p>
                        </div>
                      )}
                      {topic.abstractTemplate.resultsTemplate && (
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--bg-input)', background: 'var(--secondary-dim)' }}>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)', marginBottom: '0.25rem' }}>Results — fill in your data</div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.65 }}>{topic.abstractTemplate.resultsTemplate}</p>
                        </div>
                      )}
                      {topic.abstractTemplate.conclusionTemplate && (
                        <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--bg-input)', background: 'var(--secondary-dim)' }}>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--secondary)', marginBottom: '0.25rem' }}>Conclusion — fill in your findings</div>
                          <p style={{ fontSize: '0.82rem', color: 'var(--text)', lineHeight: 1.65 }}>{topic.abstractTemplate.conclusionTemplate}</p>
                        </div>
                      )}
                      {topic.abstractTemplate.formatNotes && (
                        <div style={{ padding: '0.65rem 1rem', background: 'var(--bg-hover)' }}>
                          <p style={{ fontSize: '0.72rem', color: 'var(--text-3)', lineHeight: 1.55, fontStyle: 'italic' }}>{topic.abstractTemplate.formatNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Gel Sharing */}
                {topic.gelSharing && (
                  <div className="card-sec">
                    <div className="card-sec-title">Gel Sharing Plan</div>
                    <div style={{ background: 'var(--primary-dim)', border: '1px solid var(--primary-border)', borderRadius: 8, padding: '0.85rem' }}>
                      <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '0.5rem' }}>
                        <div><div className="stat-l">Students per gel</div><div className="stat-v" style={{ fontWeight: 700 }}>{topic.gelSharing.studentsPerGel}</div></div>
                      </div>
                      {topic.gelSharing.laneLayout && (
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text)', padding: '0.5rem 0.65rem', background: 'var(--bg-card)', borderRadius: 4, marginBottom: '0.5rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>{topic.gelSharing.laneLayout}</div>
                      )}
                      {topic.gelSharing.fairnessTip && (
                        <p style={{ fontSize: '0.76rem', color: 'var(--primary)', lineHeight: 1.55 }}>{topic.gelSharing.fairnessTip}</p>
                      )}
                    </div>
                  </div>
                )}
                {/* Actions */}
                <div className="card-actions">
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

  // Shimmer placeholder card
  const GhostCard = () => (
    <div className="topic-card ghost">
      <div style={{ padding: '1.15rem 1.35rem', display: 'flex', gap: '0.85rem' }}>
        <div className="card-stripe" style={{ background: 'var(--border)' }} />
        <div style={{ flex: 1 }}>
          <div className="shimmer" style={{ width: '85%', height: 14, marginBottom: '0.5rem' }} />
          <div className="shimmer" style={{ width: '60%', height: 11, marginBottom: '0.4rem' }} />
          <div className="shimmer" style={{ width: '40%', height: 10 }} />
        </div>
      </div>
    </div>
  );

  // ─── Student form ───
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  // ─── Render ───
  return (
    <div className="app-layout">
      {/* ═══ Sidebar ═══ */}
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h2>Research Topic Generator</h2>
          <p>Medical Microbiology</p>
        </div>
        <div className="nav-group">
          <div className="nav-group-label">Create</div>
          {TABS.filter(t => t.group === 'create').map(tab => (
            <button key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <tab.icon size={16} className="nav-icon" />
              {tab.label}
              {tab.id === 'approved' && approvedTopics.length > 0 && <span className="nav-count">{approvedTopics.length}</span>}
              {tab.id === 'students' && students.length > 0 && <span className="nav-count">{students.length}</span>}
            </button>
          ))}
        </div>
        <div className="nav-group">
          <div className="nav-group-label">Plan</div>
          {TABS.filter(t => t.group === 'plan').map(tab => (
            <button key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <tab.icon size={16} className="nav-icon" />
              {tab.label}
            </button>
          ))}
        </div>
        <div className="sidebar-footer"><p>Lagos, Nigeria · 2025</p></div>
      </aside>

      {/* ═══ Main ═══ */}
      <main className="main-content">
        {/* ── Generate tab ── */}
        {activeTab === 'generate' && (
          <>
            <h1 className="page-title">Generate Topics</h1>
            <p className="page-subtitle">Configure your lab setup and generate experimental research topics with full methodology and Naira budgets.</p>

            {error && <div className="error-bar"><AlertTriangle size={16} /><p>{error}</p><button onClick={() => setError(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--red)' }}><X size={14} /></button></div>}

            {/* Loading state — replaces config */}
            {loading ? (
              <div>
                <div className="loading-full">
                  <div className="loading-dots">
                    <div className="loading-dot" style={{ background: 'var(--primary)', animationDelay: '0s' }} />
                    <div className="loading-dot" style={{ background: 'var(--secondary)', animationDelay: '0.15s' }} />
                    <div className="loading-dot" style={{ background: 'var(--primary)', animationDelay: '0.3s' }} />
                  </div>
                  <div className="loading-msg">{LOADING_MESSAGES[loadingMsgIdx]}</div>
                  <div className="loading-sub">Each topic includes methodology, costs, and materials. Usually 30–90 seconds.</div>
                  {topics.length > 0 && <div style={{ marginTop: '1rem', fontFamily: 'var(--mono)', fontSize: '0.76rem', fontWeight: 600, color: 'var(--primary)' }}>{topics.length} of {numTopics} topics ready</div>}
                </div>

                {/* Progressive: show topics as they arrive */}
                {topics.length > 0 && (
                  <div style={{ marginTop: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)' }}>Generated Topics ({topics.length} of {numTopics})</span>
                    </div>
                    {topics.map((t, i) => <TopicCard key={i} topic={t} index={i} />)}
                    {Array.from({ length: numTopics - topics.length }).map((_, i) => <GhostCard key={`g-${i}`} />)}
                  </div>
                )}
              </div>
            ) : (
              <>
                {/* Config sections */}
                <div className="config-section">
                  <CollapseHeader label="Focus Areas" sectionKey="focus" />
                  {sections.focus && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div className="chips">
                        {FOCUS_AREAS.map(a => <div key={a.id} className={`chip ${selectedAreas.includes(a.id) ? 'on' : ''}`} onClick={() => toggleArea(a.id)}>{a.label}</div>)}
                      </div>
                      <input type="text" placeholder="Custom focus area (optional)" value={customFocusArea} onChange={e => setCustomFocusArea(e.target.value)} style={{ marginTop: '0.5rem' }} />
                    </div>
                  )}
                </div>

                <div className="config-section">
                  <CollapseHeader label="Bacteria Filter" sectionKey="bacteria" />
                  {sections.bacteria && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--text-3)', marginBottom: '0.3rem' }}>AEROBES</div>
                        <div className="chips">{BACTERIA.aerobes.map(b => <div key={b.id} className={`chip ${selectedBacteria.includes(b.id) ? 'on' : ''}`} onClick={() => toggleBacteria(b.id)} style={{ fontStyle: 'italic', fontSize: '0.74rem' }}>{b.name}</div>)}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--text-3)', marginBottom: '0.3rem' }}>ANAEROBES</div>
                        <div className="chips">{BACTERIA.anaerobes.map(b => <div key={b.id} className={`chip ${selectedBacteria.includes(b.id) ? 'on' : ''}`} onClick={() => toggleBacteria(b.id)} style={{ fontStyle: 'italic', fontSize: '0.74rem' }}>{b.name}</div>)}</div>
                      </div>
                      <input type="text" placeholder="Custom bacteria (optional)" value={customBacteria} onChange={e => setCustomBacteria(e.target.value)} style={{ marginTop: '0.5rem' }} />
                    </div>
                  )}
                </div>

                <div className="config-section">
                  <CollapseHeader label="Lab Equipment" sectionKey="equipment" />
                  {sections.equipment && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div className="presets">
                        {Object.keys(PRESETS).map(p => <button key={p} className={`preset-btn ${activePreset === p ? 'on' : ''}`} onClick={() => setEquipment(PRESETS[p])}>{p === 'basic' ? 'Basic Lab' : p === 'equipped' ? 'Well-Equipped' : 'Advanced'}</button>)}
                        <button className="preset-btn" onClick={() => setEquipment([])}>Clear All</button>
                      </div>
                      <div className="equip-grid">
                        {EQUIPMENT_LIST.map(eq => (
                          <div key={eq.id} className={`eq-item ${equipment.includes(eq.id) ? 'on' : ''}`} onClick={() => toggleEquip(eq.id)}>
                            <div className="eq-check">{equipment.includes(eq.id) && <Check size={10} color="#fff" strokeWidth={3} />}</div>
                            <span className="eq-name">{eq.name}</span>
                            <span className="eq-hint">{eq.hint}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="config-section">
                  <CollapseHeader label="Settings" sectionKey="settings" />
                  {sections.settings && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <div className="settings-grid">
                        <div><label>Timeline</label><select value={timeline} onChange={e => setTimeline(e.target.value)}>{TIMELINES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div>
                        <div><label>Demographic</label><select value={selectedDemographic} onChange={e => setSelectedDemographic(e.target.value)}>{DEMOGRAPHICS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}</select></div>
                        <div><label>Budget Cap</label><select value={maxBudget} onChange={e => setMaxBudget(e.target.value)}>{BUDGET_CAPS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}</select></div>
                        <div><label>Topics</label><select value={numTopics} onChange={e => setNumTopics(parseInt(e.target.value))}>{[3,5,8,10].map(n => <option key={n} value={n}>{n} topics</option>)}</select></div>
                      </div>
                      <textarea rows={3} placeholder="Professor's notes (optional) — specific requirements, constraints, or preferences..." value={customNotes} onChange={e => setCustomNotes(e.target.value)} style={{ marginTop: '0.65rem' }} />
                    </div>
                  )}
                </div>

                <button onClick={generateTopics} disabled={selectedAreas.length === 0 || equipment.length === 0} className="gen-btn">
                  <Sparkles size={16} /> Generate {numTopics} Topics
                </button>

                {/* Results (after loading completes) */}
                {topics.length > 0 && (
                  <div style={{ marginTop: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                      <span style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--text-3)' }}>Generated Topics ({topics.length})</span>
                    </div>
                    {topics.map((t, i) => <TopicCard key={i} topic={t} index={i} />)}
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* ── Approved tab ── */}
        {activeTab === 'approved' && (
          <>
            <h1 className="page-title">Approved Topics</h1>
            <p className="page-subtitle">Topics ready for assignment to students.</p>
            {approvedTopics.length === 0 ? (
              <div className="empty-state"><Star size={40} style={{ color: 'var(--text-3)', opacity: 0.3 }} /><div className="es-title">No approved topics yet</div><div className="es-desc">Generate and approve topics from the Generate tab.</div></div>
            ) : (
              <>
                <div style={{ marginBottom: '1rem' }}><button onClick={exportApproved} className="act-btn"><Copy size={12} /> Export All</button></div>
                {approvedTopics.map((t, i) => <TopicCard key={i} topic={t} index={i} isApproved />)}
              </>
            )}
          </>
        )}

        {/* ── Students tab ── */}
        {activeTab === 'students' && (
          <>
            <h1 className="page-title">Students</h1>
            <p className="page-subtitle">Upload a CSV or add students manually, then assign approved topics.</p>
            <div className="config-section">
              <div className="section-label">Upload CSV</div>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-3)', marginBottom: '0.5rem' }}>Format: Name,Email — one per line.</p>
              <label className="act-btn" style={{ cursor: 'pointer' }}><Upload size={12} /> Choose File <input type="file" accept=".csv,.txt" onChange={handleCSVUpload} style={{ display: 'none' }} /></label>
            </div>
            <div className="config-section">
              <div className="section-label">Add Manually</div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} style={{ flex: 1 }} />
                <input type="text" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} style={{ flex: 1 }} />
                <button onClick={() => { addStudentManual(newName, newEmail); setNewName(''); setNewEmail(''); }} className="act-btn primary" disabled={!newName || !newEmail}><Users size={12} /> Add</button>
              </div>
            </div>
            {students.length === 0 ? (
              <div className="empty-state"><Users size={40} style={{ color: 'var(--text-3)', opacity: 0.3 }} /><div className="es-title">No students yet</div><div className="es-desc">Upload a CSV or add students manually.</div></div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {students.map((s, i) => {
                  const assignedIdx = assignments[i];
                  const assignedTopic = assignedIdx !== undefined ? approvedTopics[assignedIdx] : null;
                  return (
                    <div key={i} className="student-row">
                      <div className="student-avatar">{s.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{s.name}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-3)' }}>{s.email}</div>
                        {assignedTopic && <div style={{ fontSize: '0.68rem', color: 'var(--primary)', marginTop: '0.15rem', fontStyle: 'italic' }}>{assignedTopic.title.slice(0, 60)}...</div>}
                      </div>
                      <select value={assignedIdx !== undefined ? assignedIdx : ''} onChange={e => assignTopic(i, parseInt(e.target.value))} style={{ width: 140, fontSize: '0.7rem' }}>
                        <option value="">Assign topic...</option>
                        {approvedTopics.map((t, ti) => <option key={ti} value={ti}>{t.title.slice(0, 40)}...</option>)}
                      </select>
                      {assignedTopic && <button onClick={() => emailStudent(s, assignedTopic)} className="act-btn" title="Email"><Mail size={12} /></button>}
                      <button onClick={() => removeStudent(i)} className="act-btn danger"><Trash2 size={12} /></button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* ── Budget tab ── */}
        {activeTab === 'budget' && (
          <>
            <h1 className="page-title">Budget Analysis</h1>
            <p className="page-subtitle">Cost overview for approved topics.</p>
            {approvedTopics.length === 0 ? (
              <div className="empty-state"><DollarSign size={40} style={{ color: 'var(--text-3)', opacity: 0.3 }} /><div className="es-title">No approved topics</div><div className="es-desc">Approve topics first to see budget analysis.</div></div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.5rem' }}>
                  <div className="stat-card"><div style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>Projects</div><div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary)' }}>{approvedTopics.length}</div></div>
                  <div className="stat-card"><div style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>Molecular</div><div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--purple)' }}>{approvedTopics.filter(t => t.estimatedCost?.hasMolecular).length}</div></div>
                  <div className="stat-card"><div style={{ fontSize: '0.55rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)' }}>Phenotypic</div><div style={{ fontFamily: 'var(--serif)', fontSize: '1.5rem', fontWeight: 700, color: 'var(--secondary)' }}>{approvedTopics.filter(t => !t.estimatedCost?.hasMolecular).length}</div></div>
                </div>
                {approvedTopics.map((t, i) => (
                  <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0', borderBottom: '1px solid var(--bg-input)' }}>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text)' }}>{t.title.slice(0, 65)}...</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-3)' }}>{t.bacteria || 'N/A'} · {t.difficulty || 'N/A'}</div>
                    </div>
                    <span className="mono" style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--primary)' }}>{t.estimatedCost?.total || 'N/A'}</span>
                  </div>
                ))}
                <Callout color="sage" title="Bulk Savings Tip" text="Sharing PCR reagents, culture media, and consumables across projects can save 15–25% on total costs. Coordinate equipment scheduling to maximize throughput." />
              </>
            )}
          </>
        )}

        {/* ── Suppliers tab ── */}
        {activeTab === 'suppliers' && (
          <>
            <h1 className="page-title">Lagos Suppliers</h1>
            <p className="page-subtitle">Local lab suppliers and molecular services contacts.</p>
            <Callout color="amber" title="Pro Tip" text="Call ahead to confirm stock. Ask about institutional pricing and bulk discounts for 5+ items." />
            <div style={{ display: 'grid', gap: '0.65rem', marginTop: '1.25rem' }}>
              {SUPPLIERS.map((s, i) => (
                <div key={i} className="supplier-card">
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem' }}>{s.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-2)', lineHeight: 1.55, marginBottom: '0.5rem' }}>{s.notes}</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.72rem', color: 'var(--text-3)' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><MapPin size={11} /> {s.address}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Phone size={11} /> {s.phone}</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Mail size={11} /> {s.email}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem' }}>
                    {s.tags.map(tag => <span key={tag} className="badge" style={{ background: 'var(--bg-input)', color: 'var(--text-3)' }}>{tag}</span>)}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: '1.5rem' }}>
              <div className="section-label">NIMR Molecular Services</div>
              <div className="supplier-card">
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)', marginBottom: '0.35rem' }}>Nigerian Institute of Medical Research (NIMR)</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-2)', lineHeight: 1.55 }}>DNA sequencing: ₦15,000–₦25,000 per sample. HPLC analysis: ₦20,000–₦35,000 per run. Contact molecular biology unit for scheduling.</div>
              </div>
            </div>
          </>
        )}

        {/* ── Grants tab ── */}
        {activeTab === 'grants' && (
          <>
            <h1 className="page-title">Funding Sources</h1>
            <p className="page-subtitle">Nigerian and international grants for microbiology research.</p>
            <div style={{ display: 'grid', gap: '0.65rem' }}>
              {GRANTS.map((g, i) => (
                <div key={i} className="supplier-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text)' }}>{g.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-3)', marginTop: '0.1rem' }}>{g.org}</div>
                    </div>
                    <span className="mono" style={{ fontSize: '0.76rem', fontWeight: 600, color: 'var(--primary)' }}>{g.amount}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', fontSize: '0.72rem', color: 'var(--text-2)' }}>
                    <span>Cycle: {g.cycle}</span>
                    <span>Focus: {g.focus}</span>
                  </div>
                  <div style={{ fontSize: '0.74rem', color: 'var(--primary)', marginTop: '0.35rem', fontStyle: 'italic' }}>{g.tip}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── Lab Plan tab ── */}
        {activeTab === 'labplan' && (
          <>
            <h1 className="page-title">Lab Planning</h1>
            <p className="page-subtitle">Molecular project coordination, gel layout optimization, and fair resource allocation.</p>
            {(() => {
              const molProjects = approvedTopics.filter(t => t.estimatedCost?.hasMolecular);
              const phenoProjects = approvedTopics.filter(t => !t.estimatedCost?.hasMolecular);
              return approvedTopics.length === 0 ? (
                <div className="empty-state"><FlaskConical size={40} style={{ color: 'var(--text-3)', opacity: 0.3 }} /><div className="es-title">No approved projects</div><div className="es-desc">Approve topics to plan lab work and resource allocation.</div></div>
              ) : (
                <>
                  {molProjects.length > 0 && (
                    <>
                      <div className="section-label">Molecular Projects ({molProjects.length})</div>
                      {molProjects.map((t, i) => (
                        <div key={i} style={{ padding: '0.75rem 0', borderBottom: '1px solid var(--bg-input)' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div><div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t.title.slice(0, 65)}...</div><div style={{ fontSize: '0.68rem', color: 'var(--text-3)' }}>{t.bacteria || ''} · {t.estimatedCost?.total || 'N/A'}</div></div>
                            <span className="badge badge-molecular">PCR</span>
                          </div>
                          {t.gelSharing && (
                            <div style={{ marginTop: '0.5rem', padding: '0.6rem 0.75rem', background: 'var(--primary-dim)', borderRadius: 6, border: '1px solid var(--primary-border)' }}>
                              <div style={{ fontFamily: 'var(--mono)', fontSize: '0.65rem', color: 'var(--text)', marginBottom: '0.25rem', overflowX: 'auto', whiteSpace: 'nowrap' }}>{t.gelSharing.laneLayout}</div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--primary)', lineHeight: 1.45 }}>{t.gelSharing.fairnessTip}</div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Gel Fairness Guide */}
                      <div style={{ marginTop: '1.5rem' }}>
                        <div className="section-label">Gel Fairness Allocation</div>
                        <div style={{ background: 'var(--bg-card)', border: '1.5px solid var(--border)', borderRadius: 10, overflow: 'hidden' }}>
                          <div style={{ padding: '1rem 1.15rem', borderBottom: '1px solid var(--bg-input)' }}>
                            <p style={{ fontSize: '0.82rem', color: 'var(--text-2)', lineHeight: 1.65 }}>
                              When students share gel trays, lanes closest to the DNA ladder produce the clearest, most publishable results. Students assigned to distant lanes get lower-quality bands through no fault of their own.
                            </p>
                            <p style={{ fontSize: '0.82rem', color: 'var(--primary)', lineHeight: 1.65, marginTop: '0.35rem', fontWeight: 600 }}>
                              Solution: Rotate ladder-adjacent positions across gel runs so every student gets at least one high-resolution lane.
                            </p>
                          </div>
                          <div style={{ padding: '0.85rem 1.15rem', background: 'var(--bg)' }}>
                            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--text-3)', marginBottom: '0.4rem' }}>15-well gel — optimal layout</div>
                            <div style={{ fontFamily: 'var(--mono)', fontSize: '0.72rem', color: 'var(--text)', lineHeight: 1.8 }}>
                              <div><span style={{ color: 'var(--primary)', fontWeight: 600 }}>Run 1:</span> [L] [NC] [<b>S1</b>] [<b>S2</b>] [S3] [S4] [S5] [S6] [S7] [S8] [S9] [S10] [S11] [S12] [PC]</div>
                              <div><span style={{ color: 'var(--primary)', fontWeight: 600 }}>Run 2:</span> [L] [NC] [<b>S3</b>] [<b>S4</b>] [S5] [S6] [S1] [S2] [S7] [S8] [S9] [S10] [S11] [S12] [PC]</div>
                              <div><span style={{ color: 'var(--primary)', fontWeight: 600 }}>Run 3:</span> [L] [NC] [<b>S5</b>] [<b>S6</b>] [S7] [S8] [S9] [S10] [S1] [S2] [S3] [S4] [S11] [S12] [PC]</div>
                            </div>
                            <p style={{ fontSize: '0.68rem', color: 'var(--text-3)', marginTop: '0.4rem' }}>L = Ladder · NC = Negative Control · PC = Positive Control · <b>Bold</b> = priority lanes (best resolution)</p>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginTop: '1rem' }}>
                        <Callout color="sage" title="Gel Layout Optimizer" text={`${molProjects.length} molecular project${molProjects.length > 1 ? 's' : ''} × ~13 samples/gel (15-well) = ${Math.ceil((molProjects.length * 13) / 13)} gel(s) minimum. Batch all samples in one session to share reagents and ladder costs.`} />
                      </div>
                    </>
                  )}

                  {phenoProjects.length > 0 && (
                    <div style={{ marginTop: molProjects.length > 0 ? '2rem' : 0 }}>
                      <div className="section-label">Phenotypic Projects ({phenoProjects.length})</div>
                      {phenoProjects.map((t, i) => (
                        <div key={i} style={{ padding: '0.65rem 0', borderBottom: '1px solid var(--bg-input)', display: 'flex', justifyContent: 'space-between' }}>
                          <div><div style={{ fontSize: '0.82rem', fontWeight: 600 }}>{t.title.slice(0, 65)}...</div><div style={{ fontSize: '0.68rem', color: 'var(--text-3)' }}>{t.bacteria || ''} · {t.estimatedCost?.total || 'N/A'}</div></div>
                          <span className="badge badge-beginner">Culture</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: '1.5rem' }}>
                    <Callout color="amber" title="Cost-Saving Tips" text={`Share master mix across projects. Pool primers for common targets. Batch sequencing submissions. Share buffer solutions between runs.${molProjects.length > 1 ? ` With ${molProjects.length} molecular projects, sharing a single DNA ladder across gel runs saves ₦${(35 * (molProjects.length - 1)).toLocaleString()}K–₦${(50 * (molProjects.length - 1)).toLocaleString()}K.` : ''}`} />
                  </div>
                </>
              );
            })()}
          </>
        )}

        {/* ── Proposal Modal ── */}
        {proposalModal && (
          <div className="modal-overlay" onClick={() => setProposalModal(null)}>
            <div className="modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Research Proposal</h3>
                <button onClick={() => setProposalModal(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-3)' }}><X size={18} /></button>
              </div>
              <div className="modal-body">{proposalModal.content}</div>
              <div className="modal-footer">
                <button onClick={() => { navigator.clipboard.writeText(proposalModal.content); addToast('Proposal copied'); }} className="act-btn primary"><Copy size={12} /> Copy</button>
                <button onClick={() => setProposalModal(null)} className="act-btn">Close</button>
              </div>
            </div>
          </div>
        )}

        {/* ── Toasts ── */}
        {toasts.length > 0 && (
          <div className="toast-container">
            {toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.type === 'success' ? <Check size={14} /> : null}{t.msg}</div>)}
          </div>
        )}
      </main>
    </div>
  );
}
