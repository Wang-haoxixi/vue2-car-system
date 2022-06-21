/**
 * 
 * 分页
 * 
*/
import { reactive, ref, onMounted, onBeforeMount } from "@vue/composition-api";
export function pagination() {
    const pageData = reactive({
        pageSizeArray: [ 5, 10, 20, 30, 40, 50, 100],
        currentPage: 1,
        pageSize: 5,
        total: 0,
    });

    const handleSizeChange = (val) => {
        pageData.pageSize = val;
    };

    const handleCurrentChange = (val) => {
        pageData.currentPage = val;
    };

    // 设置总数
    const totalCount = (val) => {
        pageData.total = val;
    };

    return {
        pageData,
        handleSizeChange,
        handleCurrentChange,
        totalCount,
    }
}