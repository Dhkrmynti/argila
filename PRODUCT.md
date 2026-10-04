# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 14 (App Router), Tailwind CSS, framer-motion, wagmi v2 + RainbowKit + viem, Prisma (SQLite). Contracts in Hardhat.

## What it is

Argila is a staking protocol on Robinhood Chain (chain ID 4663). Users deposit USDG and earn ARGL token rewards that accrue every block (Synthetix-style `rewardPerToken`), with no lockup: stake, unstake, claim, or exit at any time.

## Users

Primary: retail crypto holders who already hold USDG on Robinhood Chain and are looking for yield. They need to understand quickly what happens to their money and trust it enough to connect a wallet and stake.

## Surfaces

- `/` landing (explains the protocol, live on-chain metrics, FAQ, CTA)
- `/stake` staking console (approve, stake, unstake, claim, exit)
- `/position` personal position viewer
- `/stats` on-chain network statistics and verified contracts
- `/docs` technical documentation

## Constraints

- Functionality is frozen: wallet connection, contract calls, hooks, API routes, and data flow must not change. Visual work only.
- Numbers shown (TVL, APY, stakers) come from chain reads; never invent figures.
- Wrong-network detection and transaction states (idle, confirming, pending, success, failed) must stay visible.

## Brand commitments

- Name: Argila (Portuguese/Spanish for "clay"). Rebrand history: Aegis → Vault → Banco Claro → Argila (Argila chosen by the owner on 2026-10-04). Wordmark "ARGILA". Reward token ticker: ARGL. The token already deployed on-chain keeps its original name and symbol until a new one is deployed.
- Logo: the vessel mark (a clay pot with two glaze bands), drawn in `scripts/generate-argila-assets.cjs`, which renders `argila-logo-terra.png`, `argila-logo-ink.png`, `argila-logo-paper.png`, `argila-mark.svg`, the favicons and `og-argila.png`. The Banco Claro temple mark (`vault-*.png`) is retired.
- Theme: Kiln — a potter's studio. Staked USDG is clay set in the kiln; every block fires a little more ARGL; the principal comes out exactly as it went in. The rosette reads as the potter's wheel, the ledger as the firing log, stamps as the potter's mark. Tagline: "Patience, fired into value."
- Everything else (palette, layout, components, motion) is open to replacement.
- Socials: X @argilaxyz (https://x.com/argilaxyz). Domain argila.xyz.
