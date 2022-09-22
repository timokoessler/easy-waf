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
     */
    function blocked(req: import('http').IncomingMessage, res: import('http').ServerResponse, moduleInfo: EasyWAFModuleInfo, config: EasyWafConfig, ip: string): void;
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
     * List of urls that are allowed to be included in the path or query of the request url. If it's undefined (default value), all urls are allowed.
     */
    redirectUrlWhitelist?: Array<string>;
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
     * If a reverse proxy is used, this setting must be configured. See https://www.npmjs.com/package/proxy-addr for possible values.
     */
    trustProxy?: string | Array<string> | Function;
};
type EasyWafConfigModules = {
    badBots?: EasyWafConfigModule;
    blockTorExitNodes?: EasyWafConfigModule;
    crlfInjection?: EasyWafConfigModule;
    directoryTraversal?: EasyWafConfigModule;
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
    info: () => EasyWAFModuleInfo;
};
type EasyWAFRequestInfo = {
    /**
     * Decoded url
     */
    url: string;
    ip: string;
    /**
     * Url path without query or fragments
     */
    path: string;
    /**
     * Body as string, can be undefined
     */
    body: string;
    /**
     * User Agent
     */
    ua: string;
    /**
     * HTTP method (POST/GET...)
     */
    method: string;
};
