<template>
<div>
  <b-card class="mb-3 border-0">
    <h6>账户资产<b-link class="float-right small" onclick="history.go(-1)">返回上一页</b-link></h6>
    <hr/>
    <div class="d-flex">
      <!-- <b-card class="mb-2 text-center" style="height:220px;">
        <b-img center  src="/static/img/user.png" fluid alt="默认用户头像" v-bind="mainProps"></b-img><hr>
        <p> {{ (username).substr(0, 3) + '****' + (username).substr(7) }} </p>
        <p class="small"> 最后登录时间：{{ lastLogin }} </p>
      </b-card> -->
      <div class="w100 flex-fill ml-3">
        <!-- <b-card-group deck class="mb-3">
          <b-card border-variant="primary" header-bg-variant="primary" header-text-variant="white" class="text-center">
            <b-card-text>BTC</b-card-text>
            <b-card-text>余额 0.00254</b-card-text>
          </b-card>

          <b-card border-variant="warning" header-bg-variant="warning" header-text-variant="white" class="text-center">
            <b-card-text>BCH</b-card-text>
            <b-card-text>余额 0.00254</b-card-text>
          </b-card>

          <b-card border-variant="success" header-bg-variant="success" header-text-variant="white" class="text-center">
            <b-card-text>EHC</b-card-text>
            <b-card-text>余额 0.00254</b-card-text>
          </b-card>

          <b-card border-variant="danger" header-bg-variant="danger" header-text-variant="white" class="text-center">
            <b-card-text>LTC</b-card-text>
            <b-card-text>余额 0.00254</b-card-text>
          </b-card>
        </b-card-group><hr> -->
        <!-- <p class="font-weight-bold">账户总资产：</p> -->
        <p class="font-weight-bold"><small class="text-muted">总资产折合</small> ≈ {{total}} USDT </p>
        <b-list-group class="mb-2">
          <b-list-group-item variant="primary" class="d-flex align-items-center mb-3 rounded-sm" v-for="(item,index) in assets" :key="index">
            <div class="mr-4 w-5 text-uppercase">{{item.coinType}}</div>
            <div class="border-left pl-4 w-75">
              <div class="w-100 text-uppercase d-inline-flex justify-content-around">
                <span class="mr-2">总资产：{{item.totalFee }}&nbsp;{{item.coinType}}</span> 
                <span class="mr-2">可用：{{item.balance }}&nbsp;{{item.coinType}}</span> 
                <span class="mr-2">冻结：{{item.freezeFee }}&nbsp;{{item.coinType}}</span>
              </div>
            </div>
            <div>
              <b-button size="sm" variant="primary" @click="payMoney" v-show="item.coinType == 'usdt'">充值</b-button>
              <b-button class="mx-3" size="sm" variant="primary" v-b-modal.mentionMoney v-show="item.coinType == 'usdt'">提币</b-button>
            </div>
          </b-list-group-item>
        </b-list-group><hr>
        <div>
          <b-tabs content-class="mt-3">
            <b-tab title="充值记录" active>
              <b-table hover sticky-header="392px" :items="items" :fields="fields" class="text-center shadow" show-empty head-variant="light">
              <template v-slot:head(accountStatus)>
                <b-form-select v-model="selected" class="payStatus" @change="getRechargeRecord" style="margin: -0.35rem;">
                  <b-form-select-option value="all">全部</b-form-select-option>
                  <b-form-select-option value="成功">成功</b-form-select-option>
                  <b-form-select-option value="待确认">待确认</b-form-select-option>
                </b-form-select>
              </template>
                <template v-slot:empty>
                  <b-alert show variant="secondary" class="text-center">暂无数据！</b-alert>
                </template> 
              </b-table>
            </b-tab>
            <b-tab title="提币记录" @click.once="withdrawRecord">
              <b-table hover sticky-header="392px" :items="items1" :fields="fields1" class="text-center shadow" show-empty head-variant="light">
                <template v-slot:head(accountStatus)>
                  <b-form-select v-model="selected1" class="payStatus" @change="withdrawRecord" style="margin: -0.35rem;">
                    <b-form-select-option value="all">全部</b-form-select-option>
                    <b-form-select-option value="成功">成功</b-form-select-option>
                    <b-form-select-option value="待确认">待确认</b-form-select-option>
                  </b-form-select>
                </template>
                <template v-slot:empty>
                  <b-alert show variant="secondary" class="text-center">暂无数据！</b-alert>
                </template> 
              </b-table>
            </b-tab>
          </b-tabs>
        </div>
        <!-- Info modal -->
        <b-modal id="mentionMoney" title="提币" centered ok-only @hide="getMoney()">
          <b-form>
            <b-form-group label="提取数量：" label-for="moneyNum">
              <b-form-input v-model.trim="moneyNum" id="moneyNum"></b-form-input>
            </b-form-group>
          </b-form>
        </b-modal>
        <!-- Info modal -->
        <b-modal id="recharge" title="USDT充值" centered hide-footer>
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
      </div>
    </div>
  </b-card>
</div>
</template>
<style lang="scss" scoped>
.w-5{width:5%} .w-90{width:90%;}
.payStatus{ border: none; padding: 0; font-weight: bold; color:#495057; background-color: #e9ecef; }  
  /deep/ {
    .nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link{color:#007bff; border: none; outline: none; border-bottom: 1px solid #007bff;font-weight: bold;}
    .nav-tabs .nav-link{color:#343a40;transition: border-bottom .5s;padding:12px 20px;}
    .nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus{color:#007bff; border: none; outline: none; border-bottom: 1px solid #007bff;font-weight: bold;}
    .custom-select:focus{box-shadow: none;}
  }
</style>
<script>
export default{
  name: 'myBalance',
  data(){
    return {
      moneyNum:'', payAddress:'', //lastLogin:sessionStorage.getItem('slpLoginTime'), 
      assets:[],total:'',selected:'all',selected1:'all',
      mainProps: { width: 80, height: 80, class: 'm1' },items:[],items1:[],
      fields:[ { key: 'txid', label: '交易ID' }, { key: 'balance', label: '数量' }, { key: 'accountType', label: '类型' }, { key: 'createTime', label: '时间' }, { key: 'accountStatus', label: '状态' } ],
      fields1:[ { key: 'txid', label: '交易ID' }, { key: 'balance', label: '数量' }, { key: 'accountType', label: '类型' }, { key: 'createTime', label: '时间' }, { key: 'accountStatus', label: '状态' } ]
    }
  },
  created:function(){
    this.getInfo();this.getRechargeRecord()
  },
  methods: {
    getMoney(){
      if(this.moneyNum == ''){return;}
      var that = this;
      this.$axios.post('mentionMoney.do',this.$qs.stringify({quantity:this.moneyNum})).then(function (response) {
        if (response.status === 200) {
          var data = response.data;
          alert(data.content);
          that.getInfo()
        }
      })
      .catch(function (error) {
        console.log(error)
      });
    },
    getInfo(){
      var that = this;
      this.$axios.post('getUserTotalAssets.do').then(function (response) {
        if (response.status === 200) {
          var data = response.data;
          that.assets = data.content.data;
          that.total = data.content.totalAsset;
        }
      })
      .catch(function (error) {
        console.log(error)
      }); 
    },
    getRechargeRecord(){
      var that = this;
      this.$axios.post('getUserRechargeRecord.do',this.$qs.stringify({accountStatus:this.selected})).then(function (response) {
        if (response.status === 200) {
          var data = response.data;
          that.items = data.content;
        }
      })
      .catch(function (error) {
        console.log(error)
      }); 
    },
    payMoney(){
      var that = this;
      this.$axios.post('ustdTopUp.do').then(function (response) {
        if (response.status === 200) {
          var data = response.data;
          that.payAddress = data.content.address;
          that.$root.$emit('bv::show::modal', 'recharge')
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
    },
    withdrawRecord() {
      var that = this;
      this.$axios.post('/getUserMentionMoneyRecord.do',this.$qs.stringify({accountStatus:this.selected1}))
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
