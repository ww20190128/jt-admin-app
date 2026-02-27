<template>
  <div class="login-wrap">
    <div class="logo-wrap"></div>
    <div class="login-container">
      <div class="logo-img">
        <img :src="logoImg" />
        <P class="title">欢迎登录睛瞳管理系统 </P>
      </div>
      <div class="input-group">
        <input
          type="text"
          id="userName"
          v-model="ruleForm.userName"
          placeholder="请输入账号"
        />
      </div>
      <div class="input-group">
        <!-- 显示密码 -->
        <input
          :type="showPwd ? 'text' : 'password'"
          id="password"
          v-model="ruleForm.password"
          placeholder="请输入密码"
        />
      
      </div>
      <button class="login-btn" @click="handleLogin">登录</button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "@/store";

import { Toast, VanIcon } from "vant";
import logoImg from "@/assets/images/avatar.png";
import { userLogin } from "@/api/admin.js";
import PassWordUtils from "@/utils/passWordUtils.js";

export default {
  name: "login",
  components: { VanIcon },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      isLoading: false,
      ruleForm: {
        userName: "13400000003",
        password: "111222A#",
      },
      rules: {
        userName: [{ required: true, message: "请输入账号", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
      showPwd: false, // 是否显示密码
    });
    // 登录处理
    async function handleLogin() {
      // 简单验证
      if (!state.ruleForm.userName.trim()) {
        Toast("请填写您的账号");
        return;
      }
      if (!state.ruleForm.password.trim()) {
        Toast("请填写您的密码");
        return;
      }
      const password = await PassWordUtils.BrowserEncrypt(
        state.ruleForm.password.trim()
      );
      const { token, expire, currentAuthority } = await userLogin({
        username: state.ruleForm.userName.trim(),
        password: password,
      });

      // 保存登录的token和权限信息
      await store.dispatch("user/setUserToken", {
        token,
        expire,
        currentAuthority,
      });
      // 跳转到首页
      router.push({
        path: "/mine",
        query: {},
      });
    }
    return {
      ...toRefs(state),
      handleLogin,
      logoImg,
      PassWordUtils,
    };
  },
};
</script>

<style lang="less" scoped>
.login-wrap {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.login-container {
  width: 350px;
  padding: 30px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  .logo-img {
    margin-bottom: 20px;
    text-align: center;
    img {
      margin: auto;
      width: 100px;
      height: 100px;
    }
    .title {
      text-align: center;
      margin-top: 10px;
      font-size: 18px;
      color: #333;
    }
  }
  h2 {
    text-align: center;
    color: #333;
    margin-bottom: 25px;
  }

  .input-group {
    margin-bottom: 20px;

    input {
      width: 100%;
      height: 36px;
      padding: 0 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      outline: none;
      transition: border 0.3s;

      &:focus {
        border-color: #409eff;
      }
    }
  }

  .login-btn {
    width: 100%;
    height: 40px;
    background-color: #409eff;
    color: #fff;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 16px;
    transition: background-color 0.3s;

    &:hover {
      background-color: #66b1ff;
    }

    &:disabled {
      background-color: #a0cfff;
      cursor: not-allowed;
    }
  }
}
</style>
