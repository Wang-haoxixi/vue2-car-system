<template>
  <div>
    <el-dialog title="新增" :visible.sync="dialog_info_flag" @close="close" width="576px" @opened="dialogOpened">
      <el-form ref="form" :model="form" label-width="60px" >
        <el-form-item label="类别：">
          <el-select v-model="form.category" placeholder="请选择">
            <el-option v-for="item in options.cateList" :key="item.id" :label="item.category_name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="标题：">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="概况：">
          <el-input type="textarea" v-model="form.content"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog_info_flag = false">取 消</el-button>
        <el-button type="danger" @click="submit" :loading="loading">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { reactive, ref, watch } from "@vue/composition-api";
import { Add } from "@/api/news.js";
export default {
  name: "dialogInfo",
  props: {
    flag: {
      type: Boolean,
      default: false,
    },
    infoCate: {
      type: Array,
      default: () => [],
    }
  },
  setup(props, { root, emit, refs }) {
    const loading = ref(false);
    // 控制弹框显隐
    const dialog_info_flag = ref(false);
    const form = reactive({
      category: "",
      title: "",
      content: "",
    })
    const options = reactive({
      cateList: [],
    })

    // dialog弹窗关闭后触发
    const close = () => {
      // emit("close"); // 需要做逻辑处理时用回调的方式触发父组件方法
      emit("update:flag", false); // 无逻辑处理时可以使用 .sync 修饰符的方式来处理
    };

    // 对话框弹出来后执行
    const dialogOpened = () => {
      options.cateList = props.infoCate;
    };

    // 确定添加信息
    const submit = () => {
      loading.value = true;
      let requestData = {
        category_id: form.category,
        title: form.title,
        content: form.content,
      }
      Add(requestData).then(response => {
        if(response.data.resCode == 0){
          root.$message.success(response.data.message);
          loading.value = false;
          dialog_info_flag.value = false;
          form.category = "";
          form.title = "";
          form.content = "";
          emit("addInfoFn");
        }
      }).catch(() => { 
        loading.value = false;
      })
    }

    // 侦听父组件传进来flag的变化，若变化了，给dialog_info_flag重新赋值
    watch(() => props.flag,(newVal, oldVal) => {
      dialog_info_flag.value = newVal;
    });

    return {
      loading,
      form,
      dialog_info_flag,
      options,
      close,
      dialogOpened,
      submit,
    };
  },
};
</script>

<style lang="scss" scoped>
</style>