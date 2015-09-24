'use strict';

//dependencie
var path = require('path');
var expect = require('chai').expect;
var xls2xform = require(path.join(__dirname, '..'));
var simpleXlsForm = path.join(__dirname, 'xls', 'simple.xls');

describe('xls2xform', function() {

    it('should be a function', function(done) {
        expect(xls2xform).to.be.a('function');
        done();
    });

    it('should be able to return `No XLSForm path provided` when no XLSForm path provided', function(done) {
        xls2xform(function(error, response) {

            expect(error).to.exist;
            expect(response).to.not.exist;
            expect(error.message).to.equal('No XLSForm path provided');

            done();
        });
    });

    it('should be able to return `No such file or directory` when no XLSForm file found', function(done) {
        xls2xform('12345', function(error, response) {

            expect(error).to.exist;
            expect(response).to.not.exist;
            expect(error.message).to.equal('No such file or directory');

            done();
        });
    });

    it('should be able to convert XLSForm to xForm', function(done) {
        xls2xform(simpleXlsForm, function(error, response) {

            expect(error).to.not.exist;
            expect(response).to.exist;
            expect(response.warnings).to.exist;
            expect(response.xform).to.exist;

            done();
        });
    });
});