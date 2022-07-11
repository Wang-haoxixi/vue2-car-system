<template>
  <div>
    <!-- 搜索表单 -->
    <FormSearch ref="carAddRef" v-if="tableConfig.showSearchForm" :formItems="tableConfig.formItems" @search="search" :otherConfig="tableConfig.otherConfig || {}" :formHandler="tableConfig.formHandler" />

    <slot name="attrsList"></slot>

    <!-- 表格数据 -->
    <el-table v-loading="loading" :data="tableData" border style="width: 100%">

      <!-- 多选配置 -->
      <el-table-column v-if="tableConfig.selection" type="selection" width="55"></el-table-column>

      <template v-for="(item, index) in tableConfig.head">
        <!-- 回调 -->
        <el-table-column v-if="item.type === 'fun'" :key="index" :label="item.label" :width="item.colWidth">
          <template slot-scope="scope">
            <span v-html="item.fun && item.fun(scope.row)"></span>
          </template>
        </el-table-column>

        <!-- 图片 -->
        <el-table-column v-else-if="item.type === 'image'" :key="index" :label="item.label" :width="item.colWidth">
          <template slot-scope="scope">
            <img :src="scope.row[item.prop]" :width="item.imgWidth || 50" />
          </template>
        </el-table-column>

        <!-- 插槽 -->
        <el-table-column v-else-if="item.type === 'slot'" :key="index" :label="item.label" :width="item.colWidth">
          <template slot-scope="scope">
            <slot :name="item.slotName" :query="scope.row"></slot>
          </template>
        </el-table-column>

        <!-- 表格项 -->
        <el-table-column v-else :key="index" :prop="item.prop" :label="item.label" :width="item.colWidth"></el-table-column>
      </template>

    </el-table>

    <!-- 分页 -->
    <el-row class="padding-top-20" v-if="tableConfig.pagination">
      <el-col :span="4" style="padding: 1px"></el-col>
      <el-col :span="20">
        <!-- 分页 -->
        <el-pagination class="pull-right" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[2, 5, 10, 20]" :page-size="pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="total">
        </el-pagination>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import FormSearch from "@/components/FormSearch"
  import { GetTableData } from "@/api/common"
  import { ParkingList } from "@/api/parking"
  export default {
    name: "TableComponent",
    components: { FormSearch },
    props: {
      // 搜索配置
      // searchFormConfig: {
      //   type: Object,
      //   default: () => ({})
      // },
      // 表格数据配置
      config: {
        type: Object,
        default: () => ({})
      },
    },
    data () {
      return {
        // 加载提示
        loading: false,
        // 表格数据
        tableData: [],
        // 表格数据配置
        tableConfig: {
          aa: 111,
          // 是否加载表格
          isRequest: false,
          // 是否显示表格搜索
          showSearchForm: true,
          // 抬头项
          head: [],
          // 默认表格数据可多选
          selection: true,
          // api请求路径
          apiUrl: '',
          // 是否显示页码
          pagination: true,
          // 请求参数
          params: {},

          formItems: [],
          otherConfig: {},
          formHandler: [],
        },
        currentPage: 1,
        pageSizes: 10,
        total: 0,
      }
    },
    watch: {
      config: {
        handler (newVal) {
          // console.log(newVal)
          this.initConfig();
        },
        immediate: true,
      }
    },
    created () {
      // this.getParkingList()
    },
    methods: {
      // 搜索
      search (data) {
        let searchParams = data;
        searchParams.pageNumber = 1;
        searchParams.pageSize = 10;
        this.refreshTableData(searchParams);
      },
      // 初始化表格配置
      initConfig () {
        // 循环判断传进来的每项是否在本文件中有配置，并进行赋值
        for (const key in this.config) {
          if (Object.keys(this.tableConfig).includes(key)) {
            this.tableConfig[key] = this.config[key]
          }
        }

        // console.log(this.tableConfig)
        this.tableConfig.isRequest && this.loadTableData();
      },

      // 加载表格数据
      loadTableData () {
        this.loading = true;
        let requestData = {
          url: this.tableConfig.apiUrl,
          data: this.tableConfig.params,
        }
        GetTableData(requestData).then(res => {
          let data = res.data.data;
          if (data) {
            this.$nextTick(() => { // 考虑到DOM元素渲染完成后再赋值数据
              this.tableData = data.data;
              this.total = data.total;
              this.loading = false;
            })
          };
        }).catch(() => { this.loading = false; })
      },

      // 刷新表格数据（单独处理，供外部使用）
      refreshTableData (params) {
        // console.log(params)
        if (params) {
          // console.log("处理业务逻辑")
          this.tableConfig.params = params
        }
        this.loadTableData();
      },

      handleSizeChange (val) {
        // console.log(`每页 ${val} 条`);
        this.tableConfig.params.pageSize = val;
        this.loadTableData();
      },
      handleCurrentChange (val) {
        // console.log(`当前页: ${val}`);
        this.tableConfig.params.pageNumber = val;
        this.loadTableData();
      },
    },

  }
</script>

<style lang="scss" scoped>
</style>