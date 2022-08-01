/* eslint-disable jest/valid-title */
const testServer = require('./test-server');
const request = require('supertest');

jest.useFakeTimers();

testServer.init({
    allowedHTTPMethods: ['GET', 'POST'],
    disableLogging: true,
    ipBlacklist: ['::1', '127.0.0.1', '::ffff:127.0.0.1'],
});

test('Request should be blocked (ip blacklist)', () => {
    return request(testServer.app)
        .get('/get')
        .then(response => {
            expect(response.statusCode).toBe(403);
    });
});