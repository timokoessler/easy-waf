const assert = require('assert');
const fs = require('fs');

const modules = require('../lib/modules/index');

const txtFiles = fs.readdirSync('test/txt').filter((name ) => /.*\.(txt)/i.test(name) );

txtFiles.forEach(txtFile => {
    var fileContent = fs.readFileSync('test/txt/' + txtFile, 'utf-8');
    var lines = fileContent.split(/\r?\n/);
    var moduleName = txtFile.replace(/\.[^/.]+$/, '');
    var wafModule = modules[moduleName];

    if(typeof module === 'undefined'){
        throw new Error('Module ' + moduleName + ' not found!');
    }
    
    describe(moduleName, function() {
        // eslint-disable-next-line mocha/no-setup-in-describe
        lines.forEach(line =>  {
            if(!line) return;
            if(line.startsWith('#')) return;
                        
            it(line, function() {
                assert.equal(wafModule.check({originalUrl: '/test?q=' + line}), false, 'The following payload was not identified as an directory traversal: ' + line);
            });
        });
    });
});
