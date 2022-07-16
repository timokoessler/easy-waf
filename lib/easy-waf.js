const block = require('./block');
require('./typedef');

/** @type {EasyWafConfig} */
var config = {
    allowedHTTPMethods: [],
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

        config = {...config, ...conf};
    }

    return function EasyWaf(
        /** @type {import('express').Request} */ req,
        /** @type {import('express').Response} **/ res,
        /** @type {CallableFunction} **/ next){
        
        if(!config.allowedHTTPMethods.includes(req.method)){
            block(res);
            return;
        }
        next();
    };
}

module.exports.EasyWaf = EasyWaf;