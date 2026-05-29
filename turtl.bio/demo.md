# DEMO WORKFLOW — STEP BY STEP

Build this exactly. This is what a founder opens when they first land.
USER PERSONA IN THE DEMO
Name: Karl (or generic 'Founder-Scientist')
Situation: CSO of a small pre-IND biotech. Capsaicin-based suppository, 505(b)(2) pathway, novel indication. Has dog study data. Wondering if he needs a rodent GLP study and full organ histopathology.

## STEP 1: USER INPUTS THEIR QUESTION

UI element: Single input field. Placeholder text:
"Describe your regulatory question or situation..."

User types (or demo pre-fills):
"We're developing a capsaicin suppository under 505(b)(2). We've completed a 4-week GLP dog study looking at local GI organs (rectum, colon) since delivery is rectal and systemic exposure is minimal. Novel indication — bowel dysfunction in spinal cord injury patients. Do we need full histopathology on all organs? Do we need a rodent GLP study on top of the dog study?"

## STEP 2: TURTL IDENTIFIES THE REGULATORY ZONE

Product displays:
Regulatory Framework Identified:
☑ 505(b)(2) NDA pathway
☑ ICH M3(R2) — Nonclinical Safety Studies for Human Clinical Trials
☑ 21 CFR 312.23(a)(8) — IND Pharmacology/Toxicology information
☑ FDA Guidance: Nonclinical Safety Evaluation of Pharmaceutical Excipients

Grey Zone Classification: HIGH
Reason: 505(b)(2) waiver scope + route-of-administration novelty +
indication novelty = three compounding ambiguity factors.
FDA has discretion on study package. Written waiver required.

Design note: This panel should appear immediately, before any answer. It shows the user that Turtl understood their question at the regulatory structure level, not just keyword matching.
STEP 3: THE APPLICABILITY RULING
This is the core output. It answers the actual question.
Display two rulings side by side:

### RULING A — Histopathology scope

Question: Can we limit histopathology to rectum and colon?
Answer: NO — not without explicit FDA written agreement.

ICH M3(R2) Table 1 requires a full organ histopathology panel for repeat-dose tox studies supporting Phase 1. The 505(b)(2) pathway permits reliance on existing clinical safety data, but does not waive the nonclinical safety package unless FDA explicitly agrees in writing that the existing data is sufficient. A new route of administration (rectal) and a new indication (spinal cord injury bowel dysfunction) are typically sufficient to trigger a full nonclinical package review.

What you need to do:
Request FDA's written concurrence on a limited histopathology scope at your pre-IND meeting BEFORE running the study.
Do not assume the 505(b)(2) waiver extends to nonclinical studies. It typically does not without explicit FDA agreement.

### RULING B — Rodent study requirement

Question: Do we need a rodent GLP study in addition to the dog study?
Answer: LIKELY YES — unless FDA explicitly waives it at pre-IND.

FDA's standard nonclinical package for a Phase 1 IND supporting a novel indication requires at least two species: one rodent and one non-rodent. The dog study covers the non-rodent arm. Without a rodent study, the IND nonclinical section will have a gap that FDA will identify in their 30-day review. The only safe path to avoid the rodent study is a documented pre-IND agreement that existing capsaicin data in rodents is sufficient for the specific route and indication — which you do not currently have.

What you need to do:
Do not submit the IND without either (a) a complete rodent GLP study or (b) a written FDA statement from your pre-IND meeting accepting the existing capsaicin rodent data as sufficient.
Plan 6–9 months for the rodent study if FDA does not grant the waiver.

Design note: Each ruling should have a clear YES / NO / LIKELY header in large text. No hedging. No 'it depends' as the primary response. The 'it depends' is in the explanation — the ruling is the answer.
STEP 4: PRECEDENT PULL
Display: 'Relevant precedent cases'
Show 2–3 real examples (from FDA CDER database, publicly available).

Example format for each:
[Drug Name] — [Applicant] — [Year]
505(b)(2) with [similar condition]: [what FDA required or waived]
Source: [FDA review document link or citation]

Real precedents to surface for this specific scenario:
Capsaicin topical patches (Qutenza, 2009 NDA) — FDA required full systemic safety data despite topical application and existing capsaicin literature. Prior precedent for FDA not accepting 'ubiquitous use' as a safety waiver.
505(b)(2) applications with novel routes: FDA has consistently required new nonclinical data when route substantially changes absorption profile, even for well-characterized compounds.

Design note: These should be real documents linked to FDA.gov or the public FDA Drugs@FDA database. Do not fabricate citations. If your data source doesn't have them yet, show the precedent search as a 'searching...' state and return a placeholder that says '[2 precedent cases found — tap to expand]', then show the actual text on expand.
STEP 5: PRE-IND MEETING PREP OUTPUT
Below the ruling, display:

"Questions to raise at your pre-IND meeting"

1. We have completed a 4-week GLP dog study in [route of admin]. We are
   requesting FDA concurrence that this study, combined with existing published
   capsaicin safety data, is sufficient to waive the rodent GLP study requirement.
   Please confirm whether FDA accepts this or whether a rodent study is required.

2. We are requesting FDA concurrence that histopathology limited to the rectum
   and colon is acceptable given the local delivery route and evidence of minimal
   systemic absorption. Please confirm acceptable organ sampling scope.

3. If a rodent GLP study is required, please advise on acceptable study duration
   (14-day vs. 28-day) and whether the existing capsaicin rodent literature can
   be used to justify a reduced study design.

Design note: These should be formatted as draft text the user can copy directly into their pre-IND meeting request document. Make them copy-pasteable. This is a concrete, immediate deliverable.
STEP 6: COST + TIME CONSEQUENCE FLAG (optional, high-value)
Display at the bottom of the screen, styled as a warning:

If this question is not resolved before running the study: Running a GLP dog study without FDA written confirmation of accepted organ sampling scope risks rejection of the entire nonclinical package at the 30-day IND review.

Estimated cost of rerunning or supplementing: $150,000–$300,000
Estimated delay to IND submission: 6–9 months
Estimated delay to Phase 1 start: 9–12 months

This specific scenario has been documented in at least one founder-scientist interview during NYU Sprint 2026. The mistake is common. The prevention is a 30-minute pre-IND meeting question.

Design note: This panel should be collapsible. Default state: collapsed with just the ⚠ warning visible. On expand: full cost/time breakdown. This gives sophisticated users the option to skip it while making it visible to founders who don't understand the stakes.

## TECHNICAL REQUIREMENTS FOR THE DEVELOPER

### DATA SOURCES NEEDED (in order of priority)

1. ICH M3(R2) — full text
   Source: https://www.fda.gov/media/71542/download
   Use case: Step 2 framework identification, Step 3 rulings

2. 21 CFR 312.23(a)(8) — IND pharmacology/tox requirements
   Source: Electronic Code of Federal Regulations (eCFR)
   Use case: Step 2 framework, Step 3 RULING B

3. FDA CDER Drugs@FDA database — publicly available review documents
   Source: https://www.accessdata.fda.gov/scripts/cder/daf/
   Use case: Step 4 precedent pull
   Note: Pull NDA review packages for 505(b)(2) applications, specifically the pharmacology review section. These documents contain explicit FDA statements about what nonclinical data was accepted or waived and why.

4. FDA Guidance: Nonclinical Safety Evaluation of Reformulated Drug Products and Products Intended for Administration by an Alternate Route (2015)
   Source: https://www.fda.gov/media/88924/download
   Use case: Step 3 RULING A — directly addresses route changes

5. FDA Guidance: Applications Covered by Section 505(b)(2) (1999)
   Source: https://www.fda.gov/media/72419/download

Use case: Step 2 + Step 3 — defines what 505(b)(2) actually covers and what it does NOT automatically waive
CORE PRODUCT LOGIC (what the model needs to do)
Step 1 → Step 2: Parse user input for:
Drug type / compound class
Route of administration (novel vs. approved)
Indication (novel vs. approved)
Regulatory pathway (IND, NDA, 505(b)(2), ANDA, BLA)
Stage (pre-IND, IND-enabling, post-IND, etc.)
Specific question type (study requirement, waiver eligibility, meeting type, submission format, timeline, other)

Output: list of governing documents + grey zone classification score (LOW / MEDIUM / HIGH)
Step 2 → Step 3: For each governing document:
Find the applicable section
Extract the operative language ("should" vs. "must" vs. "may")
Apply the "should vs. must" distinction explicitly
Produce a YES / NO / LIKELY ruling with reasoning
Step 3 → Step 4: Query precedent database:
Filter by: pathway + compound class + route + question type
Return: 2–3 closest precedent cases with source citation
For each: what FDA required, what FDA waived, and why
Step 4 → Step 5: Generate pre-IND meeting questions:
Based on the rulings and gaps identified
Formatted as draft language the user can paste directly
KEY DESIGN CONSTRAINT: NO "IT DEPENDS" AS A PRIMARY ANSWER
The product must produce a ruling. "It depends" can appear in the explanation layer — but the headline answer must be directional:

YES — you need this
NO — you don't
LIKELY YES — assume you need it unless you get written confirmation
LIKELY NO — probably waived, but get written confirmation

Karl did not get written confirmation. That is why he paid $300,000. The product's job is to make sure the user knows they need the written confirmation before they spend the money.
