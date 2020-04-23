<template>
  <div>
    <x-header>实时数据查询<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
    <div v-transfer-dom>
      <loading :show="showLoading" text="加载中"></loading>
    </div>
    <el-table
      :data="tableData"
      :tooltip-effect="emptyText"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="瞬时量">
              <span>{{ instantFormatter(props.row.instant) }}</span>
            </el-form-item>
            <el-form-item label="COD">
              <span>{{ codFormatter(props.row.cod) }}</span>
            </el-form-item>
            <el-form-item label="pH">
              <span>{{ phFormatter(props.row.ph) }}</span>
            </el-form-item>
            <el-form-item label="采样瓶号">
              <span>{{ emptyValueFormatter(props.row.bottle) }}</span>
            </el-form-item>
            <el-form-item label="收集池阀门">
              <span>{{ stateFormatter(props.row.sjcValveState) }}</span>
            </el-form-item>
            <el-form-item label="排水口阀门">
              <span>{{ stateFormatter(props.row.pskValveState) }}</span>
            </el-form-item>
            <el-form-item label="泵状态">
              <span>{{ emptyValueFormatter(props.row.bumpState) }}</span>
            </el-form-item>
            <el-form-item label="液位状态">
              <span>{{ emptyValueFormatter(props.row.levelState) }}</span>
            </el-form-item>
            <el-form-item label="门禁状态">
              <span>{{ emptyValueFormatter(props.row.entranceState) }}</span>
            </el-form-item>
            <el-form-item label="企业状态">
              <span>{{ emptyValueFormatter(props.row.psState) }}</span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="企业名称"
        prop="psName"
        :filters="tableData4Filters"
        :filter-method="filterHandler"
      >
      </el-table-column>
      <el-table-column
        label="时间"
        prop="time"
        :formatter="dateFormat"
      >
      </el-table-column>
      <el-table-column
        prop="onlineState"
        label="在线状态"
        width="100"
        :filters="[{ text: '在线', value: '在线' }, { text: '离线', value: '离线' }]"
        :filter-method="filterTag"
        filter-placement="bottom-end">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.onlineState === '在线' ? 'primary' : 'danger'"
            disable-transitions>{{scope.row.onlineState}}</el-tag>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
  import axios from 'axios'
  import { XHeader, Loading, TransferDomDirective as TransferDom, XProgress } from 'vux'
  import moment from 'moment'
  import { deployUrl } from '../domain/domain.js'
  export default {
    data () {
      return {
        tableData: [],
        tableData4Filters: [],
        emptyText: 'dark',
        showLoading: false,
        percent: 50
      }
    },
    directives: {
      TransferDom
    },
    components: {
      XHeader,
      Loading,
      XProgress
    },
    created () {
      this.checkIfLogin()
    },
    methods: {
      getRTD () {
        let url = deployUrl + 'api/monitor/getall'
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
        let token = localStorage.getItem('token')
        axios.get(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
          .then(function (response) {
            let filteredData = response.data
            _this.tableData = filteredData.data
            for (let i = 0; i < filteredData.data.length; i++) {
              _this.tableData4Filters.push({'text': filteredData.data[i].psName, 'value': filteredData.data[i].psName})
            }
          })
      },
  
      getUserLogOut () {
        localStorage.removeItem('username')
        localStorage.removeItem('token')
        this.$router.push('/')
      },
      formatter (row, column) {
        return row.address
      },
      filterTag (value, row) {
        return row.onlineState === value
      },
      filterHandler (value, row, column) {
        const property = column['property']
        return row[property] === value
      },
      checkIfLogin: function () {
        let url = deployUrl + 'api/user/info'
        let token = localStorage.getItem('token')
        axios.get(url, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
          .then(function (response) {
            if (response) {
              alert(JSON.stringify(response))
            } else {
              alert('ok')
            }
          })
          .catch(function (response) {
            alert(JSON.stringify(response))
          })
      },
      dateFormat (row, column) {
        let date = row[column.property]
        if (date === undefined) {
          return ''
        }
        return moment(date).format('YYYY-MM-DD HH:mm:ss')
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
