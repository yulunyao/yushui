<template>
  <div>
    <x-header>数据结果<a slot="right" @click="getUserLogOut">注销用户</a></x-header>

    <tab>
      <tab-item selected @on-item-click="onItemClick('sjxq')">数据详情</tab-item>
      <tab-item @on-item-click="onItemClick('sjtb')">数据图表</tab-item>
    </tab>

    <div v-transfer-dom>
      <loading :show="show2" text="加载中"></loading>
    </div>
    <!--数据详情-->
    <div class="col1" v-if="active_tab == 'sjxq'">
      <el-table
        :data="tableData"
        :show-header="true"
        :default-expand-all="false"
        :default-sort = "{prop: 'time', order: 'descending'}"
        style="width: 100%">
        <el-table-column type="expand">
          <template slot-scope="props">
            <el-form label-position="left" inline class="demo-table-expand">
              <el-form-item label="污水">
                <span>{{ wsFormatter(props.row.w00000) }}</span>
              </el-form-item>

              <el-form-item label="化学需氧量">
                <span>{{ hxxylFormatter(props.row.w01018) }}</span>
              </el-form-item>

              <el-form-item label="氨氮">
                <span>{{ adFormatter(props.row.w21003) }}</span>
              </el-form-item>

              <el-form-item label="pH值">
                <span>{{ phFormatter(props.row.w01001) }}</span>
              </el-form-item>

              <el-form-item label="电导率">
                <span>{{ ddlFormatter(props.row.w01014) }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column
          label="记录时间"
          prop="time"
          :formatter="dateFormat"
        >
        </el-table-column>
        <el-table-column
          label="排口名称"
          prop="portName"
          width="100">
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

    <!--数据图表-->
    <div class="col2" v-if="active_tab == 'sjtb'">
      <v-chart :data="JSONData">
        <v-line series-field="type" />
      </v-chart>
    </div>
  </div>
</template>

<script>
  import { XHeader, Tab, TabItem, VChart, VLine, VAxis, VTooltip, Loading, TransferDomDirective as TransferDom, Tabbar, TabbarItem, Group, Cell } from 'vux'
  import moment from 'moment'
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'
  export default {
    data () {
      return {
        previousData_enterprise: localStorage.getItem('Home_Enterprise_Select'),
        previousData_num: localStorage.getItem('rainfall_num'),
        tableData: [],
        tableData4Filters: [],
        active_tab: 'sjxq',
        JSONData: [],
        show2: false,
        currentPage: 1,
        pagesize: 5,
        count: ''
      }
    },
    components: {
      XHeader,
      Tab,
      TabItem,
      VChart,
      VLine,
      VAxis,
      VTooltip,
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
      this.generateTable()
    },
    methods: {
      generateTable () {
        let url1 = deployUrl + 'api/data/getall'
        let _this = this
        axios.interceptors.request.use(function (config) {
          // Do something before request is sent
          _this.show2 = true
          return config
        }, function (error) {
          // Do something with request error
          return Promise.reject(error);
        })

        axios.interceptors.response.use(function(response) {
          // 对响应数据做些事
          _this.show2 = false
          return response;
        }, function (error) {
          // 请求错误时做些事
          return Promise.reject(error)
        })

        axios.post(url1, {
          data: {'psId': _this.previousData_enterprise, 'num': _this.previousData_num},
          ph: {
            'page': _this.currentPage,
            'rows': _this.pagesize
          }
        })
          .then(function (response) {
            let retrievedData = response.data
            /* alert(JSON.stringify(retrievedData.data.length)) */
            _this.tableData = retrievedData.data
            _this.count = retrievedData.count

            for (let i = 0; i < retrievedData.data.length; i++) {
              if (retrievedData.data[i]['w00000']) {
                _this.JSONData.push({'date': moment(retrievedData.data[i].time).format('YYYY-MM-DD HH:mm:ss'), 'type': '污水', 'value': retrievedData.data[i].w00000})
              }
              if (retrievedData.data[i]['w01018']) {
                _this.JSONData.push({'date': moment(retrievedData.data[i].time).format('YYYY-MM-DD HH:mm:ss'), 'type': '化学需氧量', 'value': retrievedData.data[i].w01018})
              }
              if (retrievedData.data[i]['w21003']) {
                _this.JSONData.push({'date': moment(retrievedData.data[i].time).format('YYYY-MM-DD HH:mm:ss'), 'type': '氨氮', 'value': retrievedData.data[i].w21003})
              }
              if (retrievedData.data[i]['w01001']) {
                _this.JSONData.push({'date': moment(retrievedData.data[i].time).format('YYYY-MM-DD HH:mm:ss'), 'type': 'pH值', 'value': retrievedData.data[i].w01001})
              }
              if (retrievedData.data[i]['w01014']) {
                _this.JSONData.push({'date': moment(retrievedData.data[i].time).format('YYYY-MM-DD HH:mm:ss'), 'type': '电导率', 'value': retrievedData.data[i].w01014})
              }
            }
          })
      },
      getUserLogOut () {
        localStorage.clear()
        this.$router.push('/')
      },
      filterTag (value, row) {
        return row.onlineState === value;
      },
      filterHandler (value, row, column) {
        const property = column['property'];
        return row[property] === value;
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
      onItemClick (state) {
        this.active_tab = state
      },
      handleCurrentChange (cpage) {
        this.currentPage = cpage
        this.generateTable()
      },
      handleSizeChange (psize) {
        this.pagesize = psize
        this.generateTable()
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

  .el-pagination {
    margin: 0 auto;
    padding: 10px
  }
</style>
