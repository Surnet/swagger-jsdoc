'use strict';

// Dependencies.
var exec = require('child_process').exec;

describe('command line interface', function () {

  it('help menu works', function (done) {
    var helpCommand = process.env.PWD + '/bin/swagger-jsdoc.js -h';
    console.log(helpCommand);
    exec(helpCommand, function (error, stdout, stderr) {
      console.log(stdout);
    });
    done();
  });


});
