---
description: Initialize project rules from global config.
---

## User Input

```text
$ARGUMENTS
```

## Purpose

Set up project-level rules by copying global config to `specs/RULES.md`.

## Steps

1. **Check global rules** at `~/.config/vibecheck/rules.md`.
   - If missing: Tell the user to create it first.

2. **Scan the repo**:
   - Check if `specs/` directory exists
   - Check if `specs/RULES.md` already exists

3. **Create specs/RULES.md**:
   - Create `specs/` directory if needed
   - Copy global rules content
   - Add project-specific header

4. **Report what was done**:
   ```
   Created: specs/RULES.md

   Rules copied from: ~/.config/vibecheck/rules.md

   You can edit specs/RULES.md to add project-specific rules.
   ```

## Output Format

The `specs/RULES.md` file should look like:

```markdown
# Project Rules

> Copied from ~/.config/vibecheck/rules.md
> Edit this file to add project-specific rules.

[content from global rules.md]
```

## If RULES.md Already Exists

Ask the user:
- Overwrite with global rules?
- Merge (append new rules)?
- Cancel?
