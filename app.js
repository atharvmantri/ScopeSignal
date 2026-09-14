const sampleBrief = `Build a mobile booking page for our salon. It should show services, prices, available times, and a WhatsApp button. Customers need to choose a service and preferred date, then send their name and phone number. We need it live by Friday and it must work on iPhone and Android. Use our existing logo and photos. The owner will review it on the staging URL.`;

const input = document.querySelector('#brief-input');
const charCount = document.querySelector('#char-count');
const sampleButton = document.querySelector('#sample-button');
const analyzeButton = document.querySelector('#analyze-button');
const emptyState = document.querySelector('#empty-state');
const results = document.querySelector('#results');
const outputTitle = document.querySelector('#output-title');
const statusDot = document.querySelector('#status-dot');

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
  const deliverables = unique([
    ...lines.filter((line) => /^(build|create|add|fix|ship|design|write|audit|review|set up|setup|integrate|connect|launch|make|deliver|implement|update)\b/i.test(line)),
    ...sentences.filter((sentence) => /\b(build|create|add|fix|ship|design|audit|review|integrate|connect|launch|implement)\b/i.test(sentence)).slice(0, 4),
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
  return { deliverables, acceptance, missing, riskSignals, score, summary };
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
    <article class="result-card"><div class="result-meta"><h3>Best next question</h3><span class="tag">next step</span></div><p>What is the smallest outcome we can accept as done, in which environment, by when, and for which payout?</p></article>`;
}

function renderPlaceholder() {
  emptyState.hidden = false;
  results.hidden = true;
  results.innerHTML = '';
  outputTitle.textContent = 'Your scope, clarified.';
  statusDot.classList.remove('ready');
}

input.addEventListener('input', updateCount);
sampleButton.addEventListener('click', () => {
  input.value = sampleBrief;
  updateCount();
  input.focus();
});
analyzeButton.addEventListener('click', () => {
  if (!input.value.trim()) {
    input.focus();
    return;
  }
  const analysis = analyzeBrief(input.value);
  emptyState.hidden = true;
  results.hidden = false;
  outputTitle.textContent = 'Your scope, clarified.';
  renderAnalysis(analysis);
  statusDot.classList.add('ready');
});

updateCount();
