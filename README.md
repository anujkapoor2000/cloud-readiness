# NTT DATA | Guidewire Cloud Readiness Assessment

A 25-question diagnostic across 5 domains that produces an AI-generated cloud migration readiness report with RAG scoring, timeline estimate, and prioritised recommendations.

## Domains
1. Codebase & Customisation (Gosu, PCFs, plugins)
2. Integrations & APIs
3. Data Model & Database
4. APD & Product Maturity
5. Operations & Organisation

## Deploy to Vercel

1. Push to GitHub
2. Import into Vercel
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy

## Local Dev

```bash
npm install
# Create .env.local: ANTHROPIC_API_KEY=your_key
npm run dev
```
