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

    <!-- 3. 训练方案区 - 核心仿可滑动滑块重构 -->
    <div class="section plan-section">
      <h3 class="section-title">训练方案</h3>
      <p class="duration-label">时长单位：分</p>
      <div class="plan-wrap">
        <div class="item-list">
          <!-- 仿可滑动滑块：简化DOM结构，提升交互优先级 -->
          <div
            class="item"
            v-for="(item, index) in sortedTrainPlans"
            :key="item.id || index"
          >
            <div class="item-left">
              <van-checkbox
                v-model="item.checked"
                class="train-type-checkbox"
                @change="handleCheckboxChange(item)"
              >
                {{ getTrainTypeName(item.course_id) }}
              </van-checkbox>
            </div>
            <div class="item-right">
              <!-- 仿可滑动滑块：独立容器，无嵌套阻塞 -->
              <div class="slider-wrap">
                <!-- 核心：原生可滑动滑块结构，移除多余属性 -->
                <van-slider
                  v-model="item.course_duration"
                  min="0"
                  max="60"
                  step="1"
                  class="train-slider"
                  :disabled="!item.checked"
                />
                <span class="slider-num">{{ item.course_duration }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="plan-op-wrap">
          <!-- 遮挡设置 -->
          <div class="form-row radio-row">
            <label class="radio-label">遮挡设置</label>
            <div class="radio-group plan-radio-group">
              <label class="radio-item plan-radio-item">
                <input
                  type="radio"
                  v-model="planSettings.show_eye"
                  value="1"
                  name="show_eye"
                />
                <span class="radio-text">双眼</span>
              </label>
              <label class="radio-item plan-radio-item">
                <input
                  type="radio"
                  v-model="planSettings.show_eye"
                  value="2"
                  name="show_eye"
                />
                <span class="radio-text">左眼</span>
              </label>
              <label class="radio-item plan-radio-item">
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
            <div class="radio-group plan-radio-group">
              <label class="radio-item plan-radio-item">
                <input
                  type="radio"
                  v-model="planSettings.binocular_model"
                  value="1"
                  name="binocular_model"
                />
                <span class="radio-text">混合模式</span>
              </label>
              <label class="radio-item plan-radio-item">
                <input
                  type="radio"
                  v-model="planSettings.binocular_model"
                  value="2"
                  name="binocular_model"
                />
                <span class="radio-text">集合优先</span>
              </label>
              <label class="radio-item plan-radio-item">
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

          <!-- 总训练时长 - 仿可滑动滑块实现 -->
          <div class="form-row slider-row">
            <label class="radio-label">总时长</label>
            <div class="slider-wrap full-slider">
              <van-slider
                v-model="totalTrainTime"
                min="0"
                max="60"
                step="1"
                class="train-slider"
              />
              <span class="slider-num">{{ totalTrainTime }} 分钟</span>
            </div>
          </div>
        </div>

        <div class="btn-group">
          <button class="btn secondary" @click="handlePlanCancel">
            取消
          </button>
          <button class="btn primary" @click="handlePlanConfirm">
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

  <!-- 修改账号弹窗 -->
  <BaseDialog v-model:show="showUpdateAccount" :showConfirmButton="false">
    <div class="dialog-content">
      <div class="title">修改账号</div>
      <div class="content">
        <div class="form-row dialog-form-row">
          <label>姓名</label>
          <input
            type="text"
            v-model="accountInfo.username"
            placeholder="请输入姓名"
            class="form-input"
          />
        </div>
        <div class="form-row dialog-form-row">
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
        <div class="form-row dialog-form-row radio-form-row">
          <label>性别</label>
          <div class="radio-group dialog-radio-group">
            <label class="radio-item dialog-radio-item">
              <input
                type="radio"
                v-model="accountInfo.sex"
                value="0"
                name="sex"
              />
              <span class="radio-text">未知</span>
            </label>
            <label class="radio-item dialog-radio-item">
              <input
                type="radio"
                v-model="accountInfo.sex"
                value="1"
                name="sex"
              />
              <span class="radio-text">男</span>
            </label>
            <label class="radio-item dialog-radio-item">
              <input
                type="radio"
                v-model="accountInfo.sex"
                value="2"
                name="sex"
              />
              <span class="radio-text">女</span>
            </label>
          </div>
        </div>
        <div class="form-row dialog-form-row">
          <label>出生日期</label>
          <input
            type="date"
            v-model="accountInfo.birthday"
            class="form-input"
            placeholder="请选择出生日期"
          />
        </div>
        <div class="form-row dialog-form-row">
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

    // 核心：仿可滑动滑块的状态管理，简化逻辑
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

      cats: [
        { label: "刺激训练", value: 1 },
        { label: "变频红光", value: 2 },
        { label: "Gabor视觉", value: 3 },
        { label: "拥挤", value: 5 },
        { label: "精细", value: 6 },
        { label: "脱抑制", value: 7 },
        { label: "旁中心", value: 8 },
        { label: "同时视觉", value: 9 },
        { label: "双眼融合", value: 10 },
        { label: "立体视觉", value: 11 },
        { label: "晶体调节", value: 12 },
        { label: "眼肌", value: 13 },
      ],
      planSettings: {
        show_eye: 1,
        binocular_model: 1,
        max_train_time: 0,
        train_plan: [],
      },
      trainlog: [],
      showUpdateAccount: false,
      phoneError: "",
    });

    // 总训练时长计算 - 仿可滑动滑块的简洁实现
    const totalTrainTime = computed({
      get() {
        return Math.min(
          Math.max(Math.floor(state.planSettings.max_train_time / 60), 0),
          60
        );
      },
      set(val) {
        state.planSettings.max_train_time = val * 60;
      },
    });

    // 训练计划排序 - 保持原有逻辑
    const sortedTrainPlans = computed(() => {
      const setPlans = state.planSettings.train_plan.map((item) => ({
        ...item,
        checked: true,
        course_duration: Math.min(
          Math.max(Math.floor(item.course_duration / 60), 0),
          60
        ),
      }));

      const allCourseIds = state.cats.map((cat) => cat.value);
      const setCourseIds = setPlans.map((item) => item.course_id);
      const unsetCourseIds = allCourseIds.filter(
        (id) => !setCourseIds.includes(id)
      );

      const unsetPlans = unsetCourseIds.map((course_id, index) => ({
        id: `unset_${index}`,
        course_id,
        course_order: setPlans.length + index + 1,
        course_duration: 0,
        course_games: [],
        status: 0,
        checked: false,
      }));

      return [...setPlans, ...unsetPlans];
    });

    // 仿可滑动滑块：复选框变更处理
    const handleCheckboxChange = (item) => {
      // 勾选时默认给1分钟，避免0值无感知
      if (item.checked && item.course_duration === 0) {
        item.course_duration = 1;
      }
    };

    // 手机号验证
    const validatePhone = () => {
      state.phoneError = "";
      const { account } = state.accountInfo;
      if (!account) {
        state.phoneError = "手机号不能为空";
        return false;
      }
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
      return (
        new Date().getFullYear() -
        new Date(state.accountInfo.birthday).getFullYear()
      );
    };

    // 获取卡类型
    const getCurrentCardType = () => {
      const card = state.classifyList.find(
        (c) => c.id === state.accountInfo.typeId
      );
      return card ? card.name : "未知";
    };

    // 初始化
    const init = async () => {
      if (!id) {
        Toast.fail("缺少ID");
        return;
      }
      // 获取用户信息
      const accountInfo = JSON.parse(
        window.localStorage.getItem("account_info_" + id)
      );
      state.accountInfo = accountInfo;
      // 获取训练方案
      const { data } = await getPlan({ id: 10254 });
      state.planSettings = data;
    };

    // 训练方案取消
    const handlePlanCancel = () => {
      init();
      Toast("已重置方案");
    };

    // 训练方案确认
    const handlePlanConfirm = async () => {
      try {
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
    };

    // 显示修改弹窗
    const showUpdate = () => {
      state.showUpdateAccount = true;
    };

    // 确认修改账号
    const handleUpdateAccountConfirm = async () => {
      if (!validatePhone()) return;
      await updateAccount({ id: id, ...state.accountInfo });
      Toast.success("修改成功");
      state.showUpdateAccount = false;
      init();
    };

    // 跳转到训练设置
    const gotoTrain = () => {
      router.push({
        path: "/account/trainSettings",
        query: { id: id },
      });
    };

    onMounted(() => {
      init();
    });
    const getTrainTypeName = (course_id) => {
      const cat = state.cats.find((c) => c.value === course_id);
      return cat ? cat.label : "未知";
    };
    return {
      ...toRefs(state),
      totalTrainTime,
      sortedTrainPlans,
      handleCheckboxChange,
      validatePhone,
      formatTime,
      getAge,
      getCurrentCardType,
      handlePlanCancel,
      handlePlanConfirm,
      showUpdate,
      handleUpdateAccountConfirm,
      gotoTrain,
      getTrainTypeName,
    };
  },
};
</script>

<!-- 仿可滑动滑块的样式：简洁、无阻塞、高优先级 -->
<style lang="less" scoped>
// 基础变量
@primary: #2563eb;
@grey: #4e5969;
@light-grey: #f5f7fa;
@border: #e5e6eb;
@slider-height: 4px;
@slider-btn-size: 16px;

// 头部样式
.head-warper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 40px;
  padding: 0 10px;
  margin-bottom: 16px;

  .left {
    cursor: pointer;
    img {
      height: 20px;
    }
  }

  .botton {
    height: 35px;
    line-height: 35px;
    padding: 0 10px;
    background: @primary;
    color: #fff;
    border-radius: 10px;
    font-size: 14px;
    cursor: pointer;
  }
}

// 通用区块样式
.account_info-wrap {
  max-width: 900px;
  margin: 0 auto;
  padding: 16px;
  background: @light-grey;
  min-height: 100vh;
}

.section {
  background: #fff;
  border-radius: 8px;
  margin-bottom: 16px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);

  .section-title {
    font-size: 16px;
    font-weight: 600;
    color: #333;
    margin-bottom: 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
  }
}

// 表单行样式
.form-row {
  display: flex;
  align-items: center;
  padding: 15px 16px;
  background: #fff;
  border-bottom: 1px solid #f0f0f0;

  label {
    flex: 0 0 100px;
    color: #333;
  }

  .value-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .edit-arrow {
      color: #ccc;
      font-size: 16px;
      margin-left: 15px;
      cursor: pointer;
    }
  }

  .form-input {
    flex: 1;
    height: 32px;
    padding: 0 10px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    font-size: 14px;
  }

  .error-tip {
    position: absolute;
    right: 16px;
    color: #f56c6c;
    font-size: 12px;
  }
}

// 训练方案单选框样式（支持换行）
.radio-row {
  align-items: flex-start;
  padding: 12px 16px;

  .radio-label {
    flex: 0 0 100px;
    padding-top: 4px;
    text-align: right;
    margin-right: 10px;
  }

  .plan-radio-group {
    flex: 1;
    display: flex;
    flex-wrap: wrap; // 允许换行
    gap: 10px 20px; // 行列间距
    padding-top: 2px;

    .plan-radio-item {
      display: flex;
      align-items: center;
      min-width: 70px; // 最小宽度
      box-sizing: border-box;

      input {
        margin-right: 6px;
        flex-shrink: 0;
        width: 16px;
        height: 16px;
        accent-color: @primary;
      }

      .radio-text {
        flex-shrink: 0;
        font-size: 14px;
      }
    }
  }
}

// 训练方案核心样式（仿可滑动滑块）
.plan-wrap {
  .duration-label {
    font-size: 14px;
    color: #333;
    padding-bottom: 10px;
    border-bottom: 1px solid #f0f0f0;
    margin-bottom: 16px;
  }

  .item-list {
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 12px 0;
      border-bottom: 1px solid #f0f0f0;

      // 仿可滑动滑块：左右布局合理分配宽度
      .item-left {
        flex: 1;
        padding-right: 10px;

        .train-type-checkbox {
          font-size: 14px;
        }
      }

      .item-right {
        flex: 2;
      }

      // 仿可滑动滑块：核心容器样式，无嵌套阻塞
      .slider-wrap {
        display: flex;
        align-items: center;
        gap: 8px;
        width: 100%;

        // 仿可滑动滑块：滑块样式（高优先级）
        :deep(.train-slider) {
          flex: 1;
          // 核心：确保滑块可交互，无样式阻塞
          pointer-events: auto !important;

          .van-slider__wrap {
            height: @slider-height;
          }

          .van-slider__track {
            background: @primary;
            height: @slider-height;
            border-radius: @slider-height / 2;
          }

          .van-slider__bar {
            background: @border;
            height: @slider-height;
            border-radius: @slider-height / 2;
          }

          // 仿可滑动滑块：按钮样式（可点击）
          .van-slider__button {
            width: @slider-btn-size;
            height: @slider-btn-size;
            margin-top: -(@slider-btn-size - @slider-height)/2;
            background: #fff;
            border: 2px solid @primary;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            // 核心：提升层级，确保可点击
            z-index: 10 !important;
            pointer-events: auto !important;
          }

          // 禁用状态
          &.van-slider--disabled {
            .van-slider__track {
              background: #c0c4cc;
            }
            .van-slider__button {
              border-color: #c0c4cc;
              background: #f5f5f5;
            }
          }
        }

        .slider-num {
          min-width: 30px;
          text-align: center;
          font-size: 12px;
          color: #333;
          font-weight: 500;
        }
      }
    }
  }

  // 总时长滑块
  .full-slider {
    width: 100%;
    flex: 1;
  }

  // 按钮组
  .btn-group {
    display: flex;
    gap: 12px;
    margin-top: 20px;
    justify-content: flex-end;

    .btn {
      padding: 8px 16px;
      border-radius: 4px;
      font-size: 14px;
      border: none;
      cursor: pointer;

      &.primary {
        background: #409eff;
        color: #fff;
      }

      &.secondary {
        background: #909399;
        color: #fff;
      }
    }
  }
}

// 档案列表
.archive-wrap {
  .archive-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px;
    border-bottom: 1px solid #f0f0f0;
    cursor: pointer;

    &:hover {
      background: @light-grey;
    }

    .arrow {
      color: #909399;
    }
  }

  .empty-tip {
    text-align: center;
    color: #909399;
    padding: 20px 0;
  }
}

// 弹窗样式
.dialog-content {
  padding: 20px 15px;
  font-size: 14px;
  width: 100%;
  box-sizing: border-box;

  .title {
    font-size: 18px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 24px;
  }

  // 弹窗表单行样式
  .dialog-form-row {
    display: flex;
    align-items: flex-start;
    padding: 0;
    background: transparent;
    border-bottom: none;
    margin-bottom: 18px;
    position: relative;

    label {
      flex: 0 0 70px;
      width: 70px;
      margin-right: 10px;
      text-align: right;
      padding-top: 8px;
    }

    .form-input {
      flex: 1;
      height: 40px;
      padding: 0 12px;
      border-radius: 6px;
      box-sizing: border-box;
    }

    .error-tip {
      position: static;
      display: block;
      margin-left: 80px;
      margin-top: 5px;
      width: 100%;
    }
  }

  // 弹窗单选行样式
  .radio-form-row {
    align-items: flex-start;

    .dialog-radio-group {
      flex: 1;
      display: flex;
      flex-wrap: wrap; // 允许换行
      gap: 15px 20px; // 行列间距
      padding-top: 5px;

      .dialog-radio-item {
        display: flex;
        align-items: center;
        min-width: 60px; // 最小宽度
        box-sizing: border-box;

        input {
          margin-right: 6px;
          flex-shrink: 0;
        }

        .radio-text {
          flex-shrink: 0;
        }
      }
    }
  }

  .botton-wrap {
    display: flex;
    gap: 12px;
    margin-top: 32px;

    .cancel-botton,
    .confirm-botton {
      flex: 1;
      height: 44px;
      line-height: 44px;
      text-align: center;
      border-radius: 8px;
      cursor: pointer;
    }

    .confirm-botton {
      background: @primary;
      color: #fff;
    }

    .cancel-botton {
      background: #dde9fc;
      color: @grey;
    }
  }
}
</style>

<!-- 仿可滑动滑块：全局样式，确保无阻塞 -->
<style>
// 核心：全局确保滑块按钮可交互
.van-slider__button {
  pointer-events: auto !important;
  z-index: 10 !important;
}
// 修复移动端触摸滑动
.van-slider {
  touch-action: pan-x !important;
}
</style>