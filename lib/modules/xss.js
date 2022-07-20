/* eslint-disable no-useless-escape */
//Regex build with data of https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XSS%20Injection

const lT = '(<|%3C|\\+ADw-|&#0{0,}60;?|&#x0{0,}3c;?|\\\\u003c|\\\\x3c|&lt;?)';
const brackedOpen = '(\\(|%28|&#x0{0,}28;?|&lpar;|&#40;)';
const colon = '(:|%3A|&#0{0,}58;?)';
const slash = '(%2f|\\/|%u2215|%c0%af|%e0%80%af|%c0%2f|%252f|0x2f|%uff0f|%25c0%25af|%25c0%252f|%%32%{1,2}66|%%35%{1,2}63|%25c0%25af|%f0%80%80%af|%f8%80%80%80%af|%c0%9v|%c0%qf|%c1%8s|%c1%af|%bg%qf|%uEFC8)';
const dot = '(%2e|\\.|%u002e|%c0%2e|%e0%40%ae|%c0%ae|%252e|0x2e|%uff0e|%00\\.|\\.%00|%c0\\.|%25c0%25ae|%%32%{1,2}65)';

const regex = new RegExp(`(${lT}${slash}?(%73|s)(%63|c)(%72|r)(%69|i)(%70|p)(%74|t)|${lT}${slash}?svg|${lT}${slash}?iframe|${lT}meta|${lT}${slash}?body|${lT}${slash}?div|${lT}img|${lT}${slash}?a|${lT}embed|${lT}${slash}?style|${lT}input|${lT}${slash}?object|alert${brackedOpen}|${brackedOpen}alert|javascript${colon}|${lT}${slash}?p|${lT}${slash}?frameset|prompt${brackedOpen}|${lT}${slash}?table|${lT}br|${lT}${slash}?layer|${lT}link|${lT}xss|confirm${brackedOpen}|url${brackedOpen}|eval${brackedOpen}|${lT}${slash}?html|${lT}${slash}?(\\\?|%3F)?xml|${lT}area|${lT}base|${lT}col|${lT}command|${lT}hr|${lT}keygen|${lT}param|${lT}source|${lT}track|${lT}wbr|${lT}${slash}?span|${lT}${slash}?form|${lT}${slash}?canvas|${lT}${slash}?dialog|document${dot}\\\S|localStorage${dot}|fetch${brackedOpen}|onChange|on(Dbl)?Click|onContextMenu|onFocus|onInput|onKeyDown|onKeyPress|onKeyUp|onMouse|onSubmit|onScroll|onSelect|onResize|onControlSelect|onCopy|onCut|onPaste|on(De)?Activate|on(Un)?Load|onBegin|onDrag|onError|onMove|onMessage|onLayoutComplete|onDrop|navigator${dot}\\\S)`, 'i');

/**
 * 
 * @param {import('express').Request} req
 * @returns {Boolean} Is false when a possible security incident has been found
 */
function check(req){
    if(regex.test(req.originalUrl)){
        return false;
    }
    if(typeof req.body !== 'undefined' && Object.keys(req.body).length){
        if(regex.test(JSON.stringify(req.body))){
            return false;
        }
    }
    return true;
}

module.exports = {
    check: check,
    info: () => {
        return {
            name: 'XSS'
        };
    }
};