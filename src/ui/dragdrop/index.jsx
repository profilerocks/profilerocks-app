import { useState } from "react";
import styles from "./index.module.scss";

/**
 * @callback OnDrop
 * @param {React.DragEvent<HTMLInputElement>} event
 */

/**
 * @typedef {object} DragDropSpecificProps
 * @property {React.ReactNode} children
 * @property {OnDrop} onDrop
 */

/**
 * @type {React.DragEventHandler<HTMLInputElement>}
 */
function onDragOver(event) {
  event.preventDefault(); // Important
  event.stopPropagation();
}

/**
 * @function
 * @param {React.HTMLAttributes<HTMLDivElement>&DragDropSpecificProps} props
 * @returns {React.ReactNode}
 */
export default function DragDrop({ children, onDrop, className, ...props }) {
  const [isDragging, setIsDragging] = useState(false);

  /**
   * @type {React.DragEventHandler<HTMLInputElement>}
   */
  function onDragEnter(event) {
    event.preventDefault(); // Important
    event.stopPropagation();
    setIsDragging(true);
  }

  /**
   * @type {React.DragEventHandler<HTMLInputElement>}
   */
  function onDragLeave(event) {
    event.preventDefault(); // Important
    event.stopPropagation();
    // @ts-expect-error
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false);
    }
  }

  /**
   * @type {React.DragEventHandler<HTMLInputElement>}
   */
  function onDropWrapper(event) {
    event.preventDefault();
    onDrop(event);
    setIsDragging(false);
  }

  className += " " + styles["container-draggable"];

  if (isDragging) {
    className += " " + styles.dragging;
  }

  return (
    <div
      onDragEnter={onDragEnter}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDropWrapper}
      className={className}
      {...props}
    >
      {children}
    </div>
  );
}
