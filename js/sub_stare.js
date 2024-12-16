/**
 * stare.js v1
 * https://jinh.kr/owo/
 * 
 * MIT License © JinH
 */

/**
 * Even when you're not looking at it, it stares over you.
 * @param {string} target_selector Specify which element will stares upon you.
 * @param {Object} options Provides some options. (recommended to use the default values)
 * @param {number} options.perspective Distance from the perspective of looking at the target (unit: px, default value: 1000)
 * @param {number} options.angle Angle of css rotate3d (unit: deg, default value: 15)
 */
class Stare {
  constructor(target_selector, options = { perspective: 1000, angle: 15 }) {
    this.target = document.querySelectorAll(target_selector);
    this.options = options;

    onmousemove = (event) => {
      this.target.forEach((element) => {
        if (window.innerWidth > element.offsetWidth + 48) {

          const a = this.options.angle;
          const x0 = element.getBoundingClientRect().y + element.offsetHeight / 2;
          const x = ((x0 - event.pageY) / window.innerHeight) * 2;
          // const x = (.5 - event.pageY / window.innerHeight) * 2; // not using x0
          const y0 = element.getBoundingClientRect().x + element.offsetWidth / 2;
          const y = ((event.pageX - y0) / window.innerWidth) * 2;
          // const y = (-.5 + event.pageX / window.innerWidth) * 2; // not using y0
          const z = 0;
          element.style.transform = `rotate3d(${x}, ${y}, ${z}, ${a * (x ** 2 + y ** 2)}deg)`;

          element.parentNode.style.perspective = `${this.options.perspective}px`;
        } else {
          this.target.forEach((element) => { element.style.transform = `rotate3d(0, 0, 0, 0)`; });
        }
      });
    };

  }

  clear() {
    onmousemove = (event) => { };
    this.target.forEach((element) => { element.style.transform = `rotate3d(0, 0, 0, 0)`; });
  }
  perspective(v) { this.options.perspective = v != null ? v : 1000; return this; }
  angle(v) { this.options.angle = v != null ? v : 15; return this; }
}