ecg-quicktest-model
===================

JavaScript Model for the ECG quick test

### Build Status
[![Build Status](https://travis-ci.org/ecogood/ecg-quicktest-model.svg?branch=master)](https://travis-ci.org/ecogood/ecg-quicktest-model)

## Use

```javascript
var quickTestModel = require('ecg-quicktest-model');
var quickTest = quickTestModel.factory(); // create test for matrix version 4.1

quickTest.getQuestionsCount(); // how many questions are in the test, e.g. 27
quickTest.getAllowedAnswers(); // e.g. [0, 1, 2, 3, 4]
quickTest.getAllowedParticipantTypes(); // e.g. ['company', 'self-employed']

// set the participant type (default is 'company')
quickTest.setParticipantType('self-employed');

// start answering
quickTest.setAnswer(1, 3); // answer the first question with the value 3
quickTest.setAnswer(2, 4); // answer the second question with the value 4
// set the other answers

// get the results
quickTest.getResult().points; // return the achieved points
```

## Testing

Run the tests:

``npm test``

The model is tested with [Mocha](http://visionmedia.github.io/mocha/) and [Chai](http://chaijs.com/).

## Roadmap

* Create a JS model for the quick test and test it with mocha.

## Installation

Requirements:

* Node.js 0.10.x

```
npm install --save ecg-quicktest-model
```

## Contributing

Feel free to contribute to the Roadmap or otherwise.

You can:

* collaborate through GitHub ([See how in this video](https://www.youtube.com/watch?v=SCZF6I-Rc4I#t=1m19s)):
  * fork the repository
  * make changes
  * If you can, run ``npm test`` to make sure that the tests are still running successfully after your changes.
  * send a pull request
* email the translated files to the main developer, see below.

### Issues and Features

Share issues and desired features [in GitHub](https://github.com/ecogood/ecg-quicktest-texts/issues).

## License

[MIT License](LICENSE).

## Developers

* [Nikolay Georgiev](http://nikolay-georgiev.net/), main developer, ECG Berlin.

## Release History

* 0.0.1 - added quick test 4.1 with tests and how to use.