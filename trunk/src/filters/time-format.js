export const normalTime = (time) => {
  if (time) {
    let oDate = new Date();
    oDate.setTime(time);

    let y = oDate.getFullYear();
    let m = oDate.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = oDate.getDate();
    d = d < 10 ? '0' + d : d;

    let h = oDate.getHours();
    h = h < 10 ? '0' + h : h;
    let mm = oDate.getMinutes();
    mm = mm < 10 ? '0' + mm : mm;
    let s = oDate.getSeconds();
    s = s < 10 ? '0' + s : s;

    //return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d) + ' ' + h + ':' + mm + ':' + s;
    return `${y}-${m}-${d} ${h}:${mm}:${s}`;
  }
};

