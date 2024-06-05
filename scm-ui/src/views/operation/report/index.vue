<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="130px">
      <el-form-item label="销售订单编号" prop="orderCode">
        <el-input
          v-model="queryParams.orderCode"
          placeholder="请输入销售订单编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行项目" prop="lineItem">
        <el-input
          v-model="queryParams.lineItem"
          placeholder="请输入行项目"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="wbs元素" prop="wbs">
        <el-input
          v-model="queryParams.wbs"
          placeholder="请输入wbs元素"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="工厂" prop="factory">
        <el-input
          v-model="queryParams.factory"
          placeholder="请输入工厂"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="销售订单创建日期" prop="orderTime">
        <el-date-picker clearable
          v-model="queryParams.orderTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择销售订单创建日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="入库日期" prop="storageTime">
        <el-date-picker clearable
          v-model="queryParams.storageTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择入库日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="确认日期" prop="confirmTime">
        <el-date-picker clearable
          v-model="queryParams.confirmTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择确认日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="发货日期" prop="deliveryTime">
        <el-date-picker clearable
          v-model="queryParams.deliveryTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择发货日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="订单状态" prop="orderState">
        <el-input
          v-model="queryParams.orderState"
          placeholder="请输入订单状态"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="项目名称" prop="projectName">
        <el-input
          v-model="queryParams.projectName"
          placeholder="请输入项目名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户名称" prop="customerName">
        <el-input
          v-model="queryParams.customerName"
          placeholder="请输入客户名称"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料编号" prop="materialCode">
        <el-input
          v-model="queryParams.materialCode"
          placeholder="请输入物料编号"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料描述" prop="materialDesc">
        <el-input
          v-model="queryParams.materialDesc"
          placeholder="请输入物料描述"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="物料长描述" prop="materialLongDesc">
        <el-input
          v-model="queryParams.materialLongDesc"
          placeholder="请输入物料长描述"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单数量" prop="orderNum">
        <el-input
          v-model="queryParams.orderNum"
          placeholder="请输入订单数量"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="订单金额" prop="orderPrice">
        <el-input
          v-model="queryParams.orderPrice"
          placeholder="请输入订单金额"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="请求发货日期" prop="requestDeliveryTime">
        <el-date-picker clearable
          v-model="queryParams.requestDeliveryTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择请求发货日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          v-hasPermi="['operation:report:add']"
        >新增</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="success"
          plain
          icon="el-icon-edit"
          size="mini"
          :disabled="single"
          @click="handleUpdate"
          v-hasPermi="['operation:report:edit']"
        >修改</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['operation:report:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['operation:report:export']"
        >导出</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>
    <el-form size="small" :inline="true" v-show="showSearch" label-width="130px">
      <el-form-item label="请选择同步时间:">
        <el-date-picker
          v-model="syncDate"
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
          v-loading.fullscreen.lock="syncLoading"
          element-loading-text="同步中请稍候"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
          type="primary"
          plain
          icon="el-icon-switch-button"
          size="mini"
          @click="handleSyncData()"
        >同步数据</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" :data="reportList" @selection-change="handleSelectionChange" height="620">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键" align="center" prop="ptrId" />
      <el-table-column label="销售订单编号" align="center" prop="orderCode" />
      <el-table-column label="行项目" align="center" prop="lineItem" />
      <el-table-column label="wbs元素" align="center" prop="wbs" />
      <el-table-column label="工厂" align="center" prop="factory" />
      <el-table-column label="销售订单创建日期" align="center" prop="orderTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入库日期" align="center" prop="storageTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.storageTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="确认日期" align="center" prop="confirmTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.confirmTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="发货日期" align="center" prop="deliveryTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.deliveryTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" align="center" prop="orderType" />
      <el-table-column label="订单状态" align="center" prop="orderState" />
      <el-table-column label="项目名称" align="center" prop="projectName" />
      <el-table-column label="客户名称" align="center" prop="customerName" />
      <el-table-column label="物料编号" align="center" prop="materialCode" />
      <el-table-column label="物料描述" align="center" prop="materialDesc" />
      <el-table-column label="物料长描述" align="center" prop="materialLongDesc" />
      <el-table-column label="订单数量" align="center" prop="orderNum" />
      <el-table-column label="订单金额" align="center" prop="orderPrice" />
      <el-table-column label="请求发货日期" align="center" prop="requestDeliveryTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.requestDeliveryTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['operation:report:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['operation:report:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />

    <!-- 添加或修改项目执行进度跟踪报表明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="销售订单编号" prop="orderCode">
          <el-input v-model="form.orderCode" placeholder="请输入销售订单编号" />
        </el-form-item>
        <el-form-item label="行项目" prop="lineItem">
          <el-input v-model="form.lineItem" placeholder="请输入行项目" />
        </el-form-item>
        <el-form-item label="wbs元素" prop="wbs">
          <el-input v-model="form.wbs" placeholder="请输入wbs元素" />
        </el-form-item>
        <el-form-item label="工厂" prop="factory">
          <el-input v-model="form.factory" placeholder="请输入工厂" />
        </el-form-item>
        <el-form-item label="销售订单创建日期" prop="orderTime">
          <el-date-picker clearable
            v-model="form.orderTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择销售订单创建日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="入库日期" prop="storageTime">
          <el-date-picker clearable
            v-model="form.storageTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择入库日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="确认日期" prop="confirmTime">
          <el-date-picker clearable
            v-model="form.confirmTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择确认日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="发货日期" prop="deliveryTime">
          <el-date-picker clearable
            v-model="form.deliveryTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择发货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单状态" prop="orderState">
          <el-input v-model="form.orderState" placeholder="请输入订单状态" />
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName">
          <el-input v-model="form.projectName" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="物料编号" prop="materialCode">
          <el-input v-model="form.materialCode" placeholder="请输入物料编号" />
        </el-form-item>
        <el-form-item label="物料描述" prop="materialDesc">
          <el-input v-model="form.materialDesc" placeholder="请输入物料描述" />
        </el-form-item>
        <el-form-item label="物料长描述" prop="materialLongDesc">
          <el-input v-model="form.materialLongDesc" placeholder="请输入物料长描述" />
        </el-form-item>
        <el-form-item label="订单数量" prop="orderNum">
          <el-input v-model="form.orderNum" placeholder="请输入订单数量" />
        </el-form-item>
        <el-form-item label="订单金额" prop="orderPrice">
          <el-input v-model="form.orderPrice" placeholder="请输入订单金额" />
        </el-form-item>
        <el-form-item label="请求发货日期" prop="requestDeliveryTime">
          <el-date-picker clearable
            v-model="form.requestDeliveryTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择请求发货日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listReport, getReport, delReport, addReport, updateReport, syncReportData } from "@/api/operation/report";
import {asyncAddSalesData} from "@/api/sale/orderDetail";

export default {
  name: "Report",
  data() {
    return {
      // 遮罩层
      loading: true,
      syncLoading:false,
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
      // 项目执行进度跟踪报表明细表格数据
      reportList: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        orderCode: null,
        lineItem: null,
        wbs: null,
        factory: null,
        orderTime: null,
        storageTime: null,
        confirmTime: null,
        deliveryTime: null,
        orderType: null,
        orderState: null,
        projectName: null,
        customerName: null,
        materialCode: null,
        materialDesc: null,
        materialLongDesc: null,
        orderNum: null,
        orderPrice: null,
        requestDeliveryTime: null
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      },
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
      syncDate:[]
    };
  },
  created() {
    this.getList();
    this.initSyncDate();
  },
  methods: {
    initSyncDate(){
      this.syncDate[0]=new Date().getFullYear()+"-"+"01"+"-"+"01";
      this.syncDate[1]=new Date().getFullYear()+"-"+(new Date().getMonth()+1<10?"0"+(new Date().getMonth()+1):(new Date().getMonth()+1))+"-"+(new Date().getDate()<10?"0"+new Date().getDate():new Date().getDate());
    },
    /** 查询项目执行进度跟踪报表明细列表 */
    getList() {
      this.loading = true;
      listReport(this.queryParams).then(response => {
        this.reportList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        ptrId: null,
        orderCode: null,
        lineItem: null,
        wbs: null,
        factory: null,
        orderTime: null,
        storageTime: null,
        deliveryTime: null,
        orderType: null,
        orderState: null,
        projectName: null,
        customerName: null,
        materialCode: null,
        materialDesc: null,
        materialLongDesc: null,
        orderNum: null,
        orderPrice: null,
        requestDeliveryTime: null
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.ptrId)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加项目执行进度跟踪报表明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const ptrId = row.ptrId || this.ids
      getReport(ptrId).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改项目执行进度跟踪报表明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.ptrId != null) {
            updateReport(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addReport(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const ptrIds = row.ptrId || this.ids;
      this.$modal.confirm('是否确认删除项目执行进度跟踪报表明细编号为"' + ptrIds + '"的数据项？').then(function() {
        return delReport(ptrIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('operation/report/export', {
        ...this.queryParams
      }, `report_${new Date().getTime()}.xlsx`)
    },
    //手动同步sap数据
    handleSyncData(){
      this.syncLoading=true;
      syncReportData(this.syncDate[0],this.syncDate[1]).then(response => {
        if(response.code==200){
          this.$modal.msgSuccess("同步成功");
          this.syncLoading=false;
          this.getList();
        }else{
          this.$modal.msgError(response.msg);
          this.syncLoading=false;
        }
      })
    }
  }
};
</script>
