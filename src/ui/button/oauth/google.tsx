import type React from "react";
import Oauth from "#src/ui/button/oauth";
import IconColoredGoogle from "#src/icons/colored/google.svg";

interface OauthGoogleProps {
  children: React.ReactNode;
}

export default function OauthGoogle({ children }: OauthGoogleProps): React.ReactNode {
  return (
    <Oauth provider="google">
      <IconColoredGoogle className="drop-shadow-xs drop-shadow-black" width="1.25em" />
      {children}
    </Oauth>
  );
}
