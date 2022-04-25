/*
import { importMe } from "./testmod.js";
importMe();
*/

const DEBUG_MODE = false;
const VERBOSE = false;
var font = "style=\"font-family: 'Segoe UI', Verdana, Tahoma, sans-serif;\"";
var fixWidFont = "style=\"font-family: 'Consolas', 'Courier New', Courier, monospace;\"";

function defaultPrjReqs() {
  if(DEBUG_MODE){console.log("prjReqs called");}
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
   "uniqueTitle": uniqueTitle
 };
}

function cleanString(str){
  return str.replace(/\n+/g, '');;
}

function cssVal() {
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    var url = document.documentURI;

    // very short timeout since website is down
    let cssTimeout = setTimeout(()=>{
      reject('timeout');
      if(DEBUG_MODE){
        console.log("css timeout");
      }
    }, 2500);

    xhr.onload = function() {
      resolve(this.responseText);
      clearTimeout(cssTimeout);
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
    //var valService = "https://validator.nu/";
    var valService = "https://validator.w3.org/nu/";

    // long timeout since service takes awhile
    let startTime = new Date();
    if(DEBUG_MODE){
      console.log("starting html");
    }
    let htmlTimeout = setTimeout(()=>{
      reject("timeout");
      if(DEBUG_MODE){
        console.log("html timeout");
      }
    },2500);
    
    xhr.onload = function() {
      clearTimeout(htmlTimeout);
      let jsonParse = JSON.parse(this.response);
      resolve(jsonParse["messages"]);
      if(DEBUG_MODE){
        let endTime = new Date();
        let duration = endTime - startTime;
        console.log("===========HTML validation took " + duration + " ms.=============");
      }
    }
    
    var valUrl = valService + "?doc="+ url + "&out=json&t=" + Math.random();
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
    if(DEBUG_MODE){console.log(url);}
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
  if(DEBUG_MODE){("check dict called");}
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
  if(DEBUG_MODE){console.log("css parser called");}
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
  let gt = elem.indexOf(">");
  if(gt > -1){
    let newElem = elem.substr(0, gt) + elem.substr(gt + 1, elem.length - gt);
    return elemName(newElem);
  }
  let lt = elem.indexOf("<");
  if(lt > -1){
    let newElem = elem.substr(0, lt) + elem.substr(lt + 1, elem.length - lt);
    return elemName(newElem);
  }
  /*
  if (elem.substr(elem.len-1) == ">"){
    return elem.substr(0, elem.length-1);
  }
  if (elem.substr(0, 1) == "<"){
    return elem.substr(0, elem.length-1);
  }
  */
  return elem;
}

function openClose(elem, single){
  var errs = "";
  var elemOpened = true;
  var elemClosed = true;
  var html = document.documentElement.innerHTML;
  var isEmptyElem = false;
  
  if(["img", "br", "meta", "link", 'meta name="description"', "meta name=\"description\""].indexOf(elem) > -1){isEmptyElem = true;}

  if(VERBOSE){
    console.log("Is " + elem + " empty? " + isEmptyElem.toString());
  }

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
  if (isEmptyElem) {
    elemClosed = true;
  }

  // write errors
  if (!elemOpened && !elemClosed){
    return elemName(elem) + " element missing.";
  } else if (!elemOpened) {
    // empty elements should report missing, not not opened.
    if (isEmptyElem) {
      return elemName(elem) + " element missing.";
    }
    return elemName(elem) + " element not opened.";
  } else if (!elemClosed) {
    return elemName(elem) + " element not closed.";
  }
  return errs;
}

function gatherCss(){
  let rules = "";
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

function checkConventions(html){
  html.match(/<\/*[A-Z]/g); // match returns an array with all matches. Each is a string
}

function prjParser(reqs){
  
  if(DEBUG_MODE){console.log("prjparser called");}
  var errors = [];
  const html = document.documentElement.innerHTML;
  let cssText = gatherCss();

  if(VERBOSE){console.log(reqs);}

  if(VERBOSE){console.log(reqs.multiple);}
  if(VERBOSE){console.log(reqs.multiple.length);}

  // loop through required elements (multiple)
  if(reqs.multiple){
    for (let i = 0; i < reqs.multiple.length; i++){
      let errs = openClose(reqs.multiple[i], false);
      if (errs.length > 0){
        errors.push(errs);
      }
    }
  }

  // loop through required elements (single)
  if(reqs.single){
    for (let i = 0; i < reqs.single.length; i++){
      let errs = openClose(reqs.single[i], true);
      if (errs.length > 0){
        errors.push(errs);
      }
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
  if(reqs.fbdnCss){
    if(reqs.fbdnCss.length > 0){
      let fbdnCssErrs = checkForbiddenCss(cssText, reqs.fbdnCss);
      for (let i=0; i < fbdnCssErrs.length; i++){
        errors.push(fbdnCssErrs[i] + " used when it should not be.");
      }
    }
  }

  // required css
  if(reqs.reqCss){
    if(reqs.reqCss.length > 0){
      let reqCssErrs = checkReqdCss(cssText, reqs.reqCss);
      for (let i=0; i < reqCssErrs.length; i++){
        errors.push(reqCssErrs[i] + " not used when it should be.");
      }
    }
  }

  // if unique title is required
  if(reqs.uniqueTitle) {
    if (countInstanceInStr("<title>repl.it</title>", html) > 0){
      errors.push("Default title used.");
    } else if (countInstanceInStr("<title></title>", html) > 0) {
      errors.push("Empty title used.");
    } else if (countInstanceInStr("<title>replit</title>", html) > 0) {
      errors.push("Default title used.");
    }
  }


  // comments
  if((typeof(reqs.reqComments) == "undefined") || reqs.reqComments){
    var numComments = countInstanceInStr("<!--", html) + countInstanceInStr("-->", html) / 2;
    if ((numComments 
         - countInstanceInStr("<!-- Don't forget to change your title! -->", html) 
         - countInstanceInStr("<!-- Don't forget to change your description! -->", html)
        ) < 1){
      errors.push("No comments written.");
    }
  }

  // all done!
  return errors;
}

function setStyles(bgcolor, fgcolor){
  document.querySelector("#feedback").style.background = bgcolor;
  document.querySelector("#feedbackDetails").style.color = fgcolor;
  document.querySelector("#feedbackDetails a").style.color = fgcolor;

  // update other styles
  document.querySelector("#feedbackDetails a").style.cssText = "all: unset; text-decoration: underline; color: " + fgcolor + ";";
  document.querySelector("#feedbackDetails h2").style.cssText = "all: unset; font-size: 1.5em; margin-top: 0.83em; margin-bottom: 0.83em; font-weight: bold;"
  document.querySelector("#feedbackDetails ul").style.cssText = "all: unset;";
}

function feedback(htmlErrs, cssResult, reqs){
  if(DEBUG_MODE){console.log("feedback function called");}
  
  var numCss;
  var numHtml = htmlErrs.length;
  var cssFail = false;
  var htmlFail = false;
  
  // get CSS and project errors
  if (cssResult[0] !== "CSS Validation Failed."){
    var cssErrs = cssParser(cssResult);
    numCss = cssErrs.length;
  } else {
    cssErrs = cssResult;
    numCss = 0;
    cssFail = true;
  }

  // reduce HTML errors if it didn't validate
  if (htmlErrs[0] == "HTML Validation Failed."){
    numHtml = 0;
    htmlFail = true;
  }

  // collect project errors
  var prjErrs = prjParser(reqs);
  var numPrj = prjErrs.length;

  // calculate number of errors
  const numErrors = numHtml + numCss + numPrj;

  // feedback string
  var fdbk = "";

  // if no errors
  if (numErrors == 0){
    fdbk = "<h2 " + font + ">No errors!</h2>";
    
    // let user check spelling
    fdbk += "<h3 " + font + ">Spell Checker</h3>";
    fdbk += "<p " + font + ">Check spelling <a " + font + "href=\"https://www.online-spellcheck.com/spell-check-url?download_url=" + document.documentURI + "\" target=\"_blank\" rel=\"noopener\">here</a>.";

    // report validation fails
    if (htmlFail) {
      fdbk += "<h3 " + font + ">HTML Validation</h3>";
      fdbk += "<p>HTML Validation Failed.</p>";
    }
    
    if (cssFail) {
      fdbk += "<h3 " + font + ">CSS Validation</h3>";
      fdbk += "<p>CSS Validation Failed.</p>";
    }
    
  } else {
    // print number of errors
    fdbk += "<h2 " + font + ">" + numErrors.toString() + " errors found.</h2>";

    // print project errors
    if (prjErrs.length > 0){
      fdbk += "<h3 " + font + ">Project Requirements</h3>";
      fdbk += "<ol " + font + ">";
      for (let i=0; i < prjErrs.length; i++){
        fdbk += "<li " + font + ">";
        fdbk += prjErrs[i];
        fdbk += "</li>";
      }
      fdbk += "</ol>";
    }

    // print HTML errors
    if (htmlErrs.length > 0) {
      if (htmlErrs[0] == "HTML Validation Failed."){
        fdbk += "<h3 " + font + ">HTML Validation</h3>";
        fdbk += "<p>HTML Validation Failed.</p>";
      } else {
        fdbk += "<h3 " + font + ">HTML Validation</h3>";
        fdbk += "<ol " + font + ">";
        for (let i=0; i < htmlErrs.length; i++){
          fdbk += "<li " + font + ">Type: " + htmlErrs[i].type + "<ul>";
          fdbk += "<li " + font + ">Error message: <span "+ fixWidFont + ">" + htmlErrs[i].message + "</span></li>";
          fdbk += "<li " + font + ">Line number: " + htmlErrs[i].lastLine + "</li>";
          fdbk += "</li></ul>";
        }
        fdbk += "</ol>";
      }
    }

    // print CSS errors
    if (cssErrs.length > 0) {
      if (cssErrs[0] == "CSS Validation Failed."){
        fdbk += "<h3 " + font + ">CSS Validation</h3>";
        fdbk += "<p>CSS Validation Failed.</p>";
      } else {
        fdbk += "<h3 " + font + ">CSS Validation</h3>";
        fdbk += "<ol " + font + ">";
        for (let i=0; i < cssErrs.length; i++){
          fdbk += "<li " + font + ">" + "Error type: " + cleanString(cssErrs[i][0]) + "<ul>";
          fdbk += "<li " + font + ">Error message: " + cleanString(cssErrs[i][2]) + "</li>";
          fdbk += "<li " + font + ">Line number " + cleanString(cssErrs[i][3]) + "</li></ul></li>";
        }
        fdbk += "</ol>";
      }
    }

    // let user check spelling
    fdbk += "<h3 " + font + ">Spell Checker</h3>";
    fdbk += "<p " + font + ">Check spelling <a " + font + "href=\"https://www.online-spellcheck.com/spell-check-url?download_url=" + document.documentURI + "\" target=\"_blank\" rel=\"noopener\">here</a>."
  }

  if(DEBUG_MODE){console.log("feedback string done");}
  
  // display feedback
  document.getElementById("feedbackDetails").innerHTML = fdbk;

  // determine feedback color
  switch(Math.floor((numErrors + 1) / 2)){
    case 0:
      setStyles("#27ae60", "#ecf0f1");
      break;
    case 1:
      setStyles("#f1c40f", "black");
      break;
    case 2:
      setStyles("#e67e22", "black");
      break;
    case 3: 
      setStyles("#e74c3c", "black");
      break;
    default:
      setStyles("#c0392b", "#ecf0f1");
  }

  if(DEBUG_MODE){console.log("sidebar restyled");}
}

function sidebar(){
  // create button
  var myElemTag = document.createElement("div");
  myElemTag.addEventListener("click", showOnClick);
  myElemTag.id = "feedback";

  // create details window
  var myDetailsTag = document.createElement("div");
  myDetailsTag.id = "feedbackDetails";

  // append button
  document.body.appendChild(myElemTag);
  let myElem = document.querySelector("#feedback");
  
  // append feedback details
  myElem.appendChild(myDetailsTag);

  // style sidebar
  myElem.style.cssText = "height: 30px; width:30px; position: fixed; right: 0; top: 0; background: #FFFFFF; border-radius: 0; box-sizing: intial; padding: 0; margin: 0; border: 0 solid green; box-shadow: 0 0;";
  document.querySelector("#feedbackDetails").style.cssText = "position: fixed; right: 0; top: 0; background: inherit; z-index: 1; display: none; width: 30vw; min-width: 300px; max-height: 100vh; padding: 10px; overflow: scroll; border-radius: 0; box-sizing: intial;  margin: 0; border: 0 solid green; box-shadow: 0 0; font-family: 'Segoe UI', Verdana, Tahoma, sans-serif; color: inherit; text-align: left;";
}

function cssValSubset(htmlResult, reqs){
  if(DEBUG_MODE){console.log("Calling css validation");}
  return cssVal()
        .then(function(cssResult){
          if(DEBUG_MODE){console.log("css result returned");}
          // give feedback
          feedback(htmlResult, cssResult, reqs);
        })
        .catch(function(cssResult){
          let cssValAry = ["CSS Validation Failed."];
          if(DEBUG_MODE){console.log("CSS fail, calling fdbk");}
          feedback(htmlResult, cssValAry, reqs);
        })
}

function mainJamesTest(reqs = defaultPrjReqs()) {
  if(VERBOSE){console.log(reqs);}
  //if(typeof(reqs))

  if(DEBUG_MODE){console.log("main has been called");}

  // HTML validation
  htmlVal()
    .then(function(htmlResult){
      if(DEBUG_MODE){console.log("html result returned");}
      
      // CSS validation
      cssValSubset(htmlResult, reqs);
    }).catch(function() {
      if(DEBUG_MODE){console.log("html reject returned");}
      let htmlResult = ["HTML Validation Failed."];
      
      // CSS validation
      cssValSubset(htmlResult, reqs);
    });

  if(DEBUG_MODE){console.log("async stuff started");}

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
function getTagValue(inputStr, tagName) {
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

var main = function(reqs = defaultPrjReqs()){
  mainJamesTest(reqs);
}
