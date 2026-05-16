import { Suspense } from "react";
import { PLATFORM_NAME, PLATFORM_DESCRIPTION, SITE } from "#src/lib/env";
import { fontText } from "#src/lib/fonts";
import ErrorInSearchParams from "#src/ui/error";
import OnlineStatus from "#src/ui/online";
import "./global.scss";

/**
 * @import {Metadata,Viewport} from "next"
 */

/**
 * @type {Metadata}
 */
export const metadata = {
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
    // license: "MIT",
    // "license:uri": "https://github.com/profile-rocks/profile-rocks-app/blob/main/LICENSE",
    MSSmartTagsPreventParsing: "true"
  },
  openGraph: {},
  referrer: "no-referrer",
  title: {
    template: `${PLATFORM_NAME} | %s`,
    default: PLATFORM_NAME
  },
  twitter: {},
  robots: "noindex, nofollow"
};

/**
 * @type {Viewport}
 */
export const viewport = {
  colorScheme: "dark light",
  themeColor: [{ color: "#000" }, { color: "#fff", media: "(prefers-color-scheme: light)" }]
};

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function Layout({ children }) {
  return (
    <html lang="en" prefix="og: https://ogp.me/ns#" data-scroll-behavior="smooth">
      <body className={fontText.className}>
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
