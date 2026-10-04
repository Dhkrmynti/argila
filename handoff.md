# Handoff — Argila (D:\aegis)

> For the next AI agent. Read this whole file before touching anything.
> Last updated: 2026-10-04 (after the full UI rebuild, "Heat"). Owner works in Indonesian and is casual ("bro"); reply in Indonesian.

---

## 1. What this project is

**Argila** is a USDG staking protocol on **Robinhood Chain** (chain ID 4663). Users deposit USDG and earn **ARGL** reward tokens every block (Synthetix-style `rewardPerToken`). There is no lockup and no fee.

- Stack: Next.js 14 App Router, Tailwind, framer-motion + GSAP, wagmi v2 + RainbowKit + viem, Prisma (SQLite), Hardhat (contracts).
- Main pages: `/` landing, `/stake`, `/position`, `/stats`, `/docs`, `/protocol`, `/vodka` (admin).
- Product context: `PRODUCT.md`. Design system: `DESIGN.md`. **Read both before doing UI work.**

### Hard constraints (from PRODUCT.md)
- Functionality is **frozen**: wallet connection, contract calls, hooks, API routes and data flow must not change. Visual and copy work only, unless the owner explicitly asks otherwise.
- Every number shown (TVL, APY, stakers) comes from chain reads. **Never invent numbers.** A value that hasn't been read shows "—".
- Wrong-network detection and transaction states (idle/confirming/pending/success/failed) must stay visible.

---

## 2. Brand status (just changed, 2026-10-04)

Rebrand history: **Aegis → Vault → Banco Claro → Argila**. The owner rebrands often and wants name, lore and visuals changed together.

| Item | Value |
|---|---|
| Name | **Argila** (single L; "Argilla" with double L clashes with Hugging Face's tool) |
| Ticker | **ARGL** |
| Domain | `argila.xyz` (**availability not verified**) |
| X / Twitter | `@argilaxyz` (**availability not verified**) |
| Tagline | "Patience, fired into value." |
| Theme | Kiln / potter's studio |

### Lore
"Argila" means clay. Staked USDG is clay set in the kiln. Every block, the kiln fires a little more ARGL. The principal comes out whole and is never "burned".

- Four moves: **Set** (deposit), **Fire** (accrue per block), **Draw** (claim), **Unload** (withdraw).
- Five **firing stages** from the contract's staking duration (`deriveArgilaState`): Cold (nothing staked), Kindling (<1 day), Bisque (1-7 days), Glaze (7-30 days), Porcelain (30+ days). **Stages are a record of time, not a reward multiplier.** Never imply bonus yield.
- Note: the contract's `unstake` does **not** claim rewards (only `exit()` does, and the UI doesn't use it). Copy must not say "withdraw includes rewards".

### Design system: "Heat" (rebuilt from scratch 2026-10-04)
The old vault/passbook UI is gone. **Read `DESIGN.md`** before any UI work. In short:
- Coal background, bone text, one accent: the heat ramp ember → terra → flame → glow → hot (`.text-heat`, `.bg-heat`).
- Signature object: `KilnOrb` (fire disc, `heat` 0..1). Embers canvas, HeatBar, floating pill nav, big Bricolage Grotesque type, Geist Mono labels, 1.75rem surfaces, pill buttons.
- Tokens in `tailwind.config.ts` (`coal`, `bone`, `ember`, `terra`, `flame`, `glow`, `hot`, `glaze`, `line`). The old tokens (`ink`, `paper`, `brass`, `cobalt`, `clay`, `buff`…) **no longer exist**.

### Logo
- A vessel silhouette with two glaze bands. The SVG source lives in `scripts/generate-argila-assets.cjs`.
- That script generates: `public/argila-logo-{terra,ink,paper}.png`, `argila-mark.svg`, `argila-icon-{32,512}.png`, `argila-apple-touch.png`, `og-argila.png`, legacy favicons, and `src/app/icon.png`.
- After changing the logo, re-run the script (see section 4 for how to run it on this machine).

---

## 3. ⚠️ Gotchas (important)

1. **`node_modules` was reinstalled for Windows** (2026-10-04, `pnpm@10 install --frozen-lockfile`). The broken macOS copy sits in `node_modules.mac-broken/` (untracked, can be deleted once the owner agrees). `pnpm` isn't installed globally: use `npx pnpm@10 …` (v10 is required by `allowBuilds` in `pnpm-workspace.yaml`).
2. **The dev server can run out of memory** (large module graph). Start it with `NODE_OPTIONS=--max-old-space-size=8192 npx next dev -p 3023`. If styles or fonts look wrong after config changes, stop it, delete `.next`, and restart.
3. **Windows is case-insensitive, Linux isn't.** New files went into existing folders `components/Position/` and `components/Stats/` (capitalised); imports must match that casing exactly or the VPS build breaks. A reachability/case scan script was used to check this; re-check after moving files.
4. **Plain find/replace breaks identifiers** (it once turned `PassbookSection` into `Firing logSection`). After any mass replace, run `npx tsc --noEmit`.
5. **The on-chain token has NOT changed.** The deployed reward token keeps its old name/symbol. `contracts/ArgilaToken.sol` is **not deployed**. Don't deploy without explicit permission.
6. **Contract addresses in `.env.example` don't match** between the `NEXT_PUBLIC_*` and server-only versions (staking and reward token). Cause unverified; ask before "fixing".
7. **`.env` holds secrets.** Don't print, commit or send it.
8. **`/api/stats` is a stub** that always returns zeros/nulls. The UI reads live values from the contract via the hook and only falls back to the API. Don't present API values as real until an indexer exists.
9. **Headless Edge has no GPU here**: WebGL (the hero fire) can't be screenshot-verified; it hides itself and only the CSS glow shows. Verify the fire in a real browser, or preview frames with a CPU port of the shader.
10. The owner's Windows has *Animation effects* off (reduced motion). The hero fire still animates slowly under reduced motion on purpose; embers and parallax stay off.
11. `verification/`, `artifacts/`, `cache/` are build output / records. Don't edit by hand.

---

## 4. How to work here

- Shell: Windows. PowerShell and Git Bash both available.
- Dev: `NODE_OPTIONS=--max-old-space-size=8192 npx next dev -p 3023` → http://localhost:3023
- Typecheck: `npx tsc --noEmit -p .` (last run: 0 errors). Tests: `npx hardhat test` (not yet run after the reinstall).
- Screenshots: `playwright-core` with `channel: "msedge"` (Edge is installed, so no browser download), from a scratch folder outside the repo.
- Assets: `node scripts/generate-argila-assets.cjs` (sharp now works locally after the reinstall).

---

## 5. Key file map

| Area | File |
|---|---|
| Design tokens / utilities | `tailwind.config.ts`, `src/app/globals.css` |
| Fonts | `src/fonts/BricolageGrotesque-Variable-latin.woff2`, `GeistMono-Variable-latin.woff2` (loaded in `src/app/layout.tsx`) |
| Shared kiln components | `src/components/kiln/` (KilnOrb, Embers, HeatBar, stages.ts, useLiveRewards.ts, Nav, Footer, Backdrop, Reveal, CopyAddress, Logo, RollingNumber) |
| Landing | `src/components/home/` (Home, Hero, Firing, Stages, Materials, LiveKiln, Faq, Cta) |
| Stake | `src/components/console/KilnConsole.tsx` → `/stake` |
| Position | `src/components/Position/MyFiring.tsx` → `/position` |
| Stats | `src/components/Stats/KilnStats.tsx` → `/stats` |
| Docs | `src/app/docs/page.tsx` (content kept, restyled). `/protocol` redirects here |
| Tx modal / network banner | `Transaction/TransactionModal.tsx`, `Wallet/WrongNetworkBanner.tsx` |
| RainbowKit theme | `src/components/Providers.tsx` |
| Chain config / hook (logic, don't change) | `src/lib/blockchain/config.ts`, `src/lib/hooks/useLayer5Staking.ts` |
| Admin | `/vodka` → `Admin/VodkaAdminPanel.tsx` (own hard-coded styling, untouched) |
| Contracts | `contracts/Layer5Staking.sol`, `contracts/ArgilaToken.sol` |

Deleted in the rebuild: `components/{landing,Scene,vault,Navigation,Brand,Layer5Core}`, `Staking/StakingDashboard`, `Position/PositionViewer`, `Stats/StatsViewer`, several unused `ui/*`. They're in git history (commit `2741e5d` and earlier) if ever needed.

---

## 6. Status and remaining work

**Committed:** `2741e5d` — the Banco Claro → Argila rebrand (pre-rebuild checkpoint).

**Done, not yet committed:** the full "Heat" UI rebuild (everything in section 5), DESIGN.md / PRODUCT.md / handoff.md updates. Typecheck passes; pages render (200) and were checked in screenshots at 1440px.

**UI ideas queued:** see `ui-improvements.md` (owner wants items 1 + 2 first, then 3).

**Next steps:**
1. [x] Owner reviewed; hero reworked twice (now: minimal text + wide animated WebGL fire). Owner confirmed the fire animates.
1b. [x] No hydration warnings on /, /stake, /position, /stats, with and without reduced motion (checked after the `useReducedMotionSafe` + `MotionConfig` fix).
2. [ ] Mobile (390px) checked for `/` and `/stake`; still check `/position`, `/stats`, `/docs` on mobile.
3. [ ] Commit the rebuild (ask first). End the message with `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
4. [x] `og-argila.png` and icons regenerated with the heat palette.
5. [ ] Run `npx hardhat test` and `pnpm build` before deploying.
6. [ ] Owner checks `argila.xyz` / `@argilaxyz` availability.
7. [ ] Deploy `ArgilaToken` only with explicit permission.
8. [ ] Cleanup with owner's OK: `node_modules.mac-broken/`, old `public/vault-*.png`, `og-vault.png`, `layer5-logo-*`, demo routes `/liquid-demo`, `/liquid-button-demo`.

---

## 7. Working with the owner

- Wants recommendations, not long lists of options. When there's a choice, put the recommended option first.
- Ask before anything irreversible or outward-facing: deploying contracts, pushing, deleting untracked files, changing `.env`.
- Report honestly what has and hasn't been verified (especially since builds can't run here yet).
