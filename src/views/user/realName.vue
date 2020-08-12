<template>
	<b-card style="height:677px;" class="border-0">
    <h6>实名认证<b-link class="float-right small" onclick="history.go(-1)">返回上一页</b-link></h6><hr>
    <div class="w-40 mt-5 mx-auto">
      <form @submit.prevent="onsubmit" class="needs-validation">
        <b-form-group class="text-right small" style="line-height: 33px;" label-cols="8" label-cols-lg="4" label="手机号码：">
          <p class="text-left mb-0" style="font-size: 1.1rem;">{{(username).substr(0, 3) + '****' + (username).substr(7)}}</p>
        </b-form-group>
        <b-form-group class="text-right small position-relative" label-cols="8" label-cols-lg="4" label="手机验证码：" label-for="mobileCode">
          <b-form-input id="mobileCode" name="mobileCode" v-model.trim="mobileCode" v-validate="{ required: true, numeric: true, digits: 6 }" 
          :class="{'input': true, 'border-danger': errorBags.has('mobileCode') }" data-vv-as="验证码"></b-form-input>
          <span v-show="errorBags.has('mobileCode')" class="text-danger float-left">{{ errorBags.first('mobileCode') }}</span>
          <div class="position-absolute tel-code">丨<b-link class="font-weight-light small text-decoration-none text-dark" @click="flag && sendCode()">{{textBtn}}</b-link></div>
          <div class="text-danger mt-1">{{codeTips}}</div>
        </b-form-group>
        <b-form-group class="text-right small" label-cols="8" label-cols-lg="4" label="真实姓名：" label-for="realName">
          <b-form-input id="realName" name="realName" v-model.trim="realName" v-validate="{ required: true, regex: /^[\u4e00-\u9fa5]{2,4}$/ }" 
          :class="{'input': true, 'border-danger': errorBags.has('realName') }" data-vv-as="真实姓名"></b-form-input>
          <span v-show="errorBags.has('realName')" class="text-danger float-left">{{ errorBags.first('realName') }}</span>
        </b-form-group>
        <b-form-group class="text-right small" label-cols="8" label-cols-lg="4" label="真实身份证号：" label-for="realcard">
          <b-form-input id="realcard" name="realcard" v-model.trim="idNum" v-validate="{ required: true, regex: /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/ }" 
          :class="{'input': true, 'border-danger': errorBags.has('realcard') }" data-vv-as="真实身份证号"></b-form-input>
          <span v-show="errorBags.has('realcard')" class="text-danger float-left">{{ errorBags.first('realcard') }}</span>
        </b-form-group>
        <b-form-group label-cols-lg="4">        
          <p class="text-danger small mb-1">{{tips}}</p>
          <b-button variant="outline-primary" block type="submit">确认</b-button>
        </b-form-group>
        <b-form-group label-cols="8" label-cols-lg="4">
          <b-card-text class="text-danger small">注：实名认证完后不可修改，请确认信息无误后再提交</b-card-text>
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
.imgBox:hover{ color:#007eff;  }
.imgBox .icon{ margin:22px 0 10px; font-size:40px; display:block;text-shadow: 2px 1px 0 #a3e0ff; }
.tel-code{ top:2px; }
</style>
<script>
export default{
    name: 'realName',
    data(){
      return {
        username:sessionStorage.getItem('slpUser'), textBtn:'发送验证码', realName:'', idNum:'',
        mobileCode:'', flag: true, tips:'', codeTips:'', timer: null, count: null
      }
    },
    methods:{
      sendCode() {
        var that = this;
        if (this.username) {//手机号存在
          this.$axios.post('sendSmsCode.do',this.$qs.stringify({ userName: this.username}))
            .then(function (response) {
              if (response.status === 200) {
                var data = that.$qs.parse( response.data )
                if(data.content=="success"){ that.getCode();that.flag = false; }
                else{that.timer = setInterval(() => { that.codeTips = data.content; }, 10)//接口返回发送失败提示
                  setTimeout(function(){ clearInterval( that.timer ); that.codeTips=''; },2000)
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
            this.$axios.post('/editUserBaseInfo.do',this.$qs.stringify({ flag:'1', realName:this.realName, idType:'1', idNum:this.idNum, mobileCode:this.mobileCode }))
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
