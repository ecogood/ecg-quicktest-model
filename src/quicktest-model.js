/**
 * @source https://github.com/ecogood/ecg-quicktest-model/blob/master/index.js
 * @license MIT https://github.com/ecogood/ecg-quicktest-model/blob/master/LICENSE
 */
"use strict";

var QuickTest41 = require('./QuickTest41');

/**
 * @module Factory to create a @QuickTestModel instances.
 *
 * @example
 * // creates a quickTest for the matrix version 4.1
 * var quickTest = quickTestFactory.factory('4.1');
 */
module.exports = {

  /**
   * @private
   */
  tests: {
    '4.1': function() {
      return new QuickTest41();
    }
    // here should be added test with new matrix versions
  },

  /**
   * The supported ECG matrix versions
   *
   * @public
   * @readonly
   * @return {Array} array of the supported matrix versions.
   */
  getMatrixVersions: function() {
    return Object.keys(this.tests);
  },

  /**
   * The default matrix version to be used when the method #factory() is called without parameters.
   *
   * @public
   * @readonly
   * @return {string} string of the default/current matrix version.
   */
  defaultMatrixVersion: '4.1',

  /**
   *
   * @public
   * @return the quick test or <code>null</code> if there is no quick test for the given matrix version
   * @param {string} [_matrixVersion='4.1'] (optional) the ECG matrix version of the quick test
   */
  factory: function(_matrixVersion) {
    var matrixVersion = _matrixVersion || this.defaultMatrixVersion;

    // error if the constructor doesn't exist
    if (typeof this.tests[matrixVersion] !== "function") {
      return null;
    }

    return this.tests[matrixVersion]();
  }

};
