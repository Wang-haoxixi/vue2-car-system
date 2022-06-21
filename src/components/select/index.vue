<template>
    <div>
        <el-select v-model="data.selectValue" placeholder="请输入" style="width:150px" @change="selectChange">
            <el-option v-for="(item, index) in data.initOption" :key="index" :label="item.label" :value="item.value">

            </el-option>
        </el-select>
    </div>
</template>

<script>
import { reactive, ref, onMounted } from "@vue/composition-api";
export default {
    name: "",
    props: {
        config: {
            type: Object,
            default: () => {
                return {};
            }
        },
        selectData: {
            type: Object,
            default: () => {
                return {};
            }
        },
    },
    setup(props, { root, emit }) {
        const data = reactive({
            selectValue: "",//下拉选中值
            initOption: [],// 初始化下拉选项
            options: [ // 预置下拉选项值
                { label: "姓名", value: "truename" },
                { label: "手机号", value: "phone" },
                { label: "邮箱", value: "email" },
            ]
        });
        // -----------------------------------------------------------------
        // 初始化下拉选项
        const initOption = () => {
            let selectOp = props.config.option
            let arr = [];
            selectOp.forEach(element => {
                let item = data.options.filter((item) => { // 过滤出与传进组件的值一致的下拉数据
                    return item.value === element;
                })[0];
                arr.push(item);
            });
            // 初始化下拉选项值
            data.initOption = arr;
        };
        onMounted(() => {
            initOption()
        })
        // 下拉选择值触发
        const selectChange = (val) => {
            let filterData = data.options.filter(item => item.value === val)[0];
            emit("update:selectData", filterData)
        };
        return {
            data,
            initOption,
            selectChange
        }
    }
}
</script>

<style lang="scss" scoped>
</style>