import '../store/getters'

export const userStatus = (state, user) => {
  if (user) {
    state.currentUser = user
    state.isLogin = true
  } else if (user == null) {
    sessionStorage.setItem('UserName', null)
    sessionStorage.setItem('UserToken', '')

    state.currentUser = null
    state.isLogin = false
    state.token = ''
  }
}
