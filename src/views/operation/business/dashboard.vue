<template>
  <div class="app-container">
    <el-card>
      <el-row>
        <h1 style="text-align: center;font-weight: bold">经营数据可视化看板</h1>
      </el-row>
      <el-card>
        <el-row>
          <el-col :span="8">
            <div ref="inProcessView" style="height: 400px;"/>
          </el-col>
          <el-col :span="8" class="orderTypeView">
            <div ref="orderTypeView" style="height: 400px"/>
          </el-col>
          <el-col :span="8">
            <div ref="orderView" style="height: 400px;"/>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div ref="orderTypeView" style="height: 400px"/>
          </el-col>
        </el-row>
      </el-card>
    </el-card>
  </div>
</template>

<script>
import { getInProcessData , getOrderTypeData } from "@/api/operation/report";
import * as echarts from "echarts";
export default {
  name: "Dashboard",
  data(){
    return{
      inProcessView:null,
      orderTypeView:null,
    }
  },
  created() {
    this.getInProcessView();
    this.getOrderTypeView();
  },
  methods: {
    formatNumberWithRegex(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    getInProcessView(){
      getInProcessData().then(response=>{
        if(this.inProcessView==null) {
          this.inProcessView = echarts.init(this.$refs.inProcessView);
        }
        let _this=this;
        this.inProcessView.setOption({
          title: {
            text: '在制订单',
            //subtext: 'Fake Data',
            left: 'center'
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            selectedMode: false,
          },
          tooltip: {
            trigger: 'item',
            formatter: function (params) {
              let str='<a style="font-weight: bold">' + params.seriesName + '</a><br/>';
              str+=`<svg width="15" height="15"><circle cx="7" cy="10" r="5" fill="${params.color}"/></svg>` + params.data.name + ' : ' + _this.formatNumberWithRegex(params.data.value) + '元' + '<br/>'
              str+=`<svg width="15" height="15"><circle cx="7" cy="10" r="5" fill="${params.color}"/></svg>` + '占比 : ' + params.percent + '%' + '<br/>'
              return str;
            }
          },
          series: [
            {
              name: '在制订单',
              type: 'pie',
              radius: '50%',
              data: response.data,
              label: {
                normal: {
                  show: true,
                  formatter: "{d}% ",
                  textStyle: {
                    color: "#000000",
                    fontWeight: "bold",
                  },
                },
              },
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      })
    },
    getOrderTypeView(){
      getOrderTypeData().then(response=>{
        if(this.orderTypeView==null) {
          this.orderTypeView = echarts.init(this.$refs.orderTypeView);
        }
        response.data.push({
          pieName: '其他',
          data: [
            {name:'自制金额',value:0},
            {name:'外协金额',value:0},
            {name:'未确认金额',value:1000}
            ]
        })
        response.data.push({
          pieName: '合计',
          data: [
            {name:'自制金额',value:0},
            {name:'外协金额',value:0},
            {name:'未确认金额',value:1000}
          ]
        })
        response.data.push({
          pieName: 'a',
          data: [
            {name:'自制金额',value:0},
            {name:'外协金额',value:0},
            {name:'未确认金额',value:1000}
          ]
        })
        this.orderTypeView.setOption({
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center',
            selectedMode: false,
          },
          title: {
            text: '外协占比',
            //subtext: 'Fake Data',
            left: 'center'
          },
          series: (function() {
            let series = [];
            let x=100/(response.data.length+1);
            let size=85;
            if(response.data.length>=3){
              size=85-85/response.data.length;
            }
            for (let i = 1; i < response.data.length+1; i++) {
              if(i==1){
                let item = {
                  name: response.data[i-1].pieName,
                  type: "pie",
                  radius: [size, size+20],
                  center: [x+'%', '50%'],
                  //avoidLabelOverlap: false,
                  itemStyle: {

                  },
                  label: {
                    normal: {
                      show: true,
                      formatter: "{a}\n\n{b}:{c}元\n\n{d}% ",
                      textStyle: {
                        color: "#000000",
                        fontWeight: "bold",
                      },
                    },
                  },
                  // label: {
                  //   show: false,
                  //   position: 'center'
                  // },
                  // emphasis: {
                  //   label: {
                  //     show: true,
                  //     fontSize: 15,
                  //     fontWeight: 'bold'
                  //   }
                  // },
                  // labelLine: {
                  //   show: true
                  // },
                  data: response.data[i-1].data,
                };
                series.push(item);
              }else {
                let item = {
                  name: response.data[i-1].pieName,
                  type: "pie",
                  radius: [size, size+20],
                  //avoidLabelOverlap: true,
                  center: [x+x*(i-1)+'%', '50%'],
                  itemStyle: {

                  },
                  label: {
                    normal: {
                      show: true,
                      formatter: "{a}\n\n{b}:{c}元\n\n{d}%  ",
                      textStyle: {
                        color: "#000000",
                        fontWeight: "bold",
                      },
                    },
                  },
                  // label: {
                  //   show: false,
                  //   position: 'center'
                  // },
                  // emphasis: {
                  //   label: {
                  //     show: true,
                  //     fontSize: 15,
                  //     fontWeight: 'bold'
                  //   }
                  // },
                  // labelLine: {
                  //   show: false
                  // },
                  data: response.data[i-1].data
                };
                series.push(item);
              }
            }
            return series;
          })(),
        });
        //随着屏幕大小调节图表
        window.addEventListener("resize", () => {
          this.orderTypeView.resize();
          this.inProcessView.resize();
        });
      })
    }
  }
}
</script>

<style scoped>

</style>
