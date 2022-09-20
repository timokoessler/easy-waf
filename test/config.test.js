/* eslint-disable jest/valid-title */
const testServer = require('./test-server');
const request = require('supertest');

testServer.init({
    allowedHTTPMethods: ['GET', 'POST'],
    disableLogging: true,
    redirectUrlWhitelist: ['github.com'],
    modules: {
        directoryTraversal: {
            enabled: true,
            excludePaths: /^\/exclude\/$/i
        },
        xss: {
            enabled: false
        },
        prototypePollution: {
            enabled: false
        },
        sqlInjection: {
            enabled: false
        },
        noSqlInjection: {
            enabled: false
        },
        badBots: {
            enabled: false
        },
        crlfInjection: {
            enabled: false
        }
    },
});

describe('Allowed HTTP methods', function() {
    test('Block HTTP Put', () => {
        return request(testServer.app)
            .put('/')
            .then(response => {
                expect(response.statusCode).toBe(403);
        });
    });
    test('ALLOW HTTP GET', () => {
        return request(testServer.app)
            .get('/')
            .then(response => {
                expect(response.statusCode).toBe(404);
        });
    });
});
describe('Module options', function() {
    test('XSS module should be disabled', () => {
        return request(testServer.app)
            .get('/get?q=<script>alert("Test");</script>')
            .then(response => {
                expect(response.statusCode).toBe(200);
        });
    });
    test('Directory traversal should be enabled', () => {
        return request(testServer.app)
            .get('/get?q=../etc/')
            .then(response => {
                expect(response.statusCode).toBe(403);
        });
    });
    test('Directory traversal check should be disabled for /exclude/', () => {
        return request(testServer.app)
            .get('/exclude/?file=../secret.txt')
            .then(response => {
                expect(response.statusCode).toBe(404);
        });
    });
    test('Directory traversal check should be enabled for /exclude-t/', () => {
        return request(testServer.app)
            .get('/exclude-t/?file=../secret.txt')
            .then(response => {
                expect(response.statusCode).toBe(403);
        });
    });
});
describe('Open Redirect', function() {
    test('Allow github.com', () => {
        return request(testServer.app)
            .get('/get?q=https://github.com/test&q=5')
            .then(response => {
                expect(response.statusCode).toBe(200);
        });
    });
    test('Block hacker.com', () => {
        return request(testServer.app)
            .get('/get?redirect=https://hacker.com/42')
            .then(response => {
                expect(response.statusCode).toBe(403);
        });
    });
});