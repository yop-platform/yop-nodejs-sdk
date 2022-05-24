const YopRsaClient  =  require('./YopRsaClient')
// 示例：响应结果验签
const options = {
  result: {}, // 接口返回的result，res.data.result
  sign: '',// 接口返回的签名，res.data.sign
};
const publicKey = ''; // YOP公钥
const result = YopRsaClient.isValidRsaResult(JSON.stringify(options.result), options.sign.replace('$SHA256', ''), publicKey);
console.log(result);