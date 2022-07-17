
/**
* @typedef {Object} EasyWafConfig
* 
* @property {Array.<String>} [allowedHTTPMethods]
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