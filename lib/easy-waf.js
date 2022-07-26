// @ts-ignore
require('./typedef');
const block = require('./block');
const logger = require('./logger');
const modules = require('./modules/index');

/** @type {EasyWafConfig} */
var config = {
    allowedHTTPMethods: undefined,
    dryMode: false,
    disableRequestBlockedLogging: false,
    modules: {
        directoryTraversal: {
            enabled: true
        },
        xss: {
            enabled: true
        },
        badBots: {
            enabled: true
        },
        prototypePollution: {
            enabled: true
        },
        sqlInjection: {
            enabled: true
        }
    }
};

/**
 * 
 * @param {EasyWafConfig} [conf]
 * @return {Function} 
 */
function EasyWaf(conf){
    if(typeof conf === 'object' && conf !== null && !Array.isArray(conf)){

        if(conf.allowedHTTPMethods && Array.isArray(conf.allowedHTTPMethods)){
            Object.keys(conf.allowedHTTPMethods).forEach((i) => {
                if(typeof conf.allowedHTTPMethods[i] !== 'string'){
                    throw new Error('EasyWafConfig: allowedHTTPMethods may only contain strings!');
                }
                conf.allowedHTTPMethods[i] = conf.allowedHTTPMethods[i].toUpperCase();
            });
        }

        if(typeof conf.dryMode !== 'boolean'){
            conf.dryMode = false;
        } else if(conf.dryMode){
            logger.log('Warn', 'DryMode is enabled. Suspicious requests are only logged and not blocked!');
        }

        conf.modules = {...config.modules, ...conf.modules};
        config = {...config, ...conf};
    }

    for (var i of Object.keys(modules)) {
        modules[i].init(config);
    }

    return function EasyWaf(
        /** @type {import('express').Request} */ req,
        /** @type {import('express').Response} **/ res,
        /** @type {CallableFunction} **/ next){
                
        if(Array.isArray(config.allowedHTTPMethods) && !config.allowedHTTPMethods.includes(req.method)){
            block(req, res, {name: 'HTTPMethod'}, config);
            if(config.dryMode) next();
            return;
        }

        try {
            /** @type {EasyWAFModuleCheckData} */
            var checkData = {
                url: decodeURIComponent(req.originalUrl),
                path: req.path,
                body: undefined,
                ua: req.get('User-Agent') || ''
            };

            if(typeof req.body !== 'undefined' && Object.keys(req.body).length){
                checkData.body = JSON.stringify(req.body);
            }

            for (var i of Object.keys(modules)) {
                if(!modules[i].check(checkData)){
                    block(req, res, modules[i].info(), config);
                    if(config.dryMode) next();
                    return;
                }
            }

            next();
        } catch(e) {
            block(req, res, {name: 'uriMalformed'}, config);
            if(config.dryMode) next();
            return;
        }
    };
}

module.exports.EasyWaf = EasyWaf;