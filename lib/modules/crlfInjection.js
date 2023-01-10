const { minus, lT } = require('./specialchars.regex');

const regex = new RegExp(`((\\r|%0D|%E5%98%8D|\\\\u560d|%250D)|(\\n|%0A|%E5%98%8A|\\\\u560a|%250a))(Set${minus}Cookie|Content${minus}(Length|Type|Location|Disposition|Security${minus}Policy)|X${minus}XSS${minus}Protection|Last${minus}Modified|Location|Date|Link|Refresh|${lT})`, 'i');

/**
 * 
 * @param {EasyWAFRequestInfo} data
 * @returns {Boolean} Is false when a possible security incident has been found
 */
function check(data){    
    if(regex.test(data.url)){
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
            name: 'crlfInjection'
        };
    }
};