"use client";

import { useSnapshot } from "valtio";
import IconUserPlus from "#src/icons/user/plus.svg";
import { HREF_HELP, PLATFORM_DESCRIPTION, PLATFORM_NAME } from "#src/lib/env";
import globalState from "#src/lib/state";
import LinkBack from "#src/ui/link/back";
import LinkNext from "#src/ui/link/next";

export default function PageAuthDefault() {
  const { profiles } = useSnapshot(globalState);

  return (
    <>
      <LinkBack className="mx-2 mbs-3 max-w-max sm:hidden" href="#side">
        Home
      </LinkBack>
      <div className="px-6">
        <h1 className="text-3xl mbe-4">{PLATFORM_DESCRIPTION}</h1>
        <p>Public Beta version: 1.1.0</p>
        {!profiles?.length && (
          <>
            <p className="text-zinc-200">
              A profile is the foundation of your identity on <strong>{PLATFORM_NAME}</strong>. It allows you to centralize your digital
              footprint and showcase your content with the world.
            </p>
            <p className="text-zinc-200">Start by creating your first profile.</p>
            <div>
              <LinkNext href="/p#page">
                <IconUserPlus width="1.25em" />
                Create your first profile
              </LinkNext>
            </div>
          </>
        )}
        <footer>
          If you have any issues, you can visit the{" "}
          <a href={HREF_HELP} rel="noopener noreferrer" target="_blank">
            help page
          </a>
        </footer>
      </div>
    </>
  );
}
