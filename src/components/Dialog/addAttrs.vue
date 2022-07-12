<!--
 * @Description: 
 * @Author: wanghao
 * @Date: 2022-07-12 21:31:02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-12 23:21:07
-->
<template>
  <div class="car-brand-attrs-dialog">
    <!-- 对话框 -->
    <el-dialog title="新增自定义车辆属性" :visible.sync="dialogAddFormVisible" @close="close">
      <WForm ref="attrsAddRef" :formParams="addForm" :formItems="formItems" :formHandles="formHandles"></WForm>
    </el-dialog>
  </div>
</template>

<script>
  // foem组件
  import WForm from '@/components/Form'
  import { CarAttrsAdd } from "@/api/carAttrs"
  export default {
    name: "AddCarBrand",
    components: { WForm },
    props: {
      // 弹窗flag
      falgDialog: {
        type: Boolean,
        default: false,
      },
      // 属性
      data: {
        type: Object,
        default: () => {},
      }
    },
    data () {
      return {
        // 加载提示
        loading: false,
        dialogAddFormVisible: false, // 控制弹窗

        // 表单数据
        addForm: {
          curAttr: "",
          key: "",
          value: "",
        },

        // 表单配置
        formItems: [{
            type: "Input",
            prop: "curAttr",
            label: "当前信息",
            disabled: true,
          },
          {
            type: "Input",
            placeholder: "请输入字段",
            label: "字段",
            prop: "key",
            required: true,
            rules: [{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }],
          },
          {
            type: "Input",
            placeholder: "请输入文本",
            label: "文本",
            prop: "value",
            required: true,
            rules: [{ min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'change' }],
          },
        ],
        // 表单按钮配置
        formHandles: [
          // 此处handle按钮方法必传，不然会报错
          { key: "submit", label: "取 消", handle: this.onCancel },
          { key: "reset", label: "确 定", type: "primary", loading: false, handle: this.onConfirm },
        ],

      }
    },
    watch: {
      falgDialog: {
        handler (newVal, oldVal) {
          this.dialogAddFormVisible = newVal;
        }
      },
      // 侦听属性改变
      data: {
        handler (newVal, oldVal) {
          this.addForm.curAttr = newVal.value;
        }
      }
    },
    methods: {
      close () {
        // 反向修改外面的值(关闭对话框),该组件有监听外面的值，故可以反向修改
        this.$emit("update:falgDialog", false);
      },
      // 取消
      onCancel () {

      },
      // 确认
      onConfirm () {
        this.$refs.attrsAddRef.$refs.WFormRef.validate(valid => {
          if (valid) {
            // TODO
            this.add();
          }
        })
      },
      add () {
        const params = {
          typeId: this.data.id,
          key: this.addForm.key,
          value: this.addForm.value,
        }
        CarAttrsAdd(params).then(res => {
          this.$message.success(res.data.message);
          this.reset();
        })
      },
      reset () {
        this.$refs.attrsAddRef.$refs.WFormRef.resetFields();
      }
    }
  }
</script>

<style lang="scss" scoped>
  .car-brand-attrs-dialog {
    ::v-deep .el-dialog__body {
      padding: 30px 48px 1px 43px;
    }
  }
</style>