<template>
  <div class="app-container">
    <el-row>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span style="font-weight: bold"><i class="el-icon-stopwatch"/> 年度销量分析</span><br/><br/>
            <el-select v-model="salesOrg" placeholder="销售组织" style="margin-left: 1%" @change="changeAnalysis()" :clearable="true" >
              <el-option
                v-for="item in saleOrgOptions"
                :key="item.label"
                :label="item.value"
                :value="item.label">
              </el-option>
            </el-select>
            <span style="margin-left: 4%">
              <el-date-picker
                format="yyyy年"
                v-model="saleNumYear"
                type="year"
                placeholder="选择日期时间"
                :picker-options="pickerOptionsStart"
                :clearable="false"
                style="width: 125px"
                @change="changeYearNum()">
              </el-date-picker><br/><br/>
              <el-select v-model="analysisWay" placeholder="请选择分析维度" style="margin-left: 1%;width: 140px" @change="changeAnalysis()" >
              <el-option
                v-for="item in analysisOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            </span>
          </div>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="salesNumView" style="height: 663px"/>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12" class="card-box">
        <el-card>
          <div slot="header">
            <span style="font-weight: bold"><i class="el-icon-stopwatch"/> 年度销量达成情况</span><br/><br/>
            <el-select v-model="salesCompleteOrg" placeholder="销售组织" style="margin-left: 1%" @change="changeCompleteOrg()" :clearable="true" >
              <el-option
                v-for="item in saleOrgOptions"
                :key="item.label"
                :label="item.value"
                :value="item.label">
              </el-option>
            </el-select>
            <span style="margin-left: 2%">
              <el-date-picker
                format="yyyy年"
                v-model="saleCompleteYear"
                type="year"
                placeholder="选择日期时间"
                :picker-options="pickerOptionsStart"
                :clearable="false"
                style="width: 125px"
                @change="changeCompleteYear()">
              </el-date-picker>
            </span>
          </div>
          <br/><br/>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="salesCompleteView" style="height: 680px"/>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-row>
      <el-col :span="24" class="card-box">
        <el-card>
          <div slot="header">
            <span style="font-weight: bold"><i class="el-icon-data-analysis"/> 年度销量分析</span>
            <span style="float: right">{{saleYear.getFullYear()}}年</span>
          </div>
          <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="78px">
            <el-row>
              <el-col :span="12">
                <el-form-item label="年份" prop="saleYear">
                  <el-date-picker
                    v-model="saleYear"
                    type="year"
                    placeholder="选择日期时间"
                    :picker-options="pickerOptionsStart"
                    style="float: right"
                    :clearable="false"
                    @change="changeYear()">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="销售组织" prop="saleOrg">
                  <el-select
                    v-model="queryParams.saleOrg"
                    placeholder="销售组织"
                    clearable
                    style="width: 240px"
                  >
                    <el-option
                      v-for="item in saleOrgOptions"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="分销渠道" prop="distributionChannel">
                  <el-select
                    v-model="queryParams.distributionChannel"
                    placeholder="分销渠道"
                    clearable
                    style="width: 240px"
                  >
                    <el-option
                      v-for="item in distributionOptions"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="产品组" prop="productGroup">
                  <el-select
                    v-model="queryParams.productGroup"
                    placeholder="产品组"
                    clearable
                    style="width: 240px"
                  >
                    <el-option
                      v-for="item in productGroupOptions"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="12">
                <el-form-item label="客户类型" prop="customerType">
                  <el-select
                    v-model="queryParams.customerType"
                    placeholder="客户类型"
                    clearable
                    style="width: 240px"
                  >
                    <el-option
                      v-for="item in customerTypeOptions"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item label="地区" prop="area">
                  <el-select
                    v-model="queryParams.area"
                    placeholder="地区"
                    clearable
                    style="width: 240px"
                  >
                    <el-option
                      v-for="item in areaOptions"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>

            <el-row>
              <el-col :span="12">
                <el-form-item label="行业/渠道" prop="industry">
                  <el-select
                    v-model="queryParams.industry"
                    placeholder="行业/渠道"
                    clearable
                    style="width: 240px"
                  >
                    <el-option
                      v-for="item in industryOptions"
                      :key="item.label"
                      :label="item.value"
                      :value="item.label"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-form-item style="float: right">
                <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
                <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
              </el-form-item>
            </el-row>
          </el-form>
          <div class="el-table el-table--enable-row-hover el-table--medium">
            <div ref="salesView" style="height: 550px;"/>
          </div>
        </el-card>
      </el-col>

    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card>
          <div slot="header">
            <span style="font-weight: bold"><i class="el-icon-s-marketing"/> 各销售组织销量表格</span><br/><br/>
            <el-date-picker
              format="yyyy年"
              v-model="saleTableDate"
              type="year"
              placeholder="选择日期时间"
              :picker-options="pickerOptionsStart"
              :clearable="false"
              style="width: 125px;"
              @change="changeTableDate()">
            </el-date-picker>
          </div>
          <el-table v-loading="loading" :data="orderDetailList" border :span-method="objectSpanMethod" height="673">
            <el-table-column label="销售组织" align="center" prop="saleOrg" fixed/>
            <el-table-column label="指标名称" align="center" prop="analysisType" fixed/>
            <el-table-column v-for="(item,index) in yearList" :label="item.label" :key="index" align="center" width="150">
              <template slot-scope="scope">
                <span v-if="(scope.$index+1) % 3 == 0">{{ scope.row.monthPrice[index] }}</span>
                <span v-else>￥{{ scope.row.monthPrice[index] }}</span>
              </template>
            </el-table-column>
            <el-table-column label="全年累计" align="center" prop="yearPrice" width="150">
              <template slot-scope="scope">
                <span v-if="scope.row.yearPrice==0">/</span>
                <span v-else>￥{{ scope.row.yearPrice }}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import { getOrderNumByMonthTable ,getOrderNumByMonth,getSaleCacheData,getSaleNumData} from "@/api/sale/orderDetail";
import * as echarts from "echarts";

export default {
  name: "SaleChart",
  data() {
    return {
      // 遮罩层
      loading: true,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 销售订单明细表格数据
      orderDetailList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        saleYear: null,
        saleOrg: null,
        distributionChannel: null,
        productGroup: null,
        area: null,
        industry: null,
        customerType: null,
      },
      yearList: [{
        label: '1月',
      },{
        label: '2月',
      },{
        label: '3月',
      },{
        label: '4月',
      },{
        label: '5月',
      },{
        label: '6月',
      },{
        label: '7月',
      },{
        label: '8月',
      },{
        label: '9月',
      },{
        label: '10月',
      },{
        label: '11月',
      },{
        label: '12月',
      }],
      salesOrg: '',
      salesCompleteOrg: '',
      saleOrgOptions: [],
      distributionOptions: [],
      productGroupOptions: [],
      industryOptions: [],
      areaOptions: [],
      customerTypeOptions: [],
      analysisOptions: [{
        value: 'distributionChannel',
        label: '分销渠道'
      },{
        value: 'productGroup',
        label: '产品组'
      },{
        value: 'customerType',
        label: '客户类型'
      }, {
        value: 'area',
        label: '地区'
      },{
        value: 'industry',
        label: '行业/渠道'
      }],
      salesView: null,
      salesNumView: null,
      salesCompleteView:null,
      saleYear: '',
      saleTableDate: '',
      saleCompleteYear: '',
      analysisWay: 'distributionChannel',
      saleNumYear: '',
      pickerOptionsStart: {
        disabledDate: time => {
          return time.getTime() > Date.now() || time.getTime() < new Date("2021-01-01").getTime()
        },
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.saleYear=new Date();
    this.saleNumYear=new Date();
    this.saleTableDate=new Date();
    this.saleCompleteYear=new Date();
    this.getSalesView();
    this.getList();
    this.getCachedData();
    this.getSalesNumView();
    this.getSalesCompleteView();
  },
  methods: {
    formatNumberWithRegex(number) {
      return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    changeAnalysis(){
      this.getSalesNumView();
    },
    changeCompleteYear(){
      this.getSalesCompleteView();
    },
    handleQuery() {
      this.getSalesView();
    },
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    getCachedData(){
        getSaleCacheData().then((response) => {
          this.saleOrgOptions = response.data[0];
          this.distributionOptions=response.data[1];
          this.productGroupOptions=response.data[2];
          this.industryOptions=response.data[3];
          this.areaOptions=response.data[4];
          this.customerTypeOptions=response.data[5];
        })
    },
    changeYear(){
      this.getSalesView();
    },
    changeYearNum(){
      this.getSalesNumView();
    },
    changeTableDate(){
      this.getList();
    },
    changeCompleteOrg(){
      this.getSalesCompleteView();
    },
    getList(){
      this.loading = true;
      getOrderNumByMonthTable(this.saleTableDate.getFullYear()==null?new Date().getFullYear():this.saleTableDate.getFullYear(),this.queryParams).then((response) => {
        this.orderDetailList = response.data;
        this.loading = false;
      })
    },
    objectSpanMethod({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 0) {
        if (rowIndex % 3 === 0) {
          return {
            rowspan: 3,
            colspan: 1
          };
        } else {
          return {
            rowspan: 0,
            colspan: 0
          };
        }
      }
    },
    getSalesView(){
      getOrderNumByMonth(this.saleYear.getFullYear()==null?new Date().getFullYear():this.saleYear.getFullYear(),this.queryParams).then((response) => {
        let rate = [];
        let nowYear=response.data[0];
        let lastYear=response.data[1];
        for (let i = 0; i < 12; i++) {
          if(lastYear[i]==0){
            rate.push(100);
          }else {
            rate.push(((nowYear[i]-lastYear[i])/lastYear[i]*100).toFixed(2));
          }
        }
        if(this.salesView==null){
          this.salesView = echarts.init(this.$refs.salesView);
        }
        let _this=this;
        this.salesView.setOption({
          tooltip: {
            trigger: 'axis',
            axisPointer: {
              type: 'shadow'
            },
            formatter: function (params) {
              let str='<a style="font-weight: bold">' + params[0].name + '</a><br/>';
              for(let i=0;i<params.length;i++){
                if(params[i].seriesName=='同比增长率'){
                  str+=`<svg width="15" height="15"><circle cx="7" cy="10" r="5" fill="${params[i].color}"/></svg>` + params[i].seriesName + ' : ' + params[i].value + '%';
                }else {
                  str+=`<svg width="15" height="15"><circle cx="7" cy="10" r="5" fill="${params[i].color}"/></svg>` + params[i].seriesName + ' : ' + _this.formatNumberWithRegex(params[i].value) + '元' + '<br/>'
                }
              }
                return str;
            }
          },
          legend: {
            data: [ '上年同期销量','月度销量', '同比增长率']
          },
          grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: [
            {
              type: 'category',
              data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
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
            {
              type: 'value',
              name: '增长率',
              position: 'right',
              axisLabel: {
                formatter: '{value}%',
                align: 'left'
              },
            }
          ],
          series: [
            {
              name: '上年同期销量',
              type: 'bar',
              barWidth: '40%',
              data: response.data[1],
              color: '#a3a3a3',
            },
            {
              name: '月度销量',
              type: 'bar',
              barWidth: '40%',
              data: response.data[0],
              barGap: '10%',
              barCategoryGap: '100%',
              color: '#0008ef',
            },
            {
              name: '同比增长率',
              type: 'line',
              yAxisIndex: 1,
              smooth: true,
              data: rate,
              color: '#f1c91b',
            },
          ]
        })
      })
    },

    getSalesNumView(){
      getSaleNumData(this.saleNumYear.getFullYear(),this.salesOrg==''?'none':this.salesOrg,this.analysisWay).then((response) => {
        if(this.salesNumView==null) {
          this.salesNumView = echarts.init(this.$refs.salesNumView);
        }
        let _this=this;
        this.salesNumView.setOption({
          title: {
              text: '各维度销量分析',
              //subtext: 'Fake Data',
              left: 'center'
            },
          tooltip: {
              trigger: 'item',
              formatter: function (params) {
                let str='<a style="font-weight: bold">' + params.seriesName + '</a><br/>';
                str+=`<svg width="15" height="15"><circle cx="7" cy="10" r="5" fill="${params.color}"/></svg>` + params.data.name + ' : ' + _this.formatNumberWithRegex(params.data.value) + '元' + '<br/>'
                //str+=`<svg width="15" height="15"><circle cx="7" cy="10" r="5" fill="${params.color}"/></svg>` + '占比 : ' + params.percent + '%' + '<br/>'
                return str;
              }
            },
          legend: {
              orient: 'vertical',
              left: 'left'
            },
          series: [
              {
                name: '销量分析',
                type: 'pie',
                radius: '50%',
                data: response.data,
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

    getSalesCompleteView(){
      getSaleCacheData().then((response) => {
        if(this.salesCompleteView==null) {
          this.salesCompleteView = echarts.init(this.$refs.salesCompleteView);
        }
        this.salesCompleteView.setOption({
          tooltip: {
            formatter: '{b} : {c}%'
          },
          series: [
            {
              name: '完成率',
              type: 'gauge',
              title: { // 标题位置
                offsetCenter: [0, '90%'],
                fontSize: 20
              },
              progress: {
                show: true
              },
              pointer: {
                show: true,
                length: "80%",
                width: 8,
              },
              detail: {
                valueAnimation: true,
                formatter: '{value}%'
              },
              data: [
                {
                  value: 50,
                  name: '本年度销售额完成率'
                }
              ]
            }
          ]
        })
    })
    }
  }
};
</script>
