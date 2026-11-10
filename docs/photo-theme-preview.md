# Blue and gold photo theme

Preview experiment based on production commit `a793ec1cbdeb6550dd3cea5d05eb0cba04b41cc4`, including the latest curated tags and Notes metadata placement. Publish only to the separate preview site. This branch is for comparison, not production deployment.

The reference photo combines smoky ocean blue, faded yellow-gold, and icy aqua. These are visual approximations of its palette, adapted for readable text rather than measured pixel samples. The photo itself is not included in the site.

| Role | Light | Dark |
| --- | --- | --- |
| Page | `#f1efdc` | `#244e63` |
| Text | `#264f63` | `#dcfff6` |
| Secondary text | `#4f666b` | `#bdd9d4` |
| Accent / tags / active navigation | `#356984` | `#dad39a` |
| Text on accent | `#dcfff6` | `#244e63` |
| Raised surfaces | `#f7f5e7` | `#2e586b` |
| Golden card tint | `#b9b47e` | `#b9b47e` |

Light mode uses gold-tinted paper with blue ink. Dark mode comes closer to the reference's blue field, aqua lettering, and faded gold highlights. Existing card variation mixes these colors with the page. Layouts, content, and original media keep their current treatment. The avatar still follows the OS on a new visit and toggles manually during the visit.

Base text contrast is 7.6:1 in light mode and 8.4:1 in dark mode; secondary text is 5.3:1 and 6.0:1. Accent labels are 5.6:1 and 5.9:1. Check rendered cards as well as token pairs before publishing, since mixed surfaces can change contrast.
