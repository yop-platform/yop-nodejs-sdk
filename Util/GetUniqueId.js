function getUniqueId(n) {
  var str = "abcdefghijklmnopqrstuvwxyz0123456789"; // 可以作为常量放到random外面
  var result = "";
  for(var i = 0; i < n; i++) {
      result += str[parseInt(Math.random() * str.length)];
  }
  return result;
}

module.exports = getUniqueId