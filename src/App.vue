<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  created:function(){
    //登陆成功后获取数据字典，保存前端
    this.$axios.get('product/selectAllDataDic')
    .then(function (response) {
      if (response.status === 200) {
        var data = response.data.content;
        for (var i = 0; i < data.length; i++ ){ 
          delete data[i].remarks;delete data[i].systemCode;
        }
        sessionStorage.setItem('slpDic',JSON.stringify(data))
      }
    })
    .catch(function (error) {
      console.log(error)
    });
    //数据字典end
  },    
  watch:{
    '$route':function(to,from){
      this.$parent.$el.scrollTop = 0
    }
  }
}
</script>

<style lang="scss">
html,body,#app{
  height: 100%; background-color: #d8d8d8;min-width: 1440px;
}
@media (min-width: 1200px) {
  html,body,#app{
    overflow-x: hidden;min-width: 1200px;
  }
}
</style>
