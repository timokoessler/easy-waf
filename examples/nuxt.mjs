/*
Nuxt 3:

Put this file into the server/middleware folder of your Nuxt 3 app. Static Hosting is not supported.
------------------
Nuxt 2:

Put this file into the server-middleware folder of your Nuxt 2 app and name it easy-waf.
After that add this to your nuxt.config.js: serverMiddleware: ['~/server-middleware/easy-waf']
Static Site Generation is not supported.
*/

import express from 'express';
import easyWaf from 'easy-waf';

const app = express();
app.set('trust proxy', true); //Not relevant for EasyWaf

app.use(
    easyWaf({
        trustProxy: 1, //Required because request is proxied by Nuxt
    }),
);

export default app;
