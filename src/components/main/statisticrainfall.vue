<template>
  <div>
    <x-header>降雨统计<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
    <group title="请选择需要查找的企业及排口号" label-width="5em">
      <popup-picker :title="title2" :data="list2" v-model="placeholder2" @on-change="onChange2" :placeholder="('请选择')" show-name></popup-picker>
      <popup-picker :title="title3" :data="list3" v-model="placeholder3" @on-change="onChange3" :placeholder="('请选择')" show-name></popup-picker>
    </group>

    <div style="padding:15px;">
      <x-button type="primary" @click.native="getSubmission('defaultValueRef')">提交</x-button>
      <x-button @click.native="allStatisticGraph">查看降雨统计图</x-button>
    </div>

    <!--{{list1}}
    {{list2}}
    <h2>{{placeholder1}}</h2>
    <h2>{{placeholder2}}</h2>
    <h2>ps: {{selected_enterprise}}</h2>
    <h2>port: {{selected_port}}</h2>-->
  </div>
</template>

<script>
  import { XHeader, PopupPicker, Group, Cell, Picker, XButton, XInput, XSwitch, Confirm, TransferDomDirective as TransferDom } from 'vux'
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'
  export default {
    components: {
      XHeader,
      PopupPicker,
      Group,
      Cell,
      Picker,
      XButton,
      XInput,
      XSwitch,
      TransferDom,
      Confirm
    },
    data () {
      return {
        title2: '开始序号',
        title3: '结束序号',
        placeholder2: [],
        placeholder3: [],
        list2: [], // 降雨序号-开始 的变量
        list3: [], // 降雨序号-结束 的变量
        selected_start: '',
        selected_end: '',
        parse_start: localStorage.getItem('statisticrainfall_start'),
        parse_end: localStorage.getItem('statisticrainfall_end'),
        token: localStorage.getItem('token')
      }
    },
    created () {
      this.checkIfLogin()
      this.getRainfallNumListStart()
      this.getRainfallNumListEnd()
    },
    methods: {
      getRainfallNumListStart () {
        let url = deployUrl + 'api/rain/tree'
        let _this = this
        axios.get(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _this.token
          }
        })
          .then(function (response) {
            let retrievedData = response.data
            let newlist = []
            for (let i = 0; i < retrievedData.data.length; i++) {
              newlist.push({name: retrievedData.data[i].text, value: retrievedData.data[i].value})
            }
            _this.list2.push(newlist)
          })

          .catch(function (error) {
            _this.$vux.toast.show({
              text: '当前网络环境差',
              type: 'text',
              position: 'bottom'
            })
          })
      },
      getRainfallNumListEnd () {
        let url = deployUrl + 'api/rain/tree'
        let _this = this
        axios.get(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _this.token
          }
        })
          .then(function (response) {
            let retrievedData = response.data
            let newlist = []
            for (let i = 0; i < retrievedData.data.length; i++) {
              newlist.push({name: retrievedData.data[i].text, value: retrievedData.data[i].value})
            }
            _this.list3.push(newlist)
          })

          .catch(function (error) {
            _this.$vux.toast.show({
              text: '当前网络环境差',
              type: 'text',
              position: 'bottom'
            })
          })
      },
      onChange2 (val) {
        this.selected_start = val
        localStorage.setItem('statisticrainfall_start', val)
      },
      onChange3 (val) {
        this.selected_end = val
        localStorage.setItem('statisticrainfall_end', val)
      },
      getSubmission () {
        if (this.selected_port == '') {
          this.$vux.toast.show({
            text: '请填写所有内容',
            type: 'warn',
            position: 'center'
          })
          let send_result = '' // send_result格式 { "password": string, "portId": int, "psId": int }
        } else {
          let _this = this
          let url = deployUrl + 'api/StatisticRainfall/getall'
          axios.post(url, {
            data: {
              psId: localStorage.getItem('Home_Enterprise_Select'),
              startNum: this.parse_start,
              endNum: this.parse_end
            }
          })
            .then(function (response) {
              if (response.data.code === 0) { // 如果返回的状态码为0，则弹出对话框
                _this.$router.push('/statisticrainfall/statisticrainfall_result')
              }
            })
        }
      },
      getUserLogOut () {
        localStorage.clear()
        this.$router.push('/')
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
      allStatisticGraph: function () {
        this.$router.push('/statisticrainfall/graph')
      }
    }
  }
</script>

<style scoped>

</style>
