import LogoLong from "#src/static/logo/long.svg";
import Minimap from "#src/ui/minimap";

interface LayoutUserForm {
  children: React.ReactNode
}

export default function LayoutUserForm({ children }: LayoutUserForm): React.ReactNode {
  return (
    <>
      <header className="mx-auto w-full max-w-2xl px-6 pbs-5">
        <LogoLong className="select-none" width="18em" />
      </header>
      <main className="mx-auto w-full max-w-2xl px-6 py-4 sm:my-auto">{children}</main>
      <footer className="mbs-auto px-4 py-10">
        <Minimap />
      </footer>
    </>
  );
}
