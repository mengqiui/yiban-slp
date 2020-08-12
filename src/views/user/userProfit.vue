<template>
	<b-card>
    <h6>每日产出<b-link class="float-right small" onclick="history.go(-1)">返回上一页</b-link></h6><hr>
    <div>      
      <DatePicker v-model="timeRange" type="daterange" range-separator="~" start-placeholder="开始日期" end-placeholder="结束日期"
        align="right" :picker-options="pickerOptions" unlink-panels value-format="yyyy-MM-dd" class="float-right mb-3" @change="getData"> </DatePicker>
      <b-table responsive sticky-header="495px" :items="items" :fields="fields" class="border text-center" show-empty head-variant="light">
        <template v-slot:empty>
          <b-alert show variant="secondary" class="text-center">暂无数据！</b-alert>
        </template> 
      </b-table>
    </div>
	</b-card>
</template>
<style lang="scss" scoped>
</style>
<script>
import { DatePicker } from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
export default{
    name: 'userProfit',
    components: { DatePicker },
    data(){
      return {
        items:[],
        fields:[ { key: 'settlementDate', label: '时间' }, { key: 'orderId', label: '订单编号' },{ key: 'blockHeight', label: '区块高度' },, { key: 'revenueNumber', label: '产出' }, { key: 'minerPool', label: '矿池' } ],
        pickerOptions: {
          shortcuts: [{
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          }, {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }]
        },
        timeRange: [],
      }
    },
    created:function(){
      this.getData();
    },
    methods:{
      getData(){
        var that = this;
        this.$axios.post('/profitRecord.do',this.$qs.stringify({ coinType:'BTC', orderId:'', isAll:'1', startDate:this.timeRange?this.timeRange[0]:'', endDate:this.timeRange?this.timeRange[1]:'' }))
        .then(function (response) {
          if (response.status === 200) {
            var data = response.data;
            that.items = data.content;
            
          }
        })
        .catch(function (error) {
          console.log(error)
        });
      },
 
    }
  }
</script>
