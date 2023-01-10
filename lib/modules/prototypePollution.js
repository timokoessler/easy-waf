//Good explanation: https://book.hacktricks.xyz/pentesting-web/deserialization/nodejs-proto-prototype-pollution

const { underscore, dot, squareBracketOpen } = require('./specialchars.regex');

const regex = new RegExp(`(${underscore}${underscore}proto${underscore}${underscore}|\\S${dot}prototype(${dot}|${squareBracketOpen}))`, 'i');

/**
 * 
 * @param {EasyWAFRequestInfo} data
 * @returns {Boolean} Is false when a possible security incident has been found
 */
function check(data){    
    if(regex.test(data.url) || regex.test(data.ua) || regex.test(data.headers)){
        return false;
    }

    if(data.body && regex.test(data.body)){
        return false;
    }
    return true;
}

module.exports = {
    check: check,
    info: () => {
        return {
            name: 'prototypePollution'
        };
    }
};