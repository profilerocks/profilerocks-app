import { PLATFORM_NAME } from "#src/lib/env";

export default function PageProfileMembers() {
  return (
    <>
      <h1>Members</h1>
      <p className="text-zinc-300">
        <strong className="text-zinc-200">{PLATFORM_NAME}</strong> will soon offer the option to allow multiple users to manage a profile.
      </p>
    </>
  );
}
