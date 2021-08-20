
const YopConfig = require("./YopConfig");
const urlencode = require('urlencode');
class YopRequest{
    constructor({appKey = '', secretKey, serverRoot = '', yopPublicKey = null} = {}){
        this.Config=null;

        this.format = 'json';
        this.method=null;
        this.locale = "zh_CN";
        this.version = "1.0";
        this.ImagePath = '';
        this.signAlg=null;
        /**
         * 商户编号，易宝商户可不注册开放应用(获取appKey)也可直接调用API
         */
        this.customerNo=null;
        this.paramMap = {};
        this.ignoreSignParams = {'sign':''};
        /**
         * 报文是否加密，如果请求加密，则响应也加密，需做解密处理
         */
        this.encrypt = false;
        /**
         * 业务结果是否签名，默认不签名
         */
        this.signRet = false;
        /**
         * 连接超时时间
         */
        this.connectTimeout = 30000;
        /**
         * 读取返回结果超时
         */
        this.readTimeout = 60000;
        /**
         * 临时变量，避免多次判断
         */
        this.isRest = true;
        /**
         * 可支持不同请求使用不同的appKey及secretKey
         */
        this.appKey=null;
        /**
         * 可支持不同请求使用不同的appKey及secretKey,secretKey只用于本地签名，不会被提交
         */
        this.secretKey=null;
        /**
         * 可支持不同请求使用不同的appKey及secretKey、serverRoot,secretKey只用于本地签名，不会被提交
         */
        this.yopPublicKey=null;
        /**
         * 可支持不同请求使用不同的appKey及secretKey、serverRoot,secretKey只用于本地签名，不会被提交
         */
        this.serverRoot=null;
        /**
         * 临时变量，请求绝对路径
         */
        this.absoluteURL=null;
        //定义构造函数
        this.Config = new YopConfig();
        this.signAlg = this.Config.ALG_SHA1;
        if(appKey){
            this.appKey = appKey;
        }else{
            this.appKey = this.Config.appKey;
        }
        if(secretKey){
            this.secretKey = secretKey;
        }else{
            this.secretKey = this.Config.getSecret();
        }
        if(yopPublicKey){
            this.yopPublicKey = yopPublicKey;
        }else{
            this.yopPublicKey = this.Config.getSecret();
        }
        if(serverRoot){
            this.serverRoot = serverRoot;
        }else{
            this.serverRoot = this.Config.serverRoot;
        }
        //初始化数组
        this.paramMap[this.Config.APP_KEY] = this.appKey;
        //this.paramMap[this.Config.FORMAT] = this.format;
        this.paramMap[this.Config.VERSION] = this.version;
        this.paramMap[this.Config.LOCALE] = this.locale;
        this.paramMap[this.Config.TIMESTAMP] = 123456;
    }
    __set(name, value)
    {
        // TODO: Implement __set() method.
        this.name = value;
    }

    // eslint-disable-next-line no-unused-vars
    __get(name)
    {
        // TODO: Implement __get() method.
        return this.name;
    }

    /**
     * 格式
     * @param string format 设置格式:xml 或者 json
     */
    setFormat(format)
    {
        if (!format) {
            this.format = format;
            this.paramMap[this.Config.FORMAT] = this.format;
        }
    }

    setSignRet(signRet)
    {
        const signRetStr = signRet ? 'true' : 'false';
        this.signRet = signRet;
        this.addParam(this.Config.SIGN_RETURN, signRetStr);
    }

    setEncrypt(encrypt)
    {
        this.encrypt = encrypt;
    }

    setSignAlg(signAlg)
    {
        this.signAlg = signAlg;
    }

    setLocale(locale)
    {
        this.locale = locale;
        this.paramMap[this.Config.LOCALE] = this.locale;
    }


    setVersion(version)
    {
        this.version = version;
        this.paramMap[this.Config.VERSION] = this.version;

    }

    setMethod(method)
    {
        this.method = method;
        //this.Config.METHOD = this.method;
        this.paramMap[this.Config.METHOD] = this.method;
    }

    addParam(key, values, ignoreSign = false)
    {
        if(!values){
            return;
        }
        if (ignoreSign) {
            this.ignoreSignParams[key] = values;
        }
        this.paramMap[key] = values;
    }

    removeParam(key)
    {
        for(let k in this.paramMap){
            if(key == k){
                delete(this.paramMap[k]);
            }
        }

    }

    getParam(key)
    {
        return this.paramMap[key];
    }

    encoding()
    {
        for(let k in this.paramMap){
            let v = this.paramMap[k];
            this.paramMap[k] =urlencode(v);
        }
    }

    /**
     * 将参数转换成k=v拼接的形式
     *
     *
     */
    toQueryString()
    {
        let StrQuery = "";
        for(let k in this.paramMap){
            let v = this.paramMap[k];
            StrQuery += StrQuery?"&":"";
            StrQuery += k + "=" + urlencode(v);
        }
        return StrQuery;
    }

}

module.exports = YopRequest;
