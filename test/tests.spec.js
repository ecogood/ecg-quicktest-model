"use strict";

var expect = require('chai').expect;
var quickTestModel = require('../src/quicktest-model');

describe('QuickTestModel', function() {

  it('should support at least one matrix version', function() {
    expect(quickTestModel.getMatrixVersions()).to.have.length.above(0);
  });

  it('should have a supported default matrix version', function() {
    expect(quickTestModel.getMatrixVersions()).to.include(quickTestModel.defaultMatrixVersion);
  });

});

describe('every test', function() {

  // contains all available tests
  var quickTests = [];

  beforeEach(function() {
    var matrixVersions = quickTestModel.getMatrixVersions();
    matrixVersions.forEach(function(matrixVersion) {
      quickTests.push(quickTestModel.factory(matrixVersion));
    });
  });

  it('should have at least one question', function() {
    quickTests.forEach(function(quickTest) {
      expect(quickTest.getQuestionsCount()).to.be.above(0);
    });
  });

  it('should have at least one allowed answer', function() {
    quickTests.forEach(function(quickTest) {
      expect(quickTest.getAllowedAnswers().length).to.be.above(0);
    });
  });

  it('should have at least one allowed participant type', function() {
    quickTests.forEach(function(quickTest) {
      expect(quickTest.getAllowedParticipantTypes().length).to.be.above(0);
    });
  });

  it('should have maximum points > 0', function() {
    quickTests.forEach(function(quickTest) {
      quickTest.setParticipantType(quickTest.getAllowedParticipantTypes()[0]);
      expect(quickTest.getMaxPoints()).to.be.above(0);
      quickTest.setParticipantType(quickTest.getAllowedParticipantTypes()[1]);
      expect(quickTest.getMaxPoints()).to.be.above(0);
    });
  });

  it('should have the function getResult() returning points and percentage', function() {
    quickTests.forEach(function(quickTest) {
      expect(quickTest).to.have.property('getResult');
      var result = quickTest.getResult();
      expect(result).to.have.property('points');
      expect(result).to.have.property('percentage');
    });
  });

});


describe('QuickTest 4.1', function() {

  // contains all available tests
  var quickTest;

  beforeEach(function() {
    quickTest = quickTestModel.factory('4.1');
  });

  it('should have 27 questions', function() {
    expect(quickTest.getQuestionsCount()).to.equal(27);
  });

  it('should have allowed answers [0, 1, 2, 3, 4]', function() {
    expect(quickTest.getAllowedAnswers()).to.deep.equal([0, 1, 2, 3, 4]);
  });

  it('should save allowed answers', function() {
    quickTest.setAnswer(1, 2);
    expect(quickTest.getAnswer(1)).to.equal(2);
  });

  it('should throw error when saving not allowed answer and not save it', function() {
    var notAllowedSetAnswer = quickTest.setAnswer.bind(quickTest, 0, 'asd');
    expect(notAllowedSetAnswer).to.throw(Error);
    expect(quickTest.getAnswersCount()).to.equal(0);
  });

  it('should throw error when saving an answer for non-existing question', function() {
    var setAnswerZeroQuestion = quickTest.setAnswer.bind(quickTest, 0, 2);
    expect(setAnswerZeroQuestion).to.throw(Error);

    var setAnswerMoreThanMaxQuestion = quickTest.setAnswer.bind(quickTest, quickTest.getQuestionsCount() + 1, 2);
    expect(setAnswerMoreThanMaxQuestion).to.throw(Error);

    expect(quickTest.getAnswersCount()).to.equal(0);
  });

  it('can override answers', function() {
    quickTest.setAnswer(1, 2);
    quickTest.setAnswer(1, 3);
    expect(quickTest.getAnswer(1)).to.equal(3);
  });

  it('should save participant type', function() {
    quickTest.setParticipantType('self-employed');
    expect(quickTest.getParticipantType()).to.equal('self-employed');
  });

  it('should throw error when saving not allowed participant type and not save it', function() {
    var notAllowedParticipantType = 'asd';
    var notAllowedSetParticipantType = quickTest.setParticipantType.bind(quickTest, notAllowedParticipantType);
    expect(notAllowedSetParticipantType).to.throw(Error);
    expect(quickTest.getParticipantType()).to.not.equal(notAllowedParticipantType);
  });

  it('should have 0 result points if no answers were set for all the participants', function() {
    quickTest.setParticipantType('company');
    expect(quickTest.getResult().points).to.equal(0);
    quickTest.setParticipantType('self-employed');
    expect(quickTest.getResult().points).to.equal(0);
  });

  it('should have 5 result points for answers [1,2,0,2] of the participant \'company\'', function() {
    quickTest.setAnswer(1, 1);
    quickTest.setAnswer(2, 2);
    quickTest.setAnswer(3, 0);
    quickTest.setAnswer(4, 2);
    expect(quickTest.getResult().points).to.equal(5);
  });

  it('should have 6 result points for answers [1,2,0,2] of the participant \'self-employed\'', function() {
    quickTest.setParticipantType('self-employed');
    quickTest.setAnswer(1, 1);
    quickTest.setAnswer(2, 2);
    quickTest.setAnswer(3, 0);
    quickTest.setAnswer(4, 2);
    expect(quickTest.getResult().points).to.equal(6); // Math.floor(5*1.28)
  });

  it('should have the maximum number of points if a \'self-employed\' participant scores all answers highest', function() {
    var allowedAnswers = quickTest.getAllowedAnswers();
    var highestAnswer = allowedAnswers[allowedAnswers.length - 1];

    // set all answers to the highest answer
    for (var i = 1; i <= quickTest.getQuestionsCount(); i++) {
      quickTest.setAnswer(i, highestAnswer);
    }

    quickTest.setParticipantType('self-employed');
    expect(quickTest.getResult().points).to.equal(quickTest.getMaxPoints());
  });

  it('should have the maximum number of points if a \'company\' participant scores all answers highest', function() {
    var allowedAnswers = quickTest.getAllowedAnswers();
    var highestAnswer = allowedAnswers[allowedAnswers.length - 1];

    // set all answers to the highest answer
    for (var i = 1; i <= quickTest.getQuestionsCount(); i++) {
      quickTest.setAnswer(i, highestAnswer);
    }

    quickTest.setParticipantType('company');
    expect(quickTest.getResult().points).to.equal(quickTest.getMaxPoints());
  });

  it('should have correct previous questions for participant type \'company\'', function() {
    quickTest.setParticipantType('company');
    expect(quickTest.getPrevQuestion(0)).to.eql(null);
    for (var i = 1; i <= 28; i++) {
      expect(quickTest.getPrevQuestion(i)).to.eql(i - 1);
    }
    expect(quickTest.getPrevQuestion(29)).to.eql(27);
    expect(quickTest.getPrevQuestion(100)).to.eql(27);

    // invalid values
    expect(quickTest.getPrevQuestion('1')).to.eql(null);
    expect(quickTest.getPrevQuestion('7')).to.eql(null);
  });

  it('should have correct previous questions for participant type \'self-employed\'', function() {
    quickTest.setParticipantType('self-employed');
    // skipped: 7, 10, 11, 12, 13, 14 und 26

    expect(quickTest.getPrevQuestion(-1)).to.eql(null);
    expect(quickTest.getPrevQuestion(0)).to.eql(null);
    for (var i = 1; i <= 7; i++) {
      expect(quickTest.getPrevQuestion(i)).to.eql(i - 1);
    }
    expect(quickTest.getPrevQuestion(8)).to.eql(6);
    expect(quickTest.getPrevQuestion(9)).to.eql(8);
    for (i = 10; i <= 15; i++) {
      expect(quickTest.getPrevQuestion(i)).to.eql(9);
    }
    for (i = 16; i <= 26; i++) {
      expect(quickTest.getPrevQuestion(i)).to.eql(i - 1);
    }
    expect(quickTest.getPrevQuestion(27)).to.eql(25);
    expect(quickTest.getPrevQuestion(28)).to.eql(27);
    expect(quickTest.getPrevQuestion(29)).to.eql(27);
    expect(quickTest.getPrevQuestion(100)).to.eql(27);
    // ...

    // invalid values
    expect(quickTest.getPrevQuestion('1')).to.eql(null);
    expect(quickTest.getPrevQuestion('7')).to.eql(null);
  });

  it('should have correct next questions for participant type \'company\'', function() {
    quickTest.setParticipantType('company');
    var questionsCount = quickTest.getQuestionsCount();
    expect(quickTest.getNextQuestion(-2)).to.eql(0);
    expect(quickTest.getNextQuestion(-1)).to.eql(0);
    expect(quickTest.getNextQuestion(0)).to.eql(1);
    for (var i = 1; i <= questionsCount - 1; i++) {
      expect(quickTest.getNextQuestion(i)).to.eql(i + 1);
    }
    expect(quickTest.getNextQuestion(questionsCount)).to.eql(null);
    expect(quickTest.getNextQuestion(questionsCount + 1)).to.eql(null);
    expect(quickTest.getNextQuestion(100)).to.eql(null);

    // invalid values
    expect(quickTest.getNextQuestion('1')).to.eql(null);
    expect(quickTest.getNextQuestion('7')).to.eql(null);
  });

  it('should have correct next questions for participant type \'self-employed\'', function() {
    quickTest.setParticipantType('self-employed');

    expect(quickTest.getNextQuestion(-2)).to.eql(0);
    expect(quickTest.getNextQuestion(-1)).to.eql(0);
    expect(quickTest.getNextQuestion(0)).to.eql(1);

    // skipped: 7, 10, 11, 12, 13, 14 und 26
    for (var i = 1; i <= 5; i++) {
      expect(quickTest.getNextQuestion(i)).to.eql(i + 1);
    }
    expect(quickTest.getNextQuestion(6)).to.eql(8);
    for (i = 7; i <= 8; i++) {
      expect(quickTest.getNextQuestion(i)).to.eql(i + 1);
    }
    for (i = 9; i <= 14; i++) {
      expect(quickTest.getNextQuestion(i)).to.eql(15);
    }
    for (i = 15; i <= 24; i++) {
      expect(quickTest.getNextQuestion(i)).to.eql(i + 1);
    }
    expect(quickTest.getNextQuestion(25)).to.eql(27);
    expect(quickTest.getNextQuestion(27)).to.eql(null);
    expect(quickTest.getNextQuestion(28)).to.eql(null);
    expect(quickTest.getNextQuestion(29)).to.eql(null);
    expect(quickTest.getNextQuestion(100)).to.eql(null);
    // ...

    // invalid values
    expect(quickTest.getNextQuestion('1')).to.eql(null);
    expect(quickTest.getNextQuestion('7')).to.eql(null);
  });

});