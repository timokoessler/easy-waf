const express = require('express');
const easyWaf = require('easy-waf');
const nodemailer = require('nodemailer');
const app = express();

var mailTransporter = nodemailer.createTransport({
    host: 'mail.example.com',
    port: 587, secure: false,
    auth: { user: 'user@example.com', pass: 'pass' }
});

app.use(easyWaf({
    postBlockHook: (req, moduleInfo, ip) => { // Executed after a request is blocked.
        mailTransporter.sendMail({
            from: 'from@example.com',
            to: 'to@example.com',
            subject: `EasyWAF Blocked Request from ${ip}`,
            html: `Module: ${moduleInfo.name}<br>Url: ${req.url}<br>...`
        }).catch(function (e) {
            console.log('Error on sendMail: ' + e.message);
        });
    }
}));

app.get('/get', function (req, res) {
    res.status(200).send();
});

app.listen(3000);