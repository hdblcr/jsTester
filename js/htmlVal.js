import { countInstanceInStr } from "./functions.js";

export function htmlVal() {
  return new Promise(function(resolve, reject){
    var xhr = new XMLHttpRequest();
    var url = document.documentURI;
    //var valService = "https://validator.nu/";
    var valService = "https://validator.w3.org/nu/";

    // long timeout since service takes awhile
    let startTime = new Date();
    if(window.DEBUG_MODE){
      console.log("starting html");
    }
    let htmlTimeout = setTimeout(()=>{
      reject("timeout");
      if(window.DEBUG_MODE){
        console.log("html timeout");
      }
    },2500);
    
    xhr.onload = function() {
      clearTimeout(htmlTimeout);
      let jsonParse = JSON.parse(this.response);
      resolve(jsonParse["messages"]);
      if(window.DEBUG_MODE){
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

function openClose(elem, single){
  var errs = "";
  var elemOpened = true;
  var elemClosed = true;
  var html = document.documentElement.innerHTML;
  var isEmptyElem = false;
  
  if(["img", "br", "meta", "link", 'meta name="description"', "meta name=\"description\""].indexOf(elem) > -1){isEmptyElem = true;}

  if(window.VERBOSE){
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
