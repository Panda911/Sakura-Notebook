exports.getTime = function() {
  var hardwareTime = process.hrtime();
  var micros = (hardwareTime[0] * 1000000 + hardwareTime[1]);
  return micros;
}

exports.sortData = function(data, prop) {
  return new Map([...data.entries()].sort((a, b) => a[1][prop] >= b[1][prop]));
}

exports.escape = function(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};
