const fs = require('fs');
const express = require('express');
const { EasyWaf } = require('../index');
const app = express();

/**
 * Add EasyWaf middleware and some test routes
 * @param {EasyWafConfig} config 
 */
function init(config){
    //app.use(express.json());
    //app.use(express.urlencoded({ extended: true }));

    app.use(EasyWaf(config));

    app.get('/get', function(req, res){
        res.status(200).send();
    });

    app.post('/post', function(req, res){
        res.status(200).send();
    });
}

/**
 * This function parses the txt files at the specified path and calls the callback with the test type, the lines and the fileName for each file.
 * @param {String} path 
 * @param {CallableFunction} cb 
 * 
 */
function foreachFile(path, cb) {
    var files = fs.readdirSync(path).filter((name) => /.*\.(txt)$/i.test(name));
    if(!path.endsWith('/')) path += '/';
    files.forEach(txtFile => {
        var lines = fs.readFileSync(path + txtFile, 'utf-8').split(/\r?\n/);
        var fileName = txtFile.replace(/\.[^/.]+$/, '');
    
        if(!lines[0].startsWith('!')){
            throw new Error('Add the test type in first line of the file ' + fileName);
        }
        var testType = lines[0].replace('!', '');
        if(!['URL', 'UserAgent'].includes(testType)){
            throw new Error('Invalid test type ' + testType + ' (' + fileName + ')');
        }
        cb(testType, lines, fileName);
    });
}


module.exports = {
    init: init,
    foreachFile: foreachFile,
    app: app
};