declare module "logger" {
    /**
     *
     * @param {EasyWAFLogType} type
     * @param {String} msg
     */
    export function log(type: EasyWAFLogType, msg: string): void;
}
declare module "block" {
    export = blocked;
    /**
     *
     * @param {import('express').Response} res
     * @param {EasyWafBlockInfo} info
     */
    function blocked(res: any, info: EasyWafBlockInfo): void;
}
type EasyWafConfig = {
    allowedHTTPMethods?: Array<string>;
};
type EasyWAFLogType = "Info" | "Warn" | "Error";
type EasyWAFModuleName = "HTTPMethod";
type EasyWafBlockInfo = {
    module: EasyWAFModuleName;
    ip: string;
    userAgent: string;
    path: string;
};
declare module "easy-waf" {
    /**
     *
     * @param {EasyWafConfig} [conf]
     * @return {Function}
     */
    export function EasyWaf(conf?: EasyWafConfig): Function;
}
//# sourceMappingURL=index.d.ts.map