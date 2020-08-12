<template>
  <b-card no-body class="border-0" style="height:760px;">
    <b-tabs card>
      <b-tab title="算力订单" active @click="orderLists">
        <div class="">
          <b-table hover :items="orderItems" :fields="orders" show-empty sticky-header="560px" head-variant="light" class="shadow">
            <template v-slot:head(handle)>
              <b-form-select v-model="selected" class="payStatus" @change="orderLists" style="margin: -0.35rem;">
                <b-form-select-option value="all">全部</b-form-select-option>
                <b-form-select-option value="100018">待支付</b-form-select-option>
                <b-form-select-option value="100019">已支付</b-form-select-option>
                <b-form-select-option value="100020">已完成</b-form-select-option>
                <b-form-select-option value="100021">已取消</b-form-select-option>
              </b-form-select>
            </template>
            <template v-slot:cell(handle)="row">
              {{ $myFuc.getDict(row.item.orderStatus,"id") }}
              <p class="text-warning small font-weight-bold">{{ row.item.remarks }}</p>
            </template>
            <template v-slot:cell(orderId)="row">
              <router-link :to="{ name: 'Orderdetail', params: {orderId: row.item.orderId} }" >{{ row.item.orderId }}</router-link>
            </template>
            <template v-slot:cell(goodName)="row">
              {{ row.item.minerName +' ( '+row.item.buyNum+'T '+ row.item.contractPeriod+ '天 +' + row.item.electricityDays +' 天电费 )' }}
            </template>
            <template v-slot:empty>
              <b-alert show variant="secondary" class="text-center">暂无数据！</b-alert>
            </template> 
          </b-table><hr>
        </div>
      </b-tab>
      <b-tab title="电费列表" @click="electricList">
        <b-table hover :items="items" :fields="fields" show-empty sticky-header="560px" head-variant="light" class="shadow">
          <template v-slot:cell(index)="data">
            {{ data.index + 1 }}
          </template>  
          <template v-slot:empty>
            <b-alert show variant="secondary" class="text-center">暂无数据！</b-alert>
          </template> 
        </b-table><hr>
      </b-tab>
    </b-tabs>
  </b-card>
</template>
<style lang="scss" scoped>
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
    name: 'myOrder',
    data() {
      return {
        fields: [{ key: 'create_time', label: '订单时间' }, { key: 'electric_id', label: '订单ID' }, { key: 'order_name', label: '产品名称' }, { key: 'electric_trans_fee', label: '电费交易金额' }, { key: 'topup_status', label: '充值扣除状态' }],
        orders: [{ key: 'orderTime', label: '下单时间' }, { key: 'orderId', label: '订单ID' }, { key: 'goodName', label: '产品名称' }, 
        { key: 'totalPrice', label: '订单总金额', formatter: (value, key, item) => {return item.totalPrice+' USD'} }, { key: 'handle', label: '状态' }],
        selected:'all',items: [],orderItems: []
      }
    },
    created: function(){
      this.orderLists() 
    },
    methods: {
      orderLists(){
        var that = this;
        this.$axios.post('/order/getOrderInfoByStatus',this.$qs.stringify({orderStatus:this.selected})).then(function (response) {
          if (response.status === 200) {
            var data = response.data;
            that.orderItems = data.content;
          }
        })
        .catch(function (error) {
          console.log(error)
        });
      },
      electricList(){
        var that = this;
        this.$axios.post('queryElectricList.do').then(function (response) {
          if (response.status === 200) {
            var data = response.data;
            that.items = data.content;
          }
        })
        .catch(function (error) {
          console.log(error)
        });
      }
    }
  }
</script>
