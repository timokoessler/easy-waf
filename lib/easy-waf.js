const block = require('./block');
const logger = require('./logger');
const modules = require('./modules/index');
const proxyaddr = require('proxy-addr');
const CIDRMatcher = require('cidr-matcher');
const utils = require('./utils');

/** @type {EasyWafConfig} */
var config = {
    allowedHTTPMethods: undefined,
    customBlockedPage: undefined,
    dryMode: false,
    disableLogging: false,
    ipBlacklist: [],
    ipWhitelist: [],
    queryUrlWhitelist: undefined,
    modules: {
        badBots: {
            enabled: true
        },
        blockTorExitNodes: {
            enabled: false
        },
        crlfInjection: {
            enabled: true
        },
        directoryTraversal: {
            enabled: true
        },
        fakeSearchCrawlers: {
            enabled: true
        },
        httpParameterPollution: {
            enabled: true,
        },
        noSqlInjection: {
            enabled: true
        },
        openRedirect: {
            enabled: true
        },
        prototypePollution: {
            enabled: true
        },
        sqlInjection: {
            enabled: true
        },
        xss: {
            enabled: true
        },
    },
    postBlockHook: undefined,
    preBlockHook: undefined,
    trustProxy: []
};

var trustProxy, ipBlacklist, ipWhitelist;

/**
 * 
 * @param {EasyWafConfig} [conf]
 * @return {Function} 
 */
function easyWaf(conf){
    if(typeof conf === 'object' && conf !== null && !Array.isArray(conf)){

        if(conf.allowedHTTPMethods && Array.isArray(conf.allowedHTTPMethods)){
            Object.keys(conf.allowedHTTPMethods).forEach((i) => {
                if(typeof conf.allowedHTTPMethods[i] !== 'string'){
                    /* istanbul ignore next */
                    throw new Error('EasyWafConfig: allowedHTTPMethods may only contain strings!');
                }
                conf.allowedHTTPMethods[i] = conf.allowedHTTPMethods[i].toUpperCase();
            });
        }

        if(conf.dryMode && typeof conf.dryMode != 'boolean'){
            /* istanbul ignore next */
            throw new Error('EasyWafConfig: dryMode is not a boolean');
        } else if(conf.dryMode && !conf.disableLogging){
            logger.log('Warn', 'DryMode is enabled. Suspicious requests are only logged and not blocked!');
        }

        if(typeof conf.ipBlacklist != 'undefined'){
            if(!Array.isArray(conf.ipBlacklist)){
                /* istanbul ignore next */
                throw new Error('EasyWafConfig: ipBlacklist is not an array');
            }
            utils.refactorIPArray(conf.ipBlacklist);
            ipBlacklist = new CIDRMatcher(conf.ipBlacklist);
        }

        if(typeof conf.ipWhitelist != 'undefined'){
            if(!Array.isArray(conf.ipWhitelist)){
                /* istanbul ignore next */
                throw new Error('EasyWafConfig: ipWhitelist is not an array');
            }
            utils.refactorIPArray(conf.ipWhitelist);
            ipWhitelist = new CIDRMatcher(conf.ipWhitelist);
        }

        conf.modules = {...config.modules, ...conf.modules};
        config = {...config, ...conf};
    }

    trustProxy = utils.compileProxyTrust(config.trustProxy);

    for (const [, module] of Object.entries(modules)) {
        if(typeof module.init === 'function'){
            module.init(config);
        }
    }

    return async function EasyWaf(
        /** @type {import('http').IncomingMessage & EasyWAFExtendIncomingMessage} */ req,
        /** @type {import('http').ServerResponse} **/ res,
        /** @type {CallableFunction} **/ next){

        /** @type {String} */
        const ip = proxyaddr(req, trustProxy);

        if(typeof ip === 'undefined'){
            /* istanbul ignore next */
            throw new Error('EasyWAF: Unable to determine client IP');
        }
    
        if(typeof ipWhitelist !== 'undefined' && ipWhitelist.contains(ip)){
            next();
            return;
        }

        if(typeof ipBlacklist !== 'undefined' && ipBlacklist.contains(ip)){
            if(block(req, res, {name: 'IPBlacklist'}, config, ip)){
                return;
            }
        }

        if(Array.isArray(config.allowedHTTPMethods) && !config.allowedHTTPMethods.includes(req.method)){
            if(block(req, res, {name: 'HTTPMethod'}, config, ip)){
                return;
            }
        }

        let url = '';
        try {
            url = decodeURIComponent(req.url);
        } catch(e) {
            if(!block(req, res, {name: 'uriMalformed'}, config, ip)){
                next();
            }
            return;
        }

        /** @type {EasyWAFRequestInfo} */
        const reqInfo = {
            body: undefined,
            headers: Object.values(req.headers).join(),
            ip,
            method: req.method,
            path: url.match('^[^?]*')[0],
            query: (typeof req.query === 'object' ? req.query : {}),
            ua: req.headers['user-agent'] || '',
            url,
        };

        if(typeof req.body !== 'undefined'){
            if(typeof req.body === 'object' && Object.keys(req.body).length){
                reqInfo.body = JSON.stringify(req.body);
            } else if(typeof req.body === 'string'){
                reqInfo.body = req.body;
            }
        }

        for (const [key, module] of Object.entries(modules)) {
            if(('enabled' in config.modules[key] && !config.modules[key].enabled) || (config.modules[key].excludePaths instanceof RegExp && config.modules[key].excludePaths.test(reqInfo.path))){
                continue;
            }
            let ok = await module.check(reqInfo);
            if(!ok && block(req, res, module.info(), config, reqInfo.ip)){
                return;
            }
        }
        next();
    };
}

module.exports = easyWaf;