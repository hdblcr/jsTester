var debugMode = false;

function prjReqs() {
  if(debugMode){console.log("prjReqs called");}
  // Required HTML stuff
  var reqElemSingle = [ "head>", "title", "body", "header", "main", "footer"]; // nav, table not required // elements required for each page in this project.
 var reqElemMultiple = ["img"]; // tr, td, th not required
 var reqList = true;
 var forbiddenCss = ["@import"];
 var reqCss = ["float", "@import"];
 return {"single": reqElemSingle, "multiple": reqElemMultiple, "list": reqList, "fbdnCss": forbiddenCss, "reqCss": reqCss};
}

function cleanString(str){
  return str.replace(/\n+/g, '');;
}

function cssVal() {
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    var url = document.documentURI;
    xhr.onload = function() {
      resolve(this.responseText);
    }

    var valUrl = "https://jigsaw.w3.org/css-validator/validator?uri=".concat(url).concat("&output=soap12&t=").concat(Math.random());
    xhr.onerror = reject;
    xhr.open("GET", valUrl, true);
    xhr.send();
    });
}

function htmlVal() {
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    var url = document.documentURI;
  if(debugMode){console.log(url);}
    xhr.onload = function() {
      jsonParse = JSON.parse(this.response);
      resolve(jsonParse["messages"]);
    }

    var valUrl = "https://validator.w3.org/nu/".concat("?doc=").concat(url).concat("&out=json&t=").concat(Math.random());
    xhr.onerror = reject;
    xhr.open("GET", valUrl, true);
    xhr.send();
    });
}

function spellVal() {
  /*addScript("JavaScriptSpellCheck/include.js");
  $Spelling.SpellCheckInWindow('all')
}
function addScript(script) {
    var jsElement = document.createElement("script");
    jsElement.type = "application/javascript";
    jsElement.src = script;
    document.body.appendChild(jsElement);
} */
/*
  fetchInject([    
    'https://www.chrisfinke.com/files/typo-demo/typo/typo.js'
  ]).then(() => {
    console.log('spellchecker loaded');
  })
*/


    return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    var url = document.documentURI;
    if(debugMode){console.log(url);}
    xhr.onload = function() {
      jsonParse = JSON.parse(this.response);
      resolve(jsonParse["messages"]);
    }

    var valUrl = "https://www.chrisfinke.com/files/typo-demo/typo/typo.js";
    xhr.onerror = reject;
    xhr.open("GET", valUrl, true);
    xhr.send();
    });
}


function checkDict(cssResult) {
  if(debugMode){("check dict called");}
  if (cssResult.indexOf("env:Envelope") == -1){
    return false;
  } else if (cssResult.indexOf("env:Body") == -1){
    return false;
  } else if (cssResult.indexOf("m:cssvalidationresponse") == -1){
    return false;
  } else if (cssResult.indexOf("m:result") == -1){
    return false;
  } else if (cssResult.indexOf("m:errors") == -1){
    return false;
  } else {
    return true;
  }
}

function cssParser(cssResult){
  if(debugMode){console.log("css parser called");}
  var errMsg = [];
  if (checkDict(cssResult)){
    // no errors?
    if (getTagValue(cssResult, "m:validity") == "true"){
      return errMsg;
    }

    // errors
    var numErrors = getTagValue(cssResult, "m:errorcount");
    var rawErrors = getTagValue(cssResult, "m:errorlist").split("<m:error>");
    
    for (let i = 1; i < rawErrors.length; i++){
      
      var x = [];
      x.push(getTagValue(rawErrors[i], "m:errortype"));
      x.push(getTagValue(rawErrors[i], "m:type"));
      x.push(getTagValue(rawErrors[i], "m:message"));
      x.push(getTagValue(rawErrors[i], "m:line"));

      errMsg.push(x);
    }
    return errMsg;
  } else {
    return ["CSS Failed to Parse."];
  }
}

function countInstanceInStr(instance, str) {
  var firstOccur = str.indexOf(instance);
  if (firstOccur < 0){
    return 0;
  } else {
    return 1 + countInstanceInStr(instance, str.substr(firstOccur + 1));
  }
}

function elemName(elem){
  if (elem.substr(elem.len-1) == ">"){
      return elem.substr(0, elem.length-1)
  }
  return elem;
}

function openClose(elem, single){
  var errs = "";
  var elemOpened = true;
  var elemClosed = true;
  var html = document.documentElement.innerHTML;

  // check for data
  let numOpen = countInstanceInStr("<" + elem, html);
  let numClose= countInstanceInStr("</" + elem, html);
  if (numOpen == 0) {
    elemOpened = false;
  } else if ((numOpen > 1) && single){
    errs = elemName(elem) + " element opened multiple times.";
  }
  if (numClose == 0) {
    elemClosed = false;
  } else if ((numClose > 1) && single) {
    errs = elemName(elem) + " element closed multiple times.";
  }

  // exception for empty elements
  if (["img", "br", "meta", "link", "meta name=\"description\"", "<meta name=\"description\""].indexOf(elem) > -1) {
    elemClosed = true;
  }

  // write errors
  if (!elemOpened && !elemClosed){
    return elemName(elem) + " element missing.";
  } else if (!elemOpened) {
    return elemName(elem) + " element not opened.";
  } else if (!elemClosed) {
    return elemName(elem) + " element not closed.";
  }
  return errs;
}

function gatherCss(){
  rules = "";
  for(let i = 0; i < document.styleSheets.length; i++){
    for(let j=0; j < document.styleSheets[i].cssRules.length; j++){
      rules += document.styleSheets[i].cssRules[j].cssText;
      rules += "\n";
    }
  }
  return rules;
}

function checkForbiddenCss(css, fbdnCss){
  alert = [];
  for(let i=0; i < fbdnCss.length; i++){
    if(countInstanceInStr(fbdnCss[i], css) > 0 ){
      alert.push(fbdnCss[i]);
    }
  }
  return alert;
}

function checkReqdCss(css, reqCss){
    alert = [];
  for(let i=0; i < reqCss.length; i++){
    if(countInstanceInStr(reqCss[i], css) < 1 ){
      alert.push(reqCss[i]);
    }
  }
  return alert;
}

function prjParser(reqs){
  if(debugMode){console.log("prjparser called");}
  var errors = [];
  const html = document.documentElement.innerHTML;
  let cssText = gatherCss();

   if(debugMode){console.log(reqs);}

  if(debugMode){console.log(reqs.multiple);}
  if(debugMode){console.log(reqs.multiple.length);}

  // loop through required elements (multiple)
  for (let i = 0; i < reqs.multiple.length; i++){
    let errs = openClose(reqs.multiple[i], false);
    if (errs.length > 0){
      errors.push(errs);
    }
  }

  // loop through required elements (single)
  for (let i = 0; i < reqs.single.length; i++){
    let errs = openClose(reqs.single[i], true);
    if (errs.length > 0){
      errors.push(errs);
    }
  }

  // if lists are required
  if (reqs.list) {
    var errsUl = openClose("ul", false);
    var errsOl = openClose("ol", false);
    var errsDl = openClose("dl", false);

    if ((errsUl.indexOf(elemName("ul") + " element missing.") > -1) && (errsOl.indexOf(elemName("ol") + " element missing.") > -1) && (errsDl.indexOf(elemName("dl") + " element missing.") > -1)){
      errors.push("No list present.");
    }
  }

  // forbidden css
  if(reqs.fbdnCss.length > 0){
    let fbdnCssErrs = checkForbiddenCss(cssText, reqs.fbdnCss);
    for (let i=0; i < fbdnCssErrs.length; i++){
      errors.push(fbdnCssErrs[i] + " used when it should not be.");
    }
  }

  // forbidden css
  if(reqs.reqCss.length > 0){
    let reqCssErrs = checkReqdCss(cssText, reqs.reqCss);
    for (let i=0; i < reqCssErrs.length; i++){
      errors.push(reqCssErrs[i] + " not used when it should be.");
    }
  }

  // title
  if (countInstanceInStr("<title>repl.it</title>", html) > 0){
    errors.push("Default title used.");
  } else if (countInstanceInStr("<title></title>", html) > 0) {
    errors.push("Empty title used.");
  } else if (countInstanceInStr("<title>replit</title>", html) > 0) {
    errors.push("Default title used.");
  }

  // comments
  var numComments = countInstanceInStr("<!--", html) + countInstanceInStr("-->", html) / 2;
  if (numComments - countInstanceInStr("<!-- Don't forget to change your title! -->", html) < 1){
    errors.push("No comments written.");
  }

  // all done!
  return errors;
}

function feedback(htmlErrs, cssResult, reqs){
  // get CSS and project errors
  var cssErrs = cssParser(cssResult);
  var prjErrs = prjParser(reqs);

  // calculate number of errors
  const numErrors = htmlErrs.length + cssErrs.length + prjErrs.length;

  // feedback string
  var fdbk = "";

  // if no errors
  if (numErrors == 0){
    fdbk = "<h2>No errors!</h2>";
  } else {
    // print number of errors
    fdbk += "<h2>" + numErrors.toString() + " errors found.</h2>";

    // print project errors
    if (prjErrs.length > 0){
      fdbk += "<h3>Project Requirements</h3>";
      fdbk += "<ol>";
      for (let i=0; i < prjErrs.length; i++){
        fdbk += "<li>";
        fdbk += prjErrs[i];
        fdbk += "</li>";
      }
      fdbk += "</ol>";
    }

    // print HTML errors
    if (htmlErrs.length > 0) {
      fdbk += "<h3>HTML Validation</h3>";
      fdbk += "<ol>";
      for (let i=0; i < htmlErrs.length; i++){
        fdbk += "<li>Type: " + htmlErrs[i].type + "<ul>";
        fdbk += "<li>Error message: " + htmlErrs[i].message + "</li>";
        fdbk += "<li>Line number: " + htmlErrs[i].lastLine + "</li>";
        fdbk += "</li></ul>";
      }
      fdbk += "</ol>";
    }

    // print CSS errors
    if (cssErrs.length > 0) {
      fdbk += "<h3>CSS Validation</h3>";
      fdbk += "<ol>";
      for (let i=0; i < cssErrs.length; i++){
        fdbk += "<li>" + "Error type: " + cleanString(cssErrs[i][0]) + "<ul>";
        fdbk += "<li>Error message: " + cleanString(cssErrs[i][2]) + "</li>";
        fdbk += "<li>Line number " + cleanString(cssErrs[i][3]) + "</li></ul></li>";
      }
      fdbk += "</ol>";
    }

    // let user check spelling
    fdbk += "<h3>Spell Checker</h3>";
    fdbk += "<p>Check spelling <a href=\"https://www.online-spellcheck.com/spell-check-url?download_url=" + document.documentURI + "\" target=\"_blank\" rel=\"noopener\">here</a>."
  }
  // display feedback
  document.getElementById("feedbackDetails").innerHTML = fdbk;

  // determine feedback color
  switch(Math.floor((numErrors + 1) / 2)){
    case 0:
      document.querySelector("#feedback").style.background = "#006600";
      document.querySelector("#feedbackDetails").style.color = "white";
      break;
    case 1:
      document.querySelector("#feedback").style.background = "#CCFF33";
      document.querySelector("#feedbackDetails").style.color = "black";
      break;
    case 2:
      document.querySelector("#feedback").style.background = "#FFCC00";
      document.querySelector("#feedbackDetails").style.color = "black";
      break;
    case 3: 
      document.querySelector("#feedback").style.background = "#FF6633";
      document.querySelector("#feedbackDetails").style.color = "black";
      break;
    default:
      document.querySelector("#feedback").style.background = "#990000";
      document.querySelector("#feedbackDetails").style.color = "white";
  }
}

function sidebar(){
  //var bodies = document.getElementsByTagName("BODY");

  // create button
  var myElemTag = document.createElement("div");
  myElemTag.addEventListener("click", showOnClick);
  myElemTag.id = "feedback";

  // create details window
  var myDetailsTag = document.createElement("div");
  myDetailsTag.id = "feedbackDetails";

  // append button
  document.body.appendChild(myElemTag);
  myElem = document.querySelector("#feedback");
  
  // append feedback details
  myElem.appendChild(myDetailsTag);

  // style sidebar
  myElem.style.cssText = "height: 30px; width:30px; position: fixed; right: 0; top: 0; background: #FFFFFF; border-radius: 0; box-sizing: intial; padding: 0; margin: 0; border: 0 solid green; box-shadow: 0 0;";
  document.querySelector("#feedbackDetails").style.cssText = "position: fixed; right: 0; top: 0; background: inherit; z-index: 1; display: none; width: 50%; max-height: 100vh; padding: 10px; overflow: scroll; border-radius: 0; box-sizing: intial;  margin: 0; border: 0 solid green; box-shadow: 0 0; font-family: 'Segoe UI', Verdana, Tahoma,sans-serif; color: inherit";
}

function main(reqs = prjReqs()) {
  if(reqs == "replaceMe"){
    //prjReqs();
    reqs = prjReqsVal;
  }
  if(debugMode){console.log(reqs);}
  //if(typeof(reqs))

  if(debugMode){console.log("main has been called");}

  // HTML validation
  htmlVal()
    .then(function(htmlResult){
      if(debugMode){console.log("html result returned");}
      // CSS validation
      cssVal()
        .then(function(cssResult){
          if(debugMode){console.log("css result returned");}
          // give feedback
          feedback(htmlResult, cssResult, reqs);
        })
        .catch(function(){
          cssValAry = "CSS Validation Failed.";
        })
    })
    .catch(function() {
      htmlValAry = "HTML Validation Failed.";
    });

  if(debugMode){console.log("async stuff started");}

  // Build sidebar
  sidebar();

/* //Starting to build spell checker
  //call spelling
  spellVal()
    .then(function (response){
      eval(response);
      $Spelling.SpellCheckInWindow('all');
    }).catch(console.log("error with spelling"));*/
}

// Simple Javascript function that returns data contained within a set of tags. 
function getTagValue(inputStr, tagName)
{
  // Simple function to search for tagged element in a string,
  // this function will not recurse and simply finds first ocurrence
  // of tag in document.
        
  // PARAM inputStr - string containing tagged document
  // PARAM tagName - name of element to locate
  // RETURNS string data between tagName element or "" if not found

  var stag = "<" + tagName + " xml:lang=\"en\">";
  var stag2 = "<" + tagName + ">";
  var etag = "<" + "/" + tagName + ">";

  var startPos = inputStr.indexOf(stag, 0);
  var len = stag.length;
  if (startPos < 0){
    startPos = inputStr.indexOf(stag2, 0);
    len = stag2.length;
  }
  if (startPos >= 0)
  {
    var endPos = inputStr.indexOf(etag, startPos);
    if (endPos > startPos)
    {
      startPos = startPos + len;
      return inputStr.substring(startPos, endPos);
    }
  }
  return "";
}

function showOnClick(){
  var deets = document.getElementById("feedbackDetails");
  if ( deets.style.display == "block"){
    deets.style.display = "none";
    return;
  } else if (deets.style.display == "none") {
    deets.style.display = "block";
    return;
  }
}