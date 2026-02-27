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
            <span>{{ formatTime(accountInfo.expiredAt) }}</span>
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
      <p class="duration-label">时长单位：分</p>
      <div class="plan-wrap">
        <div class="item-list">
          <div
            class="item"
            v-for="(item, index) in sortedTrainPlans"
            :key="item.id || index"
          >
            <div class="item-left">
              <van-checkbox
                v-model="item.checked"
                :label="trainTypeMap[item.course_id] || '未知训练类型'"
                class="train-type-checkbox"
              >
                {{ trainTypeMap[item.course_id] || "未知训练类型" }}
              </van-checkbox>
            </div>
            <div class="item-right">
              <!-- 修复滑块容器宽度问题 -->
              <div class="slider-container">
                <van-slider
                  v-model="item.course_duration"
                  :min="0"
                  :max="60"
                  :step="1"
                  @change="handleDurationChange(item)"
                  class="custom-slider"
                  :disabled="!item.checked"
                />
                <span class="slider-value">{{ item.course_duration }}</span>
              </div>
            </div>
          </div>
        </div>
        <div class="plan-op-wrap">
          <!-- 遮挡设置 -->
          <div class="form-row radio-row">
            <label class="radio-label">遮挡设置</label>
            <div class="radio-group">
              <label class="radio-item">
                <input
                  type="radio"
                  v-model="planSettings.show_eye"
                  value="1"
                  name="show_eye"
                />
                <span class="radio-text">双眼</span>
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  v-model="planSettings.show_eye"
                  value="2"
                  name="show_eye"
                />
                <span class="radio-text">左眼</span>
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  v-model="planSettings.show_eye"
                  value="3"
                  name="show_eye"
                />
                <span class="radio-text">右眼</span>
              </label>
            </div>
          </div>
          <!-- 集合散开模式 -->
          <div class="form-row radio-row">
            <label class="radio-label">集合散开模式</label>
            <div class="radio-group">
              <label class="radio-item">
                <input
                  type="radio"
                  v-model="planSettings.binocular_model"
                  value="1"
                  name="binocular_model"
                />
                <span class="radio-text">混合模式</span>
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  v-model="planSettings.binocular_model"
                  value="2"
                  name="binocular_model"
                />
                <span class="radio-text">集合优先</span>
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  v-model="planSettings.binocular_model"
                  value="3"
                  name="binocular_model"
                />
                <span class="radio-text">散开优先</span>
              </label>
            </div>
          </div>
          <!-- 总训练时长 -->
          <div class="form-row slider-row">
            <label class="radio-label">总时长</label>
            <div class="slider-container full-width">
              <van-slider
                v-model="totalTrainTime"
                :min="0"
                :max="60"
                :step="1"
                class="custom-slider"
              />
              <p class="slider-value total">{{ totalTrainTime }} 分钟</p>
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
        <div class="cancel-botton" @click="showUpdateAccount = false">取消</div>
        <div class="confirm-botton" @click="handleUpdateAccountConfirm">
          确定
        </div>
      </div>
    </div>
  </BaseDialog>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Toast, VanSlider, VanCheckbox } from "vant";

import { getPlan, setPlan, trainlog } from "@/api/admin";
import BaseDialog from "@/components/BaseDialog";
import { updateAccount } from "@/api/admin";
export default {
  name: "account_info",
  components: {
    BaseDialog,
    VanSlider,
    VanCheckbox,
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
      trainTypeMap: {
        1: "刺激训练",
        2: "变频红光",
        3: "Gabor视觉",
        4: "拥挤",
        5: "精细",
        8: "旁中心",
        9: "脱抑制",
        10: "同时视觉",
        11: "双眼融合",
        12: "立体视觉",
        13: "眼肌",
      },
      planSettings: {
        show_eye: 1,
        binocular_model: 1,
        max_train_time: 0,
        train_plan: [],
      },
      // 训练记录
      trainlog: [],
      showUpdateAccount: false, // 显示修改账号信息
      phoneError: "", // 手机号错误提示
    });

    // 计算属性：总训练时长（秒转分钟，限制0-60）
    const totalTrainTime = computed({
      get() {
        const minutes = Math.floor(state.planSettings.max_train_time / 60);
        return Math.min(Math.max(minutes, 0), 60);
      },
      set(val) {
        state.planSettings.max_train_time = val * 60;
      },
    });

    // 计算属性：排序训练计划（已设置在前，未设置在后）
    const sortedTrainPlans = computed(() => {
      // 1. 已设置的训练计划
      const setPlans = state.planSettings.train_plan.map((item) => ({
        ...item,
        checked: true,
        // 转换秒为分钟
        course_duration: Math.min(
          Math.max(Math.floor(item.course_duration / 60), 0),
          60
        ),
      }));

      // 2. 所有训练类型ID
      const allCourseIds = Object.keys(state.trainTypeMap).map(Number);
      // 已设置的训练类型ID
      const setCourseIds = setPlans.map((item) => item.course_id);
      // 未设置的训练类型ID
      const unsetCourseIds = allCourseIds.filter(
        (id) => !setCourseIds.includes(id)
      );

      // 3. 构建未设置的训练计划
      const unsetPlans = unsetCourseIds.map((course_id, index) => ({
        id: `unset_${index}`,
        course_id,
        course_order: setPlans.length + index + 1,
        course_duration: 0,
        course_games: [],
        status: 0,
        checked: false,
      }));

      // 4. 合并：已设置 + 未设置
      return [...setPlans, ...unsetPlans];
    });

    // 训练时长变化处理（限制0-60）
    const handleDurationChange = (item) => {
      item.course_duration = Math.min(Math.max(item.course_duration, 0), 60);
    };

    onMounted(async () => {
      if (!id) {
        Toast.fail("缺少ID");
        return;
      }
      await init();
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

    // 格式化时间
    const formatTime = (time) => {
      if (!time) return "暂无";
      const date = new Date(time);
      if (isNaN(date.getTime())) return "格式错误";

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");

      return `${year}/${month}/${day} ${hours}:${minutes}`;
    };
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
      init(); // 重置为初始数据
      Toast("已重置方案");
    }

    // 训练方案确认
    async function handlePlanConfirm() {
      try {
        // 转换训练时长为秒
        const submitPlan = sortedTrainPlans.value
          .map((item) => ({
            ...item,
            course_duration: item.course_duration * 60,
          }))
          .filter((item) => item.checked);

        await setPlan({
          id: id,
          ...state.planSettings,
          train_plan: submitPlan,
        });
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
      await updateAccount({ id: id, ...state.accountInfo }); // birthday sex  username
      Toast.success("修改成功");
      state.showUpdateAccount = false;
      init();
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
      totalTrainTime,
      sortedTrainPlans,
      handleDurationChange,
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
      formatTime,
      validatePhone,
    };
  },
};
</script>

<style lang="less" scoped>
// 全局变量
@padding-base: 16px;
@primary-color: #2563eb;
@grey-color: #4e5969;
@light-grey: #f5f7fa;
@border-color: #e5e6eb;
@slider-height: 4px;
@slider-button-size: 16px;
@slider-active-color: @primary-color;

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
.duration-label {
  font-size: 14px;
  color: #333;
  padding-bottom: 10px;
  border-bottom: 1px solid #f0f0f0;
}
// 训练方案区 核心样式优化
.plan-wrap {
  .item-list {
    margin-bottom: 20px;
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 18px 0;
      border-bottom: 1px solid #f0f0f0;

      // 修复布局问题，确保滑块有足够宽度
      .item-left {
        flex: 1;
        padding-right: 10px;

        .train-type-checkbox {
          font-size: 14px;
          display: block;
        }
      }

      .item-right {
        display: flex;
        align-items: center;
        gap: 8px;
        font-size: 14px;
        color: #666;
        flex: 1.5; // 增加右侧宽度占比
        min-width: 200px;
      }

      // 滑块容器样式优化
      .slider-container {
        display: flex;
        align-items: center;
        gap: 8px;
        flex: 1;
        min-width: 150px;
      }

      .slider-value {
        min-width: 30px;
        text-align: center;
        font-size: 12px;
        color: #333;
        font-weight: 500;
      }
    }
  }

  .plan-op-wrap {
    // 单选框行样式
    .radio-row {
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      .radio-label {
        flex: 0 0 100px;
        color: #333;
        font-weight: normal;
      }

      .radio-group {
        display: flex;
        gap: 24px;
        flex: 1;
        align-items: center;

        .radio-item {
          display: flex;
          align-items: center;
          cursor: pointer;
          font-size: 14px;
          position: relative;

          input[type="radio"] {
            margin-right: 6px;
            width: 16px;
            height: 16px;
            accent-color: @primary-color;
            cursor: pointer;
          }

          .radio-text {
            cursor: pointer;
          }
        }
      }
    }

    // 滑块行样式
    .slider-row {
      padding: 12px 0;

      .radio-label {
        flex: 0 0 100px;
        color: #333;
        font-weight: normal;
      }

      .full-width {
        width: 100%;
        flex: 1;
      }
    }
  }
}

// 自定义滑块样式 - 修复圆点过大和无法滑动问题
:deep(.custom-slider) {
  // 滑块轨道样式
  .van-slider__track {
    height: @slider-height;
    border-radius: @slider-height / 2;
    background-color: @slider-active-color;
  }

  // 滑块背景样式
  .van-slider__bar {
    height: @slider-height;
    border-radius: @slider-height / 2;
    background-color: #e5e6eb;
  }

  // 滑块按钮样式（核心：缩小圆点）
  .van-slider__button {
    width: @slider-button-size;
    height: @slider-button-size;
    border-radius: 50%;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    border: 2px solid @slider-active-color;
    // 修复点击区域问题
    &:active {
      transform: scale(1.1);
    }
  }

  // 禁用状态样式
  &.van-slider--disabled {
    .van-slider__track {
      background-color: #c0c4cc;
    }

    .van-slider__button {
      background-color: #f5f5f5;
      border-color: #c0c4cc;
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
