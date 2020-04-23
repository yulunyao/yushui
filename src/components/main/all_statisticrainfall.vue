<template>
  <div>
    <x-header>降雨统计图<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
    <group title="请选择需要查找的企业及污染物因子" label-width="5em">
      <popup-picker :title="title2" :data="list2" v-model="placeholder2" @on-change="onChange2" :placeholder="('请选择')" show-name></popup-picker>
    </group>

    <div style="padding:15px;">
      <x-button id="button_content" type="primary" @click.native="getSubmission()">提交</x-button>
    </div>
  </div>

</template>

<script>
  import { XHeader, Group, PopupPicker, XButton, VChart, VLine, VArea, VTooltip, VLegend, VBar, XInput, Picker } from 'vux'
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'
  export default {
    data () {
      return {
        data: [],
        title2: '因子名称',
        list2: [],
        placeholder2: [],
        selected_factor: '',
        token: localStorage.getItem('token')
      }
    },
    components: {
      XHeader,
      Group,
      PopupPicker,
      XButton,
      VChart,
      VLine,
      VArea,
      VTooltip,
      VLegend,
      VBar,
      XInput,
      Picker
    },
    created () {
      this.checkIfLogin()
      this.getTableInfoFactor()
    },
    methods: {
      getTableInfoFactor () {
        this.list2 = [[{name: '实时值', value: 'rtd'}, {name: '累计值', value: 'cou'}, {name: 'COD浓度', value: 'cod'}, {name: 'COD累计值', value: 'codCou'}, {name: '氨氮', value: 'andan'}, {name: '氨氮累计值', value: 'andanCou'}, {name: 'pH', value: 'ph'}]]
      },
      getUserLogOut () {
        localStorage.clear()
        this.$router.push('/')
      },
      onChange2 (val) {
        this.selected_factor = val
        // 把因子存到localStorage中调用
      },
      getSubmission () {
        if (this.selected_factor === '') {
          this.$vux.toast.show({
            text: '请填写所有内容',
            type: 'warn',
            position: 'center'
          })
        } else {
          localStorage.setItem('graph_factor', this.selected_factor)
          this.$router.push('/all_statisticrainfall/result')
        }
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
