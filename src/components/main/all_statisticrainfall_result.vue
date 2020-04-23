<template>
  <div>
    <x-header>降雨统计图<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
    <group title="请选择需要查看的降雨区间" label-width="5em">
      <popup-picker :title="title1" :data="list1" v-model="placeholder1" @on-change="onChange1" :placeholder="('请选择')" ></popup-picker>
      <popup-picker :title="title2" :data="list2" v-model="placeholder2" @on-change="onChange2" :placeholder="('请选择')" ></popup-picker>
    </group>
    <v-chart
      ref="demo"
      :data="dataList">
      <v-scale x field="降雨序号" />
      <v-scale y field="值" />
      <v-bar series-field="name" :adjust="{
        type: 'dodge',
        marginRatio: 0.05, // 设置分组间柱子的间距
      }" />
      <v-tooltip show-value-in-legend />
    </v-chart>

    <div v-transfer-dom>
      <alert v-model="show" :title="showTitle" @on-show="onShow" @on-hide="onHide"> {{ showMsg }}</alert>
    </div>

    <div v-transfer-dom>
      <alert v-model="show1" :title="showTitle1" @on-show="onShow1" @on-hide="onHide1"> {{ showMsg1 }}</alert>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'
  import { XHeader, Group, PopupPicker, Picker, XButton, VChart, VLine, VArea, VTooltip, VLegend, VBar, VScale, AlertModule, Alert, TransferDomDirective as TransferDom } from 'vux'
  export default {
    data () {
      return {
        title1: '开始序号',
        title2: '结束序号',
        list1: [],
        list2: [],
        placeholder1: [],
        placeholder2: [],
        dataList: [],
        stored_factor: localStorage.getItem('graph_factor'),
        codeName: '',
        // 提示查询不到数据
        show: false,
        showTitle: '提示',
        showMsg: '未查询到相关数据',
        // 提示开始序号小于结束序号
        show1: false,
        showTitle1: '提示',
        showMsg1: '开始序号不应大于结束序号, 请重新选择',
        //
        selected_start: '',
        selected_end: ''
      }
    },
    components: {
      XHeader,
      VChart,
      VLine,
      VArea,
      VTooltip,
      VLegend,
      VBar,
      XButton,
      VScale,
      Alert,
      AlertModule,
      Group,
      PopupPicker,
      Picker
    },
    directives: {
      TransferDom
    },
    created () {
      this.checkIfLogin()
      this.generateGraph()
      this.generateForm()
      this.convertToName(this.stored_factor)
    },
    methods: {
      getUserLogOut () {
        localStorage.clear()
        this.$router.push('/')
      },
      generateGraph () {
        let url = deployUrl + 'api/StatisticRainfall/getall'
        let _this = this
        let storedFactor = this.stored_factor
        axios.post(url, {
          data: {
            psId: localStorage.getItem('Home_Enterprise_Select')
          }
        })
          .then(function (response) {
            let newlist = []
            if (response.data.code === 0) {
              let retrievedData = response.data
              if (retrievedData.data.length !== 0) {
                for (let i = 0; i < retrievedData.data.length; i++) {
                  if (retrievedData.data[i][storedFactor]) {
                    newlist.push({name: retrievedData.data[i].num, value: retrievedData.data[i].num})
                    _this.dataList.push({name: '' + _this.codeName + '', '降雨序号': '降雨序号' + retrievedData.data[i].num + '', '值': retrievedData.data[i][storedFactor]})
                  }
                }
                _this.list1.push(newlist)
                _this.list2.push(newlist)
                _this.$refs.demo.rerender()
              } else {
                _this.show = true
              }
            }
          })
      },
      convertToName (factor) {
        let codeToName = [{rtd: '实时值'}, {cou: '累计值'}, {cod: 'COD浓度'}, {codCou: 'COD总量'}, {andan: '氨氮'}, {andanCou: '氨氮累计值'}, {ph: 'pH值'}]
        for (let i = 0; i < codeToName.length; i++) {
          if (codeToName[i]['' + factor + '']) {
            this.codeName = codeToName[i]['' + factor + '']
          }
        }
      },
      generateForm () {},
      onHide () {
        this.$router.go(-1)
      },
      onShow () {
        console.log('on show')
      },
      onShow1 () {},
      onHide1 () {},
      onChange1 (val) {
        this.selected_start = val
        // 如果该选项不为空
        if (this.selected_start != null) {
          if (typeof this.selected_end !== 'string') {
            // 清空dataList的值来准备重新渲染柱状图
            this.dataList = []
            let url = deployUrl + 'api/StatisticRainfall/getall'
            let _this = this
            let storedFactor = this.stored_factor
            axios.post(url, {
              data: {
                psId: localStorage.getItem('graph_enterprise'),
                startNum: _this.selected_start[0],
                endNum: _this.selected_end[0]
              }
            })
              .then(function (response) {
                if (response.data.code === 0) {
                  let retrievedData = response.data
                  if (retrievedData.data.length !== 0) {
                    for (let i = 0; i < retrievedData.data.length; i++) {
                      if (retrievedData.data[i][storedFactor]) {
                        _this.dataList.push({name: '' + _this.codeName + '', '降雨序号': '降雨序号' + retrievedData.data[i].num + '', '值': retrievedData.data[i][storedFactor]})
                      }
                    }
                    _this.$refs.demo.rerender()
                  } else {
                    _this.show1 = true
                  }
                }
              })
          }
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
      },
      onChange2 (val) {
        this.selected_end = val
        // 如果该选项不为空
        if (this.selected_start != null) {
          if (typeof this.selected_start !== 'string') {
            // 清空dataList的值来准备重新渲染柱状图
            this.dataList = []
            let url = deployUrl + 'api/StatisticRainfall/getall'
            let _this = this
            let storedFactor = this.stored_factor
            axios.post(url, {
              data: {
                psId: localStorage.getItem('graph_enterprise'),
                startNum: _this.selected_start[0],
                endNum: _this.selected_end[0]
              }
            })
              .then(function (response) {
                if (response.data.code === 0) {
                  let retrievedData = response.data
                  if (retrievedData.data.length !== 0) {
                    for (let i = 0; i < retrievedData.data.length; i++) {
                      if (retrievedData.data[i][storedFactor]) {
                        _this.dataList.push({name: '' + _this.codeName + '', '降雨序号': '降雨序号' + retrievedData.data[i].num + '', '值': retrievedData.data[i][storedFactor]})
                      }
                    }
                    _this.$refs.demo.rerender()
                  } else {
                    _this.show1 = true
                  }
                }
              })
          }
        }
      }
    }
  }
</script>

<style scoped>

</style>
