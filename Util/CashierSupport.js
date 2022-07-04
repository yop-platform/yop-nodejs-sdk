
const Crypto = require('crypto');
const HttpUtils = require('./HttpUtils');
class CashierSupport {
    constructor() {
      this.CASHIER_URL = "https://cash.yeepay.com/cashier/std"
    }
    /**
     * @param $params
     * @return string
     */
    static getPayUrl(privateKey, appKey, merchantNo, token) {
      const params = {
        appKey,
        merchantNo, //系统商商编
        token, //token 调创建订单接口获取
        timestamp: '',//时间戳
        directPayType: '', //直联编码
        cardType: '', //卡类型只适用于银行卡快捷支付
        userNo: '', //用户标识银行卡快捷支付用于记录绑卡
        userType: 'USER_ID' //用户标识类型
      }
      const str = this.getCanonicalParams(params)
      const sign = this.signature(privateKey, str)
      return this.CASHIER_URL + "?sign=" + sign + "&" + str;
    }
    /**
     * @param $params
     * @return string
     */
    static getCanonicalParams(params={})
     {
        let paramStrings = [];
        for(let key in params){
            let value = params[key];
            if(!key){
                continue;
            }
            if(!value){
                value = "";
            }
            key = key.trim();
            key = HttpUtils.normalize(key);
            value = HttpUtils.normalize(value.trim());
            paramStrings.push(key + '=' + value);
        }
        paramStrings.sort();
        let StrQuery = "";
        for(let i in paramStrings){
            let kv = paramStrings[i];
            StrQuery += StrQuery.length ==0 ?"":"&";
            StrQuery += kv;
        }
        return StrQuery;
    }
    static signature(secretKey, str) {
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
        let sign = Crypto.createSign('RSA-SHA256');
        sign.update(str);
        let sig = sign.sign(private_key, 'base64');

        // url安全处理
        sig = sig.replace(/[+]/g, '-');
        sig = sig.replace(/[/]/g, '_');

        // 去掉多余'='
        let sig_len = sig.length;
        let find_len = 0;
        let start_len = sig_len - 1;
        /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
        while (1) {
            if (sig.substr(start_len, 1) == "=") {
                find_len++;
                start_len--;
                continue;
            }
            break;
        }
        sig = sig.substr(0, sig_len - find_len);
        let signToBase64 = sig;
        signToBase64 += '$SHA256';
        return signToBase64
    }
}

module.exports = CashierSupport;