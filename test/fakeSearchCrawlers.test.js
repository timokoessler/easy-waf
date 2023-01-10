/* eslint-disable jest/no-done-callback */
const fakeSearchCrawlers = require('../lib/modules/fakeSearchCrawlers');

jest.setTimeout(5000);
jest.useFakeTimers();

fakeSearchCrawlers.init({
    disableLogging: true,
    modules: {
        fakeSearchCrawlers: {
            enabled: true
        }
    },
});

describe('DuckDuckBot', () => {
    test('Disallow (whitelist not loaded)', async () => {
        const ok = await fakeSearchCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: {
                'user-agent': 'DuckDuckBot/X.0; (+http://duckduckgo.com/duckduckbot.html)'
            },
            ip: '40.88.21.235',
            method: 'GET',
            path: '/test',
            ua: 'DuckDuckBot/X.0; (+http://duckduckgo.com/duckduckbot.html)'
        });
        expect(ok).toBe(false);
    });
});

describe('Googlebot', () => {
    test('Allow', async () => {
        const ok = await fakeSearchCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: {
                'user-agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36'
            },
            ip: '66.249.90.77',
            method: 'GET',
            path: '/test',
            ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36'
        });
        expect(ok).toBe(true);
    });
    test('Block', async () => {
        const ok = await fakeSearchCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: {
                'user-agent': 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36'
            },
            ip: '1.1.1.1',
            method: 'GET',
            path: '/test',
            ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36'
        });
        expect(ok).toBe(false);
    });
});

describe('Bing', () => {
    test('Allow', async () => {
        const ok = await fakeSearchCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: {
                'user-agent': 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
            },
            ip: '157.55.39.1',
            method: 'GET',
            path: '/test',
            ua: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
        });
        expect(ok).toBe(true);
    });
    test('Block', async () => {
        const ok = await fakeSearchCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: {
                'user-agent': 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
            },
            ip: '1.1.1.1',
            method: 'GET',
            path: '/test',
            ua: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)'
        });
        expect(ok).toBe(false);
    });
});
describe('DuckDuckBot 2', () => {
    test('Sleep 1 second', async () => {
        const foo = true;
        jest.useRealTimers();
        await new Promise((r) => setTimeout(r, 1000));
        expect(foo).toBeDefined();
        jest.useFakeTimers();
    });
    test('Allow (whitelist loaded)', async () => {
        const ok = await fakeSearchCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: {
                'user-agent': 'DuckDuckBot/X.0; (+http://duckduckgo.com/duckduckbot.html)'
            },
            ip: '40.88.21.235',
            method: 'GET',
            path: '/test',
            ua: 'DuckDuckBot/X.0; (+http://duckduckgo.com/duckduckbot.html)'
        });
        expect(ok).toBe(true);
    });
});