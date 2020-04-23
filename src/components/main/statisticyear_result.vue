<template>
  <div>
    <x-header>降雨年报表结果<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
    <div v-transfer-dom>
      <loading :show="showLoading" text="加载中"></loading>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort = "{prop: 'startTime', order: 'descending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="雨水排放量">
              <span>{{ yspflFormatter(props.row.rainfallPi) }} </span>
            </el-form-item>

            <el-form-item label="COD值">
              <span>{{ codFormatter(props.row.cod) }} </span>
            </el-form-item>

            <el-form-item label="COD累计值">
              <span>{{ codCouFormatter(props.row.codCou) }} </span>
            </el-form-item>

            <el-form-item label="氨氮">
              <span>{{ adFormatter(props.row.andan) }} </span>
            </el-form-item>

            <el-form-item label="氨氮累计值">
              <span>{{ andanCouFormatter(props.row.andanCou) }} </span>
            </el-form-item>

            <el-form-item label="pH值">
              <span>{{ phFormatter(props.row.ph) }} </span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="降雨开始时间"
        prop="startTime"
      >
      </el-table-column>
      <el-table-column
        label="排口名称"
        prop="portName"
      >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
  import moment from 'moment'
  import { XHeader, Loading, TransferDomDirective as TransferDom } from 'vux'
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'
  export default {
    data () {
      return {
        tableData: []
      }
    },
    components: {
      XHeader,
      Loading
    },
    directives: {
      TransferDom
    },
    created () {
      this.checkIfLogin()
      this.getRainfallYearly()
    },
    methods: {
      getRainfallYearly () {
        let url = deployUrl + 'api/statisticyear/getall'
        let _this = this
        axios.interceptors.request.use(function (config) {
          // Do something before request is sent
          _this.showLoading = true
          return config
        }, function (error) {
          // Do something with request error
          return Promise.reject(error);
        })

        axios.interceptors.response.use(function(response) {
          //对响应数据做些事
          _this.showLoading = false
          return response;
        },function(error){
          //请求错误时做些事
          return Promise.reject(error);
        })
        axios.post(url, {
          data: {'psId': localStorage.getItem('Home_Enterprise_Select'), 'startYear': localStorage.getItem('statisticyear_start'), 'endYear': localStorage.getItem('statisticyear_end')}
        })
          .then(function (response) {
            if (response.data.code === 0) {
              let filteredData = response.data
              _this.tableData = filteredData.data

              localStorage.removeItem('statisticyear_enterprise')
              localStorage.removeItem('statisticyear_start')
              localStorage.removeItem('statisticyear_end')
            } else {}
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

<style>

  .demo-table-expand {
    font-size: 0;
  }
  .demo-table-expand label {
    width: 90px;
    color: #99a9bf;
  }
  .demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
  }

  .el-form-item__content span {
    font-weight: bold;
  }
</style>
