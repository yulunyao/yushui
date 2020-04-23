<template>
  <div>
    <x-header>远程反控采样<a slot="right" @click="getUserLogOut">注销用户</a></x-header>
    <tab>
      <tab-item v-bind:selected="tab1" @on-item-click="onItemClick('fkcyjl')">反控采样记录</tab-item>
      <tab-item v-bind:selected="tab2" @on-item-click="onItemClick('fkcykz')">反控采样控制</tab-item>
    </tab>

    <div class="col1" v-if="active_tab == 'fkcykz'">
      <group title="请选择需要查找的企业及排口号" label-width="5em">
        <popup-picker :title="title2" :data="list2" v-model="placeholder2" @on-change="onChange2" :placeholder="('请选择')" show-name></popup-picker>
        <popup-picker :title="title4" :data="list4" v-model="placeholder4" @on-change="onChange4" :placeholder="('请选择')" show-name></popup-picker>
        <x-input title="反控采样密码" placeholder="请输入反控采样密码" placeholder-align="right" text-align="right" type="password" v-model="samplePassword" required></x-input>
      </group>

      <div v-transfer-dom>
        <confirm v-model="show"
                 :title="alright"
                 @on-cancel="onCancel"
                 @on-confirm="onConfirm">
          <p style="text-align:center;">是否确定执行反控采样操作</p>
        </confirm>
      </div>

      <toast v-model="show2" type="success">控制成功</toast>

      <div style="padding:15px;">
        <x-button type="primary" @click.native="getSubmission('defaultValueRef')">提交</x-button>
      </div>
    </div>

    <div class="col2" v-if="active_tab == 'fkcyjl'" style="padding-bottom: 50px">
      <div v-transfer-dom>
        <loading :show="showLoading" text="加载中"></loading>
      </div>
      <el-table
        :data="tableData"
        style="width: 100%"
        :show-header="true"
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
          label="企业"
          prop="psName"
        >
        </el-table-column>
        <el-table-column
          label="时间"
          prop="sampleTime"
          :formatter="dateFormat"
        >
        </el-table-column>
        <el-table-column
          label="设备"
          prop="deviceType"
        >
        </el-table-column>
        <el-table-column
          label="结果"
          prop="result"
        >
        </el-table-column>
      </el-table>

      <div v-transfer-dom>
        <confirm v-model="show"
                 :title="alright"
                 @on-cancel="onCancel"
                 @on-confirm="onConfirm">
          <p style="text-align:center;">是否确定执行反控采样操作</p>
        </confirm>
      </div>

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

    <!--{{list1}}
    {{list2}}
    <h2>{{placeholder1}}</h2>
    <h2>{{placeholder2}}</h2>
    <h2>ps: {{selected_enterprise}}</h2>
    <h2>port: {{selected_port}}</h2>-->
  </div>
</template>

<script>
  import { Loading, XHeader, PopupPicker, Group, Cell, Picker, XButton, XInput, XSwitch, Confirm, TransferDomDirective as TransferDom, Tab, TabItem, TabbarItem, Tabbar, Toast } from 'vux'
  import axios from 'axios'
  import { deployUrl } from '../domain/domain.js'
  import moment from 'moment'
  export default {
    components: {
      XHeader,
      PopupPicker,
      Group,
      Cell,
      Picker,
      XButton,
      XInput,
      XSwitch,
      Confirm,
      Tab,
      TabItem,
      TabbarItem,
      Tabbar,
      Loading,
      Toast
    },
    directives: {
      TransferDom
    },
    data () {
      return {
        title2: '排口号',
        title4: '设备种类',
        placeholder2: [],
        placeholder4: [],
        samplePassword: '',
        list2: [], // 排口下拉框的变量
        list4: [[{'name': '采样仪', 'value': '采样仪'}, {'name': 'COD仪', 'value': 'COD仪'}, {'name': '氨氮仪', 'value': '氨氮仪'}]],
        newlist1: [], // 企业下拉框的临时变量
        newlist2: [], // 排口下拉框的临时变量
        selected_enterprise: localStorage.getItem('Home_Enterprise_Select'), // 选中的企业名称，默认为 请选择
        selected_port: '',
        selected_device: '',
        parseList: '', // 传到下一个页面的list
        token: localStorage.getItem('token'),
        // 确认框内容
        show: false,
        show2: false,
        alright: '提示',
        active_tab: 'fkcyjl',
        //
        headerTitle: '',
        tableData: [],
        showLoading: false,
        //
        currentPage: 1,
        pagesize: 5,
        count: 0,
        //
        tab1: true,
        tab2: false
      }
    },
    created () {
      this.checkIfLogin()
      this.getTableInfoPc()
      this.getSampleHistory()
    },
    methods: {
      getSampleHistory () {
        let url = deployUrl + 'api/sample/getall'
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
          data: {'psId': this.selected_enterprise},
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
      // getTableInfoPc => 获得排口下拉框
      getTableInfoPc () {
        let _this = this
        let url2 = deployUrl + 'api/enterprise/porttree/' + this.selected_enterprise
        axios.get(url2, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + _this.token
          }
        })
          .then(function (response) {
            let retrievedData = response.data
            // alert(JSON.stringify(retrievedData.data))
            for (let i = 0; i < retrievedData.data.length; i++) {
              _this.newlist2.push({name: retrievedData.data[i].text, value: retrievedData.data[i].id})
            }
            _this.list2.push(_this.newlist2)
          })
      },
      onChange2 (val) {
        this.selected_port = val[0]
      },
      onChange4 (val) {
        this.selected_device = val[0]
      },
      getSubmission () {
        if (this.selected_port == '' || this.selected_device == '' || this.samplePassword == '') {
          this.$vux.toast.show({
            text: '请填写所有内容',
            type: 'warn',
            position: 'center'
          })
          let send_result = '' // send_result格式 { "password": string, "portId": int, "psId": int }
        } else {
          let _this = this
          let url = deployUrl + 'api/sample/control'
          axios.post(url, {
            password: this.entrancePassword,
            psId: this.selected_enterprise,
            portId: this.selected_port,
            deviceType: this.selected_device
          })
            .then(function (response) {
              if (response.data.code === 0) { // 如果返回的状态码为0，则弹出对话框
                _this.show = true
              }
            })
        }
      },
      onConfirm () {
        this.show = false
        localStorage.setItem('samplectrl', this.selected_enterprise) // 门禁记录仅需要psId即可
        this.show2 = true
        this.getSampleHistory()
        /* this.$router.push('/entryctrl/entryctrl_result') */
      },
      onCancel () {},
      getUserLogOut () {
        localStorage.clear()
        this.$router.push('/')
      },
      onItemClick (state) {
        this.active_tab = state
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
        this.getSampleHistory()
      },
      handleSizeChange (psize) {
        this.pagesize = psize
        this.getSampleHistory()
      },
      filterHandler (value, row, column) {
        const property = column['property']
        return row[property] === value
      }
    }
  }
</script>

<style scoped>
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
