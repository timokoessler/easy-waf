/* eslint-disable jest/valid-title */
const testServer = require('./test-server');
const request = require('supertest');

testServer.init({
    allowedHTTPMethods: ['GET', 'POST'],
    disableRequestBlockedLogging: true
});


testServer.foreachFile(__dirname + '/block', (lines, fileName) => {
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

            if(testType === 'URL'){
                test(line, () => {
                    return request(testServer.app)
                        .get('/get?q=' + line)
                        .then(response => {
                            // eslint-disable-next-line jest/no-conditional-expect
                            expect(response.statusCode).toBe(403);
                    });
                });
            } else if(testType === 'UserAgent'){
                test(line, () => {
                    return request(testServer.app)
                        .get('/get')
                        .set('User-Agent', line)
                        .send({key: line})
                        .then(response => {
                            // eslint-disable-next-line jest/no-conditional-expect
                            expect(response.statusCode).toBe(403);
                    });
                });
            } else if(testType === 'Body'){
                test(line, () => {
                    return request(testServer.app)
                        .post('/post')
                        .send({key: line})
                        .then(response => {
                            // eslint-disable-next-line jest/no-conditional-expect
                            expect(response.statusCode).toBe(403);
                    });
                });
            }
                        
            
        });
    });
});
