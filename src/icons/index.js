import Vue from "vue";
import SvgIcon from "./SvgIcon.vue";

Vue.component('svg-icon', SvgIcon)


/**
 * require.context(‘./svg’, false, /\.svg$/) 参数说明：
 * 第一个：目录
*  第二个：是否遍历子级目录
 * 第三个：定义遍历文件规则

*/
// 解析文件
const req = require.context('./svg', false, /\.svg$/)
const requireAll = requireContext => {
  return requireContext.keys().map(requireContext)
}
requireAll(req)
