<template>
  <div class="login-box">
    <div class="bg-picture"></div>
    <form @submit.prevent="onsubmit" class="needs-validation">
      <input type="text" name="username" style="opacity:0;position: absolute;z-index:-999;" autocomplete />
      <p class="h4 text-center mb-5">欢迎登陆算力派</p>
      <input type="password" name="passwd" style="opacity:0;position: absolute;z-index:-999;" autocomplete />
      <div class="form-group d-flex mb-4 align-items-center">
        <label for="username" class="box-label align-text-bottom">用户名</label>
        <div class="input-div flex-grow-1">
          <input id="username" name="username" v-model.trim="form.username" v-validate="{ required: true , numeric: true , max: 11 , regex: /^1[3456789]\d{9}$/ }"
           type="text" class="form-control box-input" :class="{'input': true, 'border-danger': errorBags.has('username') }" data-vv-as="手机号">
          <span v-show="errorBags.has('username')" class="text-danger">{{ errorBags.first('username') }}</span>
        </div>
      </div>
      <div class="form-group d-flex mb-4 align-items-center">
        <label for="passwd" class="box-label">密码</label>
        <div class="input-div flex-grow-1">
          <input id="passwd" name="passwd" v-model.trim="form.passwd" v-validate="{ required: true , min: 6 , max: 20, regex: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/ }"
           type="password" class="form-control box-input" :class="{'input': true, 'border-danger': errorBags.has('passwd') }" data-vv-as="密码">
          <span v-show="errorBags.has('passwd')" class="text-danger">{{ errorBags.first('passwd') }}</span>
        </div>
      </div>
      <div class="form-group mb-4">
        <p class="text-danger small mb-1">{{form.tips}}</p>
        <b-button block variant="dark" type="submit">欢迎登录</b-button>
      </div>
      <div class="d-flex justify-content-between">
        <b-link to="signup">立即注册</b-link>
        <b-link to="reset">忘记密码</b-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'login',
  data() {
    return {
      form: {
        username: '13136126833',
        passwd: 'ebang123',
        tips:''
      }
    };
  },
  methods: {
    onsubmit() {
      var that = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$axios.post('login',this.$qs.stringify({ username: this.form.username,password:this.$md5('(<>::dkj2154|'+this.form.passwd+'.4543,%^%$@;d458,l')}))
          .then(function (response) {
            if (response.status === 200) {
              var data = that.$qs.parse(response.data)
              if(data.loginStatus=="success"){
                that.$router.push({path: '/shop'});
                sessionStorage.setItem('slpUser',that.form.username);
                sessionStorage.setItem('slpLoginTime',data.lastLoginTime);
                sessionStorage.setItem('slpNotice',data.noticeNoReadNum)
              }
              else{that.form.tips = data.content;}
            }
          })
          .catch(function (error) {
            that.form.tips = error;
          });
        }
      });
    }
  }
}
</script>

<style lang="scss" scoped>
  @import '../assets/scss/login.scss';
</style>