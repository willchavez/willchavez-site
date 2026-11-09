// Dates and changes are drawn from the exported commit messages.
export interface ProjectTimelineItem {
  date: string;
  title: string;
  body: string;
}
export const assetLibraryTimeline: ProjectTimelineItem[] = [
  { date: 'Jul 29', title: 'Search and detail presentations', body: 'The first commit describes inline expansion, a modal, and a right rail.' },
  { date: 'Aug 3–5', title: 'Search and layout', body: 'Search fixes, count removal, and grid layout simplification.' },
  { date: 'Aug 6', title: 'Interaction states', body: 'Hover, selection, and border treatments.' },
  { date: 'Aug 7', title: 'Rendering and virtualization', body: 'Virtualizer changes, inherited SVG attributes, and compositing fixes.' },
  { date: 'Aug 10–13', title: 'Details and finishing work', body: 'Scrollable details, loading skeletons, high-contrast fixes, and return to top.' },
];
