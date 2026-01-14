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

3. **Write `specs/RULES.md`** with selected rules. Overwrite if exists.
