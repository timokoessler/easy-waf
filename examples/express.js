const express = require('express');
const { easyWaf } = require('easy-waf');
var cookieParser = require('cookie-parser');

const app = express();

//If EasyWaf should check the request body, express body parser middlewares must be added before EasyWaf. The same applies to cookies.
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());

app.use(easyWaf({
    dryMode: true, //Suspicious requests are only logged and not blocked
    allowedHTTPMethods: ['GET', 'POST'],
    ipBlacklist: ['1.1.1.1', '2.2.2.2'],
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