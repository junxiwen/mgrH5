/**
 * Created by fsj on 2017/6/6.
 */

export default {
    /**
     * 获取url传过来的参数
     * @param name 参数名称
     * @param url URL地址
     * @param return
     */
    getQueryParam: function (name, url) {
        //URL GET 获取值
        var reg = new RegExp("(^|\\?|&)" + name + "=([^&]*)(\\s|&|$)", "i"),
            Url = url || location.href;
        if (reg.test(Url))
            return decodeURI(RegExp.$2.replace(/\+/g, " "));
        return "";

    },
    /**
     * 日期转字符串
     * @param date
     * @returns {string}
     */
    dateToStr: function (date) {
        let oDate = new Date();
        if (date) {
            oDate.setTime(date);
        }
        let y = oDate.getFullYear();
        let m = oDate.getMonth() + 1;
        m = m < 10 ? '0' + m : m;
        let d = oDate.getDate();
        d = d < 10 ? '0' + d : d;

        return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d);
    },
    /**
     * 日期时间转字符串
     * @param datetime
     * @returns {string}
     */
    datetimeToStr: function (datetime) {
        let oDate = new Date();
        if (datetime) {
            oDate.setTime(datetime);
        }
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

        return y + '-' + m + '-' + d + ' ' + h + ':' + mm + ':' + s;
    },
    /**
     * 增加天数，时分秒都为0
     * @param days 需要增加的天数，负数是减少天数
     * @param odate 源日期，默认是当前日期
     * @returns {Date}
     */
    dayAdd: function (days, odate) {
        odate = odate || new Date();
        odate.setHours(0);
        odate.setMinutes(0);
        odate.setSeconds(0);
        return new Date(odate.getTime() + days * 24 * 60 * 60 * 1000);
    },
    /**
     * 增加天数，时分秒保持原来的
     * @param days 需要增加的天数，负数是减少天数
     * @param odate 源日期，默认是当前日期
     * @returns {Date}
     */
    dayAdd2: function (days, odate) {
        odate = odate || new Date();
        return new Date(odate.getTime() + days * 24 * 60 * 60 * 1000);
    },
    /**
     * 增加小时数
     * @param hours 需要增加的小时数，负数是减少小时数
     * @param otime 源时间，默认是当前时间
     * @returns {Date}
     */
    hourAdd: function (hours, otime) {
        otime = otime || new Date();
        return new Date(otime.getTime() + hours * 60 * 60 * 1000);
    }
};

