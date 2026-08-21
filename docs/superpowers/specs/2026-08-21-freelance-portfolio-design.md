# Freelance Portfolio Redesign — Design Spec

Date: 2026-08-21
Owner: Firdosh Ahmad
Repo: `ahmadfirdosh` (Remix + Vite, deployed on Cloudflare Pages)

## 1. Problem

The current site is a forked developer-portfolio template (HamishMW). It presents
2022–2023 university coursework — Anymart, Yumy, Snake, Simon, path visualizer —
while the owner's actual value is 18 months of production AI engineering
(multi-agent orchestration, MCP, RAG, AWS data pipelines) plus three years of
shipped client frontend work.

The result reads as a student portfolio applying for a job. The goal is a site
that sells freelance services.

## 2. Audience

Two buyers, one site. Do NOT build two sites.

**A. Local Dehradun / tier-2 businesses** — clinics, cafes, travel companies,
coaching centres, retail. Budget ₹15k–₹1.5L. Non-technical. On mid-range Android
over mobile data. They buy outcomes ("more customers"), not technology.

**B. Small agencies and studios** — white-label and subcontract work. Technical
buyers who understand React, Next.js, RAG, AWS. They buy reliability, turnaround,
and communication. Better client type: repeat work, no hand-holding, higher rates.

Deliberately out of scope for now: international/Upwork clients. The structure
should not have to be rebuilt to serve them later, but no copy is written for them.

## 3. Positioning

**Sell outcomes. Prove with depth.**

The AI/enterprise work is not the offer — it is the credibility that justifies
charging 2–3x the local market rate. A travel-company owner who cannot evaluate
"multi-agent orchestration" can still read "AI Engineer, Anthropic-certified,
IEEE-published, LeetCode top 6%" and conclude this person is above the ₹20k
web designer they were about to call.

Above the fold: plain business English, zero jargon.
One scroll down: all the technical weight, for buyer B and for trust with buyer A.

**Day-job handling:** real name, employers listed, experience shown. CTA language
is soft — "Let's talk", "Start a conversation" — never "Hire me" or
"Available for freelance". Reads as a professional portfolio, functions as a
sales page.

## 4. Information architecture

Four public pages plus one unlisted page.

| Route | Purpose |
|---|---|
| `/` | Sells. Hero → what I do → who I work with → featured work → credibility → CTA |
| `/work` | Proves. Categorized project index |
| `/services` | Explains scope, process, timelines. **No prices.** |
| `/contact` | Converts. WhatsApp / call booking / form |
| `/rate-card-fa26` | **Unlisted.** Full rate card. Not linked anywhere. |

`/articles` is removed (its MDX content is already deleted). Its nav slot
currently mislabeled "Experience" is replaced.

Navigation: `Work · Services · Contact`. Four items maximum.

### 4.1 Home page sections

1. **Hero** — headline in plain business language, one-line subhead placing him
   in Dehradun, single primary CTA.
2. **Credibility strip** — 3 years experience · AI Engineer · Anthropic certified ·
   IEEE published · LeetCode top 6%. Compact, one row on desktop, wraps on mobile.
3. **What I build** — three cards: Business Websites / Web Apps & Dashboards /
   AI Integration. Outcome-worded, not stack-worded.
4. **Who I work with** — two cards, the audience split made explicit:
   "Businesses" and "Agencies & Studios". Each routes to the relevant proof.
   This is the mechanism that serves both audiences without the site feeling
   scattered.
5. **Featured work** — three projects maximum, one from each category.
6. **Closing CTA** — WhatsApp primary.

## 5. Project categorization

Categories replace the current flat list. Latest and strongest work leads.

| Category | Projects |
|---|---|
| **AI & Automation** | Objs.ai, Research Agent, Ladder Brief, Servitium analytics dashboard, Handwritten digit recognition (TensorFlow.js, 99.74%) |
| **Client Products** | Preplix, FlexiPaisa, The Crazy Mountaineers |
| **Business Websites** | Yumy, SRA Hotel, Devbhoomi, Anymart |
| **Removed** | Snake game, Simon game, Solivagant, Path visualizer |

**Business Websites** ranks last of the three but is kept deliberately: local
buyer A relates far more to a restaurant or hotel site than to Objs.ai, so this
is the category that closes them. The work is dated, which section 6 addresses.

Removed items do not serve either buyer and dilute the AI work by adjacency.

The Servitium entry is described by capability, not by internal detail
(no proprietary architecture specifics, no client data references).

## 6. Demo work — modernized, not fabricated

Requirement was for additional showcase sites in target industries.

**Decision: rebuild existing real projects rather than invent fictional clients.**

Yumy (restaurant), SRA Hotel (hospitality), Devbhoomi (tourism) are already in the
exact industries local clients come from, and are already genuinely his work.
Rebuilt as polished modern static templates they look better than anything
fabricated, carry zero verification risk, and can then be sold as productized
packages ("Restaurant website, 10-day delivery").

These appear under **Business Websites** labeled as templates/concepts where they
are not live client deployments. No fictional client names, no fabricated
testimonials, no invented case-study metrics.

Scope note: rebuilding these is a separate follow-up project, not part of this
redesign. This spec only defines where they sit.

## 7. Hidden rate card

Route: `/rate-card-fa26` — single constant, trivially changed.

Requirements:
- Not present in `nav-data.js`, footer, or any internal link.
- `<meta name="robots" content="noindex, nofollow">` — requires extending
  `baseMeta()` in `app/utils/meta.js` with a `noIndex` option.
- NOT listed in `robots.txt` (listing it would reveal it). No robots.txt or
  sitemap currently exists in `public/`; none is added.
- Fully responsive: table layout on desktop, stacked cards on mobile.

Content: direct-to-business rates, agency/white-label rates, AI work priced
separately and higher, retainer options, and what is excluded from each tier.

**Known ceiling:** unlisted is not private. Anyone given the link can forward it.
Acceptable for a rate card. If real access control is ever needed, that is a
password gate, not a secret URL.

## 8. Visual and performance direction

**Remove the Three.js displacement sphere hero.** Primary reason is performance,
not taste: buyer A is on a mid-range Android phone on mobile data, and the WebGL
hero costs seconds of load and battery to produce an effect that signals
"developer portfolio" — the opposite of the positioning. Removing it also drops
`three` and `three-stdlib` from the critical path.

Replacement direction: editorial. Large typography, generous whitespace,
staggered scroll-triggered reveals, subtle hover states on cards and buttons.
Premium and eye-catching without reading as technical.

**No new dependencies.** `framer-motion` is already installed and covers every
animation required. Scroll reveals reuse the existing `IntersectionObserver`
pattern already in `home.jsx`.

Respect `prefers-reduced-motion` — the existing theme system already has hooks
for this and they must not be bypassed.

**Responsiveness is a hard requirement on every page**, including the hidden rate
card. Mobile-first: the majority of buyer A traffic is mobile.

## 9. Conversion

Three channels, ranked by context:

1. **WhatsApp click-to-chat** — primary CTA site-wide. `https://wa.me/917017282924`
   with a pre-filled message. Number confirmed publishable by owner.
   Converts substantially better than forms for Indian buyers.
2. **Call booking** — Cal.com embed or link, for buyers who want a scheduled call.
   Serves buyer B primarily.
3. **Form** — existing EmailJS-backed contact form, kept as fallback.

**Budget-range dropdown added to the form.** Since prices are not published, this
is the filter that keeps unqualified inquiries down without revealing rates.
Ranges only, optional field.

## 10. Out of scope

- Rebuilding Yumy / SRA / Devbhoomi as templates (follow-up project)
- Individual per-project case study pages
- Blog / articles
- CMS integration
- International-market copy or USD pricing
- Any fabricated client, testimonial, or case-study metric

## 11. Success criteria

1. A non-technical Dehradun business owner understands what is being sold within
   five seconds of landing, without encountering jargon.
2. An agency lead can find the technical stack and reliability signals within one
   scroll.
3. Home page is usable and fast on a mid-range Android over 4G; no WebGL on the
   critical path.
4. Every page, including `/rate-card-fa26`, is fully responsive from 320px up.
5. No price appears on any linked page.
6. `/rate-card-fa26` is reachable only by direct URL and carries `noindex`.
7. Nothing on the site asserts a client relationship or metric that did not occur.
