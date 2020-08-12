<template>
  <div class="container-fluid bg-white h-100">
    <div class="articles-box">
      <div class="article-item border border-primary"> <router-link to="/articles/lists/1111">算力派新手指导</router-link> </div>
      <div class="article-item border border-primary"> <router-link to="/articles/lists/2222">什么是算力派？</router-link> </div>
      <div class="article-item border border-primary"> <router-link to="/articles/lists/3333">算力派如何运作？</router-link> </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.articles-box{
  height:100%; padding:5rem;
  .article-item{
    width:300px;padding:1rem 2rem;margin:0 auto 3rem auto;text-align: center;
  }
}
</style>

<script>
  export default{
    name: 'articles'
  }
</script>