# Mrunali Prasade — Portfolio

A single-page portfolio built with Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS 4 and Lenis.
It uses white, black and grays only, and all of its text comes from `Mrunali-Resume 2.pdf`.

## Run

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # production build (type-check + lint)
npm start          # serve the production build
```

Node 20+ is required. Set `NEXT_PUBLIC_SITE_URL` when deploying so Open Graph URLs are absolute.

## Sections

| # | Section | id | Component | Motion |
|---|---------|----|-----------|--------|
| — | Hero | `top` | `hero/Hero.tsx`, `hero/WhaleSea.tsx` | Pinned for ~90svh of scroll: a whale swims right → left through a gray sea, breaches twice, and the name's letters rise from the water behind it. Intro video loop with sound control, line reveals |
| 01 | About | `about` | `sections/About.tsx` | ID card on a lanyard: damped pendulum swing and idle sway, 3D flip on hover, tap or Enter/Space |
| 02 | Skills | `skills` | `sections/Skills.tsx` | Periodic-table grid with a diagonal wave reveal, family filter, sticky inspector with brand logo |
| 03 | Work | `work` | `sections/Work.tsx` | Expanding accordion with clip-path-wiped illustrative UIs (vertical accordion on mobile) |
| 04 | Certifications | `certifications` | `sections/Certifications.tsx` | Rows flood with ink on hover or focus |
| 05 | Experience | `experience` | `sections/Experience.tsx` | Timeline spine that draws as you scroll; stops light up as it reaches them |
| 06 | Achievements | `achievements` | `sections/Achievements.tsx` | Pinned horizontal gallery and count-up numbers |
| 07 | Contact | `contact` | `sections/Contact.tsx` | Letters hop as the cursor passes, copy-email chip, spinning badge, footer |

All content lives in `src/lib/data.ts`; components only read from it. Edit that file to change any text.

### Content notes (from the résumé)

- The résumé has no GitHub link, no project repo links and no jobs or internships. GitHub buttons are hidden
  until `PROFILE.github` / `project.github` are set.
- The Experience timeline combines education with the two coordinator roles listed under
  "Achievements & Activities". The résumé gives no dates for these roles, so the timeline shows "At SAKEC".
- Achievements has no platform ranks. Its cards count items stated in the résumé: CGPA 8.9, 4 projects,
  8 certifications and 2 coordinator roles.
- The ID card's "ID No." is the number in the résumé's college email address.
- The Work mini-UIs are grayscale sketches labelled "Illustrative UI". They are not screenshots.

## Hero video

Until `public/hero/hero.mp4` exists, the hero shows a typographic monogram and the ID card shows initials.
`src/app/page.tsx` checks for these files when the site is built, so you need to rebuild after adding them.

To build the looping clip, portrait and OG image from a raw intro video:

```bash
pip install numpy pillow          # pillow only needed if your ffmpeg lacks libwebp
python3 scripts/build-hero-assets.py path/to/intro.mp4
# optional: --crop 800:1000:560:80   (W:H:X:Y, skips auto-detection)
#           --photo face.jpg          (use a photo for the ID-card portrait)
#           --seconds 10 --fade 0.5
npm run build
```

The script:

1. Detects the person against the light backdrop and crops a centred 4:5 box from head to toe. You can pass
   `--crop` to set this yourself. It then scales the clip to 768 px wide.
2. Whitens the backdrop with `colorlevels=rimax=0.98:gimax=0.98:bimax=0.98`.
3. Takes the first ~10 s. It cross-fades the last 0.5 s of the picture into the first 0.5 s with `xfade`. The audio
   gets the same cross-fade, done sample-accurately as an equal-power fade in numpy. Nothing is stretched or
   retimed, so lips stay in sync and the loop has no visible jump or audible click.
4. Writes `public/hero/hero.mp4` (H.264 CRF 24 slow, AAC 96k, faststart) and `public/hero/hero.webm`
   (VP9 CRF 36, Opus 80k).
5. Writes `public/portrait-bust.webp` (480×600, head-to-shirt crop of the sharpest frame or of `--photo`)
   and `public/og.jpg` (1200×630).

Playback: the page tries `play()` with sound. If the browser blocks that, it plays muted and unmutes on the
visitor's first pointer, key or touch. The video pauses when less than 35% of the hero is visible. The round
button toggles sound, and a ping ring shows while autoplay is blocked.

## Performance & accessibility

- First-load JS is about 127 kB. Fonts are self-hosted from `src/fonts`. There are no runtime CDNs or external scripts.
- Lighthouse (production build, local): mobile Performance 96, Accessibility 100; desktop 100 / 100.
- `prefers-reduced-motion` turns off Lenis and decorative animation. Every section has keyboard focus styles.
- The page has no horizontal overflow at 390 px or 1440 px.
- `--mute` is `#6b6964` rather than `#77756f` so that small gray text passes WCAG AA on the paper background.

## Credits & licences

- **Brand logos** in `public/logos/` are from [Devicon](https://github.com/devicons/devicon) ("original"
  variants) under the MIT licence (`public/logos/LICENSE-devicon.txt`). Trademarks belong to their owners.
  Excel and Power BI use custom line icons, because no official SVGs are bundled.
- **Fonts** in `src/fonts/` are from Fontsource and licensed under the SIL Open Font License 1.1 (licence files alongside):
  Inter Tight (The Inter Project Authors), Instrument Serif (Instrument), JetBrains Mono (JetBrains).
- Concept icons, the ID card, the illustrative UIs and all layout are original to this project.
