---
description: Analyze user query and codebase to pick the best approach.
---

## User Input

```text
$ARGUMENTS
```

## Purpose

Help the user pick the right approach: write a spec, create a plan, or start coding.

## Steps

1. **Read the user's query** above.
   - If empty: Ask what they want to build.

2. **Classify the request**:
   - New feature or enhancement?
   - Bug fix or small change?
   - Refactor or architecture change?

3. **Explore the codebase**:
   - Find related code and patterns
   - Check dependencies
   - Count affected files
   - Look for tests

4. **Pick a strategy**:

   ### Spec First
   **When:** Requirements are unclear.
   Define WHAT to build.

   ### Plan First
   **When:** Requirements are clear but the work is complex.
   Define HOW to build it.

   ### Implementation
   **When:** Clear and simple.
   Use `/ultrathink` and start coding.

5. **Share your recommendation**:

   ```
   ## Analysis

   [What the user wants + what you found in the code]

   ## Assessment

   - Clarity: [Clear / Unclear]
   - Simple: [Yes / No]

   ## Recommendation: [Spec / Plan / Implementation]

   [Why this approach fits best]

   ## Next Steps

   [What to do now]
   ```

## Decision Matrix

| Clarity | Simple? | Recommendation |
|---------|---------|----------------|
| Unclear | -       | Spec First     |
| Clear   | No      | Plan First     |
| Clear   | Yes     | Implementation |

## Global Rules

1. **Use local source code.** Never fetch source from the web. Read from site-packages, node_modules, or vendor directories.

2. **Debug with logs, not guesses.** Set up logging. Demand access to logs. Find the root cause before fixing.

3. **Prefer smaller code over backwards compatibility.** Delete deprecated code. Don't add shims or fallbacks.

4. **Write DRY code.** Extract shared logic. Avoid copy-paste.

5. **Build deep modules.** Simple interface, complex implementation. Hide details that might change. Avoid shallow wrappers that just pass data through.
