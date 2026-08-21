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

### 8.1 References

Two references were supplied and analysed:

- **okaydev.co** — full-bleed colour-block sections, scrolling marquee band,
  oversized display type, 3-up card rows, FAQ accordion, hard-edged pill buttons.
  Energy: high. Palette (acid green / electric purple / neon yellow) rejected —
  reads "creative agency for creative people" to buyer A, and dark-dominant
  sections read "techy" to exactly the buyer being targeted.
- **themewagon Noah** — cream editorial layout, serif display type, enormous
  whitespace, oversized low-contrast ghost section headings, letterspaced
  small-caps eyebrow labels, image + overlapping caption-card project layout,
  two-column numbered capability list. Structure adopted wholesale. Rejected: its
  ghost headings fail contrast requirements and vanish on small screens; rotated
  vertical side labels break on mobile for no payoff; stock photography is worse
  than the real product screenshots already available.

**Direction: Noah's bones, okaydev's pulse, warm neutral palette.**
Target energy level 5 on a scale where Noah is 2 and okaydev is 9.

### 8.2 Palette

Single accent. Everything else cream and near-black.

| Token | Value | Use |
|---|---|---|
| `--bg` | `#F7F4EE` | Cream page base |
| `--bg-alt` | `#EDE6DA` | Warm sand, alternating sections |
| `--ink` | `#16150F` | Warm near-black type. Never pure black on cream. |
| `--ink-muted` | `#5A5850` | Body copy, captions |
| `--accent` | `#1E3D30` | Deep forest green. Buttons, links, chapter blocks. |
| `--accent-hover` | `#2C5744` | Hover/active |
| `--on-accent` | `#F7F4EE` | Cream type reversed out of green blocks |

Rationale: cream + near-black + deep green is the register high-end editorial and
hospitality brands use — premium without effort. Green reads as growth and calm to
a business buyer and avoids the indigo default that most freelance sites use.

Dark mode: the existing theme system stays functional, but cream/green is the
canonical presentation. Dark variants derive from the same tokens.

### 8.3 Typography

**Gotham is removed.** The template bundles Gotham woff2 files
(`app/assets/fonts/gotham-*.woff2`) — a commercial Hoefler&Co typeface almost
certainly served without a webfont licence. Acceptable risk on a hobby portfolio,
not on the site used to sell services to businesses and agencies. Replaced:

- **Display: Instrument Serif** — high contrast, carries the oversized ghost headings
- **Body: Inter** — variable, strong at small sizes

Both open-licensed. Self-hosted as woff2 (better than the Google CDN on Cloudflare
Pages). All Gotham files deleted; `theme.js` `fontStack` updated.

### 8.4 Devices

Adopted, in order of value:

1. **Oversized ghost section headings** — large display word behind each section
   heading. Highest premium-signal-per-line-of-CSS on the page. Contrast raised
   above Noah's to stay accessible; hidden below 768px where it does not fit.
2. **Scrolling marquee band** — `WEBSITES ✦ WEB APPS ✦ AI INTEGRATION ✦ AGENCIES`
   on an accent-coloured strip. Best single borrow from okaydev: eye-catching,
   no technical connotation, one CSS animation, no dependency.
3. **Full-bleed colour-block chapters** — two or three sections on `--accent` or
   `--bg-alt` so scrolling reads as chapters rather than one long document.
4. **Letterspaced small-caps eyebrow labels** above section headings.
5. **Project cards** — large image with a small overlapping caption card and a
   thin `VIEW DETAILS →` link. Replaces the current 3D-model cards; far lighter.
6. **Two-column numbered capability list** for the "What I build" section.
7. **Pill buttons with a hard offset edge.**
8. **FAQ accordion** — functional, not decorative. Answering "how long",
   "what do you need from me", "do you handle maintenance" on the page removes
   pre-sales friction from WhatsApp conversations.

### 8.5 Performance

**Remove the Three.js displacement sphere hero.** Performance, not taste: buyer A
is on a mid-range Android over mobile data, and the WebGL hero costs seconds of
load and battery to signal "developer portfolio" — the opposite of the positioning.
Removing it drops `three` and `three-stdlib` from the critical path.

**No new dependencies.** `framer-motion` is already installed and covers every
animation required. Scroll reveals reuse the existing `IntersectionObserver`
pattern in `home.jsx`. The marquee is pure CSS.

Respect `prefers-reduced-motion`; the existing theme system has hooks for this and
they must not be bypassed. The marquee must stop under reduced motion.

**Responsiveness is a hard requirement on every page**, including the unlisted rate
card, from 320px up. Mobile-first: the majority of buyer A traffic is mobile.

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
