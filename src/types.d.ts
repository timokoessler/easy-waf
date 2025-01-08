import type { IncomingMessage, ServerResponse } from 'node:http';

export namespace EasyWaf {
    type Config = {
        /**
         * List of all HTTP request methods that are allowed. All other request methods will be blocked. Don't forget lesser known methods like HEAD or OPTIONS
         */
        allowedHTTPMethods?: string[];
        /**
         * Add HTML code to override the default "Request blocked" page. Placeholders: {dateTime} {ip} {referenceID} {moduleName}. You can find an example in the Git repo.
         */
        customBlockedPage?: string;
        /**
         * List of urls that are allowed to be included in the path or query of the request url. If it's undefined (default value), all urls are allowed.
         */
        queryUrlWhitelist?: string[];
        /**
         * If true, suspicious requests are only logged and not blocked. In addition, the log format is changed to prevent an IPS from blocking the IP.
         */
        dryMode?: boolean;
        /**
         * If true, nothing is logged. This is not recommended!
         */
        disableLogging?: boolean;
        /**
         * All requests by ips on the blacklist are blocked. CIDR notation is supported. On single addresses, a prefix of /32 (IPv4) or /128 (IPv6) is assumed.
         */
        ipBlacklist?: string[];
        /**
         * All requests by ips on the whitelist are never blocked. CIDR notation is supported.
         */
        ipWhitelist?: string[];
        /**
         * This option allows you to enable / disable modules or exclude paths with a regex
         */
        modules?: ConfigModules;
        /**
         * Run your own code after a request is blocked (e.g. send a notification).
         */
        postBlockHook?: (req: EasyWaf.Request, moduleName: string, ip: string) => void | Promise<void>;
        /**
         * Run your own code before a request is blocked. Return false if the request should not be blocked.
         */
        preBlockHook?: (req: EasyWaf.Request, moduleName: string, ip: string) => boolean | Promise<boolean>;
        /**
         * If a reverse proxy is used, this setting must be configured. See https://www.npmjs.com/package/proxy-addr for possible values.
         */
        // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
        trustProxy?: string | string[] | Function | boolean | number;
    };

    type ConfigModules = {
        badBots?: ConfigModule;
        blockTorExitNodes?: ConfigModule;
        crlfInjection?: ConfigModule;
        directoryTraversal?: ConfigModule;
        fakeCrawlers?: ConfigModule;
        httpParameterPollution?: ConfigModule;
        noSqlInjection?: ConfigModule;
        openRedirect?: ConfigModule;
        prototypePollution?: ConfigModule;
        sqlInjection?: ConfigModule;
        xmlInjection?: ConfigModule;
        xss?: ConfigModule;
    };

    type ConfigModule = {
        /**
         * This option allows you to completely disable a module.
         */
        enabled?: boolean;
        /**
         * Exclude paths from being checked by this module with a regex
         */
        excludePaths?: RegExp;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- This type is used
    type Module = {
        init?: (config: EasyWaf.Config) => void;
        check: (req: EasyWaf.Request) => boolean;
    };

    // eslint-disable-next-line @typescript-eslint/no-unused-vars -- This type is used
    type Response = ServerResponse;
    type Request = {
        /**
         * HTTP Body as a string. Only set if web framework parses the body before the EasyWaf middleware.
         */
        body?: string;
        headers: string;
        ip: string;
        method: string;
        /**
         * Url path without query or fragments.
         */
        path: string;
        /**
         * Parsed url query
         */
        query: object;
        /**
         * The original plain request
         */
        rawReq: IncomingMessage;
        /**
         * User Agent
         */
        ua: string;
        url: string;
    };
}
