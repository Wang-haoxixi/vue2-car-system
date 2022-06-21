<template>
    <div>
        <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="车辆品牌：">
                <el-select v-model="form.type" placeholder="请选择车辆品牌">
                    <el-option label="福特" value="1"></el-option>
                    <el-option label="红旗" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车辆型号：">
                <el-select v-model="form.type" placeholder="请选择车辆型号">
                    <el-option label="CS75" value="1"></el-option>
                    <el-option label="X7" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="停车场：">
                <el-select v-model="form.type" placeholder="请选择停车场">
                    <el-option label="大竹林停车场" value="1"></el-option>
                    <el-option label="洪山景秀停车场" value="2"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="车牌号：">
                <el-input v-model="form.parkingName"></el-input>
            </el-form-item>
            <el-form-item label="车架号：">
                <el-input v-model="form.parkingName"></el-input>
            </el-form-item>
            <el-form-item label="发动机号：">
                <el-input v-model="form.parkingName"></el-input>
            </el-form-item>
            <el-form-item label="是否年检：">
                <el-radio-group v-model="form.type">
                    <el-radio label="0">已检</el-radio>
                    <el-radio label="1">未检</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="保养日期：">
                <el-row :gutter="20">
                    <el-col :span="8">
                        <el-input v-model="form.parkingName"></el-input>
                    </el-col>
                    <el-col :span="15">下次保养日期：2020-12-12</el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="档位：">
                <el-radio-group v-model="form.type">
                    <el-radio label="0">自动档</el-radio>
                    <el-radio label="1">手动</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="能源类型：">
                <el-radio-group v-model="form.energyType">
                    <el-radio label="0">油</el-radio>
                    <el-radio label="1">电</el-radio>
                    <el-radio label="2">油电混合</el-radio>
                </el-radio-group>
                <!-- 进度条 -->
                <div class="progress-bar-warp" v-if="form.energyType == 0 || form.energyType == 2">
                    <i class="left-label">油量：</i>
                    <el-row>
                        <el-col :span="5">
                            <div class="progress-bar">
                                <span style="width: 30%">
                                    <label>30%</label>
                                </span>
                            </div>
                        </el-col>
                        <el-col :span="1">
                            <el-input size="mini"></el-input>
                        </el-col>
                    </el-row>
                </div>
                <div class="progress-bar-warp" v-if="form.energyType == 1 || form.energyType == 2">
                    <i class=" left-label">电量：</i>
                    <el-row>
                        <el-col :span="5">
                            <div class="progress-bar">
                                <span style="width: 70%">
                                    <label>70%</label>
                                </span>
                            </div>
                        </el-col>
                        <el-col :span="1">
                            <el-input size="mini"></el-input>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item label="禁启用：">
                <el-radio-group v-model="form.type">
                    <el-radio label="0">禁用</el-radio>
                    <el-radio label="1">启用</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="座位：">
                <el-radio-group v-model="form.type">
                    <el-radio label="0">2人座</el-radio>
                    <el-radio label="1">4人座</el-radio>
                    <el-radio label="3">7人座</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="车辆属性：">
                <div style="overflow: hidden">
                    <el-row :gutter="5" v-for="(item,index) in carAttr" :key="index">
                        <el-col :span="2">
                            <el-input size="small" value="100"></el-input>
                        </el-col>
                        <el-col :span="3">
                            <el-input size="small" value="100"></el-input>
                        </el-col>
                        <el-col :span="4">
                            <el-button @click="addCarAttr" type="primary" size="mini" v-if="index==0">+</el-button>
                            <el-button size="mini" v-else>-</el-button>
                        </el-col>
                    </el-row>
                </div>
            </el-form-item>
            <el-form-item label="车辆描述：">
                <div ref="editorDom"></div>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import wangEditor from 'wangeditor'
export default {
    data() {
        return {
            editor: null, // 富文本对象
            carAttr: [
                {
                    key: "111",
                    value: "111",
                },
                {
                    key: "222",
                    value: "222",
                },
                {
                    key: "333",
                    value: "333",
                },
                {
                    key: "444",
                    value: "444",
                },
            ],
            form: {
                energyType: "1",
            }
        }
    },
    methods: {
        addCarAttr() {
            this.carAttr.push({
                key: "111",
                value: "111",
            })
        },
        // 创建富文本对象
        createEditor() {
            this.editor = new wangEditor(this.$refs.editorDom);
            this.editor.config.onchange = html => {
                console.log(html);
            }
            this.editor.create() // 创建富文本实例
        }
    },
    mounted() {
        this.createEditor()
    },
}
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>