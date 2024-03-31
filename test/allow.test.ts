import testServer from './test-server';
import request from 'supertest';

jest.useFakeTimers();

testServer.init({
    disableLogging: false,
});

testServer.foreachFile(__dirname + '/allow', (lines, fileName) => {
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
                            expect(response.statusCode).toBe(200);
                        });
                });
            } else if (testType === 'UserAgent') {
                test(line, () => {
                    return request(testServer.app)
                        .get('/get')
                        .set('User-Agent', line)
                        .send({ key: line })
                        .then((response) => {
                            expect(response.statusCode).toBe(200);
                        });
                });
            } else if (testType === 'Body') {
                test(line, () => {
                    return request(testServer.app)
                        .post('/post')
                        .set('Content-Type', 'application/json')
                        .send(line)
                        .then((response) => {
                            if (fileName.includes('xml')) {
                                expect(response.statusCode).toBe(400);
                            } else {
                                expect(response.statusCode).toBe(200);
                            }
                        });
                });
            }
        });
    });
});
