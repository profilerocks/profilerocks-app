import Dialog from "#src/ui/dialog";

/**
 * @function LayoutDialog
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function LayoutDialog({ children }) {
  return (
    <>
      {children}
      <Dialog />
    </>
  );
}
