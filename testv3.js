const querystring = require('querystring')
const RsaV3Util = require('./Util/RsaV3Util')
const axios = require('axios')
const fs = require('fs')
const options = {
  appKey: 'app_100800095600031',
  secretKey: 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDJvpvNBByNR/i8Uys1uSJJd9ly3lXBQQxcQIiC+sVDtN8Ejo/g5/k9RGoDplXKnzDQ9pNWpcY9GnYgIbFMKIwUqjGaKCTC4/fGZvt4ugqJaDQKeVQsOIs+475DoCi0X7yC0lk8Z8o+C6HqWghq4aiap1WUYameBy2hPxinX0uWisocZ7np/s01z5jE9afv4Agbq/RLv14YQ0LDVFrsKHjNo4XYe6IR3Wynt28WMa9Gs0Y6WXKhgH58KvksrJX0+TztRbbHnCt3DZ74seaxn+bo9UL8K0Q2T3d02qK0bGBIoZkTLWjzaVVacs7xQ0nXU33BaQ600sXi4y54o/HWlUaBAgMBAAECggEAYoGvkWtwhYue6FWzw4eiNj1O78egF7yrTGA2R74qk+S9AHybxDWAfWnqWd3eBhG0xFOhna1UHoHNK+NHrugdffmcPqlbSc4GLdoa79fnTTCUOIkFkJILa6nIPTz2oxwb78TFzbjgB2umo8dSVN3adak/IDSPnZnjrdghMZhWUCqWllI8/33IeWRu3JUeLSeuGvlU8xF5j1ALXXIyleNjep4HPC/+NNE20kWRQS70ffagYG7NuZA0OQSam1n70+2VNmGYoGSd5LcAlUy4/U7Jh525Wx0vjovoR8AGrAUuTsc/blg1fvYusr3Z7stS7vmPTWcfCYVJ49gOHE4YGfb0AQKBgQDj6b+XdVVjY6XcyVFKCbarlJgbhh9rjGECx2DAlnSmQ+67+IQNpAg8txZ3NykrkjXMZIIOrEugsBp86jrjRI7lF4eI2nWqpe4T7ZNEOKMRRXxT1ediYDLr1PAszx/l0/P4Ro3xubtOjOtzx+xKcGASb34c0Hft99uzOYhmVpvErwKBgQDim0pItsBjv18sGlSJZqBweXM1Frmz0fNxy9fTnTTmRA/o5atWLrvACkH2yxBG7gBOIX71CvurCQy+kFwCMZ6//sbDahm3hrdPCoBP9dp5z7POcFMoJHvZzaxkpbdGlYegXt2km6JltRu8FZX1uEJH77C7vi0ewcwzqN2viAvTzwKBgAi2IY2ffYEMCQX0Z/gFgQbz6hB7Qu4wcnDRwB/8YD8Or6xdpmaDE5GGigRKhndU4luKp/H5ofZlZM3Lgi63qyKUkKipeP/p0bzPQubDp2/8kPD/ZxW6iZe8DuYXkKePP28I+1n2+HLbLhDB3oVF4FY0DsT5LuxYofwqwczvmIqfAoGBAIno8muQdUP/et9vYtWAVNI+x8OeggQTGXK/GSnbeg9NitU1uXGo3XDBjWWyLcTNIfhq4EYnmgR8bHophyV6p1+3oaXaE66i2TrMbEy9lmod4xMXPzSmB44FYw6Z4BGf/Tu3oHKGmW4Gq8tq46n4qrX3BPstgW4/iZRDCC/Ev1X3AoGAZjYOhhnRbxMo/ZuCuTdgqkKk/iOiZRByPhdntvXoGuu3eWsf6LNImDm7LJdLj/nSZhhh1JnKNs3bvvzCjNv0OnxcHTqLufCpTzsh7fOTCAH1YN8qcAdGLUaKDq9w/WnfOsezViCZSwvrSybV0nND+sYEoc+DPluG97isqHjq9ys=',
  serverRoot: 'http://ycetest.yeepay.com:30228/yop-center', 
  yopPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA4g7dPL+CBeuzFmARI2GFjZpKODUROaMG+E6wdNfv5lhPqC3jjTIeljWU8AiruZLGRhl92QWcTjb3XonjaV6k9rf9adQtyv2FLS7bl2Vz2WgjJ0FJ5/qMaoXaT+oAgWFk2GypyvoIZsscsGpUStm6BxpWZpbPrGJR0N95un/130cQI9VCmfvgkkCaXt7TU1BbiYzkc8MDpLScGm/GUCB2wB5PclvOxvf5BR/zNVYywTEFmw2Jo0hIPPSWB5Yyf2mx950Fx8da56co/FxLdMwkDOO51Qg3fbaExQDVzTm8Odi++wVJEP1y34tlmpwFUVbAKIEbyyELmi/2S6GG0j9vNwIDAQAB',
}
function getData({url, params, method, responseType = 'json'} = {}) {
  const authHeaders = RsaV3Util.getAuthHeaders({
    ...options,
    url,
    method,
    params
  });
  return axios.request({
    url: options.serverRoot + url + '?' + querystring.stringify(params),
    headers: authHeaders,
    method: method,
    responseType: responseType,
  })
}
getData({
  url: '/rest/v3.0/auth/idcard',
  params:{
    request_flow_id: 'test123456',
    name: '张文康',
    id_card_number: '370982199101186691',
  },
  method: 'POST'
})
.then(res => {
  console.log('res------>', res.data)
})
.catch(err => {
  console.log('err------>', err)
})
getData({
  url: '/rest/v3.0/auth/idcard',
  params:{
    request_flow_id: 'test123456',
    name: '张文康',
    id_card_number: '370982199101186691',
  },
  method: 'GET'
})
.then(res => {
  console.log('res------>', res.data)
})
.catch(err => {
  console.log('err------>', err)
})

getData({
  url: '/rest/v1.0/test-wdc/test-param-parse/input-stream-result',
  params:{
    strParam: '张文康',
  },
  responseType: 'stream',
  method: 'GET'
})
.then(res => {
  res.data.pipe(fs.createWriteStream('ada_lovelace.txt'))
  console.log(res.data)
})
.catch(err => {
  console.log('err------>', err)
})