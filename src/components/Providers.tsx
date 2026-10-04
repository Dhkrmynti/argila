"use client";

import React, { useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import { MotionConfig } from "framer-motion";
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
              accentColor: "#F28C38",
              accentColorForeground: "#1A0E07",
              borderRadius: "large",
              fontStack: "system",
              overlayBlur: "small",
            }),
            colors: {
              ...darkTheme().colors,
              accentColor: "#F28C38",
              accentColorForeground: "#1A0E07",
              modalBackground: "#171009",
              modalBorder: "rgba(255,226,196,0.12)",
              modalText: "#F6EDE3",
              modalTextSecondary: "#C2B2A3",
              modalTextDim: "#86766A",
              modalBackdrop: "rgba(13,9,7,0.8)",
              actionButtonSecondaryBackground: "#1F1712",
              actionButtonBorder: "rgba(255,226,196,0.1)",
              closeButtonBackground: "#1F1712",
              closeButton: "#F6EDE3",
              generalBorder: "rgba(255,226,196,0.1)",
              generalBorderDim: "rgba(255,226,196,0.05)",
              menuItemBackground: "#1F1712",
              profileForeground: "#171009",
              profileAction: "#1F1712",
              profileActionHover: "#2A2019",
              connectButtonBackground: "#0D0907",
              connectButtonInnerBackground: "#171009",
              connectButtonText: "#F6EDE3",
              selectedOptionBorder: "#FFC56E",
              standby: "#FFC56E",
              error: "#E8553A",
              connectionIndicator: "#FFC56E",
            },
            fonts: { body: "var(--font-bricolage), ui-sans-serif, system-ui, sans-serif" },
          }}
        >
          {/* Under reduced motion, framer skips transform animations but keeps fades; same markup on server and client */}
          <MotionConfig reducedMotion="user">
            <SmoothScrollProvider>{children}</SmoothScrollProvider>
          </MotionConfig>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
