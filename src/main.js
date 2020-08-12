// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import { BootstrapVue, BootstrapVueIcons  } from 'bootstrap-vue'
import VeeValidate from 'vee-validate'
import VueI18n from 'vue-i18n'
import zh_CN from "vee-validate/dist/locale/zh_CN";
import md5 from 'js-md5';
import $ from 'jquery'
import 'bootstrap/dist/js/bootstrap.min'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import fuc from './assets/js/common'
import clipboard from 'vue-clipboard2';
    

Vue.use(VueI18n)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueIcons)
clipboard.config.autoSetContainer = true //解决模态框中失效问题
Vue.use(clipboard)


Vue.config.productionTip = false

Vue.prototype.$qs = qs
Vue.prototype.$md5 = md5
Vue.prototype.$axios = axios
Vue.prototype.$myFuc = fuc


axios.defaults.baseURL = process.env.API_HOST;
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded';

const i18n = new VueI18n({
  locale: "zh",
  messages: {
    zh: require("./assets/i18n/zh"),
    en: require("./assets/i18n/en")
  }
});


axios.interceptors.response.use((response) => {
  return response;
}, function (error) {
  if (401 === error.response.status) {
    console.log('401')
    // this.$router.push({path:'/login'})
    window.location = '/login';
  } else {
    return Promise.reject(error);
  }
});
 

Vue.use(VeeValidate, {
  i18nRootKey: 'validations', // customize the root path for validation messages.
  i18n,
  errorBagName: 'errorBags',
  fieldsBagName: 'fieldBags',
  dictionary: {
   zh: zh_CN
  }
});

router.beforeEach((to, from, next) => {
  /* 路由发生变化修改页面title */
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

//全局监听 seesionStorage 数据变化
Vue.prototype.resetSetItem = function (key, newVal) {
  if (key === 'slpNotice') {
    // 创建一个StorageEvent事件
    var newStorageEvent = document.createEvent('StorageEvent');
    const storage = {
      setItem: function (k, val) {
        sessionStorage.setItem(k, val);

        // 初始化创建的事件
        newStorageEvent.initStorageEvent('setItem', false, false, k, null, val, null, null);

        // 派发对象
        window.dispatchEvent(newStorageEvent)
      }
    }
    return storage.setItem(key, newVal);
  }
}


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  i18n,
  components: { App },
  template: '<App/>'
})
