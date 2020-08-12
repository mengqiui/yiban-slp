<template>
  <b-card no-body>
    <b-card-header header-tag="nav">
      <b-nav card-header tabs>
        <b-nav-item active>BTC</b-nav-item>
        <b-nav-item>BCH</b-nav-item>
        <b-nav-item>LTC</b-nav-item>
        <b-nav-item>ETH</b-nav-item>
        <b-nav-item>DCR</b-nav-item>
      </b-nav>
    </b-card-header>
    <b-card-body class="p-1">
      <div class="text-muted m-2">BTC 币种已支持的矿池：AntPool、BTC.com、F2Pool、ViaBTC、BTC.TOP</div>
      <b-table striped responsive bordered hover :items="items">
        <template v-slot:cell(操作)="data">
          <!-- `data.value` is the value after formatted by the Formatter -->
          <b-link v-b-modal.delSite>{{ data.value }}</b-link>
        </template>
      </b-table>
    </b-card-body>
    <b-card-footer class="text-center">
      <b-button variant="outline-secondary" v-b-modal.addSite>+添加新的BTC地址</b-button>
    </b-card-footer>
    <b-modal id="addSite" title="添加新地址">
      <b-form>
        <b-form-group label="新收币地址：" label-for="input-1" >
          <b-form-input v-model="form.email" type="email" placeholder="请输入收币地址" ></b-form-input>
        </b-form-group>
        <b-form-group label="验证手机号：" label-for="input-2">
          <b-form-input v-model="form.tel" placeholder="请输入验证码" ></b-form-input>
        </b-form-group>
      </b-form>
    </b-modal>
    <b-modal id="delSite" centered title="确认要删除吗？">
      <p class="my-4">该操作即将删掉XXX</p>
    </b-modal>
  </b-card>
</template>
<style lang="scss" scoped>
</style>
<script>
export default{
    name: 'earnAddress',
    data() {
      return {
        items: [
          { 地址: '1111z1CipvSdUAhjGMjmQ8hnECqd93dN', 备注: '--', 操作:'删除' },
          { 地址: '1111z1CipvSdUAhjGMjmQ8hnECqd93dN', 备注: '--', 操作:'删除' },
          { 地址: '1111z1CipvSdUAhjGMjmQ8hnECqd93dN', 备注: '--', 操作:'删除' },
          { 地址: '1111z1CipvSdUAhjGMjmQ8hnECqd93dN', 备注: '--', 操作:'删除' },
          { 地址: '1111z1CipvSdUAhjGMjmQ8hnECqd93dN', 备注: '--', 操作:'删除' },
        ],
        form: {
          email: '',
          tel: '',
        }
      }
    }
  }
</script>

