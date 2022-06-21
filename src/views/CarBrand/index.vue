<template>
  <div>
    <!-- <el-row>
            <el-col :span="18">
                <el-form :inline="true" :model="formData" class="demo-form-inline">
                    <el-form-item label="车辆品牌">
                        <el-input v-model="formData.brand" placeholder="请输入品牌名称"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="onSubmit">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="6">
                <el-button type="primary" class="pull-right" @click="add">新增车辆品牌</el-button>
            </el-col>
        </el-row> -->

    <TableComponent ref="tsbleDataRef" :config="tableConfig">
      <!-- 禁启用 -->
      <template v-slot:status="data">
        <el-switch v-model="data.query.status" @change="statusChange(data.query)" :disabled="data.query.id == disableStatusId" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
      </template>
      <!-- 操作 -->
      <template v-slot:operate="data">
        <el-button size="mini" type="warning" @click="edit(data.query)">编辑</el-button>
        <el-button size="mini" type="danger" :loading="data.query.id == rowId" @click="brandDelete(data.query)">删除</el-button>
      </template>
    </TableComponent>

    <!-- 新增车辆品牌 -->
    <AddCarBrand :falgDialog.sync="dialogShow" :brandId.sync="brandId" @refresh="refresh" />
  </div>
</template>

<script>
import AddCarBrand from "@/components/Dialog/addCarBrand";
import TableComponent from "@/components/TableComponent";
import { BrandDelete, BrandStatus } from "@/api/brand";
export default {
  name: 'CarIndex',
  components: { AddCarBrand, TableComponent },
  data() {
    return {
      // 品牌ID
      brandId: "",
      // 当前行的ID
      rowId: "",
      // 控制禁启用防抖节流
      disableStatusId: false,
      dialogShow: false,
      // formData: {
      //     brand: "",
      // },

      // 表格数据配置
      tableConfig: {
        // 抬头项
        head: [
          {
            label: "LOGO",
            type: "image",
            imgWidth: "50",
            colWidth: "100",
          },
          {
            label: "车辆品牌",
            prop: "nameCh"
          },
          {
            label: "禁启用",
            type: "slot",
            // 插槽名称（可写入HTML）
            slotName: "status"
          },
          {
            label: "操作",
            type: "slot",
            slotName: "operate"
          },
        ],

        // 是否多选 
        selection: true,

        // api请求接口
        apiUrl: "brandListUrl",

        // 是否显示页码
        pagination: true,

        // 请求参数
        params: {
          pageSize: 10,
          pageNumber: 1,
        },

        // 搜索表单配置
        formItems: [
          {
            prop: "brand",
            type: "Input",
            label: "车辆品牌",
            width: "200px",
            placeholder: "请输入车辆品牌名称",
          },
        ],

        // 搜索按钮右边的其他配置项
        otherConfig: {
          // 重置按钮
          resetBtn: true,
        },

        // 新增等其他按钮
        formHandler: [
          { label: "新增车辆品牌", prop: "add", type: "danger", ele: "btn", handler: this.add },
        ]
      }
    }
  },
  methods: {
    refresh() {
      this.$refs.tsbleDataRef.refreshTableData();
    },
    handleChange(value) {
      console.log(value);
    },
    // onSubmit() {
    //     // console.log('submit!');
    //     const params = {
    //         pageSize: 10,
    //         pageNumber: 1,
    //     }
    //     if (this.formData.brand) params.brand = this.formData.brand;
    //     this.$refs.tsbleDataRef.refreshTableData(params);
    // },
    add() {
      this.dialogShow = true;
    },
    // 禁启用切换
    statusChange(data) {
      // console.log(data)
      // 请求接口前将禁启用禁用掉
      this.disableStatusId = data.id;
      const params = {
        id: data.id,
        status: data.status
      }
      BrandStatus(params).then((res) => {
        this.$message.success(res.data.message);
        // 请求成功开启禁启用
        this.disableStatusId = "";
      }).catch(() => { this.disableStatusId = ""; })
    },
    edit({ id }) {
      this.dialogShow = true;
      this.brandId = id;
    },
    brandDelete({ id }) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.rowId = id;
        BrandDelete({ id }).then(res => {
          // console.log(res)
          if (res.data.resCode == 0) {
            this.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.rowId = "";
          };
          // 刷新表格数据
          this.$refs.tsbleDataRef.refreshTableData();
        }).catch(() => { this.rowId = ""; });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    }
  }
}
</script>

<style lang="scss" scoped>
</style>