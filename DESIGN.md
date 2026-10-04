---
name: Argila
description: A potter's firing log kept beside the kiln, for a USDG staking protocol on Robinhood Chain.
colors:
  ink: "#120E0B"
  ink-2: "#1B1612"
  ink-3: "#0B0806"
  ink-4: "#28201A"
  paper: "#F4ECDF"
  paper-dim: "#BDAF9B"
  paper-faint: "#8D8172"
  terra: "#D2693C"
  terra-hi: "#EA9068"
  terra-deep: "#A84E2A"
  cobalt: "#3B5BA5"
  cobalt-hi: "#7D9BE0"
  cobalt-deep: "#26438A"
typography:
  display:
    fontFamily: "Archivo, Helvetica Neue, sans-serif"
    fontSize: "clamp(2.4rem, 5.5vw, 4.4rem)"
    fontWeight: 800
    lineHeight: 0.96
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 125"
  headline:
    fontFamily: "Archivo, Helvetica Neue, sans-serif"
    fontSize: "clamp(2.4rem, 4.5vw, 3.6rem)"
    fontWeight: 800
    lineHeight: 0.98
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 125"
  figure:
    fontFamily: "Archivo, Helvetica Neue, sans-serif"
    fontSize: "clamp(2.4rem, 4vw, 3.4rem)"
    fontWeight: 800
    lineHeight: 1
    letterSpacing: "-0.015em"
    fontFeature: "'tnum', 'lnum'"
    fontVariation: "'wdth' 125"
  title:
    fontFamily: "Archivo, Helvetica Neue, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.1
    letterSpacing: "-0.015em"
    fontVariation: "'wdth' 125"
  body:
    fontFamily: "Archivo, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 400
    lineHeight: 1.625
    fontFeature: "'lnum'"
  body-sm:
    fontFamily: "Archivo, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif"
    fontSize: "15px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0.01em"
    fontVariation: "'wdth' 112"
  label:
    fontFamily: "Martian Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "11px"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.04em"
  mono-value:
    fontFamily: "Martian Mono, ui-monospace, SFMono-Regular, Menlo, monospace"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.4
    fontFeature: "'tnum', 'lnum'"
rounded:
  sm: "1px"
  DEFAULT: "2px"
  lg: "3px"
  seal: "9999px"
spacing:
  hairline-inset: "6px"
  row-y: "20px"
  row-y-lg: "28px"
  panel-x: "40px"
  gutter-sm: "16px"
  gutter-md: "24px"
  gutter-lg: "40px"
  section-y-sm: "96px"
  section-y-md: "128px"
  section-y-lg: "160px"
  container: "88rem"
components:
  button-paper:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "0px"
    padding: "0 25.6px"
    height: "52px"
  button-paper-hover:
    backgroundColor: "{colors.terra-hi}"
    textColor: "{colors.ink}"
  button-line:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
    typography: "{typography.body-sm}"
    rounded: "0px"
    padding: "0 25.6px"
    height: "52px"
  button-ink:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body-sm}"
    rounded: "0px"
    padding: "0 25.6px"
    height: "52px"
  button-ink-hover:
    backgroundColor: "{colors.ink-4}"
    textColor: "{colors.paper}"
  button-cobalt:
    backgroundColor: "{colors.cobalt-deep}"
    textColor: "{colors.paper}"
    typography: "{typography.body-sm}"
    rounded: "0px"
    padding: "0 25.6px"
    height: "44px"
  button-cobalt-hover:
    backgroundColor: "{colors.cobalt}"
    textColor: "{colors.paper}"
  paper-panel:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "0px"
    padding: "24px 40px 40px"
  ink-panel:
    backgroundColor: "{colors.ink-2}"
    textColor: "{colors.paper}"
    rounded: "0px"
    padding: "40px"
  amount-input:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    typography: "{typography.figure}"
    rounded: "0px"
    padding: "0 0 8px"
  micr-strip:
    backgroundColor: "{colors.ink-3}"
    textColor: "{colors.paper}"
    typography: "{typography.mono-value}"
    padding: "24px 32px"
  stamp:
    backgroundColor: "transparent"
    textColor: "{colors.cobalt-deep}"
    rounded: "0px"
    padding: "6px 14px"
  nav-bar:
    backgroundColor: "{colors.ink}"
    textColor: "{colors.paper}"
    typography: "{typography.body-sm}"
    height: "76px"
---

# Design System: Argila

## Overview

**Creative North Star: "The Firing Log Beside the Kiln"**

Argila is a potter's studio. Staked USDG is clay set in the kiln; every block fires a little more ARGL; the piece comes out exactly as it went in. The page is the char-dark floor of the studio, lit by kiln glow from the right; documents that carry the visitor's money (firing tickets, the kiln report, receipts, the specimen firing log) are bisque-coloured paper laid on top of it, perforated along one edge, with ruled ledger rows and the potter's mark stamped in cobalt underglaze. Terra, the colour of fired clay, is the hairline and the emphasis; cobalt is the potter's mark and nothing else. Tagline: "Patience, fired into value."

Density is ledger density: whole-row rhythm, figures set large in expanded Archivo so the numbers carry the page, and all bookkeeping detail (labels, units, addresses, chain IDs) in Martian Mono at small sizes. Ornament is computed, never pasted: the rosette (read as the potter's wheel) is generated from phase-shifted sinusoids, the tint is two wave fields at different periods, like slip combed across a pot, and the border band is an interlaced wave masked in currentColor. Motion is the studio's: the wheel turns, lines draw themselves, numerals roll, ledger entries ink left to right, and confirmed actions press the potter's mark.

The world refuses the private-bank vault and the Greek frieze it replaced, the neon-on-black DeFi dashboard (lime glow, pills, glass cards) and the cream-serif editorial page. Corners are square; panels are paper or dark slab, not glass.

**Key Characteristics:**
- Kiln-char field with bisque paper documents laid on it
- Expanded-width Archivo (wdth 125) for every headline and every large figure
- Martian Mono for labels, units, batch numbers, addresses and gauge strips
- Square corners (0-3px); circles only for the wheel, marks and status dots
- Computed wheel rosette, slip tint, wave bands and perforations as the only ornament
- One easing curve, cubic-bezier(0.16, 1, 0.3, 1)

## Colors

Four families, each with one job: char for the field, bisque for documents, terra for hairlines and emphasis, cobalt for the potter's mark, batch numbers and stamps.

### Primary
- **Kiln Char** (ink): the page field and the body background everywhere, the ink of text on paper, and the fill of the ink button. Theme color of the browser chrome.
- **Firebox** (ink-3): the footer, the notes section, the mobile menu, modal scrims (at 80%) and the kiln-door leaves of the intro; one step darker than the field to mark a recess.
- **Slab** (ink-2): raised dark panels (the account summary, the ARGL tile) that sit beside a paper panel.
- **Ash** (ink-4): only the hover wipe of the ink button.

### Secondary
- **Bisque** (paper): document stock (paper panels, tickets, receipts, the firing log), primary button fill, and primary text on the field.
- **Dry Slip** (paper-dim): body copy and secondary text on the field.
- **Dust** (paper-faint): mono labels, units and quiet metadata on the field.

### Tertiary
- **Terra** (terra): hairlines (1px rules at 20-55% opacity), the wheel rosette, gauge marks, the kiln backdrop, scrollbar thumb on hover, text selection.
- **Ember** (terra-hi): emphasis on the field: the third headline line, the active-nav rule, the focus ring, accruing reward figures, hovered links and open FAQ questions, the paper-button hover wipe, caution icons.
- **Fired Terra** (terra-deep): scrollbar thumb at rest, the caution button (`btn-terra`) and the wrong-network banner.

### Cobalt
- **Cobalt Mark** (cobalt-deep): batch numbers, the potter's mark stamps, the "specimen" mark, the live-read dot on paper, the active amount line and caret on paper.
- **Cobalt** (cobalt): the cobalt button's hover wipe.
- **Cobalt on Char** (cobalt-hi): batch numbers when they sit on the dark field.

### Named Rules
**The Potter's Mark Rule.** Cobalt is the underglaze of the potter's mark: batch numbers, stamps and marks only. Never a figure, a balance, an APY, a code identifier or a decorative accent.

**The Paper Carries Money Rule.** Any surface where the visitor enters, reads or confirms an amount is a paper panel (bisque on char). The dark field holds narrative, navigation and summaries.

**The Honest Dash Rule.** A chain value that has not been read renders as an em dash ("—"), never as a fabricated or zero figure.

## Typography

**Display Font:** Archivo (variable, wdth axis) with Helvetica Neue, sans-serif
**Body Font:** Archivo with -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif
**Label/Mono Font:** Martian Mono with ui-monospace, SFMono-Regular, Menlo, monospace

**Character:** Archivo opened to its expanded width is the banknote's lettering: broad, heavy, engraved-looking at weight 800. Martian Mono is the numbering press and the MICR line. Body copy stays at Archivo's normal width; interface text (buttons, nav links, list facts) sits in between at wdth 112.

### Hierarchy
- **Display** (800, 2.4rem to 4.4rem, hero; up to 5.75rem in the closing call; line-height 0.93-0.96): one per page, lines revealed out of an overflow mask.
- **Headline** (800, 2.4rem / 3rem / 3.6rem, line-height 0.98, balanced): section headings; page titles on app routes run 2.6rem to 4.6rem at 0.95.
- **Figure** (800, 2.4rem to 3.4rem, line-height 1, tabular lining numerals): statement figures and the amount input; the number is the largest thing on its panel.
- **Title** (700, 1.25-1.5rem): panel titles ("Firing ticket", "Kiln report"), ledger entry names, FAQ questions.
- **Body** (400, 1.125rem, line-height 1.625, max 30-36rem or 62ch): explanatory copy, in Dry Slip on the field and ink at 65-75% on paper.
- **Body small** (500, 15px, wdth 112): nav links, ledger row labels, inline links, button text.
- **Label** (Martian Mono 400, 10-12px, letter-spacing 0.04-0.06em, sentence case): field labels, units, chain IDs, document subtitles. Terra for footer column heads.
- **Mono value** (Martian Mono 500, 12-13px, tabular): ledger amounts, addresses, MICR values (17-20px in the hero strip).

### Named Rules
**The Expanded Figure Rule.** Every headline and every large figure is Archivo 800 at wdth 125 with -0.015em tracking. Never a condensed or default-width display.

**The Sentence-Case Label Rule.** Mono labels are sentence case at 0.04-0.06em tracking. Uppercase is reserved for the rubber stamp.

## Layout

A single 88rem container with 16px / 24px / 40px side padding (mobile / sm / lg). Sections are full-bleed bands on ink or ink-3 with 96px / 128px / 160px vertical padding. Desktop compositions use a 12-column grid with 48-64px gaps: a 4-5 column narrative rail (often sticky at 8rem from the top) beside a 7-8 column document. Ledgers are whole rows: 20-28px vertical padding, separated by 1px rules at 16% ink on paper or 16-20% terra on the field, with a 2px ink rule closing a document's header and footer. Below 1024px everything stacks to one column, pinned scroll sequences unpin, and the hero dial moves behind the copy at 35% opacity.

## Elevation & Depth

Depth is physical paper, not glass. The dark field is flat; paper panels lift off it with a long, soft drop shadow and a one-pixel inset highlight on the top edge, like a sheet lying on a desk. Ink panels stay nearly flat and are defined by a terra hairline and the double certificate frame. A terra rule and a thin wave band appear under the nav once the page scrolls.

### Shadow Vocabulary
- **Paper sheet** (`box-shadow: 0 1px 0 rgba(255,255,255,0.4) inset, 0 30px 60px -30px rgba(0,0,0,0.65), 0 8px 18px -10px rgba(0,0,0,0.45)`): every paper panel.
- **Engraved note** (`box-shadow: 0 30px 60px -30px rgba(0,0,0,0.8)`): an ink panel that must read as a separate note.
- **Docked nav** (`box-shadow: 0 14px 30px -18px rgba(0,0,0,0.85)`): the scrolled header.

### Named Rules
**The Sheet-On-Desk Rule.** Shadows fall long and below (negative spread, large y offset). No glows, no colored shadows, no hard offset shadows.

## Shapes

Square by default: radii are 0px on panels and buttons, 1-3px where Tailwind's scale is invoked. Edges are made by print devices instead of radius: perforations (2.6px holes on a 13px pitch) along the top or left of a paper document, the double hairline frame (1px border inset 6px plus a 1px outline offset 3px, at 28% currentColor), the interlaced wave band (16px, or 10px under the nav), and 2px ink rules. Circles exist only as seals, dials, guilloché rosettes, 4-6px status dots and the FAQ toggle ring.

## Components

### Buttons
Paper notes on the ink field, ink on paper panels; the fill wipes in from the left like ink taking to paper.
- **Shape:** square (0px), 52px tall (56px for hero calls, 40px in the nav), 25.6px side padding, Archivo 650 at 15px, wdth 112.
- **Paper (primary on ink):** Bisque fill, ink text; hover wipes Ember across in 0.5s.
- **Line (secondary on ink):** transparent with a 1px terra border at 55%; hover wipes terra at 16% and lifts the border to Ember.
- **Ink (primary on paper):** ink fill, bisque text, wipe to Ash. **Outline ink** is the paper-side secondary (1px ink at 45%).
- **Serial (caution only):** Serial Red fill, wipe to Bright Serial; used for "switch network".
- **Hover / Focus / Active:** the wipe runs on hover and on focus-visible; active scales to 0.985; disabled drops to 38% opacity. Focus ring is 1.5px Ember offset 3px (ink on paper).

### Cards / Containers
- **Paper panel:** Bisque with the security tint at 7% / 5%, the paper-sheet shadow, a perforation strip on its top (statements, slips, receipts) or left edge (firing log), a 2px ink rule under its header, and 24-40px padding.
- **Ink panel:** Slab, 1px terra border at 30%, double hairline frame, 40px padding.
- **Border:** terra hairlines on the field, ink rules on paper. No radius.

### Inputs / Fields
- **Amount input:** no box. A figure-sized transparent field on paper with a 2px ink baseline; on focus the baseline turns Serial Red, and the caret is Serial Red on paper (Ember on the field). Placeholder in ink at 25%.
- **Quick-fill chips:** 32px square-cornered cells with a 1px ink border at 40%, Martian Mono 11px; hover fills ink with bisque text.
- **Slip tabs:** a two-cell segmented control bordered in ink at 40%; the active cell is filled ink.

### Navigation
Fixed header, 64px / 76px tall, transparent over the hero and Kiln Char at 95% once scrolled, with a 10px terra wave band beneath. Logo is the vessel mark (`argila-logo-terra.png`) inside a small rosette that turns 90 degrees on hover. Links are Archivo 15px wdth 112 in Dry Slip, Bisque when active, with a 1px Ember rule that slides between links on a spring. Mobile opens a full-screen Firebox sheet by circular clip-path from the top-right corner (0.7s), with 2.6rem display links over ruled rows and a slowly turning rosette.

### Guilloché Rosette (signature)
A computed rose-engine rosette (three ring families of 12, 9 and 14 phase-shifted sinusoids, 0.55-0.6 stroke) drawn in currentColor, usually terra. It draws itself on arrival (2.2s), the outer and inner rings counter-rotate over 160s / 200s, and it serves as the hero dial, the kiln-door vessel, the receipt dial (spinning 6s while a transaction works) and the logo mount.

### Stamp (signature)
A rubber stamp: 2.5px current-color border, 1px outline offset 3px, Archivo 800 uppercase at 0.04em, multiply blend, tilted 6-9 degrees off true. It presses in on a spring (stiffness 520, damping 24, mass 0.9) from 1.7x scale and is the confirmation for every completed action, received deposit and on-chain statement.

### Rolling Number (signature)
Each digit is a 0-9 drum that rolls to its value over 1100ms on the studio curve, staggered 45ms per place from the right, when it enters view. The real string is always present for assistive technology.

### MICR Strip
The foot of the hero: a four-cell Martian Mono strip on Firebox at 70% with terra-hairline dividers, each label preceded by a MICR mark (transit, amount, on-us) in terra.

## Do's and Don'ts

### Do:
- **Do** put every amount the visitor enters, reads or confirms on a perforated paper panel over the dark field.
- **Do** set headlines and large figures in Archivo 800 at wdth 125, and all labels, units, serials and addresses in Martian Mono.
- **Do** use the single easing cubic-bezier(0.16, 1, 0.3, 1) for transitions, wipes, reveals and page turns.
- **Do** confirm completed actions with the stamp, and render unread chain values as "—".
- **Do** give every motion a reduced-motion state: rosettes stop, engravings render drawn, stamps appear pressed, the kiln door and page-turn are skipped.
- **Do** keep the page-turn (a 2px Ember rule sweeping 0.7s, the sheet settling from 6px blur over 0.65s) to client-side navigations; the first server-rendered paint is never hidden.

### Don't:
- **Don't** use cobalt for figures, balances, APYs, code identifiers or decoration.
- **Don't** round panels or buttons beyond 3px, or use pill shapes; circles are for seals, dials and status dots.
- **Don't** use neon or colored glows, glass cards or colored shadows; the only light effect is the soft white sheen raking across a tilted note.
- **Don't** add uppercase tracked kicker labels above headings; the only uppercase in the system is the stamp.
- **Don't** draw ornament as raster or stock pattern; guilloché, tint, wave bands and perforations are computed in SVG or CSS from the four color families.
- **Don't** use the legacy color aliases (clay, slip, buff, miltos, ochre) in new work; they exist only so untouched screens inherit the kiln palette.


## Brand mark

The vessel mark: a clay pot with a flared lip and two glaze bands cut through its body, so it still reads at 16px. It is drawn as SVG in `scripts/generate-argila-assets.cjs` (run it after any change). Use `argila-logo-terra.png` on Kiln Char, `argila-logo-ink.png` on paper, `argila-logo-paper.png` for reversed moments; `argila-mark.svg` is the vector source; icons put the terra mark on the char field. The mark never rotates: when it sits at the centre of the turning wheel, only the wheel turns. Wordmark is "ARGILA" in Archivo 800, wdth 125, 0.06em tracking. The reward token ticker is ARGL; the token already on chain keeps its original symbol until redeployed.

## The studio (global backdrop)

`src/components/vault/VaultBackdrop.tsx` sits fixed behind every page: the slip tint, a kiln-glow radial on the right, a dark vignette, fine grain, and a round kiln seen from above, drawn in terra hairline at 26%: two courses of firebrick, twelve flames, and the potter's wheel at its heart. Scroll progress turns the wheel 300° and draws the flames 30px inward, so the firing builds as you go down; the inner rosette counter-rotates 90°. On `/` the kiln fades in over the first 700px because the hero carries its own wheel. Page sections stay transparent or `ink-3/75` so the studio shows through. Reduced motion: everything static.

## Scroll choreography

`src/components/vault/ScrollChoreography.tsx` is the one conductor for scroll motion (GSAP ScrollTrigger + SplitText), driven by attributes:
- `data-reveal="lines"` headings: lines rise out of a mask, 1.15s expo.out, 0.09s stagger.
- `data-reveal="paper"` sheets: slide up 90px from a −1.6° tilt and settle, 1.25s.
- `data-reveal="rows"` ledgers and lists: rows enter from −22px with a 4px blur, 0.07s stagger.
- `data-reveal="band"` wave bands: draw left to right, scrubbed to scroll.
- `data-recede` sections: as you leave, they step back (scale 0.94, −6%, opacity 0.25, 2px blur), scrubbed.
Elements already on screen at load are never hidden and re-animated. It re-runs on every route change.

## Palette (Argila, 2026-10-04)

Kiln Char `#120E0B` is the field (ink), Bisque `#F4ECDF` is the paper stock, Terra `#D2693C` is the hairline and accent, Ember `#EA9068` is the highlight (terra-hi). Derived steps: ink-2 `#1B1612`, ink-3 `#0B0806`, ink-4 `#28201A`; paper-dim `#BDAF9B`, paper-faint `#8D8172`; terra-deep `#A84E2A`. Cobalt `#3B5BA5` / `#26438A` / `#7D9BE0` stays reserved for the potter's mark. Fonts are self-hosted from `src/fonts/` (Archivo and Martian Mono variable, latin subset).
