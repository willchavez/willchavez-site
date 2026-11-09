import { assetLibraryTimeline, type ProjectTimelineItem } from './asset-library-timeline.ts';
// Presentation narratives are curated separately from the reading experience.
// Keep collaborator names, evaluation figures, and outcomes grounded in the
// project records and linked Notes. Explorations do not imply shipped results.
export interface PresentationSlide {
  section: string;
  title: string;
  body?: string;
  points?: string[];
  details?: { label: string; body: string }[];
  links?: { href: string; label: string }[];
  media?: string[];
  timeline?: ProjectTimelineItem[];
  embed?: { src: string; title: string; caption: string; kind: "coffee" | "gallery" };
}
export interface ProjectPresentation {
  collaborators: string;
  slides: PresentationSlide[];
}
export const projectPresentations: Record<string, ProjectPresentation> = {
  "fluent-asset-library": {
    "collaborators": "Jason Custer · Principal Product Design Manager, designer & illustrator · design guidance, feedback, and critiques",
    "slides": [
      {
        "section": "Context",
        "title": "The brief was to show the icons",
        "body": "Use the actual CDN images and technical assets to demonstrate the collection on the upcoming Fluent Flex design site.",
        "media": [
          "img/portfolio/fluent-asset-library/asset-library-emoji-scroll.gif"
        ]
      },
      {
        "section": "My role & collaboration",
        "title": "Room to design the experience, too",
        "details": [
          { "label": "My work", "body": "I designed and built the browser and its React/TypeScript implementation." },
          { "label": "Working with Jason", "body": "Jason Custer, Principal Product Design Manager, guided me through design feedback and critiques." },
          { "label": "Room to design", "body": "He made room for my creativity, including learning where to reduce space and where to add it." }
        ]
      },
      {
        "section": "Design question",
        "title": "Three asset families, different choices",
        "body": "Icons need size and style; emoji need skin tone and format; illustrations need size and theme. The controls need to match the asset.",
        "media": [
          "img/portfolio/fluent-asset-library/asset-library-browsing.gif"
        ]
      },
      {
        "section": "Interaction",
        "title": "Keep one active variant connected",
        "points": [
          "Variant controls and carousel selection stay synchronized with the preview.",
          "Copy URL and Download use the active variant.",
          "Hide controls when the asset has no corresponding metadata."
        ],
        "media": [
          "img/portfolio/fluent-asset-library/asset-library-search-variants.gif"
        ]
      },
      {
        "section": "Implementation",
        "title": "Group once. Load what’s needed.",
        "media": ["img/portfolio/fluent-asset-library/asset-library-original.png"],
        "body": "Build category indexes from CDN variant records, cache each category on demand, and render visible grid rows plus a buffer."
      },
      {
        "section": "Iteration",
        "title": "Refine the experience in the details",
        "body": "Changes recorded across the July 29–August 13 commit history.",
        "timeline": assetLibraryTimeline
      },
      {
        "section": "Refinement",
        "title": "Preserve the asset—and your place",
        "points": [
          "Restore category scroll position and anchor the selected item on resize.",
          "Preserve SVG presentation attributes and namespace IDs.",
          "Handle keyboard focus, loading, live announcements, reduced motion, and forced colors."
        ],
        "media": [
          "img/portfolio/fluent-asset-library/asset-library-bug-viewer.gif"
        ]
      },
      {
        "section": "Result",
        "title": "A browser from discovery to the file",
        "body": "PR #1096 merged August 13, 2026. The final change connects search, variants, previews, and file actions across icons, emoji, and illustrations. The library and PR require Microsoft access."
      }
    ]
  },

  'fluent-dataviz': {
    collaborators: 'Fluent Design Studio and the Fluent Flex design system team',
    slides: [
      { section: 'Context', title: 'Charts carry many small decisions', body: 'A chart needs consistent choices for labels, spacing, color, and interaction as well as the right form.' },
      { section: 'My role & collaboration', title: 'Create the flex-dataviz plugin', details: [{"label": "My work", "body": "Creator of the flex-dataviz plugin."}, {"label": "Together", "body": "Fluent Design Studio and the Fluent Flex design system team."}, {"label": "What I contributed", "body": "Chart guidance, interactive galleries, and a five-minute walkthrough."}] },
      { section: 'System', title: 'Three plugins, one shared language', body: 'The walkthrough connects flex-system principles, flex-tokens values, and flex-dataviz chart guidance. An agency.toml file gives an agent access to that system.' },
      { section: 'Structure', title: 'From principles to chart-specific rules', body: 'Shared guidance covers corner radius, typography, density, and color with patterns. Skills for axes, legends, callouts, and individual chart types make those rules actionable.', embed: { src: '/dataviz/gallery-v2.html?embed=portfolio', title: 'Interactive Sankey and heatmap examples', caption: 'Hover or focus a flow or cell to inspect the original gallery charts.', kind: 'gallery' } },
      { section: 'Ask', title: 'Ask naturally. Generate coherently.', body: 'The walkthrough asks for charts about a Seattle coffee crawl: monthly latte orders, neighborhood favorites, café buzz, and rainy-day drinks.', embed: { src: '/dataviz/walkthrough.html?embed=portfolio', title: 'Interactive Seattle coffee crawl charts', caption: 'Hover or focus a chart mark to inspect the walkthrough examples.', kind: 'coffee' } },
      { section: 'Evaluate', title: 'Use the output to improve the system', body: 'The generated charts become an evaluation surface. They reveal where guidance needs to be more precise, accessible, or ready for implementation.' },
      { section: 'Next', title: 'From guidance to Figma generation', points: ['Translate the guidance into drawing rules.', 'Generate varied chart batches.', 'Keep the layers clean so designers can keep working with the output.'] },
      { section: 'Explore', title: 'Open the full walkthrough and galleries', body: 'The five-minute walkthrough and two HTML galleries are linked from the project article. They include the complete narrative and chart families beyond these embedded examples.' },
    ],
  },
  'genui-bebop': {
    collaborators: 'Design and engineering in Fluent Design Studio',
    slides: [
      { section: 'Context', title: 'A useful answer can still be hard to read', body: 'Copilot output can contain tasks, comparisons, and supporting information. A wall of text leaves people to assemble that structure themselves.' },
      { section: 'My role & collaboration', title: 'Make the design conversation tangible', details: [{"label": "My work", "body": "Interaction design, layout, and technical prototyping."}, {"label": "Together", "body": "Design and engineering in Fluent Design Studio."}, {"label": "What I contributed", "body": "Working response patterns that stakeholders could try and discuss."}] },
      { section: 'Design question', title: 'What if the response had a layout?', body: 'Explore hierarchy, scannable sections, and actions placed beside the information they belong to.', media: ['img/portfolio/genui/1.png'] },
      { section: 'Explorations', title: 'Let the information shape the composition', body: 'A numerical comparison and a timeline call for different structures. These prototypes explore those differences.', media: ['img/portfolio/genui/2.png', 'img/portfolio/genui/3.png'] },
      { section: 'Explorations', title: 'Try the idea across different answers', body: 'Policy comparisons and meeting recaps extend the exploration beyond a daily summary.', media: ['img/portfolio/genui/4.png', 'img/portfolio/genui/5.png'] },
      { section: 'Where it landed', title: 'From explorations to a shared card framework', body: 'We presented the work to Jon Friedman, our Chief Design Officer, and worked with Microsoft AI (MAI) to help build a card framework for generative UI/UX.' },
    ],
  },
  'bebop': {
    collaborators: 'Design and engineering teams working on Microsoft 365 Copilot',
    slides: [
      { section: 'Context', title: 'A redesign is also a collection of small behaviors', body: 'The project came to our team from Ryan Roslansky, then CEO of LinkedIn. We worked through the redesign with prototypes that made the interactions tangible alongside the visual direction.' },
      { section: 'My role & collaboration', title: 'Bridge design intent and working behavior', details: [{"label": "My work", "body": "Interaction design and high-fidelity technical prototyping."}, {"label": "Together", "body": "Design and engineering teams."}, {"label": "What I contributed", "body": "Response composition, interaction patterns, and interface details."}] },
      { section: 'Design question', title: 'How should the conversation respond?', body: 'Working through input, sending, and response behavior in a prototype gave the team an experience to evaluate.', media: ['img/portfolio/bebop/send.gif'] },
      { section: 'Iteration', title: 'Refine the controls in context', body: 'Explore prompt and image-refinement controls as part of the surrounding conversation.', media: ['img/portfolio/bebop/refiner.png'] },
      { section: 'Design principles', title: 'Every control has to earn its place', details: [{ label: 'Progressive disclosure', body: 'Start with what people need now. Reveal more as they use the experience, so they can learn without facing every control at once.' }, { label: 'Simplicity', body: 'Keep the main task clear. Reduce the interface people have to work through to get there.' }, { label: 'Purpose', body: 'An item belongs in the interface when it helps someone understand, decide, or act.' }] },
      { section: 'Iteration', title: 'Zoom out to the workspace', body: 'The wider workspace and refinement flows connect the smaller interaction decisions to the overall experience.', media: ['img/portfolio/bebop/zoomedout.gif', 'img/portfolio/bebop/refiners1.gif'] },
      { section: 'Shipped', title: 'Part of the redesign that shipped', body: 'The redesigned experience shipped in Microsoft 365 Copilot. My interaction design and high-fidelity prototypes helped shape the input, response, and refinement patterns the team brought together.', links: [{ href: 'https://www.microsoft.com/en-us/copilot/blog/2026/05/28/introducing-a-new-design-for-microsoft-365-copilot/', label: 'Read the launch story by Jon Friedman' }] },
    ],
  },
  'icon-scaling-tool': {
    collaborators: 'Designers working on Fluent icons and the icon release workflow',
    slides: [
      { section: 'Context', title: 'Every icon has several places to go', body: 'Getting an icon from Figma into products means preparing sizes, formats, and metadata. Repeating those steps across a library adds up.' },
      { section: 'My role & collaboration', title: 'Build around the designers’ workflow', details: [{"label": "My work", "body": "Figma plugin development and automation."}, {"label": "Together", "body": "Designers working on Fluent icons."}, {"label": "What I contributed", "body": "Export tooling, headless execution, SVG processing, and metadata."}] },
      { section: 'Design idea', title: 'Bring the export work into Figma', body: 'The plugin scales icons and exports PDF and SVG assets from the place designers already work.', media: ['img/portfolio/icon-scaling-tool/ist-export.png'] },
      { section: 'Iteration', title: 'Prepare the assets as well as the sizes', body: 'Renaming tools and combined vector paths address the details that make exported assets usable downstream.', media: ['img/portfolio/icon-scaling-tool/ist-rename.gif', 'img/portfolio/icon-scaling-tool/ist-squash.png'] },
      { section: 'Change', title: 'Make the same tool run without a person clicking', body: 'Headless execution lets the plugin participate in the automated bi-weekly icon release pipeline.', media: ['img/portfolio/icon-scaling-tool/ist-headless.png'] },
      { section: 'Where it landed', title: 'An export tool connected to the release process', points: ['Used in the icon release workflow.', 'Exports include metaphor, description, size, and theme metadata.', 'The plugin supports both interactive use and automated releases.'] },
    ],
  },
  'visual-diff': {
    collaborators: 'Designers and engineers reviewing Fluent icon updates',
    slides: [
      { section: 'Context', title: 'Small changes are easy to miss', body: 'An updated icon can be subtly different from the version it replaces. Reviewers need to see exactly what changed.' },
      { section: 'My role & collaboration', title: 'Give the review a shared reference', details: [{"label": "My work", "body": "Image-analysis tooling and CI integration."}, {"label": "Together", "body": "Designers and engineers reviewing Fluent icons."}, {"label": "What I contributed", "body": "Visual overlays, numerical comparisons, and automated reports."}] },
      { section: 'Design idea', title: 'Put both versions in the same place', body: 'Color and transparency expose changed pixels; an ImageMagick diff score adds a numerical comparison.', media: ['img/portfolio/visual-diff/icon-diff-2.gif'] },
      { section: 'Earlier workflow', title: 'Start with a browser-based report', body: 'The initial version was a standalone website that required manual updates.', media: ['img/portfolio/visual-diff/icon-diff-1.gif'] },
      { section: 'Change', title: 'Move the analysis into the release pipeline', body: 'A Python script generates the report during the bi-weekly icon release process.', media: ['img/portfolio/visual-diff/icon-diff-3.gif'] },
      { section: 'Where it landed', title: 'Visual evidence generated with the release', points: ['Designers and engineers can review the same before-and-after changes.', 'Reports no longer need to be assembled manually for each release.', 'The comparison remains both visual and numerical.'] },
    ],
  },
  'peer-survey': {
    collaborators: 'Aaquib Khwaja, Anna Levenberg, and Jackson Lyons; Georgia Tech HCI',
    slides: [
      { section: 'Context', title: 'Feedback was separated from the work', body: 'Canvas asks reviewers to move between a submission and feedback forms. Our team investigated that disconnect through surveys, heuristic evaluation, and forum analysis.' },
      { section: 'My role & collaboration', title: 'Own one concept within a team investigation', details: [{"label": "My work", "body": "Lead design and prototyping for PeerView."}, {"label": "Together", "body": "Aaquib Khwaja, Anna Levenberg, and Jackson Lyons."}, {"label": "What I contributed", "body": "I also contributed to research and the comparative usability study."}] },
      { section: 'Design idea', title: 'Keep the document and comments together', body: 'A split-screen editor places the submission beside structured feedback.', media: ['img/portfolio/peer-survey/3.png'] },
      { section: 'Interaction details', title: 'Attach the comment to what prompted it', points: ['Highlight a passage to add a comment.', 'Categorize it as Thought, Question, Nit, or Action.', 'Review a confirmation before posting.'], media: ['img/portfolio/peer-survey/4.png'] },
      { section: 'Following the flow', title: 'Support both giving and receiving feedback', body: 'The dashboard surfaces assigned reviews. Received feedback preserves the original document context.', media: ['img/portfolio/peer-survey/1.png', 'img/portfolio/peer-survey/5.png'] },
      { section: 'Evaluation', title: 'The highest-rated concept in our study', points: ['17 participants evaluated the concepts.', 'PeerView was the highest-rated concept.', 'The comparison favored the comment-centric review direction.'] },
    ],
  },
  'youtube-redesign': {
    collaborators: 'Individual HCI project informed by research and evaluation participants',
    slides: [
      { section: 'Context', title: 'Subscriptions needed some structure', points: ['A 22-question survey gathered 25 responses.', 'A heuristic evaluation examined the existing flow.', 'Clutter, lack of grouping, and memory burden emerged as the main problems.'] },
      { section: 'My role & collaboration', title: 'Carry a research question through a design cycle', details: [{"label": "My work", "body": "Research, information architecture, and prototyping."}, {"label": "The project", "body": "This was an individual Georgia Tech HCI project."}, {"label": "Research participants", "body": "Participants informed needfinding, concept comparison, and the final evaluation."}] },
      { section: 'Alternatives', title: 'Compare three ways to organize subscriptions', points: ['A folder-based sidebar.', 'Scoped search and filters.', 'A subscriptions dashboard.'], body: 'Six participants evaluated the low-fidelity concepts across four measures.' },
      { section: 'Decision', title: 'Use folders as the organizing structure', body: 'The folder concept led across the measures, and four of six participants chose it as their preference.' },
      { section: 'Iteration', title: 'Combine organization with scoped search', body: 'The medium-fidelity prototype brings collapsible folders, channel counts, scoped search, and filtering into one flow.', media: ['img/portfolio/youtube-redesign/1.png'] },
      { section: 'Interaction details', title: 'Make the organization manageable', body: 'Move a channel from its overflow menu, or create a folder when a new grouping is needed.', media: ['img/portfolio/youtube-redesign/5.png', 'img/portfolio/youtube-redesign/2.png'] },
      { section: 'Evaluation', title: 'Test the combined direction', points: ['25 participants evaluated the final prototype.', '96–100% rated the key usability dimensions 4 or 5 out of 5.', 'Folders, scoped search, and filtering formed the evaluated direction.'] },
    ],
  },
  'agent-builder': {
    collaborators: 'Copilot stakeholders and UX reviewers',
    slides: [
      { section: 'Context', title: 'Agent creation brings several decisions together', body: 'Someone creating an agent needs to describe its purpose, choose information sources, and understand what it will do.' },
      { section: 'My role & collaboration', title: 'Make setup something people could try', details: [{"label": "My work", "body": "Creation-flow design and technical prototyping."}, {"label": "Together", "body": "Stakeholder demos and UX validation."}, {"label": "What I contributed", "body": "End-to-end creation flows and interaction details inside Copilot."}] },
      { section: 'Design idea', title: 'Keep configuration inside the product experience', body: 'Make the agent’s purpose, guidelines, and connected information visible together.', media: ['img/portfolio/agent-builder/1.png'] },
      { section: 'Iteration', title: 'Work through the follow-up interaction', body: 'An end-to-end prototype connects configuration choices with the interactions that follow.', media: ['img/portfolio/agent-builder/followup.gif'] },
      { section: 'Iteration', title: 'Refine the configuration surface through feedback', body: 'A later configuration view is part of the same creation-flow exploration.', media: ['img/portfolio/agent-builder/2.png'] },
      { section: 'Where it landed', title: 'A working flow for stakeholder and UX review', points: ['Prototypes supported stakeholder demos and UX validation.', 'Feedback informed changes to the interaction details.', 'Creation and configuration stayed within the Copilot surface.'] },
    ],
  },
  'flubert': {
    collaborators: 'Fluent Design Studio, working on a Figma design assistant',
    slides: [
      { section: 'Context', title: 'Knowing the idea is easier than knowing the asset name', body: 'A designer can describe what they want to express without knowing which icon or emoji to search for.' },
      { section: 'My role & collaboration', title: 'Connect the assistant to Fluent’s assets', details: [{"label": "My work", "body": "Semantic retrieval and Figma plugin development."}, {"label": "The context", "body": "A Fluent Design Studio design assistant."}, {"label": "What I contributed", "body": "Asset metadata, vector search indexes, and LLM-based analysis."}] },
      { section: 'Design idea', title: 'Find an asset by what it means', body: 'A vector database of Fluent icon and emoji metadata supports semantically relevant suggestions inside Figma.', media: ['img/portfolio/flubert/flubert_ex1.png'] },
      { section: 'Exploring requests', title: 'Try different concepts and metaphors', body: 'These examples show sports, heart metaphors, and described concepts as inputs to the assistant.', media: ['img/portfolio/flubert/flubert_ex2.png', 'img/portfolio/flubert/flubert_ex3.png'] },
      { section: 'Broader contribution', title: 'Bring design-system guidance into the workflow', body: 'I integrated LLM-based analysis to evaluate interfaces against Fluent guidelines and surface recommendations.' },
      { section: 'Where it landed', title: 'Retrieval and guidance inside the design tool', points: ['Icon and emoji suggestions backed by Fluent asset metadata.', 'Search indexes for semantically relevant retrieval.', 'Design-system feedback within the Figma assistant.'] },
    ],
  },
  'nav2': {
    collaborators: 'Ankit Potdar — PM, scope, and partner-team coordination',
    slides: [
      { section: 'Context', title: 'Four days to make a direction tangible', body: 'An early Copilot navigation exploration needed working flows that stakeholders could evaluate.' },
      { section: 'My role & collaboration', title: 'Work closely across design and implementation', details: [{"label": "My work", "body": "Development, navigation restructuring, and agent MRU logic."}, {"label": "Ankit Potdar", "body": "PM, priorities, and partner-team coordination."}, {"label": "Four-day scope", "body": "We kept design intent and engineering feasibility in view within a four-day scope."}] },
      { section: 'Design idea', title: 'Evaluate navigation as a connected system', body: 'Build the relationships between surfaces, hierarchy, selection, and feedback into a working prototype.', media: ['img/portfolio/nav2/nav2.gif'] },
      { section: 'Iteration', title: 'Help people return to useful work', body: 'I restructured the pane and added most recently used logic for agents, alongside expansion, selection, and feedback.', media: ['img/portfolio/nav2/functionality.gif'] },
      { section: 'Scope decisions', title: 'Keep the build focused', points: ['Defer drag-and-drop reordering of pinned agents and notebooks.', 'Defer the complete install, ask, and return-to-an-agent flow.', 'Defer notebook MRU behavior to keep the four-day build focused.'] },
      { section: 'Interaction details', title: 'Give the smaller moments their own attention', body: 'The pill interaction is one detail from the wider navigation exploration.', media: ['img/portfolio/nav2/pill%20bounce.gif'] },
      { section: 'Where it landed', title: 'A prototype for specific product conversations', points: ['The working flows made the direction tangible for stakeholder review.', 'Scope choices balanced the four-day schedule with design and engineering needs.', 'A later public Copilot rollout brought agents, notebooks, and recent chats into the pane—areas explored in this work.'] },
    ],
  },
  'fluent': {
    collaborators: 'Fluent Design Studio and the open-source design-system ecosystem',
    slides: [
      { section: 'Context', title: 'Design assets have a life beyond the canvas', body: 'Icons, emoji, and animated assets need to reach the formats and platforms used by products and developers.' },
      { section: 'My role & collaboration', title: 'Connect the library to its consumers', details: [{"label": "My work", "body": "Open-source tooling and asset maintenance."}, {"label": "The context", "body": "Fluent Design Studio’s shared design-system assets."}, {"label": "What I contributed", "body": "Repositories, packages, cross-platform fixes, and release tooling."}] },
      { section: 'Icons', title: 'Support the packages people build with', body: 'Updates and fixes span Android, iOS, React, and React Native, with image analysis added to the scripting pipeline.', media: ['img/portfolio/fluent/react-icons.png', 'img/portfolio/fluent/svg-icons.png'] },
      { section: 'Emoji', title: 'Make the library available in the open', body: 'I helped open-source Fluent Emoji through Figma and GitHub.', media: ['img/portfolio/fluent/fluentui-emoji.png'] },
      { section: 'Animated assets', title: 'Build the tooling for another format', body: 'I created an open-source animated emoji repository using APNG tooling built on apng assembler, ImageMagick, and Node.js.', media: ['img/portfolio/fluent/fluentui-emoji-animated.png'] },
      { section: 'Where it landed', title: 'Shared assets, maintained across platforms', points: ['Open-source icon packages and repositories.', 'An emoji library shared through Figma and GitHub.', 'An APNG repository for animated emoji.'] },
    ],
  },
  'hireharlem': {
    collaborators: 'Alex Ocampo and Sasha, working together in weekly volunteer sessions',
    slides: [
      { section: 'Context', title: 'Help people discover businesses in their community', body: 'Hire Harlem connected people with minority-owned businesses and their stories, starting in Harlem and expanding to Oakland.' },
      { section: 'My role & collaboration', title: 'A small team, building together on Sundays', details: [{"label": "My work", "body": "Full-stack development."}, {"label": "Alex Ocampo", "body": "Development, project management, and platform work."}, {"label": "Sasha", "body": "The redesign and reusable component direction."}] },
      { section: 'Earlier workflow', title: 'Every interview repeated development work', body: 'Static interview files had to be recreated for new stories. We moved the content into a database and API.', media: ['img/portfolio/hire-harlem/hire-harlem_old.png'] },
      { section: 'Design direction', title: 'A redesign gave the rebuild a shared direction', body: 'Sasha’s designs and reusable components gave the team a concrete interface to work toward.', media: ['img/portfolio/hire-harlem/hire-harlem_figma.png'] },
      { section: 'Iteration', title: 'Rebuild the views and APIs week by week', body: 'Alex and I worked through React, reusable components, server APIs, and Redux together in our Sunday sessions.', media: ['img/portfolio/hire-harlem/hire-harlem_now.gif'] },
      { section: 'Where it landed', title: 'A rebuilt site for the same community mission', points: ['A React and Redux interface connected to an Express API and MongoDB.', 'A content model that supports adding interviews without recreating static pages.', 'A shared volunteer effort across design, development, and project management.'] },
    ],
  },
};
