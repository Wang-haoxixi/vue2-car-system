export function getLngLat(e) {
    return {
        lng: e.lnglat.getLng(),
        lat: e.lnglat.getLat(),
        lngLat: e.lnglat.getLng() + ',' + e.lnglat.getLat()
    }
}