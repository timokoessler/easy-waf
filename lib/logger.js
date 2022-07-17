
/**
 * 
 * @param {EasyWAFLogType} type 
 * @param {String} msg 
 */
function log(type, msg){
    if(type === 'Info'){
        console.info('EasyWAF - Info: ' + msg + ' - ' + new Date().toUTCString());
    } else if(type === 'Warn'){
        console.warn('EasyWAF - Warning: ' + msg + ' - ' + new Date().toUTCString());
    } else {
        console.error('EasyWAF - Error: ' + msg + ' - ' + new Date().toUTCString());
    }
}

/**
 * 
 * @param {EasyWAFModuleInfo} moduleInfo 
 * @param {import('express').Request} req 
 * @param {String} referenceID 
 */
function requestBlocked(moduleInfo, req, referenceID){
    console.warn('EasyWAF - Blocked: ip=' + req.ip + ' module=' + moduleInfo.name + ' time=' + new Date().getTime() + ' path=' + req.originalUrl + ' rid=' + referenceID);
}

module.exports = {
    log: log,
    requestBlocked: requestBlocked
};
