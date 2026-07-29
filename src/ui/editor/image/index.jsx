"use client";

import { useRef, useEffect } from "react";
import { Cropper } from "react-mobile-cropper";
import IconClose from "#src/icons/close.svg";
import Button from "#src/ui/button";
import "react-mobile-cropper/dist/style.css";

/**
 * @import {CropperProps,CropperRef} from "react-mobile-cropper"
 */

/**
 * @param {CropperProps&{callbackBlob?:BlobCallback}} props
 */
export default function ImageEditor({ src, callbackBlob, ...restProps }) {
  /**
   * @type {React.RefObject<HTMLDialogElement|null>}
   */
  const dialogRef = useRef(null);

  /**
   * @type {React.RefObject<CropperRef|null>}
   */
  const copperRef = useRef(null);

  function cleanPhoto() {
    // @ts-expect-error
    URL.revokeObjectURL(src);
  }

  useEffect(() => {
    if (src) {
      dialogRef.current?.showModal();
      return cleanPhoto;
    }
  }, [src]);

  function onCrop() {
    if (callbackBlob) {
      copperRef.current?.getCanvas()?.toBlob(callbackBlob, "image/webp", 0.9);
    }
  }

  /** @type {React.KeyboardEventHandler<HTMLDialogElement>} */
  const onKeyDown = event => {
    if (event.code === "Enter") {
      const el = event.currentTarget;
      if (el.open) {
        event.currentTarget.close();
        event.preventDefault();
        event.stopPropagation();
        onCrop();
      }
    }
  };

  return (
    <dialog className="max-h-full max-w-full" onKeyDown={onKeyDown} ref={dialogRef}>
      <form className="absolute inset-x-2 inset-bs-2 z-1 mx-auto flex max-w-5xl items-center justify-between gap-4" method="dialog">
        <Button type="submit">
          <IconClose width="1.5em" />
        </Button>
        <Button type="submit" onClick={onCrop} autoFocus>
          Save
        </Button>
      </form>
      <Cropper
        className="h-full pbs-18 pbe-26 text-emerald-400"
        navigationProps={{
          className: "inset-be-4"
        }}
        ref={copperRef}
        src={src}
        {...restProps}
      />
    </dialog>
  );
}
