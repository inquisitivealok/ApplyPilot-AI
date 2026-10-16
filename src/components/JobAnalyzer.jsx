import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  PlusCircle,
  BookOpen,
  ArrowRight,
  TrendingUp,
  Cpu,
  Settings2,
  Key,
  ShieldCheck
} from 'lucide-react';
import { SAMPLE_JOB_DESCRIPTIONS } from '../data/mockData';

const GEMINI_STORAGE_KEY = 'applypilot_gemini_key';

export default function JobAnalyzer({ onAddToTracker, showToast }) {
  const [jobTitle, setJobTitle] = useState('Senior React / Frontend Engineer');
  const [company, setCompany] = useState('Stripe');
  const [jobText, setJobText] = useState(SAMPLE_JOB_DESCRIPTIONS[0].text);
  const [userSkills, setUserSkills] = useState(
    'React, JavaScript, TypeScript, HTML5, CSS3, Redux, REST APIs, Git, Vite, Responsive Design, Webpack'
  );

  // AI Configuration State
  const [apiKey, setApiKey] = useState(() => localStorage.getItem(GEMINI_STORAGE_KEY) || '');
  const [showConfig, setShowConfig] = useState(false);
  const [tempApiKey, setTempApiKey] = useState(apiKey);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // Load a pre-defined sample JD
  const handleLoadSample = (sample) => {
    setJobTitle(sample.title.split('@')[0].trim());
    setCompany(sample.company);
    setJobText(sample.text);
  };

  const handleSaveApiKey = () => {
    const trimmed = tempApiKey.trim();
    setApiKey(trimmed);
    if (trimmed) {
      localStorage.setItem(GEMINI_STORAGE_KEY, trimmed);
      showToast('Gemini API key saved! Live AI mode enabled.', 'success');
    } else {
      localStorage.removeItem(GEMINI_STORAGE_KEY);
      showToast('Switched to Smart Demo Mode.', 'info');
    }
    setShowConfig(false);
  };

  const handleClearApiKey = () => {
    setTempApiKey('');
    setApiKey('');
    localStorage.removeItem(GEMINI_STORAGE_KEY);
    showToast('API key removed. Running in Demo Mode.', 'info');
    setShowConfig(false);
  };

  // Run Local Smart Demo Analyzer
  const runDemoAnalysis = () => {
    const lowerJD = jobText.toLowerCase();
    const skillsArray = userSkills
      .split(',')
      .map((s) => s.trim().toLowerCase())
      .filter((s) => s.length > 0);

    const techGlossary = [
      'react', 'typescript', 'javascript', 'css', 'html',
      'next.js', 'vite', 'graphql', 'node.js', 'python',
      'testing', 'jest', 'playwright', 'websockets',
      'accessibility', 'wcag', 'performance', 'state management',
      'docker', 'tailwind', 'postgresql', 'cloud'
    ];

    const detectedInJD = techGlossary.filter((keyword) => lowerJD.includes(keyword));

    const matchedSkills = [];
    const missingSkills = [];

    detectedInJD.forEach((keyword) => {
      const hasSkill = skillsArray.some(
        (userSkill) => userSkill.includes(keyword) || keyword.includes(userSkill)
      );
      if (hasSkill) {
        matchedSkills.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      } else {
        missingSkills.push(keyword.charAt(0).toUpperCase() + keyword.slice(1));
      }
    });

    if (matchedSkills.length === 0) matchedSkills.push('React', 'Frontend Architecture', 'UI/UX Design');
    if (missingSkills.length === 0) missingSkills.push('GraphQL', 'Automated Testing', 'CI/CD Pipelines');

    const totalEvaluated = matchedSkills.length + missingSkills.length;
    const ratio = totalEvaluated > 0 ? matchedSkills.length / totalEvaluated : 0.8;
    const calculatedScore = Math.min(96, Math.max(68, Math.round(ratio * 100)));

    const generatedPitch = `Hi Hiring Team at ${company || 'your company'},

I came across the ${jobTitle || 'Engineer'} opening and wanted to introduce myself. With strong hands-on experience in ${matchedSkills.slice(0, 3).join(', ')}, I specialize in building responsive, high-performance web applications that scale seamlessly.

In particular, I noticed your focus on ${missingSkills[0] || 'delivering fast user interfaces'} and modern architecture. In my recent work, I've prioritized snappy micro-interactions, clean component hierarchies, and solid test coverage.

I'd love to chat about how my background aligns with ${company || 'the team'}'s current roadmap!

Best regards,
Alex Parker`;

    return {
      score: calculatedScore,
      matchedSkills,
      missingSkills,
      pitch: generatedPitch,
      recommendations: [
        `Target keywords: Ensure '${missingSkills.slice(0, 2).join(' and ')}' are prominently placed in your resume summary or recent experience bullets.`,
        `Quantify impact: E.g., 'Improved dashboard render speed by 35% through code splitting and memoization.'`,
        `Include a live demo: Hiring managers for ${company || 'this role'} value clickable portfolio projects with clean source code.`
      ],
      source: 'demo'
    };
  };

  // Perform Analysis (Live Gemini AI if configured, otherwise Smart Demo Mode)
  const handleAnalyze = async () => {
    if (!jobText.trim()) {
      showToast('Please provide a job description to analyze.', 'danger');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);

    // If API Key is present, try live Gemini API call
    if (apiKey) {
      try {
        const prompt = `Analyze this job posting for ${company} (${jobTitle}) against candidate skills: "${userSkills}".
Job Description:
${jobText}

Respond ONLY in valid raw JSON with this exact schema:
{
  "score": number between 60 and 98,
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["missingSkill1", "missingSkill2"],
  "recommendations": ["tip1", "tip2", "tip3"],
  "pitch": "A 3-paragraph tailored outreach cold pitch email from candidate Alex Parker to ${company}"
}`;

        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }]
            })
          }
        );

        if (!response.ok) {
          throw new Error(`Gemini API returned status ${response.status}`);
        }

        const data = await response.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
        const cleanJson = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanJson);

        setAnalysisResult({
          score: parsed.score || 85,
          matchedSkills: parsed.matchedSkills || ['React', 'JavaScript'],
          missingSkills: parsed.missingSkills || ['Testing', 'GraphQL'],
          recommendations: parsed.recommendations || ['Highlight relevant metrics'],
          pitch: parsed.pitch || '',
          source: 'gemini'
        });

        setIsAnalyzing(false);
        showToast('Live Gemini AI analysis completed!', 'success');
        return;
      } catch (err) {
        console.warn('Gemini API call failed, falling back to Demo Mode:', err);
        showToast('Gemini API error — fell back to Smart Demo Mode.', 'info');
      }
    }

    // Default: Smart Demo Heuristics
    setTimeout(() => {
      const demoResult = runDemoAnalysis();
      setAnalysisResult(demoResult);
      setIsAnalyzing(false);
      showToast('Analysis completed in Smart Demo Mode!', 'success');
    }, 600);
  };

  const handleCopyPitch = () => {
    if (analysisResult?.pitch) {
      navigator.clipboard.writeText(analysisResult.pitch);
      setCopiedPitch(true);
      showToast('Outreach pitch copied to clipboard!', 'info');
      setTimeout(() => setCopiedPitch(false), 2500);
    }
  };

  const handleTrackThisRole = () => {
    onAddToTracker({
      company: company || 'Analyzed Company',
      jobTitle: jobTitle || 'Frontend Engineer',
      status: 'Applied',
      tags: analysisResult?.matchedSkills?.slice(0, 4) || ['React', 'JavaScript'],
      notes: `AI Fit Score: ${analysisResult?.score || 85}%. Key targets: ${analysisResult?.missingSkills?.join(', ')}`
    });
    showToast(`Added ${company} to your application tracker!`, 'success');
  };

  return (
    <div className="analyzer-container">
      {/* AI Mode Banner with Explicit Demo Mode Indicator */}
      <div
        className="analyzer-banner"
        style={{
          background: apiKey
            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(99, 102, 241, 0.15) 100%)'
            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.15) 50%, rgba(236, 72, 153, 0.1) 100%)',
          borderColor: apiKey ? 'rgba(16, 185, 129, 0.3)' : 'rgba(99, 102, 241, 0.3)'
        }}
      >
        <div className="analyzer-banner-text">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            {apiKey ? (
              <span className="badge badge-offer">
                <ShieldCheck size={12} /> Live Gemini AI Connected
              </span>
            ) : (
              <span className="badge badge-interview">
                <Sparkles size={12} /> Smart Demo Mode (No API Key Required)
              </span>
            )}
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              {apiKey
                ? 'Using Google Gemini 2.5 Flash for deep real-time generation'
                : 'Offline ATS keyword extraction & matching heuristics active'}
            </span>
          </div>

          <h2>Smart Job Description & Resume Fit Analyzer</h2>
          <p>
            {apiKey
              ? 'Analyzing job descriptions and candidate qualifications via connected Google Gemini AI.'
              : 'ApplyPilot AI is running in offline Smart Demo Mode. It calculates candidate match density, uncovers missing keywords, and synthesizes tailored outreach pitches locally.'}
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => setShowConfig((prev) => !prev)}
            style={{ whiteSpace: 'nowrap' }}
          >
            <Settings2 size={15} />
            <span>{apiKey ? 'Manage AI Key' : 'Configure Gemini AI'}</span>
          </button>
        </div>
      </div>

      {/* Optional AI Configuration Drawer */}
      {showConfig && (
        <div
          className="card"
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px solid rgba(99, 102, 241, 0.3)',
            animation: 'fadeIn 0.2s ease'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.95rem' }}>
              <Key size={16} style={{ color: 'var(--primary)' }} />
              <span>Google Gemini API Configuration</span>
            </h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              Optional — Demo Mode works 100% without an API key
            </span>
          </div>

          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Enter your Google Gemini API key to enable live generative model responses. Your key is stored securely in your browser&apos;s localStorage and is never sent to any third-party server.
          </p>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <input
              type="password"
              className="form-input"
              style={{ flex: 1, minWidth: '240px' }}
              placeholder="Paste AI Studio Gemini API key (AIzaSy...)"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
            />
            <button className="btn btn-primary btn-sm" onClick={handleSaveApiKey}>
              Save & Enable Live AI
            </button>
            {apiKey && (
              <button className="btn btn-danger btn-sm" onClick={handleClearApiKey}>
                Reset to Demo Mode
              </button>
            )}
            <button className="btn btn-secondary btn-sm" onClick={() => setShowConfig(false)}>
              Close
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Input Form vs Results */}
      <div className="analyzer-grid">
        {/* Left Card: Input Form */}
        <div className="analyzer-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BookOpen size={18} style={{ color: 'var(--primary)' }} />
              <span>Job Details & Description</span>
            </h3>
          </div>

          {/* Quick Sample Selector */}
          <div className="analyzer-samples">
            <span className="analyzer-samples-label">Load Quick Industry Sample:</span>
            <div className="sample-btns">
              {SAMPLE_JOB_DESCRIPTIONS.map((sample, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="sample-chip"
                  onClick={() => handleLoadSample(sample)}
                >
                  {sample.company} ({sample.title.split('@')[0].trim()})
                </button>
              ))}
            </div>
          </div>

          {/* Company & Title */}
          <div className="form-grid-2">
            <div className="form-group">
              <label className="form-label">Company Name</label>
              <input
                type="text"
                className="form-input"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                placeholder="e.g. Stripe"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Target Role Title</label>
              <input
                type="text"
                className="form-input"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                placeholder="e.g. Senior Frontend Engineer"
              />
            </div>
          </div>

          {/* Job Description Text */}
          <div className="form-group">
            <label className="form-label">
              <span>Paste Job Description Text</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {jobText.length} characters
              </span>
            </label>
            <textarea
              className="form-textarea"
              style={{ minHeight: '170px', fontSize: '0.825rem' }}
              value={jobText}
              onChange={(e) => setJobText(e.target.value)}
              placeholder="Paste the full job posting, responsibilities, and requirements here..."
            />
          </div>

          {/* Candidate Skills Input */}
          <div className="form-group">
            <label className="form-label">
              <span>Your Skills & Technologies (For Matching)</span>
            </label>
            <input
              type="text"
              className="form-input"
              value={userSkills}
              onChange={(e) => setUserSkills(e.target.value)}
              placeholder="React, TypeScript, CSS, Node.js..."
            />
          </div>

          {/* Action Button */}
          <button
            className="btn btn-primary"
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            style={{ width: '100%', padding: '12px', fontSize: '0.95rem' }}
          >
            {isAnalyzing ? (
              <>
                <div className="pulse-spinner" style={{ width: '18px', height: '18px' }} />
                <span>
                  {apiKey ? 'Calling Gemini AI Model...' : 'Running Heuristic ATS Scan...'}
                </span>
              </>
            ) : (
              <>
                <Sparkles size={18} />
                <span>
                  {apiKey ? 'Run Live Gemini AI Analysis' : 'Run Smart Demo Analysis'}
                </span>
              </>
            )}
          </button>
        </div>

        {/* Right Card: AI Analysis Dashboard */}
        <div className="analyzer-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} style={{ color: '#818cf8' }} />
              <span>Match Intelligence & Action Plan</span>
            </h3>

            {analysisResult && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={handleTrackThisRole}
                title="Save this role directly to your Applications Tracker"
              >
                <PlusCircle size={14} />
                <span>Track This Job</span>
              </button>
            )}
          </div>

          {isAnalyzing ? (
            <div className="analyzing-box">
              <div className="pulse-spinner" />
              <p style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                {apiKey ? 'Querying Google Gemini AI...' : 'Analyzing job requirements & semantic fit...'}
              </p>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Checking hard skills, seniority indicators, and ATS keyword relevance
              </span>
            </div>
          ) : analysisResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Transparency Notice Box */}
              {analysisResult.source === 'demo' ? (
                <div
                  style={{
                    background: 'rgba(251, 191, 36, 0.08)',
                    border: '1px solid rgba(251, 191, 36, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '0.8rem',
                    color: '#fbbf24'
                  }}
                >
                  <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: '#fef3c7', marginBottom: '2px' }}>
                      Heuristic Rule-Based Match (Offline Demo Mode)
                    </strong>
                    This analysis was computed on your computer using local keyword density heuristics and template formatting. An external Large Language Model (LLM) was <strong>not</strong> queried. To run live LLM analysis, enter a Google Gemini API key above.
                  </div>
                </div>
              ) : (
                <div
                  style={{
                    background: 'rgba(52, 211, 153, 0.08)',
                    border: '1px solid rgba(52, 211, 153, 0.25)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '10px',
                    fontSize: '0.8rem',
                    color: '#34d399'
                  }}
                >
                  <ShieldCheck size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                  <div>
                    <strong style={{ display: 'block', color: '#d1fae5', marginBottom: '2px' }}>
                      Live Generative AI Output (Google Gemini 2.5 Flash)
                    </strong>
                    Generated in real-time by querying the official Google Gemini API using your browser-stored client key.
                  </div>
                </div>
              )}

              {/* Score Widget */}
              <div className="score-widget">
                <div className="score-circle">
                  <span className="score-number">{analysisResult.score}%</span>
                  <span className="score-label">Fit Score</span>
                </div>
                <div className="score-text">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <h4 style={{ margin: 0 }}>
                      {analysisResult.score >= 85
                        ? 'Strong Candidate Fit'
                        : 'Moderate Alignment - Action Recommended'}
                    </h4>
                    <span
                      className={`badge ${analysisResult.source === 'gemini' ? 'badge-offer' : 'badge-applied'}`}
                      style={{ fontSize: '0.65rem' }}
                    >
                      {analysisResult.source === 'gemini' ? 'Live Gemini 2.5' : 'Heuristic Demo'}
                    </span>
                  </div>
                  <p>
                    {analysisResult.score >= 85
                      ? 'Your profile strongly matches the primary technical requirements. Address the missing keywords to maximize recruiter callback rates.'
                      : 'You possess core competencies, but several prominent requirements from the posting need emphasis on your resume.'}
                  </p>
                </div>
              </div>

              {/* Matched Skills */}
              <div className="match-section">
                <span className="match-section-title">
                  <CheckCircle2 size={15} style={{ color: 'var(--status-offer)' }} />
                  Matched Keywords & Strengths ({analysisResult.matchedSkills.length})
                </span>
                <div className="skills-pill-group">
                  {analysisResult.matchedSkills.map((skill, idx) => (
                    <span key={idx} className="skill-pill matched">
                      <Check size={12} />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Skills / Gaps */}
              <div className="match-section">
                <span className="match-section-title">
                  <AlertCircle size={15} style={{ color: 'var(--status-interview)' }} />
                  Missing / Recommended Keywords ({analysisResult.missingSkills.length})
                </span>
                <div className="skills-pill-group">
                  {analysisResult.missingSkills.map((skill, idx) => (
                    <span key={idx} className="skill-pill missing">
                      + {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Recommendations */}
              <div className="match-section">
                <span className="match-section-title">
                  <TrendingUp size={15} style={{ color: 'var(--primary)' }} />
                  AI Optimization Tips
                </span>
                <div className="recommendations-list">
                  {analysisResult.recommendations.map((rec, idx) => (
                    <div key={idx} className="recommendation-item">
                      <ArrowRight size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
                      <span>{rec}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cold Email / Pitch Starter */}
              <div className="ai-pitch-box">
                <div className="ai-pitch-header">
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Tailored Cold Outreach Elevator Pitch
                  </span>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={handleCopyPitch}
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  >
                    {copiedPitch ? <Check size={13} style={{ color: 'var(--status-offer)' }} /> : <Copy size={13} />}
                    <span>{copiedPitch ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <div className="ai-pitch-text">{analysisResult.pitch}</div>
              </div>
            </div>
          ) : (
            <div className="empty-state" style={{ padding: '50px 20px' }}>
              <div className="empty-state-icon">
                <Sparkles size={26} />
              </div>
              <h3>Ready to analyze job description</h3>
              <p>
                Click &quot;Run Smart Demo Analysis&quot; to test instant keyword extraction and scoring, or configure an optional Gemini API key above.
              </p>
              <button className="btn btn-primary btn-sm" onClick={handleAnalyze}>
                Run Demo Analysis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
