# Modules

## Bad Bots

Detects "bad bots" based on the user agent and blocks them.  
List source (minor changes): [mitchellkrogza/nginx-ultimate-bad-bot-blocker](https://github.com/mitchellkrogza/nginx-ultimate-bad-bot-blocker)

## Block Tor Exit Nodes

_Disabled by default. Activate by setting modules.blockTorExitNodes.enabled = true_

Blocks all requests originating from tor browser exit nodes. The ip addresses are downloaded from https://check.torproject.org/torbulkexitlist and updated hourly.

## CRLF Injection

This module blocks HTTP header injections with carriage returns and linefeed characters.  
[OSWAP: CRLF Injection](https://owasp.org/www-community/vulnerabilities/CRLF_Injection)

## Directory / Path Traversal

This module detects and blocks path traversal attacks. This vulnerability allows an attacker to read arbitrary files on the server that is running an application.  
[OSWAP: Path Traversal](https://owasp.org/www-community/attacks/Path_Traversal)

## Fake Crawlers

This module blocks requests from bots that pretend to be a known crawler of a search engine or a big company. The authenticity of most crawlers can be determined with a reverse DNS lookup, but an additional IP whitelist increases performance. In addition, the authenticity of some crawlers, such as the Facebook crawler, can only be determined by the IP. For more information visit the [Easy WAF Data Repository](https://github.com/timokoessler/easy-waf-data).

Supported companies: Google, Microsoft, Facebook, Twitter, DuckDuckGo, Yahoo!, Pinterest, Yandex, Baidu, Qwant

## HTTP Parameter Pollution

_Request is not blocked or logged, req.query must be set by a web framework_

Replaces array parameters with their last value, like [hpp](https://www.npmjs.com/package/hpp).  
[OSWAP: Testing for HTTP Parameter Pollution](https://owasp.org/www-project-web-security-testing-guide/latest/4-Web_Application_Security_Testing/07-Input_Validation_Testing/04-Testing_for_HTTP_Parameter_Pollution)

## NoSQL Injection

NoSQL injections are attacks that aim to modify a database query to a non-relational database, for example to bypass authentication. This module tries to prevent these attacks.  
[Patrick Spiegel: NoSQL Injection - Fun with Objects and Arrays](https://owasp.org/www-pdf-archive/GOD16-NOSQL.pdf)

## Open Redirect

_The `queryUrlWhitelist` option must be set to enable this module._

Blocks requests that have a disallowed url in their path or query.  
[Snyk Learn: Open redirect](https://learn.snyk.io/lessons/open-redirect/javascript/)

## Prototype Pollution

A JavaScript vulnerability that allows an attacker to add properties to global object prototypes that can then be inherited by other objects. This module attempts to block such requests.  
[Snyk Learn: Prototype pollution](https://learn.snyk.io/lessons/prototype-pollution/javascript/)

## SQL Injection

An attempt to manipulate an SQL query, similar to NoSQL injections. Detection leads to blocking of the request.  
[OSWAP: SQL Injection](https://owasp.org/www-community/attacks/SQL_Injection)

## XML Injection

A vulnerability that allows an attacker to inject malicious code into XML files. This module tries to prevent very basic and common xml attacks.
