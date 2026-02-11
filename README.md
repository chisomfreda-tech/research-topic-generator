# Research Topic Generator — Medical Microbiology

AI-powered tool to generate feasible experimental research topics for medical microbiology students in Lagos, Nigeria.

## Features

- **AI Topic Generation** — Uses Claude to generate context-aware, feasible research topics
- **Focus Areas** — Plant-Based Antimicrobials, AMR, Food/Environmental, Clinical Isolates + custom
- **Bacteria Filters** — 15 organisms including aerobes & anaerobes
- **Budget Estimates** — Real Nigerian Naira pricing from Lagos lab suppliers
- **Budget Cap** — Filter generation by cost ceiling (₦300K, ₦500K, ₦800K)
- **Uniqueness Checker** — AI-powered check against existing literature
- **Proposal Generator** — Auto-generate 2-page research proposals
- **6 Tabs** — Generate, Approved, Budget, Suppliers, Grants, Lab Planning
- **Lagos Suppliers** — Finlab Nigeria, Koeman, Allschoolabs, Pascal, NIMR contacts
- **Grants Database** — TETFund, NRF, Wellcome Trust, NIH Fogarty, GARDP
- **Lab Planning** — Gel layout optimizer, shared reagent tracking
- **Persistent Storage** — Approved topics saved in localStorage

## Deploy to Vercel

### 1. Push to GitHub

```bash
cd research-topic-generator
git init
git add .
git commit -m "Research Topic Generator"
git remote add origin https://github.com/YOUR_USERNAME/research-topic-generator.git
git push -u origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) and import the GitHub repo
2. In the **Environment Variables** section, add:
   - `ANTHROPIC_API_KEY` = your Claude API key from [console.anthropic.com](https://console.anthropic.com)
3. Click **Deploy**

Your app will be live at `research-topic-generator.vercel.app` (or your custom domain).

### 3. Local Development

```bash
npm install
cp .env.example .env.local
# Edit .env.local and add your ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Architecture

```
app/
├── page.js              # Main React UI (client component)
├── layout.js            # Root layout + metadata
├── globals.css          # Tailwind + custom styles
├── lib/
│   ├── prompts.js       # All Claude prompt templates
│   └── claude.js        # Server-side Claude API wrapper
└── api/
    ├── generate/route.js    # POST — batch topic generation
    ├── regenerate/route.js  # POST — single topic regeneration
    ├── uniqueness/route.js  # POST — uniqueness check
    └── proposal/route.js    # POST — full proposal generation
```

The API key stays server-side in Next.js API routes — never exposed to the browser.
