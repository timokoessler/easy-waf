const http = require('http');
const EasyWaf = require('easy-waf');

const host = '127.0.0.1';
const port = 3000;

const easyWaf = EasyWaf({
    allowedHTTPMethods: ['GET', 'POST'],
    queryUrlWhitelist: ['github.com']
});

const server = http.createServer((req, res) => {

    easyWaf(req, res, () => {

        if(req.url === '/' && req.method === 'GET'){
            res.writeHead(200);
            res.end('Hello world!');
            return;
        }
    
        res.writeHead(404);
        res.end();
    });

});

server.listen(port, host, () => {
    console.log(`Server is running on http://${host}:${port}`);
});