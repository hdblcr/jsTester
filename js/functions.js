export function cleanString(str){
  return str.replace(/\n+/g, '');;
}

// Simple Javascript function that returns data contained within a set of tags. 
export function getTagValue(inputStr, tagName) {
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
  if (startPos >= 0){
    var endPos = inputStr.indexOf(etag, startPos);
    if (endPos > startPos){
      startPos = startPos + len;
      return inputStr.substring(startPos, endPos);
    }
    }
  return "";
}

export function countInstanceInStr(instance, str) {
  var firstOccur = str.indexOf(instance);
  if (firstOccur < 0){
    return 0;
  } else {
    return 1 + countInstanceInStr(instance, str.substr(firstOccur + 1));
  }
}

export function elemName(elem){
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

function checkConventions(html){
  html.match(/<\/*[A-Z]/g); // match returns an array with all matches. Each is a string
}