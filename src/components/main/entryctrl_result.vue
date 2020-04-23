<template>
  <div>
    <x-header>{{headerTitle}}<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
    <div v-transfer-dom>
      <loading :show="showLoading" text="加载中"></loading>
    </div>
    <el-table
      :data="tableData"
      style="width: 100%"
      :default-sort = "{prop: 'time', order: 'descending'}"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form label-position="left" inline class="demo-table-expand">
            <el-form-item label="排口名称">
              <span>{{ props.row.portName }} </span>
            </el-form-item>
            <el-form-item label="开启方式">
              <span>{{ props.row.method }} </span>
            </el-form-item>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="时间"
        prop="time"
        :formatter="dateFormat"
      >
      </el-table-column>
      <el-table-column
        label="状态"
        prop="state"
      >
      </el-table-column>
      <el-table-column
        label="执行结果"
        prop="result"
        width="100"
      >
      </el-table-column>
    </el-table>

    <tabbar style="position: fixed">
      <el-pagination
        layout="prev, next, sizes, total"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pagesize"
        :total="count"
        @current-change="handleCurrentChange"
        @size-change="handleSizeChange">
      </el-pagination>
    </tabbar>
  </div>
</template>

<script>
  import moment from 'moment'
  import { XHeader, Loading, TransferDomDirective as TransferDom, Tabbar, TabbarItem, Group, Cell } from 'vux'
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'
  export default {
    data () {
      return {
        headerTitle: '',
        tableData: [],
        showLoading: false,
        currentPage: 1,
        pagesize: 5,
        count: ''
      }
    },
    components: {
      XHeader,
      Loading,
      Tabbar,
      TabbarItem,
      Group,
      Cell
    },
    directives: {
      TransferDom
    },
    created () {
      this.checkIfLogin()
      this.getEntryHistory()
      this.checkIfLogin()
    },
    methods: {
      getEntryHistory () {
        let url = deployUrl + 'api/entrance/getall'
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
          data: {'psId': localStorage.getItem('entryctrl')},
          ph: {
            'page': _this.currentPage,
            'rows': _this.pagesize
          }
        })
          .then(function (response) {
            if (response.data.code === 0) {
              let filteredData = response.data
              _this.tableData = filteredData.data
              _this.headerTitle = filteredData.data[0].psName
              _this.count = filteredData.count
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
      },
      handleCurrentChange (cpage) {
        this.currentPage = cpage
        this.getEntryHistory()
      },
      handleSizeChange (psize) {
        this.pagesize = psize
        this.getEntryHistory()
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

  .el-pagination {
    margin: 0 auto;
    padding: 10px
  }
</style>
