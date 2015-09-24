'use strict';

//dependencies
var _ = require('lodash');
var fs = require('fs');
var async = require('async');
var shell = require('python-shell');
var tmp = require('tmp');
tmp.setGracefulCleanup();

function fileExists(path, done) {
    fs.stat(path, function(error) {
        if (error) {
            error = new Error('No such file or directory');
            done(error);
        } else {
            done();
        }
    });
}

module.exports = function(xlsFormPath, done) {
    //check if XLSForm path provided
    if (!xlsFormPath || _.isFunction(xlsFormPath)) {
        done = xlsFormPath;

        var error = new Error('No XLSForm path provided');

        done(error);
    }

    //continue with conversion
    else {

        //generate temp output path in os temporary directory
        var outputPath = tmp.fileSync(Date.now() * (Math.random() * 9));

        async.waterfall([
            //validate if path exists
            function xlsFormExists(next) {
                fileExists(xlsFormPath, next);
            },

            //convert
            function convert(next) {

                shell.run('xls2xform.py', {
                    mode: 'json',
                    args: [xlsFormPath, outputPath.name]
                }, next);

            },

            //process response
            function respond(response, next) {

                response =
                    _.isArray(response) ? _.first(response) : response;

                response.xform =
                    fs.readFileSync(outputPath.name, 'utf-8');

                response = _.omit(response, 'message', 'code');

                next(null, response);

            }
        ], done);
    }
};