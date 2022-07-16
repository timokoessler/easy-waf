const logger = require('./logger');

/**
 * 
 * @param {import('express').Response} res 
 * @param {EasyWafBlockInfo} info 
 */
function blocked(res, info){
    res.status(403).send(`<!DOCTYPE html><html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>403 Forbidden</title>
        </head>
        <body style="font-family: sans-serif;">
            <div style="text-align:center;margin-top:150px;margin-left:auto;margin-right:auto;">
                <h1>403 Forbidden</h1>
            </div>
        </body>
    </html>`);
}

module.exports = blocked;