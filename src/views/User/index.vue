<template>
    <div id="userIndex">
        <el-row :gutter="20">
            <el-col :span="20">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="关键字：">
                        <selectComponent :config="data.selectOptions" :selectData.sync="data.selectData" />
                    </el-form-item>
                    <el-form-item>
                        <el-input placeholder="请输入" v-model="data.keyWord"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="danger" @click="search">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="4">
                <el-button type="danger" class="pull-right" @click="addUser">添加用户</el-button>
            </el-col>
        </el-row>
        <tableComponent ref="userTable" :config="data.tableConfig" :tableRow.sync="data.tableRow">
            <template v-slot:status="slotData">
                <el-switch @change="handleSwitch(slotData.data)" v-model="slotData.data.status" active-value="2" inactive-value="1" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
            </template>
            <template v-slot:operation="slotData">
                <el-button size="mini" type="danger" @click="handleDelete(slotData.data)">删除</el-button>
                <el-button size="mini" type="success" @click="handleEdit(slotData.data)">编辑</el-button>
            </template>
            <!-- 插槽：批量删除按钮 -->
            <template v-slot:tableFooterLeft>
                <el-button @click="batchDelete">批量删除</el-button>
            </template>
        </tableComponent>

        <DialogAdd :flag.sync="data.dialogAdd" :editData.sync="data.editData" @refreshTableData="refreshData" />
    </div>
</template>

<script>
import DialogAdd from "./Dialog/add.vue";
import { reactive, ref, onMounted } from "@vue/composition-api";
import selectComponent from "@/components/select"
import tableComponent from "@/components/Table"
import { requestUrl } from "@/api/requestUrl"
import { UserDelete, UserActives } from "@/api/user"
export default {
    name: "userIndex",
    components: { selectComponent, tableComponent, DialogAdd },
    setup(props, { root, refs, emit }) {
        // btnPermission("aaaaa")
        const data = reactive({
            // 关键字
            keyWord: "",
            // 选择的值
            selectData: {},
            // 编辑对话框回显的数据
            editData: {},
            // 阻止连续点击滑块按钮
            switchUpdate: false,
            dialogAdd: false,
            selectOptions: {
                option: ["truename", "phone", "email",],
                aa: "aaaaaaa",
            },
            // table选择的对象
            tableRow: {},
            tableConfig: {
                selection: true,
                tHeaders: [
                    {
                        label: "邮箱/用户名",
                        value: "username",
                        width: 200,
                    },
                    {
                        label: "真实姓名",
                        value: "truename",
                        width: 120,
                    },
                    {
                        label: "手机号",
                        value: "phone",
                        width: 120,
                    },
                    {
                        label: "地区",
                        value: "region",
                    },
                    {
                        label: "角色",
                        value: "role",
                        width: 150,
                    },
                    {
                        label: "禁启用状态",
                        value: "status",
                        width: 150,
                        colType: "slot", // 区分当前列的类型：插槽模式
                        slotName: "status", // 具名插槽名称
                    },
                    {
                        label: "操作",
                        width: 200,
                        colType: "slot", // 区分当前列的类型：插槽模式
                        slotName: "operation", // 具名插槽名称
                    },
                ],
                // 请求接口URL
                requestData: {
                    url: requestUrl.getUserUrl,
                    method: "post",
                    data: {
                        pageNumber: 1,
                        pageSize: 5,
                    }
                },
                // 是否显示页码
                pagination: true,
            },

        })

        // let obj = {}
        // obj["aa"]
        // console.log(111,obj)

        // -----------------------------------------------------------------
        // 添加用户按钮
        const addUser = () => {
            data.dialogAdd = true;
        };
        // 删除
        const handleDelete = (row) => {
            data.tableRow.idItem = [row.id];
            root.confirm({
                content: "确认删除该用户？",
                tip: "警告",
                type: "warning",
                fn: batchDeleteIng,
            });
        };
        // 编辑
        const handleEdit = (row) => {
            data.dialogAdd = true;
            // 子组件赋值
            data.editData = Object.assign({}, row);
        }
        // 批量删除
        const batchDelete = () => {
            let ids = data.tableRow.idItem;
            if (!ids || ids.length === 0) return root.$message.error("请勾选需要删除的用户");

            root.confirm({
                content: "确认批量删除选中的用户？",
                tip: "警告",
                type: "warning",
                fn: batchDeleteIng,
            });

        };
        const batchDeleteIng = () => {
            UserDelete({ id: data.tableRow.idItem }).then((res) => {
                refreshData();
                // console.log(res)
            })
        }
        // 刷新表格
        const refreshData = () => {
            refs.userTable.refresh();
        }

        // 切换滑块
        const handleSwitch = (params) => {
            if (data.switchUpdate == true) return false; // 节流
            data.switchUpdate = true;
            UserActives({ id: params.id, status: params.status }).then((res) => {
                root.$message.success(res.data.message)
                data.switchUpdate = false;
            })
        }

        // 搜索
        const search = () => {
            let params = { // 参数配置
                [data.selectData.value]: data.keyWord,
            }
            // 调用子组件中搜索刷新表格的方法 并传参
            refs.userTable.paramsLoadTable(params)
        }

        return {
            data,
            addUser,
            handleDelete,
            handleEdit,
            batchDelete,
            refreshData,
            handleSwitch,
            search
        }
    }
};
</script>

<style lang="scss" scoped>
#userIndex {
}
</style>