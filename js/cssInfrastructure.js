import { countInstanceInStr } from "./functions.js";

export function checkForbiddenCss(css, fbdnCss){
  alert = [];
  for(let i=0; i < fbdnCss.length; i++){
    if(countInstanceInStr(fbdnCss[i], css) > 0 ){
      alert.push(fbdnCss[i]);
    }
  }
  return alert;
}

export function checkReqdCss(css, reqCss){
    alert = [];
  for(let i=0; i < reqCss.length; i++){
    if(countInstanceInStr(reqCss[i], css) < 1 ){
      alert.push(reqCss[i]);
    }
  }
  return alert;
}
