import { regexDisallowedDisplayNameCharacters, regexSpaceCharacters } from "#src/lib/regex";

export function normalizeDisplayName(value: string): string {
  return value.replaceAll(regexDisallowedDisplayNameCharacters, "").replaceAll(regexSpaceCharacters, " ").trim();
}
