const Koa = require('koa');
const c2k = require('koa-connect');
const easyWaf = require('easy-waf');

const app = new Koa();

app.use(c2k(easyWaf({
    allowedHTTPMethods: ['GET', 'POST'],
    queryUrlWhitelist: ['github.com']
})));

app.listen(3000);
