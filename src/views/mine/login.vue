<template>
  <div class="login-wrap">
    <div class="login-container">
      <div class="logo-img">
        <img :src="logoImg" />
        <p class="title">欢迎登录~弱视训练管理后台</p>
      </div>

      <!-- 账号输入框 -->
      <div class="input-group">
        <input
          type="text"
          id="userName"
          v-model="ruleForm.userName"
          placeholder="请输入账号"
          class="input-item"
        />
      </div>

      <!-- 密码输入框（带显示/隐藏按钮） -->
      <div class="input-group password-group">
        <input
          :type="showPwd ? 'text' : 'password'"
          id="password"
          v-model="ruleForm.password"
          placeholder="请输入密码"
          class="input-item"
        />
        <!-- 密码显示/隐藏切换按钮 -->
        <span class="pwd-toggle-icon" @click="showPwd = !showPwd">
          {{ showPwd ? "🙈" : "👁️" }}</span
        >
      </div>

      <!-- 登录按钮（添加加载状态） -->
      <button class="login-btn" @click="handleLogin" :disabled="isLoading">
        {{ isLoading ? "登录中..." : "登录" }}
      </button>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "@/store";
import { Toast } from "vant";
import logoImg from "@/assets/images/app-logo.png";
import { userLogin } from "@/api/admin.js";
import PassWordUtils from "@/utils/passWordUtils.js";

export default {
  name: "login",
  components: {},
  setup() {
    const store = useStore();
    const router = useRouter();

    const state = reactive({
      isLoading: false, // 登录按钮加载状态
      ruleForm: {
        userName: "13400000003",
        password: "111222A#",
      },
      showPwd: false, // 是否显示密码
    });

    // 登录处理（添加异常捕获和加载状态）
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
      try {
        state.isLoading = true; // 开启加载状态
        const password = await PassWordUtils.BrowserEncrypt(
          state.ruleForm.password.trim()
        );
        // 调用登录接口
        const { token, expire, currentAuthority } = await userLogin({
          username: state.ruleForm.userName.trim(),
          password: password,
        });

        // 保存登录信息
        await store.dispatch("user/setUserToken", {
          token,
          expire,
          currentAuthority,
        });
        Toast.success("登录成功");
        router.push({ path: "/mine" });
      } catch (error) {
        Toast.fail(error);
      } finally {
        state.isLoading = false; // 关闭加载状态
      }
    }
    return {
      ...toRefs(state),
      handleLogin,
      logoImg,
    };
  },
};
</script>

<style lang="less" scoped>
// 登录页面整体容器（添加渐变背景）
.login-wrap {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  // 柔和的蓝紫渐变背景，适配老虎logo风格
  background: linear-gradient(135deg, #e8f4f8 0%, #f0f8fb 100%);
  padding: 20px;
  box-sizing: border-box;
}

// 登录卡片容器（优化阴影和圆角）
.login-container {
  width: 100%;
  max-width: 380px;
  padding: 40px 30px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
  position: relative;
  // logo区域样式优化
  .logo-img {
    margin-bottom: 30px;
    text-align: center;

    img {
      width: 120px; // 缩小显示，保持比例
      height: 120px;
      border-radius: 50%; // 圆形logo
      object-fit: cover;
      margin: 0 auto 15px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    }

    .title {
      text-align: center;
      font-size: 20px;
      color: #2d3748;
      font-weight: 600;
      margin: 0;
      letter-spacing: 0.5px;
    }
  }

  // 输入框组样式
  .input-group {
    margin-bottom: 20px;
    position: relative; // 为密码切换按钮定位

    .input-item {
      width: 100%;
      height: 48px;
      padding: 0 15px;
      border: 1px solid #e2e8f0;
      border-radius: 8px;
      outline: none;
      transition: all 0.3s ease;
      font-size: 15px;
      color: #2d3748;
      box-sizing: border-box;

      &::placeholder {
        color: #a0aec0;
      }

      &:focus {
        border-color: #4299e1;
        box-shadow: 0 0 0 3px rgba(66, 153, 225, 0.5);
      }
    }
  }

  // 密码输入框特殊样式（预留图标位置）
  .password-group .input-item {
    padding-right: 45px;
  }

  // 密码显示/隐藏图标样式
  .pwd-toggle-icon {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 16px;

    cursor: pointer;
    transition: color 0.3s ease;

    &:hover {
      color: #4299e1;
    }
  }

  // 登录按钮样式优化
  .login-btn {
    width: 100%;
    height: 48px;
    background-color: #4299e1;
    color: #fff;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    letter-spacing: 1px;

    &:hover:not(:disabled) {
      background-color: #3182ce;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(66, 153, 225, 0.3);
    }

    &:disabled {
      background-color: #90cdf4;
      cursor: not-allowed;
      transform: none;
      box-shadow: none;
    }

    .loading-icon {
      font-size: 18px;
      animation: spin 1s linear infinite;
    }
  }
}

// 加载图标旋转动画
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// 响应式适配（小屏幕）
@media (max-width: 375px) {
  .login-container {
    padding: 30px 20px;
  }

  .logo-img .title {
    font-size: 18px;
  }
}
</style>