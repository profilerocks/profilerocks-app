"use client";

import { useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import globalState from "#src/lib/state";
import styles from "./index.module.scss";

function handleDialogClose() {
  globalState.dialogOpen = false;
  //globalState.dialogConfirmFunction = undefined;
  // globalState.dialogContent = undefined;
}

export default function Dialog() {
  const { dialogConfirmFunction, dialogContent, dialogOpen } = useSnapshot(globalState);

  /**
   * @type {React.Ref<HTMLDialogElement|null>}
   */
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog) {
      if (dialogOpen) {
        if (!dialog.open) {
          dialog.showModal();
        }
      } else if (dialog.open) {
        dialog.close();
      }
    }
  }, [dialogOpen]);

  return (
    <dialog className={styles.dialog} onClose={handleDialogClose} ref={dialogRef}>
      <div className={styles["dialog-content"]}>
        {/* @ts-ignore */}
        {dialogContent}
      </div>
      <form method="dialog" className={styles["dialog-form"]}>
        {dialogConfirmFunction ? (
          <>
            <button type="submit" onClick={() => dialogConfirmFunction(true)}>
              Yes
            </button>
            <button type="submit" onClick={() => dialogConfirmFunction(false)}>
              Cancel
            </button>
          </>
        ) : (
          <button type="submit">Ok</button>
        )}
      </form>
    </dialog>
  );
}
