import { log } from '../logger';
import { httpGET } from '../utils';
import type { EasyWaf } from '../types';

let config: EasyWaf.Config;
let torExitNodes: string[] = [];

async function updateTorExitNodesList() {
    try {
        const data = await httpGET('https://check.torproject.org/torbulkexitlist');
        if (typeof data !== 'string') {
            throw new Error('Data is not a string');
        }
        let arr = data.split(/\r?\n/);
        if (!Array.isArray(arr)) {
            throw new Error('Data is not an array');
        }
        arr = arr.filter(line => line.length != 0);
        torExitNodes = arr;
    } catch (err) {
        if (err instanceof Error) {
            log('Error', 'Exception while updating Tor Exit Nodes list: ' + err.message);
        }
    }
    setTimeout(updateTorExitNodesList, 3600000); //1 hour
}

export default {
    init: (conf: EasyWaf.Config) => {
        config = conf;
        if (config.modules?.blockTorExitNodes && 'enabled' in config.modules.blockTorExitNodes && config.modules.blockTorExitNodes.enabled) {
            updateTorExitNodesList();
        }
    },
    check: (req: EasyWaf.Request) => {
        if (torExitNodes.includes(req.ip)) {
            return false;
        }
        return true;
    },
};