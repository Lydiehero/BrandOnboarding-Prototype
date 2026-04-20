#!/bin/bash
# Sync infrastructure files from ds-prototype-template to child repos.
# Run from the template root: bash scripts/sync-to-children.sh
set -e

TEMPLATE_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# ── Child repos (relative to template parent directory) ──
CHILDREN=(
  "../factoring_prototype"
  "../factoring-prototype"
  "../paymentdashboard_prototype"
)

# ── Files to sync (template is source of truth) ──
MANIFEST=(
  "CLAUDE.md"
  ".claude/settings.json"
  ".claude/skills/setup/SKILL.md"
  ".env.example"
  ".github/workflows/deploy-pages.yml"
  "index.html"
  "public/404.html"
  "scripts/inject-persona.sh"
  "scripts/setup.sh"
  "vite.config.ts"
  "src/llms-component-catalog.md"
  ".claude/skills/design-brainstorm/SKILL.md"
  ".claude/skills/design-brainstorm/references/techniques.md"
  ".claude/skills/design-brainstorm/references/nielsen-heuristics.md"
  ".claude/skills/design-brainstorm/references/cognitive-walkthrough-template.md"
  ".claude/skills/mermaidjs-v11/SKILL.md"
  ".claude/skills/mermaidjs-v11/references/cli-usage.md"
  ".claude/skills/mermaidjs-v11/references/configuration.md"
  ".claude/skills/mermaidjs-v11/references/diagram-types.md"
  ".claude/skills/mermaidjs-v11/references/examples.md"
  ".claude/skills/mermaidjs-v11/references/integration.md"
  ".claude/skills/guide/SKILL.md"
)

# ── Colors ──
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m'

echo "=== DS Prototype Template → Child Sync ==="
echo "Template: $TEMPLATE_DIR"
echo ""

TOTAL_CHANGED=0

for child_rel in "${CHILDREN[@]}"; do
  child_dir="$(cd "$TEMPLATE_DIR" && cd "$child_rel" 2>/dev/null && pwd)" || true
  if [ ! -d "$child_dir" ]; then
    echo -e "${YELLOW}SKIP${NC} $child_rel (not found)"
    echo ""
    continue
  fi

  repo_name="$(basename "$child_dir")"
  echo -e "── ${GREEN}$repo_name${NC} ──"
  changed=0

  for file in "${MANIFEST[@]}"; do
    src="$TEMPLATE_DIR/$file"
    dst="$child_dir/$file"

    # Skip if source doesn't exist
    if [ ! -f "$src" ]; then
      continue
    fi

    # Create parent directory if needed
    mkdir -p "$(dirname "$dst")"

    # Compare and copy if different
    if [ ! -f "$dst" ] || ! diff -q "$src" "$dst" > /dev/null 2>&1; then
      cp "$src" "$dst"
      # Preserve executable bit
      if [ -x "$src" ]; then
        chmod +x "$dst"
      fi
      echo -e "  ${GREEN}UPDATED${NC} $file"
      changed=$((changed + 1))
      TOTAL_CHANGED=$((TOTAL_CHANGED + 1))
    fi
  done

  if [ "$changed" -eq 0 ]; then
    echo "  (up to date)"
  else
    echo -e "  ${GREEN}$changed file(s) updated${NC}"
  fi
  echo ""
done

echo "=== Done: $TOTAL_CHANGED file(s) changed across all repos ==="

if [ "$TOTAL_CHANGED" -gt 0 ]; then
  echo ""
  echo "Next steps:"
  echo "  Review changes in each repo, then commit and push."
  echo "  Example: cd ../factoring_prototype && git add -A && git diff --cached --stat"
fi
