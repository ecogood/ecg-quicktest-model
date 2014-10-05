"use strict";

/**
 * The given SubType inherits the prototype of the given SuperType.
 *
 * @param subType
 * @param superType
 */
module.exports = function inheritPrototype(subType, superType) {
  var subTypePrototype = Object.create(superType.prototype);
  subTypePrototype.constructor = subType;
  subType.prototype = subTypePrototype;
};