const RsaV3Util = require('../Util/RsaV3Util')
const axios = require('axios')
const { config, verifySign } = require('./config')
const options = {
  ...config,
  config: {
    contentType: 'application/x-www-form-urlencoded'
  }
}
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  verifySign(response, 'request')
  return response;
}, function (error) {
  verifySign(error.response, 'request')
  // 对响应错误做点什么
  return Promise.reject(error);
});
function getData({url, params, method, responseType = 'json'} = {}) {
  const authHeaders = RsaV3Util.getAuthHeaders({
    ...options,
    url,
    method,
    params,
  });
  return axios.request({
    url: options.serverRoot + url + '?' + RsaV3Util.getCanonicalParams(params, 'form-urlencoded'),
    headers: {
      ...authHeaders,
      'x-yop-sdk-version': '4.0.0'
    },
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
}).then(() => {}).catch(() => {})
getData({
  url: '/rest/v3.0/auth/idcard',
  params:{
    request_flow_id: 'xxxx',
    name: 'xxx',
    id_card_number: 'xxxx',
  },
  method: 'GET'
}).then(() => {}).catch(() => {})
