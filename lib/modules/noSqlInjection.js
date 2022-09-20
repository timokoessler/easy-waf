const { quotationMarks, singleQuotationMarks, curlyBracketOpen, squareBracketOpen, dollar, colon, squareBracketClose, dot, brackedOpen, underscore, or, equals, and } = require('./specialchars.regex');

const regex = new RegExp(`((${squareBracketOpen}|${curlyBracketOpen}(${quotationMarks}|${singleQuotationMarks})?(\\s+)?)${dollar}\\S+(${colon}|${squareBracketClose})|${dollar}(where|n?or|and|not|regex|eq|ne|gte?|lte?|n?in|exists|comment|expr|mod|size|rand)|db${dot}\\S+${dot}(find|findOne|insert|update|insertOne|insertMany|updateMany|updateOne|delete|deleteOne|deleteMany|drop|count)${brackedOpen}|sleep${brackedOpen}|db${dot}(getCollectionNames|dropDatabase)${brackedOpen}|${underscore}all${underscore}docs|this${dot}\\S+${dot}match${brackedOpen}|new\\sDate${brackedOpen}|${or}{2}\\s+\\d${equals}{2}\\d|${and}{2}\\s+this${dot})`, 'i');

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
    if(('enabled' in config.modules.noSqlInjection && !config.modules.noSqlInjection.enabled) || (config.modules.noSqlInjection.excludePaths instanceof RegExp && config.modules.noSqlInjection.excludePaths.test(data.path))){
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
            name: 'noSqlInjection'
        };
    }
};