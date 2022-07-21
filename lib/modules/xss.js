/* eslint-disable no-useless-escape */
//Regex build with data of https://github.com/swisskyrepo/PayloadsAllTheThings/tree/master/XSS%20Injection

const lT = '(<|%3C|\\+ADw-|&#0{0,}60;?|&#x0{0,}3c;?|\\\\u003c|\\\\x3c)';
const brackedOpen = '(\\(|%28|&#x0{0,}28;?|&lpar;)';
const colon = '(:|%3A)';
const slash = '(%2f|\\/|%u2215|%c0%af|%e0%80%af|%c0%2f|%252f|0x2f|%uff0f|%25c0%25af|%25c0%252f|%%32%{1,2}66|%%35%{1,2}63|%25c0%25af|%f0%80%80%af|%f8%80%80%80%af|%c0%9v|%c0%qf|%c1%8s|%c1%af|%bg%qf|%uEFC8)';
const dot = '(%2e|\\.|%u002e|%c0%2e|%e0%40%ae|%c0%ae|%252e|0x2e|%uff0e|%00\\.|\\.%00|%c0\\.|%25c0%25ae|%%32%{1,2}65)';
const htmlTags = '(a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdi|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|command|data|datalist|dd|del|details|dfn|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|i|iframe|img|input|ins|kbd|keygen|label|layer|legend|li|line|link|listing|main|map|mark|marquee|math|menu|menuitem|meta|meter|nav|nobr|noembed|noframes|nolayer|noscript|object|ol|optgroup|option|output|p|param|plaintext|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|svg|t|table|tbody|td|template|textarea|tfoot|th|thead|time|title|tr|track|tt|u|ul|var|video|wbr|xmp|foreignObject)';
const jsEvents = '(onAbort|onActivate|onAfterPrint|onAfterUpdate|onBeforeActivate|onBeforeCopy|onBeforeCut|onBeforeDeactivate|onBeforeEditFocus|onBeforePaste|onBeforePrint|onBeforeUnload|onBeforeUpdate|onBegin|onBlur|onBounce|onCellChange|onChange|onClick|onContextMenu|onControlSelect|onCopy|onCut|onDataAvailable|onDataSetChanged|onDataSetComplete|onDblClick|onDeactivate|onDrag|onDragDrop|onDragEnd|onDragEnter|onDragLeave|onDragOver|onDragStart|onDrop|onEnd|onError|onErrorUpdate|onFilterChange|onFinish|onFocus|onFocusIn|onFocusOut|onHashChange|onHelp|onInput|onKeyDown|onKeyPress|onKeyUp|onLayoutComplete|onLoad|onLoseCapture|onMediaComplete|onMediaError|onMessage|onMouseDown|onMouseEnter|onMouseLeave|onMouseMove|onMouseOut|onMouseOver|onMouseUp|onMouseWheel|onMove|onMoveEnd|onMoveStart|onOffline|onOnline|onOutOfSync|onPaste|onPause|onPopState|onProgress|onPropertyChange|onReadyStateChange|onRedo|onRepeat|onReset|onResize|onResizeEnd|onResizeStart|onResume|onReverse|onRowDelete|onRowExit|onRowInserted|onRowsEnter|onScroll|onSeek|onSelect|onSelectStart|onSelectionChange|onStart|onStop|onStorage|onSubmit|onSyncRestored|onTimeError|onTrackChange|onURLFlip|onUndo|onUnload|seekSegmentTime)';

const regex = new RegExp(`(${lT}${slash}?script|${lT}${slash}?${htmlTags}|alert(${brackedOpen}|\`)|(${brackedOpen}|=)alert|javascript${colon}|prompt${brackedOpen}|${lT}xss|confirm${brackedOpen}|url${brackedOpen}|eval${brackedOpen}|${lT}${slash}?(\\\?|%3F)?xml|${lT}${slash}?dialog|fetch${brackedOpen}|(navigator|document|localStorage)${dot}\\\S|toString${brackedOpen}|${jsEvents}|${lT}\\\??import|top\\[)`, 'i');

/**
 * 
 * @param {EasyWAFModuleCheckData} data
 * @returns {Boolean} Is false when a possible security incident has been found
 */
function check(data){
    if(regex.test(data.url)){
        return false;
    }
     if(data.body){
        if(regex.test(data.body)){
            return false;
        }
    }
    return true;
}

module.exports = {
    check: check,
    info: () => {
        return {
            name: 'xss'
        };
    }
};