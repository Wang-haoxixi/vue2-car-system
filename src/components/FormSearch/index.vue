<!-- 表格筛选组件 -->
<template>
  <div>
    <el-form :inline="true" ref="WFormRef" :model="formFelids">
      <el-form-item v-for="item in formItems" :key="item.prop" :label="item.label" :prop="item.prop" :rules="item.rules">
        <!-- Input -->
        <el-input v-if="item.type === 'Input'" v-model="formFelids[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" :style="{ width: item.width }"></el-input>

        <!-- Select -->
        <el-select filterable v-if="item.type === 'Select'" v-model="formFelids[item.prop]" :placeholder="item.placeholder" :disabled="item.disabled" :style="{ width: item.width }">
          <el-option v-for="selectItem in item.options" :key="selectItem.value || selectItem[item._value]" :value="selectItem.value || selectItem[item._value]" :label="selectItem.label || selectItem[item._label]"></el-option>
        </el-select>

        <!-- 插槽 -->
        <slot v-if="item.type === 'Slot'" :name="item.slotName"></slot>

        <!-- 城市 -->
        <template v-if="item.type === 'City'">
          <CityArea ref="cityArea" :area.sync="areaData" />
        </template>

        <!-- 关键字 -->
        <template v-if="item.type === 'Keyworad'">
          <Keyword ref="keyword" :options="['parkingName', 'address']" :keyword.sync="keyword" />
        </template>

        <!-- Radio -->
        <!-- <el-radio-group v-if="item.type === 'Radio'" v-model="formParams[item.prop]">
          <el-radio v-for="radio in item.options" :key="radio.value" :label="radio.value">{{ radio.label }}</el-radio>
        </el-radio-group> -->

      </el-form-item>

      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset" v-if="otherConfig.resetBtn">重置</el-button>
        <template v-for="item in formHandler">
          <router-link v-if="item.ele == 'link'" :key="item.key" :to="item.link">
            <el-button :type="item.type">{{ item.label }}</el-button>
          </router-link>
          <el-button v-if="item.ele == 'btn'" :key="item.key" :type="item.type" @click="item.handler()">{{ item.label }}</el-button>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import CityArea from "@/components/CityArea"
// keyword
import Keyword from "@/components/Keyword"
export default {
  name: "Form",
  components: { CityArea, Keyword },
  props: {
    // 表单项配置
    formItems: {
      type: Array,
      default: () => []
    },
    // 重置按钮
    otherConfig: {
      type: Object,
      default: () => { }
    },
    // 新增等其他按钮
    formHandler: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      // 关键字
      keyword: {},
      // 绑定数据项
      formFelids: {},
      // 区域数据
      areaData: "",
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
        // 读取下拉选项数据
        if (item.type === "Select") {
          this.setSelectOption(item);
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
    setSelectOption(item) {
      const options = this.$store.state.config[item.options];
      if (options) {
        item.options = options;
      }
    },
    initFormFelid() {
      const felids = {};
      this.formItems.forEach(item => {
        if (item.prop) {
          felids[item.prop] = "";
        }
      })
      this.formFelids = felids;
      // console.log(this.formFelids)
    },
    search() {
      const searchParams = {};
      // 过滤空字段
      for (let key in this.formFelids) {
        if (this.formFelids[key]) {
          searchParams[key] = this.formFelids[key];
        }
      }
      // 关键字设置
      if (this.$refs.keyword && this.keyword.key && this.keyword.val) {
        searchParams[this.keyword.key] = this.keyword.val;
      }
      // 城市设置
      if (this.$refs.cityArea && this.areaData) {
        searchParams.area = this.areaData;
      }
      // console.log(searchParams)
      this.$emit("search", searchParams)
    },
    // 重置
    reset() {
      this.$refs.WFormRef.resetFields();
      if (this.$refs.cityArea) {
        this.$refs.cityArea[0].clear();
      }
      if (this.$refs.keyword) {
        this.$refs.keyword[0].clear();
      }
    }
  },
  watch: {
    // 监听formItems的变化,用于表单数据绑定
    formItems: {
      handler(newVal) {
        // console.log(newVal);
        this.initFormData();
        // 双向绑定字段初始化
        this.initFormFelid();
      },
      immediate: true,
    }
  }
}
</script>

<style lang="scss" scoped>
</style>