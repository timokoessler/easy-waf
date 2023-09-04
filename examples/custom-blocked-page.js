const express = require('express');
const easyWaf = require('easy-waf');
const app = express();

//Placeholders: {dateTime} {ip} {referenceID} {moduleName}

app.use(
    easyWaf({
        customBlockedPage: `<!DOCTYPE html><html lang="en" style="height:95%;">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
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
                    You have sent a suspicious request, therefore your request has been blocked.<br>
                    <strong>This is a custom blocked page.</strong></p>
                    <hr style="margin-top:1rem;margin-bottom:1rem;border:0;border-top:1px solid rgba(0, 0, 0, 0.1);">
                    <p>Time: {dateTime}<br>
                    Your IP: {ip}<br>
                    Reference ID: {referenceID}</p>
                </div>
            </div>
        </body>
    </html>`,
    }),
);

app.get('/get', function (req, res) {
    res.status(200).send();
});

app.listen(3000);
