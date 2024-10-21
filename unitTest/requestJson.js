const RsaV3Util = require('../Util/RsaV3Util')
const axios = require('axios')
const { config, verifySign } = require('./config')
const options = {
  ...config,
  config: {
    contentType: 'application/json'
  }
}
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  verifySign(response, 'requestJson')
  return response;
}, function (error) {
  verifySign(error.response, 'requestJson')
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
  const requestParams = {
    url: options.serverRoot + url,
    headers: {
      ...authHeaders,
      'Content-Type': 'application/json',
      'Content-Length': JSON.stringify(params).length,
      'x-yop-sdk-version': '4.0.0'
    },
    method: method,
    responseType: responseType,
    transformResponse: [function (data) {
      // 接口返回的未转换的原文
      return data;
    }],
  }
  if (method === 'POST') {
    requestParams.data = params
  } else {
    requestParams.params = params
  }
  return axios.request(requestParams)
}
getData({
  url: '/rest/v1.0/lx-test/lx-postjson-new',
  params:{
    request_flow_id: 'xxxx',
    name: 'xxx',
    id_card_number: 'xxxx',
  },
  method: 'POST'
}).then(() => {}).catch(() => {})
