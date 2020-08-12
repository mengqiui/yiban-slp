<template>
  <div class="col-lg-8 offset-lg-2 rounded my-3 bgcolor orderForm">
    <div class="form-box p-4">
      <h5 class="text-dark">订单信息 <b-link class="float-right small text-decoration-none" @click="$router.go(-1)">返回上一页</b-link> </h5>
      <hr/>
      <b-overlay :show="!Boolean(list)" rounded="sm" :opacity="0.9" spinner-variant="warning" spinner-type="grow" style="min-height:456px;">
        <b-jumbotron class="text-black bg-order" v-if="list">
          <form @submit.prevent="onsubmit" class="needs-validation">
            <b-form-group label-cols="6" label-cols-lg="2" label="币种" class="offset-lg-3">
              <p class="h5 text-uppercase">{{(list.coinType)||'未知'}}</p>
              <!-- <b-form-select v-model="selected" :options="options" value-field="value"></b-form-select> -->
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="机型" class="offset-lg-3">
              <p class="h5">{{list.productName}}</p>
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="算力" class="offset-lg-3">
              <b-input-group class="col-lg-4 p-0" :append="list.unit+'H/S'">
                <b-form-input :value="list.productScale" disabled></b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="周期" class="offset-lg-3">
              <b-input-group class="col-lg-4 p-0" :append="'天'">
                <b-form-input :value="list.contractPeriod" disabled></b-form-input>
              </b-input-group>
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="延长天数" class="offset-lg-3" v-if="giftList">
              <b-form-select v-model="gifts" :options="giftList" value-field="id" html-field="coupon_name" class="col-lg-4">
                <b-form-select-option :value="null" >请选择可用的礼品券</b-form-select-option>
                <!-- <b-form-select-option :value="item.id" v-for="item in giftList" :key="item.id">{{item.coupon_name}}</b-form-select-option> -->
              </b-form-select>
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="延长天数" class="offset-lg-3" v-else>
              <b-form-select v-model="gifts" class="col-lg-4">
                <b-form-select-option :value="null" >暂无可用的礼品券</b-form-select-option>
              </b-form-select> 
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="矿池" class="offset-lg-3" v-if="pools">
              <b-form-radio-group class="col-lg-6 p-0" v-model.trim="poolId" :options="pools" v-validate="{ required: true }" name="poolId" text-field="poolName" value-field="poolId" buttons 
              data-vv-as="矿池" :class="{'input': true, 'border-danger': errorBags.has('poolId') }" button-variant="outline-secondary"></b-form-radio-group>
              <p v-show="errorBags.has('poolId')" class="text-danger">{{ errorBags.first('poolId') }}</p>
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="收款方式" class="offset-lg-3">
              <div class="border border-secondary text-secondary rounded col-lg-6 p-2 mt-1">打款至个人钱包账户</div>
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" :label="(list.coinType)||'未知'+'收币地址'" class="offset-lg-3 text-uppercase">
              <b-card class="col-lg-6">
                <!-- <b-form-radio-group v-model="coinAddr" :options="addrList" buttons name="radios-btn-default" ></b-form-radio-group> -->
                <b-button variant="outline-secondary" class="text-uppercase" v-b-modal.addCoin><b-icon icon="plus"></b-icon>添加新的{{(list.coinType)||'未知'}}地址</b-button>
                <b-modal id="addCoin" title="添加提币地址">
                  <b-form>
                    <b-form-group label="新收币地址：" label-for="coinAddr" >
                      <b-form-input v-model="coinAddr" type="text" placeholder="请输入收币地址" id="coinAddr"></b-form-input>
                    </b-form-group>
                    <b-form-group label="手机验证码：" label-for="telCode" class="position-relative">
                      <b-form-input v-model="telCode" placeholder="请输入验证码" id="telCode"></b-form-input>
                    </b-form-group>
                  </b-form>
                </b-modal>
              </b-card>
            </b-form-group><hr/>
            <b-form-group label-cols="6" label-cols-lg="2" label="算力费" class="offset-lg-3">
              <p class="h4">$&nbsp;{{list.unitPrice}}</p>
            </b-form-group><hr/>
            <b-form-group label-cols="6" label-cols-lg="2" label="电费交纳天数" class="offset-lg-3">
              <b-form-input name="electricityDays" class="col-lg-4" placeholder="请输入购买天数（≥10）" v-model.trim="electricityDays" v-validate="{ required: true , min_value: 10, regex: /^[0-9]+$/ }" 
              :class="{'input': true, 'border-danger': errorBags.has('electricityDays') }" data-vv-as="电费交纳天数"></b-form-input>
              <span v-show="errorBags.has('electricityDays')" class="text-danger">{{ errorBags.first('electricityDays') }}</span>
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="是否开启自动续费" class="offset-lg-3">
              <b-form-checkbox class="col-lg-4 mt-1" size="lg" v-model="open" switch variant="dark"></b-form-checkbox>
            </b-form-group> 
            <b-form-group label-cols="6" label-cols-lg="2" label="电费" class="offset-lg-3">
              <p class="h4">$&nbsp;{{(list.powerFare*electricityDays*list.productScale).toFixed(2)}} <span class="text-secondary small"> = ${{list.powerFare}}/T/天 × {{list.productScale}}{{list.unit}} × {{electricityDays}}天</span></p>
            </b-form-group> 
            <b-form-group label-cols="6" label-cols-lg="2" label="商品金额" class="offset-lg-3">
              <p class="h4">$&nbsp;{{list.powerFare*electricityDays*list.productScale+list.unitPrice}}</p>
            </b-form-group>  
            <div class="col-lg-5 offset-lg-3 my-5 px-0">
              <p class="text-danger">{{tips}}</p>
              <b-button class="btn-block py-3" type="submit" variant="outline-secondary">确认下单</b-button>
              <b-form-checkbox class="text-center my-3" v-model="accept">我接受 <router-link target="_blank" to="/articles/rule">《算力派产品购买协议》</router-link> </b-form-checkbox>
            </div>
            <b-form-group label-cols="6" label-cols-lg="2" label="" class="offset-lg-3">
            </b-form-group> 
        </form>
        <div class="my-4 bg-order">
          <div class="payment-notice">
            <div class="sub-amount">注意事项:</div> 
            <div class="notice-item">
              <h4 class="rubik-medium">法律声明</h4> 
              <div class="tips-text">矿机共享共享服务在以下国家或地区被禁止:巴尔干半岛、白俄罗斯、缅甸、科特迪瓦(象牙海岸)，克里米亚-乌克兰、古巴、刚果民主共和国、伊朗、伊拉克、利比里亚、朝鲜、苏丹、叙利亚、委内瑞拉、津巴布韦、中国香港和中国大陆。请确认矿机共享服务在您的国家或地区是合法的。否则，您将承担一切法律后果。</div>
            </div>
            <div class="notice-item"><h4 class="rubik-medium">无法退款</h4> <div class="tips-text">按照协议规定，一旦订单已付款，将不支持退款。</div></div>
            <div class="notice-item"><h4 class="rubik-medium">定价规则</h4> <div class="tips-text">矿机共享套餐的定价会根据数字货币价格等多因素调整。实际购买价格以用户付款时为准，后续即使价格发生变化，Suanlipai也不会对这个订单进行差价补偿。</div></div>
            <div class="notice-item"><h4 class="rubik-medium">算力波动说明</h4> <div class="tips-text">Suanlipai提供的套餐对应的为真实算力，真实算力由于网络、矿机功率等不稳定因素会导致波动，Suanlipai不承诺100%稳定运行。</div></div>
            <div class="notice-item"><h4 class="rubik-medium">不可控风险声明</h4> <div class="tips-text">Suanlipai不对以下不可控风险所造成的损失负责：不能预见、不能避免或不能克服的客观事件，包括自然灾害如洪水、火山爆发、地震、山崩、火灾、被中国政府部门评定为百年不遇级别以上的风暴和恶劣气候等，政府行为和政府指令，城市级别的电网供电事故，以及社会异常事件如战争、罢工、动乱等。</div></div>
            <div class="notice-item"><h4 class="rubik-medium">使用范围声明</h4> <div class="tips-text">用户不得将Suanlipai提供的算力用于攻击网络等违法违规行为，否则Suanlipai有权强行收回您的算力。</div></div>
          </div>
        </div>
        </b-jumbotron>
      </b-overlay>
    </div>
  </div>
</template>

<script>
export default {
  name: 'orderForm',
  data() {
    return {
      list:null,gifts:null,giftList:'',poolId:2,pools:null,coinAddr:null,telCode:null,electricityDays:10,tips:null,open:false,accept:false
    };
  },
  created: function(){
    var that = this;
    // 获取算力产品信息
    this.$axios.post('product/getProductInfo',this.$qs.stringify({ productCode:this.$route.params.userId }))
    .then(function (response) {
      if (response.status === 200) {
        var data = that.$qs.parse(response.data);
        that.list = data.content;
      }
    })
    .catch(function (error) {
      console.log(error)
    });

    // 获取合约矿池列表
    this.$axios.post('order/selectMinerPool')
    .then(function (response) {
      if (response.status === 200) {
        var data = that.$qs.parse(response.data).content;
        that.pools = data;
      }
    })
    .catch(function (error) {
      console.log(error)
    });

    // 获取礼品券列表
    this.$axios.post('product/getProductCoupon')
    .then(function (response) {
      if (response.status === 200) {
        var data = that.$qs.parse(response.data).content;
        if(data.length==0){that.giftList = '';}
        else{that.giftList = data;}
      }
    })
    .catch(function (error) {
      console.log(error)
    });
  },
  methods: {
    onsubmit(){
      if(!this.accept){alert('请先阅读购买协议！');return}
      var that = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$axios.post('order/insertOrderInfo',
          this.$qs.stringify({ productCode: this.$route.params.userId, buyNum: this.list.productScale, orderType:'100023', unit: this.list.unit, electricityDays: this.electricityDays,
          poolId: this.poolId, electricityBillType: this.open ? 1 : 0, preferentialDays:this.gifts }))
          .then(function (response) {
            if (response.status === 200) {
              var data = that.$qs.parse(response.data)
              // that.tips = data.content;  下单订单生成状态提醒
              if(data.content.message == "下单成功，请尽快支付"){
                // var dataObj = data;
                // dataObj.content.productName = that.list.productName;
                sessionStorage.setItem('slpOrder',JSON.stringify(data.content.orderInfo.orderId))
                that.resetSetItem('slpNotice',Number(sessionStorage.getItem('slpNotice'))+1)
                that.$router.push({ path:'/payment' });
              }else{
                alert(data.content);that.$router.push({ path:'/calBuy' });
              }
            }
          })
          .catch(function (error) {
            console.log(error)
          });
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.bgcolor{ background-color:rgb(240, 240, 240) !important; color:#595a5a; }
.bg-order{ background-color:rgb(255, 249, 249) !important; }
  @keyframes main {
  0% {
    opacity:0;
    transform:translateY(50px) translateZ(0);
  }
  100% {
    opacity:1;
    transform:translateY(0) translateZ(0);
  }
}
.orderForm{
  animation: main 1s;
  padding: 0;
  background-color: rgba(216, 209, 209, 0.2);
  .payment-notice{
    background: rgba(242, 241, 241, 0.35);
    border: 1px solid #eee;
    padding: 30px;
    .sub-amount{color: #999;}
    .notice-item {
    margin-top: 15px;
    h4 {
    font-size: 16px;
    font-weight: 400;
    color: #1c1f28;
    margin-bottom: 4px;
}
    .rubik-medium {
      font-weight: 700!important;
    }
}
  }
}
</style>
