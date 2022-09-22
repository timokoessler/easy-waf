const express = require('express');
const easyWaf = require('easy-waf');
const helmet = require('helmet');
const app = express();

//If EasyWaf should check the request body, express body parser middlewares must be added before EasyWaf.
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(helmet());

app.use(easyWaf({
    dryMode: true, //Suspicious requests are only logged and not blocked
    allowedHTTPMethods: ['GET', 'POST'],
    ipBlacklist: ['1.1.1.1', '2.2.2.2'],
    ipWhitelist: ['::1', '172.16.0.0/12'],
    redirectUrlWhitelist: ['github.com'],
    modules: {
        directoryTraversal: {
            enabled: true,
            excludePaths: /^\/exclude\/$/i
        },
    }
}));

app.get('/get', function(req, res){
    res.status(200).send();
});

app.listen(3000);