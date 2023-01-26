const logger = require('../logger');
const utils = require('../utils');

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

async function updateTorExitNodesList(){
    try {
        let data = await utils.httpGET('https://check.torproject.org/torbulkexitlist');
        data = data.split(/\r?\n/);
        data = data.filter(line => line.length != 0);
        if(Array.isArray(data)) torExitNodes = data;
    } catch (e) /* istanbul ignore next */ {
        logger.log('Error', 'Exception while updating Tor Exit Nodes list: ' + e.message);
    }
    setTimeout(updateTorExitNodesList, 3600000); //1 hour
}

/**
 * 
 * @param {EasyWAFRequestInfo} data
 * @returns {Boolean} Is false when a possible security incident has been found
 */
function check(data){
    if(torExitNodes.includes(data.ip)){
        return false;
    }
    return true;
}

module.exports = {
    init: init,
    check: check,
    info: () => {
        /* istanbul ignore next */
        return {
            name: 'blockTorExitNodes'
        };
    }
};