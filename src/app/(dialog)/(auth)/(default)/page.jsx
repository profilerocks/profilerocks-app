"use client";

import { useSnapshot } from "valtio";
import IconUserPlus from "#src/icons/user/plus.svg";
import { HREF_HELP, PLATFORM_DESCRIPTION, PLATFORM_NAME } from "#src/lib/env";
import globalState from "#src/lib/state";
import LinkBack from "#src/ui/link/back";
import LinkNext from "#src/ui/link/next";
import Link from "#src/ui/link";

export default function PageAuthDefault() {
  const { profiles } = useSnapshot(globalState);

  return (
    <>
      <LinkBack className="ms-2 mbs-3 max-w-max pe-3.5 sm:hidden" href="#side">
        Home
      </LinkBack>
      <div className="px-6 pbs-4">
        <h1 className="text-3xl">{PLATFORM_DESCRIPTION}</h1>
        <p className="mbs-4">Public Beta version: 1.1.0</p>
        {!profiles?.length && (
          <>
            <p className="mbs-4 text-zinc-200">
              A profile is the foundation of your identity on <strong>{PLATFORM_NAME}</strong>. It allows you to centralize your digital
              footprint and showcase your content with the world.
            </p>
            <p className="mbs-4 text-zinc-200">Start by creating your first profile.</p>
            <LinkNext href="/p#page" className="mbs-4">
              <IconUserPlus width="1.25em" />
              Create your first profile
            </LinkNext>
          </>
        )}
        <footer className="mbs-6 text-zinc-300">
          If you have any issues, you can visit the{" "}
          <Link href={HREF_HELP} rel="noopener noreferrer" target="_blank">
            {" "}
            help page
          </Link>
          .
        </footer>
      </div>
    </>
  );
}
