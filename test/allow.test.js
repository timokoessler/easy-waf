/* eslint-disable jest/valid-title */
const testServer = require('./test-server');
const request = require('supertest');

testServer.init({
    allowedHTTPMethods: ['GET'],
    disableRequestBlockedLogging: true
});


testServer.foreachFile(__dirname + '/allow', (testType, lines, fileName) => {
    var userAgent = 'Test';
    var urlPath = '/get';

    describe(fileName, function() {
        lines.forEach(line =>  {
            if(!line) return;
            if(line.startsWith('#') || line.startsWith('!')) return;
                        
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