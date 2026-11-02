/**
 * @param bytesLength - The number of bytes to convert
 * @returns The length of the base64 string (without padding).
 */
export function bytesToBase64Length(bytesLength: number): number {
  return Math.ceil((bytesLength / 3) * 4);
}
