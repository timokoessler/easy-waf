
/**
* @typedef {Object} EasyWafConfig
* 
* @property {Array.<String>} [allowedHTTPMethods] List of all HTTP request methods that are allowed. All other request methods will be blocked.
* @property {Array.<String>} [redirectUrlWhitelist] List of urls that are allowed to be included in the path or query of the request url. If it's undefined (default value), all urls are allowed.
* @property {Boolean} [dryMode] If true, suspicious requests are only logged and not blocked. In addition, the log format is changed to prevent an IPS from blocking the IP.
* @property {Boolean} [disableLogging] If true, nothing is logged. This is not recommended!
* @property {Array} [ipBlacklist] All requests by ips on the blacklist are blocked
* @property {EasyWafConfigModules} [modules] This option allows you to enable / disable modules or exclude paths with a regex
*/

/**
* @typedef {Object} EasyWafConfigModules
* 
* @property {EasyWafConfigModule} [badBots]
* @property {EasyWafConfigModule} [blockTorExitNodes]
* @property {EasyWafConfigModule} [crlfInjection]
* @property {EasyWafConfigModule} [directoryTraversal]
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
* @property {function(EasyWAFModuleCheckData):boolean} check
* @property {function():EasyWAFModuleInfo} info
*/

/**
* @typedef {Object} EasyWAFModuleCheckData
* 
* @property {String} url Decoded url
* @property {String} encodedUrl Encoded url
* @property {String} ip
* @property {String} path Url path without query or fragments
* @property {String} body Body as String, can be undefined
* @property {String} ua User Agent
*/