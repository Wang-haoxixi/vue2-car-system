<template>
  <div>
    <el-upload class="avatar-uploader" action="http://up-z1.qiniup.com" :data="uploadData" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
      <img v-if="imageUrl" :src="imageUrl" class="avatar">
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { QiniuToken } from "@/api/common"
export default {
  props: {
    // 缩略图
    imgUrl: {
      type: String,
      default: "",
    }
  },
  data() {
    return {
      imageUrl: '',
      // 上传文件配置
      uploadData: {
        token: "",
      }
    };
  },
  watch: {
    // 监听车辆缩略图是否有值
    imgUrl: {
      handler(newVal) {
        console.log(11111111111, newVal)
        if (newVal) {
          this.imageUrl = newVal;
        }
      }
    }
  },
  beforeMount() {
    // 获取七牛云token
    this.getQiniuToken();
  },
  methods: {
    handleAvatarSuccess(res, file) {
      console.log(res, file);
      // this.imageUrl = URL.createObjectURL(file.raw); // 访问的本地图片
      this.imageUrl = `http://rdqblosfc.hb-bkt.clouddn.com/${res.key}`;
      this.$emit("update:imgUrl", this.imageUrl);
    },
    beforeAvatarUpload(file) {
      // const isJPG = file.type === 'image/jpeg';
      // const isLt2M = file.size / 1024 / 1024 < 2;

      // if (!isJPG) {
      //   this.$message.error('上传头像图片只能是 JPG 格式!');
      // }
      // if (!isLt2M) {
      //   this.$message.error('上传头像图片大小不能超过 2MB!');
      // }

      // return isJPG && isLt2M;
      console.log(file)
      // 获取到图片名称 
      const fileName = file.name;
      // 图片名称转码
      // const key = encodeURI(fileName);
      // key是文件全名
      const key = fileName;
      this.uploadData.key = key;

    },
    // 获取七牛云token
    getQiniuToken() {
      // 在工作中，一般前端都不用传这些参数，后端是封装好了的，直接调用后端的接口就行
      const params = {
        ak: "GHnOuYtiHUliqHtmZRR9AUnTXd005wu-wsBHwHdQ",
        sk: "ymd_-LMTCdl7wnHwvEMqQ70IE7mnNUvSk632TJ01",
        buckety: "test-qi-niu-web",
      }
      QiniuToken(params).then(res => {
        // console.log(res)
        const data = res.data.data;
        if (data.token) {
          this.uploadData.token = data.token;
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
</style>