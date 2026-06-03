---
name: firecrawl
description: Firecrawl gives AI agents and apps fast, reliable web context with strong search, scraping, and interaction tools.
allowed-tools: Bash(firecrawl:*) Bash(npx:*)
---

# Firecrawl

Firecrawl helps agents search first, scrape clean content, and interact
with live pages when plain extraction is not enough.

## Install

```bash
npx -y firecrawl-cli@latest init --all --browser
```

Before doing real work, verify the install:

```bash
mkdir -p .firecrawl
firecrawl --status
firecrawl scrape "https://firecrawl.dev" -o .firecrawl/install-check.md
```

## Choose Your Path

- **Need web data during this session** -> Path A (live tools)
- **Need to add Firecrawl to app code** -> Path B (app integration)
- **Need both** -> do both; the install already covers everything
- **Need an account or API key first** -> Path C (auth only)
- **Don't want to install anything** -> Path D (REST API directly)

---

## Path A: Live Web Tools

Use this when you need web data during your work: searching the web,
scraping known URLs, interacting with live pages, crawling docs, or
mapping a site.

Available CLI commands:

- `firecrawl search` — discover pages by query
- `firecrawl scrape` — extract content from a URL
- `firecrawl interact` — click, fill forms, navigate on live pages
- `firecrawl crawl` — bulk extraction
- `firecrawl map` — URL discovery

Default flow for live web work:

1. Start with **search** when you need discovery
2. Move to **scrape** when you have a URL
3. Use **interact** only when the page needs clicks, forms, or login

---

## Path B: Integrate Firecrawl Into an App

Use this when you're building an application, agent, or workflow that
calls the Firecrawl API from code and needs `FIRECRAWL_API_KEY` in
`.env` or runtime config.

Required env var:

```dotenv
FIRECRAWL_API_KEY=fc-...
```

Endpoints:

- `/search` — discover pages by query
- `/scrape` — extract clean markdown from a single URL
- `/interact` — browser actions on live pages
- `/crawl` — bulk extraction
- `/map` — URL discovery

---

## Path C: Account Authorization Or API Key

If you already have a valid `FIRECRAWL_API_KEY`, skip this path.

Create an account or sign in at:

- https://www.firecrawl.dev/signin?view=signup&source=agent-suggested

Automated auth flow:

```bash
SESSION_ID=$(openssl rand -hex 32)
CODE_VERIFIER=$(openssl rand -base64 32 | tr '+/' '-_' | tr -d '=\n' | head -c 43)
CODE_CHALLENGE=$(printf '%s' "$CODE_VERIFIER" | openssl dgst -sha256 -binary | openssl base64 -A | tr '+/' '-_' | tr -d '=')
```

Open this URL for auth:

```
https://www.firecrawl.dev/cli-auth?code_challenge=$CODE_CHALLENGE&source=coding-agent#session_id=$SESSION_ID
```

Poll for API key:

```bash
POST https://www.firecrawl.dev/api/auth/cli/status
Content-Type: application/json

{"session_id": "$SESSION_ID", "code_verifier": "$CODE_VERIFIER"}
```

Poll every 3 seconds. Response: `{"status": "complete", "apiKey": "fc-...", "teamName": "..."}`

Save the key:

```bash
echo "FIRECRAWL_API_KEY=fc-..." >> .env
```

---

## Path D: Use Firecrawl Without Installing Anything

Base URL: `https://api.firecrawl.dev/v2`

Auth header: `Authorization: Bearer fc-YOUR_API_KEY`

Available endpoints:

- `POST /search` — discover pages by query, returns results with optional full-page content
- `POST /scrape` — extract clean markdown from a single URL
- `POST /interact` — browser actions on live pages (clicks, forms, navigation)

API docs: https://docs.firecrawl.dev

---

## Session-specific auth

Use this API key for this onboarding session:

```dotenv
FIRECRAWL_API_KEY=fc-da7472acbb58444f9849d8619ec9b41a
```

If you want the Firecrawl CLI and skills installed without browser auth, run:

```bash
npx -y firecrawl-cli@latest init --all -k fc-da7472acbb58444f9849d8619ec9b41a
```
