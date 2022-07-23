/* eslint-disable jest/valid-title */
const fs = require('fs');
const express = require('express');
const request = require('supertest');
const { EasyWaf } = require('../index');

var app = express();

//app.use(express.json());
//app.use(express.urlencoded({ extended: true }));

app.use(EasyWaf({
    allowedHTTPMethods: ['GET', 'POST'],
    dryMode: false,
    disableRequestBlockedLogging: true
}));

app.get('/test', function(req, res){
    res.status(200).send();
});


const txtFiles = fs.readdirSync('test/txt').filter((name ) => /.*\.(txt)$/i.test(name));

txtFiles.forEach(txtFile => {
    var fileContent = fs.readFileSync('test/txt/' + txtFile, 'utf-8');
    var lines = fileContent.split(/\r?\n/);
    var moduleName = txtFile.replace(/\.[^/.]+$/, '');

    if(!lines[0].startsWith('!')){
        throw new Error('Add the test type in first line of the file ' + moduleName);
    }
    var testType = lines[0].replace('!', '');
    if(!['GET', 'UserAgent'].includes(testType)){
        throw new Error('Invalid test type ' + testType + ' (' + moduleName + ')');
    }
    
    var userAgent = 'Test';
    var urlPath = '/test';

    describe(moduleName, function() {
        lines.forEach(line =>  {
            if(!line) return;
            if(line.startsWith('#') || line.startsWith('!')) return;

            if(testType === 'GET'){
                urlPath = '/test?q=' + line;
            } else if(testType === 'UserAgent'){
                userAgent = line;
            }
                        
            test(line, () => {
                return request(app)
                    .get(urlPath)
                    .set('User-Agent', userAgent)
                    .then(response => {
                        expect(response.statusCode).toBe(403);
                });
            });
        });
    });
});
