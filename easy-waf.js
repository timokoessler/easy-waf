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



    console.log(config.allowedHTTPMethods);

    return function EasyWaf(req, res, next) {
        if(!config.allowedHTTPMethods.includes(req.method)){
            res.status(403).send('403 Forbidden');
            return;
        }
        next();
    };
}

module.exports.EasyWaf = EasyWaf;