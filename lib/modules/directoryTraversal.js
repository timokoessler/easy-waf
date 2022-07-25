const {dotRegex, slashRegex} = require('./specialchars.regex');

//Regex build with data of https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Directory%20Traversal
const regex = new RegExp(`(${dotRegex}{2,3};?${slashRegex}|${slashRegex};?${dotRegex}{2,3}|${slashRegex}(etc|proc|home|run|var|usr|root|bin|cgi-bin|windows|system32)${slashRegex}|c(:|%3A|%253A)${slashRegex}|${slashRegex}${dotRegex}${slashRegex}|boot${dotRegex}ini|${dotRegex}htaccess|(file|zip|php|data).${slashRegex}{2})`, 'i');

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
    if(('enabled' in config.modules.directoryTraversal && !config.modules.directoryTraversal.enabled) || (config.modules.directoryTraversal.excludePaths instanceof RegExp && config.modules.directoryTraversal.excludePaths.test(data.path))){
        return true;
    }

    if(regex.test(data.url)){
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
            name: 'directoryTraversal'
        };
    }
};