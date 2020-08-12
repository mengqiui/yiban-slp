// 项目公用的方法
var Fuc = {
  // 数据字典 
  getDict:function(val,key){
    var jsonObj = JSON.parse(sessionStorage.getItem("slpDic"));
    for (const i in jsonObj) {
      if(key == "id"){
        if(val == jsonObj[i].id){
          return jsonObj[i].cnName
        }
      }else{
        if(val == jsonObj[i].cnName){
          return jsonObj[i].id
        }
      }
    }
  },
  getTimestamp:function(time) { //把时间日期转成时间戳
    return (new Date(time)).getTime() / 1000
   }
}

export default Fuc;