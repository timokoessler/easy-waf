/**
 * 
 * @param {EasyWAFLogType} type 
 * @param {String} msg 
 */
function log(type, msg){
    if(type === 'Info'){ /* istanbul ignore next */
        console.info('EasyWAF - Info: ' + msg + ' - ' + new Date().getTime());
    } else if(type === 'Warn'){
        console.warn('EasyWAF - Warning: ' + msg + ' - ' + new Date().getTime());
    } else { /* istanbul ignore next */
        console.error('EasyWAF - Error: ' + msg + ' - ' + new Date().getTime());
    }
}

/**
 * 
 * @param {EasyWAFModuleInfo} moduleInfo 
 * @param {import('http').IncomingMessage} req 
 * @param {String} referenceID 
 * @param {EasyWafConfig} config 
 * @param {String} ip
 */
function requestBlocked(moduleInfo, req, referenceID, config, ip){
    if(config.disableLogging) return;
    var url = req.url.replace(/(\n|\r|\v)/ig, '').replace(/"/g, '&quot;');
    var ua = (req.headers['user-agent'] || '').replace(/(\n|\r|\v)/ig, '').replace(/"/g, '&quot;');

    console.warn((!config.dryMode ? 'EasyWAF - Blocked:' : 'EasyWAF DryMode - Blocked:') + ' ip=' + ip + ' module=' + moduleInfo.name + ' time=' + new Date().getTime() + ' url="' + url + '" ua="' + ua + '" method=' + req.method + ' rid=' + referenceID);
}

module.exports = {
    log: log,
    requestBlocked: requestBlocked
};
