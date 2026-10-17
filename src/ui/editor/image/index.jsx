"use client";

import { useRef, useEffect } from "react";
import { Cropper } from "react-mobile-cropper";
import IconClose from "#src/icons/close.svg";
import Button from "#src/ui/button";
import styles from "./index.module.scss";
import "react-mobile-cropper/dist/style.css";

/**
 * @typedef {import("react-mobile-cropper").CropperRef} CropperRef
 * @typedef {import("react-mobile-cropper").CropperProps} CropperProps
 */

/**
 * @param {CropperProps & { callbackBlob?: BlobCallback }} props
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
    console.log(src);
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
    <dialog className={styles["dialog-image-editor"]} onKeyDown={onKeyDown} ref={dialogRef}>
      <form method="dialog" className={styles.actions}>
        <Button type="submit">
          <IconClose width="1.5em" />
        </Button>
        <Button type="submit" onClick={onCrop} autoFocus>
          Save
        </Button>
      </form>
      <Cropper src={src} ref={copperRef} className={styles.cropper} navigationProps={{ className: styles.navigation }} {...restProps} />
    </dialog>
  );
}
