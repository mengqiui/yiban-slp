<template>
  <b-jumbotron class="bg-light mb-0 list h-100">
    <div class="w-75 mx-auto">
      <h2 class="text-center font-weight-bold">新手指导</h2>
      <!-- <p class="text-center font-weight-light">2020/3/23 08:00</p> -->
      <hr class="my-4">

      <p>欢迎来到算力派平台！在算力派，您可以用极具性价比的价格，租用BTC，BCH，ETH，LTC，DCR，ZEC等多种币种的矿机，进行挖矿。
        租期可长可短，从60-360天不等，未来还将推出永久型合约！您可以自由根据您的资金期限情况选择适合的租赁时长。
      </p>
      <p>算力派的挖矿租赁套餐的费用，分为算力使用费用和电费。算力使用费指不同矿机，租用不同时间的费用，需要一次性缴纳。电费指运行矿机所需的电力费，可以每10天缴纳一次。
        犹如您租了一辆车，算力费就是租车费需要一次缴清，电费就是燃油费用，可以按需缴纳。但电费若断交，算力费不能退回，因此您需注意电费的剩余情况。</p>
      <p>具体如何下单购买呢？以BTC购买为例：</p>
      <p>1. 在“价格”页面下，选择套餐，然后单击“立即购买”;</p>
      <p>&nbsp;&nbsp;请多次确认填写的收款地址是正确的且有效</p>
      <p>2.	订单信息：</p>
      <p>&nbsp;&nbsp;2.1)、选择一个矿池；</p>
      <p>&nbsp;&nbsp;2.2)、输入有效的接收钱包地址</p>
      <p>&nbsp;&nbsp;请多次确认填写的收款地址是正确的且有效</p>
      <p>&nbsp;&nbsp;2.3)、选择您所需要的“挖矿天数”，可以现在支付或稍后支付</p>
      <p>&nbsp;&nbsp;维护费的收取标准对于整个订单来说是不变的，您可以选择一次支付全部和维护费或者分批次支付，后续再下新的维护包订单即可</p>
      <p>&nbsp;&nbsp;2.4)、接下来，在接受用户协议之前，请仔细阅读并确认订单</p>
      <p>&nbsp;&nbsp;2.5)、检查订单金额，然后单击“确认”</p>
      <p>3.选择付款方式确认后付款（请在12小时内全额支付订单，超时订单将被取消） </p>
      <p>4.将订单的待付金额发送到页面上显示的收款地址。付款后，请点击“已支付”</p>
      <p>5.转账后需等待链上确认（大概1-2个小时），对于美金转账的汇款方式，请确保10天内全款到账。收到全额款项后，套餐将会生效并工作（预售单需等到预售期生效）</p>
    </div>
  </b-jumbotron>
</template>
<style lang="scss" scoped>
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
.list{
  animation: main 1s;
  padding: 4rem 0;
  background-color: rgba(216, 209, 209, 0.2);
}
  p{text-indent:$indent2;}
</style>
<script>
  export default{
    name: 'lists'
  }
</script>

