# 🛡️ CyberSalama

**Community Cybersecurity Platform for Nairobi, Kenya**

> Protecting informal markets, youth entrepreneurs, educators, and community members from digital fraud — through WhatsApp and a full web portal. Bilingual (English + Kiswahili). Zero app download required.

Built by **Tito Kilonzo Kinyambu** | SynthLink Technologies

---

## Platform Modules

| Module | Type | Description |
|---|---|---|
| **SalamaHub** | Web Portal | Central dashboard — overview of threats, tips, alerts |
| **SalamaBot** | WhatsApp Chatbot | Daily tips, fraud alerts, free Q&A, report fraud — via WhatsApp |
| **ThreatRadar** | Live Map | Crowd-sourced Leaflet map of active fraud incidents across Nairobi |
| **SalamaLearn** | Tip Library | Bilingual security guides, categorised, filterable, collapsible |
| **SalamaWatch** | Report Form | Community fraud reporting form → feeds ThreatRadar |
| **SalamaQuiz** | Quizzes | Interactive multi-question quizzes with scoring and explanations |
| **SalamaAlert** | Alert Feed | Severity-ranked active community fraud alerts |

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 14 (App Router) | SSR + API routes in one repo |
| **Language** | TypeScript | Type safety across full stack |
| **Database** | PostgreSQL via Supabase | Managed Postgres, real-time support |
| **ORM** | Prisma | Type-safe DB client, migrations |
| **Styling** | Tailwind CSS | Utility-first, fast custom design |
| **Animations** | Framer Motion | Smooth page transitions + micro-interactions |
| **Map** | React-Leaflet + Leaflet | Open-source, low-data-friendly threat map |
| **WhatsApp** | Twilio WhatsApp Business API | Webhook-based chatbot |
| **Bot AI** | Claude Haiku (via Anthropic API) | Free-question answering fallback |
| **Auth** | Custom session cookies + bcrypt | Lightweight, no NextAuth overhead |
| **Validation** | Zod | Schema validation on all API routes |
| **Toasts** | Sonner | Non-intrusive notifications |
| **Fonts** | Sora + DM Sans + JetBrains Mono | Distinctive display + readable body |

---

## Project Structure

```
cybersalama/
├── app/
│   ├── page.tsx                     # Landing page
│   ├── layout.tsx                   # Root layout (fonts, global providers)
│   ├── globals.css                  # Tailwind + custom CSS variables
│   ├── (auth)/
│   │   ├── login/page.tsx           # Sign in
│   │   └── register/page.tsx        # Create account
│   ├── (portal)/
│   │   ├── layout.tsx               # Sidebar navigation layout
│   │   ├── dashboard/page.tsx       # SalamaHub overview
│   │   ├── threats/page.tsx         # ThreatRadar live map
│   │   ├── learn/page.tsx           # SalamaLearn tip library
│   │   ├── report/page.tsx          # SalamaWatch fraud form
│   │   ├── quiz/page.tsx            # SalamaQuiz
│   │   └── alerts/page.tsx          # SalamaAlert feed
│   └── api/
│       ├── webhook/whatsapp/route.ts  # SalamaBot Twilio webhook
│       ├── reports/route.ts           # CRUD fraud reports
│       ├── tips/route.ts              # Tips API
│       ├── alerts/route.ts            # Alerts API
│       └── auth/
│           ├── login/route.ts
│           └── register/route.ts
├── components/
│   └── portal/
│       └── ThreatMap.tsx            # Leaflet map (client-only)
├── lib/
│   ├── prisma.ts                    # Prisma singleton
│   └── whatsapp/
│       └── bot.ts                   # SalamaBot state machine + AI
├── prisma/
│   ├── schema.prisma                # Full DB schema
│   └── seed.ts                      # Initial data
├── middleware.ts                    # Auth route protection
├── tailwind.config.ts
├── next.config.ts
└── .env.example                     # All required environment variables
```

---

## Getting Started

### 1. Prerequisites
- Node.js 18+
- A Supabase project (free tier works)
- A Twilio account (WhatsApp Sandbox for dev)
- Optional: Anthropic API key (for free-question AI answers)

### 2. Clone & Install

```bash
git clone https://github.com/TitoKilonzo/cybersalama.git
cd cybersalama
npm install
```

### 3. Environment Variables

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

Required variables: `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_WHATSAPP_NUMBER`, `NEXTAUTH_SECRET`

### 4. Database Setup

```bash
npx prisma generate       # Generate Prisma client
npx prisma db push        # Push schema to Supabase
npm run db:seed           # Seed initial data (admin user, tips, badges, sample alert)
```

### 5. Run Locally

```bash
npm run dev
# Open http://localhost:3000
```

### 6. WhatsApp Bot Setup (Twilio)

1. Go to [Twilio Console](https://console.twilio.com) → Messaging → Try it out → Send a WhatsApp message
2. In Sandbox settings, set the webhook URL to:
   ```
   https://your-domain.ngrok.io/api/webhook/whatsapp
   ```
3. For local dev, use [ngrok](https://ngrok.com): `ngrok http 3000`
4. In production, set the webhook to your live domain

### 7. Deploy to Vercel

```bash
npm install -g vercel
vercel --prod
# Add all .env.local variables in Vercel dashboard → Settings → Environment Variables
```
---

## Default Admin Login

After seeding:
- Email: `admin@cybersalama.co.ke`
- Password: `Admin@Salama2025`

**Change this immediately after first login.**

---

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/webhook/whatsapp` | SalamaBot Twilio webhook |
| GET | `/api/reports?type=&severity=&area=` | List fraud reports |
| POST | `/api/reports` | Submit fraud report |
| GET | `/api/tips?category=&difficulty=&q=` | List security tips |
| GET | `/api/alerts?area=&active=` | List active alerts |
| POST | `/api/alerts` | Create alert (admin) |
| POST | `/api/auth/login` | Sign in |
| POST | `/api/auth/register` | Create account |

---

## SalamaBot Commands

| Command | Action |
|---|---|
| `Hi` / `Hello` / `Habari` | Start conversation, language selection |
| `1` | Get today's security tip |
| `2` | View active SalamaAlerts |
| `3` | Report a fraud incident |
| `4` | Take a quick quiz |
| `5` | Ask any security question (AI-powered) |
| `menu` / `menyu` | Return to main menu |

---

## Customising

- **Add tips**: Insert into `tips` table via Prisma Studio (`npm run db:studio`)
- **Broadcast alerts**: POST to `/api/alerts` with admin secret header
- **Add quiz questions**: Insert into `quiz_questions` table
- **Change bot number**: Update `TWILIO_WHATSAPP_NUMBER` in env
- **Add languages**: Extend `Language` enum in Prisma schema + add translations in `bot.ts`

---

## Roadmap

- [ ] Admin dashboard (manage reports, alerts, tips)
- [ ] Email notifications for new area alerts
- [ ] WhatsApp broadcast lists for verified users
- [ ] Offline-first PWA mode
- [ ] SMS fallback via Africa's Talking
- [ ] County government data partnership integration

---

## Author

**Tito Kilonzo Kinyambu**
Back-End Developer & Cybersecurity Analyst
📧 titokilonzo3@gmail.com
🐙 [github.com/TitoKilonzo](https://github.com/TitoKilonzo)
🏢 SynthLink Technologies · Nairobi, Kenya

---

*CyberSalama — Technology in service of community.*

---

## v2.0 Changes

### UI & Design
- **Animated contextual backgrounds** — each page has a unique CSS animation:
  - Dashboard: drifting green grid
  - ThreatRadar: rotating radar sweep + concentric range rings
  - SalamaLearn: floating knowledge node matrix
  - SalamaWatch: amber warning pulse rings
  - SalamaQuiz: electric yellow/purple energy gradient
  - SalamaAlert: red rotating beacon sweep
  - Auth pages: secure geometric grid with corner radials

### Authentication
- **Social OAuth** — Google, GitHub, Facebook via NextAuth v5
- **Back to Home button** on login/register pages
- **Password strength meter** on register
- Unified NextAuth + legacy cookie session support

### Navigation
- **Interlinked pages** — every module links back to Dashboard and cross-references related modules
- **Breadcrumb bar** in portal header with per-page accent colour
- **Settings page** — profile, notifications, language toggle, sign out
- **404 page**, **loading states** at root and portal level
- **Sidebar** includes Settings and Back to Home

### Security
- CSRF origin validation on all POST API routes
- Twilio signature gate on WhatsApp webhook
- `poweredByHeader: false` (no fingerprinting)
- Full HTTP security header suite in `next.config.ts`
- 0 npm vulnerabilities (`npm audit`)
