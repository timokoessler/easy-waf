/* eslint-disable jest/valid-title */
const testServer = require('./test-server');
const request = require('supertest');

jest.useFakeTimers();

global.console = {
    warn: (msg) => {
        if(msg.startsWith('EasyWAF DryMode - Blocked:')){
            expect(msg).toMatch(/^EasyWAF DryMode - Blocked: ip=.* module=xss time=.* url="\/get\?q=.*" rid=.*/);
        } else {
            expect(msg).toMatch(/^EasyWAF - Warning: DryMode is enabled\..*/);
        }
    }
};

testServer.init({
    allowedHTTPMethods: ['GET', 'POST'],
    dryMode: true
});

describe('Module options', function() {
    test('Dry mode should be enabled and logged', () => {
        return request(testServer.app)
            .get('/get?q=<script>alert("Test");</script>')
            .then(response => {
                expect(response.statusCode).toBe(200);
        });
    });

});