const YopRsaClient  =  require('./YopRsaClient')
const YopRequest  =  require('./YopRequest')
const querystring = require('querystring')
const axios = require('axios')
const fs = require('fs')
const options = {
  appKey: '你的appKey', 
  secretKey: '你的私钥',
  serverRoot: 'http://ycetest.yeepay.com:30228/yop-center', 
  yopPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4g7dPL+CBeuzFmARI2GFjZpKODUROaMG+E6wdNfv5lhPqC3jjTIeljWU8AiruZLGRhl92QWcTjb3XonjaV6k9rf9adQtyv2FLS7bl2Vz2WgjJ0FJ5/qMaoXaT+oAgWFk2GypyvoIZsscsGpUStm6BxpWZpbPrGJR0N95un/130cQI9VCmfvgkkCaXt7TU1BbiYzkc8MDpLScGm/GUCB2wB5PclvOxvf5BR/zNVYywTEFmw2Jo0hIPPSWB5Yyf2mx950Fx8da56co/FxLdMwkDOO51Qg3fbaExQDVzTm8Odi++wVJEP1y34tlmpwFUVbAKIEbyyELmi/2S6GG0j9vNwIDAQAB',
}
const request = new YopRequest(options)
function getData({url, params, method} = {}) {
  Object.keys(params).forEach(key => {
    request.addParam(key, params[key]);
  })
  const options = YopRsaClient.post(url, request, method)
  return axios.request({
    url: options.serverUrl + '?' + querystring.stringify(options.encodedParamMap),
    headers: options.headers,
    responseType:'stream',
    method: method
  })
}

// 示例：文件下载
getData({
  url: '/rest/v1.0/test-wdc/test-param-parse/input-stream-result',
  params:{
    strParam: 'xxx',
  },
  method: 'GET'
})
.then(res => {
  console.log(res.data)
  res.data.pipe(fs.createWriteStream('ada_lovelace.txt'))
  console.log('res------>', res)
})
.catch(err => {
  console.log('err------>', err)
})