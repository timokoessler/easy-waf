// .
export const dot = '(%2e|\\.|%u002e|%c0%2e|%e0%40%ae|%c0%ae|%252e|0x2e|%uff0e|%00\\.|\\.%00|%c0\\.|%25c0%25ae|%%32%{1,2}65)';
// / \
export const slash =
    '(%2f|%5C|\\\\|\\/|%u2215|%u2216|%c0%af|%e0%80%af|%c0%2f|%c0%5c|%c0%80%5c|%252f|%255c|0x2f|0x5c|%uff0f|%25c0%25af|%25c0%252f|%%32%{1,2}66|%%35%{1,2}63|%25c1%259c|%25c0%25af|%f0%80%80%af|%f8%80%80%80%af|%c1%9c|%c1%pc|%c0%9v|%c0%qf|%c1%8s|%c1%1c|%c1%af|%bg%qf|%uEFC8|%uF025|%e0%81%9c|%f0%80%81%9c)';
// (
export const brackedOpen = '(\\(|%28|&#x0{0,}28;?|&lpar;)';
// :
export const colon = '(:|%3A|\\\\u003a|\\\\x3a)';
// <
export const lT = '(<|%3C|\\+ADw-|&#0{0,}60;?|&#x0{0,}3c;?|\\\\u003c|\\\\x3c)';
// >
export const gT = '(>|%3E|\\+AD4-|&#0{0,}62;?|&#x0{0,}3e;?|\\\\u003e|\\\\x3e)';
// _
export const underscore = '(_|%5F|\\+AF8-|\\\\u005f|\\\\x0{0,}5f)';
// @
export const at = '(@|%40|\\+AEA-|\\\\u0040|\\\\x0{0,}40)';
// =
export const equals = '(=|%3D|\\+AD0-|\\\\u003d|\\\\x0{0,}3d)';
// "
export const quotationMarks = '("|%22|\\+ACI-|\\\\u0022|\\\\x0{0,}22)';
// '
// eslint-disable-next-line quotes
export const singleQuotationMarks = "('|%27|\\\\u0027|\\\\x0{0,}27)";
// &
export const and = '(&|%26|\\+ACY-|\\\\u0026|\\\\x0{0,}26)';
// |
export const or = '(\\||%7c|\\+AHw-|\\\\u007c|\\\\x0{0,}7c)';
// {
export const curlyBracketOpen = '({|%7B|\\+AHs-|\\\\u007b|\\\\x0{0,}7b)';
// [
export const squareBracketOpen = '(\\[|%5B|\\+AFs-|\\\\u005b|\\\\x0{0,}5b)';
// ]
export const squareBracketClose = '(\\]|%5D|\\+AF0-|\\\\u005d|\\\\x0{0,}5d)';
//$
export const dollar = '(\\$|%24|\\+ACQ-|\\\\u0024|\\\\x0{0,}24)';
//-
export const minus = '(-|%2D|\\\\u002d|\\\\x0{0,}2d)';
//%
export const percent = '(%|%25|\\+ACU-|\\\\u0025|\\\\x0{0,}25)';
// !
export const exclamation = '(!|%21|\\+ACE-|\\\\u0021|\\\\x0{0,}21)';
