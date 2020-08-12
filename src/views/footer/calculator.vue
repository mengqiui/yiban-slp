<template>
  <div class="container-fluid">
    <div style="width:1200px;" class="my-3 mx-auto">
      <b-overlay :show="!Boolean(data)" rounded="sm" :opacity="0.9" spinner-variant="warning" spinner-type="grow">
        <b-card title="计算器" class="text-center"><hr>
          <b-alert show variant="warning" class="d-inline-flex justify-content-around" style="width:1000px;">
            <span>全网难度: {{(data.networkDiff)||'0'}}</span><span>全网算力: {{(data.networkCalc+data.networkCalcUnit)||'0'}}H/S</span><span>BTC/USD: {{(data.btcToUsd)||'0'}}</span>
          </b-alert>
          <div>
            <form @submit.prevent="onsubmit" class="needs-validation d-inline-block align-top my-4" style="width:580px;">
              <b-form-group label-cols="6" label-cols-md="4" label="产品周期">
                <b-input-group class="col-md-8 p-0" :append="'天'">
                  <input-number :controls="false" :min="1" v-model="period" class="inputNum"></input-number>
                  <!-- <b-form-input type="number" min="0" v-model="period"></b-form-input> -->
                </b-input-group>
              </b-form-group>
              <b-form-group label-cols="6" label-cols-md="4" label="算力">
                <b-input-group class="col-md-8 p-0" :append="'TH/S'">
                  <input-number :controls="false" :min="1" v-model="hashrate" class="inputNum"></input-number>
                  <!-- <b-form-input type="number" min="0" v-model="hashrate"></b-form-input> -->
                </b-input-group>
              </b-form-group>
              <b-form-group label-cols="6" label-cols-md="4" label="算力费">
                <b-input-group class="col-md-8 p-0" :append="'$'">
                  <input-number :controls="false" :min="1" v-model="calFee" class="inputNum"></input-number>
                  <!-- <b-form-input type="number" min="0" v-model="calFee"></b-form-input> -->
                </b-input-group>
              </b-form-group>
              <b-form-group label-cols="6" label-cols-md="4" label="">
                <b-input-group class="col-md-8 p-0">
                  <b-card-text>{{(calFee/data.btcToUsd).toFixed(8)}} BTC</b-card-text>
                </b-input-group>
              </b-form-group>
              <b-form-group label-cols="6" label-cols-md="4" label="电费">
                <b-input-group class="col-md-8 p-0" :append="'$/T/天'">
                  <input-number :controls="false" :min="0.001" v-model="electricity" class="inputNum"></input-number>
                  <!-- <b-form-input type="number" min="0" v-model="electricity"></b-form-input> -->
                </b-input-group>
              </b-form-group>
              <b-form-group label-cols="6" label-cols-md="4" label="">
                <b-input-group class="col-md-8 p-0">
                  <b-card-text>{{(electricity/data.btcToUsd).toFixed(8)}} BTC</b-card-text>
                </b-input-group>
              </b-form-group>
              <b-form-group label-cols="6" label-cols-md="4" label="首次交电天数">
                <b-input-group class="col-md-8 p-0" :append="'天'">
                  <input-number :controls="false" :min="0" v-model="firstDays" class="inputNum"></input-number>
                  <!-- <b-form-input type="number" min="0" v-model="firstDays"></b-form-input> -->
                </b-input-group>
              </b-form-group>
              <!-- <b-form-group label-cols="6" label-cols-md="4">
                <b-input-group class="col-md-8 p-0">
                  <b-button variant="primary" block @click="reset()">重置</b-button>
                </b-input-group>
              </b-form-group> -->
            </form>
            <div class="d-inline-block" style="width:350px;">
              <div class="totalData rounded-sm py-2">
                <p>成本</p>
                <div><span>算力费</span><span class="dashed"></span><span class="main-text">${{calFee}}</span></div>
                <div><span>首次交纳的电费</span><span class="dashed"></span><span class="main-text">${{(electricity*firstDays*hashrate).toFixed(2)}}</span></div>
                <div><span>总成本</span><span class="dashed"></span><span class="main-text">${{(calFee+electricity*firstDays*hashrate).toFixed(2)}}</span></div>
                <hr>
                <p>收益和回本</p>
                <!-- 静态收益 = ( 周期 * 算力 * 每T每天理论收益 ) - (算力费用 + 周期 * 算力 * 每T每天的电费) -->
                <div><span>静态收益</span><span class="dashed"></span>
                  <span class="main-text">${{(data.btcTheoryProfit*period*data.btcToUsd*hashrate-(calFee+period*hashrate*electricity)).toFixed(2)}}</span>
                </div>
                <!-- 回本天数= （算力费用+周期*算力*每T每天电费）/算力*每T每天理论收益 -->
                <div><span>静态回本天数</span><span class="dashed"></span>
                <span class="main-text">{{((calFee+period*hashrate*electricity)/(data.btcTheoryProfit*hashrate*data.btcToUsd)).toFixed(2)}}天</span></div>
                <div><span>静态收益率</span><span class="dashed"></span>
                  <span class="main-text">{{((data.btcTheoryProfit*period*data.btcToUsd*hashrate-(calFee+period*hashrate*electricity))/(calFee+electricity*firstDays*hashrate)*100).toFixed(2)}}%</span>
                </div>
              </div>
            </div>
          </div>
          <div class="text-left mt-4 explain">
            <h3>免责声明</h3>
            <p>以上所有数据均基于当前的币价(${{(data.btcToUsd)||'0'}})、当前的全网难度({{(data.networkDiff)||'0'}})、当前的全网算力({{(data.networkCalc+data.networkCalcUnit)||'0'}}H/S)的计算，并没有考虑未来以上数据的变化情况，其中当前币价数据来源为 <b-link>https://www.feixiaohao.com/</b-link>；</p>
            <h3 class="mt-3">指标说明</h3>
            <p>1、总成本中的电费部分仅包括下单时首次交纳电费部分，后续的电费从挖矿产出中扣除，因此没有没有计入成本，这里暂未考虑手动交纳电费时链上转账手续费的问题。</p>
            <p>2、静态收益：是指静态总产出减去总成本。</p>
            <p>3、静态总产出是指假定未来的币价、难度、和区块打包奖励数量都始终保持不变的前提之下推算出来的未来产出，静态总产出不等于预期产出，更不等于实际产出。</p>
            <p>4、静态回本天数：是指累计静态总收益达到总成本所需要的天数。</p>
            <p>5、静态收益率：是指静态收益除以总成本。</p>
          </div>
        </b-card>
      </b-overlay>
    </div>
  </div>
</template>

<style lang="scss" scoped>
/deep/{
  .input-group-text{background-color: rgba(189, 188, 188, 0.18);width:72px;text-align: center;}
  .el-input__inner{border-radius:4px 0 0 4px;}
}
.explain{
  h3{font-size: 1rem; color: #333; font-weight: 700;}
  p{font-size: 0.9rem;color:#999;margin:0;}
}
.totalData{border:1px solid #e5e5e5;color:#555;
  p{font-weight: 800;font-size: 1.4rem;}
  div{ text-align: left; display: flex; justify-content: flex-end; align-items: center;padding:0.5rem; }
}
.dashed{ flex: 1; border-bottom: 1px dashed #999;margin:0 5px; }
.main-text{ color: #f56c6c; font-size: 1.2rem; font-weight: 700; }
</style>

<script>
import { InputNumber } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
  export default{
    name: 'calculator',
    data(){
      return{
        data:'', calFee:1000, electricity:0.1, firstDays:10, hashrate:100, period:360, holdData:''
      }
    },
    components:{InputNumber},
    created(){
      this.initData()
    },
    methods:{
      initData(){
        var that = this;
        this.$axios.post('pageFoot/profitCalculator.do',this.$qs.stringify({coinType:'btc'})).then(function (response) {
          if (response.status === 200) {
            var data = response.data;
            that.data = data.content;
          }
        })
        .catch(function (error) {
          console.log(error)
        });
      },
      reset(){
        Object.assign(this.$data, this.$options.data())
        this.initData()
      }
    }
  }
</script>