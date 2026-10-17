/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function LayoutProfileSetup({ children }) {
  return <div className="mx-auto w-full max-w-2xl px-6 pbe-10">{children}</div>;
}
