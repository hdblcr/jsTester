import { feedback } from "./feedback.js";
function cssVal() {
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    var url = document.documentURI;

    // very short timeout since website is down
    let cssTimeout = setTimeout(()=>{
      reject('timeout');
      if(window.DEBUG_MODE){
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

export function cssValSubset(htmlResult, reqs){
  if(window.DEBUG_MODE){console.log("Calling css validation");}
  return cssVal()
    .then(function(cssResult){
      if(window.DEBUG_MODE){console.log("css result returned");}
      // give feedback
      feedback(htmlResult, cssResult, reqs);
    })
    .catch(function(cssResult){
      let cssValAry = ["CSS Validation Failed."];
      if(window.DEBUG_MODE){ 
        console.log("CSS fail, calling fdbk");
        console.log(cssResult);
      }
      feedback(htmlResult, cssValAry, reqs);
    })
}

export function gatherCss(){
  let rules = "";
  for(let i = 0; i < document.styleSheets.length; i++){
    for(let j=0; j < document.styleSheets[i].cssRules.length; j++){
      rules += document.styleSheets[i].cssRules[j].cssText;
      rules += "\n";
    }
  }
  return rules;
}
