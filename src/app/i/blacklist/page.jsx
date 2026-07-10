import { PLATFORM_NAME } from "#src/lib/env";
import forbiddenProfileNames from "#src/lib/profile/forbidden";

export default function PageBlacklistedProfileNames() {
  return (
    <main className="mx-auto p-6">
      <h1 className="text-4xl">Blacklisted profile names</h1>
      <p className="mbs-5 text-zinc-200">
        The following profile names are not allowed in <strong className="text-zinc-100">{PLATFORM_NAME}</strong>:
      </p>
      <ul className="my-5 ms-5 flex list-disc flex-col gap-2 text-zinc-300 marker:text-emerald-400">
        {Array.from(forbiddenProfileNames).map(name => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </main>
  );
}
