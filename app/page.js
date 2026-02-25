'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Star, RefreshCw, Search, FileText, Copy, Trash2, ChevronDown, X, Upload, Mail, Check, MapPin, Phone, FlaskConical, Users, DollarSign, Package, Award, Wrench, AlertTriangle, ArrowLeft, ArrowRight, Beaker } from 'lucide-react';

// ─── Constants ───
const FOCUS_AREAS = [
  { id: 'plant', label: 'Plant-Based Antimicrobials', color: '#6366f1' },
  { id: 'amr', label: 'Antimicrobial Resistance', color: '#f59e0b' },
  { id: 'food', label: 'Food & Environmental', color: '#8b5cf6' },
  { id: 'clinical', label: 'Clinical Isolates', color: '#ef4444' },
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
const TIMELINES = [{ value: '1', label: '1 month' }, { value: '3', label: '3 months' }, { value: '6', label: '6 months' }, { value: '8', label: '8 months' }, { value: '12', label: '12 months' }];
const BUDGET_CAPS = [{ value: 'any', label: 'Any budget' }, { value: '200000', label: 'Under ₦200K' }, { value: '300000', label: 'Under ₦300K' }, { value: '500000', label: 'Under ₦500K' }, { value: '750000', label: 'Under ₦750K' }, { value: '1000000', label: 'Under ₦1M' }];
const SUPPLIERS = [
  { name: 'Finlab Nigeria', address: 'Surulere, Lagos', phone: '+234 802 310 1234', email: 'sales@finlabnigeria.com', notes: 'Largest lab supplier in Lagos. Good bulk discounts.', tags: ['Media', 'Reagents', 'Equipment'] },
  { name: 'Koeman Integrated', address: 'Mushin, Lagos', phone: '+234 803 400 5678', email: 'info@koemanlab.com', notes: 'Competitive pricing on culture media. Fast delivery.', tags: ['Culture Media', 'Staining Kits'] },
  { name: 'Allschoolabs', address: 'Yaba, Lagos', phone: '+234 812 555 9012', email: 'orders@allschoolabs.com', notes: 'Good for consumables and glassware. Student discounts available.', tags: ['Consumables', 'Glassware'] },
  { name: 'Pascal Scientific', address: 'Ikeja, Lagos', phone: '+234 807 600 3456', email: 'pascal@pascalscientific.com', notes: 'Molecular biology reagents. PCR supplies.', tags: ['PCR', 'Molecular', 'Primers'] },
  { name: 'Regino Enterprises', address: 'Ojota, Lagos', phone: '+234 809 700 7890', email: 'sales@reginoenterprises.com', notes: 'Equipment maintenance and calibration services.', tags: ['Equipment', 'Maintenance'] },
];
const GRANTS = [
  { name: 'TETFund Research Grant', org: 'Tertiary Education Trust Fund', amount: '₦2M – ₦10M', cycle: 'Annual', focus: 'All research areas', tip: 'Apply through your institution' },
  { name: 'NRF Grant', org: 'National Research Fund', amount: '₦5M – ₦20M', cycle: 'Biannual', focus: 'Health sciences priority', tip: 'Collaborative proposals preferred' },
  { name: 'Wellcome Trust', org: 'International', amount: '$50K – $300K', cycle: 'Rolling', focus: 'AMR, infectious disease', tip: 'Strong Nigerian institution partnerships' },
  { name: 'NIH Fogarty', org: 'National Institutes of Health', amount: '$50K – $150K', cycle: 'Annual', focus: 'Global health research', tip: 'Requires US co-investigator' },
  { name: 'Grand Challenges Africa', org: 'AAS / Bill & Melinda Gates', amount: '$100K', cycle: 'Annual', focus: 'Innovation in health', tip: 'Seed grants for bold ideas' },
  { name: 'GARDP', org: 'Global Antibiotic R&D Partnership', amount: 'Varies', cycle: 'Open calls', focus: 'AMR specifically', tip: 'AMR-focused proposals only' },
];
const LOADING_MESSAGES = ['Designing experiments around your lab equipment...', 'Calculating sample sizes for Lagos populations...', 'Checking reagent availability from local suppliers...', 'Building methodology pipelines...', 'Estimating costs in Nigerian Naira...', 'Reviewing ethical considerations...', 'Cross-referencing with recent literature...', 'Optimizing for your timeline and budget...'];

// ─── Hooks ───
function usePersistedState(key, initial) {
  const [state, setState] = useState(initial);
  useEffect(() => { try { const s = localStorage.getItem('bt-v1-' + key); if (s) { const p = JSON.parse(s); if (Array.isArray(initial) && !Array.isArray(p)) return; if (p != null) setState(p); } } catch {} }, [key]);
  useEffect(() => { try { localStorage.setItem('bt-v1-' + key, JSON.stringify(state)); } catch {} }, [key, state]);
  return [state, setState];
}
function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type = 'ok') => { const id = Date.now(); setToasts(p => [...p, { id, msg, type }]); setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3000); }, []);
  return { toasts, add };
}

// ─── Main ───
export default function Benchtop() {
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

  const [topics, setTopics] = useState([]);
  const [approvedTopics, setApprovedTopics] = usePersistedState('approved', []);
  const [students, setStudents] = usePersistedState('students', []);
  const [assignments, setAssignments] = usePersistedState('assign', {});

  const [activeTab, setActiveTab] = useState('generate');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalIdx, setModalIdx] = useState(null);
  const [modalSource, setModalSource] = useState('results');
  const [regeneratingIdx, setRegeneratingIdx] = useState(null);
  const [checkingUniq, setCheckingUniq] = useState(null);
  const [genProposal, setGenProposal] = useState(null);
  const [proposalModal, setProposalModal] = useState(null);
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);
  const [sections, setSections] = useState({ focus: true, bacteria: false, equipment: true, settings: true });
  const [collapsed, setCollapsed] = useState({});
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');

  const { toasts, add: addToast } = useToast();
  const loadingInterval = useRef(null);

  const PRESETS = { basic: ['autoclave','incubator','microscope','colony_counter','centrifuge','water_bath','ph_meter'], equipped: ['autoclave','incubator','microscope','colony_counter','centrifuge','water_bath','ph_meter','pcr','gel_electrophoresis','spectrophotometer','elisa_reader','biosafety_cabinet','uv_transilluminator'], advanced: EQUIPMENT_LIST.map(e => e.id) };
  const activePreset = Object.entries(PRESETS).find(([,ids]) => ids.length === equipment.length && ids.every(id => equipment.includes(id)))?.[0] || null;

  const toggleArea = id => setSelectedAreas(p => p.includes(id) ? p.filter(a => a !== id) : [...p, id]);
  const toggleBacteria = id => setSelectedBacteria(p => p.includes(id) ? p.filter(b => b !== id) : [...p, id]);
  const toggleEquip = id => setEquipment(p => p.includes(id) ? p.filter(e => e !== id) : [...p, id]);
  const toggleSection = key => setSections(p => ({ ...p, [key]: !p[key] }));
  const toggleCollapse = key => setCollapsed(p => ({ ...p, [key]: !p[key] }));

  // Modal
  const modalList = modalSource === 'approved' ? approvedTopics : topics;
  const modalTopic = modalIdx !== null && modalList[modalIdx] ? (() => {
    const r = modalList[modalIdx];
    return { ...r, objectives: r.objectives || [], materials: r.materials || [], equipment: r.equipment || [], keywords: r.keywords || [],
      estimatedCost: { breakdown: [], ...(r.estimatedCost || {}) },
      statisticalAnalysis: r.statisticalAnalysis || null,
      interviewQuestions: r.interviewQuestions ? { consentQuestions: r.interviewQuestions.consentQuestions || [], methodologyQuestions: r.interviewQuestions.methodologyQuestions || [] } : null,
      abstractTemplate: r.abstractTemplate || null, gelSharing: r.gelSharing || null };
  })() : null;
  function openModal(idx, src) { setModalIdx(idx); setModalSource(src); setCollapsed({}); }
  function closeModal() { setModalIdx(null); }
  function navModal(dir) { if (modalIdx === null) return; const n = modalIdx + dir; if (n >= 0 && n < modalList.length) { setModalIdx(n); setCollapsed({}); } }

  // ─── API ───
  async function generateTopics() {
    if (selectedAreas.length === 0 || equipment.length === 0) { setError('Select at least one focus area and one piece of equipment.'); return; }
    setError(null); setLoading(true); setTopics([]); setLoadingMsgIdx(0);
    loadingInterval.current = setInterval(() => setLoadingMsgIdx(p => (p + 1) % LOADING_MESSAGES.length), 4000);
    const generated = [];
    let lastErr = '';
    for (let i = 0; i < numTopics; i++) {
      try {
        const res = await fetch('/api/generate-one', { method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ selectedAreas, selectedBacteria, selectedDemographic, equipment, timeline, numTopics: 1, maxBudget, customNotes, customFocusArea, customBacteria, existingTitles: generated.map(t => t.title) }) });
        if (!res.ok) { lastErr = `Status ${res.status}`; try { const e = await res.json(); lastErr = e.error || lastErr; } catch {} continue; }
        const data = await res.json();
        if (data.topic) { generated.push(data.topic); setTopics([...generated]); }
      } catch (e) { lastErr = e.message; continue; }
    }
    clearInterval(loadingInterval.current); setLoading(false);
    if (generated.length === 0) setError(`Topics failed to generate. ${lastErr}`);
    else setActiveTab('results'); // ← auto-switch to Results tab
  }

  async function regenerateTopic(idx) {
    const t = topics[idx]; if (!t) return; setRegeneratingIdx(idx);
    try {
      const res = await fetch('/api/regenerate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: t, selectedAreas, selectedBacteria, equipment, timeline, customNotes }) });
      if (!res.ok) throw new Error('Regeneration failed');
      const d = await res.json();
      if (d.topic) { setTopics(p => p.map((x, i) => i === idx ? d.topic : x)); addToast('Topic regenerated'); }
    } catch (e) { setError(e.message); }
    setRegeneratingIdx(null);
  }
  async function checkUniqueness(idx, isApproved) {
    const t = isApproved ? approvedTopics[idx] : topics[idx]; if (!t) return; setCheckingUniq(idx);
    try {
      const res = await fetch('/api/uniqueness', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: t }) });
      if (!res.ok) throw new Error('Check failed');
      const d = await res.json(); const upd = { ...t, uniquenessCheck: d };
      if (isApproved) setApprovedTopics(p => p.map((x, i) => i === idx ? upd : x));
      else setTopics(p => p.map((x, i) => i === idx ? upd : x));
      addToast(`Uniqueness: ${d.score}/10`);
    } catch (e) { setError(e.message); }
    setCheckingUniq(null);
  }
  async function generateProposal(t) {
    setGenProposal(t.title);
    try { const res = await fetch('/api/proposal', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ topic: t }) }); if (!res.ok) throw new Error('Failed'); const d = await res.json(); setProposalModal({ title: t.title, content: d.proposal }); } catch (e) { setError(e.message); }
    setGenProposal(null);
  }
  function approveTopic(idx) { setApprovedTopics(p => [...p, { ...topics[idx], approvedAt: new Date().toISOString() }]); addToast('Topic approved'); }
  function removeApproved(idx) { setApprovedTopics(p => p.filter((_, i) => i !== idx)); addToast('Removed'); }
  function copyTopic(t) {
    const a = t.abstractTemplate;
    const lines = [t.title, '', t.layman || '', '', `Background: ${t.background || ''}`, '', 'Objectives:', ...(t.objectives || []).map((o, i) => `${i + 1}. ${o}`), '', `Methodology: ${t.methodology || ''}`, '', `Cost: ${t.estimatedCost?.total || 'N/A'}`,
      ...(a ? ['', '--- ABSTRACT TEMPLATE ---', `Background: ${a.background}`, `Objective: ${a.objective}`, `Methods: ${a.methods}`, `Results: ${a.resultsTemplate}`, `Conclusion: ${a.conclusionTemplate}`] : [])];
    navigator.clipboard.writeText(lines.join('\n')); addToast('Copied');
  }
  function exportApproved() {
    const text = approvedTopics.map((t, i) => `=== Topic ${i + 1} ===\n${t.title}\n${t.layman || ''}\nCost: ${t.estimatedCost?.total || 'N/A'}\n`).join('\n');
    const b = new Blob([text], { type: 'text/plain' }); const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'benchtop-topics.txt'; a.click(); addToast('Exported');
  }
  function handleCSVUpload(e) {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onload = ev => { const lines = ev.target.result.split('\n').map(l => l.trim()).filter(Boolean); const ns = [];
      for (const l of lines) { if (l.toLowerCase().startsWith('name') || l.toLowerCase().startsWith('student')) continue; const p = l.split(',').map(s => s.replace(/"/g,'').trim());
        if (p.length >= 2 && p[1].includes('@')) ns.push({ name: p[0], email: p[1] }); else if (p[0].includes('@')) ns.push({ name: p[0].split('@')[0], email: p[0] }); }
      if (ns.length) { setStudents(p => [...p, ...ns]); addToast(`Added ${ns.length} students`); } };
    r.readAsText(f); e.target.value = '';
  }
  function emailStudent(s, t) { window.open(`mailto:${s.email}?subject=${encodeURIComponent(`Research Topic: ${t.title}`)}&body=${encodeURIComponent(`Dear ${s.name},\n\nAssigned topic: ${t.title}\n${t.layman ? `\n${t.layman}\n` : ''}\nCost: ${t.estimatedCost?.total || 'TBD'}\n\nBest regards`)}`); }

  // ─── UI helpers ───
  const Callout = ({ color, title, text }) => (<div className={`co ${color === 'sage' ? 'sage' : 'amb'}`} style={{ marginTop: '1rem' }}><div className="co-t">{title}</div><p>{text}</p></div>);
  const CfgHead = ({ label, sKey }) => (<div className="cfg-h" onClick={() => toggleSection(sKey)}><div className="sl" style={{ marginBottom: 0 }}>{label}</div><ChevronDown size={14} className={`cfg-arr ${sections[sKey] ? 'open' : ''}`} /></div>);
  const TopicCard = ({ topic, index, source }) => {
    const t = topic || {}; const ac = FOCUS_AREAS.find(a => a.id === t.focusArea)?.color || 'var(--border)';
    return (<div className="t-card fi" style={{ animationDelay: `${index * 0.05}s` }} onClick={() => openModal(index, source)}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: 3, background: ac }} />
      <div className="tc-t">{t.title}</div>
      {t.layman && <div className="tc-l">{t.layman}</div>}
      <div className="tc-m">
        {t.estimatedCost?.total && <span className="cost">{t.estimatedCost.total}</span>}
        {t.estimatedDuration && <span>{t.estimatedDuration}</span>}
        {t.difficulty && <span className={`bdg bdg-${t.difficulty === 'beginner' ? 'b' : t.difficulty === 'intermediate' ? 'i' : 'a'}`}>{t.difficulty}</span>}
        {t.estimatedCost?.hasMolecular && <span className="bdg bdg-pcr">PCR</span>}
        {t.uniquenessCheck && <span className="uniq-b">{t.uniquenessCheck.score}/10</span>}
      </div>
    </div>);
  };
  const GhostCard = () => (<div className="t-card" style={{ opacity: 0.35, borderStyle: 'dashed' }}><div className="shim" style={{ width: '85%', height: 14, marginBottom: 8 }} /><div className="shim" style={{ width: '60%', height: 11, marginBottom: 6 }} /><div className="shim" style={{ width: '40%', height: 10 }} /></div>);

  // ─── NAV ───
  const TABS = [
    { id: 'generate', label: 'Generate', icon: Sparkles, group: 'create' },
    ...(topics.length > 0 ? [{ id: 'results', label: `Results (${topics.length})`, icon: Beaker, group: 'create' }] : []),
    { id: 'approved', label: 'Approved', icon: Star, group: 'create' },
    { id: 'students', label: 'Students', icon: Users, group: 'create' },
    { id: 'budget', label: 'Budget', icon: DollarSign, group: 'plan' },
    { id: 'suppliers', label: 'Suppliers', icon: Package, group: 'plan' },
    { id: 'grants', label: 'Grants', icon: Award, group: 'plan' },
    { id: 'labplan', label: 'Lab Plan', icon: Wrench, group: 'plan' },
  ];

  return (
    <div className="app">
      {/* ═══ Sidebar ═══ */}
      <aside className="side">
        <div className="brand"><h1>Benchtop</h1><p>Helping Nigerian researchers go from bench to publication faster</p></div>
        <div className="nav-g">
          <div className="nav-gl">Create</div>
          {TABS.filter(t => t.group === 'create').map(tab => (
            <button key={tab.id} className={`nav-i ${activeTab === tab.id ? 'on' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <tab.icon size={17} className="ic" />
              {tab.label}
              {tab.id === 'approved' && approvedTopics.length > 0 && <span className="nav-c">{approvedTopics.length}</span>}
              {tab.id === 'students' && students.length > 0 && <span className="nav-c">{students.length}</span>}
            </button>
          ))}
        </div>
        <div className="nav-g">
          <div className="nav-gl">Plan</div>
          {TABS.filter(t => t.group === 'plan').map(tab => (
            <button key={tab.id} className={`nav-i ${activeTab === tab.id ? 'on' : ''}`} onClick={() => setActiveTab(tab.id)}>
              <tab.icon size={17} className="ic" />{tab.label}
            </button>
          ))}
        </div>
        <div className="side-ft"><p>Lagos, Nigeria · 2025</p></div>
      </aside>

      <main className="mn">
        {/* ── GENERATE TAB ── */}
        {activeTab === 'generate' && (<>
          <h1 className="pg-t">Generate Topics</h1>
          <p className="pg-s">Configure your lab setup and generate experimental research topics with full methodology and Naira budgets.</p>
          {error && <div className="err"><AlertTriangle size={16} /><p>{error}</p><button onClick={() => setError(null)} style={{ background:'none',border:'none',cursor:'pointer',color:'var(--red)' }}><X size={14} /></button></div>}

          {loading ? (
            <div className="ld">
              <div className="ld-dots"><div className="ld-dot" style={{ background:'var(--pri)',animationDelay:'0s',width:10,height:10,borderRadius:'50%' }} /><div className="ld-dot" style={{ background:'var(--sec)',animationDelay:'0.15s',width:10,height:10,borderRadius:'50%' }} /><div className="ld-dot" style={{ background:'var(--pri)',animationDelay:'0.3s',width:10,height:10,borderRadius:'50%' }} /></div>
              <div className="ld-msg">{LOADING_MESSAGES[loadingMsgIdx]}</div>
              <div className="ld-sub">Each topic includes methodology, costs, and materials. Usually 30–90 seconds.</div>
              {topics.length > 0 && <div style={{ marginTop:'1rem',fontFamily:'var(--mono)',fontSize:'0.78rem',fontWeight:600,color:'var(--pri)' }}>{topics.length} of {numTopics} topics ready</div>}
            </div>
          ) : (<>
            <div className="cfg"><CfgHead label="Focus Areas" sKey="focus" />{sections.focus && <div style={{ marginTop:'0.5rem' }}><div className="chips">{FOCUS_AREAS.map(a => <div key={a.id} className={`chip ${selectedAreas.includes(a.id)?'on':''}`} onClick={() => toggleArea(a.id)}>{a.label}</div>)}</div><input type="text" placeholder="Custom focus area (optional)" value={customFocusArea} onChange={e => setCustomFocusArea(e.target.value)} style={{ marginTop:'0.5rem' }} /></div>}</div>
            <div className="cfg"><CfgHead label="Bacteria Filter" sKey="bacteria" />{sections.bacteria && <div style={{ marginTop:'0.5rem' }}><div style={{ fontSize:'0.6rem',fontWeight:700,color:'var(--text3)',marginBottom:'0.3rem' }}>AEROBES</div><div className="chips">{BACTERIA.aerobes.map(b => <div key={b.id} className={`chip ${selectedBacteria.includes(b.id)?'on':''}`} onClick={() => toggleBacteria(b.id)} style={{ fontStyle:'italic',fontSize:'0.76rem' }}>{b.name}</div>)}</div><div style={{ fontSize:'0.6rem',fontWeight:700,color:'var(--text3)',margin:'0.5rem 0 0.3rem' }}>ANAEROBES</div><div className="chips">{BACTERIA.anaerobes.map(b => <div key={b.id} className={`chip ${selectedBacteria.includes(b.id)?'on':''}`} onClick={() => toggleBacteria(b.id)} style={{ fontStyle:'italic',fontSize:'0.76rem' }}>{b.name}</div>)}</div><input type="text" placeholder="Custom bacteria (optional)" value={customBacteria} onChange={e => setCustomBacteria(e.target.value)} style={{ marginTop:'0.5rem' }} /></div>}</div>
            <div className="cfg"><CfgHead label="Lab Equipment" sKey="equipment" />{sections.equipment && <div style={{ marginTop:'0.5rem' }}><div className="presets">{Object.keys(PRESETS).map(p => <button key={p} className={`pre ${activePreset===p?'on':''}`} onClick={() => setEquipment(PRESETS[p])}>{p==='basic'?'Basic Lab':p==='equipped'?'Well-Equipped':'Advanced'}</button>)}<button className="pre" onClick={() => setEquipment([])}>Clear All</button></div><div className="eq-grid">{EQUIPMENT_LIST.map(eq => (<div key={eq.id} className={`eq-i ${equipment.includes(eq.id)?'on':''}`} onClick={() => toggleEquip(eq.id)}><div className="eq-ck">{equipment.includes(eq.id) && <Check size={10} color="#fff" strokeWidth={3} />}</div><span className="eq-n">{eq.name}</span><span className="eq-h">{eq.hint}</span></div>))}</div></div>}</div>
            <div className="cfg"><CfgHead label="Settings" sKey="settings" />{sections.settings && <div style={{ marginTop:'0.5rem' }}><div className="set-g"><div><label>Timeline</label><select value={timeline} onChange={e => setTimeline(e.target.value)}>{TIMELINES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}</select></div><div><label>Demographic</label><select value={selectedDemographic} onChange={e => setSelectedDemographic(e.target.value)}>{DEMOGRAPHICS.map(d => <option key={d.id} value={d.id}>{d.label}</option>)}</select></div><div><label>Budget Cap</label><select value={maxBudget} onChange={e => setMaxBudget(e.target.value)}>{BUDGET_CAPS.map(b => <option key={b.value} value={b.value}>{b.label}</option>)}</select></div><div><label>Topics</label><select value={numTopics} onChange={e => setNumTopics(parseInt(e.target.value))}>{[3,5,8,10].map(n => <option key={n} value={n}>{n} topics</option>)}</select></div></div><textarea rows={3} placeholder="Professor's notes (optional) — specific requirements, constraints, or preferences..." value={customNotes} onChange={e => setCustomNotes(e.target.value)} style={{ marginTop:'0.65rem' }} /></div>}</div>
            <button onClick={generateTopics} disabled={selectedAreas.length === 0 || equipment.length === 0} className="gen-btn"><Sparkles size={16} /> Generate {numTopics} Topics</button>
          </>)}
        </>)}

        {/* ── RESULTS TAB ── */}
        {activeTab === 'results' && (<>
          <h1 className="pg-t">Generated Topics</h1>
          <p className="pg-s">{topics.length} topics generated. Click any card to view full details, approve, or regenerate.</p>
          <div className="t-grid">{topics.map((t, i) => <TopicCard key={i} topic={t} index={i} source="results" />)}</div>
        </>)}

        {/* ── APPROVED ── */}
        {activeTab === 'approved' && (<>
          <h1 className="pg-t">Approved Topics</h1>
          <p className="pg-s">Topics ready for assignment to students.</p>
          {approvedTopics.length === 0 ? <div className="empty"><Star size={40} style={{ color:'var(--text3)',opacity:0.3 }} /><div className="e-t">No approved topics yet</div><div className="e-s">Generate and approve topics first.</div></div> : (<>
            <div style={{ marginBottom:'1rem' }}><button onClick={exportApproved} className="ab"><Copy size={12} /> Export All</button></div>
            <div className="t-grid">{approvedTopics.map((t, i) => <TopicCard key={i} topic={t} index={i} source="approved" />)}</div>
          </>)}
        </>)}

        {/* ── STUDENTS ── */}
        {activeTab === 'students' && (<>
          <h1 className="pg-t">Students</h1>
          <p className="pg-s">Upload a CSV or add students manually, then assign approved topics.</p>
          <div className="cfg"><div className="sl">Upload CSV</div><p style={{ fontSize:'0.76rem',color:'var(--text3)',marginBottom:'0.5rem' }}>Format: Name,Email — one per line.</p><label className="ab" style={{ cursor:'pointer' }}><Upload size={12} /> Choose File <input type="file" accept=".csv,.txt" onChange={handleCSVUpload} style={{ display:'none' }} /></label></div>
          <div className="cfg"><div className="sl">Add Manually</div><div style={{ display:'flex',gap:'0.5rem' }}><input type="text" placeholder="Name" value={newName} onChange={e => setNewName(e.target.value)} style={{ flex:1 }} /><input type="text" placeholder="Email" value={newEmail} onChange={e => setNewEmail(e.target.value)} style={{ flex:1 }} /><button onClick={() => { if(newName&&newEmail){setStudents(p => [...p,{name:newName,email:newEmail}]);setNewName('');setNewEmail('');addToast('Added');} }} className="ab p" disabled={!newName||!newEmail}><Users size={12} /> Add</button></div></div>
          {students.length === 0 ? <div className="empty"><Users size={40} style={{ color:'var(--text3)',opacity:0.3 }} /><div className="e-t">No students yet</div></div> : (
            <div style={{ display:'flex',flexDirection:'column',gap:'0.5rem' }}>{students.map((s, i) => {
              const ai = assignments[i]; const at = ai !== undefined ? approvedTopics[ai] : null;
              return (<div key={i} className="stu-r"><div className="stu-av">{s.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase()}</div><div style={{ flex:1,minWidth:0 }}><div style={{ fontSize:'0.85rem',fontWeight:600 }}>{s.name}</div><div style={{ fontSize:'0.72rem',color:'var(--text3)' }}>{s.email}</div>{at && <div style={{ fontSize:'0.7rem',color:'var(--pri)',marginTop:'0.15rem',fontStyle:'italic' }}>{at.title.slice(0,60)}...</div>}</div>
                <select value={ai !== undefined ? ai : ''} onChange={e => {setAssignments(p => ({...p,[i]:parseInt(e.target.value)}));addToast('Assigned');}} style={{ width:140,fontSize:'0.72rem' }}><option value="">Assign topic...</option>{approvedTopics.map((t,ti) => <option key={ti} value={ti}>{t.title.slice(0,40)}...</option>)}</select>
                {at && <button onClick={() => emailStudent(s,at)} className="ab" title="Email"><Mail size={12} /></button>}
                <button onClick={() => {setStudents(p=>p.filter((_,j)=>j!==i));const na={...assignments};delete na[i];setAssignments(na);}} className="ab d"><Trash2 size={12} /></button></div>);
            })}</div>
          )}
        </>)}

        {/* ── BUDGET ── */}
        {activeTab === 'budget' && (<>
          <h1 className="pg-t">Budget Analysis</h1><p className="pg-s">Cost overview for approved topics.</p>
          {approvedTopics.length === 0 ? <div className="empty"><DollarSign size={40} style={{ color:'var(--text3)',opacity:0.3 }} /><div className="e-t">No approved topics</div></div> : (<>
            <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:'0.5rem',marginBottom:'1.5rem' }}>
              <div className="st-c"><div className="sl">Projects</div><div style={{ fontFamily:'var(--head)',fontSize:'1.5rem',fontWeight:700,color:'var(--pri)' }}>{approvedTopics.length}</div></div>
              <div className="st-c"><div className="sl">Molecular</div><div style={{ fontFamily:'var(--head)',fontSize:'1.5rem',fontWeight:700,color:'var(--pur)' }}>{approvedTopics.filter(t => t.estimatedCost?.hasMolecular).length}</div></div>
              <div className="st-c"><div className="sl">Phenotypic</div><div style={{ fontFamily:'var(--head)',fontSize:'1.5rem',fontWeight:700,color:'var(--sec)' }}>{approvedTopics.filter(t => !t.estimatedCost?.hasMolecular).length}</div></div>
            </div>
            {approvedTopics.map((t, i) => (<div key={i} style={{ display:'flex',justifyContent:'space-between',alignItems:'center',padding:'0.7rem 0',borderBottom:'1px solid var(--input)' }}><div><div style={{ fontSize:'0.85rem',fontWeight:600 }}>{t.title.slice(0,65)}...</div><div style={{ fontSize:'0.7rem',color:'var(--text3)' }}>{t.bacteria || 'N/A'} · {t.difficulty || 'N/A'}</div></div><span style={{ fontFamily:'var(--mono)',fontSize:'0.78rem',fontWeight:600,color:'var(--pri)' }}>{t.estimatedCost?.total || 'N/A'}</span></div>))}
            <Callout color="sage" title="Bulk Savings Tip" text="Sharing PCR reagents, culture media, and consumables across projects can save 15–25% on total costs." />
          </>)}
        </>)}

        {/* ── SUPPLIERS ── */}
        {activeTab === 'suppliers' && (<>
          <h1 className="pg-t">Lagos Suppliers</h1><p className="pg-s">Local lab suppliers and molecular services contacts.</p>
          <Callout color="amb" title="Pro Tip" text="Call ahead to confirm stock. Ask about institutional pricing and bulk discounts for 5+ items." />
          <div style={{ display:'grid',gap:'0.7rem',marginTop:'1.25rem' }}>{SUPPLIERS.map((s, i) => (
            <div key={i} className="s-card"><div style={{ fontSize:'0.95rem',fontWeight:700,marginBottom:'0.35rem' }}>{s.name}</div><div style={{ fontSize:'0.8rem',color:'var(--text2)',lineHeight:1.55,marginBottom:'0.5rem' }}>{s.notes}</div>
              <div style={{ display:'flex',flexWrap:'wrap',gap:'0.75rem',fontSize:'0.75rem',color:'var(--text3)' }}><span style={{ display:'flex',alignItems:'center',gap:'0.25rem' }}><MapPin size={11} /> {s.address}</span><span style={{ display:'flex',alignItems:'center',gap:'0.25rem' }}><Phone size={11} /> {s.phone}</span><span style={{ display:'flex',alignItems:'center',gap:'0.25rem' }}><Mail size={11} /> {s.email}</span></div>
              <div style={{ display:'flex',gap:'0.3rem',marginTop:'0.5rem' }}>{s.tags.map(tag => <span key={tag} className="bdg" style={{ background:'var(--input)',color:'var(--text3)' }}>{tag}</span>)}</div></div>
          ))}</div>
        </>)}

        {/* ── GRANTS ── */}
        {activeTab === 'grants' && (<>
          <h1 className="pg-t">Funding Sources</h1><p className="pg-s">Nigerian and international grants for microbiology research.</p>
          <div style={{ display:'grid',gap:'0.7rem' }}>{GRANTS.map((g, i) => (
            <div key={i} className="s-card"><div style={{ display:'flex',justifyContent:'space-between',alignItems:'flex-start' }}><div><div style={{ fontSize:'0.95rem',fontWeight:700 }}>{g.name}</div><div style={{ fontSize:'0.75rem',color:'var(--text3)',marginTop:'0.1rem' }}>{g.org}</div></div><span style={{ fontFamily:'var(--mono)',fontSize:'0.78rem',fontWeight:600,color:'var(--pri)' }}>{g.amount}</span></div>
              <div style={{ display:'flex',gap:'0.75rem',marginTop:'0.5rem',fontSize:'0.75rem',color:'var(--text2)' }}><span>Cycle: {g.cycle}</span><span>Focus: {g.focus}</span></div>
              <div style={{ fontSize:'0.76rem',color:'var(--pri)',marginTop:'0.35rem',fontStyle:'italic' }}>{g.tip}</div></div>
          ))}</div>
        </>)}

        {/* ── LAB PLAN ── */}
        {activeTab === 'labplan' && (<>
          <h1 className="pg-t">Lab Planning</h1><p className="pg-s">Molecular project coordination, gel layout optimization, and fair resource allocation.</p>
          {approvedTopics.length === 0 ? <div className="empty"><FlaskConical size={40} style={{ color:'var(--text3)',opacity:0.3 }} /><div className="e-t">No approved projects</div></div> : (() => {
            const mol = approvedTopics.filter(t => t.estimatedCost?.hasMolecular); const phen = approvedTopics.filter(t => !t.estimatedCost?.hasMolecular);
            return (<>
              {mol.length > 0 && (<><div className="sl">Molecular Projects ({mol.length})</div>{mol.map((t,i) => (<div key={i} style={{ padding:'0.7rem 0',borderBottom:'1px solid var(--input)',display:'flex',justifyContent:'space-between' }}><div><div style={{ fontSize:'0.85rem',fontWeight:600 }}>{t.title.slice(0,65)}...</div><div style={{ fontSize:'0.7rem',color:'var(--text3)' }}>{t.bacteria||''} · {t.estimatedCost?.total||'N/A'}</div></div><span className="bdg bdg-pcr">PCR</span></div>))}
                <div style={{ marginTop:'1.5rem' }}><div className="sl">Gel Fairness Allocation</div><div className="gel"><p style={{ fontSize:'0.8rem',color:'var(--text2)',lineHeight:1.65 }}>When students share gel trays, rotate ladder-adjacent positions across runs so every student gets at least one high-resolution lane.</p><div className="gel-layout"><div><span style={{ color:'var(--pri)',fontWeight:600 }}>Run 1:</span> [L] [NC] [<b>S1</b>] [<b>S2</b>] [S3] [S4] ... [PC]</div><div><span style={{ color:'var(--pri)',fontWeight:600 }}>Run 2:</span> [L] [NC] [<b>S3</b>] [<b>S4</b>] [S1] [S2] ... [PC]</div></div><div className="gel-tip">L = Ladder · NC = Neg Control · PC = Pos Control · <b>Bold</b> = priority lanes</div></div></div>
                <Callout color="sage" title="Gel Layout Optimizer" text={`${mol.length} molecular project${mol.length>1?'s':''} × ~13 samples/gel = ${Math.ceil((mol.length*13)/13)} gel(s) minimum.`} /></>)}
              {phen.length > 0 && (<div style={{ marginTop:mol.length>0?'2rem':0 }}><div className="sl">Phenotypic Projects ({phen.length})</div>{phen.map((t,i) => (<div key={i} style={{ padding:'0.7rem 0',borderBottom:'1px solid var(--input)',display:'flex',justifyContent:'space-between' }}><div><div style={{ fontSize:'0.85rem',fontWeight:600 }}>{t.title.slice(0,65)}...</div><div style={{ fontSize:'0.7rem',color:'var(--text3)' }}>{t.bacteria||''}</div></div><span className="bdg bdg-b">Culture</span></div>))}</div>)}
              <Callout color="amb" title="Cost-Saving Tips" text="Share master mix across projects. Pool primers for common targets. Batch sequencing submissions." />
            </>);
          })()}
        </>)}

        {/* ═══ TOPIC DETAIL MODAL ═══ */}
        {modalTopic && (
          <div className="mo-bg" onClick={closeModal}><div className="mo" onClick={e => e.stopPropagation()}>
            <div className="mo-top"><div><div className="mt-t">{modalTopic.title}</div>{modalTopic.layman && <div className="mt-l">{modalTopic.layman}</div>}</div>
              <div style={{ display:'flex',gap:'0.3rem',alignItems:'flex-start',flexShrink:0 }}><div className="mo-nav"><button onClick={() => navModal(-1)} disabled={modalIdx===0}><ArrowLeft size={12} /></button><button onClick={() => navModal(1)} disabled={modalIdx===modalList.length-1}><ArrowRight size={12} /></button></div><div className="mo-x" onClick={closeModal}>✕</div></div></div>
            <div className="mo-acts">
              {modalSource === 'results' && <><button className="ab p" onClick={() => {approveTopic(modalIdx);closeModal();}}><Star size={12} /> Approve</button><button className="ab" onClick={() => regenerateTopic(modalIdx)} disabled={regeneratingIdx!==null}><RefreshCw size={12} className={regeneratingIdx===modalIdx?'spin':''} /> {regeneratingIdx===modalIdx?'Regenerating...':'Regenerate'}</button></>}
              <button className="ab" onClick={() => checkUniqueness(modalIdx,modalSource==='approved')} disabled={checkingUniq!==null}><Search size={12} /> Uniqueness</button>
              <button className="ab" onClick={() => generateProposal(modalTopic)} disabled={genProposal!==null}><FileText size={12} /> Proposal</button>
              <button className="ab" onClick={() => copyTopic(modalTopic)}><Copy size={12} /> Copy</button>
              {modalSource === 'approved' && <button className="ab d" onClick={() => {removeApproved(modalIdx);closeModal();}} style={{ marginLeft:'auto' }}><Trash2 size={12} /> Remove</button>}
              {modalTopic.uniquenessCheck && <span className="uniq-b" style={{ marginLeft:'auto' }}>{modalTopic.uniquenessCheck.score}/10</span>}
            </div>
            <div className="mo-body">
              {modalTopic.background && <div className="sc"><div className="sc-t">Background</div><p>{modalTopic.background}</p></div>}
              {modalTopic.objectives.length > 0 && <div className="sc"><div className="sc-t">Objectives</div>{modalTopic.objectives.map((o,i) => <div key={i} className="obj"><span className="obj-n">{i+1}</span>{o}</div>)}</div>}
              {modalTopic.methodology && <div className="sc"><div className="sc-t">Methodology</div><p>{modalTopic.methodology}</p></div>}
              {(modalTopic.sampleSource||modalTopic.sampleType||modalTopic.sampleSize) && <div className="sc" style={{ padding:0 }}><div className="sam-r">{modalTopic.sampleSource && <div className="sam-c"><div className="sam-l">Source</div><div className="sam-v">{modalTopic.sampleSource}</div></div>}{modalTopic.sampleType && <div className="sam-c"><div className="sam-l">Sample Type</div><div className="sam-v">{modalTopic.sampleType}</div></div>}{modalTopic.sampleSize && <div className="sam-c"><div className="sam-l">Sample Size</div><div className="sam-v" style={{ fontFamily:'var(--mono)',fontSize:'0.72rem' }}>{modalTopic.sampleSize}</div></div>}</div></div>}
              {(modalTopic.materials.length>0||modalTopic.equipment.length>0) && <div className="col"><div className="col-h" onClick={() => toggleCollapse('mat')}><div className="sc-t">Materials & Equipment</div><span className="arr">{collapsed.mat?'▶':'▼'}</span></div>{!collapsed.mat && <div className="col-b"><div className="me-g">{modalTopic.materials.length>0 && <div className="me-b mat"><div className="me-bt">Materials</div><ul>{modalTopic.materials.map((m,i) => <li key={i}>{m}</li>)}</ul></div>}{modalTopic.equipment.length>0 && <div className="me-b equ"><div className="me-bt">Equipment</div><ul>{modalTopic.equipment.map((e,i) => <li key={i}>{e}</li>)}</ul></div>}</div></div>}</div>}
              {modalTopic.estimatedCost.breakdown.length>0 && <div className="col"><div className="col-h" onClick={() => toggleCollapse('cost')}><div className="sc-t">Cost Breakdown — {modalTopic.estimatedCost.total||'N/A'}</div><span>{collapsed.cost?'▶':'▼'}</span></div>{!collapsed.cost && <div className="col-b">{modalTopic.estimatedCost.breakdown.map((item,i) => <div key={i} className="cr"><span className="cl">{item.item}</span><span className="cv">{item.cost}</span></div>)}<div className="ct"><span>Total</span><span>{modalTopic.estimatedCost.total}</span></div></div>}</div>}
              {modalTopic.statisticalAnalysis && <div className="col"><div className="col-h" onClick={() => toggleCollapse('stats')}><div className="sc-t">Statistical Analysis</div><span>{collapsed.stats?'▶':'▼'}</span></div>{!collapsed.stats && <div className="col-b"><p>Design: {modalTopic.statisticalAnalysis.studyDesign} · Software: {modalTopic.statisticalAnalysis.software}</p>{modalTopic.statisticalAnalysis.sampleSizeCalculation && <p style={{ fontFamily:'var(--mono)',fontSize:'0.72rem',marginTop:'0.3rem' }}>{modalTopic.statisticalAnalysis.sampleSizeCalculation}</p>}{modalTopic.statisticalAnalysis.tests?.length>0 && <p style={{ marginTop:'0.2rem' }}>Tests: {modalTopic.statisticalAnalysis.tests.join(' · ')}</p>}</div>}</div>}
              {modalTopic.abstractTemplate && <div className="col"><div className="col-h" onClick={() => toggleCollapse('abs')}><div className="sc-t">Abstract Template</div><span>{collapsed.abs?'▶':'▼'}</span></div>{!collapsed.abs && <div className="col-b"><p style={{ fontSize:'0.7rem',color:'var(--text3)',fontStyle:'italic',marginBottom:'0.5rem' }}>Fill in [___] blanks with your actual results.</p><div className="abs"><div className="abs-r"><div className="arl">Background</div><p>{modalTopic.abstractTemplate.background}</p></div><div className="abs-r"><div className="arl">Objective</div><p>{modalTopic.abstractTemplate.objective}</p></div><div className="abs-r"><div className="arl">Methods</div><p>{modalTopic.abstractTemplate.methods}</p></div><div className="abs-r fill"><div className="arl">Results — fill in your data</div><p>{modalTopic.abstractTemplate.resultsTemplate}</p></div><div className="abs-r fill"><div className="arl">Conclusion — fill in your findings</div><p>{modalTopic.abstractTemplate.conclusionTemplate}</p></div>{modalTopic.abstractTemplate.formatNotes && <div className="abs-r note"><div className="arl">Format Notes</div><p>{modalTopic.abstractTemplate.formatNotes}</p></div>}</div></div>}</div>}
              {(modalTopic.ethicalConsiderations||modalTopic.supervisorNotes) && <div className="sc" style={{ padding:0 }}><div className="np">{modalTopic.ethicalConsiderations && <div className="np-b"><div className="sc-t" style={{ color:'var(--red)' }}>Ethical Considerations</div><p style={{ fontSize:'0.8rem',color:'var(--text2)',lineHeight:1.6 }}>{modalTopic.ethicalConsiderations}</p></div>}{modalTopic.supervisorNotes && <div className="np-b"><div className="sc-t">Supervisor Notes</div><p style={{ fontSize:'0.8rem',color:'var(--text2)',lineHeight:1.6 }}>{modalTopic.supervisorNotes}</p></div>}</div></div>}
              {modalTopic.uniquenessCheck && <div className="sc"><Callout color="sage" title={`Uniqueness: ${modalTopic.uniquenessCheck.score}/10`} text={`${modalTopic.uniquenessCheck.reason}${modalTopic.uniquenessCheck.suggestions ? `\n\n${modalTopic.uniquenessCheck.suggestions}` : ''}`} /></div>}
            </div>
          </div></div>
        )}

        {/* Proposal Modal */}
        {proposalModal && (<div className="pm-bg" onClick={() => setProposalModal(null)}><div className="pm" onClick={e => e.stopPropagation()}><div className="pm-h"><h3>Research Proposal</h3><div className="mo-x" onClick={() => setProposalModal(null)}>✕</div></div><div className="pm-body">{proposalModal.content}</div><div className="pm-ft"><button onClick={() => {navigator.clipboard.writeText(proposalModal.content);addToast('Copied');}} className="ab p"><Copy size={12} /> Copy</button><button onClick={() => setProposalModal(null)} className="ab">Close</button></div></div></div>)}

        {toasts.length > 0 && <div className="toast-c">{toasts.map(t => <div key={t.id} className={`toast ${t.type}`}>{t.type==='ok'?<Check size={14}/>:null}{t.msg}</div>)}</div>}
      </main>
    </div>
  );
}
