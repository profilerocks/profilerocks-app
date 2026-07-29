/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 */
export default function LayoutProfileSetup({ children }) {
  return <div className="max-w-2xl w-full mx-auto px-6 pbe-10">{children}</div>;
}
