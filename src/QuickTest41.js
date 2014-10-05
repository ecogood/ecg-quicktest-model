"use strict";

var inheritPrototype = require('./inheritPrototype');
var QuickTestAbstractModel = require('./QuickTestAbstractModel');

/**
 * The Quick Test for the ECG Matrix 4.1
 *
 * @constructor
 * @extends #QuickTestAbstractModel
 */
function QuickTest41() {
  // make the constructor new-agnostic
  var self = this instanceof QuickTest41 ? this : Object.create(QuickTest41.prototype);

  // super constructor call
  QuickTestAbstractModel.call(self);

  var allowedParticipantsTypes = self.getAllowedParticipantTypes();

  // dependent parent properties
  self.setParticipantType(allowedParticipantsTypes[0]); // default

  // independent inner properties
  self.doubleValueQuestionIndexes = [18, 20, 22, 24, 25]; // 19, 21, 23, 25 and 26
}
inheritPrototype(QuickTest41, QuickTestAbstractModel);


/**
 * Sets the participant type
 * @param {string} _participantType
 */
QuickTest41.prototype.setParticipantType = function(_participantType) {

  // super call
  QuickTestAbstractModel.prototype.setParticipantType.call(this, _participantType);

  // set other properties according the to participant type
  if (this.participantType === this.getAllowedParticipantTypes()[0]) { // company

    this.skipQuestions = [];
    this.participantQuestionsCount = this.getQuestionsCount();
    this.maxPoints = 128; // 22*4+5*8

  } else if (this.participantType === this.getAllowedParticipantTypes()[1]) { // self-employed

    this.skipQuestions = [6, 9, 10, 11, 12, 13, 25];
    this.participantQuestionsCount = this.getQuestionsCount() - this.skipQuestions.length;
    this.maxPoints = 122; // Math.floor((16*4+4*8)*1.28)
  } else {
    throw new Error('Cannot set unallowed participant: ', _participantType);
  }
};

/**
 * @return {int} the maximum questions count
 * @implements
 */
QuickTest41.prototype.getQuestionsCount = function() {
  return 27;
};

/**
 * @return {int} the questions count for the current participant type
 * @implements
 */
QuickTest41.prototype.getParticipantQuestionsCount = function() {
  return this.participantQuestionsCount;
};

/**
 * @return {Array} array with the allowed answer values
 * @implements
 */
QuickTest41.prototype.getAllowedAnswers = function() {
  return [0, 1, 2, 3, 4];
};

/**
 * @return {Array} array with the allowed participant types.
 * @implements
 */
QuickTest41.prototype.getAllowedParticipantTypes = function() {
  return ['company', 'self-employed'];
};

/**
 * @return {{participantType1: maxPoints1, participantType2, maxPoints2}}
 * an obj containing the maximum points for each participant type
 * @implements
 */
QuickTest41.prototype.getMaxPoints = function() {
  return this.maxPoints;
};

QuickTest41.prototype.getSkipQuestions = function() {
  return this.skipQuestions;
};

QuickTest41.prototype.getResult = function() {

  var that = this;
  var isSelfEmployed = this.participantType === this.getAllowedParticipantTypes()[1];

  // sum all answer values
  var answersSum = this.answers.reduce(function(prev, cur, index) {

    // if 'self-employed' skip irrelevant questions
    if (isSelfEmployed && that.skipQuestions.indexOf(index) !== -1) {
      return prev;

    } else {
      var curValue = cur;

      // double the value of important questions
      if (that.doubleValueQuestionIndexes.indexOf(index) !== -1) {
        curValue = curValue * 2;
      }
      return prev + curValue;
    }
  }, 0);

  var finalPoints = answersSum;
  if (isSelfEmployed) { // self-employed
    // 43.89 is floored to 43
    finalPoints = Math.floor(answersSum * 1.28); // 1.28 = 32/25
  } else {
    // participant company is assumed, so not change of the points.
  }

  var finalPercentage = Number(finalPoints / this.getMaxPoints()).toFixed(2) * 100;

  return {
    points: finalPoints,
    percentage: finalPercentage
  };
};

/**
 * @override
 * @returns {string}
 */
QuickTest41.prototype.toString = function() {
  return '[QuickTest41]';
};

module.exports = QuickTest41;