
class Base64Url{

    /**
     * @param string $data        The data to encode
     * @param bool   $use_padding If true, the "=" padding at end of the encoded value are kept, else it is removed
     *
     * @return string The data encoded
     */
    static encode(data, use_padding = false)
    {
        // $encoded = strtr(base64_encode($data), '+/', '-_');

        // return true === $use_padding ? $encoded : rtrim($encoded, '=');
    }

    /**
     * @param string $data The data to decode
     *
     * @return string The data decoded
     */
    static decode($data)
    {
        // return base64_decode(strtr($data, '-_', '+/'));
    }

}
module.exports = Base64Url;