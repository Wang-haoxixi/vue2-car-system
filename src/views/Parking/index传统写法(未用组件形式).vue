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

            <!-- 表格数据 -->
            <el-table :data="tableData" border style="width: 100%" v-loading="loading">
                <el-table-column type="selection" width="45">
                </el-table-column>
                <el-table-column prop="parkingName" label="停车场名称" width="180">
                </el-table-column>
                <el-table-column prop="type" label="类型" width="180">
                    <template slot-scope="scope">
                        <span>{{ scope.row.type | filterType }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="区域">
                </el-table-column>
                <el-table-column prop="carsNumber" label="可停放车辆数">
                </el-table-column>
                <el-table-column label="禁启用">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.status" :active-value="false" :inactive-value="true" active-color="#13ce66" inactive-color="#ff4949">
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column prop="lnglat" label="查看位置">
                    <template slot-scope="scope">
                        <el-button size="mini" type="warning" @click="checkLocation(scope.row)">查看</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" type="warning" @click="edit(scope.row)">编辑</el-button>
                        <el-button size="mini" type="danger" @click="parkinDelete(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!-- 查看位置 -->
            <ShowMapLocation :falgDialog.sync="dialogShowLocation" :mapData="mapData" />

            <el-row class="padding-top-20">
                <el-col :span="4" style="padding: 1px"></el-col>
                <el-col :span="20">
                    <!-- 分页 -->
                    <el-pagination class="pull-right" background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage" :page-sizes="[2, 5, 10, 20]" :page-size="pageSizes" layout="total, sizes, prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import { ParkingList, ParkingDelete } from "@/api/parking"
import CityArea from "@/components/CityArea"
import ShowMapLocation from "@/components/Dialog/showMapLocation"
let _this = this;
export default {
    components: {
        CityArea, ShowMapLocation
    },
    data() {
        _this = this;
        return {
            // 表格数据加载状态
            loading: false,
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
            tableData: [],
            currentPage: 1,
            pageSizes: 2,
            total: 0,
            mapData: {},
        }
    },
    created() {
        this.getParkingList()
    },
    filters: {
        // 过滤类型
        filterType(val) {
            let data = _this.type.filter(item => item.value == val);
            return data[0].label;
        }
    },
    methods: {
        checkLocation(data) {
            this.dialogShowLocation = true;
            this.mapData = data;
        },
        onSubmit() {
            console.log(this.formData)
            // console.log('submit!');
            this.getParkingList();
        },
        getParkingList() {
            this.loading = true;
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

            // return false;
            ParkingList(params).then(res => {
                // console.log(res)
                let data = res.data.data;
                if (data) {
                    this.tableData = data.data;
                    this.total = data.total;
                    this.loading = false;
                }
            }).catch(err => { this.loading = false; })
        },
        handleSizeChange(val) {
            // console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.getParkingList();
        },
        handleCurrentChange(val) {
            // console.log(`当前页: ${val}`);
            this.pageNumber = val;
            this.getParkingList();
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
                ParkingDelete({ id }).then(res => {
                    // console.log(res)
                    if (res.data.resCode == 0) {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getParkingList();
                    }
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });
            });

        }
    }
}
</script>

<style lang="scss" scoped>
</style>