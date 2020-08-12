<template>
  <div class="rounded my-3 bg-white py-4 px-2 mx-auto payment" style="min-height:677px;width:1200px;">
    <div class="d-flex mx-0" v-if="payOrder">
      <b-card style="width:30%;" title="订单信息">
        <b-list-group flush>
          <b-list-group-item class="d-flex justify-content-between align-items-end px-0">订单ID：<span>{{payOrder.orderInfo.orderId}}</span></b-list-group-item>
          <b-list-group-item class="d-flex justify-content-between align-items-end px-0">创建时间：<span>{{payOrder.orderInfo.orderTime}}</span></b-list-group-item>
          <b-list-group-item class="d-flex justify-content-between align-items-end px-0">支付方式：<span>余额付款</span></b-list-group-item>
          <b-list-group-item class="d-flex justify-content-between align-items-end px-0">产品名称：<span>{{payOrder.orderInfo.minerName}}</span></b-list-group-item>
          <b-list-group-item class="d-flex justify-content-between align-items-end px-0">选购数量：<span>{{payOrder.orderInfo.buyNum + payOrder.orderInfo.unit}}</span></b-list-group-item>
          <b-list-group-item class="d-flex justify-content-between align-items-end px-0">电费天数：<span>{{payOrder.orderInfo.electricityDays}}天</span></b-list-group-item>
          <b-list-group-item class="d-flex justify-content-between align-items-end px-0">总计应付：<span><b>{{payOrder.orderInfo.totalPrice}}</b> USD</span></b-list-group-item>
        </b-list-group>
      </b-card>
      <div class="ml-1" style="width:70%">
        <h5 class="text-muted pr-4">
          订单状态：<strong class="text-danger">{{$myFuc.getDict(payOrder.orderInfo.orderStatus,"id")}}</strong>
          <!-- <span v-html="countTxt" class="float-right" style="font-size:15px;letter-spacing:0.4px;"></span> -->
          <span class="float-right" style="font-size:15px;letter-spacing:0.4px;" v-html="countTxt">
            订单将在计时结束后失效,请及时支付&nbsp;&nbsp;<mark>72</mark>：<mark>00</mark>：<mark>00</mark>
          </span>  
        </h5><hr>
        <div class="mx-auto w-50 text-center my-5">
          <div class="infoBox float-left">
            {{payOrder.balance}}<span class="small">USD</span>
            <p style="font-size:1.2rem;color:#333;">账户余额</p>
          </div>
          <div class="infoBox float-right">
            {{payOrder.orderInfo.totalPrice}}USD
            <p style="font-size:1.2rem;color:#333;">待支付款</p>
          </div>
          <div v-if=" (payOrder.balance < payOrder.orderInfo.totalPrice)" style="clear:both;padding-top: 20%;">
            <b-button type="button">立即支付</b-button><b-link class="text-danger pl-2" @click="recharge()">余额不足，立马充值</b-link>
          </div>
          <div v-else-if="flag" style="clear:both;padding-top: 20%;">
            <b-button type="button">已超时</b-button><b-link class="text-danger pl-2">建议重新下单</b-link>
          </div>
          <div v-else style="clear:both;padding-top: 20%;">
            <b-button type="button" variant="success" @click="payment">立即支付</b-button>
          </div>
        </div>
      <b-modal id="payAddr" title="USDT充值" centered hide-footer>
        <div class="w100 text-center">
          <small class="">请将 USDT 充值到如下地址（扫描二维码获取地址）</small>
          <p class="my-4 text-center strong">{{payAddress}} 
            <b-button id="copyCode" v-clipboard:copy="payAddress" v-clipboard:success="onCopy" v-clipboard:error="onError" size="sm" variant="outline-primary">复制地址</b-button>
          </p>
          <b-img thumbnail fluid src="http://192.168.8.138:8090/getUstdTopUpQrCode" alt="USDT地址"></b-img>
        </div>
        <hr>
          <ul class="list-unstyled text-muted small text-monospace">
						<li class="font-weight-bold mb-1">温馨提示:</li>
            <li>• 上述地址是您的 USDT 专属充值地址，请勿向该地址充值任何非 USDT 资产，否则资产将不可找回。</li>
            <li>• 您充值至上述地址后，需要整个网络节点的确认, 一般需要30分钟-2小时，网络拥堵时可能会持续更长时间，请您耐心等待。</li>
            <li>• 充值是免费的，您充值多少到账多少；但最小充值额度为 0 USDT</li>
						<li>• 您的充值地址不会经常改变，可以重复充值；如有更改，我们会尽量通过网站公告或电话通知您。</li>
						<li>• 请务必确认电脑及浏览器安全，防止信息被篡改或泄露。</li>
					</ul>
      </b-modal>
        <!-- <b-modal id="payment" title="立即支付" ok-only ok-title="确认" ref="modal" @show="resetModal" @hidden="resetModal" @ok="handleOk">
          <form ref="form" @submit.stop.prevent="handleSubmit">
            <b-form-group :state="payState" label="支付账户编码：" label-for="name-input"  invalid-feedback="请输入支付账户编码" >
              <b-form-input id="name-input" v-model.trim="payId" :state="payState" required ></b-form-input>
            </b-form-group>
          </form>
        </b-modal> -->
      </div>
    </div>
  </div>
</template>

<script>
//https://www.zcool.com.cn/work/ZMTg2ODM0OTI=.html
import  { formateTimeStamp }  from '../../assets/js/countdown.js'
export default {
  name: 'payment',
  data(){
    return {
      payOrder: null, times: {}, countTxt: '', flag: false, payAddress: ''
    }
  },
  created: function(){
    // this.payOrder = JSON.parse(sessionStorage.getItem('slpOrder'))
    var that = this;
    this.$axios.post('order/orderPayInfo',this.$qs.stringify({ orderId:JSON.parse(sessionStorage.getItem('slpOrder')) }))
      .then(function (response) {
      if (response.status === 200) {
        var data = response.data;
        that.payOrder = data.content
        that.$nextTick(() => {
          that.mistiming();
        })
      }
    })
    .catch(function (error) {
      console.log(error)
    });
  },
  methods: { 
    payment() {
      var that = this;
      this.$axios.post('order/orderPay',this.$qs.stringify({ orderId:this.payOrder.orderInfo.orderId }))
        .then(function (response) {
        if (response.status === 200) {
          var data = response.data;
          if(data.content == "支付成功"){
            alert(data.content);
            that.$router.push({path:"/calBuy"})
          }else{
            alert(data.content);
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      });
    },
    mistiming() {//倒计时
      if(this.payOrder){
        var info = this.payOrder.orderInfo;
        var timeStamp = this.$myFuc.getTimestamp(info.orderEffectiveTime) - this.$myFuc.getTimestamp(info.orderTime);
        var nowTime = this.$myFuc.getTimestamp(Date.parse(new Date()));
      
        if(nowTime > this.$myFuc.getTimestamp(info.orderEffectiveTime)){this.countTxt = '订单超时未支付'; this.flag = true; return;}

        if(nowTime > this.$myFuc.getTimestamp(info.orderTime)){timeStamp = this.$myFuc.getTimestamp(info.orderEffectiveTime) - nowTime}//防止页面一直放着过几分钟刷新页面出现问题
        
        this.times = formateTimeStamp(timeStamp);
        const str = `订单将在计时结束后失效,请及时支付<mark>${this.times.hour}</mark>时<mark>${this.times.min}</mark>分<mark>${this.times.seconds}</mark>秒`
        this.countTxt = str;
        var TimeDown = setInterval(() => {
          if (timeStamp > 0) {
            timeStamp--;
            const newTime = formateTimeStamp(timeStamp);
            const str = `订单将在计时结束后失效,请及时支付<mark>${newTime.hour}</mark>时<mark>${newTime.min}</mark>分<mark>${newTime.seconds}</mark>秒`
            this.countTxt = str;
          } else {
            this.countTxt = '订单超时未支付'
            clearInterval(TimeDown);
          }
        }, 1000)
      }
    },
    recharge() {
      var that = this;
      this.$axios.post('ustdTopUp.do').then(function (response) {
        if (response.status === 200) {
          var data = response.data;
          // console.log(data)
          that.payAddress = data.content.address
          that.$root.$emit('bv::show::modal', 'payAddr')
        }
      })
      .catch(function (error) {
        console.log(error)
      });
    },
    onCopy: function (e) {
      alert('复制成功: ' + e.text)
    },
    onError: function (e) {
      alert('复制失败')
    }
  }
}
</script>

<style lang="scss">
  mark{ color:#e41529; padding: 2px 5px; border-radius:3px; background-color:#f2c7cb; font-weight: bold;margin: 0 2px; }
  .infoBox{ border: 1px dotted red; width: 9rem; height: 9rem; padding: 2.6rem 0; font-size: 2rem; border-radius: 50%; color: #e41529;
   font-weight: bold;display: inline-block;}
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
.payment{
  animation: main 1s;
  padding: 0;
  background-color: rgba(216, 209, 209, 0.2);
}
</style>
