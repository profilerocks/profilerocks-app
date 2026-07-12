import Oauth from "#src/ui/button/oauth";
import IconColoredGoogle from "#src/icons/colored/google.svg";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function OauthGoogle({ children }) {
  return (
    <Oauth provider="google">
      <IconColoredGoogle className="drop-shadow-xs drop-shadow-black" width="1.25em" />
      {children}
    </Oauth>
  );
}
