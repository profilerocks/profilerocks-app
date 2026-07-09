import { PLATFORM_NAME } from "#src/lib/env";
import forbiddenProfileNames from "#src/lib/profile/forbidden";

export default function PageBlacklistedProfileNames() {
  return (
    <main className="mx-auto p-6">
      <h1>Blacklisted profile names</h1>
      <p className="mbs-5">
        The following profile names are not allowed in <strong>{PLATFORM_NAME}</strong>:
      </p>
      <ul className="my-5 ms-5 flex list-disc flex-col gap-2 text-gray-300 marker:text-emerald-400">
        {Array.from(forbiddenProfileNames).map(name => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </main>
  );
}
