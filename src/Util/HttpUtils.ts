import { Request } from '../types.js';

export class HttpUtils {
  /**
   * Normalizes a value by encoding special characters
   * @param value - The value to normalize
   * @returns Normalized string
   */
  static normalize(value: any): string {
    let vStr = "";
    if (value) {
      const bytes = Buffer.from(value.toString(), 'utf-8');
      for (let i = 0; i < bytes.length; i++) {
        const byte = bytes[i];
        const s = String.fromCharCode(byte);
        if (s.match(/[0-9a-zA-Z._~-]/)) {
          vStr += s;
        } else {
          vStr += '%' + byte.toString(16).toUpperCase();
        }
      }
    }
    return vStr;
  }

  /**
   * Converts a string to bytes (UTF-8 encoding)
   * @param str - The string to convert
   * @returns Array of bytes
   */
  static stringToByte(str: string): number[] {
    const bytes: number[] = [];
    const len = str.length;
    for (let i = 0; i < len; i++) {
      const c = str.charCodeAt(i);
      if (c >= 0x010000 && c <= 0x10FFFF) {
        bytes.push(((c >> 18) & 0x07) | 0xF0);
        bytes.push(((c >> 12) & 0x3F) | 0x80);
        bytes.push(((c >> 6) & 0x3F) | 0x80);
        bytes.push((c & 0x3F) | 0x80);
      } else if (c >= 0x000800 && c <= 0x00FFFF) {
        bytes.push(((c >> 12) & 0x0F) | 0xE0);
        bytes.push(((c >> 6) & 0x3F) | 0x80);
        bytes.push((c & 0x3F) | 0x80);
      } else if (c >= 0x000080 && c <= 0x0007FF) {
        bytes.push(((c >> 6) & 0x1F) | 0xC0);
        bytes.push((c & 0x3F) | 0x80);
      } else {
        bytes.push(c & 0xFF);
      }
    }
    return bytes;
  }

  /**
   * Encodes parameters in a request
   * @param req - The request containing parameters
   * @returns Encoded parameters
   */
  static encodeParams(req: Request): Record<string, string> {
    const encoded: Record<string, string> = {};
    for (const k in req.paramMap) {
      const v = req.paramMap[k];
      encoded[this.normalize(k)] = this.normalize(v);
    }
    return encoded;
  }

  /**
   * Checks if a string starts with a substring
   * @param haystack - The string to check
   * @param needle - The substring to look for
   * @returns True if haystack starts with needle
   */
  static startsWith(haystack: string, needle: string): boolean {
    if (!needle) {
      return true;
    }
    return haystack.lastIndexOf(needle) >= 0;
  }

  /**
   * Checks if a string ends with a substring
   * @param haystack - The string to check
   * @param needle - The substring to look for
   * @returns True if haystack ends with needle
   */
  static endsWith(haystack: string, needle: string): boolean {
    if (!needle) {
      return true;
    }
    const temp = (haystack.length - needle.length);
    return temp >= 0;
  }
}

export default HttpUtils;
