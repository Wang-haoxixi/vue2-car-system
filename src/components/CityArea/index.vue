<template>
    <div>
        <el-cascader :class="{'my-cascader': placeholderColorFlag }" :placeholder="placeholder" v-model="city" :props="cascaderProps" @change="handleChange"></el-cascader>
    </div>
</template>

<script>
import { GetCityList } from "@/api/common"
export default {
    props: {
        // 城市编码
        area: {
            type: String,
            default: ""
        },
        // 地图是否进行交互
        mapCenterChange: {
            type: Boolean,
            default: false,
        }
    },
    data() {
        const _this = this
        return {
            // placeholder颜色判断
            placeholderColorFlag: false,
            // placeholder
            placeholder: "请输入区域",
            // 城市编码
            city: [],
            // 城市地址
            address: [],
            // 城市数据
            cityData: {},
            // 动态加载城市数据
            cascaderProps: {
                lazy: true,
                lazyLoad(node, resolve) {
                    // console.log(node)
                    const level = node.level
                    // 请求参数
                    const reqRequest = {}
                    if (level == 0) {
                        reqRequest.type = "province";
                    }
                    if (level == 1) {
                        reqRequest.type = "city";
                        reqRequest.province_code = node.value;
                    }
                    if (level == 2) {
                        reqRequest.type = "area";
                        reqRequest.city_code = node.value;
                    }
                    if (level == 3) {
                        reqRequest.type = "street";
                        reqRequest.area_code = node.value;
                    }
                    // 省市区接口
                    GetCityList(reqRequest).then(res => {
                        const data = res.data.data.data;
                        if (level == 0) {
                            data.forEach(item => {
                                item.value = item.PROVINCE_CODE;
                                item.label = item.PROVINCE_NAME;
                            });
                        }
                        if (level == 1) {
                            data.forEach(item => {
                                item.value = item.CITY_CODE;
                                item.label = item.CITY_NAME;
                            });
                        }
                        if (level == 2) {
                            data.forEach(item => {
                                item.value = item.AREA_CODE;
                                item.label = item.AREA_NAME;
                            });
                        }
                        if (level == 3) {
                            data.forEach(item => {
                                item.value = item.STREET_CODE;
                                item.label = item.STREET_NAME;
                                item.leaf = node.level == 3
                            });
                        }
                        // 将城市缓存起来
                        _this.cityData[reqRequest.type] = data;
                        // 返回节点数据
                        resolve(data)
                    })

                    if (node.level != 0) {
                        // 获取地址 
                        _this.getAddress(node);
                    }
                }
            }
        }
    },
    methods: {
        // 初始化默认值
        initDefault(data) {
            // console.log(data)
            if (data) {
                // 有值时才给字体颜色
                this.placeholderColorFlag = true;
                this.placeholder = data.split(",").join(" / ");
            }
        },
        // 选完最后一项后触发
        handleChange(value) {
            // 反向修改传进来的数据
            this.$emit("update:area", value.join())
            // console.log(value)
            let lastVal = value[value.length - 1]
            // console.log(lastVal)
            let filterVal = this.cityData.street.filter(item => item.STREET_CODE == lastVal)[0]
            // console.log(filterVal)
            this.address.push(filterVal.label)
            // console.log(this.address)
            // 为 true 时，地图进行交互
            if (this.mapCenterChange) {
                // 地址转代码
                this.$emit("callback", this.address.join(""));
            }
        },
        // 获取地址
        getAddress(node) {
            // console.log(node)
            let index = node.level - 1;
            this.address[index] = node.label;
            // console.log(this.address)
            // 为 true 时，地图进行交互
            if (this.mapCenterChange) {
                // 地址转代码
                this.$emit("callback", this.address.join(""));
            }
        },
        // 清除数据
        clear() {
            this.city = [];
        }
    }
}
</script>

<style lang="scss" scoped>
</style>