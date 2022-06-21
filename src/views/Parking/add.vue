<template>
    <div class="parking-add">
        <WForm ref="parkingAddRef" :formParams="form" :formItems="formItems" :formHandles="formHandles">
            <template v-slot:area>
                <CityArea ref="cityArea" :mapCenterChange="true" :area.sync="form.area" @callback="setMapCenter" />
            </template>
            <template v-slot:aMap>
                <div class="address-map">
                    <AMap ref="aMap" @LngLat="getLngLat" @mapLoaded="mapLoaded" />
                </div>
            </template>
        </WForm>
    </div>
</template>

<script>
// AMap
import AMap from "@/components/AMap"
import CityArea from "@/components/CityArea"
import WForm from '@/components/Form'
// 引入接口
import { ParkingAdd, ParkingDeatil, ParkingEdit } from "@/api/parking"
export default {
    name: "ParkingAdd",
    components: { AMap, CityArea, WForm },
    data() {
        // const validateParkingName = (rule, value, callback) => {
        //     if (!value) {
        //         return callback(new Error("停车场名称不能为空~"));
        //     }
        // };
        const validateCarsNumber = (rule, value, callback) => {
            if (!value) {
                return callback(new Error("可停放车辆数不能为空~"));
            }
            let regNumber = /^[0-9]*$/;
            if (regNumber.test(value)) {
                callback();
            } else {
                callback(new Error('请输入数字值'));
            }
        };
        return {
            // prop: 表单项绑定的数据，
            // required: 是否必填
            // requiredMsg：提示的文字
            // rules: 是否存在其他校验项(Array)
            // 表单配置
            formItems: [
                {
                    type: "Input",
                    label: "停车场名称",
                    placeholder: "请输入停车场名称",
                    prop: "parkingName",
                    width: "200px",
                    required: true,
                    // validator: { required: true, validator: validateParkingName, trigger: 'change' },
                    rules: [{ min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'change' }],
                },
                {
                    type: "Slot",
                    requiredMsg: "请选择区域",
                    slotName: "area",
                    label: "区域",
                    prop: "area",
                    required: true,
                },
                {
                    type: "Radio",
                    label: "类型",
                    prop: "type",
                    options: [
                        { value: 1, label: "室内" },
                        { value: 2, label: "室外" },
                    ],
                    required: true,
                },
                {
                    type: "Input",
                    label: "可停放车辆数",
                    placeholder: "请输入数字",
                    prop: "carsNumber",
                    width: "200px",
                    required: true,
                    validator: { required: true, validator: validateCarsNumber, trigger: 'change' },
                },
                {
                    type: "Radio",
                    label: "禁启用",
                    prop: "status",
                    options: [
                        { value: 1, label: "禁用" },
                        { value: 2, label: "启用" },
                    ],
                    required: true,
                },
                {
                    type: "Slot",
                    slotName: "aMap",
                    label: "位置",
                },
                {
                    type: "Input",
                    label: "经纬度",
                    placeholder: "请选择坐标",
                    prop: "lnglat",
                    width: "200px",
                    disabled: true,
                    required: true,
                },
            ],
            // 表单按钮配置
            formHandles: [
                // 此处handle按钮方法必传，不然会报错
                { key: "submit", label: "确 定", type: "danger", loading: false, handle: this.onSubmit },
                { key: "reset", label: "重 置", handle: this.onReset },
            ],

            id: this.$route.query.id,
            form: {
                parkingName: "",
                area: "",
                type: "",
                carsNumber: null,
                status: "",
                lnglat: "",



                // address: ""
                // area: "500000,500100,500112,500112014"
                // carsNumber: 200
                // content: ""
                // lnglat: "106.478877,29.624725"
                // parkingName: "慈竹苑停车场"
                // region: "重庆,重庆市,渝北区"
                // status: true
                // type: 1
            },
        }
    },
    created() { },
    methods: {
        onSubmit() {
            // console.log(1111111)
            this.$refs.parkingAddRef.$refs.WFormRef.validate((valid) => {
                if (valid) {
                    this.$refs.parkingAddRef.formHandles[0].loading = true;
                    this.id ? this.parkingEdit() : this.parkingAdd();
                } else {
                    console.log('error submit!!');
                    this.$refs.parkingAddRef.formHandles[0].loading = false;
                    return false;
                }
            });
        },
        // 重置
        onReset() {
            console.log("onReset")
        },
        // getProvince() {
        //     GetCityList({ type: "province" }).then(res => {
        //         console.log(res)
        //     })
        // },
        getLngLat(value) {
            this.form.lnglat = value.lngLat
        },
        setMapCenter(val) {
            // console.log(val)
            this.$refs.aMap.setMapCenter(val)
        },
        // 新增停车场api
        parkingAdd() {
            this.$refs.parkingAddRef.formHandles[0].loading = true;
            ParkingAdd(this.form).then(res => {
                if (res.data.resCode == 0) {
                    this.$message.success(res.data.message);
                    this.$refs.form.resetFields();
                    // 清除区域
                    this.$refs.cityArea.clear();
                    // 清除点标记
                    this.$refs.aMap.clearMarker();
                    this.$refs.parkingAddRef.formHandles[0].loading = false;
                }
            }).catch(() => {
                this.$refs.parkingAddRef.formHandles[0].loading = false;
            })
        },
        // 编辑停车场
        parkingEdit() {
            let requestData = JSON.parse(JSON.stringify(this.form));
            requestData.id = this.id;
            this.$refs.parkingAddRef.formHandles[0].loading = true;
            ParkingEdit(requestData).then((res) => {
                console.log(res);
                if (res.data.resCode == 0) {
                    this.$message.success(res.data.message);
                    // this.$refs.form.resetFields();
                    // 清除区域
                    // this.$refs.cityArea.clear();
                    // this.$refs.cityArea.placeholder = "请输入区域"
                    // this.$refs.cityArea.placeholderColorFlag = false
                    // 清除点标记
                    // this.$refs.aMap.clearMarker();
                    this.$refs.parkingAddRef.formHandles[0].loading = false;
                    this.$router.push({
                        name: "ParkingIndex",
                    })
                }
            }).catch(err => {
                this.loading = false;
            })
        },
        // 获取停车场详情
        getParkingDeatil() {
            if (!this.id) return false;
            ParkingDeatil({ id: this.id }).then((res) => {
                // console.log(res.data.data);
                let data = res.data.data;
                // console.log(Object.keys(this.form)) // 取form的属性组成一个数组
                // 还原数据
                for (const key in data) {
                    // console.log(key);
                    if (Object.keys(this.form).includes(key)) {
                        this.form[key] = data[key];
                    }
                }
                this.form.status = this.form.status == false ? 2 : 1;
                console.log(111, this.form);
                let splitLnglat = this.form.lnglat.split(",");
                // console.log(splitLnglat)
                let lnglat = {
                    lng: splitLnglat[0],
                    lat: splitLnglat[1],
                }
                // 此时接口肯定会比地图先加载完，这时地图还没出来情况就造成了异步，报错
                this.$nextTick(() => {
                    this.$refs.aMap.setMarker(lnglat);
                })
                // 回显省市区
                this.$refs.cityArea.initDefault(data.region)
            })
        },
        // 地图加载完毕，可以进行其他业务逻辑了
        mapLoaded() {
            console.log("地图加载完毕，可以进行其他业务逻辑了...");
            this.getParkingDeatil()
        }
    }
}
</script>

<style lang="scss" scoped>
.address-map {
    width: 100%;
    height: 350px;
    border: 1px solid #ccc;
}
</style>