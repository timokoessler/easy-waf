/*
To use EasyWaf with NextJS, you can use the custom server api.
Add the following code as a custom server to your NextJS app and adjust your package.json as shown in the repo below.
https://github.com/vercel/next.js/tree/canary/examples/custom-server-express
*/

const express = require('express');
const next = require('next');
const easyWaf = require('easy-waf');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
    const server = express();

    server.use(easyWaf());

    server.all('*', (req, res) => {
        return handle(req, res);
    });

    server.listen(port, () => {
        console.log(`> Ready on http://localhost:${port}`);
    });
});
