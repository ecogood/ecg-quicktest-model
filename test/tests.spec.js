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
      expect(quickTest.getAllowedParticipants().length).to.be.above(0);
    });
  });

  it('should have maximum points > 0', function() {
    quickTests.forEach(function(quickTest) {
      quickTest.setParticipantType(quickTest.getAllowedParticipants()[0]);
      expect(quickTest.getMaxPoints()).to.be.above(0);
      quickTest.setParticipantType(quickTest.getAllowedParticipants()[1]);
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
    quickTest.setAnswer(0, 2);
    expect(quickTest.getAnswer(0)).to.equal(2);
  });

  it('should throw error when saving not allowed answer and not save it', function() {
    var notAllowedSetAnswer = quickTest.setAnswer.bind(quickTest, 0, 'asd');
    expect(notAllowedSetAnswer).to.throw(Error);
    expect(quickTest.getAnswersCount()).to.equal(0);
  });

  it('should throw error when saving an answer for non-existing question', function() {
    var notAllowedSetAnswer = quickTest.setAnswer.bind(quickTest, quickTest.getQuestionsCount(), 2);
    expect(notAllowedSetAnswer).to.throw(Error);
  });

  it('can override answers', function() {
    quickTest.setAnswer(0, 2);
    quickTest.setAnswer(0, 3);
    expect(quickTest.getAnswer(0)).to.equal(3);
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
    quickTest.setAnswer(0, 1);
    quickTest.setAnswer(1, 2);
    quickTest.setAnswer(2, 0);
    quickTest.setAnswer(3, 2);
    expect(quickTest.getResult().points).to.equal(5);
  });

  it('should have 6 result points for answers [1,2,0,2] of the participant \'self-employed\'', function() {
    quickTest.setParticipantType('self-employed');
    quickTest.setAnswer(0, 1);
    quickTest.setAnswer(1, 2);
    quickTest.setAnswer(2, 0);
    quickTest.setAnswer(3, 2);
    expect(quickTest.getResult().points).to.equal(6); // Math.floor(5*1.28)
  });

  it('should have the maximum number of points if a \'self-employed\' participant scores all answers highest', function() {
    var allowedAnswers = quickTest.getAllowedAnswers();
    var highestAnswer = allowedAnswers[allowedAnswers.length - 1];

    // set all answers to the highest answer
    for (var i = 0; i < quickTest.getQuestionsCount(); i++) {
      quickTest.setAnswer(i, highestAnswer);
    }

    quickTest.setParticipantType('self-employed');
    expect(quickTest.getResult().points).to.equal(quickTest.getMaxPoints());
  });

  it('should have the maximum number of points if a \'company\' participant scores all answers highest', function() {
    var allowedAnswers = quickTest.getAllowedAnswers();
    var highestAnswer = allowedAnswers[allowedAnswers.length - 1];

    // set all answers to the highest answer
    for (var i = 0; i < quickTest.getQuestionsCount(); i++) {
      quickTest.setAnswer(i, highestAnswer);
    }

    quickTest.setParticipantType('company');
    expect(quickTest.getResult().points).to.equal(quickTest.getMaxPoints());
  });

});