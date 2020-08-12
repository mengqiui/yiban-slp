import Vue from 'vue'
import Router from 'vue-router'
 
//一级页面
import login from '@/views/login'
import reset from '@/views/reset'
import signup from '@/views/signup'

//二级页面
import shop from '@/views/index/shop'
import mainPart from '@/views/index/mainPart'
import calBuy from '@/views/index/calBuy'
import orderForm from '@/views/index/orderForm'
import payment from '@/views/index/payment'
import millShop from '@/views/index/millShop'
import about from '@/views/index/about'

import articles from '@/views/customer/articles'
import lists from '@/views/customer/lists'
import rule from '@/views/customer/rule'

import myinfo from '@/views/user/myinfo'

import calculator from '@/views/footer/calculator'
import requests from '@/views/footer/requests'
import information from '@/views/customer/information'

//三级页面
import myCal from '@/views/user/myCal'
import myOrder from '@/views/user/myOrder'
import myBalance from '@/views/user/myBalance'
import userSetup from '@/views/user/userSetup'
import earnAddress from '@/views/user/earnAddress'
import realName from '@/views/user/realName'
import changePwd from '@/views/user/changePwd'
import myPower from '@/views/user/myPower'
import Orderdetail from '@/views/user/Orderdetail'
import Mforce from '@/views/user/Mforce'
import userProfit from '@/views/user/userProfit'

Vue.use(Router)

// scrollBehavior:
// - only available in html5 history mode
// - defaults to no scroll behavior
// - return false to prevent scroll
const scrollBehavior = function (to, from, savedPosition) {
  if (savedPosition) {
    // savedPosition is only available for popstate navigations.
    return savedPosition
  } else {
    const position = {}

    // scroll to anchor by returning the selector
    if (to.hash) {
      position.selector = to.hash

      // specify offset of the element
      if (to.hash === '#app') {
        position.offset = { y: 100 }
      }
      // bypass #1number check
      if (/^#\d/.test(to.hash) || document.querySelector(to.hash)) {
        return position
      }

      // if the returned position is falsy or an empty object,
      // will retain current scroll position.
      return false
    }

    return new Promise(resolve => {
      // check if any matched route config has meta that requires scrolling to top
      if (to.matched.some(m => m.meta.scrollToTop)) {
        // coords will be used if no selector is provided,
        // or if the selector didn't match any element.
        position.x = 0
        position.y = 0
      }

      // wait for the out transition to complete (if necessary)
      this.app.$root.$once('triggerScroll', () => {
        // if the resolved position is falsy or an empty object,
        // will retain current scroll position.
        resolve(position)
      })
    })
  }
}

export default new Router({
  mode:'history',
  // scrollBehavior,
  routes: [
    { path: '/login', name: 'login', component: login, meta: {title: '欢迎登陆算力派商城',scrollToTop: true} },
    { path: '/reset', name: 'reset', component: reset, meta: {title: '您正在进行密码找回',scrollToTop: true} },
    { path: '/signup', name: 'signup', component: signup, meta: {title: '欢迎加入算力派',scrollToTop: true} },
    { path: '/', component: mainPart, meta: {title: '欢迎来到算力派商城',scrollToTop: true}, redirect:'/shop',
      children: [
        { path: '/calBuy', name: 'calBuy', component: calBuy, meta: {title: '欢迎来到算力派商城 —— 买算力，请上算力派',scrollToTop: true} },
        { path: '/calBuy/orderForm/:userId', name: 'orderForm', component: orderForm, meta: {title: '欢迎来到算力派 —— 买算力不要等，立即下单抢购',scrollToTop: true} },
        { path: '/payment/', name: 'payment', component: payment, meta: {title: '欢迎来到算力派商城 —— 余额支付，安全快捷',scrollToTop: true} },
        { path: '/myPower/:orderId', name: 'myPower', component: myPower, meta: {title: '欢迎来到算力派商城 —— 我的电费列表',scrollToTop: true} },
        { path: '/millShop', name: 'millShop', component: millShop, meta: {title: '欢迎来到算力派商城',scrollToTop: true} },
        { path: '/articles', name: 'articles', component: articles, meta: {title: '欢迎来到算力派商城 —— 客户服务',scrollToTop: true} },
        { path: '/articles/lists/:id', name: 'lists', component: lists, meta: {title: '欢迎来到算力派商城',scrollToTop: true} },
        { path: '/articles/rule', name: 'rule', component: rule, meta: {title: '欢迎来到算力派商城',scrollToTop: true} },
        { path: '/about', name: 'about', component: about, meta: {title: '欢迎来到算力派商城 —— 了解关于算力派的一切',scrollToTop: true} },
        { path: '/myinfo', name: 'myinfo', component: myinfo, meta: {title: '欢迎来到算力派商城 —— 个人用户中心,scrollToTop: true'},
          children:[
            { path:'/myinfo/myCal', name: 'myCal', component: myCal,},
            { path:'/myinfo/myCal/Mforce/:orderId', name: 'Mforce', component: Mforce },
            { path:'/myinfo/myCal/userProfit', name: 'userProfit', component: userProfit },
            { path:'/myinfo/myOrder', name: 'myOrder', component: myOrder },
            { path:'/myinfo/myOrder/Orderdetail/:orderId', name: 'Orderdetail', component: Orderdetail },
            { path:'/myinfo/userSetup', name: 'userSetup', component: userSetup },
            { path:'/myinfo/userSetup/realName', name: 'realName', component: realName },
            { path:'/myinfo/userSetup/changePwd', name: 'changePwd', component: changePwd },
            { path:'/myinfo/myBalance', name: 'myBalance', component: myBalance },
            { path:'/myinfo/earnAddress', name: 'earnAddress', component: earnAddress },
          ]
        },
        { path: '/calculator', name: 'calculator', component: calculator, meta: {title: '欢迎来到算力派商城 —— 计算器',scrollToTop: true} },
        { path: '/requests', name: 'requests', component: requests, meta: {title: '欢迎来到算力派商城 —— 提交工单',scrollToTop: true} },
        { path: '/information', name: 'information', component: information, meta: {title: '欢迎来到算力派商城 —— 消息列表',scrollToTop: true} },
        { path: '/shop', name: 'shop', component: shop, meta: {title: '欢迎来到算力派商城',scrollToTop: true} },
      ]
    },
    // {path: '*', redirect:'/'}
  ],
})
