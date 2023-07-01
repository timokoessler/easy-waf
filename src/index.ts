import proxyaddr from 'proxy-addr';
import { Matcher as IPMatcher } from 'netparser';
import { compileProxyTrust } from './utils';
import * as modules from './modules';
import { block } from './block';
import * as logger from './logger';
import type { EasyWaf } from './types';

let config: EasyWaf.Config = {
    dryMode: false,
    disableLogging: false,
    modules: {
        blockTorExitNodes: {
            enabled: false
        },
    }
};

let trustProxy: string | string[] | ((addr: string, i: number) => boolean);
let ipBlacklist: IPMatcher, ipWhitelist: IPMatcher;

export type { EasyWaf };

/**
 * EasyWAF Middleware - View examples at https://github.com/timokoessler/easy-waf/tree/main/examples
 * @param conf Optional configuration
 */
export default function easyWaf(conf?: EasyWaf.Config) {
    if (typeof conf === 'object' && conf !== null && !Array.isArray(conf)) {

        if (Array.isArray(conf.allowedHTTPMethods)) {
            for (const [i,] of conf.allowedHTTPMethods.entries()) {
                if (typeof conf.allowedHTTPMethods[i] !== 'string') {
                    /* istanbul ignore next */
                    throw new Error('EasyWafConfig: allowedHTTPMethods may only contain strings!');
                }
                conf.allowedHTTPMethods[i] = conf.allowedHTTPMethods[i].toUpperCase();
            }
        }

        if (conf.dryMode && typeof conf.dryMode != 'boolean') {
            /* istanbul ignore next */
            throw new Error('EasyWafConfig: dryMode is not a boolean');
        } else if (conf.dryMode && !conf.disableLogging) {
            logger.log('Warn', 'DryMode is enabled. Suspicious requests are only logged and not blocked!');
        }

        if (typeof conf.ipBlacklist !== 'undefined') {
            if (!Array.isArray(conf.ipBlacklist)) {
                /* istanbul ignore next */
                throw new Error('EasyWafConfig: ipBlacklist is not an array');
            }
            ipBlacklist = new IPMatcher(conf.ipBlacklist);
        }

        if (typeof conf.ipWhitelist !== 'undefined') {
            if (!Array.isArray(conf.ipWhitelist)) {
                /* istanbul ignore next */
                throw new Error('EasyWafConfig: ipWhitelist is not an array');
            }
            ipWhitelist = new IPMatcher(conf.ipWhitelist);
        }

        conf.modules = { ...config.modules, ...conf.modules };
        config = { ...config, ...conf };
    }

    trustProxy = compileProxyTrust(typeof config.trustProxy !== 'undefined' ? config.trustProxy : []) as string | string[] | ((addr: string, i: number) => boolean);

    for (const [, module] of Object.entries(modules)) {
        if (typeof (module as EasyWaf.Module).init === 'function') {
            (module as EasyWaf.Module).init?.(config);
        }
    }

    return async function EasyWaf(rawReq: EasyWaf.RawRequest, res: EasyWaf.Response, next: () => void) {
        const ip = proxyaddr(rawReq, trustProxy);

        if (typeof ip === 'undefined') {
            /* istanbul ignore next */
            throw new Error('EasyWAF: Unable to determine client IP');
        }

        if (typeof ipWhitelist !== 'undefined' && ipWhitelist.get(ip)) {
            next();
            return;
        }

        const req: EasyWaf.Request = {
            headers: Object.values(rawReq.headers).join(),
            ip,
            method: rawReq.method as string,
            path: '',
            query: (typeof rawReq.query === 'object' && rawReq.query !== null ? rawReq.query : {}),
            ua: rawReq.headers['user-agent'] || '',
            url: '',
            rawReq
        };
        try {
            req.url = decodeURIComponent(rawReq.url as string);
        } catch (e) {
            req.url = typeof rawReq.url === 'string' ? rawReq.url : '';
            if (!block(req, res, 'uriMalformed', config)) {
                next();
            }
            return;
        }
        const pathRegexRes = req.url.match('^[^?]*');
        req.path = Array.isArray(pathRegexRes) && typeof pathRegexRes[0] === 'string' ? pathRegexRes[0] : '';
        

        if (typeof ipBlacklist !== 'undefined' && ipBlacklist.get(ip)) {
            if (block(req, res, 'IPBlacklist', config)) {
                return;
            }
        }

        if (Array.isArray(config.allowedHTTPMethods) && !config.allowedHTTPMethods.includes(req.method)) {
            if (block(req, res, 'HTTPMethod', config)) {
                return;
            }
        }

        if (typeof rawReq.body !== 'undefined') {
            if (typeof rawReq.body === 'object' && rawReq.body !== null && Object.keys(rawReq.body).length) {
                req.body = JSON.stringify(rawReq.body);
            } else if (typeof rawReq.body === 'string') {
                req.body = rawReq.body;
            }
        }

        for (const [moduleName, module] of Object.entries(modules)) {
            if(typeof config.modules !== 'undefined' && moduleName in config.modules){
                if (!config.modules[moduleName as keyof EasyWaf.ConfigModules]?.enabled){
                    continue;
                }
                if (config.modules[moduleName as keyof EasyWaf.ConfigModules]?.excludePaths instanceof RegExp && config.modules[moduleName as keyof EasyWaf.ConfigModules]?.excludePaths?.test(req.path)) {
                    continue;
                }
            }
            const ok = await module.check(req);
            if (!ok && block(req, res, moduleName, config)) {
                return;
            }
        }
        next();
    };
}
