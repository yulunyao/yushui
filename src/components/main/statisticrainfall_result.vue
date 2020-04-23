<template>
  <div>
    <x-header>降雨统计结果<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
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
            <el-form-item label="实时值">
              <span>{{ rtdFormatter(props.row.rtd) }} </span>
            </el-form-item>

            <el-form-item label="累计值">
              <span>{{ couFormatter(props.row.cou) }} </span>
            </el-form-item>

            <el-form-item label="COD浓度">
              <span>{{ codFormatter(props.row.cod) }} </span>
            </el-form-item>

            <el-form-item label="COD总量">
              <span>{{ codCouFormatter(props.row.codcou) }} </span>
            </el-form-item>

            <el-form-item label="氨氮">
              <span>{{ adFormatter(props.row.andan) }} </span>
            </el-form-item>

            <el-form-item label="氨氮累计值">
              <span>{{ andanCouFormatter(props.row.andancou) }} </span>
            </el-form-item>

            <el-form-item label="pH值">
              <span>{{ phFormatter(props.row.ph) }} </span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        prop="startTime"
        :formatter="dateFormat"
      >
      </el-table-column>
      <el-table-column
        label="结束时间"
        prop="endTime"
        :formatter="dateFormat"
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
        tableData: [],
        showLoading: false
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
      this.getRainfallStatistic()
    },
    methods: {
      getRainfallStatistic () {
        let url = deployUrl + 'api/StatisticRainfall/getall'
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
          data: {'psId': localStorage.getItem('Home_Enterprise_Select'), 'startNum': localStorage.getItem('statisticrainfall_start'), 'endNum': localStorage.getItem('statisticrainfall_end')}
        })
          .then(function (response) {
            if (response.data.code === 0) {
              let filteredData = response.data
              _this.tableData = filteredData.data
              localStorage.removeItem('statisticrainfall_start')
              localStorage.removeItem('statisticrainfall_end')
            } else {}
          })
      },
      getUserLogOut () {
        localStorage.clear()
        this.$router.push('/')
      },
      dateFormat (row, column) {
        let date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
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
  .el-table__expanded-cell[class*=cell] {
    padding: 20px 20px;
  }
</style>
