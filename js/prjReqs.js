export function prjReqs() {
  // Required HTML stuff
  var reqElemSingle = [ "head>", "title", "body", "header", "main", "footer", "meta name=\"description\""]; // nav, table not required // elements required for each page in this project.
 var reqElemMultiple = ["img"]; // tr, td, th not required
 var reqList = true;
 var reqComments = false;
 var forbiddenCss = ["@import"];
 var reqCss = ["float", "@import"];
 return {"single": reqElemSingle, "multiple": reqElemMultiple, "list": reqList, "fbdnCss": forbiddenCss, "reqCss": reqCss, "reqComments": reqComments};
}