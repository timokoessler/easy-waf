
/**
 * 
 * @param {EasyWAFLogType} type 
 * @param {String} msg 
 */
function log(type, msg){
    type = type.toLowerCase();
    if(type === 'info'){
        console.info('EasyWAF - Info: ' + msg + ' - ' + new Date().toUTCString());
    } else if(type === 'warn' || type === 'warning'){
        console.warn('EasyWAF - Warning: ' + msg + ' - ' + new Date().toUTCString());
    } else {
        console.error('EasyWAF - Error: ' + msg + ' - ' + new Date().toUTCString());
    }
}

/**
 * 
 *
 function accessBlocked(type, msg){
    throw new Error('Not yet implemented');
}*/

module.exports = {
    log: log
};
