var size = {};
var willMutate;
var rootElement;
var measure;
var mutate;

function invoke(fn) {
  fn();
}

function measureTask() {
  var nextSize = {
    w: rootElement.clientWidth,
    h: rootElement.clientHeight
  };

  if (nextSize.w !== size.w || nextSize.h !== size.h) {
    size = nextSize;
    willMutate = true;
    mutate(mutateTask);
  }
}

function mutateTask() {
  rootElement.style.setProperty('--rw', size.w + 'px');
  rootElement.style.setProperty('--rh', size.h + 'px');
  rootElement.style.setProperty('--rmax', Math.max(size.w, size.h) + 'px');
  rootElement.style.setProperty('--rmin', Math.min(size.w, size.h) + 'px');
  willMutate = false;
}

function invalidateSize() {
  if (!willMutate) {
    measure(measureTask);
  }
}

function install(options) {
  if (rootElement) {
    return;
  }

  if (!(rootElement = document.documentElement)) {
    return setTimeout(install, 50, options);
  }

  options = Object(options);
  measure = options.measure || window.requestAnimationFrame;
  mutate = options.mutate || invoke;
  window.addEventListener('resize', invalidateSize);
  window.addEventListener('orientationchange', invalidateSize);
  invalidateSize();
}

module.exports.install = install;
