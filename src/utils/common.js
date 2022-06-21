

// 时间戳转换为YYYY-MM-dd HH:mm:ss
export function formatterTime(timestamp) {
  var timestamp = new Date(timestamp * 1000);
  var year = 1900 + timestamp.getYear();
  var month = "0" + (timestamp.getMonth() + 1);
  var date = "0" + timestamp.getDate();
  var hour = "0" + timestamp.getHours();
  var minute = "0" + timestamp.getMinutes();
  var second = "0" + timestamp.getSeconds();
  return year + "-" + month.substring(month.length - 2, month.length) + "-" + date.substring(date.length - 2, date.length)
    + " " + hour.substring(hour.length - 2, hour.length) + ":"
    + minute.substring(minute.length - 2, minute.length) + ":"
    + second.substring(second.length - 2, second.length);
}

