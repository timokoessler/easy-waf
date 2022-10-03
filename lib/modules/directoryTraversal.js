const {dot, slash, percent} = require('./specialchars.regex');

//Regex build with data of https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Directory%20Traversal
const regex = new RegExp(`(${dot}{2,3};?${slash}|${slash};?${dot}{2,3}|${slash}(etc|proc|home|run|var|usr|root|bin|cgi-bin|windows|system32)${slash}|c(:|%3A|%253A)${slash}|${slash}${dot}${slash}|boot${dot}ini|${dot}htaccess|(file|zip|php|data).${slash}{2}|${percent}systemroot${percent})`, 'i');

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
    if(('enabled' in config.modules.directoryTraversal && !config.modules.directoryTraversal.enabled) || (config.modules.directoryTraversal.excludePaths instanceof RegExp && config.modules.directoryTraversal.excludePaths.test(data.path))){
        return true;
    }

    if(regex.test(data.url)){
        return false;
    }

    if(data.body && regex.test(data.body)){
        return false;
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