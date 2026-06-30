"use client";

import { useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import globalState from "#src/lib/state";

export default function Dialog() {
  const { dialogConfirmFunction, dialogOpen } = useSnapshot(globalState);

  /**
   * @type {React.Ref<HTMLDialogElement|null>}
   */
  const dialogRef = useRef(null);

  useEffect(() => {
    if (dialogOpen) {
      dialogRef.current?.showModal()
    } else {
      dialogRef.current?.close()
    }
  }, [dialogOpen]);

  return (
    <dialog ref={dialogRef}>
      {globalState.dialogContent}
      <form method="dialog">
        <button type="submit">{dialogConfirmFunction ? "Yes" : "Ok"}</button>
        {dialogConfirmFunction ? <button type="submit">No</button> : null}
      </form>
    </dialog>
  );
}
