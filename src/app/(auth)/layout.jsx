import WithAuth from "#src/ui/auth";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function AuthLayout({ children }) {
  return <WithAuth>{children}</WithAuth>;
}
