const VerifyUtils  =  require('../Util/VerifyUtils')
// 示例：响应结果验签
const options = {
  data: '', // 接口返回的未经转换的res.data字符串
  sign: '',// 接口返回的签名，res.data.sign
  publicKey: '', // YOP公钥
};
const result = VerifyUtils.isValidRsaResult(options);
console.log(result);