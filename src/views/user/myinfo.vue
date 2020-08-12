<template>
  <div class="myInfo mx-auto d-flex px-2 py-3">
    <div class="settingLeft text-center bg-menu">
      <ul class="list-unstyled mb-0">
        <li><router-link to="/myinfo/myCal" active-class="on">我的算力</router-link></li>
      </ul>
      <ul class="list-unstyled mb-0">
        <li><router-link to="/myinfo/myOrder" active-class="on">我的订单</router-link></li>
      </ul>
      <ul class="list-unstyled mb-0">
        <li><router-link to="/myinfo/userSetup" active-class="on">账户设置</router-link></li>
      </ul>
      <ul class="list-unstyled">
        <li><router-link to="/myinfo/myBalance" active-class="on">账户资产</router-link></li>
      </ul>
    </div>
    <div class="flex-fill bg-light p-2 h-100"> 
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.on{ background: #ffffff; border-top: solid 2px #ffffff; border-bottom: solid 1px #ffffff; color: #007bff !important;}
.fade-enter-active, .fade-leave-active {
  transition: opacity .5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
@keyframes main {
  0% {
    opacity:0;
    transform:translateY(50px)
  }
  100% {
    opacity:1;
    transform:translateY(0)
  }
}
.myInfo{
  animation: main 1s;
  padding: 0;width:1440px;
  background-color: rgba(216, 209, 209, 0.2);
}
a:hover{text-decoration: none;}
.settingLeft{padding:10px 0;font-size:14px; font-family:'微软雅黑'; line-height:26px;min-height:360px; border-bottom: solid 1px rgba(255, 255, 255, 0.88);width:160px;
  ul~ul:before{ content:""; display:block; height:12px; border-bottom: 2px dashed #ffffff;margin:5px 0; }
  li{position:relative; transition:all .2s;
    a{ display:block;padding:10px 10px 10px 0;color:#343a40;font-size:15px; }
  &:hover{background:#fff;}
  }
} 
@media (max-width: 1440px) {
  .settingLeft{width:35px;}
  .myInfo{width:1200px;}
}
</style>
<script>
  export default{
    name: 'myinfo',

  }
</script>
