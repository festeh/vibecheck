---
description: Initialize project rules from global config.
---

## User Input

```text
$ARGUMENTS
```

## Purpose

Set up project-level rules by selecting from global config.

## Steps

1. **Read global rules** from `~/.config/vibecheck/rules.md`.
   - If missing: Tell the user to create it first.

2. **List each rule** and ask the user which to include:
   - Show each rule with a number
   - Ask: "Which rules do you want for this project? (e.g., 1,3,5 or all)"

3. **For rules that say "If included:"**, scan the repo to fill in project-specific details automatically.

4. **Scan the repo**:
   - Check if `specs/` directory exists
   - Check if `specs/RULES.md` already exists

5. **Create specs/RULES.md**:
   - Create `specs/` directory if needed
   - Write only selected rules
   - Include project-specific details where needed

## Output Format

```markdown
# Project Rules

[selected rules with project-specific details filled in]
```

## Example

User selects rules 1 and 4. Rule 1 has "If included: specify source directories", so scan repo and find `node_modules/`:

```markdown
# Project Rules

1. **Use local source code.** Never fetch source from the web. Read from: `node_modules/`.

4. **Write DRY code.** Extract shared logic. Avoid copy-paste.
```

## If RULES.md Already Exists

Ask the user:
- Overwrite?
- Merge (append new rules)?
- Cancel?
