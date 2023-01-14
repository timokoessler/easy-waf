/*
To use EasyWaf with NextJS, you can use the custom server api.
Add the following code as a custom server to your NextJS app and adjust your package.json as shown in the repo below.
https://github.com/vercel/next.js/tree/canary/examples/custom-server
*/

const next = require('next');
const EasyWaf = require('easy-waf');
const http = require('node:http');
const url = require('node:url');

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const easyWaf = EasyWaf({
    queryUrlWhitelist: ['github.com']
});

app.prepare().then(() => {
    http.createServer((req, res) => {
        easyWaf(req, res, () => {
            const parsedUrl = url.parse(req.url, true);
            handle(req, res, parsedUrl);
        });
    }).listen(port, () => {
        console.log(
            `> Server listening at http://localhost:${port} as ${dev ? 'development' : process.env.NODE_ENV}`
        );
    });
});
