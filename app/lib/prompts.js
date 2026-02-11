// Shared constants and prompt builders for the Research Topic Generator

export const FOCUS_AREAS = [
  { id: 'plant', label: 'Plant-Based Antimicrobials', context: 'Phytochemicals, essential oils, traditional medicine validation, MIC/MBC studies, synergy with conventional antibiotics' },
  { id: 'amr', label: 'Antimicrobial Resistance', context: 'Resistance patterns, ESBL, MRSA, carbapenem resistance, plasmid-mediated resistance, biofilm formation' },
  { id: 'food', label: 'Food & Environmental', context: 'Food safety, street food contamination, water microbiology, food handlers, market samples' },
  { id: 'clinical', label: 'Clinical Isolates', context: 'Hospital-acquired infections, wound infections, UTIs, bloodstream infections, surgical site infections' },
];

export const BACTERIA_OPTIONS = [
  { id: 'staph', name: 'Staphylococcus aureus', common: 'Staph aureus', includes: 'MRSA, MSSA, CoNS', anaerobe: false },
  { id: 'ecoli', name: 'Escherichia coli', common: 'E. coli', includes: 'ESBL-producing, uropathogenic', anaerobe: false },
  { id: 'kleb', name: 'Klebsiella pneumoniae', common: 'Klebsiella', includes: 'Carbapenem-resistant (CRKP)', anaerobe: false },
  { id: 'pseudo', name: 'Pseudomonas aeruginosa', common: 'Pseudomonas', includes: 'MDR strains, biofilm', anaerobe: false },
  { id: 'entero', name: 'Enterococcus species', common: 'Enterococcus', includes: 'VRE, E. faecalis, E. faecium', anaerobe: false },
  { id: 'acineto', name: 'Acinetobacter baumannii', common: 'Acinetobacter', includes: 'Pandrug-resistant strains', anaerobe: false },
  { id: 'proteus', name: 'Proteus mirabilis', common: 'Proteus', includes: 'Urease producers, catheter infections', anaerobe: false },
  { id: 'salm', name: 'Salmonella species', common: 'Salmonella', includes: 'S. typhi, S. typhimurium', anaerobe: false },
  { id: 'strep', name: 'Streptococcus species', common: 'Streptococcus', includes: 'S. pyogenes, S. pneumoniae, Group B', anaerobe: false },
  { id: 'candida', name: 'Candida species', common: 'Candida', includes: 'C. albicans, C. auris, C. glabrata', anaerobe: false },
  { id: 'clostridium', name: 'Clostridium species', common: 'Clostridium', includes: 'C. perfringens, C. difficile', anaerobe: true },
  { id: 'bacteroides', name: 'Bacteroides fragilis', common: 'Bacteroides', includes: 'Intra-abdominal isolates', anaerobe: true },
  { id: 'prevotella', name: 'Prevotella species', common: 'Prevotella', includes: 'Oral/respiratory infections', anaerobe: true },
  { id: 'peptostrep', name: 'Peptostreptococcus', common: 'Peptostrep', includes: 'Wound/abscess isolates', anaerobe: true },
  { id: 'fuso', name: 'Fusobacterium species', common: 'Fusobacterium', includes: 'F. nucleatum, F. necrophorum', anaerobe: true },
];

export const DEMOGRAPHIC_OPTIONS = [
  { id: 'general', label: 'General Population' },
  { id: 'pediatric', label: 'Pediatric' },
  { id: 'maternal', label: 'Maternal' },
  { id: 'elderly', label: 'Elderly' },
  { id: 'immunocomp', label: 'Immunocompromised' },
  { id: 'neonatal', label: 'Neonatal' },
];

export const RESOURCE_LEVELS = [
  { id: 'basic', label: 'Basic Lab', description: 'Culture, Gram stain, biochemical tests' },
  { id: 'intermediate', label: 'Well-Equipped', description: 'PCR, spectrophotometer, ELISA' },
  { id: 'advanced', label: 'Advanced', description: 'Sequencing, mass spec' },
];

export function buildGeneratePrompt({ selectedAreas, selectedBacteria, selectedDemographic, resourceLevel, numTopics, maxBudget, customNotes, customFocusArea, customBacteria, existingTitles = [] }) {
  const areas = selectedAreas
    .map(id => FOCUS_AREAS.find(a => a.id === id))
    .filter(Boolean)
    .map(a => `${a.label}: ${a.context}`)
    .join('\n');

  const bacteria = selectedBacteria.length > 0
    ? `\nBACTERIA FOCUS:\n${selectedBacteria.map(id => {
        const b = BACTERIA_OPTIONS.find(x => x.id === id);
        return b ? `- ${b.name} (${b.common})${b.anaerobe ? ' [ANAEROBE]' : ''}` : '';
      }).filter(Boolean).join('\n')}`
    : '';

  const demo = DEMOGRAPHIC_OPTIONS.find(d => d.id === selectedDemographic);
  const res = RESOURCE_LEVELS.find(r => r.id === resourceLevel);
  const existing = existingTitles.length > 0
    ? `\n\nALREADY GENERATED (do NOT repeat):\n${existingTitles.map(t => `- ${t}`).join('\n')}`
    : '';

  const budgetConstraint = maxBudget && maxBudget !== 'any'
    ? `\n\nBUDGET CONSTRAINT: Total project cost must be under ₦${parseInt(maxBudget).toLocaleString()}. If budget is tight, favor phenotypic methods over molecular. Suggest cost-effective alternatives.`
    : '';

  const customAreaText = customFocusArea ? `\n\nADDITIONAL FOCUS AREA from professor: ${customFocusArea}` : '';
  const customBacteriaText = customBacteria ? `\nADDITIONAL BACTERIA requested: ${customBacteria}` : '';

  return `You are helping a medical microbiology professor at a Nigerian university generate EXPERIMENTAL research topics for students.

LOCATION: Lagos, Nigeria
TIMELINE: January-August (8 months max)
DEMOGRAPHIC: ${demo?.label || 'General Population'}
RESOURCE LEVEL: ${res?.label || 'Basic Lab'} — ${res?.description || ''}

FOCUS AREAS:
${areas}${customAreaText}
${bacteria}${customBacteriaText}
${budgetConstraint}

${customNotes ? `PROFESSOR'S NOTES: ${customNotes}` : ''}
${existing}

Generate exactly ${numTopics} EXPERIMENTAL research topics. Each must:
- Be feasible in Lagos with available resources
- Require hospital/clinic/community sample collection
- Be completable within one semester
- NOT use ICU samples (use outpatient clinics, general wards, community)
- Include realistic Nigerian Naira cost estimates

SAMPLE SIZE: Show formula, e.g., "Cochran's n = Z²pq/d² = (1.96)²(0.5)(0.5)/(0.05)² = 384 +10% = 423"

COST ESTIMATION (CRITICAL - Use realistic 2024/2025 Nigerian Naira prices):
All lab supplies in Nigeria are imported. Prices include import duties, shipping, and local markup. BE COMPREHENSIVE - list EVERY item needed.

Reference prices:
- Mueller Hinton Agar 500g: ₦85,000-120,000
- Nutrient Agar 500g: ₦45,000-70,000
- Blood Agar Base 500g: ₦90,000-130,000
- MacConkey Agar 500g: ₦55,000-80,000
- Antibiotic disc cartridges (50 discs): ₦25,000-40,000 each
- Petri dishes (pack of 20): ₦15,000-25,000
- Sterile swabs (pack of 100): ₦8,000-15,000
- Specimen containers (pack of 50): ₦10,000-18,000
- Gram stain kit: ₦15,000-25,000
- Crystal violet/safranin: ₦5,000-10,000 each
- Biochemical test kits (API 20E): ₦45,000-65,000
- PCR Master Mix (200 rxn): ₦180,000-250,000
- Gel electrophoresis supplies: ₦80,000-120,000
- DNA ladder: ₦35,000-50,000
- Primers (per pair): ₦15,000-25,000
- Ethanol (2.5L): ₦8,000-15,000
- Distilled water (5L): ₦3,000-5,000
- PPE (gloves box): ₦8,000-15,000
- Lab coat: ₦5,000-8,000
- Autoclave tape: ₦3,000-5,000

Typical total costs:
- Phenotypic-only project: ₦250,000-400,000
- Project with molecular: ₦500,000-800,000

Respond ONLY with valid JSON:
{
  "topics": [
    {
      "title": "Specific experimental research topic title",
      "description": "2-3 sentence description of experiment and expected outcomes",
      "background": "Brief scientific rationale for why this study matters",
      "objectives": ["Primary objective", "Secondary objective 1", "Secondary objective 2"],
      "methodology": "Step-by-step: sample collection → processing → analysis",
      "sampleSource": "Where samples will be collected (NOT ICU - use outpatient clinics, general wards, etc.)",
      "sampleType": "Type of clinical samples needed",
      "sampleSize": "Estimated sample size with statistical justification",
      "materials": ["material 1 with quantity", "material 2 with quantity"],
      "equipment": ["equipment 1", "equipment 2"],
      "estimatedCost": {
        "total": "₦X - ₦Y",
        "breakdown": [
          {"item": "Mueller Hinton Agar 500g x2", "cost": "₦170,000-240,000"},
          {"item": "Antibiotic discs (10 cartridges)", "cost": "₦250,000-400,000"}
        ],
        "costLevel": "low|medium|high",
        "hasMolecular": false
      },
      "statisticalAnalysis": {
        "studyDesign": "Cross-sectional / Case-control / Cohort",
        "sampleSizeCalculation": "Formula and justification",
        "variables": {"independent": ["var1", "var2"], "dependent": ["outcome1"]},
        "tests": ["Chi-square for categorical", "t-test for means"],
        "software": "SPSS / R",
        "significanceLevel": "p < 0.05"
      },
      "interviewRequired": true,
      "interviewQuestions": {
        "consentQuestions": ["Question 1?", "Question 2?"],
        "methodologyQuestions": ["Question 1?", "Question 2?"]
      },
      "ethicalConsiderations": "Key ethical issues",
      "keywords": ["keyword1", "keyword2"],
      "difficulty": "beginner|intermediate|advanced",
      "difficultyReason": "Why this level",
      "focusArea": "plant|amr|food|clinical",
      "bacteria": "Organism name if applicable",
      "estimatedDuration": "X months",
      "uniquenessScore": 8,
      "uniquenessReason": "What makes this novel",
      "similarStudies": "Known similar studies or none",
      "supervisorNotes": "Key things to watch"
    }
  ]
}

If no interview needed, set interviewRequired: false and interviewQuestions: null.`;
}

export function buildRegeneratePrompt({ currentTitle, focusArea, resourceLevel }) {
  const res = RESOURCE_LEVELS.find(r => r.id === resourceLevel);
  return `Generate ONE alternative experimental research topic for medical microbiology in Lagos, Nigeria.

Current topic to replace: "${currentTitle}"

Keep similar theme but make it DIFFERENT. Same constraints:
- Location: Lagos, Nigeria
- Timeline: January-August (8 months)
- Must be experimental requiring hospital samples
- Resource level: ${res?.label || 'Basic Lab'}
- Include realistic Nigerian Naira cost estimates using same pricing guidelines

Respond ONLY with valid JSON for ONE topic in the same format as the original generator (title, description, background, objectives, methodology, sampleSource, sampleType, sampleSize, materials, equipment, estimatedCost with breakdown, statisticalAnalysis, interviewRequired, interviewQuestions, ethicalConsiderations, keywords, difficulty, difficultyReason, focusArea as "${focusArea}", bacteria, estimatedDuration, uniquenessScore, uniquenessReason, similarStudies, supervisorNotes).`;
}

export function buildUniquenessPrompt(title) {
  return `Research this topic for existing similar studies:

"${title}"

Search for:
1. Similar studies published from Nigerian institutions
2. Related research in West Africa
3. How common this exact methodology is globally

Rate uniqueness 1-10 and explain. Respond ONLY with valid JSON:
{
  "score": 7,
  "reason": "Why this score",
  "similarStudies": ["Study 1 details", "Study 2 details"],
  "suggestions": "How to make it more unique"
}`;
}

export function buildProposalPrompt(topic) {
  return `Write a formal 2-page research proposal based on this topic:

Title: ${topic.title}
Description: ${topic.description}
Background: ${topic.background}
Objectives: ${JSON.stringify(topic.objectives)}
Methodology: ${topic.methodology}
Sample: ${topic.sampleType} from ${topic.sampleSource}, n=${topic.sampleSize}

Write a complete proposal with:
1. Title
2. Background/Introduction (with references format [Author, Year])
3. Problem Statement
4. Objectives (general + specific)
5. Methodology (detailed)
6. Ethical Considerations
7. Expected Outcomes
8. Timeline (Gantt-style monthly)
9. Budget Summary
10. References (at least 5 relevant, realistic citations)

Respond ONLY with valid JSON:
{
  "proposal": "Full formatted proposal text with headers and sections"
}`;
}
