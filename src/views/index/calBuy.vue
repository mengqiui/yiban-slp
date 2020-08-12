<template>
  <div class="calBuy py-3">
    <div style="width:1200px;" class="mx-auto">
      <h2 class="text-center">BTC</h2><p class="text-secondary text-center">SHA256算法矿机是目前矿工最常用的挖矿工具。SHA256矿机共享套餐目前支持挖掘BTC/BCH。</p>
      <b-overlay :show="!Boolean(list)" :opacity="0.9" spinner-variant="warning" spinner-type="grow" style="min-height:600px;">
        <div v-if="!Boolean(list)">
          <div class="my-3 bg-white p-2 rounded">
            <div class="bg-dark text-light p-3 rounded" style="height:12rem;overflow: hidden;z-index:1;">
              <div class="d-flex mt-4">
                <div class="bd-box w-25 bd-orange">
                  <p class="text-light">最低算力费</p>
                  <h3 class="text-white mb-0">$<strong class="h1">0</strong>/T/天</h3>
                </div>
                <div class="bd-box w-25 bd-yellow">
                  <p class="text-light">电费</p>
                  <h3 class="text-white mb-0">$<strong class="h1">0</strong>/T/天</h3>
                </div>
                <div class="bd-box w-25 bd-green">
                  <!-- <p class="text-light">{{item.product[0].hashrateSource}}</p> -->
                  <p class="text-light"><span class="badge badge-light text-uppercase">BTC</span> 来自price.btcfans.com的理论收益</p>
                  <h3 class="text-white mb-0">$0/T/天</h3>
                </div>
                <div class="w-25 text-center position-relative">
                  <div class="bg-skew position-absolute"></div>
                  <div class="ramp position-absolute"></div>
                    <h3 class="skew-text h3-style">XXXXX</h3>
                    <small class="skew-text small-style">-XXXXX -</small>
                </div>
              </div>
              <p class="h6 mt-4"><b-icon icon="star-fill"></b-icon> 每日净挖矿所得等于每日挖矿产出减去算力费和电费。</p>
            </div>
            <div class="d-flex justify-content-around py-3">
              <b-card bg-variant="light" v-for="(index) in 4" :key="index" style="width:271px;height:357px;"></b-card>
            </div>
          </div>
        </div>
        <div v-else>
        <div class="my-3 bg-white p-2 rounded" v-for="(item,index ) in list" :key="index" :class="[item.product.length=='0'?'invisible':'visible']">
          <div v-if="item.product.length!=0">
            <div class="bg-dark text-light p-3 rounded overflow-hidden" style="height:12rem;z-index:1;">
              <p class="h4">预计购买后次日开始挖矿</p>
              <div class="d-flex mt-4">
                <div class="bd-box w-25 bd-orange">
                  <p class="text-light">最低算力费</p>
                  <h3 class="text-white mb-0">$<strong class="h1">{{item.product[0].managementFee}}</strong>/T/天</h3>
                </div>
                <div class="bd-box w-25 bd-yellow">
                  <p class="text-light">电费</p>
                  <h3 class="text-white mb-0">$<strong class="h1">{{item.product[0].powerFare}}</strong>/T/天</h3>
                </div>
                <div class="bd-box w-25 bd-green">
                  <p class="text-light"><span class="badge badge-light text-uppercase">{{item.product[0].coinType}}</span> 来自price.btcfans.com的理论收益</p>
                  <h3 class="text-white mb-0">${{income||'0'}}/T/天</h3>
                </div>
                <div class="w-25 text-center position-relative">
                  <div class="bg-skew position-absolute"></div>
                  <div class="ramp position-absolute"></div>
                    <h3 class="skew-text h3-style">{{item.miner.minerVersion}}</h3>
                    <small class="skew-text small-style">- 矿机参数&nbsp; 
                      <b-icon icon="info-circle-fill" v-b-tooltip.hover.bottom="{customClass:'minerTips',html:true,title:'<div ><p class=\'tipsHead\'>矿机机型：<em>'+item.miner.minerModel+'</em></p><p>矿机算力：<span>'+item.miner.minerHashrate+'TH/S</span></p><p>矿机功率：<span>'+item.miner.minerPower+'W</span></p><p>其能效比：<span>'+item.miner.minerEer+'J/TH</span></p></div>'}"
                      ></b-icon> 
                    -</small>
                </div>
              </div>
              <p class="h6 mt-4"><b-icon icon="star-fill"></b-icon> 每日净挖矿所得等于每日挖矿产出减去算力费和电费。</p>
            </div>
            <div class="d-flex justify-content-around flex-wrap py-3">
              <b-card border-variant="warning" v-for="(goods,index) in item.product" :key="index" class="text-center p-1 w-300 my-2 productItem">
                <div class="card-title text-secondary h-66 h3 overflow-hidden text-uppercase">
                  {{goods.contractPeriod+'天'}}
                  <p>{{goods.productScale+goods.unit+'H/S'}}</p>  
                </div><hr/>
                <h4 class="card-subtitle mb-2 text-warning">$<strong class="h1">{{goods.powerFare}}</strong>/T/天</h4><hr/>
                <div class="my-4">
                  <div class="progress d-inline-flex w-50" style="height:10px;">
                    <div class="progress-bar progress-bar-striped progress-bar-animated bg-warning" role="progressbar" :style="getWith(goods, index)" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>
                  </div>
                  <small class="text-secondary">已售：{{Math.ceil((goods.totalNumber-goods.stockNumber)/goods.totalNumber*100)}}%</small>
                </div>
                <router-link :to="{ name: 'orderForm', params: {userId: goods.productCode} }" class="btn btn-outline-warning btn-block">立即抢购  |  $&nbsp;{{goods.unitPrice}}</router-link>
                <p class="mt-2"><small class="text-secondary">- {{item.miner.minerName}} -</small></p>
              </b-card>
            </div>
          </div>
        </div>
        </div>
      </b-overlay>
    </div>
  </div>
</template>

<script>
export default {
  name: 'calBuy',
  data() {
    return { list:[{"miner":{},"product":[]}],income:null,timer:null };
  },
  created: function(){
    var that = this;
    that.$axios.post('product/getAllProductAndMine').then(function (response) {
      if (response.status === 200) {
        var data = response.data;
        that.list = data.content;
      }
    })
    .catch(function (error) {
      console.log(error)
    });
    this.getIncome();
    // that.timer = setInterval(() => {    
    //   this.getIncome() 
    // }, 1000*2);
  },
  methods: {
    getWith(item, index) {
      return 'width:' + (item.totalNumber-item.stockNumber)/item.totalNumber*100 + '%'
    },
    getIncome:function(){
      var that = this;
      this.$axios.post('product/getTheoryProfit').then(function (response) {
        if (response.status === 200) {
          that.income = response.data.content;
        }
      })
      .catch(function (error) {
        console.log(error)
      });
    }
  },
  beforeDestroy(){
    //clearInterval(this.timer)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.w-300{width:280px;}
.h-66{height:66px;}
.overflow-hidden{overflow: hidden;}
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
@media (max-width: 1200px){
  html, body, #app {
    background-color: #e9e9e9!important;
  }
}

.calBuy{
  animation: main 1s;
  padding: 0;width: 100%;
  background-image:url('/static/img/white_wall.png');
  .bd-box{
    display: -webkit-box;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
    flex-direction: column;
    -webkit-box-pack: justify;
    justify-content: space-between;
    padding: 0 6px;
    font-size: 14px;
    p{margin:0;}
    h3{letter-spacing: 0.15rem;}
  }
  .bg-skew{ background-color: #ffc107; transform: skew(-65deg, 10deg) skew(5deg, 35deg); width: 340px; right: -25px; height: 200px; top: -44px; z-index:5; }
  .ramp{ width: 340px; height: 331px; top: -115px; left: 105px; background-color: #5a4e28;  transform: skew(-68deg, 35deg) skew(-18deg, 56deg); z-index: 2; }
  .skew-text{ position: absolute; transform: skew(0deg, 0deg); color: #6c757d;z-index:9; }
  .h3-style{ left: 34%; }
  .small-style{ top: 100%; left: 15%; }
  .productItem{transition: all 1s;
    &:hover{ transform: scale(1.05); }
  }
}
/deep/{
  .tooltip-inner{
    div{text-align: left;
      p{margin:5px!important;color: #c3bfbf;
        em{ color: #f07f2c; font-size: 1rem; font-style: normal; font-weight: 600; }
      }
      span{color:#fff!important;}
    }
    
    
  }
}

.bd-orange{@include borderL(orange);}
.bd-yellow{@include borderL(#cfcf05);}
.bd-green{@include borderL(#49ae49);}
</style>
