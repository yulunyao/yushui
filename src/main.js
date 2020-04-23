/* eslint-disable camelcase */
// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
import store from './store/store'
import { ToastPlugin } from 'vux'
import elementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Highcharts from 'highcharts/highstock'
import { NoticeBar, Notify } from 'vant'
import VCharts from 'v-charts'
import VueChartkick from 'vue-chartkick'
import Chart from 'chart.js'

// Path申明及引入
import login from './components/account/login.vue'
import home from './components/main/home.vue'
import corpinfo from './components/main/corpinfo.vue'
import corpinfo_result from './components/main/corpinfo_result.vue'
import rtdata from './components/main/rtdata.vue'
import rtdata_result from './components/main/rtdata_result.vue'
import all_realtime from './components/main/all_realtime.vue'
import entryctrl from './components/main/entryctrl.vue'
import entryctrl_result from './components/main/entryctrl_result.vue'
import rainfalldata from './components/main/rainfalldata.vue'
import rainfalldata_result from './components/main/rainfalldata_result.vue'
import samplectrl from './components/main/samplectrl.vue'
import samplectrl_result from './components/main/samplectrl_result.vue'
import valvectrl from './components/main/valvectrl.vue'
import valvectrl_result from './components/main/valvectrl_result.vue'
import statisticrainfall from './components/main/statisticrainfall.vue'
import statisticrainfall_result from './components/main/statisticrainfall_result.vue'
import statisticyear from './components/main/statisticyear.vue'
import statisticyear_result from './components/main/statisticyear_result.vue'
import all_rainfallstatistic from './components/main/all_statisticrainfall.vue'
import all_statisticrainfall_result from './components/main/all_statisticrainfall_result.vue'
import condition_summary from './components/main/condition_summary.vue'
import daydata from './components/main/daydata.vue'
import daydata_result from './components/main/daydata_result.vue'
import hourdata from './components/main/hourdata.vue'
import hourdata_result from './components/main/hourdata_result.vue'

Vue.use(VueRouter)
Vue.use(ToastPlugin)
Vue.use(elementUI)
Vue.use(Highcharts)
Vue.use(NoticeBar)
Vue.use(Notify)
Vue.use(VCharts)
Vue.use(VueChartkick, {adapter: Chart})

const routes = [
  {path: '/', component: login},
  {path: '/home', component: home},
  {path: '/corpinfo', component: corpinfo},
  {path: '/corpinfo_result', component: corpinfo_result},
  {path: '/rtdata', component: rtdata},
  {path: '/rtdata_result', component: rtdata_result},
  {path: '/all_realtime', component: all_realtime},
  {path: '/entryctrl', component: entryctrl},
  {path: '/entryctrl/entryctrl_result', component: entryctrl_result},
  {path: '/rainfalldata', component: rainfalldata},
  {path: '/rainfalldata/rainfalldata_result', component: rainfalldata_result},
  {path: '/samplectrl', component: samplectrl},
  {path: '/samplectrl/samplectrl_result', component: samplectrl_result},
  {path: '/valvectrl', component: valvectrl},
  {path: '/valvectrl/valvectrl_result', component: valvectrl_result},
  {path: '/statisticrainfall', component: statisticrainfall},
  {path: '/statisticrainfall/statisticrainfall_result', component: statisticrainfall_result},
  {path: '/statisticyear', component: statisticyear},
  {path: '/statisticyear/statisticyear_result', component: statisticyear_result},
  {path: '/statisticrainfall/graph', component: all_rainfallstatistic},
  {path: '/all_statisticrainfall/result', component: all_statisticrainfall_result},
  {path: '/condition_summary', component: condition_summary},
  {path: '/hourdata', component: hourdata},
  {path: '/hourdata/hourdata_result', component: hourdata_result},
  {path: '/daydata', component: daydata},
  {path: '/daydata/daydata_result', component: daydata_result}
] // 父页面

const router = new VueRouter({
  base: '/dist/',
  mode: 'history',
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* router.beforeEach((to, from, next) => {
  if (to.meta.requireAuth) { // 判断该路由是否需要登录权限
    if (store.state.token) { // 如果需要登录权限，再通过vuex state获取当前的token是否存在
      next()
    } else {
      next({
        path: '/login',
        query: {redirect: to.fullPath}
      })
    }
  } else {
    next()
  }
}) */

/* eslint-disable no-new */
new Vue({
  router: router,
  render: h => h(App),
  store: store
}).$mount('#app-box')

// 瞬时值
Vue.prototype.instantFormatter = function (value) {
  if (value != null) {
    return value + ' L/s'
  } else {
    return '-'
  }
}

// 状态值
Vue.prototype.stateFormatter = function (state) {
  if (state != null) {
    if (state === '100') {
      return '开'
    } else {
      return '关'
    }
  } else {
    return '-'
  }
}

// 空值
Vue.prototype.emptyValueFormatter = function (value) {
  if (value != null) {
    return value
  } else {
    return '-'
  }
}

// COD浓度
Vue.prototype.codFormatter = function (value) {
  if (value != null) {
    return value + ' mg/L'
  } else {
    return '-'
  }
}

// pH值
Vue.prototype.phFormatter = function (value) {
  if (value != null) {
    return value
  } else {
    return '-'
  }
}

// 污水
Vue.prototype.wsFormatter = function (value) {
  if (value != null) {
    return value + ' L/s'
  } else {
    return '-'
  }
}
// 化学需氧量
Vue.prototype.hxxylFormatter = function (value) {
  if (value != null) {
    return value + ' mg/L'
  } else {
    return '-'
  }
}
// 氨氮
Vue.prototype.adFormatter = function (value) {
  if (value != null) {
    return value + ' mg/s'
  } else {
    return '-'
  }
}
// 电导率
Vue.prototype.ddlFormatter = function (value) {
  if (value != null) {
    return value + ' uS/cm'
  } else {
    return '-'
  }
}
// 实时值
Vue.prototype.rtdFormatter = function (value) {
  if (value != null) {
    return value + ''
  } else {
    return '-'
  }
}
// 累计值
Vue.prototype.couFormatter = function (value) {
  if (value != null) {
    return value + ' t'
  } else {
    return '-'
  }
}
// COD累计值
Vue.prototype.codCouFormatter = function (value) {
  if (value != null) {
    return value + ''
  } else {
    return '-'
  }
}
// 氨氮累计值
Vue.prototype.andanCouFormatter = function (value) {
  if (value != null) {
    return value + ''
  } else {
    return '-'
  }
}
// 雨水排放量
Vue.prototype.yspflFormatter = function (value) {
  if (value != null) {
    return value + ' t'
  } else {
    return '-'
  }
}
export default router
