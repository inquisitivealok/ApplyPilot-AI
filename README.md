# ✈️ ApplyPilot AI — Smart Job Application Tracker

> A responsive, high-performance job application tracking dashboard and candidate copilot built with **React**, **Vite**, **Lucide Icons**, and **Vanilla CSS**.

---

## 🎯 Problem & Motivation

Modern tech job searches often involve submitting 30–100+ applications across LinkedIn, job boards, and direct company career portals. Job seekers frequently experience:
- **Disorganized Tracking**: Lost context regarding interview dates, hiring managers, compensation packages, and follow-up deadlines.
- **ATS Keyword Blindspots**: Submitting generic resumes without analyzing how well their skills match the specific keywords in each job description.
- **Time-Consuming Cold Outreach**: Manually drafting introduction notes and elevator pitches for every hiring team.
- **Lack of Pipeline Insights**: No visibility into which application channels or tech stacks convert best from submission to technical rounds and offers.

**ApplyPilot AI** addresses this with an integrated tracker, pipeline analytics, and an interactive job description analyzer.

---

## 📸 Screenshots & UI Preview

| Applications Tracker (Table View) | AI Job Matcher (Transparent Demo Mode) |
| :---: | :---: |
| ![Tracker View](public/screenshot-tracker.png) | ![Analyzer View](public/screenshot-analyzer.png) |
| *Track status stages, search, edit, delete, and manage sample data* | *Local heuristic ATS keyword matching & pitch generation* |

*(Screenshots can be captured directly from your local browser at `http://localhost:5173/`)*

---

## 🌟 Key Implemented Features

### 1. 📊 Real-Time Dashboard & Statistics
- **Metric Cards**: Real-time counts for **Total Tracked**, **In Interviews**, **Offers Received**, and **Archived / Rejected**.
- **Interactive Click-to-Filter**: Clicking any metric card instantly filters the tracker table to that specific stage.
- **Dynamic Conversion Rates**: Auto-updates interview conversion percentages and offer conversion rates whenever data changes.

### 2. 📋 Complete Application Management (CRUD)
- **Add Opportunity**: Modal form with client validation requiring **Company Name** and **Job Title / Role**.
- **Edit Opportunity**: Pre-populates all existing data (dates, salary, work arrangement, recruiter notes, and URL) for updating.
- **Safe Deletion**: Confirmation dialog requiring explicit user confirmation before permanently deleting an application.
- **Sample Data Controls**: Preloaded records are explicitly tagged with a `[Sample]` badge. Users can remove all sample records with one click via **"Clear Sample Data"** or restore them via **"Restore Samples"**.
- **Local Persistence**: All additions, updates, deletions, and sample state changes persist automatically in browser `localStorage`.

### 3. 🔍 Search & Multi-Criteria Filtering
- **Unified Real-Time Search**: Matches across company name, role title, application status, work arrangement, location, and tech stack tags.
- **Pipeline Stage Tabs**: Instant filter pills for **All**, **Applied**, **Interviews**, **Offers**, and **Rejected** with live count badges.
- **Work Mode Filter**: Dropdown filtering by **Remote**, **Hybrid**, or **On-site**.
- **Dual View Modes**: Switch between a structured **Table View** and an adaptive **Cards Grid View**.

### 4. 🤖 AI Job Matcher (Transparent Architecture)
- **Heuristic Demo Mode (Default)**: Runs 100% locally and offline without external API dependencies. Analyzes hard skill frequency, seniority patterns, keyword density, and generates tailored cover letter pitches.
- **Explicit Mode Notice**: Transparently flags whether an output was produced by the **Local Rule-Based Heuristic Matcher (Demo)** or a **Live LLM API**, ensuring complete transparency.
- **ATS Keyword Gap Analysis**: Highlights matched technical strengths and flags missing industry keywords needed for ATS screen optimization.
- **Custom Pitch Generator**: Synthesizes an elevator pitch tailored to the hiring team with a 1-click **Copy to Clipboard** button.
- **Direct Pipeline Tracking**: A **Track This Job** button transfers the analyzed company, role, and keywords directly into your applications tracker.
- **Optional Live Gemini Connection**: An in-app configuration drawer allows users to optionally connect a personal Google Gemini API key (`gemini-2.5-flash`) stored exclusively in their own browser `localStorage`.

### 5. 📈 Funnel & Conversion Analytics
- Application funnel visualization (*Submissions → Interviews → Offers → Archived*).
- Pipeline velocity indicators and search health index.
- In-demand skill frequency analysis across tracked opportunities.

### 6. 📱 Accessibility & Responsive Design
- **Mobile Drawer**: Slide-out navigation drawer on viewports under 900px with a backdrop overlay and touch targets.
- **Accessible Modals**: Implements `role="dialog"`, `aria-modal="true"`, `aria-labelledby`, and `Escape` key listeners for keyboard dismissal.
- **Semantic HTML**: Proper table headers with `scope="col"`, form controls with explicit label associations, and color contrast tokens.

---

## 🛠️ Tech Stack & Architecture

```text
ApplyPilot-AI/
├── index.html                   # HTML5 shell with Google Fonts & metadata
├── src/
│   ├── App.jsx                  # Main application orchestrator & state manager
│   ├── App.css                  # UI styling, responsive layout, and animations
│   ├── index.css                # Global design system & obsidian dark theme tokens
│   ├── components/
│   │   ├── Sidebar.jsx          # Desktop/mobile navigation & pro tip widget
│   │   ├── Topbar.jsx           # Sticky glassmorphic header & quick actions
│   │   ├── StatsCards.jsx       # 4 metric cards with interactive filtering
│   │   ├── ApplicationTracker.jsx # Applications table/grid with search & sample data toggle
│   │   ├── ApplicationModal.jsx # Add & Edit modal with field validation & a11y
│   │   ├── DeleteConfirmModal.jsx # Delete confirmation dialog with Escape listener
│   │   ├── JobAnalyzer.jsx      # AI job matcher with transparent demo mode callouts
│   │   ├── AnalyticsView.jsx    # Funnel progression & tech stack analytics
│   │   └── Toast.jsx            # Action feedback notification toasts
│   └── data/
│       └── mockData.js          # Preloaded sample opportunities & localStorage handlers
├── test_features.js             # Automated verification test suite (Node.js)
├── package.json                 # Dependencies and npm scripts
└── .gitignore                   # Strict exclusions for dist, node_modules, and secrets
```

- **Frontend Framework**: React 19 (`react`, `react-dom`)
- **Build Tool**: Vite (`vite`, `@vitejs/plugin-react`)
- **Icons**: Lucide React (`lucide-react`)
- **Styling**: Vanilla CSS (CSS Variables, Flexbox, CSS Grid, Glassmorphism, Dark Theme)
- **Typography**: Google Fonts (*Plus Jakarta Sans* & *Outfit*)
- **Code Linter**: Oxlint (`oxlint`)
- **Testing**: Automated Node test runner (`node test_features.js`)

---

## 🚀 Getting Started Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- npm (installed automatically with Node)

### Step-by-Step Setup

1. **Clone or navigate to the project directory**:
   ```bash
   cd c:/Users/aloks/Desktop/ApplyPilot-AI
   ```

2. **Install project dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Visit **[http://localhost:5173/](http://localhost:5173/)**

---

## 🧪 Testing & Verification

Run the verification scripts directly from the terminal:

```bash
# 1. Run automated feature verification suite
npm test

# 2. Run code linter
npm run lint

# 3. Compile production bundle
npm run build
```

### Verified Test Results
- **Automated Test Suite (`npm test`)**: 8/8 suites passing (data integrity, localStorage persistence, add/edit/delete flows, sample data toggle, search/filtering, stats recalculation, and heuristic matcher).
- **Linter (`npm run lint`)**: 0 warnings, 0 errors across 14 files.
- **Production Build (`npm run build`)**: Compiled bundle in 1.3s with zero build warnings.

---

## 🔒 Security & Privacy

- **Zero Hardcoded Secrets**: No API keys, credentials, or `.env` files are committed.
- **Client-Side Storage**: Applications and the optional Gemini API key are stored strictly in the user's browser `localStorage`.
- **Strict `.gitignore`**: Excludes `node_modules/`, `dist/`, `.env`, `.env.*`, and sensitive keys.

---

## 📋 Project Status & Gap Analysis

To maintain complete engineering honesty for portfolio presentation:

### ✅ Currently Implemented & Verified
- Complete client-side Single Page Application (SPA).
- Responsive UI across desktop and mobile screens.
- Full CRUD with form validation and confirmation modals.
- Real-time search, multi-criteria filtering, and dual view modes.
- Sample data tagging (`[Sample]` badge) with clear and restore controls.
- Transparent Job Matcher (local heuristic demo engine + optional client Gemini API connection).
- Persistent state management via browser `localStorage`.

### ⏳ Remaining Work for Full-Stack Cloud Deployment
- **Backend Server**: No Express or Node REST API server is currently configured.
- **Remote Database**: No cloud database (e.g., MongoDB, PostgreSQL, or Supabase) is currently connected; data resides in `localStorage`.
- **User Authentication**: No user login, registration, or session tokens (JWT/OAuth) are implemented.
- **Live Hosting**: The project is verified for production building, but has not yet been deployed to a hosting service (e.g., Vercel, Netlify, or Cloudflare Pages).
