
class YopResponse{

    constructor(){
        /**
         * 状态(SUCCESS/FAILURE)
         */
        this.state="";

        /**
         * 业务结果，非简单类型解析后为LinkedHashMap
         */

        this.result="";

        /**
         * 时间戳
         */
        this.ts="";

        /**
         * 结果签名，签名算法为Request指定算法，示例：SHA(<secret>stringResult<secret>)
         */
        this.sign="";

        /**
         * 错误信息
         */
        this.error="";

        /**
         * 字符串形式的业务结果
         */
        this.stringResult="";

        /**
         * 响应格式，冗余字段，跟Request的format相同，用于解析结果
         */
        this.format="";

        /**
         * 业务结果签名是否合法，冗余字段
         */
        this.validSign="";

        this.verSign="";
    }

    


    __set(name, value){
        // TODO: Implement __set() method.
        this.name = value;

    }
    __get(name){
        // TODO: Implement __get() method.
        return this.name;
    }

}

module.exports = YopResponse;