<template>
  <div>
    <x-header>综合看板<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
    <div v-transfer-dom>
      <loading :show="showLoading" text="" position="fixed"></loading>
    </div>
          <swiper height="380px" >
            <swiper-item>
              <card :header="{title: '在线状况'}">
                <div slot="content" class="card-demo-flex card-demo-content01">
                  <div class="flex-demo">
                    <ve-pie :data="chartData" :settings="chartSettings"></ve-pie>
                  </div>
                </div>
              </card>
            </swiper-item>

            <swiper-item>
              <card :header="{title: '供电状况'}">
                <div slot="content" class="card-demo-flex card-demo-content01">
                  <div class="flex-demo">
                    <ve-pie :data="chartData2" :settings="chartSettings"></ve-pie>
                  </div>
                </div>
              </card>
            </swiper-item>

            <swiper-item>
              <card :header="{title: 'pH'}">
                <div slot="content" class="card-demo-flex card-demo-content01">
                  <div class="flex-demo">
                    <ve-pie :data="chartData3" :settings="chartSettings"></ve-pie>
                  </div>
                </div>
              </card>
            </swiper-item>

            <swiper-item>
              <card :header="{title: 'COD'}">
                <div slot="content" class="card-demo-flex card-demo-content01">
                  <div class="flex-demo">
                    <ve-pie :data="chartData4" :settings="chartSettings"></ve-pie>
                  </div>
                </div>
              </card>
            </swiper-item>

            <swiper-item>
              <card :header="{title: '电导率'}">
                <div slot="content" class="card-demo-flex card-demo-content01">
                  <div class="flex-demo">
                    <ve-pie :data="chartData5" :settings="chartSettings"></ve-pie>
                  </div>
                </div>
              </card>
            </swiper-item>
          </swiper>
    <card :header="{title: yearValue + '年度COD排放量前' + limitValue + '名的企业'}" @on-click-footer="clickFooter" ref="changeTop5">
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="flex-demo">
          <column-chart :data="chartData7"></column-chart>
          <el-button type="text" @click="clickFooter" :disabled="setDisabled">年度 & 条目设置</el-button>
        </div>
      </div>
    </card>

    <div v-transfer-dom>
      <popup v-model="filterForm" height="270px" is-transparent>
        <div style="width: 95%;background-color:#fff;height:250px;margin:0 auto;border-radius:5px;padding-top:10px;">
          <group>
            <x-number v-model="yearValue" :title="yearSelect" fillable :min="1"></x-number>
            <x-number v-model="limitValue" :title="limitSelect" fillable :min="1" :max="10"></x-number>
          </group>
          <div style="padding:20px 15px;">
            <x-button type="primary" @click.native="submitFilterForm">提交</x-button>
            <x-button @click.native="filterForm = false">取消</x-button>
          </div>
        </div>
      </popup>
    </div>

    <swiper :height="swiperHeight" ref="catchSwiper">
      <swiper-item>
        <card :header="{title: '实时数据 - pH'}">
          <div slot="content" class="card-demo-flex card-demo-content01">
            <div class="flex-demo">
              <bar-chart :data="chartData6" :height="parseHeight"></bar-chart>
              <el-button type="text" @click="getRealtimeInfoAll" :disabled="setDisabled">查看更多</el-button>
            </div>
          </div>
        </card>
      </swiper-item>
      <swiper-item>
        <card :header="{title: '实时数据 - COD'}">
          <div slot="content" class="card-demo-flex card-demo-content01">
            <div class="flex-demo">
              <bar-chart :data="chartData8" :height="parseHeight"></bar-chart>
              <el-button type="text" @click="getRealtimeInfoAll" :disabled="setDisabled">查看更多</el-button>
            </div>
          </div>
        </card>
      </swiper-item>
    </swiper>
  </div>
</template>

<script>
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'
  import { XHeader, Flexbox, FlexboxItem, Divider, Card, Swiper, SwiperItem, Group, Cell, XButton, Loading, TransferDom, Popup, XNumber } from 'vux'
  import SChart from 'vue-schart'

  export default {
    data () {
      this.chartSettings = {
        radius: 100,
        offsetY: 160,
        label: {
          show: true,
          position: 'inner',
          formatter: '{b}: {c}'
        },
        labelLine: {
          show: false
        }
      }
      this.chartSettings2 = {
        metrics: ['pH'],
        dataOrder: {
          label: 'pH',
          order: 'desc'
        }
      }
      return {
        yearValue: '',
        limitValue: '5',
        setDisabled: false,
        swiperHeight: '380px',
        parseHeight: '',
        totalCompany: 0,
        showLoading: true,
        filterForm: false,
        yearSelect: '查看年度',
        limitSelect: '条目数',
        chartData: {
          columns: ['状况', '数量'],
          rows: []
        },
        chartData2: {
          columns: ['状况', '数量'],
          rows: []
        },
        chartData3: {
          columns: ['状况', '数量'],
          rows: []
        },
        chartData4: {
          columns: ['状况', '数量'],
          rows: []
        },
        chartData5: {
          columns: ['状况', '数量'],
          rows: []
        },
        chartData6: [],
        chartData7: [],
        chartData8: []
      }
    },
    components: {
      XHeader,
      Flexbox,
      FlexboxItem,
      Divider,
      SChart,
      Card,
      Swiper,
      SwiperItem,
      Group,
      Cell,
      XButton,
      Loading,
      Popup,
      XNumber
    },
    created () {
      this.checkIfLogin()
      this.getCurrentYear()
      this.getPieInfo()
      this.getRealtimeInfo()
      this.getCodTop5()
    },
    directives: {
      TransferDom
    },
    methods: {
      getUserLogOut () {
        localStorage.clear()
        this.$router.push('/')
      },
      getPieInfo () {
        let url = deployUrl + 'api/board/pie'
        let _this = this
        axios.interceptors.request.use(function (config) {
          // Do something before request is sent
          _this.showLoading = true
          return config
        }, function (error) {
          // Do something with request error
          return Promise.reject(error)
        })

        axios.interceptors.response.use(function (response) {
          // 对响应数据做些事
          _this.showLoading = false
          return response
        }, function (error) {
          // 请求错误时做些事
          return Promise.reject(error)
        })
        axios.get(url, {})
          .then(function (res) {
            let retrievedData = res.data.data
            // 在线情况
            _this.chartData.rows = [
              {'状况': '在线', '数量': retrievedData.online.normal},
              {'状况': '离线', '数量': retrievedData.online.abnormal}
            ]

            // 供电状况
            _this.chartData2.rows = [
              {'状况': '供电', '数量': retrievedData.electric.normal},
              {'状况': '断电', '数量': retrievedData.electric.abnormal}
            ]

            // pH
            _this.chartData3.rows = [
              {'状况': '正常值', '数量': retrievedData.ph.normal},
              {'状况': '异常值', '数量': retrievedData.ph.abnormal}
            ]

            // cod
            _this.chartData4.rows = [
              {'状况': '正常值', '数量': retrievedData.cod.normal},
              {'状况': '异常值', '数量': retrievedData.cod.abnormal}
            ]

            // 电导率
            _this.chartData5.rows = [
              {'状况': '正常值', '数量': retrievedData.diandaolv.normal},
              {'状况': '异常值', '数量': retrievedData.diandaolv.abnormal}
            ]

            _this.totalCompany = retrievedData.online.total
          })
      },
      getRealtimeInfo () {
        let url = deployUrl + 'api/board/bar/realtime'
        let _this = this
        axios.interceptors.request.use(function (config) {
          // Do something before request is sent
          _this.showLoading = true
          return config
        }, function (error) {
          // Do something with request error
          return Promise.reject(error)
        })

        axios.interceptors.response.use(function (response) {
          _this.showLoading = false
          return response
        }, function (error) {
          return Promise.reject(error)
        })
        axios.get(url, {})
          .then(function (res) {
            // 表格内容根据pH进行排序
            let retrievedData = res.data.data
            _this.parseHeight = '300px'
            for (let i = 0; i < 10; i++) {
              _this.chartData6.push([retrievedData[i].shortName, retrievedData[i].ph])
              _this.chartData8.push([retrievedData[i].shortName, retrievedData[i].cod])
            }
          })
      },
      getRealtimeInfoAll () {
        let url = deployUrl + 'api/board/bar/realtime'
        let _this = this
        axios.get(url, {})
          .then(function (res) {
            let retrievedData = res.data.data
            _this.parseHeight = '1500px'
            _this.chartData6 = []
            _this.$nextTick(() => {
              _this.$refs.catchSwiper.xheight = '1580px'
            })
            _this.setDisabled = true
            for (let i = 0; i < retrievedData.length; i++) {
              _this.chartData6.push([retrievedData[i].shortName, retrievedData[i].ph])
              _this.chartData8.push([retrievedData[i].shortName, retrievedData[i].cod])
            }
          })
      },
      getCodTop5 () {
        let url = deployUrl + 'api/board/bar/year/2018/top/5'
        let _this = this
        axios.interceptors.request.use(function (config) {
          // Do something before request is sent
          _this.showLoading = true
          return config
        }, function (error) {
          // Do something with request error
          return Promise.reject(error)
        })

        axios.interceptors.response.use(function (response) {
          // 对响应数据做些事
          _this.showLoading = false
          return response
        }, function (error) {
          // 请求错误时做些事
          return Promise.reject(error)
        })
        axios.get(url, {})
          .then(function (res) {
            let retrievedData = res.data.data
            for (let i = 0; i < retrievedData.length; i++) {
              _this.chartData7.push([retrievedData[i].psName, retrievedData[i].codCou])
            }
          })
      },
      clickFooter () {
        this.filterForm = true
      },
      submitFilterForm () {
        let url = deployUrl + 'api/board/bar/year/' + this.yearValue + '/top/' + this.limitValue
        let _this = this
        this.chartData7 = []
        axios.interceptors.request.use(function (config) {
          // Do something before request is sent
          _this.showLoading = true
          return config
        }, function (error) {
          // Do something with request error
          return Promise.reject(error)
        })

        axios.interceptors.response.use(function (response) {
          // 对响应数据做些事
          _this.showLoading = false
          return response
        }, function (error) {
          // 请求错误时做些事
          return Promise.reject(error)
        })
        axios.get(url, {})
          .then(function (res) {
            let retrievedData = res.data.data
            for (let i = 0; i < retrievedData.length; i++) {
              _this.chartData7.push([retrievedData[i].psName, retrievedData[i].codCou])
            }
            _this.filterForm = false
          })
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
      getCurrentYear: function () {
        this.yearValue = new Date().getFullYear() - 1
      }
    },
    computed: {
      changeSwiperHeight: function () {
        this.$nextTick(() => {
          this.$refs.catchSwiper.height = '1500px'
        })
      }
    }
  }
</script>

<style scoped>
  /*.card-demo-flex {
    display: flex;
  }
  .card-demo-content01 {
    padding: 10px 0;
  }
  .card-padding {
    padding: 15px;
  }
  .card-demo-flex > div {
    flex: 1;
    text-align: center;
    font-size: 15px;
  }
  .card-demo-flex span {
    font-family: "sans-serif";
    font-size: 15px;
    color: cornflowerblue;
  }*/

  .flex-demo {
    text-align: center;
  }

  .weui-panel {
    margin-bottom: 10px;
  }

  .weui-panel > * {
    text-align: center;
  }
</style>
