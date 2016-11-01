module.exports = function throttle(ms, callback) {
  var timer = 0;
  var lastCall = 0;

  return function () {
    var now = new Date().getTime();
    var diff = now - lastCall;

    if (diff >= ms) {
      lastCall = now;
      callback.apply(this, arguments);
    }
  };
};
