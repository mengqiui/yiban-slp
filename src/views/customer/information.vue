<template>
  <div class="container my-4" style="min-height:512px;">
    <b-overlay :show="!Boolean(lists)" :opacity="1" spinner-variant="primary" spinner-type="grow">
      <b-card bg-variant="white" class="border-0 position-relative">
        <b-tabs card>
          <b-tab title="全部" active @click="getInfo(null)"> </b-tab>
          <b-tab title="未读" @click="getInfo('0')"> </b-tab>
          <b-tab title="已读" @click="getInfo('1')"> </b-tab>
        </b-tabs>
        <b-button class="position-absolute" variant="outline-primary" style="right:20px; top:38px;" @click.stop="setRead('','1')">全部设为已读</b-button>
        <div v-if="lists=='no'">
          <b-alert show variant="primary" class="text-center">暂无消息！</b-alert>
        </div>
        <div v-else class="listScroll">
          <b-list-group v-for="(list,index) in lists" :key="index" @click.stop="setRead(list.noticeId,'',list.isRead)">
            <b-list-group-item v-if="list.noticeTitle=='电费不足提醒'" :to="{ name: 'myPower', params: { orderId: list.orderId } }" class="text-dark flex-column align-items-start">
              <div class="d-flex w-100 justify-content-between">
                <p class="mb-1 font-weight-bolder" style="padding-left:32px;"><b-icon icon="dot" aria-hidden="true" variant="danger" font-scale="2" class="align-middle" v-show="list.isRead==0"></b-icon>{{list.noticeTitle}}</p>
                <small>{{list.createTime}}</small>
              </div>
              <p class="mb-1 text-muted small" style="padding-left:32px;">{{list.noticeContent}}</p>
            </b-list-group-item>
            <b-list-group-item v-else-if="list.noticeTitle=='待支付订单提醒'" :to="{ name: 'Orderdetail', params: {orderId: list.orderId} }" class="text-dark flex-column align-items-start">
              <div class="d-flex w-100 justify-content-between">
                <p class="mb-1 font-weight-bolder" style="padding-left:32px;"><b-icon icon="dot" aria-hidden="true" variant="danger" font-scale="2" class="align-middle" v-show="list.isRead==0"></b-icon>{{list.noticeTitle}}</p>
                <small>{{list.createTime}}</small>
              </div>
              <p class="mb-1 text-muted small" style="padding-left:32px;">{{list.noticeContent}}</p>
            </b-list-group-item>
            <b-list-group-item v-else class="flex-column align-items-start text-dark">
              <div class="d-flex w-100 justify-content-between">
                <p class="mb-1 font-weight-bolder" style="padding-left:32px;"><b-icon icon="dot" aria-hidden="true" variant="danger" font-scale="2" class="align-middle"></b-icon>{{list.noticeTitle}}</p>
                <small>{{list.createTime}}</small>
              </div>
              <p class="mb-1 text-muted small" style="padding-left:32px;">{{list.noticeContent}}</p>
            </b-list-group-item>
          </b-list-group>
        </div>
      </b-card>
    </b-overlay>
  </div>
</template>
<style lang="scss" scoped>
/deep/ {
    .nav-tabs .nav-link.active, .nav-tabs .nav-item.show .nav-link{color:#007bff; border: none; outline: none; border-bottom: 1px solid #007bff;font-weight: bold;}
    .nav-tabs .nav-link{color:#343a40;transition: border-bottom .5s;padding:12px 20px;font-size:14px;}
    .nav-tabs .nav-link:hover, .nav-tabs .nav-link:focus{color:#007bff; border: none; outline: none; border-bottom: 1px solid #007bff;font-weight: bold;}
    .custom-select:focus{box-shadow: none;}
    .list-group-item{ border: 0;padding:22px 0; border-bottom: 1px solid #f7f7f7; border-radius: 0;}
    .tab-content{display: none;}
  }
.listScroll{ max-height: 680px; overflow-y: scroll; padding-right: 30px; }
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
.container{
    animation: main 1s;
    padding: 0;
    background-color:rgb(255, 255, 255);
}
body{
    /* background: #e7e7e7; */
    overflow-x: hidden
}
</style>

<script>
export default {
  name: 'information',
  data() {
    return { lists:'' }
  },
  created(){
    this.getInfo(null)
  },
  methods: {
    getInfo(isRead){ 
      var that = this;
      this.$axios.post('/showNoticeList.do',this.$qs.stringify({isRead:isRead})).then(function (response) {
        if (response.status === 200) { 
          var data = response.data;
          if(data.content=='查询无记录！'){
            that.lists ='no'
          }else{
            that.lists = data.content.noticeList;
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      });
    },
    setRead(noticeId,all,isRead){ 
      var that = this;
      if(isRead=='1'){return;}
      this.$axios.post('/changeHasRead.do',this.$qs.stringify({noticeId:noticeId,isAll:all})).then(function (response) {
        if (response.status === 200) { 
          var data = response.data;
          if(data.content=='success'){
            that.getInfo(null);
            if(all=='1'){ that.resetSetItem('slpNotice',0);}
            else{that.resetSetItem('slpNotice',Number(sessionStorage.getItem('slpNotice'))-1)}
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
