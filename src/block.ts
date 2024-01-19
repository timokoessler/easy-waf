import { sha256 } from './utils';
import { logBlockedRequest } from './logger';
import type { EasyWaf } from './types';

/**
 *
 */
export async function block(req: EasyWaf.Request, res: EasyWaf.Response, moduleName: string, config: EasyWaf.Config): Promise<boolean> {
    const date = new Date();
    const referenceID = sha256(req.ip + date.getTime());

    if (typeof config.preBlockHook === 'function' && (await config.preBlockHook(req, moduleName, req.ip)) === false) {
        return false;
    }

    if (!config.dryMode) {
        res.writeHead(403, { 'Content-Type': 'text/html' });
        if (!config.customBlockedPage) {
            res.write(
                `<!DOCTYPE html><html lang="en" style="height:95%;">
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <meta name="robots" content="noindex">
                    <title>403 Forbidden</title>
                    <style>p { line-height: 20px; };</style>
                </head>
                <body style="font-family:sans-serif;height:100%;">
                    <div style="display:flex;justify-content:center;align-items:center;height:100%;">
                        <div style="max-width:90%;word-wrap:break-word;">
                            <h1 style="margin-bottom:10px;">🛑 Request blocked</h1>
                            <h3 style="font-weight:normal;margin-top:0px;margin-bottom:5px;margin-left:52px;">403 Forbidden</h3>
                            <hr style="margin-top:1rem;margin-bottom:1rem;border:0;border-top:1px solid rgba(0, 0, 0, 0.1);">
                            <p>This website uses a firewall to protect itself from online attacks.<br>
                            You have sent a suspicious request, therefore your request has been blocked.</p>
                            <hr style="margin-top:1rem;margin-bottom:1rem;border:0;border-top:1px solid rgba(0, 0, 0, 0.1);">
                            <p>Time: ` +
                    date.toUTCString() +
                    `<br>
                            Your IP: ` +
                    req.ip +
                    `<br>
                            Reference ID: ` +
                    referenceID +
                    `</p>
                        </div>
                    </div>
                </body>
            </html>`,
            );
        } else {
            const mapObj = {
                dateTime: date.toUTCString(),
                ip: req.ip,
                referenceID: referenceID,
                moduleName: moduleName,
            };
            res.write(
                config.customBlockedPage.replace(/{\w+}/g, (matched) => {
                    return mapObj[matched.slice(1, -1) as keyof typeof mapObj];
                }),
            );
        }
        res.end();
    }

    logBlockedRequest(moduleName, req, referenceID, config);

    if (typeof config.postBlockHook === 'function') {
        await config.postBlockHook(req, moduleName, req.ip);
    }

    if (config.dryMode) {
        return false;
    }
    return true;
}
