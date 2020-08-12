<template>
  <div class="login-box">
    <div class="bg-picture"></div>
    <form @submit.prevent="onsubmit" class="needs-validation">
      <p class="h4 text-center mb-5">重置密码</p>
      <input type="text" name="username" style="opacity: 0;position: absolute;z-index: -9999;" autocomplete />
      <div class="form-group d-flex mb-4 align-items-center">
        <label for="username" class="box-label">用户名</label>
        <div class="input-div flex-grow-1">
          <input name="username" v-model.trim="form.username" v-validate="{ required: true , numeric: true , max: 11 , regex: /^1[3456789]\d{9}$/ }" type="text"
          class="form-control box-input" :class="{'input': true, 'border-danger': errorBags.has('username') }" data-vv-as="手机号">
          <span v-show="errorBags.has('username')" class="text-danger">{{ errorBags.first('username') }}</span>
        </div>
      </div>
      <div class="form-group d-flex mb-4 align-items-center">
        <label for="moileCode" class="box-label">验证码</label>
        <div class="input-div flex-grow-1 position-relative">
          <input name="mobileCode" v-model.trim="form.mobileCode" v-validate="{ required: true , numeric: true , digits: 6 }" type="text"
          class="form-control box-input" :class="{'input': true, 'border-danger': errorBags.has('mobileCode') }" data-vv-as="验证码">
          <div class="position-absolute tel-code">丨<b-link class="font-weight-light small text-decoration-none" @click="flag && sendCode()">{{textBtn}}</b-link></div>
          <span v-show="errorBags.has('mobileCode')" class="text-danger">{{ errorBags.first('mobileCode') }}</span>
          <div class="text-danger mt-1">{{form.codeTips}}</div>
        </div>
      </div>
      <input type="password" name="passwd1" style="opacity: 0;position: absolute;z-index: -9999;" autocomplete />
      <div class="form-group d-flex mb-4 align-items-center">
        <label for="password1" class="box-label">输入密码</label>
        <div class="input-div flex-grow-1">
          <input name="passwd1" v-model.trim="form.passwd1" ref="passwd1" v-validate="{ required: true , min: 6 , max: 20, regex: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/ }"
          type="password" class="form-control box-input" :class="{'input': true, 'border-danger': errorBags.has('passwd1') }" data-vv-as="密码1">
          <span v-show="errorBags.has('passwd1')" class="text-danger">{{ errorBags.first('passwd1') }}</span>
        </div>
      </div>
      <div class="form-group d-flex mb-4 align-items-center">
        <label for="password2" class="box-label">确认密码</label>
        <div class="input-div flex-grow-1">
          <input id="password2" name="passwd2" v-model.trim="form.passwd2" v-validate="{ required: true , min: 6 , max: 20 , confirmed: 'passwd1' , regex: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/ }"
          type="password" class="form-control box-input" :class="{'input': true, 'border-danger': errorBags.has('passwd2') }" data-vv-as="密码2">
          <span v-show="errorBags.has('passwd2')" class="text-danger">{{ errorBags.first('passwd2') }}</span>
        </div>
      </div>
      <div class="form-group mb-4 align-items-center">
        <p class="text-danger small mb-1">{{form.tips}}</p>
        <b-button block variant="dark" type="submit">欢迎加入</b-button>
      </div>
      <div class="d-flex justify-content-between">
        <b-link to="signup">注册账号</b-link>
        <b-link to="login">马上登录</b-link>
      </div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'forget',
  data() {
    return {
      form: {
          username: '',
          mobileCode: '',
          passwd1: '',
          passwd2: '',
          codeTips: '',
          tips: ''
        },
      textBtn:'发送验证码',timer: null, count: null,flag: true
    };
  },
  watch:{
    'form.username'(val,oldval){//监听用户名
      if(val != ""){this.form.codeTips = ''}
    }
  },
  methods: {
    sendCode() {
      var that = this;
      var reg = /^1[3456789]\d{9}$/;
      if (reg.test(this.form.username)) {//手机号正确
        this.$axios.post('sendSmsCode.do',this.$qs.stringify({ userName: this.form.username}))
          .then(function (response) {
            if (response.status === 200) {
              var data = that.$qs.parse( response.data )
              if(data.content=="success"){ that.getCode();that.flag = false; }
              else{that.timer = setInterval(() => { that.form.codeTips=data.content; }, 10)//接口返回发送失败提示
                setTimeout(function(){ clearInterval( that.timer ); that.form.codeTips=''; },2000)
              }
            }
          })
          .catch(function (error) {
            alert("error")
          });
      } else {
        that.form.codeTips = '请输入手机号'
      }
    },
    getCode() {
      let that = this;
      const TIME_COUNT = 60;
      if (!that.timer) {
        that.count = TIME_COUNT;
        that.textBtn = '已发送（'+that.count+'S）';
        that.timer = setInterval(() => {
          if (that.count > 0 && that.count <= TIME_COUNT) {
            that.count--;
            that.textBtn = '已发送（'+that.count+'S）';
          } else {
            clearInterval(that.timer);
            that.textBtn = '发送验证码';that.flag = true;
          }
        }, 1500)
      }
    },
    onsubmit() {
      var that = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$axios.post('resetPassword.do',this.$qs.stringify({ userName: this.form.username,newPassword:this.$md5('(<>::dkj2154|'+this.form.passwd1+'.4543,%^%$@;d458,l'),newPasswordCheck:this.$md5('(<>::dkj2154|'+this.form.passwd2+'.4543,%^%$@;d458,l'),mobileCode:this.form.mobileCode}))
          .then(function (response) {
            if (response.status === 200) {
              var data = that.$qs.parse(response.data)
              if(data.content=="success"){that.$router.push({path: '/login'})}
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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
  @import '../assets/scss/login.scss';
</style>
