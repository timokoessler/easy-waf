import testServer from './test-server';
import request from 'supertest';
import blockTorExitNodes from '../src/modules/blockTorExitNodes';
import { httpGET } from '../src/utils';
import { fakeCrawlers } from '../src/modules';

jest.useFakeTimers();
jest.setTimeout(5000);

let torIP = '';

testServer.init({
    disableLogging: true,
    modules: {
        blockTorExitNodes: {
            enabled: true
        },
        fakeCrawlers: {
            enabled: false,
        },
    }
});

test('Get Tor IP', async () => {
    const data = await httpGET('https://check.torproject.org/torbulkexitlist');
    if (typeof data !== 'string') {
        throw new Error('Data is not a string');
    }
    let arr = data.split(/\r?\n/);
    if (!Array.isArray(arr)) {
        throw new Error('Data is not an array');
    }
    arr = arr.filter(line => line.length != 0);
    torIP = arr[0];
});
test('Sleep 1 second', async () => {
    const foo = true;
    jest.useRealTimers();
    await new Promise((r) => setTimeout(r, 1000));
    expect(foo).toBeDefined();
    jest.useFakeTimers();
});
test('Request should not be blocked', () => {
    return request(testServer.app)
        .get('/get')
        .then(response => {
            expect(response.statusCode).toBe(200);
        });
});
test('Test if Tor ip is blocked', () => {
    const ok = blockTorExitNodes.check({
        url: '/get',
        body: undefined,
        headers: '',
        ip: torIP,
        method: 'GET',
        path: '/get',
        ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0',
        query: {},
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        rawReq: undefined,
    });
    expect(ok).toBe(false);
});