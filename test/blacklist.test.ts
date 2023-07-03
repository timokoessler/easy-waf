import testServer from './test-server';
import request from 'supertest';

jest.useFakeTimers();

testServer.init({
    disableLogging: true,
    ipBlacklist: ['::1', '127.0.0.1', '::ffff:127.0.0.1'],
    trustProxy: 0,
    modules: {
        fakeCrawlers: {
            enabled: false,
        },
    },
});

test('Request should be blocked (ip blacklist)', () => {
    return request(testServer.app)
        .get('/get')
        .then(response => {
            expect(response.statusCode).toBe(403);
    });
});