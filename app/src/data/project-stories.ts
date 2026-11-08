// Editorial summaries grounded in the existing project records and Notes.
export const projectStories: Record<string, {
  role: string; status: string; sections: { title: string; body: string }[];
  captions: Record<string, string>; related?: { href: string; label: string };
}> = {
  "genui-bebop": {
    role: "Interaction design & prototyping", status: "Exploratory prototypes",
    sections: [
      { title: "A response needs somewhere to go", body: "A chat response can hold a lot of information. Reading through all of it is another story. I explored what happens when the response has a layout: a clear hierarchy, sections you can scan, and actions beside the information they belong to." },
      { title: "Making the layout part of the conversation", body: "I built prototypes to try different ways of composing that output. The daily summary brings tasks and an audio briefing together; another exploration uses a chart and supporting text to explain a comparison. The question was how the interface could help someone make sense of the answer." },
      { title: "Something we could react to", body: "These were explorations, built to make the ideas concrete in conversations with design and engineering. My work focused on the layout, hierarchy, and interaction patterns. The screens here are prototypes used to explore those directions." },
    ],
    captions: {
      "img/portfolio/genui/1.png": "A daily summary groups a briefing, tasks, and actions into a page someone can scan.",
      "img/portfolio/genui/2.png": "A visual comparison gives the numbers a hierarchy, with supporting context directly below.",
      "img/portfolio/genui/3.png": "An alternative response layout from the generative interface explorations.",
      "img/portfolio/genui/4.png": "Another composition explored as part of the same prototype work.",
      "img/portfolio/genui/5.png": "A further variation used to explore the structure of generated responses.",
    },
  },
  "icon-scaling-tool": {
    role: "Figma plugin development & automation", status: "Used in the icon release workflow",
    sections: [
      { title: "The repetitive part adds up", body: "An icon needs to leave Figma in several sizes and formats before it can reach a product. I worked directly with designers on the plugin, iterating on the parts of that export workflow they needed help with." },
      { title: "From a button to a pipeline", body: "I made the plugin run headlessly so the same work could happen inside the bi-weekly icon release process. That meant taking an interactive designer tool and making it usable by automation, too." },
      { title: "More than resizing", body: "I also combined vector paths to reduce SVG node counts and added metadata exports for metaphors, descriptions, sizes, and themes. The work connected the assets designers make with the files and information that downstream tools need." },
    ],
    captions: {
      "img/portfolio/icon-scaling-tool/ist-export.png": "The export panel brings the icon sizing and format options into the designer’s Figma workflow.",
      "img/portfolio/icon-scaling-tool/ist-headless.png": "Headless mode lets the plugin run as part of the automated icon release pipeline.",
      "img/portfolio/icon-scaling-tool/ist-rename.gif": "Renaming tools help prepare the icon set for export.",
      "img/portfolio/icon-scaling-tool/ist-squash.png": "Combining vector paths reduces the number of nodes in the exported SVG.",
    },
  },
  "hireharlem": {
    role: "Full-stack development", status: "Volunteer team project",
    sections: [
      { title: "A good reason to spend Sundays coding", body: "Hire Harlem started with a simple idea: make it easier to find businesses owned by people of color, women, and longtime neighborhood residents. I met Alex through work, we became friends, and the project gave us a way to put some of that energy back into the community." },
      { title: "Making room for the next interview", body: "The original site used static interview files that had to be recreated for each new story. We moved that content into a database with an API, so adding an interview didn’t require repeating the same development work." },
      { title: "Rebuilding it together", body: "When Sasha joined with a redesign, we rebuilt the site using React, Redux, Express, and MongoDB. We worked together every week, connecting the interviews and business listings to a new interface. It was a small team making something we cared about." },
    ],
    captions: {
      "img/portfolio/hire-harlem/hire-harlem_figma.png": "The redesign that gave our team a shared direction for the rebuild.",
      "img/portfolio/hire-harlem/hire-harlem_now.gif": "The rebuilt site brings neighborhood businesses and their stories together.",
      "img/portfolio/hire-harlem/hire-harlem_old.png": "The earlier site, before the redesign and content-management changes.",
    },
    related: { href: "/notes/2020-03-20-rebuilding-hireharlem-com", label: "Read the story behind Hire Harlem" },
  },
};
