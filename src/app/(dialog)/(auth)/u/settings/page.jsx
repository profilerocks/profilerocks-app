import LinkBack from "#src/ui/link/back";
import Settings from "#src/ui/settings";
import SvgLogoLong from "#src/static/logo/long.svg";

/**
 * @import {Metadata} from "next"
 */

/**
 * @type {Metadata}
 */
export const metadata = {
  title: "Settings",
  description: "Settings page"
};

export default function PageSettings() {
  return (
    <>
      <header className="mx-auto flex w-full max-w-4xl items-center gap-2 px-2 pbs-2 md:pbs-3 md:pbe-2 lg:max-w-5xl lg:gap-3 lg:px-4 lg:pbs-6">
        <LinkBack href="/#side" title="Home" />
        <h1 className="pe-4 text-2xl">Settings</h1>
        <SvgLogoLong width="11em" className="ms-auto select-none" />
      </header>
      <main className="mx-auto flex h-full max-w-full flex-1 flex-col gap-x-12 lg:flex-row lg:items-start">
        <Settings />
      </main>
    </>
  );
}
