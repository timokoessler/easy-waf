# Easy WAF (Beta) 🧱

> [!TIP]
> Have a look at [Zen by Aikido](https://www.aikido.dev/zen) if you are looking for a professional embedded firewall with fewer false positives, better performance and a web dashboard to monitor your app.
> Available for [Node.js](https://github.com/AikidoSec/firewall-node), [Python](https://github.com/AikidoSec/firewall-python) and [PHP](https://github.com/AikidoSec/firewall-php).

An easy-to-use Web Application Firewall (WAF) for Node.js. Can be used with Express, Fastify, NextJS, NuxtJS ... or Node.js http.

[![npm version](https://badgen.net/npm/v/easy-waf)](https://www.npmjs.com/package/easy-waf)
[![npm downloads](https://badgen.net/npm/dt/easy-waf)](https://www.npmjs.com/package/easy-waf)
[![license](https://badgen.net/npm/license/easy-waf)](LICENSE)
[![CodeFactor](https://www.codefactor.io/repository/github/timokoessler/easy-waf/badge)](https://www.codefactor.io/repository/github/timokoessler/easy-waf)
[![codecov](https://codecov.io/gh/timokoessler/easy-waf/branch/main/graph/badge.svg?token=62LUMSMRL0)](https://codecov.io/gh/timokoessler/easy-waf)
[![install size](https://packagephobia.com/badge?p=easy-waf)](https://packagephobia.com/result?p=easy-waf)

```javascript
import express from 'express';
import easyWaf from 'easy-waf'; // CommonJS: require('easy-waf').default;
const app = express();

app.use(easyWaf());

app.listen(3000);
```

> [!WARNING]
> This software tries to defend many common attacks while keeping the rate of false positives low. There will always be methods to bypass this WAF. Therefore, using this package is not a reason to neglect security when developing an application. Always validate user input! This software should be used with caution and is more an educational tool than a professional security solution.

## Features

-   Restrict allowed HTTP methods and add your own ip black- and whitelist
-   Blocks requests from bad bots and fake crawlers
-   Blocks malicious requests:
    -   CRLF Injection
    -   Cross-Site-Scripting (XSS)
    -   Directory / Path Traversal
    -   HTTP Parameter Pollution
    -   Open Redirect / Server Side Request Forgery (SSRF) (queryUrlWhitelist option must be set)
    -   Prototype Pollution
    -   SQL Injections and NoSQL Injections
-   Can block requests from the Tor network (disabled by default)
-   Compatible with many popular web frameworks and with the integrated Node.js HTTP server
-   Supports ES modules and CommonJS

## Installation

> [!TIP]
> I strongly recommend to activate the "dryMode" at the beginning to be able to identify possible false positives from the logs.
> If EasyWAF should parse bodies, bind a body-parser middleware to your app before adding EasyWAF.

```bash
npm i easy-waf
```

In the [examples](examples/) folder you can find samples of how to integrate EasyAF into your application.

If you run your Node.js app behind a reverse proxy, don't forget to set the `trustProxy` option.
To enable Open Redirect protection, configure the `queryUrlWhitelist` option.

## Configuration

EasyWAF is easy to use without the need for much configuration, but there are still many customization options.

```javascript
app.use(
    easyWaf({
        allowedHTTPMethods: ['GET', 'POST'],
        queryUrlWhitelist: ['github.com'],
        modules: {
            directoryTraversal: {
                enabled: true,
                excludePaths: /^\/exclude$/i,
            },
        },
    }),
);
```

| Option                     | Type           | Default                             | Description                                                                                                                                            |
| -------------------------- | -------------- | ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| allowedHTTPMethods         | array          | undefined                           | List of all HTTP request methods that are allowed. All other request methods will be blocked. By default, all HTTP methods are allowed.                |
| customBlockedPage          | string         | undefined                           | Add HTML code to override the default "Request blocked" page. [View example with placeholders](examples/custom-blocked-page.js)                        |
| queryUrlWhitelist          | array          | undefined                           | List of urls that are allowed to be included in the path or query of the request url. By default, all urls are allowed. (Open Redirect / SSRF)         |
| disableLogging             | boolean        | false                               | If true, nothing is logged. _This is not recommended!_                                                                                                 |
| dryMode                    | boolean        | false                               | If true, suspicious requests are only logged and not blocked. In addition, the log format is changed to prevent an IPS from blocking the IP.           |
| ipBlacklist                | array          | []                                  | All requests by ips on the blacklist are blocked. CIDR notation is supported (IPv4 and IPv6). On single addresses, a prefix of /32 or /128 is assumed. |
| ipWhitelist                | array          | []                                  | All requests by ips on the whitelist are never blocked. CIDR notation is supported.                                                                    |
| modules[name].enabled      | boolean        | true, except "Block Tor Exit Nodes" | This option allows you to completely disable a specific module.                                                                                        |
| modules[name].excludePaths | boolean        | undefined                           | Exclude paths from being checked by this module with a regex.                                                                                          |
| postBlockHook              | callback       | undefined                           | Run your own code after a request is blocked. For example, you can send a notification.                                                                |
| preBlockHook               | callback       | undefined                           | Run your own code before a request is blocked. Return false if the request should not be blocked.                                                      |
| trustProxy                 | string / array | []                                  | If a reverse proxy is used, this setting must be configured. See [npm/proxy-addr](https://www.npmjs.com/package/proxy-addr) for possible values.       |

## What is checked?

The following table shows which user input is checked by which module:

| Name                       | URL      | Body\* | Headers\*\* | IP  |
| -------------------------- | -------- | ------ | ----------- | --- |
| Bad Bots                   | ❌       | ❌     | ✅          | ❌  |
| Block Tor Exit Nodes       | ❌       | ❌     | ❌          | ✅  |
| CRLF Injection             | ✅       | ✅     | ❌          | ❌  |
| Cross-Site-Scripting (XSS) | ✅       | ✅     | ✅          | ❌  |
| Directory Traversal        | ✅       | ✅     | ❌          | ❌  |
| Fake Crawlers              | ❌       | ❌     | ✅          | ✅  |
| HTTP Parameter Pollution   | ✅\*\*\* | ❌     | ❌          | ❌  |
| NoSQL Injections           | ✅       | ✅     | ✅          | ❌  |
| Open Redirect / SSRF       | ✅       | ❌     | ❌          | ❌  |
| Prototype Pollution        | ✅       | ✅     | ✅          | ❌  |
| SQL Injections             | ✅       | ✅     | ✅          | ❌  |
| XML Injections (Basic)     | ❌       | ✅     | ❌          | ❌  |

\* Bodies are only checked if req.body is set by a middleware or the web framework itself before EasyWAF.  
\*\* Includes user agent and cookies  
\*\*\* Only if req.query is set by a framework.

A short description of all modules can be found in [src/modules](src/modules).

## Contact

If a public GitHub issue or discussion is not the right choice for your concern, you can contact me directly:

-   E-Mail: [info@timokoessler.de](mailto:info@timokoessler.de)
-   Twitter: [@timokoessler](https://twitter.com/timokoessler)

## Sources

-   [Payloads All The Thing: A list of useful payloads and bypass for Web Application Security](https://github.com/swisskyrepo/PayloadsAllTheThings)
-   [HackTricks: A free hacking book](https://book.hacktricks.xyz/pentesting-web/)
-   [Nginx Ultimate Bad Bot Blocker: The source of the bad bots list for EasyWAF](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker)

## License

© Timo Kössler 2024  
Released under the [MIT license](LICENSE)
