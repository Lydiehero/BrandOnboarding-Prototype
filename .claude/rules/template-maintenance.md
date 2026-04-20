# Template Maintenance (Developer Only)

This repo is the source of truth for all DS prototype repos. Child repos receive infrastructure files via sync.

## Sync Workflow

1. Make changes here in `ds-prototype-template`
2. Run `bash scripts/sync-to-children.sh` — copies files to all child repos
3. Review changes in each child repo, commit and push

## What Gets Synced

See the `MANIFEST` array in `scripts/sync-to-children.sh`. Currently:

- `CLAUDE.md` — framework docs, component rules, styling guide
- `.claude/settings.json` — permissions and hooks
- `.claude/skills/setup/SKILL.md` — interactive setup flow
- `.env.example` — USER_ROLE persona config
- `.github/workflows/deploy-pages.yml` — CI/CD with auto base path detection
- `index.html` — includes SPA redirect restore script
- `public/404.html` — GitHub Pages SPA redirect
- `scripts/inject-persona.sh` — persona hook (designer/developer)
- `scripts/setup.sh` — shell setup with persona question
- `vite.config.ts` — Vite config with VITE_BASE_PATH
- `src/llms-component-catalog.md` — component API docs for Claude

## What Does NOT Sync

- Pages (`src/pages/`) — unique per prototype
- Data (`src/data/`) — unique per prototype
- Sidebar nav (`ConnectedSidebar.vue`, `AppSidebar.vue`) — unique per prototype
- Router (`src/router.ts`) — unique per prototype
- `.claude/rules/` — project-specific instructions (this file!)
- `.env` — local persona setting (gitignored)

## Child Repos

Defined in `scripts/sync-to-children.sh` → `CHILDREN` array. Currently:
- `../factoring_prototype`
- `../factoring-prototype`
- `../paymentdashboard_prototype`

Add new repos there when creating new prototypes.

## Adding a New Synced File

1. Add the file path to the `MANIFEST` array in `scripts/sync-to-children.sh`
2. Run the sync script to propagate

## Project-Specific Instructions

Each child repo can have its own `.claude/rules/*.md` files for project-specific context. These are loaded by Claude alongside the synced CLAUDE.md. Encourage designers to create rules like:
- `.claude/rules/project-context.md` — what this prototype is about
- `.claude/rules/design-decisions.md` — specific design choices

## Persona System

`.env` file with `USER_ROLE=designer|developer` controls Claude's output style:
- **designer** (default): plain language, no jargon, technical steps handled silently
- **developer**: file references, architecture details, terminal output shown
- Set during `/setup` or by editing `.env` directly
- Read by `scripts/inject-persona.sh` via UserPromptSubmit hook
