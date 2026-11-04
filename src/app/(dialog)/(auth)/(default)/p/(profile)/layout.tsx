import { Suspense } from "react";
import AuthProfile from "#src/ui/auth/profile";
import LinkBack from "#src/ui/link/back";
import LinkNext from "#src/ui/link/next";

interface LayoutProfileProps {
  children: React.ReactNode
}

export default function LayoutProfile({ children }: LayoutProfileProps) {
  return (
    <Suspense>
      <AuthProfile>
        <header className="flex items-center gap-2 px-2 pbs-2 lg:hidden">
          <LinkBack href="#side" className="pe-3.5 md:hidden">
            Home
          </LinkBack>
          <LinkNext href="#preview" className="ms-auto ps-3.5">
            Preview
          </LinkNext>
        </header>
        {children}
      </AuthProfile>
    </Suspense>
  );
}
