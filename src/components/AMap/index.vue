<template>
    <div id="index">
        <!-- vid:地图容器节点的ID -->
        <el-amap class="aMapBox" vid="aMapBox" :events="events"></el-amap>
    </div>
</template>

<script>
import { AMapManager, lazyAMapApiLoaderInstance } from "vue-amap";
// 方法
import { getLngLat } from "./common"
import { cityToCode } from "./location"
import { aMapSetMarker, aMapClearMarker } from "./marker"
export default {
    name: "Amap",
    data() {
        return {
            lnglat: [],
            map: null,
            zoom: 16, // 地图初始化缩放级别
            center: [106.636969, 30.479522], // 地图中心点坐标值
            // 事件: 若用原生的高德生成了地图，此处el-amap创建的地图就不会生效，包括生命周期
            events: {
                // complete: () => {
                //     alert(111111111111)
                // },
                // click: () => {
                //     alert(22222222222)
                // }
            },
        }
    },

    mounted() {
        window._AMapSecurityConfig = {
            securityJsCode: '0375d68d1d64fd3dd8bf18843f68f2bc',
        }
        // 项目加载完毕后再调用原生SDK lazyAMapApiLoaderInstance为了加载高德原生的api
        lazyAMapApiLoaderInstance.load().then(() => {
            // this.map = new AMap.Map('aMapBox', {
            //     center: this.center,
            //     zoom: this.zoom, // 初始化地图层级
            // });
            this.mapCreate();

            // //为地图注册click事件获取鼠标点击出的经纬度坐标
            // this.map.on('click', (e) => {
            //     console.log(e)
            //     // 更新经纬度
            //     this.lnglat = getLngLat(e);
            //     this.$emit("LngLat", getLngLat(e))
            //     this.setMarker()
            // });

            // 地图加载完成时触发
            // this.map.on("complete", () => {
            //     console.log("地图加载完成！");
            //     this.mapLoad();
            // });
        });
    },

    methods: {
        setMapCenter(val) {
            // console.log(val)
            cityToCode(val, this.map)
        },
        // 点标记
        setMarker(lnglat) {
            // console.log(lnglat)
            // 有传值进来就是lnglat，未传值进来就是this.lnglat。
            aMapSetMarker(lnglat || this.lnglat, this.map);
        },
        // 清除点标记
        clearMarker() {
            aMapClearMarker(this.map)
        },
        // 创建地图
        mapCreate() {
            this.map = new AMap.Map('aMapBox', {
                center: this.center,
                zoom: this.zoom, // 初始化地图层级
            });
            this.map.on("complete", () => {
                // console.log("地图加载完成！");
                this.mapLoad();
            });
            //为地图注册click事件获取鼠标点击出的经纬度坐标
            this.map.on('click', (e) => {
                // console.log(e)
                // 更新经纬度
                this.lnglat = getLngLat(e);
                this.$emit("LngLat", getLngLat(e))
                this.setMarker()
            });
        },
        // 销毁地图
        mapDestroy() {
            this.map && this.map.destroy();
        },
        // 通知地图加载完成的回调
        mapLoad() {
            this.$emit("mapLoaded")
        }
    },

}
</script>

<style lang="scss" scoped>
#index {
    height: 100%;
}
</style>