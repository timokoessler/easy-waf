/* eslint-disable no-useless-escape */
const lT = '(<|%3C)';
const brackedOpen = '(\\(|%28)';
const colon = '(;|%3B)';

const regex = new RegExp(`(${lT}script|${lT}svg|${lT}iframe|${lT}meta|${lT}body|${lT}div|${lT}img|${lT}a|${lT}embed|${lT}style|${lT}input|${lT}object|alert${brackedOpen}|javascript${colon}|${lT}p|${lT}frameset|prompt${brackedOpen}`, 'i');

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
            name: 'XSS'
        };
    }
};