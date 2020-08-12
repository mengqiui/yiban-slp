<template>
  <div class="col-lg-10 offset-lg-1 rounded my-3 bg-white myPower">
    <div class="form-box p-4 text-dark">
      <h6 class="text-dark">待缴纳电费订单 <b-link class="float-right small text-decoration-none" @click="$router.go(-1)">返回上一页</b-link> </h6>
      <hr/>
      <b-jumbotron class="text-black bg-light pt-1 px-0" style="min-height:535px;">
        <b-table sticky-header="410px" hover :items="items" center :fields="fields" class="border border-light" show-empty head-variant="light" >
          <template v-slot:head(#)>
            <b-form-checkbox v-model="allchecked" @change="toggleAll" :indeterminate="indeterminate"> </b-form-checkbox>
          </template>
          <template v-slot:cell(#)="row">
            <b-form-checkbox @change="checkboxClick(row.item.orderId)" v-model="isCheckedObj['index'+row.item.orderId]"> </b-form-checkbox>
          </template>
          <template v-slot:cell(getPayDays)="row">
           <b-form-spinbutton v-model="row.item.getPayDays" min="10" :max="row.item.remainDays" inline size="sm"></b-form-spinbutton>
          </template>
          <template v-slot:cell(total)="row">
           <b>{{'$' + (row.item.getPayDays * row.item.powerFare).toFixed(2)}}</b>
          </template>
          <template v-slot:empty>
            <b-alert show variant="secondary" class="text-center">暂无数据！</b-alert>
          </template> 
        </b-table>  
        <hr>
        <div class="w100 text-center">
          <p class="text-left">
            <b-form-checkbox v-model="allchecked" @change="toggleAll" :indeterminate="indeterminate" class="d-inline">全选</b-form-checkbox>
            已选中<b class="text-danger mx-1">{{idArr.length}}</b>件
          </p>
          <h3 class="text-center">商品金额：${{totalMoney.toFixed(2)}}</h3>
          <b-button variant="primary" size="lg" class="mx-auto px-5" @click="info">扣除电费</b-button>
        </div>
        <!-- Info modal -->
        <!-- <b-modal :id="infoModal.id" :title="infoModal.title" ok-only @hide="payElectric">
          <b-form>
            <b-form-group label="缴纳天数：" label-for="payDays">
              <b-form-input v-model.trim="payDays" placeholder="请输入天数" id="payDays"></b-form-input>
            </b-form-group>
          </b-form>
        </b-modal> -->
      </b-jumbotron>
    </div>
  </div>
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
.myPower{
  animation: main 1s;
  padding: 0;
  background-color: rgba(216, 209, 209, 0.2);
}

</style>
<script>
export default{
    name: 'myPower',
    data() {
      return {
        fields:[
          { key: '#',label: '#' },
          { key: 'orderId', label: '订单编号' },
          { key: 'productName', label: '产品信息', formatter: (value, key, item) => { return item.productName +'，'+ item.contractPeriod+'天' } },
          { key: 'powerFare', label: '每日电费', formatter: (value, key, item) => { return '$'+ item.powerFare + '/天' } },
          // { key: 'contractPeriod', label: '合约期限', formatter: (value, key, item) => { return  item.contractPeriod + '天' } },
          // { key: 'electricityDays', label: '已缴纳天数', formatter: (value, key, item) => { return  item.electricityDays + '天' } },
          { key: 'remainDays', label: '待缴纳天数', formatter: (value, key, item) => { return  item.remainDays + '天' } },
          { key: 'remainPaidDays', label: '剩余电费天数', formatter: (value, key, item) => { return  Number(item.remainPaidDays)?(item.remainPaidDays + '天'):item.remainPaidDays } },
          { key: 'getPayDays', label: '选择续费天数' }, { key: 'total', label: '电费金额' },
        ],
        items:[], infoModal: { id: '待缴纳电费', orderId: '', title: '' }, idArr:[], allchecked: false, indeterminate: false, isCheckedObj: {}, isAll:'1', oneId:'',  totalgoods:[], payData:[]
      }
    },
    created: function(){ this.getData() },
    mounted(){
      this.isCheckedObj = {};
      this.items.forEach(element => {
        this.$set(this.isCheckedObj,'index'+element.orderId,false)
      });
    },
    methods: {
      getData() {
        var that = this;
        if(this.$route.params.orderId == "all"){this.isAll='1'}else{this.isAll='0';this.oneId = this.$route.params.orderId}
        this.$axios.post('/queryUnPayElectricList.do',this.$qs.stringify({orderId:this.oneId,isAll:this.isAll})).then(function (response) {
          if (response.status === 200) {
            var data = response.data;
            for(var i=0;i<data.content.length;i++){
              data.content[i].getPayDays = 10;
            }
            that.items = data.content;
          }
        })
        .catch(function (error) {
          console.log(error)
        });
      },
      info() {
        var that = this;
        if(this.idArr.length == 0){alert('请选择订单！');return;} 
        console.log(JSON.stringify(this.payData))
        this.$axios.post('/mergeElectricWithdraw.do',this.$qs.stringify({orderInfoList:JSON.stringify(this.payData)})).then(function (response) {
          if (response.status === 200) {
            var data = response.data;
            alert(data.content)
            if(data.content == "电费扣除成功！"){that.$router.push({path:'/myinfo/myCal'})}
          }
        })
        .catch(function (error) {
          console.log(error)
        });
      },
      payElectric() {
        var that = this;
        this.$axios.post('electricWithdraw.do',this.$qs.stringify({orderId:this.infoModal.orderId, payDays:this.payDays})).then(function (response) {
          if (response.status === 200) {
            var data = response.data;
            alert(data.content)
            if(data.content == "电费扣除成功！"){
              that.getData();
              that.infoModal.title = '';
              that.infoModal.orderId = '';
              that.payDays = '';
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        });
      },
      toggleAll(checked) {  // 点击全选按钮
        this.idArr = []
        this.items.forEach(element => {
          if (checked) {
            this.idArr.push(element.orderId)
          }
        this.$set(this.isCheckedObj,'index'+element.orderId,checked)
        });
      },
      checkboxClick(orderId) {  // 复选框点击选中与取消
        let index = this.idArr.indexOf(orderId);
        if (index > -1) {
          this.idArr.splice(index, 1);
        } else {
          this.idArr.push(orderId)
        }
      },
      add(args){
        if(args.length==0){return 0}
        return  args.reduce((prev,curr) => {
          return prev+curr
        })
      }
    },
    computed:{
      totalMoney(){
        this.totalgoods.splice(0);this.payData.splice(0);
        if(this.idArr.length == 0){return 0;}
        this.idArr.forEach(elm =>{
          for(var i=0;i<this.items.length;i++){
            if(this.items[i].orderId == elm){
              this.payData.push({"orderId":this.items[i].orderId,"payDays":this.items[i].getPayDays});
              this.totalgoods.push(this.items[i].getPayDays*this.items[i].powerFare);
            }
          }
        })
        return this.add(this.totalgoods)
      }, 
    },
    watch: {
      idArr: {
        handler(newVal, oldVal) {
          if (newVal.length == 0) {
            this.indeterminate = false
            this.allchecked = false
          } else if (newVal.length == this.items.length) {
            this.indeterminate = false
            this.allchecked = true
          } else {
            this.indeterminate = true
            this.allchecked = false
          }
        },
        deep: true//深度
      }
    }
  }
</script>
