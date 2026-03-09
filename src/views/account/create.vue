<template>
  <div class="account_create-wrap">
    <div class="head-warper">
      <div class="left" @click="$router.go(-1)">
        <img src="@/assets/images/icon/back.png" alt="返回" />
      </div>
    </div>

    <!-- 用户详情区 -->
    <div class="section user-info-section">
      <h3 class="section-title">新增用户</h3>
      <div class="account-info-wrap">
        <!-- 姓名 -->
        <div class="form-row">
          <label>姓名</label>
          <input
            type="text"
            v-model="accountInfo.username"
            placeholder="请输入姓名"
            class="form-input"
          />
        </div>

        <!-- 手机号（带格式验证） -->
        <div class="form-row">
          <label>手机号</label>
          <input
            type="tel"
            v-model="accountInfo.account"
            placeholder="请输入手机号"
            class="form-input"
            @blur="validatePhone"
            @input="phoneInputHandler"
          />
          <span v-if="phoneError" class="error-tip">{{ phoneError }}</span>
        </div>

        <!-- 性别（radio方式） -->
        <div class="form-row">
          <label>性别</label>
          <div class="radio-group">
            <label class="radio-item">
              <input
                type="radio"
                v-model="accountInfo.sex"
                value="0"
                name="sex"
              />
              未知
            </label>
            <label class="radio-item">
              <input
                type="radio"
                v-model="accountInfo.sex"
                value="1"
                name="sex"
              />
              男
            </label>
            <label class="radio-item">
              <input
                type="radio"
                v-model="accountInfo.sex"
                value="2"
                name="sex"
              />
              女
            </label>
          </div>
        </div>

        <!-- 出生日期（日期选择器） -->
        <div class="form-row">
          <label>出生日期</label>
          <input
            type="date"
            v-model="accountInfo.birthdayStr"
            class="form-input"
            placeholder="请选择出生日期"
            @change="calculateAge"
          />
        </div>

        <!-- 当前卡类型 -->
        <div class="form-row">
          <label>当前卡类型</label>
          <select v-model="accountInfo.typeId" class="form-input form-select">
            <option
              v-for="value in classifyList"
              :key="value.id"
              :value="value.id"
            >
              {{ value.name }}
            </option>
          </select>
        </div>
      </div>
      <div class="op-wrap">
        <button class="op-btn cancel-btn" @click="handleCancel">取消</button>
        <button
          class="op-btn confirm-btn"
          @click="handleCreate"
          :disabled="!formIsValid"
        >
          开卡
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Toast } from "vant";
import { buyvip } from "@/api/admin";
import { useStore } from "@/store";
export default {
  name: "account_create",
  setup() {
    const router = useRouter();
    const store = useStore();
    document.title = "创建用户";
    // 计算7年前的日期（兼容所有浏览器）
    function getDefaultBirthday() {
      const now = new Date();
      const sevenYearsAgo = new Date(now.setFullYear(now.getFullYear() - 7));
      const year = sevenYearsAgo.getFullYear();
      const month = (sevenYearsAgo.getMonth() + 1).toString().padStart(2, "0");
      const day = sevenYearsAgo.getDate().toString().padStart(2, "0");
      return `${year}-${month}-${day}`;
    }

    // 响应式数据（简化结构，避免命名冲突）
    const state = reactive({
      accountInfo: {
        username: "", // 姓名
        account: "", // 手机号
        sex: "0", // 性别（默认未知）
        birthdayStr: getDefaultBirthday(), // 出生日期字符串 YYYY-MM-DD
        age: 0, // 计算后的年龄（整数）
        typeId: "99", // 卡类型ID
        requestId: "", // 请求ID（如果需要）
      },
      classifyList: [
        { id: 99, name: "体验卡" },
        { id: 101, name: "季卡" },
        { id: 102, name: "半年卡" },
        { id: 103, name: "年卡" },
        { id: 104, name: "年卡Plus" },
      ],
      phoneError: "", // 手机号错误提示
      formIsValid: false, // 表单是否有效
    });

    // 手机号输入处理（输入时清空错误提示）
    function phoneInputHandler() {
      state.phoneError = "";
      checkFormValid(); // 实时检查表单状态
    }

    // 手机号格式验证
    function validatePhone() {
      const { account } = state.accountInfo;
      state.phoneError = "";

      if (!account) {
        state.phoneError = "手机号不能为空";
        checkFormValid();
        return false;
      }

      // 兼容所有浏览器的手机号正则
      const phoneReg = /^1[3456789]\d{9}$/;
      if (!phoneReg.test(account)) {
        state.phoneError = "请输入正确的手机号格式";
        checkFormValid();
        return false;
      }
      checkFormValid();
      return true;
    }

    // 根据出生日期计算年龄（确保整数）
    function calculateAge() {
      try {
        const birthday = new Date(state.accountInfo.birthdayStr);
        // 验证日期有效性
        if (birthday.toString() === "Invalid Date") {
          state.accountInfo.age = 0;
          checkFormValid();
          return;
        }

        const now = new Date();
        let age = now.getFullYear() - birthday.getFullYear();
        const monthDiff = now.getMonth() - birthday.getMonth();

        // 未到生日则年龄减1
        if (
          monthDiff < 0 ||
          (monthDiff === 0 && now.getDate() < birthday.getDate())
        ) {
          age--;
        }

        // 确保年龄为非负整数
        state.accountInfo.age = Math.max(0, parseInt(age, 10));
        checkFormValid();
      } catch (e) {
        console.error("年龄计算错误：", e);
        state.accountInfo.age = 0;
        checkFormValid();
      }
    }

    // 检查表单是否有效（所有必填项已填写且验证通过）
    function checkFormValid() {
      const { username, account, birthdayStr, typeId } = state.accountInfo;

      // 基础验证
      const hasName = username.trim().length > 0;
      const hasPhone = account.trim().length === 11 && !state.phoneError;
      const hasBirthday = birthdayStr && birthdayStr !== "";
      const hasType = typeId && typeId !== "";

      // 更新表单状态
      state.formIsValid = hasName && hasPhone && hasBirthday && hasType;
    }

    // 取消按钮逻辑
    function handleCancel() {
      router.go(-1);
    }

    // 开卡按钮逻辑（健壮性处理）
    async function handleCreate() {
      // 前置验证
      if (!state.formIsValid) {
        Toast("请完善所有必填信息并确保格式正确");
        return;
      }

      try {
        // 构建提交数据（类型转换 + 字段清理）
        const submitData = {
          account: state.accountInfo.account,
          username: state.accountInfo.username,
          sex: Number(state.accountInfo.sex),
          birthday: state.accountInfo.age, // 年龄（整数）
          typeId: Number(state.accountInfo.typeId),
          requestId: state.accountInfo.requestId,
        };

        // 调用接口
        await buyvip(submitData);
        Toast.success("开卡成功");
        // 延迟返回，让用户看到提示
        setTimeout(() => {
          router.go(-1);
        }, 1000);
      } catch (error) {
        Toast.fail(error);
      }
    }

    // 页面初始化
    onMounted(() => {
      // 获取用户信息
      const userInfo = computed(() => store.getters.userInfo);
      if (!userInfo.value?.requestId) {
        Toast.fail("用户信息获取失败，请重新登录");
        router.push("/login");
        return;
      }
      state.accountInfo.requestId = userInfo.value.requestId;
      // 计算默认年龄
      calculateAge();
      // 初始化表单状态检查
      checkFormValid();
    });

    return {
      ...toRefs(state),
      phoneInputHandler,
      validatePhone,
      calculateAge,
      handleCancel,
      handleCreate,
    };
  },
};
</script>

<style lang="less" scoped>
.account_create-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
  position: relative;

  .head-warper {
    position: relative;
    width: 100%;
    height: 40px;
    display: flex;
    padding: 0 10px;
    justify-content: space-between;
    align-items: center;

    .left {
      font-size: 22px;
      cursor: pointer;
    }

    img {
      height: 20px;
    }
  }
}

.section {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.form-row {
  display: flex;
  align-items: center;
  padding: 15px 16px;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: relative;

  label {
    flex: 0 0 100px;
    color: #333;
    font-weight: normal;
  }

  .form-input {
    flex: 1;
    min-width: 200px;
    height: 32px;
    padding: 0 8px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
    color: #333;
  }

  .form-select {
    height: 34px;
    cursor: pointer;
  }

  &:hover {
    background-color: #f8f8f8;
  }

  // 错误提示样式
  .error-tip {
    position: absolute;
    right: 16px;
    color: #f56c6c;
    font-size: 12px;
  }

  // 年龄显示样式
  .age-text {
    margin-left: 12px;
    color: #666;
    font-size: 14px;
  }
}

// 单选框样式
.radio-group {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  padding: 2px 0;
  gap: 16px;

  .radio-item {
    display: flex;
    cursor: pointer;
    font-size: 14px;
    color: #333;

    input[type="radio"] {
      margin-right: 6px;
      border: none;
    }
  }
}

// 操作按钮样式（简化版，避免冲突）
.op-wrap {
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 24px;
  padding: 0 16px;

  .op-btn {
    padding: 8px 24px;
    border-radius: 4px;
    font-size: 14px;
    cursor: pointer;
    border: none;
    transition: all 0.2s;

    &.cancel-btn {
      background-color: #f5f7fa;
      color: #666;
      border: 1px solid #e4e7ed;
    }

    &.cancel-btn:hover {
      background-color: #e4e7ed;
    }

    &.confirm-btn {
      background-color: #409eff;
      color: #fff;
    }

    &.confirm-btn:hover:not(:disabled) {
      background-color: #66b1ff;
    }

    // 禁用状态（原生disabled样式，兼容性最好）
    &:disabled {
      background-color: #c0c4cc !important;
      cursor: not-allowed;
      opacity: 0.7;
    }
  }
}
</style>