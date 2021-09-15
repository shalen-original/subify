"use strict";

/**
 * SubtitleTime Test
 */

require('import-export');
const chai = require('chai');
const expect = chai.expect;

const SubtitleTime = require('../dist/public/js/app/subtitles/SubtitleTime');

describe('Class SubtitleTime', function() {

    var st;
    beforeEach(function() { st = new SubtitleTime(); });
    afterEach(function() { st = null; });

    describe('constructor()', function()  {
        it('Sets hours and minutes to zero', function()  {
            expect(st.hours).to.equal(0);
            expect(st.minutes).to.equal(0);
        });
        it('Sets seconds and milliseconds to zero', function()  {
            expect(st.seconds).to.equal(0);
            expect(st.milliseconds).to.equal(0);
        });
    });
    describe('set hours(hours)', function()  {
        it('Correctly sets the number of hours', function()  {
            st.hours = 10;
            expect(st.hours).to.equal(10);
        });
        it('Refuses a non-integer number', function()  {
            expect( _ => {st.hours = 1.3;}).to.throw(/integer/);
        });
        it('Refuses a non-positive integer', function()  {
            expect( _ => {st.hours = -2;}).to.throw(/positive/);
        });
    });
    describe('set minutes(minutes)', function()  {
        it('Correctly sets the number of minutes', function()  {
            st.minutes = 59;
            expect(st.minutes).to.equal(59);
        });
        it('Refuses a non-integer number', function()  {
            expect( _ => {st.minutes = 1.3;}).to.throw(/integer/);
        });
        it('Refuses a non-positive integer', function()  {
            expect( _ => {st.minutes = -2;}).to.throw(/between 0 and 59/);
        });
        it('Refuses an integer greater than 59', function()  {
            expect( _ => {st.minutes = 60;}).to.throw(/between 0 and 59/);
        });
    });
    describe('set seconds(seconds)', function()  {
        it('Correctly sets the number of seconds', function()  {
            st.seconds = 59;
            expect(st.seconds).to.equal(59);
        });
        it('Refuses a non-integer number', function()  {
            expect( _ => {st.seconds = 1.3;}).to.throw(/integer/);
        });
        it('Refuses a non-positive integer', function()  {
            expect( _ => {st.seconds = -2;}).to.throw(/between 0 and 59/);
        });
        it('Refuses an integer greater than 59', function()  {
            expect( _ => {st.seconds = 60;}).to.throw(/between 0 and 59/);
        });
    });
    describe('set milliseconds(milliseconds)', function()  {
        it('Correctly sets the number of milliseconds', function()  {
            st.milliseconds = 59;
            expect(st.milliseconds).to.equal(59);
        });
        it('Refuses a non-integer number', function()  {
            expect( _ => {st.milliseconds = 1.3;}).to.throw(/integer/);
        });
        it('Refuses a non-positive integer', function()  {
            expect( _ => {st.milliseconds = -2;}).to.throw(/between 0 and 999/);
        });
        it('Refuses an integer greater than 999', function()  {
            expect( _ => {st.milliseconds = 1000;}).to.throw(/between 0 and 999/);
        });
    });
    describe('toMilliseconds()', function()  {
        it('Correctly converts the time to milliseconds', function()  {
            st.hours = 12;
            st.minutes = 34;
            st.seconds = 56;
            st.milliseconds = 789;
            expect(st.toMilliseconds()).to.equal(45296789);
        });
    });
    describe('getPaddedHours()', function() {
        it('Paddes with zeros a single-digit number', function() {
            st.hours = 1;
            expect(st.getPaddedHours()).to.equal("01");
        });
        it('Lefts unchanged two-digit numbers', function() {
            st.hours = 11;
            expect(st.getPaddedHours()).to.equal("11");
        });
    });
    describe('getPaddedMinutes()', function() {
        it('Paddes with zeros a single-digit number', function() {
            st.minutes = 1;
            expect(st.getPaddedMinutes()).to.equal("01");
        });
        it('Lefts unchanged two-digit numbers', function() {
            st.minutes = 11;
            expect(st.getPaddedMinutes()).to.equal("11");
        });
    });
    describe('getPaddedSeconds()', function() {
        it('Paddes with zeros a single-digit number', function() {
            st.seconds = 1;
            expect(st.getPaddedSeconds()).to.equal("01");
        });
        it('Lefts unchanged two-digit numbers', function() {
            st.seconds = 11;
            expect(st.getPaddedSeconds()).to.equal("11");
        });
    });
    describe('getPaddedMilliseconds()', function() {
        it('Paddes with zeros a single-digit number', function() {
            st.milliseconds = 1;
            expect(st.getPaddedMilliseconds()).to.equal("001");
        });
        it('Lefts unchanged three-digit numbers', function() {
            st.milliseconds = 111;
            expect(st.getPaddedMilliseconds()).to.equal("111");
        });
    });
    describe('toString()', function()  {
        it('Correctly returns the string that represents this time', function()  {
            st.hours = 12;
            st.minutes = 34;
            st.seconds = 56;
            st.milliseconds = 789;
            expect(st.toString()).to.equal('12:34:56,789');
        });
        it('Pads with zero if there is an element with only one digit', function() {
            st.hours = 1;
            st.minutes = 2;
            st.seconds = 3;
            st.milliseconds = 4;
            expect(st.toString()).to.equal('01:02:03,004');
        });
    });
    describe('fromString()', function() {
        it('Returns a correctly initialized SubtitleTime given a well-formed time string', function() {
            let str = '23:14:26,948';
            let st = SubtitleTime.fromString(str);

            expect(st.hours).to.equal(23);
            expect(st.minutes).to.equal(14);
            expect(st.seconds).to.equal(26);
            expect(st.milliseconds).to.equal(948);
        });
        it('Throws an error if a garbage string is given', function() {
            let str2 = 'Lorem ipsum';
            expect( _ => {SubtitleTime.fromString(str2);}).to.throw(/not in the expected format/);
        });
    });
    describe('add()', function() {
        it('Correctly adds a time to another one', function () {
            let str1 = '12:34:56,789';
            let str2 = '02:30:15,400';

            let st1 = SubtitleTime.fromString(str1);
            let st2 = SubtitleTime.fromString(str2);

            let ans = st1.add(st2);

            expect(ans.milliseconds).to.equal(189);
            expect(ans.seconds).to.equal(12);
            expect(ans.minutes).to.equal(5);
            expect(ans.hours).to.equal(15);
        });
        it('Does not modify any of the original SubtitleTime object', function () {
            let str1 = '12:34:56,789';
            let str2 = '02:30:15,400';

            let st1 = SubtitleTime.fromString(str1);
            let st2 = SubtitleTime.fromString(str2);

            let ans = st1.add(st2);

            expect(st1.milliseconds).to.equal(789);
            expect(st1.seconds).to.equal(56);
            expect(st1.minutes).to.equal(34);
            expect(st1.hours).to.equal(12);
            expect(st2.milliseconds).to.equal(400);
            expect(st2.seconds).to.equal(15);
            expect(st2.minutes).to.equal(30);
            expect(st2.hours).to.equal(2);
            
        });
    });
    describe('subtract()', function() {
        it('Correctly subtracts one time from another', function() {
            let str1 = '12:34:26,589';
            let str2 = '02:40:55,800';

            let st1 = SubtitleTime.fromString(str1);
            let st2 = SubtitleTime.fromString(str2);

            let ans = st1.subtract(st2);

            expect(ans.milliseconds).to.equal(789);
            expect(ans.seconds).to.equal(30);
            expect(ans.minutes).to.equal(53);
            expect(ans.hours).to.equal(9);
        });
        it('Does not modify any of the original SubtitleTime object', function () {
            let str1 = '12:34:56,789';
            let str2 = '02:30:15,400';

            let st1 = SubtitleTime.fromString(str1);
            let st2 = SubtitleTime.fromString(str2);

            let ans = st1.subtract(st2);

            expect(st1.milliseconds).to.equal(789);
            expect(st1.seconds).to.equal(56);
            expect(st1.minutes).to.equal(34);
            expect(st1.hours).to.equal(12);
            expect(st2.milliseconds).to.equal(400);
            expect(st2.seconds).to.equal(15);
            expect(st2.minutes).to.equal(30);
            expect(st2.hours).to.equal(2);
        });
        it('Returns 00:00:00,000 if the second time is greater than the first one', function() {
            let str1 = '01:34:56,789';
            let str2 = '02:30:15,400';

            let st1 = SubtitleTime.fromString(str1);
            let st2 = SubtitleTime.fromString(str2);

            let ans = st1.subtract(st2);

            expect(ans.milliseconds).to.equal(0);
            expect(ans.seconds).to.equal(0);
            expect(ans.minutes).to.equal(0);
            expect(ans.hours).to.equal(0);
        });
    });

});
