/**
 * Created by fsj on 2017/3/8.
 */
import LoadingComponent from '../components/Loading.vue';

export default {
    install: function(Vue) {
        Vue.component('loading', LoadingComponent);
    }
}
