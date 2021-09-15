"use strict";

/**
 * Pages Controller Test
 */

/* Imports */
var mocks = require('node-mocks-http');
var chai = require('chai');
var assert = chai.assert;

/* Controller */
var pagesController = require('../dist/controllers/pages');

/* Customize res and req object */
function createCustomResponse() {
    return Object.assign(mocks.createResponse(), {
        render: function(view, data) {
            this.view = view;
            this.data = data;
        }
    });
};

function createCustomRequest(url) {
    return mocks.createRequest({
        method: 'GET',
        url: url,
        app: { locals: {}}
    });
};

/* Test pages controller */
describe('pages', function() {
    
    var req, res;
    afterEach(function() { 
        req = null;
        res = null;
    });

    /* Test index route */
    describe('index', function() {
        beforeEach(function() {
            req = createCustomRequest('/');
            res = createCustomResponse();
        });
        it("should return statusCode 200", function() {
            pagesController.index(req, res);
            assert.equal(200, res.statusCode);
        });
        it("should provide index view name and title", function() {
            pagesController.index(req, res);
            assert.equal("pages/home", res.view);
            assert.equal("Home", res.data.title);
        });
    });

    /* Test docs route */ // Removed
    /*
    describe('docs', function() {
        beforeEach(function() {
            req = createCustomRequest('/docs');
            res = createCustomResponse();
        });
        it("should return statusCode 200", function() {
            pagesController.docs(req, res);
            assert.equal(200, res.statusCode);
        });
        it("should provide docs view name and title", function() {
            pagesController.docs(req, res);
            assert.equal("pages/docs", res.view);
            assert.equal("Documentation", res.data.title);
        });
    });*/

    /* Test app route */
    describe('app', function() {
        beforeEach(function() {
            req = createCustomRequest('/app');
            res = createCustomResponse();
        });
        it("should return statusCode 200", function() {
            pagesController.app(req, res);
            assert.equal(200, res.statusCode);
        });
        it("should provide app view name and title", function() {
            pagesController.app(req, res);
            assert.equal("app", res.view);
            assert.equal("Subify", res.data.title);
        });
    });

    /* Test about route */
    describe('about', function() {
        beforeEach(function() {
            req = createCustomRequest('/about');
            res = createCustomResponse();
        });
        it("should return statusCode 200", function() {
            pagesController.about(req, res);
            assert.equal(200, res.statusCode);
        });
        it("should provide about view name and title", function() {
            pagesController.about(req, res);
            assert.equal("pages/about", res.view);
            assert.equal("About", res.data.title);
        });
    });

    /* Test 404 route */
    describe('error', function() {
        beforeEach(function() {
            req = createCustomRequest('/foo/bar')
            res = createCustomResponse();
        });
        it("should return statusCode 404", function() {
            pagesController.error(req, res);
            assert.equal(404, res.statusCode);
        });
        it("should provide 404 view name and title", function() {
            pagesController.error(req, res);
            assert.equal("pages/404", res.view);
            assert.equal("Page not found", res.data.title);
        });
    });
});