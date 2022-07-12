<!--
 * @Description: 关键字组件
 * @Author: wh
 * @Date: 2022-06-22 09:08:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-12 15:01:15
-->
<template>
  <el-row :gutter="10">
    <el-col :span="9">
      <el-select v-model="searchKey" placeholder="请选择关键字" @change="input">
        <el-option v-for="(item, index) in searchOptions" :key="index" :label="item.label" :value="item.value"></el-option>
      </el-select>
    </el-col>
    <el-col :span="15">
      <el-input v-model="searchVal" placeholder="请输入关键字" @input="input"></el-input>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    props: {
      // 关键字下拉项数据
      options: {
        type: Array,
        default: () => [],
      }
    },
    created () {
      this.initOptions()
    },
    data () {
      return {
        // 选择的关键字值
        searchKey: "",
        // 输入的关键字值
        searchVal: "",
        // 所有关键字选项
        keywordOptions: this.$store.state.config.keywordOptions,
        // 匹配的关键字数据
        searchOptions: [],
      }
    },
    methods: {
      // 初始化关键字选项
      initOptions () {
        let optionsItem = [];
        // 匹配关键字数据
        this.options.forEach(item => {
          let data = this.keywordOptions.filter(ele => ele.value == item);
          optionsItem = optionsItem.concat(data)
        });
        this.searchOptions = optionsItem;
        // console.log('searchOptions', this.searchOptions);
      },
      // 输入内容时触发
      input (val) {
        // console.log(val)
        const keyword = {};
        keyword.key = this.searchKey; // 键
        keyword.val = this.searchVal; // 值
        // 反向修改外面的数据
        this.$emit('update:keyword', keyword);
      },
      // 重置
      clear () {
        this.searchKey = "";
        this.searchVal = "";
        this.input();
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>