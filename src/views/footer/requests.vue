<template>
  <div class="col-lg-8 offset-lg-2 rounded my-3 bg-white">
    <div class="form-box p-4 text-dark">
      <h5 class="text-dark">提交工单 <b-link class="float-right small text-decoration-none" @click="$router.go(-1)">返回上一页</b-link> </h5>
      <hr/>
        <b-jumbotron class="text-black bg-light">
          <form @submit.prevent="onsubmit" class="needs-validation">
            <b-form-group label-cols="6" label-cols-lg="2" label="邮箱地址" class="offset-lg-3">
              <b-form-input name="email" class="col-lg-6" v-model.trim="email" v-validate="{ required: true , regex: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/ }" :class="{'input': true, 'border-danger': errorBags.has('email') }" data-vv-as="电邮地址"></b-form-input>
              <span v-show="errorBags.has('email')" class="text-danger">{{ errorBags.first('email') }}</span>
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="邮件主题" class="offset-lg-3">
              <b-form-input name="emailSubject" class="col-lg-6" v-model.trim="emailSubject" v-validate="{ required: true }" :class="{'input': true, 'border-danger': errorBags.has('emailSubject') }" data-vv-as="邮件主题"></b-form-input>
              <span v-show="errorBags.has('emailSubject')" class="text-danger">{{ errorBags.first('emailSubject') }}</span>
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="问题描述" class="offset-lg-3">
              <b-form-textarea name="questionDescribe" class="col-lg-6" v-model.trim="questionDescribe" v-validate="{ required: true }" :class="{'input': true, 'border-danger': errorBags.has('questionDescribe') }" data-vv-as="问题描述"></b-form-textarea>
              <p class="text-muted small">请在此描述您的问题，Suanlipai收到工单后会尽快答复您</p>
              <span v-show="errorBags.has('questionDescribe')" class="text-danger">{{ errorBags.first('questionDescribe') }}</span>
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="问题类型" class="offset-lg-3">
              <b-form-input name="questionType" class="col-lg-6" v-model.trim="questionType" v-validate="{ required: true }" :class="{'input': true, 'border-danger': errorBags.has('questionType') }" data-vv-as="问题类型"></b-form-input>
              <span v-show="errorBags.has('questionType')" class="text-danger">{{ errorBags.first('questionType') }}</span>
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="订单ID" class="offset-lg-3">
              <b-form-input name="orderId" class="col-lg-6" v-model.trim="orderId" v-validate="{ }" :class="{'input': true, 'border-danger': errorBags.has('orderId') }" data-vv-as="订单ID"></b-form-input>
              <p class="text-muted small">请填入相关订单号</p>
              <span v-show="errorBags.has('orderId')" class="text-danger">{{ errorBags.first('orderId') }}</span>
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="附件" class="offset-lg-3">
              <b-form-input name="enclosure" class="col-lg-6" v-model.trim="enclosure" v-validate="{  }" :class="{'input': true, 'border-danger': errorBags.has('enclosure') }" data-vv-as="附件"></b-form-input>
              <span v-show="errorBags.has('enclosure')" class="text-danger">{{ errorBags.first('enclosure') }}</span>
            </b-form-group>
            <b-form-group label-cols="6" label-cols-lg="2" label="" class="offset-lg-3">
              <p class="text-danger">{{tips}}</p>
              <b-button class="py-2" type="submit" variant="primary">确认下单</b-button>
            </b-form-group>
        </form>
        </b-jumbotron>
    </div>
  </div>
</template>

<script>
export default {
  name: 'requests',
  data() {
    return {
      email:null,emailSubject:null,questionDescribe:'',questionType:null,orderId:null,enclosure:null,tips:null
    };
  },
  methods: {
    onsubmit(){
      var that = this;
      this.$validator.validateAll().then((result) => {
        if (result) {
          this.$axios.post('pageFoot/submitRepairOrder.do',
          this.$qs.stringify({ email: this.email, emailSubject: this.emailSubject, questionDescribe:this.questionDescribe, questionType: this.questionType, orderId: this.orderId,
          enclosure: this.enclosure }))
          .then(function (response) {
            if (response.status === 200) {
              var data = that.$qs.parse(response.data)
              if(data.content == 'success'){alert('提交成功');that.$router.push({ path:'/index' });}
            }
          })
          .catch(function (error) {
            console.log(error)
          });
        }
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>

</style>
