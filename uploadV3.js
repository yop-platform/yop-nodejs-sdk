const HTTP = require('https');
const FS = require('fs');
const FormData = require('form-data');
const RsaV3Util = require('./Util/RsaV3Util');

// 模拟表单
const form = new FormData();
form.append('merQual', FS.createReadStream('./README.md'));
const headers = form.getHeaders();

// 计算、添加认证相关header
const options = {
    appKey: '你的appKey',
    url: '/yos/v1.0/sys/merchant/qual/upload',
    method: 'POST',
    secretKey: '你的私钥',
    serverRoot: 'https://yos.yeepay.com/yop-center',
    yopPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6p0XWjscY+gsyqKRhw9MeLsEmhFdBRhT2emOck/F1Omw38ZWhJxh9kDfs5HzFJMrVozgU+SJFDONxs8UB0wMILKRmqfLcfClG9MyCNuJkkfm0HFQv1hRGdOvZPXj3Bckuwa7FrEXBRYUhK7vJ40afumspthmse6bs6mZxNn/mALZ2X07uznOrrc2rk41Y2HftduxZw6T4EmtWuN2x4CZ8gwSyPAW5ZzZJLQ6tZDojBK4GZTAGhnn3bg5bBsBlw2+FLkCQBuDsJVsFPiGh/b6K/+zGTvWyUcu+LUj2MejYQELDO3i2vQXVDk7lVi2/TcUYefvIcssnzsfCfjaorxsuwIDAQAB',
};
const authHeaders = RsaV3Util.getAuthHeaders(options, form);
for (let diyHeadersKey in authHeaders) {
    headers[diyHeadersKey] = authHeaders[diyHeadersKey];
}

// 发起请求
const request = HTTP.request({
    method: 'post',
    host: 'yos.yeepay.com',
    path: '/yop-center/yos/v1.0/sys/merchant/qual/upload',
    headers: headers
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
form.pipe(request);