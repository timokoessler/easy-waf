/* eslint-disable jest/valid-title */
const testServer = require('./test-server');
const request = require('supertest');

jest.useFakeTimers();

testServer.init({
    allowedHTTPMethods: ['GET', 'POST'],
    disableLogging: true,
    preBlockHook: (req, moduleInfo, ip) => {
        if (moduleInfo.name === 'xss'
            && ['::1', '127.0.0.1', '::ffff:127.0.0.1'].includes(ip)
            && req.url.match('^[^?]*')[0] === '/test') { //Do not block xss from localhost at path /test
            return false;
        }
    }
});

describe('Hooks', function () {
    test('Request should be blocked', () => {
        return request(testServer.app)
            .get('/get?q=<script>alert("Test");</script>')
            .then(response => {
                expect(response.statusCode).toBe(403);
            });
    });
    test('Request should not be blocked', () => {
        return request(testServer.app)
            .get('/test?q=<script>alert("Test");</script>')
            .then(response => {
                expect(response.statusCode).toBe(404);
            });
    });
});