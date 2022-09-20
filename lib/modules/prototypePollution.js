//Good explanation: https://book.hacktricks.xyz/pentesting-web/deserialization/nodejs-proto-prototype-pollution

const { underscore } = require('./specialchars.regex');

const regex = new RegExp(`${underscore}${underscore}proto${underscore}${underscore}`, 'i');

/** @type {EasyWafConfig} */
var config;

/**
 * 
 * @param {EasyWafConfig} conf
 */
function init(conf){
    config = conf;
}

/**
 * 
 * @param {EasyWAFRequestInfo} data
 * @returns {Boolean} Is false when a possible security incident has been found
 */
function check(data){    
    if(('enabled' in config.modules.prototypePollution && !config.modules.prototypePollution.enabled) || (config.modules.prototypePollution.excludePaths instanceof RegExp && config.modules.prototypePollution.excludePaths.test(data.path))){
        return true;
    }

    if(regex.test(data.url) || regex.test(data.ua)){
        return false;
    }

    if(data.body){
        if(regex.test(data.body)){
            return false;
        }
    }
    return true;
}

module.exports = {
    init: init,
    check: check,
    info: () => {
        return {
            name: 'prototypePollution'
        };
    }
};