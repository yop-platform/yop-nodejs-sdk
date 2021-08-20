const GetUniqueId = require("./GetUniqueId");
const Crypto = require('crypto');
const MD5 = require('md5');
Date.prototype.Format = function (fmt) { //author: meizz
    var o = {
        "M+": this.getMonth() + 1,                 //月份
        "d+": this.getDate(),                    //日
        "h+": this.getHours(),                   //小时
        "m+": this.getMinutes(),                 //分
        "s+": this.getSeconds(),                 //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds()             //毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt))
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

class RsaV3Util {
    static getAuthHeaders(options, form) {
        const {appKey, method, url, params, secretKey} = options
        const timestamp = new Date().Format("yyyy-MM-ddThh:mm:ssZ");
        const authString = 'yop-auth-v3/' + appKey + "/" + timestamp + "/1800"
        const HTTPRequestMethod = method
        const CanonicalURI = url
        const CanonicalQueryString = RsaV3Util.getCanonicalQueryString(params);

        // v3 签名头，有序！！！
        const headers = {
            'x-yop-appkey': appKey,
            'x-yop-content-sha256': RsaV3Util.getSha256AndHexStr(form),
            'x-yop-request-id': RsaV3Util.uuid(),
        }
        const CanonicalHeaders = RsaV3Util.getCanonicalHeaders(headers)
        const CanonicalRequest =
            authString + "\n" +
            HTTPRequestMethod + "\n" +
            CanonicalURI + "\n" +
            CanonicalQueryString + "\n" +
            CanonicalHeaders
        const signedHeaders = 'x-yop-appkey;x-yop-content-sha256;x-yop-request-id'
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
        sign.update(CanonicalRequest);
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

        // 构造认证头
        headers.Authorization = "YOP-RSA2048-SHA256 " + authString + "/" +
            signedHeaders + "/" + signToBase64;
        return headers

    }

    static getCanonicalQueryString() {
        // todo 构造query参数串，有序
        return '';
    }

    static getCanonicalHeaders(headers) {
        let hArray = [];
        Object.keys(headers).forEach(key => {
            hArray.push(key + ':' + headers[key]);
        })
        return hArray.join('\n');
    }

    static uuid() {
        let char = GetUniqueId(24) + "" + new Date().getTime();
        char = MD5(char);
        let uuid = "";
        uuid += char.substr(0, 8) + '-';
        uuid += char.substr(8, 4) + '-';
        uuid += char.substr(12, 4) + '-';
        uuid += char.substr(16, 4) + '-';
        uuid += char.substr(20, 12);
        return uuid;
    }

    static getSha256AndHexStr() {
        // let sign = crypto.createHash('SHA256');
        // sign.update(data);
        // let sig = sign.digest('hex')
        // todo 其他类型请求，根据请求体计算
        // 文件上传，默认sha-256
        return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
    }
}

module.exports = RsaV3Util;