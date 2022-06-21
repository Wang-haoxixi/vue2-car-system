let marker = null;
export function aMapSetMarker(lnglat, map) {
    // console.log([lnglat.lng, lnglat.lat], map);
    if (marker) {
        map.remove(marker);
        marker = null;
    }
    marker = new AMap.Marker({
        position: [lnglat.lng, lnglat.lat],
    })
    map.add(marker);
    // 以点标记为地图中心
    map.setFitView();
    // marker.setMap(map);
}
// 清除点标记
export function aMapClearMarker(map) {
    if (marker) {
        map.remove(marker);
        marker = null;
    }
}