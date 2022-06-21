
import { reactive, ref, watch, toRefs } from "@vue/composition-api";
import { getCityPicker } from "@/api/common";

export function cityPicker() {
    const data = reactive({
        provinceValue: "",
        provinceData: [], // 省份数据
        cityValue: "",
        cityData: [], // 城市数据
        areaValue: "",
        areaData: [], // 地区数据
        streetValue: "",
        streetData: [], // 街道数据
    });

    // 最终需要返回到组件的数据
    const resData = reactive({
        provinceValue: "",
        cityValue: "",
        areaValue: "",
        streetValue: "",
    });

    // 获取省份
    const getProvinces = () => {
        getCityPicker({ type: "province" }).then(response => {
            data.provinceData = response.data.data.data;
        })
    };

    // 选择省份，获取城市
    const handleProvince = (val) => {
        reset({ type: 'province' });
        getCityPicker({ type: "city", province_code: val }).then(response => {
            data.cityData = response.data.data.data;
        })
    };

    // 选择城市，获取地区
    const handleCity = (val) => {
        reset({ type: 'city' });
        getCityPicker({ type: "area", city_code: val }).then(response => {
            data.areaData = response.data.data.data;
        })
    }

    // 选择地区，获取街道
    const handleArea = (val) => {
        reset({ type: 'area' });
        getCityPicker({ type: "street", area_code: val }).then(response => {
            data.streetData = response.data.data.data;
        })
    }

    // 选择街道
    const handleStreet = (val) => {
        reset({ type: '' });
    }

    // 重置下拉项值
    const reset = (params) => {
        /**
         * 方式二：
         */
        // 设置JSON项，type值与需要清空的数据集一一对应
        let valueJson = {
            province: ['cityValue', 'areaValue', 'streetValue'],
            city: ['areaValue', 'streetValue'],
            area: ['streetValue'],
        }
        // 匹配需要清空的数据集
        let clearArr = valueJson[params.type];
        if (clearArr) {
            // 清空指定的key值
            clearArr.forEach(element => {
                data[element] = "";
            });
        }

        result();

        /**
         * 方式一：
         */
        // if (params.type === "province") {
        //     data.cityValue = "";
        //     data.areaValue = "";
        //     data.streetValue = "";
        // }
        // if (params.type === "city") {
        //     data.areaValue = "";
        //     data.streetValue = "";
        // }
        // if (params.type === "area") {
        //     data.streetValue = "";
        // }
    }

    // 返回数据集合
    const result = () => {
        for (const key in resData) {
            resData[key] = data[key]
        }
        // console.log(resData);
    };

    return {
        getProvinces,
        handleProvince,
        handleCity,
        handleArea,
        handleStreet,
        data,
        resData,
        // ...toRefs(data) // 把对象类型转为基础数据类型，可进行解构响应
    }
}