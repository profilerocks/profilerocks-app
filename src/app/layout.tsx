import { Suspense } from "react";
import { PLATFORM_NAME, PLATFORM_DESCRIPTION, SITE } from "#src/lib/env";
import { fontText } from "#src/lib/fonts";
import ErrorInSearchParams from "#src/ui/error/params";
import OnlineStatus from "#src/ui/online";
import "./global.css";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  appleWebApp: {
    capable: true,
    //startupImage: "...",
    statusBarStyle: "black-translucent",
    title: PLATFORM_NAME
  },
  applicationName: PLATFORM_NAME,
  authors: { url: "/humans.txt" },
  description: PLATFORM_DESCRIPTION,
  formatDetection: {
    address: false,
    date: false,
    email: false,
    telephone: false,
    url: false
  },
  keywords: ["business", "navigation", "personalization", "social"],
  metadataBase: new URL(SITE),
  other: {
    designer: "Stefan Samson <ss42701@outlook.com> (https://ssbit01.github.io/)",
    license: "MIT",
    "license:uri": "https://github.com/profilerocks/profilerocks-app/blob/main/LICENSE",
    MSSmartTagsPreventParsing: "true"
  },
  referrer: "no-referrer",
  title: {
    template: `${PLATFORM_NAME} | %s`,
    default: PLATFORM_NAME
  }
};

export const viewport: Viewport = {
  colorScheme: "dark light",
  themeColor: [{ color: "#000" }]
};

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps): React.ReactNode {
  return (
    <html
      className="h-full scrollbar-thumb-zinc-400 scroll-smooth motion-reduce:scroll-auto"
      data-scroll-behavior="smooth"
      lang="en"
      prefix="og: https://ogp.me/ns#"
    >
      <body className={"flex h-full flex-col bg-black text-zinc-200 " + fontText.className}>
        {/** Since `ErrorInSearchParams` uses `useSearchParams`, it needs to be wrapped in a Suspense boundary. */}
        <Suspense>
          <ErrorInSearchParams />
        </Suspense>
        {children}
        <OnlineStatus />
      </body>
    </html>
  );
}
