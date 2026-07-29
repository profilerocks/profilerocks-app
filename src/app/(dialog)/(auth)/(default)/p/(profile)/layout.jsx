import { Suspense } from "react";
import AuthProfile from "#src/ui/auth/profile";
import LinkBack from "#src/ui/link/back";
import LinkNext from "#src/ui/link/next";

/**
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function LayoutProfile({ children }) {
  return (
    <Suspense>
      <AuthProfile>
        <header className="flex items-center gap-2 px-2 pbs-2 md:hidden">
          <LinkBack href="#side" className="pe-3.5 sm:hidden">
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
