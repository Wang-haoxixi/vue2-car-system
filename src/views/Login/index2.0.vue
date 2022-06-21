<template>
  <div id="login">
    <div class="warp">
      <ul class="ul">
        <li
          :class="{ active: current == index ? true : false }"
          v-for="(item, index) in tab"
          :key="index"
          @click="handleTab(item)"
        >
          {{ item.name }}
        </li>
      </ul>
      <el-form
        label-position="top"
        :model="ruleForm"
        status-icon
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="邮箱" prop="email" class="form-item">
          <el-input v-model="ruleForm.email" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="pwd" class="form-item">
          <el-input
            type="password"
            v-model="ruleForm.pwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="重复密码" prop="redoPwd" class="form-item" v-if="module == 'register'">
          <el-input
            type="password"
            v-model="ruleForm.redoPwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code" class="form-item">
          <div class="inp-btn">
            <el-input v-model="ruleForm.code" class="btn"></el-input>
            <el-button size="medium" type="success">获取验证码</el-button>
          </div>
        </el-form-item>
        <el-form-item class="btns">
          <el-button
            type="primary"
            @click="submitForm('ruleForm')"
            class="submit"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { stripscript, emailReg, codeReg } from "@/utils/validate.js";
export default {
  name: "login",
  data() {
    // 校验邮箱
    var validateEmail = (rule, value, callback) => {
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
      if (value === "") {
        callback(new Error("请输入密码"));
      } else if (!codeReg(value)) {
        callback(new Error("密码必须由6-12位数字加字母组成"));
      } else {
        callback();
      }
    };
    // 校验重复密码
    var validateRedoPwd = (rule, value, callback) => {
      if (value === "") {
        callback(new Error("请输入重复密码"));
      } else if (this.ruleForm.pwd != value) {
        callback(new Error("重复密码与密码不一致"));
      } else {
        callback();
      }
    };
    // 校验验证码
    var validateCode = (rule, value, callback) => {
      this.ruleForm.code = stripscript(value)
      value = this.ruleForm.code
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (String(value).length != 4) {
        callback(new Error("验证码必须由4位数字或字母组成"));
      } else {
        callback();
      }
    };

    return {
      module: 'login',
      tab: [
        { name: "登录", index: 0, module: 'login' },
        { name: "注册", index: 1 , module: 'register' },
      ],
      current: 0,
      ruleForm: {
        email: "",
        pwd: "",
        redoPwd: "",
        code: "",
      },
      rules: {
        email: [{ validator: validateEmail, trigger: "blur" }],
        pwd: [{ validator: validatePwd, trigger: "blur" }],
        redoPwd: [{ validator: validateRedoPwd, trigger: "blur" }],
        code: [{ validator: validateCode, trigger: "blur" }],
      },
    };
  },
  methods: {
    handleTab(item) {
      this.current = item.index;
      this.module = item.module;
      this.$refs.ruleForm.resetFields();
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
#login {
  height: 100vh;
  background: rgb(24, 92, 138);
  .warp {
    width: 400px;
    margin: auto;
    color: #ffffff;
    .ul {
      text-align: center;
      margin-bottom: 10px;
      li {
        display: inline-block;
        padding: 10px 30px;
        border-radius: 3px;
        cursor: pointer;
        &.active {
          background: orange;
        }
      }
    }
    ::v-deep .el-form-item__label {
      color: #ffffff;
    }
    .form-item {
      margin-bottom: 10px;
      .inp-btn {
        display: flex;
        align-items: center;
        .btn {
          margin-right: 10px;
        }
      }
    }
    .btns {
      margin-top: 30px;
      .submit {
        width: 100%;
      }
    }
  }
}
</style>