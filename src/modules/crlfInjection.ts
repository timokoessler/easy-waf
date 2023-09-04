import { minus, lT } from './specialchars.regex';
import type { EasyWaf } from '../types';

const regex = new RegExp(
    `((\\r|%0D|%E5%98%8D|\\\\u560d|%250D)|(\\n|%0A|%E5%98%8A|\\\\u560a|%250a))(Set${minus}Cookie|Content${minus}(Length|Type|Location|Disposition|Security${minus}Policy)|X${minus}XSS${minus}Protection|Last${minus}Modified|Location|Date|Link|Refresh|${lT})`,
    'i',
);

export default {
    check: (req: EasyWaf.Request) => {
        if (regex.test(req.url)) {
            return false;
        }

        if (req.body && regex.test(req.body)) {
            return false;
        }

        return true;
    },
};
