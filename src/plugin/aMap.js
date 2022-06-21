import Vue from "vue";
// 高德离线地图
import VueAMap from 'vue-amap';
Vue.use(VueAMap);

VueAMap.initAMapApiLoader({
    // 高德key
    key: 'e6aa0bb5ca2603a1052d423b96aaef83',
    // 插件集合 （插件按需引入）
    plugin: ['AMap.Geocoder', 'AMap.Marker'],
    v: '1.4.15', // 我也不知道为什么要写这个，不写项目会报错，而且我随便写的，跟我下载的版本对应不了
    uiVersion: '1.0.11' // ui版本号，也是需要写
})