const block = require('./block');
const logger = require('./logger');
const modules = require('./modules/index');
const proxyaddr = require('proxy-addr');
const CIDRMatcher = require('cidr-matcher');

/** @type {EasyWafConfig} */
var config = {
    allowedHTTPMethods: undefined,
    dryMode: false,
    disableLogging: false,
    ipBlacklist: [],
    ipWhitelist: [],
    redirectUrlWhitelist: undefined,
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
        }
    },
    trustProxy: []
};

var trustProxy, ipBlacklist, ipWhitelist;

/**
 * 
 * @param {Array.<String>} array 
 */
function refactorIPArray(array){
    array.forEach((ip, i, a) => {
        if(!ip.includes('/')){
            if(ip.includes(':')){
                a[i] += '/128';
            } else {
                a[i] += '/32';
            }
        }
    });
}

/**
 * 
 * @param {String|Array.<String>|Function|Boolean|Number} val 
 * @returns {Function}
 */
function compileProxyTrust(val){
    if(typeof val === 'function'){
        return val;
    }
    if (typeof val === 'number') {
        return function(a, i){ return i < val; };
    }
    if (typeof val === 'boolean') {
        return function(){ return val; };
    }

    return proxyaddr.compile(val);
}

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
            refactorIPArray(conf.ipBlacklist);
            ipBlacklist = new CIDRMatcher(conf.ipBlacklist);
        }

        if(typeof conf.ipWhitelist != 'undefined'){
            if(!Array.isArray(conf.ipWhitelist)){
                /* istanbul ignore next */
                throw new Error('EasyWafConfig: ipWhitelist is not an array');
            }
            refactorIPArray(conf.ipWhitelist);
            ipWhitelist = new CIDRMatcher(conf.ipWhitelist);
        }

        conf.modules = {...config.modules, ...conf.modules};
        config = {...config, ...conf};
    }

    trustProxy = compileProxyTrust(config.trustProxy);

    for (var i of Object.keys(modules)) {
        modules[i].init(config);
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
            block(req, res, {name: 'IPBlacklist'}, config, ip);
            if(config.dryMode) next();
            return;
        }

        if(Array.isArray(config.allowedHTTPMethods) && !config.allowedHTTPMethods.includes(req.method)){
            block(req, res, {name: 'HTTPMethod'}, config, ip);
            if(config.dryMode) next();
            return;
        }

        try {
            var url = decodeURIComponent(req.url);
        } catch(e) {
            block(req, res, {name: 'uriMalformed'}, config, ip);
            if(config.dryMode) next();
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

        for (var i of Object.keys(modules)) {
            if(!modules[i].check(reqInfo)){
                block(req, res, modules[i].info(), config, reqInfo.ip);
                if(config.dryMode) next();
                return;
            }
        }

        next();
    };
}

module.exports = easyWaf;