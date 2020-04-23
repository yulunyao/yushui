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


<!--<template>
  <div>
    <x-header :left-options="{showBack: false}">平台登录</x-header>
    <br>

    <form>

      <group style="margin-top: 150px; padding: 20px">
        <x-input title="用户名" v-model="username" placeholder="请输入用户名" required></x-input>
        <x-input title="密码" v-model="password" placeholder="请输入密码" type="password" required></x-input>
      </group>

      <router-link to='/HelloWorld'>
        <x-button type="primary" action-type="button" @click.native="isValid">登录</x-button>
      </router-link>

    </form>
  </div>
</template>

<script>
  import { XHeader, Actionsheet, TransferDom, ButtonTab, ButtonTabItem, XButton } from 'vux'
  import { GroupTitle, Group, Cell, XInput, Selector, PopupPicker, Datetime, XNumber, ChinaAddressData, XAddress, XTextarea, XSwitch } from 'vux'
  import axios from 'axios'

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
      XButton
    },
    data () {
      return {
        menus: {
          username: '',
          password: ''
        },
        showMenus: false
      }
    },
    methods: {
      isValid: function () {

        let url = 'http://192.168.1.119:8080/api/user/login'
        let _this = this

        axios.post(url, {
          username: _this.username,
          password: _this.password
        })
          .then(function (response) {
            alert(JSON.stringify(response))
          })
      }
    }
  }
</script>

<style>
  .overwrite-title-demo {
    margin-top: 5px;
  }
</style>-->
