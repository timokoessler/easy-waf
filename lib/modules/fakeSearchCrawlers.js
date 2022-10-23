const CIDRMatcher = require('cidr-matcher');
const utils = require('../utils');
const logger = require('../logger');
const dns = require('node:dns');

/** @type {EasyWafConfig} */
var config;

const uaRegex = new RegExp('(Google|Bingbot|AdIdxBot|BingPreview|MicrosoftPreview|DuckDuck(Go|Bot)|Yahoo!|Yandex\\S|Baiduspider|Qwantify)', 'i');
const rdnsRegex = new RegExp('(.googlebot.com|.google.com|.googleusercontent.com|.live.com|.msn.com|.bing.com|.microsoft.com|.yahoo.com|.yahoo.net|.yandex.net|.yandex.ru|.yandex.com|.baidu.com|.baidu.jp|.qwant.com)$', 'i');

var ipWhitelist;
/** @type {Array.<String>} */
var ipList = [];

/**
 * 
 * @param {EasyWafConfig} conf
 */
function init(conf){
    config = conf;

    if(('enabled' in config.modules.fakeSearchCrawlers && config.modules.fakeSearchCrawlers.enabled)){
        updateIPWhitelist();
    }
}

/**
 * 
 * @param {EasyWAFRequestInfo} reqInfo
 * @param {Function} cb
 */
function checkCB(reqInfo, cb){    
    if(('enabled' in config.modules.fakeSearchCrawlers && !config.modules.fakeSearchCrawlers.enabled) || (config.modules.fakeSearchCrawlers.excludePaths instanceof RegExp && config.modules.fakeSearchCrawlers.excludePaths.test(reqInfo.path))){
        cb(true);
    }

    if(uaRegex.test(reqInfo.ua)){
        if(typeof ipWhitelist !== 'undefined' && ipWhitelist.contains(reqInfo.ip)){
            cb(true);
            return;
        }

        dns.reverse(reqInfo.ip, (err, hostnames) => {
            if(err){
                if(process.env.NODE_ENV !== 'test') logger.log('Error', 'Error on reverse DNS (fakeSearchCrawlers): ' + err.message);
                cb(false);
                return;
            }
            let matchedHostname = hostnames.find(h => rdnsRegex.test(h));
            if(!matchedHostname){
                cb(false);
                return;
            }
            dns.lookup(matchedHostname, {}, (err, addresses) => {
                /* istanbul ignore next */
                if(err){
                    logger.log('Error', 'Error on DNS lookup (fakeSearchCrawlers): ' + err.message);
                    cb(false);
                    return;
                }
                if(addresses.includes(reqInfo.ip)){
                    // The request comes from a real search crawler, so add to the whitelist (only temporarily)
                    addIPToWhitelist(reqInfo.ip);
                    cb(true);
                    return;
                }
                cb(false);
            });
        });
        return;
    }
    cb(true);
}

/**
 * Changes the prefix list of google and bing into an array
 * @param {Array.<Object>} arr 
 * @returns {Array.<String>}
 */
function parsePrefixList(arr){
    let list = [];
    arr.forEach(e => {
        if(typeof e.ipv4Prefix === 'string'){
            list.push(e.ipv4Prefix);
            return;
        }
        if(typeof e.ipv6Prefix === 'string'){
            list.push(e.ipv6Prefix);
        }
    });
    return list;
}

function updateIPWhitelist(){
    /** @type {Array.<String>} */
    try {
        // Google
        utils.httpGET('https://www.gstatic.com/ipranges/goog.json', (data) => {
            let json = JSON.parse(data);
            ipList.push(...parsePrefixList(json.prefixes));
            // Bing
            utils.httpGET('https://www.bing.com/toolbox/bingbot.json', (data) => {
                json = JSON.parse(data);
                ipList.push(...parsePrefixList(json.prefixes));
                // DuckDuckGo 
                // https://raw.githubusercontent.com/duckduckgo/duckduckgo-help-pages/master/_docs/results/duckduckbot.md
                ipList.push(...['20.191.45.212', '40.88.21.235', '40.76.173.151', '40.76.163.7', '20.185.79.47', '52.142.26.175', '20.185.79.15', '52.142.24.149', '40.76.162.208', '40.76.163.23', '40.76.162.191', '40.76.162.247']);
                utils.refactorIPArray(ipList);
                ipWhitelist = new CIDRMatcher(ipList);
            });
        });

    } catch (e) /* istanbul ignore next */ {
        logger.log('Error', 'Exception on updateIPWhitelist in fakeSearchCrawlers: ' + e.message);
    }
    setTimeout(updateIPWhitelist, 3600000); //1 hour
}

/**
 * 
 * @param {String} ip 
 */
function addIPToWhitelist(ip){
    if(!ip.includes('/')){
        if(ip.includes(':')){ /* istanbul ignore next */
            ip += '/128';
        } else {
            ip += '/32';
        }
    }
    ipList.push(ip);
    ipWhitelist = new CIDRMatcher(ipList);
}

module.exports = {
    init: init,
    checkCB: checkCB,
    info: () => {
        return {
            name: 'fakeSearchCrawlers'
        };
    }
};