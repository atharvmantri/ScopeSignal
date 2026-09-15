const sampleBrief = `Build a mobile booking page for our salon. It should show services, prices, available times, and a WhatsApp button. Customers need to choose a service and preferred date, then send their name and phone number. We need it live by Friday and it must work on iPhone and Android. Use our existing logo and photos. The owner will review it on the staging URL.`;

const input = document.querySelector('#brief-input');
const charCount = document.querySelector('#char-count');
const sampleButton = document.querySelector('#sample-button');
const analyzeButton = document.querySelector('#analyze-button');
const emptyState = document.querySelector('#empty-state');
const results = document.querySelector('#results');
const outputTitle = document.querySelector('#output-title');
const statusDot = document.querySelector('#status-dot');
const resultActions = document.querySelector('#result-actions');
const copyButton = document.querySelector('#copy-button');
const downloadButton = document.querySelector('#download-button');
const clearButton = document.querySelector('#clear-button');
const copyStatus = document.querySelector('#copy-status');
const conversionLink = document.querySelector('#conversion-link');
const conversionLabel = document.querySelector('#conversion-label');
const defaultConversionHref = conversionLink.getAttribute('href');
let latestAnalysis = null;

function updateCount() {
  const count = input.value.length;
  charCount.textContent = `${count.toLocaleString()} ${count === 1 ? 'character' : 'characters'}`;
}

function escapeHTML(value) {
  return value.replace(/[&<>'"]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[character]));
}

function unique(values) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function sentencesFrom(text) {
  return text.replace(/\r/g, '').split(/\n+/).flatMap((line) => line.split(/(?<=[.!?])\s+/)).map((sentence) => sentence.replace(/^[-*•\d.)\s]+/, '').trim()).filter((sentence) => sentence.length > 12);
}

function analyzeBrief(text) {
  const sentences = sentencesFrom(text);
  const lines = text.split(/\r?\n/).map((line) => line.replace(/^[-*•\d.)\s]+/, '').trim()).filter(Boolean);
  const deliverableStart = /^(build|create|add|fix|ship|design|write|audit|set up|setup|integrate|connect|launch|make|deliver|implement|update)\b/i;
  const deliverableNoun = /\b(page|component|screen|section|feature|fix|audit|report|integration|flow|checklist)\b/i;
  const deliverables = unique([
    ...sentences.filter((sentence) => deliverableStart.test(sentence)),
    ...sentences.filter((sentence) => deliverableNoun.test(sentence) && !/\b(owner|review|reviewer)\b/i.test(sentence)),
    ...lines.filter((line) => deliverableStart.test(line)).map((line) => line.split(/(?<=[.!?])\s+/)[0]),
  ]).slice(0, 5);
  const acceptance = unique(sentences.filter((sentence) => /\b(must|should|works? on|live by|choose|send|review|verify|expected|pass|support)\b/i.test(sentence))).slice(0, 5);
  const checks = [
    { label: 'Deadline', pattern: /\b(by|before|deadline|due|friday|monday|tuesday|wednesday|thursday|saturday|sunday|tomorrow|next week)\b/i },
    { label: 'Owner or reviewer', pattern: /\b(owner|review|reviewer|approve|stakeholder|client|team)\b/i },
    { label: 'Environment or viewport', pattern: /\b(staging|production|localhost|browser|chrome|safari|iphone|android|mobile|desktop|viewport|url)\b/i },
    { label: 'Access and credentials', pattern: /\b(access|credential|login|repository|repo|api key|token|account)\b/i },
    { label: 'Content or assets', pattern: /\b(content|copy|logo|photo|photos|image|asset|brand|text)\b/i },
    { label: 'Budget or payout', pattern: /\b(budget|price|pricing|cost|payout|payment|inr|usd|₹|\$)\b/i },
  ];
  const missing = checks.filter((check) => !check.pattern.test(text)).map((check) => check.label);
  const riskSignals = [];
  if (/\b(simple|easy|quick|soon|asap|etc|seamless|just)\b/i.test(text)) riskSignals.push('Vague or urgency language may hide effort.');
  if (/\b(whatsapp|api|payment|auth|login|database|analytics|integration|webhook)\b/i.test(text)) riskSignals.push('An integration or data boundary needs an explicit acceptance check.');
  if ((text.match(/\band\b/gi) || []).length >= 4) riskSignals.push('Several outcomes are joined together; split the first milestone.');
  if (sentences.length > 8 || text.length > 900) riskSignals.push('The brief is broad; choose one primary outcome for the first pass.');
  const score = Math.max(10, Math.min(98, 100 - missing.length * 10 - riskSignals.length * 7));
  const summary = score >= 75 ? 'A useful first scope is visible.' : score >= 50 ? 'The direction is visible, but a few decisions still affect the estimate.' : 'Clarify the missing decisions before promising a date or price.';
  const firstDeliverable = deliverables[0] || 'the smallest reviewable part of the requested outcome';
  const firstAcceptance = acceptance[0] || 'the reviewer can verify the requested behavior in the agreed environment';
  const firstSlice = `Start with ${firstDeliverable.replace(/[.!?]+$/, '')}. Done means: ${firstAcceptance.replace(/[.!?]+$/, '')}. Keep integrations, extra pages, and production access out of the first milestone until they are written down.`;
  return { deliverables, acceptance, missing, riskSignals, score, summary, firstSlice };
}

function listMarkup(items, fallback) {
  if (!items.length) return `<p>${escapeHTML(fallback)}</p>`;
  return `<ul>${items.map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`;
}

function renderAnalysis(analysis) {
  const riskCard = analysis.riskSignals.length ? `<article class="result-card warning"><div class="result-meta"><h3>Risk signals</h3><span class="tag">inspect</span></div>${listMarkup(analysis.riskSignals, '')}</article>` : '';
  const missingCard = analysis.missing.length ? `<article class="result-card warning"><div class="result-meta"><h3>Decisions still missing</h3><span class="tag">ask next</span></div>${listMarkup(analysis.missing, '')}</article>` : '<article class="result-card"><div class="result-meta"><h3>Decision check</h3><span class="tag">clear</span></div><p>The brief names the main handoff decisions ScopeSignal checks for. Confirm them in writing before work starts.</p></article>';
  results.innerHTML = `
    <article class="result-card accent"><div class="result-meta"><h3>${escapeHTML(analysis.summary)}</h3><span class="tag">${analysis.score}% clear</span></div><p>Use this as a conversation starter. It is a deterministic browser-side reading, not a promise about delivery time or cost.</p></article>
    <article class="result-card"><div class="result-meta"><h3>Likely deliverables</h3><span class="tag">output</span></div>${listMarkup(analysis.deliverables, 'No concrete deliverable was detected. Name the first thing that should exist at handoff.')}</article>
    <article class="result-card"><div class="result-meta"><h3>Acceptance checks</h3><span class="tag">done means</span></div>${listMarkup(analysis.acceptance, 'No explicit acceptance check was detected. Write what a reviewer should be able to verify.')}</article>
    ${missingCard}${riskCard}
    <article class="result-card slice"><div class="result-meta"><h3>Suggested first paid slice</h3><span class="tag">bound it</span></div><p>${escapeHTML(analysis.firstSlice)}</p></article>
    <article class="result-card"><div class="result-meta"><h3>Best next question</h3><span class="tag">next step</span></div><p>What is the smallest outcome we can accept as done, in which environment, by when, and for which payout?</p></article>`;
}

function reportMarkdown(analysis) {
  const section = (title, items, fallback) => `## ${title}\n${(items.length ? items : [fallback]).map((item) => `- ${item}`).join('\n')}`;
  return `# ScopeSignal note\n\n${analysis.summary} (${analysis.score}% clear)\n\n${section('Likely deliverables', analysis.deliverables, 'No concrete deliverable detected.')}\n\n${section('Acceptance checks', analysis.acceptance, 'No explicit acceptance check detected.')}\n\n${section('Decisions still missing', analysis.missing, 'None detected by the current checks.')}\n\n${section('Risk signals', analysis.riskSignals, 'None detected by the current checks.')}\n\n## Suggested first paid slice\n${analysis.firstSlice}\n\n## Best next question\nWhat is the smallest outcome we can accept as done, in which environment, by when, and for which payout?\n`;
}

function resetConversionLink() {
  conversionLink.setAttribute('href', defaultConversionHref);
  conversionLabel.textContent = 'Request a paid slice';
  conversionLink.setAttribute('aria-label', 'Request a paid implementation slice');
}

function updateConversionLink(analysis) {
  const body = [
    'Hi Atharv,',
    '',
    'I used ScopeSignal and would like to discuss a bounded paid implementation slice.',
    '',
    'Original brief:',
    input.value.trim(),
    '',
    'ScopeSignal note:',
    reportMarkdown(analysis),
    'Repo or page:',
    'Deadline:',
    'Payout terms:',
    '',
  ].join('\n');
  const handoffMessage = body.slice(0, 3900);
  conversionLink.setAttribute('href', `https://www.atharv.me/paid-work.html?scope=${encodeURIComponent(handoffMessage)}#brief`);
  conversionLabel.textContent = 'Request this paid slice';
  conversionLink.setAttribute('aria-label', 'Request this analyzed paid implementation slice');
}

function renderPlaceholder() {
  latestAnalysis = null;
  emptyState.hidden = false;
  results.hidden = true;
  resultActions.hidden = true;
  copyStatus.textContent = '';
  results.innerHTML = '';
  outputTitle.textContent = 'Your scope, clarified.';
  statusDot.classList.remove('ready');
}

input.addEventListener('input', () => {
  updateCount();
  resetConversionLink();
});
sampleButton.addEventListener('click', () => {
  input.value = sampleBrief;
  updateCount();
  resetConversionLink();
  input.focus();
});
analyzeButton.addEventListener('click', () => {
  if (!input.value.trim()) {
    input.focus();
    return;
  }
  const analysis = analyzeBrief(input.value);
  latestAnalysis = analysis;
  emptyState.hidden = true;
  results.hidden = false;
  resultActions.hidden = false;
  copyStatus.textContent = '';
  outputTitle.textContent = 'Your scope, clarified.';
  renderAnalysis(analysis);
  updateConversionLink(analysis);
  statusDot.classList.add('ready');
});

copyButton.addEventListener('click', async () => {
  if (!latestAnalysis) return;
  try {
    await navigator.clipboard.writeText(reportMarkdown(latestAnalysis));
    copyStatus.textContent = 'Copied.';
  } catch {
    copyStatus.textContent = 'Copy unavailable here; select the report manually.';
  }
});

downloadButton.addEventListener('click', () => {
  if (!latestAnalysis) return;
  const blob = new Blob([reportMarkdown(latestAnalysis)], { type: 'text/markdown;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'scopesignal-note.md';
  link.click();
  URL.revokeObjectURL(url);
  copyStatus.textContent = 'Downloaded.';
});

clearButton.addEventListener('click', () => {
  input.value = '';
  updateCount();
  renderPlaceholder();
  input.focus();
});

updateCount();

function loadDemoFromQuery() {
  const demo = new URLSearchParams(window.location.search).get('demo');
  if (demo !== '1') return;

  input.value = sampleBrief;
  updateCount();
  const analysis = analyzeBrief(input.value);
  latestAnalysis = analysis;
  emptyState.hidden = true;
  results.hidden = false;
  resultActions.hidden = false;
  copyStatus.textContent = '';
  outputTitle.textContent = 'Your scope, clarified.';
  renderAnalysis(analysis);
  updateConversionLink(analysis);
  statusDot.classList.add('ready');
}

loadDemoFromQuery();
