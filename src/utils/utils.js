export function isPC() {
  return !/iPhone|Android|iPad/i.test(navigator.userAgent);
}
// export function _debounce(fn, delay) {
//   let timer;
//   return () => {};
// }
export function timeToString(param) {
  param = parseInt(param);
  let mm = "",
    ss = "";
  if (param >= 0 && param < 60) {
    param < 10 ? (ss = "0" + param) : (ss = param);
    return "00:" + ss;
  } else if (param >= 60 && param < 3600) {
    mm = parseInt(param / 60);
    mm < 10 ? (mm = "0" + mm) : mm;
    param - parseInt(mm * 60) < 10
      ? (ss = "0" + String(param - parseInt(mm * 60)))
      : (ss = param - parseInt(mm * 60));
    return mm + ":" + ss;
  }
}
