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
     * List all HTTP request methods that are allowed. All other request methods will be blocked.
     */
    allowedHTTPMethods?: Array<string>;
    /**
     * If true, suspicious requests are only logged and not blocked. Also, the log format is changed so that an IPS does not ban the IP
     */
    dryMode?: boolean;
};
type EasyWAFLogType = "Info" | "Warn" | "Error";
type EasyWAFModuleInfo = {
    name: string;
};
type EasyWAFModule = {
    check: () => boolean;
    info: () => EasyWAFModuleInfo;
};
declare module "modules/directoryTraversal" {
    /**
     *
     * @param {import('express').Request} req
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(req: any): boolean;
    export function info(): {
        name: string;
    };
}
declare module "modules/xss" {
    /**
     *
     * @param {import('express').Request} req
     * @returns {Boolean} Is false when a possible security incident has been found
     */
    export function check(req: any): boolean;
    export function info(): {
        name: string;
    };
}
declare module "modules/index" {
    export const directoryTraversal: {
        check: (req: any) => boolean;
        info: () => {
            name: string;
        };
    };
    export const xss: {
        check: (req: any) => boolean;
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
    export function EasyWaf(conf?: EasyWafConfig): Function;
}
//# sourceMappingURL=index.d.ts.map