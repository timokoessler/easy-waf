
/**
* @typedef {Object} EasyWafConfig
* 
* @property {Array.<String>} [allowedHTTPMethods] List of all HTTP request methods that are allowed. All other request methods will be blocked.
* @property {Boolean} [dryMode] If true, suspicious requests are only logged and not blocked. In addition, the log format is changed to prevent an IPS from blocking the IP.
* @property {Boolean} [disableLogging] If true, nothing is logged. This is not recommended!
* @property {EasyWafConfigModules} [modules] This option allows you to enable / disable modules or exclude paths with a regex
*/

/**
* @typedef {Object} EasyWafConfigModules
* 
* @property {EasyWafConfigModule} [directoryTraversal]
* @property {EasyWafConfigModule} [xss] Cross-Site-Scripting
* @property {EasyWafConfigModule} [badBots]
* @property {EasyWafConfigModule} [prototypePollution]
* @property {EasyWafConfigModule} [sqlInjection]
* @property {EasyWafConfigModule} [noSqlInjection]
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
* @property {String} url
* @property {String} path Url path without query or fragments
* @property {String} body
* @property {String} ua User Agent
*/