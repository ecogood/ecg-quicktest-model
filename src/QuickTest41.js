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
  self.doubleValueQuestionNumbers = [19, 21, 23, 25, 26]; // 19, 21, 23, 25 and 26
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
  if (this.getParticipantType() === this.getAllowedParticipantTypes()[0]) { // company

    this.skipQuestions = [];
    this.participantQuestionsCount = this.getQuestionsCount();
    this.maxPoints = 128; // 22*4+5*8

  } else if (this.getParticipantType() === this.getAllowedParticipantTypes()[1]) { // self-employed

    this.skipQuestions = [7, 10, 11, 12, 13, 14, 26];
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

/**
 * Returns the previous question number for the given question number,
 * taking into account the participant type
 * @param questionNumber
 * @return {int|null} - the previous question number taking into account skipQuestions or
 * <code>null</code> if the given argument is not a number or <=0
 */
QuickTest41.prototype.getPrevQuestion = function(questionNumber) {
  if (typeof questionNumber !== 'number' || questionNumber <= 0) {
    return null;
  }
  if (this.getParticipantType() === this.getAllowedParticipantTypes()[0]) {
    // company
    if (questionNumber > this.getQuestionsCount()) {
      return this.getQuestionsCount();
    } else {
      return questionNumber - 1;
    }

  } else if (this.getParticipantType() === this.getAllowedParticipantTypes()[1]) {
    // self-employed
    var skipQuestions = this.getSkipQuestions();

    if (skipQuestions.indexOf(questionNumber - 1) !== -1) {
      // the previous question is skipped, then recurse-call the previous of the previous one
      return this.getPrevQuestion(questionNumber - 1);
    }
    else if (questionNumber === this.getQuestionsCount() ||
        questionNumber === this.getQuestionsCount() + 1) {
      return this.getQuestionsCount();
    }
    else if (questionNumber > this.getQuestionsCount() + 1) {
      return this.getPrevQuestion(this.getQuestionsCount() +1);
    }
    else {
      return questionNumber - 1;
    }

  } else {
    return null;
  }
};

/**
 * Returns the next question number for the given question number,
 * taking into account the participant type
 * @param questionNumber
 * @return {int|null} - the next question number taking into account skipQuestions or
 * <code>null</code> if the given argument is not a number or bigger than the question count.
 */
QuickTest41.prototype.getNextQuestion = function(questionNumber) {
  if (typeof questionNumber !== 'number' || questionNumber >= this.getQuestionsCount()) {
    return null;
  }
  if (this.getParticipantType() === this.getAllowedParticipantTypes()[0]) {
    // company
    if (questionNumber < 0) {
      return 0;
    } else {
      return questionNumber + 1;
    }

  } else if (this.getParticipantType() === this.getAllowedParticipantTypes()[1]) {
    // self-employed
    var skipQuestions = this.getSkipQuestions();

    if (skipQuestions.indexOf(questionNumber + 1) !== -1) {
      // the next question is skipped, then return the next of the next one
      return this.getNextQuestion(questionNumber + 1);
    }
    else if (questionNumber === -1) {
      return 0;
    }
    else if (questionNumber < -1) {
      return this.getNextQuestion(-1);
    }
    else {
      return questionNumber + 1;
    }

  } else {
    return null;
  }
};

QuickTest41.prototype.getResult = function() {

  var that = this;
  var isSelfEmployed = this.getParticipantType() === this.getAllowedParticipantTypes()[1];

  // sum all answer values
  var answersSum = this.answers.reduce(function(prev, cur, index) {

    // if 'self-employed' skip irrelevant questions
    if (isSelfEmployed && that.getSkipQuestions().indexOf(index + 1) !== -1) {
      return prev;

    } else {
      var curValue = cur;

      // double the value of important questions
      if (that.doubleValueQuestionNumbers.indexOf(index + 1) !== -1) {
        curValue = curValue * 2;
      }
      return prev + curValue;
    }
  }, 0);

  // set result points
  var resultPoints = answersSum;
  if (isSelfEmployed) { // self-employed
    // 43.89 is floored to 43
    resultPoints = Math.floor(answersSum * 1.28); // 1.28 = 32/25
  } else {
    // participant company is assumed, so not change of the points.
  }

  // set result percentage
  var resultPercentage = Number(resultPoints / this.getMaxPoints()).toFixed(2) * 100;

  // set result level
  var resultLevel = 0;
  if (resultPoints >= 33 && resultPoints <= 62) {
    resultLevel = 1;
  } else if (resultPoints >= 63 && resultPoints <= 94) {
    resultLevel = 2;
  } else if (resultPoints >= 95 && resultPoints <= 128) {
    resultLevel = 3;
  }

  return {
    points: resultPoints,
    percentage: resultPercentage,
    level: resultLevel
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