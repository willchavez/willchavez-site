import { assetLibraryTimeline, type ProjectTimelineItem } from './asset-library-timeline';
// Editorial sequences and factual context, grounded in the project records and Notes.
export interface ProjectStory {
  role: string;
  status: string;
  opening: "essay" | "paired" | "visual";
  leadImage?: string;
  sections: { title: string; body: string; media?: string[]; timeline?: ProjectTimelineItem[]; embed?: { src: string; title: string; caption: string; kind: "coffee" | "gallery" }; arrangement?: "pair" | "inset" }[];
  captions: Record<string, string>;
  related?: { href: string; label: string };
}
export const projectStories: Record<string, ProjectStory> = {
  "fluent-asset-library": {
    "role": "Interaction design & implementation",
    "status": "Fluent Flex design site · merged August 2026",
    "opening": "essay",
    "sections": [
      {
        "title": "The brief sounded simple: show the icons",
        "body": "The starting point was to demonstrate the icons using the actual CDN images and technical assets. Working with Jason Custer, Principal Product Design Manager, designer, and illustrator, I built the asset browser for the upcoming Fluent Flex design site. The work became about more than displaying images: how do you browse a large collection, compare variants, and get the right file without losing your place?",
        "media": [
          "img/portfolio/fluent-asset-library/asset-library-emoji-scroll.gif"
        ]
      },
      {
        "title": "Room to help shape the experience",
        "body": "I’m often brought into a project for prototyping or engineering. Jason looks for opportunities for me to bring my own creativity to the work and help design the experience, too. He guided me through design feedback and critiques, helping me understand where to reduce space and where to give something more room."
      },
      {
        "title": "Different assets need different choices",
        "body": "The library spans system icons, emoji, and illustrations. Each family needs its own controls: size and style for icons, skin tone and format for emoji, and size and theme for illustrations. I connected those choices to the active variant so the preview, carousel, Copy URL, and Download actions stay in sync. Controls disappear when the asset has no corresponding metadata, rather than offering choices that don’t exist.",
        "media": [
          "img/portfolio/fluent-asset-library/asset-library-browsing.gif"
        ]
      },
      {
        "title": "Do the grouping before the page loads",
        "body": "A comment in the build script estimates roughly 44,500 upstream variant records and 7.6 MB uncompressed. I grouped records by category and asset name at build time, then emitted separate category indexes. The browser loads and caches a category when it’s needed. Variant metadata is derived from filenames as assets are rendered or inspected."
      },
      {
        "title": "Keep your place while you browse",
        "body": "A big collection still needs to feel like one place. I used a virtualized grid that renders visible rows plus a buffer, with fuzzy search on a 120 ms debounce. Switching categories restores the category’s scroll position. Resizing keeps the selected item anchored as the column count changes. Keyboard navigation and focus restoration help connect the grid to the asset details instead of leaving focus behind when the visible rows change.",
        "media": [
          "img/portfolio/fluent-asset-library/asset-library-search-variants.gif"
        ]
      },
      {
        "title": "The work lived in the details",
        "body": "The first commit describes three detail presentations: inline expansion, a modal, and a right rail. Later messages record search and grid refinements, removal of the asset count, and changes to hover, selection, and borders. The final implementation has scrollable asset details and a synchronized variant carousel. The history also records virtualization changes, skeleton loading, high-contrast fixes, and a return-to-top button. Those changes added up to the final browsing and detail experience.",
        "timeline": assetLibraryTimeline
      },
      {
        "title": "Displaying the actual assets meant handling the actual files",
        "body": "The SVGs needed care as well as the interface around them. I namespaced IDs and preserved root presentation attributes when processing SVG content, including inherited attributes that affect how an image renders. The history records fixes for dropped SVG attributes and browser compositing artifacts. Working with the real CDN files made these rendering details part of the browsing experience.",
        "media": [
          "img/portfolio/fluent-asset-library/asset-library-original.png"
        ]
      },
      {
        "title": "Make the less visible paths work, too",
        "body": "I worked through loading skeletons, keyboard navigation, focus restoration, live announcements, reduced-motion handling, and forced-color styling. The index build retries fetches and can retain previously generated indexes when a fetch fails. Reusable Markdown embeds let the site include the browser and featured asset previews without rebuilding those experiences in each document."
      },
      {
        "title": "From showing assets to choosing the right file",
        "media": ["img/portfolio/fluent-asset-library/asset-library-bug-viewer.gif"],
        "body": "PR #1096, “feat(site): improve expression asset browsing,” merged on August 13, 2026, after commits spanning July 29–August 13. The result of that change is a React and TypeScript browser connecting discovery, variant selection, and file actions across the three asset families. The library and PR links below require Microsoft access."
      }
    ],
    "captions": {
      "img/portfolio/fluent-asset-library/asset-library-original.png": "Browsing system icons, with emoji and illustrations one tab away.",
      "img/portfolio/fluent-asset-library/asset-library-browsing.gif": "Switching asset families and searching illustrations.",
      "img/portfolio/fluent-asset-library/asset-library-search-variants.gif": "Searching, selecting size and style, navigating variants, and copying the active URL.",
      "img/portfolio/fluent-asset-library/asset-library-emoji-scroll.gif": "A scroll through the Emoji tab in the running asset library.",
      "img/portfolio/fluent-asset-library/asset-library-bug-viewer.gif": "A closer look at Bug: choosing Animated PNG, then cycling through Color, Flat, and High contrast."
    }
  },

  "fluent-dataviz": {
    "role": "Creator of the flex-dataviz plugin",
    "status": "Fluent Flex design system work",
    "opening": "essay",
    "sections": [
      {
        "title": "A chart needs more than a visual style",
        "body": "Choosing a chart is only the beginning. Labels, density, color, and interaction all affect whether someone can understand and explore the data. I created the flex-dataviz plugin to put those decisions in one navigable system.",
        "embed": { "src": "/dataviz/walkthrough.html?embed=portfolio", "title": "Interactive Seattle coffee crawl charts", "caption": "Explore the walkthrough’s area, donut, heatmap, and bar charts. Hover or focus a mark to see its value.", "kind": "coffee" }
      },
      {
        "title": "Principles that travel across chart types",
        "body": "The plugin starts with shared rules for corner radius, typography, density, and color with patterns. It connects those rules to chart-specific guidance, from bars and lines to heatmaps, Sankey diagrams, axes, legends, and callouts. Explore the Sankey and heatmap examples from the original Bebop gallery below.",
        "embed": { "src": "/dataviz/gallery-v2.html?embed=portfolio", "title": "Interactive Sankey and heatmap examples", "caption": "Original Bebop gallery charts. Hover or focus a flow or cell to inspect the data.", "kind": "gallery" }
      },
      {
        "title": "From a natural request to charts",
        "body": "The five-minute walkthrough asks an agent for charts about a Seattle coffee crawl. Its area, donut, heatmap, and bar examples show how guidance can shape a coherent set. The walkthrough then uses the output to evaluate the rules and explains the path toward Figma generation. Open it and the two galleries below to explore the original examples."
      }
    ],
    "captions": {}
  },
  "genui-bebop": {
    "role": "Interaction design & prototyping",
    "status": "Exploratory prototypes",
    "sections": [
      {
        "title": "A response needs somewhere to go",
        "body": "A chat response can hold a lot of information. Reading through all of it is another story. I explored what happens when the response has a layout: a clear hierarchy, sections you can scan, and actions beside the information they belong to.",
        "media": [
          "img/portfolio/genui/1.png"
        ]
      },
      {
        "title": "Making the layout part of the conversation",
        "body": "I built prototypes to try different ways of composing that output. The daily summary brings tasks and an audio briefing together; another exploration uses a chart and supporting text to explain a comparison. The question was how the interface could help someone make sense of the answer.",
        "media": [
          "img/portfolio/genui/2.png",
          "img/portfolio/genui/3.png"
        ],
        "arrangement": "pair"
      },
      {
        "title": "Something we could react to",
        "body": "These were explorations, built to make the ideas concrete in conversations with design and engineering. My work focused on the layout, hierarchy, and interaction patterns. The screens here are prototypes used to explore those directions.",
        "media": [
          "img/portfolio/genui/4.png",
          "img/portfolio/genui/5.png"
        ],
        "arrangement": "pair"
      }
    ],
    "captions": {
      "img/portfolio/genui/1.png": "A daily summary groups a briefing, tasks, and actions into a page someone can scan.",
      "img/portfolio/genui/2.png": "A visual comparison gives the numbers a hierarchy, with supporting context directly below.",
      "img/portfolio/genui/3.png": "A timeline and supporting tables organize a response over time.",
      "img/portfolio/genui/4.png": "A policy answer pairs an explanation with a comparison table.",
      "img/portfolio/genui/5.png": "Meeting information, speakers, and a recording are grouped into a single recap."
    },
    "opening": "essay"
  },
  "icon-scaling-tool": {
    "role": "Figma plugin development & automation",
    "status": "Used in the icon release workflow",
    "sections": [
      {
        "title": "The repetitive part adds up",
        "body": "An icon needs to leave Figma in several sizes and formats before it can reach a product. I worked directly with designers on the plugin, iterating on the parts of that export workflow they needed help with.",
        "media": [
          "img/portfolio/icon-scaling-tool/ist-export.png"
        ]
      },
      {
        "title": "From a button to a pipeline",
        "body": "I made the plugin run headlessly so the same work could happen inside the bi-weekly icon release process. That meant taking an interactive designer tool and making it usable by automation, too.",
        "media": [
          "img/portfolio/icon-scaling-tool/ist-headless.png"
        ]
      },
      {
        "title": "More than resizing",
        "body": "I also combined vector paths to reduce SVG node counts and added metadata exports for metaphors, descriptions, sizes, and themes. The work connected the assets designers make with the files and information that downstream tools need.",
        "media": [
          "img/portfolio/icon-scaling-tool/ist-rename.gif",
          "img/portfolio/icon-scaling-tool/ist-squash.png"
        ],
        "arrangement": "pair"
      }
    ],
    "captions": {
      "img/portfolio/icon-scaling-tool/ist-export.png": "The export panel brings the icon sizing and format options into the designer’s Figma workflow.",
      "img/portfolio/icon-scaling-tool/ist-headless.png": "Headless mode lets the plugin run as part of the automated icon release pipeline.",
      "img/portfolio/icon-scaling-tool/ist-rename.gif": "Renaming tools help prepare the icon set for export.",
      "img/portfolio/icon-scaling-tool/ist-squash.png": "Combining vector paths reduces the number of nodes in the exported SVG."
    },
    "opening": "paired"
  },
  "hireharlem": {
    "role": "Full-stack development",
    "status": "Volunteer team project",
    "sections": [
      {
        "title": "A good reason to spend Sundays coding",
        "body": "Hire Harlem started with a simple idea: make it easier to find businesses owned by people of color, women, and longtime neighborhood residents. I met Alex through work, we became friends, and the project gave us a way to put some of that energy back into the community."
      },
      {
        "title": "Making room for the next interview",
        "body": "The original site used static interview files that had to be recreated for each new story. We moved that content into a database with an API, so adding an interview didn’t require repeating the same development work.",
        "media": [
          "img/portfolio/hire-harlem/hire-harlem_old.png"
        ],
        "arrangement": "inset"
      },
      {
        "title": "Rebuilding it together",
        "body": "When Sasha joined with a redesign, we rebuilt the site using React, Redux, Express, and MongoDB. We worked together every week, connecting the interviews and business listings to a new interface. It was a small team making something we cared about.",
        "media": [
          "img/portfolio/hire-harlem/hire-harlem_figma.png",
          "img/portfolio/hire-harlem/hire-harlem_now.gif"
        ]
      }
    ],
    "captions": {
      "img/portfolio/hire-harlem/hire-harlem_figma.png": "The redesign that gave our team a shared direction for the rebuild.",
      "img/portfolio/hire-harlem/hire-harlem_now.gif": "The rebuilt site brings neighborhood businesses and their stories together.",
      "img/portfolio/hire-harlem/hire-harlem_old.png": "The earlier site, before the redesign and content-management changes."
    },
    "related": {
      "href": "/notes/2020-03-20-rebuilding-hireharlem-com",
      "label": "Read the story behind Hire Harlem"
    },
    "opening": "essay"
  },
  "bebop": {
    "role": "Interaction design & technical prototyping",
    "status": "Microsoft 365 Copilot redesign",
    "opening": "essay",
    "sections": [
      {
        "title": "Working through the small interactions",
        "body": "My work on the Microsoft 365 Copilot redesign focused on how the interface responds as someone uses it. I built high-fidelity prototypes to work through response composition, interaction patterns, and the details that are difficult to judge in a static screen. The refiner below is one example of those controls taking shape.",
        "media": [
          "img/portfolio/bebop/refiner.png"
        ]
      },
      {
        "title": "Putting the conversation in motion",
        "body": "A working prototype let design and engineering try the flow together: enter a prompt, send it, and see how the response behaves. I used these prototypes to refine the interface details and validate directions through something people could actually use.",
        "media": [
          "img/portfolio/bebop/send.gif"
        ]
      },
      {
        "title": "Looking at the whole workspace",
        "body": "The explorations also considered how information is organized beyond a single response. These views show the broader workspace and refinement controls alongside the interaction work. The project was part of the Copilot redesign described in Microsoft’s “Introducing a new design for Microsoft 365 Copilot” article.",
        "media": [
          "img/portfolio/bebop/zoomedout.gif",
          "img/portfolio/bebop/refiners1.gif"
        ],
        "arrangement": "pair"
      }
    ],
    "captions": {
      "img/portfolio/bebop/refiner.png": "A closer look at the prompt and image-refinement controls.",
      "img/portfolio/bebop/send.gif": "The working send interaction connects input, response, and conversation state.",
      "img/portfolio/bebop/zoomedout.gif": "A wider view of the workspace exploration.",
      "img/portfolio/bebop/refiners1.gif": "Refinement controls explored in the interactive prototype.",
      "img/portfolio/bebop/testing%20input.png": "An implementation-testing view of the prototype."
    }
  },
  "visual-diff": {
    "role": "Image-analysis tooling & CI integration",
    "status": "Fluent icon release workflow",
    "opening": "visual",
    "sections": [
      {
        "title": "Making a change visible",
        "body": "An updated icon can be subtly different from the version it replaces. I built a tool that overlays old and new assets with color and transparency, so designers can see which pixels changed. An ImageMagick diff score adds a numerical comparison alongside the visual."
      },
      {
        "title": "From a website to a release check",
        "body": "The first version was a manually updated website. I moved the analysis into a Python script in the bi-weekly icon release pipeline, so a visual report could be generated as part of the release. Designers and engineers could review the same changes without someone having to assemble the report by hand.",
        "media": [
          "img/portfolio/visual-diff/icon-diff-1.gif",
          "img/portfolio/visual-diff/icon-diff-3.gif"
        ],
        "arrangement": "pair"
      }
    ],
    "captions": {
      "img/portfolio/visual-diff/icon-diff-1.gif": "The browser-based tool loads a report of icon updates for review.",
      "img/portfolio/visual-diff/icon-diff-2.gif": "Before-and-after overlays make changes to each icon visible.",
      "img/portfolio/visual-diff/icon-diff-3.gif": "A further icon comparison in the generated report."
    },
    "leadImage": "img/portfolio/visual-diff/icon-diff-2.gif"
  },
  "peer-survey": {
    "role": "Research, interaction design & prototyping",
    "status": "Georgia Tech HCI · team project",
    "opening": "essay",
    "sections": [
      {
        "title": "Feedback belongs beside the work",
        "body": "In Canvas, reviewing a submission can mean moving between the document and a separate feedback form. Our team investigated that disconnect through surveys, heuristic evaluation, and forum analysis. My prototype, PeerView, focused on keeping comments attached to the part of the work they describe."
      },
      {
        "title": "A review surface built around comments",
        "body": "I designed and prototyped a split-screen editor with the submission on the left and feedback on the right. Reviewers can highlight text and add a categorized comment. A confirmation step gives them a chance to check their feedback before posting.",
        "media": [
          "img/portfolio/peer-survey/3.png",
          "img/portfolio/peer-survey/4.png"
        ]
      },
      {
        "title": "Following the review through",
        "body": "The dashboard brings assigned and received reviews together, and a read-only view preserves the original context when feedback comes back. PeerView was the highest-rated concept in our evaluation with 17 participants. I also contributed to the team’s research and comparative usability study.",
        "media": [
          "img/portfolio/peer-survey/1.png",
          "img/portfolio/peer-survey/5.png"
        ],
        "arrangement": "pair"
      }
    ],
    "captions": {
      "img/portfolio/peer-survey/3.png": "The submission and its feedback remain visible together in the review editor.",
      "img/portfolio/peer-survey/4.png": "Comments stay connected to highlighted passages and their categories.",
      "img/portfolio/peer-survey/1.png": "A dashboard for assigned reviews.",
      "img/portfolio/peer-survey/5.png": "Received feedback keeps the document context intact."
    },
    "related": {
      "href": "/notes/2026-10-17-starting-again-with-hci",
      "label": "What I learned in HCI"
    }
  },
  "youtube-redesign": {
    "role": "Research, information architecture & prototyping",
    "status": "Georgia Tech HCI · individual project",
    "opening": "essay",
    "sections": [
      {
        "title": "Subscriptions needed some structure",
        "body": "My starting point was a familiar problem: a long list of channels with few ways to organize it. I ran a 22-question survey with 25 responses and a heuristic evaluation. Clutter, the lack of grouping, and the effort of remembering where to look became the main design problems."
      },
      {
        "title": "Comparing three ways forward",
        "body": "I compared a folder-based sidebar, scoped search and filters, and a subscriptions dashboard with six participants. The folder concept led across the four measures, and four of the six participants chose it as their preference. That gave me a direction for the next prototype.",
        "media": [
          "img/portfolio/youtube-redesign/1.png"
        ]
      },
      {
        "title": "Combining organization with search",
        "body": "The medium-fidelity prototype combines collapsible folders, channel counts, scoped search, and a move-to-folder menu. In a final evaluation with 25 participants, 96–100% rated the key usability dimensions four or five out of five. The menu below shows one of the small actions that makes the organization possible.",
        "media": [
          "img/portfolio/youtube-redesign/5.png"
        ],
        "arrangement": "inset"
      }
    ],
    "captions": {
      "img/portfolio/youtube-redesign/1.png": "Folders give the subscription sidebar a visible structure.",
      "img/portfolio/youtube-redesign/5.png": "Moving a channel into a folder is available from its overflow menu."
    },
    "related": {
      "href": "/notes/2026-10-17-starting-again-with-hci",
      "label": "What I learned in HCI"
    }
  },
  "agent-builder": {
    "role": "Creation-flow design & prototyping",
    "status": "Copilot agent-creation exploration",
    "opening": "paired",
    "sections": [
      {
        "title": "Making configuration part of the experience",
        "body": "Creating an agent asks someone to describe its purpose, choose information sources, and understand what it will do. I prototyped creation and configuration flows inside Copilot, working through how those decisions could fit into the surrounding product. The configuration view makes the agent’s purpose and connected information visible.",
        "media": [
          "img/portfolio/agent-builder/1.png"
        ]
      },
      {
        "title": "Trying the flow end to end",
        "body": "I built end-to-end prototypes for stakeholder demos and UX validation, then iterated on the interaction details through feedback. The follow-up interaction and later configuration view show parts of that work, connecting the setup decisions to an experience people could try.",
        "media": [
          "img/portfolio/agent-builder/followup.gif",
          "img/portfolio/agent-builder/2.png"
        ],
        "arrangement": "pair"
      }
    ],
    "captions": {
      "img/portfolio/agent-builder/1.png": "The configuration surface brings purpose, guidelines, and connected information together.",
      "img/portfolio/agent-builder/followup.gif": "A follow-up interaction from the agent-creation prototype.",
      "img/portfolio/agent-builder/2.png": "A later configuration view from the same exploration."
    }
  },
  "flubert": {
    "role": "Semantic retrieval & Figma plugin development",
    "status": "Fluent design-assistant project",
    "opening": "paired",
    "sections": [
      {
        "title": "Finding an asset by what it means",
        "body": "A designer may know the idea they want to express without knowing the right asset name. My work on Flubert included icon and emoji suggestions backed by a vector database of Fluent assets. I collected asset metadata and built search indexes to help the assistant retrieve semantically relevant suggestions inside Figma.",
        "media": [
          "img/portfolio/flubert/flubert_ex1.png"
        ]
      },
      {
        "title": "Bringing design-system guidance into the workflow",
        "body": "Flubert also analyzes interfaces against Fluent guidelines and surfaces recommendations. I integrated LLM-based analysis to support that feedback. The examples here show the assistant within the design workflow, alongside its asset suggestions.",
        "media": [
          "img/portfolio/flubert/flubert_ex2.png",
          "img/portfolio/flubert/flubert_ex3.png"
        ],
        "arrangement": "pair"
      }
    ],
    "captions": {
      "img/portfolio/flubert/flubert_ex1.png": "An icon-search request returns suggested Fluent assets inside the assistant.",
      "img/portfolio/flubert/flubert_ex2.png": "Emoji suggestions respond to requests for sports and heart metaphors.",
      "img/portfolio/flubert/flubert_ex3.png": "The assistant suggests emoji and icons for a described concept."
    }
  },
  "nav2": {
    "role": "Technical prototyping & interaction design",
    "status": "Four-day collaborative exploration",
    "opening": "essay",
    "sections": [
      {
        "title": "Four days to make the direction tangible",
        "body": "I worked closely with Ankit Potdar on an early navigation prototype for Copilot. With four days to build, we had to be deliberate about scope. My role was to translate the UX direction into working navigation flows and interactive states that stakeholders could evaluate."
      },
      {
        "title": "Behavior across contexts",
        "body": "The prototype explores expansion, transitions, selection, and feedback across different parts of the interface. I worked through how those states connect, keeping the design intent and the practical limits of the implementation in view.",
        "media": [
          "img/portfolio/nav2/nav2.gif",
          "img/portfolio/nav2/functionality.gif"
        ],
        "arrangement": "pair"
      },
      {
        "title": "The smaller moments matter too",
        "body": "A navigation system is also made of small responses to input. The pill interaction below is one detail from the exploration. Together, the working flows and these smaller behaviors gave the team something concrete to discuss in stakeholder reviews.",
        "media": [
          "img/portfolio/nav2/pill%20bounce.gif"
        ],
        "arrangement": "inset"
      }
    ],
    "captions": {
      "img/portfolio/nav2/nav2.gif": "The working navigation prototype connects surfaces and interaction states.",
      "img/portfolio/nav2/functionality.gif": "A closer look at the functionality panel.",
      "img/portfolio/nav2/pill%20bounce.gif": "A selection-pill micro-interaction from the exploration."
    },
    "related": {
      "href": "/notes/2025-06-21-making-navigation-feel-like-a-place-to-return",
      "label": "Read about the four-day build"
    }
  },
  "fluent": {
    "role": "Open-source tooling & asset maintenance",
    "status": "Fluent icons, emoji & animated assets",
    "opening": "visual",
    "sections": [
      {
        "title": "Design assets have a life beyond the canvas",
        "body": "I maintained and created repositories and npm packages for the Fluent Design System. The work spans icons, emoji, and animated assets used across Microsoft’s products, with updates and fixes for Android, iOS, React, and React Native.",
        "media": [
          "img/portfolio/fluent/react-icons.png",
          "img/portfolio/fluent/svg-icons.png"
        ],
        "arrangement": "pair"
      },
      {
        "title": "Connecting the assets to their consumers",
        "body": "That work included adding image analysis to the icon scripting pipeline and helping get updates into the packages and formats people use. I also helped open-source the emoji library through Figma and GitHub.",
        "media": [
          "img/portfolio/fluent/fluentui-system-icons.png"
        ],
        "arrangement": "inset"
      },
      {
        "title": "Making room for motion",
        "body": "For animated emoji, I created an open-source APNG repository with tooling built on apng assembler, ImageMagick, and Node.js. The repository is one part of the work of preparing, maintaining, and sharing a design asset library.",
        "media": [
          "img/portfolio/fluent/fluentui-emoji-animated.png"
        ],
        "arrangement": "inset"
      }
    ],
    "captions": {
      "img/portfolio/fluent/fluentui-emoji.png": "The Fluent Emoji repository makes the asset library available in the open.",
      "img/portfolio/fluent/react-icons.png": "A React package for consuming Fluent icons.",
      "img/portfolio/fluent/svg-icons.png": "The SVG icon package provides another way to use the assets.",
      "img/portfolio/fluent/fluentui-system-icons.png": "The shared system-icons repository.",
      "img/portfolio/fluent/fluentui-emoji-animated.png": "The animated emoji repository distributes APNG assets."
    },
    "leadImage": "img/portfolio/fluent/fluentui-emoji.png"
  }
};
