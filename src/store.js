import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
      admin: '51julie2'
  },
  mutations: {
    change(state, p) {
      state.admin = p
    }
  }
  ,
  actions: {

  }
})
