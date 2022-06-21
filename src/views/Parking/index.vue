<template>
    <div>
        <div class="parking-search-form">
            <el-row>
                <el-col :span="18">
                    <el-form :inline="true" :model="formData" class="demo-form-inline">
                        <el-form-item label="区域">
                            <CityArea ref="cityArea" :area.sync="formData.area" />
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-select v-model="formData.type" placeholder="请选择类型" style="width: 150px">
                                <el-option v-for="(item, index) in type" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="禁启用">
                            <el-select v-model="formData.status" placeholder="请选择" style="width: 150px">
                                <el-option v-for="(item, index) in status" :key="index" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="关键字">
                            <el-select v-model="searchKey" placeholder="请选择关键字" style="width: 150px">
                                <el-option label="停车场名称" value="parkingName"></el-option>
                                <el-option label="详细地址" value="address"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-input v-model="keyword" placeholder="请输入关键字"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="onSubmit">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="6">
                    <router-link to="/parkingAdd">
                        <el-button type="primary" class="pull-right">新增停车场</el-button>
                    </router-link>
                </el-col>
            </el-row>

            <!-- table组件 -->
            <TableComponent ref="tsbleDataRef" :config="tableConfig">
                <!-- 禁启用 -->
                <template v-slot:status="data">
                    <el-switch v-model="data.query.status" @change="statusChange(data.query)" :disabled="data.query.id == disableStatusId" :active-value="false" :inactive-value="true" active-color="#13ce66" inactive-color="#ff4949"></el-switch>
                </template>
                <!-- 查看地图 -->
                <template v-slot:lnglat="data">
                    <el-button size="mini" type="warning" @click="checkLocation(data.query)">查看位置</el-button>
                </template>
                <!-- 操作 -->
                <template v-slot:operate="data">
                    <el-button size="mini" type="warning" @click="edit(data.query)">编辑</el-button>
                    <el-button size="mini" type="danger" :loading="data.query.id == rowId" @click="parkinDelete(data.query)">删除</el-button>
                </template>
            </TableComponent>

            <!-- 查看位置 -->
            <ShowMapLocation :falgDialog.sync="dialogShowLocation" :mapData="mapData" />
        </div>
    </div>
</template>

<script>
import { ParkingList, ParkingDelete, ParkingStatus } from "@/api/parking"
import CityArea from "@/components/CityArea"
import TableComponent from "@/components/TableComponent"
import ShowMapLocation from "@/components/Dialog/showMapLocation"
export default {
    components: {
        CityArea, ShowMapLocation, TableComponent
    },
    data() {
        return {
            // 当前行的ID
            rowId: "",
            // 控制禁启用防抖节流
            disableStatusId: "",
            // 控制位置对话框
            dialogShowLocation: false,
            // 下拉关键字
            searchKey: "",
            // 关键字
            keyword: "",
            type: this.$store.state.config.parkingType,
            status: this.$store.state.config.parkingStatus,
            pageNumber: 1,
            pageSize: 2,
            formData: {
                area: "",
                type: "",
                status: "",
                keyword: ""
            },
            mapData: {},
            // 表格数据配置
            tableConfig: {
                aa: 888,

                // 抬头项
                head: [
                    { label: "停车场名称", prop: "parkingName" },
                    {
                        label: "类型",
                        prop: "type",
                        type: "fun",
                        // 回调方法（处理文本内容）
                        fun: (row) => {
                            let data = this.type.filter(item => item.value == row.type);
                            if (data && data.length > 0) {
                                return data[0].label;
                            }
                        }
                    },
                    {
                        label: "区域",
                        prop: "address",
                        type: "fun",
                        fun: (row) => { // 使详情地址渲染格式换行
                            // 获取地址
                            const address = row.address;
                            const splitAddress = address.split(",");
                            let HTMLAddress = "";
                            if (address) {
                                HTMLAddress += splitAddress[0];
                                if (splitAddress[1]) {
                                    HTMLAddress += `<br />${splitAddress[1]}`;
                                }
                            }
                            return HTMLAddress
                        }
                    },
                    { label: "可停放车辆数", prop: "carsNumber" },
                    {
                        label: "禁启用",
                        type: "slot",
                        // 插槽名称（可写入HTML）
                        slotName: "status"
                    },
                    {
                        label: "查看位置",
                        type: "slot",
                        slotName: "lnglat"
                    },
                    {
                        label: "操作",
                        type: "slot",
                        slotName: "operate"
                    },
                ],

                // 是否多选 
                selection: true,

                // api请求接口
                apiUrl: "parkingListUrl",

                // 是否显示页码
                pagination: true,

                // 请求参数
                params: {
                    pageSize: 10,
                    pageNumber: 1,
                }
            }
        }
    },
    methods: {
        checkLocation(data) {
            this.dialogShowLocation = true;
            this.mapData = data;
        },
        onSubmit() {
            let params = {
                pageSize: this.pageSize,
                pageNumber: this.pageNumber,
            }
            // 过滤筛选项
            const filterParams = JSON.parse(JSON.stringify(this.formData))
            for (const key in filterParams) {
                // console.log(filterParams[key])
                if (filterParams[key]) {
                    params[key] = filterParams[key];
                }
            }
            if (this.searchKey && this.keyword) {
                params[this.searchKey] = this.keyword;
            }
            // console.log(params)
            // 刷新表格数据
            this.$refs.tsbleDataRef.refreshTableData(params);
        },

        // 编辑
        edit({ id }) {
            // console.log(id)
            this.$router.push({
                name: "ParkingAdd",
                query: {
                    id
                }
            })
        },
        // 删除
        parkinDelete({ id }) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.rowId = id;
                ParkingDelete({ id }).then(res => {
                    // console.log(res)
                    if (res.data.resCode == 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.rowId = "";
                    };
                    // 刷新表格数据
                    this.$refs.tsbleDataRef.refreshTableData();
                }).catch(() => { this.rowId = ""; });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });
        },
        // 禁启用改变
        statusChange(data) {
            // console.log(data)
            // 请求接口前将禁启用禁用掉
            this.disableStatusId = data.id;
            const params = {
                id: data.id,
                status: data.status
            }
            ParkingStatus(params).then((res) => {
                this.$message.success(res.data.message);
                // 请求成功开启禁启用
                this.disableStatusId = "";
            }).catch(() => { this.disableStatusId = ""; })
        }
    }
}
</script>

<style lang="scss" scoped>
</style>