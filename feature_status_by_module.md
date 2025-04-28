# AccordifyAI – Feature Implementation & Priority Matrix (by Module)

_Last updated: 2025-04-29_

This document consolidates the current implementation status of AccordifyAI, grouped into three strategic product modules:

1. **SaaS Platform (Core CLM)**  – user, billing & operational capabilities
2. **Contract IDE**              – specialised editor & document tools
3. **AI Agent**                  – language-model driven intelligence

Status legend | Meaning
--------------|---------
✅ Implemented | Feature is fully functional & available in the codebase
🔄 Partial     | Feature exists but is incomplete / needs refinement
❌ Missing     | Feature is not yet present
🚧 WIP         | Active branch / early scaffold detected

---

## 1. SaaS Platform (Core CLM)
| Capability | Status | Evidence / Notes |
|------------|--------|------------------|
| User registration & login | 🔄 | Supabase auth configured; UI flows partially wired (no dedicated forms). |
| Profile / settings pages  | ❌ | Routes exist (`/profile`, `/settings`) but no components. |
| Team / workspace   | 🔄 | DB tables & basic route; UI not complete. |
| Roles / permissions | 🔄 | Enum in DB; role enforcement missing in UI. |
| Subscription billing (Stripe) | ❌ | No Stripe code found in `src/`; `/billing` route empty. |
| Usage analytics & audit log | 🔄 | `activities` table created; admin UI absent. |
| Template marketplace | 🔄 | `/templates` route + placeholder components. |
| Blog & marketing pages | 🔄 | Routes for `/blog`, `/pricing`; templates missing. |
| Landing page modernised | ✅ | New hero, use-cases, testimonials, CTA, footer implemented. |
| File storage (uploads) | 🔄 | Supabase bucket configured; UI limited to `DocumentUploader.tsx`. |
| E-signature basic flow  | 🔄 | `SignatureRequestModal` integrated; multi-signer & cert verification missing. |
| Real-time collaboration | ❌ | No WebSocket / Supabase realtime hooks present. |
| Admin dashboards        | ❌ | No dedicated admin views. |

---

## 2. Contract IDE
| Capability | Status | Evidence / Notes |
|------------|--------|------------------|
| Purpose-built document model | 🔄 | `formatContractForEditor` assembles markdown; hierarchical state incomplete. |
| Clause-aware editing | 🔄 | TipTap editor with variable highlighting; drag-drop / modular clauses missing. |
| Automatic numbering | ❌ | Not in editor extension list. |
| Defined term highlighting | 🚧 | VariableHighlighter exists; defined-term logic TODO. |
| Section folding / outline  | ❌ | No tree view; some TODO comments. |
| Syntax highlighting engine | ❌ | Generic TipTap styling only. |
| Template save / load       | ❌ | No API or UI actions. |
| Document explorer panel    | 🚧 | Stubs for outline component; not rendered. |
| Risk flagging in-editor     | ❌ | Analysis results shown separately, not inline. |
| Multi-format export (DOCX/PDF) | 🔄 | `exportToPdf` util exists; DOCX not implemented. |
| Basic commenting           | ❌ | No comment UI. |
| Print & zoom controls      | ✅ | Toolbar buttons implemented. |
| Left-aligned content       | ✅ | Global CSS fix per user preference. |
| Modern design system       | ✅ | `design-system.css`, Tailwind tokens applied. |

---

## 3. AI Agent
| Capability | Status | Evidence / Notes |
|------------|--------|------------------|
| Chat interface (multi-mode) | ✅ | `ChatInputArea`, `MessagesList`, AI modes implemented. |
| Contract summarisation      | ✅ | Serverless `summary` analysis + UI modal (action points, key terms, dates). |
| Contract generation (outline → sections) | 🔄 | Supabase function with retries & fallbacks; content quality varies. |
| Risk analysis & classification | 🔄 | Backend scaffolding; UI heat-map absent. |
| Clause suggestions / autocomplete | ❌ | No inline suggestions. |
| NDA & Shareholder specialisation | ✅ | Custom parsers & formatters working. |
| Variable extraction / highlight | ✅ | `[variable]` & `{{variable}}` detection in TipTap. |
| Multi-agent orchestration (RAG) | ❌ | Not yet in codebase; only single prompt functions. |
| Hallucination prevention guardrails | ❌ | No explicit mechanism. |
| Tool calling / dynamic planning | ❌ | Absent. |
| Usage analytics for AI responses | ❌ | Not implemented. |

---

## 4. Priority Roadmap (MVP-first)
Priority legend: **P0** must-have for Day-1 MVP, **P1** high soon after launch, **P2** nice-to-have.

| Module | Feature | Current | Priority | Rationale |
|--------|---------|---------|----------|-----------|
| SaaS | Complete auth flows (signup, login, reset) | 🔄 | **P0** | Blocker for any user access. |
| SaaS | Billing & subscription (Stripe)           | ❌ | **P0** | Revenue + plan gating. |
| SaaS | Profile / settings UI                     | ❌ | P1 | Improves user control but not blocker. |
| SaaS | Team / workspace CRUD                     | 🔄 | P1 | Key for multi-user value prop. |
| Contract IDE | Document outline & section folding | ❌ | **P0** | Core navigation usability. |
| Contract IDE | Clause-aware editing & numbering  | 🔄 | **P0** | Differentiator vs generic editors. |
| Contract IDE | Defined term highlighting         | 🚧 | **P0** | Demonstrates legal focus. |
| Contract IDE | Basic template save/load          | ❌ | P1 | Efficiency booster. |
| AI Agent | Risk flagging inline                  | 🔄 | **P0** | Delivers AI insight promise. |
| AI Agent | Improve section generation quality    | 🔄 | **P0** | Ensures usable contracts. |
| AI Agent | Clause suggestion autocomplete        | ❌ | P1 | Drives productivity. |
| AI Agent | RAG / Multi-agent framework           | ❌ | P2 | Long-term differentiator. |
| SaaS | E-signature multi-signer flow             | 🔄 | P1 | Completes lifecycle. |
| SaaS | Analytics dashboard                       | ❌ | P2 | Post-MVP engagement metric. |
| Contract IDE | Multi-format DOCX export          | 🔄 | P2 | Nice for enterprise; PDF sufficient MVP. |

---

## 5. Gap Analysis vs. Strategic Docs
* `features.md` (2025-04-04) is largely **aligned** but out-dated on:
  * Landing page modernisation – now ✅
  * NDA/Shareholder generation fixes – now ✅
* `IDE.md` must-have items #1-#4 remain partial; numbering & outline still missing ⇒ **top priorities**.
* `PRD.md` Phase-1 goals map to P0 list above; billing integration is missing and must be accelerated.

### Key Risks
* Over-investing in advanced AI before core CLM flows (billing & auth) are production-ready.
* Editor usability will lag without outline & numbering – users may churn.

### Recommendations
1. **Sprint-lock P0 list** – no new features until complete.
2. Parallel tracks: _Frontend_ (IDE/ui), _Backend_ (billing/auth), _AI_ (risk flag refinement).
3. Establish automated status dashboard to keep this file up-to-date each release.

---

_End of report_
