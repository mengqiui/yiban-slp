<template>
<div class="bg-dark text-light py-5">
  <div class="d-flex justify-content-between mx-auto" style="width:1200px;">
    <div>
      <h3>suanlipai</h3>
      <p class="small">Copyright © 2020 suanlipai All Rights Reserved</p>
    </div>
    <div>
      <p class="lead">产品</p>
      <p><b-link to="/calBuy">矿机共享套餐</b-link></p>
      <p><b-link to="/calculator">计算器</b-link></p>
    </div>
    <div>
      <p class="lead">信息</p>
      <p><b-link to="/about">关于我们</b-link></p>
      <p><b-link to="/about">联系我们</b-link></p>
      <p><b-link to="/information">消息中心</b-link></p>
    </div>
    <div>
      <p class="lead">支持</p>
      <p><b-link to="/about">商务合作</b-link></p>
      <p><b-link to="/articles">帮助中心</b-link></p>
      <p><b-link to="/requests">提交工单</b-link></p>
      <p><b-link>隐私条款</b-link></p>
      <p><b-link>用户条款</b-link></p>
    </div>
    <div class="border-left border-secondary"></div>
    <div>
      <p class="lead">主要汇率</p>
      <div class="list">
        <span class="text-uppercase" v-for="list in lists" :key="list.id">1 {{list.coinType}} = {{list.usdPrice}} 美元</span>
      </div>
    </div>
  </div>

</div>
</template>

<script>
export default {
  name: 'footerBottom',
  data() {
      return {lists:''};
    },
    created() {
      var that = this;
      this.$axios.post('pageFoot/showExChangeRateList.do')
      .then(function (response) {
        if (response.status === 200) {
          var data = that.$qs.parse(response.data).content;
          that.lists = data;
        }
      })
      .catch(function (error) {
        console.log(error)
      });
    },
    methods: {

    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
div{color: #9e9c9c!important;h3{color:#dcdada;} p{font-size:0.9rem;;a{color: #9e9c9c!important;text-decoration: none;}};}
.lead{color:#dcdada;font-size: 1rem;font-weight: 700;}
.list{display: flex; flex-wrap: wrap;width:350px;
  span{margin-top:10px;font-size:0.9rem;}
  span:nth-child(odd){width: 160px;

  }
}
</style>
