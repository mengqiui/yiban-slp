<template>
<div class="w-100 bg-dark">
  <b-navbar toggleable="md" type="dark" variant="dark" style="width: 1200px; margin: auto;">
    <b-navbar-brand href="#" tag="h1" class="mb-0 font-weight-bolder">
      <!-- <img src="https://placekitten.com/g/30/30" class="d-inline-block align-top" alt="算力派"> -->
      suanlipai
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav>
        <b-nav-item to="/shop" active-class="active">{{ $t('navbar.home') }}</b-nav-item>
        <b-nav-item to="/calBuy" active-class="active">{{ $t('navbar.calBuy') }}</b-nav-item>
        <!-- <b-nav-item to="millShop" :class="{active:active=='/millShop'}" @click="changeNav()">{{ $t('navbar.millShop') }}</b-nav-item> -->
        <b-nav-item to="/articles" active-class="active">{{ $t('navbar.customer') }}</b-nav-item>
        <b-nav-item to="/about" active-class="active">{{ $t('navbar.about') }}</b-nav-item>
      </b-navbar-nav>
      <!-- 判断登陆 start -->

      <!-- 用户已登录状态 -->
      <b-navbar-nav class="ml-auto" v-if="username">
          <b-nav-item to="/information" active-class="active" class="position-relative">
            <b-icon icon="bell"></b-icon>
            <b-badge variant="danger" class="position-absolute counts" v-if="notice>0">{{notice}}</b-badge>
          </b-nav-item>
        <b-nav-item-dropdown right>
          <!-- Using 'button-content' slot -->
          <template v-slot:button-content>
            <b-icon icon="person-fill"></b-icon> <em>{{(username).substr(0, 3) + '****' + (username).substr(7)}}</em>
          </template>
          <b-dropdown-item to="/myinfo/myCal" :class="{active:active=='/myinfo/myCal'}" @click="changeNav()">{{ $t('navbar.personal') }}</b-dropdown-item>
          <b-dropdown-item to="/myPower/all" :class="{active:active=='/myinfo/myPower/all'}" @click="changeNav()">{{ $t('navbar.navPower') }}</b-dropdown-item>
          <b-dropdown-item @click="loginout">{{ $t('navbar.leave') }}</b-dropdown-item>
        </b-nav-item-dropdown>
        <b-nav-item-dropdown class="lang" :text="$t('language.name')" right >
          <b-dropdown-item href="#" @click="changeLangEvent('zh')">{{ $t('navbar.langlist1') }}</b-dropdown-item>
          <b-dropdown-item href="#" @click="changeLangEvent('en')">{{ $t('navbar.langlist2') }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>

      <!-- 用户未登录状态 -->
      <b-navbar-nav class="ml-auto" v-else>
        <b-nav-item @click="isLogin=!isLogin" class="mx-1"><b-button size="sm" type="button" class="px-4">{{ $t('navbar.login') }}</b-button></b-nav-item>
        <!-- <b-nav-item to="/login" class="mx-1"><b-button size="sm" type="button" class="px-4">{{ $t('navbar.login') }}</b-button></b-nav-item> -->
        <b-nav-item to="/signup" class="mx-1"><b-button size="sm" type="button" class="px-4">{{ $t('navbar.siginup') }}</b-button></b-nav-item>
        <b-nav-item-dropdown class="lang" :text="$t('language.name')" right >
          <b-dropdown-item href="#" @click="changeLangEvent('zh')">{{ $t('navbar.langlist1') }}</b-dropdown-item>
          <b-dropdown-item href="#" @click="changeLangEvent('en')">{{ $t('navbar.langlist2') }}</b-dropdown-item>
        </b-nav-item-dropdown>
      </b-navbar-nav>
      <!-- 判断登陆 end -->

    </b-collapse>
  </b-navbar>
  <!-- 引入登陆弹框 -->
  <login v-if="isLogin"></login>
</div>
</template>

<script>
import login from '@/components/secureLogin'// secureLogin 为登陆鉴权公共组件
export default {
  name: 'navbar',
  components:{login},
  data() {
    return { active: this.$route.path ? this.$route.path: '' , username: sessionStorage.getItem("slpUser"), notice: sessionStorage.getItem("slpNotice"), isLogin: false }
  },
  created(){
    var that = this;
    window.addEventListener('setItem', ()=> {
      that.notice = sessionStorage.getItem('slpNotice');
    })
  },
  methods: {
    changeLangEvent(name) { this.$i18n.locale = name; },
    changeNav(){ this.active = this.$route.path; },
    loginout(){ 
      var that = this;
      sessionStorage.removeItem("slpUser");
      this.$axios.post('logout').then(function (response) {
        if (response.status === 200) { that.$router.push({path: '/login'}) }
      })
      .catch(function (error) {
        console.log(error)
      });
    }
  },
  mounted(){
    // 监听是否关闭弹框
    window.addEventListener('message', (eve) => {
      if(!eve.data){this.isLogin = false;}
    })
  }
}
</script>

<style lang="scss" scoped>
/deep/ {
  .navbar-dark .navbar-nav .nav-link{color: rgb(189, 188, 188);}
  .navbar-dark .navbar-nav .show > .nav-link, .navbar-dark .navbar-nav .active > .nav-link, .navbar-dark .navbar-nav .nav-link.show, .navbar-dark .navbar-nav .nav-link.active{
    color:#ffc107;
  }
  .dropdown-item.active, .dropdown-item:active{background-color: #806312;}
}

#nav-collapse{
  .navbar-nav{
    .nav-item{
      margin:0 .8rem;
    }
  }
}
.counts{top:5px;right:-2px;}
</style>
