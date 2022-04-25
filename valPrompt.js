// window.addEventListener("DOMContentLoaded", function(){
//   // Required HTML stuff
//   var reqElemSingle = [ "head>", "body", "meta name=\"description\""]; // required elements that should appear once per page
//   var reqElemMultiple = []; // required elements that may appear more than once per page
//   var reqList = false;
//   var forbiddenCss = [];
//   var reqCss = [];
//   var reqComments = true;
//   var uniqueTitle = true;
//   mainJamesTest({
//     "single": reqElemSingle, 
//     "multiple": reqElemMultiple, 
//     "list": reqList, 
//     "fbdnCss": forbiddenCss, 
//     "reqCss": reqCss, 
//     "reqComments": reqComments,
//     "uniqueTitle": uniqueTitle}
//   );
// });

window.addEventListener("DOMContentLoaded", function(){mainJamesTest();});