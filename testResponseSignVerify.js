const YopRsaClient  =  require('./YopRsaClient')
// 示例：响应结果验签
const options = {
  data: '', // 接口返回的未经转换的res.data字符串
  sign: '',// 接口返回的签名，res.data.sign
};
const publicKey = ''; // YOP公钥
const result = YopRsaClient.isValidRsaResult(YopRsaClient.getResult(options.data), options.sign.replace('$SHA256', ''), publicKey);
console.log(result);