const HTTP = require('https');
const FS = require('fs');
const path = require('path');
const FormData = require('form-data');
const RsaV3Util = require('../Util/RsaV3Util');
const { config, verifySign } = require('./config')
// 模拟表单
const form = new FormData();
form.append('merQual', FS.createReadStream(path.resolve(__dirname, '../README.md')));
const headers = form.getHeaders();

// 计算、添加认证相关header
const options = {
  ...config,
  url: '/yos/v1.0/sys/merchant/qual/upload',
  method: 'POST',
  config: {
    contentType: 'application/form'
  },
};
const authHeaders = RsaV3Util.getAuthHeaders(options);
for (let diyHeadersKey in authHeaders) {
    headers[diyHeadersKey] = authHeaders[diyHeadersKey];
}

// 发起请求
const request = HTTP.request({
    method: 'post',
    host: 'sandbox.yeepay.com',
    path: '/yop-center/yos/v1.0/sys/merchant/qual/upload',
    headers: {
      ...headers,
      'x-yop-sdk-version': '4.0.0'
    },
}, (res) => {
    const {statusCode} = res;
    const contentType = res.headers['content-type'];

    let error;
    if (statusCode !== 200) {
        error = new Error('Request Failed.\n' +
            `Status Code: ${statusCode}`);
    } else if (!/^application\/json/.test(contentType)) {
        error = new Error('Invalid content-type.\n' +
            `Expected application/json but received ${contentType}`);
    }
    if (error) {
        console.error(error.message);
        // 消费响应数据以释放内存
        res.resume();
        return;
    }

    res.setEncoding('utf8');
    let rawData = '';
    res.on('data', (chunk) => {
        rawData += chunk;
    });
    res.on('end', () => {
      try {
            const index = res.rawHeaders.findIndex(e => e === 'x-yop-sign')
            verifySign(
              {
                data: rawData,
                headers: {
                  'x-yop-sign': res.rawHeaders[index + 1],
                }
              },
             'upload'
            )
            // const parsedData = JSON.parse(rawData);
            // console.log(parsedData);
        } catch (e) {
            console.error(e.message);
        }
    });
}).on('error', (e) => {
    console.error(`Got error: ${e.message}`);
});
form.pipe(request);