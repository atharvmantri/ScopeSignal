# ScopeSignal

ScopeSignal turns a messy software brief into a decision-ready scope: likely deliverables, acceptance checks, missing context, and risk signals.

Live demo: https://scopesignal.vercel.app/

Worked example: https://scopesignal.vercel.app/?demo=1

Demo video: https://github.com/atharvmantri/ScopeSignal/releases/download/demo-2026-09-15/ScopeSignal-demo.mp4

Shareable pre-quote card: https://gist.github.com/atharvmantri/5df3843622528e985c9f01db5603de02

It is a local-first, dependency-free web app. Nothing is uploaded and the analysis runs in the browser.

## Need the first slice built?

Fastest path: a one-business-day Conversion rescue for one public CTA, form, or confirmation leak at INR 1,500–3,000 indicative. Start at https://www.atharv.me/paid-work.html. The existing diagnosis and micro-sprint routes below remain available.

After the brief is clear, I can take a bounded React/TypeScript/Next.js implementation or QA slice: up to 45 minutes of diagnosis at INR 750–1,500 indicative, or a 2–4 hour micro-sprint at INR 2,500–5,000 indicative. A parent/guardian handles agreement and payout where required. Work begins only after written scope, acceptance criteria, and payment terms are agreed; there is no unpaid trial.

## Why it exists

Small software projects often fail before the first commit because the brief mixes desired outcomes, implementation guesses, and missing decisions. ScopeSignal makes those gaps visible before work is promised.

## Run it

The app is static. From this directory, run:

```text
python -m http.server 4173
```

Then open `http://localhost:4173`.

## Features

- Paste a project brief or use the included example.
- Open the worked-example link to see the analyzer's output immediately.
- Extract likely deliverables and acceptance checks.
- Flag missing deadline, owner, environment, access, content, and budget details.
- Highlight vague language, urgency, multi-surface scope, and integration risk.
- Recommend a bounded first paid slice from the first deliverable and acceptance signal.
- Copy or download a concise Markdown scope note for the next conversation.
- Request a bounded paid implementation slice after the brief is clear.
- Keep all text in the browser; there is no network request or backend.

## Built with

HTML, CSS, and vanilla JavaScript. No framework, analytics, API key, or paid service is required.

## Hackathon build note

ScopeSignal was started on September 15, 2026 for the FirstCommit Beginner's Paradise hackathon. The core work is represented by multiple meaningful commits. The project is intended to be useful beyond the event: it is also a small, safe entry point for diagnosing software briefs before a paid implementation sprint.

## AI and attribution disclosure

AI assistance was used for brainstorming, implementation support, debugging, and copy editing. The project is dependency-free, the author reviewed the behavior, and the author is responsible for understanding and explaining the code. No external code or assets are included.

## License

MIT. See `LICENSE` for the full text.
