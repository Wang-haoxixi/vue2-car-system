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
        <el-form-item
          label="重复密码"
          prop="redoPwd"
          class="form-item"
          v-if="module == 'register'"
        >
          <el-input
            type="password"
            v-model="ruleForm.redoPwd"
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code" class="form-item">
          <div class="inp-btn">
            <el-input v-model="ruleForm.code" class="inp"></el-input>
            <el-button :loading="codeStatus" size="medium" class="btn" type="success" :disabled="codeStatus" @click="getCode"
              >{{ codeText }}</el-button
            >
          </div>
        </el-form-item>
        <el-form-item class="btns">
          <el-button
            type="primary"
            :disabled="loginStatus"
            @click="submitForm('ruleForm')"
            class="submit"
            >{{ module == 'register' ? "注册" : "登录" }}</el-button
          >
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import sha1 from "sha1";
import { GetSms, Register } from "@/api/login.js";
import { reactive, ref, isRef, toRefs, onMounted } from "@vue/composition-api";
import { stripscript, emailReg, codeReg } from "@/utils/validate.js";
export default {
  name: "login",
  setup(props, content) {
    // console.log(content.root.$store.getters["app/roles"])

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
      } else if (ruleForm.pwd != value) {
        callback(new Error("重复密码与密码不一致"));
      } else {
        callback();
      }
    };
    // 校验验证码
    var validateCode = (rule, value, callback) => {
      ruleForm.code = stripscript(value);
      value = ruleForm.code;
      if (value === "") {
        callback(new Error("请输入验证码"));
      } else if (String(value).length != 6) {
        callback(new Error("验证码必须由4位数字或字母组成"));
      } else {
        callback();
      }
    };
    // 这里面放置data数据、生命周期、自定义的函数

    /**
     * 声明数据
     */
    // 声明对象类型用reactive处理
    const tab = reactive([
      { name: "登录", index: 0, module: "login" },
      { name: "注册", index: 1, module: "register" },
    ]);
    // 表单绑定数据
    const ruleForm = reactive({
      // email: "1570058176@qq.com",
      email: "",
      pwd: "",
      redoPwd: "",
      code: "",
    });
    // 表单的验证
    const rules = reactive({
      email: [{ validator: validateEmail, trigger: "blur" }],
      pwd: [{ validator: validatePwd, trigger: "blur" }],
      redoPwd: [{ validator: validateRedoPwd, trigger: "blur" }],
      code: [{ validator: validateCode, trigger: "blur" }],
    });

    // 声明基础数据类型用ref处理
    // 当前模块
    const module = ref("login");
    // 高亮
    const current = ref(0);
    // console.log(isRef(module))
    // 登录按钮禁用状态
    const loginStatus = ref(true);
    // 获取验证码按钮禁用
    const codeStatus = ref(false);
    // 获取验证按钮文本
    const codeText = ref("获取验证码");
    // 倒计时变量
    const timer = ref(null);

    /**
     * 声明函数
     */
    // 切换module
    const handleTab = (item) => {
      // 高亮
      current.value = item.index;
      // 修改模块
      module.value = item.module;
      // 重置表单
      content.refs.ruleForm.resetFields();
    };
    /**
     * 登录/注册
    */
    const submitForm = (formName) => {
      content.refs[formName].validate((valid) => {
        if (valid) {
          module.value === "login" ? login() : register()
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    };
    /**
     * 登录
    */
    const login = ()=>{
      // 请求参数
      let queryData = {
        username: ruleForm.email,
        password: sha1(ruleForm.pwd),  //加密 sha1
        code: ruleForm.code,
      }
      content.root.$store.dispatch("app/LOGINING", queryData).then(({ data }) => {
        if(data.resCode === 0){
          content.root.$message.success(data.message);
          content.root.$router.push({ name: 'Console' });
          clearClearIntervalFn();
        }
      })
    };
    /**
     * 注册
    */
    const register = ()=>{
      let data = {
        username: ruleForm.email,
        password: sha1(ruleForm.pwd), 
        code: ruleForm.code,
      }
      Register(data).then(({ data })=>{
        if(data.resCode === 0){
          content.root.$message.success(data.message);
          // 切换至登录module
          handleTab({ name: "登录", index: 0, module: "login" });
          clearClearIntervalFn();
        }
      }).catch(err=>{
        console.log(err)
      })    
    };
    /**
     * 倒计时
    */
    const countDown = (t)=>{
      // 若计时器存在，则清除倒计时
      if(timer.value){ clearInterval(timer.value); };
      // 开始运作倒计时
      timer.value = setInterval(()=>{
        t--;
        if(t==0){
          clearInterval(timer.value);
          codeText.value = "重新获取";
          codeStatus.value = false;
        }else{
          codeText.value = `倒计时${t}秒`
        }
      },1000)
    }
    /**
     * 清除计时器
    */
    const clearClearIntervalFn = ()=>{
      // 还原获取验证码默认状态
      codeStatus.value = false;
      codeText.value = "获取验证码";
      // 清除倒计时
      clearInterval(timer.value);
    }
    /**
     * 获取验证码
    */
    const getCode = () => {
      if(ruleForm.email === ''){
        return content.root.$message.error('邮箱不能为空！')
      }
      if( !emailReg(ruleForm.email) ){
        return content.root.$message.error('邮箱格式有误！')
      }
      let data = {
        username: ruleForm.email,
        module: module.value,
      }

      // 获取验证码按钮状态改变
      codeStatus.value = true;
      // 获取验证码按钮文本变成‘发送中’
      codeText.value = "发送中";

      // 三秒后进行接口请求
      setTimeout(() => {
        GetSms(data).then(({ data })=>{
          if(data.resCode === 0){
            content.root.$message.success(data.message)
            // 启用登录按钮
            loginStatus.value = false;
            // 开始倒计时
            countDown(10);
          }
        }).catch(err=>{
          console.log(err)
        })
      }, 3000);

    };

    // const aa = reactive({
    //   x: 1,
    //   y: 2,
    // });
    // const bb = toRefs(aa);
    // console.log(bb.x.value)

    /**
     * 生命周期
     */
    //  挂载完成后
    onMounted(() => {
      console.log("onMounted");
    });

    // 在模板中要用的东西都要return出去
    return {
      tab,
      current,
      module,
      handleTab,
      submitForm,
      ruleForm,
      rules,
      getCode,
      loginStatus,
      codeStatus,
      codeText,
      timer,
    };
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
        .inp {
          margin-right: 10px;
        }
        .btn{
          width: 180px;
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