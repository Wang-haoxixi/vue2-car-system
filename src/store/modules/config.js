
const state = {
    // 停车场类型
    parkingType: [
        { label: '室内', value: 1 },
        { label: '室外', value: 2 },
    ],
    // 停车场状态
    parkingStatus: [
        { label: '禁用', value: 1 },
        { label: '启用', value: 2 },
    ],
    // 年检
    yearCheck: [
        { label: '已年检', value: 1 },
        { label: '未年检', value: 2 },
    ],
    // 能源类型 1电，2油，3混合动力
    energyType: [
        { label: '电', value: 1 },
        { label: '油', value: 2 },
        { label: '混合动力', value: 3 },
    ],
    // 关键字选项
    keywordOptions: [
        { label: '停车场名称', value: 'parkingName' },
        { label: '详细区域', value: 'address' },
    ]
}
const getters = {

}
// 提交方法， 改变state中的值（同步）
const mutations = {

}
const actions = {// 提交mutations中的方法并运行 (直接commit中的方法，或运行异步代码返回出去，回调处理事情)

}
export default {
    namespaced: true,
    state,
    getters,
    mutations,
    actions
}
