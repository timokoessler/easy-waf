//Regex build with help of https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Directory%20Traversal
const regex = /(\.\.\/|\.\.\\|\.\.\.\/|\.\.\.\\|\.\.;\/|\.\.;\\|\/etc\/|\/proc\/|\/home\/|\/run\/|\/var\/|\/usr\/|\/root\/|c:\\|c:\/|\\localhost\\c\$|%2e%2e%2f|%252e%252e%252f|%c0%ae%c0%ae%c0%af|%uff0e%uff0e%u2215|%uff0e%uff0e%u2216|%u002e%u2215|%u002e%u2216|%c0%2e%c0%af|%c0%2e%c0%2f|%c0%2e%c0%5c|%c0%2e%c0%80%5c)/i;

/**
 * 
 * @param {import('express').Request} req
 * @returns {Boolean} Is false when a possible security incident has been found
 */
function check(req){
    if(regex.test(decodeURIComponent(req.originalUrl))){
        return false;
    }
    if(typeof req.body !== 'undefined' && Object.keys(req.body).length){
        if(regex.test(JSON.stringify(req.body))){
            return false;
        }
    }
    return true;
}

module.exports = {
    check: check,
    info: () => {
        return {
            name: 'DirectoryTraversal'
        };
    }
};