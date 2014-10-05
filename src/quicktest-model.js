"use strict";

/**
 * @source https://github.com/ecogood/ecg-quicktest-model/blob/master/index.js
 * @license MIT https://github.com/ecogood/ecg-quicktest-model/blob/master/LICENSE
 *
 */

/**
 * ----------- Utils function ----------- START
 */

function inheritPrototype(subType, superType) {
  var subTypePrototype = Object.create(superType.prototype);
  subTypePrototype.constructor = subType;
  subType.prototype = subTypePrototype;
}

function InvalidArgumentError(message) {
  this.name = 'InvalidArgumentError';
  this.message = message;
}
InvalidArgumentError.prototype = new Error();

/**
 * ----------- Utils function ----------- END
 */


/**
 * API:
 *
 * props:
 * !.questionsCount
 * !.allowedAnswers
 *
 * .isStarted
 * .isFinished
 * .answers
 *
 * functions:
 * .isStarted()
 * .start()
 * .isFinished() - whether all questions were answered.
 * .finish() - finish the test.
 *
 * .getQuestionsCount() - how many questions there are.
 * .getAllowedAnswers() - return the allowed answer values.
 *
 * .setAnswer(questionIndex, answerValue) - throws error if needed, cannot set if finished.
 * .getAnswer(questionIndex) - return one of the allowed answerValues
 * .getAnswersCount() - how many answers were set.
 * .getPercentageFinished() - percentage: 20%, at the end 100%
 * .getResult(): {points: 123, percentage: 78%}
 *
 * @abstract
 * @param <int|0> questionsCount: description ...
 */
function QuickTestAbstractModel() {
  // make the constructor new-agnostic
  var self = this instanceof QuickTestAbstractModel ? this : Object.create(QuickTestAbstractModel.prototype);

  // shared properties
  self.isStarted = false;
  self.isFinished = false;
  self.allowedParticipantsTypes = ['company', 'self-employed'];
  self.participantType = self.allowedParticipantsTypes[0]; // default
  self.answers = []; // "0": "1" - "<questionIndex>":"<answerValue>"
}

QuickTestAbstractModel.prototype.isStarted = function() {
  return this.isStarted;
};

QuickTestAbstractModel.prototype.start = function() {
  this.isStarted = true;
};

QuickTestAbstractModel.prototype.isFinished = function() {
  return this.isFinished;
};

QuickTestAbstractModel.prototype.finish = function() {
  this.isFinished = true;
};

QuickTestAbstractModel.prototype.getQuestionsCount = function() {
  return this.questionsCount;
};

QuickTestAbstractModel.prototype.getAllowedAnswers = function() {
  return this.allowedAnswers;
};

QuickTestAbstractModel.prototype.allowedParticipantsTypes = function() {
  return this.allowedParticipantsTypes;
};

QuickTestAbstractModel.prototype.getParticipantType = function() {
  return this.participantType;
};

QuickTestAbstractModel.prototype.setParticipantType = function(_participantType) {

  // check argument
  if (this.allowedParticipantsTypes.indexOf(_participantType) === -1) {
    throw new InvalidArgumentError('The argument \'_participantType\' of setParticipantType() should ' +
      'be one of  \'' + this.allowedParticipantsTypes + '\', but was \'' + _participantType + '\'.');
  }

  // set it
  this.participantType = _participantType;
};

QuickTestAbstractModel.prototype.setAnswer = function(questionIndex, answerValue) {

  // check arguments
  if (questionIndex < 0 || questionIndex > this.questionsCount - 1) {
    throw new InvalidArgumentError('The argument \'questionIndex\' of setAnswer() should ' +
      'be between 0 and ' + (this.questionsCount - 1) + ', but has the value \'' + questionIndex + '\'.');
  }
  else if (this.allowedAnswers.indexOf(answerValue) === -1) {
    throw new InvalidArgumentError('The argument \'answerValue\' of setAnswer() should ' +
      'be one of  \'' + this.allowedAnswers + '\', but was \'' + answerValue + '\'.');
  }

  // set the value
  this.answers[questionIndex] = answerValue;
};

QuickTestAbstractModel.prototype.getAnswer = function(questionIndex) {
  return this.answers[questionIndex];
};

QuickTestAbstractModel.prototype.getAnswersCount = function(questionIndex) {
  var answersCount = 0;
  this.answers.forEach(function(answer) {
    answersCount++;
  });
  return answersCount;
};

QuickTestAbstractModel.prototype.getPercentageFinished = function(questionIndex) {
  // TODO
  return 0;
};


/**
 *
 * @constructor
 */
function QuickTest41() {
  // make the constructor new-agnostic
  var self = this instanceof QuickTest41 ? this : Object.create(QuickTest41.prototype);

  // super constructor call
  QuickTestAbstractModel.call(self);

  // dependent parent properties
  self.questionsCount = 27;
  self.allowedAnswers = [0, 1, 2, 3, 4];

}
inheritPrototype(QuickTest41, QuickTestAbstractModel);

/**
 * @override
 * @returns {string}
 */
QuickTest41.prototype.getResult = function() {
  return {
    points: this.calculateResultPoints(),
    percentage: this.calculateResultPercentage()
  };
};


QuickTest41.prototype.calculateResultPoints = function() {
  // TODO
  return 100;
};

QuickTest41.prototype.calculateResultPercentage = function() {
  // TODO
  return 100;
};

/**
 * @override
 * @returns {string}
 */
QuickTest41.prototype.toString = function() {
  return '[QuickTest41]';
};


/**
 * @module Factory to create a @QuickTestModel instances.
 *
 * @example
 * // returns a quickTest for the matrix version 4.1
 * globalNS.method1(5, 10);
 */
var quickTestFactory = {

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
   * @return <Array> array of the supported matrix versions.
   */
  getMatrixVersions: function() {
    return Object.keys(this.tests);
  },

  /**
   * The default matrix version to be used when the method #factory() is called without parameters.
   *
   * @public
   * @readonly
   * @return <string> string of the default/current matrix version.
   */
  defaultMatrixVersion: '4.1',

  /**
   *
   * @public
   * @throws TODO ...
   * @param <string|'4.1'> _matrixVersion - (optional) the ECG matrix version of the quick test
   */
  factory: function(_matrixVersion) {
    var matrixVersion = _matrixVersion || this.defaultMatrixVersion;

    // error if the constructor doesn't exist
    if (typeof quickTestFactory.tests[matrixVersion] !== "function") {
      throw {
        name: 'Error',
        message: 'There is no quick test for the matrix version \'' + matrixVersion + '\''
      };
    }

    return quickTestFactory.tests[matrixVersion]();
  },

  /**
   * @override
   * @returns {string}
   */
  toString: function() {
    return '[QuickTestFactory ' + this.supportedMatrixVersions + ']';
  }

};


module.exports = quickTestFactory;