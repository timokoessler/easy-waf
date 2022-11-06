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
        directoryTraversal: {
            enabled: true
        },
        xss: {
            enabled: true
        },
        badBots: {
            enabled: true
        },
        prototypePollution: {
            enabled: true
        },
        sqlInjection: {
            enabled: true
        },
        noSqlInjection: {
            enabled: true
        },
        crlfInjection: {
            enabled: true
        },
        blockTorExitNodes: {
            enabled: false
        },
        openRedirect: {
            enabled: true
        },
        fakeSearchCrawlers: {
            enabled: true
        }
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

    for (let key of Object.keys(modules)) {
        modules[key].init(config);
    }

    return function EasyWaf(
        /** @type {import('http').IncomingMessage} */ req,
        /** @type {import('http').ServerResponse} **/ res,
        /** @type {CallableFunction} **/ next){

        /** @type {String} */
        var ip = proxyaddr(req, trustProxy);

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

        try {
            var url = decodeURIComponent(req.url);
        } catch(e) {
            if(!block(req, res, {name: 'uriMalformed'}, config, ip)){
                next();
            }
            return;
        }

        /** @type {EasyWAFRequestInfo} */
        var reqInfo = {
            url: url,
            ip: ip,
            path: url.match('^[^?]*')[0],
            body: undefined,
            ua: req.headers['user-agent'] || '',
            method: req.method,
            headers: Object.values(req.headers).join()
        };

        //@ts-ignore
        if(typeof req.body !== 'undefined'){
            //@ts-ignore
            if(typeof req.body === 'object' && Object.keys(req.body).length){
                //@ts-ignore
                reqInfo.body = JSON.stringify(req.body);
                //@ts-ignore
            } else if(typeof req.body === 'string'){
                //@ts-ignore
                reqInfo.body = req.body;
            }
        }

        modulesLoop(modules, Object.keys(modules), 0, req, res, reqInfo, next);
    };
}

/**
 * 
 * @param {Object} modules 
 * @param {Array.<String>} moduleKeys 
 * @param {Number} i 
 * @param {import('http').IncomingMessage} req 
 * @param {import('http').ServerResponse} res 
 * @param {EasyWAFRequestInfo} reqInfo 
 * @param {Function} next 
 * @returns 
 */
function modulesLoop(modules, moduleKeys, i, req, res, reqInfo, next){
    if(i >= moduleKeys.length){
        next();
        return;
    }
    let key = moduleKeys[i];
    if(typeof modules[key].check === 'function'){
        if(!modules[key].check(reqInfo)){
            if(block(req, res, modules[key].info(), config, reqInfo.ip)){
                return;
            }
        }
    } else if(typeof modules[key].checkCB === 'function'){
        modules[key].checkCB(reqInfo, (ok) => {
            if(!ok){
                if(block(req, res, modules[key].info(), config, reqInfo.ip)){
                    return;
                }
            }
            modulesLoop(modules, moduleKeys, ++i, req, res, reqInfo, next);
        });
        return;
    }
    modulesLoop(modules, moduleKeys, ++i, req, res, reqInfo, next);
}

module.exports = easyWaf;