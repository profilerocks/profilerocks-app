import Dialog from "#src/ui/dialog";

interface LayoutDialogProps {
  children: React.ReactNode;
}

export default function LayoutDialog({ children }: LayoutDialogProps): React.ReactNode {
  return (
    <>
      {children}
      <Dialog />
    </>
  );
}
