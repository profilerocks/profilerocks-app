import { bytesToBase64Length } from "#src/lib/base64";
import { regexBase64Url } from "#src/lib/regex";

const DEFAULT_ID_LENGTH = 18;

export function isBase64UrlIdValid(id: string, length: number = bytesToBase64Length(DEFAULT_ID_LENGTH)): boolean {
  return id.length === length && regexBase64Url.test(id);
}
