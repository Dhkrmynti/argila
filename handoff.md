# Handoff — Argila (D:\aegis)

> For the next AI agent. Read this whole file before touching anything.
> Last updated: 2026-10-04. Owner works in Indonesian and is casual ("bro"); reply in Indonesian.

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

| Concept | Kiln term |
|---|---|
| vault | kiln |
| passbook | firing log |
| deposit / withdrawal slip | firing ticket / unloading ticket |
| statement / report | kiln report |
| teller stamp | potter's mark (cobalt) |
| rosette dial | potter's wheel |
| position status | Cold / Firing |

### Palette (`tailwind.config.ts` + `src/app/globals.css`)
- `ink` `#120E0B` (kiln char, dark background), `ink-2` `#1B1612`, `ink-3` `#0B0806`, `ink-4` `#28201A`
- `paper` `#F4ECDF` (bisque), `paper-dim` `#BDAF9B`, `paper-faint` `#8D8172`
- `terra` `#D2693C`, `terra-hi` `#EA9068`, `terra-deep` `#A84E2A` — hairlines and accents (formerly `brass`)
- `cobalt` `#3B5BA5`, `cobalt-hi` `#7D9BE0`, `cobalt-deep` `#26438A` — stamps and batch numbers only (formerly `serial`)
- Legacy aliases `clay/slip/buff/miltos/ochre` still exist. Don't use them in new work.

### Logo
- A vessel silhouette with two glaze bands. The SVG source lives in `scripts/generate-argila-assets.cjs`.
- That script generates: `public/argila-logo-{terra,ink,paper}.png`, `argila-mark.svg`, `argila-icon-{32,512}.png`, `argila-apple-touch.png`, `og-argila.png`, legacy favicons, and `src/app/icon.png`.
- After changing the logo, re-run the script (see section 4 for how to run it on this machine).

---

## 3. ⚠️ Gotchas (important)

1. **`node_modules` is broken.** It was copied from a Mac (pnpm, darwin-arm64 binaries), and its symlinks became plain text files. `next`, `tsc`, `hardhat` and `sharp` **cannot run** locally.
   - Proper fix: have the owner run `pnpm install` (or delete `node_modules` and reinstall). **Ask first**, because it changes their working environment.
   - Workaround: install tools in a scratch folder (outside the repo): `npm i sharp typescript@5`. The plain `typescript` package installs v7, which has no `transpileModule`.
2. **Plain find/replace breaks identifiers.** During the rebrand, "Passbook" → "Firing log" turned `PassbookSection` into an invalid `Firing logSection`. It's fixed (the file is now `FiringLogSection.tsx`). After any mass replace, syntax-check every TS/TSX file.
3. **The on-chain token has NOT changed.** The deployed reward token keeps its old name and symbol. `contracts/ArgilaToken.sol` (`ERC20("Argila","ARGL")`, fixed 10M supply) has **not been deployed**. Deploying is outward-facing and irreversible, so **don't deploy without explicit permission from the owner**.
4. **Contract addresses in `.env.example` don't match.** `NEXT_PUBLIC_STAKING_CONTRACT_ADDRESS` (`0x3110…986D`) ≠ `STAKING_CONTRACT_ADDRESS` (`0xFFcE…81B8`), and `NEXT_PUBLIC_REWARD_TOKEN_ADDRESS` (`0x072c…f09d`) ≠ `REWARD_TOKEN_ADDRESS` (`0xC0e1…009B`). The cause isn't verified. Ask the owner before "fixing" it.
5. **`.env` holds secrets.** Don't print, commit or send its contents anywhere. The rebrand changed only the `NEXT_PUBLIC_APP_URL` line in it.
6. **`verification/`, `artifacts/`, `cache/`** are build output and verification records for contracts that are already deployed. Don't edit them by hand.
7. Dead code still references old themes: `src/components/Scene/*`, `HeroVisual3D`, `Layer5Canvas`, `floating-paths`, `sterling-gate-kinetic-navigation` (nothing imports them). Names and colors were changed by the mass replace, but their copy wasn't rewritten. Leave them unless asked, or offer to delete them.

---

## 4. How to work here

- Shell: Windows. PowerShell and Git Bash are both available.
- **Run an asset script with sharp from the scratch folder** (because the local sharp is broken):
  ```powershell
  $env:SHARP_DIR = "<scratch>\node_modules\sharp"
  node -e "const M=require('module');const o=M._resolveFilename;M._resolveFilename=function(r,...a){return o.call(this,r==='sharp'?process.env.SHARP_DIR:r,...a)};require('./scripts/generate-argila-assets.cjs')"
  ```
- **Syntax check** (no full typecheck available): use `typescript@5` `transpileModule` with `reportDiagnostics: true` over every `src/**/*.ts(x)` file. Last run: 81 files, 0 errors.
- Full verification once `node_modules` is fixed: `pnpm build`, `pnpm test` (Hardhat, including `test/ArgilaToken.test.cjs`), then `pnpm dev` (port 3023 for `start`) and check every page visually.

---

## 5. Key file map

| Area | File |
|---|---|
| Landing composition | `src/components/landing/LandingContainer.tsx` |
| Hero / intro / sections | `landing/HeroSection.tsx`, `IntroLoader.tsx`, `FiringLogSection.tsx`, `NotesSection.tsx`, `LiveMetricsSection.tsx`, `ProtocolFaqSection.tsx`, `FinalCTASection.tsx` |
| Nav / footer | `landing/LandingNav.tsx`, `Navigation/Footer.tsx`, `Navigation/Navbar.tsx` |
| Kiln backdrop (all pages) | `src/components/vault/VaultBackdrop.tsx` (component `KilnArt`) |
| Ornaments | `vault/Guilloche.tsx` (rosette = wheel), `vault/Stamp.tsx`, `vault/RollingNumber.tsx`, `vault/ScrollChoreography.tsx` |
| Stake / position / stats | `Staking/StakingDashboard.tsx`, `Position/PositionViewer.tsx`, `Stats/StatsViewer.tsx` |
| Tx modal | `Transaction/TransactionModal.tsx` |
| Metadata / SEO | `src/app/layout.tsx` + the `metadata` in each `page.tsx` |
| RainbowKit theme | `src/components/Providers.tsx` |
| Chain config / hook | `src/lib/blockchain/config.ts`, `src/lib/hooks/useLayer5Staking.ts` (exports `useArgilaStaking`) |
| Contracts | `contracts/Layer5Staking.sol`, `contracts/ArgilaToken.sol`, `contracts/MockToken.sol` |
| Deploy scripts | `scripts/deploy-argila.cjs`, `scripts/deploy-argila-vault.cjs` |

Note: internal names like `Layer5*`, `vault/`, `VaultBackdrop` and `ease-vault` are leftovers from older brands. Visitors never see them. They weren't renamed, to keep the diff small.

---

## 6. Status and remaining work

**Done (all uncommitted):**
- Name, ticker, domain, X handle, metadata, `.env.example`, `package.json`
- Terra / bisque / cobalt palette, with token names changed in the code
- New vessel logo, favicons and OG image
- Kiln backdrop (bricks, flames, potter's wheel) replacing the vault door
- Kiln-lore copy on every live page, plus an "Argila means clay" paragraph in the docs intro
- Contract and test renamed to `ArgilaToken`
- `PRODUCT.md`, `DESIGN.md`, `README.md` updated

**Not done / next steps:**
1. [ ] Fix `node_modules` (ask the owner) → `pnpm build` + `pnpm test` + visual check of every page.
2. [ ] Commit the rebrand. The owner hasn't asked for one yet, so **ask first**. The commit message should end with: `Co-Authored-By: Claude Opus 5.5 <noreply@anthropic.com>`.
3. [ ] Old logo files are still in `public/` (untracked, unused): `vault-*.png`, `og-vault.png`, `layer5-logo-*`. Delete only if the owner agrees; untracked files can't be recovered.
4. [ ] Owner checks that `argila.xyz` and `@argilaxyz` are available. If not, replace them everywhere (grep `argila.xyz` and `argilaxyz`).
5. [ ] Deploy `ArgilaToken` and update the reward token address, only with explicit permission (see gotcha #3).
6. [ ] Optional: rename the `vault/` folder and `VaultBackdrop` to kiln names; delete the dead code (section 3, #7).
7. [ ] Optional: mention the old brand in the README/docs for SEO continuity (e.g. "formerly Banco Claro") if the owner wants.

---

## 7. Working with the owner

- Wants recommendations, not long lists of options. When there's a choice, put the recommended option first.
- Ask before anything irreversible or outward-facing: deploying contracts, pushing, deleting untracked files, changing `.env`.
- Report honestly what has and hasn't been verified (especially since builds can't run here yet).
