import type { EasyWaf } from './types';

/**
 * Log a message to the Node.js console
 * @param type - The type of the log message (Info, Warn, Error)
 * @param msg - The message to log
 */
export function log(type: 'Info' | 'Warn' | 'Error', msg: string) {
    if (type === 'Info') {
        /* istanbul ignore next */
        console.info(`EasyWAF - Info: ${msg} - ${new Date().getTime()}`);
    } else if (type === 'Warn') {
        console.warn(`EasyWAF - Warning: ${msg} - ${new Date().getTime()}`);
    } else {
        /* istanbul ignore next */
        console.error(`EasyWAF - Error: ${msg} - ${new Date().getTime()}`);
    }
}

/**
 * Log a blocked request to the Node.js console
 * @param moduleName - The name of the module that blocked the request
 * @param req - The request object
 * @param referenceID - The reference ID of the request
 * @param config - The EasyWAF configuration object
 */
export function logBlockedRequest(moduleName: string, req: EasyWaf.Request, referenceID: string, config: EasyWaf.Config) {
    if (config.disableLogging) return;
    const url = req.url.replace(/(\n|\r|\v)/gi, '').replace(/"/g, '&quot;');
    const ua = req.ua.replace(/(\n|\r|\v)/gi, '').replace(/"/g, '&quot;');

    console.warn(
        (!config.dryMode ? 'EasyWAF - Blocked:' : 'EasyWAF DryMode - Blocked:') +
            ' ip=' +
            req.ip +
            ' module=' +
            moduleName +
            ' time=' +
            new Date().getTime() +
            ' url="' +
            url +
            '" ua="' +
            ua +
            '" method=' +
            req.method +
            ' rid=' +
            referenceID,
    );
}
