declare module "logger" {
    /**
     *
     * @param {EasyWAFLogType} type
     * @param {String} msg
     */
    export function log(type: EasyWAFLogType, msg: string): void;
    /**
     *
     * @param {EasyWAFModuleInfo} moduleInfo
     * @param {import('http').IncomingMessage} req
     * @param {String} referenceID
     * @param {EasyWafConfig} config
     * @param {String} ip
     */
    export function requestBlocked(moduleInfo: EasyWAFModuleInfo, req: import('http').IncomingMessage, referenceID: string, config: EasyWafConfig, ip: string): void;
}
declare module "block" {
    export = blocked;
    /**
     *
     * @param {import('http').IncomingMessage} req
     * @param {import('http').ServerResponse} res
     * @param {EasyWAFModuleInfo} moduleInfo
     * @param {EasyWafConfig} config
     * @param {String} ip
     * @returns {Boolean}
     */
    function blocked(req: import('http').IncomingMessage, res: import('http').ServerResponse, moduleInfo: EasyWAFModuleInfo, config: EasyWafConfig, ip: string): boolean;
}
declare module "modules/badBots" {
    /**
     *
     * @param {EasyWafConfig} conf
     */
    export function init(conf: EasyWafConfig): void;
    /**
     *
     * @param {EasyWAFRequestInfo} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFRequestInfo): boolean;
    export function info(): {
        name: string;
    };
}
declare module "utils" {
    /**
     * Modifies the passed array so that all entries are written in CIDR notation (even single ones).
     * @param {Array.<String>} array
     */
    export function refactorIPArray(array: Array<string>): void;
    /**
     * Extends the proxyaddr.compile function so that functions, numbers and Boolean values can also be used in the configuration.
     * @param {String|Array.<String>|Function|Boolean|Number} val
     * @returns {Function}
     */
    export function compileProxyTrust(val: string | Array<string> | Function | boolean | number): Function;
    /**
     *
     * @param {String} url
     * @param {Function} cb
     */
    export function httpGET(url: string, cb: Function): void;
}
declare module "modules/blockTorExitNodes" {
    /**
     *
     * @param {EasyWafConfig} conf
     */
    export function init(conf: EasyWafConfig): void;
    /**
     *
     * @param {EasyWAFRequestInfo} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFRequestInfo): boolean;
    export function updateTorExitNodesList(cb: any): void;
    export function info(): {
        name: string;
    };
}
declare module "modules/specialchars.regex" {
    export const dot: string;
    export const slash: string;
    export const brackedOpen: string;
    export const colon: string;
    export const lT: string;
    export const gT: string;
    export const underscore: string;
    export const at: string;
    export const equals: string;
    export const quotationMarks: string;
    export const singleQuotationMarks: string;
    export const and: string;
    export const or: string;
    export const curlyBracketOpen: string;
    export const squareBracketOpen: string;
    export const squareBracketClose: string;
    export const dollar: string;
    export const minus: string;
    export const percent: string;
}
declare module "modules/crlfInjection" {
    /**
     *
     * @param {EasyWafConfig} conf
     */
    export function init(conf: EasyWafConfig): void;
    /**
     *
     * @param {EasyWAFRequestInfo} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFRequestInfo): boolean;
    export function info(): {
        name: string;
    };
}
declare module "modules/directoryTraversal" {
    /**
     *
     * @param {EasyWafConfig} conf
     */
    export function init(conf: EasyWafConfig): void;
    /**
     *
     * @param {EasyWAFRequestInfo} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFRequestInfo): boolean;
    export function info(): {
        name: string;
    };
}
declare module "modules/fakeSearchCrawlers" {
    /**
     *
     * @param {EasyWafConfig} conf
     */
    export function init(conf: EasyWafConfig): void;
    /**
     *
     * @param {EasyWAFRequestInfo} reqInfo
     * @param {Function} cb
     */
    export function checkCB(reqInfo: EasyWAFRequestInfo, cb: Function): void;
    export function info(): {
        name: string;
    };
}
declare module "modules/noSqlInjection" {
    /**
     *
     * @param {EasyWafConfig} conf
     */
    export function init(conf: EasyWafConfig): void;
    /**
     *
     * @param {EasyWAFRequestInfo} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFRequestInfo): boolean;
    export function info(): {
        name: string;
    };
}
declare module "modules/openRedirect" {
    /**
     *
     * @param {EasyWafConfig} conf
     */
    export function init(conf: EasyWafConfig): void;
    /**
     *
     * @param {EasyWAFRequestInfo} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFRequestInfo): boolean;
    export function info(): {
        name: string;
    };
}
declare module "modules/prototypePollution" {
    /**
     *
     * @param {EasyWafConfig} conf
     */
    export function init(conf: EasyWafConfig): void;
    /**
     *
     * @param {EasyWAFRequestInfo} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFRequestInfo): boolean;
    export function info(): {
        name: string;
    };
}
declare module "modules/sqlInjection" {
    /**
     *
     * @param {EasyWafConfig} conf
     */
    export function init(conf: EasyWafConfig): void;
    /**
     *
     * @param {EasyWAFRequestInfo} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFRequestInfo): boolean;
    export function info(): {
        name: string;
    };
}
declare module "modules/xss" {
    /**
     *
     * @param {EasyWafConfig} conf
     */
    export function init(conf: EasyWafConfig): void;
    /**
     *
     * @param {EasyWAFRequestInfo} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFRequestInfo): boolean;
    export function info(): {
        name: string;
    };
}
declare module "modules/index" {
    export const badBots: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFRequestInfo) => boolean;
        info: () => {
            name: string;
        };
    };
    export const blockTorExitNodes: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFRequestInfo) => boolean;
        info: () => {
            name: string;
        };
        updateTorExitNodesList: (cb: any) => void;
    };
    export const crlfInjection: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFRequestInfo) => boolean;
        info: () => {
            name: string;
        };
    };
    export const directoryTraversal: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFRequestInfo) => boolean;
        info: () => {
            name: string;
        };
    };
    export const fakeSearchCrawlers: {
        init: (conf: EasyWafConfig) => void;
        checkCB: (reqInfo: EasyWAFRequestInfo, cb: Function) => void;
        info: () => {
            name: string;
        };
    };
    export const noSqlInjection: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFRequestInfo) => boolean;
        info: () => {
            name: string;
        };
    };
    export const openRedirect: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFRequestInfo) => boolean;
        info: () => {
            name: string;
        };
    };
    export const prototypePollution: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFRequestInfo) => boolean;
        info: () => {
            name: string;
        };
    };
    export const sqlInjection: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFRequestInfo) => boolean;
        info: () => {
            name: string;
        };
    };
    export const xss: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFRequestInfo) => boolean;
        info: () => {
            name: string;
        };
    };
}
declare module "easy-waf" {
    export = easyWaf;
    /**
     *
     * @param {EasyWafConfig} [conf]
     * @return {Function}
     */
    function easyWaf(conf?: EasyWafConfig): Function;
}
type EasyWafConfig = {
    /**
     * List of all HTTP request methods that are allowed. All other request methods will be blocked.
     */
    allowedHTTPMethods?: Array<string>;
    /**
     * Add HTML code to override the default "Request blocked" page. Placeholders: {dateTime} {ip} {referenceID} {moduleName}. You can find an example in the Git repo.
     */
    customBlockedPage?: string;
    /**
     * List of urls that are allowed to be included in the path or query of the request url. If it's undefined (default value), all urls are allowed.
     */
    queryUrlWhitelist?: Array<string>;
    /**
     * If true, suspicious requests are only logged and not blocked. In addition, the log format is changed to prevent an IPS from blocking the IP.
     */
    dryMode?: boolean;
    /**
     * If true, nothing is logged. This is not recommended!
     */
    disableLogging?: boolean;
    /**
     * All requests by ips on the blacklist are blocked. CIDR notation is supported (IPv4 and IPv6). On single addresses, a prefix of /32 or /128 is assumed.
     */
    ipBlacklist?: Array<string>;
    /**
     * All requests by ips on the whitelist are never blocked. CIDR notation is supported.
     */
    ipWhitelist?: Array<string>;
    /**
     * This option allows you to enable / disable modules or exclude paths with a regex
     */
    modules?: EasyWafConfigModules;
    /**
     * Run your own code after a request is blocked. For example, you can send a notification.
     */
    postBlockHook?: EasyWAFPostBlockHook;
    /**
     * Run your own code before a request is blocked. Return false if the request should not be blocked.
     */
    preBlockHook?: EasyWAFPreBlockHook;
    /**
     * If a reverse proxy is used, this setting must be configured. See https://www.npmjs.com/package/proxy-addr for possible values.
     */
    trustProxy?: string | Array<string> | Function | boolean | number;
};
type EasyWafConfigModules = {
    badBots?: EasyWafConfigModule;
    blockTorExitNodes?: EasyWafConfigModule;
    crlfInjection?: EasyWafConfigModule;
    directoryTraversal?: EasyWafConfigModule;
    /**
     * Blocks crawlers that pretend to be a google bot or a bot from other major search engines or internet companies.
     */
    fakeSearchCrawlers?: EasyWafConfigModule;
    noSqlInjection?: EasyWafConfigModule;
    openRedirect?: EasyWafConfigModule;
    prototypePollution?: EasyWafConfigModule;
    sqlInjection?: EasyWafConfigModule;
    /**
     * Cross-Site-Scripting
     */
    xss?: EasyWafConfigModule;
};
type EasyWafConfigModule = {
    /**
     * This option allows you to completely disable a module.
     */
    enabled: boolean;
    /**
     * Exclude paths from being checked by this module with a regex
     */
    excludePaths?: RegExp;
};
type EasyWAFLogType = "Info" | "Warn" | "Error";
type EasyWAFModuleInfo = {
    name: string;
};
type EasyWAFModule = {
    check: (arg0: EasyWAFRequestInfo) => boolean;
    checkCB: (arg0: EasyWAFRequestInfo, arg1: Function) => void;
    info: () => EasyWAFModuleInfo;
};
type EasyWAFRequestInfo = {
    /**
     * Body as string, can be undefined
     */
    body: string;
    /**
     * A string that contains the values of all headers
     */
    headers: string;
    ip: string;
    /**
     * HTTP method (POST/GET...)
     */
    method: string;
    /**
     * Url path without query or fragments
     */
    path: string;
    /**
     * User Agent
     */
    ua: string;
    /**
     * Decoded url
     */
    url: string;
};
type EasyWAFPreBlockHook = (req: import('http').IncomingMessage, moduleInfo: EasyWAFModuleInfo, ip: string) => boolean;
type EasyWAFPostBlockHook = (req: import('http').IncomingMessage, moduleInfo: EasyWAFModuleInfo, ip: string) => any;
