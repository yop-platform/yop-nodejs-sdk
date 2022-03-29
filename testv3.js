const querystring = require('querystring')
const RsaV3Util = require('./Util/RsaV3Util')
const axios = require('axios')
const fs = require('fs')
const options = {
  appKey: '你的appKey',
  secretKey: '你的私钥',
  serverRoot: 'http://ycetest.yeepay.com:30228/yop-center', 
  yopPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4g7dPL+CBeuzFmARI2GFjZpKODUROaMG+E6wdNfv5lhPqC3jjTIeljWU8AiruZLGRhl92QWcTjb3XonjaV6k9rf9adQtyv2FLS7bl2Vz2WgjJ0FJ5/qMaoXaT+oAgWFk2GypyvoIZsscsGpUStm6BxpWZpbPrGJR0N95un/130cQI9VCmfvgkkCaXt7TU1BbiYzkc8MDpLScGm/GUCB2wB5PclvOxvf5BR/zNVYywTEFmw2Jo0hIPPSWB5Yyf2mx950Fx8da56co/FxLdMwkDOO51Qg3fbaExQDVzTm8Odi++wVJEP1y34tlmpwFUVbAKIEbyyELmi/2S6GG0j9vNwIDAQAB',
}
function getData({url, params, method, responseType = 'json'} = {}) {
  const authHeaders = RsaV3Util.getAuthHeaders({
    ...options,
    url,
    method,
    params
  });
  return axios.request({
    url: options.serverRoot + url + '?' + querystring.stringify(params),
    headers: authHeaders,
    method: method,
    responseType: responseType,
  })
}
getData({
  url: '/rest/v3.0/auth/idcard',
  params:{
    request_flow_id: 'xxxx',
    name: 'xxx',
    id_card_number: 'xxxx',
  },
  method: 'POST'
})
.then(res => {
  console.log('res------>', res.data)
})
.catch(err => {
  console.log('err------>', err)
})
getData({
  url: '/rest/v3.0/auth/idcard',
  params:{
    request_flow_id: 'xxxx',
    name: 'xxx',
    id_card_number: 'xxxx',
  },
  method: 'GET'
})
.then(res => {
  console.log('res------>', res.data)
})
.catch(err => {
  console.log('err------>', err)
})

getData({
  url: '/rest/v1.0/test-wdc/test-param-parse/input-stream-result',
  params:{
    strParam: 'xxxxx',
  },
  responseType: 'stream',
  method: 'GET'
})
.then(res => {
  res.data.pipe(fs.createWriteStream('test.txt'))
  console.log(res.data)
})
.catch(err => {
  console.log('err------>', err)
})