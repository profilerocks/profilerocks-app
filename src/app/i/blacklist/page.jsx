import { PLATFORM_NAME } from "#src/lib/env";
import forbiddenProfileNames from "#src/lib/profile/forbidden";
import styles from "./page.module.scss";

export default function PageBlacklistedProfileNames() {
  return (
    <main className={styles.page}>
      <h1>Blacklisted profile names</h1>
      <p>
        The following profile names are not allowed in <strong>{PLATFORM_NAME}</strong>:
      </p>
      <ul>
        {Array.from(forbiddenProfileNames).map(name => (
          <li key={name}>{name}</li>
        ))}
      </ul>
    </main>
  );
}
