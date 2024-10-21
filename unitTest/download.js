const RsaV3Util = require('../Util/RsaV3Util')
const axios = require('axios')
const fs = require('fs')
const { config } = require('./config')
const options = {
  ...config,
  config: {
    contentType: 'application/x-www-form-urlencoded'
  }
}
function getData({url, params, method, responseType = 'json'} = {}) {
  const authHeaders = RsaV3Util.getAuthHeaders({
    ...options,
    url,
    method,
    params
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
// 示例：文件下载
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
  console.log('download: true')
})
.catch(() => {
  console.log('err------>', err)
})