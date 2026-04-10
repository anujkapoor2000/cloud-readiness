import { useState } from 'react'
import { DOMAINS, calcDomainScore, calcOverallScore, ragLabel, ragColor } from './questions.js'

// ── Design tokens ──────────────────────────────────────────────
const T = {
  bg:      '#07111F',
  panel:   '#0D1E30',
  card:    '#112036',
  border:  'rgba(0,168,168,0.15)',
  teal:    '#00A8A8',
  tealLt:  '#00C5C5',
  navy:    '#0A1628',
  mid:     '#1E3A5F',
  ice:     '#E0F2F2',
  white:   '#FFFFFF',
  grey:    '#64748B',
  muted:   '#9BB8CC',
  amber:   '#F59E0B',
  green:   '#10B981',
  red:     '#EF4444',
}

// ── Small reusable components ───────────────────────────────────
function RadialGauge({ score, size = 120, color }) {
  const r = (size - 16) / 2
  const circ = 2 * Math.PI * r
  const fill = (score / 100) * circ
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.mid} strokeWidth={10} />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none"
        stroke={color} strokeWidth={10}
        strokeDasharray={`${fill} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease' }}
      />
    </svg>
  )
}

function RAGBadge({ score, large }) {
  const label = ragLabel(score)
  const color = ragColor(score)
  const fs = large ? 11 : 9
  const pad = large ? '5px 14px' : '3px 10px'
  return (
    <span style={{
      background: color + '20', color, border: `1px solid ${color}50`,
      fontSize: fs, fontWeight: 700, letterSpacing: 1,
      padding: pad, borderRadius: 12, textTransform: 'uppercase',
      fontFamily: "'DM Mono', monospace",
    }}>{label}</span>
  )
}

function ProgressBar({ value, color, animate }) {
  return (
    <div style={{ height: 6, background: T.mid, borderRadius: 3, overflow: 'hidden' }}>
      <div style={{
        height: '100%', width: `${value}%`, background: color,
        borderRadius: 3, transition: animate ? 'width 1.2s ease' : 'none',
      }} />
    </div>
  )
}

// ── STEP 0: Landing ─────────────────────────────────────────────
function Landing({ onStart, onClientChange, clientName }) {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '60px 32px', textAlign: 'center' }}>
      <div style={{ display: 'inline-block', background: T.teal, color: T.navy, fontWeight: 700, fontSize: 10, padding: '4px 14px', borderRadius: 3, letterSpacing: 1.5, marginBottom: 28 }}>
        NTT DATA · GUIDEWIRE PRACTICE
      </div>
      <h1 style={{
        fontFamily: "'DM Serif Display', Georgia, serif",
        fontSize: 'clamp(32px, 5vw, 52px)', color: T.white, lineHeight: 1.1, marginBottom: 18,
      }}>
        Guidewire Cloud<br />
        <span style={{ color: T.teal }}>Readiness Assessment</span>
      </h1>
      <p style={{ fontSize: 15, color: T.muted, lineHeight: 1.75, maxWidth: 520, margin: '0 auto 40px' }}>
        A structured 25-question diagnostic across five domains. Produces an AI-generated readiness report with RAG scoring, migration timeline estimate, and prioritised NTT DATA recommendations.
      </p>

      {/* Domain pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center', marginBottom: 44 }}>
        {DOMAINS.map(d => (
          <div key={d.id} style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: T.card, border: `1px solid ${d.color}30`,
            borderLeft: `3px solid ${d.color}`,
            padding: '8px 16px', borderRadius: 4, fontSize: 12, color: T.muted,
          }}>
            <span style={{ fontSize: 16 }}>{d.icon}</span>
            {d.label}
          </div>
        ))}
      </div>

      {/* Client name input */}
      <div style={{ marginBottom: 28 }}>
        <label style={{ display: 'block', fontSize: 10, fontWeight: 700, color: T.teal, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 8 }}>
          Client / Organisation Name (optional)
        </label>
        <input
          value={clientName}
          onChange={e => onClientChange(e.target.value)}
          placeholder="e.g. MSIG Insurance"
          style={{
            width: '100%', maxWidth: 340, background: T.card,
            border: `1px solid ${T.border}`, borderRadius: 4,
            color: T.white, fontSize: 13, padding: '10px 14px',
            textAlign: 'center', outline: 'none',
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
      </div>

      <button onClick={onStart} style={{
        background: T.teal, color: T.navy, border: 'none',
        fontWeight: 700, fontSize: 14, letterSpacing: 1,
        padding: '15px 48px', borderRadius: 4, cursor: 'pointer',
      }}>
        BEGIN ASSESSMENT →
      </button>

      <p style={{ fontSize: 10, color: T.grey, marginTop: 20 }}>
        Approx. 8–12 minutes · 25 questions across 5 domains
      </p>
    </div>
  )
}

// ── STEP 1-5: Domain Question Pages ────────────────────────────
function DomainStep({ domain, domainIndex, totalDomains, answers, onChange, onBack, onNext }) {
  const allAnswered = domain.questions.every(q => answers[q.id] !== undefined)
  const progress = Math.round((domainIndex / totalDomains) * 100)

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '40px 32px' }}>
      {/* Top progress */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <span style={{ fontSize: 10, fontWeight: 700, color: domain.color, letterSpacing: 2, textTransform: 'uppercase' }}>
          Domain {domainIndex + 1} of {totalDomains}
        </span>
        <span style={{ fontSize: 10, color: T.grey, fontFamily: "'DM Mono', monospace" }}>
          {progress}% complete
        </span>
      </div>
      <ProgressBar value={progress} color={domain.color} animate />

      {/* Domain header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '28px 0 32px' }}>
        <div style={{
          width: 52, height: 52, borderRadius: 12,
          background: domain.color + '18', border: `1px solid ${domain.color}40`,
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
        }}>{domain.icon}</div>
        <div>
          <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 26, color: T.white, lineHeight: 1.1 }}>
            {domain.label}
          </h2>
          <p style={{ fontSize: 12, color: T.muted, marginTop: 3 }}>{domain.description}</p>
        </div>
      </div>

      {/* Questions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {domain.questions.map((q, qi) => (
          <div key={q.id} style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderRadius: 6, padding: 22,
            borderLeft: answers[q.id] !== undefined ? `3px solid ${domain.color}` : '3px solid transparent',
            transition: 'border-color .2s',
          }}>
            <div style={{ display: 'flex', gap: 12, marginBottom: 14 }}>
              <span style={{
                fontFamily: "'DM Mono', monospace", fontSize: 10, color: domain.color,
                background: domain.color + '15', padding: '2px 8px', borderRadius: 3,
                height: 'fit-content', marginTop: 1, whiteSpace: 'nowrap',
              }}>Q{(domainIndex * 5) + qi + 1}</span>
              <span style={{ fontSize: 13, color: T.white, lineHeight: 1.6 }}>{q.text}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {q.options.map((opt, oi) => {
                const selected = answers[q.id] === oi
                return (
                  <button
                    key={oi}
                    onClick={() => onChange(q.id, oi)}
                    style={{
                      background: selected ? domain.color + '20' : T.panel,
                      border: `1px solid ${selected ? domain.color : T.border}`,
                      borderRadius: 4, padding: '10px 14px',
                      color: selected ? T.white : T.muted,
                      fontSize: 12, textAlign: 'left', cursor: 'pointer',
                      display: 'flex', alignItems: 'center', gap: 10,
                      transition: 'all .15s',
                    }}
                  >
                    <span style={{
                      width: 18, height: 18, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${selected ? domain.color : T.grey}`,
                      background: selected ? domain.color : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      {selected && <span style={{ width: 7, height: 7, borderRadius: '50%', background: T.navy }} />}
                    </span>
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
        <button onClick={onBack} style={{
          background: 'transparent', border: `1px solid ${T.border}`, color: T.muted,
          fontWeight: 600, fontSize: 12, padding: '11px 24px', borderRadius: 4, cursor: 'pointer',
        }}>
          ← Back
        </button>
        <button
          onClick={onNext}
          disabled={!allAnswered}
          style={{
            background: allAnswered ? domain.color : T.mid, color: T.navy,
            border: 'none', fontWeight: 700, fontSize: 12, letterSpacing: 1,
            padding: '11px 32px', borderRadius: 4,
            cursor: allAnswered ? 'pointer' : 'not-allowed', opacity: allAnswered ? 1 : 0.5,
            transition: 'all .2s',
          }}
        >
          {domainIndex === totalDomains - 1 ? 'GENERATE REPORT →' : 'NEXT DOMAIN →'}
        </button>
      </div>
    </div>
  )
}

// ── STEP 6: Generating ──────────────────────────────────────────
function Generating() {
  const steps = [
    'Scoring 5 assessment domains…',
    'Analysing customisation complexity…',
    'Mapping integration risk profile…',
    'Estimating migration timeline…',
    'Generating AI recommendations…',
  ]
  const [active, setActive] = useState(0)
  useState(() => {
    const t = setInterval(() => setActive(p => Math.min(p + 1, steps.length - 1)), 900)
    return () => clearInterval(t)
  })
  return (
    <div style={{ maxWidth: 480, margin: '0 auto', padding: '100px 32px', textAlign: 'center' }}>
      <div style={{ fontSize: 48, marginBottom: 28 }}>⚙️</div>
      <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 28, color: T.white, marginBottom: 32 }}>
        Generating your report…
      </h2>
      <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: 14 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {i < active ? (
              <span style={{ color: T.green, fontSize: 16 }}>✓</span>
            ) : i === active ? (
              <div style={{
                width: 16, height: 16, borderRadius: '50%',
                border: `2px solid rgba(0,168,168,0.2)`, borderTop: `2px solid ${T.teal}`,
                animation: 'spin .8s linear infinite', flexShrink: 0,
              }} />
            ) : (
              <span style={{ width: 16, height: 16, borderRadius: '50%', border: `2px solid ${T.mid}`, flexShrink: 0, display: 'inline-block' }} />
            )}
            <span style={{ fontSize: 13, color: i <= active ? T.muted : T.grey, transition: 'color .3s' }}>{s}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── STEP 7: Report ──────────────────────────────────────────────
function Report({ report, scores, clientName, onRestart }) {
  const [expanded, setExpanded] = useState(null)
  const overall = Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / DOMAINS.length)
  const oColor = ragColor(overall)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '40px 32px 80px' }}>

      {/* Report header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 36 }}>
        <div>
          <div style={{ fontSize: 9, fontWeight: 700, color: T.teal, letterSpacing: 3, marginBottom: 6 }}>
            NTT DATA · GUIDEWIRE CLOUD READINESS REPORT
          </div>
          <h1 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 32, color: T.white, lineHeight: 1.1 }}>
            {clientName || 'Assessment'} Report
          </h1>
          <p style={{ fontSize: 11, color: T.grey, marginTop: 6 }}>
            Generated {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <button onClick={onRestart} style={{
          background: 'transparent', border: `1px solid ${T.border}`, color: T.muted,
          fontSize: 11, padding: '8px 18px', borderRadius: 4, cursor: 'pointer',
        }}>↺ New Assessment</button>
      </div>

      {/* Overall score hero */}
      <div style={{
        background: T.card, border: `1px solid ${oColor}30`,
        borderRadius: 8, padding: '32px 36px', marginBottom: 28,
        display: 'flex', alignItems: 'center', gap: 36, flexWrap: 'wrap',
      }}>
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <RadialGauge score={overall} size={130} color={oColor} />
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 30, color: oColor, lineHeight: 1 }}>{overall}</span>
            <span style={{ fontSize: 9, color: T.muted, letterSpacing: 1 }}>/ 100</span>
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
            <h2 style={{ fontFamily: "'DM Serif Display', Georgia, serif", fontSize: 22, color: T.white }}>Overall Cloud Readiness</h2>
            <RAGBadge score={overall} large />
          </div>
          <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, marginBottom: 14 }}>{report.summary}</p>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { label: 'Est. Migration Timeline', val: report.timelineEstimate },
              { label: 'Migration Complexity', val: report.complexity },
              { label: 'Recommended Approach', val: report.approach },
            ].map(({ label, val }) => (
              <div key={label}>
                <div style={{ fontSize: 9, color: T.grey, letterSpacing: 1, textTransform: 'uppercase', marginBottom: 2 }}>{label}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.tealLt }}>{val}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Domain scorecards */}
      <h3 style={{ fontSize: 10, fontWeight: 700, color: T.teal, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
        Domain Scores
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 14, marginBottom: 32 }}>
        {DOMAINS.map(d => {
          const s = scores[d.id] || 0
          const dColor = ragColor(s)
          const isOpen = expanded === d.id
          const domainReport = report.domains?.[d.id] || {}
          return (
            <div
              key={d.id}
              style={{
                background: T.card, border: `1px solid ${isOpen ? d.color + '40' : T.border}`,
                borderRadius: 6, overflow: 'hidden', transition: 'border-color .2s',
              }}
            >
              {/* Card header */}
              <button
                onClick={() => setExpanded(isOpen ? null : d.id)}
                style={{
                  width: '100%', background: 'transparent', border: 'none',
                  padding: '16px 18px', display: 'flex', alignItems: 'center',
                  gap: 12, cursor: 'pointer', textAlign: 'left',
                }}
              >
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: d.color + '15', display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20, flexShrink: 0,
                }}>{d.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: T.white }}>{d.label}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <RAGBadge score={s} />
                      <span style={{ fontSize: 11, color: dColor, fontFamily: "'DM Mono', monospace", fontWeight: 700 }}>{s}</span>
                    </div>
                  </div>
                  <ProgressBar value={s} color={dColor} animate />
                </div>
                <span style={{ color: T.grey, fontSize: 16, flexShrink: 0, transition: 'transform .2s', transform: isOpen ? 'rotate(90deg)' : 'none' }}>›</span>
              </button>

              {/* Expandable detail */}
              {isOpen && domainReport.insight && (
                <div style={{ padding: '0 18px 18px', borderTop: `1px solid ${T.border}` }}>
                  <p style={{ fontSize: 11.5, color: T.muted, lineHeight: 1.7, marginBottom: 14, marginTop: 14 }}>
                    {domainReport.insight}
                  </p>
                  {domainReport.risks?.length > 0 && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 9, color: T.amber, letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>KEY RISKS</div>
                      {domainReport.risks.map((r, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                          <span style={{ color: T.amber, fontSize: 11 }}>▸</span>
                          <span style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{r}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {domainReport.actions?.length > 0 && (
                    <div>
                      <div style={{ fontSize: 9, color: T.green, letterSpacing: 2, fontWeight: 700, marginBottom: 8 }}>RECOMMENDED ACTIONS</div>
                      {domainReport.actions.map((a, i) => (
                        <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                          <span style={{ color: T.green, fontSize: 11 }}>✓</span>
                          <span style={{ fontSize: 11, color: T.muted, lineHeight: 1.5 }}>{a}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Priority recommendations */}
      <h3 style={{ fontSize: 10, fontWeight: 700, color: T.teal, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>
        Priority Recommendations
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 32 }}>
        {(report.priorityRecs || []).map((rec, i) => (
          <div key={i} style={{
            background: T.card, border: `1px solid ${T.border}`,
            borderLeft: `4px solid ${i === 0 ? T.red : i <= 2 ? T.amber : T.green}`,
            borderRadius: 4, padding: '14px 18px',
            display: 'flex', gap: 14, alignItems: 'flex-start',
          }}>
            <span style={{
              fontFamily: "'DM Mono', monospace",
              background: i === 0 ? T.red + '20' : i <= 2 ? T.amber + '20' : T.green + '20',
              color: i === 0 ? T.red : i <= 2 ? T.amber : T.green,
              fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 3,
              whiteSpace: 'nowrap', marginTop: 1,
            }}>P{i + 1}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 600, color: T.white, marginBottom: 3 }}>{rec.title}</div>
              <div style={{ fontSize: 11, color: T.muted, lineHeight: 1.55 }}>{rec.detail}</div>
            </div>
          </div>
        ))}
      </div>

      {/* NTT DATA services callout */}
      <div style={{
        background: `linear-gradient(135deg, ${T.navy} 0%, #0D2240 100%)`,
        border: `1px solid ${T.teal}30`, borderRadius: 8, padding: '28px 32px',
      }}>
        <div style={{ fontSize: 9, fontWeight: 700, color: T.teal, letterSpacing: 3, marginBottom: 10 }}>
          HOW NTT DATA CAN HELP
        </div>
        <p style={{ fontSize: 13, color: T.muted, lineHeight: 1.7, marginBottom: 20 }}>
          {report.nttDataPitch}
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {(report.suggestedServices || []).map(svc => (
            <div key={svc} style={{
              background: T.teal + '18', border: `1px solid ${T.teal}40`,
              color: T.tealLt, fontSize: 11, fontWeight: 500,
              padding: '6px 14px', borderRadius: 20,
            }}>{svc}</div>
          ))}
        </div>
      </div>

    </div>
  )
}

// ── Main App ────────────────────────────────────────────────────
export default function App() {
  const [step, setStep]           = useState('landing')  // landing | domain-N | generating | report | error
  const [domainIdx, setDomainIdx] = useState(0)
  const [answers, setAnswers]     = useState({})
  const [clientName, setClientName] = useState('')
  const [report, setReport]       = useState(null)
  const [scores, setScores]       = useState({})
  const [errorMsg, setErrorMsg]   = useState('')

  function handleAnswer(qId, optionIdx) {
    setAnswers(prev => ({ ...prev, [qId]: optionIdx }))
  }

  function buildScores() {
    const s = {}
    DOMAINS.forEach(d => {
      let total = 0, max = 0
      d.questions.forEach(q => {
        const idx = answers[q.id]
        if (idx !== undefined) { total += q.scores[idx]; max += Math.max(...q.scores) }
      })
      s[d.id] = max > 0 ? Math.round((total / max) * 100) : 0
    })
    return s
  }

  function buildAnswerSummary() {
    return DOMAINS.map(d => {
      const qs = d.questions.map(q => {
        const idx = answers[q.id]
        return idx !== undefined
          ? `  Q: ${q.text}\n  A: ${q.options[idx]} (score ${q.scores[idx]}/${Math.max(...q.scores)})`
          : `  Q: ${q.text}\n  A: Not answered`
      }).join('\n')
      return `### ${d.label}\n${qs}`
    }).join('\n\n')
  }

  async function generateReport(finalScores) {
    setStep('generating')

    const overall = Math.round(Object.values(finalScores).reduce((a, b) => a + b, 0) / DOMAINS.length)
    const domainSummary = DOMAINS.map(d => `${d.label}: ${finalScores[d.id]}/100`).join(', ')

    const prompt = `You are a Guidewire Cloud migration expert at NTT DATA. Analyse this cloud readiness assessment and return ONLY a raw JSON object with no markdown fences, no explanation.

CLIENT: ${clientName || 'Insurance Carrier'}
OVERALL SCORE: ${overall}/100
DOMAIN SCORES: ${domainSummary}

DETAILED ANSWERS:
${buildAnswerSummary()}

Return this exact JSON structure:
{
  "summary": "3-4 sentence executive summary of overall readiness and key themes",
  "timelineEstimate": "e.g. 18-24 months",
  "complexity": "Low | Medium | High | Very High",
  "approach": "e.g. Phased lift-and-shift | Big bang | Hybrid",
  "domains": {
    "codebase": {
      "insight": "2-3 sentences specific to their codebase answers",
      "risks": ["risk1", "risk2"],
      "actions": ["action1", "action2"]
    },
    "integrations": {
      "insight": "2-3 sentences specific to their integration answers",
      "risks": ["risk1", "risk2"],
      "actions": ["action1", "action2"]
    },
    "datamodel": {
      "insight": "2-3 sentences specific to their data model answers",
      "risks": ["risk1", "risk2"],
      "actions": ["action1", "action2"]
    },
    "apd": {
      "insight": "2-3 sentences specific to their APD answers",
      "risks": ["risk1", "risk2"],
      "actions": ["action1", "action2"]
    },
    "operations": {
      "insight": "2-3 sentences specific to their operations answers",
      "risks": ["risk1", "risk2"],
      "actions": ["action1", "action2"]
    }
  },
  "priorityRecs": [
    { "title": "Short title", "detail": "1-2 sentences on what to do and why" },
    { "title": "Short title", "detail": "1-2 sentences" },
    { "title": "Short title", "detail": "1-2 sentences" },
    { "title": "Short title", "detail": "1-2 sentences" },
    { "title": "Short title", "detail": "1-2 sentences" }
  ],
  "nttDataPitch": "2-3 sentences on how NTT DATA's Guidewire practice and accelerators (Gosu Copilot, APD Conversion, SurePath, Test DataHub, Axet AI) address the specific gaps identified",
  "suggestedServices": ["Service 1", "Service 2", "Service 3", "Service 4"]
}`

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-haiku-4-5',
          max_tokens: 2000,
          messages: [{ role: 'user', content: prompt }],
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error('API ' + res.status + ': ' + (data.error?.message || JSON.stringify(data)))

      const raw = (data.content || []).find(b => b.type === 'text')?.text || ''
      const stripped = raw.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '').trim()
      const match = stripped.match(/\{[\s\S]*\}/)
      if (!match) throw new Error('No JSON in response')

      const parsed = JSON.parse(match[0])
      setReport(parsed)
      setStep('report')
    } catch (e) {
      setErrorMsg(e.message)
      setStep('error')
    }
  }

  function handleNext() {
    if (domainIdx < DOMAINS.length - 1) {
      setDomainIdx(domainIdx + 1)
    } else {
      const finalScores = buildScores()
      setScores(finalScores)
      generateReport(finalScores)
    }
  }

  function handleBack() {
    if (domainIdx === 0) setStep('landing')
    else setDomainIdx(domainIdx - 1)
  }

  function restart() {
    setStep('landing'); setDomainIdx(0); setAnswers({})
    setReport(null); setScores({}); setClientName(''); setErrorMsg('')
  }

  return (
    <div style={{ minHeight: '100vh', background: T.bg, color: T.white, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg) } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(8px) } to { opacity:1; transform:none } }
        * { box-sizing: border-box; }
        input, button { font-family: inherit; }
        input:focus { outline: 1px solid #00A8A8; }
        button:not(:disabled):hover { opacity: 0.88; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-thumb { background: #1E3A5F; border-radius: 3px; }
      `}</style>

      {/* Header bar */}
      <div style={{
        background: T.panel, borderBottom: `1px solid ${T.border}`,
        padding: '0 32px', display: 'flex', alignItems: 'center',
        justifyContent: 'space-between', height: 52, position: 'sticky', top: 0, zIndex: 10,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: T.teal, color: T.navy, fontWeight: 700, fontSize: 10, padding: '3px 10px', borderRadius: 3, letterSpacing: 0.5 }}>
            NTT DATA
          </div>
          <span style={{ color: T.ice, fontSize: 13, fontWeight: 500 }}>Guidewire Cloud Readiness Assessment</span>
        </div>
        {step.startsWith('domain') && (
          <div style={{ display: 'flex', gap: 6 }}>
            {DOMAINS.map((d, i) => (
              <div key={d.id} style={{
                width: 28, height: 4, borderRadius: 2,
                background: i <= domainIdx ? d.color : T.mid,
                transition: 'background .3s',
              }} />
            ))}
          </div>
        )}
      </div>

      {/* Page content */}
      <div style={{ animation: 'fadeUp .4s ease' }}>
        {step === 'landing' && (
          <Landing onStart={() => { setStep('domain'); setDomainIdx(0) }} onClientChange={setClientName} clientName={clientName} />
        )}
        {step === 'domain' && (
          <DomainStep
            domain={DOMAINS[domainIdx]}
            domainIndex={domainIdx}
            totalDomains={DOMAINS.length}
            answers={answers}
            onChange={handleAnswer}
            onBack={handleBack}
            onNext={handleNext}
          />
        )}
        {step === 'generating' && <Generating />}
        {step === 'report' && report && (
          <Report report={report} scores={scores} clientName={clientName} onRestart={restart} />
        )}
        {step === 'error' && (
          <div style={{ maxWidth: 560, margin: '80px auto', padding: 32 }}>
            <div style={{ background: '#2D1515', border: '1px solid #F87171', borderRadius: 6, padding: 24 }}>
              <div style={{ color: '#FCA5A5', fontSize: 14, fontWeight: 600, marginBottom: 8 }}>Report generation failed</div>
              <div style={{ color: '#FCA5A5', fontSize: 12, lineHeight: 1.6, wordBreak: 'break-all', marginBottom: 16 }}>{errorMsg}</div>
              <button onClick={restart} style={{ background: T.teal, color: T.navy, border: 'none', fontWeight: 700, fontSize: 12, padding: '10px 24px', borderRadius: 4, cursor: 'pointer' }}>
                Start Over
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
