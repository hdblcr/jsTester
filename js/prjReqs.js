export function defaultPrjReqs() {
  if(window.DEBUG_MODE){console.log("prjReqs called");}
  // Required HTML stuff
  var reqElemSingle = []; // nav, table not required // elements required for each page in this project.
  var reqElemMultiple = []; // tr, td, th not required
  var reqList = false;
  var reqComments = false;
  var forbiddenCss = [];
  var reqCss = [];
  var uniqueTitle = false;
  
 return {
   "single": reqElemSingle, 
   "multiple": reqElemMultiple, 
   "list": reqList, 
   "fbdnCss": forbiddenCss, 
   "reqCss": reqCss, 
   "reqComments": reqComments, 
   "uniqueTitle": uniqueTitle,
   "debug": window.DEBUG_MODE,
   "verbose": window.VERBOSE
 };
}