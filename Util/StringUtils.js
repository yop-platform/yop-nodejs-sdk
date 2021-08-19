
class StringUtils{

    static isBlank(field)
    {

        if (field == '') {
            return false;
        } else {
            return true;
        }

    }
}
module.exports = StringUtils;