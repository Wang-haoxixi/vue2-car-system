<template>
    <div class="uploadImg">
        <el-upload
            class="avatar-uploader"
            :action="uploadConfig.action"
            :data="uploadKey"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload">
            <img v-if="imgUrl" :src="imgUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
    </div>
</template>

<script>
import { reactive, ref, onMounted, watch} from "@vue/composition-api";
import { QiniuToken } from "@/api/common.js";
export default {
    name: "uploadImg",
    props: {
        imgUrlProp: {
            type: String,
            default: "",
        },
        uploadConfig: {
            type: Object,
            default: () => {
                return {};
            }
        }
    },
    setup (props, { root, emit }) {
        const imgUrl = ref('');
        // 七牛云token （七牛云上传图片到服务器时需要携带token，否则会报错token not specified令牌未指定,携带key是为了转码文件名）
        const uploadKey = reactive({
            token: "",
            key: "",
        });
        // --------------------------------------------------------------------------------------------
        // 获取七牛云token
        const getQiniuToken = () => {
            QiniuToken({
                "ak":props.uploadConfig.ak,
                "sk":props.uploadConfig.sk,
                "buckety":props.uploadConfig.buckety,
            }).then((response) => {
                uploadKey.token = response.data.data.token;
            })
        };
        const handleAvatarSuccess = (res, file) => {
            imgUrl.value = `http://r9a2h1unb.hn-bkt.clouddn.com/${res.key}`;
            emit("update:imgUrlProp", imgUrl.value); //使用修饰符修改传参
        };
        const beforeAvatarUpload = (file) => {
            const isJPG = file.type === 'image/jpeg';
            const isLt2M = file.size / 1024 / 1024 < 2;

            // 文件名转码后再上传到七牛云
            let suffix = file.name; //文件地址后缀
            uploadKey.key = encodeURI(`${suffix}`);
            // if (!isJPG) {
            //     root.$message.error('上传头像图片只能是 JPG 格式!');
            // }
            // if (!isLt2M) {
            //     root.$message.error('上传头像图片大小不能超过 2MB!');
            // }
            // return isJPG && isLt2M;
        };
        onMounted(() => {
            getQiniuToken();
        });
        // 监听
        watch(() => props.imgUrlProp, (newVal, oldVal) => {
            console.log('newVal: ' + newVal);
            imgUrl.value = newVal;
        }, { deep: true, immediate: true });
        return {
            imgUrl,
            uploadKey,
            // ----------------------------------------------------------------
            getQiniuToken,
            handleAvatarSuccess,
            beforeAvatarUpload,
        }
    }
}
</script>

<style lang="scss" scoped>
.uploadImg{
    ::v-deep .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    ::v-deep .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    ::v-deep .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 178px;
        height: 178px;
        line-height: 178px;
        text-align: center;
    }
    ::v-deep .avatar {
        width: 178px;
        height: 178px;
        display: block;
    }
}
</style>