"use strict";

/**
 * Server Test
 */

/* Imports */
var chai = require('chai');
var assert = chai.assert;
let should = chai.should();
let chaiHttp = require('chai-http');
let server = require('../dist/server');

chai.use(chaiHttp);

/* Test server routes */
describe('routes', function() {

    after(function() {
        server.close();
    });
    
    /* / route */
    describe('/', function() {
        it('should exist', (done) => {
            chai.request(server)
                .get('/')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    /* docs route */ // Removed
    /*
    describe('/docs', function() {
        it('should exist', (done) => {
            chai.request(server)
                .get('/docs')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });*/

    /* app route */
    describe('/app', function() {
        it('should exist', (done) => {
            chai.request(server)
                .get('/app')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    /* about route */
    describe('/about', function() {
        it('should exist', (done) => {
            chai.request(server)
                .get('/about')
                .end((err, res) => {
                    res.should.have.status(200);
                    done();
                });
        });
    });

    /* cv route */
    describe('/*', function() {
        it('should return 404', (done) => {
            chai.request(server)
                .get('/foo/bar')
                .end((err, res) => {
                    res.should.have.status(404);
                    done();
                });
        });
    });
});