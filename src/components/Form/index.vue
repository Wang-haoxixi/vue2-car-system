<template>
  <div>
    <el-form ref="WFormRef" :model="formParams" label-width="130px">
      <el-form-item v-for="item in formItems" :key="item.prop" :label="item.label" :prop="item.prop" :rules="item.rules">
        <!-- Input -->
        <el-input v-if="item.type === 'Input'" v-model="formParams[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" :style="{ width: item.width }"></el-input>

        <!-- Select -->
        <el-select filterable v-if="item.type === 'Select'" v-model="formParams[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" :style="{ width: item.width }">
          <el-option v-for="selectItem in item.options" :key="selectItem.value || selectItem[item._value]" :value="selectItem.value || selectItem[item._value]" :label="selectItem.label || selectItem[item._label]"></el-option>
        </el-select>

        <!-- 插槽 -->
        <slot v-if="item.type === 'Slot'" :name="item.slotName"></slot>

        <!-- Radio -->
        <el-radio-group v-if="item.type === 'Radio'" v-model="formParams[item.prop]">
          <el-radio v-for="radio in item.options" :key="radio.value" :label="radio.value">{{ radio.label }}</el-radio>
        </el-radio-group>

        <!-- 上传 -->
        <UploadVue2 v-if="item.type === 'Upload'" :imgUrl.sync="formParams[item.prop]" />

      </el-form-item>

      <!-- 按钮 -->
      <el-form-item>
        <el-button v-for="item in formHandles" :key="item.key" :type="item.type" :loading="item.loading" @click="item.handle">{{ item.label }}</el-button>
        <!-- <el-button type="primary" @click="submitForm('ruleForm')">立即创建</el-button>
                <el-button @click="resetForm('ruleForm')">重置</el-button> -->
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CityArea from "@/components/CityArea";
import UploadVue2 from "@/components/UploadVue2";
export default {
  name: "Form",
  components: { CityArea, UploadVue2 },
  props: {
    // 表单项配置
    formItems: {
      type: Array,
      default: () => []
    },
    // 表单按钮配置
    formHandles: {
      type: Array,
      default: () => []
    },
    // 表单数据
    formParams: {
      type: Object,
      default: () => { },
    }
  },
  data() {
    return {

    }
  },
  methods: {
    // 初始化表单数据
    initFormData() {
      const form = {};
      this.formItems.forEach(item => {
        // 表单校验 rules
        if (item.required) {
          this.rules(item);
        }
        // 自定义检验规则
        if (item.validator) {
          item.rules = item.validator;
        }
      });
    },
    // 表单校验 rules
    rules(item) {
      let typeMsgJson = {
        "Input": "请输入",
        "Radio": "请选择",
        "Select": "请选择"
      }
      // 第一步： 判断表单项是否必填
      let requiredRules = [{ required: true, message: item.requiredMsg || typeMsgJson[item.type] + item.label, trigger: 'change' }];
      // 第二步： 判断是否有其他校验规则
      if (item.rules && item.rules.length > 0) {
        item.rules = requiredRules.concat(item.rules);
      } else {
        item.rules = requiredRules;
      }
    },
  },
  watch: {
    // 监听formItems的变化,用于表单数据绑定
    formItems: {
      handler(newVal) {
        // console.log(newVal);
        this.initFormData();
      },
      immediate: true,
    }
  }
}
</script>

<style lang="scss" scoped>
</style>