import { useState } from "react";

function onDragOver(event: React.DragEvent<HTMLInputElement>) {
  event.preventDefault(); // Important
  event.stopPropagation();
}

export default function DragDrop({ children, onDrop, ...props }: React.ComponentPropsWithoutRef<"div">) {
  const [isDragging, setIsDragging] = useState(false);

  function onDragEnter(event: React.DragEvent<HTMLInputElement>) {
    event.preventDefault(); // Important
    event.stopPropagation();
    setIsDragging(true);
  }

  function onDragLeave(event: React.DragEvent<HTMLInputElement>) {
    event.preventDefault(); // Important
    event.stopPropagation();
    // @ts-expect-error
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false);
    }
  }

  function onDropWrapper(event: React.DragEvent<HTMLInputElement>) {
    event.preventDefault();
    onDrop?.(event);
    setIsDragging(false);
  }

  return (
    <div
      className={"rounded-lg border-3 border-dashed transition-colors" + (isDragging ? " pointer-events-none border-zinc-600" : "")}
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
