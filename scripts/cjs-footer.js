'use strict';

/**
 * CommonJS compatibility footer injected into esbuild output.
 * @author Jeremy Daly <jeremy@jeremydaly.com>
 * @license MIT
 */

const cjsFooter = () => {
  if (typeof module !== 'undefined' && module.exports) {
    const exported = module.exports.default || module.exports;
    if (exported && exported.__esModule && typeof exported === 'object') {
      const plainExports = {};
      Object.keys(exported).forEach((key) => {
        if (key !== 'default' && key !== '__esModule')
          plainExports[key] = exported[key];
      });
      module.exports = Object.keys(plainExports).length
        ? plainExports
        : exported;
    } else {
      module.exports = exported;
    }
  }
};
module.exports = `(${cjsFooter.toString()})();`;
