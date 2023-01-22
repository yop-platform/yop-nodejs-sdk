const HTTP = require('http');
const Querystring = require('querystring')
const RsaV3Util = require('../Util/RsaV3Util');


// 模拟表单
const options = {
  url: '',                  // 请求路径
  params: {},               // 请求参数
  config: {
    host: '',               // 请求域名
    port: '',               // 请求端口
    path: '',               // 请求完成路径
    contentType: 'application/json'
  },
  method: '',               // 请求方式
  appKey: '',               // 你的appKey
  secretKey: '',            // 你的私钥
  serverRoot: '',           // 公网地址
  yopPublicKey: '',         // YOP公钥
}
// post请求
const getDatePost = function (options) {
  const { params, config } = options
  const authHeaders = RsaV3Util.getAuthHeaders(options);
  const content = JSON.stringify(params)
  const request = HTTP.request({
    method: 'post',
    host: config.host,
    port: config.port,
    path: config.path,
    headers: {
      'Content-Type': config.contentType,
      'Content-Length': content.length,
      ...authHeaders

    }
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
              const parsedData = JSON.parse(rawData);
              console.log(parsedData);
          } catch (e) {
              console.error(e.message);
          }
      });
  }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
  });
  request.write(content);  
  request.end(); 
}
// getDatePost(options)
// get请求
const getDateGet = function (options) {
  const { params, config } = options
  const authHeaders = RsaV3Util.getAuthHeaders(options);
  const content = Querystring.stringify(params)
  const request = HTTP.request({
    method: 'get',
    host: config.host,
    port: config.port,
    path: config.path + '?' + content,
    headers: {
      'Content-Type': config.contentType,
      ...authHeaders

    }
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
              const parsedData = JSON.parse(rawData);
              console.log(parsedData);
          } catch (e) {
              console.error(e.message);
          }
      });
  }).on('error', (e) => {
      console.error(`Got error: ${e.message}`);
  });
  request.end();
}
getDateGet(options)