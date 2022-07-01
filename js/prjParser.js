import { gatherCss } from "./cssCheck.js";
import { openClose } from "./htmlVal.js";
import { countInstanceInStr, elemName } from "./functions.js";
import { checkReqdCss } from "./cssInfrastructure.js";

export function prjParser(reqs){
  
  if(window.DEBUG_MODE){console.log("prjparser called");}
  var errors = [];
  const html = document.documentElement.innerHTML;
  let cssText = gatherCss();

  if(window.VERBOSE){console.log(reqs);}

  if(window.VERBOSE){console.log(reqs.multiple);}
  if(window.VERBOSE){console.log(reqs.multiple.length);}

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
