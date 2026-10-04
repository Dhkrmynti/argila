# UI improvements — implementation spec

> For the next AI agent. Read `handoff.md` and `DESIGN.md` first; this file assumes them.
> Written 2026-10-04. Owner's priority order: **1 + 2 first**, then **3**, then the rest if time allows.
> Rules that apply to every item:
> - Don't touch logic in `src/lib/*` (hooks, config, ABIs) or contract calls. Visual work only.
> - Numbers must come from the chain or be clearly labelled estimates. Never invent figures.
> - Respect reduced motion: no travel, parallax or zoom; slow in-place motion is acceptable (the hero fire already runs at 0.4× speed).
> - Avoid hydration mismatches: never branch first render on `useReducedMotion()`; use `useReducedMotionSafe` (`src/components/kiln/useReducedMotionSafe.ts`).
> - The owner's Windows has *Animation effects* off, so test with reduced motion **on** too.
> - Headless Edge here has no GPU, so WebGL can't be screenshot-verified. Ask the owner to check in a real browser.
> - After each item: `npx tsc --noEmit -p .`, check `/` loads (dev server: `NODE_OPTIONS=--max-old-space-size=8192 npx next dev -p 3023`).

---

## 1. Fire pulses on every new block (priority, small)

**Why:** makes "earn ARGL every block" visible, using real chain data.

**What:**
- When a new block arrives, the hero fire flares briefly (~600 ms: taller and brighter, then eases back).
- A small chip fades in above the fire: `Block #1,234,567 fired` (mono, `bone-2`, with a `glow` dot), then fades out after ~2.5 s. New blocks replace it.

**How:**
- In `src/components/home/Hero.tsx`: `const { data: block } = useBlockNumber({ watch: true })` from `wagmi` (already used in `Stats/KilnStats.tsx`).
- `FireCanvas` (`src/components/kiln/FireCanvas.tsx`): add a prop `pulseKey?: number | bigint`. Inside, keep a `pulseAt` ref set to `performance.now()` when `pulseKey` changes. Add a `uniform float pulse;` to the shader, computed each frame as `exp(-(now - pulseAt) / 350)` (0..1). In the shader, raise flame height and brightness with it, e.g. `height += 0.12 * pulse;` and `f += 0.15 * pulse;`.
- Use a ref/uniform update instead of re-running the effect: don't add `pulseKey` to the effect deps that rebuild GL.
- Skip the very first block value (page load) so it doesn't flare on mount.
- Robinhood Chain has sub-second blocks. Throttle visible pulses to at most one per ~1.5 s, and the chip to the latest block.
- Reduced motion: keep the chip, make the flare gentler (half amplitude).

---

## 2. Fire reacts to the cursor (priority, small)

**Why:** the hero feels alive and interactive.

**What:** moving the mouse over the hero makes the flames lean toward the cursor and burn a bit brighter near it. Touch devices: no effect.

**How:**
- `FireCanvas`: add `uniform vec2 mouse;` (canvas uv, 0..1; default `(0.5, -1.0)` = off).
- Listen to `pointermove` on `window` (only `pointerType === "mouse"`), convert to the canvas's rect uv (flip y for GL), and **ease** toward the target each frame (`cur += (target - cur) * 0.08`) so it never jerks. On `pointerleave` of the hero, ease back to off.
- Shader idea: offset the sample position horizontally toward the mouse, weighted by height and distance:
  ```glsl
  float d = distance(uv, mouse);
  float pull = exp(-d * 4.0) * step(0.0, mouse.y);
  p.x -= (mouse.x - uv.x) * pull * 0.6 * uv.y;   // lean
  f += pull * 0.18;                              // brighten
  ```
- Reduced motion: disable the lean (keep the brightening only, or nothing).

---

## 3. A vessel fires as you scroll (signature moment, medium)

**Why:** the brand story (clay → porcelain) as the site's hero moment. It replaces or upgrades `src/components/home/Stages.tsx`.

**What:** a pinned section (about 250 vh of scroll). One large vessel sits centre stage with the five stages listed beside it (Cold, Kindling, Bisque, Glaze, Porcelain, from `src/components/kiln/stages.ts`). Scroll progress drives the vessel's look:
- **Cold / raw clay:** matte grey-brown `#6B5E55`, slightly rough (SVG `feTurbulence` grain), no shine.
- **Kindling:** a warm rim light from below starts (fire glow behind the vessel).
- **Bisque:** body turns `#D9A27A` (fired terracotta), still matte.
- **Glaze:** a glossy layer fades in (cobalt or celadon `#8DB4C2` glaze gradient, plus a specular highlight sweep).
- **Porcelain:** near-white `#F3EDE4` with a soft sheen and a gentle glow.
- The active stage name/description on the side updates and highlights; a thin heat-ramp progress bar fills.
- Keep the honest note: *"Stages are a record of time, not a bonus. Every staker earns at the same rate per USDG."*

**How:**
- Vessel = the logo path (`VESSEL` in `src/components/kiln/Logo.tsx`), large, inline SVG with stacked layers (clay base, bisque, glaze, porcelain, highlight) whose opacity is driven by scroll.
- framer-motion: `useScroll({ target: sectionRef, offset: ["start start", "end end"] })` on a tall wrapper with a `sticky top-0 h-[100svh]` inner stage; `useTransform` maps progress 0..1 to each layer's opacity and to the stage index (5 equal segments).
- Mobile: same idea, shorter (about 180 vh); stage list below the vessel.
- Reduced motion: no pin, just show the five states as a static row (or keep the current tab UI).

---

## 4. A "hot" stake console (medium)

File: `src/components/console/KilnConsole.tsx`.
- While typing a deposit amount, the "Your firing" orb (`KilnOrb`) previews a bigger/hotter state. The preview `heat` is derived from the **share of the pool** the new total would be: `(staked + input) / (totalStaked + input)`. Label it "preview". Don't show invented yields.
- On a successful deposit (`txState.step === "SUCCESS"` after a stake), a short burst of embers from the orb.
- On a successful claim, a few embers fly from the "ARGL ready to claim" figure to the nav wallet button (framer `layout`/absolute particles, ~800 ms).
- Reduced motion: skip particles, keep a simple glow pulse.

---

## 5. Buttons with a cursor-following glow (small)

- `.btn-hot` and `.btn-ghost` (in `src/app/globals.css`): a radial highlight that follows the pointer, using CSS vars `--mx`/`--my` set on `pointermove` by a tiny client hook or a wrapper component.
- `background: radial-gradient(120px circle at var(--mx) var(--my), rgba(255,240,212,.35), transparent 60%), <existing>`.

---

## 6. Section titles "heat up" on reveal (small)

- When a section `h2` enters view, sweep its colour from ember (`#8E2D12`) → bone (`#F6EDE3`), left to right (~900 ms), for example with a moving `background-clip: text` gradient. The `.text-heat` words keep their gradient.
- Implement in `Reveal` or a new `HeatTitle` component. Reduced motion: no sweep.

---

## 7. Live "firing for" timer on My firing (small)

File: `src/components/Position/MyFiring.tsx`.
- Show the stake duration ticking every second (e.g. `3d 04:12:55`). Base = `stakingDuration` from the hook (seconds, read from the contract). Add elapsed seconds since that value last changed; reset when it updates.
- The orb's heat interpolates smoothly within the current stage toward the next stage boundary (cosmetic). Stage labels still come from `deriveArgilaState`.

---

## 8. Heat-haze page transitions (small, optional)

- `src/app/template.tsx`: on client navigations, a brief (~400 ms) wavy distortion or blur-and-warm overlay (an SVG `feTurbulence` + `feDisplacementMap` filter on a full-screen overlay, or a simple warm gradient wipe).
- Never on first load (must stay visible as server HTML). Reduced motion: plain fade.

---

## Done when
- Items implemented in priority order, each typechecked and loading.
- `DESIGN.md` gets a short note per new component/behaviour; `handoff.md` "Status" is updated.
- Nothing commits without the owner asking (see `handoff.md`).
