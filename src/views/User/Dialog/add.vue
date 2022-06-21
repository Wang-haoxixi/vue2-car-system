<template>
    <div>
        <el-dialog title="新增" :visible.sync="dialog_info_flag" @close="close" width="576px" @opened="dialogOpened">
            <el-form ref="form" :model="form" :rules="rules" label-width="100px">
                <el-form-item label="用户名：" prop="username" required>
                    <el-input v-model="form.username" placeholder="请输入邮箱"></el-input>
                </el-form-item>
                <el-form-item label="姓名：" prop="truename">
                    <el-input v-model="form.truename" placeholder="请输入姓名"></el-input>
                </el-form-item>
                <el-form-item label="密码：" prop="password" :required="form.id ? false : true">
                    <el-input v-model="form.password" placeholder="请输入密码"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="phone">
                    <el-input v-model.number="form.phone" placeholder="请输入手机号"></el-input>
                </el-form-item>
                <el-form-item label="地区：" prop="region">
                    <!-- region: 绑定的数据; getRegionFn: 返回数据的函数; level: 配置省市区街显隐 -->
                    <!-- <cityPicker :level="['province', 'city', 'area']" :region="regionData.data" @getRegionFn="getRegion" /> -->
                    <cityPicker :region="regionData.data" @getRegionFn="getRegion" />
                </el-form-item>
                <el-form-item label="是否启用：" prop="status">
                    <el-radio-group v-model="form.status">
                        <el-radio label="1">禁用</el-radio>
                        <el-radio label="2">启用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <!-- <el-form-item label="角色：" prop="role" required> -->
                <el-form-item label="角色：" prop="role" required>
                    <el-checkbox-group v-model="form.role">
                        <el-checkbox v-for="(item, index) in roleItem.data" :key="index" :label="item.role">{{ item.name }}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="按钮权限：">
                    <template v-if="permButton.data.length > 0">
                        <div v-for="(item,index) in permButton.data" :key="index">
                            <h4>{{ item.name }}</h4>
                            <template v-if="item.perm && item.perm.length>0">
                                <el-checkbox-group v-model="form.btnPerm">
                                    <el-checkbox v-for="(permItem, permIndex) in item.perm" :key="permIndex" :label="permItem.value">{{ permItem.name }}</el-checkbox>
                                </el-checkbox-group>
                            </template>
                        </div>
                    </template>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialog_info_flag = false">取 消</el-button>
                <el-button type="danger" @click="submit" :loading="loading">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import sha1 from "sha1";
import { reactive, ref, watch } from "@vue/composition-api";
import cityPicker from "@/components/CityPicker"
import { GetRoles, UserAdd, UserEdit, GetSystem, GetPermButton } from "@/api/user"
import { emailReg, codeReg } from "@/utils/validate.js";
export default {
    name: "dialogAdd",
    components: {
        cityPicker,
    },
    props: {
        flag: {
            type: Boolean,
            default: false,
        },
        editData: {
            type: Object,
            default: () => { },
        },
    },
    setup(props, { root, emit, refs }) {

        // 校验邮箱/用户名
        var validateUsername = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("请输入邮箱"));
            } else if (!emailReg(value)) {
                callback(new Error("邮箱格式有误"));
            } else {
                callback();
            }
        };
        // 校验密码
        var validatePwd = (rule, value, callback) => {

            /**
             * 1、编辑状态下
             * 需要校验
             *      form.id存在，密码不为空时
             * 不需要校验
             *      form.id存在，且密码为空时
             * 2、添加状态下
             * 需要校验
             *      form.id不存在时
             */

            if (form.id && !value) {
                callback()
            }

            if ((form.id && value) || !form.id) {
                if (!value) {
                    callback(new Error("请输入密码"));
                } else if (!codeReg(value)) {
                    callback(new Error("密码必须由6-12位数字加字母组成"));
                } else {
                    callback();
                }
            }


        };
        // 校验角色
        var validateRole = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error("请选择角色"));
            } else {
                callback();
            }
        };


        const loading = ref(false);
        const form = reactive({
            username: "",
            truename: "",
            password: "",
            phone: "",
            region: "",
            status: "1",
            role: [],
            btnPerm: "", //按钮权限
        })
        // 地区数据
        const regionData = reactive({
            data: {}
        });
        // 角色项
        const roleItem = reactive({
            data: [],
        });
        // 按钮权限数据
        const permButton = reactive({
            data: [],
        })
        // 控制弹框显隐
        const dialog_info_flag = ref(false);

        // 表单的验证
        const rules = reactive({
            username: [{ validator: validateUsername, trigger: "blur" }],
            password: [{ validator: validatePwd, trigger: "blur" }],
            role: [{ validator: validateRole, trigger: "change" }],
        });

        // -------------------------------------------------------------------------------



        // dialog弹窗关闭后触发
        const close = () => {

            reset();
            // 将组件中的flag设置为false
            dialog_info_flag.value = false;

            // 将父组件的flag设置为false
            // emit("close"); // 需要做逻辑处理时用回调的方式触发父组件方法
            emit("update:flag", false); // 无逻辑处理时可以使用 .sync 修饰符的方式来处理
            emit("update:editData", {});
        };


        // 重置表单
        const reset = () => {
            refs.form.resetFields();
            regionData.data = {};
        };

        // 确定添加信息
        const submit = () => {

            refs.form.validate((valid) => {
                if (valid) {
                    console.log('pass!!')
                    // loading.value = true;
                    let requestData = JSON.parse(JSON.stringify(form));
                    requestData.role = requestData.role.join();
                    requestData.btnPerm = requestData.btnPerm.join();
                    requestData.region = JSON.stringify(regionData.data);


                    if (requestData.id) {  // 编辑状态：密码值存在，需要密码，且加密；否则删除密码参数
                        if (requestData.password) {
                            requestData.password = sha1(requestData.password);
                        } else {
                            delete requestData.password
                        }
                        userEdit(requestData)
                    } else { // 添加状态：需要密码，且加密
                        requestData.password = sha1(requestData.password);
                        userAdd(requestData)
                    }



                } else {
                    console.log("error submit!!");
                }
            });


        };

        // 用户编辑
        const userEdit = (requestData) => {
            UserEdit(requestData).then(res => {
                root.$message.success("编辑成功");
                loading.value = false;
                close();
                emit("refreshTableData");
            }).catch(err => {
                loading.value = false;
            })
        }

        // 用户添加
        const userAdd = (requestData) => {
            UserAdd(requestData).then(res => {
                root.$message.success("添加成功");
                loading.value = false;
                close();
                emit("refreshTableData");
            }).catch(err => {
                loading.value = false;
            })
        }

        const getRegion = (data) => {
            regionData.data = data
        };

        const getRoles = (data) => {
            if (roleItem.data.length > 0 && permButton.data.length > 0) return false;
            // 获取角色
            GetRoles().then(response => {
                roleItem.data = response.data.data;
            })
            // 获取按钮权限
            GetPermButton().then(response => {
                permButton.data = response.data.data;
                // console.log(permButton.data)
            })
        };

        // 对话框弹出来后执行
        const dialogOpened = () => {
            // console.log(props.editData)
            // 获取角色
            getRoles();
            // 获取父组件传过来的编辑数据
            let editData = props.editData;
            if (editData.id) { // 编辑
                editData.role = editData.role ? editData.role.split(',') : [];  // 转为数组
                editData.btnPerm = editData.btnPerm ? editData.btnPerm.split(',') : [];
                // 循环JSON对象
                for (let key in editData) {
                    form[key] = editData[key]; // TOD..........????
                }
            } else { // 添加
                form.id && delete form.id;
                form.btnPerm = form.btnPerm ? form.btnPerm.split(',') : [];
            }
            console.log(form);


        };




        // 侦听父组件传进来flag的变化，若变化了，给dialog_info_flag重新赋值
        watch(() => props.flag, (newVal, oldVal) => {
            dialog_info_flag.value = newVal;
        });

        return {
            loading,
            form,
            regionData,
            roleItem,
            permButton,
            dialog_info_flag,
            rules,
            close,
            dialogOpened,
            submit,
            getRegion,
        };
    },
};
</script>

<style lang="scss" scoped>
</style>