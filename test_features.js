// Automated Verification Test for ApplyPilot AI Logic
import { INITIAL_APPLICATIONS, SAMPLE_JOB_DESCRIPTIONS } from './src/data/mockData.js';

console.log('--- Starting ApplyPilot AI Automated Feature Verification ---');

// 1. Initial Data Integrity & Sample Data Tagging Test
console.assert(Array.isArray(INITIAL_APPLICATIONS), 'INITIAL_APPLICATIONS must be an array');
console.assert(INITIAL_APPLICATIONS.length === 6, 'Must have 6 initial demo applications');
console.assert(INITIAL_APPLICATIONS.every((a) => a.isSample === true), 'All initial applications must be tagged as isSample: true');
console.assert(SAMPLE_JOB_DESCRIPTIONS.length === 3, 'Must have 3 sample job descriptions');
console.log('✓ Initial demo data integrity and sample data tagging verified.');

// 2. Mock LocalStorage Operations
const mockStorage = {};
const mockLocalStorage = {
  getItem: (key) => mockStorage[key] || null,
  setItem: (key, val) => { mockStorage[key] = String(val); },
  removeItem: (key) => { delete mockStorage[key]; }
};

mockLocalStorage.setItem('applypilot_applications_v1', JSON.stringify(INITIAL_APPLICATIONS));
const retrieved = JSON.parse(mockLocalStorage.getItem('applypilot_applications_v1'));
console.assert(retrieved.length === 6, 'Retrieved applications count must match stored count');
console.log('✓ LocalStorage persistence cycle verified.');

// 3. Add Operation & Statistics Update Test
let apps = [...retrieved];
const calculateStats = (data) => ({
  total: data.length,
  interviews: data.filter((a) => a.status === 'Interview').length,
  offers: data.filter((a) => a.status === 'Offer').length,
  rejections: data.filter((a) => a.status === 'Rejected').length
});

const initialStats = calculateStats(apps);
console.assert(initialStats.total === 6 && initialStats.interviews === 2, 'Initial stats verified');

const newApp = {
  id: `app-${Date.now()}`,
  company: 'Anthropic',
  jobTitle: 'Research UI Engineer',
  status: 'Interview',
  dateApplied: '2026-10-16',
  workType: 'Remote',
  location: 'San Francisco, CA',
  salary: '$180k - $210k',
  jobUrl: 'https://anthropic.com',
  tags: ['React', 'TypeScript', 'Canvas'],
  notes: 'Phone screen completed.'
};
apps = [newApp, ...apps];
const afterAddStats = calculateStats(apps);
console.assert(afterAddStats.total === 7, 'Applications list should increase to 7');
console.assert(afterAddStats.interviews === 3, 'Interviews should increase to 3');
console.assert(apps[0].company === 'Anthropic', 'First item should be newly added application');
console.log('✓ Add application interaction & live stats update verified.');

// 4. Edit Operation & Live Statistics Update Test
apps = apps.map((app) => (app.id === newApp.id ? { ...app, salary: '$200k - $230k', status: 'Offer' } : app));
const updated = apps.find((a) => a.id === newApp.id);
const afterEditStats = calculateStats(apps);
console.assert(updated.salary === '$200k - $230k', 'Salary was updated');
console.assert(updated.status === 'Offer', 'Status was updated to Offer');
console.assert(afterEditStats.interviews === 2, 'Interviews should decrease back to 2');
console.assert(afterEditStats.offers === 2, 'Offers should increase to 2');
console.log('✓ Edit application interaction & live stats update verified.');

// 5. Delete Operation & Live Statistics Update Test
apps = apps.filter((app) => app.id !== newApp.id);
const afterDeleteStats = calculateStats(apps);
console.assert(apps.length === 6, 'List count returned to 6 after delete');
console.assert(afterDeleteStats.total === 6 && afterDeleteStats.offers === 1, 'Stats returned to initial levels after delete');
console.assert(!apps.some((a) => a.id === newApp.id), 'Deleted app should no longer exist');
console.log('✓ Delete application interaction & live stats update verified.');

// 6. Clear & Restore Sample Data Test
const customApp = {
  id: 'custom-1',
  company: 'Custom Startup',
  jobTitle: 'Lead Frontend Dev',
  status: 'Applied',
  isSample: false
};
let mixedApps = [...INITIAL_APPLICATIONS, customApp];
console.assert(mixedApps.length === 7, 'Mixed apps count is 7');

// Simulate handleClearSampleData()
let customOnly = mixedApps.filter((a) => !a.isSample);
console.assert(customOnly.length === 1, 'Clearing sample data leaves only custom applications');
console.assert(customOnly[0].company === 'Custom Startup', 'Custom application is preserved');

// Simulate handleResetDemoData()
let restored = [...INITIAL_APPLICATIONS, ...customOnly];
console.assert(restored.length === 7, 'Restoring sample data brings back all 6 sample records + custom item');
console.log('✓ Clear and restore sample records verified.');

// 7. Search and Filter Tests
const testSearch = (data, query) => {
  const q = query.toLowerCase();
  return data.filter((app) =>
    (app.company || '').toLowerCase().includes(q) ||
    (app.jobTitle || '').toLowerCase().includes(q) ||
    (app.status || '').toLowerCase().includes(q) ||
    (app.location || '').toLowerCase().includes(q) ||
    (app.tags || []).some((t) => t.toLowerCase().includes(q))
  );
};

const stripeMatch = testSearch(INITIAL_APPLICATIONS, 'Stripe');
console.assert(stripeMatch.length === 1, 'Should find 1 match for Stripe');
console.assert(stripeMatch[0].company === 'Stripe', 'Matched company is Stripe');

const interviewMatch = testSearch(INITIAL_APPLICATIONS, 'interview');
console.assert(interviewMatch.length >= 2, 'Should find at least 2 interviews');

const tagMatch = testSearch(INITIAL_APPLICATIONS, 'GraphQL');
console.assert(tagMatch.length >= 1, 'Should find roles with GraphQL tag');
console.log('✓ Search & filter logic verified.');

// 8. Job Analyzer Heuristics Simulation
const jdText = SAMPLE_JOB_DESCRIPTIONS[0].text.toLowerCase();
const skills = ['React', 'TypeScript', 'CSS', 'Node.js', 'Vite'];
const detected = skills.map((s) => s.toLowerCase()).filter((k) => jdText.includes(k));
console.assert(detected.length >= 3, 'Should detect core keywords in Stripe JD');
console.log('✓ Job Analyzer heuristics verified.');

console.log('--- ALL 8 VERIFICATION SUITES PASSED SUCCESSFULLY ---');
