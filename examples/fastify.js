const fastify = require('fastify')();
const easyWaf = require('easy-waf');

fastify.register(require('@fastify/middie'), {
    hook: 'onRequest' // default
}).then(() => {
    fastify.use(easyWaf());
    fastify.listen({ port: 3000 }).catch(console.log);
});
