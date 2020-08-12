<template>
  <iframe ref="login" :src="`http://202.107.200.148:8088/?lan=${this.$i18n.locale}`" frameborder="0" scrolling="no"></iframe>
</template>

<script>
export default {
  name: 'navbar',
  data() {
    return { }
  }
}
</script>

<style lang="scss" scoped>
iframe{ width: 100%; height: 100%; position: absolute; top: 0;z-index: 999999999; }
</style>
