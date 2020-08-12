<template>
	<b-card class="border-0" style="height:660px;">
    <h6 class="text-dark">订单详情 <b-link class="float-right small text-decoration-none" @click="$router.go(-1)">返回上一页</b-link> </h6><hr/>
    <div class="d-flex justify-content-around">
      <div class="text-muted">下单时间<p class="text-dark">{{items.orderTime}}</p></div>
      <div class="text-muted">订单ID<p class="text-dark">{{items.orderId}}</p></div>
      <div class="text-muted ">订单状态
        <div class="font-weight-bold text-dark h5" v-if="items.orderStatus =='100018'">
          <p>{{$myFuc.getDict(items.orderStatus,"id")}}
          <b-button variant="primary" size="sm" :to="{path:'/payment'}">继续支付</b-button>
          <b-button variant="outline-dark" size="sm" @click="cancelOrder">取消订单</b-button></p>
          <div class="small payTips float-right">
            <b-icon icon="exclamation-circle"></b-icon>
            <span v-html="countTxt">您还有72：00：00来支付，超时订单将自动关闭。</span>
          </div>
        </div>
        <div class="font-weight-bold text-dark h5" v-else-if="items.orderStatus == '100021'">
          <p>{{$myFuc.getDict(items.orderStatus,"id")}}</p>
          <div class="small payTips float-right">
            <b-icon icon="exclamation-circle"></b-icon>
            <span>{{items.remarks}}</span>
          </div>
        </div>
        <div class="font-weight-bold text-dark h5" v-else>
          <p>{{$myFuc.getDict(items.orderStatus,"id")}}</p> 
        </div>
      </div>
    </div>
    <hr>
    <div style="height:420px;">
      <p class="font-weight-bold">商品信息</p>
      <b-list-group-item class="d-flex justify-content-between align-items-center">
        <div class="text-secondary small">商品名称：</div>
        <div>{{ items.minerName +' ( '+items.buyNum+'T '+ items.contractPeriod+ '天 +' + items.electricityDays +' 天电费 )' }}</div>
      </b-list-group-item>
      <b-list-group-item class="d-flex justify-content-between align-items-center">
        <div class="text-secondary small">购买数量：</div>
        <div>{{ items.buyNum }} T</div>
      </b-list-group-item>
      <b-list-group-item class="d-flex justify-content-between align-items-center">
        <div class="text-secondary small">缴纳电费天数：</div>
        <div>{{ items.electricityDays }} 天</div>
      </b-list-group-item>
      <b-list-group-item class="d-flex justify-content-between align-items-center">
        <div class="text-secondary small">订单编号：</div>
        <div>{{ items.orderId }}</div>
      </b-list-group-item>
      <b-list-group-item class="d-flex justify-content-between align-items-center">
        <div class="text-secondary small">订单来源：</div>
        <div>{{ $myFuc.getDict(items.orderType,"id") }}</div>
      </b-list-group-item>
      <b-list-group-item class="d-flex justify-content-between align-items-center">
        <div class="text-secondary small">订单总额：</div>
        <div>{{ items.totalPrice }} USD</div>
      </b-list-group-item>
    </div>
	</b-card>
</template>
<style lang="scss" scoped>
  mark{ color:#e41529; padding: 2px 5px; border-radius:3px; background-color:#f2c7cb; font-weight: bold;margin: 0 2px; }
  .payTips{ width: max-content; background:#f2e6e6; padding: 10px; border: 1px solid #f56c6c; color:#dc3545;border-radius: 3px;}
</style>
<script>
import  { formateTimeStamp }  from '../../assets/js/countdown.js'
  export default{
    name: 'Orderdetail',
    data() {
      return {
        items:{}, times: {}, countTxt: '', flag: false
      }
    },
    created: function(){
      this.getInfo()
    },  
    methods: {    
      mistiming() {//倒计时
        var info = this.items;console.log(this.items);
        var timeStamp = this.$myFuc.getTimestamp(info.orderEffectiveTime) - this.$myFuc.getTimestamp(info.orderTime);
        var nowTime = this.$myFuc.getTimestamp(Date.parse(new Date()));
      
        if(nowTime > this.$myFuc.getTimestamp(info.orderEffectiveTime)){this.countTxt = '订单超时未支付'; this.flag = true; return;}

        if(nowTime > this.$myFuc.getTimestamp(info.orderTime)){timeStamp = this.$myFuc.getTimestamp(info.orderEffectiveTime) - nowTime}//防止页面一直放着过几分钟刷新页面出现问题
        
        this.times = formateTimeStamp(timeStamp);
        const str = `您还有${this.times.hour}时${this.times.min}分${this.times.seconds}秒来支付，超时订单将自动关闭。`
        this.countTxt = str;
        var TimeDown = setInterval(() => {
          if (timeStamp > 0) {
            timeStamp--;
            const newTime = formateTimeStamp(timeStamp);
            const str = `您还有${newTime.hour}时${newTime.min}分${newTime.seconds}秒来支付，超时订单将自动关闭。`
            this.countTxt = str;
          } else {
            this.countTxt = '订单超时未支付'
            clearInterval(TimeDown);
          }
        }, 1000)
      },
      cancelOrder() {
        var that = this;
        this.$axios.post('/order/cancelOrder',this.$qs.stringify({orderId:this.$route.params.orderId})).then(function (response) {
          if (response.status === 200) {
            var data = response.data;
            alert(data.content)
            that.getInfo()
          }
        })
        .catch(function (error) {
          console.log(error)
        });
      },
      getInfo(){
        var that = this;
        this.$axios.post('/order/getOrderInfoByOrderId',this.$qs.stringify({orderId:this.$route.params.orderId})).then(function (response) {
          if (response.status === 200) {
            var data = response.data;
            that.items = data.content;
            var dataObj = data;
            // dataObj.content.productName = that.items.minerName +' ( '+that.items.buyNum+'T '+ that.items.contractPeriod+ '天 +' + that.items.electricityDays +' 天电费 )';
            sessionStorage.setItem('slpOrder',JSON.stringify(data.content.orderId))
            that.$nextTick(() => {
              that.mistiming();
            })
          }
        })
        .catch(function (error) {
          console.log(error)
        });
      }
    }
  }
</script>
