import { httpGET } from '../utils';
import { log } from '../logger';
import { reverse, lookup } from 'dns/promises';
import type { EasyWaf } from '../types';
import { Matcher } from 'netparser';

let config: EasyWaf.Config;

const uaRegex = new RegExp('(Google|Bingbot|AdIdxBot|BingPreview|MicrosoftPreview|DuckDuck(Go|Bot)|Yahoo!|Yandex\\S|Baiduspider|Qwantify|Pinterestbot|pinterest\.com\/bot|Twitterbot|facebookexternalhit|facebookcatalog)', 'i');
const rdnsRegex = new RegExp('(.googlebot.com|.google.com|.live.com|.msn.com|.bing.com|.microsoft.com|.yahoo.com|.yahoo.net|.yandex.net|.yandex.ru|.yandex.com|.baidu.com|.baidu.jp|.qwant.com|.pinterest.com|.pinterestcrawler.com|.twttr.com|.twitter.com)$', 'i');

let ipWhitelist: Matcher;

export default {
    init: (conf: EasyWaf.Config) => {
        config = conf;
        if (config.modules?.fakeCrawlers && 'enabled' in config.modules.fakeCrawlers && config.modules.fakeCrawlers.enabled && typeof process.env.TEST_FAKE_CRAWLERS !== 'string') {
            updateIPWhitelist();
        }
    },
    check: async (req: EasyWaf.Request) => {
        if (!uaRegex.test(req.ua)) {
            return true;
        }
        if (typeof ipWhitelist !== 'undefined' && ipWhitelist.has(req.ip)) {
            return true;
        }
        try {
            const hostnames = await reverse(req.ip);
            if (!Array.isArray(hostnames)) {
                return false;
            }
            const matchedHostname = [];
            for (const hostname of hostnames) {
                if (rdnsRegex.test(hostname)) {
                    matchedHostname.push(hostname);
                }
            }
            if (!matchedHostname.length) {
                return false;
            }
            for (const hostname of matchedHostname) {
                const lookupRes = await lookup(hostname);
                if (!lookupRes) {
                    continue;
                }
                if (lookupRes.address === req.ip) {
                    // The request comes from a real crawler, so add to the whitelist (only temporarily)
                    addIPToWhitelist(req.ip);
                    return true;
                }
            }
            return false;
        } catch (err) {
            /* istanbul ignore next */
            if (err instanceof Error) {
                log('Error', `Error on fakeCrawlers check: IP: ${req.ip} Msg: ${err.message}`);
            }
            return false;
        }
    },
    updateIPWhitelist: updateIPWhitelist,
};

/**
 * Updates the ip whitelist with the ip addresses of Google, Bing and DuckDuckGo.
 */
async function updateIPWhitelist(): Promise<void> {
    try {
        const result = await httpGET('https://raw.githubusercontent.com/timokoessler/easy-waf-data/main/data/crawler-ips/all.json');
        const json = JSON.parse(result);
        if(!Array.isArray(json)) throw new Error('Invalid JSON');
        ipWhitelist = new Matcher(json);
    } catch (err) {
        log('Error', 'Exception while updating Google ip whitelist: ' + (err as Error).message);
    }
    setTimeout(updateIPWhitelist, 1000*60*60*4); //4 hours
    return;
}

/**
 * Adds an IP to the fake crawler whitelist
 */
function addIPToWhitelist(ip: string) {
    if(typeof ipWhitelist === 'undefined'){
        ipWhitelist = new Matcher();
    }
    ipWhitelist.add(ip);
}

