import testServer from './test-server';
import request from 'supertest';

jest.useFakeTimers();

global.console.warn = (msg) => {
    if (msg.startsWith('EasyWAF DryMode - Blocked:')) {
        expect(msg).toMatch(/^EasyWAF DryMode - Blocked: ip=.* module=(xss|uriMalformed) time=.* url="\/get.*" ua="*" method=GET rid=.*/);
    } else {
        expect(msg).toMatch(/^EasyWAF - Warning: DryMode is enabled\..*/);
    }
};

testServer.init({
    dryMode: true,
    modules: {
        fakeCrawlers: {
            enabled: false,
        },
    },
});

describe('Module options', function () {
    test('Dry mode should be enabled and logged', () => {
        return request(testServer.app)
            .get('/get?q=<script>alert("Test");</script>')
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });
    test('Malformed Url should not be blocked', () => {
        return request(testServer.app)
            .get('/get?%E0%A4%A')
            .then((response) => {
                expect(response.statusCode).toBe(200);
            });
    });
});
