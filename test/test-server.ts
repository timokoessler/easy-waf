import { readdirSync, readFileSync } from 'node:fs';
import express from 'express';
import easyWaf, { EasyWaf } from '../src';

const app = express();

function init(config?: EasyWaf.Config) {
    app.use(express.json());
    //app.use(express.urlencoded({ extended: true }));
    app.use(easyWaf(config));

    app.get('/get', function (req, res) {
        res.status(200).send();
    });

    app.post('/post', function (req, res) {
        res.status(200).send();
    });
}

function foreachFile(path: string, cb: (lines: string[], fileName: string) => void) {
    const files = readdirSync(path).filter((name) => /.*\.(txt)$/i.test(name));
    if (!path.endsWith('/')) path += '/';
    files.forEach((txtFile) => {
        const lines = readFileSync(path + txtFile, 'utf-8').split(/\r?\n/);
        const fileName = txtFile.replace(/\.[^/.]+$/, '');

        if (!lines[0].startsWith('!')) {
            throw new Error('Add the test type in first line of the file ' + fileName);
        }
        if (!['URL', 'UserAgent', 'Body'].includes(lines[0].replace('!', ''))) {
            throw new Error('Invalid test type ' + lines[0].replace('!', '') + ' (' + fileName + ')');
        }
        cb(lines, fileName);
    });
}

if (require.main === module) {
    init();
    app.listen(3000);
    console.log('App listening on port', 3000);
}

export default {
    init: init,
    foreachFile: foreachFile,
    app: app,
};
