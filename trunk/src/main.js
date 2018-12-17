// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import App from './App'
import router from './router'
import store from './store'
import SHA256 from 'crypto-js/sha256'
import axios from 'axios'
import qs from 'qs'
import filters from './filters'
import ImgSrc from './plugins/img_src'
import VueAMap from 'vue-amap';
import { lazyAMapApiLoaderInstance } from 'vue-amap';
// import BaiduMap from 'vue-baidu-map'
// import {BmlMarkerClusterer} from 'vue-baidu-map'
// Vue.component('bml-marker-cluster', BmlMarkerClusterer)
Vue.use(ElementUI)
Vue.use(ImgSrc)
Vue.use(VueAMap)
//百度地图
// Vue.use(BaiduMap, {
//     // ak 是在百度地图开发者平台申请的密钥 详见 http://lbsyun.baidu.com/apiconsole/key */
//     ak: 'HMtKUMkMwOUISSSVwoDhy2irHyPus6Y6'
// })

//注册自定义过滤器
Object.keys(filters).forEach(key => Vue.filter(key, filters[key]));

// 是否展示生产过程中的提示
Vue.config.productionTip = false


//axios的一些公共配置和拦截器，比如发送请求显示loading，请求回来loading消失之类的
axios.interceptors.request.use((conf) => {

  let accessToken = window.sessionStorage.getItem('zthMgrAccessToken') || '';
  let userId = window.sessionStorage.getItem('zthMgrUserId') || '';

  conf.auth = {
    username: 'qqlg-client-1',
    password: 'qqlg-client-1' + accessToken
  };
  conf.timeout = 10000;

  let timestamp = new Date().getTime();
  if (conf.method === 'get' || conf.method === 'delete') {
    if (!conf.params) {
      conf.params = {};
    }
    conf.params.timestamp = timestamp;
    conf.params.accessUserId = userId;
    conf.params.mdtoken = SHA256(accessToken + userId + timestamp + 'xyz!*#123').toString();
  } else {
    if (!conf.data) {
      conf.data = {};
    }
    conf.data.timestamp = timestamp;
    conf.data.accessUserId = userId;
    conf.data.mdtoken = SHA256(accessToken + userId + timestamp + 'xyz!*#123').toString();

    //TODO 上传文件需要特殊处理
    conf.data = qs.stringify(conf.data);
  }

  return conf;
}, (error) => {
  rootVm.$message.error('请求失败');
  return Promise.reject(error);
});
//高德地图
VueAMap.initAMapApiLoader({
  key: 'cec6aeebeb3a4cb85ee09aa0c1f525c4',
  plugin: ['AMap.Geolocation', 'AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor','Geocoder'],
});
lazyAMapApiLoaderInstance.load().then(() => {
  // your code ...
  this.map = new AMap.Map('amapContainer', {
    center: new AMap.LngLat(121.59996, 31.197646)
  });
});


axios.interceptors.response.use((res) => {
  // private static final int SUCCESS = 0;
  // private static final int ERROR = 1;
  // private static final int FAIL = 2;
  // private static final int NO_LOGIN = 3;
  // private static final int NO_PERMISSION = 4;

  if (res.data.code == 0) {
    return res;
  } else if (res.data.code == 1) {
    rootVm.$message.error('请求错误1');
  } else if (res.data.code == 2) {
    rootVm.$message.error(res.data.message);
  } else if (res.data.code == 3) {
    router.push('/login');
  } else if (res.data.code == 4) {
    rootVm.$message.error('没有权限');
  } else {
    rootVm.$message.error('未知错误');
  }
  return Promise.reject(res);
}, (error) => {
  rootVm.$message.error('响应失败');
  return Promise.reject(error);
});

Vue.prototype.$http = axios;

let rootVm = new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})

if (isDebug) {
  console.log(rootVm);
  console.log('uriBase=' + uriBase, 'cdnBase=' + cdnBase);
}
