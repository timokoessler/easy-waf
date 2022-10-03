/* eslint-disable no-useless-escape */
const {dot, slash, brackedOpen, colon, lT, equals} = require('./specialchars.regex');

//Regex build with data of https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XSS%20Injection
const htmlTags = '(a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdi|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|command|data|datalist|dd|del|details|dfn|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|i|iframe|img|input|ins|kbd|keygen|label|layer|legend|li|line|link|listing|main|map|mark|marquee|math|menu|menuitem|meta|meter|nav|nobr|noembed|noframes|nolayer|noscript|object|ol|optgroup|option|output|p|param|plaintext|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|svg|t|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video|wbr|xmp|foreignObject)';
const jsEvents = '(onAbort|onActivate|onAfterPrint|onAfterUpdate|onBeforeActivate|onBeforeCopy|onBeforeCut|onBeforeDeactivate|onBeforeEditFocus|onBeforePaste|onBeforePrint|onBeforeUnload|onBeforeUpdate|onBegin|onBlur|onBounce|onCellChange|onChange|onClick|onContextMenu|onControlSelect|onCopy|onCut|onDataAvailable|onDataSetChanged|onDataSetComplete|onDblClick|onDeactivate|onDrag|onDragDrop|onDragEnd|onDragEnter|onDragLeave|onDragOver|onDragStart|onDrop|onEnd|onError|onErrorUpdate|onFilterChange|onFinish|onFocus|onFocusIn|onFocusOut|onHashChange|onHelp|onInput|onKeyDown|onKeyPress|onKeyUp|onLayoutComplete|onLoad|onLoseCapture|onMediaComplete|onMediaError|onMessage|onMouseDown|onMouseEnter|onMouseLeave|onMouseMove|onMouseOut|onMouseOver|onMouseUp|onMouseWheel|onMove|onMoveEnd|onMoveStart|onOffline|onOnline|onOutOfSync|onPaste|onPause|onPopState|onProgress|onPropertyChange|onReadyStateChange|onRedo|onRepeat|onReset|onResize|onResizeEnd|onResizeStart|onResume|onReverse|onRowDelete|onRowExit|onRowInserted|onRowsEnter|onScroll|onSeek|onSelect|onSelectStart|onSelectionChange|onStart|onStop|onStorage|onSubmit|onSyncRestored|onTimeError|onTrackChange|onURLFlip|onUndo|onUnload|seekSegmentTime)';
const functions = `(alert|call|confirm|console${dot}[a-zA-Z]{1,}|eval|fetch|prompt|setTimeout|setInterval|toString|url)`;

const regex = new RegExp(`(${lT}${slash}?(java)?script|${lT}${slash}?${htmlTags}|${functions}(${brackedOpen}|\`|(\\\\){1,2}x28)|(${brackedOpen}|${equals})${functions}|javascript${colon}|${lT}xss|${lT}${slash}?(\\\?|%3F)?xml|${lT}${slash}?dialog|(navigator|document|localStorage|process)${dot}\\\S|${jsEvents}|${lT}\\\??import|top\\[|${dot}(inner|outer)HTML|response${dot}write${brackedOpen})`, 'i');

/** @type {EasyWafConfig} */
var config;

/**
 * 
 * @param {EasyWafConfig} conf
 */
function init(conf){
    config = conf;
}

/**
 * 
 * @param {EasyWAFRequestInfo} data
 * @returns {Boolean} Is false when a possible security incident has been found
 */
function check(data){
    if(('enabled' in config.modules.xss && !config.modules.xss.enabled) || (config.modules.xss.excludePaths instanceof RegExp && config.modules.xss.excludePaths.test(data.path))){
        return true;
    }

    if(regex.test(data.url) || regex.test(data.ua) || regex.test(data.headers)){
        return false;
    }
     
    if(data.body && regex.test(data.body)){
        return false;
    }
    return true;
}

module.exports = {
    init: init,
    check: check,
    info: () => {
        return {
            name: 'xss'
        };
    }
};