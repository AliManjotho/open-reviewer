# Project Rules — Research Paper Review

This repository implements a deep review and audit pipeline for computer science research papers.

## Mandatory output qualities

1. Every issue must include:
   - id
   - category
   - severity
   - title
   - description
   - evidence
   - suggested_fix
   - confidence

2. Allowed severity values:
   - minor
   - major
   - critical

3. Distinguish clearly between:
   - what the paper states
   - what the evidence supports
   - what the pipeline infers

4. Use “insufficient evidence” instead of speculation.

5. Do not overwrite review artifacts unless explicitly instructed.
