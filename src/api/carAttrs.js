/*
 * @Description: 
 * @Author: wanghao
 * @Date: 2022-07-11 22:34:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-07-12 22:51:15
 */
import service from "@/utils/request.js";
/**
 * 车辆属性(顶级)
 */
export function GetCarAttrs (data) {
  return service.request({
    method: 'post',
    url: '/carsAttr/type/',
    data
  })
}
/**
 * 车辆自定义属性(次级)
 */
export function GetCustomAttrs (data) {
  return service.request({
    method: 'post',
    url: '/carsAttr/list/',
    data
  })
}
/**
 * 添加属性
 */
export function CarAttrsAdd (data) {
  return service.request({
    method: 'post',
    url: '/carsAttr/add/',
    data
  })
}