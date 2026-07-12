import LogoLong from "#src/static/logo/long.svg";
import Minimap from "#src/ui/minimap";
// import styles from "./layout.module.scss";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @returns {React.ReactNode}
 */
export default function LayoutForm({ children }) {
  return (
    <>
      <header className="max-w-2xl w-full mx-auto pbs-5 px-6">
        <LogoLong width="18em" />
      </header>
      <main className="max-w-2xl w-full mx-auto px-6 py-4 sm:my-auto">{children}</main>
      <footer className="px-4 py-10 mbs-auto">
        <Minimap />
      </footer>
    </>
  );
}
