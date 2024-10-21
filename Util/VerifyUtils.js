const crypto = require('crypto');
const URLSafeBase64 = require('urlsafe-base64');
class VerifyUtils {
  /**
   * 对业务结果签名进行校验
   */
  static isValidRsaResult(params)
  {
    const result = params.data
    let sign = params.sign.replace('$SHA256', '')
    let public_key = params.publicKey
    let sb = "";
    if (!result) {
        sb = "";
    } else {
        sb += result.trim();
    }
    sb = sb.replace(/[\s]{2,}/g,"");
    sb = sb.replace(/\n/g,"");
    sb = sb.replace(/[\s]/g,"");

    let r = public_key+"";
    let a ="-----BEGIN PUBLIC KEY-----";
    let b = "-----END PUBLIC KEY-----";
    public_key = "";
    let len = r.length;
    let start = 0;
    while(start<=len){
        if(public_key.length){
            public_key += r.substr(start,64)+'\n';
        }else{
            public_key = r.substr(start,64)+'\n';
        }
        start +=64;
    }
    public_key = a+'\n'+public_key+b;

    let verify = crypto.createVerify('RSA-SHA256');
        verify.update(sb);
    sign = sign+"";
    // sign = sign.substr(0,-7);
    sign = sign.replace(/[-]/g,'+');
    sign = sign.replace(/[_]/g,'/');
    let res = verify.verify(public_key, sign, 'base64');
    return res;
  }
  static getResult(str) {
    console.log(str)
    return str.match(/"result"\s*:\s*({.*}),\s*"ts"/s)[1]
  }
  /**
     * 解密数字信封
     * @param {content} 返回的数字信封密文
     * @param {isv_private_key} 商户私钥
     * @param {yop_public_key} 易宝开放平台公钥
     * @return {status:'数字信封处理状态 成功（success）失败（failed）',result:'报文',message:'错误信息'}
     */
  static digital_envelope_handler (content,isv_private_key,yop_public_key){
    let event = {
        status: 'failed',
        result: '',
        message: ''
    }
    if(!content){
        event.message = '数字信封参数为空'
    }else if(!isv_private_key){
        event.message = '商户私钥参数为空'
    }else if(!yop_public_key){
        event.message = '易宝开放平台公钥参数为空'
    }else{
        try {
            let digital_envelope_arr = content.split('$');
            let encryted_key_safe = this.base64_safe_handler(digital_envelope_arr[0]);
            let decryted_key = this.rsaDecrypt(encryted_key_safe,this.key_format(isv_private_key));
            let biz_param_arr = this.aesDecrypt(this.base64_safe_handler(digital_envelope_arr[1]),decryted_key).split('$');
            const sign = biz_param_arr.pop()
            event.result = biz_param_arr.join('$')
            if(this.isValidNotifyResult(event.result, sign, yop_public_key)){
                event.status = 'success';
            }else{
                event.message = '验签失败';
            }
        } catch (error) {
            event.message = error;
        }
    }
    return event;
  }
  /**
     * 对商户通知签名进行校验
     */
  static isValidNotifyResult(result, sign,public_key)
  {
    let sb = "";
    if (!result) {
        sb = "";
    } else {
        sb += result;
    }
    let r = public_key+"";
    let a ="-----BEGIN PUBLIC KEY-----";
    let b = "-----END PUBLIC KEY-----";
    public_key = "";
    let len = r.length;
    let start = 0;
    while(start<=len){
        if(public_key.length){
            public_key += r.substr(start,64)+'\n';
        }else{
            public_key = r.substr(start,64)+'\n';
        }
        start +=64;
    }
    public_key = a+'\n'+public_key+b;

    let verify = crypto.createVerify('RSA-SHA256');
        verify.update(sb);
    sign = sign+"";
    // sign = sign.substr(0,-7);
    sign = sign.replace(/[-]/g,'+');
    sign = sign.replace(/[_]/g,'/');
    let res = verify.verify(public_key, sign, 'base64');
    return res;
  }
  /**
   * 数据非安全化还原
   * @param {data} 需要还原的数据
   */
    static base64_safe_handler (data) {
    return URLSafeBase64.decode(data).toString('base64');
  }

  /**
   * 私钥header添加
   * @param {key} 不包含header的私钥
   */
  static key_format (key) {
      return '-----BEGIN PRIVATE KEY-----\n'+key+'\n-----END PRIVATE KEY-----';
  }
  /**
   * 非对称密钥解密
   * @param {content} 已加密的数据内容
   * @param {privateKey} 私钥
   */
  static rsaDecrypt(content,privateKey) {
      let block = Buffer.from(content,'base64')
      let decodeData = crypto.privateDecrypt(
          {
              key: privateKey,
              padding: crypto.constants.RSA_PKCS1_PADDING
          },
          block
      );
      return decodeData;
  }

  /**
   * 对称密钥解密
   * @param {encrypted} 已加密的数据内容
   * @param {key} 密钥
   */
  static aesDecrypt(encrypted, key) {
      const decipher = crypto.createDecipheriv('aes-128-ecb', key,Buffer.alloc(0));
      let decrypted = decipher.update(encrypted, 'base64', 'utf8');
      decrypted += decipher.final('utf8');
      return decrypted;
  }

  static  getBizResult(content, format)
  {
      if(!format){
          return content;
      }
      switch(format){
          case "json":

      }
      let local = -1;
      let result="";
      let tmp_result= "";
      let length = 0;
      switch (format) {
          case 'json':
              local = content.indexOf('"result"');
              result = content.substr(local);
              length = tmp_result.length;
              result = result.substr(length+3);
              result = result.substr(0,result.lastIndexOf('"ts"'));
              result = result.substr(0,result.length-4);
              return result;
          default:
              local = content.indexOf('"</state>"');
              result = content.substr(local);
              tmp_result = '</state>';
              length = tmp_result.length;
              result = result.substr(length+4);
              result = result.substr(0,result.lastIndexOf('"ts"'));
              result = result.substr(0,-2);
              return result;
      }
  }
}
module.exports = VerifyUtils;