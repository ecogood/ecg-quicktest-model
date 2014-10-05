"use strict";

/**
 * Abstract model for quick tests. Implements:
 * - get and set participant type.
 * - get and set answers.
 * - get answers count, percentage finished and max points.
 * - get final result.
 *
 * **Note**: Children of this class, should:
 * - call setParticipantType() in their constructor.
 * implement the methods:
 * - {int} getQuestionsCount() - how many questions are in the test
 * - {Array} getAllowedAnswers() - an array with the allowed answers for every question.
 * - {Array} getAllowedParticipantTypes() - an array with the allowed participant types.
 * - {int] getMaxPoints() - the the maximum achievable points in the test for the set participant type.
 * - {int} getResult() - an object {points: <points>, percentage: <percentage>} containing
 * the points and the percentage from 0 to 100% that have been reached.
 *
 * @abstract
 */
function QuickTestAbstractModel() {
  // make the constructor new-agnostic
  var self = this instanceof QuickTestAbstractModel ? this : Object.create(QuickTestAbstractModel.prototype);

  // shared properties
  self.answers = []; // [<questionIndex>]=<answerValue>
}

/**
 * @return {string} the current participant type
 */
QuickTestAbstractModel.prototype.getParticipantType = function() {
  return this.participantType;
};

/**
 * Sets the participant type
 * @param {string} _participantType
 */
QuickTestAbstractModel.prototype.setParticipantType = function(_participantType) {

  var allowedParticipantsTypes = this.getAllowedParticipantTypes();
  // check argument
  if (allowedParticipantsTypes.indexOf(_participantType) === -1) {
    throw new Error('The argument \'_participantType\' of setParticipantType() should ' +
      'be one of  \'' + allowedParticipantsTypes + '\', but was \'' + _participantType + '\'.');
  }

  // set it
  this.participantType = _participantType;
};

/**
 * Sets the answer for the given question index.
 *
 * @throws {Error} if the question index is out of range or the given answer value is not allowed.
 * @param {int} questionIndex
 * @param answerValue
 */
QuickTestAbstractModel.prototype.setAnswer = function(questionIndex, answerValue) {

  // check arguments
  if (questionIndex < 0 || questionIndex > this.getQuestionsCount() - 1) {
    throw new Error('The argument \'questionIndex\' of setAnswer() should ' +
      'be between 0 and ' + (this.getQuestionsCount() - 1) + ', but has the value \'' + questionIndex + '\'.');
  }
  else if (this.getAllowedAnswers().indexOf(answerValue) === -1) {
    throw new Error('The argument \'answerValue\' of setAnswer() should ' +
      'be one of  \'' + this.getAllowedAnswers() + '\', but was \'' + answerValue + '\'.');
  }

  // set the value
  this.answers[questionIndex] = answerValue;
};

/**
 *
 * @param {int} questionIndex
 * @return {*} the answer for the given question index
 */
QuickTestAbstractModel.prototype.getAnswer = function(questionIndex) {
  return this.answers[questionIndex];
};

QuickTestAbstractModel.prototype.getAnswersCount = function() {
  //TODO
  var answersCount = 0;
  this.answers.forEach(function(answer) {
    answersCount++;
  });
  return answersCount;
};

QuickTestAbstractModel.prototype.getPercentageFinished = function() {
  // TODO
  return 0;
};

module.exports = QuickTestAbstractModel;