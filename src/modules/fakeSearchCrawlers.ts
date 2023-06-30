import { httpGET, refactorIPArray } from '../utils';
import { log } from '../logger';
import { reverse, lookup } from 'dns/promises';
import { createCIDR } from 'ip6addr';
import type { EasyWaf } from '../types';
import { Matcher } from 'netparser';

let config: EasyWaf.Config;

const uaRegex = new RegExp('(Google|Bingbot|AdIdxBot|BingPreview|MicrosoftPreview|DuckDuck(Go|Bot)|Yahoo!|Yandex\\S|Baiduspider|Qwantify)', 'i');
const rdnsRegex = new RegExp('(.googlebot.com|.google.com|.live.com|.msn.com|.bing.com|.microsoft.com|.yahoo.com|.yahoo.net|.yandex.net|.yandex.ru|.yandex.com|.baidu.com|.baidu.jp|.qwant.com)$', 'i');

let ipWhitelist: Matcher;
const ipList: string[] = [];

export default {
    init: (conf: EasyWaf.Config) => {
        config = conf;
        if (config.modules?.fakeSearchCrawlers && 'enabled' in config.modules.fakeSearchCrawlers && config.modules.fakeSearchCrawlers.enabled && typeof process.env.TEST_FAKE_SEARCH_CRAWLERS !== 'string') {
            updateIPWhitelist();
        }
    },
    check: async (req: EasyWaf.Request) => {
        if (!uaRegex.test(req.ua)) {
            return true;
        }
        if (typeof ipWhitelist !== 'undefined' && ipWhitelist.get(req.ip)) {
            return true;
        }
        try {
            const hostnames = await reverse(req.ip);
            if (!Array.isArray(hostnames)) {
                return false;
            }
            const matchedHostname = [];
            for(const hostname of hostnames){
                if(rdnsRegex.test(hostname)){
                    matchedHostname.push(hostname);
                }
            }
            if (!matchedHostname.length) {
                return false;
            }
            for(const hostname of matchedHostname){
                const lookupRes = await lookup(hostname);
                if (!lookupRes) {
                    continue;
                }
                if (lookupRes.address === req.ip) {
                    // The request comes from a real search crawler, so add to the whitelist (only temporarily)
                    addIPToWhitelist(req.ip);
                    return true;
                }
            }
            return false;
        } catch (err) {
            if (err instanceof Error) {
                log('Error', `Error on fakeSearchCrawlers check: IP: ${req.ip} Msg: ${err.message}`);
            }
            return false;
        }
    },
    updateIPWhitelist: updateIPWhitelist,
};

/**
 * Checks whether an IP is written in a valid CIDR notation.
 */
function validateCIDR(ip: string) {
    try {
        createCIDR(ip);
        return true;
    } catch (err) /* istanbul ignore next */ {
        if (err instanceof Error) {
            log('Warn', `Invalid ip in CIDR format: ${ip} Msg: ${err.message}`);
        }
        return false;
    }
}

/**
 * Parses the ip list from Google and Bing and returns an array of valid CIDR notations.
 */
function parsePrefixList(arr: unknown) {
    const list: string[] = [];
    if (!Array.isArray(arr)) {
        /* istanbul ignore next */
        log('Warn', 'fakeSearchCrawlers in parsePrefixList: arr is not an array');
        return list;
    }
    arr.forEach(e => {
        if (typeof e.ipv4Prefix === 'string') {
            e.ipv4Prefix = e.ipv4Prefix.replaceAll('\u200b', ''); //Some Bing ip addresses contain the unicode character "Zero Width Space" (200B).
            if (validateCIDR(e.ipv4Prefix)) list.push(e.ipv4Prefix);
            return;
        }
        if (typeof e.ipv6Prefix === 'string') {
            e.ipv6Prefix = e.ipv6Prefix.replaceAll('\u200b', ''); //Some Bing ip addresses contain the unicode character "Zero Width Space" (200B).
            if (validateCIDR(e.ipv6Prefix)) list.push(e.ipv6Prefix);
        }
    });
    return list;
}

/**
 * Updates the ip whitelist with the ip addresses of Google, Bing and DuckDuckGo.
 */
async function updateIPWhitelist() {
    ipList.length = 0;
    // Google
    try {
        const result = await httpGET('https://www.gstatic.com/ipranges/goog.json');
        const json = JSON.parse(result);
        ipList.push(...parsePrefixList(json.prefixes));
    } catch (err) {
        /* istanbul ignore next */
        if (err instanceof Error) {
            log('Error', 'Exception while updating Google ip whitelist: ' + err.message);
        }
    }
    // Bing
    try {
        const result = await httpGET('https://www.bing.com/toolbox/bingbot.json');
        const json = JSON.parse(result);
        ipList.push(...parsePrefixList(json.prefixes));
    } catch (err) {
        /* istanbul ignore next */
        if (err instanceof Error) {
            log('Error', 'Exception while updating Bing ip whitelist: ' + err.message);
        }
    }
    // DuckDuckGo
    // https://raw.githubusercontent.com/duckduckgo/duckduckgo-help-pages/master/_docs/results/duckduckbot.md
    ipList.push(...['20.191.45.212', '40.88.21.235', '40.76.173.151', '40.76.163.7', '20.185.79.47', '52.142.26.175', '20.185.79.15', '52.142.24.149', '40.76.162.208', '40.76.163.23', '40.76.162.191', '40.76.162.247']);
    refactorIPArray(ipList);
    ipWhitelist = new Matcher(ipList);

    setTimeout(updateIPWhitelist, 3600000); //1 hour
}

/**
 * Adds an IP to the fake search crawler whitelist.
 */
function addIPToWhitelist(ip: string) {
    if (!ip.includes('/')) {
        if (ip.includes(':')) { /* istanbul ignore next */
            ip += '/128';
        } else {
            ip += '/32';
        }
    }
    ipList.push(ip);
    ipWhitelist = new Matcher(ipList);
}

