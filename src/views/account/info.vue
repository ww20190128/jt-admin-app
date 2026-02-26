<template>
  <div class="account_info-wrap">
    <div class="head-warper">
      <div class="left" @click="$router.go(-1)">
        <img src="@/assets/images/icon/back.png" alt="返回" />
      </div>
      <div class="right">
        <div @click="gotoTrain" class="botton">训练设置</div>
      </div>
    </div>
    <!-- 1. 用户详情区 -->
    <div class="section user-info-section" v-if="accountInfo">
      <div class="section-title">用户详情</div>
      <div class="account-info-wrap">
        <div class="form-row">
          <label>姓名</label>
          <div class="value-wrap">
            <span>{{ accountInfo.username }}</span>
            <span class="edit-arrow" @click="showUpdate">></span>
          </div>
        </div>
        <div class="form-row">
          <label>手机号</label>
          <div class="value-wrap">
            <span>{{ accountInfo.account }}</span>
          </div>
        </div>
        <div class="form-row">
          <label>性别</label>
          <div class="value-wrap">
            <span>{{ accountInfo.sex == "1" ? "男" : "女" }}</span>
            <span class="edit-arrow" @click="showUpdate">></span>
          </div>
        </div>
        <div class="form-row">
          <label>年龄</label>
          <div class="value-wrap">
            <span>{{ getAge() }}</span>
            <span class="edit-arrow" @click="showUpdate">></span>
          </div>
        </div>
        <div class="form-row">
          <label>当前卡类型</label>
          <div class="value-wrap">
            <span>{{ getCurrentCardType() }}</span>
            <span class="edit-arrow" @click="showUpdate">></span>
          </div>
        </div>
        <div class="form-row">
          <label>有效期至</label>
          <div class="value-wrap">
            <span>{{ accountInfo.expiredAt }}</span>
          </div>
        </div>
        <div class="form-row">
          <label>状态</label>
          <div class="value-wrap">
            <span>{{ accountInfo.status == "1" ? "正常" : "暂停" }}</span>
            <span class="edit-arrow" @click="showUpdate">></span>
          </div>
        </div>
        <div class="form-row">
          <label>重置密码</label>
          <div class="value-wrap">
            <span></span>
            <span class="edit-arrow" @click="showUpdate">></span>
          </div>
        </div>
      </div>
    </div>

    <!-- 3. 训练方案区 -->
    <div class="section plan-section">
      <h3 class="section-title">训练方案</h3>
      <div class="plan-wrap">
        <div class="item-list">
          <div
            class="item"
            v-for="item in planSettings.train_plan"
            :key="item.key"
          >
            <div class="item-left">
              <van-checkbox v-model="item.checked">{{
                item.course_id
              }}</van-checkbox>
            </div>
            <div class="item-right">
              <span>训练时长(分):</span>
              <div class="num-ctrl">
                <button
                  @click="
                    item.course_duration = Math.max(0, item.course_duration - 1)
                  "
                >
                  −
                </button>
                <span>{{ item.course_duration }}</span>
                <button @click="item.course_duration += 1">+</button>
              </div>
            </div>
          </div>
        </div>
        <div class="plan-op-wrap">
          <div class="form-row">
            <label>遮挡设置</label>
            <select v-model="planSettings.show_eye">
              <option value="1">双眼</option>
              <option value="2">左眼</option>
              <option value="3">右眼</option>
            </select>
          </div>
          <div class="form-row">
            <label>集合散开模式</label>
            <select v-model="planSettings.binocular_model">
              <option value="1">混合模式</option>
              <option value="2">集合优先</option>
              <option value="3">散开优先</option>
            </select>
          </div>
          <div class="form-row">
            <label>训练时长(分钟)</label>
            <div class="num-ctrl">
              <button
                @click="
                  planSettings.max_train_time = Math.max(
                    0,
                    planSettings.max_train_time - 1
                  )
                "
              >
                −
              </button>
              <span>{{ planSettings.max_train_time }}</span>
              <button @click="planSettings.max_train_time += 1">+</button>
            </div>
          </div>
        </div>
        <div class="btn-group">
          <button class="btn btn-secondary" @click="handlePlanCancel">
            取消
          </button>
          <button class="btn btn-primary" @click="handlePlanConfirm">
            确认
          </button>
        </div>
      </div>
    </div>

    <!-- 4. 档案列表区 -->
    <div class="section archive-section">
      <h3 class="section-title">训练记录</h3>
      <div class="archive-wrap">
        <div class="archive-item" v-for="item in trainlog" :key="item.id">
          <span>档案 {{ item.id }}</span>
          <span class="arrow">→</span>
        </div>
        <div v-if="trainlog.length === 0" class="empty-tip">暂无训练记录</div>
      </div>
    </div>

    <!-- 4. 档案列表区 -->
    <div class="section archive-section">
      <h3 class="section-title">训练联系</h3>
    </div>
  </div>
  <BaseDialog v-model:show="showUpdateAccount" :showConfirmButton="false">
    <div class="dialog-content">
      <div class="title">修改账号</div>
      <div class="content">
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

        <div class="form-row">
          <label>重置密码</label>
          <input
            type="password"
            v-model="accountInfo.password"
            class="form-input"
            placeholder="请输入新密码"
          />
        </div>
      </div>
      <div class="botton-wrap">
        <div class="confirm-botton" @click="handleUpdateAccountConfirm">
          确定
        </div>
        <div class="cancel-botton" @click="showUpdateAccount = false">取消</div>
      </div>
    </div>
  </BaseDialog>
</template>

<script>
import { reactive, toRefs, onMounted, inject } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Toast } from "vant";
import { get } from "lodash";

import { getPlan, setPlan, trainlog } from "@/api/admin";
import BaseDialog from "@/components/BaseDialog";
export default {
  name: "account_info",
  components: {
    BaseDialog,
  },
  setup() {
    const router = useRouter();
    const route = useRoute();

    const { id } = route.query;
    const state = reactive({
      accountInfo: {},
      classifyList: [
        { id: -1, name: "全部" },
        { id: 0, name: "免费" },
        { id: 3, name: "七日卡" },
        { id: 99, name: "体验卡" },
        { id: 101, name: "季卡" },
        { id: 102, name: "半年卡" },
        { id: 103, name: "年卡" },
        { id: 104, name: "年卡Plus" },
      ],

      // 训练方案
      trainingItems: [
        { key: "stimulus", name: "刺激训练", checked: false, duration: 10 },
        { key: "fine", name: "精细", checked: false, duration: 10 },
        { key: "suppression", name: "脱抑制", checked: false, duration: 10 },
        { key: "center", name: "旁中心", checked: false, duration: 10 },
        { key: "simultaneous", name: "同时视觉", checked: false, duration: 10 },
        { key: "fusion", name: "双眼融合", checked: false, duration: 10 },
        { key: "muscle", name: "眼肌", checked: false, duration: 10 },
      ],
      planSettings: {
        occlusion: "双眼",
        binocular_model: "混合模式",
        totalDuration: 120,
        train_plan: [],
      },
      // 训练记录
      trainlog: [],
      showUpdateAccount: false, // 显示修改账号信息
    });

    onMounted(async () => {
      if (!id) {
        Toast.fail("缺少ID");
        return;
      }
      await init();
    });

    // 计算年龄
    const getAge = () => {
      if (!state.accountInfo.birthday) return "";
      const birthYear = new Date(state.accountInfo.birthday).getFullYear();
      const currentYear = new Date().getFullYear();
      return currentYear - birthYear;
    };
    // 获取当前卡类型
    const getCurrentCardType = () => {
      const cardTypeId = state.accountInfo.typeId;
      const card = state.classifyList.find((c) => c.id === cardTypeId);
      return card ? card.name : "未知";
    };

    // 初始化页面数据
    async function init() {
      // 1. 获取用户详情
      const accountInfo = JSON.parse(
        window.localStorage.getItem("account_info_" + id)
      );
      state.accountInfo = accountInfo;
      console.log("accountInfo:", accountInfo);

      // 2. 获取训练方案
      const { data } = await getPlan({ id: 10254 });
      state.planSettings = data;

      // 获取训练记录

      const { data1 } = await trainlog({ id: 10254 });
      state.trainlog = data1.list;
    }

    // 保存用户信息
    async function handleSaveInfo() {
      try {
        await updateUserInfo({ id: userId, ...state.accountInfo });
        Toast.success("保存成功");
      } catch (err) {
        Toast.fail("保存失败");
      }
    }

    // 暂停训练
    function handleTraining() {
      state.accountInfo.status = "暂停";
      Toast("已切换为暂停状态");
    }

    // 卡操作确认
    async function handleCardOpConfirm() {
      try {
        await operateCard({
          userId,
          type: state.cardOp.type,
          targetCard: state.cardOp.targetCard,
        });
        Toast.success("卡操作成功");
        // 刷新用户信息
        initPageData();
      } catch (err) {
        Toast.fail("卡操作失败");
      }
    }

    // 训练方案取消
    function handlePlanCancel() {
      initPageData(); // 重置为初始数据
      Toast("已重置方案");
    }

    // 训练方案确认
    async function handlePlanConfirm() {
      try {
        await setPlan({ id: id, ...state.planSettings });
        Toast.success("方案保存成功");
      } catch (err) {
        Toast.fail("方案保存失败");
      }
    }

    function showUpdate() {
      state.showUpdateAccount = true;
    }
    // 确认修改账号信息
    async function handleUpdateAccountConfirm() {
      try {
        await updateUserInfo({ id: userId, ...state.accountInfo });
        Toast.success("修改成功");
        state.showUpdateAccount = false;
        // 刷新页面数据
        init();
      } catch (err) {
        Toast.fail("修改失败");
      }
    }
    // 跳转到训练设置页面
    function gotoTrain() {
      router.push({
        path: "/account/trainSettings",
        query: {
          id: id,
        },
      });
    }
    return {
      ...toRefs(state),
      handleSaveInfo,
      handleTraining,
      handleCardOpConfirm,
      handlePlanCancel,
      handlePlanConfirm,

      getAge,
      getCurrentCardType,
      showUpdate,
      handleUpdateAccountConfirm,
      gotoTrain,
    };
  },
};
</script>

<style lang="less" scoped>
.botton {
  height: 35px;
  line-height: 35px;
  padding: 0 10px;
  text-align: center;
  background-color: @primary-color;
  color: #ffffff;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:active {
    background-color: #1d4ed8;
  }
}
@padding-base: 16px;
@primary-color: #2563eb;
@grey-color: #4e5969;
@light-grey: #f5f7fa;
@border-color: #e5e6eb;
.form-row {
  display: flex;
  align-items: center;
  background-color: #fff;
  border-bottom: 1px solid #f0f0f0;
  position: relative;

  &.last-child {
    border-bottom: none;
  }

  label {
    flex: 0 0 50px;
    color: #333;
    font-weight: normal;
  }

  .form-input {
    flex: 1;
    min-width: 120px;
    height: 32px;
    padding: 0 10px;
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
.dialog-content {
  text-align: center;
  padding: 20px 5px;
  font-size: 14px;
  color: #333;

  .title {
    font-weight: bold;
    font-size: 18px;
    color: #1d2129;
    text-align: center;
    margin-bottom: 24px;
    line-height: 1.5;
  }

  .content {
    margin-bottom: 32px;
    .field-item {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .name {
        text-align: left;
        line-height: 30px;
        font-size: 14px;
        color: @grey-color;
      }
      .value {
        font-size: 16px;
        color: #1d2129;
      }
    }
  }

  .botton-wrap {
    display: flex;
    gap: 12px;
    width: 100%;

    .confirm-botton {
      flex: 1;
      height: 44px;
      line-height: 44px;
      text-align: center;
      background-color: @primary-color;
      color: #ffffff;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:active {
        background-color: #1d4ed8;
      }
    }

    .cancel-botton {
      flex: 1;
      height: 44px;
      line-height: 44px;
      text-align: center;
      background-color: #dde9fc;
      color: @grey-color;
      border-radius: 8px;
      font-size: 16px;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:active {
        background-color: @border-color;
      }
    }
  }
}
.account_info-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
  background-color: #f5f7fa;
  min-height: 100vh;
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
  &.last-child {
    border-bottom: none;
  }
  label {
    flex: 0 0 100px;
    color: #333;
    font-weight: normal;
  }
  .value-wrap {
    flex: 1; /* 占满剩余宽度 */
    display: flex; /* 内部弹性布局，值和箭头分开 */
    align-items: center;
    justify-content: space-between; /* 内容左对齐，箭头右对齐 */
    min-height: 20px; /* 保证空值时也有高度 */
    .edit-arrow {
      color: #ccc;
      font-size: 16px;
      margin-left: 15px;
      cursor: pointer;
    }
  }
  &:hover {
    background-color: #f8f8f8;
  }
}

.btn-group {
  display: flex;
  gap: 12px;
  margin-top: 20px;
  justify-content: flex-end;
}

.btn {
  padding: 8px 16px;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  border: none;
  transition: all 0.2s;

  &.primary {
    background-color: #409eff;
    color: #fff;

    &:hover {
      background-color: #66b1ff;
    }
  }

  &.secondary {
    background-color: #909399;
    color: #fff;

    &:hover {
      background-color: #a6a9ad;
    }
  }
}

// 训练方案区
.plan-wrap {
  .item-list {
    margin-bottom: 20px;

    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;

      .item-left {
        flex: 1;
      }

      .item-right {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #666;
      }
    }
  }

  .num-ctrl {
    display: flex;
    align-items: center;
    gap: 8px;

    button {
      width: 24px;
      height: 24px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      background: #fff;
      font-size: 14px;
      cursor: pointer;

      &:hover {
        border-color: #409eff;
        color: #409eff;
      }
    }

    span {
      min-width: 30px;
      text-align: center;
    }
  }
}

// 档案列表区
.archive-wrap {
  .archive-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f5f7fa;
    }

    .arrow {
      color: #909399;
      font-size: 16px;
    }
  }

  .empty-tip {
    text-align: center;
    color: #909399;
    padding: 20px 0;
  }
}
</style>
