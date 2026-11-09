// Presentation narratives are curated separately from the reading experience.
// Keep collaborator names, evaluation figures, and outcomes grounded in the
// project records and linked Notes. Explorations do not imply shipped results.
export interface PresentationSlide {
  section: string;
  title: string;
  body?: string;
  points?: string[];
  media?: string[];
}
export interface ProjectPresentation {
  collaborators: string;
  slides: PresentationSlide[];
}
export const projectPresentations: Record<string, ProjectPresentation> = {
  'fluent-dataviz': {
    collaborators: 'Fluent Design Studio and the Fluent Flex design system team',
    slides: [
      { section: 'Context', title: 'Charts carry many small decisions', body: 'A chart needs consistent choices for labels, spacing, color, and interaction as well as the right form.' },
      { section: 'My role & collaboration', title: 'Make the guidance easier to use', points: ['My role: data visualization guidance and examples.', 'Collaboration: Fluent Design Studio and the Fluent Flex design system team.', 'Contribution: work on the flex-dataviz plugin and interactive material that demonstrates it.'] },
      { section: 'System', title: 'Start with principles, then choose a chart', body: 'Shared rules cover radius, typography, density, and color with patterns. Chart-specific skills build on those rules.', media: ['img/portfolio/dataviz/overview.png'] },
      { section: 'Details', title: 'Connect visual and interaction guidance', body: 'Axes, legends, and callouts support reading and exploring charts across the library.', media: ['img/portfolio/dataviz/color-patterns.png'] },
      { section: 'Examples', title: 'See the guidance in action', body: 'The linked HTML gallery brings the chart types together in an interactive browser view. A separate presentation explains the system and its structure.' },
    ],
  },
  'genui-bebop': {
    collaborators: 'Design and engineering in Fluent Design Studio',
    slides: [
      { section: 'Context', title: 'A useful answer can still be hard to read', body: 'Copilot output can contain tasks, comparisons, and supporting information. A wall of text leaves people to assemble that structure themselves.' },
      { section: 'My role & collaboration', title: 'Make the design conversation tangible', points: ['My role: interaction design, layout, and technical prototyping.', 'Collaboration: design and engineering in Fluent Design Studio.', 'Contribution: working response patterns that stakeholders could try and discuss.'] },
      { section: 'Design question', title: 'What if the response had a layout?', body: 'Explore hierarchy, scannable sections, and actions placed beside the information they belong to.', media: ['img/portfolio/genui/1.png'] },
      { section: 'Explorations', title: 'Let the information shape the composition', body: 'A numerical comparison and a timeline call for different structures. These prototypes explore those differences.', media: ['img/portfolio/genui/2.png', 'img/portfolio/genui/3.png'] },
      { section: 'Explorations', title: 'Try the idea across different answers', body: 'Policy comparisons and meeting recaps extend the exploration beyond a daily summary.', media: ['img/portfolio/genui/4.png', 'img/portfolio/genui/5.png'] },
      { section: 'Where it landed', title: 'A set of working directions to react to', points: ['Structured layouts made hierarchy and interaction concrete.', 'Design and engineering could discuss the behavior through prototypes.', 'Layouts covered summaries, comparisons, and meeting recaps.'] },
    ],
  },
  'bebop': {
    collaborators: 'Design and engineering teams working on Microsoft 365 Copilot',
    slides: [
      { section: 'Context', title: 'A redesign is also a collection of small behaviors', body: 'The Microsoft 365 Copilot redesign needed interaction patterns that could be judged through use, alongside the visual direction.' },
      { section: 'My role & collaboration', title: 'Bridge design intent and working behavior', points: ['My role: interaction design and high-fidelity technical prototyping.', 'Collaboration: design and engineering teams.', 'Contribution: response composition, interaction patterns, and interface details.'] },
      { section: 'Design question', title: 'How should the conversation respond?', body: 'Working through input, sending, and response behavior in a prototype gave the team an experience to evaluate.', media: ['img/portfolio/bebop/send.gif'] },
      { section: 'Iteration', title: 'Refine the controls in context', body: 'Explore prompt and image-refinement controls as part of the surrounding conversation.', media: ['img/portfolio/bebop/refiner.png'] },
      { section: 'Iteration', title: 'Zoom out to the workspace', body: 'The wider workspace and refinement flows connect the smaller interaction decisions to the overall experience.', media: ['img/portfolio/bebop/zoomedout.gif', 'img/portfolio/bebop/refiners1.gif'] },
      { section: 'Where it landed', title: 'Working interactions for the redesign', points: ['High-fidelity prototypes helped the team validate directions quickly.', 'The work contributed to the Microsoft 365 Copilot redesign.', 'Input, response, and refinement patterns could be reviewed together.'] },
    ],
  },
  'icon-scaling-tool': {
    collaborators: 'Designers working on Fluent icons and the icon release workflow',
    slides: [
      { section: 'Context', title: 'Every icon has several places to go', body: 'Getting an icon from Figma into products means preparing sizes, formats, and metadata. Repeating those steps across a library adds up.' },
      { section: 'My role & collaboration', title: 'Build around the designers’ workflow', points: ['My role: Figma plugin development and automation.', 'Collaboration: designers working on Fluent icons.', 'Contribution: export tooling, headless execution, SVG processing, and metadata.'] },
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
      { section: 'My role & collaboration', title: 'Give the review a shared reference', points: ['My role: image-analysis tooling and CI integration.', 'Audience and collaborators: designers and engineers reviewing Fluent icons.', 'Contribution: visual overlays, numerical comparisons, and automated reports.'] },
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
      { section: 'My role & collaboration', title: 'Own one concept within a team investigation', points: ['My role: lead design and prototyping for PeerView.', 'Team: Aaquib Khwaja, Anna Levenberg, and Jackson Lyons.', 'I also contributed to research and the comparative usability study.'] },
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
      { section: 'My role & collaboration', title: 'Carry a research question through a design cycle', points: ['My role: research, information architecture, and prototyping.', 'This was an individual Georgia Tech HCI project.', 'Participants informed needfinding, concept comparison, and the final evaluation.'] },
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
      { section: 'My role & collaboration', title: 'Make setup something people could try', points: ['My role: creation-flow design and technical prototyping.', 'Collaboration: stakeholder demos and UX validation.', 'Contribution: end-to-end creation flows and interaction details inside Copilot.'] },
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
      { section: 'My role & collaboration', title: 'Connect the assistant to Fluent’s assets', points: ['My role: semantic retrieval and Figma plugin development.', 'Project context: a Fluent Design Studio design assistant.', 'Contribution: asset metadata, vector search indexes, and LLM-based analysis.'] },
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
      { section: 'My role & collaboration', title: 'Work closely across design and implementation', points: ['My role: development, navigation restructuring, and agent MRU logic.', 'Ankit Potdar: PM, priorities, and partner-team coordination.', 'We kept design intent and engineering feasibility in view within a four-day scope.'] },
      { section: 'Design idea', title: 'Evaluate navigation as a connected system', body: 'Build the relationships between surfaces, hierarchy, selection, and feedback into a working prototype.', media: ['img/portfolio/nav2/nav2.gif'] },
      { section: 'Iteration', title: 'Help people return to useful work', body: 'I restructured the pane and added most recently used logic for agents, alongside expansion, selection, and feedback.', media: ['img/portfolio/nav2/functionality.gif'] },
      { section: 'Scope decisions', title: 'Choose the slice that answers the review question', points: ['Defer drag-and-drop reordering of pinned agents and notebooks.', 'Defer the complete install, ask, and return-to-an-agent flow.', 'Defer notebook MRU behavior to keep the four-day build focused.'] },
      { section: 'Interaction details', title: 'Give the smaller moments their own attention', body: 'The pill interaction is one detail from the wider navigation exploration.', media: ['img/portfolio/nav2/pill%20bounce.gif'] },
      { section: 'Where it landed', title: 'A prototype for specific product conversations', points: ['The working flows made the direction tangible for stakeholder review.', 'Scope choices balanced the four-day schedule with design and engineering needs.', 'A later public Copilot rollout brought agents, notebooks, and recent chats into the pane—areas explored in this work.'] },
    ],
  },
  'fluent': {
    collaborators: 'Fluent Design Studio and the open-source design-system ecosystem',
    slides: [
      { section: 'Context', title: 'Design assets have a life beyond the canvas', body: 'Icons, emoji, and animated assets need to reach the formats and platforms used by products and developers.' },
      { section: 'My role & collaboration', title: 'Connect the library to its consumers', points: ['My role: open-source tooling and asset maintenance.', 'Project context: Fluent Design Studio’s shared design-system assets.', 'Contribution: repositories, packages, cross-platform fixes, and release tooling.'] },
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
      { section: 'My role & collaboration', title: 'A small team, building together on Sundays', points: ['My role: full-stack development.', 'Alex Ocampo: development, project management, and platform work.', 'Sasha: the redesign and reusable component direction.'] },
      { section: 'Earlier workflow', title: 'Every interview repeated development work', body: 'Static interview files had to be recreated for new stories. We moved the content into a database and API.', media: ['img/portfolio/hire-harlem/hire-harlem_old.png'] },
      { section: 'Design direction', title: 'A redesign gave the rebuild a shared direction', body: 'Sasha’s designs and reusable components gave the team a concrete interface to work toward.', media: ['img/portfolio/hire-harlem/hire-harlem_figma.png'] },
      { section: 'Iteration', title: 'Rebuild the views and APIs week by week', body: 'Alex and I worked through React, reusable components, server APIs, and Redux together in our Sunday sessions.', media: ['img/portfolio/hire-harlem/hire-harlem_now.gif'] },
      { section: 'Where it landed', title: 'A rebuilt site for the same community mission', points: ['A React and Redux interface connected to an Express API and MongoDB.', 'A content model that supports adding interviews without recreating static pages.', 'A shared volunteer effort across design, development, and project management.'] },
    ],
  },
};
