// @ts-ignore
require('./typedef');
const block = require('./block');
const logger = require('./logger');
const modules = require('./modules/index');

/** @type {EasyWafConfig} */
var config = {
    allowedHTTPMethods: undefined,
    dryMode: false,
    disableLogging: false,
    ipBlacklist: [],
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
        },
        noSqlInjection: {
            enabled: true
        },
        crlfInjection: {
            enabled: true
        },
        blockTorExitNodes: {
            enabled: false
        }
    }
};

/**
 * 
 * @param {EasyWafConfig} [conf]
 * @return {Function} 
 */
function easyWaf(conf){
    if(typeof conf === 'object' && conf !== null && !Array.isArray(conf)){

        if(conf.allowedHTTPMethods && Array.isArray(conf.allowedHTTPMethods)){
            Object.keys(conf.allowedHTTPMethods).forEach((i) => {
                if(typeof conf.allowedHTTPMethods[i] !== 'string'){
                    /* istanbul ignore next */
                    throw new Error('EasyWafConfig: allowedHTTPMethods may only contain strings!');
                }
                conf.allowedHTTPMethods[i] = conf.allowedHTTPMethods[i].toUpperCase();
            });
        }

        if(conf.dryMode && typeof conf.dryMode != 'boolean'){
            /* istanbul ignore next */
            throw new Error('EasyWafConfig: dryMode is not a boolean');
        } else if(conf.dryMode && !conf.disableLogging){
            logger.log('Warn', 'DryMode is enabled. Suspicious requests are only logged and not blocked!');
        }

        if(typeof conf.ipBlacklist != 'undefined' && !Array.isArray(conf.ipBlacklist)){
            /* istanbul ignore next */
            throw new Error('EasyWafConfig: ipBlacklist is not an array');
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

        if(Array.isArray(config.ipBlacklist) && config.ipBlacklist.includes(req.ip)){
            block(req, res, {name: 'IPBlacklist'}, config);
            if(config.dryMode) next();
            return;
        }

        try {
            /** @type {EasyWAFModuleCheckData} */
            var checkData = {
                url: decodeURIComponent(req.originalUrl),
                encodedUrl: req.originalUrl,
                ip: req.ip,
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

module.exports.easyWaf = easyWaf;