<template>
  <div class="app-container">
    <el-row>
      <el-card :span="12" class="card-box">
        <el-row>
          <div style="height: 50px">
            <span style="font-weight: bold;margin-left: 42%;font-size: 40px">经营数据看板</span>
          </div>
        </el-row>
        <el-row style="border-radius: 5px;margin-top: 20px">
          <el-form size="small" :inline="true" label-width="130px">
            <el-form-item label="请选择查询时间:">
              <el-date-picker
                v-model="dateRange"
                type="daterange"
                align="right"
                unlink-panels
                :clearable="false"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                :picker-options="pickerOptions"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                plain
                icon="el-icon-switch-button"
                size="mini"
                @click="handleGetData()"
              >查询</el-button>
            </el-form-item>
            <el-form-item>
              <el-button
                type="warning"
                plain
                icon="el-icon-download"
                size="mini"
                @click="exportExcel()"
              >导出</el-button>
            </el-form-item>
            <el-form-item label="数据最后更新时间:" style="float:right;">{{lastUpdateTime}}</el-form-item>
          </el-form>
        </el-row>
        <el-row>
          <el-table v-loading="loading" :data="reportList" height="660" :span-method="objectSpanMethod" ref="opTable" id="table_data"
                    border stripe :header-cell-style="{'text-align':'center'}" v-hasPermi="['operation:report:table']">
            <el-table-column label="车间" align="center" prop="workshop" width="50" fixed/>
            <el-table-column label="产品类型" align="center" prop="product" fixed/>
            <el-table-column label="在制" align="right" prop="inPrice" width="130" />
            <el-table-column label="在制-自制" align="right" prop="insourcePrice" width="130" />
            <el-table-column label="在制-外协" align="right" prop="outsourcePrice" width="130" />
            <el-table-column label="在制-未确认" align="right" prop="noTypePrice" width="130" />
            <el-table-column label="入库" align="right" prop="storagePrice" width="130" />
            <el-table-column label="入库-自制" align="right" prop="selfStoragePrice" width="130" />
            <el-table-column label="入库-外协" align="right" prop="outsourceStoragePrice" width="130" />
            <el-table-column label="入库-未确认" align="right" prop="noTypeStoragePrice" width="130" />
            <el-table-column label="发货" align="right" prop="deliveryPrice" width="130" />
            <el-table-column label="发货-自制" align="right" prop="selfDeliveryPrice" width="130" />
            <el-table-column label="发货-外协" align="right" prop="outsourceDeliveryPrice" width="130" />
            <el-table-column label="发货-未确认" align="right" prop="noTypeDeliveryPrice" width="130" />
            <el-table-column label="完工待发" align="right" prop="storageNoDeliveryPrice" width="130" />
          </el-table>
        </el-row>
        <el-row>
          <el-col :span="24">
            <div ref="gapView" style="height: 600px;margin-top: 20px">
              </div>
          </el-col>
        </el-row>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import { getTableData , getTableDataLastUpdateTime , getAnalysisGapData } from "@/api/operation/report";
import XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import * as echarts from "echarts";

export default {
  name: "Business",
  data(){
    return{
      // 遮罩层
      loading: false,
      //时间范围
      dateRange:[],
      //数据最后更新时间
      lastUpdateTime:'',
      //表格数据
      reportList:[],
      gapView:null,
      pickerOptions: {
        shortcuts: [{
          text: '全年累计',
          onClick(picker) {
            const end = new Date();
            const start=new Date();
            start.setDate(1);
            start.setMonth(0);
            picker.$emit('pick', [start, end]);
          }
        },{
          text: '当月滚动',
          onClick(picker) {
            const end = new Date();
            const start=new Date();
            start.setDate(1);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
    }
  },
  created() {
    this.initDateRange();
    this.getLastUpdateTime();
    this.getTable();
  },
  methods: {
    getLastUpdateTime(){
      getTableDataLastUpdateTime().then(response=>{
        if(response.data!=null){
          this.lastUpdateTime=response.data;
        }else{
          this.lastUpdateTime="暂无数据";
        }
      })
    },
    initDateRange(){
      this.dateRange[0]=new Date().getFullYear()+"-"+(new Date().getMonth()+1<10?"0"+(new Date().getMonth()+1):(new Date().getMonth()+1))+"-"+"01";
      this.dateRange[1]=new Date().getFullYear()+"-"+(new Date().getMonth()+1<10?"0"+(new Date().getMonth()+1):(new Date().getMonth()+1))+"-"+(new Date().getDate()<10?"0"+new Date().getDate():new Date().getDate());
    },
    handleGetData(){
      this.loading=true;
      getTableData(this.dateRange[0],this.dateRange[1]).then(response=>{
        this.reportList=response.data;
        this.getGapView();
        this.loading=false;
      })
    },
    getTable(){
      this.loading=true;
      getTableData(this.dateRange[0],this.dateRange[1]).then(response=>{
        this.reportList=response.data;
        this.loading=false;
        this.getGapView();
      })
    },
    //合并单元格
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if(columnIndex===0){
        if(rowIndex==this.reportList.length-1){
          return {
            rowspan: 1,
            colspan: 2
          }
        }
      }else if(columnIndex===1){
        if(rowIndex==this.reportList.length-1){
          return {
            rowspan: 0,
            colspan: 0
          }
        }
      }
      //console.log(this.reportList[this.reportList.length-1])
      //定义需要合并的列字段，有哪些列需要合并，就自定义添加字段即可
      const fields = ['workshop']
      // 当前行的数据
      const cellValue = row[column.property]
      // 判断只合并定义字段的列数据
      if (cellValue && fields.includes(column.property)) {
        const prevRow = this.reportList[rowIndex - 1] //上一行数据
        let nextRow = this.reportList[rowIndex + 1] //下一行数据
        // 当上一行的数据等于当前行数据时，当前行单元格隐藏
        if (prevRow && prevRow[column.property] === cellValue) {
          return { rowspan: 0, colspan: 0 }
        } else {
          // 反之，则循环判断若下一行数据等于当前行数据，则当前行开始进行合并单元格
          let countRowspan = 1 //用于合并计数多少单元格
          while (nextRow && nextRow[column.property] === cellValue) {
            nextRow = this.reportList[++countRowspan + rowIndex]
          }
          if (countRowspan > 1) {
            return { rowspan: countRowspan, colspan: 1 }
          }
        }
      }
    },
    exportExcel() {
      // 获取表格的DOM元素
      const opTable = this.$refs.opTable;
      var fix=document.querySelector(".el-table__fixed");
      let wb;
      if(fix){
        document.querySelector("#table_data").removeChild(fix)
        wb=XLSX.utils.table_to_book(opTable.$el);
        document.querySelector("#table_data").appendChild(fix);
      }else{
        wb = XLSX.utils.table_to_book(opTable.$el);
      }
      const wbout = XLSX.write(wb, { bookType: 'xlsx', bookSST: true, type: 'array' });
      try {
        // 导出Excel文件，fileName为自定义的文件名
        saveAs(new Blob([wbout], { type: 'application/octet-stream' }), '经营数据统计从'+this.dateRange[0]+'至'+this.dateRange[1]+'的数据.xlsx');
      } catch (e) {
        if (typeof console !== 'undefined') console.error(e, wbout);
      }
      return wbout;
    },
    //获取发货与入库差异对比图
    getGapView(){
      getAnalysisGapData(this.reportList).then(response=>{
        if(this.gapView==null){
          this.gapView = echarts.init(this.$refs.gapView);
        }
        this.gapView.setOption({
          title: {
            text: '发货与入库差异对比图',
            left: 'center'
          },
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
          },
          legend: {
            data: [ '发货','入库'],
            left: 'right'
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          dataset: {
            source: response.data
          },
          xAxis: [
            {
              type: 'category',
              axisLabel:{
                interval: 0,
              },
              axisTick: {
                alignWithLabel: true
              }
            }
          ],
          yAxis: [
            {
              type: 'value',
              name: '金额',
              position: 'left',
              axisLabel: {
                formatter: '{value}元',
                align: 'right'
              },
            },
          ],
          series: [
            {
              name: '发货',
              type: 'bar',
              barWidth: '40%',
              barGap: '15%',
              barCategoryGap: '110%',
              color: '#52b79b',
              label: {
                show: true,
                position: 'top',
              }
            },
            {
              name: '入库',
              type: 'bar',
              barWidth: '40%',
              barGap: '15%',
              barCategoryGap: '110%',
              color: '#99dbc6',
              label: {
                show: true,
                position: 'top',
              }
            },
          ]
        })
      })
    },
  }
}
</script>

<style scoped>

</style>
