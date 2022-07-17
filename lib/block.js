const logger = require('./logger');
const crypto = require('crypto');

/**
 * 
 * @param {import('express').Request} req 
 * @param {import('express').Response} res 
 * @param {EasyWAFModuleInfo} moduleInfo 
 */
function blocked(req, res, moduleInfo){

    /** @type {Date} */
    var date = new Date();
    /** @type {String} */
    var referenceID = crypto.createHash('sha256').update(req.ip + date.getTime()).digest('hex');

    res.status(403).send(`<!DOCTYPE html><html lang="en" style="height:95%;">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>403 Forbidden</title>
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
                    <p>Time: ` + date.toUTCString() + `<br>
                    Your IP: ` + req.ip + `<br>
                    Reference ID: ` + referenceID + `</p>
                </div>
            </div>
        </body>
    </html>`);

    logger.requestBlocked(moduleInfo, req, referenceID);
}

module.exports = blocked;