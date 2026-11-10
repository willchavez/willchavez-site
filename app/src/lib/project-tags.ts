type Tone = 'blue' | 'lilac' | 'green' | 'amber' | 'rose';
type Tag = { label: string; tone: Tone };
const categories: Record<string, Tone> = {
  'AI experiences': 'blue', 'Design tooling': 'lilac',
  'Research & learning': 'green', Community: 'rose',
};
const skills: Record<string, Tag> = {
  Composition: { label: 'Design', tone: 'lilac' },
  Interaction: { label: 'Interaction', tone: 'lilac' },
  'Interaction design': { label: 'Design', tone: 'lilac' },
  'Interaction patterns': { label: 'Interaction', tone: 'lilac' },
  'Interactive states': { label: 'Interaction', tone: 'lilac' },
  'Creation flows': { label: 'Interaction', tone: 'lilac' },
  Prototyping: { label: 'Prototyping', tone: 'amber' },
  'High-fidelity prototypes': { label: 'Prototyping', tone: 'amber' },
  'React & TypeScript': { label: 'Code', tone: 'green' },
  'Full-stack development': { label: 'Code', tone: 'green' },
  'Asset systems': { label: 'Assets', tone: 'blue' },
  'Asset pipelines': { label: 'Assets', tone: 'blue' },
  'Design systems': { label: 'Design systems', tone: 'lilac' },
  'Data visualization': { label: 'Data viz', tone: 'blue' },
  'Agent guidance': { label: 'AI', tone: 'amber' },
  'Figma plugins': { label: 'Figma', tone: 'lilac' },
  Figma: { label: 'Figma', tone: 'lilac' },
  SVG: { label: 'SVG', tone: 'blue' },
  Automation: { label: 'Automation', tone: 'green' },
  CI: { label: 'Automation', tone: 'green' },
  'Image analysis': { label: 'Image analysis', tone: 'blue' },
  'Designer workflows': { label: 'Design tools', tone: 'lilac' },
  Needfinding: { label: 'Research', tone: 'rose' },
  Research: { label: 'Research', tone: 'rose' },
  Evaluation: { label: 'Testing', tone: 'green' },
  'Information architecture': { label: 'Navigation', tone: 'lilac' },
  Navigation: { label: 'Navigation', tone: 'lilac' },
  'Semantic retrieval': { label: 'Search', tone: 'blue' },
  'Open source': { label: 'Open source', tone: 'green' },
  'Cross-platform': { label: 'Cross-platform', tone: 'amber' },
  Community: { label: 'Community', tone: 'rose' },
};
/** Short labels on index cards; detailed project skill descriptions stay intact. */
export function projectTags(project: { category: string; skills: string }): Tag[] {
  const tags: Tag[] = [{ label: project.category, tone: categories[project.category] || 'blue' }];
  for (const skill of project.skills.split(' · ')) {
    const tag = skills[skill] || { label: skill, tone: 'green' as const };
    if (!tags.some(existing => existing.label === tag.label)) tags.push(tag);
  }
  return tags;
}
