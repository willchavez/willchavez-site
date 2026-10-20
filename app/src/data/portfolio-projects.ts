export const portfolioProjects = [
  {
    "slug": "genui-bebop",
    "title": "Generative interfaces",
    "category": "AI experiences",
    "org": "Microsoft · Fluent Design Studio",
    "summary": "Exploring how AI responses can become structured, readable interfaces.",
    "cover": "img/portfolio/genui/1.png",
    "skills": "Composition · Interaction · Prototyping",
    "about": "Exploratory deep work focused on shaping next-generation Copilot output. This work pushed beyond static responses into composable, structured UI — blending conversational AI with editorial layout systems to make AI output feel less like a wall of text and more like something you'd actually want to read.",
    "contributions": [
      "prototyped rich output patterns that move beyond simple chat responses toward structured, scannable layouts",
      "explored layout, hierarchy, and composition systems for AI-generated UI",
      "bridged design and engineering through production-minded prototypes built to validate ideas quickly with stakeholders"
    ],
    "images": [
      {
        "src": "img/portfolio/genui/1.png",
        "alt": "GenUI screenshot 1"
      },
      {
        "src": "img/portfolio/genui/2.png",
        "alt": "GenUI screenshot 2"
      },
      {
        "src": "img/portfolio/genui/3.png",
        "alt": "GenUI screenshot 3"
      },
      {
        "src": "img/portfolio/genui/4.png",
        "alt": "GenUI screenshot 4"
      },
      {
        "src": "img/portfolio/genui/5.png",
        "alt": "GenUI screenshot 5"
      }
    ],
    "links": []
  },
  {
    "slug": "icon-scaling-tool",
    "title": "Icon Scaling Tool",
    "category": "Design tooling",
    "org": "Microsoft · Fluent Design Studio",
    "summary": "From a designer’s Figma workflow to an automated icon release pipeline.",
    "cover": "img/portfolio/icon-scaling-tool/ist-export.png",
    "skills": "Figma plugins · SVG · Automation",
    "about": "A Figma plugin used internally at Microsoft and available world-wide. Scales icons in Figma and exports them in PDF & SVG formats. Built in close collaboration with designers and woven into the bi-weekly icon push that ships updates across Microsoft's product surfaces.",
    "contributions": [
      "worked directly with designers to understand their workflow needs and iterated on the plugin accordingly",
      "made the plugin completely headless so it could run as part of the automated bi-weekly icon release pipeline",
      "combined vector paths to reduce SVG node count (squashing), cutting file size and improving render performance",
      "added metadata export for each icon component — covering metaphors, descriptions, sizes, and themes"
    ],
    "images": [
      {
        "src": "img/portfolio/icon-scaling-tool/ist-export.png",
        "alt": "Export panel"
      },
      {
        "src": "img/portfolio/icon-scaling-tool/ist-headless.png",
        "alt": "Headless mode"
      },
      {
        "src": "img/portfolio/icon-scaling-tool/ist-rename.gif",
        "alt": "Rename demo"
      },
      {
        "src": "img/portfolio/icon-scaling-tool/ist-squash.png",
        "alt": "Squash/combine paths"
      }
    ],
    "links": []
  },
  {
    "slug": "bebop",
    "title": "Microsoft 365 Copilot",
    "category": "AI experiences",
    "org": "Microsoft",
    "summary": "Prototyping the small interactions that shape an everyday AI experience.",
    "cover": "img/portfolio/bebop/refiner.png",
    "skills": "Interaction patterns · High-fidelity prototypes",
    "about": "Product design and prototyping work that shaped the new Microsoft 365 Copilot experience. This work was part of the redesign featured in Microsoft’s “Introducing a new design for Microsoft 365 Copilot” article, and focused on making Copilot interactions more usable and expressive through tighter UI patterns, richer response behaviors, and clearer interaction affordances.",
    "contributions": [
      "prototyped and refined core interaction patterns used in the updated M365 Copilot experience",
      "explored response composition and interface details to improve clarity, speed, and confidence during everyday tasks",
      "partnered across design and engineering to validate concepts quickly through high-fidelity, production-minded prototypes"
    ],
    "images": [
      {
        "src": "img/portfolio/bebop/send.gif",
        "alt": "Bebop send interaction"
      },
      {
        "src": "img/portfolio/bebop/zoomedout.gif",
        "alt": "Bebop zoomed-out view"
      },
      {
        "src": "img/portfolio/bebop/ciq-1.gif",
        "alt": "Bebop CIQ interaction 1"
      },
      {
        "src": "img/portfolio/bebop/ciq-working.gif",
        "alt": "Bebop CIQ working state"
      },
      {
        "src": "img/portfolio/bebop/refiners1.gif",
        "alt": "Bebop refiners interaction"
      },
      {
        "src": "img/portfolio/bebop/proactive-assistance-button-bar.gif",
        "alt": "Bebop proactive assistance button bar"
      },
      {
        "src": "img/portfolio/bebop/testing%20input.png",
        "alt": "Bebop testing input screen"
      },
      {
        "src": "img/portfolio/bebop/refiner.png",
        "alt": "Bebop refiner details"
      }
    ],
    "links": []
  },
  {
    "slug": "visual-diff",
    "title": "Visual Diff Analyzer",
    "category": "Design tooling",
    "org": "Microsoft · Fluent Design Studio",
    "summary": "Making icon changes visible, comparable, and part of the release process.",
    "cover": "img/portfolio/visual-diff/icon-diff-1.gif",
    "skills": "Image analysis · CI · Designer workflows",
    "about": "Tooling built to give designers at Microsoft a visual representation of changes in updated icons across the fluentui-system-icons repo. What started as a standalone website is now a Python script embedded directly in the CI pipeline — automatically generating diff reports on every bi-weekly icon push.",
    "contributions": [
      "generates overlaid images of old and new icons, using color and transparency to highlight exactly which pixels changed",
      "uses ImageMagick to produce a numerical diff score alongside the visual, giving designers and engineers a shared language for \"how different is this?\"",
      "evolved from a manually-updated website to a script that runs automatically as part of the bi-weekly icon release process, so the team always has a diff report without anyone having to think about it"
    ],
    "images": [
      {
        "src": "img/portfolio/visual-diff/icon-diff-1.gif",
        "alt": "Icon diff example 1"
      },
      {
        "src": "img/portfolio/visual-diff/icon-diff-2.gif",
        "alt": "Icon diff example 2"
      },
      {
        "src": "img/portfolio/visual-diff/icon-diff-3.gif",
        "alt": "Icon diff example 3"
      }
    ],
    "links": []
  },
  {
    "slug": "peer-survey",
    "title": "PeerView",
    "category": "Research & learning",
    "org": "Georgia Tech · Team project",
    "summary": "Keeping peer feedback beside the work it refers to.",
    "cover": "img/portfolio/peer-survey/3.png",
    "skills": "Needfinding · Interaction design · Evaluation",
    "about": "HCI design project rethinking how peer review works in Canvas — the LMS used across Georgia Tech. The existing flow buries feedback in forms and disconnects reviewing from the actual document being evaluated. This project diagnosed those gaps through surveys, heuristic evaluation, and forum analysis, then prototyped a new experience. My contribution, PeerView, introduces a comment-centric, split-screen review interface built to make giving and receiving feedback feel natural and useful rather than obligatory.",
    "contributions": [
      "led design and prototyping for Prototype 1 (PeerView) — the highest-rated concept among 17 evaluation participants",
      "designed a split-screen editor with the submission on the left and a structured feedback panel on the right",
      "introduced inline highlight-to-comment interactions with typed categories: Thought, Question, Nit, and Action",
      "built a dashboard view surfacing assigned and received reviews at a glance, reducing the cognitive overhead of the native Canvas flow",
      "added a confirmation modal before posting feedback to reduce accidental submissions and give reviewers a moment to reflect",
      "designed a read-only received feedback view that preserves inline context alongside written comments",
      "contributed to the full research pipeline: survey design, heuristic evaluation, and comparative usability study"
    ],
    "images": [
      {
        "src": "img/portfolio/peer-survey/1.png",
        "alt": "PeerView dashboard — assigned reviews"
      },
      {
        "src": "img/portfolio/peer-survey/3.png",
        "alt": "Split-screen review editor"
      },
      {
        "src": "img/portfolio/peer-survey/4.png",
        "alt": "Inline comments panel with category tags"
      },
      {
        "src": "img/portfolio/peer-survey/5.png",
        "alt": "Received feedback read-only view"
      }
    ],
    "links": [
      [
        "https://header-hand-71542763.figma.site/",
        "view live prototype →"
      ]
    ]
  },
  {
    "slug": "youtube-redesign",
    "title": "Rethinking subscriptions",
    "category": "Research & learning",
    "org": "Georgia Tech · Individual project",
    "summary": "Giving a growing collection of YouTube subscriptions some structure.",
    "cover": "img/portfolio/youtube-redesign/1.png",
    "skills": "Research · Information architecture · Prototyping",
    "about": "HCI individual project redesigning YouTube's subscription management experience. YouTube gives users almost no control over how their subscribed channels are organized — the result is a long, cluttered list that most people abandon in favor of search or the Home feed. This project ran a full design cycle: survey-based needfinding with 25 participants, heuristic evaluation, three competing low-fidelity prototypes evaluated with 6 participants, and a medium-fidelity final prototype evaluated with 25 more. The winning design pairs a folder-based subscription sidebar with scoped search and filtering — putting users back in control without requiring constant manual upkeep.",
    "contributions": [
      "ran a 22-question needfinding survey (25 responses) and heuristic evaluation against Nielsen's usability principles — clutter, lack of grouping, and memory burden emerged as the top pain points",
      "designed and compared three lo-fi prototypes: folder-based sidebar, scoped search + filters, and a subscriptions dashboard — evaluated with 6 participants using a Friedman test across four metrics",
      "folder prototype won across all measures (ease 4.17, control 4.33, overall preference 4.17) and was selected by 4 of 6 participants as their top choice",
      "built a medium-fidelity Figma prototype combining the top two concepts: collapsible folder sidebar with channel counts, scoped \"search subscriptions\" with folder-level filtering, and a \"move to folder\" overflow menu",
      "final evaluation (25 participants) showed strongly positive results across all metrics — 96–100% of participants rated key usability dimensions 4 or 5 out of 5"
    ],
    "images": [
      {
        "src": "img/portfolio/youtube-redesign/1.png",
        "alt": "Folder-based subscriptions sidebar with Music & Audio expanded"
      },
      {
        "src": "img/portfolio/youtube-redesign/4.png",
        "alt": "Tech & Gear folder expanded showing channels"
      },
      {
        "src": "img/portfolio/youtube-redesign/5.png",
        "alt": "Move to folder overflow menu"
      },
      {
        "src": "img/portfolio/youtube-redesign/2.png",
        "alt": "Create new folder modal"
      },
      {
        "src": "img/portfolio/youtube-redesign/3.png",
        "alt": "Home feed with all folders collapsed after creation"
      }
    ],
    "links": [
      [
        "https://www.figma.com/proto/VMiBVQUaOBnqpjfg0OhJPh/Youtube-Subscriptions?node-id=2-1355&scaling=scale-down-width&page-id=0%3A1",
        "view Figma prototype →"
      ]
    ]
  },
  {
    "slug": "agent-builder",
    "title": "Agent Builder",
    "category": "AI experiences",
    "org": "Microsoft",
    "summary": "Making agent creation feel native to the Copilot experience.",
    "cover": "img/portfolio/agent-builder/1.png",
    "skills": "Creation flows · Prototyping",
    "about": "Design and prototyping work focused on enabling users to create and configure AI agents directly within Copilot — making agent creation feel native, approachable, and fast rather than a separate setup experience.",
    "contributions": [
      "contributed to agent creation flows and interaction patterns within the Copilot surface",
      "built end-to-end prototypes used for stakeholder demos and UX validation",
      "iterated quickly on UX details based on feedback, keeping prototypes close to production quality"
    ],
    "images": [
      {
        "src": "img/portfolio/agent-builder/followup.gif",
        "alt": "Follow-up interaction"
      },
      {
        "src": "img/portfolio/agent-builder/1.png",
        "alt": "Agent builder early screenshot"
      },
      {
        "src": "img/portfolio/agent-builder/spacer-weird.gif",
        "alt": "Spacer exploration"
      },
      {
        "src": "img/portfolio/agent-builder/2.png",
        "alt": "Agent builder final screenshot"
      }
    ],
    "links": []
  },
  {
    "slug": "flubert",
    "title": "Flubert",
    "category": "Design tooling",
    "org": "Microsoft · Fluent Design Studio",
    "summary": "Connecting Fluent iconography and emoji to a design assistant.",
    "cover": "img/portfolio/flubert/flubert_ex1.png",
    "skills": "Semantic retrieval · Figma · Design systems",
    "about": "A design assistant that helps you create beautiful and consistent designs that adhere to the Fluent Design System. Flubert is a Figma plugin that analyzes your UI against Fluent guidelines and surfaces recommendations — helping designers move faster without sacrificing consistency.",
    "contributions": [
      "built iconography and emoji suggestion features grounded in a vector database of Fluent assets, using scraped icon and emoji metadata as the retrieval corpus",
      "created search indexes from that metadata to power fast, semantically relevant suggestions within the plugin",
      "integrated LLM-based analysis to evaluate UI components against Fluent design guidelines and surface actionable feedback"
    ],
    "images": [
      {
        "src": "img/portfolio/flubert/flubert_ex1.png",
        "alt": "Flubert screenshot 1"
      },
      {
        "src": "img/portfolio/flubert/flubert_ex2.png",
        "alt": "Flubert screenshot 2"
      },
      {
        "src": "img/portfolio/flubert/flubert_ex3.png",
        "alt": "Flubert screenshot 3"
      },
      {
        "src": "img/portfolio/flubert/flubert_ex4.png",
        "alt": "Flubert screenshot 4"
      }
    ],
    "links": []
  },
  {
    "slug": "nav2",
    "title": "Navigation explorations",
    "category": "AI experiences",
    "org": "Microsoft · Collaborative project",
    "summary": "Turning navigation concepts into a system people could try.",
    "cover": "img/portfolio/nav2/1.png",
    "skills": "Navigation · Interactive states · Prototyping",
    "about": "Early-stage prototype exploring next-generation navigation patterns for Copilot. Built in close partnership with Ankit Potdar, the work gave stakeholders a tangible system to evaluate — covering cross-surface navigation, information hierarchy, and system responsiveness — rather than just reacting to static designs.",
    "contributions": [
      "led technical prototyping — translated conceptual UX directions into working navigation flows and interactive states",
      "defined how navigation behaves across contexts: expansion, transitions, selection, and system feedback",
      "partnered with Ankit to iterate quickly, keeping design intent and engineering feasibility in lockstep",
      "shaped early patterns for modular navigation components, laying groundwork for more scalable systems thinking",
      "packaged the prototype for stakeholder review in a way that drove clear, specific product conversations"
    ],
    "images": [
      {
        "src": "img/portfolio/nav2/functionality.gif",
        "alt": "Navigation functionality panel"
      },
      {
        "src": "img/portfolio/nav2/nav2.gif",
        "alt": "Nav 2.0 prototype"
      },
      {
        "src": "img/portfolio/nav2/pill%20bounce.gif",
        "alt": "Pill bounce micro-interaction"
      },
      {
        "src": "img/portfolio/nav2/1.png",
        "alt": "Nav 2.0 screenshot"
      }
    ],
    "links": []
  },
  {
    "slug": "fluent",
    "title": "Fluent in the open",
    "category": "Design tooling",
    "org": "Microsoft · Fluent Design Studio",
    "summary": "Maintaining the repositories and tooling behind icons and emoji.",
    "cover": "img/portfolio/fluent/fluentui-emoji.png",
    "skills": "Open source · Asset pipelines · Cross-platform",
    "about": "Maintained and created open-source repositories and npm packages for the Fluent Design System — covering icons, emoji, and animated assets used across Microsoft's products.",
    "contributions": [
      "Fluent System Icons (react-icons, svg-icons) — updates and fixes across Android, iOS, React, and React Native; added image analysis to the scripting pipeline",
      "Fluent Emoji — open-sourced our emoji library via Figma and GitHub; featured in Designing in the Open(Source) by our CVP of Design & Research",
      "Fluent Emoji Animated — created an open-source repo for animated emoji (APNG format) using custom tooling built on apng assembler, ImageMagick, and Node.js"
    ],
    "images": [
      {
        "src": "img/portfolio/fluent/react-icons.png",
        "alt": "React icons npm package"
      },
      {
        "src": "img/portfolio/fluent/svg-icons.png",
        "alt": "SVG icons npm package"
      },
      {
        "src": "img/portfolio/fluent/fluentui-system-icons.png",
        "alt": "Fluent UI system icons repo"
      },
      {
        "src": "img/portfolio/fluent/fluentui-emoji.png",
        "alt": "Fluent UI emoji repo"
      },
      {
        "src": "img/portfolio/fluent/fluentui-emoji-animated.png",
        "alt": "Fluent UI animated emoji repo"
      }
    ],
    "links": []
  },
  {
    "slug": "hireharlem",
    "title": "Hire Harlem",
    "category": "Community",
    "org": "Volunteer project",
    "summary": "Helping people discover and support local, minority-owned businesses.",
    "cover": "img/portfolio/hire-harlem/hire-harlem_figma.png",
    "skills": "Community · Full-stack development",
    "about": "A website that helped people find and support minority-owned businesses — starting in Harlem, NY and expanding to Oakland, CA. Pure passion project: a small team of us carved out every Sunday to work on it, driven by the belief that visibility for these businesses actually mattered. Read more on Medium.",
    "contributions": [
      "complete redesign and rebuild of the site from the ground up using React.js, Redux, and Express.js",
      "reconstructed the back-end, migrating to MongoDB with a new Express.js API",
      "collaborated closely with designers and project managers every week to keep the work moving and the vision coherent"
    ],
    "images": [
      {
        "src": "img/portfolio/hire-harlem/hire-harlem_now.gif",
        "alt": "Live site"
      },
      {
        "src": "img/portfolio/hire-harlem/hire-harlem_old.png",
        "alt": "Original site"
      },
      {
        "src": "img/portfolio/hire-harlem/hire-harlem_figma.png",
        "alt": "Figma designs"
      }
    ],
    "links": []
  }
] as const;
