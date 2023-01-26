/* eslint-disable jest/valid-title */
const testServer = require('./test-server');
const request = require('supertest');
const blockTorExitNodes = require('../lib/modules/blockTorExitNodes');
const utils = require('../lib/utils');

jest.useFakeTimers();
jest.setTimeout(5000);

var torIP = '';

testServer.init({
    allowedHTTPMethods: ['GET', 'POST'],
    disableLogging: true,
    modules: {
        blockTorExitNodes: {
            enabled: true
        }
    }
});

test('Get Tor IP', async () => {
    let data = await utils.httpGET('https://check.torproject.org/torbulkexitlist');
    data = data.split(/\r?\n/);
    data = data.filter(line => line.length != 0);
    expect(Array.isArray(data)).toBe(true);
    torIP = data[0];
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
        headers: {},
        ip: torIP,
        method: 'GET',
        path: '/get',
        ua: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/109.0'
    });
    expect(ok).toBe(false);
});