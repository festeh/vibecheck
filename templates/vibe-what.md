---
description: Create a feature specification - define WHAT to build in plain language.
---

## User Input

```text
$ARGUMENTS
```

## Purpose

Write a clear spec that defines WHAT to build. No technical details. Anyone can read it.

## Plain Language Rules

Apply these while writing:
- Active voice: "Users create accounts" not "Accounts are created by users"
- Short sentences: <25 words average
- No jargon: Explain or avoid technical terms
- Direct verbs: "show" not "facilitate the display of"

## Steps

1. **Read the feature description** above.
   - If empty: Ask what they want to build.

2. **Create spec file** at `specs/[feature-name].md`:

```markdown
# [Feature Name]

## What Users Can Do

List each user story as a simple action:

1. **[Action]** - [One sentence describing what the user does and why]
   - Works when: [success scenario]
   - Fails when: [edge case]

2. **[Action]** - [Description]
   - Works when: [success scenario]
   - Fails when: [edge case]

## Requirements

What the system must do:

- [ ] [Requirement in plain language]
- [ ] [Requirement in plain language]
- [ ] [Requirement in plain language]

## Success Looks Like

How we know it works:

- [Measurable outcome from user perspective]
- [Measurable outcome from user perspective]

## Open Questions

Things we need to clarify (max 3):

- [Question]
```

3. **Validate the spec**:
   - Can a non-technical person understand it?
   - Is every requirement testable?
   - No implementation details (no "API", "database", "React")?

4. **Report**: Show the file path and summary.

## Example

Input: "Users should be able to reset their password"

Output:
```markdown
# Password Reset

## What Users Can Do

1. **Request password reset** - User enters email to get a reset link
   - Works when: Email exists, link sent within 1 minute
   - Fails when: Email not found, show helpful message

2. **Set new password** - User clicks link and creates new password
   - Works when: Link valid, password meets rules, user logged in
   - Fails when: Link expired (after 24h), show "request new link"

## Requirements

- [ ] Reset link expires after 24 hours
- [ ] Password must be at least 8 characters
- [ ] User gets confirmation email after reset
- [ ] Old sessions log out after password change

## Success Looks Like

- 90% of users complete reset in under 3 minutes
- Support tickets for "can't login" drop by 50%

## Open Questions

- Should we require the old password if user is logged in?
```
