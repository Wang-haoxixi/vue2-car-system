<template>
  <div>
    <div class="parking-search-form">
      <!-- table组件 -->
      <TableComponent ref="tsbleDataRef" :config="tableConfig">
        <!-- 车辆属性 -->
        <template v-slot:attrsList>
          <el-button style="margin-bottom: 20px" size="small" :type=" item.id === attrId ? 'primary' : ''" v-for="(item, index) in attrs" :key="index" @click="getAttrId(item)">{{ item.value }}</el-button>
        </template>
      </TableComponent>
    </div>
  </div>
</template>

<script>
  import { GetCarAttrs, GetCustomAttrs } from "@/api/carAttrs"
  import CityArea from "@/components/CityArea"
  import TableComponent from "@/components/TableComponent"
  export default {
    name: "Cars",
    components: {
      CityArea,
      TableComponent
    },
    data () {
      return {

        // 车辆属性
        attrs: [],
        // 属性id
        attrId: '',
        // 当前行的ID
        rowId: "",
        // 控制禁启用防抖节流
        disableStatusId: "",
        pageNumber: 1,
        pageSize: 2,
        // 表格数据配置
        tableConfig: {
          // 是否加载表格
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
          apiUrl: "carListUrl",

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
            { label: "新增", prop: "add", type: "success", ele: "link", link: "/carsAdd" },
          ]
        }
      }
    },
    created () {
      this.getCarAttrs();
    },
    methods: {
      // 获取车辆属性（顶级）
      getCarAttrs () {
        GetCarAttrs().then(res => {
          const data = res.data.data.data;
          data && (this.attrs = data);
        })
      },
      // 存id
      getAttrId ({ id }) {
        this.attrId = id;
        this.getCustomAttrs();
      },
      // 车辆自定义属性列表
      getCustomAttrs () {
        GetCustomAttrs({ typeId: this.attrId }).then(res => {
					
        })
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>