const express = require('express');
const easyWaf = require('easy-waf');
const app = express();

app.use(easyWaf({
    preBlockHook: (req, moduleInfo, ip) => { // Executed before a request is blocked. If false is returned, the request will not be blocked.
        if (moduleInfo.name === 'xss'
            && ['::1', '127.0.0.1', '::ffff:127.0.0.1'].includes(ip)
            && req.url.match('^[^?]*')[0] === '/test') { // Do not block xss from localhost at path /test
            return false;
        }
    },
    postBlockHook: (req, moduleInfo, ip) => { // Executed after a request is blocked. See send-notification.js for an example.
        // ...
    }
}));

app.get('/get', function(req, res){
    res.status(200).send();
});

app.listen(3000);