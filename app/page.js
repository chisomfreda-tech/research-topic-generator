'use client';

import React, { useState } from 'react';
import { FlaskConical, Beaker, BookOpen, DollarSign, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

// Sample topics with full data
const SAMPLE_TOPICS = [
  {
    title: "Antimicrobial activity of Vernonia amygdalina (bitter leaf) extracts against multi-drug resistant Staphylococcus aureus isolated from wound infections in Lagos hospitals",
    layman: "Testing whether bitter leaf - the vegetable used in egusi soup - can kill dangerous bacteria that antibiotics can no longer treat. Wound samples from Lagos hospitals.",
    budget: "₦185,000",
    budgetLevel: "low",
    uniqueness: 87,
    uniquenessNote: "Limited published data on V. amygdalina efficacy against MRSA from Nigerian clinical isolates. Novel population + local plant source.",
    materials: [
      { item: "Nutrient agar plates (x20)", cost: "₦35,000" },
      { item: "Mueller-Hinton agar", cost: "₦28,000" },
      { item: "Antibiotic sensitivity discs", cost: "₦22,000" },
      { item: "Fresh V. amygdalina leaves", cost: "₦2,000" },
      { item: "Ethanol (extraction solvent)", cost: "₦8,000" },
      { item: "Sterile swabs and tubes", cost: "₦15,000" },
      { item: "Incubator access (dept.)", cost: "₦0" },
      { item: "Miscellaneous consumables", cost: "₦25,000" },
    ],
    abstractStart: "This study investigates the antimicrobial potential of ethanolic and aqueous extracts of Vernonia amygdalina against multi-drug resistant S. aureus (MRSA) isolates obtained from wound infections at [hospital]. Using the agar well diffusion method with a sample size of n=...",
  },
  {
    title: "Prevalence and antibiotic susceptibility patterns of uropathogens among pregnant women attending antenatal clinics in Mushin LGA, Lagos",
    layman: "Finding out which bacteria cause urinary tract infections in pregnant women in Mushin, and which antibiotics still work against them. Important because untreated UTIs can cause complications.",
    budget: "₦210,000",
    budgetLevel: "medium",
    uniqueness: 72,
    uniquenessNote: "UTI studies exist but Mushin LGA is underrepresented. Antenatal population provides clinically relevant data for local prescribing guidelines.",
    materials: [
      { item: "CLED agar plates (x40)", cost: "₦48,000" },
      { item: "Blood agar plates (x20)", cost: "₦32,000" },
      { item: "Antibiotic sensitivity discs", cost: "₦22,000" },
      { item: "Sterile urine containers (x200)", cost: "₦30,000" },
      { item: "Gram staining reagents", cost: "₦12,000" },
      { item: "API identification strips", cost: "₦45,000" },
      { item: "Miscellaneous", cost: "₦21,000" },
    ],
    abstractStart: "This cross-sectional study examines the prevalence and antimicrobial susceptibility profiles of bacterial uropathogens among pregnant women attending antenatal care at primary health centers in Mushin Local Government Area. Using Cochrans formula (n = Z²pq/d²), a minimum sample size of...",
  },
  {
    title: "Comparative analysis of biofilm formation in Pseudomonas aeruginosa isolates from diabetic foot ulcers versus non-diabetic wound infections",
    layman: "Comparing how bacteria from diabetic patients wounds are different from regular wound bacteria. Diabetic wounds often do not heal because bacteria form protective shields.",
    budget: "₦280,000",
    budgetLevel: "medium",
    uniqueness: 91,
    uniquenessNote: "Biofilm studies in Nigerian diabetic populations are rare. Addresses a significant clinical problem with local relevance.",
    materials: [
      { item: "Crystal violet stain", cost: "₦15,000" },
      { item: "96-well microtiter plates (x10)", cost: "₦45,000" },
      { item: "Tryptic soy broth", cost: "₦28,000" },
      { item: "Spectrophotometer access", cost: "₦0" },
      { item: "Sterile swabs (x100)", cost: "₦20,000" },
      { item: "Transport media", cost: "₦35,000" },
      { item: "PBS buffer", cost: "₦12,000" },
      { item: "Miscellaneous consumables", cost: "₦25,000" },
    ],
    abstractStart: "Biofilm formation represents a critical virulence factor in chronic wound infections. This comparative study evaluates biofilm-forming capacity of P. aeruginosa isolates from diabetic foot ulcers (n=...) versus non-diabetic wound infections (n=...) using the microtiter plate assay...",
  },
];

const COLORS = {
  bg: "#0a0a0f",
  card: "#12121a",
  text: "#ede8df",
  muted: "#8a8691",
  accent: "#c45a5a",
  gold: "#c9a84c",
  green: "#3d8b7a",
  purple: "#7c5cbf",
};

export default function ResearchTopicGenerator() {
  const [budget, setBudget] = useState("");
  const [generated, setGenerated] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const generate = () => {
    setIsGenerating(true);
    // Simulate generation delay
    setTimeout(() => {
      const budgetNum = parseInt(budget.replace(/,/g, "")) || 300000;
      const filtered = SAMPLE_TOPICS.filter(t => 
        parseInt(t.budget.replace(/[₦,]/g, "")) <= budgetNum
      );
      setGenerated(filtered.length > 0 ? filtered : [SAMPLE_TOPICS[0]]);
      setIsGenerating(false);
    }, 800);
  };

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: COLORS.bg, 
      color: COLORS.text, 
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      padding: "2rem"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&family=Instrument+Serif:ital@0;1&display=swap');
        * { margin: 0; padding: 0; box-sizing: border-box; }
        input:focus { outline: none; border-color: ${COLORS.accent} !important; }
      `}</style>

      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "0.5rem",
            background: `${COLORS.accent}15`,
            padding: "0.5rem 1rem",
            borderRadius: "20px",
            marginBottom: "1rem"
          }}>
            <FlaskConical size={16} color={COLORS.accent} />
            <span style={{ fontSize: "0.75rem", letterSpacing: "0.1em", color: COLORS.accent }}>
              JOB WINGMAN
            </span>
          </div>
          <h1 style={{ 
            fontFamily: "'Instrument Serif', Georgia, serif", 
            fontSize: "2.5rem", 
            fontWeight: 400,
            marginBottom: "0.75rem"
          }}>
            Research Topic Generator
          </h1>
          <p style={{ color: COLORS.muted, fontSize: "1rem", maxWidth: "500px", margin: "0 auto" }}>
            Generate unique, budget-conscious microbiology research topics for Nigerian universities
          </p>
        </div>

        {/* Budget Input */}
        <div style={{ 
          background: COLORS.card, 
          border: "1px solid rgba(255,255,255,0.06)", 
          borderRadius: "12px", 
          padding: "1.5rem",
          marginBottom: "2rem"
        }}>
          <label style={{ 
            display: "block", 
            fontSize: "0.7rem", 
            letterSpacing: "0.15em", 
            color: COLORS.gold, 
            marginBottom: "0.75rem" 
          }}>
            MAXIMUM BUDGET
          </label>
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              background: "rgba(255,255,255,0.04)", 
              border: "1px solid rgba(255,255,255,0.1)", 
              borderRadius: "8px", 
              padding: "0 1rem",
              flex: "1 1 200px"
            }}>
              <span style={{ color: COLORS.muted, marginRight: "4px" }}>₦</span>
              <input
                type="text"
                value={budget}
                onChange={e => setBudget(e.target.value)}
                placeholder="300,000"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  padding: "0.85rem 0",
                  color: COLORS.text,
                  fontFamily: "inherit",
                  fontSize: "1rem"
                }}
              />
            </div>
            <button
              onClick={generate}
              disabled={isGenerating}
              style={{
                padding: "0.85rem 1.5rem",
                background: isGenerating ? "rgba(255,255,255,0.05)" : `${COLORS.accent}20`,
                border: `1px solid ${isGenerating ? "rgba(255,255,255,0.1)" : COLORS.accent}50`,
                borderRadius: "8px",
                color: isGenerating ? COLORS.muted : COLORS.accent,
                fontFamily: "inherit",
                fontSize: "0.9rem",
                cursor: isGenerating ? "wait" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "all 0.2s"
              }}
            >
              {isGenerating ? (
                <>Generating...</>
              ) : (
                <>
                  <Beaker size={16} />
                  Generate Topics
                </>
              )}
            </button>
          </div>
          <p style={{ fontSize: "0.8rem", color: COLORS.muted, marginTop: "0.75rem" }}>
            Topics will be scoped to materials available within your budget
          </p>
        </div>

        {/* Results */}
        {generated && (
          <div>
            <div style={{ 
              fontSize: "0.7rem", 
              letterSpacing: "0.15em", 
              color: COLORS.gold, 
              marginBottom: "1rem" 
            }}>
              {generated.length} TOPIC{generated.length !== 1 ? "S" : ""} GENERATED
            </div>

            {generated.map((topic, ti) => (
              <div
                key={ti}
                style={{
                  background: COLORS.card,
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: "12px",
                  marginBottom: "1rem",
                  overflow: "hidden"
                }}
              >
                {/* Topic Header */}
                <div
                  onClick={() => setExpanded(expanded === ti ? null : ti)}
                  style={{ padding: "1.25rem", cursor: "pointer" }}
                >
                  <div style={{ 
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "flex-start", 
                    gap: "1rem",
                    marginBottom: "0.75rem"
                  }}>
                    <p style={{ 
                      fontSize: "1rem", 
                      lineHeight: 1.5, 
                      fontWeight: 500,
                      flex: 1
                    }}>
                      {topic.title}
                    </p>
                    <div style={{ display: "flex", gap: "0.5rem", flexShrink: 0 }}>
                      <span style={{
                        fontSize: "0.7rem",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        background: topic.budgetLevel === "low" 
                          ? `${COLORS.green}20` 
                          : `${COLORS.gold}20`,
                        color: topic.budgetLevel === "low" ? COLORS.green : COLORS.gold
                      }}>
                        {topic.budget}
                      </span>
                      <span style={{
                        fontSize: "0.7rem",
                        padding: "4px 10px",
                        borderRadius: "4px",
                        background: topic.uniqueness > 80 
                          ? `${COLORS.purple}20` 
                          : "rgba(255,255,255,0.05)",
                        color: topic.uniqueness > 80 ? COLORS.purple : COLORS.muted
                      }}>
                        {topic.uniqueness}% unique
                      </span>
                    </div>
                  </div>
                  
                  <p style={{ 
                    fontSize: "0.9rem", 
                    color: COLORS.muted, 
                    lineHeight: 1.5,
                    fontStyle: "italic"
                  }}>
                    <strong style={{ color: COLORS.text, fontWeight: 500 }}>In plain language:</strong> {topic.layman}
                  </p>
                  
                  <div style={{ 
                    fontSize: "0.8rem", 
                    color: COLORS.gold, 
                    marginTop: "0.75rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    {expanded === ti ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    {expanded === ti ? "Less" : "See budget, materials, abstract..."}
                  </div>
                </div>

                {/* Expanded Content */}
                {expanded === ti && (
                  <div style={{ 
                    padding: "0 1.25rem 1.25rem", 
                    borderTop: "1px solid rgba(255,255,255,0.04)" 
                  }}>
                    {/* Uniqueness Analysis */}
                    <div style={{ marginTop: "1rem", marginBottom: "1.25rem" }}>
                      <div style={{ 
                        fontSize: "0.65rem", 
                        letterSpacing: "0.12em", 
                        color: COLORS.gold, 
                        marginBottom: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <Sparkles size={12} />
                        UNIQUENESS ANALYSIS
                      </div>
                      <div style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: "0.75rem", 
                        marginBottom: "0.5rem" 
                      }}>
                        <div style={{ 
                          flex: 1, 
                          height: 8, 
                          background: "rgba(255,255,255,0.06)", 
                          borderRadius: 4, 
                          overflow: "hidden" 
                        }}>
                          <div style={{ 
                            width: `${topic.uniqueness}%`, 
                            height: "100%", 
                            background: topic.uniqueness > 80 ? COLORS.purple : COLORS.gold, 
                            borderRadius: 4,
                            transition: "width 0.5s ease"
                          }} />
                        </div>
                        <span style={{ 
                          fontSize: "1rem", 
                          fontWeight: 600,
                          color: topic.uniqueness > 80 ? COLORS.purple : COLORS.gold
                        }}>
                          {topic.uniqueness}%
                        </span>
                      </div>
                      <p style={{ fontSize: "0.85rem", color: COLORS.muted, lineHeight: 1.5 }}>
                        {topic.uniquenessNote}
                      </p>
                    </div>

                    {/* Materials & Budget */}
                    <div style={{ marginBottom: "1.25rem" }}>
                      <div style={{ 
                        fontSize: "0.65rem", 
                        letterSpacing: "0.12em", 
                        color: COLORS.gold, 
                        marginBottom: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <DollarSign size={12} />
                        MATERIALS & BUDGET
                      </div>
                      {topic.materials.map((m, mi) => (
                        <div
                          key={mi}
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            padding: "0.5rem 0",
                            fontSize: "0.85rem",
                            borderBottom: "1px solid rgba(255,255,255,0.03)"
                          }}
                        >
                          <span style={{ color: COLORS.text }}>{m.item}</span>
                          <span style={{ color: COLORS.muted }}>{m.cost}</span>
                        </div>
                      ))}
                      <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "0.75rem 0 0.5rem",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        borderTop: "1px solid rgba(255,255,255,0.1)",
                        marginTop: "0.5rem"
                      }}>
                        <span>Total Estimated</span>
                        <span style={{ color: COLORS.gold }}>{topic.budget}</span>
                      </div>
                    </div>

                    {/* Abstract Scaffold */}
                    <div>
                      <div style={{ 
                        fontSize: "0.65rem", 
                        letterSpacing: "0.12em", 
                        color: COLORS.gold, 
                        marginBottom: "0.5rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px"
                      }}>
                        <BookOpen size={12} />
                        ABSTRACT SCAFFOLD
                      </div>
                      <div style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.06)",
                        borderRadius: "8px",
                        padding: "1rem"
                      }}>
                        <p style={{ 
                          fontSize: "0.85rem", 
                          color: COLORS.muted, 
                          lineHeight: 1.7,
                          fontStyle: "italic"
                        }}>
                          {topic.abstractStart}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Footer Note */}
            <p style={{ 
              fontSize: "0.75rem", 
              color: COLORS.muted, 
              textAlign: "center",
              marginTop: "1.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px"
            }}>
              <Sparkles size={12} />
              Demo with sample data — Full tool generates unlimited unique topics via Claude API
            </p>
          </div>
        )}

        {/* Empty State */}
        {!generated && (
          <div style={{ 
            textAlign: "center", 
            padding: "3rem",
            color: COLORS.muted
          }}>
            <FlaskConical size={48} style={{ opacity: 0.3, marginBottom: "1rem" }} />
            <p>Enter a budget and click Generate to see research topics</p>
          </div>
        )}
      </div>
    </div>
  );
}
