/**
 * 
 * @param {EasyWAFLogType} type 
 * @param {String} msg 
 */
function log(type, msg){
    if(type === 'Info'){
        console.info('EasyWAF - Info: ' + msg + ' - ' + new Date().getTime());
    } else if(type === 'Warn'){
        console.warn('EasyWAF - Warning: ' + msg + ' - ' + new Date().getTime());
    } else {
        console.error('EasyWAF - Error: ' + msg + ' - ' + new Date().getTime());
    }
}

/**
 * 
 * @param {EasyWAFModuleInfo} moduleInfo 
 * @param {import('express').Request} req 
 * @param {String} referenceID 
 * @param {EasyWafConfig} config 
 */
function requestBlocked(moduleInfo, req, referenceID, config){
    console.warn((!config.dryMode ? 'EasyWAF - Blocked:' : 'EasyWAF DryMode - Blocked:') + ' ip=' + req.ip + ' module=' + moduleInfo.name + ' time=' + new Date().getTime() + ' path="' + req.originalUrl + '" rid=' + referenceID);
}

module.exports = {
    log: log,
    requestBlocked: requestBlocked
};
