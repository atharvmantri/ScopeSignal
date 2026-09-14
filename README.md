# ScopeSignal

ScopeSignal turns a messy software brief into a decision-ready scope: likely deliverables, acceptance checks, missing context, and risk signals.

Live demo: https://scopesignal.vercel.app/

It is a local-first, dependency-free web app. Nothing is uploaded and the analysis runs in the browser.

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
- Extract likely deliverables and acceptance checks.
- Flag missing deadline, owner, environment, access, content, and budget details.
- Highlight vague language, urgency, multi-surface scope, and integration risk.
- Copy a concise scope note for the next conversation.
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
