import testServer from './test-server';
import request from 'supertest';

jest.useFakeTimers();

testServer.init({
    allowedHTTPMethods: ['GET', 'POST'],
    disableLogging: true,
    modules: {
        fakeCrawlers: {
            enabled: false,
        },
    },
    preBlockHook: async (req, moduleName, ip) => {
        const path = req.url.match('^[^?]*');
        if (moduleName === 'xss' && ['::1', '127.0.0.1', '::ffff:127.0.0.1'].includes(ip) && path?.length && path[0] === '/test') {
            //Do not block xss from localhost at path /test
            return false;
        }
        return true;
    },
    postBlockHook: () => {
        //
    },
});

describe('Hooks', function () {
    test('Request should be blocked', () => {
        return request(testServer.app)
            .get('/get?q=<script>alert("Test");</script>')
            .then((response) => {
                expect(response.statusCode).toBe(403);
            });
    });
    test('Request should not be blocked', () => {
        return request(testServer.app)
            .get('/test?q=<script>alert("Test");</script>')
            .then((response) => {
                expect(response.statusCode).toBe(404);
            });
    });
});
