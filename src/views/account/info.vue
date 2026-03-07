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
            <span class="edit-arrow" @click="showUpdate()">></span>
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
            <span>{{
              accountInfo.sex == "1"
                ? "男"
                : accountInfo.sex == "0"
                ? "未知"
                : "女"
            }}</span>
            <span class="edit-arrow" @click="showUpdate()">></span>
          </div>
        </div>
        <div class="form-row">
          <label>年龄</label>
          <div class="value-wrap">
            <span>{{ getAge(accountInfo.birthday) }}</span>
            <span class="edit-arrow" @click="showUpdate()">></span>
          </div>
        </div>
        <div class="form-row">
          <label>当前卡类型</label>
          <div class="value-wrap">
            <span>{{ getCurrentCardType() }}</span>
          </div>
        </div>
        <div class="form-row">
          <label>有效期至</label>
          <div class="value-wrap">
            <span>{{ formatTime(accountInfo.expiredAt) }}</span>
          </div>
        </div>
        <div class="form-row">
          <label>重置密码</label>
          <div class="value-wrap">
            <span></span>
            <span class="edit-arrow" @click="showChangePassword()">></span>
          </div>
        </div>
        <div class="form-row">
          <label>状态</label>
          <div class="value-wrap">
            <span>{{
              accountInfo.status == "2" ? "正常训练" : "暂停训练"
            }}</span>
            <!-- 状态操作按钮 -->
            <button
              class="status-btn"
              :class="accountInfo.status == '2' ? 'disable-btn' : 'restore-btn'"
              @click="handleStatusChange"
            >
              {{ accountInfo.status == "2" ? "暂停训练" : "恢复训练" }}
            </button>
          </div>
        </div>

        <div class="form-row">
          <label>卡操作</label>
          <div class="value-wrap card-actions">
            <button
              class="card-btn upgvip-btn"
              @click="handleCardAction('upgvip')"
            >
              升级
            </button>
            <button
              class="card-btn cancelvip-btn"
              @click="handleCardAction('cancelvip')"
            >
              退卡
            </button>
            <button
              class="card-btn buyvip-btn"
              @click="handleCardAction('buyvip')"
            >
              购买
            </button>
            <button
              class="card-btn freevip-btn"
              @click="handleCardAction('freevip')"
            >
              赠送
            </button>
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
          <!-- 仿可滑动滑块：修复绑定逻辑，确保可滑动 -->
          <div
            class="item"
            v-for="(item, index) in trainPlanList"
            :key="item.id || index"
          >
            <div class="item-left">
              <span>{{ getTrainTypeName(item.course_id) }}</span>
            </div>
            <div class="item-right">
              <div class="slider-wrap">
                <van-slider
                  v-model="item.course_duration"
                  min="0"
                  max="60"
                  step="1"
                  class="train-slider"
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
          <button class="btn secondary" @click="handlePlanCancel">重置</button>
          <button class="btn primary" @click="handlePlanConfirm">确认</button>
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

    <!-- 修改账号弹窗 -->
    <BaseDialog v-model:show="showUpdateAccount" :showConfirmButton="false">
      <div class="dialog-content">
        <!-- 根据修改类型显示不同标题 -->
        <div class="title">
          {{
            Object.keys(changePasswordInfo).length > 0
              ? "重置密码"
              : "修改用户信息"
          }}
        </div>
        <div class="content">
          <!-- 非密码修改时显示完整表单 -->
          <template v-if="Object.keys(updateAccountInfo).length > 0">
            <div class="form-row dialog-form-row">
              <label>姓名</label>
              <input
                type="text"
                v-model="updateAccountInfo.username"
                placeholder="请输入姓名"
                class="form-input"
              />
            </div>
            <div class="form-row dialog-form-row">
              <label>手机号</label>
              <input
                type="tel"
                v-model="updateAccountInfo.account"
                placeholder="请输入手机号"
                class="form-input"
                @blur="validatePhone"
              />
              <span v-if="updateAccountInfo.phoneError" class="error-tip">{{
                updateAccountInfo.phoneError
              }}</span>
            </div>
            <div class="form-row dialog-form-row radio-form-row">
              <label>性别</label>
              <div class="radio-group dialog-radio-group">
                <label class="radio-item dialog-radio-item">
                  <input
                    type="radio"
                    v-model="updateAccountInfo.sex"
                    value="0"
                    name="sex"
                  />
                  <span class="radio-text">未知</span>
                </label>
                <label class="radio-item dialog-radio-item">
                  <input
                    type="radio"
                    v-model="updateAccountInfo.sex"
                    value="1"
                    name="sex"
                  />
                  <span class="radio-text">男</span>
                </label>
                <label class="radio-item dialog-radio-item">
                  <input
                    type="radio"
                    v-model="updateAccountInfo.sex"
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
                v-model="updateAccountInfo.birthday"
                class="form-input"
                placeholder="请选择出生日期"
              />
            </div>
          </template>

          <!-- 仅密码修改时只显示密码表单 -->
          <template v-else-if="Object.keys(changePasswordInfo).length > 0">
            <div class="form-row dialog-form-row password-only-row">
              <label>新密码</label>
              <input
                type="password"
                v-model="changePasswordInfo.newPassword"
                class="form-input"
                placeholder="请输入新密码"
                @blur="validatePassword"
              />
              <span v-if="changePasswordInfo.passwordError" class="error-tip">{{
                changePasswordInfo.passwordError
              }}</span>
            </div>
            <div class="form-row dialog-form-row password-only-row">
              <label>确认密码</label>
              <input
                type="password"
                v-model="changePasswordInfo.confirmPassword"
                class="form-input"
                placeholder="请再次输入新密码"
                @blur="validatePassword"
              />
              <span v-if="changePasswordInfo.passwordError" class="error-tip">{{
                changePasswordInfo.passwordError
              }}</span>
            </div>
          </template>
        </div>
        <div class="botton-wrap">
          <div class="cancel-botton" @click="handleDialogCancel">取消</div>
          <div class="confirm-botton" @click="handleUpdateConfirm">确定</div>
        </div>
      </div>
    </BaseDialog>
  </div>
</template>

<script>
import { reactive, toRefs, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { Toast, Dialog, VanSlider, VanCheckbox } from "vant";

import { getPlan, setPlan, trainlog } from "@/api/admin";

import BaseDialog from "@/components/BaseDialog";
import {
  updateAccount,
  freevip,
  buyvip,
  cancelvip,
  upgvip,
  updateAccountStatus,
  changepassword,
} from "@/api/admin";
import { useStore } from "@/store";
export default {
  name: "account_info",
  components: {
    BaseDialog,
    VanSlider,
    VanCheckbox,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const { id } = route.query;

    // 核心：仿可滑动滑块的状态管理，简化逻辑
    const state = reactive({
      accountInfo: {},
      updateAccountInfo: {}, // 弹窗信息
      changePasswordInfo: {}, // 修改密码弹窗信息

      // 训练方案
      planSettings: {
        member_id: "",
        show_eye: 1, // 遮挡设置
        binocular_model: 1, // 混合散开设置
        max_train_time: 0, // 总时长
      },
      effect_train_plan: [], // 已经生效的训练计划
      trainPlanList: [],
      //===========================

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

      trainlog: [],
      showUpdateAccount: false,
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

    // 手机号验证
    const validatePhone = () => {
      state.updateAccountInfo.phoneError = "";
      if (!state.updateAccountInfo.account) {
        state.updateAccountInfo.phoneError = "手机号不能为空";
        return false;
      }
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!phoneReg.test(state.updateAccountInfo.account)) {
        state.updateAccountInfo.phoneError = "请输入正确的手机号格式";
        return false;
      }
      return true;
    };

    // 密码验证（仅密码修改时）
    const validatePassword = () => {
      state.changePasswordInfo.passwordError = "";
      if (!state.changePasswordInfo.newPassword) {
        state.changePasswordInfo.passwordError = "密码不能为空";
        return false;
      }
      // 密码强度验证（可根据需求调整）
      if (state.changePasswordInfo.newPassword.length < 6) {
        state.changePasswordInfo.passwordError = "密码长度不能少于6位";
        return false;
      }
      if (!state.changePasswordInfo.confirmPassword) {
        state.changePasswordInfo.passwordError = "请确认密码";
        return false;
      }
      if (
        state.changePasswordInfo.confirmPassword !==
        state.changePasswordInfo.newPassword
      ) {
        state.changePasswordInfo.passwordError = "两次输入的密码不一致";
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
    const getAge = (birthday) => {
      if (!birthday) return 0;
      return new Date().getFullYear() - new Date(birthday).getFullYear();
    };

    // 获取卡类型
    const getCurrentCardType = () => {
      const card = state.classifyList.find(
        (c) => c.id === Number(state.accountInfo.typeId)
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
      state.accountInfo = accountInfo || {};

      // 确保出生日期格式正确
      if (
        state.accountInfo.birthday &&
        typeof state.accountInfo.birthday === "string"
      ) {
        let birthday = state.accountInfo.birthday;
        if (birthday.includes("/")) {
          const [year, month, day] = birthday.split("/");
          birthday = `${year}-${month.padStart(2, "0")}-${day.padStart(
            2,
            "0"
          )}`;
        }
        state.accountInfo.birthday = birthday;
      }
      // 确保性别和状态为字符串类型
      if (state.accountInfo.sex === undefined) {
        state.accountInfo.sex = "0";
      }
      if (state.accountInfo.status === undefined) {
        state.accountInfo.status = "2";
      }

      // 获取训练方案
      try {
        const { data } = await getPlan({ id: id });
        if (data?.binocular_model) {
          state.planSettings.binocular_model = data?.binocular_model;
        }
        if (data?.max_train_time) {
          state.planSettings.max_train_time = data?.max_train_time;
        }
        if (data?.member_id) {
          state.planSettings.member_id = data?.member_id;
        }
        if (data?.show_eye) {
          state.planSettings.show_eye = data?.show_eye;
        }
        if (data?.train_plan && data?.train_plan.length > 1) {
          state.effect_train_plan = data?.train_plan;
        }

        // 已经生效的训练计划
        const setPlans = state.effect_train_plan.map((item) => ({
          ...item,
          course_duration: Math.max(Math.floor(item.course_duration / 60), 0),
        }));

        const allCourseIds = state.cats.map((cat) => cat.value);
        const setCourseIds = setPlans.map((item) => item.course_id);
        const unsetCourseIds = allCourseIds.filter(
          (id) => !setCourseIds.includes(id)
        );
        // 没有生效的训练计划
        const unsetPlans = unsetCourseIds.map((course_id, index) => ({
          course_id,
          course_duration: 0,
          course_games: [],
        }));
        state.trainPlanList = [...setPlans, ...unsetPlans];
      } catch (err) {}
    };

    // 训练方案取消
    const handlePlanCancel = () => {
      init();
      Toast("已重置方案");
    };

    // 训练方案确认 - 修复提交逻辑
    const handlePlanConfirm = async () => {
      try {
        // 核心修复：不再重复乘以60（因为滑块已经同步为分钟转秒）
        const submitPlan = state.trainPlanList
          .filter((item) => item.course_duration > 0) // 只提交值大于0的计划
          .map((item) => ({
            course_games: item?.course_games ? item?.course_games : [],
            course_id: Number(item.course_id),
            course_order: item?.course_order ? Number(item.course_order) : 0,
            course_duration: Number(item.course_duration * 60), // 直接使用已转换的秒数
          }));

        await setPlan({
          member_id: Number(id),
          max_train_time: Number(state.planSettings.max_train_time),
          binocular_model: Number(state.planSettings.binocular_model),
          show_eye: Number(state.planSettings.show_eye),
          train_plan: submitPlan,
        });
        Toast.success("方案保存成功");
      } catch (err) {
        Toast.fail(err);
      }
    };

    // 显示修改弹窗
    const showUpdate = () => {
      state.updateAccountInfo = {
        birthday: state.accountInfo.birthday
          ? state.accountInfo.birthday.substring(0, 10)
          : "",
        sex: state.accountInfo.sex,
        account: state.accountInfo.account,
        username: state.accountInfo.username,
        phoneError: "",
      };
      // 显示弹窗
      state.showUpdateAccount = true;
    };

    // 修改密码弹窗
    const showChangePassword = () => {
      // 重置密码相关状态
      state.updateAccountInfo = {};
      state.changePasswordInfo = {
        passwordError: "",
        newPassword: "",
        confirmPassword: "",
      };
      // 显示弹窗
      state.showUpdateAccount = true;
    };

    // 取消弹窗，恢复原有数据
    const handleDialogCancel = () => {
      state.updateAccountInfo = {};
      state.changePasswordInfo = {};
      // 关闭弹窗
      state.showUpdateAccount = false;
    };

    // 确认修改（统一处理）
    const handleUpdateConfirm = async () => {
      try {
        // 仅修改密码的逻辑
        if (Object.keys(state.changePasswordInfo).length > 0) {
          // 验证密码
          if (!validatePassword()) {
            return;
          }
          // 调用修改密码接口
          await changepassword({
            id: Number(id),
            password: state.changePasswordInfo.newPassword,
          });
          Toast.success("密码修改成功");
        }
        // 修改其他信息的逻辑
        else if (Object.keys(state.updateAccountInfo).length > 0) {
          // 验证手机号
          if (!validatePhone()) return;

          // 构建提交数据
          const submitData = {
            id: Number(id),
            username: state.updateAccountInfo.username,
            account: state.updateAccountInfo.account,
            sex: Number(state.updateAccountInfo.sex),
            birthday: state.updateAccountInfo.birthday
              ? `${state.updateAccountInfo.birthday}T00:00:00+08:00`
              : "",
          };

          // 调用更新用户信息接口
          await updateAccount(submitData);
          Toast.success("用户信息修改成功");

          // 更新本地存储
          state.accountInfo = {
            ...state.accountInfo,
            ...submitData,
            birthday: state.updateAccountInfo.birthday, // 存储显示格式
          };
          window.localStorage.setItem(
            "account_info_" + id,
            JSON.stringify(state.accountInfo)
          );
        }
        // 关闭弹窗
        handleDialogCancel();

        // 重新初始化数据
        init();
      } catch (err) {
        console.error("修改失败：", err);
        Toast.fail(err.message || "操作失败");
      }
    };

    // 状态切换（禁用/恢复）
    const handleStatusChange = async () => {
      const isCurrentNormal = state.accountInfo.status === "2";
      const actionText = isCurrentNormal ? "暂停训练" : "恢复训练";

      try {
        // 二次确认
        await Dialog.confirm({
          title: "确认操作",
          message: `您确定要${actionText}吗？`,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
        });

        // 修复：定义newStatus变量
        const newStatus = isCurrentNormal ? "1" : "2";

        const opType = isCurrentNormal ? "pause" : "continue"; // 修复opType逻辑
        await updateAccountStatus({
          id: id,
          opType: opType,
        });

        // 更新本地状态
        state.accountInfo.status = newStatus;
        window.localStorage.setItem(
          "account_info_" + id,
          JSON.stringify(state.accountInfo)
        );

        Toast.success(`${actionText}成功`);
      } catch (err) {
        Toast.fail(err.message || "操作失败");
      }
    };

    // 卡操作处理
    const handleCardAction = async (actionType) => {
      const actionConfig = {
        upgvip: {
          text: "升级",
          confirmText: "升级该用户的卡类型",
          message: "您确定要升级该用户的卡类型吗？",
        },
        cancelvip: {
          text: "退卡",
          confirmText: "为该用户办理退卡",
          message: "您确定要为该用户办理退卡吗？此操作不可逆！",
        },
        buyvip: {
          text: "购买",
          confirmText: "为该用户购买新卡",
          message: "您确定要为该用户购买新卡吗？",
        },
        freevip: {
          text: "赠送",
          confirmText: "为该用户赠送卡",
          message: "您确定要为该用户赠送卡吗？",
        },
      };

      const config = actionConfig[actionType];
      if (!config) return;

      try {
        // 二次确认
        await Dialog.confirm({
          title: "确认操作",
          message: config.message,
          confirmButtonText: "确认",
          cancelButtonText: "取消",
          dangerous: actionType === "cancelvip", // 退卡标记为危险操作
        });

        // 获取用户信息
        const userInfo = computed(() => store.getters.userInfo);
        if (!userInfo.value?.requestId) {
          Toast.fail("用户信息获取失败，请重新登录");
          router.push("/login");
          return;
        }
        const requestId = userInfo.value.requestId;
        console.log(state.accountInfo);

        if (actionType == "upgvip") {
          // 升级
          await upgvip({
            id: Number(id),
            requestId: requestId,
            typeId: 104,
          });
        } else if (actionType == "freevip") {
          // 赠送
          await freevip({
            id: Number(id),
            requestId: requestId,
            typeId: 3,
            account: state.accountInfo.account,
          });
        } else if (actionType == "cancelvip") {
          // 取消
          await cancelvip({
            member_id: Number(id),
            requestId: requestId,
          });
        } else if (actionType == "buyvip") {
          const birthday = getAge(state.accountInfo.birthday);
          // 购买
          await buyvip({
            account: state.accountInfo.account,
            birthday: birthday,
            typeId: 104,
            username: state.accountInfo.username || "ok",
            requestId: requestId,
          });
        }

        Toast.success(`${config.confirmText}成功`);
        // 重新初始化数据
        init();
      } catch (err) {
        console.error("卡操作失败：", err);
        Toast.fail(err.message || "操作失败");
      }
    };

    // 跳转到训练设置
    const gotoTrain = () => {
      router.push({
        path: "/account/trainSettings",
        query: { id: id },
      });
    };

    const getTrainTypeName = (course_id) => {
      const cat = state.cats.find((c) => c.value === course_id);
      return cat ? cat.label : "未知";
    };

    onMounted(() => {
      init();
    });

    return {
      ...toRefs(state),
      totalTrainTime,
      validatePhone,
      formatTime,
      getAge,
      getCurrentCardType,
      handlePlanCancel,
      handlePlanConfirm,
      showUpdate,
      handleUpdateConfirm,
      handleDialogCancel,
      handleStatusChange,
      handleCardAction,
      gotoTrain,
      getTrainTypeName,
      validatePassword,
      showChangePassword,
    };
  },
};
</script>

<!-- 仿可滑动滑块的样式：简洁、无阻塞、高优先级 -->
<style lang="less" scoped>
// 基础变量
@primary: #409eff;
@grey: #606266;
@light-grey: #f5f7fa;
@border: #e6e6e6;
@slider-height: 4px;
@slider-btn-size: 16px;

// 颜色定义
@color-danger: #f56c6c;
@color-success: #67c23a;
@color-warning: #e6a23c;
@color-info: #909399;

// 卡操作按钮颜色
@upgrade-color: #409eff; // 蓝色 - 升级
@refund-color: #f56c6c; // 红色 - 退卡
@buy-color: #67c23a; // 绿色 - 购买
@gift-color: #e6a23c; // 橙色 - 赠送

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
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);

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
    font-size: 14px;
  }

  .value-wrap {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    color: #666;

    .edit-arrow {
      color: #ccc;
      font-size: 16px;
      margin-left: 15px;
      cursor: pointer;
    }

    // 状态按钮样式
    .status-btn {
      padding: 6px 16px;
      border-radius: 4px;
      border: none;
      font-size: 13px;
      cursor: pointer;
      transition: all 0.2s ease;
      font-weight: 500;

      &.disable-btn {
        background: rgba(245, 108, 108, 0.1);
        color: @color-danger;
        border: 1px solid @color-danger;

        &:hover {
          background: rgba(245, 108, 108, 0.2);
        }
      }

      &.restore-btn {
        background: rgba(103, 194, 58, 0.1);
        color: @color-success;
        border: 1px solid @color-success;

        &:hover {
          background: rgba(103, 194, 58, 0.2);
        }
      }
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

// 卡操作按钮容器
.card-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;

  .card-btn {
    padding: 5px 15px;
    border-radius: 6px;
    border: none;
    font-size: 13px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &.upgvip-btn {
      background: @upgrade-color;
      color: #fff;

      &:hover {
        background: darken(@upgrade-color, 10%);
      }
    }

    &.cancelvip-btn {
      background: @refund-color;
      color: #fff;

      &:hover {
        background: darken(@refund-color, 10%);
      }
    }

    &.buyvip-btn {
      background: @buy-color;
      color: #fff;

      &:hover {
        background: darken(@buy-color, 10%);
      }
    }

    &.freevip-btn {
      background: @gift-color;
      color: #fff;

      &:hover {
        background: darken(@gift-color, 10%);
      }
    }
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
      input {
        margin-right: 6px;
        flex-shrink: 0;
        width: 16px;
        height: 16px;
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
        // 核心修复：确保滑块容器可交互
        pointer-events: auto;

        // 仿可滑动滑块：滑块样式（高优先级）
        :deep(.train-slider) {
          flex: 1;
          // 核心：确保滑块可交互，无样式阻塞
          pointer-events: auto !important;
          touch-action: pan-x !important; // 允许水平滑动

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
            z-index: 9999 !important;
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

// 弹窗样式修复
.dialog-content {
  padding: 20px;
  font-size: 14px;
  width: 100%;
  max-width: 450px;
  margin: 0 auto;
  box-sizing: border-box;

  .title {
    font-size: 18px;
    font-weight: 600;
    text-align: center;
    margin-bottom: 24px;
    color: @primary;
    padding-bottom: 12px;
    border-bottom: 1px solid #f0f0f0;
  }

  // 弹窗表单行样式
  .dialog-form-row {
    display: flex;
    align-items: center;
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
      padding-top: 0;
      font-size: 14px;
      color: #333;
    }

    .form-input {
      flex: 1;
      height: 40px;
      padding: 0 12px;
      border-radius: 6px;
      box-sizing: border-box;
      border: 1px solid #dcdfe6;
      font-size: 14px;
      transition: border-color 0.2s;

      &:focus {
        outline: none;
        border-color: @primary;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
    }

    .error-tip {
      position: absolute;
      left: 80px;
      top: 42px;
      margin: 0;
      color: #f56c6c;
      font-size: 12px;
    }

    // 密码提示
    .password-tip {
      position: absolute;
      left: 80px;
      top: 42px;
      font-size: 12px;
      color: #909399;
    }
  }

  // 仅密码修改时的表单行样式
  .password-only-row {
    margin-bottom: 24px;

    .error-tip {
      top: 45px;
    }
  }

  // 弹窗单选行样式
  .radio-form-row {
    align-items: flex-start;
    padding-top: 10px;

    .dialog-radio-group {
      flex: 1;
      display: flex;
      flex-wrap: wrap;
      gap: 15px 20px;
      padding-top: 5px;

      .dialog-radio-item {
        display: flex;
        align-items: center;
        min-width: 60px;
        box-sizing: border-box;
        cursor: pointer;

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
      font-size: 16px;
      font-weight: 500;
      transition: background-color 0.2s;
    }

    .confirm-botton {
      background: @primary;
      color: #fff;

      &:hover {
        background: lighten(@primary, 5%);
      }
    }

    .cancel-botton {
      background: #f5f7fa;
      color: #606266;

      &:hover {
        background: #e5e9f2;
      }
    }
  }
}
</style>

<!-- 仿可滑动滑块：全局样式，确保无阻塞 -->
<style>
// 核心：全局确保滑块按钮可交互
.van-slider__button {
  pointer-events: auto !important;
  z-index: 9999 !important;
}
// 修复移动端触摸滑动
.van-slider {
  touch-action: pan-x !important;
  pointer-events: auto !important;
}
// 确保滑块轨道可点击
.van-slider__wrap {
  pointer-events: auto !important;
}
</style>