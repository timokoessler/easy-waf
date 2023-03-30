# Modules

## Bad Bots
Detects "bad bots" based on the user agent and blocks them.  
List source (minor changes): [mitchellkrogza/nginx-ultimate-bad-bot-blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker)

## Block Tor Exit Nodes
*Disabled by default. Activate by setting modules.blockTorExitNodes.enabled = true*

Blocks all requests originating from tor browser exit nodes. The ip addresses are downloaded from https://check.torproject.org/torbulkexitlist and updated hourly.

## CRLF Injection
This module blocks HTTP header injections with carriage returns and linefeed characters.  
[OSWAP: CRLF Injection](https://owasp.org/www-community/vulnerabilities/CRLF_Injection)

## Directory / Path Traversal
This module detects and blocks path traversal attacks. This vulnerability allows an attacker to read arbitrary files on the server that is running an application.  
[OSWAP: Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)

## Fake Search Crawlers
This module blocks requests from bots that pretend to be a known search engine or similar. For this purpose, a hourly updated whitelist with IPS from Google, Bing and DuckDuckGo is used. For other providers, the authenticity is checked by doing a reverse DNS lookup and the IP address is temporarily whitelisted.

Whitelist sources: [Google](https://www.gstatic.com/ipranges/goog.json), [Bing](https://www.bing.com/toolbox/bingbot.json), [DuckDuckGo](https://raw.githubusercontent.com/duckduckgo/duckduckgo-help-pages/master/_docs/results/duckduckbot.md)  
Supported companies: Google, Microsoft, DuckDuckGo, Yahoo!, Yandex, Baidu, Qwant

## HTTP Parameter Pollution
*Request is not blocked or logged, req.query must be set by a web framework*

Replaces array parameters with their last value, like [hpp](https://www.npmjs.com/package/hpp).  
[OSWAP: Testing for HTTP Parameter Pollution](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/04-Testing_for_HTTP_Parameter_Pollution)

## NoSQL Injection
NoSQL injections are attacks that aim to modify a database query to a non-relational database, for example to bypass authentication. This module tries to prevent these attacks.  
[Patrick Spiegel: NoSQL Injection - Fun with Objects and Arrays](https://owasp.org/www-pdf-archive/GOD16-NOSQL.pdf)

## Open Redirect
*The `queryUrlWhitelist` option must be set to enable this module.*

Blocks requests that have a disallowed url in their path or query.  
[Snyk Learn: Open redirect](https://learn.snyk.io/lessons/open-redirect/javascript/)

## Prototype Pollution
A JavaScript vulnerability that allows an attacker to add properties to global object prototypes that can then be inherited by other objects. This module attempts to block such requests.  
[Snyk Learn: Prototype pollution](https://learn.snyk.io/lessons/prototype-pollution/javascript/)

## SQL Injection
An attempt to manipulate an SQL query, similar to NoSQL injections. Detection leads to blocking of the request.  
[OSWAP: SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)
