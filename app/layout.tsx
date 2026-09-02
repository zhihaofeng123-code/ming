import type { Metadata } from "next";
import { Fraunces, Karla } from "next/font/google";
import Script from "next/script";
import type { ReactNode } from "react";
import { KylonAutoRefresh } from "@/components/kylon-auto-refresh";
import { KylonWorkspaceProvider } from "@/components/providers/kylon-workspace-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { VisualViewportVars } from "@/components/visual-viewport-vars";
import { appDefinition } from "@/lib/app-definition/definition";
import { getKylonWorkspaceContext } from "@/lib/kylon/bridge";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-fraunces",
});

const karla = Karla({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-karla",
});

export const metadata: Metadata = {
  title: "MING — your Four Pillars chart, in plain language",
  description:
    "MING turns your birth date, time and place into a Four Pillars (BaZi) chart and writes it out in plain English: how you work, the season you are in, and how you meet other people. Conditions and choices, never predictions.",
  openGraph: {
    title: "MING — your Four Pillars chart, in plain language",
    description:
      "A Four Pillars (BaZi) reading written the way a person would explain it. Conditions and choices, never predictions. Join the waitlist.",
    type: "website",
  },
};

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

export default function RootLayout({ children }: { children: ReactNode }) {
  const kylonProductUrl = trimTrailingSlash(
    process.env.NEXT_PUBLIC_KYLON_PRODUCT_APP_URL ?? "https://app.kylon.io",
  );
  const kylonBridgeUrl =
    process.env.NEXT_PUBLIC_KYLON_BRIDGE_URL ?? `${kylonProductUrl}/custom-app/v1/bridge.js`;
  const kylonAppId = process.env.NEXT_PUBLIC_KYLON_APP_ID ?? process.env.KYLON_APP_ID;

  return (
    <html lang="en" className={`${fraunces.variable} ${karla.variable}`}>
      <body>
        <VisualViewportVars />
        <QueryProvider>
          <KylonWorkspaceProvider value={getKylonWorkspaceContext(appDefinition.app.id)}>
            <TooltipProvider>{children}</TooltipProvider>
          </KylonWorkspaceProvider>
          <KylonAutoRefresh />
        </QueryProvider>
        <Script
          src={kylonBridgeUrl}
          strategy="afterInteractive"
          data-kylon-origin={kylonProductUrl}
          data-kylon-app-id={kylonAppId}
        />
      </body>
    </html>
  );
}
