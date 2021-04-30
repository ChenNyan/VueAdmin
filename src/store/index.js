import Vue from 'vue'
import Vuex from 'vuex'
import {use} from "element-ui";
import persistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    userInfo:{}
  },
  mutations: {
    changeUserinfo(state,userInfo){
      state.userInfo = userInfo
    }
  },
  actions: {
  },
  modules: {
  },
  plugins: [persistedState()]
})
