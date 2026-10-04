import { http, createConfig } from "wagmi";
import { robinhoodChain, hardhatChain } from "./chains";
import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  bitgetWallet,
  okxWallet,
  metaMaskWallet,
  phantomWallet,
  injectedWallet,
  coinbaseWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "3a8170812b534d0ff9d794f19a901d64";

const connectors = connectorsForWallets(
  [
    {
      groupName: "Installed",
      wallets: [
        bitgetWallet,
        okxWallet,
        metaMaskWallet,
        phantomWallet,
      ],
    },
    {
      groupName: "Wallets",
      wallets: [
        injectedWallet,
        coinbaseWallet,
        walletConnectWallet,
      ],
    },
  ],
  {
    appName: "Argila",
    projectId,
  }
);

export const wagmiConfig = createConfig({
  chains: [robinhoodChain, hardhatChain],
  connectors,
  transports: {
    [robinhoodChain.id]: http(robinhoodChain.rpcUrls.default.http[0]),
    [hardhatChain.id]: http("http://127.0.0.1:8545"),
  },
  ssr: true,
});
