<template>
  <div class="container-fluid">
    <!-- 轮播 -->
    <div class="bannerBox">
     <!-- @mouseover="showButton()" @mouseleave="hideButton()" -->
      <!-- swiper1 -->
      <swiper class="swiper gallery-top" :options="swiperOptionTop" ref="swiperTop">
        <swiper-slide v-for="item in imgSrc" :key="item" :style="{backgroundImage:'url(' + item + ')'}"></swiper-slide>
      </swiper>
      <!-- swiper2 Thumbs -->
      <swiper class="swiper gallery-thumbs shadow border border-secondary" 
      :style="{width:(imgSrc.length*300>1200?'1200':imgSrc.length*300)+'px',left:'50%', marginLeft:'-'+(imgSrc.length*300>1200?'600':imgSrc.length*150)+'px'}" 
      :options="swiperOptionThumbs" ref="swiperThumbs" v-show="imgSrc.length>1">
        <swiper-slide v-for="item in imgSrc" :key="item" :style="{backgroundImage:'url(' + item + ')'}"></swiper-slide>
        <div class="swiper-button-next swiper-button-white hide" slot="button-next"></div>
        <div class="swiper-button-prev swiper-button-white hide" slot="button-prev"></div>
      </swiper>
    </div>
    <!-- 产品区域 -->
    <p class="my-4 title">热销火爆产品套餐</p>
    <b-card-group class="mb-5 mx-auto bg-light shadow" style="width:1200px;">
      <b-card class="text-center goodBox" v-for="goods in list" :key="goods.id">
          <b-card-title class="hot h2 text-uppercase">{{goods.contractPeriod+'天'}}
            <p>{{goods.productScale+goods.unit+'H/S'}}</p>
          </b-card-title>
          <p class="my-2 hot h5">$<strong class="h2">{{goods.powerFare}}</strong>/T/天</p>
          <div class="goodParams"><span class="small">预计日收益：</span><span class="font-weight-bold">{{ goods.dayEarn?'$'+(goods.dayEarn).toFixed(4):'暂无' }}</span></div>
          <div class="goodParams"><span class="small">历史收益率：</span><span class="font-weight-bold">{{goods.earnRate?goods.earnRate+'%':'暂无'}}</span></div>
          <b-button :to="{ name: 'orderForm', params: {userId: goods.productCode} }" variant="warning" class="hotBtn">立即下单  |  $&nbsp;{{goods.unitPrice}}</b-button>
          <p class="my-4 small text-muted">— {{goods.productName}} —</p>
      </b-card>
    </b-card-group>
    <!-- 平台优势 -->
    <!-- <div class="jumbotron mb-0 bg-white" style="height:600px;">
      <h1 class="text-center mb-4">选择我们 四大优势</h1>
      <b-card-group deck>
        <b-card class="text-center bg-transparent">
          <b-card-body>
            <b-card-title>资金保障</b-card-title>
            <b-card-sub-title class="mb-2" body-bg-variant="red">按日计算 灵活省心</b-card-sub-title>
          </b-card-body>
        </b-card>

        <b-card class="text-center bg-transparent">
          <b-card-body>
            <b-card-title>实盘交易</b-card-title>
            <b-card-sub-title class="mb-2" body-bg-variant="red">按日计算 灵活省心</b-card-sub-title>
          </b-card-body>
        </b-card>

        <b-card class="text-center bg-transparent">
          <b-card-body>
            <b-card-title>快速开户</b-card-title>
            <b-card-sub-title class="mb-2" body-bg-variant="red">按日计算 灵活省心</b-card-sub-title>
          </b-card-body>
        </b-card>

        <b-card class="text-center bg-transparent">
          <b-card-body>
            <b-card-title>放大收益</b-card-title>
            <b-card-sub-title class="mb-2" body-bg-variant="red">按日计算 灵活省心</b-card-sub-title>
          </b-card-body>
        </b-card>
      </b-card-group>
    </div> -->
  </div>
</template>

<script>
// https://www.jb51.net/article/172074.htm
import { Swiper, SwiperSlide, directive } from 'vue-awesome-swiper'
import 'swiper/css/swiper.css'
export default {
  name: 'index', 
  components: { Swiper, SwiperSlide },
  data() {
    return {list:'',
      imgSrc:[require('../../assets/img/banner4.jpg'),require('../../assets/img/banner3.gif'),require('../../assets/img/banner3.jpg'),require('../../assets/img/banner2.jpg')],
      swiperOptionThumbs: {loop: true, loopedSlides: 20, spaceBetween: 0, slidesPerView: 'auto', centeredSlides: false, touchRatio: 0.2, slideToClickedSlide: true, navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' }},
      swiperOptionTop: { loop: true, loopedSlides: 20, spaceBetween: 0, effect:'fade',},
    }
  },
  created(){
    $(".bannerBox").width($(window).width());
    //热力推荐产品
    var that = this;
    this.$axios.post('product/selectRecommendProduct').then(function (response) {
      if (response.status === 200) {
        var data = response.data;
        that.list = data.content;
      }
    })
    .catch(function (error) {
      console.log(error)
    });
  },
  mounted() {
    this.$nextTick(() => {
      const swiperTop = this.$refs.swiperTop.$swiper
      const swiperThumbs = this.$refs.swiperThumbs.$swiper
      swiperTop.controller.control = swiperThumbs
      swiperThumbs.controller.control = swiperTop
    })
  },
  methods: {
    getWith(item, index) {
      return 'width:' + (item.totalNumber-item.stockNumber)/item.totalNumber*100 + '%'
    },
    showButton(){
      const swiperThumbs = this.$refs.swiperThumbs.$swiper
      swiperThumbs.navigation.$nextEl.removeClass('hide');
      swiperThumbs.navigation.$prevEl.removeClass('hide');
    },
    hideButton(){
      const swiperThumbs = this.$refs.swiperThumbs.$swiper
      swiperThumbs.navigation.$nextEl.addClass('hide');
      swiperThumbs.navigation.$prevEl.addClass('hide');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
@keyframes btnStrip {
  0% {
    transform:scale(1.1);
  }
  50% {
    transform:scale(1.2);
  }
  100% {
    transform:scale(1);
  }
}
.bannerBox{
  height:600px;position: relative;
  .swiper {
    .swiper-slide {
      background-size: 100% 100%;
      background-position: center;
    }
    &.gallery-top {
      height: 100%;
      width: 100%;
    }
    &.gallery-thumbs {
      height: 20%;margin: auto;position: absolute;max-width: 1200px;overflow-x: hidden;
      margin: auto;bottom: 0px; background: #fff; left: 11%;box-sizing: border-box;
      .hide{ opacity:0; }
      .swiper-button-white{ transition:opacity 0.5s; }
    }
    &.gallery-thumbs .swiper-slide {
      opacity: .6;
      width:300px;height: 100%;margin: 0!important;border: 4px solid #333
    }
    &.gallery-thumbs .swiper-slide-active {
      border-color:#ffc107;
      opacity: 1;
    }
  }
}
.title{ font-size: 32px; color: #32374a; text-align: center; font-weight: 700;}
.goodBox{ border: none; border-right: 1px dashed #c3bebe; border-radius:0;transition:all 1s;
  &:last-child{ border-right:none; }
  .goodParams{ margin:1rem 0;color:#333; }
  &:hover{ box-shadow: 0 1rem 1rem rgba(0, 0, 0, 0.2) !important;transform:translateY(-15px);
    .hotBtn{transform:scale(1.2);}
  }
}
.hot{ color: #e6a23c !important; }
.hotBtn{ background-color: #e6a23c; border-color: #e6a23c;margin-top:1rem;transition:all 1s;color: #fff; 
 &:active, &.active{background-color: #e6a23c!important; border-color: #e6a23c!important;color: #fff!important;}
}
</style>

