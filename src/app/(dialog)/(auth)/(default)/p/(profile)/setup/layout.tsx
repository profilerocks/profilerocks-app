interface LayoutProfileSetupProps {
  children: React.ReactNode
}

export default function LayoutProfileSetup({ children }: LayoutProfileSetupProps) {
  return <div className="mx-auto w-full max-w-2xl px-6 pbe-10">{children}</div>;
}
