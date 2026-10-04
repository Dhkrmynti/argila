"use client";

import React, { useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import "@rainbow-me/rainbowkit/styles.css";
import { wagmiConfig } from "@/lib/blockchain/wagmi";
import { SmoothScrollProvider } from "@/components/Providers/SmoothScrollProvider";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            staleTime: 5000,
          },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          locale="id-ID"
          modalSize="wide"
          theme={{
            ...darkTheme({
              accentColor: "#F4ECDF",
              accentColorForeground: "#120E0B",
              borderRadius: "none",
              fontStack: "system",
              overlayBlur: "small",
            }),
            colors: {
              ...darkTheme().colors,
              accentColor: "#F4ECDF",
              accentColorForeground: "#120E0B",
              modalBackground: "#141312",
              modalBorder: "rgba(210,105,60, 0.35)",
              modalText: "#F4ECDF",
              modalTextSecondary: "#B9B4A8",
              modalTextDim: "#8A867C",
              modalBackdrop: "rgba(7,7,7, 0.72)",
              actionButtonSecondaryBackground: "#1E1C19",
              actionButtonBorder: "rgba(210,105,60, 0.25)",
              closeButtonBackground: "#1E1C19",
              closeButton: "#F4ECDF",
              generalBorder: "rgba(210,105,60, 0.22)",
              generalBorderDim: "rgba(210,105,60, 0.12)",
              menuItemBackground: "#1E1C19",
              profileForeground: "#141312",
              profileAction: "#1E1C19",
              profileActionHover: "#2A2723",
              connectButtonBackground: "#120E0B",
              connectButtonInnerBackground: "#141312",
              connectButtonText: "#F4ECDF",
              selectedOptionBorder: "#D2693C",
              standby: "#E5C67A",
              error: "#D9573A",
              connectionIndicator: "#D2693C",
            },
            fonts: { body: "var(--font-archivo), -apple-system, sans-serif" },
          }}
        >
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
