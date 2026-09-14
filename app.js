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
  emptyState.hidden = true;
  results.hidden = false;
  outputTitle.textContent = 'Analysis is coming next.';
  results.innerHTML = '<div class="result-card"><h3>ScopeSignal is ready for your brief.</h3><p>The analysis engine will turn this text into deliverables, checks, missing decisions, and risk signals.</p></div>';
  statusDot.classList.add('ready');
});

updateCount();
