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
     * @param {import('express').Request} req
     * @param {String} referenceID
     * @param {EasyWafConfig} config
     */
    export function requestBlocked(moduleInfo: EasyWAFModuleInfo, req: any, referenceID: string, config: EasyWafConfig): void;
}
declare module "block" {
    export = blocked;
    /**
     *
     * @param {import('express').Request} req
     * @param {import('express').Response} res
     * @param {EasyWAFModuleInfo} moduleInfo
     * @param {EasyWafConfig} config
     */
    function blocked(req: any, res: any, moduleInfo: EasyWAFModuleInfo, config: EasyWafConfig): void;
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
     * All requests by ips on the blacklist are blocked
     */
    ipBlacklist?: any[];
    /**
     * This option allows you to enable / disable modules or exclude paths with a regex
     */
    modules?: EasyWafConfigModules;
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
    check: (arg0: EasyWAFModuleCheckData) => boolean;
    info: () => EasyWAFModuleInfo;
};
type EasyWAFModuleCheckData = {
    /**
     * Decoded url
     */
    url: string;
    /**
     * Encoded url
     */
    encodedUrl: string;
    ip: string;
    /**
     * Url path without query or fragments
     */
    path: string;
    /**
     * Body as String, can be undefined
     */
    body: string;
    /**
     * User Agent
     */
    ua: string;
};
declare module "modules/badBots" {
    /**
     *
     * @param {EasyWafConfig} conf
     */
    export function init(conf: EasyWafConfig): void;
    /**
     *
     * @param {EasyWAFModuleCheckData} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFModuleCheckData): boolean;
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
     * @param {EasyWAFModuleCheckData} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFModuleCheckData): boolean;
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
     * @param {EasyWAFModuleCheckData} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFModuleCheckData): boolean;
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
     * @param {EasyWAFModuleCheckData} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFModuleCheckData): boolean;
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
     * @param {EasyWAFModuleCheckData} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFModuleCheckData): boolean;
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
     * @param {EasyWAFModuleCheckData} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFModuleCheckData): boolean;
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
     * @param {EasyWAFModuleCheckData} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFModuleCheckData): boolean;
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
     * @param {EasyWAFModuleCheckData} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFModuleCheckData): boolean;
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
     * @param {EasyWAFModuleCheckData} data
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(data: EasyWAFModuleCheckData): boolean;
    export function info(): {
        name: string;
    };
}
declare module "modules/index" {
    export const badBots: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFModuleCheckData) => boolean;
        info: () => {
            name: string;
        };
    };
    export const blockTorExitNodes: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFModuleCheckData) => boolean;
        info: () => {
            name: string;
        };
        updateTorExitNodesList: (cb: any) => void;
    };
    export const crlfInjection: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFModuleCheckData) => boolean;
        info: () => {
            name: string;
        };
    };
    export const directoryTraversal: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFModuleCheckData) => boolean;
        info: () => {
            name: string;
        };
    };
    export const noSqlInjection: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFModuleCheckData) => boolean;
        info: () => {
            name: string;
        };
    };
    export const openRedirect: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFModuleCheckData) => boolean;
        info: () => {
            name: string;
        };
    };
    export const prototypePollution: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFModuleCheckData) => boolean;
        info: () => {
            name: string;
        };
    };
    export const sqlInjection: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFModuleCheckData) => boolean;
        info: () => {
            name: string;
        };
    };
    export const xss: {
        init: (conf: EasyWafConfig) => void;
        check: (data: EasyWAFModuleCheckData) => boolean;
        info: () => {
            name: string;
        };
    };
}
declare module "easy-waf" {
    /**
     *
     * @param {EasyWafConfig} [conf]
     * @return {Function}
     */
    export function easyWaf(conf?: EasyWafConfig): Function;
}
