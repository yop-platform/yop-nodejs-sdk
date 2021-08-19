class YopConfig{
    constructor(){
        this.serverRoot="https://openapi.yeepay.com/yop-center";
        this.appKey = "";
        this.aesSecretKey = "";
        this.hmacSecretKey = "";
        this.connectTimeout = 30000;
        this.readTimeout = 60000;
        //加密算法
        this.ALG_AES = "AES";
        this.ALG_SHA1 = "SHA1";

        //保护参数
        this.CLIENT_VERSION = "1.3.0";
        this.ENCODING = "UTF-8";
        this.SUCCESS = "SUCCESS";
        this.CALLBACK = "callback";
        // 方法的默认参数名
        this.METHOD = "method";
        // 格式化默认参数名
        this.FORMAT = "format";
        // 本地化默认参数名
        this.LOCALE = "locale";
        // 会话id默认参数名
        this.SESSION_ID = "sessionId";
        // 应用键的默认参数名 ;
        this.APP_KEY = "appKey";
        // 服务版本号的默认参数名
        this.VERSION = "v";
        // 签名的默认参数名
        this.SIGN = "sign";
        // 返回结果是否签名
        this.SIGN_RETURN = "signRet";
        // 商户编号
        this.CUSTOMER_NO = "customerNo";
        // 加密报文key
        this.ENCRYPT = "encrypt";
        // 时间戳
        this.TIMESTAMP = "ts";
        this.publicED_KEY = {};

        this.publicED_KEY[this.APP_KEY]="";
        this.publicED_KEY[this.VERSION]="";
        this.publicED_KEY[this.SIGN]="";
        this.publicED_KEY[this.METHOD]="";
        this.publicED_KEY[this.FORMAT]="";
        this.publicED_KEY[this.LOCALE]="";
        this.publicED_KEY[this.SESSION_ID]="";
        this.publicED_KEY[this.CUSTOMER_NO]="";
        this.publicED_KEY[this.ENCRYPT]="";
        this.publicED_KEY[this.SIGN_RETURN]="";
        this.publicED_KEY[this.TIMESTAMP]="";
    }
    __set(name,value){
        this.aesSecretKey = value;
    }

    __get(name){
        return this.name;
    }
    getSecret(){
        if(!this.appKey){
            return this.aesSecretKey;
        }else{
            return this.hmacSecretKey;
        }
    }
    ispublicedKey(key){
        if(this.publicED_KEY[key]){
            return true;
        }
        return false;
    }

}

module.exports = YopConfig;