//Regex build with data of https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/Directory%20Traversal

const dotRegex = '(%2e|\\.|%u002e|%c0%2e|%e0%40%ae|%c0%ae|%252e|0x2e|%uff0e|%00\\.|\\.%00|%c0\\.|%25c0%25ae|%%32%{1,2}65)';
const slashRegex = '(%2f|%5C|\\\\|\\/|%u2215|%u2216|%c0%af|%e0%80%af|%c0%2f|%c0%5c|%c0%80%5c|%252f|%255c|0x2f|0x5c|%uff0f|%25c0%25af|%25c0%252f|%%32%{1,2}66|%%35%{1,2}63|%25c1%259c|%25c0%25af|%f0%80%80%af|%f8%80%80%80%af|%c1%9c|%c1%pc|%c0%9v|%c0%qf|%c1%8s|%c1%1c|%c1%af|%bg%qf|%uEFC8|%uF025|%e0%81%9c|%f0%80%81%9c)';

const regex = new RegExp(`(${dotRegex}{2,3};?${slashRegex}|${slashRegex};?${dotRegex}{2,3}|${slashRegex}(etc|proc|home|run|var|usr|root|bin|cgi-bin|windows|system32)${slashRegex}|c(:|%3A|%253A)${slashRegex}|${slashRegex}${dotRegex}${slashRegex}|boot.ini)`, 'i');

/**
 * 
 * @param {import('express').Request} req
 * @returns {Boolean} Is false when a possible security incident has been found
 */
function check(req){
    if(regex.test(req.originalUrl)){
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