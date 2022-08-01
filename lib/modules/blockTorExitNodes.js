const https = require('https');
const logger = require('../logger');

/** @type {EasyWafConfig} */
var config;
/** @type {Array} */
var torExitNodes = [];

/**
 * 
 * @param {EasyWafConfig} conf
 */
function init(conf){
    config = conf;

    if(('enabled' in config.modules.blockTorExitNodes && config.modules.blockTorExitNodes.enabled)){
        updateTorExitNodesList();
    }
}

function updateTorExitNodesList(cb){
    try {
        https.get('https://check.torproject.org/torbulkexitlist', {timeout: 5000}, (res) => {
            let data = '';
        
            res.on('data', (chunk) => {
                data += chunk;
            });
        
            res.on('end', () => {
                /* istanbul ignore if */
                if(!data || res.statusCode !== 200){
                    logger.log('Error', 'Error while updating Tor Exit Nodes list: No data or wrong status code.');
                    return;
                }
                torExitNodes = data.split(/\r?\n/);
                torExitNodes = torExitNodes.filter(line => line.length != 0);
                if(cb) cb(torExitNodes);
            });
        // eslint-disable-next-line security-node/detect-unhandled-event-errors
        }).on('error', /* istanbul ignore next */ (err) => {
            logger.log('Error', 'Error while updating Tor Exit Nodes list: ' + err.message);
            if(cb) cb([]);
        });
    } catch (e) /* istanbul ignore next */ {
        logger.log('Error', 'Exception while updating Tor Exit Nodes list: ' + e.message);
        if(cb) cb([]);
    }
    setTimeout(updateTorExitNodesList, 3600); //1 hour
}

/**
 * 
 * @param {EasyWAFModuleCheckData} data
 * @returns {Boolean} Is false when a possible security incident has been found
 */
function check(data){    
    if(('enabled' in config.modules.blockTorExitNodes && !config.modules.blockTorExitNodes.enabled) || (config.modules.blockTorExitNodes.excludePaths instanceof RegExp && config.modules.blockTorExitNodes.excludePaths.test(data.path))){
        return true;
    }

    if(torExitNodes.includes(data.ip)){
        return false;
    }

    return true;
}

module.exports = {
    init: init,
    check: check,
    /* istanbul ignore next */
    info: () => {
        return {
            name: 'blockTorExitNodes'
        };
    },
    updateTorExitNodesList: updateTorExitNodesList
};