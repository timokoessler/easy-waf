# Easy WAF 🧱

An easy-to-use Web Application Firewall (WAF) for the NodeJS Express framework.

> ⚠️ This software tries to defend many common attacks while keeping the rate of false positives low. There will always be methods to bypass this WAF. Therefore, using this package is not a reason to neglect security when developing an application.

```javascript
const express = require('express');
const { easyWaf } = require('easy-waf');
const app = express();

app.use(easyWaf());

app.listen(3000);
```

## Features
- Restrict allowed HTTP methods
- Blocks requests from bad bots
- Blocks malicious requests:
  - CRLF Injection
  - Cross-Site-Scripting (XSS)
  - Directory / Path Traversal
  - Prototype Pollution
  - SQL Injections and NoSQL Injections

## Installation
I strongly recommend to activate the "dryMode" at the beginning to be able to identify possible false positives from the logs.
If EasyWaf should parse bodies, bind the express body-parser middleware to the express app before binding EasyWaf.

## Configuration
EasyWaf is easy to use without the need for much configuration, but there are still many customization options.
```javascript
app.use(easyWaf({
    allowedHTTPMethods: ['GET', 'POST'],
    modules: {
        directoryTraversal: {
            enabled: true,
            excludePaths: /^\/exclude$/i
        },
    }
}));
```
| Option             | Type     | Default | Description                                                                                                                                  |
| -----------------  | -------- | ------- |  ------------------------------------------------------------------------------------------------------------------------------------------- |
| allowedHTTPMethods | array    | []      | List of all HTTP request methods that are allowed. All other request methods will be blocked. By default, all HTTP methods are allowed.      |
| disableLogging     | boolean  | false   | If true, nothing is logged. *This is not recommended!*                                                                                       |
| dryMode            | boolean  | false   | If true, suspicious requests are only logged and not blocked. In addition, the log format is changed to prevent an IPS from blocking the IP. |
| modules[name].enabled      | boolean | true   | This option allows you to completely disable a specific module.                                                                        |
| modules[name].excludePaths | boolean | undefined   | Exclude paths from being checked by this module with a regex.                                                                     |

## Modules

The following table shows which user input is checked by a module:

| Name                          | URL | Body | User Agent | Cookies |
| ----------------------------- | --- | ---- | ---------- | ------- |
| Bad Bots                      | ❌  | ❌  | ✅         | ❌     |
| CRLF Injection                | ✅  | ✅  | ❌         | Planed  |
| Cross-Site-Scripting (XSS)    | ✅  | ✅  | ✅         | Planed  |
| Directory Traversal           | ✅  | ✅  | ❌         | Planed  |
| NoSQL Injections              | ✅  | ✅  | ✅         | Planed  |
| Prototype Pollution           | ✅  | ✅  | ✅         | Planed  |
| SQL Injections                | ✅  | ✅  | ✅         | Planed  |

## Contributing
Any contribution is greatly appreciated.

A few notes on PRs and code contributions:
- After cloning the repo run `npm i`
- Run `npm run precommit` before every commit: this runs ESLint and TypeScript (this should normally be done automatically by a git hook)
- If you add new modules or other features, create tests
- Before you create a PR, run `npm t` to run all tests

## Contact
If a public GitHub issue or discussion is not the right choice for your concern, you can contact me directly:
- E-Mail: [info@timokoessler.de](mailto:info@timokoessler.de)
- Twitter: [@timokoessler](https://twitter.com/timokoessler)

## Sources
- [Payloads All The Thing: A list of useful payloads and bypass for Web Application Security](https://github.com/swisskyrepo/PayloadsAllTheThings)
- [HackTricks: A free hacking book](https://book.hacktricks.xyz/pentesting-web/)
- [Nginx Ultimate Bad Bot Blocker: The source of the bad bots list for EasyWaf](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker)