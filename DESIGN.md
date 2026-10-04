---
name: Argila
description: "Heat" — a coal-dark potter's studio lit by the kiln, for a USDG staking protocol on Robinhood Chain.
colors:
  coal: "#0D0907"
  coal-2: "#151009"
  coal-3: "#1F1712"
  coal-4: "#2A2019"
  bone: "#F6EDE3"
  bone-2: "#C2B2A3"
  bone-3: "#86766A"
  ember: "#8E2D12"
  terra: "#D9622B"
  flame: "#F28C38"
  glow: "#FFC56E"
  hot: "#FFF0D4"
  glaze: "#8DB4C2"
typography:
  display: "Bricolage Grotesque (variable, 200-800), self-hosted"
  body: "Bricolage Grotesque"
  mono: "Geist Mono (variable), self-hosted"
rounded:
  surface: "1.75rem"
  pill: "9999px"
---

# Argila design system — "Heat"

Rebuilt from scratch on 2026-10-04 to replace the earlier vault/passbook UI. **Nothing from the old system (paper panels, ledgers, guilloché, stamps, square corners, Archivo/Martian Mono) should come back.**

## Creative north star: temperature is the interface

Argila means clay. Staked USDG is clay set in the kiln, and each block fires a little more ARGL. The UI turns that into one visual language: **heat**. The studio is coal-dark; the only source of colour is fire. Something that is "more" (hotter stage, live data, primary action) burns brighter along a single heat ramp.

- Dark, warm, quiet: coal backgrounds, bone text, generous space.
- One signature object: the **kiln orb** (a disc of fire built from radial gradients). It's the hero sun, the stage indicator, the transaction spinner and the "live" mark.
- Soft, fired shapes: large radii (1.75rem surfaces), pill buttons and controls.
- Big, tight display type (Bricolage, -0.04 to -0.05em tracking), mono for labels and figures.

The design refuses: paper/ledger metaphors, neon-on-black DeFi (lime, glassmorphism everywhere), and generic SaaS gradients.

## Colour

| Token | Hex | Job |
|---|---|---|
| `coal` | #0D0907 | Page background |
| `coal-2` / `coal-3` / `coal-4` | #151009 / #1F1712 / #2A2019 | Raised surfaces, inputs, tracks |
| `bone` | #F6EDE3 | Primary text, active nav pill, light "clay" tile |
| `bone-2` | #C2B2A3 | Body and secondary text |
| `bone-3` | #86766A | Labels, hints, metadata |
| `line` / `line-strong` | rgba(255,226,196,.09 / .18) | Hairlines and borders |
| Heat ramp | ember #8E2D12 → terra #D9622B → flame #F28C38 → glow #FFC56E → hot #FFF0D4 | All emphasis |
| `glaze` | #8DB4C2 | Reserved cool note (currently unused; keep for "cold" states) |

Rules:
- **The heat ramp is the only accent.** Use `.text-heat` / `.bg-heat` (the full ramp) for headline highlights, big reward figures and progress fills. Use `text-glow` for single highlighted values (APY) and live dots.
- **Honest dash.** A chain value that hasn't been read renders as "—", never an invented number. Any between-block estimate (`useLiveRewards`) must say it's an estimate.
- Focus ring: 2px `glow`.

## Type

- Display/body: **Bricolage Grotesque**, `font-display`/`font-sans`. Headlines `font-bold`, tracking `-0.04em` to `-0.05em`, leading 0.88-0.98. Hero up to 8.25rem.
- Mono: **Geist Mono**, `font-mono`; `.eyebrow` = 11.5px, uppercase, 0.08em tracking, `bone-2`.
- Figures use `.tnum`. Bricolage has no italic: never use `italic` (the faux slant clips letters).

## Components (src/components/kiln)

- `KilnOrb` — `heat` 0..1 sets core size, brightness and halo; `simple` drops the turbulence layer and heavy shadow for small sizes (< ~120px). Cold (low heat) is dimmed via brightness/saturate.
- `FireCanvas` — WebGL fbm-noise fire for the hero, rendered at half resolution, paused off screen; under reduced motion it keeps burning at 0.4× speed (owner's call: the fire is the brand); hides itself on WebGL context loss so the CSS glow behind it shows.
- `useReducedMotionSafe` — returns false until mounted (avoids hydration mismatch); entry animations are governed globally by `<MotionConfig reducedMotion="user">` in Providers.
- `Embers` — canvas sparks; pauses off screen, off under reduced motion. `density`, `heat`.
- `HeatBar` — the five-stage firing scale with a current marker.
- `stages.ts` — Cold / Kindling / Bisque / Glaze / Porcelain, mapped from `deriveArgilaState()` (contract staking duration). **Stages are a record of time, not a multiplier**; every place that shows them should not imply bonus yield.
- `useLiveRewards` — pending ARGL + (rewardRate × share × elapsed), reset on each chain read, capped at 15s.
- `Nav` (floating pill, spring-animated active pill), `Footer` (giant cropped `argila` wordmark in the heat ramp), `Backdrop` (static glow + grain), `Reveal` (rise-on-view), `CopyAddress`, `Logo` (`VesselMark`, `Wordmark`), `RollingNumber`.

Utility classes (globals.css): `.surface`, `.surface-raised`, `.surface-hot` (glowing rim), `.btn` + `.btn-hot` / `.btn-ghost` / `.btn-bone`, `.eyebrow`, `.text-heat`, `.bg-heat`, `.grain`, `.tnum`.

## Pages

- `/` (`components/home`): Hero (one screen: chip, headline, one line, two buttons; living WebGL fire `FireCanvas` spread across the bottom + embers; no stats, no vessel) → Firing (four moves: Set, Fire, Draw, Unload) → Stages (interactive scale) → Materials (bento: USDG light tile, ARGL hot tile) → LiveKiln (figures + contracts) → Faq → Cta.
- `/stake` (`components/console/KilnConsole`): deposit/withdraw console + "Your firing" panel.
- `/position` (`components/Position/MyFiring`): stage hero with orb + HeatBar, stats, claim.
- `/stats` (`components/Stats/KilnStats`): bento of live figures + contracts.
- `/docs`: content kept, restyled on the new tokens. `/protocol` redirects to `/docs`.

## Motion

framer-motion throughout; ease `[0.22, 1, 0.36, 1]`. Reveal on scroll, spring pills (`layoutId`), orb flicker/drift (CSS), embers (canvas). Everything respects `prefers-reduced-motion`.

## Assets

Logo PNGs/favicons/OG come from `scripts/generate-argila-assets.cjs` (vessel mark). OG image and icons use the heat palette (regenerated 2026-10-04).
