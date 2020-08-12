<template>
  <!-- 右上2块总数据 -->
  <b-tabs content-class="mt-3">
    <b-tab title="BTC" active>
      <div class="text-dark">
        <div class="d-flex">
          <b-card class="text-center flex-fill shadow border-0 mr-1">
            <div class="text-back">
              <b-card-text class="text-secondary">总算力</b-card-text>
              <p class="display-4">{{myForce}}TH/S</p>
            </div>
          </b-card>
          <b-card class="text-center flex-fill shadow border-0 ml-1">
            <div class="text-back">
              <b-card-text class="text-secondary">总产出<b-link class="small float-right" to="/myinfo/myCal/userProfit">更多产出数据>></b-link> </b-card-text>
              <p class="display-4">{{sumRevenueNumber}}BTC</p>
              <hr>
              <p class="h5">≈${{DoPrice}}</p>
            </div>
          </b-card>
        </div>
        <!-- 右下我的算力列表 -->
        <div class="bg-white shadow mt-3 " style="min-height:505px;">
          <!-- 表格头部 -->
          <div class="d-flex text-muted h6">
            <div class="mr-auto p-2"><b-icon icon="list" font-scale="1"></b-icon>算力列表</div>
            <b-link class="p-2 text-decoration-none linkList" :class="{ 'active' : active == '' }" @click="getData('')">全部</b-link><div class="px-0 py-2">丨</div>
            <b-link class="p-2 text-decoration-none linkList" :class="{ 'active' : active == '100029' }" @click="getData('100029')">待生效</b-link><div class="px-0 py-2">丨</div>
            <b-link class="p-2 text-decoration-none linkList" :class="{ 'active' : active == '100028' }" @click="getData('100028')">运行中</b-link><div class="px-0 py-2">丨</div>
            <b-link class="p-2 text-decoration-none linkList" :class="{ 'active' : active == '100031' }" @click="getData('100031')">暂停中</b-link><div class="px-0 py-2">丨</div>
            <b-link class="p-2 text-decoration-none linkList" :class="{ 'active' : active == '100030' }" @click="getData('100030')">已终止</b-link>
          </div>
          <b-table sticky-header="392px" :items="items" :fields="fields" show-empty head-variant="light" >
            <!-- 序列 -->
            <template v-slot:cell(orderId)="data">
              <router-link :to="{ name: 'Orderdetail', params: {orderId: data.value} }" class="text-dark">{{ data.value }}</router-link> 
            </template>  
            <template v-slot:cell(productInfo)="data">
              <span class="pinfo">{{ data.value }}</span>
            </template>
            <template v-slot:cell(poolName)="data">
              <b>{{ data.value }}</b>
            </template>
            <template v-slot:cell(htmlremainDays)="data">
              <span v-html="data.value"></span>
              <b-button size="sm" variant="outline-primary" class="px-2 py-0" v-if="(data.item.status=='100028')||(data.item.status=='100031')" 
              :to="{ name: 'myPower', params: { orderId: data.item.orderId } }">续电费</b-button>
            </template>  
            <template v-slot:cell(sumProfit)="data">
              <b>{{ data.value>0?(data.value).toFixed(8)+'BTC':0 }}</b>
            </template>
            <template v-slot:cell(htmlstatus)="data">
              <span v-html="data.value"></span>
            </template>
            <template v-slot:cell(handle)="data">
              <b-button size="sm" variant="primary" pill :to="{path:'/myinfo/myCal/Mforce/'+data.item.orderId}">管理算力<b-icon icon="arrow-right-short"></b-icon></b-button>
            </template>
            <template v-slot:empty>
              <b-alert show variant="secondary" class="text-center">暂无数据！</b-alert>
            </template> 
          </b-table>
        </div>
      </div>
    </b-tab>
    <!-- <b-tab title="BCH"><p>bch</p></b-tab>
    <b-tab title="ETH"><p>ETH</p></b-tab>
    <b-tab title="LTC"><p>LTC</p></b-tab> -->
  </b-tabs>
</template>
<style lang="scss" scoped>
  .linkList{color:#495057;transition: all .6s;font-size: 0.9rem;
    &.active{color:#007bff!important;}
    &:hover,&:focus{color:#007bff;}
  }
  .pinfo{color:#343a40; font-size: 1.1rem;}
  .dotBtn{background: none!important; border: none!important; outline: none!important;padding:0!important;color:#000;}
  /deep/ {
    .nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link{color:#007bff; border: none; outline: none; border-bottom: 1px solid #007bff;font-weight: bold;}
    .nav-tabs .nav-link{color:#343a40;transition: border-bottom .5s;}
    .nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus{color:#007bff; border: none; outline: none; border-bottom: 1px solid #007bff;font-weight: bold;}
  }
</style>

<script>
export default{
    name: 'myCal',
    data() {
      return { 
        fields: [ // { key: 'index', label: '序列号' },
          { key: 'orderId', label: '订单编号' }, { key: 'productInfo', label: '算力信息' }, { key: 'poolName', label: '当前矿池', formatter: (value, key, item) => { return item.poolName } },
          { key: 'htmlremainDays', label: '剩余电费天数(天)' }, { key: 'sumProfit', label: '累计产出' }, 
          { key: 'htmlstatus', label: '订单状态' }, { key: 'handle', label: '操作'  }
        ],
        items: [], myForce: '', sumRevenueNumber:'', DoPrice:'', active: '100028'
      }
    },
    created: function(){
      var that = this;
      this.getData(this.active);
      //我的总算力值
      this.$axios.post('myForceShow.do',this.$qs.stringify({coinType:'btc'})).then(function (response) {
        if (response.status === 200) {
          var data = response.data;
          that.myForce = data.content.myForce;
          that.sumRevenueNumber = data.content.sumRevenueNumber;
          that.DoPrice = data.content.DoPrice.toFixed(2);
        }
      })
      .catch(function (error) {
        console.log(error)
      });
    },
    watch:{
      items:function(){    
        this.$nextTick(function(){
          $('[data-toggle="tooltip"]').tooltip()
        });
      }
    },
    methods: {
      getData(status){
        var that = this;
        this.active = status;
        //我的算力列表 状态（100028 运行中, 100029 待生效, 100031 暂停中, 100030 已终止）
        this.$axios.post('queryMyForceList.do',this.$qs.stringify({status:status,coinType:'btc'})).then(function (response) {
          if (response.status === 200) {
            var data = response.data;
            if(Array.isArray(data.content)){
              for(var i=0;i<data.content.length;i++){
                var status = data.content[i].status;
                if(status == "100030"){
                  data.content[i].htmlstatus = '<div class="text-danger">';
                  data.content[i].htmlstatus +='<svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" alt="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-power b-icon bi"><g data-v-676fe450=""><path fill-rule="evenodd" d="M5.578 4.437a5 5 0 104.922.044l.5-.866a6 6 0 11-5.908-.053l.486.875z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M7.5 8V1h1v7h-1z" clip-rule="evenodd"></path></g></svg>'
                  data.content[i].htmlstatus +=that.$myFuc.getDict(status,"id")+'</div>';
                }else if(status == "100029"){
                  data.content[i].htmlstatus = '<div class="text-primary">';
                  data.content[i].htmlstatus +='<svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" alt="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-clock b-icon bi b-icon-animation-spin mr-1"><g data-v-676fe450=""><path fill-rule="evenodd" d="M8 15A7 7 0 108 1a7 7 0 000 14zm8-7A8 8 0 110 8a8 8 0 0116 0z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M7.5 3a.5.5 0 01.5.5v5.21l3.248 1.856a.5.5 0 01-.496.868l-3.5-2A.5.5 0 017 9V3.5a.5.5 0 01.5-.5z" clip-rule="evenodd"></path></g></svg>'
                  data.content[i].htmlstatus +=that.$myFuc.getDict(status,"id")+'</div>';
                }else if(status == "100028"){
                  data.content[i].htmlstatus = '<div class="text-success">';
                  data.content[i].htmlstatus +='<svg viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" alt="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-arrow-clockwise b-icon bi b-icon-animation-spin mr-1"><g data-v-676fe450=""><path fill-rule="evenodd" d="M3.17 6.706a5 5 0 017.103-3.16.5.5 0 10.454-.892A6 6 0 1013.455 5.5a.5.5 0 00-.91.417 5 5 0 11-9.375.789z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M8.147.146a.5.5 0 01.707 0l2.5 2.5a.5.5 0 010 .708l-2.5 2.5a.5.5 0 11-.707-.708L10.293 3 8.147.854a.5.5 0 010-.708z" clip-rule="evenodd"></path></g></svg>'
                  data.content[i].htmlstatus +=that.$myFuc.getDict(status,"id")+'</div>';
                }else if(status == "100031"){
                  data.content[i].htmlstatus = '<div class="text-warning">';
                  data.content[i].htmlstatus +='<svg data-v-676fe450="" viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" alt="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-stopwatch b-icon bi"><g data-v-676fe450=""><path fill-rule="evenodd" d="M8 15A6 6 0 108 3a6 6 0 000 12zm0 1A7 7 0 108 2a7 7 0 000 14z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M8 4.5a.5.5 0 01.5.5v4a.5.5 0 01-.5.5H4.5a.5.5 0 010-1h3V5a.5.5 0 01.5-.5zM5.5.5A.5.5 0 016 0h4a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" clip-rule="evenodd"></path><path d="M7 1h2v2H7V1z"></path></g></svg>'
                  data.content[i].htmlstatus +=that.$myFuc.getDict(status,"id")+'</div>';
                  // data.content[i].htmlstatus = '<div class="text-info"><b-icon icon="stop"></b-icon>'+that.$myFuc.getDict(status,"id")+'</div>';
                }
                if(Boolean(data.content[i].electricityBillType)){
                  data.content[i].htmlremainDays = '<svg data-toggle="tooltip" data-placement="bottom" title="已开启自动续费,点击右侧管理算力按钮可关闭" viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" alt="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-dot b-icon bi text-success"><g transform="translate(8 8) scale(2.5 2.5) translate(-8 -8)"><path fill-rule="evenodd" d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd"></path></g></svg>';
                }else{
                  data.content[i].htmlremainDays = '<svg data-toggle="tooltip" data-placement="bottom" title="未开启自动续费,点击右侧管理算力按钮可开启" viewBox="0 0 16 16" width="1em" height="1em" focusable="false" role="img" alt="icon" xmlns="http://www.w3.org/2000/svg" fill="currentColor" class="bi-dot b-icon bi text-secondary"><g transform="translate(8 8) scale(2.5 2.5) translate(-8 -8)"><path fill-rule="evenodd" d="M8 9.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clip-rule="evenodd"></path></g></svg>';
                }
                data.content[i].htmlremainDays +='<span class="mx-1">'+data.content[i].remainDays+'</span>';
              }
              that.items = data.content;
            }else{
              that.items = []
            }
          }
        })
        .catch(function (error) {
          console.log(error)
        });
      }
    }
  }
</script>

