import { useState } from "react";

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
export default function DragDrop({ children, onDrop, ...props }) {
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

  return (
    <div
      className={
        "transition-colors border-3 border-dashed rounded-lg" +
        (isDragging ? " border-zinc-600 pointer-events-none" : "")
      }
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
      onDragOver={onDragOver}
      onDrop={onDropWrapper}
      {...props}
    >
      {children}
    </div>
  );
}
