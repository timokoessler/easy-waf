import { slash, dot, colon, underscore, minus } from './specialchars.regex';
import type { EasyWaf } from '../types';

const regex = new RegExp(`(?:${slash}{2})(?<domain>((\\w|${minus}|${underscore})+${dot})*(?:\\w|${minus}|${underscore})+[${dot}${colon}]\\w+)`, 'gi');

let config: EasyWaf.Config;

export default {
    init: (conf: EasyWaf.Config) => {
        config = conf;
    },
    check: (req: EasyWaf.Request) => {
        if (typeof config.queryUrlWhitelist === 'undefined') {
            return true;
        }

        const matches = req.url.matchAll(regex);
        for (const match of matches) {
            if (match.groups && match.groups.domain && !config.queryUrlWhitelist.includes(match.groups.domain)) {
                return false;
            }
        }

        return true;
    },
};