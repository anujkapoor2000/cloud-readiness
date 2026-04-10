export const DOMAINS = [
  {
    id: 'codebase',
    label: 'Codebase & Customisation',
    icon: '⚙️',
    color: '#00A8A8',
    description: 'Gosu extensions, PCFs, plugins and technical debt',
    questions: [
      {
        id: 'cb1',
        text: 'How many Gosu extension files exist across your InsuranceSuite applications?',
        type: 'choice',
        options: ['< 100', '100–500', '500–1,500', '1,500–3,000', '> 3,000'],
        scores: [5, 4, 3, 2, 1],
      },
      {
        id: 'cb2',
        text: 'What proportion of your Gosu code follows Guidewire best practices (no direct DB access, no reflection, proper extension patterns)?',
        type: 'choice',
        options: ['> 90%', '70–90%', '50–70%', '30–50%', '< 30%'],
        scores: [5, 4, 3, 2, 1],
      },
      {
        id: 'cb3',
        text: 'Have you run a recent code health scan or tech debt assessment?',
        type: 'choice',
        options: ['Yes — within 6 months', 'Yes — 6–18 months ago', 'Yes — over 18 months ago', 'No formal scan done'],
        scores: [5, 4, 2, 1],
      },
      {
        id: 'cb4',
        text: 'How many custom PCF (screen) files have been created or heavily modified?',
        type: 'choice',
        options: ['< 50', '50–150', '150–400', '400–800', '> 800'],
        scores: [5, 4, 3, 2, 1],
      },
      {
        id: 'cb5',
        text: 'Are there any known cloud-incompatible patterns (direct DB queries, file system access, hardcoded server paths)?',
        type: 'choice',
        options: ['None known', 'A few isolated cases', 'Moderate — some remediation needed', 'Significant — major rework required'],
        scores: [5, 4, 2, 1],
      },
    ],
  },
  {
    id: 'integrations',
    label: 'Integrations & APIs',
    icon: '🔗',
    color: '#0891B2',
    description: 'Third-party connections, messaging, and API architecture',
    questions: [
      {
        id: 'int1',
        text: 'How many active third-party integrations does your Guidewire environment have?',
        type: 'choice',
        options: ['< 5', '5–15', '15–30', '30–60', '> 60'],
        scores: [5, 4, 3, 2, 1],
      },
      {
        id: 'int2',
        text: 'What is the primary integration pattern in use?',
        type: 'choice',
        options: [
          'Guidewire Integration Framework (GIF) / REST APIs',
          'Messaging (JMS/Kafka) via standard connectors',
          'SOAP / legacy web services',
          'Direct DB queries or stored procedures',
          'Mix of modern and legacy patterns',
        ],
        scores: [5, 4, 3, 1, 2],
      },
      {
        id: 'int3',
        text: 'Are your integrations documented with current data flow diagrams and API specs?',
        type: 'choice',
        options: ['Fully documented', 'Mostly documented', 'Partially documented', 'Little or no documentation'],
        scores: [5, 4, 2, 1],
      },
      {
        id: 'int4',
        text: 'How many integrations use Guidewire Marketplace connectors vs. custom-built?',
        type: 'choice',
        options: ['Majority use Marketplace connectors', 'Mix — roughly equal', 'Mostly custom-built', 'All custom-built'],
        scores: [5, 3, 2, 1],
      },
      {
        id: 'int5',
        text: 'Have integration endpoints been tested for cloud compatibility (no on-prem-only dependencies)?',
        type: 'choice',
        options: ['Yes — fully validated', 'Partially validated', 'Not yet assessed', 'Known incompatibilities exist'],
        scores: [5, 3, 2, 1],
      },
    ],
  },
  {
    id: 'datamodel',
    label: 'Data Model & Database',
    icon: '🗄️',
    color: '#7C3AED',
    description: 'Schema extensions, data volume, and migration complexity',
    questions: [
      {
        id: 'dm1',
        text: 'How many custom data model extensions (entities, typelists, fields) have been added?',
        type: 'choice',
        options: ['< 50', '50–200', '200–500', '500–1,000', '> 1,000'],
        scores: [5, 4, 3, 2, 1],
      },
      {
        id: 'dm2',
        text: 'What is the approximate total database size across all InsuranceSuite applications?',
        type: 'choice',
        options: ['< 50 GB', '50–200 GB', '200 GB–1 TB', '1–5 TB', '> 5 TB'],
        scores: [5, 4, 3, 2, 1],
      },
      {
        id: 'dm3',
        text: 'Has a database health check been performed to identify performance bottlenecks?',
        type: 'choice',
        options: ['Yes — recent and documented', 'Yes — but over 12 months old', 'Informally assessed', 'No assessment done'],
        scores: [5, 3, 2, 1],
      },
      {
        id: 'dm4',
        text: 'Are there any external systems with direct database access to Guidewire tables?',
        type: 'choice',
        options: ['None', '1–2 known cases (legacy)', 'Several systems', 'Many — a significant dependency'],
        scores: [5, 3, 2, 1],
      },
      {
        id: 'dm5',
        text: 'Is your data archival / retention policy defined and implemented?',
        type: 'choice',
        options: ['Fully implemented', 'Policy defined, partial implementation', 'Policy defined, not implemented', 'No policy in place'],
        scores: [5, 4, 2, 1],
      },
    ],
  },
  {
    id: 'apd',
    label: 'APD & Product Maturity',
    icon: '📋',
    color: '#059669',
    description: 'Advanced Product Designer adoption and product model state',
    questions: [
      {
        id: 'apd1',
        text: 'What percentage of your active Lines of Business are managed through APD?',
        type: 'choice',
        options: ['> 80%', '50–80%', '20–50%', '< 20%', 'None — all non-APD'],
        scores: [5, 4, 3, 2, 1],
      },
      {
        id: 'apd2',
        text: 'How many active Lines of Business (LOBs) are in scope for cloud migration?',
        type: 'choice',
        options: ['1–3', '4–8', '9–15', '16–25', '> 25'],
        scores: [5, 4, 3, 2, 1],
      },
      {
        id: 'apd3',
        text: 'For non-APD LOBs, how well documented are the product definitions (coverages, eligibility, rating)?',
        type: 'choice',
        options: ['Fully documented', 'Mostly documented', 'Partially documented', 'Poorly documented'],
        scores: [5, 4, 2, 1],
      },
      {
        id: 'apd4',
        text: 'How complex are your rating algorithms and eligibility rules?',
        type: 'choice',
        options: ['Simple — few variables', 'Moderate complexity', 'Complex — many interdependencies', 'Very complex — actuarial / ML-driven'],
        scores: [5, 4, 2, 1],
      },
      {
        id: 'apd5',
        text: 'Are your product teams trained and familiar with APD tooling?',
        type: 'choice',
        options: ['Yes — skilled APD users', 'Some training done', 'Minimal exposure', 'No APD experience'],
        scores: [5, 3, 2, 1],
      },
    ],
  },
  {
    id: 'operations',
    label: 'Operations & Organisation',
    icon: '🏢',
    color: '#D97706',
    description: 'Team readiness, governance, and operational preparedness',
    questions: [
      {
        id: 'op1',
        text: 'Do you have a dedicated cloud migration programme team with executive sponsorship?',
        type: 'choice',
        options: ['Yes — fully resourced with C-suite sponsor', 'Team in place, sponsor identified', 'Partially resourced', 'No dedicated team yet'],
        scores: [5, 4, 2, 1],
      },
      {
        id: 'op2',
        text: 'What is your current Guidewire version (ski release)?',
        type: 'choice',
        options: ['Innsbruck / Jasper (latest)', 'Hakuba / Garmisch', 'Flaine / Elysian', 'Pre-Elysian (4+ releases behind)', 'Unknown'],
        scores: [5, 4, 3, 1, 1],
      },
      {
        id: 'op3',
        text: 'How many Guidewire-certified professionals does your organisation / SI partner have?',
        type: 'choice',
        options: ['> 20 certified', '10–20 certified', '5–10 certified', '< 5 certified', 'None'],
        scores: [5, 4, 3, 2, 1],
      },
      {
        id: 'op4',
        text: 'Is there a formal test strategy and regression test suite in place?',
        type: 'choice',
        options: ['Comprehensive automated suite', 'Mix of automated and manual', 'Mostly manual testing', 'Ad-hoc testing only'],
        scores: [5, 4, 2, 1],
      },
      {
        id: 'op5',
        text: 'What is the target timeline pressure for cloud migration?',
        type: 'choice',
        options: ['Flexible — 24+ months', 'Moderate — 18–24 months', 'Tight — 12–18 months', 'Very tight — under 12 months'],
        scores: [5, 4, 3, 1],
      },
    ],
  },
]

export function calcDomainScore(domain, answers) {
  let total = 0
  let max = 0
  domain.questions.forEach(q => {
    const idx = answers[q.id]
    if (idx !== undefined) {
      total += q.scores[idx]
      max += Math.max(...q.scores)
    }
  })
  return max > 0 ? Math.round((total / max) * 100) : 0
}

export function calcOverallScore(domains, answers) {
  const scores = domains.map(d => calcDomainScore(d, answers))
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
}

export function ragLabel(score) {
  if (score >= 70) return 'GREEN'
  if (score >= 40) return 'AMBER'
  return 'RED'
}

export function ragColor(score) {
  if (score >= 70) return '#10B981'
  if (score >= 40) return '#F59E0B'
  return '#EF4444'
}
