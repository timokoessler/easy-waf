const testServer = require('./test-server');
const request = require('supertest');

jest.useFakeTimers();

process.env.TEST_FAKE_SEARCH_CRAWLERS = 2;

testServer.init({
    disableLogging: true,
    modules: {
        fakeSearchCrawlers: {
            enabled: true
        }
    },
});

describe('Fake Googlebot', function () {
    test('Request should be blocked', () => {
        return request(testServer.app)
            .get('/get')
            .set('User-Agent', 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36')
            .then(response => {
                expect(response.statusCode).toBe(403);
            });
    });
});