export const date = (time) => {
  if (time) {
    let oDate = new Date();
    oDate.setTime(time);

    let y = oDate.getFullYear();
    let m = oDate.getMonth() + 1;
    m = m < 10 ? '0' + m : m;
    let d = oDate.getDate();
    d = d < 10 ? '0' + d : d;

    return `${y}-${m}-${d}`;
  }
};

