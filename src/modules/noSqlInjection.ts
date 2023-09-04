import {
    quotationMarks,
    singleQuotationMarks,
    curlyBracketOpen,
    squareBracketOpen,
    dollar,
    colon,
    squareBracketClose,
    dot,
    brackedOpen,
    underscore,
    or,
    equals,
    and,
} from './specialchars.regex';
import type { EasyWaf } from '../types';

const regex = new RegExp(
    `((${squareBracketOpen}|${curlyBracketOpen}(${quotationMarks}|${singleQuotationMarks})?(\\s+)?)${dollar}\\S+(${colon}|${squareBracketClose})|${dollar}(where|n?or|and|not|regex|eq|ne|gte?|lte?|n?in|exists|comment|expr|mod|size|rand)|db${dot}\\S+${dot}(find|findOne|insert|update|insertOne|insertMany|updateMany|updateOne|delete|deleteOne|deleteMany|drop|count)${brackedOpen}|sleep${brackedOpen}|db${dot}(getCollectionNames|dropDatabase)${brackedOpen}|${underscore}all${underscore}docs|this${dot}\\S+${dot}match${brackedOpen}|new\\sDate${brackedOpen}|${or}{2}\\s+\\d${equals}{2}\\d|${and}{2}\\s+this${dot})`,
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
