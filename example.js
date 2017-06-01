require('./').install({
  scheduleMeasurement: function (fn) {
    setTimeout(fn, 0);
  },
  scheduleMutation: function (fn) {
    window.requestAnimationFrame(fn);
  }
});
