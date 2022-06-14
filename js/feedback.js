import { cssParser } from "./cssParser.js";
import { prjParser } from "./prjParser.js";
import { cleanString } from "./functions.js";

function setStyles(bgcolor, fgcolor){
  document.querySelector("#feedback").style.background = bgcolor;
  document.querySelector("#feedbackDetails").style.color = fgcolor;
  if (document.querySelector("#feedbackDetails a") !== null){
    document.querySelector("#feedbackDetails a").style.cssText = "all: unset; text-decoration: underline; color: " + fgcolor + ";";
  }
  if (document.querySelector("#feedbackDetails h2") !== null){
    document.querySelector("#feedbackDetails h2").style.cssText = "all: unset; font-size: 1.5em; margin-top: 0.83em; margin-bottom: 0.83em; font-weight: bold;"
  }
  if(document.querySelector("#feedbackDetails ul") !== null) {
    document.querySelector("#feedbackDetails ul").style.cssText = "all: unset;";
  }
}

export function feedback(htmlErrs, cssResult, reqs){
  if(window.DEBUG_MODE){console.log("feedback function called");}
  
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
    fdbk = "<h2 " + window.font + ">No errors!</h2>";
    
    // let user check spelling
    fdbk += "<h3 " + window.font + ">Spell Checker</h3>";
    fdbk += "<p " + window.font + ">Check spelling <a " + window.font + "href=\"https://www.online-spellcheck.com/spell-check-url?download_url=" + document.documentURI + "\" target=\"_blank\" rel=\"noopener\">here</a>.";

    // report validation fails
    if (htmlFail) {
      fdbk += "<h3 " + window.font + ">HTML Validation</h3>";
      fdbk += "<p>HTML Validation Failed.</p>";
    }
    
    if (cssFail) {
      fdbk += "<h3 " + window.font + ">CSS Validation</h3>";
      fdbk += "<p>CSS Validation Failed.</p>";
    }
    
  } else {
    // print number of errors
    fdbk += "<h2 " + window.font + ">" + numErrors.toString() + " errors found.</h2>";

    // print project errors
    if (prjErrs.length > 0){
      fdbk += "<h3 " + window.font + ">Project Requirements</h3>";
      fdbk += "<ol " + window.font + ">";
      for (let i=0; i < prjErrs.length; i++){
        fdbk += "<li " + window.font + ">";
        fdbk += prjErrs[i];
        fdbk += "</li>";
      }
      fdbk += "</ol>";
    }

    // print HTML errors
    if (htmlErrs.length > 0) {
      if (htmlErrs[0] == "HTML Validation Failed."){
        fdbk += "<h3 " + window.font + ">HTML Validation</h3>";
        fdbk += "<p>HTML Validation Failed.</p>";
      } else {
        fdbk += "<h3 " + window.font + ">HTML Validation</h3>";
        fdbk += "<ol " + window.font + ">";
        for (let i=0; i < htmlErrs.length; i++){
          fdbk += "<li " + window.font + ">Type: " + htmlErrs[i].type + "<ul>";
          fdbk += "<li " + window.font + ">Error message: <span "+ window.fixWidFont + ">" + htmlErrs[i].message + "</span></li>";
          fdbk += "<li " + window.font + ">Line number: " + htmlErrs[i].lastLine + "</li>";
          fdbk += "</li></ul>";
        }
        fdbk += "</ol>";
      }
    }

    // print CSS errors
    if (cssErrs.length > 0) {
      if (cssErrs[0] == "CSS Validation Failed."){
        fdbk += "<h3 " + window.font + ">CSS Validation</h3>";
        fdbk += "<p>CSS Validation Failed.</p>";
      } else {
        fdbk += "<h3 " + window.font + ">CSS Validation</h3>";
        fdbk += "<ol " + window.font + ">";
        for (let i=0; i < cssErrs.length; i++){
          fdbk += "<li " + window.font + ">" + "Error type: " + cleanString(cssErrs[i][0]) + "<ul>";
          fdbk += "<li " + window.font + ">Error message: " + cleanString(cssErrs[i][2]) + "</li>";
          fdbk += "<li " + window.font + ">Line number " + cleanString(cssErrs[i][3]) + "</li></ul></li>";
        }
        fdbk += "</ol>";
      }
    }

    // let user check spelling
    fdbk += "<h3 " + window.font + ">Spell Checker</h3>";
    fdbk += "<p " + window.font + ">Check spelling <a " + window.font + "href=\"https://www.online-spellcheck.com/spell-check-url?download_url=" + document.documentURI + "\" target=\"_blank\" rel=\"noopener\">here</a>."
  }

  if(window.DEBUG_MODE){console.log("feedback string done");}
  
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

  if(window.DEBUG_MODE){console.log("sidebar restyled");}
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

export function sidebar(){
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