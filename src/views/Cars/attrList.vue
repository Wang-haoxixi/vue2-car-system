<!--
 * @Description: 车辆属性
 * @Author: wh
 * @Date: 2022-07-12 09:11:56
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-12 23:35:01
-->
<template>
  <div>
    <div class="parking-search-form">
      <!-- table组件 -->
      <TableComponent ref="tsbleDataRef" :config="tableConfig">
        <!-- 车辆属性 TODO: 点击车辆属性前，表格不能让其加载 -->
        <template v-slot:attrsList>
          <el-button style="margin-bottom: 20px" size="small" :type=" item.id === attr.id ? 'primary' : ''" v-for="(item, index) in attrs" :key="index" @click="handleAttrs(item)">{{ item.value }}</el-button>
        </template>
      </TableComponent>
    </div>

    <!-- 新增车辆自定义属性 -->
    <AddCarAttrs :falgDialog.sync="dialogShow" :data.sync="attr" />
  </div>
</template>

<script>
  import AddCarAttrs from "@/components/Dialog/addAttrs";
  import { GetCarAttrs, GetCustomAttrs } from "@/api/carAttrs"
  import TableComponent from "@/components/TableComponent"
  export default {
    name: "CarAttrs",
    components: { TableComponent, AddCarAttrs },
    data () {
      return {
        dialogShow: false,
        // 车辆属性
        attrs: [],
        // 属性
        attr: {},
        // 自定义属性
        customAttrs: [],
        // 当前行的ID
        rowId: "",
        // 表格数据配置
        tableConfig: {
          // 是否加载表格(点击车辆属性前，表格不能让其加载，只有点击了属性才进行表格加载)
          isRequest: false,

          // 是否显示表格搜索
          showSearchForm: true,

          // 抬头项
          head: [
            { label: "字段", prop: "key" },
            { label: "文本", prop: "value" },
          ],

          // 是否多选 
          selection: false,

          // api请求接口
          apiUrl: "carAttrsListUrl",

          // 是否显示页码
          pagination: true,

          // 请求参数
          params: {
            pageSize: 10,
            pageNumber: 1,
          },

          // 搜索表单配置
          formItems: [{
            prop: "keyworad",
            type: "Keyworad",
            label: "关键字",
            options: ["key", "value"],
          }, ],

          // 新增等其他按钮
          formHandler: [
            { label: "新增", prop: "add", type: "success", ele: "btn", handler: this.handleAdd },
          ]
        }
      }
    },
    created () {
      this.getCarAttrs();
    },
    methods: {
      // 新增自定义车辆属性(打开对话框)
      handleAdd () {
        if (!this.attr.id) return this.$message.warning('请先选择车辆属性！');
        this.dialogShow = true;
      },
      // 获取车辆属性（顶级）
      getCarAttrs () {
        GetCarAttrs().then(res => {
          const data = res.data.data.data;
          // 防止后端返回的data可能为null
          data && (this.attrs = data);
        })
      },
      // 点击车辆属性(顶级)
      handleAttrs (data) {
        // 存属性
        this.attr = data;
        // this.getCustomAttrs();
        const params = {
          typeId: this.attr.id
        }
        this.$refs.tsbleDataRef.refreshTableData(params);
      },
      // 车辆自定义属性列表
      // getCustomAttrs () {
      //   GetCustomAttrs({ typeId: this.attr.id }).then(res => {
      //     const data = res.data.data;
      //     data && (this.customAttrs = data);
      //   })
      // }
    }
  }
</script>

<style lang="scss" scoped>
</style>