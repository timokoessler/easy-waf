import proxyaddr from 'proxy-addr';
import https from 'node:https';
import { createHash } from 'node:crypto';

/**
 * Extends the proxyaddr.compile function so that functions, numbers and Boolean values can also be used in the configuration.
 */
// eslint-disable-next-line @typescript-eslint/ban-types
export function compileProxyTrust(val: string | string[] | Function | boolean | number): Function {
    if (typeof val === 'function') {
        return val;
    }
    if (typeof val === 'number') {
        return (a: string, i: number) => {
            return i < val;
        };
    }
    if (typeof val === 'boolean') {
        return () => {
            return val;
        };
    }

    return proxyaddr.compile(val);
}

/**
 * Simple HTTP GET request without any dependencies
 */
export function httpGET(url: string): Promise<string> {
    return new Promise((resolve, reject) => {
        https
            .get(url, { timeout: 5000 }, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('error', reject);
                res.on('end', () => {
                    const { statusCode } = res;
                    if (typeof statusCode !== 'number') {
                        reject(new Error('Invalid status code'));
                        return;
                    }
                    const validResponse = statusCode >= 200 && statusCode <= 299;
                    if (validResponse) {
                        resolve(data);
                        return;
                    }
                    reject(new Error(`Request failed. Status: ${statusCode} Url: ${url}`));
                });
            })
            .on('error', reject)
            .end();
    });
}

export function sha256(content: string) {
    return createHash('sha256').update(content).digest('hex');
}
