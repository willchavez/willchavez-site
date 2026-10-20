# Portfolio → Notes: editorial review

Local planning document, October 16, 2026. No Notes have been added or published.

I reviewed the 11 nonempty case studies in `portfolio/`, the old portfolio index, the current Work page, and the existing Hire Harlem Note. `xcomp.html` is empty. The old index links only five projects; the preview brings the other existing case studies into the same collection.

The best Notes will center on a problem you noticed, a decision you made, and what changed in your understanding. The case studies establish what you built, but often stop before the decision or reflection. Those are the gaps worth filling together. We should avoid inventing outcomes, savings, or personal anecdotes to fill them.

## Best first stories

### 1. Making tiny icon changes easier to see

**Source:** Visual Diff Analyzer. **Readiness:** closest to a short technical Note.

The existing case study has a clear arc: a manually maintained website became a Python report in the icon release pipeline. Old/new overlays and a numerical image-difference score made changes easier to inspect. That is a useful story about making review understandable, not just about building a tool.

**Possible opening:** “An icon can change in a way that is easy to miss at a glance. I worked on a tool that overlays the old and new versions, making those differences visible during review.”

**Outline:** a hard-to-spot change → the overlay and score → putting the report in CI → what still needed a designer’s judgment.

**What I need from you:** What specific change first made this feel necessary? Did the score ever disagree with what looked important to a designer? What prompted the move from website to pipeline?

**Useful visual:** one annotated old/new/overlay example. Use a public asset example rather than a screenshot containing internal review context.

### 2. When a Figma plugin stops needing a person to click it

**Source:** Icon Scaling Tool. **Readiness:** strong, with one concrete workflow example.

The source describes designer collaboration, a headless export flow, vector-path squashing, and metadata export. The interesting tension is serving a designer at a desk and an automated release pipeline with the same tool.

**Outline:** the original export routine → separating the interface from the export logic → a headless run → an edge case that changed the implementation.

**What I need from you:** Which steps were originally manual? What was hardest to make deterministic? Can you show a representative SVG before/after squashing, or explain a case where combining paths was unsafe?

**Scope:** keep this separate from the diffing Note: this one is about producing assets; the first is about reviewing changes. Actual size or time comparisons would be useful only if you have them.

### 3. Feedback belongs next to the thing it describes

**Source:** PeerSurvey / PeerView. **Readiness:** strong design Note; needs a research moment and reflection.

The split-screen review interface, inline highlights, and Thought / Question / Nit / Action categories provide a concrete point of view. The source also records a comparative evaluation with 17 participants. Explain what people did and where the design fell short, rather than letting “highest-rated” carry the story.

**Outline:** feedback disconnected from the document → a highlight-to-comment interaction → why comments had types → what the evaluation taught you.

**What I need from you:** Which observation or participant comment changed your design? Where did the comment categories come from? What would you simplify now? Clarify your contribution alongside the team’s work.

### 4. Organizing subscriptions without creating another chore

**Source:** YouTube Subscription Redesign. **Readiness:** strong research material; needs a sharper personal takeaway.

The case study already describes three competing concepts, a six-person early comparison, and a later 25-person evaluation. The Note can explore the tradeoff between control and the effort needed to maintain folders, rather than cataloging every feature.

**Outline:** why subscriptions became hard to navigate → folders versus search versus dashboard → what the comparison changed → what a prototype evaluation could not establish.

**What I need from you:** What surprised you in the needfinding? Did people actually want to maintain folders? What evidence led you to combine folders and scoped search? Were the later ratings about completing tasks, perceived usability, or both?

**Evidence limit:** describe these as findings from the project’s participants, not proof that the redesign works for all YouTube users.

### 5. What it takes to ship a moving emoji

**Source:** Fluent Repos, especially Fluent Emoji Animated. **Readiness:** promising technical story; needs the actual hard part.

The source identifies an open-source APNG library and custom tooling using APNG Assembler, ImageMagick, and Node. That gives us a concrete public artifact to explain. Avoid making this a list of repositories.

**What I need from you:** What broke during conversion or playback? How did you choose APNG? What did you check before publishing? One reproducible example could become the heart of the Note.

## Remaining case studies

| Project | Notes potential | What would make it a story |
| --- | --- | --- |
| Flubert | “Finding an icon by what it means” | A query that literal search missed; how metadata and semantic retrieval changed the result; a failure case. Focus on the general technique and approved/public examples. |
| Generative interfaces / Bebop | “When an AI answer needs a layout” | One before/after response, the reading problem, and a decision about hierarchy or composition. The current copy describes exploration but gives little evidence about what you learned. |
| Microsoft 365 Copilot / Bebop | “What a working prototype reveals about a conversation” | One interaction, an alternative you tried, and feedback that changed it. Consolidate overlapping material with the other AI projects if the lesson is the same. |
| Navigation explorations | “Navigation has to be tried, not just looked at” | A transition or context change that looked fine in a static design but behaved differently in a prototype. Explain the tradeoff, while preserving collaborators’ privacy. |
| Agent Builder | “Making setup feel like part of the conversation” | A specific moment of confusion, the flow you changed, and what happened in validation. Currently more of a contribution summary than a standalone Note. |
| Hire Harlem | Already represented in Notes | Keep the existing “Rebuilding hireharlem.com” story. Add a retrospective only if you have a new perspective on volunteer collaboration, teaching, or maintenance; otherwise avoid a duplicate. |

## A manageable writing sequence

Start with the Visual Diff Note, then the Icon Scaling Tool. They have the clearest concrete mechanisms and can use public asset examples. Follow with PeerView for a different kind of story: research and interaction design.

For each, send rough answers to the questions above—fragments or a voice-note transcription are enough. We can shape those into a first-person Note, keep the screenshots purposeful, and leave unsupported claims out. Internal project names, coworker names, and screenshots do not need to appear in a public lesson.

## Preview scope

`portfolio-preview.html` is an uncommitted, local design study. It uses the current site’s serif, warm paper, and rust palette, with category filters, responsive project cards, and keyboard-accessible project dialogs populated from the existing case studies. It is not a password implementation or a production route.

The existing README states that the legacy portfolio and images remain public. Building the password-protected version later requires protecting the underlying pages and assets as well as its entry point.
