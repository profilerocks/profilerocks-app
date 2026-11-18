import { Suspense } from "react";
import AuthProfile from "#src/ui/auth/profile";
import LinkButtonBack from "#src/ui/link/button/back";
import LinkButtonNext from "#src/ui/link/button/next";

interface LayoutProfileProps {
  children: React.ReactNode;
}

export default function LayoutProfile({ children }: LayoutProfileProps) {
  return (
    <Suspense>
      <AuthProfile>
        <header className="flex items-center gap-2 px-2 pbs-2 lg:hidden">
          <LinkButtonBack href="#side" className="pe-3.5 md:hidden">
            Home
          </LinkButtonBack>
          <LinkButtonNext href="#preview" className="ms-auto ps-3.5">
            Preview
          </LinkButtonNext>
        </header>
        {children}
      </AuthProfile>
    </Suspense>
  );
}
