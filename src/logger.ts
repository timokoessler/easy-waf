import type { EasyWaf } from './types';

/**
 *
 */
export function log(type: EasyWaf.LogType, msg: string) {
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
 *
 */
export function requestBlocked(moduleName: string, req: EasyWaf.Request, referenceID: string, config: EasyWaf.Config) {
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
