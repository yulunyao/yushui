<!--
<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
}
</script>

<style lang="less">
@import '~vux/src/styles/reset.less';

body {
  background-color: #fbf9fe;
}
</style>
-->


<template>
  <div>

    <form style="margin-top: 150px">

      <h1 style="color: grey; text-align: center">雨水平台登录</h1>
      <group style="padding-left: 20px; padding-right: 20px">
        <x-input title="用户名" v-model="username" placeholder="请输入用户名" required></x-input>
        <x-input title="密码" v-model="password" placeholder="请输入密码" type="password" required></x-input>
      </group>

      <group style="padding-left: 20px; padding-right: 20px">
        <x-button type="primary" action-type="button" @click.native="isValid">登录</x-button>
      </group>

      <div v-transfer-dom>
        <popup v-model="show10" position="top" :show-mask="true">
          <div class="position-vertical-demo">
            账号或密码错误，请重新输入。
          </div>
        </popup>
      </div>

    </form>
  </div>
</template>

<script>
  import CircularJSON from 'circular-json'
  import { XHeader, Actionsheet, TransferDomDirective as TransferDom, ButtonTab, ButtonTabItem, XButton, Masker, Toast, Popup } from 'vux'
  import { GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, XAddress, XTextarea, XSwitch } from 'vux'
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'

  export default {
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Actionsheet,
      ButtonTab,
      ButtonTabItem,
      Group,
      GroupTitle,
      Cell,
      XInput,
      Selector,
      PopupPicker,
      XAddress,
      Datetime,
      XNumber,
      XTextarea,
      XSwitch,
      XButton,
      Masker,
      Toast,
      Popup
    },
    data () {
      return {
        username: '',
        password: '',
        show10: false
      }
    },
    created () {
      this.checkIfLogin()
    },
    methods: {
      isValid: function () {

        let url = deployUrl + 'api/user/login'
        let _this = this

        axios.post(url, {
          username: _this.username,
          password: _this.password
        })
          .then(function (response) {
            console.log(JSON.stringify(response))

            if (response.data.code === 0) {
              let basic = response.data
              let username = basic.data.username
              let token = basic.data.token
              let cusername = basic.data.cusername
              let role = basic.data.role
              /* sessionStorage.setItem('userName', response.data.username)
              sessionStorage.setItem('userToken', response.data.token)
              _this.$store.dispatch('setUser', response.data.username)
              _this.$store.dispatch('setToken', response.data.token)
              _this.$store.commit('UserStatus', sessionStorage.getItem('userName'))
              console.log(_this.$store.state.currentUser)
              console.log(_this.$store.state.isLogin)
              console.log(_this.$store.state.token) */
              localStorage.setItem('username', username)
              localStorage.setItem('token', token)
              localStorage.setItem('cusername', cusername)
              localStorage.setItem('role', role)
              _this.$router.push('/Home')
            } else {
              _this.show10 = true
              setTimeout(() => {
                _this.show10 = false
              }, 2000)
              _this.$router.push('/')
            }
          }).catch(function (error) {
            console.log(error)
          })
      },
      checkIfLogin: function () {
        let token = localStorage.getItem('token')
        if (token) {
          this.$router.push('/Home')
        }
      },
      showS: function () {
        setTimeout(() => {
          this.show10 = false
        }, 1000)
      }
    }
  }
</script>

<style>
  .overwrite-title-demo {
    margin-top: 5px;
  }
  .position-vertical-demo {
    background-color: #ffe26d;
    color: #000;
    text-align: center;
    padding: 15px;
  }
</style>
