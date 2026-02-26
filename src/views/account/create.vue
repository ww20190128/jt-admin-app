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

        <!-- 年龄（日期选择器） -->
        <div class="form-row">
          <label>出生日期</label>
          <input
            type="date"
            v-model="accountInfo.birthday"
            class="form-input"
            placeholder="请选择出生日期"
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
        <button class="op-btn confirm-btn" @click="handleCreate">开卡</button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Toast } from "vant";
import { buyvip } from "@/api/admin";

export default {
  name: "account_create",
  setup() {
    const router = useRouter();
    const route = useRoute();

    // 响应式数据
    const state = reactive({
      accountInfo: {
        account: "", // 手机号
        birthdayTime: "", // 出生日期
        sex: "0", // 性别，默认未知
        typeId: "99", // 卡类型ID
        username: "", // 姓名
        birthday: 0,
      },
      classifyList: [
        { id: 99, name: "体验卡" },
        { id: 101, name: "季卡" },
        { id: 102, name: "半年卡" },
        { id: 103, name: "年卡" },
        { id: 104, name: "年卡Plus" },
      ],
      phoneError: "", // 手机号错误提示
    });

    // 手机号格式验证
    const validatePhone = () => {
      const { account } = state.accountInfo;
      // 清空之前的错误提示
      state.phoneError = "";

      if (!account) {
        state.phoneError = "手机号不能为空";
        return false;
      }

      // 手机号正则验证（11位数字，以1开头）
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(account)) {
        state.phoneError = "请输入正确的手机号格式";
        return false;
      }
      return true;
    };

    // 根据出生日期计算年龄
    const calculateAge = () => {
      if (!state.accountInfo.birthdayTime) return 0;
      const birthDate = new Date(state.accountInfo.birthdayTime);
      const now = new Date();
      let age = now.getFullYear() - birthDate.getFullYear();
      // 校验月份和日期，未到生日则年龄减1
      const monthDiff = now.getMonth() - birthDate.getMonth();
      if (
        monthDiff < 0 ||
        (monthDiff === 0 && now.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      return age < 0 ? 0 : Number(age);
    };

    // 取消按钮逻辑
    const handleCancel = () => {
      router.go(-1);
    };

    // 创建按钮逻辑（包含表单验证）
    async function handleCreate() {
      // 先验证手机号
      if (!validatePhone()) return;
      // 验证姓名
      if (!state.accountInfo.username.trim()) {
        Toast("请输入姓名");
        return;
      }
      // 验证卡类型
      if (!state.accountInfo.typeId) {
        Toast("请选择卡类型");
        return;
      }
      state.accountInfo.birthday = Number(calculateAge());
      const { data } = await buyvip(state.accountInfo);
      Toast("开卡成功");
      router.go(-1);
    }

    onMounted(async () => {});

    return {
      ...toRefs(state),
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

  &.last-child {
    border-bottom: none;
  }

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

    &[readonly] {
      background-color: #f5f7fa;
      color: #909399;
    }
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

// 操作按钮样式（优化布局）
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

      &:hover {
        background-color: #e4e7ed;
      }
    }

    &.confirm-btn {
      background-color: #409eff;
      color: #fff;

      &:hover {
        background-color: #66b1ff;
      }
    }
  }
}
</style>
