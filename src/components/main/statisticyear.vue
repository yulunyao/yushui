<template>
  <div>
    <x-header>降雨年报表<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
    <group title="请选择需要查找的企业及排口号" label-width="5em">
      <popup-picker :title="title2" :data="list2" v-model="placeholder2" @on-change="onChange2" :placeholder="('请选择')" show-name></popup-picker>
      <popup-picker :title="title3" :data="list3" v-model="placeholder3" @on-change="onChange3" :placeholder="('请选择')" show-name></popup-picker>
    </group>

    <div style="padding:15px;">
      <x-button type="primary" @click.native="getSubmission('defaultValueRef')">提交</x-button>
    </div>
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
        title2: '开始时间',
        title3: '结束时间',
        placeholder2: [],
        placeholder3: [],
        list2: [], // 降雨序号-开始 的变量
        list3: [], // 降雨序号-结束 的变量
        selected_enterprise: '', // 选中的企业名称，默认为 请选择
        selected_start: '',
        selected_end: '',
        parseList: '', // 传到下一个页面的list
        token: localStorage.getItem('token'),
      }
    },
    created () {
      this.checkIfLogin()
      this.yearGenerator()
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
        this.placeholder2.push('' + currentYear + '')
        localStorage.setItem('statisticyear_start', currentYear)

        this.placeholder3.push('' + currentYear + '')
        localStorage.setItem('statisticyear_end', currentYear)
      },
      onChange2 (val) {
        this.selected_start = val[0]
        localStorage.setItem('statisticyear_start', val)
      },
      onChange3 (val) {
        this.selected_end = val[0]
        localStorage.setItem('statisticyear_end', val)
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
          let url = deployUrl + 'api/statisticyear/getall'
          axios.post(url, {
            data: {
              psId: this.selected_enterprise,
              startNum: this.selected_start,
              endNum: this.selected_end
            }
          })
            .then(function (response) {
              if (response.data.code === 0) { // 如果返回的状态码为0，则弹出对话框
                _this.$router.push('/statisticyear/statisticyear_result')
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
      }
    }
  }
</script>

<style scoped>

</style>
