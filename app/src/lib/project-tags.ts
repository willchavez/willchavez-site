const skills: Record<string, string> = {
  Composition: 'Design',
  Interaction: 'Interaction',
  'Interaction design': 'Design',
  'Interaction patterns': 'Interaction',
  'Interactive states': 'Interaction',
  'Creation flows': 'Interaction',
  Prototyping: 'Prototyping',
  'High-fidelity prototypes': 'Prototyping',
  'React & TypeScript': 'Code',
  'Full-stack development': 'Code',
  'Asset systems': 'Assets',
  'Asset pipelines': 'Assets',
  'Design systems': 'Design systems',
  'Data visualization': 'Data viz',
  'Agent guidance': 'AI',
  'Figma plugins': 'Figma',
  Figma: 'Figma',
  SVG: 'SVG',
  Automation: 'Automation',
  CI: 'Automation',
  'Image analysis': 'Image analysis',
  'Designer workflows': 'Design tools',
  Needfinding: 'Research',
  Research: 'Research',
  Evaluation: 'Testing',
  'Information architecture': 'Navigation',
  Navigation: 'Navigation',
  'Semantic retrieval': 'Search',
  'Open source': 'Open source',
  'Cross-platform': 'Cross-platform',
  Community: 'Community',
};
/** Short labels on index cards; detailed project skill descriptions stay intact. */
export function projectTags(project: { category: string; skills: string }): string[] {
  const tags = [project.category];
  for (const skill of project.skills.split(' · ')) {
    const tag = skills[skill] || skill;
    if (!tags.includes(tag)) tags.push(tag);
  }
  return tags;
}
