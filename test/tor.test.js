/* eslint-disable jest/valid-title */
const testServer = require('./test-server');
const request = require('supertest');
const blockTorExitNodes = require('../lib/modules/blockTorExitNodes');

jest.useFakeTimers();

testServer.init({
    allowedHTTPMethods: ['GET', 'POST'],
    disableLogging: true,
    modules: {
        blockTorExitNodes: {
            enabled: true
        }
    }
});

test('Request should not be blocked', () => {
    return request(testServer.app)
        .get('/get')
        .then(response => {
            expect(response.statusCode).toBe(200);
    });
});

// eslint-disable-next-line jest/no-done-callback, jest/expect-expect
test('Test if Tor Exit Node List GET Request works', (done) => {
    blockTorExitNodes.updateTorExitNodesList((torExitNodes) => {
        if(torExitNodes.length == 0){
            done(new Error());
            return;
        }
        done();
    });
});