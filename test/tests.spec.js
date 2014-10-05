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

  describe('should create a test', function() {
    it('with function getQuestionsCount()', function() {
      var quickTest = quickTestModel.factory();
      expect(quickTest).to.have.property('getQuestionsCount');
    });
  });

});