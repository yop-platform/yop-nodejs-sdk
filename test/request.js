const querystring = require('querystring')
const RsaV3Util = require('../Util/RsaV3Util')
const axios = require('axios')
const options = {
  appKey: '你的appKey',
  secretKey: '你的私钥',
  serverRoot: 'xxx',  // 公网地址
  yopPublicKey: 'xxxx', // YOP公钥
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
    transformResponse: [function (data) {
      // 接口返回的未转换的原文
      return data;
    }],
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
