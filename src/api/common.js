/*
 * @Description: 公共接口
 * @Author: wh
 * @Date: 2022-06-22 09:08:23
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-12 10:55:25
 */
import service from "@/utils/request.js";
import url from "@/api/tableDataApi";

// 获取七牛云token
export function QiniuToken (data) {
  return service.request({
    method: 'post',
    url: '/uploadImgToken/',
    data,
  })
}

// 请求表格数据
export function getTableList (params) {
  return service.request({
    method: params.method || "post",
    url: params.url,
    data: params.data || {},
  })
}

// 获取省市区关联
export function getCityPicker (data) {
  return service.request({
    method: "post",
    url: "/cityPicker/",
    data
  })
}
/**
 * -------------------以上为【vue3.0体验版项目】----------------------
 */

/**
 * -------------------以下为【汽车后台项目】----------------------
 */
// 获取省市区关联
export function GetCityList (data) {
  return service.request({
    method: "post",
    url: "/cityPicker/",
    data
  })
}
// 获取表格数据
export function GetTableData (data) {
  // console.log(url)
  // console.log(data)
  return service.request({
    method: "post",
    url: url[data.url],
    data: data.data
  })
}
// 获取车辆品牌列表
export function GetCarBrand (data) {
  return service.request({
    method: "post",
    url: "/brand/list/",
    data
  })
}
// 获取停车场列表
export function GetParking (data) {
  return service.request({
    method: "post",
    url: "/parking/list/",
    data
  })
}