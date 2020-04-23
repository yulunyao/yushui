<template>
  <div>
    <x-header>降雨数据<a slot="right" @click="getUserLogOut">注销用户</a></x-header>

    <group title="请选择需要查找的企业及降雨序号" label-width="5em">
      <popup-picker :title="title2" :data="list2" v-model="placeholder2" @on-change="onChange2" :placeholder="('请选择')" show-name></popup-picker>
    </group>

    <div style="padding:15px;">
      <x-button type="primary" @click.native="getSubmission('defaultValueRef')">提交</x-button>
    </div>
  </div>
</template>

<script>
  import { XHeader, PopupPicker, Group, Cell, Picker, XButton, XInput, Tab, TabItem } from 'vux'
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'
  export default {
    data () {
      return {
        title2: '降雨序号',
        list2: [], // 降雨序号的变量
        placeholder2: [],
        selected_enterprise: '',
        selected_num: '',
        parse_num: localStorage.getItem('rainfall_num'),
        parseList: '',
        token: localStorage.getItem('token')
      }
    },
    components: {
      XHeader,
      PopupPicker,
      Group,
      Cell,
      Picker,
      XButton,
      XInput,
      Tab,
      TabItem
    },
    created () {
      this.checkIfLogin()
      this.getRainfallNumList()
    },
    methods: {
      getRainfallNumList () {
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
      getSubmission () {
        if (this.selected_num === '') {
          this.$vux.toast.show({
            text: '请填写所有内容',
            type: 'warn',
            position: 'center'
          })
        } else {
          localStorage.setItem('rainfalldata_num', this.parse_num)
          this.$router.push('/rainfalldata/rainfalldata_result')
        }
      },
      onChange2 (val) {
        this.selected_num = val
        localStorage.setItem('rainfall_num', val)
        /* 每次选择企业发生变化后，初始化排口list和暂时排口list的值 */
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
      onItemClick (index) {}
    }
  }
</script>

<style scoped>

</style>
