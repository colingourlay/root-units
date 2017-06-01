var SUPPORTS_CSS_CUSTOM_PROPERTIES = 'CSS' in window && 'supports' in CSS && CSS.supports('(--foo: bar)');
var ROOT_DETECTION_TIMEOUT = 50;

var measurements = {};
var isUpdateRequired = false;
var setProperty;
var scheduleMeasurement;
var scheduleMutation;

function nextTick(fn) {
  setTimeout(fn, 0);
}

function measure() {
  if (isUpdateRequired) {
    return;
  }

  var nextMeasurements = {
    rw: document.documentElement.clientWidth + 'px',
    rh: document.documentElement.clientHeight + 'px'
  };

  if (nextMeasurements.rw === measurements.rw &&
      nextMeasurements.rh === measurements.rh) {
    return;
  }

  measurements = nextMeasurements;
  isUpdateRequired = true;
}

function mutate() {
  scheduleMutation(mutate);

  if (!isUpdateRequired) {
    return;
  }

  Object.keys(measurements)
  .forEach(function update(prop) {
    setProperty('--' + prop, measurements[prop]);
  });

  isUpdateRequired = false;
}

function initial() {
  measure();
  scheduleMutation(mutate);
}

function install(options) {
  if (setProperty || !SUPPORTS_CSS_CUSTOM_PROPERTIES) {
    return new Error('CSS custom properties not supported.');
  }

  if (!document.documentElement) {
    return setTimeout(activate,  ROOT_DETECTION_TIMEOUT, options);
  }

  if (typeof options !== 'object' && options !== null) {
    options = {};
  }

  scheduleMeasurement = options.scheduleMeasurement || nextTick;
  scheduleMutation = options.scheduleMutation || window.requestAnimationFrame;
  setProperty = document.documentElement.style.setProperty.bind(document.documentElement.style);
  window.addEventListener('resize', scheduleMeasurement.bind(null, measure));
  window.addEventListener('orientationchange', scheduleMeasurement.bind(null, measure));
  scheduleMeasurement(initial);
};

module.exports.install = install;
