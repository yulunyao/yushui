<template>
  <div>
    <x-header>降雨日数据<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
    <group :title="headTitle">

      <datetime
        v-model="startTime"
        @on-change="onChange2"
        :title="startTitle"
        :placeholder="('请选择')" show-name>
      </datetime>

      <datetime
        v-model="endTime"
        @on-change="onChange3"
        :title="endTitle"
        :placeholder="('请选择')" show-name>
      </datetime>

      <popup-picker :title="portTitle" :data="portOption" v-model="placeholder4" @on-change="portTrigger" :placeholder="('请选择')" show-name></popup-picker>
    </group>

    <div style="padding:15px;">
      <x-button type="primary" @click.native="getSubmission('defaultValueRef')">提交</x-button>
    </div>
  </div>

</template>

<script>
  import { Datetime, XHeader, PopupPicker, Group, Cell, Picker, XButton, XInput, XSwitch, Confirm, TransferDomDirective as TransferDom } from 'vux'
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'
  export default {
    components: {
      Datetime,
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
        startTime: '',
        endTime: '',
        headTitle: '请选择需要查看的日期跨度',
        startTitle: '开始时间',
        endTitle: '结束时间',

        portTitle: '排口号',
        portOption: [],
        newlist2: [],
        placeholder2: [],
        placeholder3: [],
        placeholder4: [],
        list2: [], // 降雨序号-开始 的变量
        list3: [], // 降雨序号-结束 的变量
        selected_port: '',
        selected_enterprise: localStorage.getItem('Home_Enterprise_Select'), // 选中的企业名称，默认为 请选择
        selected_start: '',
        selected_end: '',
        parseList: '', // 传到下一个页面的list
        token: localStorage.getItem('token')
      }
    },
    created () {
      this.checkIfLogin(),
      this.yearGenerator(),
      this.getTableInfoPc()
    },
    methods: {
      yearGenerator () {
        // 生成2000 - 2100的年份
        let newlist = []
        for (let i = 2000; i < 2100; i++) {
          newlist.push({name: '' + i + '', value: '' + i + ''})
        }
        this.list2.push(newlist)
        this.list3.push(newlist)

        // 获得当前年份的时间，使得开始年份根据当前年份自动调整
        let currentYear = new Date().getFullYear()
        let currentMonth = new Date().getMonth()
        let currentDay = new Date().getDay()
        let finalDate = '' + currentYear + '-' + currentMonth + '-' + currentDay
        this.placeholder2.push(finalDate)
        localStorage.setItem('statisticyear_start', finalDate)

        this.placeholder3.push(finalDate)
        localStorage.setItem('statisticyear_end', finalDate)
      },
      onChange2 (val) {
        this.selected_start = val[0]
        localStorage.setItem('statisticyear_start', val)
      },
      onChange3 (val) {
        this.selected_end = val[0]
        localStorage.setItem('statisticyear_end', val)
      },
      portTrigger (val) {
        this.selected_port = val[0]
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
          localStorage.setItem('port', _this.placeholder4)
          let url = deployUrl + 'api/day/query/' + _this.startTime + '/' + _this.endTime + _this.selected_enterprise + '/' + _this.placeholder4
          axios.get(url, {
  
          })
            .then(function (response) {
              if (response.data.code === 0) { // 如果返回的状态码为0，则弹出对话框
                _this.$router.push('/daydata/daydata_result')
              }
            })
        }
      },
      getTableInfoPc () {
        let _this = this
        let url2 = deployUrl + 'api/enterprise/porttree/' + this.selected_enterprise
        axios.get(url2, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _this.token
          }
        })
          .then(function (response) {
            let retrievedData = response.data
            // alert(JSON.stringify(retrievedData.data))
            for (let i = 0; i < retrievedData.data.length; i++) {
              _this.newlist2.push({name: retrievedData.data[i].text, value: retrievedData.data[i].id})
            }
            _this.portOption.push(_this.newlist2)
          })
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
      }
    }
  }
</script>

<style scoped>

</style>
