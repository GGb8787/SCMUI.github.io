<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="78px">
      <el-form-item label="订单日期" prop="orderTime">
        <el-date-picker clearable
          v-model="queryParams.orderTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="请选择订单日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item label="销售组织" prop="saleOrg">
        <el-input
          v-model="queryParams.saleOrg"
          placeholder="请输入销售组织"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="分销渠道" prop="distributionChannel">
        <el-input
          v-model="queryParams.distributionChannel"
          placeholder="请输入分销渠道"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="产品组" prop="productGroup">
        <el-input
          v-model="queryParams.productGroup"
          placeholder="请输入产品组"
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
      <el-form-item label="业务员" prop="salePerson">
        <el-input
          v-model="queryParams.salePerson"
          placeholder="请输入业务员"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="地区" prop="area">
        <el-input
          v-model="queryParams.area"
          placeholder="请输入地区"
          clearable
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="行业/渠道" prop="industry">
        <el-input
          v-model="queryParams.industry"
          placeholder="请输入行业/渠道"
          clearable
          @keyup.enter.native="handleQuery"
        />
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
          v-hasPermi="['sale:orderDetail:add']"
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
          v-hasPermi="['sale:orderDetail:edit']"
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
          v-hasPermi="['sale:orderDetail:remove']"
        >删除</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="info"
          plain
          icon="el-icon-upload2"
          size="mini"
          @click="handleImport"
          v-hasPermi="['sale:orderDetail:import']"
        >导入</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="warning"
          plain
          icon="el-icon-download"
          size="mini"
          @click="handleExport"
          v-hasPermi="['sale:orderDetail:export']"
        >导出</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-switch-button"
          size="mini"
          @click="handleSyncData()"
        >同步数据</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="orderDetailList" @selection-change="handleSelectionChange" height="620">
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column label="主键id" align="center" prop="id" />
      <el-table-column label="订单日期" align="center" prop="orderTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.orderTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="订单类型" align="center" prop="orderType" />
      <el-table-column label="订单类型描述" align="center" prop="orderDesc" />
      <el-table-column label="销售组织" align="center" prop="saleOrg" />
      <el-table-column label="销售组织描述" align="center" prop="saleOrgDesc" />
      <el-table-column label="分销渠道" align="center" prop="distributionChannel" />
      <el-table-column label="分销渠道描述" align="center" prop="distributionChannelDesc" />
      <el-table-column label="产品组" align="center" prop="productGroup" />
      <el-table-column label="产品组描述" align="center" prop="productGroupDesc" />
      <el-table-column label="客户编码" align="center" prop="customerCode" />
      <el-table-column label="客户名称" align="center" prop="customerName" />
      <el-table-column label="业务员" align="center" prop="salePerson" />
      <el-table-column label="地区" align="center" prop="area" />
      <el-table-column label="行业/渠道" align="center" prop="industry" />
      <el-table-column label="客户类型" align="center" prop="customerType" />
      <el-table-column label="订单状态" align="center" prop="orderStatus" />
      <el-table-column label="大项目id" align="center" prop="largeProjectId" />
      <el-table-column label="大项目名称" align="center" prop="largeProjectName" />
      <el-table-column label="子项目名称" align="center" prop="subProjectName" />
      <el-table-column label="正式/备份" align="center" prop="orderRecord" />
      <el-table-column label="正式日期" align="center" prop="officialTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.officialTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="报价编号" align="center" prop="quoteCode" />
      <el-table-column label="客户参考" align="center" prop="customerRef" />
      <el-table-column label="客户参考日期" align="center" prop="customerRefTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.customerRefTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="请求发货日期" align="center" prop="requestShipTime" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.requestShipTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="付款条件" align="center" prop="paymentTerms" />
      <el-table-column label="付款描述" align="center" prop="paymentDesc" />
      <el-table-column label="销售订单编号" align="center" prop="orderCode" />
      <el-table-column label="行项目" align="center" prop="lineItem" />
      <el-table-column label="行项目备注" align="center" prop="lineItemDesc" />
      <el-table-column label="物料编号" align="center" prop="materialCode" />
      <el-table-column label="物料描述" align="center" prop="materialDesc" />
      <el-table-column label="物料长描述" align="center" prop="materialLongDesc" />
      <el-table-column label="订单数量" align="center" prop="orderNum" />
      <el-table-column label="实际单价" align="center" prop="actualUnitPrice" />
      <el-table-column label="实际总额" align="center" prop="actualTotalPrice" />
      <el-table-column label="目录单价" align="center" prop="catalogUnitPrice" />
      <el-table-column label="目录总额" align="center" prop="catalogTotalPrice" />
      <el-table-column label="税率" align="center" prop="taxRate" />
      <el-table-column label="汇率" align="center" prop="exchangeRate" />
      <el-table-column label="币别" align="center" prop="currency" />
      <el-table-column label="发货数量" align="center" prop="shipNum" />
      <el-table-column label="发货金额" align="center" prop="shipPrice" />
      <el-table-column label="开票数量" align="center" prop="invoiceNum" />
      <el-table-column label="开票金额" align="center" prop="invoicePrice" />
      <el-table-column label="发货日期" align="center" prop="shipDate" width="180">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.shipDate, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="未发货数量" align="center" prop="noShipNum" />
      <el-table-column label="未发货金额" align="center" prop="noShipPrice" />
      <el-table-column label="当前库存数量" align="center" prop="stock" />
      <el-table-column label="客户物料编码" align="center" prop="customerMaterialCode" />
      <el-table-column label="客户物料名称" align="center" prop="customerMaterialName" />
      <el-table-column label="生产附件要求" align="center" prop="productDocReq" />
      <el-table-column label="创建人" align="center" prop="createBy" />
      <el-table-column label="拒接原因" align="center" prop="rejectCause" />
      <el-table-column label="wbs元素" align="center" prop="wbs" />
      <el-table-column label="项目类别" align="center" prop="projectType" />
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            @click="handleUpdate(scope.row)"
            v-hasPermi="['sale:orderDetail:edit']"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['sale:orderDetail:remove']"
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

    <!-- 添加或修改销售订单明细对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="订单日期" prop="orderTime">
          <el-date-picker clearable
            v-model="form.orderTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择订单日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="订单类型描述" prop="orderDesc">
          <el-input v-model="form.orderDesc" placeholder="请输入订单类型描述" />
        </el-form-item>
        <el-form-item label="销售组织" prop="saleOrg">
          <el-input v-model="form.saleOrg" placeholder="请输入销售组织" />
        </el-form-item>
        <el-form-item label="销售组织描述" prop="saleOrgDesc">
          <el-input v-model="form.saleOrgDesc" placeholder="请输入销售组织描述" />
        </el-form-item>
        <el-form-item label="分销渠道" prop="distributionChannel">
          <el-input v-model="form.distributionChannel" placeholder="请输入分销渠道" />
        </el-form-item>
        <el-form-item label="分销渠道描述" prop="distributionChannelDesc">
          <el-input v-model="form.distributionChannelDesc" placeholder="请输入分销渠道描述" />
        </el-form-item>
        <el-form-item label="产品组" prop="productGroup">
          <el-input v-model="form.productGroup" placeholder="请输入产品组" />
        </el-form-item>
        <el-form-item label="产品组描述" prop="productGroupDesc">
          <el-input v-model="form.productGroupDesc" placeholder="请输入产品组描述" />
        </el-form-item>
        <el-form-item label="客户编码" prop="customerCode">
          <el-input v-model="form.customerCode" placeholder="请输入客户编码" />
        </el-form-item>
        <el-form-item label="客户名称" prop="customerName">
          <el-input v-model="form.customerName" placeholder="请输入客户名称" />
        </el-form-item>
        <el-form-item label="业务员" prop="salePerson">
          <el-input v-model="form.salePerson" placeholder="请输入业务员" />
        </el-form-item>
        <el-form-item label="地区" prop="area">
          <el-input v-model="form.area" placeholder="请输入地区" />
        </el-form-item>
        <el-form-item label="行业/渠道" prop="industry">
          <el-input v-model="form.industry" placeholder="请输入行业/渠道" />
        </el-form-item>
        <el-form-item label="大项目id" prop="largeProjectId">
          <el-input v-model="form.largeProjectId" placeholder="请输入大项目id" />
        </el-form-item>
        <el-form-item label="大项目名称" prop="largeProjectName">
          <el-input v-model="form.largeProjectName" placeholder="请输入大项目名称" />
        </el-form-item>
        <el-form-item label="子项目名称" prop="subProjectName">
          <el-input v-model="form.subProjectName" placeholder="请输入子项目名称" />
        </el-form-item>
        <el-form-item label="正式/备份" prop="orderRecord">
          <el-input v-model="form.orderRecord" placeholder="请输入正式/备份" />
        </el-form-item>
        <el-form-item label="正式日期" prop="officialTime">
          <el-date-picker clearable
            v-model="form.officialTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择正式日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="报价编号" prop="quoteCode">
          <el-input v-model="form.quoteCode" placeholder="请输入报价编号" />
        </el-form-item>
        <el-form-item label="客户参考" prop="customerRef">
          <el-input v-model="form.customerRef" placeholder="请输入客户参考" />
        </el-form-item>
        <el-form-item label="客户参考日期" prop="customerRefTime">
          <el-date-picker clearable
            v-model="form.customerRefTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择客户参考日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="请求发货日期" prop="requestShipTime">
          <el-date-picker clearable
            v-model="form.requestShipTime"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择请求发货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="付款条件" prop="paymentTerms">
          <el-input v-model="form.paymentTerms" placeholder="请输入付款条件" />
        </el-form-item>
        <el-form-item label="付款描述" prop="paymentDesc">
          <el-input v-model="form.paymentDesc" placeholder="请输入付款描述" />
        </el-form-item>
        <el-form-item label="销售订单编号" prop="orderCode">
          <el-input v-model="form.orderCode" placeholder="请输入销售订单编号" />
        </el-form-item>
        <el-form-item label="行项目" prop="lineItem">
          <el-input v-model="form.lineItem" placeholder="请输入行项目" />
        </el-form-item>
        <el-form-item label="行项目备注" prop="lineItemDesc">
          <el-input v-model="form.lineItemDesc" placeholder="请输入行项目备注" />
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
        <el-form-item label="实际单价" prop="actualUnitPrice">
          <el-input v-model="form.actualUnitPrice" placeholder="请输入实际单价" />
        </el-form-item>
        <el-form-item label="实际总额" prop="actualTotalPrice">
          <el-input v-model="form.actualTotalPrice" placeholder="请输入实际总额" />
        </el-form-item>
        <el-form-item label="目录单价" prop="catalogUnitPrice">
          <el-input v-model="form.catalogUnitPrice" placeholder="请输入目录单价" />
        </el-form-item>
        <el-form-item label="目录总额" prop="catalogTotalPrice">
          <el-input v-model="form.catalogTotalPrice" placeholder="请输入目录总额" />
        </el-form-item>
        <el-form-item label="税率" prop="taxRate">
          <el-input v-model="form.taxRate" placeholder="请输入税率" />
        </el-form-item>
        <el-form-item label="汇率" prop="exchangeRate">
          <el-input v-model="form.exchangeRate" placeholder="请输入汇率" />
        </el-form-item>
        <el-form-item label="币别" prop="currency">
          <el-input v-model="form.currency" placeholder="请输入币别" />
        </el-form-item>
        <el-form-item label="发货数量" prop="shipNum">
          <el-input v-model="form.shipNum" placeholder="请输入发货数量" />
        </el-form-item>
        <el-form-item label="发货金额" prop="shipPrice">
          <el-input v-model="form.shipPrice" placeholder="请输入发货金额" />
        </el-form-item>
        <el-form-item label="开票数量" prop="invoiceNum">
          <el-input v-model="form.invoiceNum" placeholder="请输入开票数量" />
        </el-form-item>
        <el-form-item label="开票金额" prop="invoicePrice">
          <el-input v-model="form.invoicePrice" placeholder="请输入开票金额" />
        </el-form-item>
        <el-form-item label="发货日期" prop="shipDate">
          <el-date-picker clearable
            v-model="form.shipDate"
            type="date"
            value-format="yyyy-MM-dd"
            placeholder="请选择发货日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="未发货数量" prop="noShipNum">
          <el-input v-model="form.noShipNum" placeholder="请输入未发货数量" />
        </el-form-item>
        <el-form-item label="未发货金额" prop="noShipPrice">
          <el-input v-model="form.noShipPrice" placeholder="请输入未发货金额" />
        </el-form-item>
        <el-form-item label="当前库存数量" prop="stock">
          <el-input v-model="form.stock" placeholder="请输入当前库存数量" />
        </el-form-item>
        <el-form-item label="客户物料编码" prop="customerMaterialCode">
          <el-input v-model="form.customerMaterialCode" placeholder="请输入客户物料编码" />
        </el-form-item>
        <el-form-item label="客户物料名称" prop="customerMaterialName">
          <el-input v-model="form.customerMaterialName" placeholder="请输入客户物料名称" />
        </el-form-item>
        <el-form-item label="生产附件要求" prop="productDocReq">
          <el-input v-model="form.productDocReq" placeholder="请输入生产附件要求" />
        </el-form-item>
        <el-form-item label="拒接原因" prop="rejectCause">
          <el-input v-model="form.rejectCause" placeholder="请输入拒接原因" />
        </el-form-item>
        <el-form-item label="wbs元素" prop="wbs">
          <el-input v-model="form.wbs" placeholder="请输入wbs元素" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 用户导入对话框 -->
    <el-dialog :title="upload.title" :visible.sync="upload.open" width="400px" append-to-body >
      <el-upload
        ref="upload"
        :limit="1"
        accept=".xlsx, .xls"
        :headers="upload.headers"
        :action="upload.url + '?updateSupport=' + upload.updateSupport"
        :disabled="upload.isUploading"
        :on-progress="handleFileUploadProgress"
        :on-success="handleFileSuccess"
        :auto-upload="false"
        drag
      >
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip text-center" slot="tip">
          <div class="el-upload__tip" slot="tip">
            <el-checkbox v-model="upload.updateSupport" /> 是否更新已经存在的销售订单明细
          </div>
          <span>仅允许导入xls、xlsx格式文件。</span>
          <el-link type="primary" :underline="false" style="font-size:12px;vertical-align: baseline;" @click="importTemplate">下载模板</el-link>
        </div>
      </el-upload>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitFileForm">确 定</el-button>
        <el-button @click="upload.open = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { listOrderDetail, getOrderDetail, delOrderDetail, addOrderDetail, updateOrderDetail, asyncAddSalesData } from "@/api/sale/orderDetail";
import {getToken} from "@/utils/auth";

export default {
  name: "OrderDetail",
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
        pageNum: 1,
        pageSize: 10,
        orderTime: null,
        saleOrg: null,
        distributionChannel: null,
        productGroup: null,
        customerName: null,
        salePerson: null,
        area: null,
        industry: null,
        customerType: null,
      },
      // 销售订单明细导入参数
      upload: {
        // 是否显示弹出层（销售订单明细导入）
        open: false,
        // 弹出层标题（销售订单明细导入）
        title: "",
        // 是否禁用上传
        isUploading: false,
        // 是否更新已经存在的销售订单明细
        updateSupport: 0,
        // 设置上传的请求头部
        headers: { Authorization: "Bearer " + getToken() },
        // 上传的地址
        url: process.env.VUE_APP_BASE_API + "/sale/orderDetail/importData"
      },
      // 表单参数
      form: {},
      // 表单校验
      rules: {
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询销售订单明细列表 */
    getList() {
      this.loading = true;
      listOrderDetail(this.queryParams).then(response => {
        this.orderDetailList = response.rows;
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
        id: null,
        orderTime: null,
        orderType: null,
        orderDesc: null,
        saleOrg: null,
        saleOrgDesc: null,
        distributionChannel: null,
        distributionChannelDesc: null,
        productGroup: null,
        productGroupDesc: null,
        customerCode: null,
        customerName: null,
        salePerson: null,
        area: null,
        industry: null,
        customerType: null,
        orderStatus: null,
        largeProjectId: null,
        largeProjectName: null,
        subProjectName: null,
        orderRecord: null,
        officialTime: null,
        quoteCode: null,
        customerRef: null,
        customerRefTime: null,
        requestShipTime: null,
        paymentTerms: null,
        paymentDesc: null,
        orderCode: null,
        lineItem: null,
        lineItemDesc: null,
        materialCode: null,
        materialDesc: null,
        materialLongDesc: null,
        orderNum: null,
        actualUnitPrice: null,
        actualTotalPrice: null,
        catalogUnitPrice: null,
        catalogTotalPrice: null,
        taxRate: null,
        exchangeRate: null,
        currency: null,
        shipNum: null,
        shipPrice: null,
        invoiceNum: null,
        invoicePrice: null,
        shipDate: null,
        noShipNum: null,
        noShipPrice: null,
        stock: null,
        customerMaterialCode: null,
        customerMaterialName: null,
        productDocReq: null,
        createBy: null,
        rejectCause: null,
        wbs: null,
        projectType: null
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
      this.ids = selection.map(item => item.id)
      this.single = selection.length!==1
      this.multiple = !selection.length
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "添加销售订单明细";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      const id = row.id || this.ids
      getOrderDetail(id).then(response => {
        this.form = response.data;
        this.open = true;
        this.title = "修改销售订单明细";
      });
    },
    /** 提交按钮 */
    submitForm() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != null) {
            updateOrderDetail(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addOrderDetail(this.form).then(response => {
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
      const ids = row.id || this.ids;
      this.$modal.confirm('是否确认删除销售订单明细编号为"' + ids + '"的数据项？').then(function() {
        return delOrderDetail(ids);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    /** 导出按钮操作 */
    handleExport() {
      this.download('sale/orderDetail/export', {
        ...this.queryParams
      }, `orderDetail_${new Date().getTime()}.xlsx`)
    },
    /** 导入按钮操作 */
    handleImport() {
      this.upload.title = "销售订单明细导入";
      this.upload.open = true;
    },
    // 文件上传中处理
    handleFileUploadProgress(event, file, fileList) {
      this.upload.isUploading = true;
    },
    // 文件上传成功处理
    handleFileSuccess(response, file, fileList) {
      this.upload.open = false;
      this.upload.isUploading = false;
      this.$refs.upload.clearFiles();
      this.$alert("<div style='overflow: auto;overflow-x: hidden;max-height: 70vh;padding: 10px 20px 0;'>" + response.msg + "</div>", "导入结果", { dangerouslyUseHTMLString: true });
      this.getList();
    },
    /** 下载模板操作 */
    importTemplate() {
      this.download('sale/orderDetail/importTemplate', {
      }, `sale_template_${new Date().getTime()}.xlsx`)
    },
    // 提交上传文件
    submitFileForm() {
      this.$refs.upload.submit();
    },
    //手动同步sap数据
    handleSyncData(){
      asyncAddSalesData().then(response => {

      })
    }
  }
};
</script>
