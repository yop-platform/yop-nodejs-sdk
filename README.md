# yop-nodejs-sdk (TypeScript)

## 项目结构

```bash
├── CHANGELOG.md 版本变更
├── LICENSE
├── README.md
├── src/ TypeScript 源代码目录
│   ├── Util/ 工具目录
│   │   ├── GetUniqueId.ts
│   │   ├── HttpUtils.ts
│   │   ├── RsaV3Util.ts          //rsa签名工具
│   │   ├── CashierSupport.ts     //收银台的签名算法
│   │   └── VerifyUtils.ts        //业务结果签名和商户通知进行校验
│   ├── test/ 示例代码
│   │   └── request.ts            //请求示例
│   ├── types.ts                  //类型定义
│   └── index.ts                  //入口文件
├── dist/ 编译后的 JavaScript 代码 (自动生成)
├── tsconfig.json                 //TypeScript 配置
├── jest.config.js               //Jest 测试配置
├── package-lock.json
└── package.json
```

## 安装依赖

```bash
npm install
```

## 构建项目

```bash
npm run build
```

## 开发模式

```bash
npm run dev
```

## 运行示例

```bash
npm start
```

## 运行测试

```bash
npm test
```

## 在你的项目中使用

### 安装

```bash
npm install yop-nodejs-sdk
```

### 使用示例 (TypeScript)

```typescript
import { RsaV3Util } from 'yop-nodejs-sdk';

// 配置选项
const options = {
  appKey: '你的appKey',
  secretKey: '你的私钥',
  serverRoot: 'xxx',  // 公网地址
  yopPublicKey: 'xxxx', // YOP公钥
  config: {
    contentType: 'application/x-www-form-urlencoded'
  }
};

// 获取认证头
const authHeaders = RsaV3Util.getAuthHeaders({
  ...options,
  url: '/rest/v3.0/auth/idcard',
  method: 'POST',
  params: {
    request_flow_id: 'xxxx',
    name: 'xxx',
    id_card_number: 'xxxx',
  }
});

console.log(authHeaders);
```

## 常见问题

### 1、文件上传

问题：报错”上传文件 merQual 参数key没有指定！“
原因：上传的file文件为空，检查是否读取到本地的文件流

### 2、响应结果验签

问题：为什么是接口返回的未经转换的res.data字符串
原因：JSON.parse会改变原有的Number类型精度，导致验签失败
