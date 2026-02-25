export const EQUIPMENT_LIST = [
  { id: 'autoclave', name: 'Autoclave', hint: 'Sterilization', tier: 'basic' },
  { id: 'incubator', name: 'Incubator', hint: '37°C culture', tier: 'basic' },
  { id: 'microscope', name: 'Microscope', hint: 'Gram stain viewing', tier: 'basic' },
  { id: 'colony_counter', name: 'Colony Counter', hint: 'CFU counting', tier: 'basic' },
  { id: 'centrifuge', name: 'Centrifuge', hint: 'Sample separation', tier: 'basic' },
  { id: 'water_bath', name: 'Water Bath', hint: 'Temp-controlled reactions', tier: 'basic' },
  { id: 'ph_meter', name: 'pH Meter', hint: 'Media preparation', tier: 'basic' },
  { id: 'pcr', name: 'PCR Thermocycler', hint: 'DNA amplification', tier: 'equipped' },
  { id: 'gel_electrophoresis', name: 'Gel Electrophoresis', hint: 'DNA separation', tier: 'equipped' },
  { id: 'spectrophotometer', name: 'Spectrophotometer', hint: 'OD readings, MIC', tier: 'equipped' },
  { id: 'elisa_reader', name: 'ELISA Reader', hint: 'Immunoassays', tier: 'equipped' },
  { id: 'biosafety_cabinet', name: 'Biosafety Cabinet', hint: 'Pathogen safety', tier: 'equipped' },
  { id: 'uv_transilluminator', name: 'UV Transilluminator', hint: 'Gel imaging', tier: 'equipped' },
  { id: 'dna_sequencer', name: 'DNA Sequencer', hint: '16S rRNA / WGS', tier: 'advanced' },
  { id: 'hplc', name: 'HPLC', hint: 'Compound analysis', tier: 'advanced' },
  { id: 'flow_cytometer', name: 'Flow Cytometer', hint: 'Cell analysis', tier: 'advanced' },
  { id: 'mass_spec', name: 'Mass Spectrometer', hint: 'MALDI-TOF', tier: 'advanced' },
];

export const FOCUS_AREAS = [
  { id: 'plant', label: 'Plant-Based Antimicrobials', context: 'Phytochemicals, essential oils, traditional medicine validation, MIC/MBC studies, synergy with conventional antibiotics' },
  { id: 'amr', label: 'Antimicrobial Resistance', context: 'Resistance patterns, ESBL, MRSA, carbapenem resistance, plasmid-mediated resistance, biofilm formation' },
  { id: 'food', label: 'Food & Environmental', context: 'Food safety, street food contamination, water microbiology, food handlers, market samples' },
  { id: 'clinical', label: 'Clinical Isolates', context: 'Hospital-acquired infections, wound infections, UTIs, bloodstream infections, surgical site infections' },
];

export const BACTERIA_OPTIONS = [
  { id: 'ecoli', name: 'Escherichia coli', common: 'E. coli', anaerobe: false },
  { id: 'saureus', name: 'Staphylococcus aureus', common: 'S. aureus', anaerobe: false },
  { id: 'kpneum', name: 'Klebsiella pneumoniae', common: 'K. pneumoniae', anaerobe: false },
  { id: 'paerug', name: 'Pseudomonas aeruginosa', common: 'P. aeruginosa', anaerobe: false },
  { id: 'senterica', name: 'Salmonella enterica', common: 'Salmonella', anaerobe: false },
  { id: 'spyog', name: 'Streptococcus pyogenes', common: 'S. pyogenes', anaerobe: false },
  { id: 'efaecalis', name: 'Enterococcus faecalis', common: 'E. faecalis', anaerobe: false },
  { id: 'abaum', name: 'Acinetobacter baumannii', common: 'A. baumannii', anaerobe: false },
  { id: 'spneum', name: 'Streptococcus pneumoniae', common: 'S. pneumoniae', anaerobe: false },
  { id: 'cdiff', name: 'Clostridioides difficile', common: 'C. difficile', anaerobe: true },
  { id: 'bfragilis', name: 'Bacteroides fragilis', common: 'B. fragilis', anaerobe: true },
  { id: 'cperf', name: 'Clostridium perfringens', common: 'C. perfringens', anaerobe: true },
  { id: 'pgingivalis', name: 'Porphyromonas gingivalis', common: 'P. gingivalis', anaerobe: true },
  { id: 'facnes', name: 'Cutibacterium acnes', common: 'C. acnes', anaerobe: true },
  { id: 'prevotella', name: 'Prevotella species', common: 'Prevotella spp.', anaerobe: true },
];

export function buildSingleTopicPrompt({ selectedAreas, selectedBacteria, selectedDemographic, equipment, timeline, maxBudget, customNotes, customFocusArea, customBacteria, existingTitles = [] }) {
  const areas = (selectedAreas || []).map(id => FOCUS_AREAS.find(a => a.id === id)?.label).filter(Boolean).join(', ');
  const bacteria = (selectedBacteria || []).length > 0 ? (selectedBacteria || []).map(id => BACTERIA_OPTIONS.find(x => x.id === id)?.common).filter(Boolean).join(', ') : '';
  const equip = (equipment || []).map(id => EQUIPMENT_LIST.find(e => e.id === id)?.name).filter(Boolean).join(', ');
  const existing = (existingTitles || []).length > 0 ? `\nDO NOT REPEAT: ${existingTitles.join(' | ')}` : '';
  const budget = maxBudget && maxBudget !== 'any' ? ` Budget under ₦${parseInt(maxBudget).toLocaleString()}.` : '';

  return `Generate 1 EXPERIMENTAL microbiology research topic for a Nigerian university student in Lagos.${budget}
Timeline: ${timeline || '8'} months. Demographic: ${selectedDemographic || 'General'}.
Focus: ${areas}${customFocusArea ? ', ' + customFocusArea : ''}
${bacteria ? 'Bacteria: ' + bacteria + (customBacteria ? ', ' + customBacteria : '') : ''}
Equipment ONLY: ${equip || 'Basic lab'}
${customNotes ? 'Notes: ' + customNotes : ''}${existing}

Rules: Experimental only. Feasible in Lagos. No ICU samples. Nigerian Naira costs.
Naira refs: MHA 500g ₦85-120K, Nutrient Agar ₦45-70K, Antibiotic discs(50) ₦25-40K, Petri(20) ₦15-25K, Swabs(100) ₦8-15K, PCR Master Mix ₦180-250K, Gel kit ₦80-120K, DNA ladder ₦35-50K.

"layman" field: Write in Nigerian English connecting science to daily life. E.g. "Testing whether bitter leaf — the vegetable in egusi soup — can kill bacteria that antibiotics no longer work on." NOT generic science language.

"abstractTemplate": Include background (filled), objective (filled), methods (filled), resultsTemplate (with [___] blanks for student data), conclusionTemplate (with [___] blanks), formatNotes.

If hasMolecular: include "gelSharing" with studentsPerGel, laneLayout, fairnessTip. If not: gelSharing=null.

Respond ONLY with valid JSON (no markdown):
{"topics":[{"title":"...","description":"...","background":"...","objectives":["..."],"methodology":"...","sampleSource":"...","sampleType":"...","sampleSize":"...with formula","materials":["..."],"equipment":["..."],"estimatedCost":{"total":"₦X–₦Y","breakdown":[{"item":"...","cost":"₦X"}],"costLevel":"low|medium|high","hasMolecular":false},"gelSharing":null,"statisticalAnalysis":{"studyDesign":"...","sampleSizeCalculation":"...","variables":{"independent":["..."],"dependent":["..."]},"tests":["..."],"software":"...","significanceLevel":"p<0.05"},"interviewRequired":false,"interviewQuestions":null,"ethicalConsiderations":"...","keywords":["..."],"difficulty":"beginner|intermediate|advanced","difficultyReason":"...","focusArea":"plant|amr|food|clinical","bacteria":"...","estimatedDuration":"...","uniquenessScore":8,"uniquenessReason":"...","layman":"Nigerian English explanation","similarStudies":"...","supervisorNotes":"...","abstractTemplate":{"background":"...","objective":"...","methods":"...","resultsTemplate":"Of the [___] samples, [___]% tested positive...","conclusionTemplate":"This study [confirms/reveals] that [___]...","formatNotes":"..."}}]}`;
}

export function buildGeneratePrompt({ selectedAreas, selectedBacteria, selectedDemographic, equipment, timeline, numTopics, maxBudget, customNotes, customFocusArea, customBacteria, existingTitles = [] }) {
  const areas = selectedAreas.map(id => FOCUS_AREAS.find(a => a.id === id)).filter(Boolean).map(a => `${a.label}: ${a.context}`).join('\n');
  const bacteria = selectedBacteria?.length > 0 ? `\nBACTERIA FOCUS:\n${selectedBacteria.map(id => { const b = BACTERIA_OPTIONS.find(x => x.id === id); return b ? `- ${b.name} (${b.common})${b.anaerobe ? ' [ANAEROBE]' : ''}` : ''; }).filter(Boolean).join('\n')}` : '';
  const equipNames = equipment?.length > 0 ? equipment.map(id => EQUIPMENT_LIST.find(e => e.id === id)?.name).filter(Boolean) : [];
  const equipStr = equipNames.length > 0 ? `\nAVAILABLE EQUIPMENT:\n${equipNames.map(e => `- ${e}`).join('\n')}\nONLY design experiments using this equipment. If PCR Thermocycler is not listed, do NOT include PCR-based methods.` : '';
  const existing = existingTitles.length > 0 ? `\nALREADY GENERATED (do NOT repeat):\n${existingTitles.map(t => `- ${t}`).join('\n')}` : '';
  const budgetConstraint = maxBudget && maxBudget !== 'any' ? `\nBUDGET CONSTRAINT: Total must be under ₦${parseInt(maxBudget).toLocaleString()}. Favor phenotypic over molecular if tight.` : '';
  const customAreaText = customFocusArea ? `\nADDITIONAL FOCUS: ${customFocusArea}` : '';
  const customBacteriaText = customBacteria ? `\nADDITIONAL BACTERIA: ${customBacteria}` : '';

  return `You are helping a medical microbiology professor at a Nigerian university generate EXPERIMENTAL research topics for students.

LOCATION: Lagos, Nigeria
TIMELINE: ${timeline || '8'} months
DEMOGRAPHIC: ${selectedDemographic || 'General Population'}
${equipStr}

FOCUS AREAS:
${areas}${customAreaText}
${bacteria}${customBacteriaText}
${budgetConstraint}

${customNotes ? `PROFESSOR'S NOTES: ${customNotes}` : ''}
${existing}

Generate exactly ${numTopics} EXPERIMENTAL research topics. Each must:
- Be feasible in Lagos with the listed equipment ONLY
- Require hospital/clinic/community sample collection
- Be completable within ${timeline || '8'} months
- NOT use ICU samples (use outpatient clinics, general wards, community)
- Include realistic Nigerian Naira cost estimates

SAMPLE SIZE: Show formula, e.g., "Cochran's n = Z²pq/d² = (1.96)²(0.5)(0.5)/(0.05)² = 384 +10% = 423"

COST ESTIMATION (CRITICAL - realistic 2024/2025 Nigerian Naira):
Reference prices: Mueller Hinton Agar 500g: ₦85K-120K · Nutrient Agar 500g: ₦45K-70K · Blood Agar Base 500g: ₦90K-130K · MacConkey Agar 500g: ₦55K-80K · Antibiotic disc cartridges (50): ₦25K-40K · Petri dishes (20): ₦15K-25K · Sterile swabs (100): ₦8K-15K · Specimen containers (50): ₦10K-18K · Gram stain kit: ₦15K-25K · API 20E: ₦45K-65K · PCR Master Mix (200 rxn): ₦180K-250K · Gel electrophoresis: ₦80K-120K · DNA ladder: ₦35K-50K · Primers (pair): ₦15K-25K · PPE gloves box: ₦8K-15K
Typical: Phenotypic ₦250K-400K · Molecular ₦500K-800K

GEL SHARING (if molecular): When hasMolecular is true, include a "gelSharing" field with how many students can share a single gel tray, optimal lane positions relative to the DNA ladder, and tips for fair allocation so no student's results are disadvantaged by lane placement.

LAYMAN EXPLANATION (CRITICAL): The "layman" field must be written in culturally grounded Nigerian English that connects the science to everyday Nigerian life. Do NOT write generic science summaries. Reference Nigerian foods, markets, traditions, local context, or daily realities. Examples:
- GOOD: "Testing whether bitter leaf — the vegetable your mama puts in egusi soup — can kill dangerous bacteria that antibiotics no longer work on. Wound samples from Lagos hospitals."
- GOOD: "Checking if the suya spots in Yaba are safe — testing the meat for bacteria that cause food poisoning, and whether the spices actually help kill germs."  
- GOOD: "Finding out which antibiotics still work against the bacteria causing UTIs in Lagos women, so doctors stop prescribing ones that don't work anymore."
- BAD: "Investigating the antimicrobial properties of plant extracts against resistant organisms." (too generic, no Nigerian grounding)
- BAD: "Testing a traditional plant for antibacterial activity." (could be anywhere in the world)
The layman field should make a student's mother or a market trader understand what her child is researching and why it matters for Nigeria.

ABSTRACT TEMPLATE (CRITICAL): Each topic MUST include an "abstractTemplate" field. This is a structured starting point that teaches the student how to write their research abstract. It should follow this format and fill in the topic-specific content, leaving blanks [___] where the student fills in their own results. The template teaches by example — showing the student the correct academic structure while making it impossible to plagiarize since they must insert their own findings. Include these sections:
- "background": 1-2 sentences setting up why this matters (filled in)
- "objective": The aim statement using proper academic phrasing (filled in)  
- "methods": Brief methodology summary (filled in based on the topic)
- "resultsTemplate": A sentence with blanks for the student to fill in, e.g. "Of the [___] samples collected, [___]% tested positive for [organism]. The highest resistance was observed against [___] ([___]%), while [___] showed the highest sensitivity ([___]%)."
- "conclusionTemplate": A sentence with blanks, e.g. "This study [confirms/reveals] that [___]. Based on these findings, [___] is recommended for [___]."
- "formatNotes": Brief tips like "Keep abstract under 300 words. State your sample size and statistical test used. Always include p-values."

Respond ONLY with valid JSON:
{
  "topics": [
    {
      "title": "Specific experimental title",
      "description": "2-3 sentences",
      "background": "Scientific rationale",
      "objectives": ["Primary", "Secondary 1", "Secondary 2"],
      "methodology": "Step-by-step: collection → processing → analysis",
      "sampleSource": "Where (NOT ICU)",
      "sampleType": "Type of samples",
      "sampleSize": "Size with statistical justification",
      "materials": ["material 1 with qty", "material 2"],
      "equipment": ["equip 1", "equip 2"],
      "estimatedCost": {
        "total": "₦X – ₦Y",
        "breakdown": [{"item": "name", "cost": "₦X–₦Y"}],
        "costLevel": "low|medium|high",
        "hasMolecular": false
      },
      "gelSharing": {
        "studentsPerGel": 4,
        "laneLayout": "L | NC | S1 | S2 | S3 | S4 | S5 | S6 | ...",
        "fairnessTip": "Rotate ladder-adjacent positions between students across runs. Students in lanes 2-4 get best resolution — alternate who gets these positions."
      },
      "statisticalAnalysis": {
        "studyDesign": "Cross-sectional / Case-control",
        "sampleSizeCalculation": "Formula",
        "variables": {"independent": ["v1"], "dependent": ["v2"]},
        "tests": ["Chi-square", "t-test"],
        "software": "SPSS / R",
        "significanceLevel": "p < 0.05"
      },
      "interviewRequired": true,
      "interviewQuestions": { "consentQuestions": ["Q1"], "methodologyQuestions": ["Q1"] },
      "ethicalConsiderations": "Key issues",
      "keywords": ["kw1", "kw2"],
      "difficulty": "beginner|intermediate|advanced",
      "difficultyReason": "Why",
      "focusArea": "plant|amr|food|clinical",
      "bacteria": "Organism if applicable",
      "estimatedDuration": "X months",
      "uniquenessScore": 8,
      "uniquenessReason": "What makes it novel",
      "layman": "Culturally grounded Nigerian plain-English explanation (see LAYMAN EXPLANATION instructions above)",
      "similarStudies": "Known similar or none",
      "supervisorNotes": "Key things to watch",
      "abstractTemplate": {
        "background": "Filled background sentence(s) specific to this topic",
        "objective": "Filled aim statement in proper academic phrasing",
        "methods": "Filled brief methodology summary",
        "resultsTemplate": "Sentence with [___] blanks for student to fill with their actual results",
        "conclusionTemplate": "Sentence with [___] blanks for student to fill with their conclusions",
        "formatNotes": "Tips on abstract length, what to include, common mistakes"
      }
    }
  ]
}
If no interview needed, set interviewRequired: false and interviewQuestions: null.
If hasMolecular is false, set gelSharing to null.`;
}

export function buildRegeneratePrompt({ currentTitle, focusArea, equipment, timeline }) {
  const equipNames = equipment?.map(id => EQUIPMENT_LIST.find(e => e.id === id)?.name).filter(Boolean) || [];
  return `Generate ONE alternative experimental research topic for medical microbiology in Lagos, Nigeria.
Replace: "${currentTitle}"
Keep similar theme but DIFFERENT. Timeline: ${timeline || 8} months.
Available equipment: ${equipNames.join(', ') || 'Basic lab only'}.
Include Nigerian Naira cost estimates.

LAYMAN FIELD: Write in culturally grounded Nigerian English that connects science to everyday Nigerian life. Reference Nigerian foods, markets, traditions, or daily realities. A student's mother or a market trader should understand what is being researched and why it matters. NOT generic science summaries.

ABSTRACT TEMPLATE: Include an "abstractTemplate" object with: "background" (filled), "objective" (filled), "methods" (filled), "resultsTemplate" (sentence with [___] blanks for student's own data), "conclusionTemplate" (sentence with [___] blanks), "formatNotes" (tips on length/structure).

If hasMolecular is true, include "gelSharing" with studentsPerGel, laneLayout, and fairnessTip for equitable lane allocation.
If hasMolecular is false, set gelSharing to null.

Respond ONLY with valid JSON for ONE topic (same full format as original generator).`;
}

export function buildUniquenessPrompt(title) {
  return `Research this topic for existing similar studies:
"${title}"
Search for: 1) Similar studies from Nigerian institutions 2) Related research in West Africa 3) How common this methodology is globally
Rate uniqueness 1-10. Respond ONLY with JSON:
{"score": 7, "reason": "Why", "similarStudies": ["Study 1"], "suggestions": "How to make it more unique"}`;
}

export function buildProposalPrompt(topic) {
  return `Write a formal 2-page research proposal:
Title: ${topic.title}
Description: ${topic.description}
Background: ${topic.background}
Objectives: ${JSON.stringify(topic.objectives)}
Methodology: ${topic.methodology}
Sample: ${topic.sampleType} from ${topic.sampleSource}, n=${topic.sampleSize}

Include: 1) Title 2) Background/Introduction with references 3) Problem Statement 4) Objectives 5) Methodology 6) Ethical Considerations 7) Expected Outcomes 8) Timeline (monthly) 9) Budget Summary 10) References (5+ realistic citations)
Respond ONLY with JSON: {"proposal": "Full formatted proposal text"}`;
}
