const { underscore, at, brackedOpen, dotRegex, colon, equals, quotationMarks, singleQuotationMarks, lT, and, or } = require('./specialchars.regex');

//White spaces
//To-Do Whitespace alternatives: https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/SQL%20Injection#waf-bypass
const sqlWS = '(\\s|%20|\\/\\*.*\\*\\/|\t)';

const regex = new RegExp(`(${at}{2}(version|innodb_version|connections|cpu${underscore}busy|servername|dbts|langid|language|lock${underscore}timeout|max${underscore}connections|max${underscore}precision|nestlevel|options|servicename|spid|textsize|microsoftversion)|xp${underscore}cmdshell|information${underscore}schema|innodb${underscore}table${underscore}stats|union${sqlWS}(all${sqlWS})?select|(benchmark|substr(ing)?|selectchar|sleep|conv|connection${underscore}id|binary${underscore}checksum|upper|hex|md5|distinct|load_file|cvar|last${underscore}insert${underscore}rowid|sqlite${underscore}version|current${underscore}database|current${underscore}setting|pg${underscore}client${underscore}encoding|crc32|user${underscore}id|sha1|quote${underscore}literal|chr|randomblob)${brackedOpen}|${colon}{2}int(eger)?${equals}|mysql${dotRegex}\\S|all${underscore}tab${underscore}tables|waitfor${sqlWS}delay|(or|and|where|having|${and}{2}|${or}{2})${sqlWS}\\w+${sqlWS}?(${equals}|${lT})\\w|(${quotationMarks}|${singleQuotationMarks})${sqlWS}(or|and|where|having|${and}{2}|${or}{2}|${lT}|${equals})${sqlWS}(${quotationMarks}|${singleQuotationMarks})|pg${underscore}shadow|pg${underscore}group)`, 'i');

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
    if(('enabled' in config.modules.sqlInjection && !config.modules.sqlInjection.enabled) || (config.modules.sqlInjection.excludePaths instanceof RegExp && config.modules.sqlInjection.excludePaths.test(data.path))){
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
            name: 'sqlInjection'
        };
    }
};