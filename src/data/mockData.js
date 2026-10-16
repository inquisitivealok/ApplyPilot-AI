export const INITIAL_APPLICATIONS = [
  {
    id: "app-1",
    company: "Stripe",
    jobTitle: "Senior Frontend Engineer",
    status: "Interview",
    dateApplied: "2026-10-12",
    location: "Remote (US/Global)",
    workType: "Remote",
    salary: "$160,000 - $195,000",
    jobUrl: "https://stripe.com/jobs",
    tags: ["React", "TypeScript", "Design Systems"],
    notes: "Completed 45m screen with engineering manager. System architecture round scheduled for Tuesday at 2 PM PST.",
    priority: "High",
    color: "#6366f1",
    isSample: true
  },
  {
    id: "app-2",
    company: "Linear",
    jobTitle: "Product Engineer (Frontend)",
    status: "Offer",
    dateApplied: "2026-10-02",
    location: "San Francisco, CA / Remote",
    workType: "Hybrid",
    salary: "$165,000 + 0.15% Equity",
    jobUrl: "https://linear.app/careers",
    tags: ["React", "GraphQL", "Performance", "WebSockets"],
    notes: "Official offer letter received! 401(k) match, unlimited PTO, high equipment budget. Decision deadline in 8 days.",
    priority: "High",
    color: "#8b5cf6",
    isSample: true
  },
  {
    id: "app-3",
    company: "Netflix",
    jobTitle: "Software Engineer II - UI Experience",
    status: "Applied",
    dateApplied: "2026-10-15",
    location: "Los Gatos, CA",
    workType: "Hybrid",
    salary: "$190,000 - $225,000",
    jobUrl: "https://jobs.netflix.com",
    tags: ["React", "Node.js", "A/B Testing"],
    notes: "Applied with employee referral from Sarah L. Tailored resume highlighting video rendering & performance metrics.",
    priority: "Medium",
    color: "#e50914",
    isSample: true
  },
  {
    id: "app-4",
    company: "Vercel",
    jobTitle: "Developer Experience Engineer",
    status: "Interview",
    dateApplied: "2026-10-08",
    location: "Remote",
    workType: "Remote",
    salary: "$145,000 - $175,000",
    jobUrl: "https://vercel.com/careers",
    tags: ["Next.js", "Vite", "Edge Runtime", "Open Source"],
    notes: "Take-home code challenge completed & submitted with test coverage. Pair programming session set for Friday.",
    priority: "High",
    color: "#000000",
    isSample: true
  },
  {
    id: "app-5",
    company: "Datadog",
    jobTitle: "Fullstack Solutions Engineer",
    status: "Rejected",
    dateApplied: "2026-09-24",
    location: "New York, NY",
    workType: "On-site",
    salary: "$150,000 - $180,000",
    jobUrl: "https://www.datadoghq.com/careers",
    tags: ["Python", "React", "Cloud Monitoring"],
    notes: "Position filled internally. Recruiter reached out with positive feedback and encouraged reapplying in Q1.",
    priority: "Low",
    color: "#7742d6",
    isSample: true
  },
  {
    id: "app-6",
    company: "Supabase",
    jobTitle: "UI Engineer (Cloud Dashboard)",
    status: "Applied",
    dateApplied: "2026-10-14",
    location: "Remote",
    workType: "Remote",
    salary: "$140,000 - $165,000",
    jobUrl: "https://supabase.com/careers",
    tags: ["TypeScript", "TailwindCSS", "PostgreSQL", "React"],
    notes: "Submitted application via public job board. Linked open source dashboard contributions and GitHub repo.",
    priority: "Medium",
    color: "#3ecf8e",
    isSample: true
  }
];

export const SAMPLE_JOB_DESCRIPTIONS = [
  {
    title: "Senior React / Frontend Engineer @ Stripe",
    company: "Stripe",
    text: `About the Role:
We are looking for an experienced Frontend Engineer to build high-leverage UI infrastructure and customer-facing dashboard experiences for Stripe Billing and Payments.

What You Will Do:
- Architect, build, and maintain high-scale web applications using React, modern JavaScript/TypeScript, and CSS.
- Collaborate with designers and product managers to deliver seamless, accessible user interfaces (WCAG 2.1 compliance).
- Optimize client-side performance, core web vitals, bundle sizes, and state management.
- Write robust automated tests (unit, integration, and end-to-end) with Jest/Playwright.

Requirements:
- 4+ years of professional experience with React, TypeScript, and modern front-end build tools (Vite, Webpack).
- Deep understanding of browser APIs, CSS architectures, responsive layouts, and performance profiling.
- Strong product intuition and dedication to polished micro-interactions and developer experience.
- Experience with REST APIs, GraphQL, and async state caching (React Query / SWR).`
  },
  {
    title: "Fullstack AI Product Engineer @ OpenAI",
    company: "OpenAI",
    text: `About the Role:
Join the team creating the user-facing interfaces and platforms connecting millions of users to state-of-the-art intelligence models.

Key Responsibilities:
- Build low-latency, real-time web applications with streaming responses (WebSockets, Server-Sent Events).
- Develop intuitive interfaces for complex prompt engineering, agentic workflows, and multi-modal interactions.
- Work closely with machine learning researchers to deploy frontier models into production web apps.
- Implement security best practices, token management, and scalable cloud integrations.

Required Qualifications:
- Demonstrated experience in React, Next.js or Vite, Node.js, and Python.
- Hands-on experience integrating LLM APIs (streaming responses, function calling, embeddings).
- Familiarity with modern databases (PostgreSQL, Vector DBs) and cloud deployment (AWS/GCP/Vercel).
- Ability to rapidly prototype, iterate, and deliver high-impact software independently.`
  },
  {
    title: "Frontend Architect @ Linear",
    company: "Linear",
    text: `About Linear:
Linear is building the tool for modern software development. We obsess over speed, aesthetics, keyboard shortcuts, and craftsmanship.

What We Look For:
- Exceptional mastery of React, TypeScript, CSS, and modern web standards.
- Strong focus on 60fps animations, instant UI feedback, and offline-first state synchronization.
- Experience building complex desktop-grade web applications with keyboard-first navigation.
- Deep appreciation for typography, dark mode aesthetics, and micro-interactions.`
  }
];

export const STORAGE_KEY = "applypilot_applications_v1";

export function loadApplications() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_APPLICATIONS));
      return INITIAL_APPLICATIONS;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_APPLICATIONS;
  } catch (err) {
    console.error("Failed to load applications from localStorage:", err);
    return INITIAL_APPLICATIONS;
  }
}

export function saveApplications(applications) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
  } catch (err) {
    console.error("Failed to save applications to localStorage:", err);
  }
}
