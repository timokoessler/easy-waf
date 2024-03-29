import testServer from './test-server';
import request from 'supertest';

jest.useFakeTimers();

testServer.init({
    disableLogging: true,
    modules: {
        fakeCrawlers: {
            enabled: true,
        },
    },
});

describe('Fake Googlebot', () => {
    test('Request should be blocked', () => {
        return request(testServer.app)
            .get('/get')
            .set(
                'User-Agent',
                'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36',
            )
            .then((response) => {
                expect(response.statusCode).toBe(403);
            });
    });
});
