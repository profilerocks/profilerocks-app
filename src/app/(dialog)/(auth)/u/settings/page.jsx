import LinkBack from "#src/ui/link/back";
import Settings from "#src/ui/settings";
import SvgLogoLong from "#src/static/logo/long.svg";

/**
 * @type {import("next").Metadata}
 */
export const metadata = {
  title: "Settings",
  description: "Settings page"
};

export default function PageSettings() {
  return (
    <>
      <header className="flex items-center gap-2 mx-auto px-2 pbs-2 w-full max-w-5xl lg:gap-3 lg:px-4 lg:pbs-6">
        <LinkBack href="/#side" title="Home" />
        <h1 className="pe-4 text-2xl">Settings</h1>
        <SvgLogoLong width="11em" className="ms-auto select-none" />
      </header>
      <main className="flex gap-x-12 flex-1 flex-col mx-auto max-w-full lg:flex-row lg:justify-between">
        <Settings />
      </main>
    </>
  );
}
