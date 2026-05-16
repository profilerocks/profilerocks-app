"use client";

import { useRef } from "react";
import Button from "#src/ui/button";

/**
 * @function
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {string} [props.className]
 * @param {any} props.Dialog
 * @param {boolean} [props.disabled]
 * @returns {React.ReactNode}
 */
export default function ButtonDialog({ children, className, Dialog, disabled }) {
  /**
   * @type {React.RefObject<HTMLDialogElement?>}
   */
  const dialogRef = useRef(null);

  function openDialog() {
    console.log(dialogRef);
    dialogRef.current?.showModal();
  }

  return (
    <>
      <Dialog ref={dialogRef} />
      <Button type="button" onClick={openDialog} disabled={disabled} className={className}>
        {children}
      </Button>
    </>
  );
}
