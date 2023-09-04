/* eslint-disable @typescript-eslint/ban-ts-comment */
import fakeCrawlers from '../src/modules/fakeCrawlers';

jest.useFakeTimers();
jest.setTimeout(5000);

process.env.TEST_FAKE_CRAWLERS = 'do not load whitelist';

fakeCrawlers.init({
    disableLogging: true,
    modules: {
        fakeCrawlers: {
            enabled: true,
        },
    },
});

describe('DuckDuckBot', () => {
    test('Disallow (whitelist not loaded)', async () => {
        const ok = await fakeCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: 'user-agent: DuckDuckBot/X.0; (+http://duckduckgo.com/duckduckbot.html)',
            ip: '40.88.21.235',
            method: 'GET',
            path: '/test',
            ua: 'DuckDuckBot/X.0; (+http://duckduckgo.com/duckduckbot.html)',
            query: {},
            // @ts-ignore
            rawReq: undefined,
        });
        expect(ok).toBe(false);
    });
});

describe('IP whitelist', () => {
    test('Load', async () => {
        await fakeCrawlers.updateIPWhitelist();
    }, 20000);
});

describe('Googlebot', () => {
    test('Allow', async () => {
        const ok = await fakeCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers:
                'user-agent: Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36',
            ip: '66.249.90.77',
            method: 'GET',
            path: '/test',
            ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36',
            query: {},
            // @ts-ignore
            rawReq: undefined,
        });
        expect(ok).toBe(true);
    });
    test('Block', async () => {
        const ok = await fakeCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers:
                'user-agent: Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36',
            ip: '1.1.1.1',
            method: 'GET',
            path: '/test',
            ua: 'Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; Googlebot/2.1; +http://www.google.com/bot.html) Chrome/W.X.Y.Z Safari/537.36',
            query: {},
            // @ts-ignore
            rawReq: undefined,
        });
        expect(ok).toBe(false);
    });
});

describe('Bing', () => {
    test('Allow', async () => {
        const ok = await fakeCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: 'user-agent: Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
            ip: '157.55.39.1',
            method: 'GET',
            path: '/test',
            ua: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
            query: {},
            // @ts-ignore
            rawReq: undefined,
        });
        expect(ok).toBe(true);
    });
    test('Block', async () => {
        const ok = await fakeCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: 'user-agent: Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
            ip: '1.1.1.1',
            method: 'GET',
            path: '/test',
            ua: 'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
            query: {},
            // @ts-ignore
            rawReq: undefined,
        });
        expect(ok).toBe(false);
    });
});
describe('DuckDuckBot 2', () => {
    test('Allow (whitelist loaded)', async () => {
        const ok = await fakeCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: 'user-agent: DuckDuckBot/X.0; (+http://duckduckgo.com/duckduckbot.html)',
            ip: '40.88.21.235',
            method: 'GET',
            path: '/test',
            ua: 'DuckDuckBot/X.0; (+http://duckduckgo.com/duckduckbot.html)',
            query: {},
            // @ts-ignore
            rawReq: undefined,
        });
        expect(ok).toBe(true);
    });
});

describe('Twitter', () => {
    test('Allow', async () => {
        const ok = await fakeCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: 'user-agent: Twitterbot/1.0',
            ip: '199.16.156.1',
            method: 'GET',
            path: '/test',
            ua: 'Twitterbot/1.0',
            query: {},
            // @ts-ignore
            rawReq: undefined,
        });
        expect(ok).toBe(true);
    });
    test('Block', async () => {
        const ok = await fakeCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: 'user-agent: Twitterbot/1.0',
            ip: '1.1.1.1',
            method: 'GET',
            path: '/test',
            ua: 'Twitterbot/1.0',
            query: {},
            // @ts-ignore
            rawReq: undefined,
        });
        expect(ok).toBe(false);
    });
});

describe('Facebook', () => {
    test('Allow', async () => {
        const ok = await fakeCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: 'user-agent: facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            ip: '69.63.176.1',
            method: 'GET',
            path: '/test',
            ua: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            query: {},
            // @ts-ignore
            rawReq: undefined,
        });
        expect(ok).toBe(true);
    });
    test('Block', async () => {
        const ok = await fakeCrawlers.check({
            url: '/test?q=123',
            body: undefined,
            headers: 'user-agent: facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            ip: '1.1.1.1',
            method: 'GET',
            path: '/test',
            ua: 'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
            query: {},
            // @ts-ignore
            rawReq: undefined,
        });
        expect(ok).toBe(false);
    });
});
