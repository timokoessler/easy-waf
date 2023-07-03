import express from 'express';
import easyWaf from '../src';
import request from 'supertest';

jest.useFakeTimers();

const app = express();

app.use(easyWaf({
    disableLogging: true,
    modules: {
        fakeCrawlers: {
            enabled: false,
        },
    },
}));

app.get('/get', function (req, res) {
    res.status(200).send(req.query);
});

describe('HTTP Parameter Pollution', () => {
    test('Remove polluted parameter', () => {
        return request(app)
            .get('/get?q=5&a=8&q=6')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual({'a': '8', 'q': '6'});
        });
    });
    test('Remove two polluted parameters', () => {
        return request(app)
            .get('/get?q=5&a=8&g=test&q=6&g=abc&t=7')
            .then(response => {
                expect(response.statusCode).toBe(200);
                expect(response.body).toStrictEqual({'a': '8', 'g': 'abc', 'q': '6', 't': '7'});
        });
    });
});