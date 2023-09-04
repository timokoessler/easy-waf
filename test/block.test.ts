import testServer from './test-server';
import request from 'supertest';

jest.useFakeTimers();

testServer.init({
    allowedHTTPMethods: ['GET', 'POST'],
    disableLogging: true,
});

testServer.foreachFile(__dirname + '/block', (lines, fileName) => {
    let testType = '';

    describe(fileName, function () {
        lines.forEach((line) => {
            if (!line) return;
            if (line.startsWith('#')) return;
            if (line.startsWith('!')) {
                testType = line.replace('!', '');
                if (!['URL', 'UserAgent', 'Body'].includes(testType)) {
                    throw new Error('Invalid test type ' + testType + ' (' + fileName + ')');
                }
                return;
            }

            if (testType === 'URL') {
                test(line, () => {
                    return request(testServer.app)
                        .get('/get?q=' + line)
                        .then((response) => {
                            expect(response.statusCode).toBe(403);
                        });
                });
            } else if (testType === 'UserAgent') {
                test(line, () => {
                    return request(testServer.app)
                        .get('/get')
                        .set('User-Agent', line)
                        .send({ key: line })
                        .then((response) => {
                            expect(response.statusCode).toBe(403);
                        });
                });
            } else if (testType === 'Body') {
                test(line, () => {
                    return request(testServer.app)
                        .post('/post')
                        .send({ key: line })
                        .then((response) => {
                            expect(response.statusCode).toBe(403);
                        });
                });
            }
        });
    });
});
