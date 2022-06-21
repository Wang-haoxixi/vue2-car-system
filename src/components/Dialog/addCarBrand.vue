<template>
    <div class="car-brand-add-dialog">
        <!-- 对话框 -->
        <el-dialog title="新增车辆品牌" :visible.sync="dialogAddFormVisible" @close="close" @opened="opened">

            <WForm ref="brandAddRef" :formParams="addForm" :formItems="formItems" :formHandles="formHandles">
                <template v-slot:logo>
                    <div class="upload-img-warp">
                        <div class="upload-img">
                            <img v-show="addForm.imgUrl" :src="addForm.imgUrl" />
                        </div>
                        <ul class="img-list">
                            <li v-for="item in logos" :key="item.id" @click="handleLogo(item)">
                                <img :src="item.img" :alt="item.name" />
                            </li>
                        </ul>
                    </div>
                </template>
            </WForm>
        </el-dialog>
    </div>
</template>

<script>
import { BrandLogo, BrandAdd, BrandDetailed, BrandEdit } from "@/api/brand";
// foem组件
import WForm from '@/components/Form'
export default {
    name: "AddCarBrand",
    components: { WForm },
    props: {
        // 弹窗flag
        falgDialog: {
            type: Boolean,
            default: false,
        },
        // 品牌ID
        brandId: {
            type: String,
            default: "",
        }
    },
    data() {
        return {
            // 加载提示
            loading: false,
            dialogAddFormVisible: false, // 控制弹窗

            // 表单数据
            addForm: {
                nameCh: "",
                nameEn: "",
                imgUrl: "",
                status: "",
                content: ""
            },

            // 表单配置
            formItems: [
                {
                    type: "Input",
                    placeholder: "请输入品牌名称(中文)",
                    label: "品牌名称(中文)",
                    prop: "nameCh",
                    required: true,
                    rules: [{ min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }],
                },
                {
                    type: "Input",
                    placeholder: "请输入品牌名称(英文)",
                    label: "品牌名称(英文)",
                    prop: "nameEn",
                    required: true,
                    rules: [{ min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'change' }],
                },
                {
                    type: "Slot",
                    requiredMsg: "请选择LOGO",
                    slotName: "logo",
                    label: "LOGO",
                    prop: "imgUrl",
                    required: true,
                },
                {
                    type: "Radio",
                    label: "禁启用",
                    prop: "status",
                    options: [
                        { value: false, label: "禁用" },
                        { value: true, label: "启用" },
                    ],
                    required: true,
                },
                {
                    type: "Input",
                    placeholder: "请输入描述",
                    label: "描述",
                    prop: "content",
                    required: true,
                },
            ],
            // 表单按钮配置
            formHandles: [
                // 此处handle按钮方法必传，不然会报错
                { key: "submit", label: "取 消", handle: this.onCancel },
                { key: "reset", label: "确 定", type: "primary", loading: false, handle: this.onConfirm },
            ],

            morkData: [
                {
                    id: 1,
                    name: "海马",
                    img: "http://www.chebiaodaquan.com/d/file/China/50c32f19b9898700ff6cda0ce7d63f56.jpg"
                },
                {
                    id: 2,
                    name: "比亚迪",
                    img: "http://www.chebiaodaquan.com/d/file/China/e26341b96a6c7a2d06c2843a2cedec3e.jpg"
                },
                {
                    id: 3,
                    name: "吉利",
                    img: "http://www.chebiaodaquan.com/d/file/China/18e298d3ee7c4b40e4786316aaea7cd2.jpg"
                },
                {
                    id: 5,
                    name: "宝马",
                    img: "http://www.chebiaodaquan.com/d/file/Germany/ccfa4a6b0a443952e4aef3139236b1a0.jpg"
                },
                {
                    id: 6,
                    name: "本田",
                    img: "http://www.chebiaodaquan.com/d/file/Japan/8cb546d809973760ff1b6ef584ae8c73.jpg"
                },
                {
                    id: 7,
                    name: "三菱",
                    img: "http://www.chebiaodaquan.com/d/file/Japan/e96b9c30d4048c67daadda0e88104acb.jpg"
                },
                {
                    id: 8,
                    name: "沃尔沃",
                    img: "http://www.chebiaodaquan.com/d/file/Other/93818da80bbbe38bca420306a4fa1864.jpg"
                },
                {
                    id: 9,
                    name: "广汽传祺",
                    img: "http://www.chebiaodaquan.com/d/file/China/99a72062e9fb9067a6e082b6346ecdde.jpg"
                },
                {
                    id: 10,
                    name: "哈弗",
                    img: "http://www.chebiaodaquan.com/d/file/China/4a579e018441ec16661df543c110d888.jpg"
                },
                {
                    id: 11,
                    name: "奇瑞",
                    img: "http://www.chebiaodaquan.com/d/file/China/f33b5471ab6053f7b4247584f6619601.jpg"
                },
                {
                    id: 12,
                    name: "东风",
                    img: "http://www.chebiaodaquan.com/d/file/China/914fbf0a1ffa7eb5f0e0890ee1ed0155.jpg"
                },
                {
                    id: 13,
                    name: "凯迪拉克",
                    img: "http://www.chebiaodaquan.com/d/file/America/feb88022fe80d7a9b75c181d2abd271e.jpg"
                },
                {
                    id: 14,
                    name: "雪佛兰",
                    img: "http://www.chebiaodaquan.com/d/file/China/a43f09bfe7527c5e5191b951e4e760ca.jpg"
                },
                {
                    id: 15,
                    name: "特斯拉",
                    img: "http://www.chebiaodaquan.com/d/file/America/56be5b16b3255a733884b0ebe2455ff4.jpg"
                },
                {
                    id: 16,
                    name: "标致",
                    img: "http://www.chebiaodaquan.com/d/file/France/1aac2bf7b8eb0f9cf977f699ec1823cb.jpg"
                },
                {
                    id: 17,
                    name: "名爵",
                    img: "http://www.chebiaodaquan.com/d/file/China/d2ab698186aa6aa78f6d158586d7c301.jpg"
                },
            ],
            // 车辆品牌LOGO
            logos: [],
        }
    },
    watch: {
        falgDialog: {
            handler(newVal, oldVal) {
                // console.log(newVal)
                this.dialogAddFormVisible = newVal;
            }
        }
    },
    methods: {
        // 取消
        onCancel() {
            // 反向修改外面的值(关闭对话框),该组件有监听外面的值，故可以反向修改
            this.$emit("update:falgDialog", false);
        },
        // 确定
        onConfirm() {
            this.brandId ? this.edit() : this.add()
        },


        // 异步校验图片
        validateImgUrl(rule, value, callback) {
            // console.log(rule, value)
            if (!value) {
                callback(new Error('请选择车辆LOGO'));
            } else {
                callback();
            }
        },
        close() {
            // 重置表单
            this.reset();
            // 清除brandId
            this.$emit("update:brandId", "");
            // 反向修改外面的值(关闭对话框),该组件有监听外面的值，故可以反向修改
            this.$emit("update:falgDialog", false);
            // 刷新表格
            this.$emit("refresh");
        },
        // Dialog 打开动画结束时的回调
        opened() {
            this.getBrandLogo();
            // console.log(this.brandId);
            this.brandId && this.getBrandDetailed();
        },
        // 获取品牌详情
        getBrandDetailed() {
            BrandDetailed({ id: this.brandId }).then(res => {
                // console.log(res)
                if (res.data.data) {
                    this.addForm = res.data.data;
                }
            })
        },
        // 品牌LOGO接口
        getBrandLogo() {
            BrandLogo().then(res => {
                // console.log(res)
                if (res.data.data) {
                    // this.logos = res.data.data;
                    this.logos = this.morkData;
                }
            })
        },
        // 选择车辆LOGO
        handleLogo(item) {
            this.addForm.imgUrl = item.img;
        },
        // 品牌新增接口 
        brandAdding() {
            BrandAdd(this.addForm).then(res => {
                // 提示
                this.$message.success(res.data.message);
                // 对话框关闭的回调
                this.close();
            }).catch(err => {
            })
        },
        // 品牌编辑接口 
        brandEditing() {
            const params = JSON.parse(JSON.stringify(this.addForm));
            params.id = this.brandId;
            BrandEdit(params).then(res => {
                // 提示
                this.$message.success(res.data.message);
                // 对话框关闭的回调
                this.close();
            }).catch(err => {
            })
        },
        // 确定
        submit() {
            this.brandId ? this.edit() : this.add()
        },
        // 添加
        add() {
            this.$refs.brandAddRef.$refs.WFormRef.validate(valid => {
                if (valid) {
                    this.brandAdding();
                }
            })
        },
        // 编辑
        edit() {
            this.$refs.brandAddRef.$refs.WFormRef.validate(valid => {
                if (valid) {
                    this.brandEditing();
                }
            })
        },
        // 重置表单
        reset() {
            this.$refs.brandAddRef.$refs.WFormRef.resetFields();
        }
    }
}
</script>

<style lang="scss" scoped>
.car-brand-add-dialog {
    ::v-deep .el-dialog__body {
        padding: 30px 48px 1px 43px;
    }
}
</style>