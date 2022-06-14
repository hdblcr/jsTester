import { getTagValue } from "./functions.js";

function checkDict(cssResult) {
  if(window.DEBUG_MODE){("check dict called");}
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

export function cssParser(cssResult){
  if(window.DEBUG_MODE){console.log("css parser called");}
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
