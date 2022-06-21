<template>
    <div class="car-brand-add-dialog">
        <!-- 对话框 -->
        <el-dialog :title="mapData.parkingName" :visible.sync="dialogAddFormVisible" @close="close" @opened="opened">
            <div style="height: 400px">
                <AMap ref="aMap" />
            </div>
        </el-dialog>
    </div>
</template>

<script>
// AMap
import AMap from "@/components/AMap"
export default {
    name: "AddCarBrand",
    components: { AMap },
    props: {
        // 弹窗flag
        falgDialog: {
            type: Boolean,
            default: false,
        },
        // 地图数据
        mapData: {
            type: Object,
            default: () => { }
        }
    },
    data() {
        return {
            dialogAddFormVisible: false, // 控制弹窗
        }
    },
    watch: {
        falgDialog: {
            handler(newVal, oldVal) {
                // console.log(newVal)
                this.dialogAddFormVisible = newVal;
            }
        }
    },
    methods: {
        close() {
            // 反向修改外面的值
            this.$emit("update:falgDialog", false);
            // 销毁地图
            this.$refs.aMap.mapDestroy();
        },
        // Dialog 打开动画结束时的回调
        opened() {
            // 创建地图
            this.$refs.aMap.mapCreate();
            let splitLnglat = this.mapData.lnglat.split(",");
            // console.log(splitLnglat)
            let lnglat = {
                lng: splitLnglat[0],
                lat: splitLnglat[1],
            }
            // 地图加载完成后再调用地图的方法
            this.$nextTick(() => {
                this.$refs.aMap.setMarker(lnglat);
            })
        }
    }
}
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__body {
    padding-bottom: 30px;
}
</style>