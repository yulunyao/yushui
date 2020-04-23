<template>
  <div>
    <x-header>企业信息管理<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
    <div v-transfer-dom>
      <loading :show="showLoading" text="加载中"></loading>
    </div>
    <card style="margin-left: 5px; margin-right: 5px">
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-r">
          <span style="color: black">污染源编码</span>
          <br/>
        </div>
        <div class="vux-1px-r">
          <span style="color: grey">{{table_data.code}}</span>
          <br/>
        </div>
      </div>
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-r">
          <span style="color: black">企业名称</span>
          <br/>
        </div>
        <div class="vux-1px-r">
          <span style="color: grey">{{table_data.name}}</span>
          <br/>
        </div>
      </div>
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-r">
          <span style="color: black">地区</span>
          <br/>
        </div>
        <div class="vux-1px-r">
          <span style="color: grey">{{table_data.district}}</span>
          <br/>
        </div>
      </div>
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-r">
          <span style="color: black">注册类型</span>
          <br/>
        </div>
        <div class="vux-1px-r">
          <span style="color: grey">{{table_data.registerType}}</span>
          <br/>
        </div>
      </div>
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-r">
          <span style="color: black">经度</span>
          <br/>
        </div>
        <div class="vux-1px-r">
          <span style="color: grey">{{table_data.longitude}}</span>
          <br/>
        </div>
      </div>
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-r">
          <span style="color: black">纬度</span>
          <br/>
        </div>
        <div class="vux-1px-r">
          <span style="color: grey">{{table_data.latitude}}</span>
          <br/>
        </div>
      </div>
      <div slot="content" class="card-demo-flex card-demo-content01">
        <div class="vux-1px-r">
          <span style="color: black">在线状态</span>
          <br/>
        </div>
        <div class="vux-1px-r">
          <span style="color: grey">{{table_data.state}}</span>
          <br/>
        </div>
      </div>
    </card>
  </div>

</template>

<script>
  import { Divider, Card, XHeader, Loading, TransferDomDirective as TransferDom } from 'vux'
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'
  export default {
    data () {
      return {
        selected: localStorage.getItem('corpinfo'),
        table_data: '',
        showLoading: false
      }
    },
    directives: {
      TransferDom
    },
    components: {
      Divider,
      Card,
      XHeader,
      Loading
    },
    created () {
      this.generateTable()
      this.checkIfLogin()
    },
    methods: {
      generateTable () {
        let url1 = deployUrl + 'api/enterprise/get/' + localStorage.getItem('Home_Enterprise_Select')
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
        axios.get(url1, {})
          .then(function (response) {
            let retrievedData = response.data.data
            _this.table_data = retrievedData
          })
      },
      getUserLogOut () {
        localStorage.clear()
        this.$router.push('/')
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
              newlist.push(basic.data[i].text)
            }
            _this.list1.push(newlist)
          }).catch(function (error) {
            console.log(error)
          })
      },
      onChange (val) {
        console.log('val change+++++++++++', val)
        this.selected_value = val
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

<style scoped lang="less">
  @import '~vux/src/styles/1px.less';

  .card-demo-flex {
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
    font-size: 14px;
  }
  .card-demo-flex span {
    color: #f74c31;
  }
</style>
