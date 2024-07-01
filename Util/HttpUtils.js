
const urlencode = require('urlencode');
class HttpUtils{
    static normalizePath(path)
    {
        let tmp = urlencode(path);
        return tmp.replace(/%2F/g,"/");
    }

    /**
     * @param value
     * @return string
     */
    static  normalize(value)
    {
        let vStr = "";
        if (value) {
            let bytes =  Buffer.from(value.toString(), 'utf-8')
            for (let i = 0; i < bytes.length; i++) {
                let byte = bytes[i];
                let s = String.fromCharCode(byte);
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
     * str转bytes(UTF-8编码)
     * @param str
     * @returns {any[]}
     */
    static stringToByte(str) {
        let bytes = [];
        let len, c;
        len = str.length;
        for (let i = 0; i < len; i++) {
            c = str.charCodeAt(i);
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
     * @param req
     * @return type
     */
    static  encodeParams(req) {
        let encoded = {};
        for (let k in req.paramMap) {
            let v = req.paramMap[k];
            encoded[this.normalize(k)] = this.normalize(v);
        }
        return encoded;
    }

    static  startsWith(haystack, needle) {
        if(!needle){
            return true;
        }
        if(haystack.lastIndexOf(needle)>=0){
            return true;
        }else{
            return false;
        }
    }
    static  endsWith(haystack, needle) {
        if(!needle){
            return true;
        }
        let temp = (haystack.length-needle.length);
        if(temp>=0&&(temp>=0)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * @param $path
     * @return string
     */
    static  getCanonicalURIPath(path)
    {
        if (!path) {
            return "/";
        } else if (this.startsWith(path,'/')) {
            return this.normalizePath(path);
        } else {
            return "/" + this.normalizePath(path);
        }
    }

}
module.exports = HttpUtils;