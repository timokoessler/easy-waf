import type { EasyWaf } from '../types';

export default {
    check: (req: EasyWaf.Request) => {
        for (const [key, value] of Object.entries(req.query)) {
            if (Array.isArray(value)) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                req.query[key] = value[value.length - 1];
            }
        }

        return true;
    },
};
