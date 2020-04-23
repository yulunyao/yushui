import vuex from 'vuex'
import Vue from 'vue'
Vue.use(vuex)
export default new vuex.Store({
  /* state必须 */
  state: {
    currentUser: null,
    isLogin: false,
    token: ''
  },
  mutations: {
    setUser (state, v) {
      state.user = v
    }
  }
})
