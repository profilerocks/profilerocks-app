import IconLoading from "#src/icons/loading.svg";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function Message({ children }) {
  return (
    <div className="flex flex-1 flex-col justify-center items-center pbe-20">
      <IconLoading width="10em" className="text-emerald-400" />
      <h1 className="tracking-widest">{children}</h1>
      <p className="tracking-widest mbs-4">Please wait</p>
    </div>
  );
}
