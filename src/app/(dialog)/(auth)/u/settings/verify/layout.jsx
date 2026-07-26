import LayoutForm from "#src/app/(dialog)/u/layout";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function SettingVerifyLayout({ children }) {
  return <LayoutForm>{children}</LayoutForm>;
}
