# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Two primary audiences reading the same page: (1) recruiters and hiring managers evaluating Vladyslav Nikitin for full-time full-stack roles, and (2) freelance/agency clients evaluating him for contract project work. Both are assessing hire-worthiness from the same evidence — experience timeline, shipped projects, and skills — there is no task the visitor performs beyond reading and deciding to reach out.

## Product Purpose

A personal CV / portfolio site whose success is measured in outbound contact: a recruiter downloading the CV and reaching out about a role, or a client submitting the contact form about project work. It is a static single-page site (no accounts, no backend data) that presents identity, experience, skills, and project evidence, with CV download and a contact form as the two conversion actions.

## Positioning

"Versatility without losing depth" — comfortable end-to-end (architecture through deployment) in both modern JS/TS (React, Next.js, Node) and the WordPress/Shopify ecosystem, able to take on a custom web app, a CMS-driven site, or an e-commerce platform with the same level of ownership. Most full-stack developers specialize in one direction; he has shipped production work across all of them, and adapts to what a project actually needs rather than forcing everything into one stack. AI-assisted development — specifically Claude Code — is part of his daily workflow and shapes delivery speed and code quality; this is evidenced directly on the site itself (the GitHub Actions deploy pipeline, the Task Manager project).

## Operating Context

- Visitors land once, scan, and leave — no login, no repeat sessions, no in-page task to complete.
- The site auto-localizes on load via IP geolocation (`free.freeipapi.com`): visitors detected in Ukraine see the Ukrainian CV PDF and a Ukrainian phone/Telegram contact; everyone else sees the default (Spain-based) CV and WhatsApp contact. There is no manual language switcher.
- The CV exists as two static PDFs (`public/Nikitin_Vladyslav_CV.pdf`, `public/Nikitin_Vladyslav_CV_UA.pdf`), independent of on-page content — they must stay in sync with what the page claims.
- The contact form submits through a third-party endpoint (Formspree) with no backend of its own.
- The site is a static Vite/React build pushed via a GitHub Actions workflow into a separate `naykitin.github.io` repo (GitHub Pages), triggered by pushes to a `deploy` branch. This deploy pipeline is a durable, already-built part of the product, not aspirational — it is itself referenced as evidence of the "CI/CD Pipelines" skill claim.

## Capabilities and Constraints

- Static single-page React (Vite) app; no server-side rendering, no user accounts, no CMS backend for this site itself.
- Content (experience, projects, skills) lives in JS data arrays in `src/App.jsx`, not in a CMS — updates are code changes, not content-editor changes.
- Two live project case studies are linked out to (not embedded): a headless WordPress/Next.js platform (in progress, repo-only, no live demo) and Task Manager, an MIT-licensed Cloudflare-hosted Kanban/time-tracker he built, deployed, and can keep extending.
- Bilingual by geolocation only (EN default / UA variant) — content is not otherwise internationalized.

## Brand Commitments

- Name: Vladyslav Nikitin. Title used throughout: "Full Stack Developer."
- Existing visual identity is incumbent and should be preserved as-is unless a redesign is explicitly requested: dark paper/ink palette with gold/red/green/blue accents, monospace terminal accents, particle-field background, custom cursor.
- Listed skill/expertise tags (React, Next.js, TypeScript, WordPress, WooCommerce, Shopify, GraphQL, Apollo, Tailwind CSS, PHP, CRM Integration, SEO Optimization, CI/CD Pipelines) are confirmed factual claims, not placeholders — future edits must keep them true rather than aspirational.

## Evidence on Hand

- Real work history with named employers and dates (Foxes, NextG, Remote Helpers, Aweb Systems), each with concrete responsibility bullets — see `experience` in `src/App.jsx`.
- Two real project case studies: `github.com/Naykitin/frontend-next` (repo only) and `github.com/Naykitin/task-manager` with a live demo at `task-manager.naykitin.workers.dev`, backed by real product screenshots (`public/task-manager-*.png`).
- Two real downloadable CV PDFs (EN/UA) in `public/`.
- No testimonials, client logos, or case-study metrics exist anywhere in the codebase — do not fabricate them.

## Product Principles

- Show, don't just claim: every skill or capability listed should trace to a real project, employer bullet, or artifact already in the repo.
- One page, one path: the whole product is a single scroll with two conversion actions (download CV, contact form) — don't fragment it into multi-page navigation.
- Evidence-first project links: always give reviewers something to click through to (a live demo or a real repo), not just prose.
- Stay adaptable in the content, not just the copy: the "versatility" positioning only stays credible if new projects/skills keep spanning both the JS/TS and WordPress/commerce sides rather than drifting to one.

## Accessibility & Inclusion

No product-specific accessibility requirement has been established beyond ordinary web standards (semantic headings and `aria-label`/`aria-labelledby` already present on sections).
