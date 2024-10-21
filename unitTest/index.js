
const { fork } = require('child_process')
const path = require('path');
// 要执行的文件路径
const download =  path.resolve(__dirname,  './download.js');
const request =  path.resolve(__dirname,  './request.js');
const requestJson =  path.resolve(__dirname,  './requestJson.js');
const upload =  path.resolve(__dirname,  './upload.js');
fork(request)
fork(download)
fork(requestJson)
fork(upload)