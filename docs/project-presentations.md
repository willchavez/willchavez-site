# Project presentations

Each article links to `/portfolio/<slug>/present`. The Projects index and reading version retain their existing layout and content. The presentation is a separate, static route with its own controls and print styles.

Edit `app/src/data/project-presentations.ts` to change a deck's narrative. The opening slide uses the project's existing title, summary, role, organization, and context. Each subsequent slide has a section label, a concise title, optional body or points, and optional media references. Media must exist in that project's source record; the build rejects unknown assets. Captions come from `project-stories.ts`.

## Editorial evidence

The original eleven decks were reviewed against `portfolio-projects.ts` and `project-stories.ts`. Original HTML files and their full Git history were also searched for collaborator credits and earlier descriptions. Named people were restored only where an explicit source was found. The Fluent data visualization deck draws on the `fluent-design/plugins/dataviz` plugin and the linked HTML artifacts from the `reports` repository.

| Project | Narrative and outcome | Additional evidence |
| --- | --- | --- |
| Generative interfaces | Structured responses; compare layouts across summaries, comparisons, timelines, and recaps; working explorations | `portfolio/genui-bebop.html` history |
| Microsoft 365 Copilot | High-fidelity response and refiner interactions; connect them to the broader workspace and redesign | `portfolio/bebop.html` history |
| Icon Scaling Tool | Designer workflow, asset preparation, headless execution, bi-weekly release integration | `portfolio/icon-scaling-tool.html` history |
| Fluent asset library | CDN-backed browsing, category/variant controls, preserving place, final data flow, and documented iteration notes; Jason Custer’s design guidance and critiques | User brief and follow-up collaboration details; PR #1096 metadata, 36 commit records, and final diff; see [editorial evidence](fluent-asset-library.md) |
| Fluent data visualization | Plugin creation, shared chart rules, interactive examples, the coffee-crawl generation flow, evaluation, and Figma generation | `fluent-design/plugins/dataviz`; `reports/2026-06-26 - Fluent Bebop Data Viz Gallery v2`; `reports/2026-07-17 - Fluent Flex Data Visualization Gallery`; `reports/2026-08-13 - Fluent Dataviz Five-Minute Walkthrough` |
| Visual Diff Analyzer | Visual/numerical comparison, manual browser tool, automated Python release report | `portfolio/visual-diff.html` history |
| PeerView | Team research, own split-screen concept, inline comments, comparative evaluation with 17 participants | `0c3d8df:portfolio/peer-survey.html` explicitly credits **Aaquib Khwaja, Anna Levenberg, Jackson Lyons** |
| Rethinking subscriptions | 25-response needfinding, three concepts compared with six participants, folder decision, final 25-participant evaluation | `portfolio/youtube-redesign.html`; individual project status preserved |
| Agent Builder | Purpose and information sources, end-to-end creation flow, feedback-driven configuration exploration | `portfolio/agent-builder.html` history |
| Flubert | Metadata/vector retrieval, different asset requests, LLM guideline analysis within Figma | `portfolio/flubert.html` history |
| Navigation explorations | Four-day scope, agent MRU, behavior and details, explicit deferred interactions, stakeholder review | `app/src/content/writing/2025-06-21-making-navigation-feel-like-a-place-to-return.md`; **Ankit Potdar** handled PM, priorities, and partner-team coordination |
| Fluent in the open | Cross-platform icon packages, open-sourced emoji, animated APNG tooling | `portfolio/fluent.html` history |
| Hire Harlem | Static content to API/database, Sasha's redesign, weekly React/Redux rebuild, community mission | `app/src/content/writing/2020-03-20-rebuilding-hireharlem-com.md`; **Alex Ocampo** and **Sasha** have explicit credits |

Research figures are labeled as prototype evaluation. Exploration decks do not claim an undocumented winning design, production rollout, or measured business impact. The navigation note describes a later related public rollout without implying sole ownership. Broad team credits are used where no named collaborators were found.

## Presenting

Presentation mode is available above 800px, excluding touch phones in landscape (up to 500px high). On mobile the entry link is hidden and direct deck URLs return to the project article, preserving its return context.

Use Previous/Next, arrow keys, Space, Page Up/Down, Home/End, or the slide outline. Escape closes the outline first, then returns to the article. URLs retain `#slide-N` for sharing. Article return context is preserved only for the same project's URL. Browser printing includes every slide, one per landscape page. With JavaScript unavailable, the deck remains a readable sequence.

Build and serve the app, then run `CHROMIUM_PATH=/usr/bin/chromium npm --prefix app run test:presentation -- BASE_URL` for browser checks.
