
/**
* @typedef {Object} EasyWafConfig
* 
* @property {Array.<String>} [allowedHTTPMethods] List all HTTP request methods that are allowed. All other request methods will be blocked.
* @property {Boolean} [dryMode] If true, suspicious requests are only logged and not blocked. Also, the log format is changed so that an IPS does not ban the IP
* @property {Boolean} [disableRequestBlockedLogging] If true, blocked attacks are no longer logged and thus cannot be processed by an IPS and false positives cannot be traced.
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
* @property {function():boolean} check
* @property {function():EasyWAFModuleInfo} info
*/

/**
* @typedef {Object} EasyWAFModuleCheckData
* 
* @property {String} url
* @property {String} body
*/