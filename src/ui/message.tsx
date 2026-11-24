import IconLoading from "#src/icons/loading.svg";

interface MessageProps {
  children: React.ReactNode;
}

export default function Message({ children }: MessageProps): React.ReactNode {
  return (
    <div className="flex flex-1 flex-col items-center justify-center pbs-5 pbe-20">
      <IconLoading width="10em" className="text-emerald-400" />
      <h1 className="tracking-widest text-3xl mbs-6">{children}</h1>
      <p className="tracking-widest mbs-1 text-zinc-400">Please wait</p>
    </div>
  );
}
