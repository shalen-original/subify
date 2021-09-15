"use strict";

/**
 * SrtFileFormat Test
 */

require('import-export');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const sff = require('../dist/public/js/app/subtitles/file-formats/SrtFileFormat');

describe('Class SrtFileFormat', function() {
    
    describe('fromText(text)', function() {
        it('Correctly parses a single well formatted entry', function() {
            let text =  '1\n' + 
                    '12:34:56,789 --> 43:52:51,830\n' +
                    'The war is over.\n\n';
            
            let expected = [{
                index: 1, text: 'The war is over.',
                start: { _hours: 12, _minutes: 34, _seconds: 56, _milliseconds: 789 },
                end: { _hours: 43, _minutes: 52, _seconds: 51, _milliseconds: 830 }
            }];
            let actual = sff.fromText(text);

            expect(actual).to.deep.equal(expected);
        });
        it('Correctly parses a single well formatted entry with two lines of text', function() {
            let text =  '1\n' + 
                    '12:34:56,789 --> 43:52:51,830\n' +
                    'The war is over.\n' + 
                    'Winter has come.\n\n';
            
            let expected = [{
                index: 1, text: 'The war is over.\nWinter has come.',
                start: { _hours: 12, _minutes: 34, _seconds: 56, _milliseconds: 789 },
                end: { _hours: 43, _minutes: 52, _seconds: 51, _milliseconds: 830 }
            }];
            let actual = sff.fromText(text);

            expect(actual).to.deep.equal(expected);
        });
        it('Correctly parses two well-formatted entries', function() {
            let text =  '1\n' + 
                    '12:34:56,789 --> 43:52:51,830\n' +
                    'The war is over.\n' + 
                    'Winter has come.\n\n' +
                    '2\n' +
                    '24:39:20,285 --> 63:17:21,701\n' +
                    'The war is not over.\n\n';
          
            let expected = [
              {
                index: 1, text: 'The war is over.\nWinter has come.',
                start: { _hours: 12, _minutes: 34, _seconds: 56, _milliseconds: 789 },
                end: { _hours: 43, _minutes: 52, _seconds: 51, _milliseconds: 830 }
              },
              {
                index: 2, text: 'The war is not over.',
                start: { _hours: 24, _minutes: 39, _seconds: 20, _milliseconds: 285 },
                end: { _hours: 63, _minutes: 17, _seconds: 21, _milliseconds: 701 }
              }
            ];
            let actual = sff.fromText(text);

            expect(actual).to.deep.equal(expected);

        });
        it('Throws an error with random text', function() {
            let text = 'asd';
            expect(function() { 
                sff.fromText(text) 
            }).to.throw(/Incorrectly formatted SRT/);
        });
        it('Throws an error if the last line of the string is not empty', function() {
            let text =  '1\n' + 
                    '12:34:56,789 --> 43:52:51,830\n' +
                    'The war is over.\n' + 
                    'Winter has come.\n\n' +
                    '2\n' +
                    '24:39:20,285 --> 63:17:21,701\n' +
                    'The war is not over.\n';
            expect(function() { 
                sff.fromText(text) 
            }).to.throw(/Incorrectly formatted SRT/);
        });
        it('Throws an error if the entry index is malformed', function() {
            let text =  '1\n' + 
                    '12:34:56,789 --> 43:52:51,830\n' +
                    'The war is over.\n' + 
                    'Winter has come.\n\n' +
                    '2ERROR\n' +
                    '24:39:20,285 --> 63:17:21,701\n' +
                    'The war is not over.\n\n';
            expect(function() { 
                sff.fromText(text) 
            }).to.throw(/Index line malformed/);
        });
        it('Throws an error if the entry time is malformed', function() {
            let text =  '1\n' + 
                    '12:34:56,789 --> 43:52:51,830\n' +
                    'The war is over.\n' + 
                    'Winter has come.\n\n' +
                    '2\n' +
                    '24:ad39:20,285 --> 63:17:21,701\n' +
                    'The war is not over.\n\n';
            expect(function() { 
                sff.fromText(text) 
            }).to.throw(/Time line malformed/);
        });

    });

});
