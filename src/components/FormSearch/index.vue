<!--
 * @Description: 表格搜索组件
 * @Author: wh
 * @Date: 2022-06-22 09:08:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-12 14:45:30
-->
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
          <!-- <Keyword ref="keyword" :options="['parkingName', 'address']" :keyword.sync="keyword" /> -->
          <!-- options配置 -->
          <Keyword ref="keyword" :options="item.options" :keyword.sync="keyword" />
        </template>

      </el-form-item>

      <!-- 按钮 -->
      <el-form-item>
        <el-button type="primary" @click="search">搜索</el-button>
        <el-button @click="reset" v-if="otherConfig.resetBtn">重置</el-button>
        <!-- 新增等其他按钮 -->
        <template v-for="item in formHandler">
          <!-- router-link模式 -->
          <router-link v-if="item.ele == 'link'" :key="item.key" :to="item.link">
            <el-button :type="item.type">{{ item.label }}</el-button>
          </router-link>
          <!-- button模式 -->
          <el-button v-if="item.ele == 'btn'" :key="item.key" :type="item.type" @click="item.handler()">{{ item.label }}</el-button>
        </template>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import CityArea from "@/components/CityArea";
  // keyword
  import Keyword from "@/components/Keyword";
  export default {
    name: "FormSearch",
    components: { CityArea, Keyword },
    props: {
      // 表单项配置
      formItems: {
        type: Array,
        default: () => []
      },
      // 搜索按钮右边的其他配置项
      otherConfig: {
        type: Object,
        default: () => {}
      },
      // 新增等其他按钮
      formHandler: {
        type: Array,
        default: () => [],
      },
    },
    data () {
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
      initFormData () {
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
          /**
           * ----------上方的判断在此搜索表单中可以不用（搜索表单也不需要校验表单对吧~）-----------
           */
          // 若搜索表单项是下拉组件,需要设置下拉选项数据
          if (item.type === "Select") {
            // 设置下拉选项配置
            this.setSelectOption(item);
          }
        });
      },
      // 表单校验 rules
      rules (item) {
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
      // 读取下拉选项数据
      setSelectOption (item) {
        const options = this.$store.state.config[item.options];
        if (options) {
          // 设置select options数据
          item.options = options;
        }
      },
      // 双向绑定字段初始化
      initFormFelid () {
        const felids = {};
        this.formItems.forEach(item => {
          if (item.prop) { //有无prop属性
            felids[item.prop] = ""; //添加属性值为空
          }
        })
        this.formFelids = felids;
        // console.log(this.formFelids)
      },
      search () {
        const searchParams = {};
        /**
         * 进行搜索前，过滤空字段
         */
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
        if (this.$refs.cityArea && this.areaData) { //判断城市组件是否存在且有无数据
          searchParams.area = this.areaData;
        }
        console.log("searchParams", searchParams);
        // 调用父组件tableComponent中的search搜索方法
        // 拿到过滤后的搜索参数进行搜索操作
        this.$emit("search", searchParams);
      },
      // 重置搜索表单
      reset () {
        // resetFields()仅能重置配置项带有prop且双向绑定了的字段，其他字段的重置需要另写逻辑
        this.$refs.WFormRef.resetFields();
        if (this.$refs.cityArea) {
          // 重置城市组件数据
          this.$refs.cityArea[0].clear();
        }
        if (this.$refs.keyword) {
          // 重置关键字组件数据
          this.$refs.keyword[0].clear();
        }
      }
    },
    watch: {
      // 监听formItems的变化,用于表单数据绑定
      formItems: {
        handler (newVal) {
          // console.log(newVal);
          // 初始化表单数据
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