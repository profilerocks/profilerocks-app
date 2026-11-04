import Dialog from "#src/ui/dialog";

interface DialogLayoutProps {
  children: React.ReactNode;
}

export default function DialogLayout({ children }: DialogLayoutProps): React.ReactNode {
  return (
    <>
      {children}
      <Dialog />
    </>
  );
}
