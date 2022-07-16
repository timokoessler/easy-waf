
/**
* @typedef {Object} EasyWafConfig
* 
* @property {Array.<String>} [allowedHTTPMethods]
*/

/** @typedef {"Info" | "Warn" | "Error" } EasyWAFLogType */

/** @typedef {"HTTPMethod" } EasyWAFModuleName */

/**
* @typedef {Object} EasyWafBlockInfo
* 
* @property {EasyWAFModuleName} module
* @property {String} ip
* @property {String} userAgent
* @property {String} path
*/