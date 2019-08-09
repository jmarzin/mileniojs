import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
      admin: ""
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
