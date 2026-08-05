"use client";

import { useEffect, useRef } from "react";
import { useSnapshot } from "valtio";
import globalState from "#src/lib/state";

function handleDialogClose() {
  globalState.dialogOpen = false;
  // globalState.dialogConfirmFunction = undefined;
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
    <dialog
      className="scale-75 opacity-0 transition transition-discrete backdrop:transition backdrop:transition-discrete open:scale-1 open:opacity-1 open:backdrop:backdrop-blur-sm open:starting:scale-75 open:starting:opacity-0 open:backdrop:starting:backdrop-blur-none"
      onClose={handleDialogClose}
      ref={dialogRef}
    >
      <div className="rounded-t-xl border-2 border-be-0 border-zinc-700 bg-zinc-900 p-4 pbe-5 text-lg">
        {/* @ts-ignore */}
        {dialogContent}
      </div>
      <form method="dialog" className="flex *:flex-1 *:cursor-pointer *:p-2.5 first:rounded-bl-xl last:rounded-br-xl">
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
