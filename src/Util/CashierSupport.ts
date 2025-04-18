import crypto from 'crypto';
import { HttpUtils } from './HttpUtils';

interface CashierParams {
  appKey: string;
  merchantNo: string;
  token: string;
  timestamp: string;
  directPayType: string;
  cardType: string;
  userNo: string;
  userType: string;
}

export class CashierSupport {
  static CASHIER_URL = "https://cash.yeepay.com/cashier/std";

  /**
   * Gets payment URL for cashier
   * @param privateKey - Private key for signing
   * @param appKey - Application key
   * @param merchantNo - Merchant number
   * @param token - Token from order creation
   * @returns Payment URL
   */
  static getPayUrl(privateKey: string, appKey: string, merchantNo: string, token: string): string {
    const params: CashierParams = {
      appKey,
      merchantNo, // System merchant number
      token, // Token from order creation API
      timestamp: '', // Timestamp
      directPayType: '', // Direct payment type
      cardType: '', // Card type (only for bank card quick payment)
      userNo: '', // User identifier for bank card quick payment (for card binding)
      userType: 'USER_ID' // User identifier type
    };
    
    const str = this.getCanonicalParams(params);
    const sign = this.signature(privateKey, str);
    
    return this.CASHIER_URL + "?sign=" + sign + "&" + str;
  }

  /**
   * Gets canonical parameters string
   * @param params - Parameters to canonicalize
   * @returns Canonical parameters string
   */
  static getCanonicalParams(params: Record<string, any> = {}): string {
    const paramStrings: string[] = [];
    
    for (const key in params) {
      let value = params[key];
      
      if (!key) {
        continue;
      }
      
      if (!value) {
        value = "";
      }
      
      const normalizedKey = HttpUtils.normalize(key.trim());
      const normalizedValue = HttpUtils.normalize(value.toString().trim());
      
      paramStrings.push(normalizedKey + '=' + normalizedValue);
    }
    
    paramStrings.sort();
    
    let strQuery = "";
    for (const i in paramStrings) {
      const kv = paramStrings[i];
      strQuery += strQuery.length === 0 ? "" : "&";
      strQuery += kv;
    }
    
    return strQuery;
  }

  /**
   * Signs a string using RSA-SHA256
   * @param secretKey - Private key for signing
   * @param str - String to sign
   * @returns Signature
   */
  static signature(secretKey: string, str: string): string {
    let r = secretKey;
    let a = "-----BEGIN PRIVATE KEY-----";
    let b = "-----END PRIVATE KEY-----";
    let private_key = "";
    let len = r.length;
    let start = 0;
    
    while (start <= len) {
      if (private_key.length) {
        private_key += r.substr(start, 64) + '\n';
      } else {
        private_key = r.substr(start, 64) + '\n';
      }
      start += 64;
    }
    
    private_key = a + '\n' + private_key + b;
    let sign = crypto.createSign('RSA-SHA256');
    sign.update(str);
    let sig = sign.sign(private_key, 'base64');

    // URL safe processing
    sig = sig.replace(/[+]/g, '-');
    sig = sig.replace(/[/]/g, '_');

    // Remove extra '='
    let sig_len = sig.length;
    let find_len = 0;
    let start_len = sig_len - 1;
    
    while (true) {
      if (sig.substr(start_len, 1) === "=") {
        find_len++;
        start_len--;
        continue;
      }
      break;
    }
    
    sig = sig.substr(0, sig_len - find_len);
    let signToBase64 = sig;
    signToBase64 += '$SHA256';
    
    return signToBase64;
  }
}

export default CashierSupport;
