import { httpGET, refactorIPArray } from 'utils';
import { log } from 'logger';
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
        if (config.modules?.fakeSearchCrawlers && 'enabled' in config.modules.fakeSearchCrawlers && config.modules.fakeSearchCrawlers.enabled && typeof process.env.TEST_FAKE_SEARCH_CRAWLERS !== 'string' && process.env.TEST_FAKE_SEARCH_CRAWLERS !== '1') {
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
            const matchedHostname = hostnames.find(h => rdnsRegex.test(h));
            if (!Array.isArray(matchedHostname) || !matchedHostname.length) {
                return false;
            }
            const lookupRes = await lookup(matchedHostname);
            if (!lookupRes) {
                return false;
            }
            if (lookupRes.address === req.ip) {
                // The request comes from a real search crawler, so add to the whitelist (only temporarily)
                addIPToWhitelist(req.ip);
                return true;
            }
            return false;
        } catch (err) {
            if (err instanceof Error) {
                log('Error', `Error on fakeSearchCrawlers check: IP: ${req.ip} Msg: ${err.message}`);
            }
            return false;
        }
    }
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
 * Changes the prefix list of Google and Bing into an array
 */
function parsePrefixList(arr: unknown) {
    const list: string[] = [];
    if (!Array.isArray(arr)) {
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
 * Downloads Google and Bing ip list and adds DuckDuckGo ips
 */
function updateIPWhitelist() {
    ipList.length = 0;
    // Google
    httpGET('https://www.gstatic.com/ipranges/goog.json').then(data => {
        let json = JSON.parse(data);
        ipList.push(...parsePrefixList(json.prefixes));
        // Bing
        httpGET('https://www.gstatic.com/ipranges/goog.json').then(data => {
            json = JSON.parse(data);
            ipList.push(...parsePrefixList(json.prefixes));
            // DuckDuckGo 
            // https://raw.githubusercontent.com/duckduckgo/duckduckgo-help-pages/master/_docs/results/duckduckbot.md
            ipList.push(...['20.191.45.212', '40.88.21.235', '40.76.173.151', '40.76.163.7', '20.185.79.47', '52.142.26.175', '20.185.79.15', '52.142.24.149', '40.76.162.208', '40.76.163.23', '40.76.162.191', '40.76.162.247']);
            refactorIPArray(ipList);
            ipWhitelist = new Matcher(ipList);
        }).catch(err => {
            if (err instanceof Error) {
                log('Error', 'Exception while updating Bing / DuckDUckGo ip whitelist: ' + err.message);
            }
        });
    }).catch(err => {
        if (err instanceof Error) {
            log('Error', 'Exception while updating Google ip whitelist: ' + err.message);
        }
    });

    setTimeout(updateIPWhitelist, 3600000); //1 hour
}

/**
 * Adds an ip address to the fakeSearchCrawlers whitelist 
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

