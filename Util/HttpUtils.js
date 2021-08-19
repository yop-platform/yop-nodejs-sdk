
const urlencode = require('urlencode');
class HttpUtils{
    static normalizePath(path)
    {
        let tmp = this.normalize(path);
        return tmp.replace(/\%2F/g,"/");
    }

    /**
     * @param $value
     * @return string
     */
    static  normalize(value)
    {

        return urlencode(value);

    }

    static  startsWith(haystack, needle) {
        if(!needle){
            return true;
        }
        if(haystack.lastIndexOf(needle)>=0){
            return true;
        }else{
            return false;
        }
    }
    static  endsWith(haystack, needle) {
        if(!needle){
            return true;
        }
        let temp = (haystack.length-needle.length);
        let find = haystack.indexOf(needle,temp);
        if(temp>=0&&(temp>=0)){
            return true;
        }else{
            return false;
        }
    }

    /**
     * @param $path
     * @return string
     */
    static  getCanonicalURIPath(path)
    {
        if (!path) {
            return "/";
        } else if (this.startsWith(path,'/')) {
            return this.normalizePath(path);
        } else {
            return "/" + this.normalizePath(path);
        }
    }

}
module.exports = HttpUtils;