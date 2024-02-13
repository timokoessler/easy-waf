import { lT, quotationMarks, singleQuotationMarks } from './specialchars.regex';
import type { EasyWaf } from '../types';

const regex = new RegExp(`(${lT}!ENTITY.*(SYSTEM|PUBLIC).*(${quotationMarks}|${singleQuotationMarks})\\w+:\/\/)`, 'i');

export default {
    check: (req: EasyWaf.Request) => {
        if (req.body && regex.test(req.body)) {
            return false;
        }
        return true;
    },
};
