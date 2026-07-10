"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import IconRobotConfused from "#src/icons/robot/confused.svg";
import { HREF_PROFILE } from "#src/lib/env";
import { isProfileNameIdValid } from "#src/lib/profile";
import Minimap from "#src/ui/minimap";

export default function NotFound() {
  const pathname = usePathname();

  useEffect(() => {
    const normalizedPathname = pathname
      .substring(1) // Remove leading slash
      .replace(/\/+$/, "") // Remove trailing slashes
      .toLowerCase();

    if (isProfileNameIdValid(normalizedPathname)) {
      window.location.replace(new URL(normalizedPathname, HREF_PROFILE));
    } else {
      const mainEl = document.querySelector("main");

      if (mainEl) {
        mainEl.style.opacity = "1";
      }
    }
  }, [pathname]);

  return (
    <main className="px-6 pbs-3 opacity-0 transition-opacity">
      <figure>
        <IconRobotConfused className="mx-auto max-w-3xs text-emerald-400" />
        <figcaption className="text-center">
          <h1 className="text-7xl">404</h1>
          <p className="mbs-2 text-3xl text-zinc-400">Not found</p>
        </figcaption>
      </figure>
      <p className="mx-auto my-8 max-w-max text-zinc-200">
        <q>Looks like this page took a wrong turn... Maybe it&#39;s lost in the internet void, or just grabbing a coffee.</q>
      </p>
      <Minimap />
    </main>
  );
}
