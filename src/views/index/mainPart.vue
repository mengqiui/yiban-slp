<template>
  <div class="container-fluid h-100 pb-5">
    <headerbox></headerbox>
    <router-view></router-view>  
    <footerBottom></footerBottom>
  </div>
</template>
<style scoped>
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
.container-fluid{
    animation: main 1s;
    padding: 0;
    background-color: #d8d8d8;
}
body{
    background:#d8d8d8;
    overflow-x: hidden
}
</style>
<script>
  import headerbox from '@/components/navbar'
  import footerBottom from '@/components/footer'
  export default{
    name: 'mainPart',
    components: { headerbox,footerBottom }
  }
</script>

