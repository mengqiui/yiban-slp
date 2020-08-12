<template>
	<div style="min-height:661px;">
    <div class="small mb-2">
      <b-link class="mr-2" @click="$router.go(-1)"><b-icon icon="chevron-left"></b-icon> 返回</b-link><span class="text-secondary mx-1">丨</span>
      <span class="text-secondary">对应订单编号：<b-link class="text-order" :to="{ name: 'Orderdetail', params: {orderId: $route.params.orderId} }" >{{$route.params.orderId}}</b-link></span>
    </div>
    <div class="bg-dark d-flex text-light p-3">
      <div class="d-flex flex-column px-2 py-2 text-center border-right border-secondary" style="width:245px">
        <small class="text-white-50">算力状态</small>
        <!-- 状态（100028 运行中, 100029 待生效, 100031 暂停中, 100030 已终止） -->
        <div class="px-3 pt-4 info-text" v-if="list.status=='100028'">
          <b-iconstack font-scale="1.4" animation="spin" class="align-bottom">
            <b-icon stacked icon="lightning-fill" variant="success" scale="0.4" shift-v="-0.35"></b-icon>
            <b-icon stacked icon="arrow-repeat" variant="success"></b-icon>
          </b-iconstack>
          <span class="text-success">{{$myFuc.getDict(list.status,"id")}}</span>
        </div>
        <div class="px-3 pt-4 info-text" v-else-if="list.status=='100029'">
          <b-icon icon="clock" variant="primary" font-scale="1.3" animation="spin" class="align-bottom"></b-icon>
          <span class="text-primary">{{$myFuc.getDict(list.status,"id")}}</span>
        </div>
        <div class="px-3 pt-4 info-text" v-else-if="list.status=='100031'">
          <b-icon icon="stopwatch" variant="warning" font-scale="1.3" class="align-bottom"></b-icon>
          <span class="text-warning">{{$myFuc.getDict(list.status,"id")}}</span>
        </div>
        <div class="px-3 pt-4 info-text" v-else-if="list.status=='100030'">
          <b-icon icon="power" variant="danger" font-scale="1.3" class="align-bottom"></b-icon>
          <span class="text-danger">{{$myFuc.getDict(list.status,"id")}}</span>
        </div>
      </div>
      <div class="d-flex justify-content-around  flex-grow-1">
        <div class="d-flex flex-column px-2 py-2 text-center">
          <small class="text-white-50">已运行时长</small>
          <div class="px-3 pt-4 info-text">{{list.runDays}}天</div>
        </div>
        <div class="d-flex flex-column px-2 py-2 text-center">
          <small class="text-white-50">矿机</small>
          <div class="px-3 pt-4 info-text">{{list.minerName}}</div>
        </div>
        <div class="d-flex flex-column px-2 py-2 text-center">
          <small class="text-white-50">算力信息</small>
          <div class="px-3 pt-4 info-text">{{list.productInfo}}</div>
        </div>
        <div class="d-flex flex-column px-2 py-2 text-center">
          <small class="text-white-50">产品周期</small>
          <div class="px-3 pt-4">
            <p>开始时间：{{list.effectiveBeginTime}}<br/>结束时间：{{list.effectiveEndTime}}</p>
          </div>
        </div>
      </div>
    </div>
    <div>
      <b-tabs content-class="mt-3">
        <b-tab title="算力管理" active>
          <b-list-group>
            <b-list-group-item class="text-muted p-4 align-middle">
              <span class="force-item">当前矿池：</span>
              <span class="text-dark force-info">{{force.poolName}}</span>
              <b-button variant="outline-primary" v-b-modal.setPool>切换矿池</b-button>
            </b-list-group-item>
            <b-list-group-item class="text-muted p-4 align-middle">
              <span class="force-item">地址：</span>
              <span class="text-dark force-info">{{force.coinAddress||'暂无地址'}}</span>
              <b-button variant="outline-primary" v-b-modal.setAddr>切换地址</b-button>
            </b-list-group-item>
            <b-list-group-item class="text-muted p-4 align-middle">
              <span class="force-item">剩余电费：</span>
              <span class="text-dark force-info">{{force.remainDays}}天</span>
              <b-button variant="outline-primary"  v-if="(list.status=='100028')||(list.status=='100031')"
               :to="{ name: 'myPower', params: { orderId: $route.params.orderId } }">续交电费</b-button>
            </b-list-group-item>
            <b-list-group-item class="text-muted p-4 align-middle">
              <span class="force-item">自动续费：</span>
              <span class="text-dark force-info">开启开关，电费将余额中自动扣除</span>
              <b-form-checkbox class="text-dark d-inline" v-model="open" switch variant="dark" @change="autoPay"></b-form-checkbox>
            </b-list-group-item>
          </b-list-group>
        </b-tab>
        <b-tab title="产出记录" @click.once="profitRecord">
          <b-table responsive sticky-header="392px" :items="items" :fields="fields" class=" text-center" show-empty head-variant="light">
            <template v-slot:empty>
              <b-alert show variant="secondary" class="text-center">暂无数据！</b-alert>
            </template> 
          </b-table>
        </b-tab>
        <b-tab title="续电记录" @click.once="withdrawRecord">
          <b-table responsive sticky-header="392px" :items="items1" :fields="fields1" class=" text-center" show-empty head-variant="light">
            <template v-slot:empty>
              <b-alert show variant="secondary" class="text-center">暂无数据！</b-alert>
            </template> 
          </b-table>
        </b-tab>
      </b-tabs>
    </div>
    <!-- 切换矿池 -->
    <b-modal id="setPool" title="切换矿池" centered ok-only ok-variant="dark" @show="resetPool" @hidden ="resetPool" @ok="switchPool()">
      <div class="text-center" v-if="pools">
        <b-form-radio-group v-model.trim="poolName" :options="pools" text-field="poolName" value-field="poolName" buttons button-variant="outline-dark"></b-form-radio-group>
      </div>
      <div v-else> <p>暂无可切换矿池！</p> </div>
    </b-modal>

    <!-- 切换地址 -->
    <b-modal id="setAddr" title="切换地址" ref="addrModal" size="sm" centered ok-only @show="resetAddr" @hidden ="resetAddr" @ok="addrOk" ok-variant="dark">
      <form ref="addrForm" @submit.stop.prevent="switchAddr">
        <b-form-input id="newAddr" required validated v-model.trim="newAddr" :state="addrState" aria-describedby="input-live-help input-live-feedback" placeholder="请输入新地址"></b-form-input>
        <b-form-invalid-feedback id="input-live-feedback">请输入正确的收币地址</b-form-invalid-feedback>
      </form>
    </b-modal>
  </div>
</template>

<style lang="scss" scoped>
.text-order{font-size:1rem;color:#666768;}
.info-text{font-size:1.6rem;}
.force-item{width:20%;display: inline-block;}
.force-info{width:50%;text-align: left;display: inline-block;}
  /deep/ {
    .nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link{color:#007bff; border: none; outline: none; border-bottom: 1px solid #007bff;font-weight: bold;}
    .nav-tabs .nav-link{color:#343a40;transition: border-bottom .5s;padding:12px 20px;}
    .nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus{color:#007bff; border: none; outline: none; border-bottom: 1px solid #007bff;font-weight: bold;}
  }
</style>

<script>
export default{
  name: 'Mforce',
  data(){
    return{
      list:[],force:{},open:false,pools:null,poolName:null, newAddr:null, addrState:null, items:[], items1:[],
      fields:[ { key: 'settlementDate', label: '时间' }, { key: 'revenueNumber', label: '产出' }, { key: 'minerPool', label: '矿池' } ],
      fields1:[  { key: 'electricId', label: '对应电费订单ID' }, { key: 'electricityDays', label: '电费支付天数' }, { key: 'createTime', label: '续电时间' }, { key: 'electricStatus', label: '电费状态' } ]
    }
  },
  created:function(){
    var that = this;
    // 头部订单信息
    this.$axios.post('/showHashrate.do',this.$qs.stringify({ orderId:this.$route.params.orderId,coinType:'BTC' }))
    .then(function (response) {
      if (response.status === 200) {
        var data = that.$qs.parse(response.data);
        that.list = data.content;
        //console.log(that.list)
      }
    })
    .catch(function (error) {
      console.log(error)
    });
    that.getForceInfo();
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
  },
  methods:{
    getForceInfo() {
      var that = this;
      // 算力管理产品信息
      this.$axios.post('/queryHashrateManager.do',this.$qs.stringify({ orderId:this.$route.params.orderId,coinType:'BTC' }))
      .then(function (response) {
        if (response.status === 200) {
          var data = that.$qs.parse(response.data);
          that.force = data.content;
          that.open = Boolean(data.content.electricityBillType)
          that.poolName = data.content.poolName
        } 
      })
      .catch(function (error) {
        console.log(error)
      });
    },
    resetPool() {
      this.poolName = this.force.poolName
    },
    switchPool() {
      var that = this;
      // 切换矿池
      this.$axios.post('/switchPool.do',this.$qs.stringify({ orderId:that.$route.params.orderId, poolName:that.poolName }))
      .then(function (response) {
        if (response.status === 200) {
          var data = that.$qs.parse(response.data);
          alert(data.content);
          that.getForceInfo();
        }
      })
      .catch(function (error) {
        console.log(error)
      });
    },
    checkFormValidity() {
      var reg = new RegExp(/^[0-9a-zA-Z]*$/g);
      if(!this.newAddr){ this.addrState = false; return false; }
      else if(!reg.test(this.newAddr)){ this.addrState = false; return false; }
      else{this.addrState = true; return true;}
    },
    resetAddr() {
      this.newAddr = ''
      this.addrState = null
    },
    addrOk(bvModalEvt) {
      bvModalEvt.preventDefault();
      this.switchAddr()
    },
    switchAddr() {
      var that = this;
      if (!this.checkFormValidity()) {
        return
      }
      // 切换收币地址    
      this.$axios.post('/switchCoinAddress.do',this.$qs.stringify({ orderId:that.$route.params.orderId, coinAddress:that.newAddr }))
      .then(function (response) {
        if (response.status === 200) {
          var data = that.$qs.parse(response.data);
          alert(data.content);
          that.getForceInfo();
        }
      })
      .catch(function (error) {
        console.log(error)
      });
      this.$nextTick(() => {
        this.$bvModal.hide('setAddr')
      })
    },
    autoPay() {
      var textInfo = this.open?'正在关闭自动续费':'确认开启自动续费';
      this.$bvModal.msgBoxConfirm( '订单：'+this.$route.params.orderId, {
        title: textInfo,
        size: 'sm',
        buttonSize: 'sm',
        okVariant: 'outline-primary',
        okTitle: '确认',
        cancelTitle: '取消',
        cancelVariant: 'outline-dark',
        footerClass: 'p-2 justify-content-around',
        hideHeaderClose: false,
        centered: true
      })
      .then(value => {
        if(value){ this.setAuto() }
        else{this.getForceInfo();}
      })
      .catch(err => {
        alert(err)
      })
    },
    setAuto(){
      var that = this;
      this.$axios.post('/ifAutoWithdrawElectric.do',this.$qs.stringify({ orderId:that.$route.params.orderId, electricityBillType:this.open?1:0 }))
      .then(function (response) {
        if (response.status === 200) {
          var data = that.$qs.parse(response.data);
          alert(data.content);
          that.getForceInfo();
        }
      })
      .catch(function (error) {
        console.log(error)
      });
    },
    profitRecord() {
      var that = this;
      this.$axios.post('/profitRecord.do',this.$qs.stringify({ coinType:'BTC', orderId:this.$route.params.orderId, isAll:'0' }))
      .then(function (response) {
        if (response.status === 200) {
          var data = that.$qs.parse(response.data);
          that.items = data.content;
        }
      })
      .catch(function (error) {
        console.log(error)
      });
    },
    withdrawRecord() {
      var that = this;
      this.$axios.post('/withdrawRecord.do',this.$qs.stringify({orderId:this.$route.params.orderId}))
      .then(function (response) {
        if (response.status === 200) {
          var data = that.$qs.parse(response.data);
          that.items1 = data.content;
        }
      })
      .catch(function (error) {
        console.log(error)
      });
    }
  }
}
</script>
