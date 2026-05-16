import styles from "./index.module.scss";

/**
 * @typedef {Omit<React.DialogHTMLAttributes<HTMLDialogElement>, "className" | "onPointerDown"> & { acceptFunction?: (event: React.MouseEvent<HTMLButtonElement>) => any, children: React.ReactNode }} Props
 */

/**
 * @param {React.PointerEvent<HTMLDialogElement>} event
 */
function dialogPointerDown(event) {
  if (event.target === event.currentTarget) {
    event.currentTarget.close();
  }
}

/**
 * @param {Props} props
 */
export default function Dialog({ children, acceptFunction, ...props }) {
  return (
    <dialog className={styles.modal} onPointerDown={dialogPointerDown} {...props}>
      <div className={styles.content}>{children}</div>
      <form method="dialog" className={styles["actions-dialog"]}>
        {acceptFunction ? (
          <>
            <button type="submit">No</button>
            <button type="submit" onClick={acceptFunction}>
              Yes
            </button>
          </>
        ) : (
          <button type="submit">Ok</button>
        )}
      </form>
    </dialog>
  );
}
