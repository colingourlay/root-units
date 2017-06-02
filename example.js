var rootUnits = require('./');

/* ============================================================================
  Example A: Default
============================================================================ */

rootUnits.install();

/* ============================================================================
  Example B: Measure on same event loop tick
============================================================================ */

// rootUnits.install({
//   measure: function (measureTask) {
//     measureTask();
//   }
// });

/* ============================================================================
  Example C: Schedule with fastdom (https://github.com/wilsonpage/fastdom)
============================================================================ */

// var fastdom = require('fastdom');

// rootUnits.install({
//   measure: fastdom.measure.bind(fastdom),
//   mutate: fastdom.mutate.bind(fastdom)
// });
