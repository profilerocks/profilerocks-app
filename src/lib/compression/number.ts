export function compressNumber(num: number | bigint): string {
  return num.toString(36);
}

export function decompressNumber(compressedNumber: string): number {
  return parseInt(compressedNumber, 36);
}
