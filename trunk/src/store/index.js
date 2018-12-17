/**
 * Created by fsj on 2017/5/24.
 */
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    menu: true
  },
  getters: {

    menu: state => {
      return state.menu;
    }
  },
  mutations: {
    showMenu: state => {
      state.menu = true;
    },
    hideMenu: state => {
      state.menu = false;
    }
  },
  actions: {
    showMenu: ({commit}) => {
      commit("showMenu");
    },
    hideMenu: ({commit}) => {
      commit("hideMenu");
    }
  }
});
