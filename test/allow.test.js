/* eslint-disable jest/valid-title */
const testServer = require('./test-server');
const request = require('supertest');

jest.useFakeTimers();

testServer.init({
    allowedHTTPMethods: ['GET'],
    disableLogging: true
});

testServer.foreachFile(__dirname + '/allow', (lines, fileName) => {
    var userAgent = 'Test';
    var urlPath = '/get';
    var testType = '';

    describe(fileName, function() {
        lines.forEach(line =>  {
            if(!line) return;
            if(line.startsWith('#')) return;
            if(line.startsWith('!')){
                testType = line.replace('!', '');
                if(!['URL', 'UserAgent', 'Body'].includes(testType)){
                    throw new Error('Invalid test type ' + testType + ' (' + fileName + ')');
                }
                return;
            }

            test(line, () => {
                if(testType === 'URL'){
                    urlPath = '/get?q=' + line;
                } else if(testType === 'UserAgent'){
                    userAgent = line;
                }
                return request(testServer.app)
                    .get(urlPath)
                    .set('User-Agent', userAgent)
                    .then(response => {
                        expect(response.statusCode).toBe(200);
                });
            });
        });
    });
});