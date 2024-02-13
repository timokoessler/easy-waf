//Good explanation: https://book.hacktricks.xyz/pentesting-web/deserialization/nodejs-proto-prototype-pollution
import type { EasyWaf } from '../types';

import { underscore, dot, squareBracketOpen, squareBracketClose } from './specialchars.regex';

const regex = new RegExp(
    `(${underscore}${underscore}proto${underscore}${underscore}|\\S${dot}prototype(${dot}|${squareBracketOpen})|${squareBracketOpen}prototype${squareBracketClose})`,
    'i',
);

export default {
    check: (req: EasyWaf.Request) => {
        if (regex.test(req.url) || regex.test(req.ua) || regex.test(req.headers)) {
            return false;
        }

        if (req.body && regex.test(req.body)) {
            return false;
        }
        return true;
    },
};
