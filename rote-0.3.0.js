/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 17);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * This code is an implementation of Alea algorithm; (C) 2010 Johannes Baagøe.
 * Alea is licensed according to the http://en.wikipedia.org/wiki/MIT_License.
 */
const FRAC = 2.3283064365386963e-10; /* 2^-32 */
class RNG {
    constructor() {
        this._seed = 0;
        this._s0 = 0;
        this._s1 = 0;
        this._s2 = 0;
        this._c = 0;
    }
    getSeed() { return this._seed; }
    /**
     * Seed the number generator
     */
    setSeed(seed) {
        seed = (seed < 1 ? 1 / seed : seed);
        this._seed = seed;
        this._s0 = (seed >>> 0) * FRAC;
        seed = (seed * 69069 + 1) >>> 0;
        this._s1 = seed * FRAC;
        seed = (seed * 69069 + 1) >>> 0;
        this._s2 = seed * FRAC;
        this._c = 1;
        return this;
    }
    /**
     * @returns Pseudorandom value [0,1), uniformly distributed
     */
    getUniform() {
        let t = 2091639 * this._s0 + this._c * FRAC;
        this._s0 = this._s1;
        this._s1 = this._s2;
        this._c = t | 0;
        this._s2 = t - this._c;
        return this._s2;
    }
    /**
     * @param lowerBound The lower end of the range to return a value from, inclusive
     * @param upperBound The upper end of the range to return a value from, inclusive
     * @returns Pseudorandom value [lowerBound, upperBound], using ROT.RNG.getUniform() to distribute the value
     */
    getUniformInt(lowerBound, upperBound) {
        let max = Math.max(lowerBound, upperBound);
        let min = Math.min(lowerBound, upperBound);
        return Math.floor(this.getUniform() * (max - min + 1)) + min;
    }
    /**
     * @param mean Mean value
     * @param stddev Standard deviation. ~95% of the absolute values will be lower than 2*stddev.
     * @returns A normally distributed pseudorandom value
     */
    getNormal(mean = 0, stddev = 1) {
        let u, v, r;
        do {
            u = 2 * this.getUniform() - 1;
            v = 2 * this.getUniform() - 1;
            r = u * u + v * v;
        } while (r > 1 || r == 0);
        let gauss = u * Math.sqrt(-2 * Math.log(r) / r);
        return mean + gauss * stddev;
    }
    /**
     * @returns Pseudorandom value [1,100] inclusive, uniformly distributed
     */
    getPercentage() {
        return 1 + Math.floor(this.getUniform() * 100);
    }
    /**
     * @returns Randomly picked item, null when length=0
     */
    getItem(array) {
        if (!array.length) {
            return null;
        }
        return array[Math.floor(this.getUniform() * array.length)];
    }
    /**
     * @returns New array with randomized items
     */
    shuffle(array) {
        let result = [];
        let clone = array.slice();
        while (clone.length) {
            let index = clone.indexOf(this.getItem(clone));
            result.push(clone.splice(index, 1)[0]);
        }
        return result;
    }
    /**
     * @param data key=whatever, value=weight (relative probability)
     * @returns whatever
     */
    getWeightedValue(data) {
        let total = 0;
        for (let id in data) {
            total += data[id];
        }
        let random = this.getUniform() * total;
        let id, part = 0;
        for (id in data) {
            part += data[id];
            if (random < part) {
                return id;
            }
        }
        // If by some floating-point annoyance we have
        // random >= total, just return the last id.
        return id;
    }
    /**
     * Get RNG state. Useful for storing the state and re-setting it via setState.
     * @returns Internal state
     */
    getState() { return [this._s0, this._s1, this._s2, this._c]; }
    /**
     * Set a previously retrieved state.
     */
    setState(state) {
        this._s0 = state[0];
        this._s1 = state[1];
        this._s2 = state[2];
        this._c = state[3];
        return this;
    }
    /**
     * Returns a cloned RNG
     */
    clone() {
        let clone = new RNG();
        return clone.setState(this.getState());
    }
}
/* harmony default export */ __webpack_exports__["a"] = (new RNG().setSeed(Date.now()));


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "mod", function() { return mod; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clamp", function() { return clamp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "capitalize", function() { return capitalize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "format", function() { return format; });
/**
 * Always positive modulus
 * @param x Operand
 * @param n Modulus
 * @returns x modulo n
 */
function mod(x, n) {
    return (x % n + n) % n;
}
function clamp(val, min = 0, max = 1) {
    if (val < min)
        return min;
    if (val > max)
        return max;
    return val;
}
function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.substring(1);
}
/**
 * Format a string in a flexible way. Scans for %s strings and replaces them with arguments. List of patterns is modifiable via String.format.map.
 * @param {string} template
 * @param {any} [argv]
 */
function format(template, ...args) {
    let map = format.map;
    let replacer = function (match, group1, group2, index) {
        if (template.charAt(index - 1) == "%") {
            return match.substring(1);
        }
        if (!args.length) {
            return match;
        }
        let obj = args[0];
        let group = group1 || group2;
        let parts = group.split(",");
        let name = parts.shift() || "";
        let method = map[name.toLowerCase()];
        if (!method) {
            return match;
        }
        obj = args.shift();
        let replaced = obj[method].apply(obj, parts);
        let first = name.charAt(0);
        if (first != first.toLowerCase()) {
            replaced = capitalize(replaced);
        }
        return replaced;
    };
    return template.replace(/%(?:([a-z]+)|(?:{([^}]+)}))/gi, replacer);
}
format.map = {
    "s": "toString"
};


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "fromString", function() { return fromString; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add", function() { return add; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "add_", function() { return add_; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multiply", function() { return multiply; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "multiply_", function() { return multiply_; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "interpolate", function() { return interpolate; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lerp", function() { return lerp; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "interpolateHSL", function() { return interpolateHSL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "lerpHSL", function() { return lerpHSL; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "randomize", function() { return randomize; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "rgb2hsl", function() { return rgb2hsl; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "hsl2rgb", function() { return hsl2rgb; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toRGB", function() { return toRGB; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "toHex", function() { return toHex; });
/* harmony import */ var _util_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(1);
/* harmony import */ var _rng_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(0);


function fromString(str) {
    let cached, r;
    if (str in CACHE) {
        cached = CACHE[str];
    }
    else {
        if (str.charAt(0) == "#") { // hex rgb
            let matched = str.match(/[0-9a-f]/gi) || [];
            let values = matched.map((x) => parseInt(x, 16));
            if (values.length == 3) {
                cached = values.map((x) => x * 17);
            }
            else {
                for (let i = 0; i < 3; i++) {
                    values[i + 1] += 16 * values[i];
                    values.splice(i, 1);
                }
                cached = values;
            }
        }
        else if ((r = str.match(/rgb\(([0-9, ]+)\)/i))) { // decimal rgb
            cached = r[1].split(/\s*,\s*/).map((x) => parseInt(x));
        }
        else { // html name
            cached = [0, 0, 0];
        }
        CACHE[str] = cached;
    }
    return cached.slice();
}
/**
 * Add two or more colors
 */
function add(color1, ...colors) {
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < colors.length; j++) {
            result[i] += colors[j][i];
        }
    }
    return result;
}
/**
 * Add two or more colors, MODIFIES FIRST ARGUMENT
 */
function add_(color1, ...colors) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < colors.length; j++) {
            color1[i] += colors[j][i];
        }
    }
    return color1;
}
/**
 * Multiply (mix) two or more colors
 */
function multiply(color1, ...colors) {
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < colors.length; j++) {
            result[i] *= colors[j][i] / 255;
        }
        result[i] = Math.round(result[i]);
    }
    return result;
}
/**
 * Multiply (mix) two or more colors, MODIFIES FIRST ARGUMENT
 */
function multiply_(color1, ...colors) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < colors.length; j++) {
            color1[i] *= colors[j][i] / 255;
        }
        color1[i] = Math.round(color1[i]);
    }
    return color1;
}
/**
 * Interpolate (blend) two colors with a given factor
 */
function interpolate(color1, color2, factor = 0.5) {
    let result = color1.slice();
    for (let i = 0; i < 3; i++) {
        result[i] = Math.round(result[i] + factor * (color2[i] - color1[i]));
    }
    return result;
}
const lerp = interpolate;
/**
 * Interpolate (blend) two colors with a given factor in HSL mode
 */
function interpolateHSL(color1, color2, factor = 0.5) {
    let hsl1 = rgb2hsl(color1);
    let hsl2 = rgb2hsl(color2);
    for (let i = 0; i < 3; i++) {
        hsl1[i] += factor * (hsl2[i] - hsl1[i]);
    }
    return hsl2rgb(hsl1);
}
const lerpHSL = interpolateHSL;
/**
 * Create a new random color based on this one
 * @param color
 * @param diff Set of standard deviations
 */
function randomize(color, diff) {
    if (!(diff instanceof Array)) {
        diff = Math.round(_rng_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].getNormal(0, diff));
    }
    let result = color.slice();
    for (let i = 0; i < 3; i++) {
        result[i] += (diff instanceof Array ? Math.round(_rng_js__WEBPACK_IMPORTED_MODULE_1__[/* default */ "a"].getNormal(0, diff[i])) : diff);
    }
    return result;
}
/**
 * Converts an RGB color value to HSL. Expects 0..255 inputs, produces 0..1 outputs.
 */
function rgb2hsl(color) {
    let r = color[0] / 255;
    let g = color[1] / 255;
    let b = color[2] / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s, l = (max + min) / 2;
    if (max == min) {
        s = 0; // achromatic
    }
    else {
        let d = max - min;
        s = (l > 0.5 ? d / (2 - max - min) : d / (max + min));
        switch (max) {
            case r:
                h = (g - b) / d + (g < b ? 6 : 0);
                break;
            case g:
                h = (b - r) / d + 2;
                break;
            case b:
                h = (r - g) / d + 4;
                break;
        }
        h /= 6;
    }
    return [h, s, l];
}
function hue2rgb(p, q, t) {
    if (t < 0)
        t += 1;
    if (t > 1)
        t -= 1;
    if (t < 1 / 6)
        return p + (q - p) * 6 * t;
    if (t < 1 / 2)
        return q;
    if (t < 2 / 3)
        return p + (q - p) * (2 / 3 - t) * 6;
    return p;
}
/**
 * Converts an HSL color value to RGB. Expects 0..1 inputs, produces 0..255 outputs.
 */
function hsl2rgb(color) {
    let l = color[2];
    if (color[1] == 0) {
        l = Math.round(l * 255);
        return [l, l, l];
    }
    else {
        let s = color[1];
        let q = (l < 0.5 ? l * (1 + s) : l + s - l * s);
        let p = 2 * l - q;
        let r = hue2rgb(p, q, color[0] + 1 / 3);
        let g = hue2rgb(p, q, color[0]);
        let b = hue2rgb(p, q, color[0] - 1 / 3);
        return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
    }
}
function toRGB(color) {
    let clamped = color.map(x => Object(_util_js__WEBPACK_IMPORTED_MODULE_0__["clamp"])(x, 0, 255));
    return `rgb(${clamped.join(",")})`;
}
function toHex(color) {
    let clamped = color.map(x => Object(_util_js__WEBPACK_IMPORTED_MODULE_0__["clamp"])(x, 0, 255).toString(16).padStart(2, "0"));
    return `#${clamped.join("")}`;
}
const CACHE = {
    "black": [0, 0, 0],
    "navy": [0, 0, 128],
    "darkblue": [0, 0, 139],
    "mediumblue": [0, 0, 205],
    "blue": [0, 0, 255],
    "darkgreen": [0, 100, 0],
    "green": [0, 128, 0],
    "teal": [0, 128, 128],
    "darkcyan": [0, 139, 139],
    "deepskyblue": [0, 191, 255],
    "darkturquoise": [0, 206, 209],
    "mediumspringgreen": [0, 250, 154],
    "lime": [0, 255, 0],
    "springgreen": [0, 255, 127],
    "aqua": [0, 255, 255],
    "cyan": [0, 255, 255],
    "midnightblue": [25, 25, 112],
    "dodgerblue": [30, 144, 255],
    "forestgreen": [34, 139, 34],
    "seagreen": [46, 139, 87],
    "darkslategray": [47, 79, 79],
    "darkslategrey": [47, 79, 79],
    "limegreen": [50, 205, 50],
    "mediumseagreen": [60, 179, 113],
    "turquoise": [64, 224, 208],
    "royalblue": [65, 105, 225],
    "steelblue": [70, 130, 180],
    "darkslateblue": [72, 61, 139],
    "mediumturquoise": [72, 209, 204],
    "indigo": [75, 0, 130],
    "darkolivegreen": [85, 107, 47],
    "cadetblue": [95, 158, 160],
    "cornflowerblue": [100, 149, 237],
    "mediumaquamarine": [102, 205, 170],
    "dimgray": [105, 105, 105],
    "dimgrey": [105, 105, 105],
    "slateblue": [106, 90, 205],
    "olivedrab": [107, 142, 35],
    "slategray": [112, 128, 144],
    "slategrey": [112, 128, 144],
    "lightslategray": [119, 136, 153],
    "lightslategrey": [119, 136, 153],
    "mediumslateblue": [123, 104, 238],
    "lawngreen": [124, 252, 0],
    "chartreuse": [127, 255, 0],
    "aquamarine": [127, 255, 212],
    "maroon": [128, 0, 0],
    "purple": [128, 0, 128],
    "olive": [128, 128, 0],
    "gray": [128, 128, 128],
    "grey": [128, 128, 128],
    "skyblue": [135, 206, 235],
    "lightskyblue": [135, 206, 250],
    "blueviolet": [138, 43, 226],
    "darkred": [139, 0, 0],
    "darkmagenta": [139, 0, 139],
    "saddlebrown": [139, 69, 19],
    "darkseagreen": [143, 188, 143],
    "lightgreen": [144, 238, 144],
    "mediumpurple": [147, 112, 216],
    "darkviolet": [148, 0, 211],
    "palegreen": [152, 251, 152],
    "darkorchid": [153, 50, 204],
    "yellowgreen": [154, 205, 50],
    "sienna": [160, 82, 45],
    "brown": [165, 42, 42],
    "darkgray": [169, 169, 169],
    "darkgrey": [169, 169, 169],
    "lightblue": [173, 216, 230],
    "greenyellow": [173, 255, 47],
    "paleturquoise": [175, 238, 238],
    "lightsteelblue": [176, 196, 222],
    "powderblue": [176, 224, 230],
    "firebrick": [178, 34, 34],
    "darkgoldenrod": [184, 134, 11],
    "mediumorchid": [186, 85, 211],
    "rosybrown": [188, 143, 143],
    "darkkhaki": [189, 183, 107],
    "silver": [192, 192, 192],
    "mediumvioletred": [199, 21, 133],
    "indianred": [205, 92, 92],
    "peru": [205, 133, 63],
    "chocolate": [210, 105, 30],
    "tan": [210, 180, 140],
    "lightgray": [211, 211, 211],
    "lightgrey": [211, 211, 211],
    "palevioletred": [216, 112, 147],
    "thistle": [216, 191, 216],
    "orchid": [218, 112, 214],
    "goldenrod": [218, 165, 32],
    "crimson": [220, 20, 60],
    "gainsboro": [220, 220, 220],
    "plum": [221, 160, 221],
    "burlywood": [222, 184, 135],
    "lightcyan": [224, 255, 255],
    "lavender": [230, 230, 250],
    "darksalmon": [233, 150, 122],
    "violet": [238, 130, 238],
    "palegoldenrod": [238, 232, 170],
    "lightcoral": [240, 128, 128],
    "khaki": [240, 230, 140],
    "aliceblue": [240, 248, 255],
    "honeydew": [240, 255, 240],
    "azure": [240, 255, 255],
    "sandybrown": [244, 164, 96],
    "wheat": [245, 222, 179],
    "beige": [245, 245, 220],
    "whitesmoke": [245, 245, 245],
    "mintcream": [245, 255, 250],
    "ghostwhite": [248, 248, 255],
    "salmon": [250, 128, 114],
    "antiquewhite": [250, 235, 215],
    "linen": [250, 240, 230],
    "lightgoldenrodyellow": [250, 250, 210],
    "oldlace": [253, 245, 230],
    "red": [255, 0, 0],
    "fuchsia": [255, 0, 255],
    "magenta": [255, 0, 255],
    "deeppink": [255, 20, 147],
    "orangered": [255, 69, 0],
    "tomato": [255, 99, 71],
    "hotpink": [255, 105, 180],
    "coral": [255, 127, 80],
    "darkorange": [255, 140, 0],
    "lightsalmon": [255, 160, 122],
    "orange": [255, 165, 0],
    "lightpink": [255, 182, 193],
    "pink": [255, 192, 203],
    "gold": [255, 215, 0],
    "peachpuff": [255, 218, 185],
    "navajowhite": [255, 222, 173],
    "moccasin": [255, 228, 181],
    "bisque": [255, 228, 196],
    "mistyrose": [255, 228, 225],
    "blanchedalmond": [255, 235, 205],
    "papayawhip": [255, 239, 213],
    "lavenderblush": [255, 240, 245],
    "seashell": [255, 245, 238],
    "cornsilk": [255, 248, 220],
    "lemonchiffon": [255, 250, 205],
    "floralwhite": [255, 250, 240],
    "snow": [255, 250, 250],
    "yellow": [255, 255, 0],
    "lightyellow": [255, 255, 224],
    "ivory": [255, 255, 240],
    "white": [255, 255, 255]
};


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
var text_namespaceObject = {};
__webpack_require__.r(text_namespaceObject);
__webpack_require__.d(text_namespaceObject, "TYPE_TEXT", function() { return TYPE_TEXT; });
__webpack_require__.d(text_namespaceObject, "TYPE_NEWLINE", function() { return TYPE_NEWLINE; });
__webpack_require__.d(text_namespaceObject, "TYPE_FG", function() { return TYPE_FG; });
__webpack_require__.d(text_namespaceObject, "TYPE_BG", function() { return TYPE_BG; });
__webpack_require__.d(text_namespaceObject, "measure", function() { return measure; });
__webpack_require__.d(text_namespaceObject, "tokenize", function() { return tokenize; });

// EXTERNAL MODULE: ./node_modules/rot-js/lib/rng.js
var rng = __webpack_require__(0);

// EXTERNAL MODULE: ./node_modules/rot-js/lib/display/backend.js
var backend = __webpack_require__(6);

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/canvas.js

class canvas_Canvas extends backend["a" /* default */] {
    constructor() {
        super();
        this._ctx = document.createElement("canvas").getContext("2d");
    }
    schedule(cb) { requestAnimationFrame(cb); }
    getContainer() { return this._ctx.canvas; }
    setOptions(opts) {
        super.setOptions(opts);
        const style = (opts.fontStyle ? `${opts.fontStyle} ` : ``);
        const font = `${style} ${opts.fontSize}px ${opts.fontFamily}`;
        this._ctx.font = font;
        this._updateSize();
        this._ctx.font = font;
        this._ctx.textAlign = "center";
        this._ctx.textBaseline = "middle";
    }
    clear() {
        this._ctx.fillStyle = this._options.bg;
        this._ctx.fillRect(0, 0, this._ctx.canvas.width, this._ctx.canvas.height);
    }
    eventToPosition(x, y) {
        let canvas = this._ctx.canvas;
        let rect = canvas.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;
        x *= canvas.width / rect.width;
        y *= canvas.height / rect.height;
        if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height) {
            return [-1, -1];
        }
        return this._normalizedEventToPosition(x, y);
    }
}

// EXTERNAL MODULE: ./node_modules/rot-js/lib/util.js
var util = __webpack_require__(1);

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/hex.js


/**
 * @class Hexagonal backend
 * @private
 */
class hex_Hex extends canvas_Canvas {
    constructor() {
        super();
        this._spacingX = 0;
        this._spacingY = 0;
        this._hexSize = 0;
    }
    draw(data, clearBefore) {
        let [x, y, ch, fg, bg] = data;
        let px = [
            (x + 1) * this._spacingX,
            y * this._spacingY + this._hexSize
        ];
        if (this._options.transpose) {
            px.reverse();
        }
        if (clearBefore) {
            this._ctx.fillStyle = bg;
            this._fill(px[0], px[1]);
        }
        if (!ch) {
            return;
        }
        this._ctx.fillStyle = fg;
        let chars = [].concat(ch);
        for (let i = 0; i < chars.length; i++) {
            this._ctx.fillText(chars[i], px[0], Math.ceil(px[1]));
        }
    }
    computeSize(availWidth, availHeight) {
        if (this._options.transpose) {
            availWidth += availHeight;
            availHeight = availWidth - availHeight;
            availWidth -= availHeight;
        }
        let width = Math.floor(availWidth / this._spacingX) - 1;
        let height = Math.floor((availHeight - 2 * this._hexSize) / this._spacingY + 1);
        return [width, height];
    }
    computeFontSize(availWidth, availHeight) {
        if (this._options.transpose) {
            availWidth += availHeight;
            availHeight = availWidth - availHeight;
            availWidth -= availHeight;
        }
        let hexSizeWidth = 2 * availWidth / ((this._options.width + 1) * Math.sqrt(3)) - 1;
        let hexSizeHeight = availHeight / (2 + 1.5 * (this._options.height - 1));
        let hexSize = Math.min(hexSizeWidth, hexSizeHeight);
        // compute char ratio
        let oldFont = this._ctx.font;
        this._ctx.font = "100px " + this._options.fontFamily;
        let width = Math.ceil(this._ctx.measureText("W").width);
        this._ctx.font = oldFont;
        let ratio = width / 100;
        hexSize = Math.floor(hexSize) + 1; // closest larger hexSize
        // FIXME char size computation does not respect transposed hexes
        let fontSize = 2 * hexSize / (this._options.spacing * (1 + ratio / Math.sqrt(3)));
        // closest smaller fontSize
        return Math.ceil(fontSize) - 1;
    }
    _normalizedEventToPosition(x, y) {
        let nodeSize;
        if (this._options.transpose) {
            x += y;
            y = x - y;
            x -= y;
            nodeSize = this._ctx.canvas.width;
        }
        else {
            nodeSize = this._ctx.canvas.height;
        }
        let size = nodeSize / this._options.height;
        y = Math.floor(y / size);
        if (Object(util["mod"])(y, 2)) { /* odd row */
            x -= this._spacingX;
            x = 1 + 2 * Math.floor(x / (2 * this._spacingX));
        }
        else {
            x = 2 * Math.floor(x / (2 * this._spacingX));
        }
        return [x, y];
    }
    /**
     * Arguments are pixel values. If "transposed" mode is enabled, then these two are already swapped.
     */
    _fill(cx, cy) {
        let a = this._hexSize;
        let b = this._options.border;
        const ctx = this._ctx;
        ctx.beginPath();
        if (this._options.transpose) {
            ctx.moveTo(cx - a + b, cy);
            ctx.lineTo(cx - a / 2 + b, cy + this._spacingX - b);
            ctx.lineTo(cx + a / 2 - b, cy + this._spacingX - b);
            ctx.lineTo(cx + a - b, cy);
            ctx.lineTo(cx + a / 2 - b, cy - this._spacingX + b);
            ctx.lineTo(cx - a / 2 + b, cy - this._spacingX + b);
            ctx.lineTo(cx - a + b, cy);
        }
        else {
            ctx.moveTo(cx, cy - a + b);
            ctx.lineTo(cx + this._spacingX - b, cy - a / 2 + b);
            ctx.lineTo(cx + this._spacingX - b, cy + a / 2 - b);
            ctx.lineTo(cx, cy + a - b);
            ctx.lineTo(cx - this._spacingX + b, cy + a / 2 - b);
            ctx.lineTo(cx - this._spacingX + b, cy - a / 2 + b);
            ctx.lineTo(cx, cy - a + b);
        }
        ctx.fill();
    }
    _updateSize() {
        const opts = this._options;
        const charWidth = Math.ceil(this._ctx.measureText("W").width);
        this._hexSize = Math.floor(opts.spacing * (opts.fontSize + charWidth / Math.sqrt(3)) / 2);
        this._spacingX = this._hexSize * Math.sqrt(3) / 2;
        this._spacingY = this._hexSize * 1.5;
        let xprop;
        let yprop;
        if (opts.transpose) {
            xprop = "height";
            yprop = "width";
        }
        else {
            xprop = "width";
            yprop = "height";
        }
        this._ctx.canvas[xprop] = Math.ceil((opts.width + 1) * this._spacingX);
        this._ctx.canvas[yprop] = Math.ceil((opts.height - 1) * this._spacingY + 2 * this._hexSize);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/rect.js

/**
 * @class Rectangular backend
 * @private
 */
class rect_Rect extends canvas_Canvas {
    constructor() {
        super();
        this._spacingX = 0;
        this._spacingY = 0;
        this._canvasCache = {};
    }
    setOptions(options) {
        super.setOptions(options);
        this._canvasCache = {};
    }
    draw(data, clearBefore) {
        if (rect_Rect.cache) {
            this._drawWithCache(data);
        }
        else {
            this._drawNoCache(data, clearBefore);
        }
    }
    _drawWithCache(data) {
        let [x, y, ch, fg, bg] = data;
        let hash = "" + ch + fg + bg;
        let canvas;
        if (hash in this._canvasCache) {
            canvas = this._canvasCache[hash];
        }
        else {
            let b = this._options.border;
            canvas = document.createElement("canvas");
            let ctx = canvas.getContext("2d");
            canvas.width = this._spacingX;
            canvas.height = this._spacingY;
            ctx.fillStyle = bg;
            ctx.fillRect(b, b, canvas.width - b, canvas.height - b);
            if (ch) {
                ctx.fillStyle = fg;
                ctx.font = this._ctx.font;
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                let chars = [].concat(ch);
                for (let i = 0; i < chars.length; i++) {
                    ctx.fillText(chars[i], this._spacingX / 2, Math.ceil(this._spacingY / 2));
                }
            }
            this._canvasCache[hash] = canvas;
        }
        this._ctx.drawImage(canvas, x * this._spacingX, y * this._spacingY);
    }
    _drawNoCache(data, clearBefore) {
        let [x, y, ch, fg, bg] = data;
        if (clearBefore) {
            let b = this._options.border;
            this._ctx.fillStyle = bg;
            this._ctx.fillRect(x * this._spacingX + b, y * this._spacingY + b, this._spacingX - b, this._spacingY - b);
        }
        if (!ch) {
            return;
        }
        this._ctx.fillStyle = fg;
        let chars = [].concat(ch);
        for (let i = 0; i < chars.length; i++) {
            this._ctx.fillText(chars[i], (x + 0.5) * this._spacingX, Math.ceil((y + 0.5) * this._spacingY));
        }
    }
    computeSize(availWidth, availHeight) {
        let width = Math.floor(availWidth / this._spacingX);
        let height = Math.floor(availHeight / this._spacingY);
        return [width, height];
    }
    computeFontSize(availWidth, availHeight) {
        let boxWidth = Math.floor(availWidth / this._options.width);
        let boxHeight = Math.floor(availHeight / this._options.height);
        /* compute char ratio */
        let oldFont = this._ctx.font;
        this._ctx.font = "100px " + this._options.fontFamily;
        let width = Math.ceil(this._ctx.measureText("W").width);
        this._ctx.font = oldFont;
        let ratio = width / 100;
        let widthFraction = ratio * boxHeight / boxWidth;
        if (widthFraction > 1) { /* too wide with current aspect ratio */
            boxHeight = Math.floor(boxHeight / widthFraction);
        }
        return Math.floor(boxHeight / this._options.spacing);
    }
    _normalizedEventToPosition(x, y) {
        return [Math.floor(x / this._spacingX), Math.floor(y / this._spacingY)];
    }
    _updateSize() {
        const opts = this._options;
        const charWidth = Math.ceil(this._ctx.measureText("W").width);
        this._spacingX = Math.ceil(opts.spacing * charWidth);
        this._spacingY = Math.ceil(opts.spacing * opts.fontSize);
        if (opts.forceSquareRatio) {
            this._spacingX = this._spacingY = Math.max(this._spacingX, this._spacingY);
        }
        this._ctx.canvas.width = opts.width * this._spacingX;
        this._ctx.canvas.height = opts.height * this._spacingY;
    }
}
rect_Rect.cache = false;

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/tile.js

/**
 * @class Tile backend
 * @private
 */
class tile_Tile extends canvas_Canvas {
    constructor() {
        super();
        this._colorCanvas = document.createElement("canvas");
    }
    draw(data, clearBefore) {
        let [x, y, ch, fg, bg] = data;
        let tileWidth = this._options.tileWidth;
        let tileHeight = this._options.tileHeight;
        if (clearBefore) {
            if (this._options.tileColorize) {
                this._ctx.clearRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
            else {
                this._ctx.fillStyle = bg;
                this._ctx.fillRect(x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
        }
        if (!ch) {
            return;
        }
        let chars = [].concat(ch);
        let fgs = [].concat(fg);
        let bgs = [].concat(bg);
        for (let i = 0; i < chars.length; i++) {
            let tile = this._options.tileMap[chars[i]];
            if (!tile) {
                throw new Error(`Char "${chars[i]}" not found in tileMap`);
            }
            if (this._options.tileColorize) { // apply colorization
                let canvas = this._colorCanvas;
                let context = canvas.getContext("2d");
                context.globalCompositeOperation = "source-over";
                context.clearRect(0, 0, tileWidth, tileHeight);
                let fg = fgs[i];
                let bg = bgs[i];
                context.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, 0, 0, tileWidth, tileHeight);
                if (fg != "transparent") {
                    context.fillStyle = fg;
                    context.globalCompositeOperation = "source-atop";
                    context.fillRect(0, 0, tileWidth, tileHeight);
                }
                if (bg != "transparent") {
                    context.fillStyle = bg;
                    context.globalCompositeOperation = "destination-over";
                    context.fillRect(0, 0, tileWidth, tileHeight);
                }
                this._ctx.drawImage(canvas, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
            else { // no colorizing, easy
                this._ctx.drawImage(this._options.tileSet, tile[0], tile[1], tileWidth, tileHeight, x * tileWidth, y * tileHeight, tileWidth, tileHeight);
            }
        }
    }
    computeSize(availWidth, availHeight) {
        let width = Math.floor(availWidth / this._options.tileWidth);
        let height = Math.floor(availHeight / this._options.tileHeight);
        return [width, height];
    }
    computeFontSize() {
        throw new Error("Tile backend does not understand font size");
    }
    _normalizedEventToPosition(x, y) {
        return [Math.floor(x / this._options.tileWidth), Math.floor(y / this._options.tileHeight)];
    }
    _updateSize() {
        const opts = this._options;
        this._ctx.canvas.width = opts.width * opts.tileWidth;
        this._ctx.canvas.height = opts.height * opts.tileHeight;
        this._colorCanvas.width = opts.tileWidth;
        this._colorCanvas.height = opts.tileHeight;
    }
}

// EXTERNAL MODULE: ./node_modules/rot-js/lib/display/term.js
var term = __webpack_require__(9);

// CONCATENATED MODULE: ./node_modules/rot-js/lib/text.js
/**
 * @namespace
 * Contains text tokenization and breaking routines
 */
const RE_COLORS = /%([bc]){([^}]*)}/g;
// token types
const TYPE_TEXT = 0;
const TYPE_NEWLINE = 1;
const TYPE_FG = 2;
const TYPE_BG = 3;
/**
 * Measure size of a resulting text block
 */
function measure(str, maxWidth) {
    let result = { width: 0, height: 1 };
    let tokens = tokenize(str, maxWidth);
    let lineWidth = 0;
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        switch (token.type) {
            case TYPE_TEXT:
                lineWidth += token.value.length;
                break;
            case TYPE_NEWLINE:
                result.height++;
                result.width = Math.max(result.width, lineWidth);
                lineWidth = 0;
                break;
        }
    }
    result.width = Math.max(result.width, lineWidth);
    return result;
}
/**
 * Convert string to a series of a formatting commands
 */
function tokenize(str, maxWidth) {
    let result = [];
    /* first tokenization pass - split texts and color formatting commands */
    let offset = 0;
    str.replace(RE_COLORS, function (match, type, name, index) {
        /* string before */
        let part = str.substring(offset, index);
        if (part.length) {
            result.push({
                type: TYPE_TEXT,
                value: part
            });
        }
        /* color command */
        result.push({
            type: (type == "c" ? TYPE_FG : TYPE_BG),
            value: name.trim()
        });
        offset = index + match.length;
        return "";
    });
    /* last remaining part */
    let part = str.substring(offset);
    if (part.length) {
        result.push({
            type: TYPE_TEXT,
            value: part
        });
    }
    return breakLines(result, maxWidth);
}
/* insert line breaks into first-pass tokenized data */
function breakLines(tokens, maxWidth) {
    if (!maxWidth) {
        maxWidth = Infinity;
    }
    let i = 0;
    let lineLength = 0;
    let lastTokenWithSpace = -1;
    while (i < tokens.length) { /* take all text tokens, remove space, apply linebreaks */
        let token = tokens[i];
        if (token.type == TYPE_NEWLINE) { /* reset */
            lineLength = 0;
            lastTokenWithSpace = -1;
        }
        if (token.type != TYPE_TEXT) { /* skip non-text tokens */
            i++;
            continue;
        }
        /* remove spaces at the beginning of line */
        while (lineLength == 0 && token.value.charAt(0) == " ") {
            token.value = token.value.substring(1);
        }
        /* forced newline? insert two new tokens after this one */
        let index = token.value.indexOf("\n");
        if (index != -1) {
            token.value = breakInsideToken(tokens, i, index, true);
            /* if there are spaces at the end, we must remove them (we do not want the line too long) */
            let arr = token.value.split("");
            while (arr.length && arr[arr.length - 1] == " ") {
                arr.pop();
            }
            token.value = arr.join("");
        }
        /* token degenerated? */
        if (!token.value.length) {
            tokens.splice(i, 1);
            continue;
        }
        if (lineLength + token.value.length > maxWidth) { /* line too long, find a suitable breaking spot */
            /* is it possible to break within this token? */
            let index = -1;
            while (1) {
                let nextIndex = token.value.indexOf(" ", index + 1);
                if (nextIndex == -1) {
                    break;
                }
                if (lineLength + nextIndex > maxWidth) {
                    break;
                }
                index = nextIndex;
            }
            if (index != -1) { /* break at space within this one */
                token.value = breakInsideToken(tokens, i, index, true);
            }
            else if (lastTokenWithSpace != -1) { /* is there a previous token where a break can occur? */
                let token = tokens[lastTokenWithSpace];
                let breakIndex = token.value.lastIndexOf(" ");
                token.value = breakInsideToken(tokens, lastTokenWithSpace, breakIndex, true);
                i = lastTokenWithSpace;
            }
            else { /* force break in this token */
                token.value = breakInsideToken(tokens, i, maxWidth - lineLength, false);
            }
        }
        else { /* line not long, continue */
            lineLength += token.value.length;
            if (token.value.indexOf(" ") != -1) {
                lastTokenWithSpace = i;
            }
        }
        i++; /* advance to next token */
    }
    tokens.push({ type: TYPE_NEWLINE }); /* insert fake newline to fix the last text line */
    /* remove trailing space from text tokens before newlines */
    let lastTextToken = null;
    for (let i = 0; i < tokens.length; i++) {
        let token = tokens[i];
        switch (token.type) {
            case TYPE_TEXT:
                lastTextToken = token;
                break;
            case TYPE_NEWLINE:
                if (lastTextToken) { /* remove trailing space */
                    let arr = lastTextToken.value.split("");
                    while (arr.length && arr[arr.length - 1] == " ") {
                        arr.pop();
                    }
                    lastTextToken.value = arr.join("");
                }
                lastTextToken = null;
                break;
        }
    }
    tokens.pop(); /* remove fake token */
    return tokens;
}
/**
 * Create new tokens and insert them into the stream
 * @param {object[]} tokens
 * @param {int} tokenIndex Token being processed
 * @param {int} breakIndex Index within current token's value
 * @param {bool} removeBreakChar Do we want to remove the breaking character?
 * @returns {string} remaining unbroken token value
 */
function breakInsideToken(tokens, tokenIndex, breakIndex, removeBreakChar) {
    let newBreakToken = {
        type: TYPE_NEWLINE
    };
    let newTextToken = {
        type: TYPE_TEXT,
        value: tokens[tokenIndex].value.substring(breakIndex + (removeBreakChar ? 1 : 0))
    };
    tokens.splice(tokenIndex + 1, 0, newBreakToken, newTextToken);
    return tokens[tokenIndex].value.substring(0, breakIndex);
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/constants.js
/** Default with for display and map generators */
let DEFAULT_WIDTH = 80;
/** Default height for display and map generators */
let DEFAULT_HEIGHT = 25;
const DIRS = {
    4: [[0, -1], [1, 0], [0, 1], [-1, 0]],
    8: [[0, -1], [1, -1], [1, 0], [1, 1], [0, 1], [-1, 1], [-1, 0], [-1, -1]],
    6: [[-1, -1], [1, -1], [2, 0], [1, 1], [-1, 1], [-2, 0]]
};
const KEYS = {
    /** Cancel key. */
    VK_CANCEL: 3,
    /** Help key. */
    VK_HELP: 6,
    /** Backspace key. */
    VK_BACK_SPACE: 8,
    /** Tab key. */
    VK_TAB: 9,
    /** 5 key on Numpad when NumLock is unlocked. Or on Mac, clear key which is positioned at NumLock key. */
    VK_CLEAR: 12,
    /** Return/enter key on the main keyboard. */
    VK_RETURN: 13,
    /** Reserved, but not used. */
    VK_ENTER: 14,
    /** Shift key. */
    VK_SHIFT: 16,
    /** Control key. */
    VK_CONTROL: 17,
    /** Alt (Option on Mac) key. */
    VK_ALT: 18,
    /** Pause key. */
    VK_PAUSE: 19,
    /** Caps lock. */
    VK_CAPS_LOCK: 20,
    /** Escape key. */
    VK_ESCAPE: 27,
    /** Space bar. */
    VK_SPACE: 32,
    /** Page Up key. */
    VK_PAGE_UP: 33,
    /** Page Down key. */
    VK_PAGE_DOWN: 34,
    /** End key. */
    VK_END: 35,
    /** Home key. */
    VK_HOME: 36,
    /** Left arrow. */
    VK_LEFT: 37,
    /** Up arrow. */
    VK_UP: 38,
    /** Right arrow. */
    VK_RIGHT: 39,
    /** Down arrow. */
    VK_DOWN: 40,
    /** Print Screen key. */
    VK_PRINTSCREEN: 44,
    /** Ins(ert) key. */
    VK_INSERT: 45,
    /** Del(ete) key. */
    VK_DELETE: 46,
    /***/
    VK_0: 48,
    /***/
    VK_1: 49,
    /***/
    VK_2: 50,
    /***/
    VK_3: 51,
    /***/
    VK_4: 52,
    /***/
    VK_5: 53,
    /***/
    VK_6: 54,
    /***/
    VK_7: 55,
    /***/
    VK_8: 56,
    /***/
    VK_9: 57,
    /** Colon (:) key. Requires Gecko 15.0 */
    VK_COLON: 58,
    /** Semicolon (;) key. */
    VK_SEMICOLON: 59,
    /** Less-than (<) key. Requires Gecko 15.0 */
    VK_LESS_THAN: 60,
    /** Equals (=) key. */
    VK_EQUALS: 61,
    /** Greater-than (>) key. Requires Gecko 15.0 */
    VK_GREATER_THAN: 62,
    /** Question mark (?) key. Requires Gecko 15.0 */
    VK_QUESTION_MARK: 63,
    /** Atmark (@) key. Requires Gecko 15.0 */
    VK_AT: 64,
    /***/
    VK_A: 65,
    /***/
    VK_B: 66,
    /***/
    VK_C: 67,
    /***/
    VK_D: 68,
    /***/
    VK_E: 69,
    /***/
    VK_F: 70,
    /***/
    VK_G: 71,
    /***/
    VK_H: 72,
    /***/
    VK_I: 73,
    /***/
    VK_J: 74,
    /***/
    VK_K: 75,
    /***/
    VK_L: 76,
    /***/
    VK_M: 77,
    /***/
    VK_N: 78,
    /***/
    VK_O: 79,
    /***/
    VK_P: 80,
    /***/
    VK_Q: 81,
    /***/
    VK_R: 82,
    /***/
    VK_S: 83,
    /***/
    VK_T: 84,
    /***/
    VK_U: 85,
    /***/
    VK_V: 86,
    /***/
    VK_W: 87,
    /***/
    VK_X: 88,
    /***/
    VK_Y: 89,
    /***/
    VK_Z: 90,
    /***/
    VK_CONTEXT_MENU: 93,
    /** 0 on the numeric keypad. */
    VK_NUMPAD0: 96,
    /** 1 on the numeric keypad. */
    VK_NUMPAD1: 97,
    /** 2 on the numeric keypad. */
    VK_NUMPAD2: 98,
    /** 3 on the numeric keypad. */
    VK_NUMPAD3: 99,
    /** 4 on the numeric keypad. */
    VK_NUMPAD4: 100,
    /** 5 on the numeric keypad. */
    VK_NUMPAD5: 101,
    /** 6 on the numeric keypad. */
    VK_NUMPAD6: 102,
    /** 7 on the numeric keypad. */
    VK_NUMPAD7: 103,
    /** 8 on the numeric keypad. */
    VK_NUMPAD8: 104,
    /** 9 on the numeric keypad. */
    VK_NUMPAD9: 105,
    /** * on the numeric keypad. */
    VK_MULTIPLY: 106,
    /** + on the numeric keypad. */
    VK_ADD: 107,
    /***/
    VK_SEPARATOR: 108,
    /** - on the numeric keypad. */
    VK_SUBTRACT: 109,
    /** Decimal point on the numeric keypad. */
    VK_DECIMAL: 110,
    /** / on the numeric keypad. */
    VK_DIVIDE: 111,
    /** F1 key. */
    VK_F1: 112,
    /** F2 key. */
    VK_F2: 113,
    /** F3 key. */
    VK_F3: 114,
    /** F4 key. */
    VK_F4: 115,
    /** F5 key. */
    VK_F5: 116,
    /** F6 key. */
    VK_F6: 117,
    /** F7 key. */
    VK_F7: 118,
    /** F8 key. */
    VK_F8: 119,
    /** F9 key. */
    VK_F9: 120,
    /** F10 key. */
    VK_F10: 121,
    /** F11 key. */
    VK_F11: 122,
    /** F12 key. */
    VK_F12: 123,
    /** F13 key. */
    VK_F13: 124,
    /** F14 key. */
    VK_F14: 125,
    /** F15 key. */
    VK_F15: 126,
    /** F16 key. */
    VK_F16: 127,
    /** F17 key. */
    VK_F17: 128,
    /** F18 key. */
    VK_F18: 129,
    /** F19 key. */
    VK_F19: 130,
    /** F20 key. */
    VK_F20: 131,
    /** F21 key. */
    VK_F21: 132,
    /** F22 key. */
    VK_F22: 133,
    /** F23 key. */
    VK_F23: 134,
    /** F24 key. */
    VK_F24: 135,
    /** Num Lock key. */
    VK_NUM_LOCK: 144,
    /** Scroll Lock key. */
    VK_SCROLL_LOCK: 145,
    /** Circumflex (^) key. Requires Gecko 15.0 */
    VK_CIRCUMFLEX: 160,
    /** Exclamation (!) key. Requires Gecko 15.0 */
    VK_EXCLAMATION: 161,
    /** Double quote () key. Requires Gecko 15.0 */
    VK_DOUBLE_QUOTE: 162,
    /** Hash (#) key. Requires Gecko 15.0 */
    VK_HASH: 163,
    /** Dollar sign ($) key. Requires Gecko 15.0 */
    VK_DOLLAR: 164,
    /** Percent (%) key. Requires Gecko 15.0 */
    VK_PERCENT: 165,
    /** Ampersand (&) key. Requires Gecko 15.0 */
    VK_AMPERSAND: 166,
    /** Underscore (_) key. Requires Gecko 15.0 */
    VK_UNDERSCORE: 167,
    /** Open parenthesis (() key. Requires Gecko 15.0 */
    VK_OPEN_PAREN: 168,
    /** Close parenthesis ()) key. Requires Gecko 15.0 */
    VK_CLOSE_PAREN: 169,
    /* Asterisk (*) key. Requires Gecko 15.0 */
    VK_ASTERISK: 170,
    /** Plus (+) key. Requires Gecko 15.0 */
    VK_PLUS: 171,
    /** Pipe (|) key. Requires Gecko 15.0 */
    VK_PIPE: 172,
    /** Hyphen-US/docs/Minus (-) key. Requires Gecko 15.0 */
    VK_HYPHEN_MINUS: 173,
    /** Open curly bracket ({) key. Requires Gecko 15.0 */
    VK_OPEN_CURLY_BRACKET: 174,
    /** Close curly bracket (}) key. Requires Gecko 15.0 */
    VK_CLOSE_CURLY_BRACKET: 175,
    /** Tilde (~) key. Requires Gecko 15.0 */
    VK_TILDE: 176,
    /** Comma (,) key. */
    VK_COMMA: 188,
    /** Period (.) key. */
    VK_PERIOD: 190,
    /** Slash (/) key. */
    VK_SLASH: 191,
    /** Back tick (`) key. */
    VK_BACK_QUOTE: 192,
    /** Open square bracket ([) key. */
    VK_OPEN_BRACKET: 219,
    /** Back slash (\) key. */
    VK_BACK_SLASH: 220,
    /** Close square bracket (]) key. */
    VK_CLOSE_BRACKET: 221,
    /** Quote (''') key. */
    VK_QUOTE: 222,
    /** Meta key on Linux, Command key on Mac. */
    VK_META: 224,
    /** AltGr key on Linux. Requires Gecko 15.0 */
    VK_ALTGR: 225,
    /** Windows logo key on Windows. Or Super or Hyper key on Linux. Requires Gecko 15.0 */
    VK_WIN: 91,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_KANA: 21,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_HANGUL: 21,
    /** 英数 key on Japanese Mac keyboard. Requires Gecko 15.0 */
    VK_EISU: 22,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_JUNJA: 23,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_FINAL: 24,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_HANJA: 25,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_KANJI: 25,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_CONVERT: 28,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_NONCONVERT: 29,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_ACCEPT: 30,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_MODECHANGE: 31,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_SELECT: 41,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_PRINT: 42,
    /** Linux support for this keycode was added in Gecko 4.0. */
    VK_EXECUTE: 43,
    /** Linux support for this keycode was added in Gecko 4.0.	 */
    VK_SLEEP: 95
};

// CONCATENATED MODULE: ./node_modules/rot-js/lib/display/display.js






const BACKENDS = {
    "hex": hex_Hex,
    "rect": rect_Rect,
    "tile": tile_Tile,
    "term": term["a" /* default */]
};
const DEFAULT_OPTIONS = {
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT,
    transpose: false,
    layout: "rect",
    fontSize: 15,
    spacing: 1,
    border: 0,
    forceSquareRatio: false,
    fontFamily: "monospace",
    fontStyle: "",
    fg: "#ccc",
    bg: "#000",
    tileWidth: 32,
    tileHeight: 32,
    tileMap: {},
    tileSet: null,
    tileColorize: false
};
/**
 * @class Visual map display
 */
class display_Display {
    constructor(options = {}) {
        this._data = {};
        this._dirty = false; // false = nothing, true = all, object = dirty cells
        this._options = {};
        options = Object.assign({}, DEFAULT_OPTIONS, options);
        this.setOptions(options);
        this.DEBUG = this.DEBUG.bind(this);
        this._tick = this._tick.bind(this);
        this._backend.schedule(this._tick);
    }
    /**
     * Debug helper, ideal as a map generator callback. Always bound to this.
     * @param {int} x
     * @param {int} y
     * @param {int} what
     */
    DEBUG(x, y, what) {
        let colors = [this._options.bg, this._options.fg];
        this.draw(x, y, null, null, colors[what % colors.length]);
    }
    /**
     * Clear the whole display (cover it with background color)
     */
    clear() {
        this._data = {};
        this._dirty = true;
    }
    /**
     * @see ROT.Display
     */
    setOptions(options) {
        Object.assign(this._options, options);
        if (options.width || options.height || options.fontSize || options.fontFamily || options.spacing || options.layout) {
            if (options.layout) {
                let ctor = BACKENDS[options.layout];
                this._backend = new ctor();
            }
            this._backend.setOptions(this._options);
            this._dirty = true;
        }
        return this;
    }
    /**
     * Returns currently set options
     */
    getOptions() { return this._options; }
    /**
     * Returns the DOM node of this display
     */
    getContainer() { return this._backend.getContainer(); }
    /**
     * Compute the maximum width/height to fit into a set of given constraints
     * @param {int} availWidth Maximum allowed pixel width
     * @param {int} availHeight Maximum allowed pixel height
     * @returns {int[2]} cellWidth,cellHeight
     */
    computeSize(availWidth, availHeight) {
        return this._backend.computeSize(availWidth, availHeight);
    }
    /**
     * Compute the maximum font size to fit into a set of given constraints
     * @param {int} availWidth Maximum allowed pixel width
     * @param {int} availHeight Maximum allowed pixel height
     * @returns {int} fontSize
     */
    computeFontSize(availWidth, availHeight) {
        return this._backend.computeFontSize(availWidth, availHeight);
    }
    computeTileSize(availWidth, availHeight) {
        let width = Math.floor(availWidth / this._options.width);
        let height = Math.floor(availHeight / this._options.height);
        return [width, height];
    }
    /**
     * Convert a DOM event (mouse or touch) to map coordinates. Uses first touch for multi-touch.
     * @param {Event} e event
     * @returns {int[2]} -1 for values outside of the canvas
     */
    eventToPosition(e) {
        let x, y;
        if ("touches" in e) {
            x = e.touches[0].clientX;
            y = e.touches[0].clientY;
        }
        else {
            x = e.clientX;
            y = e.clientY;
        }
        return this._backend.eventToPosition(x, y);
    }
    /**
     * @param {int} x
     * @param {int} y
     * @param {string || string[]} ch One or more chars (will be overlapping themselves)
     * @param {string} [fg] foreground color
     * @param {string} [bg] background color
     */
    draw(x, y, ch, fg, bg) {
        if (!fg) {
            fg = this._options.fg;
        }
        if (!bg) {
            bg = this._options.bg;
        }
        let key = `${x},${y}`;
        this._data[key] = [x, y, ch, fg, bg];
        if (this._dirty === true) {
            return;
        } // will already redraw everything 
        if (!this._dirty) {
            this._dirty = {};
        } // first!
        this._dirty[key] = true;
    }
    /**
     * Draws a text at given position. Optionally wraps at a maximum length. Currently does not work with hex layout.
     * @param {int} x
     * @param {int} y
     * @param {string} text May contain color/background format specifiers, %c{name}/%b{name}, both optional. %c{}/%b{} resets to default.
     * @param {int} [maxWidth] wrap at what width?
     * @returns {int} lines drawn
     */
    drawText(x, y, text, maxWidth) {
        let fg = null;
        let bg = null;
        let cx = x;
        let cy = y;
        let lines = 1;
        if (!maxWidth) {
            maxWidth = this._options.width - x;
        }
        let tokens = tokenize(text, maxWidth);
        while (tokens.length) { // interpret tokenized opcode stream
            let token = tokens.shift();
            switch (token.type) {
                case TYPE_TEXT:
                    let isSpace = false, isPrevSpace = false, isFullWidth = false, isPrevFullWidth = false;
                    for (let i = 0; i < token.value.length; i++) {
                        let cc = token.value.charCodeAt(i);
                        let c = token.value.charAt(i);
                        // Assign to `true` when the current char is full-width.
                        isFullWidth = (cc > 0xff00 && cc < 0xff61) || (cc > 0xffdc && cc < 0xffe8) || cc > 0xffee;
                        // Current char is space, whatever full-width or half-width both are OK.
                        isSpace = (c.charCodeAt(0) == 0x20 || c.charCodeAt(0) == 0x3000);
                        // The previous char is full-width and
                        // current char is nether half-width nor a space.
                        if (isPrevFullWidth && !isFullWidth && !isSpace) {
                            cx++;
                        } // add an extra position
                        // The current char is full-width and
                        // the previous char is not a space.
                        if (isFullWidth && !isPrevSpace) {
                            cx++;
                        } // add an extra position
                        this.draw(cx++, cy, c, fg, bg);
                        isPrevSpace = isSpace;
                        isPrevFullWidth = isFullWidth;
                    }
                    break;
                case TYPE_FG:
                    fg = token.value || null;
                    break;
                case TYPE_BG:
                    bg = token.value || null;
                    break;
                case TYPE_NEWLINE:
                    cx = x;
                    cy++;
                    lines++;
                    break;
            }
        }
        return lines;
    }
    /**
     * Timer tick: update dirty parts
     */
    _tick() {
        this._backend.schedule(this._tick);
        if (!this._dirty) {
            return;
        }
        if (this._dirty === true) { // draw all
            this._backend.clear();
            for (let id in this._data) {
                this._draw(id, false);
            } // redraw cached data 
        }
        else { // draw only dirty 
            for (let key in this._dirty) {
                this._draw(key, true);
            }
        }
        this._dirty = false;
    }
    /**
     * @param {string} key What to draw
     * @param {bool} clearBefore Is it necessary to clean before?
     */
    _draw(key, clearBefore) {
        let data = this._data[key];
        if (data[4] != this._options.bg) {
            clearBefore = true;
        }
        this._backend.draw(data, clearBefore);
    }
}
display_Display.Rect = rect_Rect;
display_Display.Hex = hex_Hex;
display_Display.Tile = tile_Tile;
display_Display.Term = term["a" /* default */];

// CONCATENATED MODULE: ./node_modules/rot-js/lib/stringgenerator.js

/**
 * @class (Markov process)-based string generator.
 * Copied from a <a href="http://www.roguebasin.roguelikedevelopment.org/index.php?title=Names_from_a_high_order_Markov_Process_and_a_simplified_Katz_back-off_scheme">RogueBasin article</a>.
 * Offers configurable order and prior.
 */
class stringgenerator_StringGenerator {
    constructor(options) {
        this._options = {
            words: false,
            order: 3,
            prior: 0.001
        };
        Object.assign(this._options, options);
        this._boundary = String.fromCharCode(0);
        this._suffix = this._boundary;
        this._prefix = [];
        for (let i = 0; i < this._options.order; i++) {
            this._prefix.push(this._boundary);
        }
        this._priorValues = {};
        this._priorValues[this._boundary] = this._options.prior;
        this._data = {};
    }
    /**
     * Remove all learning data
     */
    clear() {
        this._data = {};
        this._priorValues = {};
    }
    /**
     * @returns {string} Generated string
     */
    generate() {
        let result = [this._sample(this._prefix)];
        while (result[result.length - 1] != this._boundary) {
            result.push(this._sample(result));
        }
        return this._join(result.slice(0, -1));
    }
    /**
     * Observe (learn) a string from a training set
     */
    observe(string) {
        let tokens = this._split(string);
        for (let i = 0; i < tokens.length; i++) {
            this._priorValues[tokens[i]] = this._options.prior;
        }
        tokens = this._prefix.concat(tokens).concat(this._suffix); /* add boundary symbols */
        for (let i = this._options.order; i < tokens.length; i++) {
            let context = tokens.slice(i - this._options.order, i);
            let event = tokens[i];
            for (let j = 0; j < context.length; j++) {
                let subcontext = context.slice(j);
                this._observeEvent(subcontext, event);
            }
        }
    }
    getStats() {
        let parts = [];
        let priorCount = Object.keys(this._priorValues).length;
        priorCount--; // boundary
        parts.push("distinct samples: " + priorCount);
        let dataCount = Object.keys(this._data).length;
        let eventCount = 0;
        for (let p in this._data) {
            eventCount += Object.keys(this._data[p]).length;
        }
        parts.push("dictionary size (contexts): " + dataCount);
        parts.push("dictionary size (events): " + eventCount);
        return parts.join(", ");
    }
    /**
     * @param {string}
     * @returns {string[]}
     */
    _split(str) {
        return str.split(this._options.words ? /\s+/ : "");
    }
    /**
     * @param {string[]}
     * @returns {string}
     */
    _join(arr) {
        return arr.join(this._options.words ? " " : "");
    }
    /**
     * @param {string[]} context
     * @param {string} event
     */
    _observeEvent(context, event) {
        let key = this._join(context);
        if (!(key in this._data)) {
            this._data[key] = {};
        }
        let data = this._data[key];
        if (!(event in data)) {
            data[event] = 0;
        }
        data[event]++;
    }
    /**
     * @param {string[]}
     * @returns {string}
     */
    _sample(context) {
        context = this._backoff(context);
        let key = this._join(context);
        let data = this._data[key];
        let available = {};
        if (this._options.prior) {
            for (let event in this._priorValues) {
                available[event] = this._priorValues[event];
            }
            for (let event in data) {
                available[event] += data[event];
            }
        }
        else {
            available = data;
        }
        return rng["a" /* default */].getWeightedValue(available);
    }
    /**
     * @param {string[]}
     * @returns {string[]}
     */
    _backoff(context) {
        if (context.length > this._options.order) {
            context = context.slice(-this._options.order);
        }
        else if (context.length < this._options.order) {
            context = this._prefix.slice(0, this._options.order - context.length).concat(context);
        }
        while (!(this._join(context) in this._data) && context.length > 0) {
            context = context.slice(1);
        }
        return context;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/eventqueue.js
class EventQueue {
    /**
     * @class Generic event queue: stores events and retrieves them based on their time
     */
    constructor() {
        this._time = 0;
        this._events = [];
        this._eventTimes = [];
    }
    /**
     * @returns {number} Elapsed time
     */
    getTime() { return this._time; }
    /**
     * Clear all scheduled events
     */
    clear() {
        this._events = [];
        this._eventTimes = [];
        return this;
    }
    /**
     * @param {?} event
     * @param {number} time
     */
    add(event, time) {
        let index = this._events.length;
        for (let i = 0; i < this._eventTimes.length; i++) {
            if (this._eventTimes[i] > time) {
                index = i;
                break;
            }
        }
        this._events.splice(index, 0, event);
        this._eventTimes.splice(index, 0, time);
    }
    /**
     * Locates the nearest event, advances time if necessary. Returns that event and removes it from the queue.
     * @returns {? || null} The event previously added by addEvent, null if no event available
     */
    get() {
        if (!this._events.length) {
            return null;
        }
        let time = this._eventTimes.splice(0, 1)[0];
        if (time > 0) { /* advance */
            this._time += time;
            for (let i = 0; i < this._eventTimes.length; i++) {
                this._eventTimes[i] -= time;
            }
        }
        return this._events.splice(0, 1)[0];
    }
    /**
     * Get the time associated with the given event
     * @param {?} event
     * @returns {number} time
     */
    getEventTime(event) {
        let index = this._events.indexOf(event);
        if (index == -1) {
            return undefined;
        }
        return this._eventTimes[index];
    }
    /**
     * Remove an event from the queue
     * @param {?} event
     * @returns {bool} success?
     */
    remove(event) {
        let index = this._events.indexOf(event);
        if (index == -1) {
            return false;
        }
        this._remove(index);
        return true;
    }
    ;
    /**
     * Remove an event from the queue
     * @param {int} index
     */
    _remove(index) {
        this._events.splice(index, 1);
        this._eventTimes.splice(index, 1);
    }
    ;
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/scheduler.js

class scheduler_Scheduler {
    /**
     * @class Abstract scheduler
     */
    constructor() {
        this._queue = new EventQueue();
        this._repeat = [];
        this._current = null;
    }
    /**
     * @see ROT.EventQueue#getTime
     */
    getTime() { return this._queue.getTime(); }
    /**
     * @param {?} item
     * @param {bool} repeat
     */
    add(item, repeat) {
        if (repeat) {
            this._repeat.push(item);
        }
        return this;
    }
    /**
     * Get the time the given item is scheduled for
     * @param {?} item
     * @returns {number} time
     */
    getTimeOf(item) {
        return this._queue.getEventTime(item);
    }
    /**
     * Clear all items
     */
    clear() {
        this._queue.clear();
        this._repeat = [];
        this._current = null;
        return this;
    }
    /**
     * Remove a previously added item
     * @param {?} item
     * @returns {bool} successful?
     */
    remove(item) {
        let result = this._queue.remove(item);
        let index = this._repeat.indexOf(item);
        if (index != -1) {
            this._repeat.splice(index, 1);
        }
        if (this._current == item) {
            this._current = null;
        }
        return result;
    }
    /**
     * Schedule next item
     * @returns {?}
     */
    next() {
        this._current = this._queue.get();
        return this._current;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/simple.js

/**
 * @class Simple fair scheduler (round-robin style)
 */
class simple_Simple extends scheduler_Scheduler {
    add(item, repeat) {
        this._queue.add(item, 0);
        return super.add(item, repeat);
    }
    next() {
        if (this._current && this._repeat.indexOf(this._current) != -1) {
            this._queue.add(this._current, 0);
        }
        return super.next();
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/speed.js

/**
 * @class Speed-based scheduler
 */
class speed_Speed extends scheduler_Scheduler {
    /**
     * @param {object} item anything with "getSpeed" method
     * @param {bool} repeat
     * @param {number} [time=1/item.getSpeed()]
     * @see ROT.Scheduler#add
     */
    add(item, repeat, time) {
        this._queue.add(item, time !== undefined ? time : 1 / item.getSpeed());
        return super.add(item, repeat);
    }
    /**
     * @see ROT.Scheduler#next
     */
    next() {
        if (this._current && this._repeat.indexOf(this._current) != -1) {
            this._queue.add(this._current, 1 / this._current.getSpeed());
        }
        return super.next();
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/action.js

/**
 * @class Action-based scheduler
 * @augments ROT.Scheduler
 */
class action_Action extends scheduler_Scheduler {
    constructor() {
        super();
        this._defaultDuration = 1; /* for newly added */
        this._duration = this._defaultDuration; /* for this._current */
    }
    /**
     * @param {object} item
     * @param {bool} repeat
     * @param {number} [time=1]
     * @see ROT.Scheduler#add
     */
    add(item, repeat, time) {
        this._queue.add(item, time || this._defaultDuration);
        return super.add(item, repeat);
    }
    clear() {
        this._duration = this._defaultDuration;
        return super.clear();
    }
    remove(item) {
        if (item == this._current) {
            this._duration = this._defaultDuration;
        }
        return super.remove(item);
    }
    /**
     * @see ROT.Scheduler#next
     */
    next() {
        if (this._current && this._repeat.indexOf(this._current) != -1) {
            this._queue.add(this._current, this._duration || this._defaultDuration);
            this._duration = this._defaultDuration;
        }
        return super.next();
    }
    /**
     * Set duration for the active item
     */
    setDuration(time) {
        if (this._current) {
            this._duration = time;
        }
        return this;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/scheduler/index.js



/* harmony default export */ var scheduler = ({ Simple: simple_Simple, Speed: speed_Speed, Action: action_Action });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/fov.js

;
;
class fov_FOV {
    /**
     * @class Abstract FOV algorithm
     * @param {function} lightPassesCallback Does the light pass through x,y?
     * @param {object} [options]
     * @param {int} [options.topology=8] 4/6/8
     */
    constructor(lightPassesCallback, options = {}) {
        this._lightPasses = lightPassesCallback;
        this._options = Object.assign({ topology: 8 }, options);
    }
    /**
     * Return all neighbors in a concentric ring
     * @param {int} cx center-x
     * @param {int} cy center-y
     * @param {int} r range
     */
    _getCircle(cx, cy, r) {
        let result = [];
        let dirs, countFactor, startOffset;
        switch (this._options.topology) {
            case 4:
                countFactor = 1;
                startOffset = [0, 1];
                dirs = [
                    DIRS[8][7],
                    DIRS[8][1],
                    DIRS[8][3],
                    DIRS[8][5]
                ];
                break;
            case 6:
                dirs = DIRS[6];
                countFactor = 1;
                startOffset = [-1, 1];
                break;
            case 8:
                dirs = DIRS[4];
                countFactor = 2;
                startOffset = [-1, 1];
                break;
            default:
                throw new Error("Incorrect topology for FOV computation");
                break;
        }
        /* starting neighbor */
        let x = cx + startOffset[0] * r;
        let y = cy + startOffset[1] * r;
        /* circle */
        for (let i = 0; i < dirs.length; i++) {
            for (let j = 0; j < r * countFactor; j++) {
                result.push([x, y]);
                x += dirs[i][0];
                y += dirs[i][1];
            }
        }
        return result;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/discrete-shadowcasting.js

/**
 * @class Discrete shadowcasting algorithm. Obsoleted by Precise shadowcasting.
 * @augments ROT.FOV
 */
class discrete_shadowcasting_DiscreteShadowcasting extends fov_FOV {
    compute(x, y, R, callback) {
        /* this place is always visible */
        callback(x, y, 0, 1);
        /* standing in a dark place. FIXME is this a good idea?  */
        if (!this._lightPasses(x, y)) {
            return;
        }
        /* start and end angles */
        let DATA = [];
        let A, B, cx, cy, blocks;
        /* analyze surrounding cells in concentric rings, starting from the center */
        for (let r = 1; r <= R; r++) {
            let neighbors = this._getCircle(x, y, r);
            let angle = 360 / neighbors.length;
            for (let i = 0; i < neighbors.length; i++) {
                cx = neighbors[i][0];
                cy = neighbors[i][1];
                A = angle * (i - 0.5);
                B = A + angle;
                blocks = !this._lightPasses(cx, cy);
                if (this._visibleCoords(Math.floor(A), Math.ceil(B), blocks, DATA)) {
                    callback(cx, cy, r, 1);
                }
                if (DATA.length == 2 && DATA[0] == 0 && DATA[1] == 360) {
                    return;
                } /* cutoff? */
            } /* for all cells in this ring */
        } /* for all rings */
    }
    /**
     * @param {int} A start angle
     * @param {int} B end angle
     * @param {bool} blocks Does current cell block visibility?
     * @param {int[][]} DATA shadowed angle pairs
     */
    _visibleCoords(A, B, blocks, DATA) {
        if (A < 0) {
            let v1 = this._visibleCoords(0, B, blocks, DATA);
            let v2 = this._visibleCoords(360 + A, 360, blocks, DATA);
            return v1 || v2;
        }
        let index = 0;
        while (index < DATA.length && DATA[index] < A) {
            index++;
        }
        if (index == DATA.length) { /* completely new shadow */
            if (blocks) {
                DATA.push(A, B);
            }
            return true;
        }
        let count = 0;
        if (index % 2) { /* this shadow starts in an existing shadow, or within its ending boundary */
            while (index < DATA.length && DATA[index] < B) {
                index++;
                count++;
            }
            if (count == 0) {
                return false;
            }
            if (blocks) {
                if (count % 2) {
                    DATA.splice(index - count, count, B);
                }
                else {
                    DATA.splice(index - count, count);
                }
            }
            return true;
        }
        else { /* this shadow starts outside an existing shadow, or within a starting boundary */
            while (index < DATA.length && DATA[index] < B) {
                index++;
                count++;
            }
            /* visible when outside an existing shadow, or when overlapping */
            if (A == DATA[index - count] && count == 1) {
                return false;
            }
            if (blocks) {
                if (count % 2) {
                    DATA.splice(index - count, count, A);
                }
                else {
                    DATA.splice(index - count, count, A, B);
                }
            }
            return true;
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/precise-shadowcasting.js

/**
 * @class Precise shadowcasting algorithm
 * @augments ROT.FOV
 */
class precise_shadowcasting_PreciseShadowcasting extends fov_FOV {
    compute(x, y, R, callback) {
        /* this place is always visible */
        callback(x, y, 0, 1);
        /* standing in a dark place. FIXME is this a good idea?  */
        if (!this._lightPasses(x, y)) {
            return;
        }
        /* list of all shadows */
        let SHADOWS = [];
        let cx, cy, blocks, A1, A2, visibility;
        /* analyze surrounding cells in concentric rings, starting from the center */
        for (let r = 1; r <= R; r++) {
            let neighbors = this._getCircle(x, y, r);
            let neighborCount = neighbors.length;
            for (let i = 0; i < neighborCount; i++) {
                cx = neighbors[i][0];
                cy = neighbors[i][1];
                /* shift half-an-angle backwards to maintain consistency of 0-th cells */
                A1 = [i ? 2 * i - 1 : 2 * neighborCount - 1, 2 * neighborCount];
                A2 = [2 * i + 1, 2 * neighborCount];
                blocks = !this._lightPasses(cx, cy);
                visibility = this._checkVisibility(A1, A2, blocks, SHADOWS);
                if (visibility) {
                    callback(cx, cy, r, visibility);
                }
                if (SHADOWS.length == 2 && SHADOWS[0][0] == 0 && SHADOWS[1][0] == SHADOWS[1][1]) {
                    return;
                } /* cutoff? */
            } /* for all cells in this ring */
        } /* for all rings */
    }
    /**
     * @param {int[2]} A1 arc start
     * @param {int[2]} A2 arc end
     * @param {bool} blocks Does current arc block visibility?
     * @param {int[][]} SHADOWS list of active shadows
     */
    _checkVisibility(A1, A2, blocks, SHADOWS) {
        if (A1[0] > A2[0]) { /* split into two sub-arcs */
            let v1 = this._checkVisibility(A1, [A1[1], A1[1]], blocks, SHADOWS);
            let v2 = this._checkVisibility([0, 1], A2, blocks, SHADOWS);
            return (v1 + v2) / 2;
        }
        /* index1: first shadow >= A1 */
        let index1 = 0, edge1 = false;
        while (index1 < SHADOWS.length) {
            let old = SHADOWS[index1];
            let diff = old[0] * A1[1] - A1[0] * old[1];
            if (diff >= 0) { /* old >= A1 */
                if (diff == 0 && !(index1 % 2)) {
                    edge1 = true;
                }
                break;
            }
            index1++;
        }
        /* index2: last shadow <= A2 */
        let index2 = SHADOWS.length, edge2 = false;
        while (index2--) {
            let old = SHADOWS[index2];
            let diff = A2[0] * old[1] - old[0] * A2[1];
            if (diff >= 0) { /* old <= A2 */
                if (diff == 0 && (index2 % 2)) {
                    edge2 = true;
                }
                break;
            }
        }
        let visible = true;
        if (index1 == index2 && (edge1 || edge2)) { /* subset of existing shadow, one of the edges match */
            visible = false;
        }
        else if (edge1 && edge2 && index1 + 1 == index2 && (index2 % 2)) { /* completely equivalent with existing shadow */
            visible = false;
        }
        else if (index1 > index2 && (index1 % 2)) { /* subset of existing shadow, not touching */
            visible = false;
        }
        if (!visible) {
            return 0;
        } /* fast case: not visible */
        let visibleLength;
        /* compute the length of visible arc, adjust list of shadows (if blocking) */
        let remove = index2 - index1 + 1;
        if (remove % 2) {
            if (index1 % 2) { /* first edge within existing shadow, second outside */
                let P = SHADOWS[index1];
                visibleLength = (A2[0] * P[1] - P[0] * A2[1]) / (P[1] * A2[1]);
                if (blocks) {
                    SHADOWS.splice(index1, remove, A2);
                }
            }
            else { /* second edge within existing shadow, first outside */
                let P = SHADOWS[index2];
                visibleLength = (P[0] * A1[1] - A1[0] * P[1]) / (A1[1] * P[1]);
                if (blocks) {
                    SHADOWS.splice(index1, remove, A1);
                }
            }
        }
        else {
            if (index1 % 2) { /* both edges within existing shadows */
                let P1 = SHADOWS[index1];
                let P2 = SHADOWS[index2];
                visibleLength = (P2[0] * P1[1] - P1[0] * P2[1]) / (P1[1] * P2[1]);
                if (blocks) {
                    SHADOWS.splice(index1, remove);
                }
            }
            else { /* both edges outside existing shadows */
                if (blocks) {
                    SHADOWS.splice(index1, remove, A1, A2);
                }
                return 1; /* whole arc visible! */
            }
        }
        let arcLength = (A2[0] * A1[1] - A1[0] * A2[1]) / (A1[1] * A2[1]);
        return visibleLength / arcLength;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/recursive-shadowcasting.js

/** Octants used for translating recursive shadowcasting offsets */
const OCTANTS = [
    [-1, 0, 0, 1],
    [0, -1, 1, 0],
    [0, -1, -1, 0],
    [-1, 0, 0, -1],
    [1, 0, 0, -1],
    [0, 1, -1, 0],
    [0, 1, 1, 0],
    [1, 0, 0, 1]
];
/**
 * @class Recursive shadowcasting algorithm
 * Currently only supports 4/8 topologies, not hexagonal.
 * Based on Peter Harkins' implementation of Björn Bergström's algorithm described here: http://www.roguebasin.com/index.php?title=FOV_using_recursive_shadowcasting
 * @augments ROT.FOV
 */
class recursive_shadowcasting_RecursiveShadowcasting extends fov_FOV {
    /**
     * Compute visibility for a 360-degree circle
     * @param {int} x
     * @param {int} y
     * @param {int} R Maximum visibility radius
     * @param {function} callback
     */
    compute(x, y, R, callback) {
        //You can always see your own tile
        callback(x, y, 0, 1);
        for (let i = 0; i < OCTANTS.length; i++) {
            this._renderOctant(x, y, OCTANTS[i], R, callback);
        }
    }
    /**
     * Compute visibility for a 180-degree arc
     * @param {int} x
     * @param {int} y
     * @param {int} R Maximum visibility radius
     * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
     * @param {function} callback
     */
    compute180(x, y, R, dir, callback) {
        //You can always see your own tile
        callback(x, y, 0, 1);
        let previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 180 degrees
        let nextPreviousOctant = (dir - 2 + 8) % 8; //Need to retrieve the previous two octants to render a full 180 degrees
        let nextOctant = (dir + 1 + 8) % 8; //Need to grab to next octant to render a full 180 degrees
        this._renderOctant(x, y, OCTANTS[nextPreviousOctant], R, callback);
        this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);
        this._renderOctant(x, y, OCTANTS[dir], R, callback);
        this._renderOctant(x, y, OCTANTS[nextOctant], R, callback);
    }
    ;
    /**
     * Compute visibility for a 90-degree arc
     * @param {int} x
     * @param {int} y
     * @param {int} R Maximum visibility radius
     * @param {int} dir Direction to look in (expressed in a ROT.DIRS value);
     * @param {function} callback
     */
    compute90(x, y, R, dir, callback) {
        //You can always see your own tile
        callback(x, y, 0, 1);
        let previousOctant = (dir - 1 + 8) % 8; //Need to retrieve the previous octant to render a full 90 degrees
        this._renderOctant(x, y, OCTANTS[dir], R, callback);
        this._renderOctant(x, y, OCTANTS[previousOctant], R, callback);
    }
    /**
     * Render one octant (45-degree arc) of the viewshed
     * @param {int} x
     * @param {int} y
     * @param {int} octant Octant to be rendered
     * @param {int} R Maximum visibility radius
     * @param {function} callback
     */
    _renderOctant(x, y, octant, R, callback) {
        //Radius incremented by 1 to provide same coverage area as other shadowcasting radiuses
        this._castVisibility(x, y, 1, 1.0, 0.0, R + 1, octant[0], octant[1], octant[2], octant[3], callback);
    }
    /**
     * Actually calculates the visibility
     * @param {int} startX The starting X coordinate
     * @param {int} startY The starting Y coordinate
     * @param {int} row The row to render
     * @param {float} visSlopeStart The slope to start at
     * @param {float} visSlopeEnd The slope to end at
     * @param {int} radius The radius to reach out to
     * @param {int} xx
     * @param {int} xy
     * @param {int} yx
     * @param {int} yy
     * @param {function} callback The callback to use when we hit a block that is visible
     */
    _castVisibility(startX, startY, row, visSlopeStart, visSlopeEnd, radius, xx, xy, yx, yy, callback) {
        if (visSlopeStart < visSlopeEnd) {
            return;
        }
        for (let i = row; i <= radius; i++) {
            let dx = -i - 1;
            let dy = -i;
            let blocked = false;
            let newStart = 0;
            //'Row' could be column, names here assume octant 0 and would be flipped for half the octants
            while (dx <= 0) {
                dx += 1;
                //Translate from relative coordinates to map coordinates
                let mapX = startX + dx * xx + dy * xy;
                let mapY = startY + dx * yx + dy * yy;
                //Range of the row
                let slopeStart = (dx - 0.5) / (dy + 0.5);
                let slopeEnd = (dx + 0.5) / (dy - 0.5);
                //Ignore if not yet at left edge of Octant
                if (slopeEnd > visSlopeStart) {
                    continue;
                }
                //Done if past right edge
                if (slopeStart < visSlopeEnd) {
                    break;
                }
                //If it's in range, it's visible
                if ((dx * dx + dy * dy) < (radius * radius)) {
                    callback(mapX, mapY, i, 1);
                }
                if (!blocked) {
                    //If tile is a blocking tile, cast around it
                    if (!this._lightPasses(mapX, mapY) && i < radius) {
                        blocked = true;
                        this._castVisibility(startX, startY, i + 1, visSlopeStart, slopeStart, radius, xx, xy, yx, yy, callback);
                        newStart = slopeEnd;
                    }
                }
                else {
                    //Keep narrowing if scanning across a block
                    if (!this._lightPasses(mapX, mapY)) {
                        newStart = slopeEnd;
                        continue;
                    }
                    //Block has ended
                    blocked = false;
                    visSlopeStart = newStart;
                }
            }
            if (blocked) {
                break;
            }
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/fov/index.js



/* harmony default export */ var fov = ({ DiscreteShadowcasting: discrete_shadowcasting_DiscreteShadowcasting, PreciseShadowcasting: precise_shadowcasting_PreciseShadowcasting, RecursiveShadowcasting: recursive_shadowcasting_RecursiveShadowcasting });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/map.js

;
class map_Map {
    /**
     * @class Base map generator
     * @param {int} [width=ROT.DEFAULT_WIDTH]
     * @param {int} [height=ROT.DEFAULT_HEIGHT]
     */
    constructor(width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT) {
        this._width = width;
        this._height = height;
    }
    ;
    _fillMap(value) {
        let map = [];
        for (let i = 0; i < this._width; i++) {
            map.push([]);
            for (let j = 0; j < this._height; j++) {
                map[i].push(value);
            }
        }
        return map;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/arena.js

/**
 * @class Simple empty rectangular room
 * @augments ROT.Map
 */
class arena_Arena extends map_Map {
    create(callback) {
        let w = this._width - 1;
        let h = this._height - 1;
        for (let i = 0; i <= w; i++) {
            for (let j = 0; j <= h; j++) {
                let empty = (i && j && i < w && j < h);
                callback(i, j, empty ? 0 : 1);
            }
        }
        return this;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/dungeon.js

/**
 * @class Dungeon map: has rooms and corridors
 * @augments ROT.Map
 */
class dungeon_Dungeon extends map_Map {
    constructor(width, height) {
        super(width, height);
        this._rooms = [];
        this._corridors = [];
    }
    /**
     * Get all generated rooms
     * @returns {ROT.Map.Feature.Room[]}
     */
    getRooms() { return this._rooms; }
    /**
     * Get all generated corridors
     * @returns {ROT.Map.Feature.Corridor[]}
     */
    getCorridors() { return this._corridors; }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/features.js

;
/**
 * @class Dungeon feature; has own .create() method
 */
class Feature {
}
/**
 * @class Room
 * @augments ROT.Map.Feature
 * @param {int} x1
 * @param {int} y1
 * @param {int} x2
 * @param {int} y2
 * @param {int} [doorX]
 * @param {int} [doorY]
 */
class features_Room extends Feature {
    constructor(x1, y1, x2, y2, doorX, doorY) {
        super();
        this._x1 = x1;
        this._y1 = y1;
        this._x2 = x2;
        this._y2 = y2;
        this._doors = {};
        if (doorX !== undefined && doorY !== undefined) {
            this.addDoor(doorX, doorY);
        }
    }
    ;
    /**
     * Room of random size, with a given doors and direction
     */
    static createRandomAt(x, y, dx, dy, options) {
        let min = options.roomWidth[0];
        let max = options.roomWidth[1];
        let width = rng["a" /* default */].getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        let height = rng["a" /* default */].getUniformInt(min, max);
        if (dx == 1) { /* to the right */
            let y2 = y - Math.floor(rng["a" /* default */].getUniform() * height);
            return new this(x + 1, y2, x + width, y2 + height - 1, x, y);
        }
        if (dx == -1) { /* to the left */
            let y2 = y - Math.floor(rng["a" /* default */].getUniform() * height);
            return new this(x - width, y2, x - 1, y2 + height - 1, x, y);
        }
        if (dy == 1) { /* to the bottom */
            let x2 = x - Math.floor(rng["a" /* default */].getUniform() * width);
            return new this(x2, y + 1, x2 + width - 1, y + height, x, y);
        }
        if (dy == -1) { /* to the top */
            let x2 = x - Math.floor(rng["a" /* default */].getUniform() * width);
            return new this(x2, y - height, x2 + width - 1, y - 1, x, y);
        }
        throw new Error("dx or dy must be 1 or -1");
    }
    /**
     * Room of random size, positioned around center coords
     */
    static createRandomCenter(cx, cy, options) {
        let min = options.roomWidth[0];
        let max = options.roomWidth[1];
        let width = rng["a" /* default */].getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        let height = rng["a" /* default */].getUniformInt(min, max);
        let x1 = cx - Math.floor(rng["a" /* default */].getUniform() * width);
        let y1 = cy - Math.floor(rng["a" /* default */].getUniform() * height);
        let x2 = x1 + width - 1;
        let y2 = y1 + height - 1;
        return new this(x1, y1, x2, y2);
    }
    /**
     * Room of random size within a given dimensions
     */
    static createRandom(availWidth, availHeight, options) {
        let min = options.roomWidth[0];
        let max = options.roomWidth[1];
        let width = rng["a" /* default */].getUniformInt(min, max);
        min = options.roomHeight[0];
        max = options.roomHeight[1];
        let height = rng["a" /* default */].getUniformInt(min, max);
        let left = availWidth - width - 1;
        let top = availHeight - height - 1;
        let x1 = 1 + Math.floor(rng["a" /* default */].getUniform() * left);
        let y1 = 1 + Math.floor(rng["a" /* default */].getUniform() * top);
        let x2 = x1 + width - 1;
        let y2 = y1 + height - 1;
        return new this(x1, y1, x2, y2);
    }
    addDoor(x, y) {
        this._doors[x + "," + y] = 1;
        return this;
    }
    /**
     * @param {function}
     */
    getDoors(cb) {
        for (let key in this._doors) {
            let parts = key.split(",");
            cb(parseInt(parts[0]), parseInt(parts[1]));
        }
        return this;
    }
    clearDoors() {
        this._doors = {};
        return this;
    }
    addDoors(isWallCallback) {
        let left = this._x1 - 1;
        let right = this._x2 + 1;
        let top = this._y1 - 1;
        let bottom = this._y2 + 1;
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                if (x != left && x != right && y != top && y != bottom) {
                    continue;
                }
                if (isWallCallback(x, y)) {
                    continue;
                }
                this.addDoor(x, y);
            }
        }
        return this;
    }
    debug() {
        console.log("room", this._x1, this._y1, this._x2, this._y2);
    }
    isValid(isWallCallback, canBeDugCallback) {
        let left = this._x1 - 1;
        let right = this._x2 + 1;
        let top = this._y1 - 1;
        let bottom = this._y2 + 1;
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                if (x == left || x == right || y == top || y == bottom) {
                    if (!isWallCallback(x, y)) {
                        return false;
                    }
                }
                else {
                    if (!canBeDugCallback(x, y)) {
                        return false;
                    }
                }
            }
        }
        return true;
    }
    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty, 1 = wall, 2 = door. Multiple doors are allowed.
     */
    create(digCallback) {
        let left = this._x1 - 1;
        let right = this._x2 + 1;
        let top = this._y1 - 1;
        let bottom = this._y2 + 1;
        let value = 0;
        for (let x = left; x <= right; x++) {
            for (let y = top; y <= bottom; y++) {
                if (x + "," + y in this._doors) {
                    value = 2;
                }
                else if (x == left || x == right || y == top || y == bottom) {
                    value = 1;
                }
                else {
                    value = 0;
                }
                digCallback(x, y, value);
            }
        }
    }
    getCenter() {
        return [Math.round((this._x1 + this._x2) / 2), Math.round((this._y1 + this._y2) / 2)];
    }
    getLeft() { return this._x1; }
    getRight() { return this._x2; }
    getTop() { return this._y1; }
    getBottom() { return this._y2; }
}
/**
 * @class Corridor
 * @augments ROT.Map.Feature
 * @param {int} startX
 * @param {int} startY
 * @param {int} endX
 * @param {int} endY
 */
class features_Corridor extends Feature {
    constructor(startX, startY, endX, endY) {
        super();
        this._startX = startX;
        this._startY = startY;
        this._endX = endX;
        this._endY = endY;
        this._endsWithAWall = true;
    }
    static createRandomAt(x, y, dx, dy, options) {
        let min = options.corridorLength[0];
        let max = options.corridorLength[1];
        let length = rng["a" /* default */].getUniformInt(min, max);
        return new this(x, y, x + dx * length, y + dy * length);
    }
    debug() {
        console.log("corridor", this._startX, this._startY, this._endX, this._endY);
    }
    isValid(isWallCallback, canBeDugCallback) {
        let sx = this._startX;
        let sy = this._startY;
        let dx = this._endX - sx;
        let dy = this._endY - sy;
        let length = 1 + Math.max(Math.abs(dx), Math.abs(dy));
        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        let nx = dy;
        let ny = -dx;
        let ok = true;
        for (let i = 0; i < length; i++) {
            let x = sx + i * dx;
            let y = sy + i * dy;
            if (!canBeDugCallback(x, y)) {
                ok = false;
            }
            if (!isWallCallback(x + nx, y + ny)) {
                ok = false;
            }
            if (!isWallCallback(x - nx, y - ny)) {
                ok = false;
            }
            if (!ok) {
                length = i;
                this._endX = x - dx;
                this._endY = y - dy;
                break;
            }
        }
        /**
         * If the length degenerated, this corridor might be invalid
         */
        /* not supported */
        if (length == 0) {
            return false;
        }
        /* length 1 allowed only if the next space is empty */
        if (length == 1 && isWallCallback(this._endX + dx, this._endY + dy)) {
            return false;
        }
        /**
         * We do not want the corridor to crash into a corner of a room;
         * if any of the ending corners is empty, the N+1th cell of this corridor must be empty too.
         *
         * Situation:
         * #######1
         * .......?
         * #######2
         *
         * The corridor was dug from left to right.
         * 1, 2 - problematic corners, ? = N+1th cell (not dug)
         */
        let firstCornerBad = !isWallCallback(this._endX + dx + nx, this._endY + dy + ny);
        let secondCornerBad = !isWallCallback(this._endX + dx - nx, this._endY + dy - ny);
        this._endsWithAWall = isWallCallback(this._endX + dx, this._endY + dy);
        if ((firstCornerBad || secondCornerBad) && this._endsWithAWall) {
            return false;
        }
        return true;
    }
    /**
     * @param {function} digCallback Dig callback with a signature (x, y, value). Values: 0 = empty.
     */
    create(digCallback) {
        let sx = this._startX;
        let sy = this._startY;
        let dx = this._endX - sx;
        let dy = this._endY - sy;
        let length = 1 + Math.max(Math.abs(dx), Math.abs(dy));
        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        for (let i = 0; i < length; i++) {
            let x = sx + i * dx;
            let y = sy + i * dy;
            digCallback(x, y, 0);
        }
        return true;
    }
    createPriorityWalls(priorityWallCallback) {
        if (!this._endsWithAWall) {
            return;
        }
        let sx = this._startX;
        let sy = this._startY;
        let dx = this._endX - sx;
        let dy = this._endY - sy;
        if (dx) {
            dx = dx / Math.abs(dx);
        }
        if (dy) {
            dy = dy / Math.abs(dy);
        }
        let nx = dy;
        let ny = -dx;
        priorityWallCallback(this._endX + dx, this._endY + dy);
        priorityWallCallback(this._endX + nx, this._endY + ny);
        priorityWallCallback(this._endX - nx, this._endY - ny);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/uniform.js



;
/**
 * @class Dungeon generator which tries to fill the space evenly. Generates independent rooms and tries to connect them.
 * @augments ROT.Map.Dungeon
 */
class uniform_Uniform extends dungeon_Dungeon {
    constructor(width, height, options) {
        super(width, height);
        this._options = {
            roomWidth: [3, 9],
            roomHeight: [3, 5],
            roomDugPercentage: 0.1,
            timeLimit: 1000 /* we stop after this much time has passed (msec) */
        };
        Object.assign(this._options, options);
        this._map = [];
        this._dug = 0;
        this._roomAttempts = 20; /* new room is created N-times until is considered as impossible to generate */
        this._corridorAttempts = 20; /* corridors are tried N-times until the level is considered as impossible to connect */
        this._connected = []; /* list of already connected rooms */
        this._unconnected = []; /* list of remaining unconnected rooms */
        this._digCallback = this._digCallback.bind(this);
        this._canBeDugCallback = this._canBeDugCallback.bind(this);
        this._isWallCallback = this._isWallCallback.bind(this);
    }
    /**
     * Create a map. If the time limit has been hit, returns null.
     * @see ROT.Map#create
     */
    create(callback) {
        let t1 = Date.now();
        while (1) {
            let t2 = Date.now();
            if (t2 - t1 > this._options.timeLimit) {
                return null;
            } /* time limit! */
            this._map = this._fillMap(1);
            this._dug = 0;
            this._rooms = [];
            this._unconnected = [];
            this._generateRooms();
            if (this._rooms.length < 2) {
                continue;
            }
            if (this._generateCorridors()) {
                break;
            }
        }
        if (callback) {
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    callback(i, j, this._map[i][j]);
                }
            }
        }
        return this;
    }
    /**
     * Generates a suitable amount of rooms
     */
    _generateRooms() {
        let w = this._width - 2;
        let h = this._height - 2;
        let room;
        do {
            room = this._generateRoom();
            if (this._dug / (w * h) > this._options.roomDugPercentage) {
                break;
            } /* achieved requested amount of free space */
        } while (room);
        /* either enough rooms, or not able to generate more of them :) */
    }
    /**
     * Try to generate one room
     */
    _generateRoom() {
        let count = 0;
        while (count < this._roomAttempts) {
            count++;
            let room = features_Room.createRandom(this._width, this._height, this._options);
            if (!room.isValid(this._isWallCallback, this._canBeDugCallback)) {
                continue;
            }
            room.create(this._digCallback);
            this._rooms.push(room);
            return room;
        }
        /* no room was generated in a given number of attempts */
        return null;
    }
    /**
     * Generates connectors beween rooms
     * @returns {bool} success Was this attempt successfull?
     */
    _generateCorridors() {
        let cnt = 0;
        while (cnt < this._corridorAttempts) {
            cnt++;
            this._corridors = [];
            /* dig rooms into a clear map */
            this._map = this._fillMap(1);
            for (let i = 0; i < this._rooms.length; i++) {
                let room = this._rooms[i];
                room.clearDoors();
                room.create(this._digCallback);
            }
            this._unconnected = rng["a" /* default */].shuffle(this._rooms.slice());
            this._connected = [];
            if (this._unconnected.length) {
                this._connected.push(this._unconnected.pop());
            } /* first one is always connected */
            while (1) {
                /* 1. pick random connected room */
                let connected = rng["a" /* default */].getItem(this._connected);
                if (!connected) {
                    break;
                }
                /* 2. find closest unconnected */
                let room1 = this._closestRoom(this._unconnected, connected);
                if (!room1) {
                    break;
                }
                /* 3. connect it to closest connected */
                let room2 = this._closestRoom(this._connected, room1);
                if (!room2) {
                    break;
                }
                let ok = this._connectRooms(room1, room2);
                if (!ok) {
                    break;
                } /* stop connecting, re-shuffle */
                if (!this._unconnected.length) {
                    return true;
                } /* done; no rooms remain */
            }
        }
        return false;
    }
    ;
    /**
     * For a given room, find the closest one from the list
     */
    _closestRoom(rooms, room) {
        let dist = Infinity;
        let center = room.getCenter();
        let result = null;
        for (let i = 0; i < rooms.length; i++) {
            let r = rooms[i];
            let c = r.getCenter();
            let dx = c[0] - center[0];
            let dy = c[1] - center[1];
            let d = dx * dx + dy * dy;
            if (d < dist) {
                dist = d;
                result = r;
            }
        }
        return result;
    }
    _connectRooms(room1, room2) {
        /*
            room1.debug();
            room2.debug();
        */
        let center1 = room1.getCenter();
        let center2 = room2.getCenter();
        let diffX = center2[0] - center1[0];
        let diffY = center2[1] - center1[1];
        let start;
        let end;
        let dirIndex1, dirIndex2, min, max, index;
        if (Math.abs(diffX) < Math.abs(diffY)) { /* first try connecting north-south walls */
            dirIndex1 = (diffY > 0 ? 2 : 0);
            dirIndex2 = (dirIndex1 + 2) % 4;
            min = room2.getLeft();
            max = room2.getRight();
            index = 0;
        }
        else { /* first try connecting east-west walls */
            dirIndex1 = (diffX > 0 ? 1 : 3);
            dirIndex2 = (dirIndex1 + 2) % 4;
            min = room2.getTop();
            max = room2.getBottom();
            index = 1;
        }
        start = this._placeInWall(room1, dirIndex1); /* corridor will start here */
        if (!start) {
            return false;
        }
        if (start[index] >= min && start[index] <= max) { /* possible to connect with straight line (I-like) */
            end = start.slice();
            let value = 0;
            switch (dirIndex2) {
                case 0:
                    value = room2.getTop() - 1;
                    break;
                case 1:
                    value = room2.getRight() + 1;
                    break;
                case 2:
                    value = room2.getBottom() + 1;
                    break;
                case 3:
                    value = room2.getLeft() - 1;
                    break;
            }
            end[(index + 1) % 2] = value;
            this._digLine([start, end]);
        }
        else if (start[index] < min - 1 || start[index] > max + 1) { /* need to switch target wall (L-like) */
            let diff = start[index] - center2[index];
            let rotation = 0;
            switch (dirIndex2) {
                case 0:
                case 1:
                    rotation = (diff < 0 ? 3 : 1);
                    break;
                case 2:
                case 3:
                    rotation = (diff < 0 ? 1 : 3);
                    break;
            }
            dirIndex2 = (dirIndex2 + rotation) % 4;
            end = this._placeInWall(room2, dirIndex2);
            if (!end) {
                return false;
            }
            let mid = [0, 0];
            mid[index] = start[index];
            let index2 = (index + 1) % 2;
            mid[index2] = end[index2];
            this._digLine([start, mid, end]);
        }
        else { /* use current wall pair, but adjust the line in the middle (S-like) */
            let index2 = (index + 1) % 2;
            end = this._placeInWall(room2, dirIndex2);
            if (!end) {
                return false;
            }
            let mid = Math.round((end[index2] + start[index2]) / 2);
            let mid1 = [0, 0];
            let mid2 = [0, 0];
            mid1[index] = start[index];
            mid1[index2] = mid;
            mid2[index] = end[index];
            mid2[index2] = mid;
            this._digLine([start, mid1, mid2, end]);
        }
        room1.addDoor(start[0], start[1]);
        room2.addDoor(end[0], end[1]);
        index = this._unconnected.indexOf(room1);
        if (index != -1) {
            this._unconnected.splice(index, 1);
            this._connected.push(room1);
        }
        index = this._unconnected.indexOf(room2);
        if (index != -1) {
            this._unconnected.splice(index, 1);
            this._connected.push(room2);
        }
        return true;
    }
    _placeInWall(room, dirIndex) {
        let start = [0, 0];
        let dir = [0, 0];
        let length = 0;
        switch (dirIndex) {
            case 0:
                dir = [1, 0];
                start = [room.getLeft(), room.getTop() - 1];
                length = room.getRight() - room.getLeft() + 1;
                break;
            case 1:
                dir = [0, 1];
                start = [room.getRight() + 1, room.getTop()];
                length = room.getBottom() - room.getTop() + 1;
                break;
            case 2:
                dir = [1, 0];
                start = [room.getLeft(), room.getBottom() + 1];
                length = room.getRight() - room.getLeft() + 1;
                break;
            case 3:
                dir = [0, 1];
                start = [room.getLeft() - 1, room.getTop()];
                length = room.getBottom() - room.getTop() + 1;
                break;
        }
        let avail = [];
        let lastBadIndex = -2;
        for (let i = 0; i < length; i++) {
            let x = start[0] + i * dir[0];
            let y = start[1] + i * dir[1];
            avail.push(null);
            let isWall = (this._map[x][y] == 1);
            if (isWall) {
                if (lastBadIndex != i - 1) {
                    avail[i] = [x, y];
                }
            }
            else {
                lastBadIndex = i;
                if (i) {
                    avail[i - 1] = null;
                }
            }
        }
        for (let i = avail.length - 1; i >= 0; i--) {
            if (!avail[i]) {
                avail.splice(i, 1);
            }
        }
        return (avail.length ? rng["a" /* default */].getItem(avail) : null);
    }
    /**
     * Dig a polyline.
     */
    _digLine(points) {
        for (let i = 1; i < points.length; i++) {
            let start = points[i - 1];
            let end = points[i];
            let corridor = new features_Corridor(start[0], start[1], end[0], end[1]);
            corridor.create(this._digCallback);
            this._corridors.push(corridor);
        }
    }
    _digCallback(x, y, value) {
        this._map[x][y] = value;
        if (value == 0) {
            this._dug++;
        }
    }
    _isWallCallback(x, y) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
    _canBeDugCallback(x, y) {
        if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/cellular.js



;
/**
 * @class Cellular automaton map generator
 * @augments ROT.Map
 * @param {int} [width=ROT.DEFAULT_WIDTH]
 * @param {int} [height=ROT.DEFAULT_HEIGHT]
 * @param {object} [options] Options
 * @param {int[]} [options.born] List of neighbor counts for a new cell to be born in empty space
 * @param {int[]} [options.survive] List of neighbor counts for an existing  cell to survive
 * @param {int} [options.topology] Topology 4 or 6 or 8
 */
class cellular_Cellular extends map_Map {
    constructor(width, height, options = {}) {
        super(width, height);
        this._options = {
            born: [5, 6, 7, 8],
            survive: [4, 5, 6, 7, 8],
            topology: 8
        };
        this.setOptions(options);
        this._dirs = DIRS[this._options.topology];
        this._map = this._fillMap(0);
    }
    /**
     * Fill the map with random values
     * @param {float} probability Probability for a cell to become alive; 0 = all empty, 1 = all full
     */
    randomize(probability) {
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                this._map[i][j] = (rng["a" /* default */].getUniform() < probability ? 1 : 0);
            }
        }
        return this;
    }
    /**
     * Change options.
     * @see ROT.Map.Cellular
     */
    setOptions(options) { Object.assign(this._options, options); }
    set(x, y, value) { this._map[x][y] = value; }
    create(callback) {
        let newMap = this._fillMap(0);
        let born = this._options.born;
        let survive = this._options.survive;
        for (let j = 0; j < this._height; j++) {
            let widthStep = 1;
            let widthStart = 0;
            if (this._options.topology == 6) {
                widthStep = 2;
                widthStart = j % 2;
            }
            for (let i = widthStart; i < this._width; i += widthStep) {
                let cur = this._map[i][j];
                let ncount = this._getNeighbors(i, j);
                if (cur && survive.indexOf(ncount) != -1) { /* survive */
                    newMap[i][j] = 1;
                }
                else if (!cur && born.indexOf(ncount) != -1) { /* born */
                    newMap[i][j] = 1;
                }
            }
        }
        this._map = newMap;
        callback && this._serviceCallback(callback);
    }
    _serviceCallback(callback) {
        for (let j = 0; j < this._height; j++) {
            let widthStep = 1;
            let widthStart = 0;
            if (this._options.topology == 6) {
                widthStep = 2;
                widthStart = j % 2;
            }
            for (let i = widthStart; i < this._width; i += widthStep) {
                callback(i, j, this._map[i][j]);
            }
        }
    }
    /**
     * Get neighbor count at [i,j] in this._map
     */
    _getNeighbors(cx, cy) {
        let result = 0;
        for (let i = 0; i < this._dirs.length; i++) {
            let dir = this._dirs[i];
            let x = cx + dir[0];
            let y = cy + dir[1];
            if (x < 0 || x >= this._width || y < 0 || y >= this._height) {
                continue;
            }
            result += (this._map[x][y] == 1 ? 1 : 0);
        }
        return result;
    }
    /**
     * Make sure every non-wall space is accessible.
     * @param {function} callback to call to display map when do
     * @param {int} value to consider empty space - defaults to 0
     * @param {function} callback to call when a new connection is made
     */
    connect(callback, value, connectionCallback) {
        if (!value)
            value = 0;
        let allFreeSpace = [];
        let notConnected = {};
        // find all free space
        let widthStep = 1;
        let widthStarts = [0, 0];
        if (this._options.topology == 6) {
            widthStep = 2;
            widthStarts = [0, 1];
        }
        for (let y = 0; y < this._height; y++) {
            for (let x = widthStarts[y % 2]; x < this._width; x += widthStep) {
                if (this._freeSpace(x, y, value)) {
                    let p = [x, y];
                    notConnected[this._pointKey(p)] = p;
                    allFreeSpace.push([x, y]);
                }
            }
        }
        let start = allFreeSpace[rng["a" /* default */].getUniformInt(0, allFreeSpace.length - 1)];
        let key = this._pointKey(start);
        let connected = {};
        connected[key] = start;
        delete notConnected[key];
        // find what's connected to the starting point
        this._findConnected(connected, notConnected, [start], false, value);
        while (Object.keys(notConnected).length > 0) {
            // find two points from notConnected to connected
            let p = this._getFromTo(connected, notConnected);
            let from = p[0]; // notConnected
            let to = p[1]; // connected
            // find everything connected to the starting point
            let local = {};
            local[this._pointKey(from)] = from;
            this._findConnected(local, notConnected, [from], true, value);
            // connect to a connected cell
            let tunnelFn = (this._options.topology == 6 ? this._tunnelToConnected6 : this._tunnelToConnected);
            tunnelFn.call(this, to, from, connected, notConnected, value, connectionCallback);
            // now all of local is connected
            for (let k in local) {
                let pp = local[k];
                this._map[pp[0]][pp[1]] = value;
                connected[k] = pp;
                delete notConnected[k];
            }
        }
        callback && this._serviceCallback(callback);
    }
    /**
     * Find random points to connect. Search for the closest point in the larger space.
     * This is to minimize the length of the passage while maintaining good performance.
     */
    _getFromTo(connected, notConnected) {
        let from = [0, 0], to = [0, 0], d;
        let connectedKeys = Object.keys(connected);
        let notConnectedKeys = Object.keys(notConnected);
        for (let i = 0; i < 5; i++) {
            if (connectedKeys.length < notConnectedKeys.length) {
                let keys = connectedKeys;
                to = connected[keys[rng["a" /* default */].getUniformInt(0, keys.length - 1)]];
                from = this._getClosest(to, notConnected);
            }
            else {
                let keys = notConnectedKeys;
                from = notConnected[keys[rng["a" /* default */].getUniformInt(0, keys.length - 1)]];
                to = this._getClosest(from, connected);
            }
            d = (from[0] - to[0]) * (from[0] - to[0]) + (from[1] - to[1]) * (from[1] - to[1]);
            if (d < 64) {
                break;
            }
        }
        // console.log(">>> connected=" + to + " notConnected=" + from + " dist=" + d);
        return [from, to];
    }
    _getClosest(point, space) {
        let minPoint = null;
        let minDist = null;
        for (let k in space) {
            let p = space[k];
            let d = (p[0] - point[0]) * (p[0] - point[0]) + (p[1] - point[1]) * (p[1] - point[1]);
            if (minDist == null || d < minDist) {
                minDist = d;
                minPoint = p;
            }
        }
        return minPoint;
    }
    _findConnected(connected, notConnected, stack, keepNotConnected, value) {
        while (stack.length > 0) {
            let p = stack.splice(0, 1)[0];
            let tests;
            if (this._options.topology == 6) {
                tests = [
                    [p[0] + 2, p[1]],
                    [p[0] + 1, p[1] - 1],
                    [p[0] - 1, p[1] - 1],
                    [p[0] - 2, p[1]],
                    [p[0] - 1, p[1] + 1],
                    [p[0] + 1, p[1] + 1],
                ];
            }
            else {
                tests = [
                    [p[0] + 1, p[1]],
                    [p[0] - 1, p[1]],
                    [p[0], p[1] + 1],
                    [p[0], p[1] - 1]
                ];
            }
            for (let i = 0; i < tests.length; i++) {
                let key = this._pointKey(tests[i]);
                if (connected[key] == null && this._freeSpace(tests[i][0], tests[i][1], value)) {
                    connected[key] = tests[i];
                    if (!keepNotConnected) {
                        delete notConnected[key];
                    }
                    stack.push(tests[i]);
                }
            }
        }
    }
    _tunnelToConnected(to, from, connected, notConnected, value, connectionCallback) {
        let a, b;
        if (from[0] < to[0]) {
            a = from;
            b = to;
        }
        else {
            a = to;
            b = from;
        }
        for (let xx = a[0]; xx <= b[0]; xx++) {
            this._map[xx][a[1]] = value;
            let p = [xx, a[1]];
            let pkey = this._pointKey(p);
            connected[pkey] = p;
            delete notConnected[pkey];
        }
        if (connectionCallback && a[0] < b[0]) {
            connectionCallback(a, [b[0], a[1]]);
        }
        // x is now fixed
        let x = b[0];
        if (from[1] < to[1]) {
            a = from;
            b = to;
        }
        else {
            a = to;
            b = from;
        }
        for (let yy = a[1]; yy < b[1]; yy++) {
            this._map[x][yy] = value;
            let p = [x, yy];
            let pkey = this._pointKey(p);
            connected[pkey] = p;
            delete notConnected[pkey];
        }
        if (connectionCallback && a[1] < b[1]) {
            connectionCallback([b[0], a[1]], [b[0], b[1]]);
        }
    }
    _tunnelToConnected6(to, from, connected, notConnected, value, connectionCallback) {
        let a, b;
        if (from[0] < to[0]) {
            a = from;
            b = to;
        }
        else {
            a = to;
            b = from;
        }
        // tunnel diagonally until horizontally level
        let xx = a[0];
        let yy = a[1];
        while (!(xx == b[0] && yy == b[1])) {
            let stepWidth = 2;
            if (yy < b[1]) {
                yy++;
                stepWidth = 1;
            }
            else if (yy > b[1]) {
                yy--;
                stepWidth = 1;
            }
            if (xx < b[0]) {
                xx += stepWidth;
            }
            else if (xx > b[0]) {
                xx -= stepWidth;
            }
            else if (b[1] % 2) {
                // Won't step outside map if destination on is map's right edge
                xx -= stepWidth;
            }
            else {
                // ditto for left edge
                xx += stepWidth;
            }
            this._map[xx][yy] = value;
            let p = [xx, yy];
            let pkey = this._pointKey(p);
            connected[pkey] = p;
            delete notConnected[pkey];
        }
        if (connectionCallback) {
            connectionCallback(from, to);
        }
    }
    _freeSpace(x, y, value) {
        return x >= 0 && x < this._width && y >= 0 && y < this._height && this._map[x][y] == value;
    }
    _pointKey(p) { return p[0] + "." + p[1]; }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/digger.js




const FEATURES = {
    "room": features_Room,
    "corridor": features_Corridor
};
/**
 * Random dungeon generator using human-like digging patterns.
 * Heavily based on Mike Anderson's ideas from the "Tyrant" algo, mentioned at
 * http://www.roguebasin.roguelikedevelopment.org/index.php?title=Dungeon-Building_Algorithm.
 */
class digger_Digger extends dungeon_Dungeon {
    constructor(width, height, options = {}) {
        super(width, height);
        this._options = Object.assign({
            roomWidth: [3, 9],
            roomHeight: [3, 5],
            corridorLength: [3, 10],
            dugPercentage: 0.2,
            timeLimit: 1000 /* we stop after this much time has passed (msec) */
        }, options);
        this._features = {
            "room": 4,
            "corridor": 4
        };
        this._map = [];
        this._featureAttempts = 20; /* how many times do we try to create a feature on a suitable wall */
        this._walls = {}; /* these are available for digging */
        this._dug = 0;
        this._digCallback = this._digCallback.bind(this);
        this._canBeDugCallback = this._canBeDugCallback.bind(this);
        this._isWallCallback = this._isWallCallback.bind(this);
        this._priorityWallCallback = this._priorityWallCallback.bind(this);
    }
    create(callback) {
        this._rooms = [];
        this._corridors = [];
        this._map = this._fillMap(1);
        this._walls = {};
        this._dug = 0;
        let area = (this._width - 2) * (this._height - 2);
        this._firstRoom();
        let t1 = Date.now();
        let priorityWalls;
        do {
            priorityWalls = 0;
            let t2 = Date.now();
            if (t2 - t1 > this._options.timeLimit) {
                break;
            }
            /* find a good wall */
            let wall = this._findWall();
            if (!wall) {
                break;
            } /* no more walls */
            let parts = wall.split(",");
            let x = parseInt(parts[0]);
            let y = parseInt(parts[1]);
            let dir = this._getDiggingDirection(x, y);
            if (!dir) {
                continue;
            } /* this wall is not suitable */
            //		console.log("wall", x, y);
            /* try adding a feature */
            let featureAttempts = 0;
            do {
                featureAttempts++;
                if (this._tryFeature(x, y, dir[0], dir[1])) { /* feature added */
                    //if (this._rooms.length + this._corridors.length == 2) { this._rooms[0].addDoor(x, y); } /* first room oficially has doors */
                    this._removeSurroundingWalls(x, y);
                    this._removeSurroundingWalls(x - dir[0], y - dir[1]);
                    break;
                }
            } while (featureAttempts < this._featureAttempts);
            for (let id in this._walls) {
                if (this._walls[id] > 1) {
                    priorityWalls++;
                }
            }
        } while (this._dug / area < this._options.dugPercentage || priorityWalls); /* fixme number of priority walls */
        this._addDoors();
        if (callback) {
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    callback(i, j, this._map[i][j]);
                }
            }
        }
        this._walls = {};
        this._map = [];
        return this;
    }
    _digCallback(x, y, value) {
        if (value == 0 || value == 2) { /* empty */
            this._map[x][y] = 0;
            this._dug++;
        }
        else { /* wall */
            this._walls[x + "," + y] = 1;
        }
    }
    _isWallCallback(x, y) {
        if (x < 0 || y < 0 || x >= this._width || y >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
    _canBeDugCallback(x, y) {
        if (x < 1 || y < 1 || x + 1 >= this._width || y + 1 >= this._height) {
            return false;
        }
        return (this._map[x][y] == 1);
    }
    _priorityWallCallback(x, y) { this._walls[x + "," + y] = 2; }
    ;
    _firstRoom() {
        let cx = Math.floor(this._width / 2);
        let cy = Math.floor(this._height / 2);
        let room = features_Room.createRandomCenter(cx, cy, this._options);
        this._rooms.push(room);
        room.create(this._digCallback);
    }
    /**
     * Get a suitable wall
     */
    _findWall() {
        let prio1 = [];
        let prio2 = [];
        for (let id in this._walls) {
            let prio = this._walls[id];
            if (prio == 2) {
                prio2.push(id);
            }
            else {
                prio1.push(id);
            }
        }
        let arr = (prio2.length ? prio2 : prio1);
        if (!arr.length) {
            return null;
        } /* no walls :/ */
        let id = rng["a" /* default */].getItem(arr.sort()); // sort to make the order deterministic
        delete this._walls[id];
        return id;
    }
    /**
     * Tries adding a feature
     * @returns {bool} was this a successful try?
     */
    _tryFeature(x, y, dx, dy) {
        let featureName = rng["a" /* default */].getWeightedValue(this._features);
        let ctor = FEATURES[featureName];
        let feature = ctor.createRandomAt(x, y, dx, dy, this._options);
        if (!feature.isValid(this._isWallCallback, this._canBeDugCallback)) {
            //		console.log("not valid");
            //		feature.debug();
            return false;
        }
        feature.create(this._digCallback);
        //	feature.debug();
        if (feature instanceof features_Room) {
            this._rooms.push(feature);
        }
        if (feature instanceof features_Corridor) {
            feature.createPriorityWalls(this._priorityWallCallback);
            this._corridors.push(feature);
        }
        return true;
    }
    _removeSurroundingWalls(cx, cy) {
        let deltas = DIRS[4];
        for (let i = 0; i < deltas.length; i++) {
            let delta = deltas[i];
            let x = cx + delta[0];
            let y = cy + delta[1];
            delete this._walls[x + "," + y];
            x = cx + 2 * delta[0];
            y = cy + 2 * delta[1];
            delete this._walls[x + "," + y];
        }
    }
    /**
     * Returns vector in "digging" direction, or false, if this does not exist (or is not unique)
     */
    _getDiggingDirection(cx, cy) {
        if (cx <= 0 || cy <= 0 || cx >= this._width - 1 || cy >= this._height - 1) {
            return null;
        }
        let result = null;
        let deltas = DIRS[4];
        for (let i = 0; i < deltas.length; i++) {
            let delta = deltas[i];
            let x = cx + delta[0];
            let y = cy + delta[1];
            if (!this._map[x][y]) { /* there already is another empty neighbor! */
                if (result) {
                    return null;
                }
                result = delta;
            }
        }
        /* no empty neighbor */
        if (!result) {
            return null;
        }
        return [-result[0], -result[1]];
    }
    /**
     * Find empty spaces surrounding rooms, and apply doors.
     */
    _addDoors() {
        let data = this._map;
        function isWallCallback(x, y) {
            return (data[x][y] == 1);
        }
        ;
        for (let i = 0; i < this._rooms.length; i++) {
            let room = this._rooms[i];
            room.clearDoors();
            room.addDoors(isWallCallback);
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/ellermaze.js


/**
 * Join lists with "i" and "i+1"
 */
function addToList(i, L, R) {
    R[L[i + 1]] = R[i];
    L[R[i]] = L[i + 1];
    R[i] = i + 1;
    L[i + 1] = i;
}
/**
 * Remove "i" from its list
 */
function removeFromList(i, L, R) {
    R[L[i]] = R[i];
    L[R[i]] = L[i];
    R[i] = i;
    L[i] = i;
}
/**
 * Maze generator - Eller's algorithm
 * See http://homepages.cwi.nl/~tromp/maze.html for explanation
 */
class ellermaze_EllerMaze extends map_Map {
    create(callback) {
        let map = this._fillMap(1);
        let w = Math.ceil((this._width - 2) / 2);
        let rand = 9 / 24;
        let L = [];
        let R = [];
        for (let i = 0; i < w; i++) {
            L.push(i);
            R.push(i);
        }
        L.push(w - 1); /* fake stop-block at the right side */
        let j;
        for (j = 1; j + 3 < this._height; j += 2) {
            /* one row */
            for (let i = 0; i < w; i++) {
                /* cell coords (will be always empty) */
                let x = 2 * i + 1;
                let y = j;
                map[x][y] = 0;
                /* right connection */
                if (i != L[i + 1] && rng["a" /* default */].getUniform() > rand) {
                    addToList(i, L, R);
                    map[x + 1][y] = 0;
                }
                /* bottom connection */
                if (i != L[i] && rng["a" /* default */].getUniform() > rand) {
                    /* remove connection */
                    removeFromList(i, L, R);
                }
                else {
                    /* create connection */
                    map[x][y + 1] = 0;
                }
            }
        }
        /* last row */
        for (let i = 0; i < w; i++) {
            /* cell coords (will be always empty) */
            let x = 2 * i + 1;
            let y = j;
            map[x][y] = 0;
            /* right connection */
            if (i != L[i + 1] && (i == L[i] || rng["a" /* default */].getUniform() > rand)) {
                /* dig right also if the cell is separated, so it gets connected to the rest of maze */
                addToList(i, L, R);
                map[x + 1][y] = 0;
            }
            removeFromList(i, L, R);
        }
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                callback(i, j, map[i][j]);
            }
        }
        return this;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/dividedmaze.js


/**
 * @class Recursively divided maze, http://en.wikipedia.org/wiki/Maze_generation_algorithm#Recursive_division_method
 * @augments ROT.Map
 */
class dividedmaze_DividedMaze extends map_Map {
    constructor() {
        super(...arguments);
        this._stack = [];
        this._map = [];
    }
    create(callback) {
        let w = this._width;
        let h = this._height;
        this._map = [];
        for (let i = 0; i < w; i++) {
            this._map.push([]);
            for (let j = 0; j < h; j++) {
                let border = (i == 0 || j == 0 || i + 1 == w || j + 1 == h);
                this._map[i].push(border ? 1 : 0);
            }
        }
        this._stack = [
            [1, 1, w - 2, h - 2]
        ];
        this._process();
        for (let i = 0; i < w; i++) {
            for (let j = 0; j < h; j++) {
                callback(i, j, this._map[i][j]);
            }
        }
        this._map = [];
        return this;
    }
    _process() {
        while (this._stack.length) {
            let room = this._stack.shift(); /* [left, top, right, bottom] */
            this._partitionRoom(room);
        }
    }
    _partitionRoom(room) {
        let availX = [];
        let availY = [];
        for (let i = room[0] + 1; i < room[2]; i++) {
            let top = this._map[i][room[1] - 1];
            let bottom = this._map[i][room[3] + 1];
            if (top && bottom && !(i % 2)) {
                availX.push(i);
            }
        }
        for (let j = room[1] + 1; j < room[3]; j++) {
            let left = this._map[room[0] - 1][j];
            let right = this._map[room[2] + 1][j];
            if (left && right && !(j % 2)) {
                availY.push(j);
            }
        }
        if (!availX.length || !availY.length) {
            return;
        }
        let x = rng["a" /* default */].getItem(availX);
        let y = rng["a" /* default */].getItem(availY);
        this._map[x][y] = 1;
        let walls = [];
        let w = [];
        walls.push(w); /* left part */
        for (let i = room[0]; i < x; i++) {
            this._map[i][y] = 1;
            w.push([i, y]);
        }
        w = [];
        walls.push(w); /* right part */
        for (let i = x + 1; i <= room[2]; i++) {
            this._map[i][y] = 1;
            w.push([i, y]);
        }
        w = [];
        walls.push(w); /* top part */
        for (let j = room[1]; j < y; j++) {
            this._map[x][j] = 1;
            w.push([x, j]);
        }
        w = [];
        walls.push(w); /* bottom part */
        for (let j = y + 1; j <= room[3]; j++) {
            this._map[x][j] = 1;
            w.push([x, j]);
        }
        let solid = rng["a" /* default */].getItem(walls);
        for (let i = 0; i < walls.length; i++) {
            let w = walls[i];
            if (w == solid) {
                continue;
            }
            let hole = rng["a" /* default */].getItem(w);
            this._map[hole[0]][hole[1]] = 0;
        }
        this._stack.push([room[0], room[1], x - 1, y - 1]); /* left top */
        this._stack.push([x + 1, room[1], room[2], y - 1]); /* right top */
        this._stack.push([room[0], y + 1, x - 1, room[3]]); /* left bottom */
        this._stack.push([x + 1, y + 1, room[2], room[3]]); /* right bottom */
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/iceymaze.js


/**
 * Icey's Maze generator
 * See http://www.roguebasin.roguelikedevelopment.org/index.php?title=Simple_maze for explanation
 */
class iceymaze_IceyMaze extends map_Map {
    constructor(width, height, regularity = 0) {
        super(width, height);
        this._regularity = regularity;
        this._map = [];
    }
    create(callback) {
        let width = this._width;
        let height = this._height;
        let map = this._fillMap(1);
        width -= (width % 2 ? 1 : 2);
        height -= (height % 2 ? 1 : 2);
        let cx = 0;
        let cy = 0;
        let nx = 0;
        let ny = 0;
        let done = 0;
        let blocked = false;
        let dirs = [
            [0, 0],
            [0, 0],
            [0, 0],
            [0, 0]
        ];
        do {
            cx = 1 + 2 * Math.floor(rng["a" /* default */].getUniform() * (width - 1) / 2);
            cy = 1 + 2 * Math.floor(rng["a" /* default */].getUniform() * (height - 1) / 2);
            if (!done) {
                map[cx][cy] = 0;
            }
            if (!map[cx][cy]) {
                this._randomize(dirs);
                do {
                    if (Math.floor(rng["a" /* default */].getUniform() * (this._regularity + 1)) == 0) {
                        this._randomize(dirs);
                    }
                    blocked = true;
                    for (let i = 0; i < 4; i++) {
                        nx = cx + dirs[i][0] * 2;
                        ny = cy + dirs[i][1] * 2;
                        if (this._isFree(map, nx, ny, width, height)) {
                            map[nx][ny] = 0;
                            map[cx + dirs[i][0]][cy + dirs[i][1]] = 0;
                            cx = nx;
                            cy = ny;
                            blocked = false;
                            done++;
                            break;
                        }
                    }
                } while (!blocked);
            }
        } while (done + 1 < width * height / 4);
        for (let i = 0; i < this._width; i++) {
            for (let j = 0; j < this._height; j++) {
                callback(i, j, map[i][j]);
            }
        }
        this._map = [];
        return this;
    }
    _randomize(dirs) {
        for (let i = 0; i < 4; i++) {
            dirs[i][0] = 0;
            dirs[i][1] = 0;
        }
        switch (Math.floor(rng["a" /* default */].getUniform() * 4)) {
            case 0:
                dirs[0][0] = -1;
                dirs[1][0] = 1;
                dirs[2][1] = -1;
                dirs[3][1] = 1;
                break;
            case 1:
                dirs[3][0] = -1;
                dirs[2][0] = 1;
                dirs[1][1] = -1;
                dirs[0][1] = 1;
                break;
            case 2:
                dirs[2][0] = -1;
                dirs[3][0] = 1;
                dirs[0][1] = -1;
                dirs[1][1] = 1;
                break;
            case 3:
                dirs[1][0] = -1;
                dirs[0][0] = 1;
                dirs[3][1] = -1;
                dirs[2][1] = 1;
                break;
        }
    }
    _isFree(map, x, y, width, height) {
        if (x < 1 || y < 1 || x >= width || y >= height) {
            return false;
        }
        return map[x][y];
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/rogue.js



/**
 * Dungeon generator which uses the "orginal" Rogue dungeon generation algorithm. See http://kuoi.com/~kamikaze/GameDesign/art07_rogue_dungeon.php
 * @author hyakugei
 */
class rogue_Rogue extends map_Map {
    constructor(width, height, options) {
        super(width, height);
        this.map = [];
        this.rooms = [];
        this.connectedCells = [];
        options = Object.assign({
            cellWidth: 3,
            cellHeight: 3 //     ie. as an array with min-max values for each direction....
        }, options);
        /*
        Set the room sizes according to the over-all width of the map,
        and the cell sizes.
        */
        if (!options.hasOwnProperty("roomWidth")) {
            options["roomWidth"] = this._calculateRoomSize(this._width, options["cellWidth"]);
        }
        if (!options.hasOwnProperty("roomHeight")) {
            options["roomHeight"] = this._calculateRoomSize(this._height, options["cellHeight"]);
        }
        this._options = options;
    }
    create(callback) {
        this.map = this._fillMap(1);
        this.rooms = [];
        this.connectedCells = [];
        this._initRooms();
        this._connectRooms();
        this._connectUnconnectedRooms();
        this._createRandomRoomConnections();
        this._createRooms();
        this._createCorridors();
        if (callback) {
            for (let i = 0; i < this._width; i++) {
                for (let j = 0; j < this._height; j++) {
                    callback(i, j, this.map[i][j]);
                }
            }
        }
        return this;
    }
    _calculateRoomSize(size, cell) {
        let max = Math.floor((size / cell) * 0.8);
        let min = Math.floor((size / cell) * 0.25);
        if (min < 2) {
            min = 2;
        }
        if (max < 2) {
            max = 2;
        }
        return [min, max];
    }
    _initRooms() {
        // create rooms array. This is the "grid" list from the algo.
        for (let i = 0; i < this._options.cellWidth; i++) {
            this.rooms.push([]);
            for (let j = 0; j < this._options.cellHeight; j++) {
                this.rooms[i].push({ "x": 0, "y": 0, "width": 0, "height": 0, "connections": [], "cellx": i, "celly": j });
            }
        }
    }
    _connectRooms() {
        //pick random starting grid
        let cgx = rng["a" /* default */].getUniformInt(0, this._options.cellWidth - 1);
        let cgy = rng["a" /* default */].getUniformInt(0, this._options.cellHeight - 1);
        let idx;
        let ncgx;
        let ncgy;
        let found = false;
        let room;
        let otherRoom;
        let dirToCheck;
        // find  unconnected neighbour cells
        do {
            //dirToCheck = [0, 1, 2, 3, 4, 5, 6, 7];
            dirToCheck = [0, 2, 4, 6];
            dirToCheck = rng["a" /* default */].shuffle(dirToCheck);
            do {
                found = false;
                idx = dirToCheck.pop();
                ncgx = cgx + DIRS[8][idx][0];
                ncgy = cgy + DIRS[8][idx][1];
                if (ncgx < 0 || ncgx >= this._options.cellWidth) {
                    continue;
                }
                if (ncgy < 0 || ncgy >= this._options.cellHeight) {
                    continue;
                }
                room = this.rooms[cgx][cgy];
                if (room["connections"].length > 0) {
                    // as long as this room doesn't already coonect to me, we are ok with it.
                    if (room["connections"][0][0] == ncgx && room["connections"][0][1] == ncgy) {
                        break;
                    }
                }
                otherRoom = this.rooms[ncgx][ncgy];
                if (otherRoom["connections"].length == 0) {
                    otherRoom["connections"].push([cgx, cgy]);
                    this.connectedCells.push([ncgx, ncgy]);
                    cgx = ncgx;
                    cgy = ncgy;
                    found = true;
                }
            } while (dirToCheck.length > 0 && found == false);
        } while (dirToCheck.length > 0);
    }
    _connectUnconnectedRooms() {
        //While there are unconnected rooms, try to connect them to a random connected neighbor
        //(if a room has no connected neighbors yet, just keep cycling, you'll fill out to it eventually).
        let cw = this._options.cellWidth;
        let ch = this._options.cellHeight;
        this.connectedCells = rng["a" /* default */].shuffle(this.connectedCells);
        let room;
        let otherRoom;
        let validRoom;
        for (let i = 0; i < this._options.cellWidth; i++) {
            for (let j = 0; j < this._options.cellHeight; j++) {
                room = this.rooms[i][j];
                if (room["connections"].length == 0) {
                    let directions = [0, 2, 4, 6];
                    directions = rng["a" /* default */].shuffle(directions);
                    validRoom = false;
                    do {
                        let dirIdx = directions.pop();
                        let newI = i + DIRS[8][dirIdx][0];
                        let newJ = j + DIRS[8][dirIdx][1];
                        if (newI < 0 || newI >= cw || newJ < 0 || newJ >= ch) {
                            continue;
                        }
                        otherRoom = this.rooms[newI][newJ];
                        validRoom = true;
                        if (otherRoom["connections"].length == 0) {
                            break;
                        }
                        for (let k = 0; k < otherRoom["connections"].length; k++) {
                            if (otherRoom["connections"][k][0] == i && otherRoom["connections"][k][1] == j) {
                                validRoom = false;
                                break;
                            }
                        }
                        if (validRoom) {
                            break;
                        }
                    } while (directions.length);
                    if (validRoom) {
                        room["connections"].push([otherRoom["cellx"], otherRoom["celly"]]);
                    }
                    else {
                        console.log("-- Unable to connect room.");
                    }
                }
            }
        }
    }
    _createRandomRoomConnections() {
        // Empty for now.
    }
    _createRooms() {
        let w = this._width;
        let h = this._height;
        let cw = this._options.cellWidth;
        let ch = this._options.cellHeight;
        let cwp = Math.floor(this._width / cw);
        let chp = Math.floor(this._height / ch);
        let roomw;
        let roomh;
        let roomWidth = this._options["roomWidth"];
        let roomHeight = this._options["roomHeight"];
        let sx;
        let sy;
        let otherRoom;
        for (let i = 0; i < cw; i++) {
            for (let j = 0; j < ch; j++) {
                sx = cwp * i;
                sy = chp * j;
                if (sx == 0) {
                    sx = 1;
                }
                if (sy == 0) {
                    sy = 1;
                }
                roomw = rng["a" /* default */].getUniformInt(roomWidth[0], roomWidth[1]);
                roomh = rng["a" /* default */].getUniformInt(roomHeight[0], roomHeight[1]);
                if (j > 0) {
                    otherRoom = this.rooms[i][j - 1];
                    while (sy - (otherRoom["y"] + otherRoom["height"]) < 3) {
                        sy++;
                    }
                }
                if (i > 0) {
                    otherRoom = this.rooms[i - 1][j];
                    while (sx - (otherRoom["x"] + otherRoom["width"]) < 3) {
                        sx++;
                    }
                }
                let sxOffset = Math.round(rng["a" /* default */].getUniformInt(0, cwp - roomw) / 2);
                let syOffset = Math.round(rng["a" /* default */].getUniformInt(0, chp - roomh) / 2);
                while (sx + sxOffset + roomw >= w) {
                    if (sxOffset) {
                        sxOffset--;
                    }
                    else {
                        roomw--;
                    }
                }
                while (sy + syOffset + roomh >= h) {
                    if (syOffset) {
                        syOffset--;
                    }
                    else {
                        roomh--;
                    }
                }
                sx = sx + sxOffset;
                sy = sy + syOffset;
                this.rooms[i][j]["x"] = sx;
                this.rooms[i][j]["y"] = sy;
                this.rooms[i][j]["width"] = roomw;
                this.rooms[i][j]["height"] = roomh;
                for (let ii = sx; ii < sx + roomw; ii++) {
                    for (let jj = sy; jj < sy + roomh; jj++) {
                        this.map[ii][jj] = 0;
                    }
                }
            }
        }
    }
    _getWallPosition(aRoom, aDirection) {
        let rx;
        let ry;
        let door;
        if (aDirection == 1 || aDirection == 3) {
            rx = rng["a" /* default */].getUniformInt(aRoom["x"] + 1, aRoom["x"] + aRoom["width"] - 2);
            if (aDirection == 1) {
                ry = aRoom["y"] - 2;
                door = ry + 1;
            }
            else {
                ry = aRoom["y"] + aRoom["height"] + 1;
                door = ry - 1;
            }
            this.map[rx][door] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
        }
        else {
            ry = rng["a" /* default */].getUniformInt(aRoom["y"] + 1, aRoom["y"] + aRoom["height"] - 2);
            if (aDirection == 2) {
                rx = aRoom["x"] + aRoom["width"] + 1;
                door = rx - 1;
            }
            else {
                rx = aRoom["x"] - 2;
                door = rx + 1;
            }
            this.map[door][ry] = 0; // i'm not setting a specific 'door' tile value right now, just empty space.
        }
        return [rx, ry];
    }
    _drawCorridor(startPosition, endPosition) {
        let xOffset = endPosition[0] - startPosition[0];
        let yOffset = endPosition[1] - startPosition[1];
        let xpos = startPosition[0];
        let ypos = startPosition[1];
        let tempDist;
        let xDir;
        let yDir;
        let move; // 2 element array, element 0 is the direction, element 1 is the total value to move.
        let moves = []; // a list of 2 element arrays
        let xAbs = Math.abs(xOffset);
        let yAbs = Math.abs(yOffset);
        let percent = rng["a" /* default */].getUniform(); // used to split the move at different places along the long axis
        let firstHalf = percent;
        let secondHalf = 1 - percent;
        xDir = xOffset > 0 ? 2 : 6;
        yDir = yOffset > 0 ? 4 : 0;
        if (xAbs < yAbs) {
            // move firstHalf of the y offset
            tempDist = Math.ceil(yAbs * firstHalf);
            moves.push([yDir, tempDist]);
            // move all the x offset
            moves.push([xDir, xAbs]);
            // move sendHalf of the  y offset
            tempDist = Math.floor(yAbs * secondHalf);
            moves.push([yDir, tempDist]);
        }
        else {
            //  move firstHalf of the x offset
            tempDist = Math.ceil(xAbs * firstHalf);
            moves.push([xDir, tempDist]);
            // move all the y offset
            moves.push([yDir, yAbs]);
            // move secondHalf of the x offset.
            tempDist = Math.floor(xAbs * secondHalf);
            moves.push([xDir, tempDist]);
        }
        this.map[xpos][ypos] = 0;
        while (moves.length > 0) {
            move = moves.pop();
            while (move[1] > 0) {
                xpos += DIRS[8][move[0]][0];
                ypos += DIRS[8][move[0]][1];
                this.map[xpos][ypos] = 0;
                move[1] = move[1] - 1;
            }
        }
    }
    _createCorridors() {
        // Draw Corridors between connected rooms
        let cw = this._options.cellWidth;
        let ch = this._options.cellHeight;
        let room;
        let connection;
        let otherRoom;
        let wall;
        let otherWall;
        for (let i = 0; i < cw; i++) {
            for (let j = 0; j < ch; j++) {
                room = this.rooms[i][j];
                for (let k = 0; k < room["connections"].length; k++) {
                    connection = room["connections"][k];
                    otherRoom = this.rooms[connection[0]][connection[1]];
                    // figure out what wall our corridor will start one.
                    // figure out what wall our corridor will end on.
                    if (otherRoom["cellx"] > room["cellx"]) {
                        wall = 2;
                        otherWall = 4;
                    }
                    else if (otherRoom["cellx"] < room["cellx"]) {
                        wall = 4;
                        otherWall = 2;
                    }
                    else if (otherRoom["celly"] > room["celly"]) {
                        wall = 3;
                        otherWall = 1;
                    }
                    else {
                        wall = 1;
                        otherWall = 3;
                    }
                    this._drawCorridor(this._getWallPosition(room, wall), this._getWallPosition(otherRoom, otherWall));
                }
            }
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/map/index.js








/* harmony default export */ var lib_map = ({ Arena: arena_Arena, Uniform: uniform_Uniform, Cellular: cellular_Cellular, Digger: digger_Digger, EllerMaze: ellermaze_EllerMaze, DividedMaze: dividedmaze_DividedMaze, IceyMaze: iceymaze_IceyMaze, Rogue: rogue_Rogue });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/noise/noise.js
/**
 * Base noise generator
 */
class Noise {
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/noise/simplex.js



const F2 = 0.5 * (Math.sqrt(3) - 1);
const G2 = (3 - Math.sqrt(3)) / 6;
/**
 * A simple 2d implementation of simplex noise by Ondrej Zara
 *
 * Based on a speed-improved simplex noise algorithm for 2D, 3D and 4D in Java.
 * Which is based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * With Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 */
class simplex_Simplex extends Noise {
    /**
     * @param gradients Random gradients
     */
    constructor(gradients = 256) {
        super();
        this._gradients = [
            [0, -1],
            [1, -1],
            [1, 0],
            [1, 1],
            [0, 1],
            [-1, 1],
            [-1, 0],
            [-1, -1]
        ];
        let permutations = [];
        for (let i = 0; i < gradients; i++) {
            permutations.push(i);
        }
        permutations = rng["a" /* default */].shuffle(permutations);
        this._perms = [];
        this._indexes = [];
        for (let i = 0; i < 2 * gradients; i++) {
            this._perms.push(permutations[i % gradients]);
            this._indexes.push(this._perms[i] % this._gradients.length);
        }
    }
    get(xin, yin) {
        let perms = this._perms;
        let indexes = this._indexes;
        let count = perms.length / 2;
        let n0 = 0, n1 = 0, n2 = 0, gi; // Noise contributions from the three corners
        // Skew the input space to determine which simplex cell we're in
        let s = (xin + yin) * F2; // Hairy factor for 2D
        let i = Math.floor(xin + s);
        let j = Math.floor(yin + s);
        let t = (i + j) * G2;
        let X0 = i - t; // Unskew the cell origin back to (x,y) space
        let Y0 = j - t;
        let x0 = xin - X0; // The x,y distances from the cell origin
        let y0 = yin - Y0;
        // For the 2D case, the simplex shape is an equilateral triangle.
        // Determine which simplex we are in.
        let i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
        if (x0 > y0) {
            i1 = 1;
            j1 = 0;
        }
        else { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
            i1 = 0;
            j1 = 1;
        } // upper triangle, YX order: (0,0)->(0,1)->(1,1)
        // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
        // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
        // c = (3-sqrt(3))/6
        let x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
        let y1 = y0 - j1 + G2;
        let x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
        let y2 = y0 - 1 + 2 * G2;
        // Work out the hashed gradient indices of the three simplex corners
        let ii = Object(util["mod"])(i, count);
        let jj = Object(util["mod"])(j, count);
        // Calculate the contribution from the three corners
        let t0 = 0.5 - x0 * x0 - y0 * y0;
        if (t0 >= 0) {
            t0 *= t0;
            gi = indexes[ii + perms[jj]];
            let grad = this._gradients[gi];
            n0 = t0 * t0 * (grad[0] * x0 + grad[1] * y0);
        }
        let t1 = 0.5 - x1 * x1 - y1 * y1;
        if (t1 >= 0) {
            t1 *= t1;
            gi = indexes[ii + i1 + perms[jj + j1]];
            let grad = this._gradients[gi];
            n1 = t1 * t1 * (grad[0] * x1 + grad[1] * y1);
        }
        let t2 = 0.5 - x2 * x2 - y2 * y2;
        if (t2 >= 0) {
            t2 *= t2;
            gi = indexes[ii + 1 + perms[jj + 1]];
            let grad = this._gradients[gi];
            n2 = t2 * t2 * (grad[0] * x2 + grad[1] * y2);
        }
        // Add contributions from each corner to get the final noise value.
        // The result is scaled to return values in the interval [-1,1].
        return 70 * (n0 + n1 + n2);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/noise/index.js

/* harmony default export */ var noise = ({ Simplex: simplex_Simplex });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/path/path.js

/**
 * @class Abstract pathfinder
 * @param {int} toX Target X coord
 * @param {int} toY Target Y coord
 * @param {function} passableCallback Callback to determine map passability
 * @param {object} [options]
 * @param {int} [options.topology=8]
 */
class path_Path {
    constructor(toX, toY, passableCallback, options = {}) {
        this._toX = toX;
        this._toY = toY;
        this._passableCallback = passableCallback;
        this._options = Object.assign({
            topology: 8
        }, options);
        this._dirs = DIRS[this._options.topology];
        if (this._options.topology == 8) { /* reorder dirs for more aesthetic result (vertical/horizontal first) */
            this._dirs = [
                this._dirs[0],
                this._dirs[2],
                this._dirs[4],
                this._dirs[6],
                this._dirs[1],
                this._dirs[3],
                this._dirs[5],
                this._dirs[7]
            ];
        }
    }
    _getNeighbors(cx, cy) {
        let result = [];
        for (let i = 0; i < this._dirs.length; i++) {
            let dir = this._dirs[i];
            let x = cx + dir[0];
            let y = cy + dir[1];
            if (!this._passableCallback(x, y)) {
                continue;
            }
            result.push([x, y]);
        }
        return result;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/path/dijkstra.js

/**
 * @class Simplified Dijkstra's algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
class dijkstra_Dijkstra extends path_Path {
    constructor(toX, toY, passableCallback, options) {
        super(toX, toY, passableCallback, options);
        this._computed = {};
        this._todo = [];
        this._add(toX, toY, null);
    }
    /**
     * Compute a path from a given point
     * @see ROT.Path#compute
     */
    compute(fromX, fromY, callback) {
        let key = fromX + "," + fromY;
        if (!(key in this._computed)) {
            this._compute(fromX, fromY);
        }
        if (!(key in this._computed)) {
            return;
        }
        let item = this._computed[key];
        while (item) {
            callback(item.x, item.y);
            item = item.prev;
        }
    }
    /**
     * Compute a non-cached value
     */
    _compute(fromX, fromY) {
        while (this._todo.length) {
            let item = this._todo.shift();
            if (item.x == fromX && item.y == fromY) {
                return;
            }
            let neighbors = this._getNeighbors(item.x, item.y);
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];
                let x = neighbor[0];
                let y = neighbor[1];
                let id = x + "," + y;
                if (id in this._computed) {
                    continue;
                } /* already done */
                this._add(x, y, item);
            }
        }
    }
    _add(x, y, prev) {
        let obj = {
            x: x,
            y: y,
            prev: prev
        };
        this._computed[x + "," + y] = obj;
        this._todo.push(obj);
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/path/astar.js

/**
 * @class Simplified A* algorithm: all edges have a value of 1
 * @augments ROT.Path
 * @see ROT.Path
 */
class astar_AStar extends path_Path {
    constructor(toX, toY, passableCallback, options = {}) {
        super(toX, toY, passableCallback, options);
        this._todo = [];
        this._done = {};
    }
    /**
     * Compute a path from a given point
     * @see ROT.Path#compute
     */
    compute(fromX, fromY, callback) {
        this._todo = [];
        this._done = {};
        this._fromX = fromX;
        this._fromY = fromY;
        this._add(this._toX, this._toY, null);
        while (this._todo.length) {
            let item = this._todo.shift();
            let id = item.x + "," + item.y;
            if (id in this._done) {
                continue;
            }
            this._done[id] = item;
            if (item.x == fromX && item.y == fromY) {
                break;
            }
            let neighbors = this._getNeighbors(item.x, item.y);
            for (let i = 0; i < neighbors.length; i++) {
                let neighbor = neighbors[i];
                let x = neighbor[0];
                let y = neighbor[1];
                let id = x + "," + y;
                if (id in this._done) {
                    continue;
                }
                this._add(x, y, item);
            }
        }
        let item = this._done[fromX + "," + fromY];
        if (!item) {
            return;
        }
        while (item) {
            callback(item.x, item.y);
            item = item.prev;
        }
    }
    _add(x, y, prev) {
        let h = this._distance(x, y);
        let obj = {
            x: x,
            y: y,
            prev: prev,
            g: (prev ? prev.g + 1 : 0),
            h: h
        };
        /* insert into priority queue */
        let f = obj.g + obj.h;
        for (let i = 0; i < this._todo.length; i++) {
            let item = this._todo[i];
            let itemF = item.g + item.h;
            if (f < itemF || (f == itemF && h < item.h)) {
                this._todo.splice(i, 0, obj);
                return;
            }
        }
        this._todo.push(obj);
    }
    _distance(x, y) {
        switch (this._options.topology) {
            case 4:
                return (Math.abs(x - this._fromX) + Math.abs(y - this._fromY));
                break;
            case 6:
                let dx = Math.abs(x - this._fromX);
                let dy = Math.abs(y - this._fromY);
                return dy + Math.max(0, (dx - dy) / 2);
                break;
            case 8:
                return Math.max(Math.abs(x - this._fromX), Math.abs(y - this._fromY));
                break;
        }
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/path/index.js


/* harmony default export */ var path = ({ Dijkstra: dijkstra_Dijkstra, AStar: astar_AStar });

// CONCATENATED MODULE: ./node_modules/rot-js/lib/engine.js
/**
 * @class Asynchronous main loop
 * @param {ROT.Scheduler} scheduler
 */
class Engine {
    constructor(scheduler) {
        this._scheduler = scheduler;
        this._lock = 1;
    }
    /**
     * Start the main loop. When this call returns, the loop is locked.
     */
    start() { return this.unlock(); }
    /**
     * Interrupt the engine by an asynchronous action
     */
    lock() {
        this._lock++;
        return this;
    }
    /**
     * Resume execution (paused by a previous lock)
     */
    unlock() {
        if (!this._lock) {
            throw new Error("Cannot unlock unlocked engine");
        }
        this._lock--;
        while (!this._lock) {
            let actor = this._scheduler.next();
            if (!actor) {
                return this.lock();
            } /* no actors */
            let result = actor.act();
            if (result && result.then) { /* actor returned a "thenable", looks like a Promise */
                this.lock();
                result.then(this.unlock.bind(this));
            }
        }
        return this;
    }
}

// EXTERNAL MODULE: ./node_modules/rot-js/lib/color.js
var lib_color = __webpack_require__(2);

// CONCATENATED MODULE: ./node_modules/rot-js/lib/lighting.js

;
;
;
;
/**
 * Lighting computation, based on a traditional FOV for multiple light sources and multiple passes.
 */
class lighting_Lighting {
    constructor(reflectivityCallback, options = {}) {
        this._reflectivityCallback = reflectivityCallback;
        this._options = {};
        options = Object.assign({
            passes: 1,
            emissionThreshold: 100,
            range: 10
        }, options);
        this._lights = {};
        this._reflectivityCache = {};
        this._fovCache = {};
        this.setOptions(options);
    }
    /**
     * Adjust options at runtime
     */
    setOptions(options) {
        Object.assign(this._options, options);
        if (options && options.range) {
            this.reset();
        }
        return this;
    }
    /**
     * Set the used Field-Of-View algo
     */
    setFOV(fov) {
        this._fov = fov;
        this._fovCache = {};
        return this;
    }
    /**
     * Set (or remove) a light source
     */
    setLight(x, y, color) {
        let key = x + "," + y;
        if (color) {
            this._lights[key] = (typeof (color) == "string" ? lib_color["fromString"](color) : color);
        }
        else {
            delete this._lights[key];
        }
        return this;
    }
    /**
     * Remove all light sources
     */
    clearLights() { this._lights = {}; }
    /**
     * Reset the pre-computed topology values. Call whenever the underlying map changes its light-passability.
     */
    reset() {
        this._reflectivityCache = {};
        this._fovCache = {};
        return this;
    }
    /**
     * Compute the lighting
     */
    compute(lightingCallback) {
        let doneCells = {};
        let emittingCells = {};
        let litCells = {};
        for (let key in this._lights) { /* prepare emitters for first pass */
            let light = this._lights[key];
            emittingCells[key] = [0, 0, 0];
            lib_color["add_"](emittingCells[key], light);
        }
        for (let i = 0; i < this._options.passes; i++) { /* main loop */
            this._emitLight(emittingCells, litCells, doneCells);
            if (i + 1 == this._options.passes) {
                continue;
            } /* not for the last pass */
            emittingCells = this._computeEmitters(litCells, doneCells);
        }
        for (let litKey in litCells) { /* let the user know what and how is lit */
            let parts = litKey.split(",");
            let x = parseInt(parts[0]);
            let y = parseInt(parts[1]);
            lightingCallback(x, y, litCells[litKey]);
        }
        return this;
    }
    /**
     * Compute one iteration from all emitting cells
     * @param emittingCells These emit light
     * @param litCells Add projected light to these
     * @param doneCells These already emitted, forbid them from further calculations
     */
    _emitLight(emittingCells, litCells, doneCells) {
        for (let key in emittingCells) {
            let parts = key.split(",");
            let x = parseInt(parts[0]);
            let y = parseInt(parts[1]);
            this._emitLightFromCell(x, y, emittingCells[key], litCells);
            doneCells[key] = 1;
        }
        return this;
    }
    /**
     * Prepare a list of emitters for next pass
     */
    _computeEmitters(litCells, doneCells) {
        let result = {};
        for (let key in litCells) {
            if (key in doneCells) {
                continue;
            } /* already emitted */
            let color = litCells[key];
            let reflectivity;
            if (key in this._reflectivityCache) {
                reflectivity = this._reflectivityCache[key];
            }
            else {
                let parts = key.split(",");
                let x = parseInt(parts[0]);
                let y = parseInt(parts[1]);
                reflectivity = this._reflectivityCallback(x, y);
                this._reflectivityCache[key] = reflectivity;
            }
            if (reflectivity == 0) {
                continue;
            } /* will not reflect at all */
            /* compute emission color */
            let emission = [0, 0, 0];
            let intensity = 0;
            for (let i = 0; i < 3; i++) {
                let part = Math.round(color[i] * reflectivity);
                emission[i] = part;
                intensity += part;
            }
            if (intensity > this._options.emissionThreshold) {
                result[key] = emission;
            }
        }
        return result;
    }
    /**
     * Compute one iteration from one cell
     */
    _emitLightFromCell(x, y, color, litCells) {
        let key = x + "," + y;
        let fov;
        if (key in this._fovCache) {
            fov = this._fovCache[key];
        }
        else {
            fov = this._updateFOV(x, y);
        }
        for (let fovKey in fov) {
            let formFactor = fov[fovKey];
            let result;
            if (fovKey in litCells) { /* already lit */
                result = litCells[fovKey];
            }
            else { /* newly lit */
                result = [0, 0, 0];
                litCells[fovKey] = result;
            }
            for (let i = 0; i < 3; i++) {
                result[i] += Math.round(color[i] * formFactor);
            } /* add light color */
        }
        return this;
    }
    /**
     * Compute FOV ("form factor") for a potential light source at [x,y]
     */
    _updateFOV(x, y) {
        let key1 = x + "," + y;
        let cache = {};
        this._fovCache[key1] = cache;
        let range = this._options.range;
        function cb(x, y, r, vis) {
            let key2 = x + "," + y;
            let formFactor = vis * (1 - r / range);
            if (formFactor == 0) {
                return;
            }
            cache[key2] = formFactor;
        }
        ;
        this._fov.compute(x, y, range, cb.bind(this));
        return cache;
    }
}

// CONCATENATED MODULE: ./node_modules/rot-js/lib/index.js
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Util", function() { return Util; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Color", function() { return Color; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "Text", function() { return Text; });
/* concated harmony reexport RNG */__webpack_require__.d(__webpack_exports__, "RNG", function() { return rng["a" /* default */]; });
/* concated harmony reexport Display */__webpack_require__.d(__webpack_exports__, "Display", function() { return display_Display; });
/* concated harmony reexport StringGenerator */__webpack_require__.d(__webpack_exports__, "StringGenerator", function() { return stringgenerator_StringGenerator; });
/* concated harmony reexport EventQueue */__webpack_require__.d(__webpack_exports__, "EventQueue", function() { return EventQueue; });
/* concated harmony reexport Scheduler */__webpack_require__.d(__webpack_exports__, "Scheduler", function() { return scheduler; });
/* concated harmony reexport FOV */__webpack_require__.d(__webpack_exports__, "FOV", function() { return fov; });
/* concated harmony reexport Map */__webpack_require__.d(__webpack_exports__, "Map", function() { return lib_map; });
/* concated harmony reexport Noise */__webpack_require__.d(__webpack_exports__, "Noise", function() { return noise; });
/* concated harmony reexport Path */__webpack_require__.d(__webpack_exports__, "Path", function() { return path; });
/* concated harmony reexport Engine */__webpack_require__.d(__webpack_exports__, "Engine", function() { return Engine; });
/* concated harmony reexport Lighting */__webpack_require__.d(__webpack_exports__, "Lighting", function() { return lighting_Lighting; });
/* concated harmony reexport DEFAULT_WIDTH */__webpack_require__.d(__webpack_exports__, "DEFAULT_WIDTH", function() { return DEFAULT_WIDTH; });
/* concated harmony reexport DEFAULT_HEIGHT */__webpack_require__.d(__webpack_exports__, "DEFAULT_HEIGHT", function() { return DEFAULT_HEIGHT; });
/* concated harmony reexport DIRS */__webpack_require__.d(__webpack_exports__, "DIRS", function() { return DIRS; });
/* concated harmony reexport KEYS */__webpack_require__.d(__webpack_exports__, "KEYS", function() { return KEYS; });













const Util = util;

const Color = lib_color;

const Text = text_namespaceObject;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const ROT = __webpack_require__(3);
// See: http://ondras.github.io/rot.js/manual/#rng

function setSeed(seed) {
	if (typeof seed !== 'number') {
		seed = makeSeed();
	}
	ROT.RNG.setSeed(seed);
}

function makeSeed() {
	return Math.round(Math.random() * 10000);
}

function roll(n, seed) {
	if (typeof seed === 'number') {
		setSeed(seed);
	}
	return Math.floor(ROT.RNG.getUniform() * n);
}

function getWeightedValue(obj, seed) {
	if (typeof seed === 'number') {
		setSeed(seed);
	}
	return ROT.RNG.getWeightedValue(obj);
}

function shuffle(arr) {
	return ROT.RNG.shuffle(arr);
}

function pickOne(arr) {
	return ROT.RNG.getItem(arr);
}

module.exports = {
	setSeed,
	makeSeed,
	roll,
	getWeightedValue,
	shuffle,
	pickOne
};


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Inventory = __webpack_require__(14);
const { DIRS_8 } = __webpack_require__(15);

class Item {
	constructor(options = {}) {
		this.type = options.type || null;
		this.name = options.name || 'nothing';
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.character = options.character || '^';
		this.surrounding = options.surrounding || [];
		this.color = options.color || '#05f';
		this.background = options.background || null;
		this.inventory = new Inventory({
			size: options.inventorySize || 0
		});
		this.isWeapon = Boolean(options.weapon);
		this.damage = parseInt(options.weapon, 10);
		this.illumination = options.illumination || 0;
		this.portable = (typeof options.portable === 'boolean') ? options.portable : true;
		this.containedIn = null;
		this.actions = { ...options.on, ...options.actions };
		if (options.use) {
			this.actions.use = options.use;
		}
		this.states = options.states || {};
		this.teleport = null; // can this item move the character to another level, cell
	}

	hasAction(verb) {
		return Boolean(this.actions[verb]);
	}

	action(actionName, who) {
		const action = this.actions[actionName];
		let actionOutcome = {};
		if (typeof action === 'function') {
			actionOutcome = action(this, who);
		} else if (typeof action === 'object' && action !== null) {
			actionOutcome = this.runAction(action, who);
		} else {
			console.warn('No action', actionName, 'for item', this);
		}
		return actionOutcome;
	}

	runAction(action = {}, who) { // TODO: move to game/level?
		let message = '';
		if (!this.requirementMet(action, who)) {
			message = (action.missingMessage) ? action.missingMessage : `Some requirement is not met to use the ${this.name}`;
			return { message };
		}
		this.removeRequirements(action);
		message = message + ((action.message) ? action.message : '');
		const effects = action.effects;
		return { message, effects };
	}

	removeRequirements(action = {}) {
		if (!action.requires) { return; }
		action.requires.forEach((requirement) => {
			const typeKey = requirement.item;
			if (typeKey) {
				this.inventory.removeType(typeKey);
			}
		});
	}

	requirementMet(action = {}, who) {
		if (!action.requires) {
			return true;
		}
		let met = 0;
		action.requires.forEach((requirement) => {
			if (requirement.item && this.inventory.containsType(requirement.item)) {
				met += 1;
			}
		});
		return met === action.requires.length;
	}

	draw(display, lighting = {}, inView = false) {
		if (this.containedIn || !inView) { // Not visible if in a container
			return false;
		}
		display.draw(this.x, this.y, this.character, this.color, this.background);
		if (this.surrounding.length) {
			this.surrounding.forEach((char, i) => {
				let { x, y } = DIRS_8[i];
				display.draw(this.x + x, this.y + y, char, this.color, this.background);
			});
		}
		return true;
	}

	addItem(item) { // mutates the item if successful
		if (this.inventory.isFull()) {
			return false;
		}
		const isAdded = this.inventory.add(item);
		if (!isAdded) {
			return false;
		}
		item.containedIn = this;
		return true;
	}

	//---- Inventory

	getContents(n) {
		return this.inventory.get(n);
	}

	hasContents() {
		return this.inventory.hasContents();
	}

	contains(itemName) {
		return this.inventory.contains(itemName);
	}

	hasSpace() {
		return this.inventory.hasSpace();
	}

	addToInventory(item) {
		return this.inventory.add(item);
	}

	//---- Sets

	setTeleport(options = {}) {
		const { levelIndex, x, y, verb } = options;
		this.teleport = { levelIndex, x, y };
		this.actions[verb] = 'teleport';
	}
}

module.exports = Item;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Backend; });
/**
 * @class Abstract display backend module
 * @private
 */
class Backend {
    getContainer() { return null; }
    setOptions(options) { this._options = options; }
}


/***/ }),
/* 7 */
/***/ (function(module, exports) {

function getDistance(x1, y1, x2, y2) {
	return Math.sqrt(
		Math.pow((x1 - x2), 2)
		+ Math.pow((y1 - y2), 2)
	);
}

module.exports = {
	getDistance
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

const ROT = __webpack_require__(3);
const Inventory = __webpack_require__(14);
const geometer = __webpack_require__(7);
const random = __webpack_require__(4);

const MOVE = 'move';
const WAIT = 'wait';
const MONSTER_FACTION = 'monsters';

class Actor {
	constructor(options = {}) {
		this.type = options.type;
		this.name = options.name || null;
		this.faction = options.faction || MONSTER_FACTION;
		this.isHero = Boolean(options.isHero);
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.character = options.character || 'M';
		this.originalCharacter = this.character;
		this.color = options.color || '#df2';
		this.originalColor = this.color;
		this.bloodColor = '#611';
		// this.game = options.game || console.error('must tie actor to game');
		this.inventory = new Inventory({
			size: options.inventorySize || 10
		});
		this.passable = false;
		this.actionQueue = [];
		this.maxMovement = this.isHero ? 1.42 : 1;
		this.sightRange = (typeof options.sightRange === 'number') ? options.sightRange : 6;
		this.target = null;
		this.aggro = options.aggro || 0;
		// stats
		this.hp = (options.hp || typeof options.hp === 'number') ? parseInt(options.hp, 10) : 2;
		this.hpMax = this.hp;
		this.ap = options.ap || 0;	// Attack/Arms
		this.apMax = this.ap;
		this.bp = options.bp || 0;	// Balance
		this.bpMax = this.bp;
		this.ep = options.ep || 0;	// Endurance
		this.epMax = this.ep;
		this.fp = options.fp || 0;		// Focus
		this.fpMax = this.fp;
		this.wp = options.wp || 0;		// Will(power)
		this.wpMax = this.wp;
		// advancement
		this.xp = options.xp || 0;
		this.score = options.score || 0;
		// abilities
		this.maxAbilities = 9;
		this.abilities = {};
		this.abilityList = [];
		// temporary
		this.initiativeBoost = 0;
	}

	draw(display, lighting = {}, inView = false) {
		if (!inView) {
			return false;
		}
		// TODO: adjust colors based on lighting and inView
		display.draw(this.x, this.y, this.character, this.color);
		return true;
	}

	queueAction(verb, params = {}) {
		const actionParams = { ...params, verb };
		this.actionQueue.push(actionParams);
	}

	clearQueue() {
		this.actionQueue.length = 0;
	}

	planAction(level, hero) {
		if (this.isHero) { return; }
		if (this.dead()) {
			this.clearQueue();
			return;
		}
		const distanceToHero = geometer.getDistance(this.x, this.y, hero.x, hero.y);
		const dangerouslyHurt = (this.hp <= 1);
		this.act = function () {
			console.log(`${this.name} acts`);
			// if (g.getActiveLevel() !== level) { return; }
		};
		if (this.aggro && distanceToHero <= this.getMaxSenseRange() && !hero.dead() && !dangerouslyHurt) {
			const map = level.getMap();
			this.clearQueue();
			this.setTarget(hero);
			this.setPathToTarget(map);
			if (this.atEndOfPath()) {
				this.queueAction('attack', { target: hero });
			} else if (this.actionQueue.length === 1) {
				this.clearQueue();
				this.queueAction('attack', { target: hero });
			}
		} else {
			if (this.atEndOfPath()) {
				this.setWanderPath(level);
			}
		}
		// console.log(`${this.name} plans`, this.actionQueue);
	}

	doAction() {
		if (this.dead()) { return { verb: 'rot' }; }
		const waitAction = { verb: WAIT };
		if (this.actionQueue.length === 0) { return waitAction; }
		let action = this.actionQueue.shift();
		const moveAlreadyThere = (action.verb === MOVE && action.x === this.x && action.y === this.y);
		const moveTooFar = (action.verb === MOVE && this.getDistanceToNextMove(action) > this.maxMovement);
		// console.log(this.name, this.x, this.y, action.verb, action.x, action.y, this.getDistanceToNextMove(), this.maxMovement, moveTooFar, 'q', this.actionQueue.length);
		if (moveAlreadyThere) {
			return this.doAction();
		}
		if (moveTooFar) {
			action = this.doAction();
		}
		if (!action) {
			return waitAction;
		}
		return action;
	}

	attack(who) {
		console.log(`${this.name} attacks`, who);
		// TODO
	}

	setWanderPath(level) {
		const map = level.getMap();
		const { x, y } = level.findRandomFreeCell();
		this.setPathTo(map, x, y);
	}

	atEndOfPath() {
		const nextAction = this.getNextAction();
		if (!nextAction) { return true; }
		return (nextAction.verb === MOVE) ? false : true;
	}

	wait() {
		this.healPools();
	}

	//---- Movement

	move(x, y) {
		this.x += parseInt(x, 10);
		this.y += parseInt(y, 10);
	}

	moveTo(x, y) {
		this.setCoordinates(x, y);
	}

	//---- Combat

	attackDamage(opponent) {
		return 1;
	}

	wound(n) {
		return this.heal(n * -1);
	}

	heal(n) {
		const originalHp = this.hp;
		this.hp += parseInt(n, 10);
		this.hp = Math.min(this.hp, this.hpMax);
		this.checkDeath();
		return this.hp - originalHp;
	}

	dead() {
		return (this.hp <= 0);
	}

	checkDeath() {
		if (this.dead()) {
			this.character = 'X';
			this.color = this.bloodColor;
			this.passable = true;
		}
	}

	//---- Healing

	healPools() {
		this.healPool(this.getRandomPoolKey());
	}

	healPool(poolKey, amount = 1) {
		const a = this.getAbilityReadiedAmounts();
		const max = this[poolKey + 'Max'];
		if (a[poolKey] + this[poolKey] + amount <= max) {
			this[poolKey] += amount;
		} else {
			if (this.isHero) {
				console.log('No space to heal', poolKey, this);
			}
		}
	}

	damagePool(poolKey, amount = 1) {
		this[poolKey] -= amount;
		this[poolKey] = Math.max(0, this[poolKey]);
	}

	//---- Abilities

	hasAbility(abilityKey) {
		return Boolean(this.abilities[abilityKey]);
	}

	addAbility(abilityKey, abilityData) {
		if (this.abilityList.length >= this.maxAbilities) {
			return false;
		}
		if (this.hasAbility(abilityKey)) {
			console.warn('Cannot add ability twice - would override');
			return;
		}
		// TODO: move to Activity class?
		const ability = JSON.parse(JSON.stringify(abilityData));
		this.abilities[abilityKey] = ability;
		ability.isReadied = false;
		ability.key = abilityKey;
		this.abilityList.push(abilityKey);
		return ability;
	}

	getAbilityByIndex(i) {
		const key = this.abilityList[i];
		return this.abilities[key];
	}

	getAbilityReadiedAmounts() {
		const a = { hp: 0, ap: 0, bp: 0, ep: 0 };
		this.abilityList.forEach((abilityKey) => {
			const ability = this.abilities[abilityKey];
			Actor.loopOverAbilityCosts(ability, (costKey, val) => {
				if (ability.isReadied) {
					a[costKey] += val;
				}
			});
		});
		return a;
	}

	canReadyAbility(ability) {
		if (ability.isReadied) { return false; }
		let canReady = true;
		Actor.loopOverAbilityCosts(ability, (costKey, val) => {
			const poolAmount = this[costKey];
			if (val > poolAmount) {
				canReady = false;
			}
		});
		return canReady;
	}

	readyAbilityByIndex(i) {
		const ability = this.getAbilityByIndex(i);
		if (!ability) { return false; }
		if (!this.canReadyAbility(ability)) { return false; }
		Actor.loopOverAbilityCosts(ability, (costKey, val) => {
			this[costKey] -= val;
		});
		ability.isReadied = true;
		return ability;
	}

	activateAbilities(eventName) {
		const triggeredAbilities = this.getTriggeredAbilities(eventName);
		let effects = [];
		triggeredAbilities.forEach((ability) => {
			ability.isReadied = false;
			effects = effects.concat(ability.effects);
		});
		return effects;
	}

	getTriggeredAbilities(eventName) {
		const triggeredAbilities = [];
		this.abilityList.forEach((abilityKey) => {
			const ability = this.abilities[abilityKey];
			if (ability.isReadied && ability.activateOn === eventName) {
				triggeredAbilities.push(ability);
			}
		});
		return triggeredAbilities;
	}

	static loopOverAbilityCosts(ability, fn) {
		const costs = Object.keys(ability.readyCost);
		costs.forEach((key) => {
			fn(key, parseInt(ability.readyCost[key], 10));
		});		
	}

	static getAbilityEffectsString(ability) {
		let arr = [];
		ability.effects.forEach((effect) => {
			const words = (typeof effect === 'string') ? [effect] : Object.keys(effect);
			arr = arr.concat(words);
		});
		return arr.join(', ');
	}

	static getAbilityDescriptionHtml(ability) {
		let ready = 'Ready with';
		Actor.loopOverAbilityCosts(ability, (costKey, val) => {
			ready += ' ' + val + ' ' + costKey.toUpperCase();
		});
		const effects = Actor.getAbilityEffectsString(ability);
		return `<div class="ability-description">${ability.description}</div>
		<div class="ability-ready-with">${ready}</div>
		<div class="ability-activates-on">Activates on: ${ability.activateOn}</div>
		<div class="ability-effects">Causes: ${effects}</div>`;
	}

	//---- Experience

	gainRandomPoolMax() {
		const key = this.getRandomPoolKey() + 'Max';
		this[key] += 1;
	}

	gainRandomAbility(abilitiesData) {
		const abilityKeys = Object.keys(abilitiesData);
		let abilityKey = random.pickOne(abilityKeys);
		let attempts = 100;
		while (this.hasAbility(abilityKey) && attempts--) {
			abilityKey = random.pickOne(abilityKeys);
		}
		this.addAbility(abilityKey, abilitiesData[abilityKey]);
	}

	//---- Gets

	getRandomPoolKey() {
		return random.pickOne(['ap', 'bp', 'ep']);
	}

	getMaxSenseRange() {
		return this.sightRange;
	}

	getNextAction() {
		return this.actionQueue[0];
	}

	getDistanceToNextMove(nextAction) {
		if (!nextAction) { nextAction = this.getNextAction(); }
		if (!nextAction) { return 0; }
		const { x, y } = nextAction;
		if (x !== undefined && y !== undefined) {
			return geometer.getDistance(x, y, this.x, this.y);
		}
		return null; // ?
	}

	getWeaponDamage() {
		if (!this.isHero) {
			return 1; // TODO: change this so there is some kind of natural damage for monsters
		}
		let highestDamage = 0;
		this.inventory.loopOverContents((item) => {
			if (item.damage > highestDamage) {
				highestDamage = item.damage;
			}
		});
		return highestDamage;
	}

	//---- Sets

	setCoordinates(x, y) {
		this.x = parseInt(x, 10);
		this.y = parseInt(y, 10);
	}

	setPathTo(map, x = 0, y = 0) {
		const passableCallback = function(x, y) {
			return map.getCellPassability(x, y);
		};
		const astar = new ROT.Path.AStar(x, y, passableCallback, { topology: 4 });
		const path = this.actionQueue;
		const pathCallback = function(x, y) {
			path.push({ x, y, verb: MOVE });
		};
		if (path[0] && path[0].x === this.x && path[0].y === this.y) {
			console.alert('removing first');
			path.shift();
		}
		astar.compute(this.x, this.y, pathCallback);
		return true;
	}

	setPathToTarget(map) {
		return this.setPathTo(map, this.target.x, this.target.y);
	}

	setTarget(target) {
		if (typeof target.x !== 'number' || typeof target.y !== 'number') {
			console.warn('Cannot set target to something without x,y');
			return;
		}
		this.target = target;
	}
}

module.exports = Actor;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Term; });
/* harmony import */ var _backend_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(6);
/* harmony import */ var _color_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(2);


function clearToAnsi(bg) {
    return `\x1b[0;48;5;${termcolor(bg)}m\x1b[2J`;
}
function colorToAnsi(fg, bg) {
    return `\x1b[0;38;5;${termcolor(fg)};48;5;${termcolor(bg)}m`;
}
function positionToAnsi(x, y) {
    return `\x1b[${y + 1};${x + 1}H`;
}
function termcolor(color) {
    const SRC_COLORS = 256.0;
    const DST_COLORS = 6.0;
    const COLOR_RATIO = DST_COLORS / SRC_COLORS;
    let rgb = _color_js__WEBPACK_IMPORTED_MODULE_1__["fromString"](color);
    let r = Math.floor(rgb[0] * COLOR_RATIO);
    let g = Math.floor(rgb[1] * COLOR_RATIO);
    let b = Math.floor(rgb[2] * COLOR_RATIO);
    return r * 36 + g * 6 + b * 1 + 16;
}
class Term extends _backend_js__WEBPACK_IMPORTED_MODULE_0__[/* default */ "a"] {
    constructor() {
        super();
        this._offset = [0, 0];
        this._cursor = [-1, -1];
        this._lastColor = "";
    }
    schedule(cb) { setTimeout(cb, 1000 / 60); }
    setOptions(options) {
        super.setOptions(options);
        let size = [options.width, options.height];
        let avail = this.computeSize();
        this._offset = avail.map((val, index) => Math.floor((val - size[index]) / 2));
    }
    clear() {
        process.stdout.write(clearToAnsi(this._options.bg));
    }
    draw(data, clearBefore) {
        // determine where to draw what with what colors
        let [x, y, ch, fg, bg] = data;
        // determine if we need to move the terminal cursor
        let dx = this._offset[0] + x;
        let dy = this._offset[1] + y;
        let size = this.computeSize();
        if (dx < 0 || dx >= size[0]) {
            return;
        }
        if (dy < 0 || dy >= size[1]) {
            return;
        }
        if (dx !== this._cursor[0] || dy !== this._cursor[1]) {
            process.stdout.write(positionToAnsi(dx, dy));
            this._cursor[0] = dx;
            this._cursor[1] = dy;
        }
        // terminals automatically clear, but if we're clearing when we're
        // not otherwise provided with a character, just use a space instead
        if (clearBefore) {
            if (!ch) {
                ch = " ";
            }
        }
        // if we're not clearing and not provided with a character, do nothing
        if (!ch) {
            return;
        }
        // determine if we need to change colors
        let newColor = colorToAnsi(fg, bg);
        if (newColor !== this._lastColor) {
            process.stdout.write(newColor);
            this._lastColor = newColor;
        }
        // write the provided symbol to the display
        let chars = [].concat(ch);
        process.stdout.write(chars[0]);
        // update our position, given that we wrote a character
        this._cursor[0]++;
        if (this._cursor[0] >= size[0]) {
            this._cursor[0] = 0;
            this._cursor[1]++;
        }
    }
    computeFontSize() { throw new Error("Terminal backend has no notion of font size"); }
    eventToPosition(x, y) { return [x, y]; }
    computeSize() { return [process.stdout.columns, process.stdout.rows]; }
}

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(18)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

const FontFaceObserver = __webpack_require__(20);

function domReady() {
	return new Promise((resolve, reject) => {
		if (document.readyState === "complete" || document.readyState === "loaded") {
			resolve();
		} else {
			document.addEventListener("DOMContentLoaded", () => {
				resolve();
			});
		}
	});
}

function ready(fn, fonts = []) {
	if (fonts.length > 0) {
		// TODO: allow multiple fonts ~ https://github.com/bramstein/fontfaceobserver
		const font = new FontFaceObserver(fonts[0]);
		font.load()
			.then(() => { domReady().then(fn); })
			.catch(() => { console.warn('error loading font'); domReady().then(fn); });
		return;
	}
	domReady().then(fn);
}

module.exports = ready;


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

const ROT = __webpack_require__(3);

class Display {
	constructor(options = {}) {
		options = { width: 60, height: 30, ...options };
		this.width = null;
		this.height = null;
		this.center = {};
		this.setDimensions(options.width, options.height);

		this.id = options.id || 'display';
		this.rotDisplay = new ROT.Display(options); // , layout:"term"});
		this.displayContainer = null;
		this.elt = null
		this.cameraTarget = null;
		this.setupElements();
	}

	setDimensions(x, y) {
		this.width = x;
		this.height = y;
		this.center.x = Math.round(x/2);
		this.center.y = Math.round(y/2);
	}

	setupElements() {
		this.displayContainer = document.getElementById(this.id);
		this.elt = this.rotDisplay.getContainer(); // canvas
		this.appendToElement(this.elt);
	}

	appendToElement(elt) {
		this.displayContainer.appendChild(elt);
	}

	setCameraTarget(cameraTarget) {
		if (!cameraTarget) {
			console.warn("No target", cameraTarget);
			return false;
		}
		if (typeof cameraTarget.x !== 'number' || typeof cameraTarget.y !== 'number') {
			console.warn("Couldn't target", cameraTarget);
			return false;
		}
		this.cameraTarget = cameraTarget;
		return true;
	}

	clear() {
		this.rotDisplay.clear();
	}

	draw(x, y, character, fgColor, bgColor) {
		if (this.cameraTarget) {
			x += (this.center.x - this.cameraTarget.x);
			y += (this.center.y - this.cameraTarget.y);
		}
		return this.rotDisplay.draw(x, y, character, fgColor, bgColor);
	}

	drawLevel(game, level, hero) {
		level.draw(this);
		if (!hero) { return; }
		hero.draw(this);
		this.drawInterface(game, hero);
	}

	drawHero(hero) {
		if (!hero) { return; }
		hero.draw(this);
	}

	drawDamage(isDamaged = false, options = {}) {
		// Override this
	}

	drawInterface(game = {}, hero = {}, options = {}) {
		// Override this
	}

	static getPoolSquares(value, max, used) {
		const maxLeft = max - value - used;
		let str = '';
		let i;
		for(i = 0; i < value; i++) { str += '■'; }
		for(i = 0; i < used; i++) { str += '▣'; }
		for(i = 0; i < maxLeft; i++) { str += '▢'; }
		return str;
	}

}

module.exports = Display;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

const Map = __webpack_require__(13);
const Actor = __webpack_require__(8);
const Item = __webpack_require__(5);
const Prop = __webpack_require__(16);
const geometer = __webpack_require__(7);
const random = __webpack_require__(4);
const { DIRS_4, DIRS_8_DIAGNOLS } = __webpack_require__(15);

class Level {
	constructor(options = {}, refData = {}) {
		this.seed = options.seed || 1;
		this.name = options.name || 'Unknown level';
		this.description = options.description || null;
		this.levelIndex = options.levelIndex || 0;
		this.color = options.color || '#777';
		this.background = options.background || '#222';
		const mapOptions = {
			color: this.color,
			background: this.background,
			...options.map,
			seed: this.seed
		};
		this.map = new Map(mapOptions);
		this.actors = this.generateActors(options, refData);
		this.items = this.generateItems(options, refData.items);
		this.props = this.generateProps(options, refData.props);
		this.eye = { x: 0, y: 0, sightRange: 7 };
		this.customEffects = { ...options.customEffects };
	}

	draw(display) {
		display.clear();
		this.drawMap(display);
		this.drawProps(display);
		this.drawItems(display);
		this.drawActors(display);
	}

	drawMap(display) {
		this.map.forEachCell((cell, x, y) => {
			const inView = this.isInView(x, y);
			// TODO: improve this
			const fg = cell.getForegroundColor(inView);
			const bg = cell.getBackgroundColor(inView);
			display.draw(x, y, cell.character, fg, bg);
		});
	}

	drawProps(display) {
		this.props.forEach((prop) => {
			const lighting = this.map.getLightingAt(this.eye.x, this.eye.y);
			const inView = this.isInView(prop.x, prop.y);
			prop.draw(display, lighting, inView);
		});
	}

	drawItems(display) {
		this.items.forEach((item) => {
			const lighting = this.map.getLightingAt(this.eye.x, this.eye.y);
			const inView = this.isInView(item.x, item.y);
			item.draw(display, lighting, inView);
		});
	}

	drawActors(display) {
		// Draw dead first, then non-dead
		this.actors.forEach((actor) => {
			if (actor.dead()) {
				this.drawActor(display, actor);
			}
		});
		this.actors.forEach((actor) => {
			if (!actor.dead()) {
				this.drawActor(display, actor);
			}
		});
	}

	drawActor(display, actor) {
		const lighting = this.map.getLightingAt(this.eye.x, this.eye.y);
		const inView = this.isInView(actor.x, actor.y);
		actor.draw(display, lighting, inView);
	}

	isInView(x, y) { // TODO: optimize
		const r = geometer.getDistance(this.eye.x, this.eye.y, x, y); // TODO: allow more complicated POV
		return (r <= this.eye.sightRange);		
	}

	addItem(item) {
		this.items.push(item);
	}

	removeItem(item) {
		return this.removeThing('items', item);
	}

	addActor(actor) {
		this.actors.push(actor);
	}

	removeActor(actor) {
		return this.removeThing('actors', actor);
	}

	removeThing(property, thing) {
		const i = this[property].findIndex((a) => { return a === thing; });
		if (i <= -1) {
			console.warn('nothing found in', property);
			return;
		}
		const arr = this[property].splice(i, 1);
		return arr[0];		
	}

	findItem(x, y) {
		const foundThings = this.findItems(x, y);
		return (foundThings.length) ? foundThings[0] : null;
	}
	findItems(x, y) {
		return this.items.filter((item) => {
			return item.x === x && item.y === y && !item.containedIn;
		});
	}

	findProp(x, y) {
		const foundThings = this.findProps(x, y);
		return (foundThings.length) ? foundThings[0] : null;
	}
	findProps(x, y) {
		return this.props.filter((prop) => { return prop.x === x && prop.y === y; });
	}
	findPropsByType(type) {
		return this.props.filter((prop) => { return prop.type === type; });
	}

	findActor(x, y) {
		const foundThings = this.findActors(x, y);
		return (foundThings.length) ? foundThings[0] : null;
	}
	findActors(x, y) {
		return this.actors.filter((actor) => {
			return actor.x === x && actor.y === y && !actor.dead();
		});
	}

	findThings(x, y) {
		const props = this.findProps(x, y);
		const items = this.findItems(x, y);
		const allThings = props.concat(items);
		return allThings;
	}

	findThingsCardinal(x, y) {
		const props = this.findThingsByDirections('props', DIRS_4, x, y);
		const items = this.findThingsByDirections('items', DIRS_4, x, y);
		const allThings = props.concat(items);
		return allThings;
	}

	findThingsDiagnol(x, y) {
		const props = this.findThingsByDirections('props', DIRS_8_DIAGNOLS, x, y);
		const items = this.findThingsByDirections('items', DIRS_8_DIAGNOLS, x, y);
		const allThings = props.concat(items);
		return allThings;
	}

	findThingsByDirections(thingName, dirs, x, y) {
		const coords = [];
		dirs.forEach((dir) => { coords.push({ x: x + dir.x, y: y + dir.y }); });
		return this[thingName].filter((thing) => {
			const matches = coords.filter((xy) => {
				return xy.x === thing.x && xy.y === thing.y && !thing.containedIn
			});
			return matches.length > 0;
		});		
	}

	findThingSmart(x, y, perferredProperty) {
		let things = this.findThings(x, y);
		// console.log('find smart - on spot', things);
		if (!things.length) {
			things = this.findThingsCardinal(x, y);
			// console.log('find smart - cardinal', things);
			if (!things.length) {
				things = this.findThingsDiagnol(x, y);
				// console.log('find smart - diagnols', things);
			}
		}
		if (perferredProperty) {
			things.sort((a, b) => {
				// console.log(a, b, a[perferredProperty]);
				return b[perferredProperty];
			});
			// console.log("sorted", things);
		}
		return things[0];
	}

	findRandomFreeCell(seed, clearing, retries = 10) {
		let cell = this.map.getRandomFreeCell();
		if (!retries) {
			return cell;
		}
		// TODO: take into account props, actors ...?
		if (this.findMapClearing(cell.x, cell.y) >= clearing) {
			cell = this.findRandomFreeCell(see, clearing, (retries - 1));
		}
		return cell;
	}

	findMapClearing(x, y) {
		// TODO: loop
		return 0;
	}

	discoverCircle(x, y, radius) {
		return this.map.discoverCircle(x, y, radius);
	}

	// Actions

	useThing(actor, actionName, thing) {
		const outcome = thing.action(actionName, actor);
		this.doEffects(outcome.effects, actor, actor);
		return outcome;
	}

	throw(actor, what, x, y) {
		const item = actor.inventory.remove(what);
		if (!item) { return false; }
		item.x = (typeof x === 'number') ? x : actor.x;
		item.y = (typeof y === 'number') ? y : actor.y;
		const containers = this.findThings(x, y).filter((thing) => {
			console.log(thing);
			return thing.hasSpace();
		});
		if (containers.length) {
			const container = containers[0];
			container.addToInventory(item);
			return `${actor.name} puts ${what.name} into the ${container.name}.`;
		}
		this.addItem(item);
		return `${actor.name} throws down a ${what.name}.`;
	}

	doInitiative() {
		const livingActors = this.actors.filter((actor) => !actor.dead());
		let orderedActors = random.shuffle(livingActors);
		// TODO: Look for initiative boost, put at top of list
	}

	static removeEffects(effects, key) {
		let i = effects.indexOf(key);
		while (i > -1) {
			effects.splice(i, 1);
			i = effects.indexOf(key);
		}
	}

	resolveRoundEffects() {
		this.actors.forEach((actor) => {
			const roundEffects = actor.activateAbilities('round');
			this.doEffects(roundEffects, actor, actor);
		});
	}

	resolveCombatEffects(attacker, defender) {
		let attackEffects = attacker.activateAbilities('attack');
		let defendEffects = defender.activateAbilities('attacked');
		let damageEffects;
		let damagedEffects;

		attackEffects.push('attack');

		console.log(attacker.name, JSON.stringify(attackEffects), 'vs', defender.name, JSON.stringify(defendEffects), defender);

		if (defendEffects.includes('cancelAttack')) {
			Level.removeEffects(attackEffects, 'attack');
		}

		if (attackEffects.includes('attack')) {
			attackEffects.push('weaponDamage');
		}
		if (attackEffects.includes('damage') || attackEffects.includes('weaponDamage')) {
			damageEffects = defender.activateAbilities('damage');
			attackEffects = attackEffects.concat(damageEffects);
			damagedEffects = defender.activateAbilities('damaged');
			defendEffects = defendEffects.concat(damagedEffects);
		}
		if (defendEffects.includes('cancelDamage') || attackEffects.includes('cancelDamage')) {
			Level.removeEffects(attackEffects, 'damage');
			Level.removeEffects(attackEffects, 'weaponDamage');
		}

		console.log(attacker.name, JSON.stringify(attackEffects), 'vs', JSON.stringify(defendEffects));

		const outcomeAttack = this.doEffects(attackEffects, attacker, defender);
		const outcomeDefend = this.doEffects(defendEffects, defender, attacker);

		// TODO: generate messages

		return { outcomeAttack, outcomeDefend, attackEffects, defendEffects };
	}

	doEffects(effects, actor, opponent) {
		let damage = 0;
		if (!effects) { return { damage }; }
		effects.forEach((effect) => {
			damage += this.doEffect(effect, actor, opponent);
		});
		return { damage };
	}

	doEffect(effect, actor, opponent) {
		console.log('doEffect', effect);
		let damage = 0;
		switch(effect) {
			case 'damage':
				damage += 1;
				opponent.wound(1);
			break;
			case 'weaponDamage':
				damage += actor.getWeaponDamage();
				opponent.wound(damage);
			break;
			case 'heal':
			case 'hp':
				actor.heal(1);
			break;
			case 'ap':
				actor.healPool('ap', 1);
			break;
			case 'bp':
				actor.healPool('bp', 1);
			break;
			case 'ep':
				actor.healPool('ep', 1);
			break;
			case 'moveSwitch': {
				const { x, y } = actor;
				actor.setCoordinates(opponent.x, opponent.y);
				opponent.setCoordinates(x, y);
			}
			break;
			case 'apDamage':
				actor.damagePool('ap', 1);
			break;
			case 'bpDamage':
				actor.damagePool('bp', 1);
			break;
			case 'epDamage':
				actor.damagePool('ep', 1);
			break;
			case 'push':
				this.pushActor(actor, opponent);
			break;
			case 'pushAoe':
				this.pushActor(actor, opponent);
				// TODO: Handle aoe --> everyone (accept opponent) around hitX, hitY gets knocked back
			break;
			case 'moveBack':
				this.pushActor(opponent, actor);
			break;
			case 'initiative':
				actor.initiativeBoost = 1;
			break;
			case "fire":
				// TODO:
			break;
			case "endGame":
				// TODO
			break;
			case "score1000":
				actor.score += 1000;
			break;
			default:
				this.doCustomEffect(effect, actor, opponent);
			break;
		}
		return damage;
	}

	doCustomEffect(effect, actor, opponent) {
		if (typeof this.customEffects[effect] === 'function') {
			this.customEffects[effect](effect, actor, opponent);
		}
	}

	pushActor(pusher, pushee) {
		const { x, y } = pusher;
		let moveX = pushee.x - x;
		let moveY = pushee.y - y;
		moveX = moveX / (moveX === 0 ? 1 : Math.abs(moveX));
		moveY = moveY / (moveY === 0 ? 1 : Math.abs(moveY));
		// console.log('pushing', pushee.name, moveX, moveY);
		pushee.move(moveX, moveY);
	}

	getActorsInitiativeOrdered() {
		const randomActors = random.shuffle(this.actors);
		const firstActors = [];
		let i = randomActors.length - 1;
		while (i--) {
			const actor = randomActors[i];
			if (actor.initiativeBoost > 0) {
				firstActors.push(actor);
				randomActors.splice(i, 1);
			}
		}
		return firstActors.concat(randomActors);
	}

	coolOffInitiativeBoosts() {
		this.actors.forEach((actor) => {
			actor.initiativeBoost = 0;
		});
	}

	// Generation

	generateItems(options = {}, itemTypes = {}) {
		let seed = this.seed + 200;
		let { items = [] } = options;

		const arr = [];
		items.forEach((levelItem) => {
			const quantity = levelItem.quantity || 1;
			// TODO: handle weight, etc.
			for (let i = 0; i < quantity; i++) {
				const { x, y } = this.findRandomFreeCell(++seed, levelItem.clearing);
				const itemTypeOptions = (levelItem.type && itemTypes[levelItem.type]) ? itemTypes[levelItem.type] : {};
				const itemOptions = {
					x, y,
					...itemTypeOptions,
					...levelItem
				};
				const item = new Item(itemOptions);
				arr.push(item);
			}
		});
		return arr;
	}

	generateProps(options = {}, propTypes = {}) {
		let seed = this.seed + 100;
		let { props = [] } = options;
		const background = this.background;

		const arr = [];
		props.forEach((levelProp) => {
			const quantity = (typeof levelProp.quantity === 'number') ? levelProp.quantity : 1;
			// console.log(levelProp);
			// TODO: handle weight, etc.
			for (let i = 0; i < quantity; i++) {
				const { x, y } = this.findRandomFreeCell(++seed, levelProp.clearing);
				const propTypeOptions = (levelProp.type && propTypes[levelProp.type]) ? propTypes[levelProp.type] : {};
				const propOptionsParam = {
					x, y, background,
					...propTypeOptions,
					...levelProp
				};
				const prop = new Prop(propOptionsParam);
				arr.push(prop);
			}
		});
		// console.log('generateProps', arr);
		this.props = arr;
		return this.props;
	}

	generateActors(options = {}, refData = {}) {
		let seed = this.seed + 999;
		const { monsterSpawn, monsters } = options;
		const monsterTypes = refData.monsters;
		const depth = options.levelIndex;
		const availableMonsters = monsters.filter((levelMonster) => {
			return (!levelMonster.minDepth) || levelMonster.minDepth <= depth;
		});
		const availableMonsterWeights = {};
		availableMonsters.forEach((levelMonster) => {
			if (levelMonster.weight) {
				availableMonsterWeights[levelMonster.type] = levelMonster.weight;
			}
		});
		const hasMonstersWithWeights = Object.keys(availableMonsterWeights).length > 0;
		const totalMonsterSpawnQuantity = 10; // TODO: parse monsterSpawn into random number
		const actors = [];
		// Create monsters with fixed quantities
		// Note: this could exceed the total quantity
		const availableMonstersFixedQuantities = availableMonsters.filter((levelMonster) => {
			return levelMonster.quantity;
		});
		availableMonstersFixedQuantities.forEach((levelMonster) => {
			const monsterTypeKey = levelMonster.type;
			for (let i = 0; i < levelMonster.quantity; i++) {
				const monster = this.createActor(monsterTypes, monsterTypeKey, ++seed);
				actors.push(monster);
			}
		});
		// Create weighted monsters
		if (hasMonstersWithWeights) {
			let stopper = 0;
			while (actors.length < totalMonsterSpawnQuantity && stopper < 9000) {
				stopper++;
				(() => {
					const monsterTypeKey = random.getWeightedValue(availableMonsterWeights);
					if (!monsterTypeKey) { return; }
					const monster = this.createActor(monsterTypes, monsterTypeKey, ++seed);
					actors.push(monster);
				})();
			}
		}
		// console.log('Actors at depth', depth, actors);
		return actors;
	}

	createActor(monsterTypes, monsterTypeKey, seed) {
		if (!monsterTypeKey) { return; }
		const { x, y } = this.findRandomFreeCell(seed);
		let monsterOptions = monsterTypes[monsterTypeKey];
		monsterOptions = { type: monsterTypeKey, aggro: 100, ...monsterOptions, x, y };
		// console.log(monsterTypes, monsterTypeKey, monsterOptions);
		return new Actor(monsterOptions);		
	}

	// Gets

	getMap() {
		return this.map;
	}

	getCellPassability(x, y) {
		const isMapPassable = this.map.getCellPassability(x, y);
		if (!isMapPassable) { return false; }
		const actorsHere = this.actors.filter((actor) => {
			return actor.x === x && actor.y === y && !actor.passable;
		});
		return (actorsHere.length === 0);
	}

	// Sets

	setEye(actorThing) {
		this.eye.x = actorThing.x;
		this.eye.y = actorThing.y;
		this.eye.sightRange = actorThing.sightRange;
	}
}

module.exports = Level;


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

const ROT = __webpack_require__(3);
const Cell = __webpack_require__(21);
const geometer = __webpack_require__(7);
const random = __webpack_require__(4);

class Map {
	constructor(options = {}) {
		this.baseSeed = options.seed || 1;
		this.seed = this.baseSeed;
		this.color = options.color || '#777';
		this.background = options.background || '#222';
		this.type = options.type || 'digger';
		this.rotMap = options.rotMap;
		this.cells = {};
		this.freeCells = [];
		this.walls = options.walls || true;
		this.wallsCharacter = options.wallsCharacter || '#'; // ▧
		this.generate(options);
	}

	generate() {
		this.cells = {};
		// TODO: allow different types
		ROT.RNG.setSeed(this.seed);
		this.rotMap = new ROT.Map.Digger();
		this.freeCells.length = 0;
		
		this.rotMap.create((x, y, value) => {
			if (value) {
				return;
			}
			const key = this.setCharacterAt('.', x, y);
			this.freeCells.push(key);
		});

		if (this.walls) {
			this.addWalls();
		}
		
		// console.log(this);
	}

	addWalls() {
		this.forEachCell((cell, x, y) => {
			Map.forEachDirection((dir, dirX, dirY) => {
				const newX = x + dirX;
				const newY = y + dirY;
				const wallCell = this.getCellAt(newX, newY);
				if (!wallCell) {
					this.setCharacterAt(this.wallsCharacter, newX, newY);
				}
			});
		});
	}

	discoverCircle(x, y, radius) {
		this.forEachCellInCircle(x, y, radius, (cell) => {
			cell.discover();
		});
	}

	static parseKeyCoordinates(key) {
		const parts = key.split(",");
		const x = parseInt(parts[0]);
		const y = parseInt(parts[1]);
		return { x, y };
	}

	static makeKey(x, y) {
		return x + ',' + y;
	}

	static forEachDirection(callback) {
		const dirCoords = [
			{x: 0, y: -1}, // top
			{x: 1, y: -1},
			{x: 1, y: 0}, // right
			{x: 1, y: 1},
			{x: 0, y: 1}, // bottom
			{x: -1, y: 1},
			{x: -1, y: 0}, // left
			{x: -1, y: -1},
		];
		for (let i = 0; i < 8; i++) {
			callback(i, dirCoords[i].x, dirCoords[i].y);
		}
	}

	forEachCell(callback) {
		for (let key in this.cells) {
			const { x, y } = Map.parseKeyCoordinates(key);
			callback(this.cells[key], x, y, key);
		}
	}

	forEachCellInCircle(centerX, centerY, radius, callback, includeEmptyCells = false) {
		const maxX = centerX + radius;
		const maxY = centerY + radius;
		let x;
		for (x = centerX - radius; x <= maxX; x++) {
			let y;
			for (y = centerY - radius; y <= maxY; y++) {
				const r = Math.round(geometer.getDistance(centerX, centerY, x, y));
				if (r < radius) {
					const cell = this.getCellAt(x, y);
					if (cell || includeEmptyCells) {
						callback(cell, x, y)
					}
				}
			}
		}
	}

	getRandomFreeCell(seed) {		
		const i = random.roll(this.freeCells.length, seed);
		
		// TODO: TBD- Is it still a free cell?
		// var key = freeCells.splice(index, 1)[0];
		// this.map[key] = "*";
		const key = this.freeCells[i];
		const cell = this.cells[key];
		
		const { x, y } = Map.parseKeyCoordinates(key);
		// console.log(seed, key, i, x, y);
		return { x, y, cell };
	}

	getCellAt(x, y) {
		const key = Map.makeKey(x, y);
		return this.cells[key];		
	}

	getCharacterAt(x, y) {
		const cell = this.getCellAt(x, y);
		return (cell) ? cell.getCharacter() : null;
	}

	setCharacterAt(char, x, y) {
		const key = Map.makeKey(x, y);
		const cell = this.cells[key];
		if (cell) {
			cell.setCharacter(char);
		} else {
			const { color, background } = this;
			this.cells[key] = new Cell({ color, background, character: char });
		}
		return key;
	}

	getCellPassability(x, y) {
		const cell = this.getCellAt(x, y);
		return (cell) ? cell.getPassability() : false;
	}

	getLightingAt(x, y) {
		return {}; // TODO
	}

	// _generateBoxes(freeCells) {
	// 	for (var i=0;i<10;i++) {
	// 		var index = Math.floor(ROT.RNG.getUniform() * freeCells.length);
	// 		var key = freeCells.splice(index, 1)[0];
	// 		this.map[key] = "*";
	// 	}
	// }
}

module.exports = Map;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

class Inventory {
	constructor(options = {}) {
		this.size = (typeof options.size === 'number') ? options.size : 10;
		this.items = [];
	}

	isFull() {
		return (this.items.length >= this.size);
	}

	hasSpace() {
		return !this.isFull();
	}

	add(item) {
		if (this.isFull()) {
			return false;
		}
		if (!item.portable) {
			return false;
		}
		this.items.push(item);
		return true;
	}

	remove(item) {
		const i = this.items.indexOf(item);
		if (i <= -1) {
			console.warn('nothing found in', this.items, item);
			return false;
		}
		const arr = this.items.splice(i, 1);
		return arr[0];
	}

	removeType(typeKey) {
		const itemsOfType = this.items.filter((item) => { return item.type === typeKey; });
		if (itemsOfType.length === 0) {
			return false;
		}
		return this.remove(itemsOfType[0]);
	}

	get(n) {
		if (typeof n === 'number') {
			return this.items[n];
		} else if (typeof n === 'string') {
			return this.items.find((item) => { return item.name === n; });
		}
		return this.items;
	}

	getString() {
		const arr = this.items.map((item, i) => { return `[${(i + 1)}] ${item.name}`; });
		return (arr.length) ? arr.join(', ') : 'nothing';
	}

	loopOverContents(fn) {
		this.items.forEach((item, i) => {
			fn(item, i);
		});
	}

	hasContents() {
		return (this.items.length > 0);
	}

	contains(itemName) {
		let foundItem = this.items.find((item) => { return (item.name === itemName); });
		return Boolean(foundItem);
	}

	containsType(typeName) {
		let foundItem = this.items.find((item) => { return (item.type === typeName); });
		return Boolean(foundItem);
	}
}

module.exports = Inventory;


/***/ }),
/* 15 */
/***/ (function(module, exports) {


module.exports = {
	DIRS_4: Object.freeze([
		{ x: 0, y: -1 },
		{ x: 1, y: 0 },
		{ x: 0, y: 1 },
		{ x: -1, y: 0 },
	]),
	DIRS_8: Object.freeze([
		{ x: 0, y: -1 },
		{ x: 1, y: -1 },
		{ x: 1, y: 0 },
		{ x: 1, y: 1 },
		{ x: 0, y: 1 },
		{ x: -1, y: 1 },
		{ x: -1, y: 0 },
		{ x: -1, y: -1 },	
	]),
	DIRS_8_DIAGNOLS: Object.freeze([
		{ x: 1, y: -1 },
		{ x: 1, y: 1 },
		{ x: -1, y: 1 },
		{ x: -1, y: -1 },	
	]),
};


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

const Item = __webpack_require__(5);

class Prop extends Item {
	constructor(options = {}) {
		options = { portable: false, ...options };
		super(options);
	}
}

module.exports = Prop;


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

const ROT = __webpack_require__(3);
const Game = __webpack_require__(19);
const Item = __webpack_require__(5);
const Map = __webpack_require__(13);
const Actor = __webpack_require__(8);
const Prop = __webpack_require__(16);
const Level = __webpack_require__(12);
const Display = __webpack_require__(11);
const random = __webpack_require__(4);
const ready = __webpack_require__(10);

const rote = {
    ROT,
    Game, Level, Map, Item, Prop, Actor, Display,
    random,
    ready
};

if (window) {
    window.rote = rote;
}

module.exports = rote;


/***/ }),
/* 18 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

const ROT = __webpack_require__(3);
const ready = __webpack_require__(10);
const Display = __webpack_require__(11);
const Level = __webpack_require__(12);
const Actor = __webpack_require__(8);
const Item = __webpack_require__(5);
const Keyboard = __webpack_require__(22);
const MusicBox = __webpack_require__(23);
const Console = __webpack_require__(24);
const random = __webpack_require__(4);

const MAIN_GAME_STATE = 'GAME';
const SPLASH_STATE = 'SPLASH';

class Game {
	constructor(options) {
		const { id, consoleId, data } = options;
		this.id = id;
		this.displayContainer = document.getElementById(id || 'display');
		this.console = new Console({ id: consoleId });
		this.display = null;
		this.activeLevelIndex = 0;
		// The generated levels
		this.levels = [];
		// Reference data on prototypical "things" (monsters, items)
		this.data = { monsters: {}, items: {}, props: {} };
		// The main actor
		this.hero = null; // player character / player actor
		// Guts
		this.scheduler = new ROT.Scheduler.Simple();
		this.engine = null;
		this.keyboard = null;
		this.state = 'INIT';
		this.states = ['INIT', SPLASH_STATE, MAIN_GAME_STATE];
		// this.setupEngine();
		this.loadingPromise = null;
		this.console.setup();
		this.loadData(data);
		this.hooks = {};
		this.customEffects = { ...options.customEffects };
	}

	setupEngine() {
		this.engine = new ROT.Engine(this.scheduler);
		this.engine.start();
		return this.engine;
	}

	setupKeyboard() {
		this.keyboard = new Keyboard({ state: MAIN_GAME_STATE, autoStart: true });
		// Splash state
		this.keyboard.on(SPLASH_STATE, 'ENTER', () => {
			this.setState(MAIN_GAME_STATE);
		});
		// Main state
		this.keyboard.on(MAIN_GAME_STATE, 'DIRECTION', (keyName, keyCode, direction) => {
			// TODO: Lock and unlock the game? or do something else to determine if it's OK to move
			this.hero.queueAction('move', { direction });
			this.advance();
		});
		this.keyboard.on(MAIN_GAME_STATE, 'ENTER', () => {
			// this.actorDefaultAction(this.hero); // TODO: Remove me
			this.actorAddDefaultAction(this.hero);
			this.advance();
		});
		this.keyboard.on(MAIN_GAME_STATE, 'SPACE', () => {
			this.hero.queueAction('wait');
			this.advance();
		});
		this.keyboard.on(MAIN_GAME_STATE, 't', () => {
			this.showInventory();
			this.print('> Throw which item?');
			let n = prompt('Throw which item? \n\n' + this.hero.inventory.getString());
			if (!n || n.length === 0) {
				this.print('None');
				return;
			}
			n = parseInt(n, 10);
			const i = (isNaN(n)) ? -1 : n - 1;
			const item = this.hero.inventory.get(i);
			if (item) {
				this.hero.queueAction('throw', { what: item, x: this.hero.x, y: this.hero.y });
				this.advance();
			} else {
				this.print(`Invalid item [${n}]`);
			}
		});
		this.keyboard.on(MAIN_GAME_STATE, 'i', () => { this.showInventory(); });
		for (let i = 0; i < 9; i++) {
			const key = String(i + 1);
			this.keyboard.on(MAIN_GAME_STATE, key, () => {
				this.hero.readyAbilityByIndex(i);
				this.draw();
			});
		}
		// this.keyboard.start();
	}

	setupMusic() {
		this.music = new MusicBox(this.data.playlist);
	}

	removeKeyboard() {
		// TODO: this.keyboard.off() on all listeners
	}

	createDisplay(options = {}) {
		this.display = new Display(options);
		this.display.setupElements();
	}

	//---- Draw / Render

	print(str, classes = '', wait = 0) {
		if (wait) {
			setTimeout(() => { this.print(str, classes); }, wait);
			return;
		}
		this.console.print(str, classes);
	}

	showInventory() {
		const items = this.hero.inventory.getString();
		this.print('Inventory: ' + items);		
	}

	draw() {
		this.display.drawLevel(this, this.getActiveLevel(), this.hero);
	}


	//---- Generation

	createLevel(options = {}, seed) {
		options.seed = seed || options.seed;
		const levelOptions = {
			customEffects: this.customEffects,
			...options,
			levelIndex: this.levels.length
		};
		// console.warn(this.customEffects, levelOptions);
		const level = new Level(levelOptions, this.data);
		this.levels.push(level);
		return level;
	}

	createLevels(arr = [], baseSeed = 1) {
		let seed = baseSeed;
		arr.forEach((item, i) => {
			seed += i;
			if (typeof item === 'string') { // level type key
				this.createLevel(this.getLevelType(item), seed);
			} else if (typeof item === 'object' && item !== null) {
				const n = (typeof item.repeat === 'number') ? item.repeat : 1;
				for (let r = 0; r < n; r++) {
					seed += r;
					this.createLevel(this.getLevelType(item.levelTypeKey), seed);
				}
			}
		});
		this.connectStairs();
		return this.levels;
	}

	createActor(options = {}, level) {
		const actor = new Actor(options);
		this.scheduler.add(actor, true);
		level = (level === true) ? this.getActiveLevel() : level;
		if (level) {
			level.addActor(actor);
		}
		return actor;
	}

	createItem(options = {}, level) {
		const item = new Item(options);
		level = (level === true) ? this.getActiveLevel() : level;
		if (level) {
			level.addItem(item);
		}
		return item;
	}

	createHero(options = {}) {
		const heroOptions = { ...options, character: '@', isHero: true };
		this.hero = this.createActor(heroOptions, true);

		const g = this;
		// Setup action stuff ... this needs to be refactored
		this.hero.act = function () {
			g.engine.lock();
			window.addEventListener('keydown', this); // pass the hero; the `handleEvent` will be used
		};
		this.hero.handleEvent = function (e) { // Leftover from tutorial, part 2
			window.removeEventListener('keydown', this);
			g.engine.unlock();
		};
		if (this.display) {
			this.display.setCameraTarget(this.hero);
		}
		this.discoverAroundHero();
		return this.hero;
	}

	connectStairs() {
		const STAIR_LINK = 'stairLink';
		const propTypes = this.getDataPropArray();
		const stairsDownTypes = propTypes.filter((propType) => { return Boolean(propType[STAIR_LINK]); });
		this.levels.forEach((level, i) => {
			// Handle each type of stairs
			stairsDownTypes.forEach((stairsDownType) => {
				const stairDownTypeKey = stairsDownType.key;
				const stairUpTypeKey = stairsDownType[STAIR_LINK];
				const levelStairsDown = level.props.filter((prop) => {
					return prop.type === stairDownTypeKey;
				});
				levelStairsDown.forEach((stair) => {
					const levelBelow = this.levels[i + 1];
					if (!levelBelow) { return; }
					const possibleStairsUp = levelBelow.props.filter((prop) => {
						return prop.type === stairUpTypeKey && !Boolean(prop.teleport);
					});
					// TODO: Find stairs to connect to based on proximity
					const levelBelowStairsUp = possibleStairsUp[0]; // TODO: remove this
					this.connectTeleportProps(levelBelowStairsUp, stair, i, i + 1, 'ascend', 'descend');
				});
			});
		});
	}

	connectTeleportProps(prop1, prop2, levelIndex1, levelIndex2, verb1, verb2) {
		if (!prop1 || !prop2) { return; }
		prop1.setTeleport({
			levelIndex: levelIndex1, x: prop2.x, y: prop2.y, verb: verb1
		});
		prop2.setTeleport({
			levelIndex: levelIndex2, x: prop1.x, y: prop1.y, verb: verb2
		});
	}

	//---- Movement, Combat

	moveActor(actor, direction, bumpCombat = false) {
		const diff = ROT.DIRS[8][direction];
		var newX = actor.x + diff[0];
		var newY = actor.y + diff[1];
		return this.moveActorTo(actor, newX, newY, bumpCombat);
	}

	moveActorTo(actor, x, y, bumpCombat = false) {
		const level = this.getActiveLevel();
		const canMoveToCell = level.getCellPassability(x, y);
		// console.log('considering moving to', x, y, '... free?', canMoveToCell);
		if (!canMoveToCell) {
			const blocker = level.findActor(x, y);
			if (blocker) {
				return this.bump(actor, blocker, x, y, bumpCombat);
			}
			return { x: x, y: y, moved: false };
		}
		actor.moveTo(x, y);
		// TODO: just redraw the space that was under the actor and the actor in the new spot?
		if (actor.isHero) {
			this.discoverAroundHero();
			this.narrateAroundHero();
		}
		this.draw();
		return { x, y, moved: true };
	}

	bump(actor, blocker, x, y, bumpCombat) {
		if (bumpCombat && actor.faction !== blocker.faction) {
			this.resolveCombat(actor, blocker, x, y);
			return { x, y, moved: false };
		} else if (Game.canBumpSwitch(actor, blocker)) {
			actor.moveTo(x, y);
			return { x, y, moved: true };
			// TODO: allow pushes based on authority
		} else { // just blocked
			return { x, y, moved: false };
		}		
	}

	static canBumpSwitch(actor, blocker) {
		if (actor.aggro || blocker.aggro) { // TOOD: make this more nuanced
			return false;
		}
		const blockersNextAction = blocker.getNextAction();
		if (!blockersNextAction) { return true; }
		return (
			blockersNextAction.verb === 'move' &&
			blockersNextAction.x === actor.x &&
			blockersNextAction.y === actor.y
		);
	}

	teleportActor(actor, teleportParams = {}) {
		const originalLevelIndex = this.activeLevelIndex;
		// console.warn('teleporting', actor, teleportParams);
		const { levelIndex, x, y } = teleportParams;
		const currentLevel = this.getActiveLevel();
		currentLevel.removeActor(actor);
		this.setActiveLevel(levelIndex);
		const newLevel = this.getActiveLevel();
		newLevel.addActor(actor);
		actor.setCoordinates(x, y);
		console.log('New Level:', newLevel);
		if (actor.isHero) {
			this.discoverAroundHero();
			this.narrateAroundHero();
		}
		if (originalLevelIndex !== levelIndex) {
			this.hook('afterTeleportLevel', { levelIndex, x, y });
		}
		// this.draw();
	}

	resolveCombat(actor, opponent, x, y) {
		const level = this.getActiveLevel();
		if (!actor || !opponent || actor.faction === opponent.faction) {
			return false;
		}
		const { outcomeAttack } = level.resolveCombatEffects(actor, opponent);
		// TODO: get messages from resolve and effects methods
		g.print(`${actor.name} attacks ${opponent.name} and does ${outcomeAttack.damage} damage!`);
		if (opponent.dead()) {
			g.print(`${opponent.name} has been killed.`);
			actor.score += (this.activeLevelIndex + 1) * 10;
		}
	}

	actorAddDefaultAction(actor) {
		const level = this.getActiveLevel();
		const thing = level.findThingSmart(actor.x, actor.y, 'portable');
		// TODO: Maybe get multiple things and check if they have actions?
		console.log(thing, actor.x, actor.y);
		if (!thing) {
			return;
		}
		if (thing.portable) {
			actor.queueAction('pickup', { target: thing });
		} else if (thing.hasAction('use')) {
			actor.queueAction('use', { target: thing });
		} else if (thing.hasAction('descend') || thing.hasAction('ascend')) {
			actor.queueAction('teleport', { teleport: thing.teleport });
			console.log('Planning to teleport...', actor.actionQueue);
		}
	}

	advance() {
		const startHp = this.hero.hp;
		// TODO: advance time
		// Do actions for all actors
		const level = this.getActiveLevel();
		level.resolveRoundEffects();
		const actors = level.getActorsInitiativeOrdered();
		level.coolOffInitiativeBoosts();
		actors.forEach((actor) => {
			actor.planAction(level, this.hero);
			this.advanceActor(actor);
		});
		// this.advanceActor(this.hero);
		const isDamaged = (startHp > this.hero.hp);
		this.display.drawDamage(isDamaged);
		if (this.hero.dead()) {
			this.print('R.I.P. Congratulations! YOU HAVE DIED!', 'plot');
			this.print('Reload the page to play again.', 'tip');
		}
		this.draw();
	}

	advanceActor(actor) {
		const level = this.getActiveLevel();
		const action = actor.doAction();
		if (!action) { return; }
		const { verb, target, what, x, y } = action;
		if (actor.isHero) {
			if (verb === 'move') { console.log(actor.name + ' ' + verb); }
			else { console.log(actor.name, verb, action); }
		}
		let message = '';
		switch (verb) {
			case 'move':
				const bumpCombat = (actor.isHero || actor.aggro > 0);
				if (action.direction === undefined) {
					this.moveActorTo(actor, action.x, action.y, bumpCombat);
				} else {
					this.moveActor(actor, action.direction, bumpCombat);
				}
			break;
			case 'use':
				const outcome = level.useThing(actor, 'use', target);
				message = outcome.message;
			break;
			case 'open':
				message = level.useThing(actor, 'open', target);
			break;
			case 'teleport':
				message = `${actor.name} travels to a new location: `;
				this.teleportActor(actor, action.teleport);
				{
					const newLevel = this.getActiveLevel();
					message += newLevel.name;
					if (newLevel.description) {
						message += ' - ' + newLevel.description;
					}
				}
			break;
			case 'pickup':
				const pickedUp = this.pickupItem(actor, target);
				if (pickedUp) {
					message = `${actor.name} picks up the ${target.name}.`;
				}
			break;
			case 'throw':
				message = level.throw(actor, what, x, y);
			break;
			case 'wait':
				actor.wait();
				if (actor.isHero) {
					message = `${actor.name} waits (random recovery of AP, BP, or EP points).`;
				}
			break;
		}
		
		this.print(message);
	}

	pickupItem(actor, thing) {
		if (!thing.portable) { return false; }
		const level = this.getActiveLevel();
		const item = level.removeItem(thing);
		if (!item) { return false; }
		const added = actor.inventory.add(thing);
		if (!added) {
			level.addItem(item);
		}
		return added;
	}

	//---- Exploration

	discoverAroundHero() {
		const level = this.getActiveLevel();
		const illumination = this.hero.inventory.items.reduce((n, item) => {
			return n + item.illumination;
		}, 0);
		level.discoverCircle(this.hero.x, this.hero.y, this.hero.sightRange + illumination); // TODO: allow different POV
		level.setEye(this.hero);
	}

	narrateAroundHero() {
		const allThingsOnHero = this.getThingsOnActor(this.hero);
		if (allThingsOnHero.length === 0) { return; }
		const namesOnHero = allThingsOnHero.map((thing) => thing.name);
		const namesString = (namesOnHero.length > 1) ? namesOnHero.join(', ') : 'a ' + namesOnHero[0];
		this.console.print(`You are on ${namesString}.`);
	}

	//---- System

	ready(callback, fonts = []) {
		ready(() => {
			if (this.loadingPromise instanceof Promise) {
				this.loadingPromise
					.then(() => { callback(); })
					.catch((err) => { console.error('Error loading something', err) });
			} else {
				callback();
			}
		}, fonts);
		// TODO: return a promise so can be used async
	}

	start() {
		this.setupEngine();
		this.setupKeyboard();
		this.setupMusic();
		this.setStateDetect(SPLASH_STATE);
		// this.setState(MAIN_GAME_STATE);
		// TODO: start graphics loop
		this.draw();
	}

	stop() {
		this.setState('OFF');
		this.removeKeyboard();
		// TODO: stop graphics loop
	}

	loadData(data) {
		const promises = [];
		function parseJson(response) { return response.json(); }
		function fixInnerObject(obj, key) {
			return (typeof obj[key] === 'object') ? obj[key] : obj;
		}
		for (let key in data) {
			const p = fetch(data[key])
				.then(parseJson)
				.then((obj) => fixInnerObject(obj, key))
				.then((obj) => { this.setData(key, obj); });
			promises.push(p);
		}
		this.loadingPromise = Promise.all(promises); // .then((resp) => { console.log(resp); });
		return this.loadingPromise;
	}

	//---- Hooks

	addHook(hookName, fn) {
		if (!this.hooks[hookName]) {
			this.hooks[hookName] = [];
		}
		this.hooks[hookName].push(fn);
	}

	removeHook(hookName, fn) {
		if (!this.hooks[hookName]) { return; }
		const i = this.hooks[hookName].indexOf(fn);
		this.hooks[hookName].splice(i, 1);
	}

	hook(hookName, data = {}) {
		const hook = this.hooks[hookName];
		if (!hook) { return; }
		hook.forEach((fn) => {
			fn(data, this, hookName);
		});
	}

	//---- Gets

	getActiveLevel() {
		return this.levels[this.activeLevelIndex];
	}

	getLevelType(key) {
		const lt = this.data.levels[key];
		if (typeof lt !== 'object' || lt === null) {
			console.error('Cannot find level type ', key);
		}
		return lt;
	}

	getDataPropArray() {
		const propKeys = Object.keys(this.data.props);
		const arr = [];
		propKeys.forEach((key) => {
			const prop = { ...this.data.props[key], key };
			arr.push(prop);
		});
		return arr;
	}

	getThingsOnActor(actor) {
		const { x, y } = actor;
		return this.getActiveLevel().findThings(x, y);
	}

	//---- Sets

	setActiveLevel(i) {
		this.activeLevelIndex = i;
		return;
	}

	setData(key, obj) {
		this.data[key] = Object.freeze(obj);
	}

	setStateDetect(stateFallback) {
		// TODO: improve... not sure i like how this works
		// const hash = location.hash.substring(1).toUpperCase();
		// if (this.states.includes(hash)) {
		// 	return this.setState(hash);
		// }
		return this.setState(stateFallback);
	}

	setState(state) {
		console.log('Setting state:', state);
		const prefix = 'rote-state-';
		this.state = state;
		// const body = document.getElementsByClassName('rote-state')[0];
		const body = document.getElementsByTagName('body')[0];
		// body.className = 'rote-state'; // TODO: make this smarter so it only removes rote states
		// body.classList.add(prefix + this.state.toLowerCase());
		body.className = 'rote-state ' + prefix + state.toLowerCase();
		location.hash = state.toLowerCase();
		this.keyboard.setState(state);
	}
}

module.exports = Game;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

/* Font Face Observer v2.1.0 - © Bram Stein. License: BSD-3-Clause */(function(){function l(a,b){document.addEventListener?a.addEventListener("scroll",b,!1):a.attachEvent("scroll",b)}function m(a){document.body?a():document.addEventListener?document.addEventListener("DOMContentLoaded",function c(){document.removeEventListener("DOMContentLoaded",c);a()}):document.attachEvent("onreadystatechange",function k(){if("interactive"==document.readyState||"complete"==document.readyState)document.detachEvent("onreadystatechange",k),a()})};function t(a){this.a=document.createElement("div");this.a.setAttribute("aria-hidden","true");this.a.appendChild(document.createTextNode(a));this.b=document.createElement("span");this.c=document.createElement("span");this.h=document.createElement("span");this.f=document.createElement("span");this.g=-1;this.b.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.c.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";
this.f.style.cssText="max-width:none;display:inline-block;position:absolute;height:100%;width:100%;overflow:scroll;font-size:16px;";this.h.style.cssText="display:inline-block;width:200%;height:200%;font-size:16px;max-width:none;";this.b.appendChild(this.h);this.c.appendChild(this.f);this.a.appendChild(this.b);this.a.appendChild(this.c)}
function u(a,b){a.a.style.cssText="max-width:none;min-width:20px;min-height:20px;display:inline-block;overflow:hidden;position:absolute;width:auto;margin:0;padding:0;top:-999px;white-space:nowrap;font-synthesis:none;font:"+b+";"}function z(a){var b=a.a.offsetWidth,c=b+100;a.f.style.width=c+"px";a.c.scrollLeft=c;a.b.scrollLeft=a.b.scrollWidth+100;return a.g!==b?(a.g=b,!0):!1}function A(a,b){function c(){var a=k;z(a)&&a.a.parentNode&&b(a.g)}var k=a;l(a.b,c);l(a.c,c);z(a)};function B(a,b){var c=b||{};this.family=a;this.style=c.style||"normal";this.weight=c.weight||"normal";this.stretch=c.stretch||"normal"}var C=null,D=null,E=null,F=null;function G(){if(null===D)if(J()&&/Apple/.test(window.navigator.vendor)){var a=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))(?:\.([0-9]+))/.exec(window.navigator.userAgent);D=!!a&&603>parseInt(a[1],10)}else D=!1;return D}function J(){null===F&&(F=!!document.fonts);return F}
function K(){if(null===E){var a=document.createElement("div");try{a.style.font="condensed 100px sans-serif"}catch(b){}E=""!==a.style.font}return E}function L(a,b){return[a.style,a.weight,K()?a.stretch:"","100px",b].join(" ")}
B.prototype.load=function(a,b){var c=this,k=a||"BESbswy",r=0,n=b||3E3,H=(new Date).getTime();return new Promise(function(a,b){if(J()&&!G()){var M=new Promise(function(a,b){function e(){(new Date).getTime()-H>=n?b(Error(""+n+"ms timeout exceeded")):document.fonts.load(L(c,'"'+c.family+'"'),k).then(function(c){1<=c.length?a():setTimeout(e,25)},b)}e()}),N=new Promise(function(a,c){r=setTimeout(function(){c(Error(""+n+"ms timeout exceeded"))},n)});Promise.race([N,M]).then(function(){clearTimeout(r);a(c)},
b)}else m(function(){function v(){var b;if(b=-1!=f&&-1!=g||-1!=f&&-1!=h||-1!=g&&-1!=h)(b=f!=g&&f!=h&&g!=h)||(null===C&&(b=/AppleWebKit\/([0-9]+)(?:\.([0-9]+))/.exec(window.navigator.userAgent),C=!!b&&(536>parseInt(b[1],10)||536===parseInt(b[1],10)&&11>=parseInt(b[2],10))),b=C&&(f==w&&g==w&&h==w||f==x&&g==x&&h==x||f==y&&g==y&&h==y)),b=!b;b&&(d.parentNode&&d.parentNode.removeChild(d),clearTimeout(r),a(c))}function I(){if((new Date).getTime()-H>=n)d.parentNode&&d.parentNode.removeChild(d),b(Error(""+
n+"ms timeout exceeded"));else{var a=document.hidden;if(!0===a||void 0===a)f=e.a.offsetWidth,g=p.a.offsetWidth,h=q.a.offsetWidth,v();r=setTimeout(I,50)}}var e=new t(k),p=new t(k),q=new t(k),f=-1,g=-1,h=-1,w=-1,x=-1,y=-1,d=document.createElement("div");d.dir="ltr";u(e,L(c,"sans-serif"));u(p,L(c,"serif"));u(q,L(c,"monospace"));d.appendChild(e.a);d.appendChild(p.a);d.appendChild(q.a);document.body.appendChild(d);w=e.a.offsetWidth;x=p.a.offsetWidth;y=q.a.offsetWidth;I();A(e,function(a){f=a;v()});u(e,
L(c,'"'+c.family+'",sans-serif'));A(p,function(a){g=a;v()});u(p,L(c,'"'+c.family+'",serif'));A(q,function(a){h=a;v()});u(q,L(c,'"'+c.family+'",monospace'))})})}; true?module.exports=B:(undefined);}());


/***/ }),
/* 21 */
/***/ (function(module, exports) {

class Cell {
	constructor(options = {}) {
		this.character = options.character || ' ';
		this.discovered = false;
		this.color = options.color || '#777';
		this.background = options.background || '#222';
		this.passability = false; // TODO: handle this different?
	}

	// Gets

	getPassability() { // TODO: update this
		return (this.character === '.');
	}

	getCharacter() {
		return this.character;
	}

	getForegroundColor(inView = true) {
		if (!this.discovered) {
			return '#000';
		}
		return (inView) ? this.color : '#232120';
	}

	getBackgroundColor(inView = true) {
		if (!this.discovered) {
			return '#000';
		}
		return (inView) ? this.background : '#111010';
	}

	// Sets

	setCharacter(char) {
		this.character = char;
	}

	discover() {
		this.discovered = true;
	}
}

module.exports = Cell;


/***/ }),
/* 22 */
/***/ (function(module, exports) {

const DIRECTION8 = {
	'UP': 0, 'UP-RIGHT': 1,
	'RIGHT': 2, 'DOWN-RIGHT': 3,
	'DOWN': 4, 'DOWN-LEFT': 5,
	'LEFT': 6, 'UP-LEFT': 7
};
const DIRECTION4 = { 'UP': 0, 'RIGHT': 1, 'DOWN': 2, 'LEFT': 3 };
const DIRECTION4_ARRAY = ['UP', 'RIGHT', 'DOWN', 'LEFT'];

const USED_KEYS = ['i', 't', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
const KEY_MAP = {
	"9":	"TAB",
	"13":	"ENTER",
	"27":	"ESC",
	"32":	"SPACE",
};
KEY_MAP[38] = 'UP'; // up
KEY_MAP[33] = 'UP-RIGHT';
KEY_MAP[39] = 'RIGHT'; // right
KEY_MAP[34] = 'DOWN-RIGHT';
KEY_MAP[40] = 'DOWN'; // down
KEY_MAP[35] = 'DOWN-LEFT';
KEY_MAP[37] = 'LEFT'; // left
KEY_MAP[36] = 'UP-LEFT';

const WASD_KEYMAP = {
	87: 'UP', // w
	65: 'LEFT', // a
	83: 'DOWN', // s
	68: 'RIGHT', // d
};
const WASD_DIAGONAL = {
	...WASD_KEYMAP,
	81: 'UP-LEFT', // q
	69: 'UP-RIGHT', // e
	90: 'DOWN-LEFT', // z
	67: 'DOWN-RIGHT', // c
};
const VI_KEYMAP = {
	72: 'LEFT', // h
	74: 'DOWN', // j
	75: 'UP', // k
	76: 'RIGHT', // l

};
const VI_DIAGONAL = {
	...VI_KEYMAP,
	89: 'UP-LEFT', // y
	85: 'UP-RIGHT', // u
	66: 'DOWN-LEFT', // b
	78: 'DOWN-RIGHT', // n
};


const UNSPECIFIED_STATE = 'UNSPECIFIED';

class KeyboardListener {
	constructor(options = {}) {
		this.callbacks = {};
		this.isListening = false;
		this.state = options.state || UNSPECIFIED_STATE;
		this.autoStart = (options.autoStart === undefined) ? false : Boolean(options.autoStart);
	}

	setState(state = UNSPECIFIED_STATE) {
		this.state = state.toString();
	}

	on(state, key, callback) {
		// key can be a keyCode or a keyType like 'DIRECTION'
		this.callbacks[state + '_' + key] = callback;
		if (this.autoStart) {
			this.start();
		}
	}
	
	off(state, key, callback) {
		// TODO: remove callback
		// TODO: if no more callbacks then stop
	}

	getKeyMap() {
		let keyMap = { ...KEY_MAP };
		// TODO: variations based on options selected
		keyMap = { ...keyMap, ...WASD_DIAGONAL, ...VI_DIAGONAL };
		return keyMap;
	}

	handleEvent(e) {
		const keyMap = this.getKeyMap();
		const { keyCode, key } = e;
		const isKeyUsed = USED_KEYS.includes(key) || (keyCode in keyMap);

		if (!isKeyUsed) {
			console.log('Keyboard handleEvent - unaccounted for key:', key, keyCode);
			return;
		}
		e.preventDefault();

		// Lookup key name and direction
		const keyName = keyMap[keyCode] || key;
		const direction = DIRECTION8[keyName];
		// console.log('handleEvent', e, keyName, keyCode, direction);

		// Callbacks
		if (direction !== undefined) {
			const typeCallback = this.callbacks[this.state + '_DIRECTION'];
			if (typeCallback) {
				typeCallback(keyName, keyCode, direction);
			}
		}
		const callback = this.callbacks[this.state + '_' + keyName];
		// console.log(this.state + '_' + keyName, callback);
		if (callback) {
			callback(keyName, keyCode, direction);
		}
	}

	start() {
		if (this.isListening) {
			return;
		}
		window.addEventListener('keydown', this);  // pass this; the `handleEvent` will be used
		this.isListening = true;
	}

	stop() {
		// TODO: remove event listener
	}
}

module.exports = KeyboardListener;


/***/ }),
/* 23 */
/***/ (function(module, exports) {


class MusicBox {
	constructor(playlist) {
		this.audio = null;
		this.playlist = [ ...playlist ];
	}

	addToPlaylist(songPath) {
		this.playlist.push(songPath);
	}

	play(i = 0) {
		this.audio = new Audio(this.playlist[i]);
		this.audio.play();
	}
}

module.exports = MusicBox;


/***/ }),
/* 24 */
/***/ (function(module, exports) {

class Console {
	constructor(options = {}) {
		this.id = options.id || 'console';
		this.container = null;
		this.list = null;
		this.messages = [];
		this.writeToConsoleLog = false;
	}

	setup() {
		this.container = document.getElementById(this.id);
		this.clear();
	}

	clear() {
		this.messages.length = 0;
		this.container.innerHTML = '<ul></ul>';
		this.list = this.container.firstChild;
	}

	print(str, classes = '') {
		if (!str) {
			return;
		}
		if (this.writeToConsoleLog) {
			console.log('%c' + str, 'color: #559955');
		}
		const safeStr = str.replace('<', '&lt;');
		this.list.innerHTML += `<li class="${classes}">${safeStr}</li>`;
		this.container.scrollTop = this.container.scrollHeight;
		this.trim();
	}

	// aliases
	log(str) { return this.print(str);	}
	add(str) { return this.print(str); }

	trim() {
		if (this.list.innerHTML.length > 5000) {
			this.list.removeChild(this.list.firstChild);
		}
	}
}

module.exports = Console;


/***/ })
/******/ ]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvcm5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL3V0aWwuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvY29sb3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvZGlzcGxheS9jYW52YXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvZGlzcGxheS9oZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvZGlzcGxheS9yZWN0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL2Rpc3BsYXkvdGlsZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi90ZXh0LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL2NvbnN0YW50cy5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9kaXNwbGF5L2Rpc3BsYXkuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvc3RyaW5nZ2VuZXJhdG9yLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL2V2ZW50cXVldWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvc2NoZWR1bGVyL3NjaGVkdWxlci5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9zY2hlZHVsZXIvc2ltcGxlLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL3NjaGVkdWxlci9zcGVlZC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9zY2hlZHVsZXIvYWN0aW9uLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL3NjaGVkdWxlci9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9mb3YvZm92LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL2Zvdi9kaXNjcmV0ZS1zaGFkb3djYXN0aW5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL2Zvdi9wcmVjaXNlLXNoYWRvd2Nhc3RpbmcuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvZm92L3JlY3Vyc2l2ZS1zaGFkb3djYXN0aW5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL2Zvdi9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9tYXAvbWFwLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL21hcC9hcmVuYS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9tYXAvZHVuZ2Vvbi5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9tYXAvZmVhdHVyZXMuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvbWFwL3VuaWZvcm0uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvbWFwL2NlbGx1bGFyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL21hcC9kaWdnZXIuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvbWFwL2VsbGVybWF6ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9tYXAvZGl2aWRlZG1hemUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvbWFwL2ljZXltYXplLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL21hcC9yb2d1ZS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9tYXAvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvbm9pc2Uvbm9pc2UuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvbm9pc2Uvc2ltcGxleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9ub2lzZS9pbmRleC5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9wYXRoL3BhdGguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvcGF0aC9kaWprc3RyYS5qcyIsIndlYnBhY2s6Ly8vLi9ub2RlX21vZHVsZXMvcm90LWpzL2xpYi9wYXRoL2FzdGFyLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL3BhdGgvaW5kZXguanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvZW5naW5lLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL2xpZ2h0aW5nLmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9yb3QtanMvbGliL2luZGV4LmpzIiwid2VicGFjazovLy8uL3NyYy9yYW5kb20uanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0l0ZW0uanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvZGlzcGxheS9iYWNrZW5kLmpzIiwid2VicGFjazovLy8uL3NyYy9nZW9tZXRlci5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQWN0b3IuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL3JvdC1qcy9saWIvZGlzcGxheS90ZXJtLmpzIiwid2VicGFjazovLy8uL3NyYy9yZWFkeS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvRGlzcGxheS5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvTGV2ZWwuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL01hcC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvSW52ZW50b3J5LmpzIiwid2VicGFjazovLy8uL3NyYy9jb25zdGFudHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL1Byb3AuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2luZGV4LmpzIiwid2VicGFjazovLy8uL25vZGVfbW9kdWxlcy9wcm9jZXNzL2Jyb3dzZXIuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL0dhbWUuanMiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL2ZvbnRmYWNlb2JzZXJ2ZXIvZm9udGZhY2VvYnNlcnZlci5zdGFuZGFsb25lLmpzIiwid2VicGFjazovLy8uL3NyYy9DZWxsLmpzIiwid2VicGFjazovLy8uL3NyYy9LZXlib2FyZExpc3RlbmVyLmpzIiwid2VicGFjazovLy8uL3NyYy9NdXNpY0JveC5qcyIsIndlYnBhY2s6Ly8vLi9zcmMvQ29uc29sZS5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxrREFBMEMsZ0NBQWdDO0FBQzFFO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZ0VBQXdELGtCQUFrQjtBQUMxRTtBQUNBLHlEQUFpRCxjQUFjO0FBQy9EOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpREFBeUMsaUNBQWlDO0FBQzFFLHdIQUFnSCxtQkFBbUIsRUFBRTtBQUNySTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLG1D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LGFBQU07QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGtCQUFrQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBDQUEwQztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxZQUFZLG1CQUFHLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDdklpQztBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNlLE1BQU0sU0FBSSxTQUFTLGFBQU07QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksU0FBSTtBQUNoQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtB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QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOVQyQjtBQUNFO0FBQ0E7QUFDQTtBQUNNO0FBQzZCO0FBQ2hFO0FBQ0EsV0FBVyxPQUFHO0FBQ2QsWUFBWSxTQUFJO0FBQ2hCLFlBQVksU0FBSTtBQUNoQixZQUFZLHVCQUFJO0FBQ2hCO0FBQ0E7QUFDQSxXQUFXLGFBQWE7QUFDeEIsWUFBWSxjQUFjO0FBQzFCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxNQUFNLGVBQU87QUFDNUIsNEJBQTRCO0FBQzVCO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0Esa0NBQWtDO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxJQUFJO0FBQ25CLGVBQWUsSUFBSTtBQUNuQixlQUFlLElBQUk7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHNCQUFzQjtBQUN4QztBQUNBO0FBQ0E7QUFDQSxvQkFBb0IscUNBQXFDO0FBQ3pEO0FBQ0E7QUFDQSxlQUFlLElBQUk7QUFDbkIsZUFBZSxJQUFJO0FBQ25CLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsSUFBSTtBQUNuQixlQUFlLElBQUk7QUFDbkIsaUJBQWlCLElBQUk7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsTUFBTTtBQUNyQixpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxJQUFJO0FBQ25CLGVBQWUsSUFBSTtBQUNuQixlQUFlLG1CQUFtQjtBQUNsQyxlQUFlLE9BQU87QUFDdEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUIsRUFBRSxHQUFHLEVBQUU7QUFDNUI7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLElBQUk7QUFDbkIsZUFBZSxJQUFJO0FBQ25CLGVBQWUsT0FBTyx5REFBeUQsS0FBSyxJQUFJLEtBQUsscUJBQXFCLEtBQUs7QUFDdkgsZUFBZSxJQUFJO0FBQ25CLGlCQUFpQixJQUFJO0FBQ3JCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLFFBQWE7QUFDbEMsK0JBQStCO0FBQy9CO0FBQ0E7QUFDQSxxQkFBcUIsU0FBYztBQUNuQztBQUNBLG1DQUFtQyx3QkFBd0I7QUFDM0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixPQUFZO0FBQ2pDO0FBQ0E7QUFDQSxxQkFBcUIsT0FBWTtBQUNqQztBQUNBO0FBQ0EscUJBQXFCLFlBQWlCO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLEtBQUs7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBTyxRQUFRLFNBQUk7QUFDbkIsZUFBTyxPQUFPLE9BQUc7QUFDakIsZUFBTyxRQUFRLFNBQUk7QUFDbkIsZUFBTyxRQUFRLHVCQUFJOzs7QUNyUFE7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLE1BQU0sK0JBQWU7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIseUJBQXlCO0FBQ2hEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixtQkFBbUI7QUFDMUM7QUFDQTtBQUNBLGtFQUFrRTtBQUNsRSx5Q0FBeUMsbUJBQW1CO0FBQzVEO0FBQ0E7QUFDQSwyQkFBMkIsb0JBQW9CO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQkFBcUI7QUFDckI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZixpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsU0FBUztBQUN4QixlQUFlLE9BQU87QUFDdEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLHNCQUFHO0FBQ2xCO0FBQ0E7QUFDQSxlQUFlO0FBQ2YsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzVJZTtBQUNmO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixPQUFPO0FBQ3hCO0FBQ0EsZUFBZSxtQkFBbUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxFQUFFO0FBQ2pCLGVBQWUsT0FBTztBQUN0QjtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsNkJBQTZCO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLFVBQVU7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCO0FBQ3ZCO0FBQ0EsMkJBQTJCLDZCQUE2QjtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsRUFBRTtBQUNqQixpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsRUFBRTtBQUNqQixpQkFBaUIsS0FBSztBQUN0QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLElBQUk7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3hGMEM7QUFDM0IsTUFBTSxtQkFBUztBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBLDBCQUEwQixVQUFVO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsOEJBQThCO0FBQzdDO0FBQ0EsZUFBZSxFQUFFO0FBQ2pCLGVBQWUsS0FBSztBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLEVBQUU7QUFDakIsaUJBQWlCLE9BQU87QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxFQUFFO0FBQ2pCLGlCQUFpQixLQUFLO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqRXVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNlLE1BQU0sYUFBTSxTQUFTLG1CQUFTO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2Z1QztBQUN2QztBQUNBO0FBQ0E7QUFDZSxNQUFNLFdBQUssU0FBUyxtQkFBUztBQUM1QztBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLEtBQUs7QUFDcEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4QnVDO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTSxhQUFNLFNBQVMsbUJBQVM7QUFDN0M7QUFDQTtBQUNBLGtDQUFrQztBQUNsQywrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBLGVBQWUsT0FBTztBQUN0QixlQUFlLEtBQUs7QUFDcEIsZUFBZSxPQUFPO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDbERpQztBQUNGO0FBQ0U7QUFDbEIsK0NBQUMsQ0FBQyxxQkFBTSxFQUFFLGtCQUFLLEVBQUUscUJBQU0sRUFBRSxFQUFDOzs7QUNIRjtBQUN2QztBQUNBO0FBQ2UsTUFBTSxPQUFHO0FBQ3hCO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEIsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsSUFBSTtBQUNuQjtBQUNBLGlEQUFpRDtBQUNqRDtBQUNBLHVDQUF1QyxjQUFjO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBLGVBQWUsSUFBSTtBQUNuQixlQUFlLElBQUk7QUFDbkIsZUFBZSxJQUFJO0FBQ25CO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixJQUFJO0FBQ3hCLG9CQUFvQixJQUFJO0FBQ3hCLG9CQUFvQixJQUFJO0FBQ3hCLG9CQUFvQixJQUFJO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixJQUFJO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLElBQUk7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixpQkFBaUI7QUFDeEMsMkJBQTJCLHFCQUFxQjtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3RDJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTSw0Q0FBcUIsU0FBUyxPQUFHO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsUUFBUTtBQUMvQjtBQUNBO0FBQ0EsMkJBQTJCLHNCQUFzQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQixhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQSxlQUFlLElBQUk7QUFDbkIsZUFBZSxJQUFJO0FBQ25CLGVBQWUsS0FBSztBQUNwQixlQUFlLFFBQVE7QUFDdkI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx3QkFBd0I7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoRzJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTSwwQ0FBb0IsU0FBUyxPQUFHO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsUUFBUTtBQUMvQjtBQUNBO0FBQ0EsMkJBQTJCLG1CQUFtQjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsYUFBYTtBQUNiLFNBQVM7QUFDVDtBQUNBO0FBQ0EsZUFBZSxPQUFPO0FBQ3RCLGVBQWUsT0FBTztBQUN0QixlQUFlLEtBQUs7QUFDcEIsZUFBZSxRQUFRO0FBQ3ZCO0FBQ0E7QUFDQSw0QkFBNEI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1EQUFtRDtBQUNuRDtBQUNBO0FBQ0EsMEVBQTBFO0FBQzFFO0FBQ0E7QUFDQSxtREFBbUQ7QUFDbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCO0FBQ2xCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw2QkFBNkI7QUFDN0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0I7QUFDbEI7QUFDQTtBQUNBO0FBQ0EseUJBQXlCO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDN0gyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTSw4Q0FBc0IsU0FBUyxPQUFHO0FBQ3ZEO0FBQ0E7QUFDQSxlQUFlLElBQUk7QUFDbkIsZUFBZSxJQUFJO0FBQ25CLGVBQWUsSUFBSTtBQUNuQixlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsb0JBQW9CO0FBQzNDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLElBQUk7QUFDbkIsZUFBZSxJQUFJO0FBQ25CLGVBQWUsSUFBSTtBQUNuQixlQUFlLElBQUk7QUFDbkIsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0NBQStDO0FBQy9DLG1EQUFtRDtBQUNuRCwyQ0FBMkM7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsSUFBSTtBQUNuQixlQUFlLElBQUk7QUFDbkIsZUFBZSxJQUFJO0FBQ25CLGVBQWUsSUFBSTtBQUNuQixlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0M7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsSUFBSTtBQUNuQixlQUFlLElBQUk7QUFDbkIsZUFBZSxJQUFJO0FBQ25CLGVBQWUsSUFBSTtBQUNuQixlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLElBQUk7QUFDbkIsZUFBZSxJQUFJO0FBQ25CLGVBQWUsSUFBSTtBQUNuQixlQUFlLE1BQU07QUFDckIsZUFBZSxNQUFNO0FBQ3JCLGVBQWUsSUFBSTtBQUNuQixlQUFlLElBQUk7QUFDbkIsZUFBZSxJQUFJO0FBQ25CLGVBQWUsSUFBSTtBQUNuQixlQUFlLElBQUk7QUFDbkIsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5QkFBeUIsYUFBYTtBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNwSmdFO0FBQ0Y7QUFDSTtBQUNuRCx5Q0FBQyxDQUFDLG1FQUFxQixFQUFFLGdFQUFvQixFQUFFLHNFQUFzQixFQUFFLEVBQUM7OztBQ0h2QjtBQUNoRTtBQUNlLE1BQU0sT0FBRztBQUN4QjtBQUNBO0FBQ0EsZUFBZSxJQUFJO0FBQ25CLGVBQWUsSUFBSTtBQUNuQjtBQUNBLHdCQUF3QixhQUFhLFdBQVcsY0FBYztBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsaUJBQWlCO0FBQ3hDO0FBQ0EsMkJBQTJCLGtCQUFrQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3ZCMkI7QUFDM0I7QUFDQTtBQUNBO0FBQ0E7QUFDZSxNQUFNLFdBQUssU0FBUyxPQUFHO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixRQUFRO0FBQy9CLDJCQUEyQixRQUFRO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNqQjJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTSxlQUFPLFNBQVMsT0FBRztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLGdCQUFnQixvQkFBb0I7QUFDcEM7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLG9CQUFvQix3QkFBd0I7QUFDNUM7OztBQ3JCNEI7QUFDNUI7QUFDQTtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLElBQUk7QUFDZixXQUFXLElBQUk7QUFDZixXQUFXLElBQUk7QUFDZixXQUFXLElBQUk7QUFDZixXQUFXLElBQUk7QUFDZixXQUFXLElBQUk7QUFDZjtBQUNPLE1BQU0sYUFBSTtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isc0JBQUc7QUFDdkI7QUFDQTtBQUNBLHFCQUFxQixzQkFBRztBQUN4QixzQkFBc0I7QUFDdEIsb0NBQW9DLHNCQUFHO0FBQ3ZDO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkIsb0NBQW9DLHNCQUFHO0FBQ3ZDO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEIsb0NBQW9DLHNCQUFHO0FBQ3ZDO0FBQ0E7QUFDQSx1QkFBdUI7QUFDdkIsb0NBQW9DLHNCQUFHO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLHNCQUFHO0FBQ3ZCO0FBQ0E7QUFDQSxxQkFBcUIsc0JBQUc7QUFDeEIsaUNBQWlDLHNCQUFHO0FBQ3BDLGlDQUFpQyxzQkFBRztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQixzQkFBRztBQUN2QjtBQUNBO0FBQ0EscUJBQXFCLHNCQUFHO0FBQ3hCO0FBQ0E7QUFDQSxnQ0FBZ0Msc0JBQUc7QUFDbkMsZ0NBQWdDLHNCQUFHO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWU7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMEJBQTBCLFlBQVk7QUFDdEMsNkJBQTZCLGFBQWE7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWTtBQUN0Qyw2QkFBNkIsYUFBYTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQkFBMEIsWUFBWTtBQUN0Qyw2QkFBNkIsYUFBYTtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGVBQWUsaUJBQWlCO0FBQ2hDLGdCQUFnQixpQkFBaUI7QUFDakMsY0FBYyxpQkFBaUI7QUFDL0IsaUJBQWlCLGlCQUFpQjtBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFdBQVcsSUFBSTtBQUNmLFdBQVcsSUFBSTtBQUNmLFdBQVcsSUFBSTtBQUNmLFdBQVcsSUFBSTtBQUNmO0FBQ08sTUFBTSxpQkFBUTtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EscUJBQXFCLHNCQUFHO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLFlBQVk7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM3VG1DO0FBQ1k7QUFDbkI7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNlLE1BQU0sZUFBTyxTQUFTLGVBQU87QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQztBQUNoQyxvQ0FBb0M7QUFDcEMsNkJBQTZCO0FBQzdCLCtCQUErQjtBQUMvQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGlCQUFpQjtBQUM1QywrQkFBK0Isa0JBQWtCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2IsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixhQUFJO0FBQzNCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQixLQUFLO0FBQ3RCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsd0JBQXdCO0FBQ25EO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0NBQWdDLHNCQUFHO0FBQ25DO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0EsZ0NBQWdDLHNCQUFHO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCO0FBQ2pCO0FBQ0E7QUFDQSxpQkFBaUIsU0FBUztBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsa0JBQWtCO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdEQUFnRDtBQUNoRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0RBQW9EO0FBQ3BEO0FBQ0E7QUFDQTtBQUNBLHlEQUF5RDtBQUN6RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9FQUFvRTtBQUNwRTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsWUFBWTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHNDQUFzQyxRQUFRO0FBQzlDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsK0JBQStCLHNCQUFHO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsbUJBQW1CO0FBQzFDO0FBQ0E7QUFDQSwrQkFBK0IsaUJBQVE7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDM1YyQjtBQUNZO0FBQ1g7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLElBQUk7QUFDZixXQUFXLElBQUk7QUFDZixXQUFXLE9BQU87QUFDbEIsV0FBVyxNQUFNO0FBQ2pCLFdBQVcsTUFBTTtBQUNqQixXQUFXLElBQUk7QUFDZjtBQUNlLE1BQU0saUJBQVEsU0FBUyxPQUFHO0FBQ3pDLDJDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixJQUFJO0FBQ3pCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxNQUFNLG9EQUFvRDtBQUN6RTtBQUNBO0FBQ0EsdUJBQXVCLGlCQUFpQjtBQUN4QywyQkFBMkIsa0JBQWtCO0FBQzdDLG1DQUFtQyxzQkFBRztBQUN0QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHVDQUF1QztBQUNoRSxzQkFBc0IseUJBQXlCO0FBQy9DO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGtCQUFrQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsaUJBQWlCO0FBQ3JEO0FBQ0E7QUFDQSwyREFBMkQ7QUFDM0Q7QUFDQTtBQUNBLDhEQUE4RDtBQUM5RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGtCQUFrQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxvQ0FBb0MsaUJBQWlCO0FBQ3JEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZUFBZSxTQUFTO0FBQ3hCLGVBQWUsSUFBSTtBQUNuQixlQUFlLFNBQVM7QUFDeEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsa0JBQWtCO0FBQ3pDLDRDQUE0QyxpQkFBaUI7QUFDN0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsc0JBQUc7QUFDcEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNEJBQTRCO0FBQzVCLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQSxvQ0FBb0Msc0JBQUc7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQSx5Q0FBeUMsc0JBQUc7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGtCQUFrQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsWUFBWTtBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixXQUFXO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQiwwQkFBMEI7QUFDNUM7OztBQ2hVbUM7QUFDWTtBQUNuQjtBQUNXO0FBQ3ZDO0FBQ0EsWUFBWSxhQUFJO0FBQ2hCLGdCQUFnQixpQkFBUTtBQUN4QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxNQUFNLGFBQU0sU0FBUyxlQUFPO0FBQzNDLDJDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsNkRBQTZEO0FBQzdELDZFQUE2RSw4QkFBOEIsRUFBRTtBQUM3RztBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyx5RUFBeUU7QUFDbEY7QUFDQTtBQUNBLDJCQUEyQixpQkFBaUI7QUFDNUMsK0JBQStCLGtCQUFrQjtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1Q0FBdUM7QUFDdkM7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyw4QkFBOEI7QUFDL0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQkFBbUIsYUFBSTtBQUN2QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1QsaUJBQWlCLHNCQUFHLHFCQUFxQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLEtBQUs7QUFDdEI7QUFDQTtBQUNBLDBCQUEwQixzQkFBRztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQkFBK0IsYUFBSTtBQUNuQztBQUNBO0FBQ0EsK0JBQStCLGlCQUFRO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixJQUFJO0FBQ3pCLHVCQUF1QixtQkFBbUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQixJQUFJO0FBQ3pCLHVCQUF1QixtQkFBbUI7QUFDMUM7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix3QkFBd0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNoTzJCO0FBQ0M7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxNQUFNLG1CQUFTLFNBQVMsT0FBRztBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQSxzQkFBc0I7QUFDdEI7QUFDQSxtQkFBbUIsc0JBQXNCO0FBQ3pDO0FBQ0EsMkJBQTJCLE9BQU87QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFDQUFxQyxzQkFBRztBQUN4QztBQUNBO0FBQ0E7QUFDQTtBQUNBLGlDQUFpQyxzQkFBRztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixPQUFPO0FBQzlCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwrQ0FBK0Msc0JBQUc7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGlCQUFpQjtBQUN4QywyQkFBMkIsa0JBQWtCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDakYyQjtBQUNDO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTSx1QkFBVyxTQUFTLE9BQUc7QUFDNUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLE9BQU87QUFDOUI7QUFDQSwyQkFBMkIsT0FBTztBQUNsQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLE9BQU87QUFDOUIsMkJBQTJCLE9BQU87QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJDQUEyQztBQUMzQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsYUFBYTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsYUFBYTtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isc0JBQUc7QUFDbkIsZ0JBQWdCLHNCQUFHO0FBQ25CO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0Qiw2QkFBNkIsT0FBTztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QiwyQkFBMkIsY0FBYztBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0Qiw2QkFBNkIsT0FBTztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBLHNCQUFzQjtBQUN0QiwyQkFBMkIsY0FBYztBQUN6QztBQUNBO0FBQ0E7QUFDQSxvQkFBb0Isc0JBQUc7QUFDdkIsdUJBQXVCLGtCQUFrQjtBQUN6QztBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixzQkFBRztBQUMxQjtBQUNBO0FBQ0EsMkRBQTJEO0FBQzNELDJEQUEyRDtBQUMzRCwyREFBMkQ7QUFDM0QsMkRBQTJEO0FBQzNEO0FBQ0E7OztBQ3ZHMkI7QUFDQztBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNlLE1BQU0saUJBQVEsU0FBUyxPQUFHO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9DQUFvQyxzQkFBRztBQUN2QyxvQ0FBb0Msc0JBQUc7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLHNCQUFHO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQyxPQUFPO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBLFNBQVM7QUFDVCx1QkFBdUIsaUJBQWlCO0FBQ3hDLDJCQUEyQixrQkFBa0I7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsT0FBTztBQUM5QjtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsc0JBQUc7QUFDOUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6RzJCO0FBQ0M7QUFDVztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNlLE1BQU0sV0FBSyxTQUFTLE9BQUc7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLGlCQUFpQjtBQUM1QywrQkFBK0Isa0JBQWtCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLDZCQUE2QjtBQUNwRDtBQUNBLDJCQUEyQiw4QkFBOEI7QUFDekQsb0NBQW9DLHFGQUFxRjtBQUN6SDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esa0JBQWtCLHNCQUFHO0FBQ3JCLGtCQUFrQixzQkFBRztBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EseUJBQXlCLHNCQUFHO0FBQzVCO0FBQ0E7QUFDQTtBQUNBLDZCQUE2QixJQUFJO0FBQ2pDLDZCQUE2QixJQUFJO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYixTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsOEJBQThCLHNCQUFHO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qiw2QkFBNkI7QUFDcEQsMkJBQTJCLDhCQUE4QjtBQUN6RDtBQUNBO0FBQ0E7QUFDQSxpQ0FBaUMsc0JBQUc7QUFDcEM7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDLElBQUk7QUFDM0MsdUNBQXVDLElBQUk7QUFDM0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVDQUF1QyxxQ0FBcUM7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSx1QkFBdUIsUUFBUTtBQUMvQiwyQkFBMkIsUUFBUTtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLHNCQUFHO0FBQzNCLHdCQUF3QixzQkFBRztBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwwQ0FBMEMsc0JBQUc7QUFDN0MsMENBQTBDLHNCQUFHO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUNBQWlDLGlCQUFpQjtBQUNsRCxxQ0FBcUMsaUJBQWlCO0FBQ3REO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUIsc0JBQUc7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1DQUFtQztBQUNuQztBQUNBO0FBQ0EsaUJBQWlCLHNCQUFHO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxtQ0FBbUM7QUFDbkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQix1QkFBdUI7QUFDdkI7QUFDQTtBQUNBLHNCQUFzQixzQkFBRyxjQUFjO0FBQ3ZDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQXdCLElBQUk7QUFDNUIsd0JBQXdCLElBQUk7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QixRQUFRO0FBQy9CLDJCQUEyQixRQUFRO0FBQ25DO0FBQ0EsK0JBQStCLGdDQUFnQztBQUMvRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5VitCO0FBQ0k7QUFDRTtBQUNKO0FBQ007QUFDSTtBQUNOO0FBQ047QUFDaEIsNkNBQUMsQ0FBQyxrQkFBSyxFQUFFLHdCQUFPLEVBQUUsMkJBQVEsRUFBRSxxQkFBTSxFQUFFLDhCQUFTLEVBQUUsb0NBQVcsRUFBRSwyQkFBUSxFQUFFLGtCQUFLLEVBQUUsRUFBQzs7O0FDUjdGO0FBQ0E7QUFDQTtBQUNlO0FBQ2Y7OztBQ0orQjtBQUNIO0FBQ0s7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxNQUFNLGVBQU8sU0FBUyxLQUFLO0FBQzFDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGVBQWU7QUFDdEM7QUFDQTtBQUNBLHVCQUF1QixzQkFBRztBQUMxQjtBQUNBO0FBQ0EsdUJBQXVCLG1CQUFtQjtBQUMxQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0EsaUNBQWlDO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2QjtBQUNBLDBCQUEwQjtBQUMxQjtBQUNBO0FBQ0E7QUFDQSxtQkFBbUI7QUFDbkI7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Q7QUFDQTtBQUNBLFNBQVM7QUFDVDtBQUNBO0FBQ0E7QUFDQSw4QkFBOEI7QUFDOUI7QUFDQSxpQ0FBaUM7QUFDakM7QUFDQTtBQUNBLGlCQUFpQixtQkFBRztBQUNwQixpQkFBaUIsbUJBQUc7QUFDcEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN0R21DO0FBQ3BCLDJDQUFDLENBQUMsd0JBQU8sRUFBRSxFQUFDOzs7QUNEWTtBQUN2QztBQUNBO0FBQ0EsV0FBVyxJQUFJO0FBQ2YsV0FBVyxJQUFJO0FBQ2YsV0FBVyxTQUFTO0FBQ3BCLFdBQVcsT0FBTztBQUNsQixXQUFXLElBQUk7QUFDZjtBQUNlLE1BQU0sU0FBSTtBQUN6Qix3REFBd0Q7QUFDeEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFNBQVM7QUFDVCxxQkFBcUIsSUFBSTtBQUN6QiwwQ0FBMEM7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1Qix1QkFBdUI7QUFDOUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDNUM2QjtBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTSxpQkFBUSxTQUFTLFNBQUk7QUFDMUM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsc0JBQXNCO0FBQ2pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlCQUFpQjtBQUNqQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUM5RDZCO0FBQzdCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDZSxNQUFNLFdBQUssU0FBUyxTQUFJO0FBQ3ZDLHdEQUF3RDtBQUN4RDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixzQkFBc0I7QUFDakQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHVCQUF1QjtBQUM5QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDekZxQztBQUNOO0FBQ2hCLDBDQUFDLENBQUMsMkJBQVEsRUFBRSxrQkFBSyxFQUFFLEVBQUM7OztBQ0ZuQztBQUNBO0FBQ0EsV0FBVyxjQUFjO0FBQ3pCO0FBQ2U7QUFDZjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGFBQWEsc0JBQXNCO0FBQ25DO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0Esd0NBQXdDO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUN6Q29DO0FBQ3BDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsTUFBTSxpQkFBUTtBQUM3QixrREFBa0Q7QUFDbEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSw4REFBOEQsdUJBQWdCO0FBQzlFO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG1CQUFtQixtQkFBbUI7QUFDdEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUNBQXVDO0FBQ3ZDO0FBQ0E7QUFDQSxZQUFZLGlCQUFVO0FBQ3RCO0FBQ0EsdUJBQXVCLDBCQUEwQixPQUFPO0FBQ3hEO0FBQ0E7QUFDQTtBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0Esc0NBQXNDO0FBQ3RDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsYUFBYTtBQUNiO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0EsMkJBQTJCLE9BQU87QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxxQ0FBcUM7QUFDckM7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQSwyQkFBMkIsT0FBTztBQUNsQztBQUNBLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2xNQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBMEM7QUFDZ0I7QUFDUTtBQUNWO0FBQ0k7QUFDWjtBQUNBO0FBQ0k7QUFDRjtBQUNGO0FBQ0k7QUFDdUI7QUFDekM7QUFDM0IsYUFBYSxJQUFJO0FBQ1k7QUFDN0IsY0FBYyxTQUFLO0FBQ1E7QUFDM0IsYUFBYSxvQkFBSTs7Ozs7OztBQ2pCeEIsWUFBWSxtQkFBTyxDQUFDLENBQVE7QUFDNUI7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7OztBQzNDQSxrQkFBa0IsbUJBQU8sQ0FBQyxFQUFhO0FBQ3ZDLE9BQU8sU0FBUyxHQUFHLG1CQUFPLENBQUMsRUFBYTs7QUFFeEM7QUFDQSx5QkFBeUI7QUFDekI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQjtBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLHVCQUF1QjtBQUN2Qjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxzQkFBc0IsUUFBUTtBQUM5QjtBQUNBO0FBQ0EseUdBQXlHLFVBQVU7QUFDbkgsV0FBVztBQUNYO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsVUFBVTtBQUNWOztBQUVBLCtCQUErQjtBQUMvQix5QkFBeUIsUUFBUTtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUEsNEJBQTRCO0FBQzVCLG9DQUFvQztBQUNwQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUyxPQUFPO0FBQ2hCO0FBQ0EsSUFBSTtBQUNKO0FBQ0E7QUFDQTs7QUFFQSxnQkFBZ0I7QUFDaEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQSx5QkFBeUI7QUFDekIsU0FBUyx5QkFBeUI7QUFDbEMsbUJBQW1CO0FBQ25CO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUMxSUE7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNlO0FBQ2Ysb0JBQW9CLGFBQWE7QUFDakMseUJBQXlCLHlCQUF5QjtBQUNsRDs7Ozs7OztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7Ozs7Ozs7QUNUQSxZQUFZLG1CQUFPLENBQUMsQ0FBUTtBQUM1QixrQkFBa0IsbUJBQU8sQ0FBQyxFQUFhO0FBQ3ZDLGlCQUFpQixtQkFBTyxDQUFDLENBQVk7QUFDckMsZUFBZSxtQkFBTyxDQUFDLENBQVU7O0FBRWpDO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0QjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSw4QkFBOEI7QUFDOUIsd0JBQXdCO0FBQ3hCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLFFBQVE7QUFDNUI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsVUFBVTtBQUM1Qix5Q0FBeUMsUUFBUTtBQUNqRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGdDQUFnQyxlQUFlO0FBQy9DLElBQUk7QUFDSjtBQUNBLGdDQUFnQyxlQUFlO0FBQy9DO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esb0JBQW9CLFVBQVU7QUFDOUI7O0FBRUE7QUFDQSxvQkFBb0IsU0FBUyxlQUFlO0FBQzVDLHNCQUFzQjtBQUN0QixzQ0FBc0MsbUJBQW1CO0FBQ3pEO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGlCQUFpQixVQUFVO0FBQzNCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFNBQVMsT0FBTztBQUNoQjtBQUNBOztBQUVBO0FBQ0E7QUFDQSxvQkFBb0IsYUFBYTtBQUNqQztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxhQUFhO0FBQ2I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsSUFBSTtBQUNKLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0EsMEJBQTBCLGNBQWM7QUFDeEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLGlCQUFpQixjQUFjO0FBQy9CLHVDQUF1QyxjQUFjO0FBQ3JEO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHLEU7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSw2Q0FBNkMsb0JBQW9CO0FBQ2pFLG9DQUFvQyxNQUFNO0FBQzFDLG9EQUFvRCxtQkFBbUI7QUFDdkUseUNBQXlDLFFBQVE7QUFDakQ7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0Esb0JBQW9CLG1DQUFtQztBQUN2RCxvQkFBb0IsVUFBVTtBQUM5QixTQUFTLE9BQU87QUFDaEI7QUFDQTtBQUNBO0FBQ0EsY0FBYztBQUNkOztBQUVBO0FBQ0E7QUFDQSxZQUFZO0FBQ1o7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0REFBNEQsY0FBYztBQUMxRTtBQUNBO0FBQ0EsY0FBYyxtQkFBbUI7QUFDakM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7Ozs7QUM5WkE7QUFBQTtBQUFBO0FBQW1DO0FBQ0U7QUFDckM7QUFDQSxtQkFBbUIsR0FBRyxFQUFFLEVBQUUsY0FBYztBQUN4QztBQUNBO0FBQ0EsbUJBQW1CLEdBQUcsRUFBRSxFQUFFLGVBQWUsR0FBRyxFQUFFLEVBQUUsY0FBYztBQUM5RDtBQUNBO0FBQ0EsbUJBQW1CLE9BQU8sRUFBRSxNQUFNO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjLG9EQUFnQjtBQUM5QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ2UsbUJBQW1CLDJEQUFPO0FBQ3pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQiwyQkFBMkI7QUFDN0M7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLGdFQUFnRTtBQUN2RiwyQkFBMkIsZUFBZTtBQUMxQyxtQkFBbUIsc0RBQXNEO0FBQ3pFOzs7Ozs7OztBQ3RGQSx5QkFBeUIsbUJBQU8sQ0FBQyxFQUFrQjs7QUFFbkQ7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLElBQUk7QUFDSjtBQUNBLEVBQUU7QUFDRjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLHFCQUFxQixFQUFFO0FBQ3ZDLGlCQUFpQixvQ0FBb0MscUJBQXFCLEVBQUU7QUFDNUU7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7QUMxQkEsWUFBWSxtQkFBTyxDQUFDLENBQVE7O0FBRTVCO0FBQ0EseUJBQXlCO0FBQ3pCLGFBQWE7QUFDYjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDZDQUE2QyxvQkFBb0I7QUFDakU7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLDRDQUE0QztBQUM1QztBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSxjQUFjLFFBQVE7QUFDdEI7QUFDQTtBQUNBOztBQUVBO0FBQ0EsY0FBYyxRQUFRO0FBQ3RCO0FBQ0E7O0FBRUEsMkNBQTJDO0FBQzNDO0FBQ0E7O0FBRUEsd0JBQXdCLFdBQVcsY0FBYztBQUNqRDtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBWSxXQUFXLE9BQU8sWUFBWTtBQUMxQyxZQUFZLFVBQVUsT0FBTyxZQUFZO0FBQ3pDLFlBQVksYUFBYSxPQUFPLFlBQVk7QUFDNUM7QUFDQTs7QUFFQTs7QUFFQSx5Qjs7Ozs7O0FDNUZBLFlBQVksbUJBQU8sQ0FBQyxFQUFPO0FBQzNCLGNBQWMsbUJBQU8sQ0FBQyxDQUFTO0FBQy9CLGFBQWEsbUJBQU8sQ0FBQyxDQUFRO0FBQzdCLGFBQWEsbUJBQU8sQ0FBQyxFQUFRO0FBQzdCLGlCQUFpQixtQkFBTyxDQUFDLENBQVk7QUFDckMsZUFBZSxtQkFBTyxDQUFDLENBQVU7QUFDakMsT0FBTywwQkFBMEIsR0FBRyxtQkFBTyxDQUFDLEVBQWE7O0FBRXpEO0FBQ0EseUJBQXlCLGNBQWM7QUFDdkM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxjQUFjO0FBQ2Qsd0JBQXdCO0FBQ3hCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxpQkFBaUI7QUFDakIsK0RBQStEO0FBQy9ELG9DO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0EsNkNBQTZDLG9CQUFvQixFQUFFO0FBQ25FO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzQ0FBc0MscUNBQXFDLEVBQUU7QUFDN0U7QUFDQTtBQUNBLHNDQUFzQywyQkFBMkIsRUFBRTtBQUNuRTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EseUJBQXlCLGNBQWMsNkJBQTZCLEVBQUUsRUFBRTtBQUN4RTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQSxHQUFHLEU7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0o7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBYyxjQUFjO0FBQzVCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsYUFBYSxXQUFXLFFBQVEsVUFBVSxZQUFZLGVBQWU7QUFDckU7QUFDQTtBQUNBLFlBQVksV0FBVyxpQkFBaUIsVUFBVTtBQUNsRDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7O0FBRUEsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQSxpQkFBaUIsU0FBUyxVQUFVO0FBQ3BDO0FBQ0E7QUFDQSxHQUFHO0FBQ0gsVUFBVTtBQUNWOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0EsU0FBUyxPQUFPO0FBQ2hCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTs7QUFFQSwyQkFBMkIsZ0JBQWdCO0FBQzNDO0FBQ0EsT0FBTyxhQUFhOztBQUVwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBLGtCQUFrQixjQUFjO0FBQ2hDLFdBQVcsT0FBTztBQUNsQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTs7QUFFQSwyQkFBMkIsZ0JBQWdCO0FBQzNDO0FBQ0EsT0FBTyxhQUFhO0FBQ3BCOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxrQkFBa0IsY0FBYztBQUNoQyxXQUFXLE9BQU87QUFDbEI7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDRCQUE0QixjQUFjO0FBQzFDO0FBQ0EsU0FBUyx5QkFBeUI7QUFDbEM7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLHVDQUF1QztBQUN2QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxrQkFBa0IsMkJBQTJCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJCQUEyQixRQUFRO0FBQ25DO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLHdCQUF3QixRQUFRO0FBQ2hDLFNBQVMsT0FBTztBQUNoQjtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBLG1DO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQSx1QkFBdUIsY0FBYztBQUNyQztBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDdGlCQSxZQUFZLG1CQUFPLENBQUMsQ0FBUTtBQUM1QixhQUFhLG1CQUFPLENBQUMsRUFBUTtBQUM3QixpQkFBaUIsbUJBQU8sQ0FBQyxDQUFZO0FBQ3JDLGVBQWUsbUJBQU8sQ0FBQyxDQUFVOztBQUVqQztBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxzREFBc0Q7QUFDdEQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRzs7QUFFSDtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxJQUFJO0FBQ0osR0FBRztBQUNIOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQVU7QUFDVjs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLElBQUksWUFBWTtBQUNoQixJQUFJLFlBQVk7QUFDaEIsSUFBSSxXQUFXO0FBQ2YsSUFBSSxXQUFXO0FBQ2YsSUFBSSxXQUFXO0FBQ2YsSUFBSSxZQUFZO0FBQ2hCLElBQUksWUFBWTtBQUNoQixJQUFJLGFBQWE7QUFDakI7QUFDQSxpQkFBaUIsT0FBTztBQUN4QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFVBQVUsT0FBTztBQUNqQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSw0QkFBNEIsV0FBVztBQUN2QztBQUNBLDZCQUE2QixXQUFXO0FBQ3hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLDBCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxTQUFTLE9BQU87QUFDaEI7QUFDQSxVQUFVO0FBQ1Y7O0FBRUE7QUFDQTtBQUNBLHlCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSCxVQUFVLG9CQUFvQjtBQUM5QiwrQkFBK0IscUNBQXFDO0FBQ3BFO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLFlBQVk7QUFDWjs7QUFFQTtBQUNBLGtCQUFrQixLQUFLO0FBQ3ZCO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3ZLQTtBQUNBLHlCQUF5QjtBQUN6QjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxtREFBbUQsOEJBQThCLEVBQUU7QUFDbkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0gscUNBQXFDLHdCQUF3QixFQUFFO0FBQy9EO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDJDQUEyQyxZQUFZLFFBQVEsSUFBSSxVQUFVLEVBQUUsRUFBRTtBQUNqRjtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSw2Q0FBNkMsaUNBQWlDLEVBQUU7QUFDaEY7QUFDQTs7QUFFQTtBQUNBLDZDQUE2QyxpQ0FBaUMsRUFBRTtBQUNoRjtBQUNBO0FBQ0E7O0FBRUE7Ozs7Ozs7O0FDN0VBO0FBQ0E7QUFDQSxHQUFHLGNBQWM7QUFDakIsR0FBRyxhQUFhO0FBQ2hCLEdBQUcsYUFBYTtBQUNoQixHQUFHLGNBQWM7QUFDakI7QUFDQTtBQUNBLEdBQUcsY0FBYztBQUNqQixHQUFHLGNBQWM7QUFDakIsR0FBRyxhQUFhO0FBQ2hCLEdBQUcsYUFBYTtBQUNoQixHQUFHLGFBQWE7QUFDaEIsR0FBRyxjQUFjO0FBQ2pCLEdBQUcsY0FBYztBQUNqQixHQUFHLGVBQWU7QUFDbEI7QUFDQTtBQUNBLEdBQUcsY0FBYztBQUNqQixHQUFHLGFBQWE7QUFDaEIsR0FBRyxjQUFjO0FBQ2pCLEdBQUcsZUFBZTtBQUNsQjtBQUNBOzs7Ozs7O0FDeEJBLGFBQWEsbUJBQU8sQ0FBQyxDQUFROztBQUU3QjtBQUNBLHlCQUF5QjtBQUN6QixhQUFhO0FBQ2I7QUFDQTtBQUNBOztBQUVBOzs7Ozs7O0FDVEEsWUFBWSxtQkFBTyxDQUFDLENBQVE7QUFDNUIsYUFBYSxtQkFBTyxDQUFDLEVBQVE7QUFDN0IsYUFBYSxtQkFBTyxDQUFDLENBQVE7QUFDN0IsWUFBWSxtQkFBTyxDQUFDLEVBQU87QUFDM0IsY0FBYyxtQkFBTyxDQUFDLENBQVM7QUFDL0IsYUFBYSxtQkFBTyxDQUFDLEVBQVE7QUFDN0IsY0FBYyxtQkFBTyxDQUFDLEVBQVM7QUFDL0IsZ0JBQWdCLG1CQUFPLENBQUMsRUFBVztBQUNuQyxlQUFlLG1CQUFPLENBQUMsQ0FBVTtBQUNqQyxjQUFjLG1CQUFPLENBQUMsRUFBUzs7QUFFL0I7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7OztBQ3RCQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBLENBQUM7QUFDRDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEtBQUs7QUFDTDtBQUNBO0FBQ0E7QUFDQSxTQUFTO0FBQ1Q7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0EsU0FBUztBQUNUO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUFJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSztBQUNMO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsdUJBQXVCLHNCQUFzQjtBQUM3QztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHFCQUFxQjtBQUNyQjs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUEscUNBQXFDOztBQUVyQztBQUNBO0FBQ0E7O0FBRUEsMkJBQTJCO0FBQzNCO0FBQ0E7QUFDQTtBQUNBLDRCQUE0QixVQUFVOzs7Ozs7O0FDdkx0QyxZQUFZLG1CQUFPLENBQUMsQ0FBUTtBQUM1QixjQUFjLG1CQUFP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IFRoZSBtb2R1bGUgY2FjaGVcbiBcdHZhciBpbnN0YWxsZWRNb2R1bGVzID0ge307XG5cbiBcdC8vIFRoZSByZXF1aXJlIGZ1bmN0aW9uXG4gXHRmdW5jdGlvbiBfX3dlYnBhY2tfcmVxdWlyZV9fKG1vZHVsZUlkKSB7XG5cbiBcdFx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG4gXHRcdGlmKGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdKSB7XG4gXHRcdFx0cmV0dXJuIGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdLmV4cG9ydHM7XG4gXHRcdH1cbiBcdFx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcbiBcdFx0dmFyIG1vZHVsZSA9IGluc3RhbGxlZE1vZHVsZXNbbW9kdWxlSWRdID0ge1xuIFx0XHRcdGk6IG1vZHVsZUlkLFxuIFx0XHRcdGw6IGZhbHNlLFxuIFx0XHRcdGV4cG9ydHM6IHt9XG4gXHRcdH07XG5cbiBcdFx0Ly8gRXhlY3V0ZSB0aGUgbW9kdWxlIGZ1bmN0aW9uXG4gXHRcdG1vZHVsZXNbbW9kdWxlSWRdLmNhbGwobW9kdWxlLmV4cG9ydHMsIG1vZHVsZSwgbW9kdWxlLmV4cG9ydHMsIF9fd2VicGFja19yZXF1aXJlX18pO1xuXG4gXHRcdC8vIEZsYWcgdGhlIG1vZHVsZSBhcyBsb2FkZWRcbiBcdFx0bW9kdWxlLmwgPSB0cnVlO1xuXG4gXHRcdC8vIFJldHVybiB0aGUgZXhwb3J0cyBvZiB0aGUgbW9kdWxlXG4gXHRcdHJldHVybiBtb2R1bGUuZXhwb3J0cztcbiBcdH1cblxuXG4gXHQvLyBleHBvc2UgdGhlIG1vZHVsZXMgb2JqZWN0IChfX3dlYnBhY2tfbW9kdWxlc19fKVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5tID0gbW9kdWxlcztcblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGUgY2FjaGVcbiBcdF9fd2VicGFja19yZXF1aXJlX18uYyA9IGluc3RhbGxlZE1vZHVsZXM7XG5cbiBcdC8vIGRlZmluZSBnZXR0ZXIgZnVuY3Rpb24gZm9yIGhhcm1vbnkgZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kID0gZnVuY3Rpb24oZXhwb3J0cywgbmFtZSwgZ2V0dGVyKSB7XG4gXHRcdGlmKCFfX3dlYnBhY2tfcmVxdWlyZV9fLm8oZXhwb3J0cywgbmFtZSkpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgbmFtZSwgeyBlbnVtZXJhYmxlOiB0cnVlLCBnZXQ6IGdldHRlciB9KTtcbiBcdFx0fVxuIFx0fTtcblxuIFx0Ly8gZGVmaW5lIF9fZXNNb2R1bGUgb24gZXhwb3J0c1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yID0gZnVuY3Rpb24oZXhwb3J0cykge1xuIFx0XHRpZih0eXBlb2YgU3ltYm9sICE9PSAndW5kZWZpbmVkJyAmJiBTeW1ib2wudG9TdHJpbmdUYWcpIHtcbiBcdFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgU3ltYm9sLnRvU3RyaW5nVGFnLCB7IHZhbHVlOiAnTW9kdWxlJyB9KTtcbiBcdFx0fVxuIFx0XHRPYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuIFx0fTtcblxuIFx0Ly8gY3JlYXRlIGEgZmFrZSBuYW1lc3BhY2Ugb2JqZWN0XG4gXHQvLyBtb2RlICYgMTogdmFsdWUgaXMgYSBtb2R1bGUgaWQsIHJlcXVpcmUgaXRcbiBcdC8vIG1vZGUgJiAyOiBtZXJnZSBhbGwgcHJvcGVydGllcyBvZiB2YWx1ZSBpbnRvIHRoZSBuc1xuIFx0Ly8gbW9kZSAmIDQ6IHJldHVybiB2YWx1ZSB3aGVuIGFscmVhZHkgbnMgb2JqZWN0XG4gXHQvLyBtb2RlICYgOHwxOiBiZWhhdmUgbGlrZSByZXF1aXJlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnQgPSBmdW5jdGlvbih2YWx1ZSwgbW9kZSkge1xuIFx0XHRpZihtb2RlICYgMSkgdmFsdWUgPSBfX3dlYnBhY2tfcmVxdWlyZV9fKHZhbHVlKTtcbiBcdFx0aWYobW9kZSAmIDgpIHJldHVybiB2YWx1ZTtcbiBcdFx0aWYoKG1vZGUgJiA0KSAmJiB0eXBlb2YgdmFsdWUgPT09ICdvYmplY3QnICYmIHZhbHVlICYmIHZhbHVlLl9fZXNNb2R1bGUpIHJldHVybiB2YWx1ZTtcbiBcdFx0dmFyIG5zID0gT2JqZWN0LmNyZWF0ZShudWxsKTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5yKG5zKTtcbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KG5zLCAnZGVmYXVsdCcsIHsgZW51bWVyYWJsZTogdHJ1ZSwgdmFsdWU6IHZhbHVlIH0pO1xuIFx0XHRpZihtb2RlICYgMiAmJiB0eXBlb2YgdmFsdWUgIT0gJ3N0cmluZycpIGZvcih2YXIga2V5IGluIHZhbHVlKSBfX3dlYnBhY2tfcmVxdWlyZV9fLmQobnMsIGtleSwgZnVuY3Rpb24oa2V5KSB7IHJldHVybiB2YWx1ZVtrZXldOyB9LmJpbmQobnVsbCwga2V5KSk7XG4gXHRcdHJldHVybiBucztcbiBcdH07XG5cbiBcdC8vIGdldERlZmF1bHRFeHBvcnQgZnVuY3Rpb24gZm9yIGNvbXBhdGliaWxpdHkgd2l0aCBub24taGFybW9ueSBtb2R1bGVzXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm4gPSBmdW5jdGlvbihtb2R1bGUpIHtcbiBcdFx0dmFyIGdldHRlciA9IG1vZHVsZSAmJiBtb2R1bGUuX19lc01vZHVsZSA/XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0RGVmYXVsdCgpIHsgcmV0dXJuIG1vZHVsZVsnZGVmYXVsdCddOyB9IDpcbiBcdFx0XHRmdW5jdGlvbiBnZXRNb2R1bGVFeHBvcnRzKCkgeyByZXR1cm4gbW9kdWxlOyB9O1xuIFx0XHRfX3dlYnBhY2tfcmVxdWlyZV9fLmQoZ2V0dGVyLCAnYScsIGdldHRlcik7XG4gXHRcdHJldHVybiBnZXR0ZXI7XG4gXHR9O1xuXG4gXHQvLyBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGxcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubyA9IGZ1bmN0aW9uKG9iamVjdCwgcHJvcGVydHkpIHsgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChvYmplY3QsIHByb3BlcnR5KTsgfTtcblxuIFx0Ly8gX193ZWJwYWNrX3B1YmxpY19wYXRoX19cbiBcdF9fd2VicGFja19yZXF1aXJlX18ucCA9IFwiXCI7XG5cblxuIFx0Ly8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4gXHRyZXR1cm4gX193ZWJwYWNrX3JlcXVpcmVfXyhfX3dlYnBhY2tfcmVxdWlyZV9fLnMgPSAxNyk7XG4iLCIvKipcbiAqIFRoaXMgY29kZSBpcyBhbiBpbXBsZW1lbnRhdGlvbiBvZiBBbGVhIGFsZ29yaXRobTsgKEMpIDIwMTAgSm9oYW5uZXMgQmFhZ8O4ZS5cbiAqIEFsZWEgaXMgbGljZW5zZWQgYWNjb3JkaW5nIHRvIHRoZSBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01JVF9MaWNlbnNlLlxuICovXG5jb25zdCBGUkFDID0gMi4zMjgzMDY0MzY1Mzg2OTYzZS0xMDsgLyogMl4tMzIgKi9cbmNsYXNzIFJORyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3NlZWQgPSAwO1xuICAgICAgICB0aGlzLl9zMCA9IDA7XG4gICAgICAgIHRoaXMuX3MxID0gMDtcbiAgICAgICAgdGhpcy5fczIgPSAwO1xuICAgICAgICB0aGlzLl9jID0gMDtcbiAgICB9XG4gICAgZ2V0U2VlZCgpIHsgcmV0dXJuIHRoaXMuX3NlZWQ7IH1cbiAgICAvKipcbiAgICAgKiBTZWVkIHRoZSBudW1iZXIgZ2VuZXJhdG9yXG4gICAgICovXG4gICAgc2V0U2VlZChzZWVkKSB7XG4gICAgICAgIHNlZWQgPSAoc2VlZCA8IDEgPyAxIC8gc2VlZCA6IHNlZWQpO1xuICAgICAgICB0aGlzLl9zZWVkID0gc2VlZDtcbiAgICAgICAgdGhpcy5fczAgPSAoc2VlZCA+Pj4gMCkgKiBGUkFDO1xuICAgICAgICBzZWVkID0gKHNlZWQgKiA2OTA2OSArIDEpID4+PiAwO1xuICAgICAgICB0aGlzLl9zMSA9IHNlZWQgKiBGUkFDO1xuICAgICAgICBzZWVkID0gKHNlZWQgKiA2OTA2OSArIDEpID4+PiAwO1xuICAgICAgICB0aGlzLl9zMiA9IHNlZWQgKiBGUkFDO1xuICAgICAgICB0aGlzLl9jID0gMTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIFBzZXVkb3JhbmRvbSB2YWx1ZSBbMCwxKSwgdW5pZm9ybWx5IGRpc3RyaWJ1dGVkXG4gICAgICovXG4gICAgZ2V0VW5pZm9ybSgpIHtcbiAgICAgICAgbGV0IHQgPSAyMDkxNjM5ICogdGhpcy5fczAgKyB0aGlzLl9jICogRlJBQztcbiAgICAgICAgdGhpcy5fczAgPSB0aGlzLl9zMTtcbiAgICAgICAgdGhpcy5fczEgPSB0aGlzLl9zMjtcbiAgICAgICAgdGhpcy5fYyA9IHQgfCAwO1xuICAgICAgICB0aGlzLl9zMiA9IHQgLSB0aGlzLl9jO1xuICAgICAgICByZXR1cm4gdGhpcy5fczI7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBsb3dlckJvdW5kIFRoZSBsb3dlciBlbmQgb2YgdGhlIHJhbmdlIHRvIHJldHVybiBhIHZhbHVlIGZyb20sIGluY2x1c2l2ZVxuICAgICAqIEBwYXJhbSB1cHBlckJvdW5kIFRoZSB1cHBlciBlbmQgb2YgdGhlIHJhbmdlIHRvIHJldHVybiBhIHZhbHVlIGZyb20sIGluY2x1c2l2ZVxuICAgICAqIEByZXR1cm5zIFBzZXVkb3JhbmRvbSB2YWx1ZSBbbG93ZXJCb3VuZCwgdXBwZXJCb3VuZF0sIHVzaW5nIFJPVC5STkcuZ2V0VW5pZm9ybSgpIHRvIGRpc3RyaWJ1dGUgdGhlIHZhbHVlXG4gICAgICovXG4gICAgZ2V0VW5pZm9ybUludChsb3dlckJvdW5kLCB1cHBlckJvdW5kKSB7XG4gICAgICAgIGxldCBtYXggPSBNYXRoLm1heChsb3dlckJvdW5kLCB1cHBlckJvdW5kKTtcbiAgICAgICAgbGV0IG1pbiA9IE1hdGgubWluKGxvd2VyQm91bmQsIHVwcGVyQm91bmQpO1xuICAgICAgICByZXR1cm4gTWF0aC5mbG9vcih0aGlzLmdldFVuaWZvcm0oKSAqIChtYXggLSBtaW4gKyAxKSkgKyBtaW47XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSBtZWFuIE1lYW4gdmFsdWVcbiAgICAgKiBAcGFyYW0gc3RkZGV2IFN0YW5kYXJkIGRldmlhdGlvbi4gfjk1JSBvZiB0aGUgYWJzb2x1dGUgdmFsdWVzIHdpbGwgYmUgbG93ZXIgdGhhbiAyKnN0ZGRldi5cbiAgICAgKiBAcmV0dXJucyBBIG5vcm1hbGx5IGRpc3RyaWJ1dGVkIHBzZXVkb3JhbmRvbSB2YWx1ZVxuICAgICAqL1xuICAgIGdldE5vcm1hbChtZWFuID0gMCwgc3RkZGV2ID0gMSkge1xuICAgICAgICBsZXQgdSwgdiwgcjtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgdSA9IDIgKiB0aGlzLmdldFVuaWZvcm0oKSAtIDE7XG4gICAgICAgICAgICB2ID0gMiAqIHRoaXMuZ2V0VW5pZm9ybSgpIC0gMTtcbiAgICAgICAgICAgIHIgPSB1ICogdSArIHYgKiB2O1xuICAgICAgICB9IHdoaWxlIChyID4gMSB8fCByID09IDApO1xuICAgICAgICBsZXQgZ2F1c3MgPSB1ICogTWF0aC5zcXJ0KC0yICogTWF0aC5sb2cocikgLyByKTtcbiAgICAgICAgcmV0dXJuIG1lYW4gKyBnYXVzcyAqIHN0ZGRldjtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybnMgUHNldWRvcmFuZG9tIHZhbHVlIFsxLDEwMF0gaW5jbHVzaXZlLCB1bmlmb3JtbHkgZGlzdHJpYnV0ZWRcbiAgICAgKi9cbiAgICBnZXRQZXJjZW50YWdlKCkge1xuICAgICAgICByZXR1cm4gMSArIE1hdGguZmxvb3IodGhpcy5nZXRVbmlmb3JtKCkgKiAxMDApO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyBSYW5kb21seSBwaWNrZWQgaXRlbSwgbnVsbCB3aGVuIGxlbmd0aD0wXG4gICAgICovXG4gICAgZ2V0SXRlbShhcnJheSkge1xuICAgICAgICBpZiAoIWFycmF5Lmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFycmF5W01hdGguZmxvb3IodGhpcy5nZXRVbmlmb3JtKCkgKiBhcnJheS5sZW5ndGgpXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHJldHVybnMgTmV3IGFycmF5IHdpdGggcmFuZG9taXplZCBpdGVtc1xuICAgICAqL1xuICAgIHNodWZmbGUoYXJyYXkpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFtdO1xuICAgICAgICBsZXQgY2xvbmUgPSBhcnJheS5zbGljZSgpO1xuICAgICAgICB3aGlsZSAoY2xvbmUubGVuZ3RoKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSBjbG9uZS5pbmRleE9mKHRoaXMuZ2V0SXRlbShjbG9uZSkpO1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goY2xvbmUuc3BsaWNlKGluZGV4LCAxKVswXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGRhdGEga2V5PXdoYXRldmVyLCB2YWx1ZT13ZWlnaHQgKHJlbGF0aXZlIHByb2JhYmlsaXR5KVxuICAgICAqIEByZXR1cm5zIHdoYXRldmVyXG4gICAgICovXG4gICAgZ2V0V2VpZ2h0ZWRWYWx1ZShkYXRhKSB7XG4gICAgICAgIGxldCB0b3RhbCA9IDA7XG4gICAgICAgIGZvciAobGV0IGlkIGluIGRhdGEpIHtcbiAgICAgICAgICAgIHRvdGFsICs9IGRhdGFbaWRdO1xuICAgICAgICB9XG4gICAgICAgIGxldCByYW5kb20gPSB0aGlzLmdldFVuaWZvcm0oKSAqIHRvdGFsO1xuICAgICAgICBsZXQgaWQsIHBhcnQgPSAwO1xuICAgICAgICBmb3IgKGlkIGluIGRhdGEpIHtcbiAgICAgICAgICAgIHBhcnQgKz0gZGF0YVtpZF07XG4gICAgICAgICAgICBpZiAocmFuZG9tIDwgcGFydCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBpZDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvLyBJZiBieSBzb21lIGZsb2F0aW5nLXBvaW50IGFubm95YW5jZSB3ZSBoYXZlXG4gICAgICAgIC8vIHJhbmRvbSA+PSB0b3RhbCwganVzdCByZXR1cm4gdGhlIGxhc3QgaWQuXG4gICAgICAgIHJldHVybiBpZDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IFJORyBzdGF0ZS4gVXNlZnVsIGZvciBzdG9yaW5nIHRoZSBzdGF0ZSBhbmQgcmUtc2V0dGluZyBpdCB2aWEgc2V0U3RhdGUuXG4gICAgICogQHJldHVybnMgSW50ZXJuYWwgc3RhdGVcbiAgICAgKi9cbiAgICBnZXRTdGF0ZSgpIHsgcmV0dXJuIFt0aGlzLl9zMCwgdGhpcy5fczEsIHRoaXMuX3MyLCB0aGlzLl9jXTsgfVxuICAgIC8qKlxuICAgICAqIFNldCBhIHByZXZpb3VzbHkgcmV0cmlldmVkIHN0YXRlLlxuICAgICAqL1xuICAgIHNldFN0YXRlKHN0YXRlKSB7XG4gICAgICAgIHRoaXMuX3MwID0gc3RhdGVbMF07XG4gICAgICAgIHRoaXMuX3MxID0gc3RhdGVbMV07XG4gICAgICAgIHRoaXMuX3MyID0gc3RhdGVbMl07XG4gICAgICAgIHRoaXMuX2MgPSBzdGF0ZVszXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgYSBjbG9uZWQgUk5HXG4gICAgICovXG4gICAgY2xvbmUoKSB7XG4gICAgICAgIGxldCBjbG9uZSA9IG5ldyBSTkcoKTtcbiAgICAgICAgcmV0dXJuIGNsb25lLnNldFN0YXRlKHRoaXMuZ2V0U3RhdGUoKSk7XG4gICAgfVxufVxuZXhwb3J0IGRlZmF1bHQgbmV3IFJORygpLnNldFNlZWQoRGF0ZS5ub3coKSk7XG4iLCIvKipcbiAqIEFsd2F5cyBwb3NpdGl2ZSBtb2R1bHVzXG4gKiBAcGFyYW0geCBPcGVyYW5kXG4gKiBAcGFyYW0gbiBNb2R1bHVzXG4gKiBAcmV0dXJucyB4IG1vZHVsbyBuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtb2QoeCwgbikge1xuICAgIHJldHVybiAoeCAlIG4gKyBuKSAlIG47XG59XG5leHBvcnQgZnVuY3Rpb24gY2xhbXAodmFsLCBtaW4gPSAwLCBtYXggPSAxKSB7XG4gICAgaWYgKHZhbCA8IG1pbilcbiAgICAgICAgcmV0dXJuIG1pbjtcbiAgICBpZiAodmFsID4gbWF4KVxuICAgICAgICByZXR1cm4gbWF4O1xuICAgIHJldHVybiB2YWw7XG59XG5leHBvcnQgZnVuY3Rpb24gY2FwaXRhbGl6ZShzdHJpbmcpIHtcbiAgICByZXR1cm4gc3RyaW5nLmNoYXJBdCgwKS50b1VwcGVyQ2FzZSgpICsgc3RyaW5nLnN1YnN0cmluZygxKTtcbn1cbi8qKlxuICogRm9ybWF0IGEgc3RyaW5nIGluIGEgZmxleGlibGUgd2F5LiBTY2FucyBmb3IgJXMgc3RyaW5ncyBhbmQgcmVwbGFjZXMgdGhlbSB3aXRoIGFyZ3VtZW50cy4gTGlzdCBvZiBwYXR0ZXJucyBpcyBtb2RpZmlhYmxlIHZpYSBTdHJpbmcuZm9ybWF0Lm1hcC5cbiAqIEBwYXJhbSB7c3RyaW5nfSB0ZW1wbGF0ZVxuICogQHBhcmFtIHthbnl9IFthcmd2XVxuICovXG5leHBvcnQgZnVuY3Rpb24gZm9ybWF0KHRlbXBsYXRlLCAuLi5hcmdzKSB7XG4gICAgbGV0IG1hcCA9IGZvcm1hdC5tYXA7XG4gICAgbGV0IHJlcGxhY2VyID0gZnVuY3Rpb24gKG1hdGNoLCBncm91cDEsIGdyb3VwMiwgaW5kZXgpIHtcbiAgICAgICAgaWYgKHRlbXBsYXRlLmNoYXJBdChpbmRleCAtIDEpID09IFwiJVwiKSB7XG4gICAgICAgICAgICByZXR1cm4gbWF0Y2guc3Vic3RyaW5nKDEpO1xuICAgICAgICB9XG4gICAgICAgIGlmICghYXJncy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBtYXRjaDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgb2JqID0gYXJnc1swXTtcbiAgICAgICAgbGV0IGdyb3VwID0gZ3JvdXAxIHx8IGdyb3VwMjtcbiAgICAgICAgbGV0IHBhcnRzID0gZ3JvdXAuc3BsaXQoXCIsXCIpO1xuICAgICAgICBsZXQgbmFtZSA9IHBhcnRzLnNoaWZ0KCkgfHwgXCJcIjtcbiAgICAgICAgbGV0IG1ldGhvZCA9IG1hcFtuYW1lLnRvTG93ZXJDYXNlKCldO1xuICAgICAgICBpZiAoIW1ldGhvZCkge1xuICAgICAgICAgICAgcmV0dXJuIG1hdGNoO1xuICAgICAgICB9XG4gICAgICAgIG9iaiA9IGFyZ3Muc2hpZnQoKTtcbiAgICAgICAgbGV0IHJlcGxhY2VkID0gb2JqW21ldGhvZF0uYXBwbHkob2JqLCBwYXJ0cyk7XG4gICAgICAgIGxldCBmaXJzdCA9IG5hbWUuY2hhckF0KDApO1xuICAgICAgICBpZiAoZmlyc3QgIT0gZmlyc3QudG9Mb3dlckNhc2UoKSkge1xuICAgICAgICAgICAgcmVwbGFjZWQgPSBjYXBpdGFsaXplKHJlcGxhY2VkKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVwbGFjZWQ7XG4gICAgfTtcbiAgICByZXR1cm4gdGVtcGxhdGUucmVwbGFjZSgvJSg/OihbYS16XSspfCg/OnsoW159XSspfSkpL2dpLCByZXBsYWNlcik7XG59XG5mb3JtYXQubWFwID0ge1xuICAgIFwic1wiOiBcInRvU3RyaW5nXCJcbn07XG4iLCJpbXBvcnQgeyBjbGFtcCB9IGZyb20gXCIuL3V0aWwuanNcIjtcbmltcG9ydCBSTkcgZnJvbSBcIi4vcm5nLmpzXCI7XG5leHBvcnQgZnVuY3Rpb24gZnJvbVN0cmluZyhzdHIpIHtcbiAgICBsZXQgY2FjaGVkLCByO1xuICAgIGlmIChzdHIgaW4gQ0FDSEUpIHtcbiAgICAgICAgY2FjaGVkID0gQ0FDSEVbc3RyXTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmIChzdHIuY2hhckF0KDApID09IFwiI1wiKSB7IC8vIGhleCByZ2JcbiAgICAgICAgICAgIGxldCBtYXRjaGVkID0gc3RyLm1hdGNoKC9bMC05YS1mXS9naSkgfHwgW107XG4gICAgICAgICAgICBsZXQgdmFsdWVzID0gbWF0Y2hlZC5tYXAoKHgpID0+IHBhcnNlSW50KHgsIDE2KSk7XG4gICAgICAgICAgICBpZiAodmFsdWVzLmxlbmd0aCA9PSAzKSB7XG4gICAgICAgICAgICAgICAgY2FjaGVkID0gdmFsdWVzLm1hcCgoeCkgPT4geCAqIDE3KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlc1tpICsgMV0gKz0gMTYgKiB2YWx1ZXNbaV07XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNhY2hlZCA9IHZhbHVlcztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmICgociA9IHN0ci5tYXRjaCgvcmdiXFwoKFswLTksIF0rKVxcKS9pKSkpIHsgLy8gZGVjaW1hbCByZ2JcbiAgICAgICAgICAgIGNhY2hlZCA9IHJbMV0uc3BsaXQoL1xccyosXFxzKi8pLm1hcCgoeCkgPT4gcGFyc2VJbnQoeCkpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyBodG1sIG5hbWVcbiAgICAgICAgICAgIGNhY2hlZCA9IFswLCAwLCAwXTtcbiAgICAgICAgfVxuICAgICAgICBDQUNIRVtzdHJdID0gY2FjaGVkO1xuICAgIH1cbiAgICByZXR1cm4gY2FjaGVkLnNsaWNlKCk7XG59XG4vKipcbiAqIEFkZCB0d28gb3IgbW9yZSBjb2xvcnNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkZChjb2xvcjEsIC4uLmNvbG9ycykge1xuICAgIGxldCByZXN1bHQgPSBjb2xvcjEuc2xpY2UoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbG9ycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgcmVzdWx0W2ldICs9IGNvbG9yc1tqXVtpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBBZGQgdHdvIG9yIG1vcmUgY29sb3JzLCBNT0RJRklFUyBGSVJTVCBBUkdVTUVOVFxuICovXG5leHBvcnQgZnVuY3Rpb24gYWRkXyhjb2xvcjEsIC4uLmNvbG9ycykge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgY29sb3JzLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICBjb2xvcjFbaV0gKz0gY29sb3JzW2pdW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiBjb2xvcjE7XG59XG4vKipcbiAqIE11bHRpcGx5IChtaXgpIHR3byBvciBtb3JlIGNvbG9yc1xuICovXG5leHBvcnQgZnVuY3Rpb24gbXVsdGlwbHkoY29sb3IxLCAuLi5jb2xvcnMpIHtcbiAgICBsZXQgcmVzdWx0ID0gY29sb3IxLnNsaWNlKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjb2xvcnMubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgIHJlc3VsdFtpXSAqPSBjb2xvcnNbal1baV0gLyAyNTU7XG4gICAgICAgIH1cbiAgICAgICAgcmVzdWx0W2ldID0gTWF0aC5yb3VuZChyZXN1bHRbaV0pO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBNdWx0aXBseSAobWl4KSB0d28gb3IgbW9yZSBjb2xvcnMsIE1PRElGSUVTIEZJUlNUIEFSR1VNRU5UXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtdWx0aXBseV8oY29sb3IxLCAuLi5jb2xvcnMpIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbG9ycy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgY29sb3IxW2ldICo9IGNvbG9yc1tqXVtpXSAvIDI1NTtcbiAgICAgICAgfVxuICAgICAgICBjb2xvcjFbaV0gPSBNYXRoLnJvdW5kKGNvbG9yMVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBjb2xvcjE7XG59XG4vKipcbiAqIEludGVycG9sYXRlIChibGVuZCkgdHdvIGNvbG9ycyB3aXRoIGEgZ2l2ZW4gZmFjdG9yXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpbnRlcnBvbGF0ZShjb2xvcjEsIGNvbG9yMiwgZmFjdG9yID0gMC41KSB7XG4gICAgbGV0IHJlc3VsdCA9IGNvbG9yMS5zbGljZSgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgMzsgaSsrKSB7XG4gICAgICAgIHJlc3VsdFtpXSA9IE1hdGgucm91bmQocmVzdWx0W2ldICsgZmFjdG9yICogKGNvbG9yMltpXSAtIGNvbG9yMVtpXSkpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzdWx0O1xufVxuZXhwb3J0IGNvbnN0IGxlcnAgPSBpbnRlcnBvbGF0ZTtcbi8qKlxuICogSW50ZXJwb2xhdGUgKGJsZW5kKSB0d28gY29sb3JzIHdpdGggYSBnaXZlbiBmYWN0b3IgaW4gSFNMIG1vZGVcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGludGVycG9sYXRlSFNMKGNvbG9yMSwgY29sb3IyLCBmYWN0b3IgPSAwLjUpIHtcbiAgICBsZXQgaHNsMSA9IHJnYjJoc2woY29sb3IxKTtcbiAgICBsZXQgaHNsMiA9IHJnYjJoc2woY29sb3IyKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICBoc2wxW2ldICs9IGZhY3RvciAqIChoc2wyW2ldIC0gaHNsMVtpXSk7XG4gICAgfVxuICAgIHJldHVybiBoc2wycmdiKGhzbDEpO1xufVxuZXhwb3J0IGNvbnN0IGxlcnBIU0wgPSBpbnRlcnBvbGF0ZUhTTDtcbi8qKlxuICogQ3JlYXRlIGEgbmV3IHJhbmRvbSBjb2xvciBiYXNlZCBvbiB0aGlzIG9uZVxuICogQHBhcmFtIGNvbG9yXG4gKiBAcGFyYW0gZGlmZiBTZXQgb2Ygc3RhbmRhcmQgZGV2aWF0aW9uc1xuICovXG5leHBvcnQgZnVuY3Rpb24gcmFuZG9taXplKGNvbG9yLCBkaWZmKSB7XG4gICAgaWYgKCEoZGlmZiBpbnN0YW5jZW9mIEFycmF5KSkge1xuICAgICAgICBkaWZmID0gTWF0aC5yb3VuZChSTkcuZ2V0Tm9ybWFsKDAsIGRpZmYpKTtcbiAgICB9XG4gICAgbGV0IHJlc3VsdCA9IGNvbG9yLnNsaWNlKCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgcmVzdWx0W2ldICs9IChkaWZmIGluc3RhbmNlb2YgQXJyYXkgPyBNYXRoLnJvdW5kKFJORy5nZXROb3JtYWwoMCwgZGlmZltpXSkpIDogZGlmZik7XG4gICAgfVxuICAgIHJldHVybiByZXN1bHQ7XG59XG4vKipcbiAqIENvbnZlcnRzIGFuIFJHQiBjb2xvciB2YWx1ZSB0byBIU0wuIEV4cGVjdHMgMC4uMjU1IGlucHV0cywgcHJvZHVjZXMgMC4uMSBvdXRwdXRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gcmdiMmhzbChjb2xvcikge1xuICAgIGxldCByID0gY29sb3JbMF0gLyAyNTU7XG4gICAgbGV0IGcgPSBjb2xvclsxXSAvIDI1NTtcbiAgICBsZXQgYiA9IGNvbG9yWzJdIC8gMjU1O1xuICAgIGxldCBtYXggPSBNYXRoLm1heChyLCBnLCBiKSwgbWluID0gTWF0aC5taW4ociwgZywgYik7XG4gICAgbGV0IGggPSAwLCBzLCBsID0gKG1heCArIG1pbikgLyAyO1xuICAgIGlmIChtYXggPT0gbWluKSB7XG4gICAgICAgIHMgPSAwOyAvLyBhY2hyb21hdGljXG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsZXQgZCA9IG1heCAtIG1pbjtcbiAgICAgICAgcyA9IChsID4gMC41ID8gZCAvICgyIC0gbWF4IC0gbWluKSA6IGQgLyAobWF4ICsgbWluKSk7XG4gICAgICAgIHN3aXRjaCAobWF4KSB7XG4gICAgICAgICAgICBjYXNlIHI6XG4gICAgICAgICAgICAgICAgaCA9IChnIC0gYikgLyBkICsgKGcgPCBiID8gNiA6IDApO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBnOlxuICAgICAgICAgICAgICAgIGggPSAoYiAtIHIpIC8gZCArIDI7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIGI6XG4gICAgICAgICAgICAgICAgaCA9IChyIC0gZykgLyBkICsgNDtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgICBoIC89IDY7XG4gICAgfVxuICAgIHJldHVybiBbaCwgcywgbF07XG59XG5mdW5jdGlvbiBodWUycmdiKHAsIHEsIHQpIHtcbiAgICBpZiAodCA8IDApXG4gICAgICAgIHQgKz0gMTtcbiAgICBpZiAodCA+IDEpXG4gICAgICAgIHQgLT0gMTtcbiAgICBpZiAodCA8IDEgLyA2KVxuICAgICAgICByZXR1cm4gcCArIChxIC0gcCkgKiA2ICogdDtcbiAgICBpZiAodCA8IDEgLyAyKVxuICAgICAgICByZXR1cm4gcTtcbiAgICBpZiAodCA8IDIgLyAzKVxuICAgICAgICByZXR1cm4gcCArIChxIC0gcCkgKiAoMiAvIDMgLSB0KSAqIDY7XG4gICAgcmV0dXJuIHA7XG59XG4vKipcbiAqIENvbnZlcnRzIGFuIEhTTCBjb2xvciB2YWx1ZSB0byBSR0IuIEV4cGVjdHMgMC4uMSBpbnB1dHMsIHByb2R1Y2VzIDAuLjI1NSBvdXRwdXRzLlxuICovXG5leHBvcnQgZnVuY3Rpb24gaHNsMnJnYihjb2xvcikge1xuICAgIGxldCBsID0gY29sb3JbMl07XG4gICAgaWYgKGNvbG9yWzFdID09IDApIHtcbiAgICAgICAgbCA9IE1hdGgucm91bmQobCAqIDI1NSk7XG4gICAgICAgIHJldHVybiBbbCwgbCwgbF07XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBsZXQgcyA9IGNvbG9yWzFdO1xuICAgICAgICBsZXQgcSA9IChsIDwgMC41ID8gbCAqICgxICsgcykgOiBsICsgcyAtIGwgKiBzKTtcbiAgICAgICAgbGV0IHAgPSAyICogbCAtIHE7XG4gICAgICAgIGxldCByID0gaHVlMnJnYihwLCBxLCBjb2xvclswXSArIDEgLyAzKTtcbiAgICAgICAgbGV0IGcgPSBodWUycmdiKHAsIHEsIGNvbG9yWzBdKTtcbiAgICAgICAgbGV0IGIgPSBodWUycmdiKHAsIHEsIGNvbG9yWzBdIC0gMSAvIDMpO1xuICAgICAgICByZXR1cm4gW01hdGgucm91bmQociAqIDI1NSksIE1hdGgucm91bmQoZyAqIDI1NSksIE1hdGgucm91bmQoYiAqIDI1NSldO1xuICAgIH1cbn1cbmV4cG9ydCBmdW5jdGlvbiB0b1JHQihjb2xvcikge1xuICAgIGxldCBjbGFtcGVkID0gY29sb3IubWFwKHggPT4gY2xhbXAoeCwgMCwgMjU1KSk7XG4gICAgcmV0dXJuIGByZ2IoJHtjbGFtcGVkLmpvaW4oXCIsXCIpfSlgO1xufVxuZXhwb3J0IGZ1bmN0aW9uIHRvSGV4KGNvbG9yKSB7XG4gICAgbGV0IGNsYW1wZWQgPSBjb2xvci5tYXAoeCA9PiBjbGFtcCh4LCAwLCAyNTUpLnRvU3RyaW5nKDE2KS5wYWRTdGFydCgyLCBcIjBcIikpO1xuICAgIHJldHVybiBgIyR7Y2xhbXBlZC5qb2luKFwiXCIpfWA7XG59XG5jb25zdCBDQUNIRSA9IHtcbiAgICBcImJsYWNrXCI6IFswLCAwLCAwXSxcbiAgICBcIm5hdnlcIjogWzAsIDAsIDEyOF0sXG4gICAgXCJkYXJrYmx1ZVwiOiBbMCwgMCwgMTM5XSxcbiAgICBcIm1lZGl1bWJsdWVcIjogWzAsIDAsIDIwNV0sXG4gICAgXCJibHVlXCI6IFswLCAwLCAyNTVdLFxuICAgIFwiZGFya2dyZWVuXCI6IFswLCAxMDAsIDBdLFxuICAgIFwiZ3JlZW5cIjogWzAsIDEyOCwgMF0sXG4gICAgXCJ0ZWFsXCI6IFswLCAxMjgsIDEyOF0sXG4gICAgXCJkYXJrY3lhblwiOiBbMCwgMTM5LCAxMzldLFxuICAgIFwiZGVlcHNreWJsdWVcIjogWzAsIDE5MSwgMjU1XSxcbiAgICBcImRhcmt0dXJxdW9pc2VcIjogWzAsIDIwNiwgMjA5XSxcbiAgICBcIm1lZGl1bXNwcmluZ2dyZWVuXCI6IFswLCAyNTAsIDE1NF0sXG4gICAgXCJsaW1lXCI6IFswLCAyNTUsIDBdLFxuICAgIFwic3ByaW5nZ3JlZW5cIjogWzAsIDI1NSwgMTI3XSxcbiAgICBcImFxdWFcIjogWzAsIDI1NSwgMjU1XSxcbiAgICBcImN5YW5cIjogWzAsIDI1NSwgMjU1XSxcbiAgICBcIm1pZG5pZ2h0Ymx1ZVwiOiBbMjUsIDI1LCAxMTJdLFxuICAgIFwiZG9kZ2VyYmx1ZVwiOiBbMzAsIDE0NCwgMjU1XSxcbiAgICBcImZvcmVzdGdyZWVuXCI6IFszNCwgMTM5LCAzNF0sXG4gICAgXCJzZWFncmVlblwiOiBbNDYsIDEzOSwgODddLFxuICAgIFwiZGFya3NsYXRlZ3JheVwiOiBbNDcsIDc5LCA3OV0sXG4gICAgXCJkYXJrc2xhdGVncmV5XCI6IFs0NywgNzksIDc5XSxcbiAgICBcImxpbWVncmVlblwiOiBbNTAsIDIwNSwgNTBdLFxuICAgIFwibWVkaXVtc2VhZ3JlZW5cIjogWzYwLCAxNzksIDExM10sXG4gICAgXCJ0dXJxdW9pc2VcIjogWzY0LCAyMjQsIDIwOF0sXG4gICAgXCJyb3lhbGJsdWVcIjogWzY1LCAxMDUsIDIyNV0sXG4gICAgXCJzdGVlbGJsdWVcIjogWzcwLCAxMzAsIDE4MF0sXG4gICAgXCJkYXJrc2xhdGVibHVlXCI6IFs3MiwgNjEsIDEzOV0sXG4gICAgXCJtZWRpdW10dXJxdW9pc2VcIjogWzcyLCAyMDksIDIwNF0sXG4gICAgXCJpbmRpZ29cIjogWzc1LCAwLCAxMzBdLFxuICAgIFwiZGFya29saXZlZ3JlZW5cIjogWzg1LCAxMDcsIDQ3XSxcbiAgICBcImNhZGV0Ymx1ZVwiOiBbOTUsIDE1OCwgMTYwXSxcbiAgICBcImNvcm5mbG93ZXJibHVlXCI6IFsxMDAsIDE0OSwgMjM3XSxcbiAgICBcIm1lZGl1bWFxdWFtYXJpbmVcIjogWzEwMiwgMjA1LCAxNzBdLFxuICAgIFwiZGltZ3JheVwiOiBbMTA1LCAxMDUsIDEwNV0sXG4gICAgXCJkaW1ncmV5XCI6IFsxMDUsIDEwNSwgMTA1XSxcbiAgICBcInNsYXRlYmx1ZVwiOiBbMTA2LCA5MCwgMjA1XSxcbiAgICBcIm9saXZlZHJhYlwiOiBbMTA3LCAxNDIsIDM1XSxcbiAgICBcInNsYXRlZ3JheVwiOiBbMTEyLCAxMjgsIDE0NF0sXG4gICAgXCJzbGF0ZWdyZXlcIjogWzExMiwgMTI4LCAxNDRdLFxuICAgIFwibGlnaHRzbGF0ZWdyYXlcIjogWzExOSwgMTM2LCAxNTNdLFxuICAgIFwibGlnaHRzbGF0ZWdyZXlcIjogWzExOSwgMTM2LCAxNTNdLFxuICAgIFwibWVkaXVtc2xhdGVibHVlXCI6IFsxMjMsIDEwNCwgMjM4XSxcbiAgICBcImxhd25ncmVlblwiOiBbMTI0LCAyNTIsIDBdLFxuICAgIFwiY2hhcnRyZXVzZVwiOiBbMTI3LCAyNTUsIDBdLFxuICAgIFwiYXF1YW1hcmluZVwiOiBbMTI3LCAyNTUsIDIxMl0sXG4gICAgXCJtYXJvb25cIjogWzEyOCwgMCwgMF0sXG4gICAgXCJwdXJwbGVcIjogWzEyOCwgMCwgMTI4XSxcbiAgICBcIm9saXZlXCI6IFsxMjgsIDEyOCwgMF0sXG4gICAgXCJncmF5XCI6IFsxMjgsIDEyOCwgMTI4XSxcbiAgICBcImdyZXlcIjogWzEyOCwgMTI4LCAxMjhdLFxuICAgIFwic2t5Ymx1ZVwiOiBbMTM1LCAyMDYsIDIzNV0sXG4gICAgXCJsaWdodHNreWJsdWVcIjogWzEzNSwgMjA2LCAyNTBdLFxuICAgIFwiYmx1ZXZpb2xldFwiOiBbMTM4LCA0MywgMjI2XSxcbiAgICBcImRhcmtyZWRcIjogWzEzOSwgMCwgMF0sXG4gICAgXCJkYXJrbWFnZW50YVwiOiBbMTM5LCAwLCAxMzldLFxuICAgIFwic2FkZGxlYnJvd25cIjogWzEzOSwgNjksIDE5XSxcbiAgICBcImRhcmtzZWFncmVlblwiOiBbMTQzLCAxODgsIDE0M10sXG4gICAgXCJsaWdodGdyZWVuXCI6IFsxNDQsIDIzOCwgMTQ0XSxcbiAgICBcIm1lZGl1bXB1cnBsZVwiOiBbMTQ3LCAxMTIsIDIxNl0sXG4gICAgXCJkYXJrdmlvbGV0XCI6IFsxNDgsIDAsIDIxMV0sXG4gICAgXCJwYWxlZ3JlZW5cIjogWzE1MiwgMjUxLCAxNTJdLFxuICAgIFwiZGFya29yY2hpZFwiOiBbMTUzLCA1MCwgMjA0XSxcbiAgICBcInllbGxvd2dyZWVuXCI6IFsxNTQsIDIwNSwgNTBdLFxuICAgIFwic2llbm5hXCI6IFsxNjAsIDgyLCA0NV0sXG4gICAgXCJicm93blwiOiBbMTY1LCA0MiwgNDJdLFxuICAgIFwiZGFya2dyYXlcIjogWzE2OSwgMTY5LCAxNjldLFxuICAgIFwiZGFya2dyZXlcIjogWzE2OSwgMTY5LCAxNjldLFxuICAgIFwibGlnaHRibHVlXCI6IFsxNzMsIDIxNiwgMjMwXSxcbiAgICBcImdyZWVueWVsbG93XCI6IFsxNzMsIDI1NSwgNDddLFxuICAgIFwicGFsZXR1cnF1b2lzZVwiOiBbMTc1LCAyMzgsIDIzOF0sXG4gICAgXCJsaWdodHN0ZWVsYmx1ZVwiOiBbMTc2LCAxOTYsIDIyMl0sXG4gICAgXCJwb3dkZXJibHVlXCI6IFsxNzYsIDIyNCwgMjMwXSxcbiAgICBcImZpcmVicmlja1wiOiBbMTc4LCAzNCwgMzRdLFxuICAgIFwiZGFya2dvbGRlbnJvZFwiOiBbMTg0LCAxMzQsIDExXSxcbiAgICBcIm1lZGl1bW9yY2hpZFwiOiBbMTg2LCA4NSwgMjExXSxcbiAgICBcInJvc3licm93blwiOiBbMTg4LCAxNDMsIDE0M10sXG4gICAgXCJkYXJra2hha2lcIjogWzE4OSwgMTgzLCAxMDddLFxuICAgIFwic2lsdmVyXCI6IFsxOTIsIDE5MiwgMTkyXSxcbiAgICBcIm1lZGl1bXZpb2xldHJlZFwiOiBbMTk5LCAyMSwgMTMzXSxcbiAgICBcImluZGlhbnJlZFwiOiBbMjA1LCA5MiwgOTJdLFxuICAgIFwicGVydVwiOiBbMjA1LCAxMzMsIDYzXSxcbiAgICBcImNob2NvbGF0ZVwiOiBbMjEwLCAxMDUsIDMwXSxcbiAgICBcInRhblwiOiBbMjEwLCAxODAsIDE0MF0sXG4gICAgXCJsaWdodGdyYXlcIjogWzIxMSwgMjExLCAyMTFdLFxuICAgIFwibGlnaHRncmV5XCI6IFsyMTEsIDIxMSwgMjExXSxcbiAgICBcInBhbGV2aW9sZXRyZWRcIjogWzIxNiwgMTEyLCAxNDddLFxuICAgIFwidGhpc3RsZVwiOiBbMjE2LCAxOTEsIDIxNl0sXG4gICAgXCJvcmNoaWRcIjogWzIxOCwgMTEyLCAyMTRdLFxuICAgIFwiZ29sZGVucm9kXCI6IFsyMTgsIDE2NSwgMzJdLFxuICAgIFwiY3JpbXNvblwiOiBbMjIwLCAyMCwgNjBdLFxuICAgIFwiZ2FpbnNib3JvXCI6IFsyMjAsIDIyMCwgMjIwXSxcbiAgICBcInBsdW1cIjogWzIyMSwgMTYwLCAyMjFdLFxuICAgIFwiYnVybHl3b29kXCI6IFsyMjIsIDE4NCwgMTM1XSxcbiAgICBcImxpZ2h0Y3lhblwiOiBbMjI0LCAyNTUsIDI1NV0sXG4gICAgXCJsYXZlbmRlclwiOiBbMjMwLCAyMzAsIDI1MF0sXG4gICAgXCJkYXJrc2FsbW9uXCI6IFsyMzMsIDE1MCwgMTIyXSxcbiAgICBcInZpb2xldFwiOiBbMjM4LCAxMzAsIDIzOF0sXG4gICAgXCJwYWxlZ29sZGVucm9kXCI6IFsyMzgsIDIzMiwgMTcwXSxcbiAgICBcImxpZ2h0Y29yYWxcIjogWzI0MCwgMTI4LCAxMjhdLFxuICAgIFwia2hha2lcIjogWzI0MCwgMjMwLCAxNDBdLFxuICAgIFwiYWxpY2VibHVlXCI6IFsyNDAsIDI0OCwgMjU1XSxcbiAgICBcImhvbmV5ZGV3XCI6IFsyNDAsIDI1NSwgMjQwXSxcbiAgICBcImF6dXJlXCI6IFsyNDAsIDI1NSwgMjU1XSxcbiAgICBcInNhbmR5YnJvd25cIjogWzI0NCwgMTY0LCA5Nl0sXG4gICAgXCJ3aGVhdFwiOiBbMjQ1LCAyMjIsIDE3OV0sXG4gICAgXCJiZWlnZVwiOiBbMjQ1LCAyNDUsIDIyMF0sXG4gICAgXCJ3aGl0ZXNtb2tlXCI6IFsyNDUsIDI0NSwgMjQ1XSxcbiAgICBcIm1pbnRjcmVhbVwiOiBbMjQ1LCAyNTUsIDI1MF0sXG4gICAgXCJnaG9zdHdoaXRlXCI6IFsyNDgsIDI0OCwgMjU1XSxcbiAgICBcInNhbG1vblwiOiBbMjUwLCAxMjgsIDExNF0sXG4gICAgXCJhbnRpcXVld2hpdGVcIjogWzI1MCwgMjM1LCAyMTVdLFxuICAgIFwibGluZW5cIjogWzI1MCwgMjQwLCAyMzBdLFxuICAgIFwibGlnaHRnb2xkZW5yb2R5ZWxsb3dcIjogWzI1MCwgMjUwLCAyMTBdLFxuICAgIFwib2xkbGFjZVwiOiBbMjUzLCAyNDUsIDIzMF0sXG4gICAgXCJyZWRcIjogWzI1NSwgMCwgMF0sXG4gICAgXCJmdWNoc2lhXCI6IFsyNTUsIDAsIDI1NV0sXG4gICAgXCJtYWdlbnRhXCI6IFsyNTUsIDAsIDI1NV0sXG4gICAgXCJkZWVwcGlua1wiOiBbMjU1LCAyMCwgMTQ3XSxcbiAgICBcIm9yYW5nZXJlZFwiOiBbMjU1LCA2OSwgMF0sXG4gICAgXCJ0b21hdG9cIjogWzI1NSwgOTksIDcxXSxcbiAgICBcImhvdHBpbmtcIjogWzI1NSwgMTA1LCAxODBdLFxuICAgIFwiY29yYWxcIjogWzI1NSwgMTI3LCA4MF0sXG4gICAgXCJkYXJrb3JhbmdlXCI6IFsyNTUsIDE0MCwgMF0sXG4gICAgXCJsaWdodHNhbG1vblwiOiBbMjU1LCAxNjAsIDEyMl0sXG4gICAgXCJvcmFuZ2VcIjogWzI1NSwgMTY1LCAwXSxcbiAgICBcImxpZ2h0cGlua1wiOiBbMjU1LCAxODIsIDE5M10sXG4gICAgXCJwaW5rXCI6IFsyNTUsIDE5MiwgMjAzXSxcbiAgICBcImdvbGRcIjogWzI1NSwgMjE1LCAwXSxcbiAgICBcInBlYWNocHVmZlwiOiBbMjU1LCAyMTgsIDE4NV0sXG4gICAgXCJuYXZham93aGl0ZVwiOiBbMjU1LCAyMjIsIDE3M10sXG4gICAgXCJtb2NjYXNpblwiOiBbMjU1LCAyMjgsIDE4MV0sXG4gICAgXCJiaXNxdWVcIjogWzI1NSwgMjI4LCAxOTZdLFxuICAgIFwibWlzdHlyb3NlXCI6IFsyNTUsIDIyOCwgMjI1XSxcbiAgICBcImJsYW5jaGVkYWxtb25kXCI6IFsyNTUsIDIzNSwgMjA1XSxcbiAgICBcInBhcGF5YXdoaXBcIjogWzI1NSwgMjM5LCAyMTNdLFxuICAgIFwibGF2ZW5kZXJibHVzaFwiOiBbMjU1LCAyNDAsIDI0NV0sXG4gICAgXCJzZWFzaGVsbFwiOiBbMjU1LCAyNDUsIDIzOF0sXG4gICAgXCJjb3Juc2lsa1wiOiBbMjU1LCAyNDgsIDIyMF0sXG4gICAgXCJsZW1vbmNoaWZmb25cIjogWzI1NSwgMjUwLCAyMDVdLFxuICAgIFwiZmxvcmFsd2hpdGVcIjogWzI1NSwgMjUwLCAyNDBdLFxuICAgIFwic25vd1wiOiBbMjU1LCAyNTAsIDI1MF0sXG4gICAgXCJ5ZWxsb3dcIjogWzI1NSwgMjU1LCAwXSxcbiAgICBcImxpZ2h0eWVsbG93XCI6IFsyNTUsIDI1NSwgMjI0XSxcbiAgICBcIml2b3J5XCI6IFsyNTUsIDI1NSwgMjQwXSxcbiAgICBcIndoaXRlXCI6IFsyNTUsIDI1NSwgMjU1XVxufTtcbiIsImltcG9ydCBCYWNrZW5kIGZyb20gXCIuL2JhY2tlbmQuanNcIjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENhbnZhcyBleHRlbmRzIEJhY2tlbmQge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9jdHggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiY2FudmFzXCIpLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICB9XG4gICAgc2NoZWR1bGUoY2IpIHsgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGNiKTsgfVxuICAgIGdldENvbnRhaW5lcigpIHsgcmV0dXJuIHRoaXMuX2N0eC5jYW52YXM7IH1cbiAgICBzZXRPcHRpb25zKG9wdHMpIHtcbiAgICAgICAgc3VwZXIuc2V0T3B0aW9ucyhvcHRzKTtcbiAgICAgICAgY29uc3Qgc3R5bGUgPSAob3B0cy5mb250U3R5bGUgPyBgJHtvcHRzLmZvbnRTdHlsZX0gYCA6IGBgKTtcbiAgICAgICAgY29uc3QgZm9udCA9IGAke3N0eWxlfSAke29wdHMuZm9udFNpemV9cHggJHtvcHRzLmZvbnRGYW1pbHl9YDtcbiAgICAgICAgdGhpcy5fY3R4LmZvbnQgPSBmb250O1xuICAgICAgICB0aGlzLl91cGRhdGVTaXplKCk7XG4gICAgICAgIHRoaXMuX2N0eC5mb250ID0gZm9udDtcbiAgICAgICAgdGhpcy5fY3R4LnRleHRBbGlnbiA9IFwiY2VudGVyXCI7XG4gICAgICAgIHRoaXMuX2N0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xuICAgIH1cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5fY3R4LmZpbGxTdHlsZSA9IHRoaXMuX29wdGlvbnMuYmc7XG4gICAgICAgIHRoaXMuX2N0eC5maWxsUmVjdCgwLCAwLCB0aGlzLl9jdHguY2FudmFzLndpZHRoLCB0aGlzLl9jdHguY2FudmFzLmhlaWdodCk7XG4gICAgfVxuICAgIGV2ZW50VG9Qb3NpdGlvbih4LCB5KSB7XG4gICAgICAgIGxldCBjYW52YXMgPSB0aGlzLl9jdHguY2FudmFzO1xuICAgICAgICBsZXQgcmVjdCA9IGNhbnZhcy5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgeCAtPSByZWN0LmxlZnQ7XG4gICAgICAgIHkgLT0gcmVjdC50b3A7XG4gICAgICAgIHggKj0gY2FudmFzLndpZHRoIC8gcmVjdC53aWR0aDtcbiAgICAgICAgeSAqPSBjYW52YXMuaGVpZ2h0IC8gcmVjdC5oZWlnaHQ7XG4gICAgICAgIGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IGNhbnZhcy53aWR0aCB8fCB5ID49IGNhbnZhcy5oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBbLTEsIC0xXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5fbm9ybWFsaXplZEV2ZW50VG9Qb3NpdGlvbih4LCB5KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgQ2FudmFzIGZyb20gXCIuL2NhbnZhcy5qc1wiO1xuaW1wb3J0IHsgbW9kIH0gZnJvbSBcIi4uL3V0aWwuanNcIjtcbi8qKlxuICogQGNsYXNzIEhleGFnb25hbCBiYWNrZW5kXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZXggZXh0ZW5kcyBDYW52YXMge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9zcGFjaW5nWCA9IDA7XG4gICAgICAgIHRoaXMuX3NwYWNpbmdZID0gMDtcbiAgICAgICAgdGhpcy5faGV4U2l6ZSA9IDA7XG4gICAgfVxuICAgIGRyYXcoZGF0YSwgY2xlYXJCZWZvcmUpIHtcbiAgICAgICAgbGV0IFt4LCB5LCBjaCwgZmcsIGJnXSA9IGRhdGE7XG4gICAgICAgIGxldCBweCA9IFtcbiAgICAgICAgICAgICh4ICsgMSkgKiB0aGlzLl9zcGFjaW5nWCxcbiAgICAgICAgICAgIHkgKiB0aGlzLl9zcGFjaW5nWSArIHRoaXMuX2hleFNpemVcbiAgICAgICAgXTtcbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XG4gICAgICAgICAgICBweC5yZXZlcnNlKCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNsZWFyQmVmb3JlKSB7XG4gICAgICAgICAgICB0aGlzLl9jdHguZmlsbFN0eWxlID0gYmc7XG4gICAgICAgICAgICB0aGlzLl9maWxsKHB4WzBdLCBweFsxXSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFjaCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2N0eC5maWxsU3R5bGUgPSBmZztcbiAgICAgICAgbGV0IGNoYXJzID0gW10uY29uY2F0KGNoKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdGhpcy5fY3R4LmZpbGxUZXh0KGNoYXJzW2ldLCBweFswXSwgTWF0aC5jZWlsKHB4WzFdKSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgY29tcHV0ZVNpemUoYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XG4gICAgICAgICAgICBhdmFpbFdpZHRoICs9IGF2YWlsSGVpZ2h0O1xuICAgICAgICAgICAgYXZhaWxIZWlnaHQgPSBhdmFpbFdpZHRoIC0gYXZhaWxIZWlnaHQ7XG4gICAgICAgICAgICBhdmFpbFdpZHRoIC09IGF2YWlsSGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGxldCB3aWR0aCA9IE1hdGguZmxvb3IoYXZhaWxXaWR0aCAvIHRoaXMuX3NwYWNpbmdYKSAtIDE7XG4gICAgICAgIGxldCBoZWlnaHQgPSBNYXRoLmZsb29yKChhdmFpbEhlaWdodCAtIDIgKiB0aGlzLl9oZXhTaXplKSAvIHRoaXMuX3NwYWNpbmdZICsgMSk7XG4gICAgICAgIHJldHVybiBbd2lkdGgsIGhlaWdodF07XG4gICAgfVxuICAgIGNvbXB1dGVGb250U2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHtcbiAgICAgICAgICAgIGF2YWlsV2lkdGggKz0gYXZhaWxIZWlnaHQ7XG4gICAgICAgICAgICBhdmFpbEhlaWdodCA9IGF2YWlsV2lkdGggLSBhdmFpbEhlaWdodDtcbiAgICAgICAgICAgIGF2YWlsV2lkdGggLT0gYXZhaWxIZWlnaHQ7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGhleFNpemVXaWR0aCA9IDIgKiBhdmFpbFdpZHRoIC8gKCh0aGlzLl9vcHRpb25zLndpZHRoICsgMSkgKiBNYXRoLnNxcnQoMykpIC0gMTtcbiAgICAgICAgbGV0IGhleFNpemVIZWlnaHQgPSBhdmFpbEhlaWdodCAvICgyICsgMS41ICogKHRoaXMuX29wdGlvbnMuaGVpZ2h0IC0gMSkpO1xuICAgICAgICBsZXQgaGV4U2l6ZSA9IE1hdGgubWluKGhleFNpemVXaWR0aCwgaGV4U2l6ZUhlaWdodCk7XG4gICAgICAgIC8vIGNvbXB1dGUgY2hhciByYXRpb1xuICAgICAgICBsZXQgb2xkRm9udCA9IHRoaXMuX2N0eC5mb250O1xuICAgICAgICB0aGlzLl9jdHguZm9udCA9IFwiMTAwcHggXCIgKyB0aGlzLl9vcHRpb25zLmZvbnRGYW1pbHk7XG4gICAgICAgIGxldCB3aWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jdHgubWVhc3VyZVRleHQoXCJXXCIpLndpZHRoKTtcbiAgICAgICAgdGhpcy5fY3R4LmZvbnQgPSBvbGRGb250O1xuICAgICAgICBsZXQgcmF0aW8gPSB3aWR0aCAvIDEwMDtcbiAgICAgICAgaGV4U2l6ZSA9IE1hdGguZmxvb3IoaGV4U2l6ZSkgKyAxOyAvLyBjbG9zZXN0IGxhcmdlciBoZXhTaXplXG4gICAgICAgIC8vIEZJWE1FIGNoYXIgc2l6ZSBjb21wdXRhdGlvbiBkb2VzIG5vdCByZXNwZWN0IHRyYW5zcG9zZWQgaGV4ZXNcbiAgICAgICAgbGV0IGZvbnRTaXplID0gMiAqIGhleFNpemUgLyAodGhpcy5fb3B0aW9ucy5zcGFjaW5nICogKDEgKyByYXRpbyAvIE1hdGguc3FydCgzKSkpO1xuICAgICAgICAvLyBjbG9zZXN0IHNtYWxsZXIgZm9udFNpemVcbiAgICAgICAgcmV0dXJuIE1hdGguY2VpbChmb250U2l6ZSkgLSAxO1xuICAgIH1cbiAgICBfbm9ybWFsaXplZEV2ZW50VG9Qb3NpdGlvbih4LCB5KSB7XG4gICAgICAgIGxldCBub2RlU2l6ZTtcbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudHJhbnNwb3NlKSB7XG4gICAgICAgICAgICB4ICs9IHk7XG4gICAgICAgICAgICB5ID0geCAtIHk7XG4gICAgICAgICAgICB4IC09IHk7XG4gICAgICAgICAgICBub2RlU2l6ZSA9IHRoaXMuX2N0eC5jYW52YXMud2lkdGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBub2RlU2l6ZSA9IHRoaXMuX2N0eC5jYW52YXMuaGVpZ2h0O1xuICAgICAgICB9XG4gICAgICAgIGxldCBzaXplID0gbm9kZVNpemUgLyB0aGlzLl9vcHRpb25zLmhlaWdodDtcbiAgICAgICAgeSA9IE1hdGguZmxvb3IoeSAvIHNpemUpO1xuICAgICAgICBpZiAobW9kKHksIDIpKSB7IC8qIG9kZCByb3cgKi9cbiAgICAgICAgICAgIHggLT0gdGhpcy5fc3BhY2luZ1g7XG4gICAgICAgICAgICB4ID0gMSArIDIgKiBNYXRoLmZsb29yKHggLyAoMiAqIHRoaXMuX3NwYWNpbmdYKSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB4ID0gMiAqIE1hdGguZmxvb3IoeCAvICgyICogdGhpcy5fc3BhY2luZ1gpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3gsIHldO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBBcmd1bWVudHMgYXJlIHBpeGVsIHZhbHVlcy4gSWYgXCJ0cmFuc3Bvc2VkXCIgbW9kZSBpcyBlbmFibGVkLCB0aGVuIHRoZXNlIHR3byBhcmUgYWxyZWFkeSBzd2FwcGVkLlxuICAgICAqL1xuICAgIF9maWxsKGN4LCBjeSkge1xuICAgICAgICBsZXQgYSA9IHRoaXMuX2hleFNpemU7XG4gICAgICAgIGxldCBiID0gdGhpcy5fb3B0aW9ucy5ib3JkZXI7XG4gICAgICAgIGNvbnN0IGN0eCA9IHRoaXMuX2N0eDtcbiAgICAgICAgY3R4LmJlZ2luUGF0aCgpO1xuICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50cmFuc3Bvc2UpIHtcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oY3ggLSBhICsgYiwgY3kpO1xuICAgICAgICAgICAgY3R4LmxpbmVUbyhjeCAtIGEgLyAyICsgYiwgY3kgKyB0aGlzLl9zcGFjaW5nWCAtIGIpO1xuICAgICAgICAgICAgY3R4LmxpbmVUbyhjeCArIGEgLyAyIC0gYiwgY3kgKyB0aGlzLl9zcGFjaW5nWCAtIGIpO1xuICAgICAgICAgICAgY3R4LmxpbmVUbyhjeCArIGEgLSBiLCBjeSk7XG4gICAgICAgICAgICBjdHgubGluZVRvKGN4ICsgYSAvIDIgLSBiLCBjeSAtIHRoaXMuX3NwYWNpbmdYICsgYik7XG4gICAgICAgICAgICBjdHgubGluZVRvKGN4IC0gYSAvIDIgKyBiLCBjeSAtIHRoaXMuX3NwYWNpbmdYICsgYik7XG4gICAgICAgICAgICBjdHgubGluZVRvKGN4IC0gYSArIGIsIGN5KTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGN0eC5tb3ZlVG8oY3gsIGN5IC0gYSArIGIpO1xuICAgICAgICAgICAgY3R4LmxpbmVUbyhjeCArIHRoaXMuX3NwYWNpbmdYIC0gYiwgY3kgLSBhIC8gMiArIGIpO1xuICAgICAgICAgICAgY3R4LmxpbmVUbyhjeCArIHRoaXMuX3NwYWNpbmdYIC0gYiwgY3kgKyBhIC8gMiAtIGIpO1xuICAgICAgICAgICAgY3R4LmxpbmVUbyhjeCwgY3kgKyBhIC0gYik7XG4gICAgICAgICAgICBjdHgubGluZVRvKGN4IC0gdGhpcy5fc3BhY2luZ1ggKyBiLCBjeSArIGEgLyAyIC0gYik7XG4gICAgICAgICAgICBjdHgubGluZVRvKGN4IC0gdGhpcy5fc3BhY2luZ1ggKyBiLCBjeSAtIGEgLyAyICsgYik7XG4gICAgICAgICAgICBjdHgubGluZVRvKGN4LCBjeSAtIGEgKyBiKTtcbiAgICAgICAgfVxuICAgICAgICBjdHguZmlsbCgpO1xuICAgIH1cbiAgICBfdXBkYXRlU2l6ZSgpIHtcbiAgICAgICAgY29uc3Qgb3B0cyA9IHRoaXMuX29wdGlvbnM7XG4gICAgICAgIGNvbnN0IGNoYXJXaWR0aCA9IE1hdGguY2VpbCh0aGlzLl9jdHgubWVhc3VyZVRleHQoXCJXXCIpLndpZHRoKTtcbiAgICAgICAgdGhpcy5faGV4U2l6ZSA9IE1hdGguZmxvb3Iob3B0cy5zcGFjaW5nICogKG9wdHMuZm9udFNpemUgKyBjaGFyV2lkdGggLyBNYXRoLnNxcnQoMykpIC8gMik7XG4gICAgICAgIHRoaXMuX3NwYWNpbmdYID0gdGhpcy5faGV4U2l6ZSAqIE1hdGguc3FydCgzKSAvIDI7XG4gICAgICAgIHRoaXMuX3NwYWNpbmdZID0gdGhpcy5faGV4U2l6ZSAqIDEuNTtcbiAgICAgICAgbGV0IHhwcm9wO1xuICAgICAgICBsZXQgeXByb3A7XG4gICAgICAgIGlmIChvcHRzLnRyYW5zcG9zZSkge1xuICAgICAgICAgICAgeHByb3AgPSBcImhlaWdodFwiO1xuICAgICAgICAgICAgeXByb3AgPSBcIndpZHRoXCI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB4cHJvcCA9IFwid2lkdGhcIjtcbiAgICAgICAgICAgIHlwcm9wID0gXCJoZWlnaHRcIjtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jdHguY2FudmFzW3hwcm9wXSA9IE1hdGguY2VpbCgob3B0cy53aWR0aCArIDEpICogdGhpcy5fc3BhY2luZ1gpO1xuICAgICAgICB0aGlzLl9jdHguY2FudmFzW3lwcm9wXSA9IE1hdGguY2VpbCgob3B0cy5oZWlnaHQgLSAxKSAqIHRoaXMuX3NwYWNpbmdZICsgMiAqIHRoaXMuX2hleFNpemUpO1xuICAgIH1cbn1cbiIsImltcG9ydCBDYW52YXMgZnJvbSBcIi4vY2FudmFzLmpzXCI7XG4vKipcbiAqIEBjbGFzcyBSZWN0YW5ndWxhciBiYWNrZW5kXG4gKiBAcHJpdmF0ZVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZWN0IGV4dGVuZHMgQ2FudmFzIHtcbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgc3VwZXIoKTtcbiAgICAgICAgdGhpcy5fc3BhY2luZ1ggPSAwO1xuICAgICAgICB0aGlzLl9zcGFjaW5nWSA9IDA7XG4gICAgICAgIHRoaXMuX2NhbnZhc0NhY2hlID0ge307XG4gICAgfVxuICAgIHNldE9wdGlvbnMob3B0aW9ucykge1xuICAgICAgICBzdXBlci5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9jYW52YXNDYWNoZSA9IHt9O1xuICAgIH1cbiAgICBkcmF3KGRhdGEsIGNsZWFyQmVmb3JlKSB7XG4gICAgICAgIGlmIChSZWN0LmNhY2hlKSB7XG4gICAgICAgICAgICB0aGlzLl9kcmF3V2l0aENhY2hlKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fZHJhd05vQ2FjaGUoZGF0YSwgY2xlYXJCZWZvcmUpO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9kcmF3V2l0aENhY2hlKGRhdGEpIHtcbiAgICAgICAgbGV0IFt4LCB5LCBjaCwgZmcsIGJnXSA9IGRhdGE7XG4gICAgICAgIGxldCBoYXNoID0gXCJcIiArIGNoICsgZmcgKyBiZztcbiAgICAgICAgbGV0IGNhbnZhcztcbiAgICAgICAgaWYgKGhhc2ggaW4gdGhpcy5fY2FudmFzQ2FjaGUpIHtcbiAgICAgICAgICAgIGNhbnZhcyA9IHRoaXMuX2NhbnZhc0NhY2hlW2hhc2hdO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgbGV0IGIgPSB0aGlzLl9vcHRpb25zLmJvcmRlcjtcbiAgICAgICAgICAgIGNhbnZhcyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJjYW52YXNcIik7XG4gICAgICAgICAgICBsZXQgY3R4ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgICAgIGNhbnZhcy53aWR0aCA9IHRoaXMuX3NwYWNpbmdYO1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHRoaXMuX3NwYWNpbmdZO1xuICAgICAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGJnO1xuICAgICAgICAgICAgY3R4LmZpbGxSZWN0KGIsIGIsIGNhbnZhcy53aWR0aCAtIGIsIGNhbnZhcy5oZWlnaHQgLSBiKTtcbiAgICAgICAgICAgIGlmIChjaCkge1xuICAgICAgICAgICAgICAgIGN0eC5maWxsU3R5bGUgPSBmZztcbiAgICAgICAgICAgICAgICBjdHguZm9udCA9IHRoaXMuX2N0eC5mb250O1xuICAgICAgICAgICAgICAgIGN0eC50ZXh0QWxpZ24gPSBcImNlbnRlclwiO1xuICAgICAgICAgICAgICAgIGN0eC50ZXh0QmFzZWxpbmUgPSBcIm1pZGRsZVwiO1xuICAgICAgICAgICAgICAgIGxldCBjaGFycyA9IFtdLmNvbmNhdChjaCk7XG4gICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjaGFycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICBjdHguZmlsbFRleHQoY2hhcnNbaV0sIHRoaXMuX3NwYWNpbmdYIC8gMiwgTWF0aC5jZWlsKHRoaXMuX3NwYWNpbmdZIC8gMikpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2NhbnZhc0NhY2hlW2hhc2hdID0gY2FudmFzO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2N0eC5kcmF3SW1hZ2UoY2FudmFzLCB4ICogdGhpcy5fc3BhY2luZ1gsIHkgKiB0aGlzLl9zcGFjaW5nWSk7XG4gICAgfVxuICAgIF9kcmF3Tm9DYWNoZShkYXRhLCBjbGVhckJlZm9yZSkge1xuICAgICAgICBsZXQgW3gsIHksIGNoLCBmZywgYmddID0gZGF0YTtcbiAgICAgICAgaWYgKGNsZWFyQmVmb3JlKSB7XG4gICAgICAgICAgICBsZXQgYiA9IHRoaXMuX29wdGlvbnMuYm9yZGVyO1xuICAgICAgICAgICAgdGhpcy5fY3R4LmZpbGxTdHlsZSA9IGJnO1xuICAgICAgICAgICAgdGhpcy5fY3R4LmZpbGxSZWN0KHggKiB0aGlzLl9zcGFjaW5nWCArIGIsIHkgKiB0aGlzLl9zcGFjaW5nWSArIGIsIHRoaXMuX3NwYWNpbmdYIC0gYiwgdGhpcy5fc3BhY2luZ1kgLSBiKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fY3R4LmZpbGxTdHlsZSA9IGZnO1xuICAgICAgICBsZXQgY2hhcnMgPSBbXS5jb25jYXQoY2gpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9jdHguZmlsbFRleHQoY2hhcnNbaV0sICh4ICsgMC41KSAqIHRoaXMuX3NwYWNpbmdYLCBNYXRoLmNlaWwoKHkgKyAwLjUpICogdGhpcy5fc3BhY2luZ1kpKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21wdXRlU2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuICAgICAgICBsZXQgd2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9zcGFjaW5nWCk7XG4gICAgICAgIGxldCBoZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fc3BhY2luZ1kpO1xuICAgICAgICByZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xuICAgIH1cbiAgICBjb21wdXRlRm9udFNpemUoYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcbiAgICAgICAgbGV0IGJveFdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fb3B0aW9ucy53aWR0aCk7XG4gICAgICAgIGxldCBib3hIZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy5oZWlnaHQpO1xuICAgICAgICAvKiBjb21wdXRlIGNoYXIgcmF0aW8gKi9cbiAgICAgICAgbGV0IG9sZEZvbnQgPSB0aGlzLl9jdHguZm9udDtcbiAgICAgICAgdGhpcy5fY3R4LmZvbnQgPSBcIjEwMHB4IFwiICsgdGhpcy5fb3B0aW9ucy5mb250RmFtaWx5O1xuICAgICAgICBsZXQgd2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY3R4Lm1lYXN1cmVUZXh0KFwiV1wiKS53aWR0aCk7XG4gICAgICAgIHRoaXMuX2N0eC5mb250ID0gb2xkRm9udDtcbiAgICAgICAgbGV0IHJhdGlvID0gd2lkdGggLyAxMDA7XG4gICAgICAgIGxldCB3aWR0aEZyYWN0aW9uID0gcmF0aW8gKiBib3hIZWlnaHQgLyBib3hXaWR0aDtcbiAgICAgICAgaWYgKHdpZHRoRnJhY3Rpb24gPiAxKSB7IC8qIHRvbyB3aWRlIHdpdGggY3VycmVudCBhc3BlY3QgcmF0aW8gKi9cbiAgICAgICAgICAgIGJveEhlaWdodCA9IE1hdGguZmxvb3IoYm94SGVpZ2h0IC8gd2lkdGhGcmFjdGlvbik7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGguZmxvb3IoYm94SGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy5zcGFjaW5nKTtcbiAgICB9XG4gICAgX25vcm1hbGl6ZWRFdmVudFRvUG9zaXRpb24oeCwgeSkge1xuICAgICAgICByZXR1cm4gW01hdGguZmxvb3IoeCAvIHRoaXMuX3NwYWNpbmdYKSwgTWF0aC5mbG9vcih5IC8gdGhpcy5fc3BhY2luZ1kpXTtcbiAgICB9XG4gICAgX3VwZGF0ZVNpemUoKSB7XG4gICAgICAgIGNvbnN0IG9wdHMgPSB0aGlzLl9vcHRpb25zO1xuICAgICAgICBjb25zdCBjaGFyV2lkdGggPSBNYXRoLmNlaWwodGhpcy5fY3R4Lm1lYXN1cmVUZXh0KFwiV1wiKS53aWR0aCk7XG4gICAgICAgIHRoaXMuX3NwYWNpbmdYID0gTWF0aC5jZWlsKG9wdHMuc3BhY2luZyAqIGNoYXJXaWR0aCk7XG4gICAgICAgIHRoaXMuX3NwYWNpbmdZID0gTWF0aC5jZWlsKG9wdHMuc3BhY2luZyAqIG9wdHMuZm9udFNpemUpO1xuICAgICAgICBpZiAob3B0cy5mb3JjZVNxdWFyZVJhdGlvKSB7XG4gICAgICAgICAgICB0aGlzLl9zcGFjaW5nWCA9IHRoaXMuX3NwYWNpbmdZID0gTWF0aC5tYXgodGhpcy5fc3BhY2luZ1gsIHRoaXMuX3NwYWNpbmdZKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9jdHguY2FudmFzLndpZHRoID0gb3B0cy53aWR0aCAqIHRoaXMuX3NwYWNpbmdYO1xuICAgICAgICB0aGlzLl9jdHguY2FudmFzLmhlaWdodCA9IG9wdHMuaGVpZ2h0ICogdGhpcy5fc3BhY2luZ1k7XG4gICAgfVxufVxuUmVjdC5jYWNoZSA9IGZhbHNlO1xuIiwiaW1wb3J0IENhbnZhcyBmcm9tIFwiLi9jYW52YXMuanNcIjtcbi8qKlxuICogQGNsYXNzIFRpbGUgYmFja2VuZFxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGlsZSBleHRlbmRzIENhbnZhcyB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2NvbG9yQ2FudmFzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImNhbnZhc1wiKTtcbiAgICB9XG4gICAgZHJhdyhkYXRhLCBjbGVhckJlZm9yZSkge1xuICAgICAgICBsZXQgW3gsIHksIGNoLCBmZywgYmddID0gZGF0YTtcbiAgICAgICAgbGV0IHRpbGVXaWR0aCA9IHRoaXMuX29wdGlvbnMudGlsZVdpZHRoO1xuICAgICAgICBsZXQgdGlsZUhlaWdodCA9IHRoaXMuX29wdGlvbnMudGlsZUhlaWdodDtcbiAgICAgICAgaWYgKGNsZWFyQmVmb3JlKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50aWxlQ29sb3JpemUpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jdHguY2xlYXJSZWN0KHggKiB0aWxlV2lkdGgsIHkgKiB0aWxlSGVpZ2h0LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fY3R4LmZpbGxTdHlsZSA9IGJnO1xuICAgICAgICAgICAgICAgIHRoaXMuX2N0eC5maWxsUmVjdCh4ICogdGlsZVdpZHRoLCB5ICogdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoIWNoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGNoYXJzID0gW10uY29uY2F0KGNoKTtcbiAgICAgICAgbGV0IGZncyA9IFtdLmNvbmNhdChmZyk7XG4gICAgICAgIGxldCBiZ3MgPSBbXS5jb25jYXQoYmcpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGNoYXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdGlsZSA9IHRoaXMuX29wdGlvbnMudGlsZU1hcFtjaGFyc1tpXV07XG4gICAgICAgICAgICBpZiAoIXRpbGUpIHtcbiAgICAgICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENoYXIgXCIke2NoYXJzW2ldfVwiIG5vdCBmb3VuZCBpbiB0aWxlTWFwYCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50aWxlQ29sb3JpemUpIHsgLy8gYXBwbHkgY29sb3JpemF0aW9uXG4gICAgICAgICAgICAgICAgbGV0IGNhbnZhcyA9IHRoaXMuX2NvbG9yQ2FudmFzO1xuICAgICAgICAgICAgICAgIGxldCBjb250ZXh0ID0gY2FudmFzLmdldENvbnRleHQoXCIyZFwiKTtcbiAgICAgICAgICAgICAgICBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwic291cmNlLW92ZXJcIjtcbiAgICAgICAgICAgICAgICBjb250ZXh0LmNsZWFyUmVjdCgwLCAwLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xuICAgICAgICAgICAgICAgIGxldCBmZyA9IGZnc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgYmcgPSBiZ3NbaV07XG4gICAgICAgICAgICAgICAgY29udGV4dC5kcmF3SW1hZ2UodGhpcy5fb3B0aW9ucy50aWxlU2V0LCB0aWxlWzBdLCB0aWxlWzFdLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQsIDAsIDAsIHRpbGVXaWR0aCwgdGlsZUhlaWdodCk7XG4gICAgICAgICAgICAgICAgaWYgKGZnICE9IFwidHJhbnNwYXJlbnRcIikge1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0LmZpbGxTdHlsZSA9IGZnO1xuICAgICAgICAgICAgICAgICAgICBjb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9IFwic291cmNlLWF0b3BcIjtcbiAgICAgICAgICAgICAgICAgICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoYmcgIT0gXCJ0cmFuc3BhcmVudFwiKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFN0eWxlID0gYmc7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZ2xvYmFsQ29tcG9zaXRlT3BlcmF0aW9uID0gXCJkZXN0aW5hdGlvbi1vdmVyXCI7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRleHQuZmlsbFJlY3QoMCwgMCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fY3R4LmRyYXdJbWFnZShjYW52YXMsIHggKiB0aWxlV2lkdGgsIHkgKiB0aWxlSGVpZ2h0LCB0aWxlV2lkdGgsIHRpbGVIZWlnaHQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IC8vIG5vIGNvbG9yaXppbmcsIGVhc3lcbiAgICAgICAgICAgICAgICB0aGlzLl9jdHguZHJhd0ltYWdlKHRoaXMuX29wdGlvbnMudGlsZVNldCwgdGlsZVswXSwgdGlsZVsxXSwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0LCB4ICogdGlsZVdpZHRoLCB5ICogdGlsZUhlaWdodCwgdGlsZVdpZHRoLCB0aWxlSGVpZ2h0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBjb21wdXRlU2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuICAgICAgICBsZXQgd2lkdGggPSBNYXRoLmZsb29yKGF2YWlsV2lkdGggLyB0aGlzLl9vcHRpb25zLnRpbGVXaWR0aCk7XG4gICAgICAgIGxldCBoZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy50aWxlSGVpZ2h0KTtcbiAgICAgICAgcmV0dXJuIFt3aWR0aCwgaGVpZ2h0XTtcbiAgICB9XG4gICAgY29tcHV0ZUZvbnRTaXplKCkge1xuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJUaWxlIGJhY2tlbmQgZG9lcyBub3QgdW5kZXJzdGFuZCBmb250IHNpemVcIik7XG4gICAgfVxuICAgIF9ub3JtYWxpemVkRXZlbnRUb1Bvc2l0aW9uKHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIFtNYXRoLmZsb29yKHggLyB0aGlzLl9vcHRpb25zLnRpbGVXaWR0aCksIE1hdGguZmxvb3IoeSAvIHRoaXMuX29wdGlvbnMudGlsZUhlaWdodCldO1xuICAgIH1cbiAgICBfdXBkYXRlU2l6ZSgpIHtcbiAgICAgICAgY29uc3Qgb3B0cyA9IHRoaXMuX29wdGlvbnM7XG4gICAgICAgIHRoaXMuX2N0eC5jYW52YXMud2lkdGggPSBvcHRzLndpZHRoICogb3B0cy50aWxlV2lkdGg7XG4gICAgICAgIHRoaXMuX2N0eC5jYW52YXMuaGVpZ2h0ID0gb3B0cy5oZWlnaHQgKiBvcHRzLnRpbGVIZWlnaHQ7XG4gICAgICAgIHRoaXMuX2NvbG9yQ2FudmFzLndpZHRoID0gb3B0cy50aWxlV2lkdGg7XG4gICAgICAgIHRoaXMuX2NvbG9yQ2FudmFzLmhlaWdodCA9IG9wdHMudGlsZUhlaWdodDtcbiAgICB9XG59XG4iLCIvKipcbiAqIEBuYW1lc3BhY2VcbiAqIENvbnRhaW5zIHRleHQgdG9rZW5pemF0aW9uIGFuZCBicmVha2luZyByb3V0aW5lc1xuICovXG5jb25zdCBSRV9DT0xPUlMgPSAvJShbYmNdKXsoW159XSopfS9nO1xuLy8gdG9rZW4gdHlwZXNcbmV4cG9ydCBjb25zdCBUWVBFX1RFWFQgPSAwO1xuZXhwb3J0IGNvbnN0IFRZUEVfTkVXTElORSA9IDE7XG5leHBvcnQgY29uc3QgVFlQRV9GRyA9IDI7XG5leHBvcnQgY29uc3QgVFlQRV9CRyA9IDM7XG4vKipcbiAqIE1lYXN1cmUgc2l6ZSBvZiBhIHJlc3VsdGluZyB0ZXh0IGJsb2NrXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBtZWFzdXJlKHN0ciwgbWF4V2lkdGgpIHtcbiAgICBsZXQgcmVzdWx0ID0geyB3aWR0aDogMCwgaGVpZ2h0OiAxIH07XG4gICAgbGV0IHRva2VucyA9IHRva2VuaXplKHN0ciwgbWF4V2lkdGgpO1xuICAgIGxldCBsaW5lV2lkdGggPSAwO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgc3dpdGNoICh0b2tlbi50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFRZUEVfVEVYVDpcbiAgICAgICAgICAgICAgICBsaW5lV2lkdGggKz0gdG9rZW4udmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSBUWVBFX05FV0xJTkU6XG4gICAgICAgICAgICAgICAgcmVzdWx0LmhlaWdodCsrO1xuICAgICAgICAgICAgICAgIHJlc3VsdC53aWR0aCA9IE1hdGgubWF4KHJlc3VsdC53aWR0aCwgbGluZVdpZHRoKTtcbiAgICAgICAgICAgICAgICBsaW5lV2lkdGggPSAwO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJlc3VsdC53aWR0aCA9IE1hdGgubWF4KHJlc3VsdC53aWR0aCwgbGluZVdpZHRoKTtcbiAgICByZXR1cm4gcmVzdWx0O1xufVxuLyoqXG4gKiBDb252ZXJ0IHN0cmluZyB0byBhIHNlcmllcyBvZiBhIGZvcm1hdHRpbmcgY29tbWFuZHNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHRva2VuaXplKHN0ciwgbWF4V2lkdGgpIHtcbiAgICBsZXQgcmVzdWx0ID0gW107XG4gICAgLyogZmlyc3QgdG9rZW5pemF0aW9uIHBhc3MgLSBzcGxpdCB0ZXh0cyBhbmQgY29sb3IgZm9ybWF0dGluZyBjb21tYW5kcyAqL1xuICAgIGxldCBvZmZzZXQgPSAwO1xuICAgIHN0ci5yZXBsYWNlKFJFX0NPTE9SUywgZnVuY3Rpb24gKG1hdGNoLCB0eXBlLCBuYW1lLCBpbmRleCkge1xuICAgICAgICAvKiBzdHJpbmcgYmVmb3JlICovXG4gICAgICAgIGxldCBwYXJ0ID0gc3RyLnN1YnN0cmluZyhvZmZzZXQsIGluZGV4KTtcbiAgICAgICAgaWYgKHBhcnQubGVuZ3RoKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICAgICAgdHlwZTogVFlQRV9URVhULFxuICAgICAgICAgICAgICAgIHZhbHVlOiBwYXJ0XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgICAvKiBjb2xvciBjb21tYW5kICovXG4gICAgICAgIHJlc3VsdC5wdXNoKHtcbiAgICAgICAgICAgIHR5cGU6ICh0eXBlID09IFwiY1wiID8gVFlQRV9GRyA6IFRZUEVfQkcpLFxuICAgICAgICAgICAgdmFsdWU6IG5hbWUudHJpbSgpXG4gICAgICAgIH0pO1xuICAgICAgICBvZmZzZXQgPSBpbmRleCArIG1hdGNoLmxlbmd0aDtcbiAgICAgICAgcmV0dXJuIFwiXCI7XG4gICAgfSk7XG4gICAgLyogbGFzdCByZW1haW5pbmcgcGFydCAqL1xuICAgIGxldCBwYXJ0ID0gc3RyLnN1YnN0cmluZyhvZmZzZXQpO1xuICAgIGlmIChwYXJ0Lmxlbmd0aCkge1xuICAgICAgICByZXN1bHQucHVzaCh7XG4gICAgICAgICAgICB0eXBlOiBUWVBFX1RFWFQsXG4gICAgICAgICAgICB2YWx1ZTogcGFydFxuICAgICAgICB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGJyZWFrTGluZXMocmVzdWx0LCBtYXhXaWR0aCk7XG59XG4vKiBpbnNlcnQgbGluZSBicmVha3MgaW50byBmaXJzdC1wYXNzIHRva2VuaXplZCBkYXRhICovXG5mdW5jdGlvbiBicmVha0xpbmVzKHRva2VucywgbWF4V2lkdGgpIHtcbiAgICBpZiAoIW1heFdpZHRoKSB7XG4gICAgICAgIG1heFdpZHRoID0gSW5maW5pdHk7XG4gICAgfVxuICAgIGxldCBpID0gMDtcbiAgICBsZXQgbGluZUxlbmd0aCA9IDA7XG4gICAgbGV0IGxhc3RUb2tlbldpdGhTcGFjZSA9IC0xO1xuICAgIHdoaWxlIChpIDwgdG9rZW5zLmxlbmd0aCkgeyAvKiB0YWtlIGFsbCB0ZXh0IHRva2VucywgcmVtb3ZlIHNwYWNlLCBhcHBseSBsaW5lYnJlYWtzICovXG4gICAgICAgIGxldCB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgaWYgKHRva2VuLnR5cGUgPT0gVFlQRV9ORVdMSU5FKSB7IC8qIHJlc2V0ICovXG4gICAgICAgICAgICBsaW5lTGVuZ3RoID0gMDtcbiAgICAgICAgICAgIGxhc3RUb2tlbldpdGhTcGFjZSA9IC0xO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0b2tlbi50eXBlICE9IFRZUEVfVEVYVCkgeyAvKiBza2lwIG5vbi10ZXh0IHRva2VucyAqL1xuICAgICAgICAgICAgaSsrO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgLyogcmVtb3ZlIHNwYWNlcyBhdCB0aGUgYmVnaW5uaW5nIG9mIGxpbmUgKi9cbiAgICAgICAgd2hpbGUgKGxpbmVMZW5ndGggPT0gMCAmJiB0b2tlbi52YWx1ZS5jaGFyQXQoMCkgPT0gXCIgXCIpIHtcbiAgICAgICAgICAgIHRva2VuLnZhbHVlID0gdG9rZW4udmFsdWUuc3Vic3RyaW5nKDEpO1xuICAgICAgICB9XG4gICAgICAgIC8qIGZvcmNlZCBuZXdsaW5lPyBpbnNlcnQgdHdvIG5ldyB0b2tlbnMgYWZ0ZXIgdGhpcyBvbmUgKi9cbiAgICAgICAgbGV0IGluZGV4ID0gdG9rZW4udmFsdWUuaW5kZXhPZihcIlxcblwiKTtcbiAgICAgICAgaWYgKGluZGV4ICE9IC0xKSB7XG4gICAgICAgICAgICB0b2tlbi52YWx1ZSA9IGJyZWFrSW5zaWRlVG9rZW4odG9rZW5zLCBpLCBpbmRleCwgdHJ1ZSk7XG4gICAgICAgICAgICAvKiBpZiB0aGVyZSBhcmUgc3BhY2VzIGF0IHRoZSBlbmQsIHdlIG11c3QgcmVtb3ZlIHRoZW0gKHdlIGRvIG5vdCB3YW50IHRoZSBsaW5lIHRvbyBsb25nKSAqL1xuICAgICAgICAgICAgbGV0IGFyciA9IHRva2VuLnZhbHVlLnNwbGl0KFwiXCIpO1xuICAgICAgICAgICAgd2hpbGUgKGFyci5sZW5ndGggJiYgYXJyW2Fyci5sZW5ndGggLSAxXSA9PSBcIiBcIikge1xuICAgICAgICAgICAgICAgIGFyci5wb3AoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRva2VuLnZhbHVlID0gYXJyLmpvaW4oXCJcIik7XG4gICAgICAgIH1cbiAgICAgICAgLyogdG9rZW4gZGVnZW5lcmF0ZWQ/ICovXG4gICAgICAgIGlmICghdG9rZW4udmFsdWUubGVuZ3RoKSB7XG4gICAgICAgICAgICB0b2tlbnMuc3BsaWNlKGksIDEpO1xuICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpbmVMZW5ndGggKyB0b2tlbi52YWx1ZS5sZW5ndGggPiBtYXhXaWR0aCkgeyAvKiBsaW5lIHRvbyBsb25nLCBmaW5kIGEgc3VpdGFibGUgYnJlYWtpbmcgc3BvdCAqL1xuICAgICAgICAgICAgLyogaXMgaXQgcG9zc2libGUgdG8gYnJlYWsgd2l0aGluIHRoaXMgdG9rZW4/ICovXG4gICAgICAgICAgICBsZXQgaW5kZXggPSAtMTtcbiAgICAgICAgICAgIHdoaWxlICgxKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5leHRJbmRleCA9IHRva2VuLnZhbHVlLmluZGV4T2YoXCIgXCIsIGluZGV4ICsgMSk7XG4gICAgICAgICAgICAgICAgaWYgKG5leHRJbmRleCA9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGxpbmVMZW5ndGggKyBuZXh0SW5kZXggPiBtYXhXaWR0aCkge1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaW5kZXggPSBuZXh0SW5kZXg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoaW5kZXggIT0gLTEpIHsgLyogYnJlYWsgYXQgc3BhY2Ugd2l0aGluIHRoaXMgb25lICovXG4gICAgICAgICAgICAgICAgdG9rZW4udmFsdWUgPSBicmVha0luc2lkZVRva2VuKHRva2VucywgaSwgaW5kZXgsIHRydWUpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZiAobGFzdFRva2VuV2l0aFNwYWNlICE9IC0xKSB7IC8qIGlzIHRoZXJlIGEgcHJldmlvdXMgdG9rZW4gd2hlcmUgYSBicmVhayBjYW4gb2NjdXI/ICovXG4gICAgICAgICAgICAgICAgbGV0IHRva2VuID0gdG9rZW5zW2xhc3RUb2tlbldpdGhTcGFjZV07XG4gICAgICAgICAgICAgICAgbGV0IGJyZWFrSW5kZXggPSB0b2tlbi52YWx1ZS5sYXN0SW5kZXhPZihcIiBcIik7XG4gICAgICAgICAgICAgICAgdG9rZW4udmFsdWUgPSBicmVha0luc2lkZVRva2VuKHRva2VucywgbGFzdFRva2VuV2l0aFNwYWNlLCBicmVha0luZGV4LCB0cnVlKTtcbiAgICAgICAgICAgICAgICBpID0gbGFzdFRva2VuV2l0aFNwYWNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IC8qIGZvcmNlIGJyZWFrIGluIHRoaXMgdG9rZW4gKi9cbiAgICAgICAgICAgICAgICB0b2tlbi52YWx1ZSA9IGJyZWFrSW5zaWRlVG9rZW4odG9rZW5zLCBpLCBtYXhXaWR0aCAtIGxpbmVMZW5ndGgsIGZhbHNlKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLyogbGluZSBub3QgbG9uZywgY29udGludWUgKi9cbiAgICAgICAgICAgIGxpbmVMZW5ndGggKz0gdG9rZW4udmFsdWUubGVuZ3RoO1xuICAgICAgICAgICAgaWYgKHRva2VuLnZhbHVlLmluZGV4T2YoXCIgXCIpICE9IC0xKSB7XG4gICAgICAgICAgICAgICAgbGFzdFRva2VuV2l0aFNwYWNlID0gaTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpKys7IC8qIGFkdmFuY2UgdG8gbmV4dCB0b2tlbiAqL1xuICAgIH1cbiAgICB0b2tlbnMucHVzaCh7IHR5cGU6IFRZUEVfTkVXTElORSB9KTsgLyogaW5zZXJ0IGZha2UgbmV3bGluZSB0byBmaXggdGhlIGxhc3QgdGV4dCBsaW5lICovXG4gICAgLyogcmVtb3ZlIHRyYWlsaW5nIHNwYWNlIGZyb20gdGV4dCB0b2tlbnMgYmVmb3JlIG5ld2xpbmVzICovXG4gICAgbGV0IGxhc3RUZXh0VG9rZW4gPSBudWxsO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGxldCB0b2tlbiA9IHRva2Vuc1tpXTtcbiAgICAgICAgc3dpdGNoICh0b2tlbi50eXBlKSB7XG4gICAgICAgICAgICBjYXNlIFRZUEVfVEVYVDpcbiAgICAgICAgICAgICAgICBsYXN0VGV4dFRva2VuID0gdG9rZW47XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIFRZUEVfTkVXTElORTpcbiAgICAgICAgICAgICAgICBpZiAobGFzdFRleHRUb2tlbikgeyAvKiByZW1vdmUgdHJhaWxpbmcgc3BhY2UgKi9cbiAgICAgICAgICAgICAgICAgICAgbGV0IGFyciA9IGxhc3RUZXh0VG9rZW4udmFsdWUuc3BsaXQoXCJcIik7XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChhcnIubGVuZ3RoICYmIGFyclthcnIubGVuZ3RoIC0gMV0gPT0gXCIgXCIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyci5wb3AoKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBsYXN0VGV4dFRva2VuLnZhbHVlID0gYXJyLmpvaW4oXCJcIik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGxhc3RUZXh0VG9rZW4gPSBudWxsO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIHRva2Vucy5wb3AoKTsgLyogcmVtb3ZlIGZha2UgdG9rZW4gKi9cbiAgICByZXR1cm4gdG9rZW5zO1xufVxuLyoqXG4gKiBDcmVhdGUgbmV3IHRva2VucyBhbmQgaW5zZXJ0IHRoZW0gaW50byB0aGUgc3RyZWFtXG4gKiBAcGFyYW0ge29iamVjdFtdfSB0b2tlbnNcbiAqIEBwYXJhbSB7aW50fSB0b2tlbkluZGV4IFRva2VuIGJlaW5nIHByb2Nlc3NlZFxuICogQHBhcmFtIHtpbnR9IGJyZWFrSW5kZXggSW5kZXggd2l0aGluIGN1cnJlbnQgdG9rZW4ncyB2YWx1ZVxuICogQHBhcmFtIHtib29sfSByZW1vdmVCcmVha0NoYXIgRG8gd2Ugd2FudCB0byByZW1vdmUgdGhlIGJyZWFraW5nIGNoYXJhY3Rlcj9cbiAqIEByZXR1cm5zIHtzdHJpbmd9IHJlbWFpbmluZyB1bmJyb2tlbiB0b2tlbiB2YWx1ZVxuICovXG5mdW5jdGlvbiBicmVha0luc2lkZVRva2VuKHRva2VucywgdG9rZW5JbmRleCwgYnJlYWtJbmRleCwgcmVtb3ZlQnJlYWtDaGFyKSB7XG4gICAgbGV0IG5ld0JyZWFrVG9rZW4gPSB7XG4gICAgICAgIHR5cGU6IFRZUEVfTkVXTElORVxuICAgIH07XG4gICAgbGV0IG5ld1RleHRUb2tlbiA9IHtcbiAgICAgICAgdHlwZTogVFlQRV9URVhULFxuICAgICAgICB2YWx1ZTogdG9rZW5zW3Rva2VuSW5kZXhdLnZhbHVlLnN1YnN0cmluZyhicmVha0luZGV4ICsgKHJlbW92ZUJyZWFrQ2hhciA/IDEgOiAwKSlcbiAgICB9O1xuICAgIHRva2Vucy5zcGxpY2UodG9rZW5JbmRleCArIDEsIDAsIG5ld0JyZWFrVG9rZW4sIG5ld1RleHRUb2tlbik7XG4gICAgcmV0dXJuIHRva2Vuc1t0b2tlbkluZGV4XS52YWx1ZS5zdWJzdHJpbmcoMCwgYnJlYWtJbmRleCk7XG59XG4iLCIvKiogRGVmYXVsdCB3aXRoIGZvciBkaXNwbGF5IGFuZCBtYXAgZ2VuZXJhdG9ycyAqL1xuZXhwb3J0IGxldCBERUZBVUxUX1dJRFRIID0gODA7XG4vKiogRGVmYXVsdCBoZWlnaHQgZm9yIGRpc3BsYXkgYW5kIG1hcCBnZW5lcmF0b3JzICovXG5leHBvcnQgbGV0IERFRkFVTFRfSEVJR0hUID0gMjU7XG5leHBvcnQgY29uc3QgRElSUyA9IHtcbiAgICA0OiBbWzAsIC0xXSwgWzEsIDBdLCBbMCwgMV0sIFstMSwgMF1dLFxuICAgIDg6IFtbMCwgLTFdLCBbMSwgLTFdLCBbMSwgMF0sIFsxLCAxXSwgWzAsIDFdLCBbLTEsIDFdLCBbLTEsIDBdLCBbLTEsIC0xXV0sXG4gICAgNjogW1stMSwgLTFdLCBbMSwgLTFdLCBbMiwgMF0sIFsxLCAxXSwgWy0xLCAxXSwgWy0yLCAwXV1cbn07XG5leHBvcnQgY29uc3QgS0VZUyA9IHtcbiAgICAvKiogQ2FuY2VsIGtleS4gKi9cbiAgICBWS19DQU5DRUw6IDMsXG4gICAgLyoqIEhlbHAga2V5LiAqL1xuICAgIFZLX0hFTFA6IDYsXG4gICAgLyoqIEJhY2tzcGFjZSBrZXkuICovXG4gICAgVktfQkFDS19TUEFDRTogOCxcbiAgICAvKiogVGFiIGtleS4gKi9cbiAgICBWS19UQUI6IDksXG4gICAgLyoqIDUga2V5IG9uIE51bXBhZCB3aGVuIE51bUxvY2sgaXMgdW5sb2NrZWQuIE9yIG9uIE1hYywgY2xlYXIga2V5IHdoaWNoIGlzIHBvc2l0aW9uZWQgYXQgTnVtTG9jayBrZXkuICovXG4gICAgVktfQ0xFQVI6IDEyLFxuICAgIC8qKiBSZXR1cm4vZW50ZXIga2V5IG9uIHRoZSBtYWluIGtleWJvYXJkLiAqL1xuICAgIFZLX1JFVFVSTjogMTMsXG4gICAgLyoqIFJlc2VydmVkLCBidXQgbm90IHVzZWQuICovXG4gICAgVktfRU5URVI6IDE0LFxuICAgIC8qKiBTaGlmdCBrZXkuICovXG4gICAgVktfU0hJRlQ6IDE2LFxuICAgIC8qKiBDb250cm9sIGtleS4gKi9cbiAgICBWS19DT05UUk9MOiAxNyxcbiAgICAvKiogQWx0IChPcHRpb24gb24gTWFjKSBrZXkuICovXG4gICAgVktfQUxUOiAxOCxcbiAgICAvKiogUGF1c2Uga2V5LiAqL1xuICAgIFZLX1BBVVNFOiAxOSxcbiAgICAvKiogQ2FwcyBsb2NrLiAqL1xuICAgIFZLX0NBUFNfTE9DSzogMjAsXG4gICAgLyoqIEVzY2FwZSBrZXkuICovXG4gICAgVktfRVNDQVBFOiAyNyxcbiAgICAvKiogU3BhY2UgYmFyLiAqL1xuICAgIFZLX1NQQUNFOiAzMixcbiAgICAvKiogUGFnZSBVcCBrZXkuICovXG4gICAgVktfUEFHRV9VUDogMzMsXG4gICAgLyoqIFBhZ2UgRG93biBrZXkuICovXG4gICAgVktfUEFHRV9ET1dOOiAzNCxcbiAgICAvKiogRW5kIGtleS4gKi9cbiAgICBWS19FTkQ6IDM1LFxuICAgIC8qKiBIb21lIGtleS4gKi9cbiAgICBWS19IT01FOiAzNixcbiAgICAvKiogTGVmdCBhcnJvdy4gKi9cbiAgICBWS19MRUZUOiAzNyxcbiAgICAvKiogVXAgYXJyb3cuICovXG4gICAgVktfVVA6IDM4LFxuICAgIC8qKiBSaWdodCBhcnJvdy4gKi9cbiAgICBWS19SSUdIVDogMzksXG4gICAgLyoqIERvd24gYXJyb3cuICovXG4gICAgVktfRE9XTjogNDAsXG4gICAgLyoqIFByaW50IFNjcmVlbiBrZXkuICovXG4gICAgVktfUFJJTlRTQ1JFRU46IDQ0LFxuICAgIC8qKiBJbnMoZXJ0KSBrZXkuICovXG4gICAgVktfSU5TRVJUOiA0NSxcbiAgICAvKiogRGVsKGV0ZSkga2V5LiAqL1xuICAgIFZLX0RFTEVURTogNDYsXG4gICAgLyoqKi9cbiAgICBWS18wOiA0OCxcbiAgICAvKioqL1xuICAgIFZLXzE6IDQ5LFxuICAgIC8qKiovXG4gICAgVktfMjogNTAsXG4gICAgLyoqKi9cbiAgICBWS18zOiA1MSxcbiAgICAvKioqL1xuICAgIFZLXzQ6IDUyLFxuICAgIC8qKiovXG4gICAgVktfNTogNTMsXG4gICAgLyoqKi9cbiAgICBWS182OiA1NCxcbiAgICAvKioqL1xuICAgIFZLXzc6IDU1LFxuICAgIC8qKiovXG4gICAgVktfODogNTYsXG4gICAgLyoqKi9cbiAgICBWS185OiA1NyxcbiAgICAvKiogQ29sb24gKDopIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX0NPTE9OOiA1OCxcbiAgICAvKiogU2VtaWNvbG9uICg7KSBrZXkuICovXG4gICAgVktfU0VNSUNPTE9OOiA1OSxcbiAgICAvKiogTGVzcy10aGFuICg8KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19MRVNTX1RIQU46IDYwLFxuICAgIC8qKiBFcXVhbHMgKD0pIGtleS4gKi9cbiAgICBWS19FUVVBTFM6IDYxLFxuICAgIC8qKiBHcmVhdGVyLXRoYW4gKD4pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX0dSRUFURVJfVEhBTjogNjIsXG4gICAgLyoqIFF1ZXN0aW9uIG1hcmsgKD8pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX1FVRVNUSU9OX01BUks6IDYzLFxuICAgIC8qKiBBdG1hcmsgKEApIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX0FUOiA2NCxcbiAgICAvKioqL1xuICAgIFZLX0E6IDY1LFxuICAgIC8qKiovXG4gICAgVktfQjogNjYsXG4gICAgLyoqKi9cbiAgICBWS19DOiA2NyxcbiAgICAvKioqL1xuICAgIFZLX0Q6IDY4LFxuICAgIC8qKiovXG4gICAgVktfRTogNjksXG4gICAgLyoqKi9cbiAgICBWS19GOiA3MCxcbiAgICAvKioqL1xuICAgIFZLX0c6IDcxLFxuICAgIC8qKiovXG4gICAgVktfSDogNzIsXG4gICAgLyoqKi9cbiAgICBWS19JOiA3MyxcbiAgICAvKioqL1xuICAgIFZLX0o6IDc0LFxuICAgIC8qKiovXG4gICAgVktfSzogNzUsXG4gICAgLyoqKi9cbiAgICBWS19MOiA3NixcbiAgICAvKioqL1xuICAgIFZLX006IDc3LFxuICAgIC8qKiovXG4gICAgVktfTjogNzgsXG4gICAgLyoqKi9cbiAgICBWS19POiA3OSxcbiAgICAvKioqL1xuICAgIFZLX1A6IDgwLFxuICAgIC8qKiovXG4gICAgVktfUTogODEsXG4gICAgLyoqKi9cbiAgICBWS19SOiA4MixcbiAgICAvKioqL1xuICAgIFZLX1M6IDgzLFxuICAgIC8qKiovXG4gICAgVktfVDogODQsXG4gICAgLyoqKi9cbiAgICBWS19VOiA4NSxcbiAgICAvKioqL1xuICAgIFZLX1Y6IDg2LFxuICAgIC8qKiovXG4gICAgVktfVzogODcsXG4gICAgLyoqKi9cbiAgICBWS19YOiA4OCxcbiAgICAvKioqL1xuICAgIFZLX1k6IDg5LFxuICAgIC8qKiovXG4gICAgVktfWjogOTAsXG4gICAgLyoqKi9cbiAgICBWS19DT05URVhUX01FTlU6IDkzLFxuICAgIC8qKiAwIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cbiAgICBWS19OVU1QQUQwOiA5NixcbiAgICAvKiogMSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG4gICAgVktfTlVNUEFEMTogOTcsXG4gICAgLyoqIDIgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuICAgIFZLX05VTVBBRDI6IDk4LFxuICAgIC8qKiAzIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cbiAgICBWS19OVU1QQUQzOiA5OSxcbiAgICAvKiogNCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG4gICAgVktfTlVNUEFENDogMTAwLFxuICAgIC8qKiA1IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cbiAgICBWS19OVU1QQUQ1OiAxMDEsXG4gICAgLyoqIDYgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuICAgIFZLX05VTVBBRDY6IDEwMixcbiAgICAvKiogNyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG4gICAgVktfTlVNUEFENzogMTAzLFxuICAgIC8qKiA4IG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cbiAgICBWS19OVU1QQUQ4OiAxMDQsXG4gICAgLyoqIDkgb24gdGhlIG51bWVyaWMga2V5cGFkLiAqL1xuICAgIFZLX05VTVBBRDk6IDEwNSxcbiAgICAvKiogKiBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG4gICAgVktfTVVMVElQTFk6IDEwNixcbiAgICAvKiogKyBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG4gICAgVktfQUREOiAxMDcsXG4gICAgLyoqKi9cbiAgICBWS19TRVBBUkFUT1I6IDEwOCxcbiAgICAvKiogLSBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG4gICAgVktfU1VCVFJBQ1Q6IDEwOSxcbiAgICAvKiogRGVjaW1hbCBwb2ludCBvbiB0aGUgbnVtZXJpYyBrZXlwYWQuICovXG4gICAgVktfREVDSU1BTDogMTEwLFxuICAgIC8qKiAvIG9uIHRoZSBudW1lcmljIGtleXBhZC4gKi9cbiAgICBWS19ESVZJREU6IDExMSxcbiAgICAvKiogRjEga2V5LiAqL1xuICAgIFZLX0YxOiAxMTIsXG4gICAgLyoqIEYyIGtleS4gKi9cbiAgICBWS19GMjogMTEzLFxuICAgIC8qKiBGMyBrZXkuICovXG4gICAgVktfRjM6IDExNCxcbiAgICAvKiogRjQga2V5LiAqL1xuICAgIFZLX0Y0OiAxMTUsXG4gICAgLyoqIEY1IGtleS4gKi9cbiAgICBWS19GNTogMTE2LFxuICAgIC8qKiBGNiBrZXkuICovXG4gICAgVktfRjY6IDExNyxcbiAgICAvKiogRjcga2V5LiAqL1xuICAgIFZLX0Y3OiAxMTgsXG4gICAgLyoqIEY4IGtleS4gKi9cbiAgICBWS19GODogMTE5LFxuICAgIC8qKiBGOSBrZXkuICovXG4gICAgVktfRjk6IDEyMCxcbiAgICAvKiogRjEwIGtleS4gKi9cbiAgICBWS19GMTA6IDEyMSxcbiAgICAvKiogRjExIGtleS4gKi9cbiAgICBWS19GMTE6IDEyMixcbiAgICAvKiogRjEyIGtleS4gKi9cbiAgICBWS19GMTI6IDEyMyxcbiAgICAvKiogRjEzIGtleS4gKi9cbiAgICBWS19GMTM6IDEyNCxcbiAgICAvKiogRjE0IGtleS4gKi9cbiAgICBWS19GMTQ6IDEyNSxcbiAgICAvKiogRjE1IGtleS4gKi9cbiAgICBWS19GMTU6IDEyNixcbiAgICAvKiogRjE2IGtleS4gKi9cbiAgICBWS19GMTY6IDEyNyxcbiAgICAvKiogRjE3IGtleS4gKi9cbiAgICBWS19GMTc6IDEyOCxcbiAgICAvKiogRjE4IGtleS4gKi9cbiAgICBWS19GMTg6IDEyOSxcbiAgICAvKiogRjE5IGtleS4gKi9cbiAgICBWS19GMTk6IDEzMCxcbiAgICAvKiogRjIwIGtleS4gKi9cbiAgICBWS19GMjA6IDEzMSxcbiAgICAvKiogRjIxIGtleS4gKi9cbiAgICBWS19GMjE6IDEzMixcbiAgICAvKiogRjIyIGtleS4gKi9cbiAgICBWS19GMjI6IDEzMyxcbiAgICAvKiogRjIzIGtleS4gKi9cbiAgICBWS19GMjM6IDEzNCxcbiAgICAvKiogRjI0IGtleS4gKi9cbiAgICBWS19GMjQ6IDEzNSxcbiAgICAvKiogTnVtIExvY2sga2V5LiAqL1xuICAgIFZLX05VTV9MT0NLOiAxNDQsXG4gICAgLyoqIFNjcm9sbCBMb2NrIGtleS4gKi9cbiAgICBWS19TQ1JPTExfTE9DSzogMTQ1LFxuICAgIC8qKiBDaXJjdW1mbGV4ICheKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19DSVJDVU1GTEVYOiAxNjAsXG4gICAgLyoqIEV4Y2xhbWF0aW9uICghKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19FWENMQU1BVElPTjogMTYxLFxuICAgIC8qKiBEb3VibGUgcXVvdGUgKCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfRE9VQkxFX1FVT1RFOiAxNjIsXG4gICAgLyoqIEhhc2ggKCMpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX0hBU0g6IDE2MyxcbiAgICAvKiogRG9sbGFyIHNpZ24gKCQpIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX0RPTExBUjogMTY0LFxuICAgIC8qKiBQZXJjZW50ICglKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19QRVJDRU5UOiAxNjUsXG4gICAgLyoqIEFtcGVyc2FuZCAoJikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfQU1QRVJTQU5EOiAxNjYsXG4gICAgLyoqIFVuZGVyc2NvcmUgKF8pIGtleS4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX1VOREVSU0NPUkU6IDE2NyxcbiAgICAvKiogT3BlbiBwYXJlbnRoZXNpcyAoKCkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfT1BFTl9QQVJFTjogMTY4LFxuICAgIC8qKiBDbG9zZSBwYXJlbnRoZXNpcyAoKSkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfQ0xPU0VfUEFSRU46IDE2OSxcbiAgICAvKiBBc3RlcmlzayAoKikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfQVNURVJJU0s6IDE3MCxcbiAgICAvKiogUGx1cyAoKykga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfUExVUzogMTcxLFxuICAgIC8qKiBQaXBlICh8KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19QSVBFOiAxNzIsXG4gICAgLyoqIEh5cGhlbi1VUy9kb2NzL01pbnVzICgtKSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19IWVBIRU5fTUlOVVM6IDE3MyxcbiAgICAvKiogT3BlbiBjdXJseSBicmFja2V0ICh7KSBrZXkuIFJlcXVpcmVzIEdlY2tvIDE1LjAgKi9cbiAgICBWS19PUEVOX0NVUkxZX0JSQUNLRVQ6IDE3NCxcbiAgICAvKiogQ2xvc2UgY3VybHkgYnJhY2tldCAofSkga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfQ0xPU0VfQ1VSTFlfQlJBQ0tFVDogMTc1LFxuICAgIC8qKiBUaWxkZSAofikga2V5LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfVElMREU6IDE3NixcbiAgICAvKiogQ29tbWEgKCwpIGtleS4gKi9cbiAgICBWS19DT01NQTogMTg4LFxuICAgIC8qKiBQZXJpb2QgKC4pIGtleS4gKi9cbiAgICBWS19QRVJJT0Q6IDE5MCxcbiAgICAvKiogU2xhc2ggKC8pIGtleS4gKi9cbiAgICBWS19TTEFTSDogMTkxLFxuICAgIC8qKiBCYWNrIHRpY2sgKGApIGtleS4gKi9cbiAgICBWS19CQUNLX1FVT1RFOiAxOTIsXG4gICAgLyoqIE9wZW4gc3F1YXJlIGJyYWNrZXQgKFspIGtleS4gKi9cbiAgICBWS19PUEVOX0JSQUNLRVQ6IDIxOSxcbiAgICAvKiogQmFjayBzbGFzaCAoXFwpIGtleS4gKi9cbiAgICBWS19CQUNLX1NMQVNIOiAyMjAsXG4gICAgLyoqIENsb3NlIHNxdWFyZSBicmFja2V0IChdKSBrZXkuICovXG4gICAgVktfQ0xPU0VfQlJBQ0tFVDogMjIxLFxuICAgIC8qKiBRdW90ZSAoJycnKSBrZXkuICovXG4gICAgVktfUVVPVEU6IDIyMixcbiAgICAvKiogTWV0YSBrZXkgb24gTGludXgsIENvbW1hbmQga2V5IG9uIE1hYy4gKi9cbiAgICBWS19NRVRBOiAyMjQsXG4gICAgLyoqIEFsdEdyIGtleSBvbiBMaW51eC4gUmVxdWlyZXMgR2Vja28gMTUuMCAqL1xuICAgIFZLX0FMVEdSOiAyMjUsXG4gICAgLyoqIFdpbmRvd3MgbG9nbyBrZXkgb24gV2luZG93cy4gT3IgU3VwZXIgb3IgSHlwZXIga2V5IG9uIExpbnV4LiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfV0lOOiA5MSxcbiAgICAvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG4gICAgVktfS0FOQTogMjEsXG4gICAgLyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuICAgIFZLX0hBTkdVTDogMjEsXG4gICAgLyoqIOiLseaVsCBrZXkgb24gSmFwYW5lc2UgTWFjIGtleWJvYXJkLiBSZXF1aXJlcyBHZWNrbyAxNS4wICovXG4gICAgVktfRUlTVTogMjIsXG4gICAgLyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuICAgIFZLX0pVTkpBOiAyMyxcbiAgICAvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG4gICAgVktfRklOQUw6IDI0LFxuICAgIC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cbiAgICBWS19IQU5KQTogMjUsXG4gICAgLyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuICAgIFZLX0tBTkpJOiAyNSxcbiAgICAvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG4gICAgVktfQ09OVkVSVDogMjgsXG4gICAgLyoqIExpbnV4IHN1cHBvcnQgZm9yIHRoaXMga2V5Y29kZSB3YXMgYWRkZWQgaW4gR2Vja28gNC4wLiAqL1xuICAgIFZLX05PTkNPTlZFUlQ6IDI5LFxuICAgIC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cbiAgICBWS19BQ0NFUFQ6IDMwLFxuICAgIC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cbiAgICBWS19NT0RFQ0hBTkdFOiAzMSxcbiAgICAvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG4gICAgVktfU0VMRUNUOiA0MSxcbiAgICAvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuICovXG4gICAgVktfUFJJTlQ6IDQyLFxuICAgIC8qKiBMaW51eCBzdXBwb3J0IGZvciB0aGlzIGtleWNvZGUgd2FzIGFkZGVkIGluIEdlY2tvIDQuMC4gKi9cbiAgICBWS19FWEVDVVRFOiA0MyxcbiAgICAvKiogTGludXggc3VwcG9ydCBmb3IgdGhpcyBrZXljb2RlIHdhcyBhZGRlZCBpbiBHZWNrbyA0LjAuXHQgKi9cbiAgICBWS19TTEVFUDogOTVcbn07XG4iLCJpbXBvcnQgSGV4IGZyb20gXCIuL2hleC5qc1wiO1xuaW1wb3J0IFJlY3QgZnJvbSBcIi4vcmVjdC5qc1wiO1xuaW1wb3J0IFRpbGUgZnJvbSBcIi4vdGlsZS5qc1wiO1xuaW1wb3J0IFRlcm0gZnJvbSBcIi4vdGVybS5qc1wiO1xuaW1wb3J0ICogYXMgVGV4dCBmcm9tIFwiLi4vdGV4dC5qc1wiO1xuaW1wb3J0IHsgREVGQVVMVF9XSURUSCwgREVGQVVMVF9IRUlHSFQgfSBmcm9tIFwiLi4vY29uc3RhbnRzLmpzXCI7XG5jb25zdCBCQUNLRU5EUyA9IHtcbiAgICBcImhleFwiOiBIZXgsXG4gICAgXCJyZWN0XCI6IFJlY3QsXG4gICAgXCJ0aWxlXCI6IFRpbGUsXG4gICAgXCJ0ZXJtXCI6IFRlcm1cbn07XG5jb25zdCBERUZBVUxUX09QVElPTlMgPSB7XG4gICAgd2lkdGg6IERFRkFVTFRfV0lEVEgsXG4gICAgaGVpZ2h0OiBERUZBVUxUX0hFSUdIVCxcbiAgICB0cmFuc3Bvc2U6IGZhbHNlLFxuICAgIGxheW91dDogXCJyZWN0XCIsXG4gICAgZm9udFNpemU6IDE1LFxuICAgIHNwYWNpbmc6IDEsXG4gICAgYm9yZGVyOiAwLFxuICAgIGZvcmNlU3F1YXJlUmF0aW86IGZhbHNlLFxuICAgIGZvbnRGYW1pbHk6IFwibW9ub3NwYWNlXCIsXG4gICAgZm9udFN0eWxlOiBcIlwiLFxuICAgIGZnOiBcIiNjY2NcIixcbiAgICBiZzogXCIjMDAwXCIsXG4gICAgdGlsZVdpZHRoOiAzMixcbiAgICB0aWxlSGVpZ2h0OiAzMixcbiAgICB0aWxlTWFwOiB7fSxcbiAgICB0aWxlU2V0OiBudWxsLFxuICAgIHRpbGVDb2xvcml6ZTogZmFsc2Vcbn07XG4vKipcbiAqIEBjbGFzcyBWaXN1YWwgbWFwIGRpc3BsYXlcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlzcGxheSB7XG4gICAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuX2RhdGEgPSB7fTtcbiAgICAgICAgdGhpcy5fZGlydHkgPSBmYWxzZTsgLy8gZmFsc2UgPSBub3RoaW5nLCB0cnVlID0gYWxsLCBvYmplY3QgPSBkaXJ0eSBjZWxsc1xuICAgICAgICB0aGlzLl9vcHRpb25zID0ge307XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUX09QVElPTlMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgICAgIHRoaXMuREVCVUcgPSB0aGlzLkRFQlVHLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX3RpY2sgPSB0aGlzLl90aWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2JhY2tlbmQuc2NoZWR1bGUodGhpcy5fdGljayk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERlYnVnIGhlbHBlciwgaWRlYWwgYXMgYSBtYXAgZ2VuZXJhdG9yIGNhbGxiYWNrLiBBbHdheXMgYm91bmQgdG8gdGhpcy5cbiAgICAgKiBAcGFyYW0ge2ludH0geFxuICAgICAqIEBwYXJhbSB7aW50fSB5XG4gICAgICogQHBhcmFtIHtpbnR9IHdoYXRcbiAgICAgKi9cbiAgICBERUJVRyh4LCB5LCB3aGF0KSB7XG4gICAgICAgIGxldCBjb2xvcnMgPSBbdGhpcy5fb3B0aW9ucy5iZywgdGhpcy5fb3B0aW9ucy5mZ107XG4gICAgICAgIHRoaXMuZHJhdyh4LCB5LCBudWxsLCBudWxsLCBjb2xvcnNbd2hhdCAlIGNvbG9ycy5sZW5ndGhdKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2xlYXIgdGhlIHdob2xlIGRpc3BsYXkgKGNvdmVyIGl0IHdpdGggYmFja2dyb3VuZCBjb2xvcilcbiAgICAgKi9cbiAgICBjbGVhcigpIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IHt9O1xuICAgICAgICB0aGlzLl9kaXJ0eSA9IHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzZWUgUk9ULkRpc3BsYXlcbiAgICAgKi9cbiAgICBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLl9vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKG9wdGlvbnMud2lkdGggfHwgb3B0aW9ucy5oZWlnaHQgfHwgb3B0aW9ucy5mb250U2l6ZSB8fCBvcHRpb25zLmZvbnRGYW1pbHkgfHwgb3B0aW9ucy5zcGFjaW5nIHx8IG9wdGlvbnMubGF5b3V0KSB7XG4gICAgICAgICAgICBpZiAob3B0aW9ucy5sYXlvdXQpIHtcbiAgICAgICAgICAgICAgICBsZXQgY3RvciA9IEJBQ0tFTkRTW29wdGlvbnMubGF5b3V0XTtcbiAgICAgICAgICAgICAgICB0aGlzLl9iYWNrZW5kID0gbmV3IGN0b3IoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX2JhY2tlbmQuc2V0T3B0aW9ucyh0aGlzLl9vcHRpb25zKTtcbiAgICAgICAgICAgIHRoaXMuX2RpcnR5ID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJucyBjdXJyZW50bHkgc2V0IG9wdGlvbnNcbiAgICAgKi9cbiAgICBnZXRPcHRpb25zKCkgeyByZXR1cm4gdGhpcy5fb3B0aW9uczsgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdGhlIERPTSBub2RlIG9mIHRoaXMgZGlzcGxheVxuICAgICAqL1xuICAgIGdldENvbnRhaW5lcigpIHsgcmV0dXJuIHRoaXMuX2JhY2tlbmQuZ2V0Q29udGFpbmVyKCk7IH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlIHRoZSBtYXhpbXVtIHdpZHRoL2hlaWdodCB0byBmaXQgaW50byBhIHNldCBvZiBnaXZlbiBjb25zdHJhaW50c1xuICAgICAqIEBwYXJhbSB7aW50fSBhdmFpbFdpZHRoIE1heGltdW0gYWxsb3dlZCBwaXhlbCB3aWR0aFxuICAgICAqIEBwYXJhbSB7aW50fSBhdmFpbEhlaWdodCBNYXhpbXVtIGFsbG93ZWQgcGl4ZWwgaGVpZ2h0XG4gICAgICogQHJldHVybnMge2ludFsyXX0gY2VsbFdpZHRoLGNlbGxIZWlnaHRcbiAgICAgKi9cbiAgICBjb21wdXRlU2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYmFja2VuZC5jb21wdXRlU2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGUgdGhlIG1heGltdW0gZm9udCBzaXplIHRvIGZpdCBpbnRvIGEgc2V0IG9mIGdpdmVuIGNvbnN0cmFpbnRzXG4gICAgICogQHBhcmFtIHtpbnR9IGF2YWlsV2lkdGggTWF4aW11bSBhbGxvd2VkIHBpeGVsIHdpZHRoXG4gICAgICogQHBhcmFtIHtpbnR9IGF2YWlsSGVpZ2h0IE1heGltdW0gYWxsb3dlZCBwaXhlbCBoZWlnaHRcbiAgICAgKiBAcmV0dXJucyB7aW50fSBmb250U2l6ZVxuICAgICAqL1xuICAgIGNvbXB1dGVGb250U2l6ZShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fYmFja2VuZC5jb21wdXRlRm9udFNpemUoYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpO1xuICAgIH1cbiAgICBjb21wdXRlVGlsZVNpemUoYXZhaWxXaWR0aCwgYXZhaWxIZWlnaHQpIHtcbiAgICAgICAgbGV0IHdpZHRoID0gTWF0aC5mbG9vcihhdmFpbFdpZHRoIC8gdGhpcy5fb3B0aW9ucy53aWR0aCk7XG4gICAgICAgIGxldCBoZWlnaHQgPSBNYXRoLmZsb29yKGF2YWlsSGVpZ2h0IC8gdGhpcy5fb3B0aW9ucy5oZWlnaHQpO1xuICAgICAgICByZXR1cm4gW3dpZHRoLCBoZWlnaHRdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb252ZXJ0IGEgRE9NIGV2ZW50IChtb3VzZSBvciB0b3VjaCkgdG8gbWFwIGNvb3JkaW5hdGVzLiBVc2VzIGZpcnN0IHRvdWNoIGZvciBtdWx0aS10b3VjaC5cbiAgICAgKiBAcGFyYW0ge0V2ZW50fSBlIGV2ZW50XG4gICAgICogQHJldHVybnMge2ludFsyXX0gLTEgZm9yIHZhbHVlcyBvdXRzaWRlIG9mIHRoZSBjYW52YXNcbiAgICAgKi9cbiAgICBldmVudFRvUG9zaXRpb24oZSkge1xuICAgICAgICBsZXQgeCwgeTtcbiAgICAgICAgaWYgKFwidG91Y2hlc1wiIGluIGUpIHtcbiAgICAgICAgICAgIHggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgICAgICAgIHkgPSBlLnRvdWNoZXNbMF0uY2xpZW50WTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHggPSBlLmNsaWVudFg7XG4gICAgICAgICAgICB5ID0gZS5jbGllbnRZO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9iYWNrZW5kLmV2ZW50VG9Qb3NpdGlvbih4LCB5KTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtpbnR9IHhcbiAgICAgKiBAcGFyYW0ge2ludH0geVxuICAgICAqIEBwYXJhbSB7c3RyaW5nIHx8IHN0cmluZ1tdfSBjaCBPbmUgb3IgbW9yZSBjaGFycyAod2lsbCBiZSBvdmVybGFwcGluZyB0aGVtc2VsdmVzKVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSBbZmddIGZvcmVncm91bmQgY29sb3JcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gW2JnXSBiYWNrZ3JvdW5kIGNvbG9yXG4gICAgICovXG4gICAgZHJhdyh4LCB5LCBjaCwgZmcsIGJnKSB7XG4gICAgICAgIGlmICghZmcpIHtcbiAgICAgICAgICAgIGZnID0gdGhpcy5fb3B0aW9ucy5mZztcbiAgICAgICAgfVxuICAgICAgICBpZiAoIWJnKSB7XG4gICAgICAgICAgICBiZyA9IHRoaXMuX29wdGlvbnMuYmc7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGtleSA9IGAke3h9LCR7eX1gO1xuICAgICAgICB0aGlzLl9kYXRhW2tleV0gPSBbeCwgeSwgY2gsIGZnLCBiZ107XG4gICAgICAgIGlmICh0aGlzLl9kaXJ0eSA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9IC8vIHdpbGwgYWxyZWFkeSByZWRyYXcgZXZlcnl0aGluZyBcbiAgICAgICAgaWYgKCF0aGlzLl9kaXJ0eSkge1xuICAgICAgICAgICAgdGhpcy5fZGlydHkgPSB7fTtcbiAgICAgICAgfSAvLyBmaXJzdCFcbiAgICAgICAgdGhpcy5fZGlydHlba2V5XSA9IHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIERyYXdzIGEgdGV4dCBhdCBnaXZlbiBwb3NpdGlvbi4gT3B0aW9uYWxseSB3cmFwcyBhdCBhIG1heGltdW0gbGVuZ3RoLiBDdXJyZW50bHkgZG9lcyBub3Qgd29yayB3aXRoIGhleCBsYXlvdXQuXG4gICAgICogQHBhcmFtIHtpbnR9IHhcbiAgICAgKiBAcGFyYW0ge2ludH0geVxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IE1heSBjb250YWluIGNvbG9yL2JhY2tncm91bmQgZm9ybWF0IHNwZWNpZmllcnMsICVje25hbWV9LyVie25hbWV9LCBib3RoIG9wdGlvbmFsLiAlY3t9LyVie30gcmVzZXRzIHRvIGRlZmF1bHQuXG4gICAgICogQHBhcmFtIHtpbnR9IFttYXhXaWR0aF0gd3JhcCBhdCB3aGF0IHdpZHRoP1xuICAgICAqIEByZXR1cm5zIHtpbnR9IGxpbmVzIGRyYXduXG4gICAgICovXG4gICAgZHJhd1RleHQoeCwgeSwgdGV4dCwgbWF4V2lkdGgpIHtcbiAgICAgICAgbGV0IGZnID0gbnVsbDtcbiAgICAgICAgbGV0IGJnID0gbnVsbDtcbiAgICAgICAgbGV0IGN4ID0geDtcbiAgICAgICAgbGV0IGN5ID0geTtcbiAgICAgICAgbGV0IGxpbmVzID0gMTtcbiAgICAgICAgaWYgKCFtYXhXaWR0aCkge1xuICAgICAgICAgICAgbWF4V2lkdGggPSB0aGlzLl9vcHRpb25zLndpZHRoIC0geDtcbiAgICAgICAgfVxuICAgICAgICBsZXQgdG9rZW5zID0gVGV4dC50b2tlbml6ZSh0ZXh0LCBtYXhXaWR0aCk7XG4gICAgICAgIHdoaWxlICh0b2tlbnMubGVuZ3RoKSB7IC8vIGludGVycHJldCB0b2tlbml6ZWQgb3Bjb2RlIHN0cmVhbVxuICAgICAgICAgICAgbGV0IHRva2VuID0gdG9rZW5zLnNoaWZ0KCk7XG4gICAgICAgICAgICBzd2l0Y2ggKHRva2VuLnR5cGUpIHtcbiAgICAgICAgICAgICAgICBjYXNlIFRleHQuVFlQRV9URVhUOlxuICAgICAgICAgICAgICAgICAgICBsZXQgaXNTcGFjZSA9IGZhbHNlLCBpc1ByZXZTcGFjZSA9IGZhbHNlLCBpc0Z1bGxXaWR0aCA9IGZhbHNlLCBpc1ByZXZGdWxsV2lkdGggPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0b2tlbi52YWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGNjID0gdG9rZW4udmFsdWUuY2hhckNvZGVBdChpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGxldCBjID0gdG9rZW4udmFsdWUuY2hhckF0KGkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQXNzaWduIHRvIGB0cnVlYCB3aGVuIHRoZSBjdXJyZW50IGNoYXIgaXMgZnVsbC13aWR0aC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlzRnVsbFdpZHRoID0gKGNjID4gMHhmZjAwICYmIGNjIDwgMHhmZjYxKSB8fCAoY2MgPiAweGZmZGMgJiYgY2MgPCAweGZmZTgpIHx8IGNjID4gMHhmZmVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gQ3VycmVudCBjaGFyIGlzIHNwYWNlLCB3aGF0ZXZlciBmdWxsLXdpZHRoIG9yIGhhbGYtd2lkdGggYm90aCBhcmUgT0suXG4gICAgICAgICAgICAgICAgICAgICAgICBpc1NwYWNlID0gKGMuY2hhckNvZGVBdCgwKSA9PSAweDIwIHx8IGMuY2hhckNvZGVBdCgwKSA9PSAweDMwMDApO1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gVGhlIHByZXZpb3VzIGNoYXIgaXMgZnVsbC13aWR0aCBhbmRcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGN1cnJlbnQgY2hhciBpcyBuZXRoZXIgaGFsZi13aWR0aCBub3IgYSBzcGFjZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc1ByZXZGdWxsV2lkdGggJiYgIWlzRnVsbFdpZHRoICYmICFpc1NwYWNlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3grKztcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gLy8gYWRkIGFuIGV4dHJhIHBvc2l0aW9uXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBUaGUgY3VycmVudCBjaGFyIGlzIGZ1bGwtd2lkdGggYW5kXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyB0aGUgcHJldmlvdXMgY2hhciBpcyBub3QgYSBzcGFjZS5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChpc0Z1bGxXaWR0aCAmJiAhaXNQcmV2U3BhY2UpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjeCsrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfSAvLyBhZGQgYW4gZXh0cmEgcG9zaXRpb25cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZHJhdyhjeCsrLCBjeSwgYywgZmcsIGJnKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJldlNwYWNlID0gaXNTcGFjZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlzUHJldkZ1bGxXaWR0aCA9IGlzRnVsbFdpZHRoO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgVGV4dC5UWVBFX0ZHOlxuICAgICAgICAgICAgICAgICAgICBmZyA9IHRva2VuLnZhbHVlIHx8IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgVGV4dC5UWVBFX0JHOlxuICAgICAgICAgICAgICAgICAgICBiZyA9IHRva2VuLnZhbHVlIHx8IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIGNhc2UgVGV4dC5UWVBFX05FV0xJTkU6XG4gICAgICAgICAgICAgICAgICAgIGN4ID0geDtcbiAgICAgICAgICAgICAgICAgICAgY3krKztcbiAgICAgICAgICAgICAgICAgICAgbGluZXMrKztcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGxpbmVzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUaW1lciB0aWNrOiB1cGRhdGUgZGlydHkgcGFydHNcbiAgICAgKi9cbiAgICBfdGljaygpIHtcbiAgICAgICAgdGhpcy5fYmFja2VuZC5zY2hlZHVsZSh0aGlzLl90aWNrKTtcbiAgICAgICAgaWYgKCF0aGlzLl9kaXJ0eSkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGlmICh0aGlzLl9kaXJ0eSA9PT0gdHJ1ZSkgeyAvLyBkcmF3IGFsbFxuICAgICAgICAgICAgdGhpcy5fYmFja2VuZC5jbGVhcigpO1xuICAgICAgICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5fZGF0YSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX2RyYXcoaWQsIGZhbHNlKTtcbiAgICAgICAgICAgIH0gLy8gcmVkcmF3IGNhY2hlZCBkYXRhIFxuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvLyBkcmF3IG9ubHkgZGlydHkgXG4gICAgICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fZGlydHkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9kcmF3KGtleSwgdHJ1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZGlydHkgPSBmYWxzZTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGtleSBXaGF0IHRvIGRyYXdcbiAgICAgKiBAcGFyYW0ge2Jvb2x9IGNsZWFyQmVmb3JlIElzIGl0IG5lY2Vzc2FyeSB0byBjbGVhbiBiZWZvcmU/XG4gICAgICovXG4gICAgX2RyYXcoa2V5LCBjbGVhckJlZm9yZSkge1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgaWYgKGRhdGFbNF0gIT0gdGhpcy5fb3B0aW9ucy5iZykge1xuICAgICAgICAgICAgY2xlYXJCZWZvcmUgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2JhY2tlbmQuZHJhdyhkYXRhLCBjbGVhckJlZm9yZSk7XG4gICAgfVxufVxuRGlzcGxheS5SZWN0ID0gUmVjdDtcbkRpc3BsYXkuSGV4ID0gSGV4O1xuRGlzcGxheS5UaWxlID0gVGlsZTtcbkRpc3BsYXkuVGVybSA9IFRlcm07XG4iLCJpbXBvcnQgUk5HIGZyb20gXCIuL3JuZy5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgKE1hcmtvdiBwcm9jZXNzKS1iYXNlZCBzdHJpbmcgZ2VuZXJhdG9yLlxuICogQ29waWVkIGZyb20gYSA8YSBocmVmPVwiaHR0cDovL3d3dy5yb2d1ZWJhc2luLnJvZ3VlbGlrZWRldmVsb3BtZW50Lm9yZy9pbmRleC5waHA/dGl0bGU9TmFtZXNfZnJvbV9hX2hpZ2hfb3JkZXJfTWFya292X1Byb2Nlc3NfYW5kX2Ffc2ltcGxpZmllZF9LYXR6X2JhY2stb2ZmX3NjaGVtZVwiPlJvZ3VlQmFzaW4gYXJ0aWNsZTwvYT4uXG4gKiBPZmZlcnMgY29uZmlndXJhYmxlIG9yZGVyIGFuZCBwcmlvci5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyaW5nR2VuZXJhdG9yIHtcbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSB7XG4gICAgICAgICAgICB3b3JkczogZmFsc2UsXG4gICAgICAgICAgICBvcmRlcjogMyxcbiAgICAgICAgICAgIHByaW9yOiAwLjAwMVxuICAgICAgICB9O1xuICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuX29wdGlvbnMsIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9ib3VuZGFyeSA9IFN0cmluZy5mcm9tQ2hhckNvZGUoMCk7XG4gICAgICAgIHRoaXMuX3N1ZmZpeCA9IHRoaXMuX2JvdW5kYXJ5O1xuICAgICAgICB0aGlzLl9wcmVmaXggPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9vcHRpb25zLm9yZGVyOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX3ByZWZpeC5wdXNoKHRoaXMuX2JvdW5kYXJ5KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9wcmlvclZhbHVlcyA9IHt9O1xuICAgICAgICB0aGlzLl9wcmlvclZhbHVlc1t0aGlzLl9ib3VuZGFyeV0gPSB0aGlzLl9vcHRpb25zLnByaW9yO1xuICAgICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgbGVhcm5pbmcgZGF0YVxuICAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9kYXRhID0ge307XG4gICAgICAgIHRoaXMuX3ByaW9yVmFsdWVzID0ge307XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIHtzdHJpbmd9IEdlbmVyYXRlZCBzdHJpbmdcbiAgICAgKi9cbiAgICBnZW5lcmF0ZSgpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IFt0aGlzLl9zYW1wbGUodGhpcy5fcHJlZml4KV07XG4gICAgICAgIHdoaWxlIChyZXN1bHRbcmVzdWx0Lmxlbmd0aCAtIDFdICE9IHRoaXMuX2JvdW5kYXJ5KSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaCh0aGlzLl9zYW1wbGUocmVzdWx0KSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2pvaW4ocmVzdWx0LnNsaWNlKDAsIC0xKSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE9ic2VydmUgKGxlYXJuKSBhIHN0cmluZyBmcm9tIGEgdHJhaW5pbmcgc2V0XG4gICAgICovXG4gICAgb2JzZXJ2ZShzdHJpbmcpIHtcbiAgICAgICAgbGV0IHRva2VucyA9IHRoaXMuX3NwbGl0KHN0cmluZyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9wcmlvclZhbHVlc1t0b2tlbnNbaV1dID0gdGhpcy5fb3B0aW9ucy5wcmlvcjtcbiAgICAgICAgfVxuICAgICAgICB0b2tlbnMgPSB0aGlzLl9wcmVmaXguY29uY2F0KHRva2VucykuY29uY2F0KHRoaXMuX3N1ZmZpeCk7IC8qIGFkZCBib3VuZGFyeSBzeW1ib2xzICovXG4gICAgICAgIGZvciAobGV0IGkgPSB0aGlzLl9vcHRpb25zLm9yZGVyOyBpIDwgdG9rZW5zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgY29udGV4dCA9IHRva2Vucy5zbGljZShpIC0gdGhpcy5fb3B0aW9ucy5vcmRlciwgaSk7XG4gICAgICAgICAgICBsZXQgZXZlbnQgPSB0b2tlbnNbaV07XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNvbnRleHQubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgc3ViY29udGV4dCA9IGNvbnRleHQuc2xpY2Uoaik7XG4gICAgICAgICAgICAgICAgdGhpcy5fb2JzZXJ2ZUV2ZW50KHN1YmNvbnRleHQsIGV2ZW50KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBnZXRTdGF0cygpIHtcbiAgICAgICAgbGV0IHBhcnRzID0gW107XG4gICAgICAgIGxldCBwcmlvckNvdW50ID0gT2JqZWN0LmtleXModGhpcy5fcHJpb3JWYWx1ZXMpLmxlbmd0aDtcbiAgICAgICAgcHJpb3JDb3VudC0tOyAvLyBib3VuZGFyeVxuICAgICAgICBwYXJ0cy5wdXNoKFwiZGlzdGluY3Qgc2FtcGxlczogXCIgKyBwcmlvckNvdW50KTtcbiAgICAgICAgbGV0IGRhdGFDb3VudCA9IE9iamVjdC5rZXlzKHRoaXMuX2RhdGEpLmxlbmd0aDtcbiAgICAgICAgbGV0IGV2ZW50Q291bnQgPSAwO1xuICAgICAgICBmb3IgKGxldCBwIGluIHRoaXMuX2RhdGEpIHtcbiAgICAgICAgICAgIGV2ZW50Q291bnQgKz0gT2JqZWN0LmtleXModGhpcy5fZGF0YVtwXSkubGVuZ3RoO1xuICAgICAgICB9XG4gICAgICAgIHBhcnRzLnB1c2goXCJkaWN0aW9uYXJ5IHNpemUgKGNvbnRleHRzKTogXCIgKyBkYXRhQ291bnQpO1xuICAgICAgICBwYXJ0cy5wdXNoKFwiZGljdGlvbmFyeSBzaXplIChldmVudHMpOiBcIiArIGV2ZW50Q291bnQpO1xuICAgICAgICByZXR1cm4gcGFydHMuam9pbihcIiwgXCIpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ31cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nW119XG4gICAgICovXG4gICAgX3NwbGl0KHN0cikge1xuICAgICAgICByZXR1cm4gc3RyLnNwbGl0KHRoaXMuX29wdGlvbnMud29yZHMgPyAvXFxzKy8gOiBcIlwiKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtzdHJpbmdbXX1cbiAgICAgKiBAcmV0dXJucyB7c3RyaW5nfVxuICAgICAqL1xuICAgIF9qb2luKGFycikge1xuICAgICAgICByZXR1cm4gYXJyLmpvaW4odGhpcy5fb3B0aW9ucy53b3JkcyA/IFwiIFwiIDogXCJcIik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119IGNvbnRleHRcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRcbiAgICAgKi9cbiAgICBfb2JzZXJ2ZUV2ZW50KGNvbnRleHQsIGV2ZW50KSB7XG4gICAgICAgIGxldCBrZXkgPSB0aGlzLl9qb2luKGNvbnRleHQpO1xuICAgICAgICBpZiAoIShrZXkgaW4gdGhpcy5fZGF0YSkpIHtcbiAgICAgICAgICAgIHRoaXMuX2RhdGFba2V5XSA9IHt9O1xuICAgICAgICB9XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5fZGF0YVtrZXldO1xuICAgICAgICBpZiAoIShldmVudCBpbiBkYXRhKSkge1xuICAgICAgICAgICAgZGF0YVtldmVudF0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIGRhdGFbZXZlbnRdKys7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7c3RyaW5nW119XG4gICAgICogQHJldHVybnMge3N0cmluZ31cbiAgICAgKi9cbiAgICBfc2FtcGxlKGNvbnRleHQpIHtcbiAgICAgICAgY29udGV4dCA9IHRoaXMuX2JhY2tvZmYoY29udGV4dCk7XG4gICAgICAgIGxldCBrZXkgPSB0aGlzLl9qb2luKGNvbnRleHQpO1xuICAgICAgICBsZXQgZGF0YSA9IHRoaXMuX2RhdGFba2V5XTtcbiAgICAgICAgbGV0IGF2YWlsYWJsZSA9IHt9O1xuICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy5wcmlvcikge1xuICAgICAgICAgICAgZm9yIChsZXQgZXZlbnQgaW4gdGhpcy5fcHJpb3JWYWx1ZXMpIHtcbiAgICAgICAgICAgICAgICBhdmFpbGFibGVbZXZlbnRdID0gdGhpcy5fcHJpb3JWYWx1ZXNbZXZlbnRdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgZXZlbnQgaW4gZGF0YSkge1xuICAgICAgICAgICAgICAgIGF2YWlsYWJsZVtldmVudF0gKz0gZGF0YVtldmVudF07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhdmFpbGFibGUgPSBkYXRhO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBSTkcuZ2V0V2VpZ2h0ZWRWYWx1ZShhdmFpbGFibGUpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge3N0cmluZ1tdfVxuICAgICAqIEByZXR1cm5zIHtzdHJpbmdbXX1cbiAgICAgKi9cbiAgICBfYmFja29mZihjb250ZXh0KSB7XG4gICAgICAgIGlmIChjb250ZXh0Lmxlbmd0aCA+IHRoaXMuX29wdGlvbnMub3JkZXIpIHtcbiAgICAgICAgICAgIGNvbnRleHQgPSBjb250ZXh0LnNsaWNlKC10aGlzLl9vcHRpb25zLm9yZGVyKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIGlmIChjb250ZXh0Lmxlbmd0aCA8IHRoaXMuX29wdGlvbnMub3JkZXIpIHtcbiAgICAgICAgICAgIGNvbnRleHQgPSB0aGlzLl9wcmVmaXguc2xpY2UoMCwgdGhpcy5fb3B0aW9ucy5vcmRlciAtIGNvbnRleHQubGVuZ3RoKS5jb25jYXQoY29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgICAgd2hpbGUgKCEodGhpcy5fam9pbihjb250ZXh0KSBpbiB0aGlzLl9kYXRhKSAmJiBjb250ZXh0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnRleHQgPSBjb250ZXh0LnNsaWNlKDEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb250ZXh0O1xuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIEV2ZW50UXVldWUge1xuICAgIC8qKlxuICAgICAqIEBjbGFzcyBHZW5lcmljIGV2ZW50IHF1ZXVlOiBzdG9yZXMgZXZlbnRzIGFuZCByZXRyaWV2ZXMgdGhlbSBiYXNlZCBvbiB0aGVpciB0aW1lXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHRoaXMuX3RpbWUgPSAwO1xuICAgICAgICB0aGlzLl9ldmVudHMgPSBbXTtcbiAgICAgICAgdGhpcy5fZXZlbnRUaW1lcyA9IFtdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB7bnVtYmVyfSBFbGFwc2VkIHRpbWVcbiAgICAgKi9cbiAgICBnZXRUaW1lKCkgeyByZXR1cm4gdGhpcy5fdGltZTsgfVxuICAgIC8qKlxuICAgICAqIENsZWFyIGFsbCBzY2hlZHVsZWQgZXZlbnRzXG4gICAgICovXG4gICAgY2xlYXIoKSB7XG4gICAgICAgIHRoaXMuX2V2ZW50cyA9IFtdO1xuICAgICAgICB0aGlzLl9ldmVudFRpbWVzID0gW107XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gez99IGV2ZW50XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHRpbWVcbiAgICAgKi9cbiAgICBhZGQoZXZlbnQsIHRpbWUpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fZXZlbnRzLmxlbmd0aDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9ldmVudFRpbWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBpZiAodGhpcy5fZXZlbnRUaW1lc1tpXSA+IHRpbWUpIHtcbiAgICAgICAgICAgICAgICBpbmRleCA9IGk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fZXZlbnRzLnNwbGljZShpbmRleCwgMCwgZXZlbnQpO1xuICAgICAgICB0aGlzLl9ldmVudFRpbWVzLnNwbGljZShpbmRleCwgMCwgdGltZSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIExvY2F0ZXMgdGhlIG5lYXJlc3QgZXZlbnQsIGFkdmFuY2VzIHRpbWUgaWYgbmVjZXNzYXJ5LiBSZXR1cm5zIHRoYXQgZXZlbnQgYW5kIHJlbW92ZXMgaXQgZnJvbSB0aGUgcXVldWUuXG4gICAgICogQHJldHVybnMgez8gfHwgbnVsbH0gVGhlIGV2ZW50IHByZXZpb3VzbHkgYWRkZWQgYnkgYWRkRXZlbnQsIG51bGwgaWYgbm8gZXZlbnQgYXZhaWxhYmxlXG4gICAgICovXG4gICAgZ2V0KCkge1xuICAgICAgICBpZiAoIXRoaXMuX2V2ZW50cy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0aW1lID0gdGhpcy5fZXZlbnRUaW1lcy5zcGxpY2UoMCwgMSlbMF07XG4gICAgICAgIGlmICh0aW1lID4gMCkgeyAvKiBhZHZhbmNlICovXG4gICAgICAgICAgICB0aGlzLl90aW1lICs9IHRpbWU7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2V2ZW50VGltZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9ldmVudFRpbWVzW2ldIC09IHRpbWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50cy5zcGxpY2UoMCwgMSlbMF07XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgdGltZSBhc3NvY2lhdGVkIHdpdGggdGhlIGdpdmVuIGV2ZW50XG4gICAgICogQHBhcmFtIHs/fSBldmVudFxuICAgICAqIEByZXR1cm5zIHtudW1iZXJ9IHRpbWVcbiAgICAgKi9cbiAgICBnZXRFdmVudFRpbWUoZXZlbnQpIHtcbiAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5fZXZlbnRzLmluZGV4T2YoZXZlbnQpO1xuICAgICAgICBpZiAoaW5kZXggPT0gLTEpIHtcbiAgICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2V2ZW50VGltZXNbaW5kZXhdO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYW4gZXZlbnQgZnJvbSB0aGUgcXVldWVcbiAgICAgKiBAcGFyYW0gez99IGV2ZW50XG4gICAgICogQHJldHVybnMge2Jvb2x9IHN1Y2Nlc3M/XG4gICAgICovXG4gICAgcmVtb3ZlKGV2ZW50KSB7XG4gICAgICAgIGxldCBpbmRleCA9IHRoaXMuX2V2ZW50cy5pbmRleE9mKGV2ZW50KTtcbiAgICAgICAgaWYgKGluZGV4ID09IC0xKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fcmVtb3ZlKGluZGV4KTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIDtcbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYW4gZXZlbnQgZnJvbSB0aGUgcXVldWVcbiAgICAgKiBAcGFyYW0ge2ludH0gaW5kZXhcbiAgICAgKi9cbiAgICBfcmVtb3ZlKGluZGV4KSB7XG4gICAgICAgIHRoaXMuX2V2ZW50cy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB0aGlzLl9ldmVudFRpbWVzLnNwbGljZShpbmRleCwgMSk7XG4gICAgfVxuICAgIDtcbn1cbiIsImltcG9ydCBFdmVudFF1ZXVlIGZyb20gXCIuLi9ldmVudHF1ZXVlLmpzXCI7XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTY2hlZHVsZXIge1xuICAgIC8qKlxuICAgICAqIEBjbGFzcyBBYnN0cmFjdCBzY2hlZHVsZXJcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5fcXVldWUgPSBuZXcgRXZlbnRRdWV1ZSgpO1xuICAgICAgICB0aGlzLl9yZXBlYXQgPSBbXTtcbiAgICAgICAgdGhpcy5fY3VycmVudCA9IG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzZWUgUk9ULkV2ZW50UXVldWUjZ2V0VGltZVxuICAgICAqL1xuICAgIGdldFRpbWUoKSB7IHJldHVybiB0aGlzLl9xdWV1ZS5nZXRUaW1lKCk7IH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0gez99IGl0ZW1cbiAgICAgKiBAcGFyYW0ge2Jvb2x9IHJlcGVhdFxuICAgICAqL1xuICAgIGFkZChpdGVtLCByZXBlYXQpIHtcbiAgICAgICAgaWYgKHJlcGVhdCkge1xuICAgICAgICAgICAgdGhpcy5fcmVwZWF0LnB1c2goaXRlbSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgdGltZSB0aGUgZ2l2ZW4gaXRlbSBpcyBzY2hlZHVsZWQgZm9yXG4gICAgICogQHBhcmFtIHs/fSBpdGVtXG4gICAgICogQHJldHVybnMge251bWJlcn0gdGltZVxuICAgICAqL1xuICAgIGdldFRpbWVPZihpdGVtKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9xdWV1ZS5nZXRFdmVudFRpbWUoaXRlbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENsZWFyIGFsbCBpdGVtc1xuICAgICAqL1xuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9xdWV1ZS5jbGVhcigpO1xuICAgICAgICB0aGlzLl9yZXBlYXQgPSBbXTtcbiAgICAgICAgdGhpcy5fY3VycmVudCA9IG51bGw7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBwcmV2aW91c2x5IGFkZGVkIGl0ZW1cbiAgICAgKiBAcGFyYW0gez99IGl0ZW1cbiAgICAgKiBAcmV0dXJucyB7Ym9vbH0gc3VjY2Vzc2Z1bD9cbiAgICAgKi9cbiAgICByZW1vdmUoaXRlbSkge1xuICAgICAgICBsZXQgcmVzdWx0ID0gdGhpcy5fcXVldWUucmVtb3ZlKGl0ZW0pO1xuICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9yZXBlYXQuaW5kZXhPZihpdGVtKTtcbiAgICAgICAgaWYgKGluZGV4ICE9IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9yZXBlYXQuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAodGhpcy5fY3VycmVudCA9PSBpdGVtKSB7XG4gICAgICAgICAgICB0aGlzLl9jdXJyZW50ID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTY2hlZHVsZSBuZXh0IGl0ZW1cbiAgICAgKiBAcmV0dXJucyB7P31cbiAgICAgKi9cbiAgICBuZXh0KCkge1xuICAgICAgICB0aGlzLl9jdXJyZW50ID0gdGhpcy5fcXVldWUuZ2V0KCk7XG4gICAgICAgIHJldHVybiB0aGlzLl9jdXJyZW50O1xuICAgIH1cbn1cbiIsImltcG9ydCBTY2hlZHVsZXIgZnJvbSBcIi4vc2NoZWR1bGVyLmpzXCI7XG4vKipcbiAqIEBjbGFzcyBTaW1wbGUgZmFpciBzY2hlZHVsZXIgKHJvdW5kLXJvYmluIHN0eWxlKVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaW1wbGUgZXh0ZW5kcyBTY2hlZHVsZXIge1xuICAgIGFkZChpdGVtLCByZXBlYXQpIHtcbiAgICAgICAgdGhpcy5fcXVldWUuYWRkKGl0ZW0sIDApO1xuICAgICAgICByZXR1cm4gc3VwZXIuYWRkKGl0ZW0sIHJlcGVhdCk7XG4gICAgfVxuICAgIG5leHQoKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50ICYmIHRoaXMuX3JlcGVhdC5pbmRleE9mKHRoaXMuX2N1cnJlbnQpICE9IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl9xdWV1ZS5hZGQodGhpcy5fY3VycmVudCwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLm5leHQoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgU2NoZWR1bGVyIGZyb20gXCIuL3NjaGVkdWxlci5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgU3BlZWQtYmFzZWQgc2NoZWR1bGVyXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNwZWVkIGV4dGVuZHMgU2NoZWR1bGVyIHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gaXRlbSBhbnl0aGluZyB3aXRoIFwiZ2V0U3BlZWRcIiBtZXRob2RcbiAgICAgKiBAcGFyYW0ge2Jvb2x9IHJlcGVhdFxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBbdGltZT0xL2l0ZW0uZ2V0U3BlZWQoKV1cbiAgICAgKiBAc2VlIFJPVC5TY2hlZHVsZXIjYWRkXG4gICAgICovXG4gICAgYWRkKGl0ZW0sIHJlcGVhdCwgdGltZSkge1xuICAgICAgICB0aGlzLl9xdWV1ZS5hZGQoaXRlbSwgdGltZSAhPT0gdW5kZWZpbmVkID8gdGltZSA6IDEgLyBpdGVtLmdldFNwZWVkKCkpO1xuICAgICAgICByZXR1cm4gc3VwZXIuYWRkKGl0ZW0sIHJlcGVhdCk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzZWUgUk9ULlNjaGVkdWxlciNuZXh0XG4gICAgICovXG4gICAgbmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnQgJiYgdGhpcy5fcmVwZWF0LmluZGV4T2YodGhpcy5fY3VycmVudCkgIT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXVlLmFkZCh0aGlzLl9jdXJyZW50LCAxIC8gdGhpcy5fY3VycmVudC5nZXRTcGVlZCgpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc3VwZXIubmV4dCgpO1xuICAgIH1cbn1cbiIsImltcG9ydCBTY2hlZHVsZXIgZnJvbSBcIi4vc2NoZWR1bGVyLmpzXCI7XG4vKipcbiAqIEBjbGFzcyBBY3Rpb24tYmFzZWQgc2NoZWR1bGVyXG4gKiBAYXVnbWVudHMgUk9ULlNjaGVkdWxlclxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBY3Rpb24gZXh0ZW5kcyBTY2hlZHVsZXIge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9kZWZhdWx0RHVyYXRpb24gPSAxOyAvKiBmb3IgbmV3bHkgYWRkZWQgKi9cbiAgICAgICAgdGhpcy5fZHVyYXRpb24gPSB0aGlzLl9kZWZhdWx0RHVyYXRpb247IC8qIGZvciB0aGlzLl9jdXJyZW50ICovXG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBpdGVtXG4gICAgICogQHBhcmFtIHtib29sfSByZXBlYXRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gW3RpbWU9MV1cbiAgICAgKiBAc2VlIFJPVC5TY2hlZHVsZXIjYWRkXG4gICAgICovXG4gICAgYWRkKGl0ZW0sIHJlcGVhdCwgdGltZSkge1xuICAgICAgICB0aGlzLl9xdWV1ZS5hZGQoaXRlbSwgdGltZSB8fCB0aGlzLl9kZWZhdWx0RHVyYXRpb24pO1xuICAgICAgICByZXR1cm4gc3VwZXIuYWRkKGl0ZW0sIHJlcGVhdCk7XG4gICAgfVxuICAgIGNsZWFyKCkge1xuICAgICAgICB0aGlzLl9kdXJhdGlvbiA9IHRoaXMuX2RlZmF1bHREdXJhdGlvbjtcbiAgICAgICAgcmV0dXJuIHN1cGVyLmNsZWFyKCk7XG4gICAgfVxuICAgIHJlbW92ZShpdGVtKSB7XG4gICAgICAgIGlmIChpdGVtID09IHRoaXMuX2N1cnJlbnQpIHtcbiAgICAgICAgICAgIHRoaXMuX2R1cmF0aW9uID0gdGhpcy5fZGVmYXVsdER1cmF0aW9uO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBzdXBlci5yZW1vdmUoaXRlbSk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBzZWUgUk9ULlNjaGVkdWxlciNuZXh0XG4gICAgICovXG4gICAgbmV4dCgpIHtcbiAgICAgICAgaWYgKHRoaXMuX2N1cnJlbnQgJiYgdGhpcy5fcmVwZWF0LmluZGV4T2YodGhpcy5fY3VycmVudCkgIT0gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuX3F1ZXVlLmFkZCh0aGlzLl9jdXJyZW50LCB0aGlzLl9kdXJhdGlvbiB8fCB0aGlzLl9kZWZhdWx0RHVyYXRpb24pO1xuICAgICAgICAgICAgdGhpcy5fZHVyYXRpb24gPSB0aGlzLl9kZWZhdWx0RHVyYXRpb247XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHN1cGVyLm5leHQoKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogU2V0IGR1cmF0aW9uIGZvciB0aGUgYWN0aXZlIGl0ZW1cbiAgICAgKi9cbiAgICBzZXREdXJhdGlvbih0aW1lKSB7XG4gICAgICAgIGlmICh0aGlzLl9jdXJyZW50KSB7XG4gICAgICAgICAgICB0aGlzLl9kdXJhdGlvbiA9IHRpbWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IFNpbXBsZSBmcm9tIFwiLi9zaW1wbGUuanNcIjtcbmltcG9ydCBTcGVlZCBmcm9tIFwiLi9zcGVlZC5qc1wiO1xuaW1wb3J0IEFjdGlvbiBmcm9tIFwiLi9hY3Rpb24uanNcIjtcbmV4cG9ydCBkZWZhdWx0IHsgU2ltcGxlLCBTcGVlZCwgQWN0aW9uIH07XG4iLCJpbXBvcnQgeyBESVJTIH0gZnJvbSBcIi4uL2NvbnN0YW50cy5qc1wiO1xuO1xuO1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRk9WIHtcbiAgICAvKipcbiAgICAgKiBAY2xhc3MgQWJzdHJhY3QgRk9WIGFsZ29yaXRobVxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGxpZ2h0UGFzc2VzQ2FsbGJhY2sgRG9lcyB0aGUgbGlnaHQgcGFzcyB0aHJvdWdoIHgseT9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXG4gICAgICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5PThdIDQvNi84XG4gICAgICovXG4gICAgY29uc3RydWN0b3IobGlnaHRQYXNzZXNDYWxsYmFjaywgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHRoaXMuX2xpZ2h0UGFzc2VzID0gbGlnaHRQYXNzZXNDYWxsYmFjaztcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oeyB0b3BvbG9neTogOCB9LCBvcHRpb25zKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmV0dXJuIGFsbCBuZWlnaGJvcnMgaW4gYSBjb25jZW50cmljIHJpbmdcbiAgICAgKiBAcGFyYW0ge2ludH0gY3ggY2VudGVyLXhcbiAgICAgKiBAcGFyYW0ge2ludH0gY3kgY2VudGVyLXlcbiAgICAgKiBAcGFyYW0ge2ludH0gciByYW5nZVxuICAgICAqL1xuICAgIF9nZXRDaXJjbGUoY3gsIGN5LCByKSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgbGV0IGRpcnMsIGNvdW50RmFjdG9yLCBzdGFydE9mZnNldDtcbiAgICAgICAgc3dpdGNoICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5KSB7XG4gICAgICAgICAgICBjYXNlIDQ6XG4gICAgICAgICAgICAgICAgY291bnRGYWN0b3IgPSAxO1xuICAgICAgICAgICAgICAgIHN0YXJ0T2Zmc2V0ID0gWzAsIDFdO1xuICAgICAgICAgICAgICAgIGRpcnMgPSBbXG4gICAgICAgICAgICAgICAgICAgIERJUlNbOF1bN10sXG4gICAgICAgICAgICAgICAgICAgIERJUlNbOF1bMV0sXG4gICAgICAgICAgICAgICAgICAgIERJUlNbOF1bM10sXG4gICAgICAgICAgICAgICAgICAgIERJUlNbOF1bNV1cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSA2OlxuICAgICAgICAgICAgICAgIGRpcnMgPSBESVJTWzZdO1xuICAgICAgICAgICAgICAgIGNvdW50RmFjdG9yID0gMTtcbiAgICAgICAgICAgICAgICBzdGFydE9mZnNldCA9IFstMSwgMV07XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgZGlycyA9IERJUlNbNF07XG4gICAgICAgICAgICAgICAgY291bnRGYWN0b3IgPSAyO1xuICAgICAgICAgICAgICAgIHN0YXJ0T2Zmc2V0ID0gWy0xLCAxXTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwiSW5jb3JyZWN0IHRvcG9sb2d5IGZvciBGT1YgY29tcHV0YXRpb25cIik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgICAgLyogc3RhcnRpbmcgbmVpZ2hib3IgKi9cbiAgICAgICAgbGV0IHggPSBjeCArIHN0YXJ0T2Zmc2V0WzBdICogcjtcbiAgICAgICAgbGV0IHkgPSBjeSArIHN0YXJ0T2Zmc2V0WzFdICogcjtcbiAgICAgICAgLyogY2lyY2xlICovXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGlycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCByICogY291bnRGYWN0b3I7IGorKykge1xuICAgICAgICAgICAgICAgIHJlc3VsdC5wdXNoKFt4LCB5XSk7XG4gICAgICAgICAgICAgICAgeCArPSBkaXJzW2ldWzBdO1xuICAgICAgICAgICAgICAgIHkgKz0gZGlyc1tpXVsxXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH1cbn1cbiIsImltcG9ydCBGT1YgZnJvbSBcIi4vZm92LmpzXCI7XG4vKipcbiAqIEBjbGFzcyBEaXNjcmV0ZSBzaGFkb3djYXN0aW5nIGFsZ29yaXRobS4gT2Jzb2xldGVkIGJ5IFByZWNpc2Ugc2hhZG93Y2FzdGluZy5cbiAqIEBhdWdtZW50cyBST1QuRk9WXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERpc2NyZXRlU2hhZG93Y2FzdGluZyBleHRlbmRzIEZPViB7XG4gICAgY29tcHV0ZSh4LCB5LCBSLCBjYWxsYmFjaykge1xuICAgICAgICAvKiB0aGlzIHBsYWNlIGlzIGFsd2F5cyB2aXNpYmxlICovXG4gICAgICAgIGNhbGxiYWNrKHgsIHksIDAsIDEpO1xuICAgICAgICAvKiBzdGFuZGluZyBpbiBhIGRhcmsgcGxhY2UuIEZJWE1FIGlzIHRoaXMgYSBnb29kIGlkZWE/ICAqL1xuICAgICAgICBpZiAoIXRoaXMuX2xpZ2h0UGFzc2VzKHgsIHkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLyogc3RhcnQgYW5kIGVuZCBhbmdsZXMgKi9cbiAgICAgICAgbGV0IERBVEEgPSBbXTtcbiAgICAgICAgbGV0IEEsIEIsIGN4LCBjeSwgYmxvY2tzO1xuICAgICAgICAvKiBhbmFseXplIHN1cnJvdW5kaW5nIGNlbGxzIGluIGNvbmNlbnRyaWMgcmluZ3MsIHN0YXJ0aW5nIGZyb20gdGhlIGNlbnRlciAqL1xuICAgICAgICBmb3IgKGxldCByID0gMTsgciA8PSBSOyByKyspIHtcbiAgICAgICAgICAgIGxldCBuZWlnaGJvcnMgPSB0aGlzLl9nZXRDaXJjbGUoeCwgeSwgcik7XG4gICAgICAgICAgICBsZXQgYW5nbGUgPSAzNjAgLyBuZWlnaGJvcnMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZWlnaGJvcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBjeCA9IG5laWdoYm9yc1tpXVswXTtcbiAgICAgICAgICAgICAgICBjeSA9IG5laWdoYm9yc1tpXVsxXTtcbiAgICAgICAgICAgICAgICBBID0gYW5nbGUgKiAoaSAtIDAuNSk7XG4gICAgICAgICAgICAgICAgQiA9IEEgKyBhbmdsZTtcbiAgICAgICAgICAgICAgICBibG9ja3MgPSAhdGhpcy5fbGlnaHRQYXNzZXMoY3gsIGN5KTtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fdmlzaWJsZUNvb3JkcyhNYXRoLmZsb29yKEEpLCBNYXRoLmNlaWwoQiksIGJsb2NrcywgREFUQSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soY3gsIGN5LCByLCAxKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKERBVEEubGVuZ3RoID09IDIgJiYgREFUQVswXSA9PSAwICYmIERBVEFbMV0gPT0gMzYwKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9IC8qIGN1dG9mZj8gKi9cbiAgICAgICAgICAgIH0gLyogZm9yIGFsbCBjZWxscyBpbiB0aGlzIHJpbmcgKi9cbiAgICAgICAgfSAvKiBmb3IgYWxsIHJpbmdzICovXG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7aW50fSBBIHN0YXJ0IGFuZ2xlXG4gICAgICogQHBhcmFtIHtpbnR9IEIgZW5kIGFuZ2xlXG4gICAgICogQHBhcmFtIHtib29sfSBibG9ja3MgRG9lcyBjdXJyZW50IGNlbGwgYmxvY2sgdmlzaWJpbGl0eT9cbiAgICAgKiBAcGFyYW0ge2ludFtdW119IERBVEEgc2hhZG93ZWQgYW5nbGUgcGFpcnNcbiAgICAgKi9cbiAgICBfdmlzaWJsZUNvb3JkcyhBLCBCLCBibG9ja3MsIERBVEEpIHtcbiAgICAgICAgaWYgKEEgPCAwKSB7XG4gICAgICAgICAgICBsZXQgdjEgPSB0aGlzLl92aXNpYmxlQ29vcmRzKDAsIEIsIGJsb2NrcywgREFUQSk7XG4gICAgICAgICAgICBsZXQgdjIgPSB0aGlzLl92aXNpYmxlQ29vcmRzKDM2MCArIEEsIDM2MCwgYmxvY2tzLCBEQVRBKTtcbiAgICAgICAgICAgIHJldHVybiB2MSB8fCB2MjtcbiAgICAgICAgfVxuICAgICAgICBsZXQgaW5kZXggPSAwO1xuICAgICAgICB3aGlsZSAoaW5kZXggPCBEQVRBLmxlbmd0aCAmJiBEQVRBW2luZGV4XSA8IEEpIHtcbiAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGluZGV4ID09IERBVEEubGVuZ3RoKSB7IC8qIGNvbXBsZXRlbHkgbmV3IHNoYWRvdyAqL1xuICAgICAgICAgICAgaWYgKGJsb2Nrcykge1xuICAgICAgICAgICAgICAgIERBVEEucHVzaChBLCBCKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGlmIChpbmRleCAlIDIpIHsgLyogdGhpcyBzaGFkb3cgc3RhcnRzIGluIGFuIGV4aXN0aW5nIHNoYWRvdywgb3Igd2l0aGluIGl0cyBlbmRpbmcgYm91bmRhcnkgKi9cbiAgICAgICAgICAgIHdoaWxlIChpbmRleCA8IERBVEEubGVuZ3RoICYmIERBVEFbaW5kZXhdIDwgQikge1xuICAgICAgICAgICAgICAgIGluZGV4Kys7XG4gICAgICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChjb3VudCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGJsb2Nrcykge1xuICAgICAgICAgICAgICAgIGlmIChjb3VudCAlIDIpIHtcbiAgICAgICAgICAgICAgICAgICAgREFUQS5zcGxpY2UoaW5kZXggLSBjb3VudCwgY291bnQsIEIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgREFUQS5zcGxpY2UoaW5kZXggLSBjb3VudCwgY291bnQpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgeyAvKiB0aGlzIHNoYWRvdyBzdGFydHMgb3V0c2lkZSBhbiBleGlzdGluZyBzaGFkb3csIG9yIHdpdGhpbiBhIHN0YXJ0aW5nIGJvdW5kYXJ5ICovXG4gICAgICAgICAgICB3aGlsZSAoaW5kZXggPCBEQVRBLmxlbmd0aCAmJiBEQVRBW2luZGV4XSA8IEIpIHtcbiAgICAgICAgICAgICAgICBpbmRleCsrO1xuICAgICAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKiB2aXNpYmxlIHdoZW4gb3V0c2lkZSBhbiBleGlzdGluZyBzaGFkb3csIG9yIHdoZW4gb3ZlcmxhcHBpbmcgKi9cbiAgICAgICAgICAgIGlmIChBID09IERBVEFbaW5kZXggLSBjb3VudF0gJiYgY291bnQgPT0gMSkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChibG9ja3MpIHtcbiAgICAgICAgICAgICAgICBpZiAoY291bnQgJSAyKSB7XG4gICAgICAgICAgICAgICAgICAgIERBVEEuc3BsaWNlKGluZGV4IC0gY291bnQsIGNvdW50LCBBKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIERBVEEuc3BsaWNlKGluZGV4IC0gY291bnQsIGNvdW50LCBBLCBCKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCBGT1YgZnJvbSBcIi4vZm92LmpzXCI7XG4vKipcbiAqIEBjbGFzcyBQcmVjaXNlIHNoYWRvd2Nhc3RpbmcgYWxnb3JpdGhtXG4gKiBAYXVnbWVudHMgUk9ULkZPVlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQcmVjaXNlU2hhZG93Y2FzdGluZyBleHRlbmRzIEZPViB7XG4gICAgY29tcHV0ZSh4LCB5LCBSLCBjYWxsYmFjaykge1xuICAgICAgICAvKiB0aGlzIHBsYWNlIGlzIGFsd2F5cyB2aXNpYmxlICovXG4gICAgICAgIGNhbGxiYWNrKHgsIHksIDAsIDEpO1xuICAgICAgICAvKiBzdGFuZGluZyBpbiBhIGRhcmsgcGxhY2UuIEZJWE1FIGlzIHRoaXMgYSBnb29kIGlkZWE/ICAqL1xuICAgICAgICBpZiAoIXRoaXMuX2xpZ2h0UGFzc2VzKHgsIHkpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLyogbGlzdCBvZiBhbGwgc2hhZG93cyAqL1xuICAgICAgICBsZXQgU0hBRE9XUyA9IFtdO1xuICAgICAgICBsZXQgY3gsIGN5LCBibG9ja3MsIEExLCBBMiwgdmlzaWJpbGl0eTtcbiAgICAgICAgLyogYW5hbHl6ZSBzdXJyb3VuZGluZyBjZWxscyBpbiBjb25jZW50cmljIHJpbmdzLCBzdGFydGluZyBmcm9tIHRoZSBjZW50ZXIgKi9cbiAgICAgICAgZm9yIChsZXQgciA9IDE7IHIgPD0gUjsgcisrKSB7XG4gICAgICAgICAgICBsZXQgbmVpZ2hib3JzID0gdGhpcy5fZ2V0Q2lyY2xlKHgsIHksIHIpO1xuICAgICAgICAgICAgbGV0IG5laWdoYm9yQ291bnQgPSBuZWlnaGJvcnMubGVuZ3RoO1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuZWlnaGJvckNvdW50OyBpKyspIHtcbiAgICAgICAgICAgICAgICBjeCA9IG5laWdoYm9yc1tpXVswXTtcbiAgICAgICAgICAgICAgICBjeSA9IG5laWdoYm9yc1tpXVsxXTtcbiAgICAgICAgICAgICAgICAvKiBzaGlmdCBoYWxmLWFuLWFuZ2xlIGJhY2t3YXJkcyB0byBtYWludGFpbiBjb25zaXN0ZW5jeSBvZiAwLXRoIGNlbGxzICovXG4gICAgICAgICAgICAgICAgQTEgPSBbaSA/IDIgKiBpIC0gMSA6IDIgKiBuZWlnaGJvckNvdW50IC0gMSwgMiAqIG5laWdoYm9yQ291bnRdO1xuICAgICAgICAgICAgICAgIEEyID0gWzIgKiBpICsgMSwgMiAqIG5laWdoYm9yQ291bnRdO1xuICAgICAgICAgICAgICAgIGJsb2NrcyA9ICF0aGlzLl9saWdodFBhc3NlcyhjeCwgY3kpO1xuICAgICAgICAgICAgICAgIHZpc2liaWxpdHkgPSB0aGlzLl9jaGVja1Zpc2liaWxpdHkoQTEsIEEyLCBibG9ja3MsIFNIQURPV1MpO1xuICAgICAgICAgICAgICAgIGlmICh2aXNpYmlsaXR5KSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGN4LCBjeSwgciwgdmlzaWJpbGl0eSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChTSEFET1dTLmxlbmd0aCA9PSAyICYmIFNIQURPV1NbMF1bMF0gPT0gMCAmJiBTSEFET1dTWzFdWzBdID09IFNIQURPV1NbMV1bMV0pIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgICAgIH0gLyogY3V0b2ZmPyAqL1xuICAgICAgICAgICAgfSAvKiBmb3IgYWxsIGNlbGxzIGluIHRoaXMgcmluZyAqL1xuICAgICAgICB9IC8qIGZvciBhbGwgcmluZ3MgKi9cbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtpbnRbMl19IEExIGFyYyBzdGFydFxuICAgICAqIEBwYXJhbSB7aW50WzJdfSBBMiBhcmMgZW5kXG4gICAgICogQHBhcmFtIHtib29sfSBibG9ja3MgRG9lcyBjdXJyZW50IGFyYyBibG9jayB2aXNpYmlsaXR5P1xuICAgICAqIEBwYXJhbSB7aW50W11bXX0gU0hBRE9XUyBsaXN0IG9mIGFjdGl2ZSBzaGFkb3dzXG4gICAgICovXG4gICAgX2NoZWNrVmlzaWJpbGl0eShBMSwgQTIsIGJsb2NrcywgU0hBRE9XUykge1xuICAgICAgICBpZiAoQTFbMF0gPiBBMlswXSkgeyAvKiBzcGxpdCBpbnRvIHR3byBzdWItYXJjcyAqL1xuICAgICAgICAgICAgbGV0IHYxID0gdGhpcy5fY2hlY2tWaXNpYmlsaXR5KEExLCBbQTFbMV0sIEExWzFdXSwgYmxvY2tzLCBTSEFET1dTKTtcbiAgICAgICAgICAgIGxldCB2MiA9IHRoaXMuX2NoZWNrVmlzaWJpbGl0eShbMCwgMV0sIEEyLCBibG9ja3MsIFNIQURPV1MpO1xuICAgICAgICAgICAgcmV0dXJuICh2MSArIHYyKSAvIDI7XG4gICAgICAgIH1cbiAgICAgICAgLyogaW5kZXgxOiBmaXJzdCBzaGFkb3cgPj0gQTEgKi9cbiAgICAgICAgbGV0IGluZGV4MSA9IDAsIGVkZ2UxID0gZmFsc2U7XG4gICAgICAgIHdoaWxlIChpbmRleDEgPCBTSEFET1dTLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IG9sZCA9IFNIQURPV1NbaW5kZXgxXTtcbiAgICAgICAgICAgIGxldCBkaWZmID0gb2xkWzBdICogQTFbMV0gLSBBMVswXSAqIG9sZFsxXTtcbiAgICAgICAgICAgIGlmIChkaWZmID49IDApIHsgLyogb2xkID49IEExICovXG4gICAgICAgICAgICAgICAgaWYgKGRpZmYgPT0gMCAmJiAhKGluZGV4MSAlIDIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGVkZ2UxID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpbmRleDErKztcbiAgICAgICAgfVxuICAgICAgICAvKiBpbmRleDI6IGxhc3Qgc2hhZG93IDw9IEEyICovXG4gICAgICAgIGxldCBpbmRleDIgPSBTSEFET1dTLmxlbmd0aCwgZWRnZTIgPSBmYWxzZTtcbiAgICAgICAgd2hpbGUgKGluZGV4Mi0tKSB7XG4gICAgICAgICAgICBsZXQgb2xkID0gU0hBRE9XU1tpbmRleDJdO1xuICAgICAgICAgICAgbGV0IGRpZmYgPSBBMlswXSAqIG9sZFsxXSAtIG9sZFswXSAqIEEyWzFdO1xuICAgICAgICAgICAgaWYgKGRpZmYgPj0gMCkgeyAvKiBvbGQgPD0gQTIgKi9cbiAgICAgICAgICAgICAgICBpZiAoZGlmZiA9PSAwICYmIChpbmRleDIgJSAyKSkge1xuICAgICAgICAgICAgICAgICAgICBlZGdlMiA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCB2aXNpYmxlID0gdHJ1ZTtcbiAgICAgICAgaWYgKGluZGV4MSA9PSBpbmRleDIgJiYgKGVkZ2UxIHx8IGVkZ2UyKSkgeyAvKiBzdWJzZXQgb2YgZXhpc3Rpbmcgc2hhZG93LCBvbmUgb2YgdGhlIGVkZ2VzIG1hdGNoICovXG4gICAgICAgICAgICB2aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZWRnZTEgJiYgZWRnZTIgJiYgaW5kZXgxICsgMSA9PSBpbmRleDIgJiYgKGluZGV4MiAlIDIpKSB7IC8qIGNvbXBsZXRlbHkgZXF1aXZhbGVudCB3aXRoIGV4aXN0aW5nIHNoYWRvdyAqL1xuICAgICAgICAgICAgdmlzaWJsZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKGluZGV4MSA+IGluZGV4MiAmJiAoaW5kZXgxICUgMikpIHsgLyogc3Vic2V0IG9mIGV4aXN0aW5nIHNoYWRvdywgbm90IHRvdWNoaW5nICovXG4gICAgICAgICAgICB2aXNpYmxlID0gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCF2aXNpYmxlKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfSAvKiBmYXN0IGNhc2U6IG5vdCB2aXNpYmxlICovXG4gICAgICAgIGxldCB2aXNpYmxlTGVuZ3RoO1xuICAgICAgICAvKiBjb21wdXRlIHRoZSBsZW5ndGggb2YgdmlzaWJsZSBhcmMsIGFkanVzdCBsaXN0IG9mIHNoYWRvd3MgKGlmIGJsb2NraW5nKSAqL1xuICAgICAgICBsZXQgcmVtb3ZlID0gaW5kZXgyIC0gaW5kZXgxICsgMTtcbiAgICAgICAgaWYgKHJlbW92ZSAlIDIpIHtcbiAgICAgICAgICAgIGlmIChpbmRleDEgJSAyKSB7IC8qIGZpcnN0IGVkZ2Ugd2l0aGluIGV4aXN0aW5nIHNoYWRvdywgc2Vjb25kIG91dHNpZGUgKi9cbiAgICAgICAgICAgICAgICBsZXQgUCA9IFNIQURPV1NbaW5kZXgxXTtcbiAgICAgICAgICAgICAgICB2aXNpYmxlTGVuZ3RoID0gKEEyWzBdICogUFsxXSAtIFBbMF0gKiBBMlsxXSkgLyAoUFsxXSAqIEEyWzFdKTtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlLCBBMik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IC8qIHNlY29uZCBlZGdlIHdpdGhpbiBleGlzdGluZyBzaGFkb3csIGZpcnN0IG91dHNpZGUgKi9cbiAgICAgICAgICAgICAgICBsZXQgUCA9IFNIQURPV1NbaW5kZXgyXTtcbiAgICAgICAgICAgICAgICB2aXNpYmxlTGVuZ3RoID0gKFBbMF0gKiBBMVsxXSAtIEExWzBdICogUFsxXSkgLyAoQTFbMV0gKiBQWzFdKTtcbiAgICAgICAgICAgICAgICBpZiAoYmxvY2tzKSB7XG4gICAgICAgICAgICAgICAgICAgIFNIQURPV1Muc3BsaWNlKGluZGV4MSwgcmVtb3ZlLCBBMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaWYgKGluZGV4MSAlIDIpIHsgLyogYm90aCBlZGdlcyB3aXRoaW4gZXhpc3Rpbmcgc2hhZG93cyAqL1xuICAgICAgICAgICAgICAgIGxldCBQMSA9IFNIQURPV1NbaW5kZXgxXTtcbiAgICAgICAgICAgICAgICBsZXQgUDIgPSBTSEFET1dTW2luZGV4Ml07XG4gICAgICAgICAgICAgICAgdmlzaWJsZUxlbmd0aCA9IChQMlswXSAqIFAxWzFdIC0gUDFbMF0gKiBQMlsxXSkgLyAoUDFbMV0gKiBQMlsxXSk7XG4gICAgICAgICAgICAgICAgaWYgKGJsb2Nrcykge1xuICAgICAgICAgICAgICAgICAgICBTSEFET1dTLnNwbGljZShpbmRleDEsIHJlbW92ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IC8qIGJvdGggZWRnZXMgb3V0c2lkZSBleGlzdGluZyBzaGFkb3dzICovXG4gICAgICAgICAgICAgICAgaWYgKGJsb2Nrcykge1xuICAgICAgICAgICAgICAgICAgICBTSEFET1dTLnNwbGljZShpbmRleDEsIHJlbW92ZSwgQTEsIEEyKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcmV0dXJuIDE7IC8qIHdob2xlIGFyYyB2aXNpYmxlISAqL1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBhcmNMZW5ndGggPSAoQTJbMF0gKiBBMVsxXSAtIEExWzBdICogQTJbMV0pIC8gKEExWzFdICogQTJbMV0pO1xuICAgICAgICByZXR1cm4gdmlzaWJsZUxlbmd0aCAvIGFyY0xlbmd0aDtcbiAgICB9XG59XG4iLCJpbXBvcnQgRk9WIGZyb20gXCIuL2Zvdi5qc1wiO1xuLyoqIE9jdGFudHMgdXNlZCBmb3IgdHJhbnNsYXRpbmcgcmVjdXJzaXZlIHNoYWRvd2Nhc3Rpbmcgb2Zmc2V0cyAqL1xuY29uc3QgT0NUQU5UUyA9IFtcbiAgICBbLTEsIDAsIDAsIDFdLFxuICAgIFswLCAtMSwgMSwgMF0sXG4gICAgWzAsIC0xLCAtMSwgMF0sXG4gICAgWy0xLCAwLCAwLCAtMV0sXG4gICAgWzEsIDAsIDAsIC0xXSxcbiAgICBbMCwgMSwgLTEsIDBdLFxuICAgIFswLCAxLCAxLCAwXSxcbiAgICBbMSwgMCwgMCwgMV1cbl07XG4vKipcbiAqIEBjbGFzcyBSZWN1cnNpdmUgc2hhZG93Y2FzdGluZyBhbGdvcml0aG1cbiAqIEN1cnJlbnRseSBvbmx5IHN1cHBvcnRzIDQvOCB0b3BvbG9naWVzLCBub3QgaGV4YWdvbmFsLlxuICogQmFzZWQgb24gUGV0ZXIgSGFya2lucycgaW1wbGVtZW50YXRpb24gb2YgQmrDtnJuIEJlcmdzdHLDtm0ncyBhbGdvcml0aG0gZGVzY3JpYmVkIGhlcmU6IGh0dHA6Ly93d3cucm9ndWViYXNpbi5jb20vaW5kZXgucGhwP3RpdGxlPUZPVl91c2luZ19yZWN1cnNpdmVfc2hhZG93Y2FzdGluZ1xuICogQGF1Z21lbnRzIFJPVC5GT1ZcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVjdXJzaXZlU2hhZG93Y2FzdGluZyBleHRlbmRzIEZPViB7XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSB2aXNpYmlsaXR5IGZvciBhIDM2MC1kZWdyZWUgY2lyY2xlXG4gICAgICogQHBhcmFtIHtpbnR9IHhcbiAgICAgKiBAcGFyYW0ge2ludH0geVxuICAgICAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqL1xuICAgIGNvbXB1dGUoeCwgeSwgUiwgY2FsbGJhY2spIHtcbiAgICAgICAgLy9Zb3UgY2FuIGFsd2F5cyBzZWUgeW91ciBvd24gdGlsZVxuICAgICAgICBjYWxsYmFjayh4LCB5LCAwLCAxKTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBPQ1RBTlRTLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgT0NUQU5UU1tpXSwgUiwgY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGUgdmlzaWJpbGl0eSBmb3IgYSAxODAtZGVncmVlIGFyY1xuICAgICAqIEBwYXJhbSB7aW50fSB4XG4gICAgICogQHBhcmFtIHtpbnR9IHlcbiAgICAgKiBAcGFyYW0ge2ludH0gUiBNYXhpbXVtIHZpc2liaWxpdHkgcmFkaXVzXG4gICAgICogQHBhcmFtIHtpbnR9IGRpciBEaXJlY3Rpb24gdG8gbG9vayBpbiAoZXhwcmVzc2VkIGluIGEgUk9ULkRJUlMgdmFsdWUpO1xuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrXG4gICAgICovXG4gICAgY29tcHV0ZTE4MCh4LCB5LCBSLCBkaXIsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vWW91IGNhbiBhbHdheXMgc2VlIHlvdXIgb3duIHRpbGVcbiAgICAgICAgY2FsbGJhY2soeCwgeSwgMCwgMSk7XG4gICAgICAgIGxldCBwcmV2aW91c09jdGFudCA9IChkaXIgLSAxICsgOCkgJSA4OyAvL05lZWQgdG8gcmV0cmlldmUgdGhlIHByZXZpb3VzIG9jdGFudCB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXG4gICAgICAgIGxldCBuZXh0UHJldmlvdXNPY3RhbnQgPSAoZGlyIC0gMiArIDgpICUgODsgLy9OZWVkIHRvIHJldHJpZXZlIHRoZSBwcmV2aW91cyB0d28gb2N0YW50cyB0byByZW5kZXIgYSBmdWxsIDE4MCBkZWdyZWVzXG4gICAgICAgIGxldCBuZXh0T2N0YW50ID0gKGRpciArIDEgKyA4KSAlIDg7IC8vTmVlZCB0byBncmFiIHRvIG5leHQgb2N0YW50IHRvIHJlbmRlciBhIGZ1bGwgMTgwIGRlZ3JlZXNcbiAgICAgICAgdGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIE9DVEFOVFNbbmV4dFByZXZpb3VzT2N0YW50XSwgUiwgY2FsbGJhY2spO1xuICAgICAgICB0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgT0NUQU5UU1twcmV2aW91c09jdGFudF0sIFIsIGNhbGxiYWNrKTtcbiAgICAgICAgdGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIE9DVEFOVFNbZGlyXSwgUiwgY2FsbGJhY2spO1xuICAgICAgICB0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgT0NUQU5UU1tuZXh0T2N0YW50XSwgUiwgY2FsbGJhY2spO1xuICAgIH1cbiAgICA7XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSB2aXNpYmlsaXR5IGZvciBhIDkwLWRlZ3JlZSBhcmNcbiAgICAgKiBAcGFyYW0ge2ludH0geFxuICAgICAqIEBwYXJhbSB7aW50fSB5XG4gICAgICogQHBhcmFtIHtpbnR9IFIgTWF4aW11bSB2aXNpYmlsaXR5IHJhZGl1c1xuICAgICAqIEBwYXJhbSB7aW50fSBkaXIgRGlyZWN0aW9uIHRvIGxvb2sgaW4gKGV4cHJlc3NlZCBpbiBhIFJPVC5ESVJTIHZhbHVlKTtcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqL1xuICAgIGNvbXB1dGU5MCh4LCB5LCBSLCBkaXIsIGNhbGxiYWNrKSB7XG4gICAgICAgIC8vWW91IGNhbiBhbHdheXMgc2VlIHlvdXIgb3duIHRpbGVcbiAgICAgICAgY2FsbGJhY2soeCwgeSwgMCwgMSk7XG4gICAgICAgIGxldCBwcmV2aW91c09jdGFudCA9IChkaXIgLSAxICsgOCkgJSA4OyAvL05lZWQgdG8gcmV0cmlldmUgdGhlIHByZXZpb3VzIG9jdGFudCB0byByZW5kZXIgYSBmdWxsIDkwIGRlZ3JlZXNcbiAgICAgICAgdGhpcy5fcmVuZGVyT2N0YW50KHgsIHksIE9DVEFOVFNbZGlyXSwgUiwgY2FsbGJhY2spO1xuICAgICAgICB0aGlzLl9yZW5kZXJPY3RhbnQoeCwgeSwgT0NUQU5UU1twcmV2aW91c09jdGFudF0sIFIsIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUmVuZGVyIG9uZSBvY3RhbnQgKDQ1LWRlZ3JlZSBhcmMpIG9mIHRoZSB2aWV3c2hlZFxuICAgICAqIEBwYXJhbSB7aW50fSB4XG4gICAgICogQHBhcmFtIHtpbnR9IHlcbiAgICAgKiBAcGFyYW0ge2ludH0gb2N0YW50IE9jdGFudCB0byBiZSByZW5kZXJlZFxuICAgICAqIEBwYXJhbSB7aW50fSBSIE1heGltdW0gdmlzaWJpbGl0eSByYWRpdXNcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFja1xuICAgICAqL1xuICAgIF9yZW5kZXJPY3RhbnQoeCwgeSwgb2N0YW50LCBSLCBjYWxsYmFjaykge1xuICAgICAgICAvL1JhZGl1cyBpbmNyZW1lbnRlZCBieSAxIHRvIHByb3ZpZGUgc2FtZSBjb3ZlcmFnZSBhcmVhIGFzIG90aGVyIHNoYWRvd2Nhc3RpbmcgcmFkaXVzZXNcbiAgICAgICAgdGhpcy5fY2FzdFZpc2liaWxpdHkoeCwgeSwgMSwgMS4wLCAwLjAsIFIgKyAxLCBvY3RhbnRbMF0sIG9jdGFudFsxXSwgb2N0YW50WzJdLCBvY3RhbnRbM10sIGNhbGxiYWNrKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQWN0dWFsbHkgY2FsY3VsYXRlcyB0aGUgdmlzaWJpbGl0eVxuICAgICAqIEBwYXJhbSB7aW50fSBzdGFydFggVGhlIHN0YXJ0aW5nIFggY29vcmRpbmF0ZVxuICAgICAqIEBwYXJhbSB7aW50fSBzdGFydFkgVGhlIHN0YXJ0aW5nIFkgY29vcmRpbmF0ZVxuICAgICAqIEBwYXJhbSB7aW50fSByb3cgVGhlIHJvdyB0byByZW5kZXJcbiAgICAgKiBAcGFyYW0ge2Zsb2F0fSB2aXNTbG9wZVN0YXJ0IFRoZSBzbG9wZSB0byBzdGFydCBhdFxuICAgICAqIEBwYXJhbSB7ZmxvYXR9IHZpc1Nsb3BlRW5kIFRoZSBzbG9wZSB0byBlbmQgYXRcbiAgICAgKiBAcGFyYW0ge2ludH0gcmFkaXVzIFRoZSByYWRpdXMgdG8gcmVhY2ggb3V0IHRvXG4gICAgICogQHBhcmFtIHtpbnR9IHh4XG4gICAgICogQHBhcmFtIHtpbnR9IHh5XG4gICAgICogQHBhcmFtIHtpbnR9IHl4XG4gICAgICogQHBhcmFtIHtpbnR9IHl5XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgVGhlIGNhbGxiYWNrIHRvIHVzZSB3aGVuIHdlIGhpdCBhIGJsb2NrIHRoYXQgaXMgdmlzaWJsZVxuICAgICAqL1xuICAgIF9jYXN0VmlzaWJpbGl0eShzdGFydFgsIHN0YXJ0WSwgcm93LCB2aXNTbG9wZVN0YXJ0LCB2aXNTbG9wZUVuZCwgcmFkaXVzLCB4eCwgeHksIHl4LCB5eSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHZpc1Nsb3BlU3RhcnQgPCB2aXNTbG9wZUVuZCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSByb3c7IGkgPD0gcmFkaXVzOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkeCA9IC1pIC0gMTtcbiAgICAgICAgICAgIGxldCBkeSA9IC1pO1xuICAgICAgICAgICAgbGV0IGJsb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIGxldCBuZXdTdGFydCA9IDA7XG4gICAgICAgICAgICAvLydSb3cnIGNvdWxkIGJlIGNvbHVtbiwgbmFtZXMgaGVyZSBhc3N1bWUgb2N0YW50IDAgYW5kIHdvdWxkIGJlIGZsaXBwZWQgZm9yIGhhbGYgdGhlIG9jdGFudHNcbiAgICAgICAgICAgIHdoaWxlIChkeCA8PSAwKSB7XG4gICAgICAgICAgICAgICAgZHggKz0gMTtcbiAgICAgICAgICAgICAgICAvL1RyYW5zbGF0ZSBmcm9tIHJlbGF0aXZlIGNvb3JkaW5hdGVzIHRvIG1hcCBjb29yZGluYXRlc1xuICAgICAgICAgICAgICAgIGxldCBtYXBYID0gc3RhcnRYICsgZHggKiB4eCArIGR5ICogeHk7XG4gICAgICAgICAgICAgICAgbGV0IG1hcFkgPSBzdGFydFkgKyBkeCAqIHl4ICsgZHkgKiB5eTtcbiAgICAgICAgICAgICAgICAvL1JhbmdlIG9mIHRoZSByb3dcbiAgICAgICAgICAgICAgICBsZXQgc2xvcGVTdGFydCA9IChkeCAtIDAuNSkgLyAoZHkgKyAwLjUpO1xuICAgICAgICAgICAgICAgIGxldCBzbG9wZUVuZCA9IChkeCArIDAuNSkgLyAoZHkgLSAwLjUpO1xuICAgICAgICAgICAgICAgIC8vSWdub3JlIGlmIG5vdCB5ZXQgYXQgbGVmdCBlZGdlIG9mIE9jdGFudFxuICAgICAgICAgICAgICAgIGlmIChzbG9wZUVuZCA+IHZpc1Nsb3BlU3RhcnQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8vRG9uZSBpZiBwYXN0IHJpZ2h0IGVkZ2VcbiAgICAgICAgICAgICAgICBpZiAoc2xvcGVTdGFydCA8IHZpc1Nsb3BlRW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAvL0lmIGl0J3MgaW4gcmFuZ2UsIGl0J3MgdmlzaWJsZVxuICAgICAgICAgICAgICAgIGlmICgoZHggKiBkeCArIGR5ICogZHkpIDwgKHJhZGl1cyAqIHJhZGl1cykpIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2sobWFwWCwgbWFwWSwgaSwgMSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmICghYmxvY2tlZCkge1xuICAgICAgICAgICAgICAgICAgICAvL0lmIHRpbGUgaXMgYSBibG9ja2luZyB0aWxlLCBjYXN0IGFyb3VuZCBpdFxuICAgICAgICAgICAgICAgICAgICBpZiAoIXRoaXMuX2xpZ2h0UGFzc2VzKG1hcFgsIG1hcFkpICYmIGkgPCByYWRpdXMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fY2FzdFZpc2liaWxpdHkoc3RhcnRYLCBzdGFydFksIGkgKyAxLCB2aXNTbG9wZVN0YXJ0LCBzbG9wZVN0YXJ0LCByYWRpdXMsIHh4LCB4eSwgeXgsIHl5LCBjYWxsYmFjayk7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdTdGFydCA9IHNsb3BlRW5kO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAvL0tlZXAgbmFycm93aW5nIGlmIHNjYW5uaW5nIGFjcm9zcyBhIGJsb2NrXG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy5fbGlnaHRQYXNzZXMobWFwWCwgbWFwWSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld1N0YXJ0ID0gc2xvcGVFbmQ7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAvL0Jsb2NrIGhhcyBlbmRlZFxuICAgICAgICAgICAgICAgICAgICBibG9ja2VkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIHZpc1Nsb3BlU3RhcnQgPSBuZXdTdGFydDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAoYmxvY2tlZCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IERpc2NyZXRlU2hhZG93Y2FzdGluZyBmcm9tIFwiLi9kaXNjcmV0ZS1zaGFkb3djYXN0aW5nLmpzXCI7XG5pbXBvcnQgUHJlY2lzZVNoYWRvd2Nhc3RpbmcgZnJvbSBcIi4vcHJlY2lzZS1zaGFkb3djYXN0aW5nLmpzXCI7XG5pbXBvcnQgUmVjdXJzaXZlU2hhZG93Y2FzdGluZyBmcm9tIFwiLi9yZWN1cnNpdmUtc2hhZG93Y2FzdGluZy5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgeyBEaXNjcmV0ZVNoYWRvd2Nhc3RpbmcsIFByZWNpc2VTaGFkb3djYXN0aW5nLCBSZWN1cnNpdmVTaGFkb3djYXN0aW5nIH07XG4iLCJpbXBvcnQgeyBERUZBVUxUX1dJRFRILCBERUZBVUxUX0hFSUdIVCB9IGZyb20gXCIuLi9jb25zdGFudHMuanNcIjtcbjtcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIE1hcCB7XG4gICAgLyoqXG4gICAgICogQGNsYXNzIEJhc2UgbWFwIGdlbmVyYXRvclxuICAgICAqIEBwYXJhbSB7aW50fSBbd2lkdGg9Uk9ULkRFRkFVTFRfV0lEVEhdXG4gICAgICogQHBhcmFtIHtpbnR9IFtoZWlnaHQ9Uk9ULkRFRkFVTFRfSEVJR0hUXVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHdpZHRoID0gREVGQVVMVF9XSURUSCwgaGVpZ2h0ID0gREVGQVVMVF9IRUlHSFQpIHtcbiAgICAgICAgdGhpcy5fd2lkdGggPSB3aWR0aDtcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gaGVpZ2h0O1xuICAgIH1cbiAgICA7XG4gICAgX2ZpbGxNYXAodmFsdWUpIHtcbiAgICAgICAgbGV0IG1hcCA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3dpZHRoOyBpKyspIHtcbiAgICAgICAgICAgIG1hcC5wdXNoKFtdKTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5faGVpZ2h0OyBqKyspIHtcbiAgICAgICAgICAgICAgICBtYXBbaV0ucHVzaCh2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG1hcDtcbiAgICB9XG59XG4iLCJpbXBvcnQgTWFwIGZyb20gXCIuL21hcC5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgU2ltcGxlIGVtcHR5IHJlY3Rhbmd1bGFyIHJvb21cbiAqIEBhdWdtZW50cyBST1QuTWFwXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFyZW5hIGV4dGVuZHMgTWFwIHtcbiAgICBjcmVhdGUoY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IHcgPSB0aGlzLl93aWR0aCAtIDE7XG4gICAgICAgIGxldCBoID0gdGhpcy5faGVpZ2h0IC0gMTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPD0gdzsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8PSBoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgZW1wdHkgPSAoaSAmJiBqICYmIGkgPCB3ICYmIGogPCBoKTtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhpLCBqLCBlbXB0eSA/IDAgOiAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgTWFwIGZyb20gXCIuL21hcC5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgRHVuZ2VvbiBtYXA6IGhhcyByb29tcyBhbmQgY29ycmlkb3JzXG4gKiBAYXVnbWVudHMgUk9ULk1hcFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEdW5nZW9uIGV4dGVuZHMgTWFwIHtcbiAgICBjb25zdHJ1Y3Rvcih3aWR0aCwgaGVpZ2h0KSB7XG4gICAgICAgIHN1cGVyKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB0aGlzLl9yb29tcyA9IFtdO1xuICAgICAgICB0aGlzLl9jb3JyaWRvcnMgPSBbXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGFsbCBnZW5lcmF0ZWQgcm9vbXNcbiAgICAgKiBAcmV0dXJucyB7Uk9ULk1hcC5GZWF0dXJlLlJvb21bXX1cbiAgICAgKi9cbiAgICBnZXRSb29tcygpIHsgcmV0dXJuIHRoaXMuX3Jvb21zOyB9XG4gICAgLyoqXG4gICAgICogR2V0IGFsbCBnZW5lcmF0ZWQgY29ycmlkb3JzXG4gICAgICogQHJldHVybnMge1JPVC5NYXAuRmVhdHVyZS5Db3JyaWRvcltdfVxuICAgICAqL1xuICAgIGdldENvcnJpZG9ycygpIHsgcmV0dXJuIHRoaXMuX2NvcnJpZG9yczsgfVxufVxuIiwiaW1wb3J0IFJORyBmcm9tIFwiLi4vcm5nLmpzXCI7XG47XG4vKipcbiAqIEBjbGFzcyBEdW5nZW9uIGZlYXR1cmU7IGhhcyBvd24gLmNyZWF0ZSgpIG1ldGhvZFxuICovXG5jbGFzcyBGZWF0dXJlIHtcbn1cbi8qKlxuICogQGNsYXNzIFJvb21cbiAqIEBhdWdtZW50cyBST1QuTWFwLkZlYXR1cmVcbiAqIEBwYXJhbSB7aW50fSB4MVxuICogQHBhcmFtIHtpbnR9IHkxXG4gKiBAcGFyYW0ge2ludH0geDJcbiAqIEBwYXJhbSB7aW50fSB5MlxuICogQHBhcmFtIHtpbnR9IFtkb29yWF1cbiAqIEBwYXJhbSB7aW50fSBbZG9vclldXG4gKi9cbmV4cG9ydCBjbGFzcyBSb29tIGV4dGVuZHMgRmVhdHVyZSB7XG4gICAgY29uc3RydWN0b3IoeDEsIHkxLCB4MiwgeTIsIGRvb3JYLCBkb29yWSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl94MSA9IHgxO1xuICAgICAgICB0aGlzLl95MSA9IHkxO1xuICAgICAgICB0aGlzLl94MiA9IHgyO1xuICAgICAgICB0aGlzLl95MiA9IHkyO1xuICAgICAgICB0aGlzLl9kb29ycyA9IHt9O1xuICAgICAgICBpZiAoZG9vclggIT09IHVuZGVmaW5lZCAmJiBkb29yWSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aGlzLmFkZERvb3IoZG9vclgsIGRvb3JZKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICA7XG4gICAgLyoqXG4gICAgICogUm9vbSBvZiByYW5kb20gc2l6ZSwgd2l0aCBhIGdpdmVuIGRvb3JzIGFuZCBkaXJlY3Rpb25cbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlUmFuZG9tQXQoeCwgeSwgZHgsIGR5LCBvcHRpb25zKSB7XG4gICAgICAgIGxldCBtaW4gPSBvcHRpb25zLnJvb21XaWR0aFswXTtcbiAgICAgICAgbGV0IG1heCA9IG9wdGlvbnMucm9vbVdpZHRoWzFdO1xuICAgICAgICBsZXQgd2lkdGggPSBSTkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XG4gICAgICAgIG1pbiA9IG9wdGlvbnMucm9vbUhlaWdodFswXTtcbiAgICAgICAgbWF4ID0gb3B0aW9ucy5yb29tSGVpZ2h0WzFdO1xuICAgICAgICBsZXQgaGVpZ2h0ID0gUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xuICAgICAgICBpZiAoZHggPT0gMSkgeyAvKiB0byB0aGUgcmlnaHQgKi9cbiAgICAgICAgICAgIGxldCB5MiA9IHkgLSBNYXRoLmZsb29yKFJORy5nZXRVbmlmb3JtKCkgKiBoZWlnaHQpO1xuICAgICAgICAgICAgcmV0dXJuIG5ldyB0aGlzKHggKyAxLCB5MiwgeCArIHdpZHRoLCB5MiArIGhlaWdodCAtIDEsIHgsIHkpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChkeCA9PSAtMSkgeyAvKiB0byB0aGUgbGVmdCAqL1xuICAgICAgICAgICAgbGV0IHkyID0geSAtIE1hdGguZmxvb3IoUk5HLmdldFVuaWZvcm0oKSAqIGhlaWdodCk7XG4gICAgICAgICAgICByZXR1cm4gbmV3IHRoaXMoeCAtIHdpZHRoLCB5MiwgeCAtIDEsIHkyICsgaGVpZ2h0IC0gMSwgeCwgeSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR5ID09IDEpIHsgLyogdG8gdGhlIGJvdHRvbSAqL1xuICAgICAgICAgICAgbGV0IHgyID0geCAtIE1hdGguZmxvb3IoUk5HLmdldFVuaWZvcm0oKSAqIHdpZHRoKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcyh4MiwgeSArIDEsIHgyICsgd2lkdGggLSAxLCB5ICsgaGVpZ2h0LCB4LCB5KTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHkgPT0gLTEpIHsgLyogdG8gdGhlIHRvcCAqL1xuICAgICAgICAgICAgbGV0IHgyID0geCAtIE1hdGguZmxvb3IoUk5HLmdldFVuaWZvcm0oKSAqIHdpZHRoKTtcbiAgICAgICAgICAgIHJldHVybiBuZXcgdGhpcyh4MiwgeSAtIGhlaWdodCwgeDIgKyB3aWR0aCAtIDEsIHkgLSAxLCB4LCB5KTtcbiAgICAgICAgfVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJkeCBvciBkeSBtdXN0IGJlIDEgb3IgLTFcIik7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJvb20gb2YgcmFuZG9tIHNpemUsIHBvc2l0aW9uZWQgYXJvdW5kIGNlbnRlciBjb29yZHNcbiAgICAgKi9cbiAgICBzdGF0aWMgY3JlYXRlUmFuZG9tQ2VudGVyKGN4LCBjeSwgb3B0aW9ucykge1xuICAgICAgICBsZXQgbWluID0gb3B0aW9ucy5yb29tV2lkdGhbMF07XG4gICAgICAgIGxldCBtYXggPSBvcHRpb25zLnJvb21XaWR0aFsxXTtcbiAgICAgICAgbGV0IHdpZHRoID0gUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xuICAgICAgICBtaW4gPSBvcHRpb25zLnJvb21IZWlnaHRbMF07XG4gICAgICAgIG1heCA9IG9wdGlvbnMucm9vbUhlaWdodFsxXTtcbiAgICAgICAgbGV0IGhlaWdodCA9IFJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcbiAgICAgICAgbGV0IHgxID0gY3ggLSBNYXRoLmZsb29yKFJORy5nZXRVbmlmb3JtKCkgKiB3aWR0aCk7XG4gICAgICAgIGxldCB5MSA9IGN5IC0gTWF0aC5mbG9vcihSTkcuZ2V0VW5pZm9ybSgpICogaGVpZ2h0KTtcbiAgICAgICAgbGV0IHgyID0geDEgKyB3aWR0aCAtIDE7XG4gICAgICAgIGxldCB5MiA9IHkxICsgaGVpZ2h0IC0gMTtcbiAgICAgICAgcmV0dXJuIG5ldyB0aGlzKHgxLCB5MSwgeDIsIHkyKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogUm9vbSBvZiByYW5kb20gc2l6ZSB3aXRoaW4gYSBnaXZlbiBkaW1lbnNpb25zXG4gICAgICovXG4gICAgc3RhdGljIGNyZWF0ZVJhbmRvbShhdmFpbFdpZHRoLCBhdmFpbEhlaWdodCwgb3B0aW9ucykge1xuICAgICAgICBsZXQgbWluID0gb3B0aW9ucy5yb29tV2lkdGhbMF07XG4gICAgICAgIGxldCBtYXggPSBvcHRpb25zLnJvb21XaWR0aFsxXTtcbiAgICAgICAgbGV0IHdpZHRoID0gUk5HLmdldFVuaWZvcm1JbnQobWluLCBtYXgpO1xuICAgICAgICBtaW4gPSBvcHRpb25zLnJvb21IZWlnaHRbMF07XG4gICAgICAgIG1heCA9IG9wdGlvbnMucm9vbUhlaWdodFsxXTtcbiAgICAgICAgbGV0IGhlaWdodCA9IFJORy5nZXRVbmlmb3JtSW50KG1pbiwgbWF4KTtcbiAgICAgICAgbGV0IGxlZnQgPSBhdmFpbFdpZHRoIC0gd2lkdGggLSAxO1xuICAgICAgICBsZXQgdG9wID0gYXZhaWxIZWlnaHQgLSBoZWlnaHQgLSAxO1xuICAgICAgICBsZXQgeDEgPSAxICsgTWF0aC5mbG9vcihSTkcuZ2V0VW5pZm9ybSgpICogbGVmdCk7XG4gICAgICAgIGxldCB5MSA9IDEgKyBNYXRoLmZsb29yKFJORy5nZXRVbmlmb3JtKCkgKiB0b3ApO1xuICAgICAgICBsZXQgeDIgPSB4MSArIHdpZHRoIC0gMTtcbiAgICAgICAgbGV0IHkyID0geTEgKyBoZWlnaHQgLSAxO1xuICAgICAgICByZXR1cm4gbmV3IHRoaXMoeDEsIHkxLCB4MiwgeTIpO1xuICAgIH1cbiAgICBhZGREb29yKHgsIHkpIHtcbiAgICAgICAgdGhpcy5fZG9vcnNbeCArIFwiLFwiICsgeV0gPSAxO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn1cbiAgICAgKi9cbiAgICBnZXREb29ycyhjYikge1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gdGhpcy5fZG9vcnMpIHtcbiAgICAgICAgICAgIGxldCBwYXJ0cyA9IGtleS5zcGxpdChcIixcIik7XG4gICAgICAgICAgICBjYihwYXJzZUludChwYXJ0c1swXSksIHBhcnNlSW50KHBhcnRzWzFdKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIGNsZWFyRG9vcnMoKSB7XG4gICAgICAgIHRoaXMuX2Rvb3JzID0ge307XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBhZGREb29ycyhpc1dhbGxDYWxsYmFjaykge1xuICAgICAgICBsZXQgbGVmdCA9IHRoaXMuX3gxIC0gMTtcbiAgICAgICAgbGV0IHJpZ2h0ID0gdGhpcy5feDIgKyAxO1xuICAgICAgICBsZXQgdG9wID0gdGhpcy5feTEgLSAxO1xuICAgICAgICBsZXQgYm90dG9tID0gdGhpcy5feTIgKyAxO1xuICAgICAgICBmb3IgKGxldCB4ID0gbGVmdDsgeCA8PSByaWdodDsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gdG9wOyB5IDw9IGJvdHRvbTsgeSsrKSB7XG4gICAgICAgICAgICAgICAgaWYgKHggIT0gbGVmdCAmJiB4ICE9IHJpZ2h0ICYmIHkgIT0gdG9wICYmIHkgIT0gYm90dG9tKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAoaXNXYWxsQ2FsbGJhY2soeCwgeSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuYWRkRG9vcih4LCB5KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgZGVidWcoKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKFwicm9vbVwiLCB0aGlzLl94MSwgdGhpcy5feTEsIHRoaXMuX3gyLCB0aGlzLl95Mik7XG4gICAgfVxuICAgIGlzVmFsaWQoaXNXYWxsQ2FsbGJhY2ssIGNhbkJlRHVnQ2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGxlZnQgPSB0aGlzLl94MSAtIDE7XG4gICAgICAgIGxldCByaWdodCA9IHRoaXMuX3gyICsgMTtcbiAgICAgICAgbGV0IHRvcCA9IHRoaXMuX3kxIC0gMTtcbiAgICAgICAgbGV0IGJvdHRvbSA9IHRoaXMuX3kyICsgMTtcbiAgICAgICAgZm9yIChsZXQgeCA9IGxlZnQ7IHggPD0gcmlnaHQ7IHgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IHRvcDsgeSA8PSBib3R0b207IHkrKykge1xuICAgICAgICAgICAgICAgIGlmICh4ID09IGxlZnQgfHwgeCA9PSByaWdodCB8fCB5ID09IHRvcCB8fCB5ID09IGJvdHRvbSkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoIWlzV2FsbENhbGxiYWNrKHgsIHkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghY2FuQmVEdWdDYWxsYmFjayh4LCB5KSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBkaWdDYWxsYmFjayBEaWcgY2FsbGJhY2sgd2l0aCBhIHNpZ25hdHVyZSAoeCwgeSwgdmFsdWUpLiBWYWx1ZXM6IDAgPSBlbXB0eSwgMSA9IHdhbGwsIDIgPSBkb29yLiBNdWx0aXBsZSBkb29ycyBhcmUgYWxsb3dlZC5cbiAgICAgKi9cbiAgICBjcmVhdGUoZGlnQ2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGxlZnQgPSB0aGlzLl94MSAtIDE7XG4gICAgICAgIGxldCByaWdodCA9IHRoaXMuX3gyICsgMTtcbiAgICAgICAgbGV0IHRvcCA9IHRoaXMuX3kxIC0gMTtcbiAgICAgICAgbGV0IGJvdHRvbSA9IHRoaXMuX3kyICsgMTtcbiAgICAgICAgbGV0IHZhbHVlID0gMDtcbiAgICAgICAgZm9yIChsZXQgeCA9IGxlZnQ7IHggPD0gcmlnaHQ7IHgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IHRvcDsgeSA8PSBib3R0b207IHkrKykge1xuICAgICAgICAgICAgICAgIGlmICh4ICsgXCIsXCIgKyB5IGluIHRoaXMuX2Rvb3JzKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gMjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoeCA9PSBsZWZ0IHx8IHggPT0gcmlnaHQgfHwgeSA9PSB0b3AgfHwgeSA9PSBib3R0b20pIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAxO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBkaWdDYWxsYmFjayh4LCB5LCB2YWx1ZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgZ2V0Q2VudGVyKCkge1xuICAgICAgICByZXR1cm4gW01hdGgucm91bmQoKHRoaXMuX3gxICsgdGhpcy5feDIpIC8gMiksIE1hdGgucm91bmQoKHRoaXMuX3kxICsgdGhpcy5feTIpIC8gMildO1xuICAgIH1cbiAgICBnZXRMZWZ0KCkgeyByZXR1cm4gdGhpcy5feDE7IH1cbiAgICBnZXRSaWdodCgpIHsgcmV0dXJuIHRoaXMuX3gyOyB9XG4gICAgZ2V0VG9wKCkgeyByZXR1cm4gdGhpcy5feTE7IH1cbiAgICBnZXRCb3R0b20oKSB7IHJldHVybiB0aGlzLl95MjsgfVxufVxuLyoqXG4gKiBAY2xhc3MgQ29ycmlkb3JcbiAqIEBhdWdtZW50cyBST1QuTWFwLkZlYXR1cmVcbiAqIEBwYXJhbSB7aW50fSBzdGFydFhcbiAqIEBwYXJhbSB7aW50fSBzdGFydFlcbiAqIEBwYXJhbSB7aW50fSBlbmRYXG4gKiBAcGFyYW0ge2ludH0gZW5kWVxuICovXG5leHBvcnQgY2xhc3MgQ29ycmlkb3IgZXh0ZW5kcyBGZWF0dXJlIHtcbiAgICBjb25zdHJ1Y3RvcihzdGFydFgsIHN0YXJ0WSwgZW5kWCwgZW5kWSkge1xuICAgICAgICBzdXBlcigpO1xuICAgICAgICB0aGlzLl9zdGFydFggPSBzdGFydFg7XG4gICAgICAgIHRoaXMuX3N0YXJ0WSA9IHN0YXJ0WTtcbiAgICAgICAgdGhpcy5fZW5kWCA9IGVuZFg7XG4gICAgICAgIHRoaXMuX2VuZFkgPSBlbmRZO1xuICAgICAgICB0aGlzLl9lbmRzV2l0aEFXYWxsID0gdHJ1ZTtcbiAgICB9XG4gICAgc3RhdGljIGNyZWF0ZVJhbmRvbUF0KHgsIHksIGR4LCBkeSwgb3B0aW9ucykge1xuICAgICAgICBsZXQgbWluID0gb3B0aW9ucy5jb3JyaWRvckxlbmd0aFswXTtcbiAgICAgICAgbGV0IG1heCA9IG9wdGlvbnMuY29ycmlkb3JMZW5ndGhbMV07XG4gICAgICAgIGxldCBsZW5ndGggPSBSTkcuZ2V0VW5pZm9ybUludChtaW4sIG1heCk7XG4gICAgICAgIHJldHVybiBuZXcgdGhpcyh4LCB5LCB4ICsgZHggKiBsZW5ndGgsIHkgKyBkeSAqIGxlbmd0aCk7XG4gICAgfVxuICAgIGRlYnVnKCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcImNvcnJpZG9yXCIsIHRoaXMuX3N0YXJ0WCwgdGhpcy5fc3RhcnRZLCB0aGlzLl9lbmRYLCB0aGlzLl9lbmRZKTtcbiAgICB9XG4gICAgaXNWYWxpZChpc1dhbGxDYWxsYmFjaywgY2FuQmVEdWdDYWxsYmFjaykge1xuICAgICAgICBsZXQgc3ggPSB0aGlzLl9zdGFydFg7XG4gICAgICAgIGxldCBzeSA9IHRoaXMuX3N0YXJ0WTtcbiAgICAgICAgbGV0IGR4ID0gdGhpcy5fZW5kWCAtIHN4O1xuICAgICAgICBsZXQgZHkgPSB0aGlzLl9lbmRZIC0gc3k7XG4gICAgICAgIGxldCBsZW5ndGggPSAxICsgTWF0aC5tYXgoTWF0aC5hYnMoZHgpLCBNYXRoLmFicyhkeSkpO1xuICAgICAgICBpZiAoZHgpIHtcbiAgICAgICAgICAgIGR4ID0gZHggLyBNYXRoLmFicyhkeCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR5KSB7XG4gICAgICAgICAgICBkeSA9IGR5IC8gTWF0aC5hYnMoZHkpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBueCA9IGR5O1xuICAgICAgICBsZXQgbnkgPSAtZHg7XG4gICAgICAgIGxldCBvayA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB4ID0gc3ggKyBpICogZHg7XG4gICAgICAgICAgICBsZXQgeSA9IHN5ICsgaSAqIGR5O1xuICAgICAgICAgICAgaWYgKCFjYW5CZUR1Z0NhbGxiYWNrKHgsIHkpKSB7XG4gICAgICAgICAgICAgICAgb2sgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNXYWxsQ2FsbGJhY2soeCArIG54LCB5ICsgbnkpKSB7XG4gICAgICAgICAgICAgICAgb2sgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghaXNXYWxsQ2FsbGJhY2soeCAtIG54LCB5IC0gbnkpKSB7XG4gICAgICAgICAgICAgICAgb2sgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghb2spIHtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSBpO1xuICAgICAgICAgICAgICAgIHRoaXMuX2VuZFggPSB4IC0gZHg7XG4gICAgICAgICAgICAgICAgdGhpcy5fZW5kWSA9IHkgLSBkeTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKipcbiAgICAgICAgICogSWYgdGhlIGxlbmd0aCBkZWdlbmVyYXRlZCwgdGhpcyBjb3JyaWRvciBtaWdodCBiZSBpbnZhbGlkXG4gICAgICAgICAqL1xuICAgICAgICAvKiBub3Qgc3VwcG9ydGVkICovXG4gICAgICAgIGlmIChsZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIC8qIGxlbmd0aCAxIGFsbG93ZWQgb25seSBpZiB0aGUgbmV4dCBzcGFjZSBpcyBlbXB0eSAqL1xuICAgICAgICBpZiAobGVuZ3RoID09IDEgJiYgaXNXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIGR4LCB0aGlzLl9lbmRZICsgZHkpKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgLyoqXG4gICAgICAgICAqIFdlIGRvIG5vdCB3YW50IHRoZSBjb3JyaWRvciB0byBjcmFzaCBpbnRvIGEgY29ybmVyIG9mIGEgcm9vbTtcbiAgICAgICAgICogaWYgYW55IG9mIHRoZSBlbmRpbmcgY29ybmVycyBpcyBlbXB0eSwgdGhlIE4rMXRoIGNlbGwgb2YgdGhpcyBjb3JyaWRvciBtdXN0IGJlIGVtcHR5IHRvby5cbiAgICAgICAgICpcbiAgICAgICAgICogU2l0dWF0aW9uOlxuICAgICAgICAgKiAjIyMjIyMjMVxuICAgICAgICAgKiAuLi4uLi4uP1xuICAgICAgICAgKiAjIyMjIyMjMlxuICAgICAgICAgKlxuICAgICAgICAgKiBUaGUgY29ycmlkb3Igd2FzIGR1ZyBmcm9tIGxlZnQgdG8gcmlnaHQuXG4gICAgICAgICAqIDEsIDIgLSBwcm9ibGVtYXRpYyBjb3JuZXJzLCA/ID0gTisxdGggY2VsbCAobm90IGR1ZylcbiAgICAgICAgICovXG4gICAgICAgIGxldCBmaXJzdENvcm5lckJhZCA9ICFpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHggKyBueCwgdGhpcy5fZW5kWSArIGR5ICsgbnkpO1xuICAgICAgICBsZXQgc2Vjb25kQ29ybmVyQmFkID0gIWlzV2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBkeCAtIG54LCB0aGlzLl9lbmRZICsgZHkgLSBueSk7XG4gICAgICAgIHRoaXMuX2VuZHNXaXRoQVdhbGwgPSBpc1dhbGxDYWxsYmFjayh0aGlzLl9lbmRYICsgZHgsIHRoaXMuX2VuZFkgKyBkeSk7XG4gICAgICAgIGlmICgoZmlyc3RDb3JuZXJCYWQgfHwgc2Vjb25kQ29ybmVyQmFkKSAmJiB0aGlzLl9lbmRzV2l0aEFXYWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGRpZ0NhbGxiYWNrIERpZyBjYWxsYmFjayB3aXRoIGEgc2lnbmF0dXJlICh4LCB5LCB2YWx1ZSkuIFZhbHVlczogMCA9IGVtcHR5LlxuICAgICAqL1xuICAgIGNyZWF0ZShkaWdDYWxsYmFjaykge1xuICAgICAgICBsZXQgc3ggPSB0aGlzLl9zdGFydFg7XG4gICAgICAgIGxldCBzeSA9IHRoaXMuX3N0YXJ0WTtcbiAgICAgICAgbGV0IGR4ID0gdGhpcy5fZW5kWCAtIHN4O1xuICAgICAgICBsZXQgZHkgPSB0aGlzLl9lbmRZIC0gc3k7XG4gICAgICAgIGxldCBsZW5ndGggPSAxICsgTWF0aC5tYXgoTWF0aC5hYnMoZHgpLCBNYXRoLmFicyhkeSkpO1xuICAgICAgICBpZiAoZHgpIHtcbiAgICAgICAgICAgIGR4ID0gZHggLyBNYXRoLmFicyhkeCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR5KSB7XG4gICAgICAgICAgICBkeSA9IGR5IC8gTWF0aC5hYnMoZHkpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB4ID0gc3ggKyBpICogZHg7XG4gICAgICAgICAgICBsZXQgeSA9IHN5ICsgaSAqIGR5O1xuICAgICAgICAgICAgZGlnQ2FsbGJhY2soeCwgeSwgMCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGNyZWF0ZVByaW9yaXR5V2FsbHMocHJpb3JpdHlXYWxsQ2FsbGJhY2spIHtcbiAgICAgICAgaWYgKCF0aGlzLl9lbmRzV2l0aEFXYWxsKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN4ID0gdGhpcy5fc3RhcnRYO1xuICAgICAgICBsZXQgc3kgPSB0aGlzLl9zdGFydFk7XG4gICAgICAgIGxldCBkeCA9IHRoaXMuX2VuZFggLSBzeDtcbiAgICAgICAgbGV0IGR5ID0gdGhpcy5fZW5kWSAtIHN5O1xuICAgICAgICBpZiAoZHgpIHtcbiAgICAgICAgICAgIGR4ID0gZHggLyBNYXRoLmFicyhkeCk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGR5KSB7XG4gICAgICAgICAgICBkeSA9IGR5IC8gTWF0aC5hYnMoZHkpO1xuICAgICAgICB9XG4gICAgICAgIGxldCBueCA9IGR5O1xuICAgICAgICBsZXQgbnkgPSAtZHg7XG4gICAgICAgIHByaW9yaXR5V2FsbENhbGxiYWNrKHRoaXMuX2VuZFggKyBkeCwgdGhpcy5fZW5kWSArIGR5KTtcbiAgICAgICAgcHJpb3JpdHlXYWxsQ2FsbGJhY2sodGhpcy5fZW5kWCArIG54LCB0aGlzLl9lbmRZICsgbnkpO1xuICAgICAgICBwcmlvcml0eVdhbGxDYWxsYmFjayh0aGlzLl9lbmRYIC0gbngsIHRoaXMuX2VuZFkgLSBueSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IER1bmdlb24gZnJvbSBcIi4vZHVuZ2Vvbi5qc1wiO1xuaW1wb3J0IHsgUm9vbSwgQ29ycmlkb3IgfSBmcm9tIFwiLi9mZWF0dXJlcy5qc1wiO1xuaW1wb3J0IFJORyBmcm9tIFwiLi4vcm5nLmpzXCI7XG47XG4vKipcbiAqIEBjbGFzcyBEdW5nZW9uIGdlbmVyYXRvciB3aGljaCB0cmllcyB0byBmaWxsIHRoZSBzcGFjZSBldmVubHkuIEdlbmVyYXRlcyBpbmRlcGVuZGVudCByb29tcyBhbmQgdHJpZXMgdG8gY29ubmVjdCB0aGVtLlxuICogQGF1Z21lbnRzIFJPVC5NYXAuRHVuZ2VvblxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBVbmlmb3JtIGV4dGVuZHMgRHVuZ2VvbiB7XG4gICAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuICAgICAgICBzdXBlcih3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIHJvb21XaWR0aDogWzMsIDldLFxuICAgICAgICAgICAgcm9vbUhlaWdodDogWzMsIDVdLFxuICAgICAgICAgICAgcm9vbUR1Z1BlcmNlbnRhZ2U6IDAuMSxcbiAgICAgICAgICAgIHRpbWVMaW1pdDogMTAwMCAvKiB3ZSBzdG9wIGFmdGVyIHRoaXMgbXVjaCB0aW1lIGhhcyBwYXNzZWQgKG1zZWMpICovXG4gICAgICAgIH07XG4gICAgICAgIE9iamVjdC5hc3NpZ24odGhpcy5fb3B0aW9ucywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX21hcCA9IFtdO1xuICAgICAgICB0aGlzLl9kdWcgPSAwO1xuICAgICAgICB0aGlzLl9yb29tQXR0ZW1wdHMgPSAyMDsgLyogbmV3IHJvb20gaXMgY3JlYXRlZCBOLXRpbWVzIHVudGlsIGlzIGNvbnNpZGVyZWQgYXMgaW1wb3NzaWJsZSB0byBnZW5lcmF0ZSAqL1xuICAgICAgICB0aGlzLl9jb3JyaWRvckF0dGVtcHRzID0gMjA7IC8qIGNvcnJpZG9ycyBhcmUgdHJpZWQgTi10aW1lcyB1bnRpbCB0aGUgbGV2ZWwgaXMgY29uc2lkZXJlZCBhcyBpbXBvc3NpYmxlIHRvIGNvbm5lY3QgKi9cbiAgICAgICAgdGhpcy5fY29ubmVjdGVkID0gW107IC8qIGxpc3Qgb2YgYWxyZWFkeSBjb25uZWN0ZWQgcm9vbXMgKi9cbiAgICAgICAgdGhpcy5fdW5jb25uZWN0ZWQgPSBbXTsgLyogbGlzdCBvZiByZW1haW5pbmcgdW5jb25uZWN0ZWQgcm9vbXMgKi9cbiAgICAgICAgdGhpcy5fZGlnQ2FsbGJhY2sgPSB0aGlzLl9kaWdDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrID0gdGhpcy5fY2FuQmVEdWdDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgICAgICB0aGlzLl9pc1dhbGxDYWxsYmFjayA9IHRoaXMuX2lzV2FsbENhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG1hcC4gSWYgdGhlIHRpbWUgbGltaXQgaGFzIGJlZW4gaGl0LCByZXR1cm5zIG51bGwuXG4gICAgICogQHNlZSBST1QuTWFwI2NyZWF0ZVxuICAgICAqL1xuICAgIGNyZWF0ZShjYWxsYmFjaykge1xuICAgICAgICBsZXQgdDEgPSBEYXRlLm5vdygpO1xuICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgbGV0IHQyID0gRGF0ZS5ub3coKTtcbiAgICAgICAgICAgIGlmICh0MiAtIHQxID4gdGhpcy5fb3B0aW9ucy50aW1lTGltaXQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH0gLyogdGltZSBsaW1pdCEgKi9cbiAgICAgICAgICAgIHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XG4gICAgICAgICAgICB0aGlzLl9kdWcgPSAwO1xuICAgICAgICAgICAgdGhpcy5fcm9vbXMgPSBbXTtcbiAgICAgICAgICAgIHRoaXMuX3VuY29ubmVjdGVkID0gW107XG4gICAgICAgICAgICB0aGlzLl9nZW5lcmF0ZVJvb21zKCk7XG4gICAgICAgICAgICBpZiAodGhpcy5fcm9vbXMubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHRoaXMuX2dlbmVyYXRlQ29ycmlkb3JzKCkpIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fd2lkdGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5faGVpZ2h0OyBqKyspIHtcbiAgICAgICAgICAgICAgICAgICAgY2FsbGJhY2soaSwgaiwgdGhpcy5fbWFwW2ldW2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyBhIHN1aXRhYmxlIGFtb3VudCBvZiByb29tc1xuICAgICAqL1xuICAgIF9nZW5lcmF0ZVJvb21zKCkge1xuICAgICAgICBsZXQgdyA9IHRoaXMuX3dpZHRoIC0gMjtcbiAgICAgICAgbGV0IGggPSB0aGlzLl9oZWlnaHQgLSAyO1xuICAgICAgICBsZXQgcm9vbTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgcm9vbSA9IHRoaXMuX2dlbmVyYXRlUm9vbSgpO1xuICAgICAgICAgICAgaWYgKHRoaXMuX2R1ZyAvICh3ICogaCkgPiB0aGlzLl9vcHRpb25zLnJvb21EdWdQZXJjZW50YWdlKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IC8qIGFjaGlldmVkIHJlcXVlc3RlZCBhbW91bnQgb2YgZnJlZSBzcGFjZSAqL1xuICAgICAgICB9IHdoaWxlIChyb29tKTtcbiAgICAgICAgLyogZWl0aGVyIGVub3VnaCByb29tcywgb3Igbm90IGFibGUgdG8gZ2VuZXJhdGUgbW9yZSBvZiB0aGVtIDopICovXG4gICAgfVxuICAgIC8qKlxuICAgICAqIFRyeSB0byBnZW5lcmF0ZSBvbmUgcm9vbVxuICAgICAqL1xuICAgIF9nZW5lcmF0ZVJvb20oKSB7XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIHdoaWxlIChjb3VudCA8IHRoaXMuX3Jvb21BdHRlbXB0cykge1xuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgICAgIGxldCByb29tID0gUm9vbS5jcmVhdGVSYW5kb20odGhpcy5fd2lkdGgsIHRoaXMuX2hlaWdodCwgdGhpcy5fb3B0aW9ucyk7XG4gICAgICAgICAgICBpZiAoIXJvb20uaXNWYWxpZCh0aGlzLl9pc1dhbGxDYWxsYmFjaywgdGhpcy5fY2FuQmVEdWdDYWxsYmFjaykpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJvb20uY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcbiAgICAgICAgICAgIHRoaXMuX3Jvb21zLnB1c2gocm9vbSk7XG4gICAgICAgICAgICByZXR1cm4gcm9vbTtcbiAgICAgICAgfVxuICAgICAgICAvKiBubyByb29tIHdhcyBnZW5lcmF0ZWQgaW4gYSBnaXZlbiBudW1iZXIgb2YgYXR0ZW1wdHMgKi9cbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEdlbmVyYXRlcyBjb25uZWN0b3JzIGJld2VlbiByb29tc1xuICAgICAqIEByZXR1cm5zIHtib29sfSBzdWNjZXNzIFdhcyB0aGlzIGF0dGVtcHQgc3VjY2Vzc2Z1bGw/XG4gICAgICovXG4gICAgX2dlbmVyYXRlQ29ycmlkb3JzKCkge1xuICAgICAgICBsZXQgY250ID0gMDtcbiAgICAgICAgd2hpbGUgKGNudCA8IHRoaXMuX2NvcnJpZG9yQXR0ZW1wdHMpIHtcbiAgICAgICAgICAgIGNudCsrO1xuICAgICAgICAgICAgdGhpcy5fY29ycmlkb3JzID0gW107XG4gICAgICAgICAgICAvKiBkaWcgcm9vbXMgaW50byBhIGNsZWFyIG1hcCAqL1xuICAgICAgICAgICAgdGhpcy5fbWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fcm9vbXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBsZXQgcm9vbSA9IHRoaXMuX3Jvb21zW2ldO1xuICAgICAgICAgICAgICAgIHJvb20uY2xlYXJEb29ycygpO1xuICAgICAgICAgICAgICAgIHJvb20uY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuX3VuY29ubmVjdGVkID0gUk5HLnNodWZmbGUodGhpcy5fcm9vbXMuc2xpY2UoKSk7XG4gICAgICAgICAgICB0aGlzLl9jb25uZWN0ZWQgPSBbXTtcbiAgICAgICAgICAgIGlmICh0aGlzLl91bmNvbm5lY3RlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9jb25uZWN0ZWQucHVzaCh0aGlzLl91bmNvbm5lY3RlZC5wb3AoKSk7XG4gICAgICAgICAgICB9IC8qIGZpcnN0IG9uZSBpcyBhbHdheXMgY29ubmVjdGVkICovXG4gICAgICAgICAgICB3aGlsZSAoMSkge1xuICAgICAgICAgICAgICAgIC8qIDEuIHBpY2sgcmFuZG9tIGNvbm5lY3RlZCByb29tICovXG4gICAgICAgICAgICAgICAgbGV0IGNvbm5lY3RlZCA9IFJORy5nZXRJdGVtKHRoaXMuX2Nvbm5lY3RlZCk7XG4gICAgICAgICAgICAgICAgaWYgKCFjb25uZWN0ZWQpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qIDIuIGZpbmQgY2xvc2VzdCB1bmNvbm5lY3RlZCAqL1xuICAgICAgICAgICAgICAgIGxldCByb29tMSA9IHRoaXMuX2Nsb3Nlc3RSb29tKHRoaXMuX3VuY29ubmVjdGVkLCBjb25uZWN0ZWQpO1xuICAgICAgICAgICAgICAgIGlmICghcm9vbTEpIHtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIC8qIDMuIGNvbm5lY3QgaXQgdG8gY2xvc2VzdCBjb25uZWN0ZWQgKi9cbiAgICAgICAgICAgICAgICBsZXQgcm9vbTIgPSB0aGlzLl9jbG9zZXN0Um9vbSh0aGlzLl9jb25uZWN0ZWQsIHJvb20xKTtcbiAgICAgICAgICAgICAgICBpZiAoIXJvb20yKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBsZXQgb2sgPSB0aGlzLl9jb25uZWN0Um9vbXMocm9vbTEsIHJvb20yKTtcbiAgICAgICAgICAgICAgICBpZiAoIW9rKSB7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH0gLyogc3RvcCBjb25uZWN0aW5nLCByZS1zaHVmZmxlICovXG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLl91bmNvbm5lY3RlZC5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfSAvKiBkb25lOyBubyByb29tcyByZW1haW4gKi9cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIDtcbiAgICAvKipcbiAgICAgKiBGb3IgYSBnaXZlbiByb29tLCBmaW5kIHRoZSBjbG9zZXN0IG9uZSBmcm9tIHRoZSBsaXN0XG4gICAgICovXG4gICAgX2Nsb3Nlc3RSb29tKHJvb21zLCByb29tKSB7XG4gICAgICAgIGxldCBkaXN0ID0gSW5maW5pdHk7XG4gICAgICAgIGxldCBjZW50ZXIgPSByb29tLmdldENlbnRlcigpO1xuICAgICAgICBsZXQgcmVzdWx0ID0gbnVsbDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCByb29tcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHIgPSByb29tc1tpXTtcbiAgICAgICAgICAgIGxldCBjID0gci5nZXRDZW50ZXIoKTtcbiAgICAgICAgICAgIGxldCBkeCA9IGNbMF0gLSBjZW50ZXJbMF07XG4gICAgICAgICAgICBsZXQgZHkgPSBjWzFdIC0gY2VudGVyWzFdO1xuICAgICAgICAgICAgbGV0IGQgPSBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgICAgICAgICAgIGlmIChkIDwgZGlzdCkge1xuICAgICAgICAgICAgICAgIGRpc3QgPSBkO1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9XG4gICAgX2Nvbm5lY3RSb29tcyhyb29tMSwgcm9vbTIpIHtcbiAgICAgICAgLypcbiAgICAgICAgICAgIHJvb20xLmRlYnVnKCk7XG4gICAgICAgICAgICByb29tMi5kZWJ1ZygpO1xuICAgICAgICAqL1xuICAgICAgICBsZXQgY2VudGVyMSA9IHJvb20xLmdldENlbnRlcigpO1xuICAgICAgICBsZXQgY2VudGVyMiA9IHJvb20yLmdldENlbnRlcigpO1xuICAgICAgICBsZXQgZGlmZlggPSBjZW50ZXIyWzBdIC0gY2VudGVyMVswXTtcbiAgICAgICAgbGV0IGRpZmZZID0gY2VudGVyMlsxXSAtIGNlbnRlcjFbMV07XG4gICAgICAgIGxldCBzdGFydDtcbiAgICAgICAgbGV0IGVuZDtcbiAgICAgICAgbGV0IGRpckluZGV4MSwgZGlySW5kZXgyLCBtaW4sIG1heCwgaW5kZXg7XG4gICAgICAgIGlmIChNYXRoLmFicyhkaWZmWCkgPCBNYXRoLmFicyhkaWZmWSkpIHsgLyogZmlyc3QgdHJ5IGNvbm5lY3Rpbmcgbm9ydGgtc291dGggd2FsbHMgKi9cbiAgICAgICAgICAgIGRpckluZGV4MSA9IChkaWZmWSA+IDAgPyAyIDogMCk7XG4gICAgICAgICAgICBkaXJJbmRleDIgPSAoZGlySW5kZXgxICsgMikgJSA0O1xuICAgICAgICAgICAgbWluID0gcm9vbTIuZ2V0TGVmdCgpO1xuICAgICAgICAgICAgbWF4ID0gcm9vbTIuZ2V0UmlnaHQoKTtcbiAgICAgICAgICAgIGluZGV4ID0gMDtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLyogZmlyc3QgdHJ5IGNvbm5lY3RpbmcgZWFzdC13ZXN0IHdhbGxzICovXG4gICAgICAgICAgICBkaXJJbmRleDEgPSAoZGlmZlggPiAwID8gMSA6IDMpO1xuICAgICAgICAgICAgZGlySW5kZXgyID0gKGRpckluZGV4MSArIDIpICUgNDtcbiAgICAgICAgICAgIG1pbiA9IHJvb20yLmdldFRvcCgpO1xuICAgICAgICAgICAgbWF4ID0gcm9vbTIuZ2V0Qm90dG9tKCk7XG4gICAgICAgICAgICBpbmRleCA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgc3RhcnQgPSB0aGlzLl9wbGFjZUluV2FsbChyb29tMSwgZGlySW5kZXgxKTsgLyogY29ycmlkb3Igd2lsbCBzdGFydCBoZXJlICovXG4gICAgICAgIGlmICghc3RhcnQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoc3RhcnRbaW5kZXhdID49IG1pbiAmJiBzdGFydFtpbmRleF0gPD0gbWF4KSB7IC8qIHBvc3NpYmxlIHRvIGNvbm5lY3Qgd2l0aCBzdHJhaWdodCBsaW5lIChJLWxpa2UpICovXG4gICAgICAgICAgICBlbmQgPSBzdGFydC5zbGljZSgpO1xuICAgICAgICAgICAgbGV0IHZhbHVlID0gMDtcbiAgICAgICAgICAgIHN3aXRjaCAoZGlySW5kZXgyKSB7XG4gICAgICAgICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJvb20yLmdldFRvcCgpIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgY2FzZSAxOlxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IHJvb20yLmdldFJpZ2h0KCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcm9vbTIuZ2V0Qm90dG9tKCkgKyAxO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gcm9vbTIuZ2V0TGVmdCgpIC0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbmRbKGluZGV4ICsgMSkgJSAyXSA9IHZhbHVlO1xuICAgICAgICAgICAgdGhpcy5fZGlnTGluZShbc3RhcnQsIGVuZF0pO1xuICAgICAgICB9XG4gICAgICAgIGVsc2UgaWYgKHN0YXJ0W2luZGV4XSA8IG1pbiAtIDEgfHwgc3RhcnRbaW5kZXhdID4gbWF4ICsgMSkgeyAvKiBuZWVkIHRvIHN3aXRjaCB0YXJnZXQgd2FsbCAoTC1saWtlKSAqL1xuICAgICAgICAgICAgbGV0IGRpZmYgPSBzdGFydFtpbmRleF0gLSBjZW50ZXIyW2luZGV4XTtcbiAgICAgICAgICAgIGxldCByb3RhdGlvbiA9IDA7XG4gICAgICAgICAgICBzd2l0Y2ggKGRpckluZGV4Mikge1xuICAgICAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgICAgIHJvdGF0aW9uID0gKGRpZmYgPCAwID8gMyA6IDEpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgY2FzZSAzOlxuICAgICAgICAgICAgICAgICAgICByb3RhdGlvbiA9IChkaWZmIDwgMCA/IDEgOiAzKTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBkaXJJbmRleDIgPSAoZGlySW5kZXgyICsgcm90YXRpb24pICUgNDtcbiAgICAgICAgICAgIGVuZCA9IHRoaXMuX3BsYWNlSW5XYWxsKHJvb20yLCBkaXJJbmRleDIpO1xuICAgICAgICAgICAgaWYgKCFlbmQpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbWlkID0gWzAsIDBdO1xuICAgICAgICAgICAgbWlkW2luZGV4XSA9IHN0YXJ0W2luZGV4XTtcbiAgICAgICAgICAgIGxldCBpbmRleDIgPSAoaW5kZXggKyAxKSAlIDI7XG4gICAgICAgICAgICBtaWRbaW5kZXgyXSA9IGVuZFtpbmRleDJdO1xuICAgICAgICAgICAgdGhpcy5fZGlnTGluZShbc3RhcnQsIG1pZCwgZW5kXSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8qIHVzZSBjdXJyZW50IHdhbGwgcGFpciwgYnV0IGFkanVzdCB0aGUgbGluZSBpbiB0aGUgbWlkZGxlIChTLWxpa2UpICovXG4gICAgICAgICAgICBsZXQgaW5kZXgyID0gKGluZGV4ICsgMSkgJSAyO1xuICAgICAgICAgICAgZW5kID0gdGhpcy5fcGxhY2VJbldhbGwocm9vbTIsIGRpckluZGV4Mik7XG4gICAgICAgICAgICBpZiAoIWVuZCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBtaWQgPSBNYXRoLnJvdW5kKChlbmRbaW5kZXgyXSArIHN0YXJ0W2luZGV4Ml0pIC8gMik7XG4gICAgICAgICAgICBsZXQgbWlkMSA9IFswLCAwXTtcbiAgICAgICAgICAgIGxldCBtaWQyID0gWzAsIDBdO1xuICAgICAgICAgICAgbWlkMVtpbmRleF0gPSBzdGFydFtpbmRleF07XG4gICAgICAgICAgICBtaWQxW2luZGV4Ml0gPSBtaWQ7XG4gICAgICAgICAgICBtaWQyW2luZGV4XSA9IGVuZFtpbmRleF07XG4gICAgICAgICAgICBtaWQyW2luZGV4Ml0gPSBtaWQ7XG4gICAgICAgICAgICB0aGlzLl9kaWdMaW5lKFtzdGFydCwgbWlkMSwgbWlkMiwgZW5kXSk7XG4gICAgICAgIH1cbiAgICAgICAgcm9vbTEuYWRkRG9vcihzdGFydFswXSwgc3RhcnRbMV0pO1xuICAgICAgICByb29tMi5hZGREb29yKGVuZFswXSwgZW5kWzFdKTtcbiAgICAgICAgaW5kZXggPSB0aGlzLl91bmNvbm5lY3RlZC5pbmRleE9mKHJvb20xKTtcbiAgICAgICAgaWYgKGluZGV4ICE9IC0xKSB7XG4gICAgICAgICAgICB0aGlzLl91bmNvbm5lY3RlZC5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgdGhpcy5fY29ubmVjdGVkLnB1c2gocm9vbTEpO1xuICAgICAgICB9XG4gICAgICAgIGluZGV4ID0gdGhpcy5fdW5jb25uZWN0ZWQuaW5kZXhPZihyb29tMik7XG4gICAgICAgIGlmIChpbmRleCAhPSAtMSkge1xuICAgICAgICAgICAgdGhpcy5fdW5jb25uZWN0ZWQuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIHRoaXMuX2Nvbm5lY3RlZC5wdXNoKHJvb20yKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgX3BsYWNlSW5XYWxsKHJvb20sIGRpckluZGV4KSB7XG4gICAgICAgIGxldCBzdGFydCA9IFswLCAwXTtcbiAgICAgICAgbGV0IGRpciA9IFswLCAwXTtcbiAgICAgICAgbGV0IGxlbmd0aCA9IDA7XG4gICAgICAgIHN3aXRjaCAoZGlySW5kZXgpIHtcbiAgICAgICAgICAgIGNhc2UgMDpcbiAgICAgICAgICAgICAgICBkaXIgPSBbMSwgMF07XG4gICAgICAgICAgICAgICAgc3RhcnQgPSBbcm9vbS5nZXRMZWZ0KCksIHJvb20uZ2V0VG9wKCkgLSAxXTtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSByb29tLmdldFJpZ2h0KCkgLSByb29tLmdldExlZnQoKSArIDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDE6XG4gICAgICAgICAgICAgICAgZGlyID0gWzAsIDFdO1xuICAgICAgICAgICAgICAgIHN0YXJ0ID0gW3Jvb20uZ2V0UmlnaHQoKSArIDEsIHJvb20uZ2V0VG9wKCldO1xuICAgICAgICAgICAgICAgIGxlbmd0aCA9IHJvb20uZ2V0Qm90dG9tKCkgLSByb29tLmdldFRvcCgpICsgMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMjpcbiAgICAgICAgICAgICAgICBkaXIgPSBbMSwgMF07XG4gICAgICAgICAgICAgICAgc3RhcnQgPSBbcm9vbS5nZXRMZWZ0KCksIHJvb20uZ2V0Qm90dG9tKCkgKyAxXTtcbiAgICAgICAgICAgICAgICBsZW5ndGggPSByb29tLmdldFJpZ2h0KCkgLSByb29tLmdldExlZnQoKSArIDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZGlyID0gWzAsIDFdO1xuICAgICAgICAgICAgICAgIHN0YXJ0ID0gW3Jvb20uZ2V0TGVmdCgpIC0gMSwgcm9vbS5nZXRUb3AoKV07XG4gICAgICAgICAgICAgICAgbGVuZ3RoID0gcm9vbS5nZXRCb3R0b20oKSAtIHJvb20uZ2V0VG9wKCkgKyAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGxldCBhdmFpbCA9IFtdO1xuICAgICAgICBsZXQgbGFzdEJhZEluZGV4ID0gLTI7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB4ID0gc3RhcnRbMF0gKyBpICogZGlyWzBdO1xuICAgICAgICAgICAgbGV0IHkgPSBzdGFydFsxXSArIGkgKiBkaXJbMV07XG4gICAgICAgICAgICBhdmFpbC5wdXNoKG51bGwpO1xuICAgICAgICAgICAgbGV0IGlzV2FsbCA9ICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XG4gICAgICAgICAgICBpZiAoaXNXYWxsKSB7XG4gICAgICAgICAgICAgICAgaWYgKGxhc3RCYWRJbmRleCAhPSBpIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBhdmFpbFtpXSA9IFt4LCB5XTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBsYXN0QmFkSW5kZXggPSBpO1xuICAgICAgICAgICAgICAgIGlmIChpKSB7XG4gICAgICAgICAgICAgICAgICAgIGF2YWlsW2kgLSAxXSA9IG51bGw7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSBhdmFpbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICAgICAgaWYgKCFhdmFpbFtpXSkge1xuICAgICAgICAgICAgICAgIGF2YWlsLnNwbGljZShpLCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKGF2YWlsLmxlbmd0aCA/IFJORy5nZXRJdGVtKGF2YWlsKSA6IG51bGwpO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBEaWcgYSBwb2x5bGluZS5cbiAgICAgKi9cbiAgICBfZGlnTGluZShwb2ludHMpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBwb2ludHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBzdGFydCA9IHBvaW50c1tpIC0gMV07XG4gICAgICAgICAgICBsZXQgZW5kID0gcG9pbnRzW2ldO1xuICAgICAgICAgICAgbGV0IGNvcnJpZG9yID0gbmV3IENvcnJpZG9yKHN0YXJ0WzBdLCBzdGFydFsxXSwgZW5kWzBdLCBlbmRbMV0pO1xuICAgICAgICAgICAgY29ycmlkb3IuY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcbiAgICAgICAgICAgIHRoaXMuX2NvcnJpZG9ycy5wdXNoKGNvcnJpZG9yKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfZGlnQ2FsbGJhY2soeCwgeSwgdmFsdWUpIHtcbiAgICAgICAgdGhpcy5fbWFwW3hdW3ldID0gdmFsdWU7XG4gICAgICAgIGlmICh2YWx1ZSA9PSAwKSB7XG4gICAgICAgICAgICB0aGlzLl9kdWcrKztcbiAgICAgICAgfVxuICAgIH1cbiAgICBfaXNXYWxsQ2FsbGJhY2soeCwgeSkge1xuICAgICAgICBpZiAoeCA8IDAgfHwgeSA8IDAgfHwgeCA+PSB0aGlzLl93aWR0aCB8fCB5ID49IHRoaXMuX2hlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xuICAgIH1cbiAgICBfY2FuQmVEdWdDYWxsYmFjayh4LCB5KSB7XG4gICAgICAgIGlmICh4IDwgMSB8fCB5IDwgMSB8fCB4ICsgMSA+PSB0aGlzLl93aWR0aCB8fCB5ICsgMSA+PSB0aGlzLl9oZWlnaHQpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKHRoaXMuX21hcFt4XVt5XSA9PSAxKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgTWFwIGZyb20gXCIuL21hcC5qc1wiO1xuaW1wb3J0IHsgRElSUyB9IGZyb20gXCIuLi9jb25zdGFudHMuanNcIjtcbmltcG9ydCBSTkcgZnJvbSBcIi4uL3JuZy5qc1wiO1xuO1xuLyoqXG4gKiBAY2xhc3MgQ2VsbHVsYXIgYXV0b21hdG9uIG1hcCBnZW5lcmF0b3JcbiAqIEBhdWdtZW50cyBST1QuTWFwXG4gKiBAcGFyYW0ge2ludH0gW3dpZHRoPVJPVC5ERUZBVUxUX1dJRFRIXVxuICogQHBhcmFtIHtpbnR9IFtoZWlnaHQ9Uk9ULkRFRkFVTFRfSEVJR0hUXVxuICogQHBhcmFtIHtvYmplY3R9IFtvcHRpb25zXSBPcHRpb25zXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5ib3JuXSBMaXN0IG9mIG5laWdoYm9yIGNvdW50cyBmb3IgYSBuZXcgY2VsbCB0byBiZSBib3JuIGluIGVtcHR5IHNwYWNlXG4gKiBAcGFyYW0ge2ludFtdfSBbb3B0aW9ucy5zdXJ2aXZlXSBMaXN0IG9mIG5laWdoYm9yIGNvdW50cyBmb3IgYW4gZXhpc3RpbmcgIGNlbGwgdG8gc3Vydml2ZVxuICogQHBhcmFtIHtpbnR9IFtvcHRpb25zLnRvcG9sb2d5XSBUb3BvbG9neSA0IG9yIDYgb3IgOFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDZWxsdWxhciBleHRlbmRzIE1hcCB7XG4gICAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB0aGlzLl9vcHRpb25zID0ge1xuICAgICAgICAgICAgYm9ybjogWzUsIDYsIDcsIDhdLFxuICAgICAgICAgICAgc3Vydml2ZTogWzQsIDUsIDYsIDcsIDhdLFxuICAgICAgICAgICAgdG9wb2xvZ3k6IDhcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5zZXRPcHRpb25zKG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9kaXJzID0gRElSU1t0aGlzLl9vcHRpb25zLnRvcG9sb2d5XTtcbiAgICAgICAgdGhpcy5fbWFwID0gdGhpcy5fZmlsbE1hcCgwKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRmlsbCB0aGUgbWFwIHdpdGggcmFuZG9tIHZhbHVlc1xuICAgICAqIEBwYXJhbSB7ZmxvYXR9IHByb2JhYmlsaXR5IFByb2JhYmlsaXR5IGZvciBhIGNlbGwgdG8gYmVjb21lIGFsaXZlOyAwID0gYWxsIGVtcHR5LCAxID0gYWxsIGZ1bGxcbiAgICAgKi9cbiAgICByYW5kb21pemUocHJvYmFiaWxpdHkpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl93aWR0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2hlaWdodDsgaisrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwW2ldW2pdID0gKFJORy5nZXRVbmlmb3JtKCkgPCBwcm9iYWJpbGl0eSA/IDEgOiAwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ2hhbmdlIG9wdGlvbnMuXG4gICAgICogQHNlZSBST1QuTWFwLkNlbGx1bGFyXG4gICAgICovXG4gICAgc2V0T3B0aW9ucyhvcHRpb25zKSB7IE9iamVjdC5hc3NpZ24odGhpcy5fb3B0aW9ucywgb3B0aW9ucyk7IH1cbiAgICBzZXQoeCwgeSwgdmFsdWUpIHsgdGhpcy5fbWFwW3hdW3ldID0gdmFsdWU7IH1cbiAgICBjcmVhdGUoY2FsbGJhY2spIHtcbiAgICAgICAgbGV0IG5ld01hcCA9IHRoaXMuX2ZpbGxNYXAoMCk7XG4gICAgICAgIGxldCBib3JuID0gdGhpcy5fb3B0aW9ucy5ib3JuO1xuICAgICAgICBsZXQgc3Vydml2ZSA9IHRoaXMuX29wdGlvbnMuc3Vydml2ZTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLl9oZWlnaHQ7IGorKykge1xuICAgICAgICAgICAgbGV0IHdpZHRoU3RlcCA9IDE7XG4gICAgICAgICAgICBsZXQgd2lkdGhTdGFydCA9IDA7XG4gICAgICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50b3BvbG9neSA9PSA2KSB7XG4gICAgICAgICAgICAgICAgd2lkdGhTdGVwID0gMjtcbiAgICAgICAgICAgICAgICB3aWR0aFN0YXJ0ID0gaiAlIDI7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gd2lkdGhTdGFydDsgaSA8IHRoaXMuX3dpZHRoOyBpICs9IHdpZHRoU3RlcCkge1xuICAgICAgICAgICAgICAgIGxldCBjdXIgPSB0aGlzLl9tYXBbaV1bal07XG4gICAgICAgICAgICAgICAgbGV0IG5jb3VudCA9IHRoaXMuX2dldE5laWdoYm9ycyhpLCBqKTtcbiAgICAgICAgICAgICAgICBpZiAoY3VyICYmIHN1cnZpdmUuaW5kZXhPZihuY291bnQpICE9IC0xKSB7IC8qIHN1cnZpdmUgKi9cbiAgICAgICAgICAgICAgICAgICAgbmV3TWFwW2ldW2pdID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSBpZiAoIWN1ciAmJiBib3JuLmluZGV4T2YobmNvdW50KSAhPSAtMSkgeyAvKiBib3JuICovXG4gICAgICAgICAgICAgICAgICAgIG5ld01hcFtpXVtqXSA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hcCA9IG5ld01hcDtcbiAgICAgICAgY2FsbGJhY2sgJiYgdGhpcy5fc2VydmljZUNhbGxiYWNrKGNhbGxiYWNrKTtcbiAgICB9XG4gICAgX3NlcnZpY2VDYWxsYmFjayhjYWxsYmFjaykge1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2hlaWdodDsgaisrKSB7XG4gICAgICAgICAgICBsZXQgd2lkdGhTdGVwID0gMTtcbiAgICAgICAgICAgIGxldCB3aWR0aFN0YXJ0ID0gMDtcbiAgICAgICAgICAgIGlmICh0aGlzLl9vcHRpb25zLnRvcG9sb2d5ID09IDYpIHtcbiAgICAgICAgICAgICAgICB3aWR0aFN0ZXAgPSAyO1xuICAgICAgICAgICAgICAgIHdpZHRoU3RhcnQgPSBqICUgMjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSB3aWR0aFN0YXJ0OyBpIDwgdGhpcy5fd2lkdGg7IGkgKz0gd2lkdGhTdGVwKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soaSwgaiwgdGhpcy5fbWFwW2ldW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBHZXQgbmVpZ2hib3IgY291bnQgYXQgW2ksal0gaW4gdGhpcy5fbWFwXG4gICAgICovXG4gICAgX2dldE5laWdoYm9ycyhjeCwgY3kpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IDA7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZGlycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRpciA9IHRoaXMuX2RpcnNbaV07XG4gICAgICAgICAgICBsZXQgeCA9IGN4ICsgZGlyWzBdO1xuICAgICAgICAgICAgbGV0IHkgPSBjeSArIGRpclsxXTtcbiAgICAgICAgICAgIGlmICh4IDwgMCB8fCB4ID49IHRoaXMuX3dpZHRoIHx8IHkgPCAwIHx8IHkgPj0gdGhpcy5faGVpZ2h0KSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQgKz0gKHRoaXMuX21hcFt4XVt5XSA9PSAxID8gMSA6IDApO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIE1ha2Ugc3VyZSBldmVyeSBub24td2FsbCBzcGFjZSBpcyBhY2Nlc3NpYmxlLlxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRvIGNhbGwgdG8gZGlzcGxheSBtYXAgd2hlbiBkb1xuICAgICAqIEBwYXJhbSB7aW50fSB2YWx1ZSB0byBjb25zaWRlciBlbXB0eSBzcGFjZSAtIGRlZmF1bHRzIHRvIDBcbiAgICAgKiBAcGFyYW0ge2Z1bmN0aW9ufSBjYWxsYmFjayB0byBjYWxsIHdoZW4gYSBuZXcgY29ubmVjdGlvbiBpcyBtYWRlXG4gICAgICovXG4gICAgY29ubmVjdChjYWxsYmFjaywgdmFsdWUsIGNvbm5lY3Rpb25DYWxsYmFjaykge1xuICAgICAgICBpZiAoIXZhbHVlKVxuICAgICAgICAgICAgdmFsdWUgPSAwO1xuICAgICAgICBsZXQgYWxsRnJlZVNwYWNlID0gW107XG4gICAgICAgIGxldCBub3RDb25uZWN0ZWQgPSB7fTtcbiAgICAgICAgLy8gZmluZCBhbGwgZnJlZSBzcGFjZVxuICAgICAgICBsZXQgd2lkdGhTdGVwID0gMTtcbiAgICAgICAgbGV0IHdpZHRoU3RhcnRzID0gWzAsIDBdO1xuICAgICAgICBpZiAodGhpcy5fb3B0aW9ucy50b3BvbG9neSA9PSA2KSB7XG4gICAgICAgICAgICB3aWR0aFN0ZXAgPSAyO1xuICAgICAgICAgICAgd2lkdGhTdGFydHMgPSBbMCwgMV07XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLl9oZWlnaHQ7IHkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeCA9IHdpZHRoU3RhcnRzW3kgJSAyXTsgeCA8IHRoaXMuX3dpZHRoOyB4ICs9IHdpZHRoU3RlcCkge1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl9mcmVlU3BhY2UoeCwgeSwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBwID0gW3gsIHldO1xuICAgICAgICAgICAgICAgICAgICBub3RDb25uZWN0ZWRbdGhpcy5fcG9pbnRLZXkocCldID0gcDtcbiAgICAgICAgICAgICAgICAgICAgYWxsRnJlZVNwYWNlLnB1c2goW3gsIHldKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHN0YXJ0ID0gYWxsRnJlZVNwYWNlW1JORy5nZXRVbmlmb3JtSW50KDAsIGFsbEZyZWVTcGFjZS5sZW5ndGggLSAxKV07XG4gICAgICAgIGxldCBrZXkgPSB0aGlzLl9wb2ludEtleShzdGFydCk7XG4gICAgICAgIGxldCBjb25uZWN0ZWQgPSB7fTtcbiAgICAgICAgY29ubmVjdGVkW2tleV0gPSBzdGFydDtcbiAgICAgICAgZGVsZXRlIG5vdENvbm5lY3RlZFtrZXldO1xuICAgICAgICAvLyBmaW5kIHdoYXQncyBjb25uZWN0ZWQgdG8gdGhlIHN0YXJ0aW5nIHBvaW50XG4gICAgICAgIHRoaXMuX2ZpbmRDb25uZWN0ZWQoY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIFtzdGFydF0sIGZhbHNlLCB2YWx1ZSk7XG4gICAgICAgIHdoaWxlIChPYmplY3Qua2V5cyhub3RDb25uZWN0ZWQpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIC8vIGZpbmQgdHdvIHBvaW50cyBmcm9tIG5vdENvbm5lY3RlZCB0byBjb25uZWN0ZWRcbiAgICAgICAgICAgIGxldCBwID0gdGhpcy5fZ2V0RnJvbVRvKGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkKTtcbiAgICAgICAgICAgIGxldCBmcm9tID0gcFswXTsgLy8gbm90Q29ubmVjdGVkXG4gICAgICAgICAgICBsZXQgdG8gPSBwWzFdOyAvLyBjb25uZWN0ZWRcbiAgICAgICAgICAgIC8vIGZpbmQgZXZlcnl0aGluZyBjb25uZWN0ZWQgdG8gdGhlIHN0YXJ0aW5nIHBvaW50XG4gICAgICAgICAgICBsZXQgbG9jYWwgPSB7fTtcbiAgICAgICAgICAgIGxvY2FsW3RoaXMuX3BvaW50S2V5KGZyb20pXSA9IGZyb207XG4gICAgICAgICAgICB0aGlzLl9maW5kQ29ubmVjdGVkKGxvY2FsLCBub3RDb25uZWN0ZWQsIFtmcm9tXSwgdHJ1ZSwgdmFsdWUpO1xuICAgICAgICAgICAgLy8gY29ubmVjdCB0byBhIGNvbm5lY3RlZCBjZWxsXG4gICAgICAgICAgICBsZXQgdHVubmVsRm4gPSAodGhpcy5fb3B0aW9ucy50b3BvbG9neSA9PSA2ID8gdGhpcy5fdHVubmVsVG9Db25uZWN0ZWQ2IDogdGhpcy5fdHVubmVsVG9Db25uZWN0ZWQpO1xuICAgICAgICAgICAgdHVubmVsRm4uY2FsbCh0aGlzLCB0bywgZnJvbSwgY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIHZhbHVlLCBjb25uZWN0aW9uQ2FsbGJhY2spO1xuICAgICAgICAgICAgLy8gbm93IGFsbCBvZiBsb2NhbCBpcyBjb25uZWN0ZWRcbiAgICAgICAgICAgIGZvciAobGV0IGsgaW4gbG9jYWwpIHtcbiAgICAgICAgICAgICAgICBsZXQgcHAgPSBsb2NhbFtrXTtcbiAgICAgICAgICAgICAgICB0aGlzLl9tYXBbcHBbMF1dW3BwWzFdXSA9IHZhbHVlO1xuICAgICAgICAgICAgICAgIGNvbm5lY3RlZFtrXSA9IHBwO1xuICAgICAgICAgICAgICAgIGRlbGV0ZSBub3RDb25uZWN0ZWRba107XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY2FsbGJhY2sgJiYgdGhpcy5fc2VydmljZUNhbGxiYWNrKGNhbGxiYWNrKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRmluZCByYW5kb20gcG9pbnRzIHRvIGNvbm5lY3QuIFNlYXJjaCBmb3IgdGhlIGNsb3Nlc3QgcG9pbnQgaW4gdGhlIGxhcmdlciBzcGFjZS5cbiAgICAgKiBUaGlzIGlzIHRvIG1pbmltaXplIHRoZSBsZW5ndGggb2YgdGhlIHBhc3NhZ2Ugd2hpbGUgbWFpbnRhaW5pbmcgZ29vZCBwZXJmb3JtYW5jZS5cbiAgICAgKi9cbiAgICBfZ2V0RnJvbVRvKGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkKSB7XG4gICAgICAgIGxldCBmcm9tID0gWzAsIDBdLCB0byA9IFswLCAwXSwgZDtcbiAgICAgICAgbGV0IGNvbm5lY3RlZEtleXMgPSBPYmplY3Qua2V5cyhjb25uZWN0ZWQpO1xuICAgICAgICBsZXQgbm90Q29ubmVjdGVkS2V5cyA9IE9iamVjdC5rZXlzKG5vdENvbm5lY3RlZCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgNTsgaSsrKSB7XG4gICAgICAgICAgICBpZiAoY29ubmVjdGVkS2V5cy5sZW5ndGggPCBub3RDb25uZWN0ZWRLZXlzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0gY29ubmVjdGVkS2V5cztcbiAgICAgICAgICAgICAgICB0byA9IGNvbm5lY3RlZFtrZXlzW1JORy5nZXRVbmlmb3JtSW50KDAsIGtleXMubGVuZ3RoIC0gMSldXTtcbiAgICAgICAgICAgICAgICBmcm9tID0gdGhpcy5fZ2V0Q2xvc2VzdCh0bywgbm90Q29ubmVjdGVkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBrZXlzID0gbm90Q29ubmVjdGVkS2V5cztcbiAgICAgICAgICAgICAgICBmcm9tID0gbm90Q29ubmVjdGVkW2tleXNbUk5HLmdldFVuaWZvcm1JbnQoMCwga2V5cy5sZW5ndGggLSAxKV1dO1xuICAgICAgICAgICAgICAgIHRvID0gdGhpcy5fZ2V0Q2xvc2VzdChmcm9tLCBjb25uZWN0ZWQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZCA9IChmcm9tWzBdIC0gdG9bMF0pICogKGZyb21bMF0gLSB0b1swXSkgKyAoZnJvbVsxXSAtIHRvWzFdKSAqIChmcm9tWzFdIC0gdG9bMV0pO1xuICAgICAgICAgICAgaWYgKGQgPCA2NCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8vIGNvbnNvbGUubG9nKFwiPj4+IGNvbm5lY3RlZD1cIiArIHRvICsgXCIgbm90Q29ubmVjdGVkPVwiICsgZnJvbSArIFwiIGRpc3Q9XCIgKyBkKTtcbiAgICAgICAgcmV0dXJuIFtmcm9tLCB0b107XG4gICAgfVxuICAgIF9nZXRDbG9zZXN0KHBvaW50LCBzcGFjZSkge1xuICAgICAgICBsZXQgbWluUG9pbnQgPSBudWxsO1xuICAgICAgICBsZXQgbWluRGlzdCA9IG51bGw7XG4gICAgICAgIGZvciAobGV0IGsgaW4gc3BhY2UpIHtcbiAgICAgICAgICAgIGxldCBwID0gc3BhY2Vba107XG4gICAgICAgICAgICBsZXQgZCA9IChwWzBdIC0gcG9pbnRbMF0pICogKHBbMF0gLSBwb2ludFswXSkgKyAocFsxXSAtIHBvaW50WzFdKSAqIChwWzFdIC0gcG9pbnRbMV0pO1xuICAgICAgICAgICAgaWYgKG1pbkRpc3QgPT0gbnVsbCB8fCBkIDwgbWluRGlzdCkge1xuICAgICAgICAgICAgICAgIG1pbkRpc3QgPSBkO1xuICAgICAgICAgICAgICAgIG1pblBvaW50ID0gcDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWluUG9pbnQ7XG4gICAgfVxuICAgIF9maW5kQ29ubmVjdGVkKGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCBzdGFjaywga2VlcE5vdENvbm5lY3RlZCwgdmFsdWUpIHtcbiAgICAgICAgd2hpbGUgKHN0YWNrLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGxldCBwID0gc3RhY2suc3BsaWNlKDAsIDEpWzBdO1xuICAgICAgICAgICAgbGV0IHRlc3RzO1xuICAgICAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kgPT0gNikge1xuICAgICAgICAgICAgICAgIHRlc3RzID0gW1xuICAgICAgICAgICAgICAgICAgICBbcFswXSArIDIsIHBbMV1dLFxuICAgICAgICAgICAgICAgICAgICBbcFswXSArIDEsIHBbMV0gLSAxXSxcbiAgICAgICAgICAgICAgICAgICAgW3BbMF0gLSAxLCBwWzFdIC0gMV0sXG4gICAgICAgICAgICAgICAgICAgIFtwWzBdIC0gMiwgcFsxXV0sXG4gICAgICAgICAgICAgICAgICAgIFtwWzBdIC0gMSwgcFsxXSArIDFdLFxuICAgICAgICAgICAgICAgICAgICBbcFswXSArIDEsIHBbMV0gKyAxXSxcbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgdGVzdHMgPSBbXG4gICAgICAgICAgICAgICAgICAgIFtwWzBdICsgMSwgcFsxXV0sXG4gICAgICAgICAgICAgICAgICAgIFtwWzBdIC0gMSwgcFsxXV0sXG4gICAgICAgICAgICAgICAgICAgIFtwWzBdLCBwWzFdICsgMV0sXG4gICAgICAgICAgICAgICAgICAgIFtwWzBdLCBwWzFdIC0gMV1cbiAgICAgICAgICAgICAgICBdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0ZXN0cy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBrZXkgPSB0aGlzLl9wb2ludEtleSh0ZXN0c1tpXSk7XG4gICAgICAgICAgICAgICAgaWYgKGNvbm5lY3RlZFtrZXldID09IG51bGwgJiYgdGhpcy5fZnJlZVNwYWNlKHRlc3RzW2ldWzBdLCB0ZXN0c1tpXVsxXSwgdmFsdWUpKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbm5lY3RlZFtrZXldID0gdGVzdHNbaV07XG4gICAgICAgICAgICAgICAgICAgIGlmICgha2VlcE5vdENvbm5lY3RlZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgZGVsZXRlIG5vdENvbm5lY3RlZFtrZXldO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHN0YWNrLnB1c2godGVzdHNbaV0pO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBfdHVubmVsVG9Db25uZWN0ZWQodG8sIGZyb20sIGNvbm5lY3RlZCwgbm90Q29ubmVjdGVkLCB2YWx1ZSwgY29ubmVjdGlvbkNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBhLCBiO1xuICAgICAgICBpZiAoZnJvbVswXSA8IHRvWzBdKSB7XG4gICAgICAgICAgICBhID0gZnJvbTtcbiAgICAgICAgICAgIGIgPSB0bztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGEgPSB0bztcbiAgICAgICAgICAgIGIgPSBmcm9tO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHh4ID0gYVswXTsgeHggPD0gYlswXTsgeHgrKykge1xuICAgICAgICAgICAgdGhpcy5fbWFwW3h4XVthWzFdXSA9IHZhbHVlO1xuICAgICAgICAgICAgbGV0IHAgPSBbeHgsIGFbMV1dO1xuICAgICAgICAgICAgbGV0IHBrZXkgPSB0aGlzLl9wb2ludEtleShwKTtcbiAgICAgICAgICAgIGNvbm5lY3RlZFtwa2V5XSA9IHA7XG4gICAgICAgICAgICBkZWxldGUgbm90Q29ubmVjdGVkW3BrZXldO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25uZWN0aW9uQ2FsbGJhY2sgJiYgYVswXSA8IGJbMF0pIHtcbiAgICAgICAgICAgIGNvbm5lY3Rpb25DYWxsYmFjayhhLCBbYlswXSwgYVsxXV0pO1xuICAgICAgICB9XG4gICAgICAgIC8vIHggaXMgbm93IGZpeGVkXG4gICAgICAgIGxldCB4ID0gYlswXTtcbiAgICAgICAgaWYgKGZyb21bMV0gPCB0b1sxXSkge1xuICAgICAgICAgICAgYSA9IGZyb207XG4gICAgICAgICAgICBiID0gdG87XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBhID0gdG87XG4gICAgICAgICAgICBiID0gZnJvbTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCB5eSA9IGFbMV07IHl5IDwgYlsxXTsgeXkrKykge1xuICAgICAgICAgICAgdGhpcy5fbWFwW3hdW3l5XSA9IHZhbHVlO1xuICAgICAgICAgICAgbGV0IHAgPSBbeCwgeXldO1xuICAgICAgICAgICAgbGV0IHBrZXkgPSB0aGlzLl9wb2ludEtleShwKTtcbiAgICAgICAgICAgIGNvbm5lY3RlZFtwa2V5XSA9IHA7XG4gICAgICAgICAgICBkZWxldGUgbm90Q29ubmVjdGVkW3BrZXldO1xuICAgICAgICB9XG4gICAgICAgIGlmIChjb25uZWN0aW9uQ2FsbGJhY2sgJiYgYVsxXSA8IGJbMV0pIHtcbiAgICAgICAgICAgIGNvbm5lY3Rpb25DYWxsYmFjayhbYlswXSwgYVsxXV0sIFtiWzBdLCBiWzFdXSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3R1bm5lbFRvQ29ubmVjdGVkNih0bywgZnJvbSwgY29ubmVjdGVkLCBub3RDb25uZWN0ZWQsIHZhbHVlLCBjb25uZWN0aW9uQ2FsbGJhY2spIHtcbiAgICAgICAgbGV0IGEsIGI7XG4gICAgICAgIGlmIChmcm9tWzBdIDwgdG9bMF0pIHtcbiAgICAgICAgICAgIGEgPSBmcm9tO1xuICAgICAgICAgICAgYiA9IHRvO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgYSA9IHRvO1xuICAgICAgICAgICAgYiA9IGZyb207XG4gICAgICAgIH1cbiAgICAgICAgLy8gdHVubmVsIGRpYWdvbmFsbHkgdW50aWwgaG9yaXpvbnRhbGx5IGxldmVsXG4gICAgICAgIGxldCB4eCA9IGFbMF07XG4gICAgICAgIGxldCB5eSA9IGFbMV07XG4gICAgICAgIHdoaWxlICghKHh4ID09IGJbMF0gJiYgeXkgPT0gYlsxXSkpIHtcbiAgICAgICAgICAgIGxldCBzdGVwV2lkdGggPSAyO1xuICAgICAgICAgICAgaWYgKHl5IDwgYlsxXSkge1xuICAgICAgICAgICAgICAgIHl5Kys7XG4gICAgICAgICAgICAgICAgc3RlcFdpZHRoID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYgKHl5ID4gYlsxXSkge1xuICAgICAgICAgICAgICAgIHl5LS07XG4gICAgICAgICAgICAgICAgc3RlcFdpZHRoID0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh4eCA8IGJbMF0pIHtcbiAgICAgICAgICAgICAgICB4eCArPSBzdGVwV2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmICh4eCA+IGJbMF0pIHtcbiAgICAgICAgICAgICAgICB4eCAtPSBzdGVwV2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmIChiWzFdICUgMikge1xuICAgICAgICAgICAgICAgIC8vIFdvbid0IHN0ZXAgb3V0c2lkZSBtYXAgaWYgZGVzdGluYXRpb24gb24gaXMgbWFwJ3MgcmlnaHQgZWRnZVxuICAgICAgICAgICAgICAgIHh4IC09IHN0ZXBXaWR0aDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIGRpdHRvIGZvciBsZWZ0IGVkZ2VcbiAgICAgICAgICAgICAgICB4eCArPSBzdGVwV2lkdGg7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9tYXBbeHhdW3l5XSA9IHZhbHVlO1xuICAgICAgICAgICAgbGV0IHAgPSBbeHgsIHl5XTtcbiAgICAgICAgICAgIGxldCBwa2V5ID0gdGhpcy5fcG9pbnRLZXkocCk7XG4gICAgICAgICAgICBjb25uZWN0ZWRbcGtleV0gPSBwO1xuICAgICAgICAgICAgZGVsZXRlIG5vdENvbm5lY3RlZFtwa2V5XTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY29ubmVjdGlvbkNhbGxiYWNrKSB7XG4gICAgICAgICAgICBjb25uZWN0aW9uQ2FsbGJhY2soZnJvbSwgdG8pO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9mcmVlU3BhY2UoeCwgeSwgdmFsdWUpIHtcbiAgICAgICAgcmV0dXJuIHggPj0gMCAmJiB4IDwgdGhpcy5fd2lkdGggJiYgeSA+PSAwICYmIHkgPCB0aGlzLl9oZWlnaHQgJiYgdGhpcy5fbWFwW3hdW3ldID09IHZhbHVlO1xuICAgIH1cbiAgICBfcG9pbnRLZXkocCkgeyByZXR1cm4gcFswXSArIFwiLlwiICsgcFsxXTsgfVxufVxuIiwiaW1wb3J0IER1bmdlb24gZnJvbSBcIi4vZHVuZ2Vvbi5qc1wiO1xuaW1wb3J0IHsgUm9vbSwgQ29ycmlkb3IgfSBmcm9tIFwiLi9mZWF0dXJlcy5qc1wiO1xuaW1wb3J0IFJORyBmcm9tIFwiLi4vcm5nLmpzXCI7XG5pbXBvcnQgeyBESVJTIH0gZnJvbSBcIi4uL2NvbnN0YW50cy5qc1wiO1xuY29uc3QgRkVBVFVSRVMgPSB7XG4gICAgXCJyb29tXCI6IFJvb20sXG4gICAgXCJjb3JyaWRvclwiOiBDb3JyaWRvclxufTtcbi8qKlxuICogUmFuZG9tIGR1bmdlb24gZ2VuZXJhdG9yIHVzaW5nIGh1bWFuLWxpa2UgZGlnZ2luZyBwYXR0ZXJucy5cbiAqIEhlYXZpbHkgYmFzZWQgb24gTWlrZSBBbmRlcnNvbidzIGlkZWFzIGZyb20gdGhlIFwiVHlyYW50XCIgYWxnbywgbWVudGlvbmVkIGF0XG4gKiBodHRwOi8vd3d3LnJvZ3VlYmFzaW4ucm9ndWVsaWtlZGV2ZWxvcG1lbnQub3JnL2luZGV4LnBocD90aXRsZT1EdW5nZW9uLUJ1aWxkaW5nX0FsZ29yaXRobS5cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlnZ2VyIGV4dGVuZHMgRHVuZ2VvbiB7XG4gICAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCwgb3B0aW9ucyA9IHt9KSB7XG4gICAgICAgIHN1cGVyKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB0aGlzLl9vcHRpb25zID0gT2JqZWN0LmFzc2lnbih7XG4gICAgICAgICAgICByb29tV2lkdGg6IFszLCA5XSxcbiAgICAgICAgICAgIHJvb21IZWlnaHQ6IFszLCA1XSxcbiAgICAgICAgICAgIGNvcnJpZG9yTGVuZ3RoOiBbMywgMTBdLFxuICAgICAgICAgICAgZHVnUGVyY2VudGFnZTogMC4yLFxuICAgICAgICAgICAgdGltZUxpbWl0OiAxMDAwIC8qIHdlIHN0b3AgYWZ0ZXIgdGhpcyBtdWNoIHRpbWUgaGFzIHBhc3NlZCAobXNlYykgKi9cbiAgICAgICAgfSwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX2ZlYXR1cmVzID0ge1xuICAgICAgICAgICAgXCJyb29tXCI6IDQsXG4gICAgICAgICAgICBcImNvcnJpZG9yXCI6IDRcbiAgICAgICAgfTtcbiAgICAgICAgdGhpcy5fbWFwID0gW107XG4gICAgICAgIHRoaXMuX2ZlYXR1cmVBdHRlbXB0cyA9IDIwOyAvKiBob3cgbWFueSB0aW1lcyBkbyB3ZSB0cnkgdG8gY3JlYXRlIGEgZmVhdHVyZSBvbiBhIHN1aXRhYmxlIHdhbGwgKi9cbiAgICAgICAgdGhpcy5fd2FsbHMgPSB7fTsgLyogdGhlc2UgYXJlIGF2YWlsYWJsZSBmb3IgZGlnZ2luZyAqL1xuICAgICAgICB0aGlzLl9kdWcgPSAwO1xuICAgICAgICB0aGlzLl9kaWdDYWxsYmFjayA9IHRoaXMuX2RpZ0NhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2NhbkJlRHVnQ2FsbGJhY2sgPSB0aGlzLl9jYW5CZUR1Z0NhbGxiYWNrLmJpbmQodGhpcyk7XG4gICAgICAgIHRoaXMuX2lzV2FsbENhbGxiYWNrID0gdGhpcy5faXNXYWxsQ2FsbGJhY2suYmluZCh0aGlzKTtcbiAgICAgICAgdGhpcy5fcHJpb3JpdHlXYWxsQ2FsbGJhY2sgPSB0aGlzLl9wcmlvcml0eVdhbGxDYWxsYmFjay5iaW5kKHRoaXMpO1xuICAgIH1cbiAgICBjcmVhdGUoY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5fcm9vbXMgPSBbXTtcbiAgICAgICAgdGhpcy5fY29ycmlkb3JzID0gW107XG4gICAgICAgIHRoaXMuX21hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XG4gICAgICAgIHRoaXMuX3dhbGxzID0ge307XG4gICAgICAgIHRoaXMuX2R1ZyA9IDA7XG4gICAgICAgIGxldCBhcmVhID0gKHRoaXMuX3dpZHRoIC0gMikgKiAodGhpcy5faGVpZ2h0IC0gMik7XG4gICAgICAgIHRoaXMuX2ZpcnN0Um9vbSgpO1xuICAgICAgICBsZXQgdDEgPSBEYXRlLm5vdygpO1xuICAgICAgICBsZXQgcHJpb3JpdHlXYWxscztcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgcHJpb3JpdHlXYWxscyA9IDA7XG4gICAgICAgICAgICBsZXQgdDIgPSBEYXRlLm5vdygpO1xuICAgICAgICAgICAgaWYgKHQyIC0gdDEgPiB0aGlzLl9vcHRpb25zLnRpbWVMaW1pdCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLyogZmluZCBhIGdvb2Qgd2FsbCAqL1xuICAgICAgICAgICAgbGV0IHdhbGwgPSB0aGlzLl9maW5kV2FsbCgpO1xuICAgICAgICAgICAgaWYgKCF3YWxsKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9IC8qIG5vIG1vcmUgd2FsbHMgKi9cbiAgICAgICAgICAgIGxldCBwYXJ0cyA9IHdhbGwuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgbGV0IHggPSBwYXJzZUludChwYXJ0c1swXSk7XG4gICAgICAgICAgICBsZXQgeSA9IHBhcnNlSW50KHBhcnRzWzFdKTtcbiAgICAgICAgICAgIGxldCBkaXIgPSB0aGlzLl9nZXREaWdnaW5nRGlyZWN0aW9uKHgsIHkpO1xuICAgICAgICAgICAgaWYgKCFkaXIpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH0gLyogdGhpcyB3YWxsIGlzIG5vdCBzdWl0YWJsZSAqL1xuICAgICAgICAgICAgLy9cdFx0Y29uc29sZS5sb2coXCJ3YWxsXCIsIHgsIHkpO1xuICAgICAgICAgICAgLyogdHJ5IGFkZGluZyBhIGZlYXR1cmUgKi9cbiAgICAgICAgICAgIGxldCBmZWF0dXJlQXR0ZW1wdHMgPSAwO1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIGZlYXR1cmVBdHRlbXB0cysrO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLl90cnlGZWF0dXJlKHgsIHksIGRpclswXSwgZGlyWzFdKSkgeyAvKiBmZWF0dXJlIGFkZGVkICovXG4gICAgICAgICAgICAgICAgICAgIC8vaWYgKHRoaXMuX3Jvb21zLmxlbmd0aCArIHRoaXMuX2NvcnJpZG9ycy5sZW5ndGggPT0gMikgeyB0aGlzLl9yb29tc1swXS5hZGREb29yKHgsIHkpOyB9IC8qIGZpcnN0IHJvb20gb2ZpY2lhbGx5IGhhcyBkb29ycyAqL1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVTdXJyb3VuZGluZ1dhbGxzKHgsIHkpO1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9yZW1vdmVTdXJyb3VuZGluZ1dhbGxzKHggLSBkaXJbMF0sIHkgLSBkaXJbMV0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlIChmZWF0dXJlQXR0ZW1wdHMgPCB0aGlzLl9mZWF0dXJlQXR0ZW1wdHMpO1xuICAgICAgICAgICAgZm9yIChsZXQgaWQgaW4gdGhpcy5fd2FsbHMpIHtcbiAgICAgICAgICAgICAgICBpZiAodGhpcy5fd2FsbHNbaWRdID4gMSkge1xuICAgICAgICAgICAgICAgICAgICBwcmlvcml0eVdhbGxzKys7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9IHdoaWxlICh0aGlzLl9kdWcgLyBhcmVhIDwgdGhpcy5fb3B0aW9ucy5kdWdQZXJjZW50YWdlIHx8IHByaW9yaXR5V2FsbHMpOyAvKiBmaXhtZSBudW1iZXIgb2YgcHJpb3JpdHkgd2FsbHMgKi9cbiAgICAgICAgdGhpcy5fYWRkRG9vcnMoKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3dpZHRoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2hlaWdodDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGksIGosIHRoaXMuX21hcFtpXVtqXSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3dhbGxzID0ge307XG4gICAgICAgIHRoaXMuX21hcCA9IFtdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgX2RpZ0NhbGxiYWNrKHgsIHksIHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PSAwIHx8IHZhbHVlID09IDIpIHsgLyogZW1wdHkgKi9cbiAgICAgICAgICAgIHRoaXMuX21hcFt4XVt5XSA9IDA7XG4gICAgICAgICAgICB0aGlzLl9kdWcrKztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHsgLyogd2FsbCAqL1xuICAgICAgICAgICAgdGhpcy5fd2FsbHNbeCArIFwiLFwiICsgeV0gPSAxO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9pc1dhbGxDYWxsYmFjayh4LCB5KSB7XG4gICAgICAgIGlmICh4IDwgMCB8fCB5IDwgMCB8fCB4ID49IHRoaXMuX3dpZHRoIHx8IHkgPj0gdGhpcy5faGVpZ2h0KSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuICh0aGlzLl9tYXBbeF1beV0gPT0gMSk7XG4gICAgfVxuICAgIF9jYW5CZUR1Z0NhbGxiYWNrKHgsIHkpIHtcbiAgICAgICAgaWYgKHggPCAxIHx8IHkgPCAxIHx8IHggKyAxID49IHRoaXMuX3dpZHRoIHx8IHkgKyAxID49IHRoaXMuX2hlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiAodGhpcy5fbWFwW3hdW3ldID09IDEpO1xuICAgIH1cbiAgICBfcHJpb3JpdHlXYWxsQ2FsbGJhY2soeCwgeSkgeyB0aGlzLl93YWxsc1t4ICsgXCIsXCIgKyB5XSA9IDI7IH1cbiAgICA7XG4gICAgX2ZpcnN0Um9vbSgpIHtcbiAgICAgICAgbGV0IGN4ID0gTWF0aC5mbG9vcih0aGlzLl93aWR0aCAvIDIpO1xuICAgICAgICBsZXQgY3kgPSBNYXRoLmZsb29yKHRoaXMuX2hlaWdodCAvIDIpO1xuICAgICAgICBsZXQgcm9vbSA9IFJvb20uY3JlYXRlUmFuZG9tQ2VudGVyKGN4LCBjeSwgdGhpcy5fb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX3Jvb21zLnB1c2gocm9vbSk7XG4gICAgICAgIHJvb20uY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogR2V0IGEgc3VpdGFibGUgd2FsbFxuICAgICAqL1xuICAgIF9maW5kV2FsbCgpIHtcbiAgICAgICAgbGV0IHByaW8xID0gW107XG4gICAgICAgIGxldCBwcmlvMiA9IFtdO1xuICAgICAgICBmb3IgKGxldCBpZCBpbiB0aGlzLl93YWxscykge1xuICAgICAgICAgICAgbGV0IHByaW8gPSB0aGlzLl93YWxsc1tpZF07XG4gICAgICAgICAgICBpZiAocHJpbyA9PSAyKSB7XG4gICAgICAgICAgICAgICAgcHJpbzIucHVzaChpZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICBwcmlvMS5wdXNoKGlkKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBsZXQgYXJyID0gKHByaW8yLmxlbmd0aCA/IHByaW8yIDogcHJpbzEpO1xuICAgICAgICBpZiAoIWFyci5sZW5ndGgpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9IC8qIG5vIHdhbGxzIDovICovXG4gICAgICAgIGxldCBpZCA9IFJORy5nZXRJdGVtKGFyci5zb3J0KCkpOyAvLyBzb3J0IHRvIG1ha2UgdGhlIG9yZGVyIGRldGVybWluaXN0aWNcbiAgICAgICAgZGVsZXRlIHRoaXMuX3dhbGxzW2lkXTtcbiAgICAgICAgcmV0dXJuIGlkO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBUcmllcyBhZGRpbmcgYSBmZWF0dXJlXG4gICAgICogQHJldHVybnMge2Jvb2x9IHdhcyB0aGlzIGEgc3VjY2Vzc2Z1bCB0cnk/XG4gICAgICovXG4gICAgX3RyeUZlYXR1cmUoeCwgeSwgZHgsIGR5KSB7XG4gICAgICAgIGxldCBmZWF0dXJlTmFtZSA9IFJORy5nZXRXZWlnaHRlZFZhbHVlKHRoaXMuX2ZlYXR1cmVzKTtcbiAgICAgICAgbGV0IGN0b3IgPSBGRUFUVVJFU1tmZWF0dXJlTmFtZV07XG4gICAgICAgIGxldCBmZWF0dXJlID0gY3Rvci5jcmVhdGVSYW5kb21BdCh4LCB5LCBkeCwgZHksIHRoaXMuX29wdGlvbnMpO1xuICAgICAgICBpZiAoIWZlYXR1cmUuaXNWYWxpZCh0aGlzLl9pc1dhbGxDYWxsYmFjaywgdGhpcy5fY2FuQmVEdWdDYWxsYmFjaykpIHtcbiAgICAgICAgICAgIC8vXHRcdGNvbnNvbGUubG9nKFwibm90IHZhbGlkXCIpO1xuICAgICAgICAgICAgLy9cdFx0ZmVhdHVyZS5kZWJ1ZygpO1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIGZlYXR1cmUuY3JlYXRlKHRoaXMuX2RpZ0NhbGxiYWNrKTtcbiAgICAgICAgLy9cdGZlYXR1cmUuZGVidWcoKTtcbiAgICAgICAgaWYgKGZlYXR1cmUgaW5zdGFuY2VvZiBSb29tKSB7XG4gICAgICAgICAgICB0aGlzLl9yb29tcy5wdXNoKGZlYXR1cmUpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChmZWF0dXJlIGluc3RhbmNlb2YgQ29ycmlkb3IpIHtcbiAgICAgICAgICAgIGZlYXR1cmUuY3JlYXRlUHJpb3JpdHlXYWxscyh0aGlzLl9wcmlvcml0eVdhbGxDYWxsYmFjayk7XG4gICAgICAgICAgICB0aGlzLl9jb3JyaWRvcnMucHVzaChmZWF0dXJlKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgX3JlbW92ZVN1cnJvdW5kaW5nV2FsbHMoY3gsIGN5KSB7XG4gICAgICAgIGxldCBkZWx0YXMgPSBESVJTWzRdO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRlbHRhcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGRlbHRhID0gZGVsdGFzW2ldO1xuICAgICAgICAgICAgbGV0IHggPSBjeCArIGRlbHRhWzBdO1xuICAgICAgICAgICAgbGV0IHkgPSBjeSArIGRlbHRhWzFdO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3dhbGxzW3ggKyBcIixcIiArIHldO1xuICAgICAgICAgICAgeCA9IGN4ICsgMiAqIGRlbHRhWzBdO1xuICAgICAgICAgICAgeSA9IGN5ICsgMiAqIGRlbHRhWzFdO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3dhbGxzW3ggKyBcIixcIiArIHldO1xuICAgICAgICB9XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJldHVybnMgdmVjdG9yIGluIFwiZGlnZ2luZ1wiIGRpcmVjdGlvbiwgb3IgZmFsc2UsIGlmIHRoaXMgZG9lcyBub3QgZXhpc3QgKG9yIGlzIG5vdCB1bmlxdWUpXG4gICAgICovXG4gICAgX2dldERpZ2dpbmdEaXJlY3Rpb24oY3gsIGN5KSB7XG4gICAgICAgIGlmIChjeCA8PSAwIHx8IGN5IDw9IDAgfHwgY3ggPj0gdGhpcy5fd2lkdGggLSAxIHx8IGN5ID49IHRoaXMuX2hlaWdodCAtIDEpIHtcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG4gICAgICAgIGxldCByZXN1bHQgPSBudWxsO1xuICAgICAgICBsZXQgZGVsdGFzID0gRElSU1s0XTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkZWx0YXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCBkZWx0YSA9IGRlbHRhc1tpXTtcbiAgICAgICAgICAgIGxldCB4ID0gY3ggKyBkZWx0YVswXTtcbiAgICAgICAgICAgIGxldCB5ID0gY3kgKyBkZWx0YVsxXTtcbiAgICAgICAgICAgIGlmICghdGhpcy5fbWFwW3hdW3ldKSB7IC8qIHRoZXJlIGFscmVhZHkgaXMgYW5vdGhlciBlbXB0eSBuZWlnaGJvciEgKi9cbiAgICAgICAgICAgICAgICBpZiAocmVzdWx0KSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBkZWx0YTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICAvKiBubyBlbXB0eSBuZWlnaGJvciAqL1xuICAgICAgICBpZiAoIXJlc3VsdCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFstcmVzdWx0WzBdLCAtcmVzdWx0WzFdXTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogRmluZCBlbXB0eSBzcGFjZXMgc3Vycm91bmRpbmcgcm9vbXMsIGFuZCBhcHBseSBkb29ycy5cbiAgICAgKi9cbiAgICBfYWRkRG9vcnMoKSB7XG4gICAgICAgIGxldCBkYXRhID0gdGhpcy5fbWFwO1xuICAgICAgICBmdW5jdGlvbiBpc1dhbGxDYWxsYmFjayh4LCB5KSB7XG4gICAgICAgICAgICByZXR1cm4gKGRhdGFbeF1beV0gPT0gMSk7XG4gICAgICAgIH1cbiAgICAgICAgO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3Jvb21zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgcm9vbSA9IHRoaXMuX3Jvb21zW2ldO1xuICAgICAgICAgICAgcm9vbS5jbGVhckRvb3JzKCk7XG4gICAgICAgICAgICByb29tLmFkZERvb3JzKGlzV2FsbENhbGxiYWNrKTtcbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCBNYXAgZnJvbSBcIi4vbWFwLmpzXCI7XG5pbXBvcnQgUk5HIGZyb20gXCIuLi9ybmcuanNcIjtcbi8qKlxuICogSm9pbiBsaXN0cyB3aXRoIFwiaVwiIGFuZCBcImkrMVwiXG4gKi9cbmZ1bmN0aW9uIGFkZFRvTGlzdChpLCBMLCBSKSB7XG4gICAgUltMW2kgKyAxXV0gPSBSW2ldO1xuICAgIExbUltpXV0gPSBMW2kgKyAxXTtcbiAgICBSW2ldID0gaSArIDE7XG4gICAgTFtpICsgMV0gPSBpO1xufVxuLyoqXG4gKiBSZW1vdmUgXCJpXCIgZnJvbSBpdHMgbGlzdFxuICovXG5mdW5jdGlvbiByZW1vdmVGcm9tTGlzdChpLCBMLCBSKSB7XG4gICAgUltMW2ldXSA9IFJbaV07XG4gICAgTFtSW2ldXSA9IExbaV07XG4gICAgUltpXSA9IGk7XG4gICAgTFtpXSA9IGk7XG59XG4vKipcbiAqIE1hemUgZ2VuZXJhdG9yIC0gRWxsZXIncyBhbGdvcml0aG1cbiAqIFNlZSBodHRwOi8vaG9tZXBhZ2VzLmN3aS5ubC9+dHJvbXAvbWF6ZS5odG1sIGZvciBleHBsYW5hdGlvblxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbGxlck1hemUgZXh0ZW5kcyBNYXAge1xuICAgIGNyZWF0ZShjYWxsYmFjaykge1xuICAgICAgICBsZXQgbWFwID0gdGhpcy5fZmlsbE1hcCgxKTtcbiAgICAgICAgbGV0IHcgPSBNYXRoLmNlaWwoKHRoaXMuX3dpZHRoIC0gMikgLyAyKTtcbiAgICAgICAgbGV0IHJhbmQgPSA5IC8gMjQ7XG4gICAgICAgIGxldCBMID0gW107XG4gICAgICAgIGxldCBSID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdzsgaSsrKSB7XG4gICAgICAgICAgICBMLnB1c2goaSk7XG4gICAgICAgICAgICBSLnB1c2goaSk7XG4gICAgICAgIH1cbiAgICAgICAgTC5wdXNoKHcgLSAxKTsgLyogZmFrZSBzdG9wLWJsb2NrIGF0IHRoZSByaWdodCBzaWRlICovXG4gICAgICAgIGxldCBqO1xuICAgICAgICBmb3IgKGogPSAxOyBqICsgMyA8IHRoaXMuX2hlaWdodDsgaiArPSAyKSB7XG4gICAgICAgICAgICAvKiBvbmUgcm93ICovXG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHc7IGkrKykge1xuICAgICAgICAgICAgICAgIC8qIGNlbGwgY29vcmRzICh3aWxsIGJlIGFsd2F5cyBlbXB0eSkgKi9cbiAgICAgICAgICAgICAgICBsZXQgeCA9IDIgKiBpICsgMTtcbiAgICAgICAgICAgICAgICBsZXQgeSA9IGo7XG4gICAgICAgICAgICAgICAgbWFwW3hdW3ldID0gMDtcbiAgICAgICAgICAgICAgICAvKiByaWdodCBjb25uZWN0aW9uICovXG4gICAgICAgICAgICAgICAgaWYgKGkgIT0gTFtpICsgMV0gJiYgUk5HLmdldFVuaWZvcm0oKSA+IHJhbmQpIHtcbiAgICAgICAgICAgICAgICAgICAgYWRkVG9MaXN0KGksIEwsIFIpO1xuICAgICAgICAgICAgICAgICAgICBtYXBbeCArIDFdW3ldID0gMDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgLyogYm90dG9tIGNvbm5lY3Rpb24gKi9cbiAgICAgICAgICAgICAgICBpZiAoaSAhPSBMW2ldICYmIFJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSB7XG4gICAgICAgICAgICAgICAgICAgIC8qIHJlbW92ZSBjb25uZWN0aW9uICovXG4gICAgICAgICAgICAgICAgICAgIHJlbW92ZUZyb21MaXN0KGksIEwsIFIpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLyogY3JlYXRlIGNvbm5lY3Rpb24gKi9cbiAgICAgICAgICAgICAgICAgICAgbWFwW3hdW3kgKyAxXSA9IDA7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIC8qIGxhc3Qgcm93ICovXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdzsgaSsrKSB7XG4gICAgICAgICAgICAvKiBjZWxsIGNvb3JkcyAod2lsbCBiZSBhbHdheXMgZW1wdHkpICovXG4gICAgICAgICAgICBsZXQgeCA9IDIgKiBpICsgMTtcbiAgICAgICAgICAgIGxldCB5ID0gajtcbiAgICAgICAgICAgIG1hcFt4XVt5XSA9IDA7XG4gICAgICAgICAgICAvKiByaWdodCBjb25uZWN0aW9uICovXG4gICAgICAgICAgICBpZiAoaSAhPSBMW2kgKyAxXSAmJiAoaSA9PSBMW2ldIHx8IFJORy5nZXRVbmlmb3JtKCkgPiByYW5kKSkge1xuICAgICAgICAgICAgICAgIC8qIGRpZyByaWdodCBhbHNvIGlmIHRoZSBjZWxsIGlzIHNlcGFyYXRlZCwgc28gaXQgZ2V0cyBjb25uZWN0ZWQgdG8gdGhlIHJlc3Qgb2YgbWF6ZSAqL1xuICAgICAgICAgICAgICAgIGFkZFRvTGlzdChpLCBMLCBSKTtcbiAgICAgICAgICAgICAgICBtYXBbeCArIDFdW3ldID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJlbW92ZUZyb21MaXN0KGksIEwsIFIpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fd2lkdGg7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLl9oZWlnaHQ7IGorKykge1xuICAgICAgICAgICAgICAgIGNhbGxiYWNrKGksIGosIG1hcFtpXVtqXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxufVxuIiwiaW1wb3J0IE1hcCBmcm9tIFwiLi9tYXAuanNcIjtcbmltcG9ydCBSTkcgZnJvbSBcIi4uL3JuZy5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgUmVjdXJzaXZlbHkgZGl2aWRlZCBtYXplLCBodHRwOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL01hemVfZ2VuZXJhdGlvbl9hbGdvcml0aG0jUmVjdXJzaXZlX2RpdmlzaW9uX21ldGhvZFxuICogQGF1Z21lbnRzIFJPVC5NYXBcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGl2aWRlZE1hemUgZXh0ZW5kcyBNYXAge1xuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBzdXBlciguLi5hcmd1bWVudHMpO1xuICAgICAgICB0aGlzLl9zdGFjayA9IFtdO1xuICAgICAgICB0aGlzLl9tYXAgPSBbXTtcbiAgICB9XG4gICAgY3JlYXRlKGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCB3ID0gdGhpcy5fd2lkdGg7XG4gICAgICAgIGxldCBoID0gdGhpcy5faGVpZ2h0O1xuICAgICAgICB0aGlzLl9tYXAgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB3OyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX21hcC5wdXNoKFtdKTtcbiAgICAgICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgaDsgaisrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGJvcmRlciA9IChpID09IDAgfHwgaiA9PSAwIHx8IGkgKyAxID09IHcgfHwgaiArIDEgPT0gaCk7XG4gICAgICAgICAgICAgICAgdGhpcy5fbWFwW2ldLnB1c2goYm9yZGVyID8gMSA6IDApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N0YWNrID0gW1xuICAgICAgICAgICAgWzEsIDEsIHcgLSAyLCBoIC0gMl1cbiAgICAgICAgXTtcbiAgICAgICAgdGhpcy5fcHJvY2VzcygpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHc7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBoOyBqKyspIHtcbiAgICAgICAgICAgICAgICBjYWxsYmFjayhpLCBqLCB0aGlzLl9tYXBbaV1bal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX21hcCA9IFtdO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgX3Byb2Nlc3MoKSB7XG4gICAgICAgIHdoaWxlICh0aGlzLl9zdGFjay5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCByb29tID0gdGhpcy5fc3RhY2suc2hpZnQoKTsgLyogW2xlZnQsIHRvcCwgcmlnaHQsIGJvdHRvbV0gKi9cbiAgICAgICAgICAgIHRoaXMuX3BhcnRpdGlvblJvb20ocm9vbSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgX3BhcnRpdGlvblJvb20ocm9vbSkge1xuICAgICAgICBsZXQgYXZhaWxYID0gW107XG4gICAgICAgIGxldCBhdmFpbFkgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IHJvb21bMF0gKyAxOyBpIDwgcm9vbVsyXTsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdG9wID0gdGhpcy5fbWFwW2ldW3Jvb21bMV0gLSAxXTtcbiAgICAgICAgICAgIGxldCBib3R0b20gPSB0aGlzLl9tYXBbaV1bcm9vbVszXSArIDFdO1xuICAgICAgICAgICAgaWYgKHRvcCAmJiBib3R0b20gJiYgIShpICUgMikpIHtcbiAgICAgICAgICAgICAgICBhdmFpbFgucHVzaChpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBqID0gcm9vbVsxXSArIDE7IGogPCByb29tWzNdOyBqKyspIHtcbiAgICAgICAgICAgIGxldCBsZWZ0ID0gdGhpcy5fbWFwW3Jvb21bMF0gLSAxXVtqXTtcbiAgICAgICAgICAgIGxldCByaWdodCA9IHRoaXMuX21hcFtyb29tWzJdICsgMV1bal07XG4gICAgICAgICAgICBpZiAobGVmdCAmJiByaWdodCAmJiAhKGogJSAyKSkge1xuICAgICAgICAgICAgICAgIGF2YWlsWS5wdXNoKGopO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGlmICghYXZhaWxYLmxlbmd0aCB8fCAhYXZhaWxZLmxlbmd0aCkge1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICAgIGxldCB4ID0gUk5HLmdldEl0ZW0oYXZhaWxYKTtcbiAgICAgICAgbGV0IHkgPSBSTkcuZ2V0SXRlbShhdmFpbFkpO1xuICAgICAgICB0aGlzLl9tYXBbeF1beV0gPSAxO1xuICAgICAgICBsZXQgd2FsbHMgPSBbXTtcbiAgICAgICAgbGV0IHcgPSBbXTtcbiAgICAgICAgd2FsbHMucHVzaCh3KTsgLyogbGVmdCBwYXJ0ICovXG4gICAgICAgIGZvciAobGV0IGkgPSByb29tWzBdOyBpIDwgeDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXBbaV1beV0gPSAxO1xuICAgICAgICAgICAgdy5wdXNoKFtpLCB5XSk7XG4gICAgICAgIH1cbiAgICAgICAgdyA9IFtdO1xuICAgICAgICB3YWxscy5wdXNoKHcpOyAvKiByaWdodCBwYXJ0ICovXG4gICAgICAgIGZvciAobGV0IGkgPSB4ICsgMTsgaSA8PSByb29tWzJdOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX21hcFtpXVt5XSA9IDE7XG4gICAgICAgICAgICB3LnB1c2goW2ksIHldKTtcbiAgICAgICAgfVxuICAgICAgICB3ID0gW107XG4gICAgICAgIHdhbGxzLnB1c2godyk7IC8qIHRvcCBwYXJ0ICovXG4gICAgICAgIGZvciAobGV0IGogPSByb29tWzFdOyBqIDwgeTsgaisrKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXBbeF1bal0gPSAxO1xuICAgICAgICAgICAgdy5wdXNoKFt4LCBqXSk7XG4gICAgICAgIH1cbiAgICAgICAgdyA9IFtdO1xuICAgICAgICB3YWxscy5wdXNoKHcpOyAvKiBib3R0b20gcGFydCAqL1xuICAgICAgICBmb3IgKGxldCBqID0geSArIDE7IGogPD0gcm9vbVszXTsgaisrKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXBbeF1bal0gPSAxO1xuICAgICAgICAgICAgdy5wdXNoKFt4LCBqXSk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHNvbGlkID0gUk5HLmdldEl0ZW0od2FsbHMpO1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHdhbGxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdyA9IHdhbGxzW2ldO1xuICAgICAgICAgICAgaWYgKHcgPT0gc29saWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGxldCBob2xlID0gUk5HLmdldEl0ZW0odyk7XG4gICAgICAgICAgICB0aGlzLl9tYXBbaG9sZVswXV1baG9sZVsxXV0gPSAwO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3N0YWNrLnB1c2goW3Jvb21bMF0sIHJvb21bMV0sIHggLSAxLCB5IC0gMV0pOyAvKiBsZWZ0IHRvcCAqL1xuICAgICAgICB0aGlzLl9zdGFjay5wdXNoKFt4ICsgMSwgcm9vbVsxXSwgcm9vbVsyXSwgeSAtIDFdKTsgLyogcmlnaHQgdG9wICovXG4gICAgICAgIHRoaXMuX3N0YWNrLnB1c2goW3Jvb21bMF0sIHkgKyAxLCB4IC0gMSwgcm9vbVszXV0pOyAvKiBsZWZ0IGJvdHRvbSAqL1xuICAgICAgICB0aGlzLl9zdGFjay5wdXNoKFt4ICsgMSwgeSArIDEsIHJvb21bMl0sIHJvb21bM11dKTsgLyogcmlnaHQgYm90dG9tICovXG4gICAgfVxufVxuIiwiaW1wb3J0IE1hcCBmcm9tIFwiLi9tYXAuanNcIjtcbmltcG9ydCBSTkcgZnJvbSBcIi4uL3JuZy5qc1wiO1xuLyoqXG4gKiBJY2V5J3MgTWF6ZSBnZW5lcmF0b3JcbiAqIFNlZSBodHRwOi8vd3d3LnJvZ3VlYmFzaW4ucm9ndWVsaWtlZGV2ZWxvcG1lbnQub3JnL2luZGV4LnBocD90aXRsZT1TaW1wbGVfbWF6ZSBmb3IgZXhwbGFuYXRpb25cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSWNleU1hemUgZXh0ZW5kcyBNYXAge1xuICAgIGNvbnN0cnVjdG9yKHdpZHRoLCBoZWlnaHQsIHJlZ3VsYXJpdHkgPSAwKSB7XG4gICAgICAgIHN1cGVyKHdpZHRoLCBoZWlnaHQpO1xuICAgICAgICB0aGlzLl9yZWd1bGFyaXR5ID0gcmVndWxhcml0eTtcbiAgICAgICAgdGhpcy5fbWFwID0gW107XG4gICAgfVxuICAgIGNyZWF0ZShjYWxsYmFjaykge1xuICAgICAgICBsZXQgd2lkdGggPSB0aGlzLl93aWR0aDtcbiAgICAgICAgbGV0IGhlaWdodCA9IHRoaXMuX2hlaWdodDtcbiAgICAgICAgbGV0IG1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XG4gICAgICAgIHdpZHRoIC09ICh3aWR0aCAlIDIgPyAxIDogMik7XG4gICAgICAgIGhlaWdodCAtPSAoaGVpZ2h0ICUgMiA/IDEgOiAyKTtcbiAgICAgICAgbGV0IGN4ID0gMDtcbiAgICAgICAgbGV0IGN5ID0gMDtcbiAgICAgICAgbGV0IG54ID0gMDtcbiAgICAgICAgbGV0IG55ID0gMDtcbiAgICAgICAgbGV0IGRvbmUgPSAwO1xuICAgICAgICBsZXQgYmxvY2tlZCA9IGZhbHNlO1xuICAgICAgICBsZXQgZGlycyA9IFtcbiAgICAgICAgICAgIFswLCAwXSxcbiAgICAgICAgICAgIFswLCAwXSxcbiAgICAgICAgICAgIFswLCAwXSxcbiAgICAgICAgICAgIFswLCAwXVxuICAgICAgICBdO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBjeCA9IDEgKyAyICogTWF0aC5mbG9vcihSTkcuZ2V0VW5pZm9ybSgpICogKHdpZHRoIC0gMSkgLyAyKTtcbiAgICAgICAgICAgIGN5ID0gMSArIDIgKiBNYXRoLmZsb29yKFJORy5nZXRVbmlmb3JtKCkgKiAoaGVpZ2h0IC0gMSkgLyAyKTtcbiAgICAgICAgICAgIGlmICghZG9uZSkge1xuICAgICAgICAgICAgICAgIG1hcFtjeF1bY3ldID0gMDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICghbWFwW2N4XVtjeV0pIHtcbiAgICAgICAgICAgICAgICB0aGlzLl9yYW5kb21pemUoZGlycyk7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBpZiAoTWF0aC5mbG9vcihSTkcuZ2V0VW5pZm9ybSgpICogKHRoaXMuX3JlZ3VsYXJpdHkgKyAxKSkgPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5fcmFuZG9taXplKGRpcnMpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGJsb2NrZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgbnggPSBjeCArIGRpcnNbaV1bMF0gKiAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgbnkgPSBjeSArIGRpcnNbaV1bMV0gKiAyO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYgKHRoaXMuX2lzRnJlZShtYXAsIG54LCBueSwgd2lkdGgsIGhlaWdodCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBtYXBbbnhdW255XSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbWFwW2N4ICsgZGlyc1tpXVswXV1bY3kgKyBkaXJzW2ldWzFdXSA9IDA7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY3ggPSBueDtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjeSA9IG55O1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJsb2NrZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBkb25lKys7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9IHdoaWxlICghYmxvY2tlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUgKGRvbmUgKyAxIDwgd2lkdGggKiBoZWlnaHQgLyA0KTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl93aWR0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2hlaWdodDsgaisrKSB7XG4gICAgICAgICAgICAgICAgY2FsbGJhY2soaSwgaiwgbWFwW2ldW2pdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9tYXAgPSBbXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIF9yYW5kb21pemUoZGlycykge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDQ7IGkrKykge1xuICAgICAgICAgICAgZGlyc1tpXVswXSA9IDA7XG4gICAgICAgICAgICBkaXJzW2ldWzFdID0gMDtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKE1hdGguZmxvb3IoUk5HLmdldFVuaWZvcm0oKSAqIDQpKSB7XG4gICAgICAgICAgICBjYXNlIDA6XG4gICAgICAgICAgICAgICAgZGlyc1swXVswXSA9IC0xO1xuICAgICAgICAgICAgICAgIGRpcnNbMV1bMF0gPSAxO1xuICAgICAgICAgICAgICAgIGRpcnNbMl1bMV0gPSAtMTtcbiAgICAgICAgICAgICAgICBkaXJzWzNdWzFdID0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgICBkaXJzWzNdWzBdID0gLTE7XG4gICAgICAgICAgICAgICAgZGlyc1syXVswXSA9IDE7XG4gICAgICAgICAgICAgICAgZGlyc1sxXVsxXSA9IC0xO1xuICAgICAgICAgICAgICAgIGRpcnNbMF1bMV0gPSAxO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgICAgIGRpcnNbMl1bMF0gPSAtMTtcbiAgICAgICAgICAgICAgICBkaXJzWzNdWzBdID0gMTtcbiAgICAgICAgICAgICAgICBkaXJzWzBdWzFdID0gLTE7XG4gICAgICAgICAgICAgICAgZGlyc1sxXVsxXSA9IDE7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZGlyc1sxXVswXSA9IC0xO1xuICAgICAgICAgICAgICAgIGRpcnNbMF1bMF0gPSAxO1xuICAgICAgICAgICAgICAgIGRpcnNbM11bMV0gPSAtMTtcbiAgICAgICAgICAgICAgICBkaXJzWzJdWzFdID0gMTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBfaXNGcmVlKG1hcCwgeCwgeSwgd2lkdGgsIGhlaWdodCkge1xuICAgICAgICBpZiAoeCA8IDEgfHwgeSA8IDEgfHwgeCA+PSB3aWR0aCB8fCB5ID49IGhlaWdodCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXBbeF1beV07XG4gICAgfVxufVxuIiwiaW1wb3J0IE1hcCBmcm9tIFwiLi9tYXAuanNcIjtcbmltcG9ydCBSTkcgZnJvbSBcIi4uL3JuZy5qc1wiO1xuaW1wb3J0IHsgRElSUyB9IGZyb20gXCIuLi9jb25zdGFudHMuanNcIjtcbi8qKlxuICogRHVuZ2VvbiBnZW5lcmF0b3Igd2hpY2ggdXNlcyB0aGUgXCJvcmdpbmFsXCIgUm9ndWUgZHVuZ2VvbiBnZW5lcmF0aW9uIGFsZ29yaXRobS4gU2VlIGh0dHA6Ly9rdW9pLmNvbS9+a2FtaWthemUvR2FtZURlc2lnbi9hcnQwN19yb2d1ZV9kdW5nZW9uLnBocFxuICogQGF1dGhvciBoeWFrdWdlaVxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSb2d1ZSBleHRlbmRzIE1hcCB7XG4gICAgY29uc3RydWN0b3Iod2lkdGgsIGhlaWdodCwgb3B0aW9ucykge1xuICAgICAgICBzdXBlcih3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgdGhpcy5tYXAgPSBbXTtcbiAgICAgICAgdGhpcy5yb29tcyA9IFtdO1xuICAgICAgICB0aGlzLmNvbm5lY3RlZENlbGxzID0gW107XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIGNlbGxXaWR0aDogMyxcbiAgICAgICAgICAgIGNlbGxIZWlnaHQ6IDMgLy8gICAgIGllLiBhcyBhbiBhcnJheSB3aXRoIG1pbi1tYXggdmFsdWVzIGZvciBlYWNoIGRpcmVjdGlvbi4uLi5cbiAgICAgICAgfSwgb3B0aW9ucyk7XG4gICAgICAgIC8qXG4gICAgICAgIFNldCB0aGUgcm9vbSBzaXplcyBhY2NvcmRpbmcgdG8gdGhlIG92ZXItYWxsIHdpZHRoIG9mIHRoZSBtYXAsXG4gICAgICAgIGFuZCB0aGUgY2VsbCBzaXplcy5cbiAgICAgICAgKi9cbiAgICAgICAgaWYgKCFvcHRpb25zLmhhc093blByb3BlcnR5KFwicm9vbVdpZHRoXCIpKSB7XG4gICAgICAgICAgICBvcHRpb25zW1wicm9vbVdpZHRoXCJdID0gdGhpcy5fY2FsY3VsYXRlUm9vbVNpemUodGhpcy5fd2lkdGgsIG9wdGlvbnNbXCJjZWxsV2lkdGhcIl0pO1xuICAgICAgICB9XG4gICAgICAgIGlmICghb3B0aW9ucy5oYXNPd25Qcm9wZXJ0eShcInJvb21IZWlnaHRcIikpIHtcbiAgICAgICAgICAgIG9wdGlvbnNbXCJyb29tSGVpZ2h0XCJdID0gdGhpcy5fY2FsY3VsYXRlUm9vbVNpemUodGhpcy5faGVpZ2h0LCBvcHRpb25zW1wiY2VsbEhlaWdodFwiXSk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fb3B0aW9ucyA9IG9wdGlvbnM7XG4gICAgfVxuICAgIGNyZWF0ZShjYWxsYmFjaykge1xuICAgICAgICB0aGlzLm1hcCA9IHRoaXMuX2ZpbGxNYXAoMSk7XG4gICAgICAgIHRoaXMucm9vbXMgPSBbXTtcbiAgICAgICAgdGhpcy5jb25uZWN0ZWRDZWxscyA9IFtdO1xuICAgICAgICB0aGlzLl9pbml0Um9vbXMoKTtcbiAgICAgICAgdGhpcy5fY29ubmVjdFJvb21zKCk7XG4gICAgICAgIHRoaXMuX2Nvbm5lY3RVbmNvbm5lY3RlZFJvb21zKCk7XG4gICAgICAgIHRoaXMuX2NyZWF0ZVJhbmRvbVJvb21Db25uZWN0aW9ucygpO1xuICAgICAgICB0aGlzLl9jcmVhdGVSb29tcygpO1xuICAgICAgICB0aGlzLl9jcmVhdGVDb3JyaWRvcnMoKTtcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX3dpZHRoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2hlaWdodDsgaisrKSB7XG4gICAgICAgICAgICAgICAgICAgIGNhbGxiYWNrKGksIGosIHRoaXMubWFwW2ldW2pdKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIF9jYWxjdWxhdGVSb29tU2l6ZShzaXplLCBjZWxsKSB7XG4gICAgICAgIGxldCBtYXggPSBNYXRoLmZsb29yKChzaXplIC8gY2VsbCkgKiAwLjgpO1xuICAgICAgICBsZXQgbWluID0gTWF0aC5mbG9vcigoc2l6ZSAvIGNlbGwpICogMC4yNSk7XG4gICAgICAgIGlmIChtaW4gPCAyKSB7XG4gICAgICAgICAgICBtaW4gPSAyO1xuICAgICAgICB9XG4gICAgICAgIGlmIChtYXggPCAyKSB7XG4gICAgICAgICAgICBtYXggPSAyO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBbbWluLCBtYXhdO1xuICAgIH1cbiAgICBfaW5pdFJvb21zKCkge1xuICAgICAgICAvLyBjcmVhdGUgcm9vbXMgYXJyYXkuIFRoaXMgaXMgdGhlIFwiZ3JpZFwiIGxpc3QgZnJvbSB0aGUgYWxnby5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLnJvb21zLnB1c2goW10pO1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7IGorKykge1xuICAgICAgICAgICAgICAgIHRoaXMucm9vbXNbaV0ucHVzaCh7IFwieFwiOiAwLCBcInlcIjogMCwgXCJ3aWR0aFwiOiAwLCBcImhlaWdodFwiOiAwLCBcImNvbm5lY3Rpb25zXCI6IFtdLCBcImNlbGx4XCI6IGksIFwiY2VsbHlcIjogaiB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBfY29ubmVjdFJvb21zKCkge1xuICAgICAgICAvL3BpY2sgcmFuZG9tIHN0YXJ0aW5nIGdyaWRcbiAgICAgICAgbGV0IGNneCA9IFJORy5nZXRVbmlmb3JtSW50KDAsIHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoIC0gMSk7XG4gICAgICAgIGxldCBjZ3kgPSBSTkcuZ2V0VW5pZm9ybUludCgwLCB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQgLSAxKTtcbiAgICAgICAgbGV0IGlkeDtcbiAgICAgICAgbGV0IG5jZ3g7XG4gICAgICAgIGxldCBuY2d5O1xuICAgICAgICBsZXQgZm91bmQgPSBmYWxzZTtcbiAgICAgICAgbGV0IHJvb207XG4gICAgICAgIGxldCBvdGhlclJvb207XG4gICAgICAgIGxldCBkaXJUb0NoZWNrO1xuICAgICAgICAvLyBmaW5kICB1bmNvbm5lY3RlZCBuZWlnaGJvdXIgY2VsbHNcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgLy9kaXJUb0NoZWNrID0gWzAsIDEsIDIsIDMsIDQsIDUsIDYsIDddO1xuICAgICAgICAgICAgZGlyVG9DaGVjayA9IFswLCAyLCA0LCA2XTtcbiAgICAgICAgICAgIGRpclRvQ2hlY2sgPSBSTkcuc2h1ZmZsZShkaXJUb0NoZWNrKTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBmb3VuZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIGlkeCA9IGRpclRvQ2hlY2sucG9wKCk7XG4gICAgICAgICAgICAgICAgbmNneCA9IGNneCArIERJUlNbOF1baWR4XVswXTtcbiAgICAgICAgICAgICAgICBuY2d5ID0gY2d5ICsgRElSU1s4XVtpZHhdWzFdO1xuICAgICAgICAgICAgICAgIGlmIChuY2d4IDwgMCB8fCBuY2d4ID49IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZiAobmNneSA8IDAgfHwgbmNneSA+PSB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHJvb20gPSB0aGlzLnJvb21zW2NneF1bY2d5XTtcbiAgICAgICAgICAgICAgICBpZiAocm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgLy8gYXMgbG9uZyBhcyB0aGlzIHJvb20gZG9lc24ndCBhbHJlYWR5IGNvb25lY3QgdG8gbWUsIHdlIGFyZSBvayB3aXRoIGl0LlxuICAgICAgICAgICAgICAgICAgICBpZiAocm9vbVtcImNvbm5lY3Rpb25zXCJdWzBdWzBdID09IG5jZ3ggJiYgcm9vbVtcImNvbm5lY3Rpb25zXCJdWzBdWzFdID09IG5jZ3kpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIG90aGVyUm9vbSA9IHRoaXMucm9vbXNbbmNneF1bbmNneV07XG4gICAgICAgICAgICAgICAgaWYgKG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdLnB1c2goW2NneCwgY2d5XSk7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuY29ubmVjdGVkQ2VsbHMucHVzaChbbmNneCwgbmNneV0pO1xuICAgICAgICAgICAgICAgICAgICBjZ3ggPSBuY2d4O1xuICAgICAgICAgICAgICAgICAgICBjZ3kgPSBuY2d5O1xuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSAoZGlyVG9DaGVjay5sZW5ndGggPiAwICYmIGZvdW5kID09IGZhbHNlKTtcbiAgICAgICAgfSB3aGlsZSAoZGlyVG9DaGVjay5sZW5ndGggPiAwKTtcbiAgICB9XG4gICAgX2Nvbm5lY3RVbmNvbm5lY3RlZFJvb21zKCkge1xuICAgICAgICAvL1doaWxlIHRoZXJlIGFyZSB1bmNvbm5lY3RlZCByb29tcywgdHJ5IHRvIGNvbm5lY3QgdGhlbSB0byBhIHJhbmRvbSBjb25uZWN0ZWQgbmVpZ2hib3JcbiAgICAgICAgLy8oaWYgYSByb29tIGhhcyBubyBjb25uZWN0ZWQgbmVpZ2hib3JzIHlldCwganVzdCBrZWVwIGN5Y2xpbmcsIHlvdSdsbCBmaWxsIG91dCB0byBpdCBldmVudHVhbGx5KS5cbiAgICAgICAgbGV0IGN3ID0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7XG4gICAgICAgIGxldCBjaCA9IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDtcbiAgICAgICAgdGhpcy5jb25uZWN0ZWRDZWxscyA9IFJORy5zaHVmZmxlKHRoaXMuY29ubmVjdGVkQ2VsbHMpO1xuICAgICAgICBsZXQgcm9vbTtcbiAgICAgICAgbGV0IG90aGVyUm9vbTtcbiAgICAgICAgbGV0IHZhbGlkUm9vbTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9vcHRpb25zLmNlbGxXaWR0aDsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDsgaisrKSB7XG4gICAgICAgICAgICAgICAgcm9vbSA9IHRoaXMucm9vbXNbaV1bal07XG4gICAgICAgICAgICAgICAgaWYgKHJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBsZXQgZGlyZWN0aW9ucyA9IFswLCAyLCA0LCA2XTtcbiAgICAgICAgICAgICAgICAgICAgZGlyZWN0aW9ucyA9IFJORy5zaHVmZmxlKGRpcmVjdGlvbnMpO1xuICAgICAgICAgICAgICAgICAgICB2YWxpZFJvb20gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGRpcklkeCA9IGRpcmVjdGlvbnMucG9wKCk7XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SSA9IGkgKyBESVJTWzhdW2RpcklkeF1bMF07XG4gICAgICAgICAgICAgICAgICAgICAgICBsZXQgbmV3SiA9IGogKyBESVJTWzhdW2RpcklkeF1bMV07XG4gICAgICAgICAgICAgICAgICAgICAgICBpZiAobmV3SSA8IDAgfHwgbmV3SSA+PSBjdyB8fCBuZXdKIDwgMCB8fCBuZXdKID49IGNoKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlclJvb20gPSB0aGlzLnJvb21zW25ld0ldW25ld0pdO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRSb29tID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmIChvdGhlclJvb21bXCJjb25uZWN0aW9uc1wiXVtrXVswXSA9PSBpICYmIG90aGVyUm9vbVtcImNvbm5lY3Rpb25zXCJdW2tdWzFdID09IGopIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsaWRSb29tID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmICh2YWxpZFJvb20pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSB3aGlsZSAoZGlyZWN0aW9ucy5sZW5ndGgpO1xuICAgICAgICAgICAgICAgICAgICBpZiAodmFsaWRSb29tKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb29tW1wiY29ubmVjdGlvbnNcIl0ucHVzaChbb3RoZXJSb29tW1wiY2VsbHhcIl0sIG90aGVyUm9vbVtcImNlbGx5XCJdXSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcIi0tIFVuYWJsZSB0byBjb25uZWN0IHJvb20uXCIpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIF9jcmVhdGVSYW5kb21Sb29tQ29ubmVjdGlvbnMoKSB7XG4gICAgICAgIC8vIEVtcHR5IGZvciBub3cuXG4gICAgfVxuICAgIF9jcmVhdGVSb29tcygpIHtcbiAgICAgICAgbGV0IHcgPSB0aGlzLl93aWR0aDtcbiAgICAgICAgbGV0IGggPSB0aGlzLl9oZWlnaHQ7XG4gICAgICAgIGxldCBjdyA9IHRoaXMuX29wdGlvbnMuY2VsbFdpZHRoO1xuICAgICAgICBsZXQgY2ggPSB0aGlzLl9vcHRpb25zLmNlbGxIZWlnaHQ7XG4gICAgICAgIGxldCBjd3AgPSBNYXRoLmZsb29yKHRoaXMuX3dpZHRoIC8gY3cpO1xuICAgICAgICBsZXQgY2hwID0gTWF0aC5mbG9vcih0aGlzLl9oZWlnaHQgLyBjaCk7XG4gICAgICAgIGxldCByb29tdztcbiAgICAgICAgbGV0IHJvb21oO1xuICAgICAgICBsZXQgcm9vbVdpZHRoID0gdGhpcy5fb3B0aW9uc1tcInJvb21XaWR0aFwiXTtcbiAgICAgICAgbGV0IHJvb21IZWlnaHQgPSB0aGlzLl9vcHRpb25zW1wicm9vbUhlaWdodFwiXTtcbiAgICAgICAgbGV0IHN4O1xuICAgICAgICBsZXQgc3k7XG4gICAgICAgIGxldCBvdGhlclJvb207XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgY3c7IGkrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBjaDsgaisrKSB7XG4gICAgICAgICAgICAgICAgc3ggPSBjd3AgKiBpO1xuICAgICAgICAgICAgICAgIHN5ID0gY2hwICogajtcbiAgICAgICAgICAgICAgICBpZiAoc3ggPT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzeCA9IDE7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChzeSA9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIHN5ID0gMTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgcm9vbXcgPSBSTkcuZ2V0VW5pZm9ybUludChyb29tV2lkdGhbMF0sIHJvb21XaWR0aFsxXSk7XG4gICAgICAgICAgICAgICAgcm9vbWggPSBSTkcuZ2V0VW5pZm9ybUludChyb29tSGVpZ2h0WzBdLCByb29tSGVpZ2h0WzFdKTtcbiAgICAgICAgICAgICAgICBpZiAoaiA+IDApIHtcbiAgICAgICAgICAgICAgICAgICAgb3RoZXJSb29tID0gdGhpcy5yb29tc1tpXVtqIC0gMV07XG4gICAgICAgICAgICAgICAgICAgIHdoaWxlIChzeSAtIChvdGhlclJvb21bXCJ5XCJdICsgb3RoZXJSb29tW1wiaGVpZ2h0XCJdKSA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaWYgKGkgPiAwKSB7XG4gICAgICAgICAgICAgICAgICAgIG90aGVyUm9vbSA9IHRoaXMucm9vbXNbaSAtIDFdW2pdO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSAoc3ggLSAob3RoZXJSb29tW1wieFwiXSArIG90aGVyUm9vbVtcIndpZHRoXCJdKSA8IDMpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN4Kys7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgbGV0IHN4T2Zmc2V0ID0gTWF0aC5yb3VuZChSTkcuZ2V0VW5pZm9ybUludCgwLCBjd3AgLSByb29tdykgLyAyKTtcbiAgICAgICAgICAgICAgICBsZXQgc3lPZmZzZXQgPSBNYXRoLnJvdW5kKFJORy5nZXRVbmlmb3JtSW50KDAsIGNocCAtIHJvb21oKSAvIDIpO1xuICAgICAgICAgICAgICAgIHdoaWxlIChzeCArIHN4T2Zmc2V0ICsgcm9vbXcgPj0gdykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3hPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN4T2Zmc2V0LS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb29tdy0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHdoaWxlIChzeSArIHN5T2Zmc2V0ICsgcm9vbWggPj0gaCkge1xuICAgICAgICAgICAgICAgICAgICBpZiAoc3lPZmZzZXQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN5T2Zmc2V0LS07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByb29taC0tO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHN4ID0gc3ggKyBzeE9mZnNldDtcbiAgICAgICAgICAgICAgICBzeSA9IHN5ICsgc3lPZmZzZXQ7XG4gICAgICAgICAgICAgICAgdGhpcy5yb29tc1tpXVtqXVtcInhcIl0gPSBzeDtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb21zW2ldW2pdW1wieVwiXSA9IHN5O1xuICAgICAgICAgICAgICAgIHRoaXMucm9vbXNbaV1bal1bXCJ3aWR0aFwiXSA9IHJvb213O1xuICAgICAgICAgICAgICAgIHRoaXMucm9vbXNbaV1bal1bXCJoZWlnaHRcIl0gPSByb29taDtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBpaSA9IHN4OyBpaSA8IHN4ICsgcm9vbXc7IGlpKyspIHtcbiAgICAgICAgICAgICAgICAgICAgZm9yIChsZXQgamogPSBzeTsgamogPCBzeSArIHJvb21oOyBqaisrKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcFtpaV1bampdID0gMDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBfZ2V0V2FsbFBvc2l0aW9uKGFSb29tLCBhRGlyZWN0aW9uKSB7XG4gICAgICAgIGxldCByeDtcbiAgICAgICAgbGV0IHJ5O1xuICAgICAgICBsZXQgZG9vcjtcbiAgICAgICAgaWYgKGFEaXJlY3Rpb24gPT0gMSB8fCBhRGlyZWN0aW9uID09IDMpIHtcbiAgICAgICAgICAgIHJ4ID0gUk5HLmdldFVuaWZvcm1JbnQoYVJvb21bXCJ4XCJdICsgMSwgYVJvb21bXCJ4XCJdICsgYVJvb21bXCJ3aWR0aFwiXSAtIDIpO1xuICAgICAgICAgICAgaWYgKGFEaXJlY3Rpb24gPT0gMSkge1xuICAgICAgICAgICAgICAgIHJ5ID0gYVJvb21bXCJ5XCJdIC0gMjtcbiAgICAgICAgICAgICAgICBkb29yID0gcnkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgcnkgPSBhUm9vbVtcInlcIl0gKyBhUm9vbVtcImhlaWdodFwiXSArIDE7XG4gICAgICAgICAgICAgICAgZG9vciA9IHJ5IC0gMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubWFwW3J4XVtkb29yXSA9IDA7IC8vIGknbSBub3Qgc2V0dGluZyBhIHNwZWNpZmljICdkb29yJyB0aWxlIHZhbHVlIHJpZ2h0IG5vdywganVzdCBlbXB0eSBzcGFjZS5cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJ5ID0gUk5HLmdldFVuaWZvcm1JbnQoYVJvb21bXCJ5XCJdICsgMSwgYVJvb21bXCJ5XCJdICsgYVJvb21bXCJoZWlnaHRcIl0gLSAyKTtcbiAgICAgICAgICAgIGlmIChhRGlyZWN0aW9uID09IDIpIHtcbiAgICAgICAgICAgICAgICByeCA9IGFSb29tW1wieFwiXSArIGFSb29tW1wid2lkdGhcIl0gKyAxO1xuICAgICAgICAgICAgICAgIGRvb3IgPSByeCAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICByeCA9IGFSb29tW1wieFwiXSAtIDI7XG4gICAgICAgICAgICAgICAgZG9vciA9IHJ4ICsgMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMubWFwW2Rvb3JdW3J5XSA9IDA7IC8vIGknbSBub3Qgc2V0dGluZyBhIHNwZWNpZmljICdkb29yJyB0aWxlIHZhbHVlIHJpZ2h0IG5vdywganVzdCBlbXB0eSBzcGFjZS5cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3J4LCByeV07XG4gICAgfVxuICAgIF9kcmF3Q29ycmlkb3Ioc3RhcnRQb3NpdGlvbiwgZW5kUG9zaXRpb24pIHtcbiAgICAgICAgbGV0IHhPZmZzZXQgPSBlbmRQb3NpdGlvblswXSAtIHN0YXJ0UG9zaXRpb25bMF07XG4gICAgICAgIGxldCB5T2Zmc2V0ID0gZW5kUG9zaXRpb25bMV0gLSBzdGFydFBvc2l0aW9uWzFdO1xuICAgICAgICBsZXQgeHBvcyA9IHN0YXJ0UG9zaXRpb25bMF07XG4gICAgICAgIGxldCB5cG9zID0gc3RhcnRQb3NpdGlvblsxXTtcbiAgICAgICAgbGV0IHRlbXBEaXN0O1xuICAgICAgICBsZXQgeERpcjtcbiAgICAgICAgbGV0IHlEaXI7XG4gICAgICAgIGxldCBtb3ZlOyAvLyAyIGVsZW1lbnQgYXJyYXksIGVsZW1lbnQgMCBpcyB0aGUgZGlyZWN0aW9uLCBlbGVtZW50IDEgaXMgdGhlIHRvdGFsIHZhbHVlIHRvIG1vdmUuXG4gICAgICAgIGxldCBtb3ZlcyA9IFtdOyAvLyBhIGxpc3Qgb2YgMiBlbGVtZW50IGFycmF5c1xuICAgICAgICBsZXQgeEFicyA9IE1hdGguYWJzKHhPZmZzZXQpO1xuICAgICAgICBsZXQgeUFicyA9IE1hdGguYWJzKHlPZmZzZXQpO1xuICAgICAgICBsZXQgcGVyY2VudCA9IFJORy5nZXRVbmlmb3JtKCk7IC8vIHVzZWQgdG8gc3BsaXQgdGhlIG1vdmUgYXQgZGlmZmVyZW50IHBsYWNlcyBhbG9uZyB0aGUgbG9uZyBheGlzXG4gICAgICAgIGxldCBmaXJzdEhhbGYgPSBwZXJjZW50O1xuICAgICAgICBsZXQgc2Vjb25kSGFsZiA9IDEgLSBwZXJjZW50O1xuICAgICAgICB4RGlyID0geE9mZnNldCA+IDAgPyAyIDogNjtcbiAgICAgICAgeURpciA9IHlPZmZzZXQgPiAwID8gNCA6IDA7XG4gICAgICAgIGlmICh4QWJzIDwgeUFicykge1xuICAgICAgICAgICAgLy8gbW92ZSBmaXJzdEhhbGYgb2YgdGhlIHkgb2Zmc2V0XG4gICAgICAgICAgICB0ZW1wRGlzdCA9IE1hdGguY2VpbCh5QWJzICogZmlyc3RIYWxmKTtcbiAgICAgICAgICAgIG1vdmVzLnB1c2goW3lEaXIsIHRlbXBEaXN0XSk7XG4gICAgICAgICAgICAvLyBtb3ZlIGFsbCB0aGUgeCBvZmZzZXRcbiAgICAgICAgICAgIG1vdmVzLnB1c2goW3hEaXIsIHhBYnNdKTtcbiAgICAgICAgICAgIC8vIG1vdmUgc2VuZEhhbGYgb2YgdGhlICB5IG9mZnNldFxuICAgICAgICAgICAgdGVtcERpc3QgPSBNYXRoLmZsb29yKHlBYnMgKiBzZWNvbmRIYWxmKTtcbiAgICAgICAgICAgIG1vdmVzLnB1c2goW3lEaXIsIHRlbXBEaXN0XSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyAgbW92ZSBmaXJzdEhhbGYgb2YgdGhlIHggb2Zmc2V0XG4gICAgICAgICAgICB0ZW1wRGlzdCA9IE1hdGguY2VpbCh4QWJzICogZmlyc3RIYWxmKTtcbiAgICAgICAgICAgIG1vdmVzLnB1c2goW3hEaXIsIHRlbXBEaXN0XSk7XG4gICAgICAgICAgICAvLyBtb3ZlIGFsbCB0aGUgeSBvZmZzZXRcbiAgICAgICAgICAgIG1vdmVzLnB1c2goW3lEaXIsIHlBYnNdKTtcbiAgICAgICAgICAgIC8vIG1vdmUgc2Vjb25kSGFsZiBvZiB0aGUgeCBvZmZzZXQuXG4gICAgICAgICAgICB0ZW1wRGlzdCA9IE1hdGguZmxvb3IoeEFicyAqIHNlY29uZEhhbGYpO1xuICAgICAgICAgICAgbW92ZXMucHVzaChbeERpciwgdGVtcERpc3RdKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm1hcFt4cG9zXVt5cG9zXSA9IDA7XG4gICAgICAgIHdoaWxlIChtb3Zlcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICBtb3ZlID0gbW92ZXMucG9wKCk7XG4gICAgICAgICAgICB3aGlsZSAobW92ZVsxXSA+IDApIHtcbiAgICAgICAgICAgICAgICB4cG9zICs9IERJUlNbOF1bbW92ZVswXV1bMF07XG4gICAgICAgICAgICAgICAgeXBvcyArPSBESVJTWzhdW21vdmVbMF1dWzFdO1xuICAgICAgICAgICAgICAgIHRoaXMubWFwW3hwb3NdW3lwb3NdID0gMDtcbiAgICAgICAgICAgICAgICBtb3ZlWzFdID0gbW92ZVsxXSAtIDE7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgX2NyZWF0ZUNvcnJpZG9ycygpIHtcbiAgICAgICAgLy8gRHJhdyBDb3JyaWRvcnMgYmV0d2VlbiBjb25uZWN0ZWQgcm9vbXNcbiAgICAgICAgbGV0IGN3ID0gdGhpcy5fb3B0aW9ucy5jZWxsV2lkdGg7XG4gICAgICAgIGxldCBjaCA9IHRoaXMuX29wdGlvbnMuY2VsbEhlaWdodDtcbiAgICAgICAgbGV0IHJvb207XG4gICAgICAgIGxldCBjb25uZWN0aW9uO1xuICAgICAgICBsZXQgb3RoZXJSb29tO1xuICAgICAgICBsZXQgd2FsbDtcbiAgICAgICAgbGV0IG90aGVyV2FsbDtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBjdzsgaSsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IGNoOyBqKyspIHtcbiAgICAgICAgICAgICAgICByb29tID0gdGhpcy5yb29tc1tpXVtqXTtcbiAgICAgICAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IHJvb21bXCJjb25uZWN0aW9uc1wiXS5sZW5ndGg7IGsrKykge1xuICAgICAgICAgICAgICAgICAgICBjb25uZWN0aW9uID0gcm9vbVtcImNvbm5lY3Rpb25zXCJdW2tdO1xuICAgICAgICAgICAgICAgICAgICBvdGhlclJvb20gPSB0aGlzLnJvb21zW2Nvbm5lY3Rpb25bMF1dW2Nvbm5lY3Rpb25bMV1dO1xuICAgICAgICAgICAgICAgICAgICAvLyBmaWd1cmUgb3V0IHdoYXQgd2FsbCBvdXIgY29ycmlkb3Igd2lsbCBzdGFydCBvbmUuXG4gICAgICAgICAgICAgICAgICAgIC8vIGZpZ3VyZSBvdXQgd2hhdCB3YWxsIG91ciBjb3JyaWRvciB3aWxsIGVuZCBvbi5cbiAgICAgICAgICAgICAgICAgICAgaWYgKG90aGVyUm9vbVtcImNlbGx4XCJdID4gcm9vbVtcImNlbGx4XCJdKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB3YWxsID0gMjtcbiAgICAgICAgICAgICAgICAgICAgICAgIG90aGVyV2FsbCA9IDQ7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSBpZiAob3RoZXJSb29tW1wiY2VsbHhcIl0gPCByb29tW1wiY2VsbHhcIl0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHdhbGwgPSA0O1xuICAgICAgICAgICAgICAgICAgICAgICAgb3RoZXJXYWxsID0gMjtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIGlmIChvdGhlclJvb21bXCJjZWxseVwiXSA+IHJvb21bXCJjZWxseVwiXSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2FsbCA9IDM7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlcldhbGwgPSAxO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgd2FsbCA9IDE7XG4gICAgICAgICAgICAgICAgICAgICAgICBvdGhlcldhbGwgPSAzO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2RyYXdDb3JyaWRvcih0aGlzLl9nZXRXYWxsUG9zaXRpb24ocm9vbSwgd2FsbCksIHRoaXMuX2dldFdhbGxQb3NpdGlvbihvdGhlclJvb20sIG90aGVyV2FsbCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cbiIsImltcG9ydCBBcmVuYSBmcm9tIFwiLi9hcmVuYS5qc1wiO1xuaW1wb3J0IFVuaWZvcm0gZnJvbSBcIi4vdW5pZm9ybS5qc1wiO1xuaW1wb3J0IENlbGx1bGFyIGZyb20gXCIuL2NlbGx1bGFyLmpzXCI7XG5pbXBvcnQgRGlnZ2VyIGZyb20gXCIuL2RpZ2dlci5qc1wiO1xuaW1wb3J0IEVsbGVyTWF6ZSBmcm9tIFwiLi9lbGxlcm1hemUuanNcIjtcbmltcG9ydCBEaXZpZGVkTWF6ZSBmcm9tIFwiLi9kaXZpZGVkbWF6ZS5qc1wiO1xuaW1wb3J0IEljZXlNYXplIGZyb20gXCIuL2ljZXltYXplLmpzXCI7XG5pbXBvcnQgUm9ndWUgZnJvbSBcIi4vcm9ndWUuanNcIjtcbmV4cG9ydCBkZWZhdWx0IHsgQXJlbmEsIFVuaWZvcm0sIENlbGx1bGFyLCBEaWdnZXIsIEVsbGVyTWF6ZSwgRGl2aWRlZE1hemUsIEljZXlNYXplLCBSb2d1ZSB9O1xuIiwiLyoqXG4gKiBCYXNlIG5vaXNlIGdlbmVyYXRvclxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBOb2lzZSB7XG59XG4iLCJpbXBvcnQgTm9pc2UgZnJvbSBcIi4vbm9pc2UuanNcIjtcbmltcG9ydCBSTkcgZnJvbSBcIi4uL3JuZy5qc1wiO1xuaW1wb3J0IHsgbW9kIH0gZnJvbSBcIi4uL3V0aWwuanNcIjtcbmNvbnN0IEYyID0gMC41ICogKE1hdGguc3FydCgzKSAtIDEpO1xuY29uc3QgRzIgPSAoMyAtIE1hdGguc3FydCgzKSkgLyA2O1xuLyoqXG4gKiBBIHNpbXBsZSAyZCBpbXBsZW1lbnRhdGlvbiBvZiBzaW1wbGV4IG5vaXNlIGJ5IE9uZHJlaiBaYXJhXG4gKlxuICogQmFzZWQgb24gYSBzcGVlZC1pbXByb3ZlZCBzaW1wbGV4IG5vaXNlIGFsZ29yaXRobSBmb3IgMkQsIDNEIGFuZCA0RCBpbiBKYXZhLlxuICogV2hpY2ggaXMgYmFzZWQgb24gZXhhbXBsZSBjb2RlIGJ5IFN0ZWZhbiBHdXN0YXZzb24gKHN0ZWd1QGl0bi5saXUuc2UpLlxuICogV2l0aCBPcHRpbWlzYXRpb25zIGJ5IFBldGVyIEVhc3RtYW4gKHBlYXN0bWFuQGRyaXp6bGUuc3RhbmZvcmQuZWR1KS5cbiAqIEJldHRlciByYW5rIG9yZGVyaW5nIG1ldGhvZCBieSBTdGVmYW4gR3VzdGF2c29uIGluIDIwMTIuXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpbXBsZXggZXh0ZW5kcyBOb2lzZSB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIGdyYWRpZW50cyBSYW5kb20gZ3JhZGllbnRzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IoZ3JhZGllbnRzID0gMjU2KSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX2dyYWRpZW50cyA9IFtcbiAgICAgICAgICAgIFswLCAtMV0sXG4gICAgICAgICAgICBbMSwgLTFdLFxuICAgICAgICAgICAgWzEsIDBdLFxuICAgICAgICAgICAgWzEsIDFdLFxuICAgICAgICAgICAgWzAsIDFdLFxuICAgICAgICAgICAgWy0xLCAxXSxcbiAgICAgICAgICAgIFstMSwgMF0sXG4gICAgICAgICAgICBbLTEsIC0xXVxuICAgICAgICBdO1xuICAgICAgICBsZXQgcGVybXV0YXRpb25zID0gW107XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZ3JhZGllbnRzOyBpKyspIHtcbiAgICAgICAgICAgIHBlcm11dGF0aW9ucy5wdXNoKGkpO1xuICAgICAgICB9XG4gICAgICAgIHBlcm11dGF0aW9ucyA9IFJORy5zaHVmZmxlKHBlcm11dGF0aW9ucyk7XG4gICAgICAgIHRoaXMuX3Blcm1zID0gW107XG4gICAgICAgIHRoaXMuX2luZGV4ZXMgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAyICogZ3JhZGllbnRzOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuX3Blcm1zLnB1c2gocGVybXV0YXRpb25zW2kgJSBncmFkaWVudHNdKTtcbiAgICAgICAgICAgIHRoaXMuX2luZGV4ZXMucHVzaCh0aGlzLl9wZXJtc1tpXSAlIHRoaXMuX2dyYWRpZW50cy5sZW5ndGgpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGdldCh4aW4sIHlpbikge1xuICAgICAgICBsZXQgcGVybXMgPSB0aGlzLl9wZXJtcztcbiAgICAgICAgbGV0IGluZGV4ZXMgPSB0aGlzLl9pbmRleGVzO1xuICAgICAgICBsZXQgY291bnQgPSBwZXJtcy5sZW5ndGggLyAyO1xuICAgICAgICBsZXQgbjAgPSAwLCBuMSA9IDAsIG4yID0gMCwgZ2k7IC8vIE5vaXNlIGNvbnRyaWJ1dGlvbnMgZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xuICAgICAgICAvLyBTa2V3IHRoZSBpbnB1dCBzcGFjZSB0byBkZXRlcm1pbmUgd2hpY2ggc2ltcGxleCBjZWxsIHdlJ3JlIGluXG4gICAgICAgIGxldCBzID0gKHhpbiArIHlpbikgKiBGMjsgLy8gSGFpcnkgZmFjdG9yIGZvciAyRFxuICAgICAgICBsZXQgaSA9IE1hdGguZmxvb3IoeGluICsgcyk7XG4gICAgICAgIGxldCBqID0gTWF0aC5mbG9vcih5aW4gKyBzKTtcbiAgICAgICAgbGV0IHQgPSAoaSArIGopICogRzI7XG4gICAgICAgIGxldCBYMCA9IGkgLSB0OyAvLyBVbnNrZXcgdGhlIGNlbGwgb3JpZ2luIGJhY2sgdG8gKHgseSkgc3BhY2VcbiAgICAgICAgbGV0IFkwID0gaiAtIHQ7XG4gICAgICAgIGxldCB4MCA9IHhpbiAtIFgwOyAvLyBUaGUgeCx5IGRpc3RhbmNlcyBmcm9tIHRoZSBjZWxsIG9yaWdpblxuICAgICAgICBsZXQgeTAgPSB5aW4gLSBZMDtcbiAgICAgICAgLy8gRm9yIHRoZSAyRCBjYXNlLCB0aGUgc2ltcGxleCBzaGFwZSBpcyBhbiBlcXVpbGF0ZXJhbCB0cmlhbmdsZS5cbiAgICAgICAgLy8gRGV0ZXJtaW5lIHdoaWNoIHNpbXBsZXggd2UgYXJlIGluLlxuICAgICAgICBsZXQgaTEsIGoxOyAvLyBPZmZzZXRzIGZvciBzZWNvbmQgKG1pZGRsZSkgY29ybmVyIG9mIHNpbXBsZXggaW4gKGksaikgY29vcmRzXG4gICAgICAgIGlmICh4MCA+IHkwKSB7XG4gICAgICAgICAgICBpMSA9IDE7XG4gICAgICAgICAgICBqMSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7IC8vIGxvd2VyIHRyaWFuZ2xlLCBYWSBvcmRlcjogKDAsMCktPigxLDApLT4oMSwxKVxuICAgICAgICAgICAgaTEgPSAwO1xuICAgICAgICAgICAgajEgPSAxO1xuICAgICAgICB9IC8vIHVwcGVyIHRyaWFuZ2xlLCBZWCBvcmRlcjogKDAsMCktPigwLDEpLT4oMSwxKVxuICAgICAgICAvLyBBIHN0ZXAgb2YgKDEsMCkgaW4gKGksaikgbWVhbnMgYSBzdGVwIG9mICgxLWMsLWMpIGluICh4LHkpLCBhbmRcbiAgICAgICAgLy8gYSBzdGVwIG9mICgwLDEpIGluIChpLGopIG1lYW5zIGEgc3RlcCBvZiAoLWMsMS1jKSBpbiAoeCx5KSwgd2hlcmVcbiAgICAgICAgLy8gYyA9ICgzLXNxcnQoMykpLzZcbiAgICAgICAgbGV0IHgxID0geDAgLSBpMSArIEcyOyAvLyBPZmZzZXRzIGZvciBtaWRkbGUgY29ybmVyIGluICh4LHkpIHVuc2tld2VkIGNvb3Jkc1xuICAgICAgICBsZXQgeTEgPSB5MCAtIGoxICsgRzI7XG4gICAgICAgIGxldCB4MiA9IHgwIC0gMSArIDIgKiBHMjsgLy8gT2Zmc2V0cyBmb3IgbGFzdCBjb3JuZXIgaW4gKHgseSkgdW5za2V3ZWQgY29vcmRzXG4gICAgICAgIGxldCB5MiA9IHkwIC0gMSArIDIgKiBHMjtcbiAgICAgICAgLy8gV29yayBvdXQgdGhlIGhhc2hlZCBncmFkaWVudCBpbmRpY2VzIG9mIHRoZSB0aHJlZSBzaW1wbGV4IGNvcm5lcnNcbiAgICAgICAgbGV0IGlpID0gbW9kKGksIGNvdW50KTtcbiAgICAgICAgbGV0IGpqID0gbW9kKGosIGNvdW50KTtcbiAgICAgICAgLy8gQ2FsY3VsYXRlIHRoZSBjb250cmlidXRpb24gZnJvbSB0aGUgdGhyZWUgY29ybmVyc1xuICAgICAgICBsZXQgdDAgPSAwLjUgLSB4MCAqIHgwIC0geTAgKiB5MDtcbiAgICAgICAgaWYgKHQwID49IDApIHtcbiAgICAgICAgICAgIHQwICo9IHQwO1xuICAgICAgICAgICAgZ2kgPSBpbmRleGVzW2lpICsgcGVybXNbampdXTtcbiAgICAgICAgICAgIGxldCBncmFkID0gdGhpcy5fZ3JhZGllbnRzW2dpXTtcbiAgICAgICAgICAgIG4wID0gdDAgKiB0MCAqIChncmFkWzBdICogeDAgKyBncmFkWzFdICogeTApO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0MSA9IDAuNSAtIHgxICogeDEgLSB5MSAqIHkxO1xuICAgICAgICBpZiAodDEgPj0gMCkge1xuICAgICAgICAgICAgdDEgKj0gdDE7XG4gICAgICAgICAgICBnaSA9IGluZGV4ZXNbaWkgKyBpMSArIHBlcm1zW2pqICsgajFdXTtcbiAgICAgICAgICAgIGxldCBncmFkID0gdGhpcy5fZ3JhZGllbnRzW2dpXTtcbiAgICAgICAgICAgIG4xID0gdDEgKiB0MSAqIChncmFkWzBdICogeDEgKyBncmFkWzFdICogeTEpO1xuICAgICAgICB9XG4gICAgICAgIGxldCB0MiA9IDAuNSAtIHgyICogeDIgLSB5MiAqIHkyO1xuICAgICAgICBpZiAodDIgPj0gMCkge1xuICAgICAgICAgICAgdDIgKj0gdDI7XG4gICAgICAgICAgICBnaSA9IGluZGV4ZXNbaWkgKyAxICsgcGVybXNbamogKyAxXV07XG4gICAgICAgICAgICBsZXQgZ3JhZCA9IHRoaXMuX2dyYWRpZW50c1tnaV07XG4gICAgICAgICAgICBuMiA9IHQyICogdDIgKiAoZ3JhZFswXSAqIHgyICsgZ3JhZFsxXSAqIHkyKTtcbiAgICAgICAgfVxuICAgICAgICAvLyBBZGQgY29udHJpYnV0aW9ucyBmcm9tIGVhY2ggY29ybmVyIHRvIGdldCB0aGUgZmluYWwgbm9pc2UgdmFsdWUuXG4gICAgICAgIC8vIFRoZSByZXN1bHQgaXMgc2NhbGVkIHRvIHJldHVybiB2YWx1ZXMgaW4gdGhlIGludGVydmFsIFstMSwxXS5cbiAgICAgICAgcmV0dXJuIDcwICogKG4wICsgbjEgKyBuMik7XG4gICAgfVxufVxuIiwiaW1wb3J0IFNpbXBsZXggZnJvbSBcIi4vc2ltcGxleC5qc1wiO1xuZXhwb3J0IGRlZmF1bHQgeyBTaW1wbGV4IH07XG4iLCJpbXBvcnQgeyBESVJTIH0gZnJvbSBcIi4uL2NvbnN0YW50cy5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgQWJzdHJhY3QgcGF0aGZpbmRlclxuICogQHBhcmFtIHtpbnR9IHRvWCBUYXJnZXQgWCBjb29yZFxuICogQHBhcmFtIHtpbnR9IHRvWSBUYXJnZXQgWSBjb29yZFxuICogQHBhcmFtIHtmdW5jdGlvbn0gcGFzc2FibGVDYWxsYmFjayBDYWxsYmFjayB0byBkZXRlcm1pbmUgbWFwIHBhc3NhYmlsaXR5XG4gKiBAcGFyYW0ge29iamVjdH0gW29wdGlvbnNdXG4gKiBAcGFyYW0ge2ludH0gW29wdGlvbnMudG9wb2xvZ3k9OF1cbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUGF0aCB7XG4gICAgY29uc3RydWN0b3IodG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLl90b1ggPSB0b1g7XG4gICAgICAgIHRoaXMuX3RvWSA9IHRvWTtcbiAgICAgICAgdGhpcy5fcGFzc2FibGVDYWxsYmFjayA9IHBhc3NhYmxlQ2FsbGJhY2s7XG4gICAgICAgIHRoaXMuX29wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIHRvcG9sb2d5OiA4XG4gICAgICAgIH0sIG9wdGlvbnMpO1xuICAgICAgICB0aGlzLl9kaXJzID0gRElSU1t0aGlzLl9vcHRpb25zLnRvcG9sb2d5XTtcbiAgICAgICAgaWYgKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kgPT0gOCkgeyAvKiByZW9yZGVyIGRpcnMgZm9yIG1vcmUgYWVzdGhldGljIHJlc3VsdCAodmVydGljYWwvaG9yaXpvbnRhbCBmaXJzdCkgKi9cbiAgICAgICAgICAgIHRoaXMuX2RpcnMgPSBbXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlyc1swXSxcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXJzWzJdLFxuICAgICAgICAgICAgICAgIHRoaXMuX2RpcnNbNF0sXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlyc1s2XSxcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXJzWzFdLFxuICAgICAgICAgICAgICAgIHRoaXMuX2RpcnNbM10sXG4gICAgICAgICAgICAgICAgdGhpcy5fZGlyc1s1XSxcbiAgICAgICAgICAgICAgICB0aGlzLl9kaXJzWzddXG4gICAgICAgICAgICBdO1xuICAgICAgICB9XG4gICAgfVxuICAgIF9nZXROZWlnaGJvcnMoY3gsIGN5KSB7XG4gICAgICAgIGxldCByZXN1bHQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9kaXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgZGlyID0gdGhpcy5fZGlyc1tpXTtcbiAgICAgICAgICAgIGxldCB4ID0gY3ggKyBkaXJbMF07XG4gICAgICAgICAgICBsZXQgeSA9IGN5ICsgZGlyWzFdO1xuICAgICAgICAgICAgaWYgKCF0aGlzLl9wYXNzYWJsZUNhbGxiYWNrKHgsIHkpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXN1bHQucHVzaChbeCwgeV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxufVxuIiwiaW1wb3J0IFBhdGggZnJvbSBcIi4vcGF0aC5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgU2ltcGxpZmllZCBEaWprc3RyYSdzIGFsZ29yaXRobTogYWxsIGVkZ2VzIGhhdmUgYSB2YWx1ZSBvZiAxXG4gKiBAYXVnbWVudHMgUk9ULlBhdGhcbiAqIEBzZWUgUk9ULlBhdGhcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRGlqa3N0cmEgZXh0ZW5kcyBQYXRoIHtcbiAgICBjb25zdHJ1Y3Rvcih0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucykge1xuICAgICAgICBzdXBlcih0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX2NvbXB1dGVkID0ge307XG4gICAgICAgIHRoaXMuX3RvZG8gPSBbXTtcbiAgICAgICAgdGhpcy5fYWRkKHRvWCwgdG9ZLCBudWxsKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSBhIHBhdGggZnJvbSBhIGdpdmVuIHBvaW50XG4gICAgICogQHNlZSBST1QuUGF0aCNjb21wdXRlXG4gICAgICovXG4gICAgY29tcHV0ZShmcm9tWCwgZnJvbVksIGNhbGxiYWNrKSB7XG4gICAgICAgIGxldCBrZXkgPSBmcm9tWCArIFwiLFwiICsgZnJvbVk7XG4gICAgICAgIGlmICghKGtleSBpbiB0aGlzLl9jb21wdXRlZCkpIHtcbiAgICAgICAgICAgIHRoaXMuX2NvbXB1dGUoZnJvbVgsIGZyb21ZKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoIShrZXkgaW4gdGhpcy5fY29tcHV0ZWQpKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl9jb21wdXRlZFtrZXldO1xuICAgICAgICB3aGlsZSAoaXRlbSkge1xuICAgICAgICAgICAgY2FsbGJhY2soaXRlbS54LCBpdGVtLnkpO1xuICAgICAgICAgICAgaXRlbSA9IGl0ZW0ucHJldjtcbiAgICAgICAgfVxuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlIGEgbm9uLWNhY2hlZCB2YWx1ZVxuICAgICAqL1xuICAgIF9jb21wdXRlKGZyb21YLCBmcm9tWSkge1xuICAgICAgICB3aGlsZSAodGhpcy5fdG9kby5sZW5ndGgpIHtcbiAgICAgICAgICAgIGxldCBpdGVtID0gdGhpcy5fdG9kby5zaGlmdCgpO1xuICAgICAgICAgICAgaWYgKGl0ZW0ueCA9PSBmcm9tWCAmJiBpdGVtLnkgPT0gZnJvbVkpIHtcbiAgICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBsZXQgbmVpZ2hib3JzID0gdGhpcy5fZ2V0TmVpZ2hib3JzKGl0ZW0ueCwgaXRlbS55KTtcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbmVpZ2hib3JzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IG5laWdoYm9yID0gbmVpZ2hib3JzW2ldO1xuICAgICAgICAgICAgICAgIGxldCB4ID0gbmVpZ2hib3JbMF07XG4gICAgICAgICAgICAgICAgbGV0IHkgPSBuZWlnaGJvclsxXTtcbiAgICAgICAgICAgICAgICBsZXQgaWQgPSB4ICsgXCIsXCIgKyB5O1xuICAgICAgICAgICAgICAgIGlmIChpZCBpbiB0aGlzLl9jb21wdXRlZCkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9IC8qIGFscmVhZHkgZG9uZSAqL1xuICAgICAgICAgICAgICAgIHRoaXMuX2FkZCh4LCB5LCBpdGVtKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBfYWRkKHgsIHksIHByZXYpIHtcbiAgICAgICAgbGV0IG9iaiA9IHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5LFxuICAgICAgICAgICAgcHJldjogcHJldlxuICAgICAgICB9O1xuICAgICAgICB0aGlzLl9jb21wdXRlZFt4ICsgXCIsXCIgKyB5XSA9IG9iajtcbiAgICAgICAgdGhpcy5fdG9kby5wdXNoKG9iaik7XG4gICAgfVxufVxuIiwiaW1wb3J0IFBhdGggZnJvbSBcIi4vcGF0aC5qc1wiO1xuLyoqXG4gKiBAY2xhc3MgU2ltcGxpZmllZCBBKiBhbGdvcml0aG06IGFsbCBlZGdlcyBoYXZlIGEgdmFsdWUgb2YgMVxuICogQGF1Z21lbnRzIFJPVC5QYXRoXG4gKiBAc2VlIFJPVC5QYXRoXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEFTdGFyIGV4dGVuZHMgUGF0aCB7XG4gICAgY29uc3RydWN0b3IodG9YLCB0b1ksIHBhc3NhYmxlQ2FsbGJhY2ssIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICBzdXBlcih0b1gsIHRvWSwgcGFzc2FibGVDYWxsYmFjaywgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX3RvZG8gPSBbXTtcbiAgICAgICAgdGhpcy5fZG9uZSA9IHt9O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBDb21wdXRlIGEgcGF0aCBmcm9tIGEgZ2l2ZW4gcG9pbnRcbiAgICAgKiBAc2VlIFJPVC5QYXRoI2NvbXB1dGVcbiAgICAgKi9cbiAgICBjb21wdXRlKGZyb21YLCBmcm9tWSwgY2FsbGJhY2spIHtcbiAgICAgICAgdGhpcy5fdG9kbyA9IFtdO1xuICAgICAgICB0aGlzLl9kb25lID0ge307XG4gICAgICAgIHRoaXMuX2Zyb21YID0gZnJvbVg7XG4gICAgICAgIHRoaXMuX2Zyb21ZID0gZnJvbVk7XG4gICAgICAgIHRoaXMuX2FkZCh0aGlzLl90b1gsIHRoaXMuX3RvWSwgbnVsbCk7XG4gICAgICAgIHdoaWxlICh0aGlzLl90b2RvLmxlbmd0aCkge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90b2RvLnNoaWZ0KCk7XG4gICAgICAgICAgICBsZXQgaWQgPSBpdGVtLnggKyBcIixcIiArIGl0ZW0ueTtcbiAgICAgICAgICAgIGlmIChpZCBpbiB0aGlzLl9kb25lKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLl9kb25lW2lkXSA9IGl0ZW07XG4gICAgICAgICAgICBpZiAoaXRlbS54ID09IGZyb21YICYmIGl0ZW0ueSA9PSBmcm9tWSkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGV0IG5laWdoYm9ycyA9IHRoaXMuX2dldE5laWdoYm9ycyhpdGVtLngsIGl0ZW0ueSk7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5laWdoYm9ycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBuZWlnaGJvciA9IG5laWdoYm9yc1tpXTtcbiAgICAgICAgICAgICAgICBsZXQgeCA9IG5laWdoYm9yWzBdO1xuICAgICAgICAgICAgICAgIGxldCB5ID0gbmVpZ2hib3JbMV07XG4gICAgICAgICAgICAgICAgbGV0IGlkID0geCArIFwiLFwiICsgeTtcbiAgICAgICAgICAgICAgICBpZiAoaWQgaW4gdGhpcy5fZG9uZSkge1xuICAgICAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgdGhpcy5fYWRkKHgsIHksIGl0ZW0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGxldCBpdGVtID0gdGhpcy5fZG9uZVtmcm9tWCArIFwiLFwiICsgZnJvbVldO1xuICAgICAgICBpZiAoIWl0ZW0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICB3aGlsZSAoaXRlbSkge1xuICAgICAgICAgICAgY2FsbGJhY2soaXRlbS54LCBpdGVtLnkpO1xuICAgICAgICAgICAgaXRlbSA9IGl0ZW0ucHJldjtcbiAgICAgICAgfVxuICAgIH1cbiAgICBfYWRkKHgsIHksIHByZXYpIHtcbiAgICAgICAgbGV0IGggPSB0aGlzLl9kaXN0YW5jZSh4LCB5KTtcbiAgICAgICAgbGV0IG9iaiA9IHtcbiAgICAgICAgICAgIHg6IHgsXG4gICAgICAgICAgICB5OiB5LFxuICAgICAgICAgICAgcHJldjogcHJldixcbiAgICAgICAgICAgIGc6IChwcmV2ID8gcHJldi5nICsgMSA6IDApLFxuICAgICAgICAgICAgaDogaFxuICAgICAgICB9O1xuICAgICAgICAvKiBpbnNlcnQgaW50byBwcmlvcml0eSBxdWV1ZSAqL1xuICAgICAgICBsZXQgZiA9IG9iai5nICsgb2JqLmg7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fdG9kby5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IGl0ZW0gPSB0aGlzLl90b2RvW2ldO1xuICAgICAgICAgICAgbGV0IGl0ZW1GID0gaXRlbS5nICsgaXRlbS5oO1xuICAgICAgICAgICAgaWYgKGYgPCBpdGVtRiB8fCAoZiA9PSBpdGVtRiAmJiBoIDwgaXRlbS5oKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuX3RvZG8uc3BsaWNlKGksIDAsIG9iaik7XG4gICAgICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuX3RvZG8ucHVzaChvYmopO1xuICAgIH1cbiAgICBfZGlzdGFuY2UoeCwgeSkge1xuICAgICAgICBzd2l0Y2ggKHRoaXMuX29wdGlvbnMudG9wb2xvZ3kpIHtcbiAgICAgICAgICAgIGNhc2UgNDpcbiAgICAgICAgICAgICAgICByZXR1cm4gKE1hdGguYWJzKHggLSB0aGlzLl9mcm9tWCkgKyBNYXRoLmFicyh5IC0gdGhpcy5fZnJvbVkpKTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGNhc2UgNjpcbiAgICAgICAgICAgICAgICBsZXQgZHggPSBNYXRoLmFicyh4IC0gdGhpcy5fZnJvbVgpO1xuICAgICAgICAgICAgICAgIGxldCBkeSA9IE1hdGguYWJzKHkgLSB0aGlzLl9mcm9tWSk7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGR5ICsgTWF0aC5tYXgoMCwgKGR4IC0gZHkpIC8gMik7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDg6XG4gICAgICAgICAgICAgICAgcmV0dXJuIE1hdGgubWF4KE1hdGguYWJzKHggLSB0aGlzLl9mcm9tWCksIE1hdGguYWJzKHkgLSB0aGlzLl9mcm9tWSkpO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0IERpamtzdHJhIGZyb20gXCIuL2RpamtzdHJhLmpzXCI7XG5pbXBvcnQgQVN0YXIgZnJvbSBcIi4vYXN0YXIuanNcIjtcbmV4cG9ydCBkZWZhdWx0IHsgRGlqa3N0cmEsIEFTdGFyIH07XG4iLCIvKipcbiAqIEBjbGFzcyBBc3luY2hyb25vdXMgbWFpbiBsb29wXG4gKiBAcGFyYW0ge1JPVC5TY2hlZHVsZXJ9IHNjaGVkdWxlclxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBFbmdpbmUge1xuICAgIGNvbnN0cnVjdG9yKHNjaGVkdWxlcikge1xuICAgICAgICB0aGlzLl9zY2hlZHVsZXIgPSBzY2hlZHVsZXI7XG4gICAgICAgIHRoaXMuX2xvY2sgPSAxO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTdGFydCB0aGUgbWFpbiBsb29wLiBXaGVuIHRoaXMgY2FsbCByZXR1cm5zLCB0aGUgbG9vcCBpcyBsb2NrZWQuXG4gICAgICovXG4gICAgc3RhcnQoKSB7IHJldHVybiB0aGlzLnVubG9jaygpOyB9XG4gICAgLyoqXG4gICAgICogSW50ZXJydXB0IHRoZSBlbmdpbmUgYnkgYW4gYXN5bmNocm9ub3VzIGFjdGlvblxuICAgICAqL1xuICAgIGxvY2soKSB7XG4gICAgICAgIHRoaXMuX2xvY2srKztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlc3VtZSBleGVjdXRpb24gKHBhdXNlZCBieSBhIHByZXZpb3VzIGxvY2spXG4gICAgICovXG4gICAgdW5sb2NrKCkge1xuICAgICAgICBpZiAoIXRoaXMuX2xvY2spIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcIkNhbm5vdCB1bmxvY2sgdW5sb2NrZWQgZW5naW5lXCIpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuX2xvY2stLTtcbiAgICAgICAgd2hpbGUgKCF0aGlzLl9sb2NrKSB7XG4gICAgICAgICAgICBsZXQgYWN0b3IgPSB0aGlzLl9zY2hlZHVsZXIubmV4dCgpO1xuICAgICAgICAgICAgaWYgKCFhY3Rvcikge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmxvY2soKTtcbiAgICAgICAgICAgIH0gLyogbm8gYWN0b3JzICovXG4gICAgICAgICAgICBsZXQgcmVzdWx0ID0gYWN0b3IuYWN0KCk7XG4gICAgICAgICAgICBpZiAocmVzdWx0ICYmIHJlc3VsdC50aGVuKSB7IC8qIGFjdG9yIHJldHVybmVkIGEgXCJ0aGVuYWJsZVwiLCBsb29rcyBsaWtlIGEgUHJvbWlzZSAqL1xuICAgICAgICAgICAgICAgIHRoaXMubG9jaygpO1xuICAgICAgICAgICAgICAgIHJlc3VsdC50aGVuKHRoaXMudW5sb2NrLmJpbmQodGhpcykpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCAqIGFzIENvbG9yIGZyb20gXCIuL2NvbG9yLmpzXCI7XG47XG47XG47XG47XG4vKipcbiAqIExpZ2h0aW5nIGNvbXB1dGF0aW9uLCBiYXNlZCBvbiBhIHRyYWRpdGlvbmFsIEZPViBmb3IgbXVsdGlwbGUgbGlnaHQgc291cmNlcyBhbmQgbXVsdGlwbGUgcGFzc2VzLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBMaWdodGluZyB7XG4gICAgY29uc3RydWN0b3IocmVmbGVjdGl2aXR5Q2FsbGJhY2ssIG9wdGlvbnMgPSB7fSkge1xuICAgICAgICB0aGlzLl9yZWZsZWN0aXZpdHlDYWxsYmFjayA9IHJlZmxlY3Rpdml0eUNhbGxiYWNrO1xuICAgICAgICB0aGlzLl9vcHRpb25zID0ge307XG4gICAgICAgIG9wdGlvbnMgPSBPYmplY3QuYXNzaWduKHtcbiAgICAgICAgICAgIHBhc3NlczogMSxcbiAgICAgICAgICAgIGVtaXNzaW9uVGhyZXNob2xkOiAxMDAsXG4gICAgICAgICAgICByYW5nZTogMTBcbiAgICAgICAgfSwgb3B0aW9ucyk7XG4gICAgICAgIHRoaXMuX2xpZ2h0cyA9IHt9O1xuICAgICAgICB0aGlzLl9yZWZsZWN0aXZpdHlDYWNoZSA9IHt9O1xuICAgICAgICB0aGlzLl9mb3ZDYWNoZSA9IHt9O1xuICAgICAgICB0aGlzLnNldE9wdGlvbnMob3B0aW9ucyk7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIEFkanVzdCBvcHRpb25zIGF0IHJ1bnRpbWVcbiAgICAgKi9cbiAgICBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLl9vcHRpb25zLCBvcHRpb25zKTtcbiAgICAgICAgaWYgKG9wdGlvbnMgJiYgb3B0aW9ucy5yYW5nZSkge1xuICAgICAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIHVzZWQgRmllbGQtT2YtVmlldyBhbGdvXG4gICAgICovXG4gICAgc2V0Rk9WKGZvdikge1xuICAgICAgICB0aGlzLl9mb3YgPSBmb3Y7XG4gICAgICAgIHRoaXMuX2ZvdkNhY2hlID0ge307XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBTZXQgKG9yIHJlbW92ZSkgYSBsaWdodCBzb3VyY2VcbiAgICAgKi9cbiAgICBzZXRMaWdodCh4LCB5LCBjb2xvcikge1xuICAgICAgICBsZXQga2V5ID0geCArIFwiLFwiICsgeTtcbiAgICAgICAgaWYgKGNvbG9yKSB7XG4gICAgICAgICAgICB0aGlzLl9saWdodHNba2V5XSA9ICh0eXBlb2YgKGNvbG9yKSA9PSBcInN0cmluZ1wiID8gQ29sb3IuZnJvbVN0cmluZyhjb2xvcikgOiBjb2xvcik7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fbGlnaHRzW2tleV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhbGwgbGlnaHQgc291cmNlc1xuICAgICAqL1xuICAgIGNsZWFyTGlnaHRzKCkgeyB0aGlzLl9saWdodHMgPSB7fTsgfVxuICAgIC8qKlxuICAgICAqIFJlc2V0IHRoZSBwcmUtY29tcHV0ZWQgdG9wb2xvZ3kgdmFsdWVzLiBDYWxsIHdoZW5ldmVyIHRoZSB1bmRlcmx5aW5nIG1hcCBjaGFuZ2VzIGl0cyBsaWdodC1wYXNzYWJpbGl0eS5cbiAgICAgKi9cbiAgICByZXNldCgpIHtcbiAgICAgICAgdGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGUgPSB7fTtcbiAgICAgICAgdGhpcy5fZm92Q2FjaGUgPSB7fTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGUgdGhlIGxpZ2h0aW5nXG4gICAgICovXG4gICAgY29tcHV0ZShsaWdodGluZ0NhbGxiYWNrKSB7XG4gICAgICAgIGxldCBkb25lQ2VsbHMgPSB7fTtcbiAgICAgICAgbGV0IGVtaXR0aW5nQ2VsbHMgPSB7fTtcbiAgICAgICAgbGV0IGxpdENlbGxzID0ge307XG4gICAgICAgIGZvciAobGV0IGtleSBpbiB0aGlzLl9saWdodHMpIHsgLyogcHJlcGFyZSBlbWl0dGVycyBmb3IgZmlyc3QgcGFzcyAqL1xuICAgICAgICAgICAgbGV0IGxpZ2h0ID0gdGhpcy5fbGlnaHRzW2tleV07XG4gICAgICAgICAgICBlbWl0dGluZ0NlbGxzW2tleV0gPSBbMCwgMCwgMF07XG4gICAgICAgICAgICBDb2xvci5hZGRfKGVtaXR0aW5nQ2VsbHNba2V5XSwgbGlnaHQpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fb3B0aW9ucy5wYXNzZXM7IGkrKykgeyAvKiBtYWluIGxvb3AgKi9cbiAgICAgICAgICAgIHRoaXMuX2VtaXRMaWdodChlbWl0dGluZ0NlbGxzLCBsaXRDZWxscywgZG9uZUNlbGxzKTtcbiAgICAgICAgICAgIGlmIChpICsgMSA9PSB0aGlzLl9vcHRpb25zLnBhc3Nlcykge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSAvKiBub3QgZm9yIHRoZSBsYXN0IHBhc3MgKi9cbiAgICAgICAgICAgIGVtaXR0aW5nQ2VsbHMgPSB0aGlzLl9jb21wdXRlRW1pdHRlcnMobGl0Q2VsbHMsIGRvbmVDZWxscyk7XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChsZXQgbGl0S2V5IGluIGxpdENlbGxzKSB7IC8qIGxldCB0aGUgdXNlciBrbm93IHdoYXQgYW5kIGhvdyBpcyBsaXQgKi9cbiAgICAgICAgICAgIGxldCBwYXJ0cyA9IGxpdEtleS5zcGxpdChcIixcIik7XG4gICAgICAgICAgICBsZXQgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcbiAgICAgICAgICAgIGxldCB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xuICAgICAgICAgICAgbGlnaHRpbmdDYWxsYmFjayh4LCB5LCBsaXRDZWxsc1tsaXRLZXldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSBvbmUgaXRlcmF0aW9uIGZyb20gYWxsIGVtaXR0aW5nIGNlbGxzXG4gICAgICogQHBhcmFtIGVtaXR0aW5nQ2VsbHMgVGhlc2UgZW1pdCBsaWdodFxuICAgICAqIEBwYXJhbSBsaXRDZWxscyBBZGQgcHJvamVjdGVkIGxpZ2h0IHRvIHRoZXNlXG4gICAgICogQHBhcmFtIGRvbmVDZWxscyBUaGVzZSBhbHJlYWR5IGVtaXR0ZWQsIGZvcmJpZCB0aGVtIGZyb20gZnVydGhlciBjYWxjdWxhdGlvbnNcbiAgICAgKi9cbiAgICBfZW1pdExpZ2h0KGVtaXR0aW5nQ2VsbHMsIGxpdENlbGxzLCBkb25lQ2VsbHMpIHtcbiAgICAgICAgZm9yIChsZXQga2V5IGluIGVtaXR0aW5nQ2VsbHMpIHtcbiAgICAgICAgICAgIGxldCBwYXJ0cyA9IGtleS5zcGxpdChcIixcIik7XG4gICAgICAgICAgICBsZXQgeCA9IHBhcnNlSW50KHBhcnRzWzBdKTtcbiAgICAgICAgICAgIGxldCB5ID0gcGFyc2VJbnQocGFydHNbMV0pO1xuICAgICAgICAgICAgdGhpcy5fZW1pdExpZ2h0RnJvbUNlbGwoeCwgeSwgZW1pdHRpbmdDZWxsc1trZXldLCBsaXRDZWxscyk7XG4gICAgICAgICAgICBkb25lQ2VsbHNba2V5XSA9IDE7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIFByZXBhcmUgYSBsaXN0IG9mIGVtaXR0ZXJzIGZvciBuZXh0IHBhc3NcbiAgICAgKi9cbiAgICBfY29tcHV0ZUVtaXR0ZXJzKGxpdENlbGxzLCBkb25lQ2VsbHMpIHtcbiAgICAgICAgbGV0IHJlc3VsdCA9IHt9O1xuICAgICAgICBmb3IgKGxldCBrZXkgaW4gbGl0Q2VsbHMpIHtcbiAgICAgICAgICAgIGlmIChrZXkgaW4gZG9uZUNlbGxzKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IC8qIGFscmVhZHkgZW1pdHRlZCAqL1xuICAgICAgICAgICAgbGV0IGNvbG9yID0gbGl0Q2VsbHNba2V5XTtcbiAgICAgICAgICAgIGxldCByZWZsZWN0aXZpdHk7XG4gICAgICAgICAgICBpZiAoa2V5IGluIHRoaXMuX3JlZmxlY3Rpdml0eUNhY2hlKSB7XG4gICAgICAgICAgICAgICAgcmVmbGVjdGl2aXR5ID0gdGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGVba2V5XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgIGxldCBwYXJ0cyA9IGtleS5zcGxpdChcIixcIik7XG4gICAgICAgICAgICAgICAgbGV0IHggPSBwYXJzZUludChwYXJ0c1swXSk7XG4gICAgICAgICAgICAgICAgbGV0IHkgPSBwYXJzZUludChwYXJ0c1sxXSk7XG4gICAgICAgICAgICAgICAgcmVmbGVjdGl2aXR5ID0gdGhpcy5fcmVmbGVjdGl2aXR5Q2FsbGJhY2soeCwgeSk7XG4gICAgICAgICAgICAgICAgdGhpcy5fcmVmbGVjdGl2aXR5Q2FjaGVba2V5XSA9IHJlZmxlY3Rpdml0eTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmIChyZWZsZWN0aXZpdHkgPT0gMCkge1xuICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgfSAvKiB3aWxsIG5vdCByZWZsZWN0IGF0IGFsbCAqL1xuICAgICAgICAgICAgLyogY29tcHV0ZSBlbWlzc2lvbiBjb2xvciAqL1xuICAgICAgICAgICAgbGV0IGVtaXNzaW9uID0gWzAsIDAsIDBdO1xuICAgICAgICAgICAgbGV0IGludGVuc2l0eSA9IDA7XG4gICAgICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IDM7IGkrKykge1xuICAgICAgICAgICAgICAgIGxldCBwYXJ0ID0gTWF0aC5yb3VuZChjb2xvcltpXSAqIHJlZmxlY3Rpdml0eSk7XG4gICAgICAgICAgICAgICAgZW1pc3Npb25baV0gPSBwYXJ0O1xuICAgICAgICAgICAgICAgIGludGVuc2l0eSArPSBwYXJ0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKGludGVuc2l0eSA+IHRoaXMuX29wdGlvbnMuZW1pc3Npb25UaHJlc2hvbGQpIHtcbiAgICAgICAgICAgICAgICByZXN1bHRba2V5XSA9IGVtaXNzaW9uO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByZXN1bHQ7XG4gICAgfVxuICAgIC8qKlxuICAgICAqIENvbXB1dGUgb25lIGl0ZXJhdGlvbiBmcm9tIG9uZSBjZWxsXG4gICAgICovXG4gICAgX2VtaXRMaWdodEZyb21DZWxsKHgsIHksIGNvbG9yLCBsaXRDZWxscykge1xuICAgICAgICBsZXQga2V5ID0geCArIFwiLFwiICsgeTtcbiAgICAgICAgbGV0IGZvdjtcbiAgICAgICAgaWYgKGtleSBpbiB0aGlzLl9mb3ZDYWNoZSkge1xuICAgICAgICAgICAgZm92ID0gdGhpcy5fZm92Q2FjaGVba2V5XTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvdiA9IHRoaXMuX3VwZGF0ZUZPVih4LCB5KTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBmb3ZLZXkgaW4gZm92KSB7XG4gICAgICAgICAgICBsZXQgZm9ybUZhY3RvciA9IGZvdltmb3ZLZXldO1xuICAgICAgICAgICAgbGV0IHJlc3VsdDtcbiAgICAgICAgICAgIGlmIChmb3ZLZXkgaW4gbGl0Q2VsbHMpIHsgLyogYWxyZWFkeSBsaXQgKi9cbiAgICAgICAgICAgICAgICByZXN1bHQgPSBsaXRDZWxsc1tmb3ZLZXldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7IC8qIG5ld2x5IGxpdCAqL1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IFswLCAwLCAwXTtcbiAgICAgICAgICAgICAgICBsaXRDZWxsc1tmb3ZLZXldID0gcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCAzOyBpKyspIHtcbiAgICAgICAgICAgICAgICByZXN1bHRbaV0gKz0gTWF0aC5yb3VuZChjb2xvcltpXSAqIGZvcm1GYWN0b3IpO1xuICAgICAgICAgICAgfSAvKiBhZGQgbGlnaHQgY29sb3IgKi9cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSBGT1YgKFwiZm9ybSBmYWN0b3JcIikgZm9yIGEgcG90ZW50aWFsIGxpZ2h0IHNvdXJjZSBhdCBbeCx5XVxuICAgICAqL1xuICAgIF91cGRhdGVGT1YoeCwgeSkge1xuICAgICAgICBsZXQga2V5MSA9IHggKyBcIixcIiArIHk7XG4gICAgICAgIGxldCBjYWNoZSA9IHt9O1xuICAgICAgICB0aGlzLl9mb3ZDYWNoZVtrZXkxXSA9IGNhY2hlO1xuICAgICAgICBsZXQgcmFuZ2UgPSB0aGlzLl9vcHRpb25zLnJhbmdlO1xuICAgICAgICBmdW5jdGlvbiBjYih4LCB5LCByLCB2aXMpIHtcbiAgICAgICAgICAgIGxldCBrZXkyID0geCArIFwiLFwiICsgeTtcbiAgICAgICAgICAgIGxldCBmb3JtRmFjdG9yID0gdmlzICogKDEgLSByIC8gcmFuZ2UpO1xuICAgICAgICAgICAgaWYgKGZvcm1GYWN0b3IgPT0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhY2hlW2tleTJdID0gZm9ybUZhY3RvcjtcbiAgICAgICAgfVxuICAgICAgICA7XG4gICAgICAgIHRoaXMuX2Zvdi5jb21wdXRlKHgsIHksIHJhbmdlLCBjYi5iaW5kKHRoaXMpKTtcbiAgICAgICAgcmV0dXJuIGNhY2hlO1xuICAgIH1cbn1cbiIsImV4cG9ydCB7IGRlZmF1bHQgYXMgUk5HIH0gZnJvbSBcIi4vcm5nLmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIERpc3BsYXkgfSBmcm9tIFwiLi9kaXNwbGF5L2Rpc3BsYXkuanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU3RyaW5nR2VuZXJhdG9yIH0gZnJvbSBcIi4vc3RyaW5nZ2VuZXJhdG9yLmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEV2ZW50UXVldWUgfSBmcm9tIFwiLi9ldmVudHF1ZXVlLmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFNjaGVkdWxlciB9IGZyb20gXCIuL3NjaGVkdWxlci9pbmRleC5qc1wiO1xuZXhwb3J0IHsgZGVmYXVsdCBhcyBGT1YgfSBmcm9tIFwiLi9mb3YvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgTWFwIH0gZnJvbSBcIi4vbWFwL2luZGV4LmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIE5vaXNlIH0gZnJvbSBcIi4vbm9pc2UvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGF0aCB9IGZyb20gXCIuL3BhdGgvaW5kZXguanNcIjtcbmV4cG9ydCB7IGRlZmF1bHQgYXMgRW5naW5lIH0gZnJvbSBcIi4vZW5naW5lLmpzXCI7XG5leHBvcnQgeyBkZWZhdWx0IGFzIExpZ2h0aW5nIH0gZnJvbSBcIi4vbGlnaHRpbmcuanNcIjtcbmV4cG9ydCB7IERFRkFVTFRfV0lEVEgsIERFRkFVTFRfSEVJR0hULCBESVJTLCBLRVlTIH0gZnJvbSBcIi4vY29uc3RhbnRzLmpzXCI7XG5pbXBvcnQgKiBhcyB1dGlsIGZyb20gXCIuL3V0aWwuanNcIjtcbmV4cG9ydCBjb25zdCBVdGlsID0gdXRpbDtcbmltcG9ydCAqIGFzIGNvbG9yIGZyb20gXCIuL2NvbG9yLmpzXCI7XG5leHBvcnQgY29uc3QgQ29sb3IgPSBjb2xvcjtcbmltcG9ydCAqIGFzIHRleHQgZnJvbSBcIi4vdGV4dC5qc1wiO1xuZXhwb3J0IGNvbnN0IFRleHQgPSB0ZXh0O1xuIiwiY29uc3QgUk9UID0gcmVxdWlyZSgncm90LWpzJyk7XHJcbi8vIFNlZTogaHR0cDovL29uZHJhcy5naXRodWIuaW8vcm90LmpzL21hbnVhbC8jcm5nXHJcblxyXG5mdW5jdGlvbiBzZXRTZWVkKHNlZWQpIHtcclxuXHRpZiAodHlwZW9mIHNlZWQgIT09ICdudW1iZXInKSB7XHJcblx0XHRzZWVkID0gbWFrZVNlZWQoKTtcclxuXHR9XHJcblx0Uk9ULlJORy5zZXRTZWVkKHNlZWQpO1xyXG59XHJcblxyXG5mdW5jdGlvbiBtYWtlU2VlZCgpIHtcclxuXHRyZXR1cm4gTWF0aC5yb3VuZChNYXRoLnJhbmRvbSgpICogMTAwMDApO1xyXG59XHJcblxyXG5mdW5jdGlvbiByb2xsKG4sIHNlZWQpIHtcclxuXHRpZiAodHlwZW9mIHNlZWQgPT09ICdudW1iZXInKSB7XHJcblx0XHRzZXRTZWVkKHNlZWQpO1xyXG5cdH1cclxuXHRyZXR1cm4gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIG4pO1xyXG59XHJcblxyXG5mdW5jdGlvbiBnZXRXZWlnaHRlZFZhbHVlKG9iaiwgc2VlZCkge1xyXG5cdGlmICh0eXBlb2Ygc2VlZCA9PT0gJ251bWJlcicpIHtcclxuXHRcdHNldFNlZWQoc2VlZCk7XHJcblx0fVxyXG5cdHJldHVybiBST1QuUk5HLmdldFdlaWdodGVkVmFsdWUob2JqKTtcclxufVxyXG5cclxuZnVuY3Rpb24gc2h1ZmZsZShhcnIpIHtcclxuXHRyZXR1cm4gUk9ULlJORy5zaHVmZmxlKGFycik7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHBpY2tPbmUoYXJyKSB7XHJcblx0cmV0dXJuIFJPVC5STkcuZ2V0SXRlbShhcnIpO1xyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRzZXRTZWVkLFxyXG5cdG1ha2VTZWVkLFxyXG5cdHJvbGwsXHJcblx0Z2V0V2VpZ2h0ZWRWYWx1ZSxcclxuXHRzaHVmZmxlLFxyXG5cdHBpY2tPbmVcclxufTtcclxuIiwiY29uc3QgSW52ZW50b3J5ID0gcmVxdWlyZSgnLi9JbnZlbnRvcnknKTtcclxuY29uc3QgeyBESVJTXzggfSA9IHJlcXVpcmUoJy4vY29uc3RhbnRzJyk7XHJcblxyXG5jbGFzcyBJdGVtIHtcclxuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuXHRcdHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZSB8fCBudWxsO1xyXG5cdFx0dGhpcy5uYW1lID0gb3B0aW9ucy5uYW1lIHx8ICdub3RoaW5nJztcclxuXHRcdHRoaXMueCA9IG9wdGlvbnMueCB8fCAwO1xyXG5cdFx0dGhpcy55ID0gb3B0aW9ucy55IHx8IDA7XHJcblx0XHR0aGlzLmNoYXJhY3RlciA9IG9wdGlvbnMuY2hhcmFjdGVyIHx8ICdeJztcclxuXHRcdHRoaXMuc3Vycm91bmRpbmcgPSBvcHRpb25zLnN1cnJvdW5kaW5nIHx8IFtdO1xyXG5cdFx0dGhpcy5jb2xvciA9IG9wdGlvbnMuY29sb3IgfHwgJyMwNWYnO1xyXG5cdFx0dGhpcy5iYWNrZ3JvdW5kID0gb3B0aW9ucy5iYWNrZ3JvdW5kIHx8IG51bGw7XHJcblx0XHR0aGlzLmludmVudG9yeSA9IG5ldyBJbnZlbnRvcnkoe1xyXG5cdFx0XHRzaXplOiBvcHRpb25zLmludmVudG9yeVNpemUgfHwgMFxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmlzV2VhcG9uID0gQm9vbGVhbihvcHRpb25zLndlYXBvbik7XHJcblx0XHR0aGlzLmRhbWFnZSA9IHBhcnNlSW50KG9wdGlvbnMud2VhcG9uLCAxMCk7XHJcblx0XHR0aGlzLmlsbHVtaW5hdGlvbiA9IG9wdGlvbnMuaWxsdW1pbmF0aW9uIHx8IDA7XHJcblx0XHR0aGlzLnBvcnRhYmxlID0gKHR5cGVvZiBvcHRpb25zLnBvcnRhYmxlID09PSAnYm9vbGVhbicpID8gb3B0aW9ucy5wb3J0YWJsZSA6IHRydWU7XHJcblx0XHR0aGlzLmNvbnRhaW5lZEluID0gbnVsbDtcclxuXHRcdHRoaXMuYWN0aW9ucyA9IHsgLi4ub3B0aW9ucy5vbiwgLi4ub3B0aW9ucy5hY3Rpb25zIH07XHJcblx0XHRpZiAob3B0aW9ucy51c2UpIHtcclxuXHRcdFx0dGhpcy5hY3Rpb25zLnVzZSA9IG9wdGlvbnMudXNlO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5zdGF0ZXMgPSBvcHRpb25zLnN0YXRlcyB8fCB7fTtcclxuXHRcdHRoaXMudGVsZXBvcnQgPSBudWxsOyAvLyBjYW4gdGhpcyBpdGVtIG1vdmUgdGhlIGNoYXJhY3RlciB0byBhbm90aGVyIGxldmVsLCBjZWxsXHJcblx0fVxyXG5cclxuXHRoYXNBY3Rpb24odmVyYikge1xyXG5cdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5hY3Rpb25zW3ZlcmJdKTtcclxuXHR9XHJcblxyXG5cdGFjdGlvbihhY3Rpb25OYW1lLCB3aG8pIHtcclxuXHRcdGNvbnN0IGFjdGlvbiA9IHRoaXMuYWN0aW9uc1thY3Rpb25OYW1lXTtcclxuXHRcdGxldCBhY3Rpb25PdXRjb21lID0ge307XHJcblx0XHRpZiAodHlwZW9mIGFjdGlvbiA9PT0gJ2Z1bmN0aW9uJykge1xyXG5cdFx0XHRhY3Rpb25PdXRjb21lID0gYWN0aW9uKHRoaXMsIHdobyk7XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBhY3Rpb24gPT09ICdvYmplY3QnICYmIGFjdGlvbiAhPT0gbnVsbCkge1xyXG5cdFx0XHRhY3Rpb25PdXRjb21lID0gdGhpcy5ydW5BY3Rpb24oYWN0aW9uLCB3aG8pO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKCdObyBhY3Rpb24nLCBhY3Rpb25OYW1lLCAnZm9yIGl0ZW0nLCB0aGlzKTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBhY3Rpb25PdXRjb21lO1xyXG5cdH1cclxuXHJcblx0cnVuQWN0aW9uKGFjdGlvbiA9IHt9LCB3aG8pIHsgLy8gVE9ETzogbW92ZSB0byBnYW1lL2xldmVsP1xyXG5cdFx0bGV0IG1lc3NhZ2UgPSAnJztcclxuXHRcdGlmICghdGhpcy5yZXF1aXJlbWVudE1ldChhY3Rpb24sIHdobykpIHtcclxuXHRcdFx0bWVzc2FnZSA9IChhY3Rpb24ubWlzc2luZ01lc3NhZ2UpID8gYWN0aW9uLm1pc3NpbmdNZXNzYWdlIDogYFNvbWUgcmVxdWlyZW1lbnQgaXMgbm90IG1ldCB0byB1c2UgdGhlICR7dGhpcy5uYW1lfWA7XHJcblx0XHRcdHJldHVybiB7IG1lc3NhZ2UgfTtcclxuXHRcdH1cclxuXHRcdHRoaXMucmVtb3ZlUmVxdWlyZW1lbnRzKGFjdGlvbik7XHJcblx0XHRtZXNzYWdlID0gbWVzc2FnZSArICgoYWN0aW9uLm1lc3NhZ2UpID8gYWN0aW9uLm1lc3NhZ2UgOiAnJyk7XHJcblx0XHRjb25zdCBlZmZlY3RzID0gYWN0aW9uLmVmZmVjdHM7XHJcblx0XHRyZXR1cm4geyBtZXNzYWdlLCBlZmZlY3RzIH07XHJcblx0fVxyXG5cclxuXHRyZW1vdmVSZXF1aXJlbWVudHMoYWN0aW9uID0ge30pIHtcclxuXHRcdGlmICghYWN0aW9uLnJlcXVpcmVzKSB7IHJldHVybjsgfVxyXG5cdFx0YWN0aW9uLnJlcXVpcmVzLmZvckVhY2goKHJlcXVpcmVtZW50KSA9PiB7XHJcblx0XHRcdGNvbnN0IHR5cGVLZXkgPSByZXF1aXJlbWVudC5pdGVtO1xyXG5cdFx0XHRpZiAodHlwZUtleSkge1xyXG5cdFx0XHRcdHRoaXMuaW52ZW50b3J5LnJlbW92ZVR5cGUodHlwZUtleSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0cmVxdWlyZW1lbnRNZXQoYWN0aW9uID0ge30sIHdobykge1xyXG5cdFx0aWYgKCFhY3Rpb24ucmVxdWlyZXMpIHtcclxuXHRcdFx0cmV0dXJuIHRydWU7XHJcblx0XHR9XHJcblx0XHRsZXQgbWV0ID0gMDtcclxuXHRcdGFjdGlvbi5yZXF1aXJlcy5mb3JFYWNoKChyZXF1aXJlbWVudCkgPT4ge1xyXG5cdFx0XHRpZiAocmVxdWlyZW1lbnQuaXRlbSAmJiB0aGlzLmludmVudG9yeS5jb250YWluc1R5cGUocmVxdWlyZW1lbnQuaXRlbSkpIHtcclxuXHRcdFx0XHRtZXQgKz0gMTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gbWV0ID09PSBhY3Rpb24ucmVxdWlyZXMubGVuZ3RoO1xyXG5cdH1cclxuXHJcblx0ZHJhdyhkaXNwbGF5LCBsaWdodGluZyA9IHt9LCBpblZpZXcgPSBmYWxzZSkge1xyXG5cdFx0aWYgKHRoaXMuY29udGFpbmVkSW4gfHwgIWluVmlldykgeyAvLyBOb3QgdmlzaWJsZSBpZiBpbiBhIGNvbnRhaW5lclxyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRkaXNwbGF5LmRyYXcodGhpcy54LCB0aGlzLnksIHRoaXMuY2hhcmFjdGVyLCB0aGlzLmNvbG9yLCB0aGlzLmJhY2tncm91bmQpO1xyXG5cdFx0aWYgKHRoaXMuc3Vycm91bmRpbmcubGVuZ3RoKSB7XHJcblx0XHRcdHRoaXMuc3Vycm91bmRpbmcuZm9yRWFjaCgoY2hhciwgaSkgPT4ge1xyXG5cdFx0XHRcdGxldCB7IHgsIHkgfSA9IERJUlNfOFtpXTtcclxuXHRcdFx0XHRkaXNwbGF5LmRyYXcodGhpcy54ICsgeCwgdGhpcy55ICsgeSwgY2hhciwgdGhpcy5jb2xvciwgdGhpcy5iYWNrZ3JvdW5kKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdHJ1ZTtcclxuXHR9XHJcblxyXG5cdGFkZEl0ZW0oaXRlbSkgeyAvLyBtdXRhdGVzIHRoZSBpdGVtIGlmIHN1Y2Nlc3NmdWxcclxuXHRcdGlmICh0aGlzLmludmVudG9yeS5pc0Z1bGwoKSkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRjb25zdCBpc0FkZGVkID0gdGhpcy5pbnZlbnRvcnkuYWRkKGl0ZW0pO1xyXG5cdFx0aWYgKCFpc0FkZGVkKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGl0ZW0uY29udGFpbmVkSW4gPSB0aGlzO1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0gSW52ZW50b3J5XHJcblxyXG5cdGdldENvbnRlbnRzKG4pIHtcclxuXHRcdHJldHVybiB0aGlzLmludmVudG9yeS5nZXQobik7XHJcblx0fVxyXG5cclxuXHRoYXNDb250ZW50cygpIHtcclxuXHRcdHJldHVybiB0aGlzLmludmVudG9yeS5oYXNDb250ZW50cygpO1xyXG5cdH1cclxuXHJcblx0Y29udGFpbnMoaXRlbU5hbWUpIHtcclxuXHRcdHJldHVybiB0aGlzLmludmVudG9yeS5jb250YWlucyhpdGVtTmFtZSk7XHJcblx0fVxyXG5cclxuXHRoYXNTcGFjZSgpIHtcclxuXHRcdHJldHVybiB0aGlzLmludmVudG9yeS5oYXNTcGFjZSgpO1xyXG5cdH1cclxuXHJcblx0YWRkVG9JbnZlbnRvcnkoaXRlbSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuaW52ZW50b3J5LmFkZChpdGVtKTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBTZXRzXHJcblxyXG5cdHNldFRlbGVwb3J0KG9wdGlvbnMgPSB7fSkge1xyXG5cdFx0Y29uc3QgeyBsZXZlbEluZGV4LCB4LCB5LCB2ZXJiIH0gPSBvcHRpb25zO1xyXG5cdFx0dGhpcy50ZWxlcG9ydCA9IHsgbGV2ZWxJbmRleCwgeCwgeSB9O1xyXG5cdFx0dGhpcy5hY3Rpb25zW3ZlcmJdID0gJ3RlbGVwb3J0JztcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSXRlbTtcclxuIiwiLyoqXG4gKiBAY2xhc3MgQWJzdHJhY3QgZGlzcGxheSBiYWNrZW5kIG1vZHVsZVxuICogQHByaXZhdGVcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQmFja2VuZCB7XG4gICAgZ2V0Q29udGFpbmVyKCkgeyByZXR1cm4gbnVsbDsgfVxuICAgIHNldE9wdGlvbnMob3B0aW9ucykgeyB0aGlzLl9vcHRpb25zID0gb3B0aW9uczsgfVxufVxuIiwiZnVuY3Rpb24gZ2V0RGlzdGFuY2UoeDEsIHkxLCB4MiwgeTIpIHtcclxuXHRyZXR1cm4gTWF0aC5zcXJ0KFxyXG5cdFx0TWF0aC5wb3coKHgxIC0geDIpLCAyKVxyXG5cdFx0KyBNYXRoLnBvdygoeTEgLSB5MiksIDIpXHJcblx0KTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcblx0Z2V0RGlzdGFuY2VcclxufTtcclxuIiwiY29uc3QgUk9UID0gcmVxdWlyZSgncm90LWpzJyk7XHJcbmNvbnN0IEludmVudG9yeSA9IHJlcXVpcmUoJy4vSW52ZW50b3J5Jyk7XHJcbmNvbnN0IGdlb21ldGVyID0gcmVxdWlyZSgnLi9nZW9tZXRlcicpO1xyXG5jb25zdCByYW5kb20gPSByZXF1aXJlKCcuL3JhbmRvbScpO1xyXG5cclxuY29uc3QgTU9WRSA9ICdtb3ZlJztcclxuY29uc3QgV0FJVCA9ICd3YWl0JztcclxuY29uc3QgTU9OU1RFUl9GQUNUSU9OID0gJ21vbnN0ZXJzJztcclxuXHJcbmNsYXNzIEFjdG9yIHtcclxuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuXHRcdHRoaXMudHlwZSA9IG9wdGlvbnMudHlwZTtcclxuXHRcdHRoaXMubmFtZSA9IG9wdGlvbnMubmFtZSB8fCBudWxsO1xyXG5cdFx0dGhpcy5mYWN0aW9uID0gb3B0aW9ucy5mYWN0aW9uIHx8IE1PTlNURVJfRkFDVElPTjtcclxuXHRcdHRoaXMuaXNIZXJvID0gQm9vbGVhbihvcHRpb25zLmlzSGVybyk7XHJcblx0XHR0aGlzLnggPSBvcHRpb25zLnggfHwgMDtcclxuXHRcdHRoaXMueSA9IG9wdGlvbnMueSB8fCAwO1xyXG5cdFx0dGhpcy5jaGFyYWN0ZXIgPSBvcHRpb25zLmNoYXJhY3RlciB8fCAnTSc7XHJcblx0XHR0aGlzLm9yaWdpbmFsQ2hhcmFjdGVyID0gdGhpcy5jaGFyYWN0ZXI7XHJcblx0XHR0aGlzLmNvbG9yID0gb3B0aW9ucy5jb2xvciB8fCAnI2RmMic7XHJcblx0XHR0aGlzLm9yaWdpbmFsQ29sb3IgPSB0aGlzLmNvbG9yO1xyXG5cdFx0dGhpcy5ibG9vZENvbG9yID0gJyM2MTEnO1xyXG5cdFx0Ly8gdGhpcy5nYW1lID0gb3B0aW9ucy5nYW1lIHx8IGNvbnNvbGUuZXJyb3IoJ211c3QgdGllIGFjdG9yIHRvIGdhbWUnKTtcclxuXHRcdHRoaXMuaW52ZW50b3J5ID0gbmV3IEludmVudG9yeSh7XHJcblx0XHRcdHNpemU6IG9wdGlvbnMuaW52ZW50b3J5U2l6ZSB8fCAxMFxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLnBhc3NhYmxlID0gZmFsc2U7XHJcblx0XHR0aGlzLmFjdGlvblF1ZXVlID0gW107XHJcblx0XHR0aGlzLm1heE1vdmVtZW50ID0gdGhpcy5pc0hlcm8gPyAxLjQyIDogMTtcclxuXHRcdHRoaXMuc2lnaHRSYW5nZSA9ICh0eXBlb2Ygb3B0aW9ucy5zaWdodFJhbmdlID09PSAnbnVtYmVyJykgPyBvcHRpb25zLnNpZ2h0UmFuZ2UgOiA2O1xyXG5cdFx0dGhpcy50YXJnZXQgPSBudWxsO1xyXG5cdFx0dGhpcy5hZ2dybyA9IG9wdGlvbnMuYWdncm8gfHwgMDtcclxuXHRcdC8vIHN0YXRzXHJcblx0XHR0aGlzLmhwID0gKG9wdGlvbnMuaHAgfHwgdHlwZW9mIG9wdGlvbnMuaHAgPT09ICdudW1iZXInKSA/IHBhcnNlSW50KG9wdGlvbnMuaHAsIDEwKSA6IDI7XHJcblx0XHR0aGlzLmhwTWF4ID0gdGhpcy5ocDtcclxuXHRcdHRoaXMuYXAgPSBvcHRpb25zLmFwIHx8IDA7XHQvLyBBdHRhY2svQXJtc1xyXG5cdFx0dGhpcy5hcE1heCA9IHRoaXMuYXA7XHJcblx0XHR0aGlzLmJwID0gb3B0aW9ucy5icCB8fCAwO1x0Ly8gQmFsYW5jZVxyXG5cdFx0dGhpcy5icE1heCA9IHRoaXMuYnA7XHJcblx0XHR0aGlzLmVwID0gb3B0aW9ucy5lcCB8fCAwO1x0Ly8gRW5kdXJhbmNlXHJcblx0XHR0aGlzLmVwTWF4ID0gdGhpcy5lcDtcclxuXHRcdHRoaXMuZnAgPSBvcHRpb25zLmZwIHx8IDA7XHRcdC8vIEZvY3VzXHJcblx0XHR0aGlzLmZwTWF4ID0gdGhpcy5mcDtcclxuXHRcdHRoaXMud3AgPSBvcHRpb25zLndwIHx8IDA7XHRcdC8vIFdpbGwocG93ZXIpXHJcblx0XHR0aGlzLndwTWF4ID0gdGhpcy53cDtcclxuXHRcdC8vIGFkdmFuY2VtZW50XHJcblx0XHR0aGlzLnhwID0gb3B0aW9ucy54cCB8fCAwO1xyXG5cdFx0dGhpcy5zY29yZSA9IG9wdGlvbnMuc2NvcmUgfHwgMDtcclxuXHRcdC8vIGFiaWxpdGllc1xyXG5cdFx0dGhpcy5tYXhBYmlsaXRpZXMgPSA5O1xyXG5cdFx0dGhpcy5hYmlsaXRpZXMgPSB7fTtcclxuXHRcdHRoaXMuYWJpbGl0eUxpc3QgPSBbXTtcclxuXHRcdC8vIHRlbXBvcmFyeVxyXG5cdFx0dGhpcy5pbml0aWF0aXZlQm9vc3QgPSAwO1xyXG5cdH1cclxuXHJcblx0ZHJhdyhkaXNwbGF5LCBsaWdodGluZyA9IHt9LCBpblZpZXcgPSBmYWxzZSkge1xyXG5cdFx0aWYgKCFpblZpZXcpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0Ly8gVE9ETzogYWRqdXN0IGNvbG9ycyBiYXNlZCBvbiBsaWdodGluZyBhbmQgaW5WaWV3XHJcblx0XHRkaXNwbGF5LmRyYXcodGhpcy54LCB0aGlzLnksIHRoaXMuY2hhcmFjdGVyLCB0aGlzLmNvbG9yKTtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0cXVldWVBY3Rpb24odmVyYiwgcGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IGFjdGlvblBhcmFtcyA9IHsgLi4ucGFyYW1zLCB2ZXJiIH07XHJcblx0XHR0aGlzLmFjdGlvblF1ZXVlLnB1c2goYWN0aW9uUGFyYW1zKTtcclxuXHR9XHJcblxyXG5cdGNsZWFyUXVldWUoKSB7XHJcblx0XHR0aGlzLmFjdGlvblF1ZXVlLmxlbmd0aCA9IDA7XHJcblx0fVxyXG5cclxuXHRwbGFuQWN0aW9uKGxldmVsLCBoZXJvKSB7XHJcblx0XHRpZiAodGhpcy5pc0hlcm8pIHsgcmV0dXJuOyB9XHJcblx0XHRpZiAodGhpcy5kZWFkKCkpIHtcclxuXHRcdFx0dGhpcy5jbGVhclF1ZXVlKCk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGNvbnN0IGRpc3RhbmNlVG9IZXJvID0gZ2VvbWV0ZXIuZ2V0RGlzdGFuY2UodGhpcy54LCB0aGlzLnksIGhlcm8ueCwgaGVyby55KTtcclxuXHRcdGNvbnN0IGRhbmdlcm91c2x5SHVydCA9ICh0aGlzLmhwIDw9IDEpO1xyXG5cdFx0dGhpcy5hY3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGNvbnNvbGUubG9nKGAke3RoaXMubmFtZX0gYWN0c2ApO1xyXG5cdFx0XHQvLyBpZiAoZy5nZXRBY3RpdmVMZXZlbCgpICE9PSBsZXZlbCkgeyByZXR1cm47IH1cclxuXHRcdH07XHJcblx0XHRpZiAodGhpcy5hZ2dybyAmJiBkaXN0YW5jZVRvSGVybyA8PSB0aGlzLmdldE1heFNlbnNlUmFuZ2UoKSAmJiAhaGVyby5kZWFkKCkgJiYgIWRhbmdlcm91c2x5SHVydCkge1xyXG5cdFx0XHRjb25zdCBtYXAgPSBsZXZlbC5nZXRNYXAoKTtcclxuXHRcdFx0dGhpcy5jbGVhclF1ZXVlKCk7XHJcblx0XHRcdHRoaXMuc2V0VGFyZ2V0KGhlcm8pO1xyXG5cdFx0XHR0aGlzLnNldFBhdGhUb1RhcmdldChtYXApO1xyXG5cdFx0XHRpZiAodGhpcy5hdEVuZE9mUGF0aCgpKSB7XHJcblx0XHRcdFx0dGhpcy5xdWV1ZUFjdGlvbignYXR0YWNrJywgeyB0YXJnZXQ6IGhlcm8gfSk7XHJcblx0XHRcdH0gZWxzZSBpZiAodGhpcy5hY3Rpb25RdWV1ZS5sZW5ndGggPT09IDEpIHtcclxuXHRcdFx0XHR0aGlzLmNsZWFyUXVldWUoKTtcclxuXHRcdFx0XHR0aGlzLnF1ZXVlQWN0aW9uKCdhdHRhY2snLCB7IHRhcmdldDogaGVybyB9KTtcclxuXHRcdFx0fVxyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0aWYgKHRoaXMuYXRFbmRPZlBhdGgoKSkge1xyXG5cdFx0XHRcdHRoaXMuc2V0V2FuZGVyUGF0aChsZXZlbCk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdC8vIGNvbnNvbGUubG9nKGAke3RoaXMubmFtZX0gcGxhbnNgLCB0aGlzLmFjdGlvblF1ZXVlKTtcclxuXHR9XHJcblxyXG5cdGRvQWN0aW9uKCkge1xyXG5cdFx0aWYgKHRoaXMuZGVhZCgpKSB7IHJldHVybiB7IHZlcmI6ICdyb3QnIH07IH1cclxuXHRcdGNvbnN0IHdhaXRBY3Rpb24gPSB7IHZlcmI6IFdBSVQgfTtcclxuXHRcdGlmICh0aGlzLmFjdGlvblF1ZXVlLmxlbmd0aCA9PT0gMCkgeyByZXR1cm4gd2FpdEFjdGlvbjsgfVxyXG5cdFx0bGV0IGFjdGlvbiA9IHRoaXMuYWN0aW9uUXVldWUuc2hpZnQoKTtcclxuXHRcdGNvbnN0IG1vdmVBbHJlYWR5VGhlcmUgPSAoYWN0aW9uLnZlcmIgPT09IE1PVkUgJiYgYWN0aW9uLnggPT09IHRoaXMueCAmJiBhY3Rpb24ueSA9PT0gdGhpcy55KTtcclxuXHRcdGNvbnN0IG1vdmVUb29GYXIgPSAoYWN0aW9uLnZlcmIgPT09IE1PVkUgJiYgdGhpcy5nZXREaXN0YW5jZVRvTmV4dE1vdmUoYWN0aW9uKSA+IHRoaXMubWF4TW92ZW1lbnQpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2codGhpcy5uYW1lLCB0aGlzLngsIHRoaXMueSwgYWN0aW9uLnZlcmIsIGFjdGlvbi54LCBhY3Rpb24ueSwgdGhpcy5nZXREaXN0YW5jZVRvTmV4dE1vdmUoKSwgdGhpcy5tYXhNb3ZlbWVudCwgbW92ZVRvb0ZhciwgJ3EnLCB0aGlzLmFjdGlvblF1ZXVlLmxlbmd0aCk7XHJcblx0XHRpZiAobW92ZUFscmVhZHlUaGVyZSkge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5kb0FjdGlvbigpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKG1vdmVUb29GYXIpIHtcclxuXHRcdFx0YWN0aW9uID0gdGhpcy5kb0FjdGlvbigpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCFhY3Rpb24pIHtcclxuXHRcdFx0cmV0dXJuIHdhaXRBY3Rpb247XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gYWN0aW9uO1xyXG5cdH1cclxuXHJcblx0YXR0YWNrKHdobykge1xyXG5cdFx0Y29uc29sZS5sb2coYCR7dGhpcy5uYW1lfSBhdHRhY2tzYCwgd2hvKTtcclxuXHRcdC8vIFRPRE9cclxuXHR9XHJcblxyXG5cdHNldFdhbmRlclBhdGgobGV2ZWwpIHtcclxuXHRcdGNvbnN0IG1hcCA9IGxldmVsLmdldE1hcCgpO1xyXG5cdFx0Y29uc3QgeyB4LCB5IH0gPSBsZXZlbC5maW5kUmFuZG9tRnJlZUNlbGwoKTtcclxuXHRcdHRoaXMuc2V0UGF0aFRvKG1hcCwgeCwgeSk7XHJcblx0fVxyXG5cclxuXHRhdEVuZE9mUGF0aCgpIHtcclxuXHRcdGNvbnN0IG5leHRBY3Rpb24gPSB0aGlzLmdldE5leHRBY3Rpb24oKTtcclxuXHRcdGlmICghbmV4dEFjdGlvbikgeyByZXR1cm4gdHJ1ZTsgfVxyXG5cdFx0cmV0dXJuIChuZXh0QWN0aW9uLnZlcmIgPT09IE1PVkUpID8gZmFsc2UgOiB0cnVlO1xyXG5cdH1cclxuXHJcblx0d2FpdCgpIHtcclxuXHRcdHRoaXMuaGVhbFBvb2xzKCk7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0gTW92ZW1lbnRcclxuXHJcblx0bW92ZSh4LCB5KSB7XHJcblx0XHR0aGlzLnggKz0gcGFyc2VJbnQoeCwgMTApO1xyXG5cdFx0dGhpcy55ICs9IHBhcnNlSW50KHksIDEwKTtcclxuXHR9XHJcblxyXG5cdG1vdmVUbyh4LCB5KSB7XHJcblx0XHR0aGlzLnNldENvb3JkaW5hdGVzKHgsIHkpO1xyXG5cdH1cclxuXHJcblx0Ly8tLS0tIENvbWJhdFxyXG5cclxuXHRhdHRhY2tEYW1hZ2Uob3Bwb25lbnQpIHtcclxuXHRcdHJldHVybiAxO1xyXG5cdH1cclxuXHJcblx0d291bmQobikge1xyXG5cdFx0cmV0dXJuIHRoaXMuaGVhbChuICogLTEpO1xyXG5cdH1cclxuXHJcblx0aGVhbChuKSB7XHJcblx0XHRjb25zdCBvcmlnaW5hbEhwID0gdGhpcy5ocDtcclxuXHRcdHRoaXMuaHAgKz0gcGFyc2VJbnQobiwgMTApO1xyXG5cdFx0dGhpcy5ocCA9IE1hdGgubWluKHRoaXMuaHAsIHRoaXMuaHBNYXgpO1xyXG5cdFx0dGhpcy5jaGVja0RlYXRoKCk7XHJcblx0XHRyZXR1cm4gdGhpcy5ocCAtIG9yaWdpbmFsSHA7XHJcblx0fVxyXG5cclxuXHRkZWFkKCkge1xyXG5cdFx0cmV0dXJuICh0aGlzLmhwIDw9IDApO1xyXG5cdH1cclxuXHJcblx0Y2hlY2tEZWF0aCgpIHtcclxuXHRcdGlmICh0aGlzLmRlYWQoKSkge1xyXG5cdFx0XHR0aGlzLmNoYXJhY3RlciA9ICdYJztcclxuXHRcdFx0dGhpcy5jb2xvciA9IHRoaXMuYmxvb2RDb2xvcjtcclxuXHRcdFx0dGhpcy5wYXNzYWJsZSA9IHRydWU7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHQvLy0tLS0gSGVhbGluZ1xyXG5cclxuXHRoZWFsUG9vbHMoKSB7XHJcblx0XHR0aGlzLmhlYWxQb29sKHRoaXMuZ2V0UmFuZG9tUG9vbEtleSgpKTtcclxuXHR9XHJcblxyXG5cdGhlYWxQb29sKHBvb2xLZXksIGFtb3VudCA9IDEpIHtcclxuXHRcdGNvbnN0IGEgPSB0aGlzLmdldEFiaWxpdHlSZWFkaWVkQW1vdW50cygpO1xyXG5cdFx0Y29uc3QgbWF4ID0gdGhpc1twb29sS2V5ICsgJ01heCddO1xyXG5cdFx0aWYgKGFbcG9vbEtleV0gKyB0aGlzW3Bvb2xLZXldICsgYW1vdW50IDw9IG1heCkge1xyXG5cdFx0XHR0aGlzW3Bvb2xLZXldICs9IGFtb3VudDtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdGlmICh0aGlzLmlzSGVybykge1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKCdObyBzcGFjZSB0byBoZWFsJywgcG9vbEtleSwgdGhpcyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdGRhbWFnZVBvb2wocG9vbEtleSwgYW1vdW50ID0gMSkge1xyXG5cdFx0dGhpc1twb29sS2V5XSAtPSBhbW91bnQ7XHJcblx0XHR0aGlzW3Bvb2xLZXldID0gTWF0aC5tYXgoMCwgdGhpc1twb29sS2V5XSk7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0gQWJpbGl0aWVzXHJcblxyXG5cdGhhc0FiaWxpdHkoYWJpbGl0eUtleSkge1xyXG5cdFx0cmV0dXJuIEJvb2xlYW4odGhpcy5hYmlsaXRpZXNbYWJpbGl0eUtleV0pO1xyXG5cdH1cclxuXHJcblx0YWRkQWJpbGl0eShhYmlsaXR5S2V5LCBhYmlsaXR5RGF0YSkge1xyXG5cdFx0aWYgKHRoaXMuYWJpbGl0eUxpc3QubGVuZ3RoID49IHRoaXMubWF4QWJpbGl0aWVzKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGlmICh0aGlzLmhhc0FiaWxpdHkoYWJpbGl0eUtleSkpIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKCdDYW5ub3QgYWRkIGFiaWxpdHkgdHdpY2UgLSB3b3VsZCBvdmVycmlkZScpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHQvLyBUT0RPOiBtb3ZlIHRvIEFjdGl2aXR5IGNsYXNzP1xyXG5cdFx0Y29uc3QgYWJpbGl0eSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoYWJpbGl0eURhdGEpKTtcclxuXHRcdHRoaXMuYWJpbGl0aWVzW2FiaWxpdHlLZXldID0gYWJpbGl0eTtcclxuXHRcdGFiaWxpdHkuaXNSZWFkaWVkID0gZmFsc2U7XHJcblx0XHRhYmlsaXR5LmtleSA9IGFiaWxpdHlLZXk7XHJcblx0XHR0aGlzLmFiaWxpdHlMaXN0LnB1c2goYWJpbGl0eUtleSk7XHJcblx0XHRyZXR1cm4gYWJpbGl0eTtcclxuXHR9XHJcblxyXG5cdGdldEFiaWxpdHlCeUluZGV4KGkpIHtcclxuXHRcdGNvbnN0IGtleSA9IHRoaXMuYWJpbGl0eUxpc3RbaV07XHJcblx0XHRyZXR1cm4gdGhpcy5hYmlsaXRpZXNba2V5XTtcclxuXHR9XHJcblxyXG5cdGdldEFiaWxpdHlSZWFkaWVkQW1vdW50cygpIHtcclxuXHRcdGNvbnN0IGEgPSB7IGhwOiAwLCBhcDogMCwgYnA6IDAsIGVwOiAwIH07XHJcblx0XHR0aGlzLmFiaWxpdHlMaXN0LmZvckVhY2goKGFiaWxpdHlLZXkpID0+IHtcclxuXHRcdFx0Y29uc3QgYWJpbGl0eSA9IHRoaXMuYWJpbGl0aWVzW2FiaWxpdHlLZXldO1xyXG5cdFx0XHRBY3Rvci5sb29wT3ZlckFiaWxpdHlDb3N0cyhhYmlsaXR5LCAoY29zdEtleSwgdmFsKSA9PiB7XHJcblx0XHRcdFx0aWYgKGFiaWxpdHkuaXNSZWFkaWVkKSB7XHJcblx0XHRcdFx0XHRhW2Nvc3RLZXldICs9IHZhbDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gYTtcclxuXHR9XHJcblxyXG5cdGNhblJlYWR5QWJpbGl0eShhYmlsaXR5KSB7XHJcblx0XHRpZiAoYWJpbGl0eS5pc1JlYWRpZWQpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRsZXQgY2FuUmVhZHkgPSB0cnVlO1xyXG5cdFx0QWN0b3IubG9vcE92ZXJBYmlsaXR5Q29zdHMoYWJpbGl0eSwgKGNvc3RLZXksIHZhbCkgPT4ge1xyXG5cdFx0XHRjb25zdCBwb29sQW1vdW50ID0gdGhpc1tjb3N0S2V5XTtcclxuXHRcdFx0aWYgKHZhbCA+IHBvb2xBbW91bnQpIHtcclxuXHRcdFx0XHRjYW5SZWFkeSA9IGZhbHNlO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBjYW5SZWFkeTtcclxuXHR9XHJcblxyXG5cdHJlYWR5QWJpbGl0eUJ5SW5kZXgoaSkge1xyXG5cdFx0Y29uc3QgYWJpbGl0eSA9IHRoaXMuZ2V0QWJpbGl0eUJ5SW5kZXgoaSk7XHJcblx0XHRpZiAoIWFiaWxpdHkpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRpZiAoIXRoaXMuY2FuUmVhZHlBYmlsaXR5KGFiaWxpdHkpKSB7IHJldHVybiBmYWxzZTsgfVxyXG5cdFx0QWN0b3IubG9vcE92ZXJBYmlsaXR5Q29zdHMoYWJpbGl0eSwgKGNvc3RLZXksIHZhbCkgPT4ge1xyXG5cdFx0XHR0aGlzW2Nvc3RLZXldIC09IHZhbDtcclxuXHRcdH0pO1xyXG5cdFx0YWJpbGl0eS5pc1JlYWRpZWQgPSB0cnVlO1xyXG5cdFx0cmV0dXJuIGFiaWxpdHk7XHJcblx0fVxyXG5cclxuXHRhY3RpdmF0ZUFiaWxpdGllcyhldmVudE5hbWUpIHtcclxuXHRcdGNvbnN0IHRyaWdnZXJlZEFiaWxpdGllcyA9IHRoaXMuZ2V0VHJpZ2dlcmVkQWJpbGl0aWVzKGV2ZW50TmFtZSk7XHJcblx0XHRsZXQgZWZmZWN0cyA9IFtdO1xyXG5cdFx0dHJpZ2dlcmVkQWJpbGl0aWVzLmZvckVhY2goKGFiaWxpdHkpID0+IHtcclxuXHRcdFx0YWJpbGl0eS5pc1JlYWRpZWQgPSBmYWxzZTtcclxuXHRcdFx0ZWZmZWN0cyA9IGVmZmVjdHMuY29uY2F0KGFiaWxpdHkuZWZmZWN0cyk7XHJcblx0XHR9KTtcclxuXHRcdHJldHVybiBlZmZlY3RzO1xyXG5cdH1cclxuXHJcblx0Z2V0VHJpZ2dlcmVkQWJpbGl0aWVzKGV2ZW50TmFtZSkge1xyXG5cdFx0Y29uc3QgdHJpZ2dlcmVkQWJpbGl0aWVzID0gW107XHJcblx0XHR0aGlzLmFiaWxpdHlMaXN0LmZvckVhY2goKGFiaWxpdHlLZXkpID0+IHtcclxuXHRcdFx0Y29uc3QgYWJpbGl0eSA9IHRoaXMuYWJpbGl0aWVzW2FiaWxpdHlLZXldO1xyXG5cdFx0XHRpZiAoYWJpbGl0eS5pc1JlYWRpZWQgJiYgYWJpbGl0eS5hY3RpdmF0ZU9uID09PSBldmVudE5hbWUpIHtcclxuXHRcdFx0XHR0cmlnZ2VyZWRBYmlsaXRpZXMucHVzaChhYmlsaXR5KTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gdHJpZ2dlcmVkQWJpbGl0aWVzO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIGxvb3BPdmVyQWJpbGl0eUNvc3RzKGFiaWxpdHksIGZuKSB7XHJcblx0XHRjb25zdCBjb3N0cyA9IE9iamVjdC5rZXlzKGFiaWxpdHkucmVhZHlDb3N0KTtcclxuXHRcdGNvc3RzLmZvckVhY2goKGtleSkgPT4ge1xyXG5cdFx0XHRmbihrZXksIHBhcnNlSW50KGFiaWxpdHkucmVhZHlDb3N0W2tleV0sIDEwKSk7XHJcblx0XHR9KTtcdFx0XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0QWJpbGl0eUVmZmVjdHNTdHJpbmcoYWJpbGl0eSkge1xyXG5cdFx0bGV0IGFyciA9IFtdO1xyXG5cdFx0YWJpbGl0eS5lZmZlY3RzLmZvckVhY2goKGVmZmVjdCkgPT4ge1xyXG5cdFx0XHRjb25zdCB3b3JkcyA9ICh0eXBlb2YgZWZmZWN0ID09PSAnc3RyaW5nJykgPyBbZWZmZWN0XSA6IE9iamVjdC5rZXlzKGVmZmVjdCk7XHJcblx0XHRcdGFyciA9IGFyci5jb25jYXQod29yZHMpO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gYXJyLmpvaW4oJywgJyk7XHJcblx0fVxyXG5cclxuXHRzdGF0aWMgZ2V0QWJpbGl0eURlc2NyaXB0aW9uSHRtbChhYmlsaXR5KSB7XHJcblx0XHRsZXQgcmVhZHkgPSAnUmVhZHkgd2l0aCc7XHJcblx0XHRBY3Rvci5sb29wT3ZlckFiaWxpdHlDb3N0cyhhYmlsaXR5LCAoY29zdEtleSwgdmFsKSA9PiB7XHJcblx0XHRcdHJlYWR5ICs9ICcgJyArIHZhbCArICcgJyArIGNvc3RLZXkudG9VcHBlckNhc2UoKTtcclxuXHRcdH0pO1xyXG5cdFx0Y29uc3QgZWZmZWN0cyA9IEFjdG9yLmdldEFiaWxpdHlFZmZlY3RzU3RyaW5nKGFiaWxpdHkpO1xyXG5cdFx0cmV0dXJuIGA8ZGl2IGNsYXNzPVwiYWJpbGl0eS1kZXNjcmlwdGlvblwiPiR7YWJpbGl0eS5kZXNjcmlwdGlvbn08L2Rpdj5cclxuXHRcdDxkaXYgY2xhc3M9XCJhYmlsaXR5LXJlYWR5LXdpdGhcIj4ke3JlYWR5fTwvZGl2PlxyXG5cdFx0PGRpdiBjbGFzcz1cImFiaWxpdHktYWN0aXZhdGVzLW9uXCI+QWN0aXZhdGVzIG9uOiAke2FiaWxpdHkuYWN0aXZhdGVPbn08L2Rpdj5cclxuXHRcdDxkaXYgY2xhc3M9XCJhYmlsaXR5LWVmZmVjdHNcIj5DYXVzZXM6ICR7ZWZmZWN0c308L2Rpdj5gO1xyXG5cdH1cclxuXHJcblx0Ly8tLS0tIEV4cGVyaWVuY2VcclxuXHJcblx0Z2FpblJhbmRvbVBvb2xNYXgoKSB7XHJcblx0XHRjb25zdCBrZXkgPSB0aGlzLmdldFJhbmRvbVBvb2xLZXkoKSArICdNYXgnO1xyXG5cdFx0dGhpc1trZXldICs9IDE7XHJcblx0fVxyXG5cclxuXHRnYWluUmFuZG9tQWJpbGl0eShhYmlsaXRpZXNEYXRhKSB7XHJcblx0XHRjb25zdCBhYmlsaXR5S2V5cyA9IE9iamVjdC5rZXlzKGFiaWxpdGllc0RhdGEpO1xyXG5cdFx0bGV0IGFiaWxpdHlLZXkgPSByYW5kb20ucGlja09uZShhYmlsaXR5S2V5cyk7XHJcblx0XHRsZXQgYXR0ZW1wdHMgPSAxMDA7XHJcblx0XHR3aGlsZSAodGhpcy5oYXNBYmlsaXR5KGFiaWxpdHlLZXkpICYmIGF0dGVtcHRzLS0pIHtcclxuXHRcdFx0YWJpbGl0eUtleSA9IHJhbmRvbS5waWNrT25lKGFiaWxpdHlLZXlzKTtcclxuXHRcdH1cclxuXHRcdHRoaXMuYWRkQWJpbGl0eShhYmlsaXR5S2V5LCBhYmlsaXRpZXNEYXRhW2FiaWxpdHlLZXldKTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBHZXRzXHJcblxyXG5cdGdldFJhbmRvbVBvb2xLZXkoKSB7XHJcblx0XHRyZXR1cm4gcmFuZG9tLnBpY2tPbmUoWydhcCcsICdicCcsICdlcCddKTtcclxuXHR9XHJcblxyXG5cdGdldE1heFNlbnNlUmFuZ2UoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5zaWdodFJhbmdlO1xyXG5cdH1cclxuXHJcblx0Z2V0TmV4dEFjdGlvbigpIHtcclxuXHRcdHJldHVybiB0aGlzLmFjdGlvblF1ZXVlWzBdO1xyXG5cdH1cclxuXHJcblx0Z2V0RGlzdGFuY2VUb05leHRNb3ZlKG5leHRBY3Rpb24pIHtcclxuXHRcdGlmICghbmV4dEFjdGlvbikgeyBuZXh0QWN0aW9uID0gdGhpcy5nZXROZXh0QWN0aW9uKCk7IH1cclxuXHRcdGlmICghbmV4dEFjdGlvbikgeyByZXR1cm4gMDsgfVxyXG5cdFx0Y29uc3QgeyB4LCB5IH0gPSBuZXh0QWN0aW9uO1xyXG5cdFx0aWYgKHggIT09IHVuZGVmaW5lZCAmJiB5ICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0cmV0dXJuIGdlb21ldGVyLmdldERpc3RhbmNlKHgsIHksIHRoaXMueCwgdGhpcy55KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiBudWxsOyAvLyA/XHJcblx0fVxyXG5cclxuXHRnZXRXZWFwb25EYW1hZ2UoKSB7XHJcblx0XHRpZiAoIXRoaXMuaXNIZXJvKSB7XHJcblx0XHRcdHJldHVybiAxOyAvLyBUT0RPOiBjaGFuZ2UgdGhpcyBzbyB0aGVyZSBpcyBzb21lIGtpbmQgb2YgbmF0dXJhbCBkYW1hZ2UgZm9yIG1vbnN0ZXJzXHJcblx0XHR9XHJcblx0XHRsZXQgaGlnaGVzdERhbWFnZSA9IDA7XHJcblx0XHR0aGlzLmludmVudG9yeS5sb29wT3ZlckNvbnRlbnRzKChpdGVtKSA9PiB7XHJcblx0XHRcdGlmIChpdGVtLmRhbWFnZSA+IGhpZ2hlc3REYW1hZ2UpIHtcclxuXHRcdFx0XHRoaWdoZXN0RGFtYWdlID0gaXRlbS5kYW1hZ2U7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGhpZ2hlc3REYW1hZ2U7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0gU2V0c1xyXG5cclxuXHRzZXRDb29yZGluYXRlcyh4LCB5KSB7XHJcblx0XHR0aGlzLnggPSBwYXJzZUludCh4LCAxMCk7XHJcblx0XHR0aGlzLnkgPSBwYXJzZUludCh5LCAxMCk7XHJcblx0fVxyXG5cclxuXHRzZXRQYXRoVG8obWFwLCB4ID0gMCwgeSA9IDApIHtcclxuXHRcdGNvbnN0IHBhc3NhYmxlQ2FsbGJhY2sgPSBmdW5jdGlvbih4LCB5KSB7XHJcblx0XHRcdHJldHVybiBtYXAuZ2V0Q2VsbFBhc3NhYmlsaXR5KHgsIHkpO1xyXG5cdFx0fTtcclxuXHRcdGNvbnN0IGFzdGFyID0gbmV3IFJPVC5QYXRoLkFTdGFyKHgsIHksIHBhc3NhYmxlQ2FsbGJhY2ssIHsgdG9wb2xvZ3k6IDQgfSk7XHJcblx0XHRjb25zdCBwYXRoID0gdGhpcy5hY3Rpb25RdWV1ZTtcclxuXHRcdGNvbnN0IHBhdGhDYWxsYmFjayA9IGZ1bmN0aW9uKHgsIHkpIHtcclxuXHRcdFx0cGF0aC5wdXNoKHsgeCwgeSwgdmVyYjogTU9WRSB9KTtcclxuXHRcdH07XHJcblx0XHRpZiAocGF0aFswXSAmJiBwYXRoWzBdLnggPT09IHRoaXMueCAmJiBwYXRoWzBdLnkgPT09IHRoaXMueSkge1xyXG5cdFx0XHRjb25zb2xlLmFsZXJ0KCdyZW1vdmluZyBmaXJzdCcpO1xyXG5cdFx0XHRwYXRoLnNoaWZ0KCk7XHJcblx0XHR9XHJcblx0XHRhc3Rhci5jb21wdXRlKHRoaXMueCwgdGhpcy55LCBwYXRoQ2FsbGJhY2spO1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRzZXRQYXRoVG9UYXJnZXQobWFwKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5zZXRQYXRoVG8obWFwLCB0aGlzLnRhcmdldC54LCB0aGlzLnRhcmdldC55KTtcclxuXHR9XHJcblxyXG5cdHNldFRhcmdldCh0YXJnZXQpIHtcclxuXHRcdGlmICh0eXBlb2YgdGFyZ2V0LnggIT09ICdudW1iZXInIHx8IHR5cGVvZiB0YXJnZXQueSAhPT0gJ251bWJlcicpIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKCdDYW5ub3Qgc2V0IHRhcmdldCB0byBzb21ldGhpbmcgd2l0aG91dCB4LHknKTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy50YXJnZXQgPSB0YXJnZXQ7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEFjdG9yO1xyXG4iLCJpbXBvcnQgQmFja2VuZCBmcm9tIFwiLi9iYWNrZW5kLmpzXCI7XG5pbXBvcnQgKiBhcyBDb2xvciBmcm9tIFwiLi4vY29sb3IuanNcIjtcbmZ1bmN0aW9uIGNsZWFyVG9BbnNpKGJnKSB7XG4gICAgcmV0dXJuIGBcXHgxYlswOzQ4OzU7JHt0ZXJtY29sb3IoYmcpfW1cXHgxYlsySmA7XG59XG5mdW5jdGlvbiBjb2xvclRvQW5zaShmZywgYmcpIHtcbiAgICByZXR1cm4gYFxceDFiWzA7Mzg7NTske3Rlcm1jb2xvcihmZyl9OzQ4OzU7JHt0ZXJtY29sb3IoYmcpfW1gO1xufVxuZnVuY3Rpb24gcG9zaXRpb25Ub0Fuc2koeCwgeSkge1xuICAgIHJldHVybiBgXFx4MWJbJHt5ICsgMX07JHt4ICsgMX1IYDtcbn1cbmZ1bmN0aW9uIHRlcm1jb2xvcihjb2xvcikge1xuICAgIGNvbnN0IFNSQ19DT0xPUlMgPSAyNTYuMDtcbiAgICBjb25zdCBEU1RfQ09MT1JTID0gNi4wO1xuICAgIGNvbnN0IENPTE9SX1JBVElPID0gRFNUX0NPTE9SUyAvIFNSQ19DT0xPUlM7XG4gICAgbGV0IHJnYiA9IENvbG9yLmZyb21TdHJpbmcoY29sb3IpO1xuICAgIGxldCByID0gTWF0aC5mbG9vcihyZ2JbMF0gKiBDT0xPUl9SQVRJTyk7XG4gICAgbGV0IGcgPSBNYXRoLmZsb29yKHJnYlsxXSAqIENPTE9SX1JBVElPKTtcbiAgICBsZXQgYiA9IE1hdGguZmxvb3IocmdiWzJdICogQ09MT1JfUkFUSU8pO1xuICAgIHJldHVybiByICogMzYgKyBnICogNiArIGIgKiAxICsgMTY7XG59XG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZXJtIGV4dGVuZHMgQmFja2VuZCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuX29mZnNldCA9IFswLCAwXTtcbiAgICAgICAgdGhpcy5fY3Vyc29yID0gWy0xLCAtMV07XG4gICAgICAgIHRoaXMuX2xhc3RDb2xvciA9IFwiXCI7XG4gICAgfVxuICAgIHNjaGVkdWxlKGNiKSB7IHNldFRpbWVvdXQoY2IsIDEwMDAgLyA2MCk7IH1cbiAgICBzZXRPcHRpb25zKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIuc2V0T3B0aW9ucyhvcHRpb25zKTtcbiAgICAgICAgbGV0IHNpemUgPSBbb3B0aW9ucy53aWR0aCwgb3B0aW9ucy5oZWlnaHRdO1xuICAgICAgICBsZXQgYXZhaWwgPSB0aGlzLmNvbXB1dGVTaXplKCk7XG4gICAgICAgIHRoaXMuX29mZnNldCA9IGF2YWlsLm1hcCgodmFsLCBpbmRleCkgPT4gTWF0aC5mbG9vcigodmFsIC0gc2l6ZVtpbmRleF0pIC8gMikpO1xuICAgIH1cbiAgICBjbGVhcigpIHtcbiAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUoY2xlYXJUb0Fuc2kodGhpcy5fb3B0aW9ucy5iZykpO1xuICAgIH1cbiAgICBkcmF3KGRhdGEsIGNsZWFyQmVmb3JlKSB7XG4gICAgICAgIC8vIGRldGVybWluZSB3aGVyZSB0byBkcmF3IHdoYXQgd2l0aCB3aGF0IGNvbG9yc1xuICAgICAgICBsZXQgW3gsIHksIGNoLCBmZywgYmddID0gZGF0YTtcbiAgICAgICAgLy8gZGV0ZXJtaW5lIGlmIHdlIG5lZWQgdG8gbW92ZSB0aGUgdGVybWluYWwgY3Vyc29yXG4gICAgICAgIGxldCBkeCA9IHRoaXMuX29mZnNldFswXSArIHg7XG4gICAgICAgIGxldCBkeSA9IHRoaXMuX29mZnNldFsxXSArIHk7XG4gICAgICAgIGxldCBzaXplID0gdGhpcy5jb21wdXRlU2l6ZSgpO1xuICAgICAgICBpZiAoZHggPCAwIHx8IGR4ID49IHNpemVbMF0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHkgPCAwIHx8IGR5ID49IHNpemVbMV0pIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgICBpZiAoZHggIT09IHRoaXMuX2N1cnNvclswXSB8fCBkeSAhPT0gdGhpcy5fY3Vyc29yWzFdKSB7XG4gICAgICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShwb3NpdGlvblRvQW5zaShkeCwgZHkpKTtcbiAgICAgICAgICAgIHRoaXMuX2N1cnNvclswXSA9IGR4O1xuICAgICAgICAgICAgdGhpcy5fY3Vyc29yWzFdID0gZHk7XG4gICAgICAgIH1cbiAgICAgICAgLy8gdGVybWluYWxzIGF1dG9tYXRpY2FsbHkgY2xlYXIsIGJ1dCBpZiB3ZSdyZSBjbGVhcmluZyB3aGVuIHdlJ3JlXG4gICAgICAgIC8vIG5vdCBvdGhlcndpc2UgcHJvdmlkZWQgd2l0aCBhIGNoYXJhY3RlciwganVzdCB1c2UgYSBzcGFjZSBpbnN0ZWFkXG4gICAgICAgIGlmIChjbGVhckJlZm9yZSkge1xuICAgICAgICAgICAgaWYgKCFjaCkge1xuICAgICAgICAgICAgICAgIGNoID0gXCIgXCI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gaWYgd2UncmUgbm90IGNsZWFyaW5nIGFuZCBub3QgcHJvdmlkZWQgd2l0aCBhIGNoYXJhY3RlciwgZG8gbm90aGluZ1xuICAgICAgICBpZiAoIWNoKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgLy8gZGV0ZXJtaW5lIGlmIHdlIG5lZWQgdG8gY2hhbmdlIGNvbG9yc1xuICAgICAgICBsZXQgbmV3Q29sb3IgPSBjb2xvclRvQW5zaShmZywgYmcpO1xuICAgICAgICBpZiAobmV3Q29sb3IgIT09IHRoaXMuX2xhc3RDb2xvcikge1xuICAgICAgICAgICAgcHJvY2Vzcy5zdGRvdXQud3JpdGUobmV3Q29sb3IpO1xuICAgICAgICAgICAgdGhpcy5fbGFzdENvbG9yID0gbmV3Q29sb3I7XG4gICAgICAgIH1cbiAgICAgICAgLy8gd3JpdGUgdGhlIHByb3ZpZGVkIHN5bWJvbCB0byB0aGUgZGlzcGxheVxuICAgICAgICBsZXQgY2hhcnMgPSBbXS5jb25jYXQoY2gpO1xuICAgICAgICBwcm9jZXNzLnN0ZG91dC53cml0ZShjaGFyc1swXSk7XG4gICAgICAgIC8vIHVwZGF0ZSBvdXIgcG9zaXRpb24sIGdpdmVuIHRoYXQgd2Ugd3JvdGUgYSBjaGFyYWN0ZXJcbiAgICAgICAgdGhpcy5fY3Vyc29yWzBdKys7XG4gICAgICAgIGlmICh0aGlzLl9jdXJzb3JbMF0gPj0gc2l6ZVswXSkge1xuICAgICAgICAgICAgdGhpcy5fY3Vyc29yWzBdID0gMDtcbiAgICAgICAgICAgIHRoaXMuX2N1cnNvclsxXSsrO1xuICAgICAgICB9XG4gICAgfVxuICAgIGNvbXB1dGVGb250U2l6ZSgpIHsgdGhyb3cgbmV3IEVycm9yKFwiVGVybWluYWwgYmFja2VuZCBoYXMgbm8gbm90aW9uIG9mIGZvbnQgc2l6ZVwiKTsgfVxuICAgIGV2ZW50VG9Qb3NpdGlvbih4LCB5KSB7IHJldHVybiBbeCwgeV07IH1cbiAgICBjb21wdXRlU2l6ZSgpIHsgcmV0dXJuIFtwcm9jZXNzLnN0ZG91dC5jb2x1bW5zLCBwcm9jZXNzLnN0ZG91dC5yb3dzXTsgfVxufVxuIiwiY29uc3QgRm9udEZhY2VPYnNlcnZlciA9IHJlcXVpcmUoJ2ZvbnRmYWNlb2JzZXJ2ZXInKTtcclxuXHJcbmZ1bmN0aW9uIGRvbVJlYWR5KCkge1xyXG5cdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XHJcblx0XHRpZiAoZG9jdW1lbnQucmVhZHlTdGF0ZSA9PT0gXCJjb21wbGV0ZVwiIHx8IGRvY3VtZW50LnJlYWR5U3RhdGUgPT09IFwibG9hZGVkXCIpIHtcclxuXHRcdFx0cmVzb2x2ZSgpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIiwgKCkgPT4ge1xyXG5cdFx0XHRcdHJlc29sdmUoKTtcclxuXHRcdFx0fSk7XHJcblx0XHR9XHJcblx0fSk7XHJcbn1cclxuXHJcbmZ1bmN0aW9uIHJlYWR5KGZuLCBmb250cyA9IFtdKSB7XHJcblx0aWYgKGZvbnRzLmxlbmd0aCA+IDApIHtcclxuXHRcdC8vIFRPRE86IGFsbG93IG11bHRpcGxlIGZvbnRzIH4gaHR0cHM6Ly9naXRodWIuY29tL2JyYW1zdGVpbi9mb250ZmFjZW9ic2VydmVyXHJcblx0XHRjb25zdCBmb250ID0gbmV3IEZvbnRGYWNlT2JzZXJ2ZXIoZm9udHNbMF0pO1xyXG5cdFx0Zm9udC5sb2FkKClcclxuXHRcdFx0LnRoZW4oKCkgPT4geyBkb21SZWFkeSgpLnRoZW4oZm4pOyB9KVxyXG5cdFx0XHQuY2F0Y2goKCkgPT4geyBjb25zb2xlLndhcm4oJ2Vycm9yIGxvYWRpbmcgZm9udCcpOyBkb21SZWFkeSgpLnRoZW4oZm4pOyB9KTtcclxuXHRcdHJldHVybjtcclxuXHR9XHJcblx0ZG9tUmVhZHkoKS50aGVuKGZuKTtcclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSByZWFkeTtcclxuIiwiY29uc3QgUk9UID0gcmVxdWlyZSgncm90LWpzJyk7XHJcblxyXG5jbGFzcyBEaXNwbGF5IHtcclxuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuXHRcdG9wdGlvbnMgPSB7IHdpZHRoOiA2MCwgaGVpZ2h0OiAzMCwgLi4ub3B0aW9ucyB9O1xyXG5cdFx0dGhpcy53aWR0aCA9IG51bGw7XHJcblx0XHR0aGlzLmhlaWdodCA9IG51bGw7XHJcblx0XHR0aGlzLmNlbnRlciA9IHt9O1xyXG5cdFx0dGhpcy5zZXREaW1lbnNpb25zKG9wdGlvbnMud2lkdGgsIG9wdGlvbnMuaGVpZ2h0KTtcclxuXHJcblx0XHR0aGlzLmlkID0gb3B0aW9ucy5pZCB8fCAnZGlzcGxheSc7XHJcblx0XHR0aGlzLnJvdERpc3BsYXkgPSBuZXcgUk9ULkRpc3BsYXkob3B0aW9ucyk7IC8vICwgbGF5b3V0OlwidGVybVwifSk7XHJcblx0XHR0aGlzLmRpc3BsYXlDb250YWluZXIgPSBudWxsO1xyXG5cdFx0dGhpcy5lbHQgPSBudWxsXHJcblx0XHR0aGlzLmNhbWVyYVRhcmdldCA9IG51bGw7XHJcblx0XHR0aGlzLnNldHVwRWxlbWVudHMoKTtcclxuXHR9XHJcblxyXG5cdHNldERpbWVuc2lvbnMoeCwgeSkge1xyXG5cdFx0dGhpcy53aWR0aCA9IHg7XHJcblx0XHR0aGlzLmhlaWdodCA9IHk7XHJcblx0XHR0aGlzLmNlbnRlci54ID0gTWF0aC5yb3VuZCh4LzIpO1xyXG5cdFx0dGhpcy5jZW50ZXIueSA9IE1hdGgucm91bmQoeS8yKTtcclxuXHR9XHJcblxyXG5cdHNldHVwRWxlbWVudHMoKSB7XHJcblx0XHR0aGlzLmRpc3BsYXlDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcclxuXHRcdHRoaXMuZWx0ID0gdGhpcy5yb3REaXNwbGF5LmdldENvbnRhaW5lcigpOyAvLyBjYW52YXNcclxuXHRcdHRoaXMuYXBwZW5kVG9FbGVtZW50KHRoaXMuZWx0KTtcclxuXHR9XHJcblxyXG5cdGFwcGVuZFRvRWxlbWVudChlbHQpIHtcclxuXHRcdHRoaXMuZGlzcGxheUNvbnRhaW5lci5hcHBlbmRDaGlsZChlbHQpO1xyXG5cdH1cclxuXHJcblx0c2V0Q2FtZXJhVGFyZ2V0KGNhbWVyYVRhcmdldCkge1xyXG5cdFx0aWYgKCFjYW1lcmFUYXJnZXQpIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKFwiTm8gdGFyZ2V0XCIsIGNhbWVyYVRhcmdldCk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGlmICh0eXBlb2YgY2FtZXJhVGFyZ2V0LnggIT09ICdudW1iZXInIHx8IHR5cGVvZiBjYW1lcmFUYXJnZXQueSAhPT0gJ251bWJlcicpIHtcclxuXHRcdFx0Y29uc29sZS53YXJuKFwiQ291bGRuJ3QgdGFyZ2V0XCIsIGNhbWVyYVRhcmdldCk7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdHRoaXMuY2FtZXJhVGFyZ2V0ID0gY2FtZXJhVGFyZ2V0O1xyXG5cdFx0cmV0dXJuIHRydWU7XHJcblx0fVxyXG5cclxuXHRjbGVhcigpIHtcclxuXHRcdHRoaXMucm90RGlzcGxheS5jbGVhcigpO1xyXG5cdH1cclxuXHJcblx0ZHJhdyh4LCB5LCBjaGFyYWN0ZXIsIGZnQ29sb3IsIGJnQ29sb3IpIHtcclxuXHRcdGlmICh0aGlzLmNhbWVyYVRhcmdldCkge1xyXG5cdFx0XHR4ICs9ICh0aGlzLmNlbnRlci54IC0gdGhpcy5jYW1lcmFUYXJnZXQueCk7XHJcblx0XHRcdHkgKz0gKHRoaXMuY2VudGVyLnkgLSB0aGlzLmNhbWVyYVRhcmdldC55KTtcclxuXHRcdH1cclxuXHRcdHJldHVybiB0aGlzLnJvdERpc3BsYXkuZHJhdyh4LCB5LCBjaGFyYWN0ZXIsIGZnQ29sb3IsIGJnQ29sb3IpO1xyXG5cdH1cclxuXHJcblx0ZHJhd0xldmVsKGdhbWUsIGxldmVsLCBoZXJvKSB7XHJcblx0XHRsZXZlbC5kcmF3KHRoaXMpO1xyXG5cdFx0aWYgKCFoZXJvKSB7IHJldHVybjsgfVxyXG5cdFx0aGVyby5kcmF3KHRoaXMpO1xyXG5cdFx0dGhpcy5kcmF3SW50ZXJmYWNlKGdhbWUsIGhlcm8pO1xyXG5cdH1cclxuXHJcblx0ZHJhd0hlcm8oaGVybykge1xyXG5cdFx0aWYgKCFoZXJvKSB7IHJldHVybjsgfVxyXG5cdFx0aGVyby5kcmF3KHRoaXMpO1xyXG5cdH1cclxuXHJcblx0ZHJhd0RhbWFnZShpc0RhbWFnZWQgPSBmYWxzZSwgb3B0aW9ucyA9IHt9KSB7XHJcblx0XHQvLyBPdmVycmlkZSB0aGlzXHJcblx0fVxyXG5cclxuXHRkcmF3SW50ZXJmYWNlKGdhbWUgPSB7fSwgaGVybyA9IHt9LCBvcHRpb25zID0ge30pIHtcclxuXHRcdC8vIE92ZXJyaWRlIHRoaXNcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBnZXRQb29sU3F1YXJlcyh2YWx1ZSwgbWF4LCB1c2VkKSB7XHJcblx0XHRjb25zdCBtYXhMZWZ0ID0gbWF4IC0gdmFsdWUgLSB1c2VkO1xyXG5cdFx0bGV0IHN0ciA9ICcnO1xyXG5cdFx0bGV0IGk7XHJcblx0XHRmb3IoaSA9IDA7IGkgPCB2YWx1ZTsgaSsrKSB7IHN0ciArPSAn4pagJzsgfVxyXG5cdFx0Zm9yKGkgPSAwOyBpIDwgdXNlZDsgaSsrKSB7IHN0ciArPSAn4pajJzsgfVxyXG5cdFx0Zm9yKGkgPSAwOyBpIDwgbWF4TGVmdDsgaSsrKSB7IHN0ciArPSAn4paiJzsgfVxyXG5cdFx0cmV0dXJuIHN0cjtcclxuXHR9XHJcblxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IERpc3BsYXk7IiwiY29uc3QgTWFwID0gcmVxdWlyZSgnLi9NYXAnKTtcclxuY29uc3QgQWN0b3IgPSByZXF1aXJlKCcuL0FjdG9yJyk7XHJcbmNvbnN0IEl0ZW0gPSByZXF1aXJlKCcuL0l0ZW0nKTtcclxuY29uc3QgUHJvcCA9IHJlcXVpcmUoJy4vUHJvcCcpO1xyXG5jb25zdCBnZW9tZXRlciA9IHJlcXVpcmUoJy4vZ2VvbWV0ZXInKTtcclxuY29uc3QgcmFuZG9tID0gcmVxdWlyZSgnLi9yYW5kb20nKTtcclxuY29uc3QgeyBESVJTXzQsIERJUlNfOF9ESUFHTk9MUyB9ID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcclxuXHJcbmNsYXNzIExldmVsIHtcclxuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30sIHJlZkRhdGEgPSB7fSkge1xyXG5cdFx0dGhpcy5zZWVkID0gb3B0aW9ucy5zZWVkIHx8IDE7XHJcblx0XHR0aGlzLm5hbWUgPSBvcHRpb25zLm5hbWUgfHwgJ1Vua25vd24gbGV2ZWwnO1xyXG5cdFx0dGhpcy5kZXNjcmlwdGlvbiA9IG9wdGlvbnMuZGVzY3JpcHRpb24gfHwgbnVsbDtcclxuXHRcdHRoaXMubGV2ZWxJbmRleCA9IG9wdGlvbnMubGV2ZWxJbmRleCB8fCAwO1xyXG5cdFx0dGhpcy5jb2xvciA9IG9wdGlvbnMuY29sb3IgfHwgJyM3NzcnO1xyXG5cdFx0dGhpcy5iYWNrZ3JvdW5kID0gb3B0aW9ucy5iYWNrZ3JvdW5kIHx8ICcjMjIyJztcclxuXHRcdGNvbnN0IG1hcE9wdGlvbnMgPSB7XHJcblx0XHRcdGNvbG9yOiB0aGlzLmNvbG9yLFxyXG5cdFx0XHRiYWNrZ3JvdW5kOiB0aGlzLmJhY2tncm91bmQsXHJcblx0XHRcdC4uLm9wdGlvbnMubWFwLFxyXG5cdFx0XHRzZWVkOiB0aGlzLnNlZWRcclxuXHRcdH07XHJcblx0XHR0aGlzLm1hcCA9IG5ldyBNYXAobWFwT3B0aW9ucyk7XHJcblx0XHR0aGlzLmFjdG9ycyA9IHRoaXMuZ2VuZXJhdGVBY3RvcnMob3B0aW9ucywgcmVmRGF0YSk7XHJcblx0XHR0aGlzLml0ZW1zID0gdGhpcy5nZW5lcmF0ZUl0ZW1zKG9wdGlvbnMsIHJlZkRhdGEuaXRlbXMpO1xyXG5cdFx0dGhpcy5wcm9wcyA9IHRoaXMuZ2VuZXJhdGVQcm9wcyhvcHRpb25zLCByZWZEYXRhLnByb3BzKTtcclxuXHRcdHRoaXMuZXllID0geyB4OiAwLCB5OiAwLCBzaWdodFJhbmdlOiA3IH07XHJcblx0XHR0aGlzLmN1c3RvbUVmZmVjdHMgPSB7IC4uLm9wdGlvbnMuY3VzdG9tRWZmZWN0cyB9O1xyXG5cdH1cclxuXHJcblx0ZHJhdyhkaXNwbGF5KSB7XHJcblx0XHRkaXNwbGF5LmNsZWFyKCk7XHJcblx0XHR0aGlzLmRyYXdNYXAoZGlzcGxheSk7XHJcblx0XHR0aGlzLmRyYXdQcm9wcyhkaXNwbGF5KTtcclxuXHRcdHRoaXMuZHJhd0l0ZW1zKGRpc3BsYXkpO1xyXG5cdFx0dGhpcy5kcmF3QWN0b3JzKGRpc3BsYXkpO1xyXG5cdH1cclxuXHJcblx0ZHJhd01hcChkaXNwbGF5KSB7XHJcblx0XHR0aGlzLm1hcC5mb3JFYWNoQ2VsbCgoY2VsbCwgeCwgeSkgPT4ge1xyXG5cdFx0XHRjb25zdCBpblZpZXcgPSB0aGlzLmlzSW5WaWV3KHgsIHkpO1xyXG5cdFx0XHQvLyBUT0RPOiBpbXByb3ZlIHRoaXNcclxuXHRcdFx0Y29uc3QgZmcgPSBjZWxsLmdldEZvcmVncm91bmRDb2xvcihpblZpZXcpO1xyXG5cdFx0XHRjb25zdCBiZyA9IGNlbGwuZ2V0QmFja2dyb3VuZENvbG9yKGluVmlldyk7XHJcblx0XHRcdGRpc3BsYXkuZHJhdyh4LCB5LCBjZWxsLmNoYXJhY3RlciwgZmcsIGJnKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZHJhd1Byb3BzKGRpc3BsYXkpIHtcclxuXHRcdHRoaXMucHJvcHMuZm9yRWFjaCgocHJvcCkgPT4ge1xyXG5cdFx0XHRjb25zdCBsaWdodGluZyA9IHRoaXMubWFwLmdldExpZ2h0aW5nQXQodGhpcy5leWUueCwgdGhpcy5leWUueSk7XHJcblx0XHRcdGNvbnN0IGluVmlldyA9IHRoaXMuaXNJblZpZXcocHJvcC54LCBwcm9wLnkpO1xyXG5cdFx0XHRwcm9wLmRyYXcoZGlzcGxheSwgbGlnaHRpbmcsIGluVmlldyk7XHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdGRyYXdJdGVtcyhkaXNwbGF5KSB7XHJcblx0XHR0aGlzLml0ZW1zLmZvckVhY2goKGl0ZW0pID0+IHtcclxuXHRcdFx0Y29uc3QgbGlnaHRpbmcgPSB0aGlzLm1hcC5nZXRMaWdodGluZ0F0KHRoaXMuZXllLngsIHRoaXMuZXllLnkpO1xyXG5cdFx0XHRjb25zdCBpblZpZXcgPSB0aGlzLmlzSW5WaWV3KGl0ZW0ueCwgaXRlbS55KTtcclxuXHRcdFx0aXRlbS5kcmF3KGRpc3BsYXksIGxpZ2h0aW5nLCBpblZpZXcpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRkcmF3QWN0b3JzKGRpc3BsYXkpIHtcclxuXHRcdC8vIERyYXcgZGVhZCBmaXJzdCwgdGhlbiBub24tZGVhZFxyXG5cdFx0dGhpcy5hY3RvcnMuZm9yRWFjaCgoYWN0b3IpID0+IHtcclxuXHRcdFx0aWYgKGFjdG9yLmRlYWQoKSkge1xyXG5cdFx0XHRcdHRoaXMuZHJhd0FjdG9yKGRpc3BsYXksIGFjdG9yKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmFjdG9ycy5mb3JFYWNoKChhY3RvcikgPT4ge1xyXG5cdFx0XHRpZiAoIWFjdG9yLmRlYWQoKSkge1xyXG5cdFx0XHRcdHRoaXMuZHJhd0FjdG9yKGRpc3BsYXksIGFjdG9yKTtcclxuXHRcdFx0fVxyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRkcmF3QWN0b3IoZGlzcGxheSwgYWN0b3IpIHtcclxuXHRcdGNvbnN0IGxpZ2h0aW5nID0gdGhpcy5tYXAuZ2V0TGlnaHRpbmdBdCh0aGlzLmV5ZS54LCB0aGlzLmV5ZS55KTtcclxuXHRcdGNvbnN0IGluVmlldyA9IHRoaXMuaXNJblZpZXcoYWN0b3IueCwgYWN0b3IueSk7XHJcblx0XHRhY3Rvci5kcmF3KGRpc3BsYXksIGxpZ2h0aW5nLCBpblZpZXcpO1xyXG5cdH1cclxuXHJcblx0aXNJblZpZXcoeCwgeSkgeyAvLyBUT0RPOiBvcHRpbWl6ZVxyXG5cdFx0Y29uc3QgciA9IGdlb21ldGVyLmdldERpc3RhbmNlKHRoaXMuZXllLngsIHRoaXMuZXllLnksIHgsIHkpOyAvLyBUT0RPOiBhbGxvdyBtb3JlIGNvbXBsaWNhdGVkIFBPVlxyXG5cdFx0cmV0dXJuIChyIDw9IHRoaXMuZXllLnNpZ2h0UmFuZ2UpO1x0XHRcclxuXHR9XHJcblxyXG5cdGFkZEl0ZW0oaXRlbSkge1xyXG5cdFx0dGhpcy5pdGVtcy5wdXNoKGl0ZW0pO1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlSXRlbShpdGVtKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5yZW1vdmVUaGluZygnaXRlbXMnLCBpdGVtKTtcclxuXHR9XHJcblxyXG5cdGFkZEFjdG9yKGFjdG9yKSB7XHJcblx0XHR0aGlzLmFjdG9ycy5wdXNoKGFjdG9yKTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZUFjdG9yKGFjdG9yKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5yZW1vdmVUaGluZygnYWN0b3JzJywgYWN0b3IpO1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlVGhpbmcocHJvcGVydHksIHRoaW5nKSB7XHJcblx0XHRjb25zdCBpID0gdGhpc1twcm9wZXJ0eV0uZmluZEluZGV4KChhKSA9PiB7IHJldHVybiBhID09PSB0aGluZzsgfSk7XHJcblx0XHRpZiAoaSA8PSAtMSkge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oJ25vdGhpbmcgZm91bmQgaW4nLCBwcm9wZXJ0eSk7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdGNvbnN0IGFyciA9IHRoaXNbcHJvcGVydHldLnNwbGljZShpLCAxKTtcclxuXHRcdHJldHVybiBhcnJbMF07XHRcdFxyXG5cdH1cclxuXHJcblx0ZmluZEl0ZW0oeCwgeSkge1xyXG5cdFx0Y29uc3QgZm91bmRUaGluZ3MgPSB0aGlzLmZpbmRJdGVtcyh4LCB5KTtcclxuXHRcdHJldHVybiAoZm91bmRUaGluZ3MubGVuZ3RoKSA/IGZvdW5kVGhpbmdzWzBdIDogbnVsbDtcclxuXHR9XHJcblx0ZmluZEl0ZW1zKHgsIHkpIHtcclxuXHRcdHJldHVybiB0aGlzLml0ZW1zLmZpbHRlcigoaXRlbSkgPT4ge1xyXG5cdFx0XHRyZXR1cm4gaXRlbS54ID09PSB4ICYmIGl0ZW0ueSA9PT0geSAmJiAhaXRlbS5jb250YWluZWRJbjtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0ZmluZFByb3AoeCwgeSkge1xyXG5cdFx0Y29uc3QgZm91bmRUaGluZ3MgPSB0aGlzLmZpbmRQcm9wcyh4LCB5KTtcclxuXHRcdHJldHVybiAoZm91bmRUaGluZ3MubGVuZ3RoKSA/IGZvdW5kVGhpbmdzWzBdIDogbnVsbDtcclxuXHR9XHJcblx0ZmluZFByb3BzKHgsIHkpIHtcclxuXHRcdHJldHVybiB0aGlzLnByb3BzLmZpbHRlcigocHJvcCkgPT4geyByZXR1cm4gcHJvcC54ID09PSB4ICYmIHByb3AueSA9PT0geTsgfSk7XHJcblx0fVxyXG5cdGZpbmRQcm9wc0J5VHlwZSh0eXBlKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5wcm9wcy5maWx0ZXIoKHByb3ApID0+IHsgcmV0dXJuIHByb3AudHlwZSA9PT0gdHlwZTsgfSk7XHJcblx0fVxyXG5cclxuXHRmaW5kQWN0b3IoeCwgeSkge1xyXG5cdFx0Y29uc3QgZm91bmRUaGluZ3MgPSB0aGlzLmZpbmRBY3RvcnMoeCwgeSk7XHJcblx0XHRyZXR1cm4gKGZvdW5kVGhpbmdzLmxlbmd0aCkgPyBmb3VuZFRoaW5nc1swXSA6IG51bGw7XHJcblx0fVxyXG5cdGZpbmRBY3RvcnMoeCwgeSkge1xyXG5cdFx0cmV0dXJuIHRoaXMuYWN0b3JzLmZpbHRlcigoYWN0b3IpID0+IHtcclxuXHRcdFx0cmV0dXJuIGFjdG9yLnggPT09IHggJiYgYWN0b3IueSA9PT0geSAmJiAhYWN0b3IuZGVhZCgpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRmaW5kVGhpbmdzKHgsIHkpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5maW5kUHJvcHMoeCwgeSk7XHJcblx0XHRjb25zdCBpdGVtcyA9IHRoaXMuZmluZEl0ZW1zKHgsIHkpO1xyXG5cdFx0Y29uc3QgYWxsVGhpbmdzID0gcHJvcHMuY29uY2F0KGl0ZW1zKTtcclxuXHRcdHJldHVybiBhbGxUaGluZ3M7XHJcblx0fVxyXG5cclxuXHRmaW5kVGhpbmdzQ2FyZGluYWwoeCwgeSkge1xyXG5cdFx0Y29uc3QgcHJvcHMgPSB0aGlzLmZpbmRUaGluZ3NCeURpcmVjdGlvbnMoJ3Byb3BzJywgRElSU180LCB4LCB5KTtcclxuXHRcdGNvbnN0IGl0ZW1zID0gdGhpcy5maW5kVGhpbmdzQnlEaXJlY3Rpb25zKCdpdGVtcycsIERJUlNfNCwgeCwgeSk7XHJcblx0XHRjb25zdCBhbGxUaGluZ3MgPSBwcm9wcy5jb25jYXQoaXRlbXMpO1xyXG5cdFx0cmV0dXJuIGFsbFRoaW5ncztcclxuXHR9XHJcblxyXG5cdGZpbmRUaGluZ3NEaWFnbm9sKHgsIHkpIHtcclxuXHRcdGNvbnN0IHByb3BzID0gdGhpcy5maW5kVGhpbmdzQnlEaXJlY3Rpb25zKCdwcm9wcycsIERJUlNfOF9ESUFHTk9MUywgeCwgeSk7XHJcblx0XHRjb25zdCBpdGVtcyA9IHRoaXMuZmluZFRoaW5nc0J5RGlyZWN0aW9ucygnaXRlbXMnLCBESVJTXzhfRElBR05PTFMsIHgsIHkpO1xyXG5cdFx0Y29uc3QgYWxsVGhpbmdzID0gcHJvcHMuY29uY2F0KGl0ZW1zKTtcclxuXHRcdHJldHVybiBhbGxUaGluZ3M7XHJcblx0fVxyXG5cclxuXHRmaW5kVGhpbmdzQnlEaXJlY3Rpb25zKHRoaW5nTmFtZSwgZGlycywgeCwgeSkge1xyXG5cdFx0Y29uc3QgY29vcmRzID0gW107XHJcblx0XHRkaXJzLmZvckVhY2goKGRpcikgPT4geyBjb29yZHMucHVzaCh7IHg6IHggKyBkaXIueCwgeTogeSArIGRpci55IH0pOyB9KTtcclxuXHRcdHJldHVybiB0aGlzW3RoaW5nTmFtZV0uZmlsdGVyKCh0aGluZykgPT4ge1xyXG5cdFx0XHRjb25zdCBtYXRjaGVzID0gY29vcmRzLmZpbHRlcigoeHkpID0+IHtcclxuXHRcdFx0XHRyZXR1cm4geHkueCA9PT0gdGhpbmcueCAmJiB4eS55ID09PSB0aGluZy55ICYmICF0aGluZy5jb250YWluZWRJblxyXG5cdFx0XHR9KTtcclxuXHRcdFx0cmV0dXJuIG1hdGNoZXMubGVuZ3RoID4gMDtcclxuXHRcdH0pO1x0XHRcclxuXHR9XHJcblxyXG5cdGZpbmRUaGluZ1NtYXJ0KHgsIHksIHBlcmZlcnJlZFByb3BlcnR5KSB7XHJcblx0XHRsZXQgdGhpbmdzID0gdGhpcy5maW5kVGhpbmdzKHgsIHkpO1xyXG5cdFx0Ly8gY29uc29sZS5sb2coJ2ZpbmQgc21hcnQgLSBvbiBzcG90JywgdGhpbmdzKTtcclxuXHRcdGlmICghdGhpbmdzLmxlbmd0aCkge1xyXG5cdFx0XHR0aGluZ3MgPSB0aGlzLmZpbmRUaGluZ3NDYXJkaW5hbCh4LCB5KTtcclxuXHRcdFx0Ly8gY29uc29sZS5sb2coJ2ZpbmQgc21hcnQgLSBjYXJkaW5hbCcsIHRoaW5ncyk7XHJcblx0XHRcdGlmICghdGhpbmdzLmxlbmd0aCkge1xyXG5cdFx0XHRcdHRoaW5ncyA9IHRoaXMuZmluZFRoaW5nc0RpYWdub2woeCwgeSk7XHJcblx0XHRcdFx0Ly8gY29uc29sZS5sb2coJ2ZpbmQgc21hcnQgLSBkaWFnbm9scycsIHRoaW5ncyk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdGlmIChwZXJmZXJyZWRQcm9wZXJ0eSkge1xyXG5cdFx0XHR0aGluZ3Muc29ydCgoYSwgYikgPT4ge1xyXG5cdFx0XHRcdC8vIGNvbnNvbGUubG9nKGEsIGIsIGFbcGVyZmVycmVkUHJvcGVydHldKTtcclxuXHRcdFx0XHRyZXR1cm4gYltwZXJmZXJyZWRQcm9wZXJ0eV07XHJcblx0XHRcdH0pO1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhcInNvcnRlZFwiLCB0aGluZ3MpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaW5nc1swXTtcclxuXHR9XHJcblxyXG5cdGZpbmRSYW5kb21GcmVlQ2VsbChzZWVkLCBjbGVhcmluZywgcmV0cmllcyA9IDEwKSB7XHJcblx0XHRsZXQgY2VsbCA9IHRoaXMubWFwLmdldFJhbmRvbUZyZWVDZWxsKCk7XHJcblx0XHRpZiAoIXJldHJpZXMpIHtcclxuXHRcdFx0cmV0dXJuIGNlbGw7XHJcblx0XHR9XHJcblx0XHQvLyBUT0RPOiB0YWtlIGludG8gYWNjb3VudCBwcm9wcywgYWN0b3JzIC4uLj9cclxuXHRcdGlmICh0aGlzLmZpbmRNYXBDbGVhcmluZyhjZWxsLngsIGNlbGwueSkgPj0gY2xlYXJpbmcpIHtcclxuXHRcdFx0Y2VsbCA9IHRoaXMuZmluZFJhbmRvbUZyZWVDZWxsKHNlZSwgY2xlYXJpbmcsIChyZXRyaWVzIC0gMSkpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGNlbGw7XHJcblx0fVxyXG5cclxuXHRmaW5kTWFwQ2xlYXJpbmcoeCwgeSkge1xyXG5cdFx0Ly8gVE9ETzogbG9vcFxyXG5cdFx0cmV0dXJuIDA7XHJcblx0fVxyXG5cclxuXHRkaXNjb3ZlckNpcmNsZSh4LCB5LCByYWRpdXMpIHtcclxuXHRcdHJldHVybiB0aGlzLm1hcC5kaXNjb3ZlckNpcmNsZSh4LCB5LCByYWRpdXMpO1xyXG5cdH1cclxuXHJcblx0Ly8gQWN0aW9uc1xyXG5cclxuXHR1c2VUaGluZyhhY3RvciwgYWN0aW9uTmFtZSwgdGhpbmcpIHtcclxuXHRcdGNvbnN0IG91dGNvbWUgPSB0aGluZy5hY3Rpb24oYWN0aW9uTmFtZSwgYWN0b3IpO1xyXG5cdFx0dGhpcy5kb0VmZmVjdHMob3V0Y29tZS5lZmZlY3RzLCBhY3RvciwgYWN0b3IpO1xyXG5cdFx0cmV0dXJuIG91dGNvbWU7XHJcblx0fVxyXG5cclxuXHR0aHJvdyhhY3Rvciwgd2hhdCwgeCwgeSkge1xyXG5cdFx0Y29uc3QgaXRlbSA9IGFjdG9yLmludmVudG9yeS5yZW1vdmUod2hhdCk7XHJcblx0XHRpZiAoIWl0ZW0pIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRpdGVtLnggPSAodHlwZW9mIHggPT09ICdudW1iZXInKSA/IHggOiBhY3Rvci54O1xyXG5cdFx0aXRlbS55ID0gKHR5cGVvZiB5ID09PSAnbnVtYmVyJykgPyB5IDogYWN0b3IueTtcclxuXHRcdGNvbnN0IGNvbnRhaW5lcnMgPSB0aGlzLmZpbmRUaGluZ3MoeCwgeSkuZmlsdGVyKCh0aGluZykgPT4ge1xyXG5cdFx0XHRjb25zb2xlLmxvZyh0aGluZyk7XHJcblx0XHRcdHJldHVybiB0aGluZy5oYXNTcGFjZSgpO1xyXG5cdFx0fSk7XHJcblx0XHRpZiAoY29udGFpbmVycy5sZW5ndGgpIHtcclxuXHRcdFx0Y29uc3QgY29udGFpbmVyID0gY29udGFpbmVyc1swXTtcclxuXHRcdFx0Y29udGFpbmVyLmFkZFRvSW52ZW50b3J5KGl0ZW0pO1xyXG5cdFx0XHRyZXR1cm4gYCR7YWN0b3IubmFtZX0gcHV0cyAke3doYXQubmFtZX0gaW50byB0aGUgJHtjb250YWluZXIubmFtZX0uYDtcclxuXHRcdH1cclxuXHRcdHRoaXMuYWRkSXRlbShpdGVtKTtcclxuXHRcdHJldHVybiBgJHthY3Rvci5uYW1lfSB0aHJvd3MgZG93biBhICR7d2hhdC5uYW1lfS5gO1xyXG5cdH1cclxuXHJcblx0ZG9Jbml0aWF0aXZlKCkge1xyXG5cdFx0Y29uc3QgbGl2aW5nQWN0b3JzID0gdGhpcy5hY3RvcnMuZmlsdGVyKChhY3RvcikgPT4gIWFjdG9yLmRlYWQoKSk7XHJcblx0XHRsZXQgb3JkZXJlZEFjdG9ycyA9IHJhbmRvbS5zaHVmZmxlKGxpdmluZ0FjdG9ycyk7XHJcblx0XHQvLyBUT0RPOiBMb29rIGZvciBpbml0aWF0aXZlIGJvb3N0LCBwdXQgYXQgdG9wIG9mIGxpc3RcclxuXHR9XHJcblxyXG5cdHN0YXRpYyByZW1vdmVFZmZlY3RzKGVmZmVjdHMsIGtleSkge1xyXG5cdFx0bGV0IGkgPSBlZmZlY3RzLmluZGV4T2Yoa2V5KTtcclxuXHRcdHdoaWxlIChpID4gLTEpIHtcclxuXHRcdFx0ZWZmZWN0cy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdGkgPSBlZmZlY3RzLmluZGV4T2Yoa2V5KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHJlc29sdmVSb3VuZEVmZmVjdHMoKSB7XHJcblx0XHR0aGlzLmFjdG9ycy5mb3JFYWNoKChhY3RvcikgPT4ge1xyXG5cdFx0XHRjb25zdCByb3VuZEVmZmVjdHMgPSBhY3Rvci5hY3RpdmF0ZUFiaWxpdGllcygncm91bmQnKTtcclxuXHRcdFx0dGhpcy5kb0VmZmVjdHMocm91bmRFZmZlY3RzLCBhY3RvciwgYWN0b3IpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRyZXNvbHZlQ29tYmF0RWZmZWN0cyhhdHRhY2tlciwgZGVmZW5kZXIpIHtcclxuXHRcdGxldCBhdHRhY2tFZmZlY3RzID0gYXR0YWNrZXIuYWN0aXZhdGVBYmlsaXRpZXMoJ2F0dGFjaycpO1xyXG5cdFx0bGV0IGRlZmVuZEVmZmVjdHMgPSBkZWZlbmRlci5hY3RpdmF0ZUFiaWxpdGllcygnYXR0YWNrZWQnKTtcclxuXHRcdGxldCBkYW1hZ2VFZmZlY3RzO1xyXG5cdFx0bGV0IGRhbWFnZWRFZmZlY3RzO1xyXG5cclxuXHRcdGF0dGFja0VmZmVjdHMucHVzaCgnYXR0YWNrJyk7XHJcblxyXG5cdFx0Y29uc29sZS5sb2coYXR0YWNrZXIubmFtZSwgSlNPTi5zdHJpbmdpZnkoYXR0YWNrRWZmZWN0cyksICd2cycsIGRlZmVuZGVyLm5hbWUsIEpTT04uc3RyaW5naWZ5KGRlZmVuZEVmZmVjdHMpLCBkZWZlbmRlcik7XHJcblxyXG5cdFx0aWYgKGRlZmVuZEVmZmVjdHMuaW5jbHVkZXMoJ2NhbmNlbEF0dGFjaycpKSB7XHJcblx0XHRcdExldmVsLnJlbW92ZUVmZmVjdHMoYXR0YWNrRWZmZWN0cywgJ2F0dGFjaycpO1xyXG5cdFx0fVxyXG5cclxuXHRcdGlmIChhdHRhY2tFZmZlY3RzLmluY2x1ZGVzKCdhdHRhY2snKSkge1xyXG5cdFx0XHRhdHRhY2tFZmZlY3RzLnB1c2goJ3dlYXBvbkRhbWFnZScpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGF0dGFja0VmZmVjdHMuaW5jbHVkZXMoJ2RhbWFnZScpIHx8IGF0dGFja0VmZmVjdHMuaW5jbHVkZXMoJ3dlYXBvbkRhbWFnZScpKSB7XHJcblx0XHRcdGRhbWFnZUVmZmVjdHMgPSBkZWZlbmRlci5hY3RpdmF0ZUFiaWxpdGllcygnZGFtYWdlJyk7XHJcblx0XHRcdGF0dGFja0VmZmVjdHMgPSBhdHRhY2tFZmZlY3RzLmNvbmNhdChkYW1hZ2VFZmZlY3RzKTtcclxuXHRcdFx0ZGFtYWdlZEVmZmVjdHMgPSBkZWZlbmRlci5hY3RpdmF0ZUFiaWxpdGllcygnZGFtYWdlZCcpO1xyXG5cdFx0XHRkZWZlbmRFZmZlY3RzID0gZGVmZW5kRWZmZWN0cy5jb25jYXQoZGFtYWdlZEVmZmVjdHMpO1xyXG5cdFx0fVxyXG5cdFx0aWYgKGRlZmVuZEVmZmVjdHMuaW5jbHVkZXMoJ2NhbmNlbERhbWFnZScpIHx8IGF0dGFja0VmZmVjdHMuaW5jbHVkZXMoJ2NhbmNlbERhbWFnZScpKSB7XHJcblx0XHRcdExldmVsLnJlbW92ZUVmZmVjdHMoYXR0YWNrRWZmZWN0cywgJ2RhbWFnZScpO1xyXG5cdFx0XHRMZXZlbC5yZW1vdmVFZmZlY3RzKGF0dGFja0VmZmVjdHMsICd3ZWFwb25EYW1hZ2UnKTtcclxuXHRcdH1cclxuXHJcblx0XHRjb25zb2xlLmxvZyhhdHRhY2tlci5uYW1lLCBKU09OLnN0cmluZ2lmeShhdHRhY2tFZmZlY3RzKSwgJ3ZzJywgSlNPTi5zdHJpbmdpZnkoZGVmZW5kRWZmZWN0cykpO1xyXG5cclxuXHRcdGNvbnN0IG91dGNvbWVBdHRhY2sgPSB0aGlzLmRvRWZmZWN0cyhhdHRhY2tFZmZlY3RzLCBhdHRhY2tlciwgZGVmZW5kZXIpO1xyXG5cdFx0Y29uc3Qgb3V0Y29tZURlZmVuZCA9IHRoaXMuZG9FZmZlY3RzKGRlZmVuZEVmZmVjdHMsIGRlZmVuZGVyLCBhdHRhY2tlcik7XHJcblxyXG5cdFx0Ly8gVE9ETzogZ2VuZXJhdGUgbWVzc2FnZXNcclxuXHJcblx0XHRyZXR1cm4geyBvdXRjb21lQXR0YWNrLCBvdXRjb21lRGVmZW5kLCBhdHRhY2tFZmZlY3RzLCBkZWZlbmRFZmZlY3RzIH07XHJcblx0fVxyXG5cclxuXHRkb0VmZmVjdHMoZWZmZWN0cywgYWN0b3IsIG9wcG9uZW50KSB7XHJcblx0XHRsZXQgZGFtYWdlID0gMDtcclxuXHRcdGlmICghZWZmZWN0cykgeyByZXR1cm4geyBkYW1hZ2UgfTsgfVxyXG5cdFx0ZWZmZWN0cy5mb3JFYWNoKChlZmZlY3QpID0+IHtcclxuXHRcdFx0ZGFtYWdlICs9IHRoaXMuZG9FZmZlY3QoZWZmZWN0LCBhY3Rvciwgb3Bwb25lbnQpO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4geyBkYW1hZ2UgfTtcclxuXHR9XHJcblxyXG5cdGRvRWZmZWN0KGVmZmVjdCwgYWN0b3IsIG9wcG9uZW50KSB7XHJcblx0XHRjb25zb2xlLmxvZygnZG9FZmZlY3QnLCBlZmZlY3QpO1xyXG5cdFx0bGV0IGRhbWFnZSA9IDA7XHJcblx0XHRzd2l0Y2goZWZmZWN0KSB7XHJcblx0XHRcdGNhc2UgJ2RhbWFnZSc6XHJcblx0XHRcdFx0ZGFtYWdlICs9IDE7XHJcblx0XHRcdFx0b3Bwb25lbnQud291bmQoMSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICd3ZWFwb25EYW1hZ2UnOlxyXG5cdFx0XHRcdGRhbWFnZSArPSBhY3Rvci5nZXRXZWFwb25EYW1hZ2UoKTtcclxuXHRcdFx0XHRvcHBvbmVudC53b3VuZChkYW1hZ2UpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnaGVhbCc6XHJcblx0XHRcdGNhc2UgJ2hwJzpcclxuXHRcdFx0XHRhY3Rvci5oZWFsKDEpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYXAnOlxyXG5cdFx0XHRcdGFjdG9yLmhlYWxQb29sKCdhcCcsIDEpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnYnAnOlxyXG5cdFx0XHRcdGFjdG9yLmhlYWxQb29sKCdicCcsIDEpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZXAnOlxyXG5cdFx0XHRcdGFjdG9yLmhlYWxQb29sKCdlcCcsIDEpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnbW92ZVN3aXRjaCc6IHtcclxuXHRcdFx0XHRjb25zdCB7IHgsIHkgfSA9IGFjdG9yO1xyXG5cdFx0XHRcdGFjdG9yLnNldENvb3JkaW5hdGVzKG9wcG9uZW50LngsIG9wcG9uZW50LnkpO1xyXG5cdFx0XHRcdG9wcG9uZW50LnNldENvb3JkaW5hdGVzKHgsIHkpO1xyXG5cdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdhcERhbWFnZSc6XHJcblx0XHRcdFx0YWN0b3IuZGFtYWdlUG9vbCgnYXAnLCAxKTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ2JwRGFtYWdlJzpcclxuXHRcdFx0XHRhY3Rvci5kYW1hZ2VQb29sKCdicCcsIDEpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnZXBEYW1hZ2UnOlxyXG5cdFx0XHRcdGFjdG9yLmRhbWFnZVBvb2woJ2VwJywgMSk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdwdXNoJzpcclxuXHRcdFx0XHR0aGlzLnB1c2hBY3RvcihhY3Rvciwgb3Bwb25lbnQpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncHVzaEFvZSc6XHJcblx0XHRcdFx0dGhpcy5wdXNoQWN0b3IoYWN0b3IsIG9wcG9uZW50KTtcclxuXHRcdFx0XHQvLyBUT0RPOiBIYW5kbGUgYW9lIC0tPiBldmVyeW9uZSAoYWNjZXB0IG9wcG9uZW50KSBhcm91bmQgaGl0WCwgaGl0WSBnZXRzIGtub2NrZWQgYmFja1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAnbW92ZUJhY2snOlxyXG5cdFx0XHRcdHRoaXMucHVzaEFjdG9yKG9wcG9uZW50LCBhY3Rvcik7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICdpbml0aWF0aXZlJzpcclxuXHRcdFx0XHRhY3Rvci5pbml0aWF0aXZlQm9vc3QgPSAxO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBcImZpcmVcIjpcclxuXHRcdFx0XHQvLyBUT0RPOlxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSBcImVuZEdhbWVcIjpcclxuXHRcdFx0XHQvLyBUT0RPXHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlIFwic2NvcmUxMDAwXCI6XHJcblx0XHRcdFx0YWN0b3Iuc2NvcmUgKz0gMTAwMDtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGRlZmF1bHQ6XHJcblx0XHRcdFx0dGhpcy5kb0N1c3RvbUVmZmVjdChlZmZlY3QsIGFjdG9yLCBvcHBvbmVudCk7XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGRhbWFnZTtcclxuXHR9XHJcblxyXG5cdGRvQ3VzdG9tRWZmZWN0KGVmZmVjdCwgYWN0b3IsIG9wcG9uZW50KSB7XHJcblx0XHRpZiAodHlwZW9mIHRoaXMuY3VzdG9tRWZmZWN0c1tlZmZlY3RdID09PSAnZnVuY3Rpb24nKSB7XHJcblx0XHRcdHRoaXMuY3VzdG9tRWZmZWN0c1tlZmZlY3RdKGVmZmVjdCwgYWN0b3IsIG9wcG9uZW50KTtcclxuXHRcdH1cclxuXHR9XHJcblxyXG5cdHB1c2hBY3RvcihwdXNoZXIsIHB1c2hlZSkge1xyXG5cdFx0Y29uc3QgeyB4LCB5IH0gPSBwdXNoZXI7XHJcblx0XHRsZXQgbW92ZVggPSBwdXNoZWUueCAtIHg7XHJcblx0XHRsZXQgbW92ZVkgPSBwdXNoZWUueSAtIHk7XHJcblx0XHRtb3ZlWCA9IG1vdmVYIC8gKG1vdmVYID09PSAwID8gMSA6IE1hdGguYWJzKG1vdmVYKSk7XHJcblx0XHRtb3ZlWSA9IG1vdmVZIC8gKG1vdmVZID09PSAwID8gMSA6IE1hdGguYWJzKG1vdmVZKSk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygncHVzaGluZycsIHB1c2hlZS5uYW1lLCBtb3ZlWCwgbW92ZVkpO1xyXG5cdFx0cHVzaGVlLm1vdmUobW92ZVgsIG1vdmVZKTtcclxuXHR9XHJcblxyXG5cdGdldEFjdG9yc0luaXRpYXRpdmVPcmRlcmVkKCkge1xyXG5cdFx0Y29uc3QgcmFuZG9tQWN0b3JzID0gcmFuZG9tLnNodWZmbGUodGhpcy5hY3RvcnMpO1xyXG5cdFx0Y29uc3QgZmlyc3RBY3RvcnMgPSBbXTtcclxuXHRcdGxldCBpID0gcmFuZG9tQWN0b3JzLmxlbmd0aCAtIDE7XHJcblx0XHR3aGlsZSAoaS0tKSB7XHJcblx0XHRcdGNvbnN0IGFjdG9yID0gcmFuZG9tQWN0b3JzW2ldO1xyXG5cdFx0XHRpZiAoYWN0b3IuaW5pdGlhdGl2ZUJvb3N0ID4gMCkge1xyXG5cdFx0XHRcdGZpcnN0QWN0b3JzLnB1c2goYWN0b3IpO1xyXG5cdFx0XHRcdHJhbmRvbUFjdG9ycy5zcGxpY2UoaSwgMSk7XHJcblx0XHRcdH1cclxuXHRcdH1cclxuXHRcdHJldHVybiBmaXJzdEFjdG9ycy5jb25jYXQocmFuZG9tQWN0b3JzKTtcclxuXHR9XHJcblxyXG5cdGNvb2xPZmZJbml0aWF0aXZlQm9vc3RzKCkge1xyXG5cdFx0dGhpcy5hY3RvcnMuZm9yRWFjaCgoYWN0b3IpID0+IHtcclxuXHRcdFx0YWN0b3IuaW5pdGlhdGl2ZUJvb3N0ID0gMDtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0Ly8gR2VuZXJhdGlvblxyXG5cclxuXHRnZW5lcmF0ZUl0ZW1zKG9wdGlvbnMgPSB7fSwgaXRlbVR5cGVzID0ge30pIHtcclxuXHRcdGxldCBzZWVkID0gdGhpcy5zZWVkICsgMjAwO1xyXG5cdFx0bGV0IHsgaXRlbXMgPSBbXSB9ID0gb3B0aW9ucztcclxuXHJcblx0XHRjb25zdCBhcnIgPSBbXTtcclxuXHRcdGl0ZW1zLmZvckVhY2goKGxldmVsSXRlbSkgPT4ge1xyXG5cdFx0XHRjb25zdCBxdWFudGl0eSA9IGxldmVsSXRlbS5xdWFudGl0eSB8fCAxO1xyXG5cdFx0XHQvLyBUT0RPOiBoYW5kbGUgd2VpZ2h0LCBldGMuXHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcXVhbnRpdHk7IGkrKykge1xyXG5cdFx0XHRcdGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5maW5kUmFuZG9tRnJlZUNlbGwoKytzZWVkLCBsZXZlbEl0ZW0uY2xlYXJpbmcpO1xyXG5cdFx0XHRcdGNvbnN0IGl0ZW1UeXBlT3B0aW9ucyA9IChsZXZlbEl0ZW0udHlwZSAmJiBpdGVtVHlwZXNbbGV2ZWxJdGVtLnR5cGVdKSA/IGl0ZW1UeXBlc1tsZXZlbEl0ZW0udHlwZV0gOiB7fTtcclxuXHRcdFx0XHRjb25zdCBpdGVtT3B0aW9ucyA9IHtcclxuXHRcdFx0XHRcdHgsIHksXHJcblx0XHRcdFx0XHQuLi5pdGVtVHlwZU9wdGlvbnMsXHJcblx0XHRcdFx0XHQuLi5sZXZlbEl0ZW1cclxuXHRcdFx0XHR9O1xyXG5cdFx0XHRcdGNvbnN0IGl0ZW0gPSBuZXcgSXRlbShpdGVtT3B0aW9ucyk7XHJcblx0XHRcdFx0YXJyLnB1c2goaXRlbSk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGFycjtcclxuXHR9XHJcblxyXG5cdGdlbmVyYXRlUHJvcHMob3B0aW9ucyA9IHt9LCBwcm9wVHlwZXMgPSB7fSkge1xyXG5cdFx0bGV0IHNlZWQgPSB0aGlzLnNlZWQgKyAxMDA7XHJcblx0XHRsZXQgeyBwcm9wcyA9IFtdIH0gPSBvcHRpb25zO1xyXG5cdFx0Y29uc3QgYmFja2dyb3VuZCA9IHRoaXMuYmFja2dyb3VuZDtcclxuXHJcblx0XHRjb25zdCBhcnIgPSBbXTtcclxuXHRcdHByb3BzLmZvckVhY2goKGxldmVsUHJvcCkgPT4ge1xyXG5cdFx0XHRjb25zdCBxdWFudGl0eSA9ICh0eXBlb2YgbGV2ZWxQcm9wLnF1YW50aXR5ID09PSAnbnVtYmVyJykgPyBsZXZlbFByb3AucXVhbnRpdHkgOiAxO1xyXG5cdFx0XHQvLyBjb25zb2xlLmxvZyhsZXZlbFByb3ApO1xyXG5cdFx0XHQvLyBUT0RPOiBoYW5kbGUgd2VpZ2h0LCBldGMuXHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgcXVhbnRpdHk7IGkrKykge1xyXG5cdFx0XHRcdGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5maW5kUmFuZG9tRnJlZUNlbGwoKytzZWVkLCBsZXZlbFByb3AuY2xlYXJpbmcpO1xyXG5cdFx0XHRcdGNvbnN0IHByb3BUeXBlT3B0aW9ucyA9IChsZXZlbFByb3AudHlwZSAmJiBwcm9wVHlwZXNbbGV2ZWxQcm9wLnR5cGVdKSA/IHByb3BUeXBlc1tsZXZlbFByb3AudHlwZV0gOiB7fTtcclxuXHRcdFx0XHRjb25zdCBwcm9wT3B0aW9uc1BhcmFtID0ge1xyXG5cdFx0XHRcdFx0eCwgeSwgYmFja2dyb3VuZCxcclxuXHRcdFx0XHRcdC4uLnByb3BUeXBlT3B0aW9ucyxcclxuXHRcdFx0XHRcdC4uLmxldmVsUHJvcFxyXG5cdFx0XHRcdH07XHJcblx0XHRcdFx0Y29uc3QgcHJvcCA9IG5ldyBQcm9wKHByb3BPcHRpb25zUGFyYW0pO1xyXG5cdFx0XHRcdGFyci5wdXNoKHByb3ApO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdnZW5lcmF0ZVByb3BzJywgYXJyKTtcclxuXHRcdHRoaXMucHJvcHMgPSBhcnI7XHJcblx0XHRyZXR1cm4gdGhpcy5wcm9wcztcclxuXHR9XHJcblxyXG5cdGdlbmVyYXRlQWN0b3JzKG9wdGlvbnMgPSB7fSwgcmVmRGF0YSA9IHt9KSB7XHJcblx0XHRsZXQgc2VlZCA9IHRoaXMuc2VlZCArIDk5OTtcclxuXHRcdGNvbnN0IHsgbW9uc3RlclNwYXduLCBtb25zdGVycyB9ID0gb3B0aW9ucztcclxuXHRcdGNvbnN0IG1vbnN0ZXJUeXBlcyA9IHJlZkRhdGEubW9uc3RlcnM7XHJcblx0XHRjb25zdCBkZXB0aCA9IG9wdGlvbnMubGV2ZWxJbmRleDtcclxuXHRcdGNvbnN0IGF2YWlsYWJsZU1vbnN0ZXJzID0gbW9uc3RlcnMuZmlsdGVyKChsZXZlbE1vbnN0ZXIpID0+IHtcclxuXHRcdFx0cmV0dXJuICghbGV2ZWxNb25zdGVyLm1pbkRlcHRoKSB8fCBsZXZlbE1vbnN0ZXIubWluRGVwdGggPD0gZGVwdGg7XHJcblx0XHR9KTtcclxuXHRcdGNvbnN0IGF2YWlsYWJsZU1vbnN0ZXJXZWlnaHRzID0ge307XHJcblx0XHRhdmFpbGFibGVNb25zdGVycy5mb3JFYWNoKChsZXZlbE1vbnN0ZXIpID0+IHtcclxuXHRcdFx0aWYgKGxldmVsTW9uc3Rlci53ZWlnaHQpIHtcclxuXHRcdFx0XHRhdmFpbGFibGVNb25zdGVyV2VpZ2h0c1tsZXZlbE1vbnN0ZXIudHlwZV0gPSBsZXZlbE1vbnN0ZXIud2VpZ2h0O1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdGNvbnN0IGhhc01vbnN0ZXJzV2l0aFdlaWdodHMgPSBPYmplY3Qua2V5cyhhdmFpbGFibGVNb25zdGVyV2VpZ2h0cykubGVuZ3RoID4gMDtcclxuXHRcdGNvbnN0IHRvdGFsTW9uc3RlclNwYXduUXVhbnRpdHkgPSAxMDsgLy8gVE9ETzogcGFyc2UgbW9uc3RlclNwYXduIGludG8gcmFuZG9tIG51bWJlclxyXG5cdFx0Y29uc3QgYWN0b3JzID0gW107XHJcblx0XHQvLyBDcmVhdGUgbW9uc3RlcnMgd2l0aCBmaXhlZCBxdWFudGl0aWVzXHJcblx0XHQvLyBOb3RlOiB0aGlzIGNvdWxkIGV4Y2VlZCB0aGUgdG90YWwgcXVhbnRpdHlcclxuXHRcdGNvbnN0IGF2YWlsYWJsZU1vbnN0ZXJzRml4ZWRRdWFudGl0aWVzID0gYXZhaWxhYmxlTW9uc3RlcnMuZmlsdGVyKChsZXZlbE1vbnN0ZXIpID0+IHtcclxuXHRcdFx0cmV0dXJuIGxldmVsTW9uc3Rlci5xdWFudGl0eTtcclxuXHRcdH0pO1xyXG5cdFx0YXZhaWxhYmxlTW9uc3RlcnNGaXhlZFF1YW50aXRpZXMuZm9yRWFjaCgobGV2ZWxNb25zdGVyKSA9PiB7XHJcblx0XHRcdGNvbnN0IG1vbnN0ZXJUeXBlS2V5ID0gbGV2ZWxNb25zdGVyLnR5cGU7XHJcblx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgbGV2ZWxNb25zdGVyLnF1YW50aXR5OyBpKyspIHtcclxuXHRcdFx0XHRjb25zdCBtb25zdGVyID0gdGhpcy5jcmVhdGVBY3Rvcihtb25zdGVyVHlwZXMsIG1vbnN0ZXJUeXBlS2V5LCArK3NlZWQpO1xyXG5cdFx0XHRcdGFjdG9ycy5wdXNoKG1vbnN0ZXIpO1xyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdC8vIENyZWF0ZSB3ZWlnaHRlZCBtb25zdGVyc1xyXG5cdFx0aWYgKGhhc01vbnN0ZXJzV2l0aFdlaWdodHMpIHtcclxuXHRcdFx0bGV0IHN0b3BwZXIgPSAwO1xyXG5cdFx0XHR3aGlsZSAoYWN0b3JzLmxlbmd0aCA8IHRvdGFsTW9uc3RlclNwYXduUXVhbnRpdHkgJiYgc3RvcHBlciA8IDkwMDApIHtcclxuXHRcdFx0XHRzdG9wcGVyKys7XHJcblx0XHRcdFx0KCgpID0+IHtcclxuXHRcdFx0XHRcdGNvbnN0IG1vbnN0ZXJUeXBlS2V5ID0gcmFuZG9tLmdldFdlaWdodGVkVmFsdWUoYXZhaWxhYmxlTW9uc3RlcldlaWdodHMpO1xyXG5cdFx0XHRcdFx0aWYgKCFtb25zdGVyVHlwZUtleSkgeyByZXR1cm47IH1cclxuXHRcdFx0XHRcdGNvbnN0IG1vbnN0ZXIgPSB0aGlzLmNyZWF0ZUFjdG9yKG1vbnN0ZXJUeXBlcywgbW9uc3RlclR5cGVLZXksICsrc2VlZCk7XHJcblx0XHRcdFx0XHRhY3RvcnMucHVzaChtb25zdGVyKTtcclxuXHRcdFx0XHR9KSgpO1xyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0XHQvLyBjb25zb2xlLmxvZygnQWN0b3JzIGF0IGRlcHRoJywgZGVwdGgsIGFjdG9ycyk7XHJcblx0XHRyZXR1cm4gYWN0b3JzO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlQWN0b3IobW9uc3RlclR5cGVzLCBtb25zdGVyVHlwZUtleSwgc2VlZCkge1xyXG5cdFx0aWYgKCFtb25zdGVyVHlwZUtleSkgeyByZXR1cm47IH1cclxuXHRcdGNvbnN0IHsgeCwgeSB9ID0gdGhpcy5maW5kUmFuZG9tRnJlZUNlbGwoc2VlZCk7XHJcblx0XHRsZXQgbW9uc3Rlck9wdGlvbnMgPSBtb25zdGVyVHlwZXNbbW9uc3RlclR5cGVLZXldO1xyXG5cdFx0bW9uc3Rlck9wdGlvbnMgPSB7IHR5cGU6IG1vbnN0ZXJUeXBlS2V5LCBhZ2dybzogMTAwLCAuLi5tb25zdGVyT3B0aW9ucywgeCwgeSB9O1xyXG5cdFx0Ly8gY29uc29sZS5sb2cobW9uc3RlclR5cGVzLCBtb25zdGVyVHlwZUtleSwgbW9uc3Rlck9wdGlvbnMpO1xyXG5cdFx0cmV0dXJuIG5ldyBBY3Rvcihtb25zdGVyT3B0aW9ucyk7XHRcdFxyXG5cdH1cclxuXHJcblx0Ly8gR2V0c1xyXG5cclxuXHRnZXRNYXAoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5tYXA7XHJcblx0fVxyXG5cclxuXHRnZXRDZWxsUGFzc2FiaWxpdHkoeCwgeSkge1xyXG5cdFx0Y29uc3QgaXNNYXBQYXNzYWJsZSA9IHRoaXMubWFwLmdldENlbGxQYXNzYWJpbGl0eSh4LCB5KTtcclxuXHRcdGlmICghaXNNYXBQYXNzYWJsZSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdGNvbnN0IGFjdG9yc0hlcmUgPSB0aGlzLmFjdG9ycy5maWx0ZXIoKGFjdG9yKSA9PiB7XHJcblx0XHRcdHJldHVybiBhY3Rvci54ID09PSB4ICYmIGFjdG9yLnkgPT09IHkgJiYgIWFjdG9yLnBhc3NhYmxlO1xyXG5cdFx0fSk7XHJcblx0XHRyZXR1cm4gKGFjdG9yc0hlcmUubGVuZ3RoID09PSAwKTtcclxuXHR9XHJcblxyXG5cdC8vIFNldHNcclxuXHJcblx0c2V0RXllKGFjdG9yVGhpbmcpIHtcclxuXHRcdHRoaXMuZXllLnggPSBhY3RvclRoaW5nLng7XHJcblx0XHR0aGlzLmV5ZS55ID0gYWN0b3JUaGluZy55O1xyXG5cdFx0dGhpcy5leWUuc2lnaHRSYW5nZSA9IGFjdG9yVGhpbmcuc2lnaHRSYW5nZTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTGV2ZWw7XHJcbiIsImNvbnN0IFJPVCA9IHJlcXVpcmUoJ3JvdC1qcycpO1xyXG5jb25zdCBDZWxsID0gcmVxdWlyZSgnLi9DZWxsJyk7XHJcbmNvbnN0IGdlb21ldGVyID0gcmVxdWlyZSgnLi9nZW9tZXRlcicpO1xyXG5jb25zdCByYW5kb20gPSByZXF1aXJlKCcuL3JhbmRvbScpO1xyXG5cclxuY2xhc3MgTWFwIHtcclxuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuXHRcdHRoaXMuYmFzZVNlZWQgPSBvcHRpb25zLnNlZWQgfHwgMTtcclxuXHRcdHRoaXMuc2VlZCA9IHRoaXMuYmFzZVNlZWQ7XHJcblx0XHR0aGlzLmNvbG9yID0gb3B0aW9ucy5jb2xvciB8fCAnIzc3Nyc7XHJcblx0XHR0aGlzLmJhY2tncm91bmQgPSBvcHRpb25zLmJhY2tncm91bmQgfHwgJyMyMjInO1xyXG5cdFx0dGhpcy50eXBlID0gb3B0aW9ucy50eXBlIHx8ICdkaWdnZXInO1xyXG5cdFx0dGhpcy5yb3RNYXAgPSBvcHRpb25zLnJvdE1hcDtcclxuXHRcdHRoaXMuY2VsbHMgPSB7fTtcclxuXHRcdHRoaXMuZnJlZUNlbGxzID0gW107XHJcblx0XHR0aGlzLndhbGxzID0gb3B0aW9ucy53YWxscyB8fCB0cnVlO1xyXG5cdFx0dGhpcy53YWxsc0NoYXJhY3RlciA9IG9wdGlvbnMud2FsbHNDaGFyYWN0ZXIgfHwgJyMnOyAvLyDilqdcclxuXHRcdHRoaXMuZ2VuZXJhdGUob3B0aW9ucyk7XHJcblx0fVxyXG5cclxuXHRnZW5lcmF0ZSgpIHtcclxuXHRcdHRoaXMuY2VsbHMgPSB7fTtcclxuXHRcdC8vIFRPRE86IGFsbG93IGRpZmZlcmVudCB0eXBlc1xyXG5cdFx0Uk9ULlJORy5zZXRTZWVkKHRoaXMuc2VlZCk7XHJcblx0XHR0aGlzLnJvdE1hcCA9IG5ldyBST1QuTWFwLkRpZ2dlcigpO1xyXG5cdFx0dGhpcy5mcmVlQ2VsbHMubGVuZ3RoID0gMDtcclxuXHRcdFxyXG5cdFx0dGhpcy5yb3RNYXAuY3JlYXRlKCh4LCB5LCB2YWx1ZSkgPT4ge1xyXG5cdFx0XHRpZiAodmFsdWUpIHtcclxuXHRcdFx0XHRyZXR1cm47XHJcblx0XHRcdH1cclxuXHRcdFx0Y29uc3Qga2V5ID0gdGhpcy5zZXRDaGFyYWN0ZXJBdCgnLicsIHgsIHkpO1xyXG5cdFx0XHR0aGlzLmZyZWVDZWxscy5wdXNoKGtleSk7XHJcblx0XHR9KTtcclxuXHJcblx0XHRpZiAodGhpcy53YWxscykge1xyXG5cdFx0XHR0aGlzLmFkZFdhbGxzKCk7XHJcblx0XHR9XHJcblx0XHRcclxuXHRcdC8vIGNvbnNvbGUubG9nKHRoaXMpO1xyXG5cdH1cclxuXHJcblx0YWRkV2FsbHMoKSB7XHJcblx0XHR0aGlzLmZvckVhY2hDZWxsKChjZWxsLCB4LCB5KSA9PiB7XHJcblx0XHRcdE1hcC5mb3JFYWNoRGlyZWN0aW9uKChkaXIsIGRpclgsIGRpclkpID0+IHtcclxuXHRcdFx0XHRjb25zdCBuZXdYID0geCArIGRpclg7XHJcblx0XHRcdFx0Y29uc3QgbmV3WSA9IHkgKyBkaXJZO1xyXG5cdFx0XHRcdGNvbnN0IHdhbGxDZWxsID0gdGhpcy5nZXRDZWxsQXQobmV3WCwgbmV3WSk7XHJcblx0XHRcdFx0aWYgKCF3YWxsQ2VsbCkge1xyXG5cdFx0XHRcdFx0dGhpcy5zZXRDaGFyYWN0ZXJBdCh0aGlzLndhbGxzQ2hhcmFjdGVyLCBuZXdYLCBuZXdZKTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRkaXNjb3ZlckNpcmNsZSh4LCB5LCByYWRpdXMpIHtcclxuXHRcdHRoaXMuZm9yRWFjaENlbGxJbkNpcmNsZSh4LCB5LCByYWRpdXMsIChjZWxsKSA9PiB7XHJcblx0XHRcdGNlbGwuZGlzY292ZXIoKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0c3RhdGljIHBhcnNlS2V5Q29vcmRpbmF0ZXMoa2V5KSB7XHJcblx0XHRjb25zdCBwYXJ0cyA9IGtleS5zcGxpdChcIixcIik7XHJcblx0XHRjb25zdCB4ID0gcGFyc2VJbnQocGFydHNbMF0pO1xyXG5cdFx0Y29uc3QgeSA9IHBhcnNlSW50KHBhcnRzWzFdKTtcclxuXHRcdHJldHVybiB7IHgsIHkgfTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBtYWtlS2V5KHgsIHkpIHtcclxuXHRcdHJldHVybiB4ICsgJywnICsgeTtcclxuXHR9XHJcblxyXG5cdHN0YXRpYyBmb3JFYWNoRGlyZWN0aW9uKGNhbGxiYWNrKSB7XHJcblx0XHRjb25zdCBkaXJDb29yZHMgPSBbXHJcblx0XHRcdHt4OiAwLCB5OiAtMX0sIC8vIHRvcFxyXG5cdFx0XHR7eDogMSwgeTogLTF9LFxyXG5cdFx0XHR7eDogMSwgeTogMH0sIC8vIHJpZ2h0XHJcblx0XHRcdHt4OiAxLCB5OiAxfSxcclxuXHRcdFx0e3g6IDAsIHk6IDF9LCAvLyBib3R0b21cclxuXHRcdFx0e3g6IC0xLCB5OiAxfSxcclxuXHRcdFx0e3g6IC0xLCB5OiAwfSwgLy8gbGVmdFxyXG5cdFx0XHR7eDogLTEsIHk6IC0xfSxcclxuXHRcdF07XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDg7IGkrKykge1xyXG5cdFx0XHRjYWxsYmFjayhpLCBkaXJDb29yZHNbaV0ueCwgZGlyQ29vcmRzW2ldLnkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Zm9yRWFjaENlbGwoY2FsbGJhY2spIHtcclxuXHRcdGZvciAobGV0IGtleSBpbiB0aGlzLmNlbGxzKSB7XHJcblx0XHRcdGNvbnN0IHsgeCwgeSB9ID0gTWFwLnBhcnNlS2V5Q29vcmRpbmF0ZXMoa2V5KTtcclxuXHRcdFx0Y2FsbGJhY2sodGhpcy5jZWxsc1trZXldLCB4LCB5LCBrZXkpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHJcblx0Zm9yRWFjaENlbGxJbkNpcmNsZShjZW50ZXJYLCBjZW50ZXJZLCByYWRpdXMsIGNhbGxiYWNrLCBpbmNsdWRlRW1wdHlDZWxscyA9IGZhbHNlKSB7XHJcblx0XHRjb25zdCBtYXhYID0gY2VudGVyWCArIHJhZGl1cztcclxuXHRcdGNvbnN0IG1heFkgPSBjZW50ZXJZICsgcmFkaXVzO1xyXG5cdFx0bGV0IHg7XHJcblx0XHRmb3IgKHggPSBjZW50ZXJYIC0gcmFkaXVzOyB4IDw9IG1heFg7IHgrKykge1xyXG5cdFx0XHRsZXQgeTtcclxuXHRcdFx0Zm9yICh5ID0gY2VudGVyWSAtIHJhZGl1czsgeSA8PSBtYXhZOyB5KyspIHtcclxuXHRcdFx0XHRjb25zdCByID0gTWF0aC5yb3VuZChnZW9tZXRlci5nZXREaXN0YW5jZShjZW50ZXJYLCBjZW50ZXJZLCB4LCB5KSk7XHJcblx0XHRcdFx0aWYgKHIgPCByYWRpdXMpIHtcclxuXHRcdFx0XHRcdGNvbnN0IGNlbGwgPSB0aGlzLmdldENlbGxBdCh4LCB5KTtcclxuXHRcdFx0XHRcdGlmIChjZWxsIHx8IGluY2x1ZGVFbXB0eUNlbGxzKSB7XHJcblx0XHRcdFx0XHRcdGNhbGxiYWNrKGNlbGwsIHgsIHkpXHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRnZXRSYW5kb21GcmVlQ2VsbChzZWVkKSB7XHRcdFxyXG5cdFx0Y29uc3QgaSA9IHJhbmRvbS5yb2xsKHRoaXMuZnJlZUNlbGxzLmxlbmd0aCwgc2VlZCk7XHJcblx0XHRcclxuXHRcdC8vIFRPRE86IFRCRC0gSXMgaXQgc3RpbGwgYSBmcmVlIGNlbGw/XHJcblx0XHQvLyB2YXIga2V5ID0gZnJlZUNlbGxzLnNwbGljZShpbmRleCwgMSlbMF07XHJcblx0XHQvLyB0aGlzLm1hcFtrZXldID0gXCIqXCI7XHJcblx0XHRjb25zdCBrZXkgPSB0aGlzLmZyZWVDZWxsc1tpXTtcclxuXHRcdGNvbnN0IGNlbGwgPSB0aGlzLmNlbGxzW2tleV07XHJcblx0XHRcclxuXHRcdGNvbnN0IHsgeCwgeSB9ID0gTWFwLnBhcnNlS2V5Q29vcmRpbmF0ZXMoa2V5KTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKHNlZWQsIGtleSwgaSwgeCwgeSk7XHJcblx0XHRyZXR1cm4geyB4LCB5LCBjZWxsIH07XHJcblx0fVxyXG5cclxuXHRnZXRDZWxsQXQoeCwgeSkge1xyXG5cdFx0Y29uc3Qga2V5ID0gTWFwLm1ha2VLZXkoeCwgeSk7XHJcblx0XHRyZXR1cm4gdGhpcy5jZWxsc1trZXldO1x0XHRcclxuXHR9XHJcblxyXG5cdGdldENoYXJhY3RlckF0KHgsIHkpIHtcclxuXHRcdGNvbnN0IGNlbGwgPSB0aGlzLmdldENlbGxBdCh4LCB5KTtcclxuXHRcdHJldHVybiAoY2VsbCkgPyBjZWxsLmdldENoYXJhY3RlcigpIDogbnVsbDtcclxuXHR9XHJcblxyXG5cdHNldENoYXJhY3RlckF0KGNoYXIsIHgsIHkpIHtcclxuXHRcdGNvbnN0IGtleSA9IE1hcC5tYWtlS2V5KHgsIHkpO1xyXG5cdFx0Y29uc3QgY2VsbCA9IHRoaXMuY2VsbHNba2V5XTtcclxuXHRcdGlmIChjZWxsKSB7XHJcblx0XHRcdGNlbGwuc2V0Q2hhcmFjdGVyKGNoYXIpO1xyXG5cdFx0fSBlbHNlIHtcclxuXHRcdFx0Y29uc3QgeyBjb2xvciwgYmFja2dyb3VuZCB9ID0gdGhpcztcclxuXHRcdFx0dGhpcy5jZWxsc1trZXldID0gbmV3IENlbGwoeyBjb2xvciwgYmFja2dyb3VuZCwgY2hhcmFjdGVyOiBjaGFyIH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGtleTtcclxuXHR9XHJcblxyXG5cdGdldENlbGxQYXNzYWJpbGl0eSh4LCB5KSB7XHJcblx0XHRjb25zdCBjZWxsID0gdGhpcy5nZXRDZWxsQXQoeCwgeSk7XHJcblx0XHRyZXR1cm4gKGNlbGwpID8gY2VsbC5nZXRQYXNzYWJpbGl0eSgpIDogZmFsc2U7XHJcblx0fVxyXG5cclxuXHRnZXRMaWdodGluZ0F0KHgsIHkpIHtcclxuXHRcdHJldHVybiB7fTsgLy8gVE9ET1xyXG5cdH1cclxuXHJcblx0Ly8gX2dlbmVyYXRlQm94ZXMoZnJlZUNlbGxzKSB7XHJcblx0Ly8gXHRmb3IgKHZhciBpPTA7aTwxMDtpKyspIHtcclxuXHQvLyBcdFx0dmFyIGluZGV4ID0gTWF0aC5mbG9vcihST1QuUk5HLmdldFVuaWZvcm0oKSAqIGZyZWVDZWxscy5sZW5ndGgpO1xyXG5cdC8vIFx0XHR2YXIga2V5ID0gZnJlZUNlbGxzLnNwbGljZShpbmRleCwgMSlbMF07XHJcblx0Ly8gXHRcdHRoaXMubWFwW2tleV0gPSBcIipcIjtcclxuXHQvLyBcdH1cclxuXHQvLyB9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gTWFwO1xyXG4iLCJjbGFzcyBJbnZlbnRvcnkge1xyXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xyXG5cdFx0dGhpcy5zaXplID0gKHR5cGVvZiBvcHRpb25zLnNpemUgPT09ICdudW1iZXInKSA/IG9wdGlvbnMuc2l6ZSA6IDEwO1xyXG5cdFx0dGhpcy5pdGVtcyA9IFtdO1xyXG5cdH1cclxuXHJcblx0aXNGdWxsKCkge1xyXG5cdFx0cmV0dXJuICh0aGlzLml0ZW1zLmxlbmd0aCA+PSB0aGlzLnNpemUpO1xyXG5cdH1cclxuXHJcblx0aGFzU3BhY2UoKSB7XHJcblx0XHRyZXR1cm4gIXRoaXMuaXNGdWxsKCk7XHJcblx0fVxyXG5cclxuXHRhZGQoaXRlbSkge1xyXG5cdFx0aWYgKHRoaXMuaXNGdWxsKCkpIHtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0aWYgKCFpdGVtLnBvcnRhYmxlKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdHRoaXMuaXRlbXMucHVzaChpdGVtKTtcclxuXHRcdHJldHVybiB0cnVlO1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlKGl0ZW0pIHtcclxuXHRcdGNvbnN0IGkgPSB0aGlzLml0ZW1zLmluZGV4T2YoaXRlbSk7XHJcblx0XHRpZiAoaSA8PSAtMSkge1xyXG5cdFx0XHRjb25zb2xlLndhcm4oJ25vdGhpbmcgZm91bmQgaW4nLCB0aGlzLml0ZW1zLCBpdGVtKTtcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgYXJyID0gdGhpcy5pdGVtcy5zcGxpY2UoaSwgMSk7XHJcblx0XHRyZXR1cm4gYXJyWzBdO1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlVHlwZSh0eXBlS2V5KSB7XHJcblx0XHRjb25zdCBpdGVtc09mVHlwZSA9IHRoaXMuaXRlbXMuZmlsdGVyKChpdGVtKSA9PiB7IHJldHVybiBpdGVtLnR5cGUgPT09IHR5cGVLZXk7IH0pO1xyXG5cdFx0aWYgKGl0ZW1zT2ZUeXBlLmxlbmd0aCA9PT0gMCkge1xyXG5cdFx0XHRyZXR1cm4gZmFsc2U7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gdGhpcy5yZW1vdmUoaXRlbXNPZlR5cGVbMF0pO1xyXG5cdH1cclxuXHJcblx0Z2V0KG4pIHtcclxuXHRcdGlmICh0eXBlb2YgbiA9PT0gJ251bWJlcicpIHtcclxuXHRcdFx0cmV0dXJuIHRoaXMuaXRlbXNbbl07XHJcblx0XHR9IGVsc2UgaWYgKHR5cGVvZiBuID09PSAnc3RyaW5nJykge1xyXG5cdFx0XHRyZXR1cm4gdGhpcy5pdGVtcy5maW5kKChpdGVtKSA9PiB7IHJldHVybiBpdGVtLm5hbWUgPT09IG47IH0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIHRoaXMuaXRlbXM7XHJcblx0fVxyXG5cclxuXHRnZXRTdHJpbmcoKSB7XHJcblx0XHRjb25zdCBhcnIgPSB0aGlzLml0ZW1zLm1hcCgoaXRlbSwgaSkgPT4geyByZXR1cm4gYFskeyhpICsgMSl9XSAke2l0ZW0ubmFtZX1gOyB9KTtcclxuXHRcdHJldHVybiAoYXJyLmxlbmd0aCkgPyBhcnIuam9pbignLCAnKSA6ICdub3RoaW5nJztcclxuXHR9XHJcblxyXG5cdGxvb3BPdmVyQ29udGVudHMoZm4pIHtcclxuXHRcdHRoaXMuaXRlbXMuZm9yRWFjaCgoaXRlbSwgaSkgPT4ge1xyXG5cdFx0XHRmbihpdGVtLCBpKTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHJcblx0aGFzQ29udGVudHMoKSB7XHJcblx0XHRyZXR1cm4gKHRoaXMuaXRlbXMubGVuZ3RoID4gMCk7XHJcblx0fVxyXG5cclxuXHRjb250YWlucyhpdGVtTmFtZSkge1xyXG5cdFx0bGV0IGZvdW5kSXRlbSA9IHRoaXMuaXRlbXMuZmluZCgoaXRlbSkgPT4geyByZXR1cm4gKGl0ZW0ubmFtZSA9PT0gaXRlbU5hbWUpOyB9KTtcclxuXHRcdHJldHVybiBCb29sZWFuKGZvdW5kSXRlbSk7XHJcblx0fVxyXG5cclxuXHRjb250YWluc1R5cGUodHlwZU5hbWUpIHtcclxuXHRcdGxldCBmb3VuZEl0ZW0gPSB0aGlzLml0ZW1zLmZpbmQoKGl0ZW0pID0+IHsgcmV0dXJuIChpdGVtLnR5cGUgPT09IHR5cGVOYW1lKTsgfSk7XHJcblx0XHRyZXR1cm4gQm9vbGVhbihmb3VuZEl0ZW0pO1xyXG5cdH1cclxufVxyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBJbnZlbnRvcnk7XHJcbiIsIlxyXG5tb2R1bGUuZXhwb3J0cyA9IHtcclxuXHRESVJTXzQ6IE9iamVjdC5mcmVlemUoW1xyXG5cdFx0eyB4OiAwLCB5OiAtMSB9LFxyXG5cdFx0eyB4OiAxLCB5OiAwIH0sXHJcblx0XHR7IHg6IDAsIHk6IDEgfSxcclxuXHRcdHsgeDogLTEsIHk6IDAgfSxcclxuXHRdKSxcclxuXHRESVJTXzg6IE9iamVjdC5mcmVlemUoW1xyXG5cdFx0eyB4OiAwLCB5OiAtMSB9LFxyXG5cdFx0eyB4OiAxLCB5OiAtMSB9LFxyXG5cdFx0eyB4OiAxLCB5OiAwIH0sXHJcblx0XHR7IHg6IDEsIHk6IDEgfSxcclxuXHRcdHsgeDogMCwgeTogMSB9LFxyXG5cdFx0eyB4OiAtMSwgeTogMSB9LFxyXG5cdFx0eyB4OiAtMSwgeTogMCB9LFxyXG5cdFx0eyB4OiAtMSwgeTogLTEgfSxcdFxyXG5cdF0pLFxyXG5cdERJUlNfOF9ESUFHTk9MUzogT2JqZWN0LmZyZWV6ZShbXHJcblx0XHR7IHg6IDEsIHk6IC0xIH0sXHJcblx0XHR7IHg6IDEsIHk6IDEgfSxcclxuXHRcdHsgeDogLTEsIHk6IDEgfSxcclxuXHRcdHsgeDogLTEsIHk6IC0xIH0sXHRcclxuXHRdKSxcclxufTtcclxuIiwiY29uc3QgSXRlbSA9IHJlcXVpcmUoJy4vSXRlbScpO1xyXG5cclxuY2xhc3MgUHJvcCBleHRlbmRzIEl0ZW0ge1xyXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xyXG5cdFx0b3B0aW9ucyA9IHsgcG9ydGFibGU6IGZhbHNlLCAuLi5vcHRpb25zIH07XHJcblx0XHRzdXBlcihvcHRpb25zKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gUHJvcDtcclxuIiwiY29uc3QgUk9UID0gcmVxdWlyZSgncm90LWpzJyk7XHJcbmNvbnN0IEdhbWUgPSByZXF1aXJlKCcuL0dhbWUnKTtcclxuY29uc3QgSXRlbSA9IHJlcXVpcmUoJy4vSXRlbScpO1xyXG5jb25zdCBNYXAgPSByZXF1aXJlKCcuL01hcCcpO1xyXG5jb25zdCBBY3RvciA9IHJlcXVpcmUoJy4vQWN0b3InKTtcclxuY29uc3QgUHJvcCA9IHJlcXVpcmUoJy4vUHJvcCcpO1xyXG5jb25zdCBMZXZlbCA9IHJlcXVpcmUoJy4vTGV2ZWwnKTtcclxuY29uc3QgRGlzcGxheSA9IHJlcXVpcmUoJy4vRGlzcGxheScpO1xyXG5jb25zdCByYW5kb20gPSByZXF1aXJlKCcuL3JhbmRvbScpO1xyXG5jb25zdCByZWFkeSA9IHJlcXVpcmUoJy4vcmVhZHknKTtcclxuXHJcbmNvbnN0IHJvdGUgPSB7XHJcbiAgICBST1QsXHJcbiAgICBHYW1lLCBMZXZlbCwgTWFwLCBJdGVtLCBQcm9wLCBBY3RvciwgRGlzcGxheSxcclxuICAgIHJhbmRvbSxcclxuICAgIHJlYWR5XHJcbn07XHJcblxyXG5pZiAod2luZG93KSB7XHJcbiAgICB3aW5kb3cucm90ZSA9IHJvdGU7XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gcm90ZTtcclxuIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG52YXIgcHJvY2VzcyA9IG1vZHVsZS5leHBvcnRzID0ge307XG5cbi8vIGNhY2hlZCBmcm9tIHdoYXRldmVyIGdsb2JhbCBpcyBwcmVzZW50IHNvIHRoYXQgdGVzdCBydW5uZXJzIHRoYXQgc3R1YiBpdFxuLy8gZG9uJ3QgYnJlYWsgdGhpbmdzLiAgQnV0IHdlIG5lZWQgdG8gd3JhcCBpdCBpbiBhIHRyeSBjYXRjaCBpbiBjYXNlIGl0IGlzXG4vLyB3cmFwcGVkIGluIHN0cmljdCBtb2RlIGNvZGUgd2hpY2ggZG9lc24ndCBkZWZpbmUgYW55IGdsb2JhbHMuICBJdCdzIGluc2lkZSBhXG4vLyBmdW5jdGlvbiBiZWNhdXNlIHRyeS9jYXRjaGVzIGRlb3B0aW1pemUgaW4gY2VydGFpbiBlbmdpbmVzLlxuXG52YXIgY2FjaGVkU2V0VGltZW91dDtcbnZhciBjYWNoZWRDbGVhclRpbWVvdXQ7XG5cbmZ1bmN0aW9uIGRlZmF1bHRTZXRUaW1vdXQoKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdzZXRUaW1lb3V0IGhhcyBub3QgYmVlbiBkZWZpbmVkJyk7XG59XG5mdW5jdGlvbiBkZWZhdWx0Q2xlYXJUaW1lb3V0ICgpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBoYXMgbm90IGJlZW4gZGVmaW5lZCcpO1xufVxuKGZ1bmN0aW9uICgpIHtcbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIHNldFRpbWVvdXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBzZXRUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IGRlZmF1bHRTZXRUaW1vdXQ7XG4gICAgICAgIH1cbiAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQgPSBkZWZhdWx0U2V0VGltb3V0O1xuICAgIH1cbiAgICB0cnkge1xuICAgICAgICBpZiAodHlwZW9mIGNsZWFyVGltZW91dCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gY2xlYXJUaW1lb3V0O1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICAgICAgfVxuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgY2FjaGVkQ2xlYXJUaW1lb3V0ID0gZGVmYXVsdENsZWFyVGltZW91dDtcbiAgICB9XG59ICgpKVxuZnVuY3Rpb24gcnVuVGltZW91dChmdW4pIHtcbiAgICBpZiAoY2FjaGVkU2V0VGltZW91dCA9PT0gc2V0VGltZW91dCkge1xuICAgICAgICAvL25vcm1hbCBlbnZpcm9tZW50cyBpbiBzYW5lIHNpdHVhdGlvbnNcbiAgICAgICAgcmV0dXJuIHNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9XG4gICAgLy8gaWYgc2V0VGltZW91dCB3YXNuJ3QgYXZhaWxhYmxlIGJ1dCB3YXMgbGF0dGVyIGRlZmluZWRcbiAgICBpZiAoKGNhY2hlZFNldFRpbWVvdXQgPT09IGRlZmF1bHRTZXRUaW1vdXQgfHwgIWNhY2hlZFNldFRpbWVvdXQpICYmIHNldFRpbWVvdXQpIHtcbiAgICAgICAgY2FjaGVkU2V0VGltZW91dCA9IHNldFRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBzZXRUaW1lb3V0KGZ1biwgMCk7XG4gICAgfVxuICAgIHRyeSB7XG4gICAgICAgIC8vIHdoZW4gd2hlbiBzb21lYm9keSBoYXMgc2NyZXdlZCB3aXRoIHNldFRpbWVvdXQgYnV0IG5vIEkuRS4gbWFkZG5lc3NcbiAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQoZnVuLCAwKTtcbiAgICB9IGNhdGNoKGUpe1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgLy8gV2hlbiB3ZSBhcmUgaW4gSS5FLiBidXQgdGhlIHNjcmlwdCBoYXMgYmVlbiBldmFsZWQgc28gSS5FLiBkb2Vzbid0IHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkU2V0VGltZW91dC5jYWxsKG51bGwsIGZ1biwgMCk7XG4gICAgICAgIH0gY2F0Y2goZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvclxuICAgICAgICAgICAgcmV0dXJuIGNhY2hlZFNldFRpbWVvdXQuY2FsbCh0aGlzLCBmdW4sIDApO1xuICAgICAgICB9XG4gICAgfVxuXG5cbn1cbmZ1bmN0aW9uIHJ1bkNsZWFyVGltZW91dChtYXJrZXIpIHtcbiAgICBpZiAoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBjbGVhclRpbWVvdXQpIHtcbiAgICAgICAgLy9ub3JtYWwgZW52aXJvbWVudHMgaW4gc2FuZSBzaXR1YXRpb25zXG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgLy8gaWYgY2xlYXJUaW1lb3V0IHdhc24ndCBhdmFpbGFibGUgYnV0IHdhcyBsYXR0ZXIgZGVmaW5lZFxuICAgIGlmICgoY2FjaGVkQ2xlYXJUaW1lb3V0ID09PSBkZWZhdWx0Q2xlYXJUaW1lb3V0IHx8ICFjYWNoZWRDbGVhclRpbWVvdXQpICYmIGNsZWFyVGltZW91dCkge1xuICAgICAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gICAgICAgIHJldHVybiBjbGVhclRpbWVvdXQobWFya2VyKTtcbiAgICB9XG4gICAgdHJ5IHtcbiAgICAgICAgLy8gd2hlbiB3aGVuIHNvbWVib2R5IGhhcyBzY3Jld2VkIHdpdGggc2V0VGltZW91dCBidXQgbm8gSS5FLiBtYWRkbmVzc1xuICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0KG1hcmtlcik7XG4gICAgfSBjYXRjaCAoZSl7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICAvLyBXaGVuIHdlIGFyZSBpbiBJLkUuIGJ1dCB0aGUgc2NyaXB0IGhhcyBiZWVuIGV2YWxlZCBzbyBJLkUuIGRvZXNuJ3QgIHRydXN0IHRoZSBnbG9iYWwgb2JqZWN0IHdoZW4gY2FsbGVkIG5vcm1hbGx5XG4gICAgICAgICAgICByZXR1cm4gY2FjaGVkQ2xlYXJUaW1lb3V0LmNhbGwobnVsbCwgbWFya2VyKTtcbiAgICAgICAgfSBjYXRjaCAoZSl7XG4gICAgICAgICAgICAvLyBzYW1lIGFzIGFib3ZlIGJ1dCB3aGVuIGl0J3MgYSB2ZXJzaW9uIG9mIEkuRS4gdGhhdCBtdXN0IGhhdmUgdGhlIGdsb2JhbCBvYmplY3QgZm9yICd0aGlzJywgaG9wZnVsbHkgb3VyIGNvbnRleHQgY29ycmVjdCBvdGhlcndpc2UgaXQgd2lsbCB0aHJvdyBhIGdsb2JhbCBlcnJvci5cbiAgICAgICAgICAgIC8vIFNvbWUgdmVyc2lvbnMgb2YgSS5FLiBoYXZlIGRpZmZlcmVudCBydWxlcyBmb3IgY2xlYXJUaW1lb3V0IHZzIHNldFRpbWVvdXRcbiAgICAgICAgICAgIHJldHVybiBjYWNoZWRDbGVhclRpbWVvdXQuY2FsbCh0aGlzLCBtYXJrZXIpO1xuICAgICAgICB9XG4gICAgfVxuXG5cblxufVxudmFyIHF1ZXVlID0gW107XG52YXIgZHJhaW5pbmcgPSBmYWxzZTtcbnZhciBjdXJyZW50UXVldWU7XG52YXIgcXVldWVJbmRleCA9IC0xO1xuXG5mdW5jdGlvbiBjbGVhblVwTmV4dFRpY2soKSB7XG4gICAgaWYgKCFkcmFpbmluZyB8fCAhY3VycmVudFF1ZXVlKSB7XG4gICAgICAgIHJldHVybjtcbiAgICB9XG4gICAgZHJhaW5pbmcgPSBmYWxzZTtcbiAgICBpZiAoY3VycmVudFF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBxdWV1ZSA9IGN1cnJlbnRRdWV1ZS5jb25jYXQocXVldWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICB9XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCkge1xuICAgICAgICBkcmFpblF1ZXVlKCk7XG4gICAgfVxufVxuXG5mdW5jdGlvbiBkcmFpblF1ZXVlKCkge1xuICAgIGlmIChkcmFpbmluZykge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIHZhciB0aW1lb3V0ID0gcnVuVGltZW91dChjbGVhblVwTmV4dFRpY2spO1xuICAgIGRyYWluaW5nID0gdHJ1ZTtcblxuICAgIHZhciBsZW4gPSBxdWV1ZS5sZW5ndGg7XG4gICAgd2hpbGUobGVuKSB7XG4gICAgICAgIGN1cnJlbnRRdWV1ZSA9IHF1ZXVlO1xuICAgICAgICBxdWV1ZSA9IFtdO1xuICAgICAgICB3aGlsZSAoKytxdWV1ZUluZGV4IDwgbGVuKSB7XG4gICAgICAgICAgICBpZiAoY3VycmVudFF1ZXVlKSB7XG4gICAgICAgICAgICAgICAgY3VycmVudFF1ZXVlW3F1ZXVlSW5kZXhdLnJ1bigpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHF1ZXVlSW5kZXggPSAtMTtcbiAgICAgICAgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIH1cbiAgICBjdXJyZW50UXVldWUgPSBudWxsO1xuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgcnVuQ2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xufVxuXG5wcm9jZXNzLm5leHRUaWNrID0gZnVuY3Rpb24gKGZ1bikge1xuICAgIHZhciBhcmdzID0gbmV3IEFycmF5KGFyZ3VtZW50cy5sZW5ndGggLSAxKTtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgZm9yICh2YXIgaSA9IDE7IGkgPCBhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGFyZ3NbaSAtIDFdID0gYXJndW1lbnRzW2ldO1xuICAgICAgICB9XG4gICAgfVxuICAgIHF1ZXVlLnB1c2gobmV3IEl0ZW0oZnVuLCBhcmdzKSk7XG4gICAgaWYgKHF1ZXVlLmxlbmd0aCA9PT0gMSAmJiAhZHJhaW5pbmcpIHtcbiAgICAgICAgcnVuVGltZW91dChkcmFpblF1ZXVlKTtcbiAgICB9XG59O1xuXG4vLyB2OCBsaWtlcyBwcmVkaWN0aWJsZSBvYmplY3RzXG5mdW5jdGlvbiBJdGVtKGZ1biwgYXJyYXkpIHtcbiAgICB0aGlzLmZ1biA9IGZ1bjtcbiAgICB0aGlzLmFycmF5ID0gYXJyYXk7XG59XG5JdGVtLnByb3RvdHlwZS5ydW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgdGhpcy5mdW4uYXBwbHkobnVsbCwgdGhpcy5hcnJheSk7XG59O1xucHJvY2Vzcy50aXRsZSA9ICdicm93c2VyJztcbnByb2Nlc3MuYnJvd3NlciA9IHRydWU7XG5wcm9jZXNzLmVudiA9IHt9O1xucHJvY2Vzcy5hcmd2ID0gW107XG5wcm9jZXNzLnZlcnNpb24gPSAnJzsgLy8gZW1wdHkgc3RyaW5nIHRvIGF2b2lkIHJlZ2V4cCBpc3N1ZXNcbnByb2Nlc3MudmVyc2lvbnMgPSB7fTtcblxuZnVuY3Rpb24gbm9vcCgpIHt9XG5cbnByb2Nlc3Mub24gPSBub29wO1xucHJvY2Vzcy5hZGRMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLm9uY2UgPSBub29wO1xucHJvY2Vzcy5vZmYgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVMaXN0ZW5lciA9IG5vb3A7XG5wcm9jZXNzLnJlbW92ZUFsbExpc3RlbmVycyA9IG5vb3A7XG5wcm9jZXNzLmVtaXQgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5wcmVwZW5kT25jZUxpc3RlbmVyID0gbm9vcDtcblxucHJvY2Vzcy5saXN0ZW5lcnMgPSBmdW5jdGlvbiAobmFtZSkgeyByZXR1cm4gW10gfVxuXG5wcm9jZXNzLmJpbmRpbmcgPSBmdW5jdGlvbiAobmFtZSkge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5iaW5kaW5nIGlzIG5vdCBzdXBwb3J0ZWQnKTtcbn07XG5cbnByb2Nlc3MuY3dkID0gZnVuY3Rpb24gKCkgeyByZXR1cm4gJy8nIH07XG5wcm9jZXNzLmNoZGlyID0gZnVuY3Rpb24gKGRpcikge1xuICAgIHRocm93IG5ldyBFcnJvcigncHJvY2Vzcy5jaGRpciBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xucHJvY2Vzcy51bWFzayA9IGZ1bmN0aW9uKCkgeyByZXR1cm4gMDsgfTtcbiIsImNvbnN0IFJPVCA9IHJlcXVpcmUoJ3JvdC1qcycpO1xyXG5jb25zdCByZWFkeSA9IHJlcXVpcmUoJy4vcmVhZHknKTtcclxuY29uc3QgRGlzcGxheSA9IHJlcXVpcmUoJy4vRGlzcGxheScpO1xyXG5jb25zdCBMZXZlbCA9IHJlcXVpcmUoJy4vTGV2ZWwnKTtcclxuY29uc3QgQWN0b3IgPSByZXF1aXJlKCcuL0FjdG9yJyk7XHJcbmNvbnN0IEl0ZW0gPSByZXF1aXJlKCcuL0l0ZW0nKTtcclxuY29uc3QgS2V5Ym9hcmQgPSByZXF1aXJlKCcuL0tleWJvYXJkTGlzdGVuZXInKTtcclxuY29uc3QgTXVzaWNCb3ggPSByZXF1aXJlKCcuL011c2ljQm94Jyk7XHJcbmNvbnN0IENvbnNvbGUgPSByZXF1aXJlKCcuL0NvbnNvbGUnKTtcclxuY29uc3QgcmFuZG9tID0gcmVxdWlyZSgnLi9yYW5kb20nKTtcclxuXHJcbmNvbnN0IE1BSU5fR0FNRV9TVEFURSA9ICdHQU1FJztcclxuY29uc3QgU1BMQVNIX1NUQVRFID0gJ1NQTEFTSCc7XHJcblxyXG5jbGFzcyBHYW1lIHtcclxuXHRjb25zdHJ1Y3RvcihvcHRpb25zKSB7XHJcblx0XHRjb25zdCB7IGlkLCBjb25zb2xlSWQsIGRhdGEgfSA9IG9wdGlvbnM7XHJcblx0XHR0aGlzLmlkID0gaWQ7XHJcblx0XHR0aGlzLmRpc3BsYXlDb250YWluZXIgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChpZCB8fCAnZGlzcGxheScpO1xyXG5cdFx0dGhpcy5jb25zb2xlID0gbmV3IENvbnNvbGUoeyBpZDogY29uc29sZUlkIH0pO1xyXG5cdFx0dGhpcy5kaXNwbGF5ID0gbnVsbDtcclxuXHRcdHRoaXMuYWN0aXZlTGV2ZWxJbmRleCA9IDA7XHJcblx0XHQvLyBUaGUgZ2VuZXJhdGVkIGxldmVsc1xyXG5cdFx0dGhpcy5sZXZlbHMgPSBbXTtcclxuXHRcdC8vIFJlZmVyZW5jZSBkYXRhIG9uIHByb3RvdHlwaWNhbCBcInRoaW5nc1wiIChtb25zdGVycywgaXRlbXMpXHJcblx0XHR0aGlzLmRhdGEgPSB7IG1vbnN0ZXJzOiB7fSwgaXRlbXM6IHt9LCBwcm9wczoge30gfTtcclxuXHRcdC8vIFRoZSBtYWluIGFjdG9yXHJcblx0XHR0aGlzLmhlcm8gPSBudWxsOyAvLyBwbGF5ZXIgY2hhcmFjdGVyIC8gcGxheWVyIGFjdG9yXHJcblx0XHQvLyBHdXRzXHJcblx0XHR0aGlzLnNjaGVkdWxlciA9IG5ldyBST1QuU2NoZWR1bGVyLlNpbXBsZSgpO1xyXG5cdFx0dGhpcy5lbmdpbmUgPSBudWxsO1xyXG5cdFx0dGhpcy5rZXlib2FyZCA9IG51bGw7XHJcblx0XHR0aGlzLnN0YXRlID0gJ0lOSVQnO1xyXG5cdFx0dGhpcy5zdGF0ZXMgPSBbJ0lOSVQnLCBTUExBU0hfU1RBVEUsIE1BSU5fR0FNRV9TVEFURV07XHJcblx0XHQvLyB0aGlzLnNldHVwRW5naW5lKCk7XHJcblx0XHR0aGlzLmxvYWRpbmdQcm9taXNlID0gbnVsbDtcclxuXHRcdHRoaXMuY29uc29sZS5zZXR1cCgpO1xyXG5cdFx0dGhpcy5sb2FkRGF0YShkYXRhKTtcclxuXHRcdHRoaXMuaG9va3MgPSB7fTtcclxuXHRcdHRoaXMuY3VzdG9tRWZmZWN0cyA9IHsgLi4ub3B0aW9ucy5jdXN0b21FZmZlY3RzIH07XHJcblx0fVxyXG5cclxuXHRzZXR1cEVuZ2luZSgpIHtcclxuXHRcdHRoaXMuZW5naW5lID0gbmV3IFJPVC5FbmdpbmUodGhpcy5zY2hlZHVsZXIpO1xyXG5cdFx0dGhpcy5lbmdpbmUuc3RhcnQoKTtcclxuXHRcdHJldHVybiB0aGlzLmVuZ2luZTtcclxuXHR9XHJcblxyXG5cdHNldHVwS2V5Ym9hcmQoKSB7XHJcblx0XHR0aGlzLmtleWJvYXJkID0gbmV3IEtleWJvYXJkKHsgc3RhdGU6IE1BSU5fR0FNRV9TVEFURSwgYXV0b1N0YXJ0OiB0cnVlIH0pO1xyXG5cdFx0Ly8gU3BsYXNoIHN0YXRlXHJcblx0XHR0aGlzLmtleWJvYXJkLm9uKFNQTEFTSF9TVEFURSwgJ0VOVEVSJywgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLnNldFN0YXRlKE1BSU5fR0FNRV9TVEFURSk7XHJcblx0XHR9KTtcclxuXHRcdC8vIE1haW4gc3RhdGVcclxuXHRcdHRoaXMua2V5Ym9hcmQub24oTUFJTl9HQU1FX1NUQVRFLCAnRElSRUNUSU9OJywgKGtleU5hbWUsIGtleUNvZGUsIGRpcmVjdGlvbikgPT4ge1xyXG5cdFx0XHQvLyBUT0RPOiBMb2NrIGFuZCB1bmxvY2sgdGhlIGdhbWU/IG9yIGRvIHNvbWV0aGluZyBlbHNlIHRvIGRldGVybWluZSBpZiBpdCdzIE9LIHRvIG1vdmVcclxuXHRcdFx0dGhpcy5oZXJvLnF1ZXVlQWN0aW9uKCdtb3ZlJywgeyBkaXJlY3Rpb24gfSk7XHJcblx0XHRcdHRoaXMuYWR2YW5jZSgpO1xyXG5cdFx0fSk7XHJcblx0XHR0aGlzLmtleWJvYXJkLm9uKE1BSU5fR0FNRV9TVEFURSwgJ0VOVEVSJywgKCkgPT4ge1xyXG5cdFx0XHQvLyB0aGlzLmFjdG9yRGVmYXVsdEFjdGlvbih0aGlzLmhlcm8pOyAvLyBUT0RPOiBSZW1vdmUgbWVcclxuXHRcdFx0dGhpcy5hY3RvckFkZERlZmF1bHRBY3Rpb24odGhpcy5oZXJvKTtcclxuXHRcdFx0dGhpcy5hZHZhbmNlKCk7XHJcblx0XHR9KTtcclxuXHRcdHRoaXMua2V5Ym9hcmQub24oTUFJTl9HQU1FX1NUQVRFLCAnU1BBQ0UnLCAoKSA9PiB7XHJcblx0XHRcdHRoaXMuaGVyby5xdWV1ZUFjdGlvbignd2FpdCcpO1xyXG5cdFx0XHR0aGlzLmFkdmFuY2UoKTtcclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5rZXlib2FyZC5vbihNQUlOX0dBTUVfU1RBVEUsICd0JywgKCkgPT4ge1xyXG5cdFx0XHR0aGlzLnNob3dJbnZlbnRvcnkoKTtcclxuXHRcdFx0dGhpcy5wcmludCgnPiBUaHJvdyB3aGljaCBpdGVtPycpO1xyXG5cdFx0XHRsZXQgbiA9IHByb21wdCgnVGhyb3cgd2hpY2ggaXRlbT8gXFxuXFxuJyArIHRoaXMuaGVyby5pbnZlbnRvcnkuZ2V0U3RyaW5nKCkpO1xyXG5cdFx0XHRpZiAoIW4gfHwgbi5sZW5ndGggPT09IDApIHtcclxuXHRcdFx0XHR0aGlzLnByaW50KCdOb25lJyk7XHJcblx0XHRcdFx0cmV0dXJuO1xyXG5cdFx0XHR9XHJcblx0XHRcdG4gPSBwYXJzZUludChuLCAxMCk7XHJcblx0XHRcdGNvbnN0IGkgPSAoaXNOYU4obikpID8gLTEgOiBuIC0gMTtcclxuXHRcdFx0Y29uc3QgaXRlbSA9IHRoaXMuaGVyby5pbnZlbnRvcnkuZ2V0KGkpO1xyXG5cdFx0XHRpZiAoaXRlbSkge1xyXG5cdFx0XHRcdHRoaXMuaGVyby5xdWV1ZUFjdGlvbigndGhyb3cnLCB7IHdoYXQ6IGl0ZW0sIHg6IHRoaXMuaGVyby54LCB5OiB0aGlzLmhlcm8ueSB9KTtcclxuXHRcdFx0XHR0aGlzLmFkdmFuY2UoKTtcclxuXHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHR0aGlzLnByaW50KGBJbnZhbGlkIGl0ZW0gWyR7bn1dYCk7XHJcblx0XHRcdH1cclxuXHRcdH0pO1xyXG5cdFx0dGhpcy5rZXlib2FyZC5vbihNQUlOX0dBTUVfU1RBVEUsICdpJywgKCkgPT4geyB0aGlzLnNob3dJbnZlbnRvcnkoKTsgfSk7XHJcblx0XHRmb3IgKGxldCBpID0gMDsgaSA8IDk7IGkrKykge1xyXG5cdFx0XHRjb25zdCBrZXkgPSBTdHJpbmcoaSArIDEpO1xyXG5cdFx0XHR0aGlzLmtleWJvYXJkLm9uKE1BSU5fR0FNRV9TVEFURSwga2V5LCAoKSA9PiB7XHJcblx0XHRcdFx0dGhpcy5oZXJvLnJlYWR5QWJpbGl0eUJ5SW5kZXgoaSk7XHJcblx0XHRcdFx0dGhpcy5kcmF3KCk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fVxyXG5cdFx0Ly8gdGhpcy5rZXlib2FyZC5zdGFydCgpO1xyXG5cdH1cclxuXHJcblx0c2V0dXBNdXNpYygpIHtcclxuXHRcdHRoaXMubXVzaWMgPSBuZXcgTXVzaWNCb3godGhpcy5kYXRhLnBsYXlsaXN0KTtcclxuXHR9XHJcblxyXG5cdHJlbW92ZUtleWJvYXJkKCkge1xyXG5cdFx0Ly8gVE9ETzogdGhpcy5rZXlib2FyZC5vZmYoKSBvbiBhbGwgbGlzdGVuZXJzXHJcblx0fVxyXG5cclxuXHRjcmVhdGVEaXNwbGF5KG9wdGlvbnMgPSB7fSkge1xyXG5cdFx0dGhpcy5kaXNwbGF5ID0gbmV3IERpc3BsYXkob3B0aW9ucyk7XHJcblx0XHR0aGlzLmRpc3BsYXkuc2V0dXBFbGVtZW50cygpO1xyXG5cdH1cclxuXHJcblx0Ly8tLS0tIERyYXcgLyBSZW5kZXJcclxuXHJcblx0cHJpbnQoc3RyLCBjbGFzc2VzID0gJycsIHdhaXQgPSAwKSB7XHJcblx0XHRpZiAod2FpdCkge1xyXG5cdFx0XHRzZXRUaW1lb3V0KCgpID0+IHsgdGhpcy5wcmludChzdHIsIGNsYXNzZXMpOyB9LCB3YWl0KTtcclxuXHRcdFx0cmV0dXJuO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5jb25zb2xlLnByaW50KHN0ciwgY2xhc3Nlcyk7XHJcblx0fVxyXG5cclxuXHRzaG93SW52ZW50b3J5KCkge1xyXG5cdFx0Y29uc3QgaXRlbXMgPSB0aGlzLmhlcm8uaW52ZW50b3J5LmdldFN0cmluZygpO1xyXG5cdFx0dGhpcy5wcmludCgnSW52ZW50b3J5OiAnICsgaXRlbXMpO1x0XHRcclxuXHR9XHJcblxyXG5cdGRyYXcoKSB7XHJcblx0XHR0aGlzLmRpc3BsYXkuZHJhd0xldmVsKHRoaXMsIHRoaXMuZ2V0QWN0aXZlTGV2ZWwoKSwgdGhpcy5oZXJvKTtcclxuXHR9XHJcblxyXG5cclxuXHQvLy0tLS0gR2VuZXJhdGlvblxyXG5cclxuXHRjcmVhdGVMZXZlbChvcHRpb25zID0ge30sIHNlZWQpIHtcclxuXHRcdG9wdGlvbnMuc2VlZCA9IHNlZWQgfHwgb3B0aW9ucy5zZWVkO1xyXG5cdFx0Y29uc3QgbGV2ZWxPcHRpb25zID0ge1xyXG5cdFx0XHRjdXN0b21FZmZlY3RzOiB0aGlzLmN1c3RvbUVmZmVjdHMsXHJcblx0XHRcdC4uLm9wdGlvbnMsXHJcblx0XHRcdGxldmVsSW5kZXg6IHRoaXMubGV2ZWxzLmxlbmd0aFxyXG5cdFx0fTtcclxuXHRcdC8vIGNvbnNvbGUud2Fybih0aGlzLmN1c3RvbUVmZmVjdHMsIGxldmVsT3B0aW9ucyk7XHJcblx0XHRjb25zdCBsZXZlbCA9IG5ldyBMZXZlbChsZXZlbE9wdGlvbnMsIHRoaXMuZGF0YSk7XHJcblx0XHR0aGlzLmxldmVscy5wdXNoKGxldmVsKTtcclxuXHRcdHJldHVybiBsZXZlbDtcclxuXHR9XHJcblxyXG5cdGNyZWF0ZUxldmVscyhhcnIgPSBbXSwgYmFzZVNlZWQgPSAxKSB7XHJcblx0XHRsZXQgc2VlZCA9IGJhc2VTZWVkO1xyXG5cdFx0YXJyLmZvckVhY2goKGl0ZW0sIGkpID0+IHtcclxuXHRcdFx0c2VlZCArPSBpO1xyXG5cdFx0XHRpZiAodHlwZW9mIGl0ZW0gPT09ICdzdHJpbmcnKSB7IC8vIGxldmVsIHR5cGUga2V5XHJcblx0XHRcdFx0dGhpcy5jcmVhdGVMZXZlbCh0aGlzLmdldExldmVsVHlwZShpdGVtKSwgc2VlZCk7XHJcblx0XHRcdH0gZWxzZSBpZiAodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnICYmIGl0ZW0gIT09IG51bGwpIHtcclxuXHRcdFx0XHRjb25zdCBuID0gKHR5cGVvZiBpdGVtLnJlcGVhdCA9PT0gJ251bWJlcicpID8gaXRlbS5yZXBlYXQgOiAxO1xyXG5cdFx0XHRcdGZvciAobGV0IHIgPSAwOyByIDwgbjsgcisrKSB7XHJcblx0XHRcdFx0XHRzZWVkICs9IHI7XHJcblx0XHRcdFx0XHR0aGlzLmNyZWF0ZUxldmVsKHRoaXMuZ2V0TGV2ZWxUeXBlKGl0ZW0ubGV2ZWxUeXBlS2V5KSwgc2VlZCk7XHJcblx0XHRcdFx0fVxyXG5cdFx0XHR9XHJcblx0XHR9KTtcclxuXHRcdHRoaXMuY29ubmVjdFN0YWlycygpO1xyXG5cdFx0cmV0dXJuIHRoaXMubGV2ZWxzO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlQWN0b3Iob3B0aW9ucyA9IHt9LCBsZXZlbCkge1xyXG5cdFx0Y29uc3QgYWN0b3IgPSBuZXcgQWN0b3Iob3B0aW9ucyk7XHJcblx0XHR0aGlzLnNjaGVkdWxlci5hZGQoYWN0b3IsIHRydWUpO1xyXG5cdFx0bGV2ZWwgPSAobGV2ZWwgPT09IHRydWUpID8gdGhpcy5nZXRBY3RpdmVMZXZlbCgpIDogbGV2ZWw7XHJcblx0XHRpZiAobGV2ZWwpIHtcclxuXHRcdFx0bGV2ZWwuYWRkQWN0b3IoYWN0b3IpO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGFjdG9yO1xyXG5cdH1cclxuXHJcblx0Y3JlYXRlSXRlbShvcHRpb25zID0ge30sIGxldmVsKSB7XHJcblx0XHRjb25zdCBpdGVtID0gbmV3IEl0ZW0ob3B0aW9ucyk7XHJcblx0XHRsZXZlbCA9IChsZXZlbCA9PT0gdHJ1ZSkgPyB0aGlzLmdldEFjdGl2ZUxldmVsKCkgOiBsZXZlbDtcclxuXHRcdGlmIChsZXZlbCkge1xyXG5cdFx0XHRsZXZlbC5hZGRJdGVtKGl0ZW0pO1xyXG5cdFx0fVxyXG5cdFx0cmV0dXJuIGl0ZW07XHJcblx0fVxyXG5cclxuXHRjcmVhdGVIZXJvKG9wdGlvbnMgPSB7fSkge1xyXG5cdFx0Y29uc3QgaGVyb09wdGlvbnMgPSB7IC4uLm9wdGlvbnMsIGNoYXJhY3RlcjogJ0AnLCBpc0hlcm86IHRydWUgfTtcclxuXHRcdHRoaXMuaGVybyA9IHRoaXMuY3JlYXRlQWN0b3IoaGVyb09wdGlvbnMsIHRydWUpO1xyXG5cclxuXHRcdGNvbnN0IGcgPSB0aGlzO1xyXG5cdFx0Ly8gU2V0dXAgYWN0aW9uIHN0dWZmIC4uLiB0aGlzIG5lZWRzIHRvIGJlIHJlZmFjdG9yZWRcclxuXHRcdHRoaXMuaGVyby5hY3QgPSBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdGcuZW5naW5lLmxvY2soKTtcclxuXHRcdFx0d2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCB0aGlzKTsgLy8gcGFzcyB0aGUgaGVybzsgdGhlIGBoYW5kbGVFdmVudGAgd2lsbCBiZSB1c2VkXHJcblx0XHR9O1xyXG5cdFx0dGhpcy5oZXJvLmhhbmRsZUV2ZW50ID0gZnVuY3Rpb24gKGUpIHsgLy8gTGVmdG92ZXIgZnJvbSB0dXRvcmlhbCwgcGFydCAyXHJcblx0XHRcdHdpbmRvdy5yZW1vdmVFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcyk7XHJcblx0XHRcdGcuZW5naW5lLnVubG9jaygpO1xyXG5cdFx0fTtcclxuXHRcdGlmICh0aGlzLmRpc3BsYXkpIHtcclxuXHRcdFx0dGhpcy5kaXNwbGF5LnNldENhbWVyYVRhcmdldCh0aGlzLmhlcm8pO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5kaXNjb3ZlckFyb3VuZEhlcm8oKTtcclxuXHRcdHJldHVybiB0aGlzLmhlcm87XHJcblx0fVxyXG5cclxuXHRjb25uZWN0U3RhaXJzKCkge1xyXG5cdFx0Y29uc3QgU1RBSVJfTElOSyA9ICdzdGFpckxpbmsnO1xyXG5cdFx0Y29uc3QgcHJvcFR5cGVzID0gdGhpcy5nZXREYXRhUHJvcEFycmF5KCk7XHJcblx0XHRjb25zdCBzdGFpcnNEb3duVHlwZXMgPSBwcm9wVHlwZXMuZmlsdGVyKChwcm9wVHlwZSkgPT4geyByZXR1cm4gQm9vbGVhbihwcm9wVHlwZVtTVEFJUl9MSU5LXSk7IH0pO1xyXG5cdFx0dGhpcy5sZXZlbHMuZm9yRWFjaCgobGV2ZWwsIGkpID0+IHtcclxuXHRcdFx0Ly8gSGFuZGxlIGVhY2ggdHlwZSBvZiBzdGFpcnNcclxuXHRcdFx0c3RhaXJzRG93blR5cGVzLmZvckVhY2goKHN0YWlyc0Rvd25UeXBlKSA9PiB7XHJcblx0XHRcdFx0Y29uc3Qgc3RhaXJEb3duVHlwZUtleSA9IHN0YWlyc0Rvd25UeXBlLmtleTtcclxuXHRcdFx0XHRjb25zdCBzdGFpclVwVHlwZUtleSA9IHN0YWlyc0Rvd25UeXBlW1NUQUlSX0xJTktdO1xyXG5cdFx0XHRcdGNvbnN0IGxldmVsU3RhaXJzRG93biA9IGxldmVsLnByb3BzLmZpbHRlcigocHJvcCkgPT4ge1xyXG5cdFx0XHRcdFx0cmV0dXJuIHByb3AudHlwZSA9PT0gc3RhaXJEb3duVHlwZUtleTtcclxuXHRcdFx0XHR9KTtcclxuXHRcdFx0XHRsZXZlbFN0YWlyc0Rvd24uZm9yRWFjaCgoc3RhaXIpID0+IHtcclxuXHRcdFx0XHRcdGNvbnN0IGxldmVsQmVsb3cgPSB0aGlzLmxldmVsc1tpICsgMV07XHJcblx0XHRcdFx0XHRpZiAoIWxldmVsQmVsb3cpIHsgcmV0dXJuOyB9XHJcblx0XHRcdFx0XHRjb25zdCBwb3NzaWJsZVN0YWlyc1VwID0gbGV2ZWxCZWxvdy5wcm9wcy5maWx0ZXIoKHByb3ApID0+IHtcclxuXHRcdFx0XHRcdFx0cmV0dXJuIHByb3AudHlwZSA9PT0gc3RhaXJVcFR5cGVLZXkgJiYgIUJvb2xlYW4ocHJvcC50ZWxlcG9ydCk7XHJcblx0XHRcdFx0XHR9KTtcclxuXHRcdFx0XHRcdC8vIFRPRE86IEZpbmQgc3RhaXJzIHRvIGNvbm5lY3QgdG8gYmFzZWQgb24gcHJveGltaXR5XHJcblx0XHRcdFx0XHRjb25zdCBsZXZlbEJlbG93U3RhaXJzVXAgPSBwb3NzaWJsZVN0YWlyc1VwWzBdOyAvLyBUT0RPOiByZW1vdmUgdGhpc1xyXG5cdFx0XHRcdFx0dGhpcy5jb25uZWN0VGVsZXBvcnRQcm9wcyhsZXZlbEJlbG93U3RhaXJzVXAsIHN0YWlyLCBpLCBpICsgMSwgJ2FzY2VuZCcsICdkZXNjZW5kJyk7XHJcblx0XHRcdFx0fSk7XHJcblx0XHRcdH0pO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHRjb25uZWN0VGVsZXBvcnRQcm9wcyhwcm9wMSwgcHJvcDIsIGxldmVsSW5kZXgxLCBsZXZlbEluZGV4MiwgdmVyYjEsIHZlcmIyKSB7XHJcblx0XHRpZiAoIXByb3AxIHx8ICFwcm9wMikgeyByZXR1cm47IH1cclxuXHRcdHByb3AxLnNldFRlbGVwb3J0KHtcclxuXHRcdFx0bGV2ZWxJbmRleDogbGV2ZWxJbmRleDEsIHg6IHByb3AyLngsIHk6IHByb3AyLnksIHZlcmI6IHZlcmIxXHJcblx0XHR9KTtcclxuXHRcdHByb3AyLnNldFRlbGVwb3J0KHtcclxuXHRcdFx0bGV2ZWxJbmRleDogbGV2ZWxJbmRleDIsIHg6IHByb3AxLngsIHk6IHByb3AxLnksIHZlcmI6IHZlcmIyXHJcblx0XHR9KTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBNb3ZlbWVudCwgQ29tYmF0XHJcblxyXG5cdG1vdmVBY3RvcihhY3RvciwgZGlyZWN0aW9uLCBidW1wQ29tYmF0ID0gZmFsc2UpIHtcclxuXHRcdGNvbnN0IGRpZmYgPSBST1QuRElSU1s4XVtkaXJlY3Rpb25dO1xyXG5cdFx0dmFyIG5ld1ggPSBhY3Rvci54ICsgZGlmZlswXTtcclxuXHRcdHZhciBuZXdZID0gYWN0b3IueSArIGRpZmZbMV07XHJcblx0XHRyZXR1cm4gdGhpcy5tb3ZlQWN0b3JUbyhhY3RvciwgbmV3WCwgbmV3WSwgYnVtcENvbWJhdCk7XHJcblx0fVxyXG5cclxuXHRtb3ZlQWN0b3JUbyhhY3RvciwgeCwgeSwgYnVtcENvbWJhdCA9IGZhbHNlKSB7XHJcblx0XHRjb25zdCBsZXZlbCA9IHRoaXMuZ2V0QWN0aXZlTGV2ZWwoKTtcclxuXHRcdGNvbnN0IGNhbk1vdmVUb0NlbGwgPSBsZXZlbC5nZXRDZWxsUGFzc2FiaWxpdHkoeCwgeSk7XHJcblx0XHQvLyBjb25zb2xlLmxvZygnY29uc2lkZXJpbmcgbW92aW5nIHRvJywgeCwgeSwgJy4uLiBmcmVlPycsIGNhbk1vdmVUb0NlbGwpO1xyXG5cdFx0aWYgKCFjYW5Nb3ZlVG9DZWxsKSB7XHJcblx0XHRcdGNvbnN0IGJsb2NrZXIgPSBsZXZlbC5maW5kQWN0b3IoeCwgeSk7XHJcblx0XHRcdGlmIChibG9ja2VyKSB7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMuYnVtcChhY3RvciwgYmxvY2tlciwgeCwgeSwgYnVtcENvbWJhdCk7XHJcblx0XHRcdH1cclxuXHRcdFx0cmV0dXJuIHsgeDogeCwgeTogeSwgbW92ZWQ6IGZhbHNlIH07XHJcblx0XHR9XHJcblx0XHRhY3Rvci5tb3ZlVG8oeCwgeSk7XHJcblx0XHQvLyBUT0RPOiBqdXN0IHJlZHJhdyB0aGUgc3BhY2UgdGhhdCB3YXMgdW5kZXIgdGhlIGFjdG9yIGFuZCB0aGUgYWN0b3IgaW4gdGhlIG5ldyBzcG90P1xyXG5cdFx0aWYgKGFjdG9yLmlzSGVybykge1xyXG5cdFx0XHR0aGlzLmRpc2NvdmVyQXJvdW5kSGVybygpO1xyXG5cdFx0XHR0aGlzLm5hcnJhdGVBcm91bmRIZXJvKCk7XHJcblx0XHR9XHJcblx0XHR0aGlzLmRyYXcoKTtcclxuXHRcdHJldHVybiB7IHgsIHksIG1vdmVkOiB0cnVlIH07XHJcblx0fVxyXG5cclxuXHRidW1wKGFjdG9yLCBibG9ja2VyLCB4LCB5LCBidW1wQ29tYmF0KSB7XHJcblx0XHRpZiAoYnVtcENvbWJhdCAmJiBhY3Rvci5mYWN0aW9uICE9PSBibG9ja2VyLmZhY3Rpb24pIHtcclxuXHRcdFx0dGhpcy5yZXNvbHZlQ29tYmF0KGFjdG9yLCBibG9ja2VyLCB4LCB5KTtcclxuXHRcdFx0cmV0dXJuIHsgeCwgeSwgbW92ZWQ6IGZhbHNlIH07XHJcblx0XHR9IGVsc2UgaWYgKEdhbWUuY2FuQnVtcFN3aXRjaChhY3RvciwgYmxvY2tlcikpIHtcclxuXHRcdFx0YWN0b3IubW92ZVRvKHgsIHkpO1xyXG5cdFx0XHRyZXR1cm4geyB4LCB5LCBtb3ZlZDogdHJ1ZSB9O1xyXG5cdFx0XHQvLyBUT0RPOiBhbGxvdyBwdXNoZXMgYmFzZWQgb24gYXV0aG9yaXR5XHJcblx0XHR9IGVsc2UgeyAvLyBqdXN0IGJsb2NrZWRcclxuXHRcdFx0cmV0dXJuIHsgeCwgeSwgbW92ZWQ6IGZhbHNlIH07XHJcblx0XHR9XHRcdFxyXG5cdH1cclxuXHJcblx0c3RhdGljIGNhbkJ1bXBTd2l0Y2goYWN0b3IsIGJsb2NrZXIpIHtcclxuXHRcdGlmIChhY3Rvci5hZ2dybyB8fCBibG9ja2VyLmFnZ3JvKSB7IC8vIFRPT0Q6IG1ha2UgdGhpcyBtb3JlIG51YW5jZWRcclxuXHRcdFx0cmV0dXJuIGZhbHNlO1xyXG5cdFx0fVxyXG5cdFx0Y29uc3QgYmxvY2tlcnNOZXh0QWN0aW9uID0gYmxvY2tlci5nZXROZXh0QWN0aW9uKCk7XHJcblx0XHRpZiAoIWJsb2NrZXJzTmV4dEFjdGlvbikgeyByZXR1cm4gdHJ1ZTsgfVxyXG5cdFx0cmV0dXJuIChcclxuXHRcdFx0YmxvY2tlcnNOZXh0QWN0aW9uLnZlcmIgPT09ICdtb3ZlJyAmJlxyXG5cdFx0XHRibG9ja2Vyc05leHRBY3Rpb24ueCA9PT0gYWN0b3IueCAmJlxyXG5cdFx0XHRibG9ja2Vyc05leHRBY3Rpb24ueSA9PT0gYWN0b3IueVxyXG5cdFx0KTtcclxuXHR9XHJcblxyXG5cdHRlbGVwb3J0QWN0b3IoYWN0b3IsIHRlbGVwb3J0UGFyYW1zID0ge30pIHtcclxuXHRcdGNvbnN0IG9yaWdpbmFsTGV2ZWxJbmRleCA9IHRoaXMuYWN0aXZlTGV2ZWxJbmRleDtcclxuXHRcdC8vIGNvbnNvbGUud2FybigndGVsZXBvcnRpbmcnLCBhY3RvciwgdGVsZXBvcnRQYXJhbXMpO1xyXG5cdFx0Y29uc3QgeyBsZXZlbEluZGV4LCB4LCB5IH0gPSB0ZWxlcG9ydFBhcmFtcztcclxuXHRcdGNvbnN0IGN1cnJlbnRMZXZlbCA9IHRoaXMuZ2V0QWN0aXZlTGV2ZWwoKTtcclxuXHRcdGN1cnJlbnRMZXZlbC5yZW1vdmVBY3RvcihhY3Rvcik7XHJcblx0XHR0aGlzLnNldEFjdGl2ZUxldmVsKGxldmVsSW5kZXgpO1xyXG5cdFx0Y29uc3QgbmV3TGV2ZWwgPSB0aGlzLmdldEFjdGl2ZUxldmVsKCk7XHJcblx0XHRuZXdMZXZlbC5hZGRBY3RvcihhY3Rvcik7XHJcblx0XHRhY3Rvci5zZXRDb29yZGluYXRlcyh4LCB5KTtcclxuXHRcdGNvbnNvbGUubG9nKCdOZXcgTGV2ZWw6JywgbmV3TGV2ZWwpO1xyXG5cdFx0aWYgKGFjdG9yLmlzSGVybykge1xyXG5cdFx0XHR0aGlzLmRpc2NvdmVyQXJvdW5kSGVybygpO1xyXG5cdFx0XHR0aGlzLm5hcnJhdGVBcm91bmRIZXJvKCk7XHJcblx0XHR9XHJcblx0XHRpZiAob3JpZ2luYWxMZXZlbEluZGV4ICE9PSBsZXZlbEluZGV4KSB7XHJcblx0XHRcdHRoaXMuaG9vaygnYWZ0ZXJUZWxlcG9ydExldmVsJywgeyBsZXZlbEluZGV4LCB4LCB5IH0pO1xyXG5cdFx0fVxyXG5cdFx0Ly8gdGhpcy5kcmF3KCk7XHJcblx0fVxyXG5cclxuXHRyZXNvbHZlQ29tYmF0KGFjdG9yLCBvcHBvbmVudCwgeCwgeSkge1xyXG5cdFx0Y29uc3QgbGV2ZWwgPSB0aGlzLmdldEFjdGl2ZUxldmVsKCk7XHJcblx0XHRpZiAoIWFjdG9yIHx8ICFvcHBvbmVudCB8fCBhY3Rvci5mYWN0aW9uID09PSBvcHBvbmVudC5mYWN0aW9uKSB7XHJcblx0XHRcdHJldHVybiBmYWxzZTtcclxuXHRcdH1cclxuXHRcdGNvbnN0IHsgb3V0Y29tZUF0dGFjayB9ID0gbGV2ZWwucmVzb2x2ZUNvbWJhdEVmZmVjdHMoYWN0b3IsIG9wcG9uZW50KTtcclxuXHRcdC8vIFRPRE86IGdldCBtZXNzYWdlcyBmcm9tIHJlc29sdmUgYW5kIGVmZmVjdHMgbWV0aG9kc1xyXG5cdFx0Zy5wcmludChgJHthY3Rvci5uYW1lfSBhdHRhY2tzICR7b3Bwb25lbnQubmFtZX0gYW5kIGRvZXMgJHtvdXRjb21lQXR0YWNrLmRhbWFnZX0gZGFtYWdlIWApO1xyXG5cdFx0aWYgKG9wcG9uZW50LmRlYWQoKSkge1xyXG5cdFx0XHRnLnByaW50KGAke29wcG9uZW50Lm5hbWV9IGhhcyBiZWVuIGtpbGxlZC5gKTtcclxuXHRcdFx0YWN0b3Iuc2NvcmUgKz0gKHRoaXMuYWN0aXZlTGV2ZWxJbmRleCArIDEpICogMTA7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhY3RvckFkZERlZmF1bHRBY3Rpb24oYWN0b3IpIHtcclxuXHRcdGNvbnN0IGxldmVsID0gdGhpcy5nZXRBY3RpdmVMZXZlbCgpO1xyXG5cdFx0Y29uc3QgdGhpbmcgPSBsZXZlbC5maW5kVGhpbmdTbWFydChhY3Rvci54LCBhY3Rvci55LCAncG9ydGFibGUnKTtcclxuXHRcdC8vIFRPRE86IE1heWJlIGdldCBtdWx0aXBsZSB0aGluZ3MgYW5kIGNoZWNrIGlmIHRoZXkgaGF2ZSBhY3Rpb25zP1xyXG5cdFx0Y29uc29sZS5sb2codGhpbmcsIGFjdG9yLngsIGFjdG9yLnkpO1xyXG5cdFx0aWYgKCF0aGluZykge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZiAodGhpbmcucG9ydGFibGUpIHtcclxuXHRcdFx0YWN0b3IucXVldWVBY3Rpb24oJ3BpY2t1cCcsIHsgdGFyZ2V0OiB0aGluZyB9KTtcclxuXHRcdH0gZWxzZSBpZiAodGhpbmcuaGFzQWN0aW9uKCd1c2UnKSkge1xyXG5cdFx0XHRhY3Rvci5xdWV1ZUFjdGlvbigndXNlJywgeyB0YXJnZXQ6IHRoaW5nIH0pO1xyXG5cdFx0fSBlbHNlIGlmICh0aGluZy5oYXNBY3Rpb24oJ2Rlc2NlbmQnKSB8fCB0aGluZy5oYXNBY3Rpb24oJ2FzY2VuZCcpKSB7XHJcblx0XHRcdGFjdG9yLnF1ZXVlQWN0aW9uKCd0ZWxlcG9ydCcsIHsgdGVsZXBvcnQ6IHRoaW5nLnRlbGVwb3J0IH0pO1xyXG5cdFx0XHRjb25zb2xlLmxvZygnUGxhbm5pbmcgdG8gdGVsZXBvcnQuLi4nLCBhY3Rvci5hY3Rpb25RdWV1ZSk7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRhZHZhbmNlKCkge1xyXG5cdFx0Y29uc3Qgc3RhcnRIcCA9IHRoaXMuaGVyby5ocDtcclxuXHRcdC8vIFRPRE86IGFkdmFuY2UgdGltZVxyXG5cdFx0Ly8gRG8gYWN0aW9ucyBmb3IgYWxsIGFjdG9yc1xyXG5cdFx0Y29uc3QgbGV2ZWwgPSB0aGlzLmdldEFjdGl2ZUxldmVsKCk7XHJcblx0XHRsZXZlbC5yZXNvbHZlUm91bmRFZmZlY3RzKCk7XHJcblx0XHRjb25zdCBhY3RvcnMgPSBsZXZlbC5nZXRBY3RvcnNJbml0aWF0aXZlT3JkZXJlZCgpO1xyXG5cdFx0bGV2ZWwuY29vbE9mZkluaXRpYXRpdmVCb29zdHMoKTtcclxuXHRcdGFjdG9ycy5mb3JFYWNoKChhY3RvcikgPT4ge1xyXG5cdFx0XHRhY3Rvci5wbGFuQWN0aW9uKGxldmVsLCB0aGlzLmhlcm8pO1xyXG5cdFx0XHR0aGlzLmFkdmFuY2VBY3RvcihhY3Rvcik7XHJcblx0XHR9KTtcclxuXHRcdC8vIHRoaXMuYWR2YW5jZUFjdG9yKHRoaXMuaGVybyk7XHJcblx0XHRjb25zdCBpc0RhbWFnZWQgPSAoc3RhcnRIcCA+IHRoaXMuaGVyby5ocCk7XHJcblx0XHR0aGlzLmRpc3BsYXkuZHJhd0RhbWFnZShpc0RhbWFnZWQpO1xyXG5cdFx0aWYgKHRoaXMuaGVyby5kZWFkKCkpIHtcclxuXHRcdFx0dGhpcy5wcmludCgnUi5JLlAuIENvbmdyYXR1bGF0aW9ucyEgWU9VIEhBVkUgRElFRCEnLCAncGxvdCcpO1xyXG5cdFx0XHR0aGlzLnByaW50KCdSZWxvYWQgdGhlIHBhZ2UgdG8gcGxheSBhZ2Fpbi4nLCAndGlwJyk7XHJcblx0XHR9XHJcblx0XHR0aGlzLmRyYXcoKTtcclxuXHR9XHJcblxyXG5cdGFkdmFuY2VBY3RvcihhY3Rvcikge1xyXG5cdFx0Y29uc3QgbGV2ZWwgPSB0aGlzLmdldEFjdGl2ZUxldmVsKCk7XHJcblx0XHRjb25zdCBhY3Rpb24gPSBhY3Rvci5kb0FjdGlvbigpO1xyXG5cdFx0aWYgKCFhY3Rpb24pIHsgcmV0dXJuOyB9XHJcblx0XHRjb25zdCB7IHZlcmIsIHRhcmdldCwgd2hhdCwgeCwgeSB9ID0gYWN0aW9uO1xyXG5cdFx0aWYgKGFjdG9yLmlzSGVybykge1xyXG5cdFx0XHRpZiAodmVyYiA9PT0gJ21vdmUnKSB7IGNvbnNvbGUubG9nKGFjdG9yLm5hbWUgKyAnICcgKyB2ZXJiKTsgfVxyXG5cdFx0XHRlbHNlIHsgY29uc29sZS5sb2coYWN0b3IubmFtZSwgdmVyYiwgYWN0aW9uKTsgfVxyXG5cdFx0fVxyXG5cdFx0bGV0IG1lc3NhZ2UgPSAnJztcclxuXHRcdHN3aXRjaCAodmVyYikge1xyXG5cdFx0XHRjYXNlICdtb3ZlJzpcclxuXHRcdFx0XHRjb25zdCBidW1wQ29tYmF0ID0gKGFjdG9yLmlzSGVybyB8fCBhY3Rvci5hZ2dybyA+IDApO1xyXG5cdFx0XHRcdGlmIChhY3Rpb24uZGlyZWN0aW9uID09PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZUFjdG9yVG8oYWN0b3IsIGFjdGlvbi54LCBhY3Rpb24ueSwgYnVtcENvbWJhdCk7XHJcblx0XHRcdFx0fSBlbHNlIHtcclxuXHRcdFx0XHRcdHRoaXMubW92ZUFjdG9yKGFjdG9yLCBhY3Rpb24uZGlyZWN0aW9uLCBidW1wQ29tYmF0KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICd1c2UnOlxyXG5cdFx0XHRcdGNvbnN0IG91dGNvbWUgPSBsZXZlbC51c2VUaGluZyhhY3RvciwgJ3VzZScsIHRhcmdldCk7XHJcblx0XHRcdFx0bWVzc2FnZSA9IG91dGNvbWUubWVzc2FnZTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ29wZW4nOlxyXG5cdFx0XHRcdG1lc3NhZ2UgPSBsZXZlbC51c2VUaGluZyhhY3RvciwgJ29wZW4nLCB0YXJnZXQpO1xyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAndGVsZXBvcnQnOlxyXG5cdFx0XHRcdG1lc3NhZ2UgPSBgJHthY3Rvci5uYW1lfSB0cmF2ZWxzIHRvIGEgbmV3IGxvY2F0aW9uOiBgO1xyXG5cdFx0XHRcdHRoaXMudGVsZXBvcnRBY3RvcihhY3RvciwgYWN0aW9uLnRlbGVwb3J0KTtcclxuXHRcdFx0XHR7XHJcblx0XHRcdFx0XHRjb25zdCBuZXdMZXZlbCA9IHRoaXMuZ2V0QWN0aXZlTGV2ZWwoKTtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgKz0gbmV3TGV2ZWwubmFtZTtcclxuXHRcdFx0XHRcdGlmIChuZXdMZXZlbC5kZXNjcmlwdGlvbikge1xyXG5cdFx0XHRcdFx0XHRtZXNzYWdlICs9ICcgLSAnICsgbmV3TGV2ZWwuZGVzY3JpcHRpb247XHJcblx0XHRcdFx0XHR9XHJcblx0XHRcdFx0fVxyXG5cdFx0XHRicmVhaztcclxuXHRcdFx0Y2FzZSAncGlja3VwJzpcclxuXHRcdFx0XHRjb25zdCBwaWNrZWRVcCA9IHRoaXMucGlja3VwSXRlbShhY3RvciwgdGFyZ2V0KTtcclxuXHRcdFx0XHRpZiAocGlja2VkVXApIHtcclxuXHRcdFx0XHRcdG1lc3NhZ2UgPSBgJHthY3Rvci5uYW1lfSBwaWNrcyB1cCB0aGUgJHt0YXJnZXQubmFtZX0uYDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0XHRjYXNlICd0aHJvdyc6XHJcblx0XHRcdFx0bWVzc2FnZSA9IGxldmVsLnRocm93KGFjdG9yLCB3aGF0LCB4LCB5KTtcclxuXHRcdFx0YnJlYWs7XHJcblx0XHRcdGNhc2UgJ3dhaXQnOlxyXG5cdFx0XHRcdGFjdG9yLndhaXQoKTtcclxuXHRcdFx0XHRpZiAoYWN0b3IuaXNIZXJvKSB7XHJcblx0XHRcdFx0XHRtZXNzYWdlID0gYCR7YWN0b3IubmFtZX0gd2FpdHMgKHJhbmRvbSByZWNvdmVyeSBvZiBBUCwgQlAsIG9yIEVQIHBvaW50cykuYDtcclxuXHRcdFx0XHR9XHJcblx0XHRcdGJyZWFrO1xyXG5cdFx0fVxyXG5cdFx0XHJcblx0XHR0aGlzLnByaW50KG1lc3NhZ2UpO1xyXG5cdH1cclxuXHJcblx0cGlja3VwSXRlbShhY3RvciwgdGhpbmcpIHtcclxuXHRcdGlmICghdGhpbmcucG9ydGFibGUpIHsgcmV0dXJuIGZhbHNlOyB9XHJcblx0XHRjb25zdCBsZXZlbCA9IHRoaXMuZ2V0QWN0aXZlTGV2ZWwoKTtcclxuXHRcdGNvbnN0IGl0ZW0gPSBsZXZlbC5yZW1vdmVJdGVtKHRoaW5nKTtcclxuXHRcdGlmICghaXRlbSkgeyByZXR1cm4gZmFsc2U7IH1cclxuXHRcdGNvbnN0IGFkZGVkID0gYWN0b3IuaW52ZW50b3J5LmFkZCh0aGluZyk7XHJcblx0XHRpZiAoIWFkZGVkKSB7XHJcblx0XHRcdGxldmVsLmFkZEl0ZW0oaXRlbSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gYWRkZWQ7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0gRXhwbG9yYXRpb25cclxuXHJcblx0ZGlzY292ZXJBcm91bmRIZXJvKCkge1xyXG5cdFx0Y29uc3QgbGV2ZWwgPSB0aGlzLmdldEFjdGl2ZUxldmVsKCk7XHJcblx0XHRjb25zdCBpbGx1bWluYXRpb24gPSB0aGlzLmhlcm8uaW52ZW50b3J5Lml0ZW1zLnJlZHVjZSgobiwgaXRlbSkgPT4ge1xyXG5cdFx0XHRyZXR1cm4gbiArIGl0ZW0uaWxsdW1pbmF0aW9uO1xyXG5cdFx0fSwgMCk7XHJcblx0XHRsZXZlbC5kaXNjb3ZlckNpcmNsZSh0aGlzLmhlcm8ueCwgdGhpcy5oZXJvLnksIHRoaXMuaGVyby5zaWdodFJhbmdlICsgaWxsdW1pbmF0aW9uKTsgLy8gVE9ETzogYWxsb3cgZGlmZmVyZW50IFBPVlxyXG5cdFx0bGV2ZWwuc2V0RXllKHRoaXMuaGVybyk7XHJcblx0fVxyXG5cclxuXHRuYXJyYXRlQXJvdW5kSGVybygpIHtcclxuXHRcdGNvbnN0IGFsbFRoaW5nc09uSGVybyA9IHRoaXMuZ2V0VGhpbmdzT25BY3Rvcih0aGlzLmhlcm8pO1xyXG5cdFx0aWYgKGFsbFRoaW5nc09uSGVyby5sZW5ndGggPT09IDApIHsgcmV0dXJuOyB9XHJcblx0XHRjb25zdCBuYW1lc09uSGVybyA9IGFsbFRoaW5nc09uSGVyby5tYXAoKHRoaW5nKSA9PiB0aGluZy5uYW1lKTtcclxuXHRcdGNvbnN0IG5hbWVzU3RyaW5nID0gKG5hbWVzT25IZXJvLmxlbmd0aCA+IDEpID8gbmFtZXNPbkhlcm8uam9pbignLCAnKSA6ICdhICcgKyBuYW1lc09uSGVyb1swXTtcclxuXHRcdHRoaXMuY29uc29sZS5wcmludChgWW91IGFyZSBvbiAke25hbWVzU3RyaW5nfS5gKTtcclxuXHR9XHJcblxyXG5cdC8vLS0tLSBTeXN0ZW1cclxuXHJcblx0cmVhZHkoY2FsbGJhY2ssIGZvbnRzID0gW10pIHtcclxuXHRcdHJlYWR5KCgpID0+IHtcclxuXHRcdFx0aWYgKHRoaXMubG9hZGluZ1Byb21pc2UgaW5zdGFuY2VvZiBQcm9taXNlKSB7XHJcblx0XHRcdFx0dGhpcy5sb2FkaW5nUHJvbWlzZVxyXG5cdFx0XHRcdFx0LnRoZW4oKCkgPT4geyBjYWxsYmFjaygpOyB9KVxyXG5cdFx0XHRcdFx0LmNhdGNoKChlcnIpID0+IHsgY29uc29sZS5lcnJvcignRXJyb3IgbG9hZGluZyBzb21ldGhpbmcnLCBlcnIpIH0pO1xyXG5cdFx0XHR9IGVsc2Uge1xyXG5cdFx0XHRcdGNhbGxiYWNrKCk7XHJcblx0XHRcdH1cclxuXHRcdH0sIGZvbnRzKTtcclxuXHRcdC8vIFRPRE86IHJldHVybiBhIHByb21pc2Ugc28gY2FuIGJlIHVzZWQgYXN5bmNcclxuXHR9XHJcblxyXG5cdHN0YXJ0KCkge1xyXG5cdFx0dGhpcy5zZXR1cEVuZ2luZSgpO1xyXG5cdFx0dGhpcy5zZXR1cEtleWJvYXJkKCk7XHJcblx0XHR0aGlzLnNldHVwTXVzaWMoKTtcclxuXHRcdHRoaXMuc2V0U3RhdGVEZXRlY3QoU1BMQVNIX1NUQVRFKTtcclxuXHRcdC8vIHRoaXMuc2V0U3RhdGUoTUFJTl9HQU1FX1NUQVRFKTtcclxuXHRcdC8vIFRPRE86IHN0YXJ0IGdyYXBoaWNzIGxvb3BcclxuXHRcdHRoaXMuZHJhdygpO1xyXG5cdH1cclxuXHJcblx0c3RvcCgpIHtcclxuXHRcdHRoaXMuc2V0U3RhdGUoJ09GRicpO1xyXG5cdFx0dGhpcy5yZW1vdmVLZXlib2FyZCgpO1xyXG5cdFx0Ly8gVE9ETzogc3RvcCBncmFwaGljcyBsb29wXHJcblx0fVxyXG5cclxuXHRsb2FkRGF0YShkYXRhKSB7XHJcblx0XHRjb25zdCBwcm9taXNlcyA9IFtdO1xyXG5cdFx0ZnVuY3Rpb24gcGFyc2VKc29uKHJlc3BvbnNlKSB7IHJldHVybiByZXNwb25zZS5qc29uKCk7IH1cclxuXHRcdGZ1bmN0aW9uIGZpeElubmVyT2JqZWN0KG9iaiwga2V5KSB7XHJcblx0XHRcdHJldHVybiAodHlwZW9mIG9ialtrZXldID09PSAnb2JqZWN0JykgPyBvYmpba2V5XSA6IG9iajtcclxuXHRcdH1cclxuXHRcdGZvciAobGV0IGtleSBpbiBkYXRhKSB7XHJcblx0XHRcdGNvbnN0IHAgPSBmZXRjaChkYXRhW2tleV0pXHJcblx0XHRcdFx0LnRoZW4ocGFyc2VKc29uKVxyXG5cdFx0XHRcdC50aGVuKChvYmopID0+IGZpeElubmVyT2JqZWN0KG9iaiwga2V5KSlcclxuXHRcdFx0XHQudGhlbigob2JqKSA9PiB7IHRoaXMuc2V0RGF0YShrZXksIG9iaik7IH0pO1xyXG5cdFx0XHRwcm9taXNlcy5wdXNoKHApO1xyXG5cdFx0fVxyXG5cdFx0dGhpcy5sb2FkaW5nUHJvbWlzZSA9IFByb21pc2UuYWxsKHByb21pc2VzKTsgLy8gLnRoZW4oKHJlc3ApID0+IHsgY29uc29sZS5sb2cocmVzcCk7IH0pO1xyXG5cdFx0cmV0dXJuIHRoaXMubG9hZGluZ1Byb21pc2U7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0gSG9va3NcclxuXHJcblx0YWRkSG9vayhob29rTmFtZSwgZm4pIHtcclxuXHRcdGlmICghdGhpcy5ob29rc1tob29rTmFtZV0pIHtcclxuXHRcdFx0dGhpcy5ob29rc1tob29rTmFtZV0gPSBbXTtcclxuXHRcdH1cclxuXHRcdHRoaXMuaG9va3NbaG9va05hbWVdLnB1c2goZm4pO1xyXG5cdH1cclxuXHJcblx0cmVtb3ZlSG9vayhob29rTmFtZSwgZm4pIHtcclxuXHRcdGlmICghdGhpcy5ob29rc1tob29rTmFtZV0pIHsgcmV0dXJuOyB9XHJcblx0XHRjb25zdCBpID0gdGhpcy5ob29rc1tob29rTmFtZV0uaW5kZXhPZihmbik7XHJcblx0XHR0aGlzLmhvb2tzW2hvb2tOYW1lXS5zcGxpY2UoaSwgMSk7XHJcblx0fVxyXG5cclxuXHRob29rKGhvb2tOYW1lLCBkYXRhID0ge30pIHtcclxuXHRcdGNvbnN0IGhvb2sgPSB0aGlzLmhvb2tzW2hvb2tOYW1lXTtcclxuXHRcdGlmICghaG9vaykgeyByZXR1cm47IH1cclxuXHRcdGhvb2suZm9yRWFjaCgoZm4pID0+IHtcclxuXHRcdFx0Zm4oZGF0YSwgdGhpcywgaG9va05hbWUpO1xyXG5cdFx0fSk7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0gR2V0c1xyXG5cclxuXHRnZXRBY3RpdmVMZXZlbCgpIHtcclxuXHRcdHJldHVybiB0aGlzLmxldmVsc1t0aGlzLmFjdGl2ZUxldmVsSW5kZXhdO1xyXG5cdH1cclxuXHJcblx0Z2V0TGV2ZWxUeXBlKGtleSkge1xyXG5cdFx0Y29uc3QgbHQgPSB0aGlzLmRhdGEubGV2ZWxzW2tleV07XHJcblx0XHRpZiAodHlwZW9mIGx0ICE9PSAnb2JqZWN0JyB8fCBsdCA9PT0gbnVsbCkge1xyXG5cdFx0XHRjb25zb2xlLmVycm9yKCdDYW5ub3QgZmluZCBsZXZlbCB0eXBlICcsIGtleSk7XHJcblx0XHR9XHJcblx0XHRyZXR1cm4gbHQ7XHJcblx0fVxyXG5cclxuXHRnZXREYXRhUHJvcEFycmF5KCkge1xyXG5cdFx0Y29uc3QgcHJvcEtleXMgPSBPYmplY3Qua2V5cyh0aGlzLmRhdGEucHJvcHMpO1xyXG5cdFx0Y29uc3QgYXJyID0gW107XHJcblx0XHRwcm9wS2V5cy5mb3JFYWNoKChrZXkpID0+IHtcclxuXHRcdFx0Y29uc3QgcHJvcCA9IHsgLi4udGhpcy5kYXRhLnByb3BzW2tleV0sIGtleSB9O1xyXG5cdFx0XHRhcnIucHVzaChwcm9wKTtcclxuXHRcdH0pO1xyXG5cdFx0cmV0dXJuIGFycjtcclxuXHR9XHJcblxyXG5cdGdldFRoaW5nc09uQWN0b3IoYWN0b3IpIHtcclxuXHRcdGNvbnN0IHsgeCwgeSB9ID0gYWN0b3I7XHJcblx0XHRyZXR1cm4gdGhpcy5nZXRBY3RpdmVMZXZlbCgpLmZpbmRUaGluZ3MoeCwgeSk7XHJcblx0fVxyXG5cclxuXHQvLy0tLS0gU2V0c1xyXG5cclxuXHRzZXRBY3RpdmVMZXZlbChpKSB7XHJcblx0XHR0aGlzLmFjdGl2ZUxldmVsSW5kZXggPSBpO1xyXG5cdFx0cmV0dXJuO1xyXG5cdH1cclxuXHJcblx0c2V0RGF0YShrZXksIG9iaikge1xyXG5cdFx0dGhpcy5kYXRhW2tleV0gPSBPYmplY3QuZnJlZXplKG9iaik7XHJcblx0fVxyXG5cclxuXHRzZXRTdGF0ZURldGVjdChzdGF0ZUZhbGxiYWNrKSB7XHJcblx0XHQvLyBUT0RPOiBpbXByb3ZlLi4uIG5vdCBzdXJlIGkgbGlrZSBob3cgdGhpcyB3b3Jrc1xyXG5cdFx0Ly8gY29uc3QgaGFzaCA9IGxvY2F0aW9uLmhhc2guc3Vic3RyaW5nKDEpLnRvVXBwZXJDYXNlKCk7XHJcblx0XHQvLyBpZiAodGhpcy5zdGF0ZXMuaW5jbHVkZXMoaGFzaCkpIHtcclxuXHRcdC8vIFx0cmV0dXJuIHRoaXMuc2V0U3RhdGUoaGFzaCk7XHJcblx0XHQvLyB9XHJcblx0XHRyZXR1cm4gdGhpcy5zZXRTdGF0ZShzdGF0ZUZhbGxiYWNrKTtcclxuXHR9XHJcblxyXG5cdHNldFN0YXRlKHN0YXRlKSB7XHJcblx0XHRjb25zb2xlLmxvZygnU2V0dGluZyBzdGF0ZTonLCBzdGF0ZSk7XHJcblx0XHRjb25zdCBwcmVmaXggPSAncm90ZS1zdGF0ZS0nO1xyXG5cdFx0dGhpcy5zdGF0ZSA9IHN0YXRlO1xyXG5cdFx0Ly8gY29uc3QgYm9keSA9IGRvY3VtZW50LmdldEVsZW1lbnRzQnlDbGFzc05hbWUoJ3JvdGUtc3RhdGUnKVswXTtcclxuXHRcdGNvbnN0IGJvZHkgPSBkb2N1bWVudC5nZXRFbGVtZW50c0J5VGFnTmFtZSgnYm9keScpWzBdO1xyXG5cdFx0Ly8gYm9keS5jbGFzc05hbWUgPSAncm90ZS1zdGF0ZSc7IC8vIFRPRE86IG1ha2UgdGhpcyBzbWFydGVyIHNvIGl0IG9ubHkgcmVtb3ZlcyByb3RlIHN0YXRlc1xyXG5cdFx0Ly8gYm9keS5jbGFzc0xpc3QuYWRkKHByZWZpeCArIHRoaXMuc3RhdGUudG9Mb3dlckNhc2UoKSk7XHJcblx0XHRib2R5LmNsYXNzTmFtZSA9ICdyb3RlLXN0YXRlICcgKyBwcmVmaXggKyBzdGF0ZS50b0xvd2VyQ2FzZSgpO1xyXG5cdFx0bG9jYXRpb24uaGFzaCA9IHN0YXRlLnRvTG93ZXJDYXNlKCk7XHJcblx0XHR0aGlzLmtleWJvYXJkLnNldFN0YXRlKHN0YXRlKTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gR2FtZTtcclxuIiwiLyogRm9udCBGYWNlIE9ic2VydmVyIHYyLjEuMCAtIMKpIEJyYW0gU3RlaW4uIExpY2Vuc2U6IEJTRC0zLUNsYXVzZSAqLyhmdW5jdGlvbigpe2Z1bmN0aW9uIGwoYSxiKXtkb2N1bWVudC5hZGRFdmVudExpc3RlbmVyP2EuYWRkRXZlbnRMaXN0ZW5lcihcInNjcm9sbFwiLGIsITEpOmEuYXR0YWNoRXZlbnQoXCJzY3JvbGxcIixiKX1mdW5jdGlvbiBtKGEpe2RvY3VtZW50LmJvZHk/YSgpOmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXI/ZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixmdW5jdGlvbiBjKCl7ZG9jdW1lbnQucmVtb3ZlRXZlbnRMaXN0ZW5lcihcIkRPTUNvbnRlbnRMb2FkZWRcIixjKTthKCl9KTpkb2N1bWVudC5hdHRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGZ1bmN0aW9uIGsoKXtpZihcImludGVyYWN0aXZlXCI9PWRvY3VtZW50LnJlYWR5U3RhdGV8fFwiY29tcGxldGVcIj09ZG9jdW1lbnQucmVhZHlTdGF0ZSlkb2N1bWVudC5kZXRhY2hFdmVudChcIm9ucmVhZHlzdGF0ZWNoYW5nZVwiLGspLGEoKX0pfTtmdW5jdGlvbiB0KGEpe3RoaXMuYT1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpO3RoaXMuYS5zZXRBdHRyaWJ1dGUoXCJhcmlhLWhpZGRlblwiLFwidHJ1ZVwiKTt0aGlzLmEuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoYSkpO3RoaXMuYj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmM9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInNwYW5cIik7dGhpcy5oPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzcGFuXCIpO3RoaXMuZj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3BhblwiKTt0aGlzLmc9LTE7dGhpcy5iLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmMuc3R5bGUuY3NzVGV4dD1cIm1heC13aWR0aDpub25lO2Rpc3BsYXk6aW5saW5lLWJsb2NrO3Bvc2l0aW9uOmFic29sdXRlO2hlaWdodDoxMDAlO3dpZHRoOjEwMCU7b3ZlcmZsb3c6c2Nyb2xsO2ZvbnQtc2l6ZToxNnB4O1wiO1xudGhpcy5mLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTtkaXNwbGF5OmlubGluZS1ibG9jaztwb3NpdGlvbjphYnNvbHV0ZTtoZWlnaHQ6MTAwJTt3aWR0aDoxMDAlO292ZXJmbG93OnNjcm9sbDtmb250LXNpemU6MTZweDtcIjt0aGlzLmguc3R5bGUuY3NzVGV4dD1cImRpc3BsYXk6aW5saW5lLWJsb2NrO3dpZHRoOjIwMCU7aGVpZ2h0OjIwMCU7Zm9udC1zaXplOjE2cHg7bWF4LXdpZHRoOm5vbmU7XCI7dGhpcy5iLmFwcGVuZENoaWxkKHRoaXMuaCk7dGhpcy5jLmFwcGVuZENoaWxkKHRoaXMuZik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYik7dGhpcy5hLmFwcGVuZENoaWxkKHRoaXMuYyl9XG5mdW5jdGlvbiB1KGEsYil7YS5hLnN0eWxlLmNzc1RleHQ9XCJtYXgtd2lkdGg6bm9uZTttaW4td2lkdGg6MjBweDttaW4taGVpZ2h0OjIwcHg7ZGlzcGxheTppbmxpbmUtYmxvY2s7b3ZlcmZsb3c6aGlkZGVuO3Bvc2l0aW9uOmFic29sdXRlO3dpZHRoOmF1dG87bWFyZ2luOjA7cGFkZGluZzowO3RvcDotOTk5cHg7d2hpdGUtc3BhY2U6bm93cmFwO2ZvbnQtc3ludGhlc2lzOm5vbmU7Zm9udDpcIitiK1wiO1wifWZ1bmN0aW9uIHooYSl7dmFyIGI9YS5hLm9mZnNldFdpZHRoLGM9YisxMDA7YS5mLnN0eWxlLndpZHRoPWMrXCJweFwiO2EuYy5zY3JvbGxMZWZ0PWM7YS5iLnNjcm9sbExlZnQ9YS5iLnNjcm9sbFdpZHRoKzEwMDtyZXR1cm4gYS5nIT09Yj8oYS5nPWIsITApOiExfWZ1bmN0aW9uIEEoYSxiKXtmdW5jdGlvbiBjKCl7dmFyIGE9azt6KGEpJiZhLmEucGFyZW50Tm9kZSYmYihhLmcpfXZhciBrPWE7bChhLmIsYyk7bChhLmMsYyk7eihhKX07ZnVuY3Rpb24gQihhLGIpe3ZhciBjPWJ8fHt9O3RoaXMuZmFtaWx5PWE7dGhpcy5zdHlsZT1jLnN0eWxlfHxcIm5vcm1hbFwiO3RoaXMud2VpZ2h0PWMud2VpZ2h0fHxcIm5vcm1hbFwiO3RoaXMuc3RyZXRjaD1jLnN0cmV0Y2h8fFwibm9ybWFsXCJ9dmFyIEM9bnVsbCxEPW51bGwsRT1udWxsLEY9bnVsbDtmdW5jdGlvbiBHKCl7aWYobnVsbD09PUQpaWYoSigpJiYvQXBwbGUvLnRlc3Qod2luZG93Lm5hdmlnYXRvci52ZW5kb3IpKXt2YXIgYT0vQXBwbGVXZWJLaXRcXC8oWzAtOV0rKSg/OlxcLihbMC05XSspKSg/OlxcLihbMC05XSspKS8uZXhlYyh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudCk7RD0hIWEmJjYwMz5wYXJzZUludChhWzFdLDEwKX1lbHNlIEQ9ITE7cmV0dXJuIER9ZnVuY3Rpb24gSigpe251bGw9PT1GJiYoRj0hIWRvY3VtZW50LmZvbnRzKTtyZXR1cm4gRn1cbmZ1bmN0aW9uIEsoKXtpZihudWxsPT09RSl7dmFyIGE9ZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKTt0cnl7YS5zdHlsZS5mb250PVwiY29uZGVuc2VkIDEwMHB4IHNhbnMtc2VyaWZcIn1jYXRjaChiKXt9RT1cIlwiIT09YS5zdHlsZS5mb250fXJldHVybiBFfWZ1bmN0aW9uIEwoYSxiKXtyZXR1cm5bYS5zdHlsZSxhLndlaWdodCxLKCk/YS5zdHJldGNoOlwiXCIsXCIxMDBweFwiLGJdLmpvaW4oXCIgXCIpfVxuQi5wcm90b3R5cGUubG9hZD1mdW5jdGlvbihhLGIpe3ZhciBjPXRoaXMsaz1hfHxcIkJFU2Jzd3lcIixyPTAsbj1ifHwzRTMsSD0obmV3IERhdGUpLmdldFRpbWUoKTtyZXR1cm4gbmV3IFByb21pc2UoZnVuY3Rpb24oYSxiKXtpZihKKCkmJiFHKCkpe3ZhciBNPW5ldyBQcm9taXNlKGZ1bmN0aW9uKGEsYil7ZnVuY3Rpb24gZSgpeyhuZXcgRGF0ZSkuZ2V0VGltZSgpLUg+PW4/YihFcnJvcihcIlwiK24rXCJtcyB0aW1lb3V0IGV4Y2VlZGVkXCIpKTpkb2N1bWVudC5mb250cy5sb2FkKEwoYywnXCInK2MuZmFtaWx5KydcIicpLGspLnRoZW4oZnVuY3Rpb24oYyl7MTw9Yy5sZW5ndGg/YSgpOnNldFRpbWVvdXQoZSwyNSl9LGIpfWUoKX0pLE49bmV3IFByb21pc2UoZnVuY3Rpb24oYSxjKXtyPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtjKEVycm9yKFwiXCIrbitcIm1zIHRpbWVvdXQgZXhjZWVkZWRcIikpfSxuKX0pO1Byb21pc2UucmFjZShbTixNXSkudGhlbihmdW5jdGlvbigpe2NsZWFyVGltZW91dChyKTthKGMpfSxcbmIpfWVsc2UgbShmdW5jdGlvbigpe2Z1bmN0aW9uIHYoKXt2YXIgYjtpZihiPS0xIT1mJiYtMSE9Z3x8LTEhPWYmJi0xIT1ofHwtMSE9ZyYmLTEhPWgpKGI9ZiE9ZyYmZiE9aCYmZyE9aCl8fChudWxsPT09QyYmKGI9L0FwcGxlV2ViS2l0XFwvKFswLTldKykoPzpcXC4oWzAtOV0rKSkvLmV4ZWMod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpLEM9ISFiJiYoNTM2PnBhcnNlSW50KGJbMV0sMTApfHw1MzY9PT1wYXJzZUludChiWzFdLDEwKSYmMTE+PXBhcnNlSW50KGJbMl0sMTApKSksYj1DJiYoZj09dyYmZz09dyYmaD09d3x8Zj09eCYmZz09eCYmaD09eHx8Zj09eSYmZz09eSYmaD09eSkpLGI9IWI7YiYmKGQucGFyZW50Tm9kZSYmZC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGQpLGNsZWFyVGltZW91dChyKSxhKGMpKX1mdW5jdGlvbiBJKCl7aWYoKG5ldyBEYXRlKS5nZXRUaW1lKCktSD49bilkLnBhcmVudE5vZGUmJmQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChkKSxiKEVycm9yKFwiXCIrXG5uK1wibXMgdGltZW91dCBleGNlZWRlZFwiKSk7ZWxzZXt2YXIgYT1kb2N1bWVudC5oaWRkZW47aWYoITA9PT1hfHx2b2lkIDA9PT1hKWY9ZS5hLm9mZnNldFdpZHRoLGc9cC5hLm9mZnNldFdpZHRoLGg9cS5hLm9mZnNldFdpZHRoLHYoKTtyPXNldFRpbWVvdXQoSSw1MCl9fXZhciBlPW5ldyB0KGspLHA9bmV3IHQoaykscT1uZXcgdChrKSxmPS0xLGc9LTEsaD0tMSx3PS0xLHg9LTEseT0tMSxkPWRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJkaXZcIik7ZC5kaXI9XCJsdHJcIjt1KGUsTChjLFwic2Fucy1zZXJpZlwiKSk7dShwLEwoYyxcInNlcmlmXCIpKTt1KHEsTChjLFwibW9ub3NwYWNlXCIpKTtkLmFwcGVuZENoaWxkKGUuYSk7ZC5hcHBlbmRDaGlsZChwLmEpO2QuYXBwZW5kQ2hpbGQocS5hKTtkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGQpO3c9ZS5hLm9mZnNldFdpZHRoO3g9cC5hLm9mZnNldFdpZHRoO3k9cS5hLm9mZnNldFdpZHRoO0koKTtBKGUsZnVuY3Rpb24oYSl7Zj1hO3YoKX0pO3UoZSxcbkwoYywnXCInK2MuZmFtaWx5KydcIixzYW5zLXNlcmlmJykpO0EocCxmdW5jdGlvbihhKXtnPWE7digpfSk7dShwLEwoYywnXCInK2MuZmFtaWx5KydcIixzZXJpZicpKTtBKHEsZnVuY3Rpb24oYSl7aD1hO3YoKX0pO3UocSxMKGMsJ1wiJytjLmZhbWlseSsnXCIsbW9ub3NwYWNlJykpfSl9KX07XCJvYmplY3RcIj09PXR5cGVvZiBtb2R1bGU/bW9kdWxlLmV4cG9ydHM9Qjood2luZG93LkZvbnRGYWNlT2JzZXJ2ZXI9Qix3aW5kb3cuRm9udEZhY2VPYnNlcnZlci5wcm90b3R5cGUubG9hZD1CLnByb3RvdHlwZS5sb2FkKTt9KCkpO1xuIiwiY2xhc3MgQ2VsbCB7XHJcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XHJcblx0XHR0aGlzLmNoYXJhY3RlciA9IG9wdGlvbnMuY2hhcmFjdGVyIHx8ICcgJztcclxuXHRcdHRoaXMuZGlzY292ZXJlZCA9IGZhbHNlO1xyXG5cdFx0dGhpcy5jb2xvciA9IG9wdGlvbnMuY29sb3IgfHwgJyM3NzcnO1xyXG5cdFx0dGhpcy5iYWNrZ3JvdW5kID0gb3B0aW9ucy5iYWNrZ3JvdW5kIHx8ICcjMjIyJztcclxuXHRcdHRoaXMucGFzc2FiaWxpdHkgPSBmYWxzZTsgLy8gVE9ETzogaGFuZGxlIHRoaXMgZGlmZmVyZW50P1xyXG5cdH1cclxuXHJcblx0Ly8gR2V0c1xyXG5cclxuXHRnZXRQYXNzYWJpbGl0eSgpIHsgLy8gVE9ETzogdXBkYXRlIHRoaXNcclxuXHRcdHJldHVybiAodGhpcy5jaGFyYWN0ZXIgPT09ICcuJyk7XHJcblx0fVxyXG5cclxuXHRnZXRDaGFyYWN0ZXIoKSB7XHJcblx0XHRyZXR1cm4gdGhpcy5jaGFyYWN0ZXI7XHJcblx0fVxyXG5cclxuXHRnZXRGb3JlZ3JvdW5kQ29sb3IoaW5WaWV3ID0gdHJ1ZSkge1xyXG5cdFx0aWYgKCF0aGlzLmRpc2NvdmVyZWQpIHtcclxuXHRcdFx0cmV0dXJuICcjMDAwJztcclxuXHRcdH1cclxuXHRcdHJldHVybiAoaW5WaWV3KSA/IHRoaXMuY29sb3IgOiAnIzIzMjEyMCc7XHJcblx0fVxyXG5cclxuXHRnZXRCYWNrZ3JvdW5kQ29sb3IoaW5WaWV3ID0gdHJ1ZSkge1xyXG5cdFx0aWYgKCF0aGlzLmRpc2NvdmVyZWQpIHtcclxuXHRcdFx0cmV0dXJuICcjMDAwJztcclxuXHRcdH1cclxuXHRcdHJldHVybiAoaW5WaWV3KSA/IHRoaXMuYmFja2dyb3VuZCA6ICcjMTExMDEwJztcclxuXHR9XHJcblxyXG5cdC8vIFNldHNcclxuXHJcblx0c2V0Q2hhcmFjdGVyKGNoYXIpIHtcclxuXHRcdHRoaXMuY2hhcmFjdGVyID0gY2hhcjtcclxuXHR9XHJcblxyXG5cdGRpc2NvdmVyKCkge1xyXG5cdFx0dGhpcy5kaXNjb3ZlcmVkID0gdHJ1ZTtcclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ2VsbDtcclxuIiwiY29uc3QgRElSRUNUSU9OOCA9IHtcclxuXHQnVVAnOiAwLCAnVVAtUklHSFQnOiAxLFxyXG5cdCdSSUdIVCc6IDIsICdET1dOLVJJR0hUJzogMyxcclxuXHQnRE9XTic6IDQsICdET1dOLUxFRlQnOiA1LFxyXG5cdCdMRUZUJzogNiwgJ1VQLUxFRlQnOiA3XHJcbn07XHJcbmNvbnN0IERJUkVDVElPTjQgPSB7ICdVUCc6IDAsICdSSUdIVCc6IDEsICdET1dOJzogMiwgJ0xFRlQnOiAzIH07XHJcbmNvbnN0IERJUkVDVElPTjRfQVJSQVkgPSBbJ1VQJywgJ1JJR0hUJywgJ0RPV04nLCAnTEVGVCddO1xyXG5cclxuY29uc3QgVVNFRF9LRVlTID0gWydpJywgJ3QnLCAnMScsICcyJywgJzMnLCAnNCcsICc1JywgJzYnLCAnNycsICc4JywgJzknXTtcclxuY29uc3QgS0VZX01BUCA9IHtcclxuXHRcIjlcIjpcdFwiVEFCXCIsXHJcblx0XCIxM1wiOlx0XCJFTlRFUlwiLFxyXG5cdFwiMjdcIjpcdFwiRVNDXCIsXHJcblx0XCIzMlwiOlx0XCJTUEFDRVwiLFxyXG59O1xyXG5LRVlfTUFQWzM4XSA9ICdVUCc7IC8vIHVwXHJcbktFWV9NQVBbMzNdID0gJ1VQLVJJR0hUJztcclxuS0VZX01BUFszOV0gPSAnUklHSFQnOyAvLyByaWdodFxyXG5LRVlfTUFQWzM0XSA9ICdET1dOLVJJR0hUJztcclxuS0VZX01BUFs0MF0gPSAnRE9XTic7IC8vIGRvd25cclxuS0VZX01BUFszNV0gPSAnRE9XTi1MRUZUJztcclxuS0VZX01BUFszN10gPSAnTEVGVCc7IC8vIGxlZnRcclxuS0VZX01BUFszNl0gPSAnVVAtTEVGVCc7XHJcblxyXG5jb25zdCBXQVNEX0tFWU1BUCA9IHtcclxuXHQ4NzogJ1VQJywgLy8gd1xyXG5cdDY1OiAnTEVGVCcsIC8vIGFcclxuXHQ4MzogJ0RPV04nLCAvLyBzXHJcblx0Njg6ICdSSUdIVCcsIC8vIGRcclxufTtcclxuY29uc3QgV0FTRF9ESUFHT05BTCA9IHtcclxuXHQuLi5XQVNEX0tFWU1BUCxcclxuXHQ4MTogJ1VQLUxFRlQnLCAvLyBxXHJcblx0Njk6ICdVUC1SSUdIVCcsIC8vIGVcclxuXHQ5MDogJ0RPV04tTEVGVCcsIC8vIHpcclxuXHQ2NzogJ0RPV04tUklHSFQnLCAvLyBjXHJcbn07XHJcbmNvbnN0IFZJX0tFWU1BUCA9IHtcclxuXHQ3MjogJ0xFRlQnLCAvLyBoXHJcblx0NzQ6ICdET1dOJywgLy8galxyXG5cdDc1OiAnVVAnLCAvLyBrXHJcblx0NzY6ICdSSUdIVCcsIC8vIGxcclxuXHJcbn07XHJcbmNvbnN0IFZJX0RJQUdPTkFMID0ge1xyXG5cdC4uLlZJX0tFWU1BUCxcclxuXHQ4OTogJ1VQLUxFRlQnLCAvLyB5XHJcblx0ODU6ICdVUC1SSUdIVCcsIC8vIHVcclxuXHQ2NjogJ0RPV04tTEVGVCcsIC8vIGJcclxuXHQ3ODogJ0RPV04tUklHSFQnLCAvLyBuXHJcbn07XHJcblxyXG5cclxuY29uc3QgVU5TUEVDSUZJRURfU1RBVEUgPSAnVU5TUEVDSUZJRUQnO1xyXG5cclxuY2xhc3MgS2V5Ym9hcmRMaXN0ZW5lciB7XHJcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XHJcblx0XHR0aGlzLmNhbGxiYWNrcyA9IHt9O1xyXG5cdFx0dGhpcy5pc0xpc3RlbmluZyA9IGZhbHNlO1xyXG5cdFx0dGhpcy5zdGF0ZSA9IG9wdGlvbnMuc3RhdGUgfHwgVU5TUEVDSUZJRURfU1RBVEU7XHJcblx0XHR0aGlzLmF1dG9TdGFydCA9IChvcHRpb25zLmF1dG9TdGFydCA9PT0gdW5kZWZpbmVkKSA/IGZhbHNlIDogQm9vbGVhbihvcHRpb25zLmF1dG9TdGFydCk7XHJcblx0fVxyXG5cclxuXHRzZXRTdGF0ZShzdGF0ZSA9IFVOU1BFQ0lGSUVEX1NUQVRFKSB7XHJcblx0XHR0aGlzLnN0YXRlID0gc3RhdGUudG9TdHJpbmcoKTtcclxuXHR9XHJcblxyXG5cdG9uKHN0YXRlLCBrZXksIGNhbGxiYWNrKSB7XHJcblx0XHQvLyBrZXkgY2FuIGJlIGEga2V5Q29kZSBvciBhIGtleVR5cGUgbGlrZSAnRElSRUNUSU9OJ1xyXG5cdFx0dGhpcy5jYWxsYmFja3Nbc3RhdGUgKyAnXycgKyBrZXldID0gY2FsbGJhY2s7XHJcblx0XHRpZiAodGhpcy5hdXRvU3RhcnQpIHtcclxuXHRcdFx0dGhpcy5zdGFydCgpO1xyXG5cdFx0fVxyXG5cdH1cclxuXHRcclxuXHRvZmYoc3RhdGUsIGtleSwgY2FsbGJhY2spIHtcclxuXHRcdC8vIFRPRE86IHJlbW92ZSBjYWxsYmFja1xyXG5cdFx0Ly8gVE9ETzogaWYgbm8gbW9yZSBjYWxsYmFja3MgdGhlbiBzdG9wXHJcblx0fVxyXG5cclxuXHRnZXRLZXlNYXAoKSB7XHJcblx0XHRsZXQga2V5TWFwID0geyAuLi5LRVlfTUFQIH07XHJcblx0XHQvLyBUT0RPOiB2YXJpYXRpb25zIGJhc2VkIG9uIG9wdGlvbnMgc2VsZWN0ZWRcclxuXHRcdGtleU1hcCA9IHsgLi4ua2V5TWFwLCAuLi5XQVNEX0RJQUdPTkFMLCAuLi5WSV9ESUFHT05BTCB9O1xyXG5cdFx0cmV0dXJuIGtleU1hcDtcclxuXHR9XHJcblxyXG5cdGhhbmRsZUV2ZW50KGUpIHtcclxuXHRcdGNvbnN0IGtleU1hcCA9IHRoaXMuZ2V0S2V5TWFwKCk7XHJcblx0XHRjb25zdCB7IGtleUNvZGUsIGtleSB9ID0gZTtcclxuXHRcdGNvbnN0IGlzS2V5VXNlZCA9IFVTRURfS0VZUy5pbmNsdWRlcyhrZXkpIHx8IChrZXlDb2RlIGluIGtleU1hcCk7XHJcblxyXG5cdFx0aWYgKCFpc0tleVVzZWQpIHtcclxuXHRcdFx0Y29uc29sZS5sb2coJ0tleWJvYXJkIGhhbmRsZUV2ZW50IC0gdW5hY2NvdW50ZWQgZm9yIGtleTonLCBrZXksIGtleUNvZGUpO1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG5cdFx0Ly8gTG9va3VwIGtleSBuYW1lIGFuZCBkaXJlY3Rpb25cclxuXHRcdGNvbnN0IGtleU5hbWUgPSBrZXlNYXBba2V5Q29kZV0gfHwga2V5O1xyXG5cdFx0Y29uc3QgZGlyZWN0aW9uID0gRElSRUNUSU9OOFtrZXlOYW1lXTtcclxuXHRcdC8vIGNvbnNvbGUubG9nKCdoYW5kbGVFdmVudCcsIGUsIGtleU5hbWUsIGtleUNvZGUsIGRpcmVjdGlvbik7XHJcblxyXG5cdFx0Ly8gQ2FsbGJhY2tzXHJcblx0XHRpZiAoZGlyZWN0aW9uICE9PSB1bmRlZmluZWQpIHtcclxuXHRcdFx0Y29uc3QgdHlwZUNhbGxiYWNrID0gdGhpcy5jYWxsYmFja3NbdGhpcy5zdGF0ZSArICdfRElSRUNUSU9OJ107XHJcblx0XHRcdGlmICh0eXBlQ2FsbGJhY2spIHtcclxuXHRcdFx0XHR0eXBlQ2FsbGJhY2soa2V5TmFtZSwga2V5Q29kZSwgZGlyZWN0aW9uKTtcclxuXHRcdFx0fVxyXG5cdFx0fVxyXG5cdFx0Y29uc3QgY2FsbGJhY2sgPSB0aGlzLmNhbGxiYWNrc1t0aGlzLnN0YXRlICsgJ18nICsga2V5TmFtZV07XHJcblx0XHQvLyBjb25zb2xlLmxvZyh0aGlzLnN0YXRlICsgJ18nICsga2V5TmFtZSwgY2FsbGJhY2spO1xyXG5cdFx0aWYgKGNhbGxiYWNrKSB7XHJcblx0XHRcdGNhbGxiYWNrKGtleU5hbWUsIGtleUNvZGUsIGRpcmVjdGlvbik7XHJcblx0XHR9XHJcblx0fVxyXG5cclxuXHRzdGFydCgpIHtcclxuXHRcdGlmICh0aGlzLmlzTGlzdGVuaW5nKSB7XHJcblx0XHRcdHJldHVybjtcclxuXHRcdH1cclxuXHRcdHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgdGhpcyk7ICAvLyBwYXNzIHRoaXM7IHRoZSBgaGFuZGxlRXZlbnRgIHdpbGwgYmUgdXNlZFxyXG5cdFx0dGhpcy5pc0xpc3RlbmluZyA9IHRydWU7XHJcblx0fVxyXG5cclxuXHRzdG9wKCkge1xyXG5cdFx0Ly8gVE9ETzogcmVtb3ZlIGV2ZW50IGxpc3RlbmVyXHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IEtleWJvYXJkTGlzdGVuZXI7XHJcbiIsIlxyXG5jbGFzcyBNdXNpY0JveCB7XHJcblx0Y29uc3RydWN0b3IocGxheWxpc3QpIHtcclxuXHRcdHRoaXMuYXVkaW8gPSBudWxsO1xyXG5cdFx0dGhpcy5wbGF5bGlzdCA9IFsgLi4ucGxheWxpc3QgXTtcclxuXHR9XHJcblxyXG5cdGFkZFRvUGxheWxpc3Qoc29uZ1BhdGgpIHtcclxuXHRcdHRoaXMucGxheWxpc3QucHVzaChzb25nUGF0aCk7XHJcblx0fVxyXG5cclxuXHRwbGF5KGkgPSAwKSB7XHJcblx0XHR0aGlzLmF1ZGlvID0gbmV3IEF1ZGlvKHRoaXMucGxheWxpc3RbaV0pO1xyXG5cdFx0dGhpcy5hdWRpby5wbGF5KCk7XHJcblx0fVxyXG59XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IE11c2ljQm94O1xyXG4iLCJjbGFzcyBDb25zb2xlIHtcclxuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcclxuXHRcdHRoaXMuaWQgPSBvcHRpb25zLmlkIHx8ICdjb25zb2xlJztcclxuXHRcdHRoaXMuY29udGFpbmVyID0gbnVsbDtcclxuXHRcdHRoaXMubGlzdCA9IG51bGw7XHJcblx0XHR0aGlzLm1lc3NhZ2VzID0gW107XHJcblx0XHR0aGlzLndyaXRlVG9Db25zb2xlTG9nID0gZmFsc2U7XHJcblx0fVxyXG5cclxuXHRzZXR1cCgpIHtcclxuXHRcdHRoaXMuY29udGFpbmVyID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZCk7XHJcblx0XHR0aGlzLmNsZWFyKCk7XHJcblx0fVxyXG5cclxuXHRjbGVhcigpIHtcclxuXHRcdHRoaXMubWVzc2FnZXMubGVuZ3RoID0gMDtcclxuXHRcdHRoaXMuY29udGFpbmVyLmlubmVySFRNTCA9ICc8dWw+PC91bD4nO1xyXG5cdFx0dGhpcy5saXN0ID0gdGhpcy5jb250YWluZXIuZmlyc3RDaGlsZDtcclxuXHR9XHJcblxyXG5cdHByaW50KHN0ciwgY2xhc3NlcyA9ICcnKSB7XHJcblx0XHRpZiAoIXN0cikge1xyXG5cdFx0XHRyZXR1cm47XHJcblx0XHR9XHJcblx0XHRpZiAodGhpcy53cml0ZVRvQ29uc29sZUxvZykge1xyXG5cdFx0XHRjb25zb2xlLmxvZygnJWMnICsgc3RyLCAnY29sb3I6ICM1NTk5NTUnKTtcclxuXHRcdH1cclxuXHRcdGNvbnN0IHNhZmVTdHIgPSBzdHIucmVwbGFjZSgnPCcsICcmbHQ7Jyk7XHJcblx0XHR0aGlzLmxpc3QuaW5uZXJIVE1MICs9IGA8bGkgY2xhc3M9XCIke2NsYXNzZXN9XCI+JHtzYWZlU3RyfTwvbGk+YDtcclxuXHRcdHRoaXMuY29udGFpbmVyLnNjcm9sbFRvcCA9IHRoaXMuY29udGFpbmVyLnNjcm9sbEhlaWdodDtcclxuXHRcdHRoaXMudHJpbSgpO1xyXG5cdH1cclxuXHJcblx0Ly8gYWxpYXNlc1xyXG5cdGxvZyhzdHIpIHsgcmV0dXJuIHRoaXMucHJpbnQoc3RyKTtcdH1cclxuXHRhZGQoc3RyKSB7IHJldHVybiB0aGlzLnByaW50KHN0cik7IH1cclxuXHJcblx0dHJpbSgpIHtcclxuXHRcdGlmICh0aGlzLmxpc3QuaW5uZXJIVE1MLmxlbmd0aCA+IDUwMDApIHtcclxuXHRcdFx0dGhpcy5saXN0LnJlbW92ZUNoaWxkKHRoaXMubGlzdC5maXJzdENoaWxkKTtcclxuXHRcdH1cclxuXHR9XHJcbn1cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQ29uc29sZTtcclxuIl0sInNvdXJjZVJvb3QiOiIifQ==