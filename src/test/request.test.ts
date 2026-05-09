import { RsaV3Util } from '../index';
import axios from 'axios';
import { RequestOptions, RequestParams } from '../types';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const options: RequestOptions = {
  appKey: process.env.appKey, // 请替换为真实的 appKey
  secretKey: process.env.secretKey, // 请替换为真实的密钥
  serverRoot: process.env.serverRoot, // 请替换为真实的服务器根地址
  yopPublicKey: process.env.publicKey, // 请替换为真实的 YOP 公钥
  config: {
    contentType: 'application/x-www-form-urlencoded'
  }
};

function getData({ url, params = {}, method, responseType = 'json' }: RequestParams) {
  const authHeaders = RsaV3Util.getAuthHeaders({
    ...options,
    url,
    method,
    params
  });

  return axios.request({
    url: `${options.serverRoot}${url}?${RsaV3Util.getCanonicalParams(params, 'form-urlencoded')}`,
    headers: authHeaders,
    method,
    responseType,
  });
}

test('GET 数据正常返回', async () => {
  const res = await getData({
    url: '/rest/v3.0/auth/idcard',
    params: {
      request_flow_id: 'xxxx',
      name: 'xxx',
      id_card_number: '123456789012345',
    },
    method: 'GET'
  });

  expect(res.status).toBe(200);
  expect(res.data.state).toBe('SUCCESS');
});

test('POST 数据正常返回', async () => {
  const res = await getData({
    url: '/rest/v3.0/auth/idcard',
    params: {
      request_flow_id: 'xxxx',
      name: 'xxx',
      id_card_number: '123456789012345',
    },
    method: 'POST'
  });

  expect(res.status).toBe(200);
  expect(res.data.state).toBe('SUCCESS');
});
