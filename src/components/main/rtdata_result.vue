<template>
  <div>
    <x-header>实时数据查询<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
    <x-progress :percent="percent" :show-cancel="false"></x-progress>
    <div v-transfer-dom>
      <loading :show="showLoading" text="加载中" ></loading>
    </div>
    <el-table
      :data="tableData"
      :show-header="false"
      :default-expand-all="true"
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
  import { XHeader, Loading, TransferDomDirective as TransferDom, XProgress } from 'vux'
  import moment from 'moment'
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'
  export default {
    data () {
      return {
        selected: localStorage.getItem('rtdata'),
        tableData: [],
        tableData4Filters: [],
        showLoading: false,
        percent: 0,
        intervalId: ''
      }
    },
    components: {
      XHeader,
      Loading,
      XProgress
    },
    directives: {
      TransferDom
    },
    created () {
      this.checkIfLogin()
      this.generateTable()
      this.autoRefresh()
      this.calculateProgress()
    },
    beforeDestroy () {
      clearInterval(this.intervalId)
    },
    methods: {
      generateTable () {
        let token = localStorage.getItem('token')
        let _this = this
        axios.interceptors.request.use(function (config) {
          // Do something before request is sent
          _this.showLoading = false
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
        let url2 = deployUrl + 'api/monitor/get/' + localStorage.getItem('Home_Enterprise_Select')
        axios.get(url2, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + token
          }
        })
          .then(function (response1) {
            let idBased = response1.data.data
            _this.tableData = idBased
          })
      },
      getUserLogOut () {
        localStorage.clear()
        this.$router.push('/')
      },
      onChange (val) {
        this.selected_value = val
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
      autoRefresh: function () {
        let _this = this
        let token = localStorage.getItem('token')
        // 自动刷新逻辑:
        // 1. 设定每10秒刷新一次
        // 2. 每次刷新之前清空TableData
        // 3. Axios读取数据，并将数据Push到TableData中
        _this.intervalId = setInterval(function () {
          let url1 = deployUrl + 'api/enterprise/getall'
          let __this = _this
          axios.interceptors.request.use(function (config) {
            // Do something before request is sent
            __this.showLoading = true
            return config
          }, function (error) {
            // Do something with request error
            return Promise.reject(error)
          })

          axios.interceptors.response.use(function (response) {
            // 对响应数据做些事
            __this.showLoading = false
            return response
          }, function (error) {
            // 请求错误时做些事
            return Promise.reject(error)
          })
          let url2 = deployUrl + 'api/monitor/get/' + localStorage.getItem('Home_Enterprise_Select')
          axios.get(url2, {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              'Authorization': 'Bearer ' + token
            }
          })
            .then(function (response1) {
              let idBased = response1.data.data
              for (let item in idBased[0]) {
                console.log(item)
              }
              __this.tableData = idBased
            })
          /* for (let i = 0; i < 10; i++) { */
          /* if (__this.percent <= 100) {
            setInterval(function () {
              __this.percent += 10
            }, 1000)
          } else if (__this.percent >= 100) {
            __this.percent = 0
          } */
          /* setTimeout(function () {
            for (let i = 0; i < 10; i++) {
              if (__this.percent <= 100) {
                __this.percent += 10
              } else {
                __this.percent = 0
              }
            }
          }, 1000) */
          /* } */
        }, 10000)
      },
      calculateProgress () {
        let __this = this
        setInterval(function () {
          for (let i = 0; i < 1; i++) {
            if (__this.percent <= 99) {
              __this.percent += 1
            } else {
              __this.percent = 1
            }
          }
        }, 100)
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
