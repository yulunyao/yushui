<template>
  <div style="padding-bottom: 50px">
    <img src="../../assets/logo.png" style="width: 100%">
    <van-notice-bar
      :text='currentBind'
      left-icon="//img.yzcdn.cn/vant/volume.png"
    />
    <div v-transfer-dom>
      <x-dialog v-model="showToast" class="dialog-demo">
        <group title="请选择需要查找的企业" label-width="5em">
          <x-input title="模糊查找" placeholder="（可选项）" placeholder-align="right" text-align="right" v-model="unclearSearch" v-on:input="searchChange"></x-input>
          <picker :title="title1" :data="list1" v-model="placeholder" @on-change="onChange" :placeholder="('请选择')" show-name></picker>
        </group>

        <div style="padding:15px;">
          <x-button type="primary" @click.native="getSubmission('defaultValueRef')">绑定此企业</x-button>
        </div>
        <x-button @click.native="showToast = false">关闭</x-button>
      </x-dialog>
    </div>

    <!-- 主要菜单 -->
    <card :header="{title: '业务功能'}">
      <div slot="content" class="card-demo-flex card-demo-content01">
        <grid :cols="3" :show-lr-borders="false">
          <grid-item :label="item.label" @click.native=checkIfEnterprise_feature(item.link) v-for="item in list" :key="item.label">
            <img slot="icon" :src="item.img">
          </grid-item>
        </grid>
      </div>
    </card>

    <!-- 系统设置（包括绑定企业等）-->
    <card :header="{title: '系统设置'}">
      <div slot="content" class="card-demo-flex card-demo-content01">
        <grid :cols="3" :show-lr-borders="false">
          <grid-item :label="item.label" @click.native="trigger(item.action)" v-for="item in settingsList" :key="item.label">
            <img slot="icon" :src="item.img">
          </grid-item>
        </grid>
      </div>
    </card>

    <tabbar style="position: fixed">
      <tabbar-item @click.native="getUserLogOut">
        <span slot="label">点击注销当前用户: {{login_user}}</span>
      </tabbar-item>
    </tabbar>

    <div v-transfer-dom>
      <confirm v-model="show"
               :title="alright"
               @on-cancel="onCancel"
               @on-confirm="onConfirm">
        <p style="text-align:center;">是否退出当前用户</p>
      </confirm>
    </div>

  </div>
</template>

<script>
  import { Grid, GridItem, Tabbar, TabbarItem, Group, Cell, Confirm, TransferDomDirective as TransferDom, XSwitch, Toast, XDialog, XButton, XInput, Picker, Divider, Card, PopupPicker, GroupTitle } from 'vux'
  import { deployUrl } from '../domain/domain.js'
  import axios from 'axios'
  import { NoticeBar, Notify } from 'vant'
  import 'vant/lib/index.css'

  export default {
    data: function () {
      return {
        list: [], // 如果要做权限控制，在list中添加permission: true / false
        settingsList: [],
        list1: [],
        title1: '企业名称',
        placeholder: [],
        login_user: '',
        alright: '提示',
        show: false,
        showToast: false,
        toastTitle: '标题',
        unclearSearch: '',
        selected_value: '',
        currentBind: ''
      }
    },
    created () {
      this.getUser()
      this.checkIfLogin()
      this.menuByUser()
      this.settingsByUser()
      this.getTableInfo()
      this.checkIfEnterprise()
      // 综合看板：在线企业
    },
    methods: {
      /* 进入Home的时候检查是否绑定企业，如果没有绑定则弹出绑定企业框 */
      checkIfEnterprise () {
        // 需要添加的：检查企业ID是否有效，如果企业ID失效则需要重新选择
        if (!(localStorage.getItem('Home_Enterprise_Select'))) {
          this.showToast = true
          this.currentBind = '当前还没有绑定企业，业务功能将无法使用，请先点击【企业绑定】绑定企业。'
        } else {
          let url = deployUrl + 'api/enterprise/get/' + localStorage.getItem('Home_Enterprise_Select')
          let _this = this
          let idToName = ''
          axios.get(url, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
          })
            .then(function (response) {
              let retrievedData = response.data
              idToName = retrievedData.data.name
              _this.currentBind = '当前已绑定 - ' + idToName
            })
        }
      },
      checkIfEnterprise_feature (link) {
        if (!(localStorage.getItem('Home_Enterprise_Select'))) {
          Notify('请绑定企业')
        } else {
          this.$router.push(link)
        }
      },
      /* 触发系统设置 */
      trigger (msg) {
        /* 字符串转命令 */
        eval(msg)
      },
      getTableInfo () {
        let url = deployUrl + 'api/enterprise/tree'
        let _this = this
        let token = localStorage.getItem('token')
        axios.get(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
          .then(function (response) {
            let basic = response.data

            let newlist = []
            for (let i = 0; i < basic.data.length; i++) {
              newlist.push({name: basic.data[i].text, value: basic.data[i].id})
            }
            _this.list1.push(newlist)
          }).catch(function (error) {
            _this.$vux.toast.show({
              text: '当前网络环境差',
              type: 'text',
              position: 'bottom'
            })
          })
      },
      getUser () {
        this.login_user = localStorage.getItem('cusername')
      },
      getUserLogOut () {
        this.show = true
      },
      checkIfLogin: function () {
        let url = deployUrl + 'api/user/info'
        let token = localStorage.getItem('token')
        let _this = this
        axios.get(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
          .then(function (response) {
            if (response) {
              if (response.data.code === 0) {

              } else {
                localStorage.clear()
                _this.$router.push('/')
              }
            } else {
              // 如果没接收到回应的处理
            }
          })
          .catch(function (response) {
            alert(JSON.stringify(response))
          })
      },
      searchChange: function () {
        let url = deployUrl + 'api/enterprise/tree'
        let _this = this
        let token = localStorage.getItem('token')
        let unclearWords = this.unclearSearch
        this.list1 = []
        axios.get(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
          .then(function (response) {
            let basic = response.data

            let newlist = []
            for (let i = 0; i < basic.data.length; i++) {
              /* newlist.push(basic.data[i].text) */
              let retrievedData = basic.data[i]
              if (retrievedData.text.search(unclearWords) !== -1) {
                newlist.push({name: retrievedData.text, value: retrievedData.id})
              }
            }
            _this.list1.push(newlist)
          }).catch(function (error) {
            _this.$vux.toast.show({
              text: '当前网络环境差',
              type: 'text',
              position: 'bottom'
            })
          })
      },
      onChange (val) {
        this.selected_value = val
        localStorage.setItem('corpinfo', val)
      },
      onConfirm () {
        localStorage.clear()
        this.$router.push('/')
      },
      onCancel () {},
      getSubmission () {
        if (this.selected_value === '') {
          this.$vux.toast.show({
            text: '请填写所有内容',
            type: 'warn',
            position: 'center'
          })
        } else {
          localStorage.setItem('Home_Enterprise_Select', this.selected_value)
          this.showToast = false
          this.checkIfEnterprise()
        }
      },
      settingsByUser () {
        let role = localStorage.getItem('cusername')
        let settingsContainer = [{
          'label': '企业绑定',
          'action': 'this.showToast = true',
          'img': '../../src/assets/settings_icon/corp_binding.png',
          'permission': ['管理员']
        }]
        for (let i = 0; i < settingsContainer.length; i++) {
          for (let j = 0; j < settingsContainer[i].permission.length; j++) {
            if (role === settingsContainer[i].permission[j]) {
              this.settingsList.push(settingsContainer[i])
            }
          }
        }
      },
      menuByUser () {
        let role = localStorage.getItem('cusername')
        let menuContainer = [{
          'label': '企业信息管理',
          'link': '/corpinfo_result',
          'img': '../../src/assets/home_icon/corpinfo.png',
          'permission': ['企业用户', '管理员']
        }, {
          'label': '实时数据',
          'link': '/rtdata_result',
          'img': '../../src/assets/home_icon/realtime.png',
          'permission': ['企业用户', '管理员']
        },
        {
          'label': '小时数据',
          'link': '/hourdata',
          'img': '../../src/assets/home_icon/realtime.png',
          'permission': ['企业用户', '管理员']
        },
        {
          'label': '日数据',
          'link': '/daydata',
          'img': '../../src/assets/home_icon/realtime.png',
          'permission': ['企业用户', '管理员']
        }
        ]

        // [{
        //   'label': '综合看板',
        //   'link': '/condition_summary',
        //   'img': '../../src/assets/home_icon/graph.png',
        //   'permission': ['管理员']
        // }, {
        //   'label': '企业信息管理',
        //   'link': '/corpinfo_result',
        //   'img': '../../src/assets/home_icon/corpinfo.png',
        //   'permission': ['企业用户', '管理员']
        // }, {
        //   'label': '实时数据',
        //   'link': '/rtdata_result',
        //   'img': '../../src/assets/home_icon/realtime.png',
        //   'permission': ['企业用户', '管理员']
        // }, {
        //   'label': '降雨数据',
        //   'link': '/rainfalldata',
        //   'img': '../../src/assets/home_icon/realtime.png',
        //   'permission': ['企业用户', '管理员']
        // }, {
        //   'label': '降雨统计',
        //   'link': '/statisticrainfall',
        //   'img': '../../src/assets/home_icon/realtime.png',
        //   'permission': ['企业用户', '管理员']
        // }, {
        //   'label': '降雨年报表',
        //   'link': '/statisticyear',
        //   'img': '../../src/assets/home_icon/realtime.png',
        //   'permission': ['企业用户', '管理员']
        // }, {
        //   'label': '阀门控制',
        //   'link': '/valvectrl',
        //   'img': '../../src/assets/home_icon/switchctrl.png',
        //   'permission': ['管理员']
        // }, {
        //   'label': '远程反控采样',
        //   'link': '/samplectrl',
        //   'img': '../../src/assets/home_icon/remotectrl.png',
        //   'permission': ['管理员']
        // }, {
        //   'label': '门禁控制',
        //   'link': '/entryctrl',
        //   'img': '../../src/assets/home_icon/entryctrl.png',
        //   'permission': ['管理员']
        // }]
        for (let i = 0; i < menuContainer.length; i++) {
          for (let j = 0; j < menuContainer[i].permission.length; j++) {
            if (role === menuContainer[i].permission[j]) {
              this.list.push(menuContainer[i])
            }
          }
        }
      }
    },
    components: {
      Grid,
      GridItem,
      Tabbar,
      TabbarItem,
      Group,
      Cell,
      Confirm,
      XSwitch,
      Toast,
      XDialog,
      XButton,
      XInput,
      Picker,
      Divider,
      Card,
      NoticeBar,
      Notify,
      PopupPicker,
      GroupTitle
    },
    directives: {
      TransferDom
    }
  }
</script>

<style>
  .scroller-content {
    z-index: 3
  }
  .van-notice-bar {
    margin-bottom: 7px;
  }
</style>
