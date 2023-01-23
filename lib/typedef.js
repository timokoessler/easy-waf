
/**
* @typedef {Object} EasyWafConfig
* 
* @property {Array.<String>} [allowedHTTPMethods] List of all HTTP request methods that are allowed. All other request methods will be blocked. Don't forget lesser known methods like HEAD or OPTIONS
* @property {String} [customBlockedPage] Add HTML code to override the default "Request blocked" page. Placeholders: {dateTime} {ip} {referenceID} {moduleName}. You can find an example in the Git repo.
* @property {Array.<String>} [queryUrlWhitelist] List of urls that are allowed to be included in the path or query of the request url. If it's undefined (default value), all urls are allowed.
* @property {Boolean} [dryMode] If true, suspicious requests are only logged and not blocked. In addition, the log format is changed to prevent an IPS from blocking the IP.
* @property {Boolean} [disableLogging] If true, nothing is logged. This is not recommended!
* @property {Array.<String>} [ipBlacklist] All requests by ips on the blacklist are blocked. CIDR notation is supported (IPv4 and IPv6). On single addresses, a prefix of /32 or /128 is assumed.
* @property {Array.<String>} [ipWhitelist] All requests by ips on the whitelist are never blocked. CIDR notation is supported.
* @property {EasyWafConfigModules} [modules] This option allows you to enable / disable modules or exclude paths with a regex
* @property {EasyWAFPostBlockHook} [postBlockHook] Run your own code after a request is blocked. For example, you can send a notification.
* @property {EasyWAFPreBlockHook} [preBlockHook] Run your own code before a request is blocked. Return false if the request should not be blocked.
* @property {String|Array.<String>|Function|Boolean|Number} [trustProxy] If a reverse proxy is used, this setting must be configured. See https://www.npmjs.com/package/proxy-addr for possible values.
*/

/**
* @typedef {Object} EasyWafConfigModules
* 
* @property {EasyWafConfigModule} [badBots]
* @property {EasyWafConfigModule} [blockTorExitNodes]
* @property {EasyWafConfigModule} [crlfInjection]
* @property {EasyWafConfigModule} [directoryTraversal]
* @property {EasyWafConfigModule} [fakeSearchCrawlers] Blocks crawlers that pretend to be a google bot or a bot from other major search engines or internet companies.
* @property {EasyWafConfigModule} [httpParameterPollution]
* @property {EasyWafConfigModule} [noSqlInjection]
* @property {EasyWafConfigModule} [openRedirect]
* @property {EasyWafConfigModule} [prototypePollution]
* @property {EasyWafConfigModule} [sqlInjection]
* @property {EasyWafConfigModule} [xss] Cross-Site-Scripting
*/

/**
* @typedef {Object} EasyWafConfigModule
* 
* @property {Boolean} enabled This option allows you to completely disable a module.
* @property {RegExp} [excludePaths] Exclude paths from being checked by this module with a regex
*/

/** @typedef {"Info" | "Warn" | "Error" } EasyWAFLogType */

/**
* @typedef {Object} EasyWAFModuleInfo
* 
* @property {String} name
*/

/**
* @typedef {Object} EasyWAFModule
* 
* @property {function(EasyWAFRequestInfo):boolean} check
* @property {function():EasyWAFModuleInfo} info
* @property {function(EasyWafConfig):void} init
*/

/**
* @typedef {Object} EasyWAFRequestInfo
* 
* @property {String} body Body as string, can be undefined
* @property {String} headers A string that contains the values of all headers
* @property {String} ip
* @property {String} method HTTP method (POST/GET...)
* @property {String} path Url path without query or fragments
* @property {Object} query Parsed url query
* @property {String} ua User Agent
* @property {String} url Decoded url
*/

/**
* @callback EasyWAFPreBlockHook
* @param {import('http').IncomingMessage} req
* @param {EasyWAFModuleInfo} moduleInfo
* @param {String} ip
* @returns {Boolean}
*/

/**
* @callback EasyWAFPostBlockHook
* @param {import('http').IncomingMessage} req
* @param {EasyWAFModuleInfo} moduleInfo
* @param {String} ip
*/

/**
* @typedef {Object} EasyWAFExtendIncomingMessage
* 
* @property {Object} [body]
* @property {Object} [query]
*/