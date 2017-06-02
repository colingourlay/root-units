<h1 align="center">root-units<span aria-role="presentation"><br>💯+🎚=👌</span></h1>
<p align="center">
  <strong>What you really wanted when you asked for viewport units.</strong>
</p>
<p align="center">
  <img alt="When the OS has an overlaid scroll bar, 100vw matches the document width." src="https://raw.githubusercontent.com/colingourlay/root-units/master/assets/no-scrollbar.gif">
  <img alt="When the OS has an inline, fixed scroll bar, 100vw matches the document width plus the scroll bar width." src="https://raw.githubusercontent.com/colingourlay/root-units/master/assets/scrollbar.gif"> 
</p>

## Usage

This:

```js
require('root-units').install();
```

...enables this:

```css
.Thing {
  width: var(--vw);
  /* ^ 100% of <html> width */
  height: calc(var(--vh) / 2);
  /* ^ 50% of <html> height */
}
```

...because this:

![Root units update as browser is resized](assets/resize.gif)

## How it works

When you call `.install()`, the following happens*:

* The CSS custom properties `--rw` and `--rh` are added to the root element (`document.documentElement`) matching its `clientWidth` and `clientHeight` values. 
* Event handlers are attached to `window`'s `resize` and `orientationchange` events, which takes another measurement of the root element's width & height. 
* If either value has changed since the last measurement, we update the CSS custom properties.

### *"…but [#perfmatters](https://twitter.com/hashtag/perfmatters?src=hash)!"*, I hear you cry…

Worry not: if the root element's size changes, further events are ignored until the CSS custom properties have been updated. This results in as few DOM reads/writes as possible. Even more importantly, **measurements and mutations follow a simple asynchronous scheduling pattern which you can control**. There's not much point in you taking the time to optimise DOM reads/writes in your app, then drop in this little utility and cause a bunch of unwanted layout thrashing.

### How it *actually* works

* Event handlers are attached to `window`'s `resize` and `orientationchange` events, which can schedule a measurement of the root element's dimensions. By default, this is posponed to the next render frame (using `requestAnimationFrame`).
* If the dimensions have changed since the last measurement, a mutation is scheduled, which will update the CSS custom properties. By default, this happens in the same frame as the measurement.
* A measurement is manually scheduled, which allows the initial CSS custom properties to be created.

If you want to take full control of this scheduling, you can provide your own functions as options. They'll be called with a single argument (either the `measureTask` or `mutateTask` function), letting you manually run those tasks when it best suits your app's architecture:

```js
require('root-units')
.install({
  measure: window.requestAnimationFrame,
  mutate: mutateTask => mutateTask()
});
```

The above example shows the default behaviour, but you're free to replace that with whatever strategy suits you. Maybe you want to also run `measureTask` in the same tick of the event loop:

```js
require('root-units')
.install({
  measure: measureTask => measureTask()
});
```

...or appoint a purpose-built library such as [fastdom](https://github.com/wilsonpage/fastdom)):

```js
const fastdom = require('fastdom');

require('root-units')
.install({
  measure: fastdom.measure.bind(fastdom),
  mutate: fastdom.mutate.bind(fastdom)
});
```

Find what works best for you!

## Example

Clone this repo then:

```shell
$ npm install && npm start
```

...and open 🔗 [localhost:8080](http://localhost:8080)
