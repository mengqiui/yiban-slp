<template>
	<b-card style="height:677px;" class="border-0">
    <h6>修改密码<b-link class="float-right small" onclick="history.go(-1)">返回上一页</b-link></h6><hr>
    <div class="w-40 mt-5 mx-auto">
      <form @submit.prevent="onsubmit" class="needs-validation">
        <b-form-group class="text-right small" style="line-height: 33px;" label-cols="8" label-cols-lg="4" label="手机号码：">
          <p class="text-left mb-0" style="font-size: 1.1rem;">{{(username).substr(0, 3) + '****' + (username).substr(7)}}</p>
        </b-form-group>
              <input type="text" name="username" style="opacity:0;position: absolute;z-index:-999;" autocomplete />
        <b-form-group class="text-right small position-relative" label-cols="8" label-cols-lg="4" label="手机验证码：" label-for="userCode">
          <b-form-input id="userCode" name="userCode" v-model.trim="userCode" v-validate="{ required: true, numeric: true, digits: 6 }" 
            type="text" :class="{'input': true, 'border-danger': errorBags.has('userCode') }" data-vv-as="验证码"></b-form-input>
            <span v-show="errorBags.has('userCode')" class="text-danger float-left">{{ errorBags.first('userCode') }}</span>
          <div class="position-absolute tel-code">丨<b-link class="font-weight-light small text-decoration-none text-secondary" @click="flag && sendCode()">{{textBtn}}</b-link></div>
          <div class="text-danger mt-1">{{codeTips}}</div>
        </b-form-group>
        <input type="password" name="username" style="opacity:0;position: absolute;z-index:-999;" autocomplete />
        <b-form-group class="text-right small" label-cols="8" label-cols-lg="4" label="输入旧密码：" label-for="oldPwd">
          <b-form-input id="oldPwd" v-model.trim="oldPwd" name="oldPwd" v-validate="{ required: true , min: 6 , max: 20, regex: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/ }"
            type="password" class="form-control box-input" :class="{'input': true, 'border-danger': errorBags.has('oldPwd') }" data-vv-as="旧密码"></b-form-input>
          <span v-show="errorBags.has('oldPwd')" class="text-danger float-left">{{ errorBags.first('oldPwd') }}</span>
        </b-form-group>
        <b-form-group class="text-right small" label-cols="8" label-cols-lg="4" label="输入新密码：" label-for="passwd1">
          <b-form-input id="passwd1" name="passwd1" ref="passwd1" v-model.trim="passwd1" v-validate="{ required: true , min: 6 , max: 20, regex: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/ }"
            type="password" class="form-control box-input" :class="{'input': true, 'border-danger': errorBags.has('passwd1') }" data-vv-as="新密码1"></b-form-input>
          <span v-show="errorBags.has('passwd1')" class="text-danger float-left">{{ errorBags.first('passwd1') }}</span>
        </b-form-group>
        <b-form-group class="text-right small" label-cols="8" label-cols-lg="4" label="再次输入密码：" label-for="passwd2">
          <b-form-input id="passwd2" name="passwd2" v-model.trim="passwd2" v-validate="{ required: true , min: 6 , max: 20 , confirmed: 'passwd1' , regex: /^(?![\d]+$)(?![a-zA-Z]+$)(?![^\da-zA-Z]+$).{6,20}$/ }"
            type="password" class="form-control box-input" :class="{'input': true, 'border-danger': errorBags.has('passwd2') }" data-vv-as="新密码2"></b-form-input>
          <span v-show="errorBags.has('passwd2')" class="text-danger float-left">{{ errorBags.first('passwd2') }}</span>
        </b-form-group>
        <b-form-group label-cols-lg="4">        
          <p class="text-danger small mb-1">{{tips}}</p>
          <b-button variant="outline-primary" type="submit" block>确认修改</b-button>
        </b-form-group>
      </form>
    </div>
	</b-card>
</template>
<style lang="scss" scoped>
.w-40{ width:40%; }
.imgBox{ height:118px; width:118px; border:2px dashed #dbdbdb; color:#00a9ff; margin:14px 26px 20px 0; font-size:13px; position:relative;line-height:36px; overflow:hidden; }
.imgBox>.icon{ font-size:22px; background:#00a9ff; border-radius:50%; margin:5px; padding:0; width:26px; height:26px; line-height:26px; text-shadow: 1px 1px 1px rgba(0,0,0,.2); }
.imgBox input[type=file]{ height:100%; width:100%; opacity:0; cursor:pointer; }
.imgBox:hover{ color:#007eff; }
.imgBox .icon{ margin:22px 0 10px; font-size:40px; display:block;text-shadow: 2px 1px 0 #a3e0ff; }
.tel-code{ top:2px; }
</style>
<script>
export default{
    name: 'changePwd',
    data(){
      return {
        username:sessionStorage.getItem('slpUser'), textBtn:'发送验证码', oldPwd:'', passwd1:'',
        passwd2:'', userCode:'', flag: true, tips:'', codeTips:'', timer: null, count: null
      }
    },
    methods:{
      sendCode() {
        var that = this;
        var reg = /^1[3456789]\d{9}$/;
        if (reg.test(this.username)) {//手机号正确
          this.$axios.post('sendSmsCode.do',this.$qs.stringify({ userName: this.username}))
            .then(function (response) {
              if (response.status === 200) {
                var data = that.$qs.parse( response.data )
                if(data.content=="success"){ that.getCode();that.flag = false; }
                else{that.timer = setInterval(() => { that.tips=data.content; }, 10)//接口返回发送失败提示
                  setTimeout(function(){ clearInterval( that.timer ); that.tips=''; },2000)
                }
              }
            })
            .catch(function (error) {
              alert("error")
            });
        } else {
          that.tips='请重新登录或使用谷歌浏览器登录！';
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
            this.$axios.post('/api/auth/changepasswd.do',this.$qs.stringify(
              { newPasswordCheck:this.$md5('(<>::dkj2154|'+this.passwd2+'.4543,%^%$@;d458,l'), newPassword:this.$md5('(<>::dkj2154|'+this.passwd1+'.4543,%^%$@;d458,l'),
               oldPassword:this.$md5('(<>::dkj2154|'+this.oldpwd+'.4543,%^%$@;d458,l'), mobileCode:this.userCode }))
            .then(function (response) {
              if (response.status === 200) {
                var data = that.$qs.parse(response.data)
                if(data.content == 'success'){
                  alert(data.content)
                  that.$router.push({path: '/myinfo/userSetup'});
                }else{
                  that.tips = data.content;
                }
              }
            })
            .catch(function (error) {
              that.tips = error;
            });
          }
        });
      }

    }
  }
</script>
