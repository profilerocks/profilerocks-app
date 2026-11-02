export function getSecondsFromBase36(secondsBase36: string): number {
  return parseInt(secondsBase36, 36);
}

export function msToSeconds(ms: number, roundFunction = Math.trunc): number {
  return roundFunction(ms / 1000);
}

export function secondsToMs(seconds: number): number {
  return seconds * 1000;
}
