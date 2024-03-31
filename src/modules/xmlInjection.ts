import { brackedOpen, colon, exclamation, lT, quotationMarks, singleQuotationMarks } from './specialchars.regex';
import type { EasyWaf } from '../types';

const regex = new RegExp(
    `(${lT}${exclamation}ENTITY.*(SYSTEM|PUBLIC).*(${quotationMarks}|${singleQuotationMarks})\\w+${colon}\/\/|${lT}xi${colon}include|${lT}xsl${colon}(value-of|copy-of).*(${quotationMarks}|${singleQuotationMarks})(system-property|document)${brackedOpen}|${lT}msxsl${colon}script)`,
    'i',
);

export default {
    check: (req: EasyWaf.Request) => {
        if (req.body && regex.test(req.body)) {
            return false;
        }
        return true;
    },
};
