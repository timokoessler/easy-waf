const fs = require('fs');
const express = require('express');
const EasyWaf = require('../index');
const axios = require('axios').default;

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

app.listen(3001);

const txtFiles = fs.readdirSync('test/txt').filter((name ) => /.*\.(txt)/i.test(name));

txtFiles.forEach(txtFile => {
    var fileContent = fs.readFileSync('test/txt/' + txtFile, 'utf-8');
    var lines = fileContent.split(/\r?\n/);
    var moduleName = txtFile.replace(/\.[^/.]+$/, '');

    describe(moduleName, function() {
        // eslint-disable-next-line mocha/no-setup-in-describe
        lines.forEach(line =>  {
            if(!line) return;
            if(line.startsWith('#')) return;
                        
            it(line, function(done) {
                axios({
                    method: 'GET',
                    url: 'http://localhost:3001/test?q=' + line,
                    timeout: 500
                }).then(function (/** @type {import('axios').AxiosResponse} **/ response) {
                    if(response.status === 200){
                        done(new Error('The following payload was not identified correctly: ' + decodeURIComponent(line)));
                        return;
                    }
                    done();
                }).catch(function(error) {
                    if(error.message.includes('403')){
                        done();
                        return;
                    }
                    done(error);
                });

            });
        });
    });
});
