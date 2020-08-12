<template>
  <div style="height:673px;" class="p-4">
    <b-card class="mb-3">
      <div class="d-flex justify-content-around">
        <div class="mb-2">
          <b-icon icon="lock" variant="success" font-scale="1.5"></b-icon> 登录密码：<b class="text-success">已绑定</b>
        </div>
        <p class="text-muted small">为了您的账户安全，建议定期更换</p>
        <b-button variant="outline-secondary" to="/myinfo/userSetup/changePwd">修改</b-button>
      </div>
    </b-card>
    <b-card>
      <div class="d-flex justify-content-around" v-if="Boolean(flag)">
        <div class="mb-2">
          <b-icon icon="shield-lock" variant="success" font-scale="1.5"></b-icon> 证件信息：<b class="text-success">已认证</b>
        </div>
        <p class="text-muted small">身份认证是购买产品及提现的必要条件</p>
        <b-button style="color:#fff;background:#fff;border-color:#fff;">查看</b-button>
        
      </div>
      <div class="d-flex justify-content-around" v-else>
        <div class="mb-2">
          <b-icon icon="shield-lock" variant="danger" font-scale="1.5"></b-icon> 证件信息：<b class="text-danger">未认证</b>
        </div>
        <p class="text-muted small">身份认证是购买产品及提现的必要条件</p>
        <b-button variant="outline-secondary" to="/myinfo/userSetup/realName">验证</b-button>
      </div>
    </b-card>
  </div>
</template>
<style lang="scss" scoped>

</style>
<script>
export default{
    name: 'userSetup',
    data() {
      return {
        flag:'1'
      }
    },
    created: function(){
      var that = this;
      this.$axios.post('ifRealCheck.do').then(function (response) {
        if (response.status === 200) {
          var data = response.data;
          if(Object.prototype.toString.call(data.content) == '[object Object]'){
            that.flag = data.content.realCheck;
          }else{
            that.flag = '';
          }
        }
      })
      .catch(function (error) {
        console.log(error)
      });
    }
  }
</script>
