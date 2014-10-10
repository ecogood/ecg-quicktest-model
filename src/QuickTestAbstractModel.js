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
  self.participant = {};
  self.answers = []; // [<questionIndex>]=<answerValue>
}

/**
 * @return {string} the current participant type
 */
QuickTestAbstractModel.prototype.getParticipant = function() {
  return this.participant;
};

/**
 * @return {string} the current participant type
 */
QuickTestAbstractModel.prototype.getParticipantType = function() {
  return this.participant.type;
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
  this.participant.type = _participantType;
};

/**
 * Sets the answer for the given question number.
 *
 * @throws {Error} if the question number is out of range or the given answer value is not allowed.
 * @param {int} questionNumber - the question number, from 1 to questionCount().
 * @param answerValue
 */
QuickTestAbstractModel.prototype.setAnswer = function(questionNumber, answerValue) {

  // check arguments
  if (questionNumber < 1 || questionNumber > this.getQuestionsCount()) {
    throw new Error('The argument \'questionNumber\' of setAnswer() should ' +
      'be between 1 and ' + this.getQuestionsCount() + ', but has the value \'' + questionNumber + '\'.');
  }
  else if (this.getAllowedAnswers().indexOf(answerValue) === -1) {
    throw new Error('The argument \'answerValue\' of setAnswer() should ' +
      'be one of  \'' + this.getAllowedAnswers() + '\', but was \'' + answerValue + '\'.');
  }

  // set the value
  this.answers[questionNumber - 1] = answerValue;
};

/**
 *
 * @param {int} questionNumber - the question number, from 1 to questionCount().
 * @return {*} the answer for the given question number
 */
QuickTestAbstractModel.prototype.getAnswer = function(questionNumber) {
  return this.answers[questionNumber - 1];
};

QuickTestAbstractModel.prototype.getAnswersCount = function() {
  var that = this;
  var answersCount = 0;
  Object.keys(this.answers).forEach(function(index) {
    if (that.getParticipantType() === that.getAllowedParticipantTypes()[1] &&
      that.getSkipQuestions().indexOf(index) !== -1) {
      // self-employed and skip question
    }
    else {
      answersCount++;
    }
  });
  return answersCount;
};

QuickTestAbstractModel.prototype.getPercentageFinished = function() {
  var answeredQuestions = this.getAnswersCount();
  var participantQuestionsCount = this.getParticipantQuestionsCount();
  return Math.floor(((Number(answeredQuestions / participantQuestionsCount)) * 100).toFixed(2));
};

module.exports = QuickTestAbstractModel;