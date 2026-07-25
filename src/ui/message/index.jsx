import IconLoading from "#src/icons/loading.svg";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function Message({ children }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center pbe-20">
      <IconLoading width="10em" className="text-emerald-400" />
      <h1 className="tracking-widest">{children}</h1>
      <p className="mbs-4 tracking-widest">Please wait</p>
    </div>
  );
}
