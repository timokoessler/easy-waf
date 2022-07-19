// @ts-ignore
require('./typedef');
const block = require('./block');
const logger = require('./logger');
const modules = require('./modules/index');

/** @type {EasyWafConfig} */
var config = {
    allowedHTTPMethods: undefined,
    dryMode: false
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

        // @ts-ignore
        config = {...config, ...conf};
    }

    return function EasyWaf(
        /** @type {import('express').Request} */ req,
        /** @type {import('express').Response} **/ res,
        /** @type {CallableFunction} **/ next){
                
        if(Array.isArray(config.allowedHTTPMethods) && !config.allowedHTTPMethods.includes(req.method)){
            block(req, res, {name: 'HTTPMethod'}, config);
            return;
        }

        for (var i of Object.keys(modules)) {
            if(!modules[i].check(req)){
                block(req, res, modules[i].info(), config);
                return;
            }
        }

        next();
    };
}

module.exports.EasyWaf = EasyWaf;