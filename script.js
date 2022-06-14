import { defaultPrjReqs } from "./js/prjReqs.js";
import { cssValSubset } from "./js/cssCheck.js";
import { sidebar } from "./js/feedback.js";
import { htmlVal } from "./js/htmlVal.js";

window.DEBUG_MODE = false;
window.VERBOSE = false;
window.font = "style=\"font-family: 'Segoe UI', Verdana, Tahoma, sans-serif;\"";
window.fixWidFont = "style=\"font-family: 'Consolas', 'Courier New', Courier, monospace;\"";

export function validate(reqs = defaultPrjReqs()) {
  if(typeof(reqs.debug) !== 'undefined'){
    window.DEBUG_MODE = reqs.debug;
  }
  
  if(typeof(reqs.verbose) !== 'undefined'){
    window.VERBOSE = reqs.verbose;
  }
  
  if(window.VERBOSE){console.log(reqs);}

  if(window.DEBUG_MODE){console.log("main has been called");}

  // HTML validation
  htmlVal()
    .then(function(htmlResult){
      if(window.DEBUG_MODE){console.log("html result returned");}
      
      // CSS validation
      cssValSubset(htmlResult, reqs);
    }).catch(function() {
      if(window.DEBUG_MODE){console.log("html reject returned");}
      let htmlResult = ["HTML Validation Failed."];
      
      // CSS validation
      cssValSubset(htmlResult, reqs);
    });

  if(window.DEBUG_MODE){console.log("async stuff started");}

  // Build sidebar
  sidebar();
}

var main = function(reqs = defaultPrjReqs()){
  validate(reqs);
}

var mainJamesTest = function (reqs = defaultPrjReqs()){
  validate(reqs);
}