const { slash, dot, colon, underscore, minus } = require('./specialchars.regex');

const regex = new RegExp(`(${slash}{2})(?<domain>((\\w|${minus}|${underscore})+${dot})*(\\w|${minus}|${underscore})+[${dot}${colon}]\\w+)`, 'gi');

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
 * @param {EasyWAFModuleCheckData} data
 * @returns {Boolean} Is false when a possible security incident has been found
 */
function check(data){    
    if(('enabled' in config.modules.openRedirect && !config.modules.openRedirect.enabled) || typeof config.redirectUrlWhitelist == 'undefined' || (config.modules.openRedirect.excludePaths instanceof RegExp && config.modules.openRedirect.excludePaths.test(data.path))){
        return true;
    }
    
    var matches = data.url.matchAll(regex);
    for (const match of matches){
        if(match.groups.domain && !config.redirectUrlWhitelist.includes(match.groups.domain)){
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
            name: 'openRedirect'
        };
    }
};