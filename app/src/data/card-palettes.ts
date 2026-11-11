export type CardColors = { fills: readonly [string, string, string]; ink: string; muted: string; accent: string };
export type CardPalette = { id: string; label: string; light: CardColors; dark: CardColors };
/** These tokens are consumed only by About’s top blocks and Enjoying Grid. */
export const cardPalettes = [
  {
    "id": "soft",
    "label": "Blue & gold \u00b7 soft",
    "light": {
      "fills": [
        "#e2e7de",
        "#d9e6df",
        "#e9e5cc"
      ],
      "ink": "#264f63",
      "muted": "#435d63",
      "accent": "#2c6079"
    },
    "dark": {
      "fills": [
        "#2e586b",
        "#315f61",
        "#4a503e"
      ],
      "ink": "#dcfff6",
      "muted": "#c6dfd8",
      "accent": "#dad39a"
    }
  },
  {
    "id": "vivid",
    "label": "Blue & gold \u00b7 vivid",
    "light": {
      "fills": [
        "#d0e2ed",
        "#c8e2d4",
        "#eee0a8"
      ],
      "ink": "#264f63",
      "muted": "#435d63",
      "accent": "#2c6079"
    },
    "dark": {
      "fills": [
        "#315d78",
        "#2d615c",
        "#5a5036"
      ],
      "ink": "#dcfff6",
      "muted": "#c6dfd8",
      "accent": "#dad39a"
    }
  },
  {
    "id": "forest",
    "label": "Forest",
    "light": {
      "fills": [
        "#e7ebe2",
        "#e8ecd9",
        "#f6f7ef"
      ],
      "ink": "#253f35",
      "muted": "#526457",
      "accent": "#3d6651"
    },
    "dark": {
      "fills": [
        "#375342",
        "#425c45",
        "#2b483b"
      ],
      "ink": "#ecf3df",
      "muted": "#c1d0bc",
      "accent": "#c4d58e"
    }
  },
  {
    "id": "forest-moss",
    "label": "Forest \u00b7 Moss",
    "light": {
      "fills": [
        "#ebecdd",
        "#e7e8d4",
        "#f8f7eb"
      ],
      "ink": "#343c2c",
      "muted": "#5d6450",
      "accent": "#596b3e"
    },
    "dark": {
      "fills": [
        "#3c4532",
        "#434d36",
        "#30392a"
      ],
      "ink": "#f0f0da",
      "muted": "#c5cbb4",
      "accent": "#c6d18e"
    }
  },
  {
    "id": "forest-fern",
    "label": "Forest \u00b7 Fern",
    "light": {
      "fills": [
        "#e7efe3",
        "#e2eddb",
        "#f7fbf1"
      ],
      "ink": "#243f32",
      "muted": "#526854",
      "accent": "#326748"
    },
    "dark": {
      "fills": [
        "#2e553f",
        "#355c42",
        "#244a36"
      ],
      "ink": "#eafadf",
      "muted": "#bfd5bc",
      "accent": "#a9d9ae"
    }
  },
  {
    "id": "forest-pine",
    "label": "Forest \u00b7 Pine",
    "light": {
      "fills": [
        "#e3ece5",
        "#dde7df",
        "#f4f8f2"
      ],
      "ink": "#1f3d37",
      "muted": "#4b6460",
      "accent": "#225f52"
    },
    "dark": {
      "fills": [
        "#2a4942",
        "#2f4f47",
        "#203e38"
      ],
      "ink": "#e6f4e9",
      "muted": "#bad1c3",
      "accent": "#9acbb1"
    }
  },
  {
    "id": "forest-lichen",
    "label": "Forest \u00b7 Lichen",
    "light": {
      "fills": [
        "#efedde",
        "#eeedd6",
        "#fbf9ed"
      ],
      "ink": "#383d2c",
      "muted": "#63684c",
      "accent": "#606832"
    },
    "dark": {
      "fills": [
        "#474a34",
        "#505438",
        "#3a3e2c"
      ],
      "ink": "#f5f1d7",
      "muted": "#cecfb2",
      "accent": "#d8d98d"
    }
  },
  {
    "id": "plum",
    "label": "Plum",
    "light": {
      "fills": [
        "#f0e6ed",
        "#eee5ef",
        "#faf3f7"
      ],
      "ink": "#50364e",
      "muted": "#705b6d",
      "accent": "#795676"
    },
    "dark": {
      "fills": [
        "#534058",
        "#5c4a64",
        "#47364e"
      ],
      "ink": "#f6e7f3",
      "muted": "#d5bfd3",
      "accent": "#e1b8ce"
    }
  },
  {
    "id": "clay",
    "label": "Clay",
    "light": {
      "fills": [
        "#f7e9de",
        "#f3e5d4",
        "#fff6ec"
      ],
      "ink": "#573d32",
      "muted": "#756154",
      "accent": "#9c4f37"
    },
    "dark": {
      "fills": [
        "#5e4439",
        "#644b3c",
        "#513a32"
      ],
      "ink": "#fff0df",
      "muted": "#dfc5b7",
      "accent": "#f4bd9c"
    }
  },
  {
    "id": "parchment",
    "label": "Parchment",
    "light": {
      "fills": [
        "#f7efea",
        "#e5e8e2",
        "#fffdfa"
      ],
      "ink": "#1a1a1a",
      "muted": "#655e58",
      "accent": "#9c4b2e"
    },
    "dark": {
      "fills": [
        "#33251e",
        "#32312a",
        "#241e19"
      ],
      "ink": "#e7dfd3",
      "muted": "#aaa095",
      "accent": "#e88665"
    }
  }
] as const satisfies readonly CardPalette[];
