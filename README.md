# yop-nodejs-sdk

## 项目结构

```
├── CHANGELOG.md 版本变更
├── LICENSE
├── README.md
├── Util 工具目录
│   ├── GetUniqueId.js
│   ├── HttpUtils.js
│   ├── RsaV3Util.js rsa签名工具
│   ├── CashierSupport.js 收银台的签名算法
│   └── VerifyUtils.js 业务结果签名和商户通知进行校验
├── package-lock.json
├── package.json
└── test 示例代码
    ├── download.js 下载示例
    ├── notify.js 商户通知进行校验
    ├── request.js post、get请求示例
    ├── responseSignVerify.js 业务结果签名进行校验
    └── upload.js 文件上传示例

```
## 项目运行

```
npm install
node test/request.js
```
## 常见问题

#### 1、文件上传
问题：报错”上传文件 merQual 参数key没有指定！“
原因：上传的file文件为空，检查是否读取到本地的文件流

#### 2、响应结果验签
问题：为什么是接口返回的未经转换的res.data字符串
原因：JSON.parse会改变原有的Number类型精度，导致验签失败