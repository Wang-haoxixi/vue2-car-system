export function cityToCode(address, map) {
    const geocoder = new AMap.Geocoder();
    geocoder.getLocation(address, function (status, result) {
        // console.log(status, result);
        if (status === 'complete' && result.info === "OK") {
            var lng = result.geocodes[0].location.lng; // 经度
            var lat = result.geocodes[0].location.lat; // 纬度
            // 设置地图中心点/级别
            map.setCenter([lng, lat]);
        } else {
            log.error('根据地址查询位置失败');
        }
    });
}