# Research Topic Generator v2

AI-powered research topic generator for medical microbiology — designed for professors at Nigerian universities.

## What's New in v2
- **Warm Paper theme** — editorial cream design, easy on the eyes
- **Equipment picker** — check actual lab equipment instead of vague "basic/intermediate/advanced"
- **Timeline selector** — 1 month to 12 months, shapes what experiments are feasible
- **Students tab** — upload CSV, assign topics, email students via mail client
- **Guided walkthrough** — numbered tooltips for first-time users
- **Collapsible sections** — all expanded by default, collapse what you don't need

## Deploy to Vercel

1. Upload to GitHub (create repo → upload files)
2. Import to Vercel from GitHub
3. Add environment variable: `ANTHROPIC_API_KEY`
4. Deploy

## Local Development

```bash
npm install
cp .env.example .env.local  # add your API key
npm run dev
```

## Cost
- Vercel hosting: Free
- Anthropic API: ~$0.03-0.05 per generation (5 topics)
- Realistic semester: $1-5
