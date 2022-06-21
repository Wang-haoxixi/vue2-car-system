<template>
    <div id="infoDetail">
        <el-form ref="form" :model="form" label-width="100px">
            <el-form-item label="信息分类：">
                <el-select v-model="form.category_id" placeholder="请选择">
                    <el-option v-for="(item,index) in cateList.data" :key="index" :label="item.category_name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="新闻标题：">
                <el-input v-model="form.title" placeholder="请输入" style="width:370px"></el-input>
            </el-form-item>
            <el-form-item label="缩略图：">
                <UploadImg :imgUrlProp.sync="form.imgUrl" :uploadConfig="uploadConfig" />
            </el-form-item>
            <el-form-item label="发布日期：">
                <el-date-picker disabled v-model="form.create_date" type="date" placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="详细内容：">
                <quillEditor v-model="form.content" ref="myQuillEditor" :options="editorOption" />
            </el-form-item>
            <el-form-item>
                <el-button type="danger" :loading="loading" @click="onSubmit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
import { reactive, ref, onMounted, onActivated } from "@vue/composition-api";
import { GetList, EditInfo } from "@/api/news.js";
import { formatterTime } from "@/utils/common"
import UploadImg from "@/components/UploadImg";

// 局部引入富文本编辑器
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'

export default {
    name: "Details",
    components: {
        quillEditor,
        UploadImg,
    },
    setup(props, { root }) {
        onMounted(() => {
            
            title.value = root.$store.getters["infoDetails/infoTitle"];
            getCategory();
            
        });
        onActivated(() => {
            console.log('onActivated')
            /**
             * 以下两行本来放onMounted中的，但由于详情页面有用keep-alive设置缓存，当第二三次进入页面是还是第一次进入的详情数据，
             * 故放在onActivated中，onActivated是在created和mounted后执行，且组件缓存后只会执行onActivated生命周期
             */
            id.value = root.$store.getters["infoDetails/infoId"];
            getNewInfo();
        })
        const id = ref("");
        const title = ref("");
        const loading = ref(false);
        // 详情内容
        const cateList = reactive({
            data: [],
        });
        // 富文本配置项
        const editorOption = reactive({
            placeholder: "请输入文章内容",
        });
        // 上传图片的配置
        const uploadConfig = reactive({
            ak: "GHnOuYtiHUliqHtmZRR9AUnTXd005wu-wsBHwHdQ",
            sk: "ymd_-LMTCdl7wnHwvEMqQ70IE7mnNUvSk632TJ01",
            buckety: "vue3-admin",
            action: "http://up-z2.qiniup.com"
        })
        // 表单内容
        const form = reactive({
            title: "",
            category_id: "",
            create_date: "",
            content: "",
            imgUrl: "",
        })
        // --------------------------------------------------------------------------------------------------------------------

        // 保存
        const onSubmit = () => {
            loading.value = true;
            let requestData = {
                id: id.value,
                categoryId: form.category_id,
                title: form.title,
                content: form.content,
                imgUrl: form.imgUrl,
                // status: 0,
            }
            EditInfo(requestData).then(response => {
                if (response.data.resCode == 0) {
                    root.$message.success(response.data.message);
                    loading.value = false;
                    root.$router.back(-1);
                }
            }).catch(() => {
                loading.value = false;
            })
        }

        // 获取信息详情
        const getNewInfo = () => {
            let reqData = {
                pageNumber: 1,
                pageSize: 1,
                id: id.value,
            }
            GetList(reqData).then((res) => {
                let data = res.data.data.data[0];
                form.title = data.title;
                form.category_id = data.categoryId;
                form.create_date = formatterTime(data.createDate);
                form.content = data.content;
                form.imgUrl = data.imgUrl;
            })
        };
        // 获取信息分类（有子级分类）
        const getCategory = () => {
            // 调用vuex中的获取分类数据方法
            root.$store.dispatch("common/getInfoCate").then(response => {
                cateList.data = response;
            })
        };
        return {
            id,
            title,
            cateList,
            form,
            editorOption,
            loading,
            uploadConfig,
            // --------------------------------------------------------------------------------------------------------------------
            onSubmit,
            getCategory,
        }
    }
}
</script>

<style lang="scss" scoped>
</style>