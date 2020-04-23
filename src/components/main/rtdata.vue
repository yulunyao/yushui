<template>
  <div>
    <div>
      <x-header>实时数据查询<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
      <group title="请选择需要查找的企业" label-width="5em">
        <x-input title="模糊查找" placeholder="（可选项）" placeholder-align="right" text-align="right" v-model="unclearSearch" v-on:input="searchChange"></x-input>
        <picker :title="title1" :data="list1" v-model="placeholder" @on-change="onChange" :placeholder="('请选择')"></picker>
      </group>

      <div style="padding:15px;">
        <x-button type="primary" @click.native="getSubmission('defaultValueRef')">提交</x-button>
        <x-button @click.native="allRealTime">所有绑定企业数据</x-button>
      </div>

      <router-view></router-view>
    </div>
  </div>

</template>

<script>
  import { XTable, LoadMore, ToastPlugin, XHeader, Datetime, PopupPicker, Group, Cell, Picker, XButton, Divider, XSwitch, XInput } from 'vux'
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'
  export default {
    data: function () {
      return {
        title1: '企业名称',
        placeholder: [],
        list1: [],
        table_data: '',
        selected_value: '', // 选中的企业名称，默认为 请选择
        unclearSearch: '',
        list2: []
      }
    },
    components: {
      XTable,
      LoadMore,
      PopupPicker,
      Group,
      Picker,
      XButton,
      Divider,
      Cell,
      XSwitch,
      Datetime,
      XHeader,
      ToastPlugin,
      XInput
    },
    created () {
      this.checkIfLogin()
      this.getTableInfo()
    },
    methods: {
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
              newlist.push(basic.data[i].text)
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
        localStorage.setItem('rtdata', val)
      },
      getSubmission () {
        if (this.selected_value === '') {
          this.$vux.toast.show({
            text: '请填写所有内容',
            type: 'warn',
            position: 'center'
          })
        } else {
          this.$router.push('/rtdata_result')
        }
      },
      getUserLogOut () {
        localStorage.clear()
        this.$router.push('/')
      },
      allRealTime () {
        localStorage.setItem('all_realtime', localStorage.getItem('token'))
        this.$router.push('/all_realtime')
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
              let retrievedData = basic.data[i].text
              if (retrievedData.search(unclearWords) !== -1) {
                newlist.push(retrievedData)
              }
            }
            _this.list1.push(newlist)
            console.log(_this.list1)
          }).catch(function (error) {
            _this.$vux.toast.show({
              text: '当前网络环境差',
              type: 'text',
              position: 'bottom'
            })
          })
      }
    }
  }
</script>

<style scoped>

</style>
